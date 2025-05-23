import type { NuxtPage } from "nuxt/schema"
import process from "node:process"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { pagesGenerateExclude } from "./pages-exclude"
import { pagesExtend } from "./pages-extend"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	modules: [
		"@pinia/nuxt",
		"pinia-plugin-persistedstate/nuxt",
		"@nuxtjs/i18n",
		"@nuxtjs/device",
		"nuxt-svgo",
		"@nuxt/test-utils/module",
		"nuxtjs-naive-ui",
		"@nuxt/eslint"
	],
	app: {
		rootId: "app"
	},
	css: ["~/tailwind.css"],
	eslint: {
		config: {
			standalone: false
		}
	},
	components: [
		{
			path: "~/components/common",
			pathPrefix: false
		}
	],
	svgo: {
		defaultImport: "component"
	},
	piniaPluginPersistedstate: {
		key: "__persisted__%id"
	},
	build: {
		transpile: process.env.NODE_ENV === "production" ? ["date-fns", "vueuc", "naive-ui"] : ["vueuc", "naive-ui"]
	},
	vite: {
		vue: {
			script: {
				defineModel: true
			}
		},
		resolve: {
			alias: {
				"node:process": "process/browser",
				"@juggle/resize-observer": fileURLToPath(new URL("./patches/@juggle/resize-observer", import.meta.url))
			}
		},
		optimizeDeps: {
			include: ["fast-deep-equal"]
		},
		css: {
			preprocessorOptions: {
				scss: {
					silenceDeprecations: ["legacy-js-api", "import"],
					api: "modern-compiler"
				}
			}
		},
		esbuild: {
			logOverride: {
				"css-syntax-error": "silent",
				"@tailwindcss/vite:generate:build": "silent"
			}
		},
		build: {
			sourcemap: false
		},
		plugins: [tailwindcss()]
	},
	hooks: {
		"pages:extend": (pages: NuxtPage[]) => pagesExtend(pages)
	},
	nitro: {
		prerender: {
			ignore: pagesGenerateExclude,
			routes: ["/"]
		}
	},
	compatibilityDate: "2025-02-15"
})
