<template>
	<div>
		<div class="flex items-center gap-3">
			<span>Logout</span>
			<span>
				<Icon :name="LoadingIcon" :size="16" />
			</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import Icon from "@/components/common/Icon.vue"
import { useAuthStore } from "@/stores/auth"

definePageMeta({
	name: "Logout",
	alias: "/logout",
	title: "Logout",
	skipPin: true
})

const LoadingIcon = "eos-icons:loading"

const authStore = useAuthStore()

onBeforeMount(() => {
	authStore.setLogout()
	window.location.href = `/login${window.location.search}`
})
</script>
