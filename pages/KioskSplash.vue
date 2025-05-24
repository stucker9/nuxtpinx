<template>
	<div class="page">
		<div class="flex flex-col items-center justify-center h-screen">
			<div class="flex flex-col items-center justify-center">
				<div class="text-5xl font-bold">
					Welcome to the Kiosk
				</div>
				<div class="text-sm text-gray-500">
					Redirecting to kiosk interface...
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
	setTimeout(() => {
		router.push('/kiosk/dashboard')
	}, 2000)
})

definePageMeta({
	name: "KioskSplash",
	title: "Kiosk Splash",
	auth: true,
	roles: "all"
})
</script>
