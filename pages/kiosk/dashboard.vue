<template>
	<div class="flex h-screen">
		<!-- Staff Dashboard Section (with layout) -->
		<div class="w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-gray-800">
			<h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Staff Dashboard</h1>
			
			<!-- Monitor Selection -->
			<div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<h2 class="font-semibold mb-2 text-gray-900 dark:text-white">Monitor Control</h2>
				<div class="text-sm text-gray-600 dark:text-gray-300 mb-2">
					{{ displays.length }} display(s) detected
				</div>
				<select 
					v-model="selectedDisplay" 
					class="w-full p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
					:disabled="isMirroring"
				>
					<option v-for="display in displays" :key="display.id" :value="display">
						{{ display.name }} {{ display.isPrimary ? '(Primary)' : '' }}
					</option>
				</select>
				<button 
					@click="toggleMirroring"
					class="mt-2 w-full p-2 rounded text-white"
					:class="isMirroring ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'"
				>
					{{ isMirroring ? 'Stop Mirroring' : 'Start Mirroring' }}
				</button>
				<div v-if="error" class="mt-2 text-sm text-red-500">
					{{ error }}
				</div>
			</div>

			<!-- Recent Visitors Table -->
			<div class="mb-6">
				<h2 class="font-semibold mb-2 text-gray-900 dark:text-white">Recent Visitors</h2>
				<div class="overflow-x-auto">
					<table class="min-w-full bg-white dark:bg-gray-800">
						<thead>
							<tr class="bg-gray-50 dark:bg-gray-700">
								<th class="px-4 py-2 text-left text-gray-900 dark:text-white">Name</th>
								<th class="px-4 py-2 text-left text-gray-900 dark:text-white">Phone</th>
								<th class="px-4 py-2 text-left text-gray-900 dark:text-white">Last Visit</th>
								<th class="px-4 py-2 text-left text-gray-900 dark:text-white">Last Pantry</th>
								<th class="px-4 py-2 text-left text-gray-900 dark:text-white">Total</th>
								<th class="px-4 py-2 text-left text-gray-900 dark:text-white">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="visitor in sortedVisitors" :key="visitor.id" class="border-t border-gray-200 dark:border-gray-700">
								<td class="px-4 py-2 text-gray-900 dark:text-white">{{ visitor.name }}</td>
								<td class="px-4 py-2 text-gray-900 dark:text-white">{{ visitor.phoneNumber }}</td>
								<td class="px-4 py-2 text-gray-900 dark:text-white">{{ formatDate(visitor.lastVisit) }}</td>
								<td class="px-4 py-2 text-gray-900 dark:text-white">{{ visitor.lastPantryVisit ? formatDate(visitor.lastPantryVisit) : 'N/A' }}</td>
								<td class="px-4 py-2 text-gray-900 dark:text-white">{{ visitor.totalVisits }}</td>
								<td class="px-4 py-2">
									<button 
										@click="editVisitor(visitor)"
										class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
									>
										Edit
									</button>
									<button 
										@click="deleteVisitor(visitor.id)"
										class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
									>
										Delete
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Kiosk Interface Section (layout-free) -->
		<div class="w-2/3 bg-white dark:bg-gray-900">
			<!-- Show mirrored content when mirroring is active -->
			<div v-if="isMirroring" class="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
				<div v-if="mediaStream" class="h-full w-full">
					<video 
						ref="mirrorVideo" 
						autoplay 
						playsinline 
						muted
						class="h-full w-full object-contain"
						@loadedmetadata="onVideoLoaded"
						@error="onVideoError"
					></video>
				</div>
				<div v-else class="text-center">
					<div class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
						Mirroring to {{ selectedDisplay?.name }}
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">
						Display ID: {{ selectedDisplay?.id }}
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">
						Resolution: {{ selectedDisplay?.width }}x{{ selectedDisplay?.height }}
					</div>
					<div v-if="error" class="mt-2 text-sm text-red-500">
						{{ error }}
					</div>
					<div v-else class="mt-2 text-sm text-gray-600 dark:text-gray-400">
						Awaiting screen capture permission...
					</div>
				</div>
			</div>
			<!-- Show kiosk interface when not mirroring -->
			<NuxtPage v-else />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useVisitorsStore } from '@/stores/visitors'
import { useMonitorMirror } from '@/composables/useMonitorMirror'
import { storeToRefs } from 'pinia'
import { onMounted, ref, watch, nextTick } from 'vue'

const visitorsStore = useVisitorsStore()
const { sortedVisitors } = storeToRefs(visitorsStore)
const { 
	displays, 
	selectedDisplay, 
	isMirroring, 
	error,
	mediaStream,
	startMirroring, 
	stopMirroring,
	detectDisplays
} = useMonitorMirror()

const mirrorVideo = ref<HTMLVideoElement | null>(null)

// Watch for changes in mediaStream and set the video source
watch(mediaStream, async (stream) => {
	if (mirrorVideo.value && stream) {
		console.warn('Setting video stream:', stream)
		mirrorVideo.value.srcObject = stream
		// Wait for the next tick to ensure the video element is ready
		await nextTick()
		// Attempt to play the video, required in some browsers
		try {
			await mirrorVideo.value.play()
			console.warn('Video playback started successfully')
		} catch (e) {
			console.error('Error playing video:', e)
			error.value = `Error playing video: ${e.message}`
		}
	} else if (mirrorVideo.value) {
		mirrorVideo.value.srcObject = null
	}
})

// Handle video loaded event
async function onVideoLoaded() {
	console.warn('Video loaded successfully')
	if (mirrorVideo.value) {
		try {
			await mirrorVideo.value.play()
			console.warn('Video playback started after load')
		} catch (e) {
			console.error('Error playing video after load:', e)
			error.value = `Error playing video: ${e.message}`
		}
	}
}

// Handle video error
function onVideoError(e: Event) {
	console.error('Video error:', e)
	error.value = 'Error with video playback'
	stopMirroring()
}

// Format date for display
function formatDate(date: Date) {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date)
}

// Toggle mirroring
async function toggleMirroring() {
	if (isMirroring.value) {
		stopMirroring()
	} else {
		// Reset any previous errors
		error.value = null
		await startMirroring()
	}
}

// Visitor actions
function editVisitor(visitor: any) {
	// TODO: Implement edit functionality
	console.warn('Edit visitor:', visitor)
}

async function deleteVisitor(id: string) {
	if (window.confirm('Are you sure you want to delete this visitor?')) {
		await visitorsStore.deleteVisitor(id)
	}
}

// Fetch visitors and detect displays on component mount
onMounted(() => {
	visitorsStore.fetchVisitors()
	detectDisplays()
})

definePageMeta({
	name: "KioskDashboard",
	title: "Kiosk Dashboard",
	auth: true,
	roles: "all"
})
</script> 