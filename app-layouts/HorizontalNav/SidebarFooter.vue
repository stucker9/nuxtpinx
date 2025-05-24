<template>
	<div class="bg-body rounded-lg py-0.5" :class="{ collapsed }">
		<n-menu :options="menuOptions" :collapsed :collapsed-width :indent="18" />
	</div>
</template>

<script lang="ts" setup>
import { NMenu } from "naive-ui"
import { computed, h, ref } from "vue"
import { useThemeStore } from "@/stores/theme"

const { collapsed = false } = defineProps<{
	collapsed?: boolean
}>()

const themeStore = useThemeStore()
const collapsedWidth = computed<number>(() => themeStore.sidebar.closeWidth - 16)
</script>
