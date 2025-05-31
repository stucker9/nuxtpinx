import { authCheck } from "@/utils/auth"

export default defineNuxtRouteMiddleware(to => {
	try {
		const redirect = authCheck(to)

		if (redirect) {
			return navigateTo(redirect)
		}
		// eslint-disable-next-line unused-imports/no-unused-vars
	} catch (err) {}
})
