// The page transition could create issues in Nuxt projects with current versions.
// There are methods to avoid these problems, and Pinx provides 2 of them.
// By default, Method A is used.

// You can find Method A in the file /plugins/router-transition.client.ts

// Method B: involves halting navigation until the page transition is considered complete.

export default defineNuxtRouteMiddleware(() => {})

/*
// Useful to prevent navigation overlapping during page transition

import { useThemeStore } from "@/stores/theme"

export default defineNuxtRouteMiddleware(() => {
	const themeStore = useThemeStore()
	const routeTime = useLastRouteTime()
	const duration = 1000 * themeStore.routerTransitionDuration
	const gap = 500

	if (new Date().getTime() - routeTime.value < duration + gap) return false

	routeTime.value = new Date().getTime()
})
*/
