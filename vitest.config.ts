import { fileURLToPath } from "node:url"
import { defineVitestConfig } from "@nuxt/test-utils/config"

export default defineVitestConfig({
	test: {
		environment: "jsdom", // use "nuxt" to enable the Nuxt environment for all tests.
		root: fileURLToPath(new URL("./", import.meta.url)),
		environmentOptions: {
			nuxt: {
				domEnvironment: "jsdom"
			}
		}
	}
})
