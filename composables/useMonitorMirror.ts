import { onMounted, onUnmounted, ref } from 'vue'

interface Display {
	id: string
	name: string
	isPrimary: boolean
	width: number
	height: number
}

export function useMonitorMirror() {
	const displays = ref<Display[]>([])
	const selectedDisplay = ref<Display | null>(null)
	const isMirroring = ref(false)
	const error = ref<string | null>(null)
	const mediaStream = ref<MediaStream | null>(null)

	const stopMirroring = () => {
		if (mediaStream.value) {
			mediaStream.value.getTracks().forEach(track => {
				track.stop()
				track.onended = null
				track.removeEventListener('error', () => {})
			})
			mediaStream.value = null
		}
		isMirroring.value = false
		error.value = null
	}

	const detectDisplays = async () => {
		try {
			error.value = null
			const detectedDisplays: Display[] = []

			// Try modern API first
			if ('getScreenDetails' in window) {
				try {
					const screenDetails = await (window as any).getScreenDetails()
					if (screenDetails?.screens) {
						detectedDisplays.push(...screenDetails.screens.map((screen: any) => ({
							id: screen.id,
							name: `Display ${screen.id}`,
							isPrimary: screen.isPrimary,
							width: screen.width,
							height: screen.height
						})))
					}
				} catch (e) {
					console.warn('Modern screen API failed:', e)
				}
			}

			// If no displays detected, use window.screen
			if (detectedDisplays.length === 0) {
				const mainScreen = {
					id: 'main',
					name: 'Main Display',
					isPrimary: true,
					width: window.screen.width,
					height: window.screen.height
				}
				detectedDisplays.push(mainScreen)

				// Check for multiple displays
				const hasMultipleDisplays = window.screen.width > window.innerWidth || window.screen.height > window.innerHeight

				if (hasMultipleDisplays) {
					const secondaryScreen = {
						id: 'secondary',
						name: 'Secondary Display',
						isPrimary: false,
						width: window.screen.width,
						height: window.screen.height
					}
					detectedDisplays.push(secondaryScreen)
				}
			}

			displays.value = detectedDisplays

			// Set default display
			const nonPrimaryDisplay = detectedDisplays.find(d => !d.isPrimary)
			selectedDisplay.value = nonPrimaryDisplay || detectedDisplays[0]

			console.warn('Detected displays:', detectedDisplays)
		} catch (e) {
			error.value = 'Failed to detect displays'
			console.error('Display detection error:', e)
			// Fallback to single display
			displays.value = [{
				id: 'fallback',
				name: 'Display',
				isPrimary: true,
				width: window.screen.width,
				height: window.screen.height
			}]
			selectedDisplay.value = displays.value[0]
		}
	}

	const startMirroring = async () => {
		if (!selectedDisplay.value) {
			error.value = 'No display selected'
			return
		}

		try {
			error.value = null
			console.warn('Starting mirroring for display:', selectedDisplay.value)

			// Request permission to capture display
			const stream = await navigator.mediaDevices.getDisplayMedia({
				video: {
					width: { ideal: selectedDisplay.value.width },
					height: { ideal: selectedDisplay.value.height },
					frameRate: { ideal: 30 }
				},
				audio: false
			})

			console.warn('Got media stream:', stream)
			
			// Check if we got a video track
			const videoTrack = stream.getVideoTracks()[0]
			if (!videoTrack) {
				throw new Error('No video track in stream')
			}

			// Set up stream end handler
			videoTrack.onended = () => {
				console.warn('Video track ended')
				stopMirroring()
			}

			// Set up error handler using the track's error event
			videoTrack.addEventListener('error', (event: Event) => {
				console.error('Video track error:', event)
				error.value = 'Video track error occurred'
				stopMirroring()
			})

			// Stop any existing stream
			if (mediaStream.value) {
				mediaStream.value.getTracks().forEach(track => track.stop())
			}

			mediaStream.value = stream
			isMirroring.value = true

		} catch (e: any) {
			console.error('Error in startMirroring:', e)
			if (e.name === 'NotAllowedError') {
				error.value = 'Permission to capture display denied. Please allow screen sharing when prompted.'
			} else if (e.name === 'NotFoundError') {
				error.value = 'No display found to capture.'
			} else if (e.name === 'NotReadableError') {
				error.value = 'Could not read from the selected display.'
			} else {
				error.value = `Error starting mirroring: ${e.message}`
			}
			isMirroring.value = false
			mediaStream.value = null
		}
	}

	onMounted(() => {
		detectDisplays()
	})

	onUnmounted(() => {
		stopMirroring()
	})

	return {
		displays,
		selectedDisplay,
		isMirroring,
		error,
		mediaStream,
		detectDisplays,
		startMirroring,
		stopMirroring
	}
} 