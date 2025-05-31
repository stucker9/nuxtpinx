import type { RouteLocationNormalized } from "vue-router"
import type { RouteMetaAuth } from "@/types/auth.d"
import { useAuthStore } from "@/stores/auth"

export function authCheck(route: RouteLocationNormalized): string | null {
	try {
		const { checkAuth, authRedirect, auth, roles }: RouteMetaAuth = route.meta
		const authStore = useAuthStore()

		if (auth && (!authStore.isLogged || (roles && !authStore.isRoleGranted(roles)))) {
			return "/login"
		}

		if (checkAuth && authStore.isLogged && (!roles || authStore.isRoleGranted(roles))) {
			return authRedirect || "/"
		}

		return null
		// eslint-disable-next-line unused-imports/no-unused-vars
	} catch (err) {
		return null
	}
}
