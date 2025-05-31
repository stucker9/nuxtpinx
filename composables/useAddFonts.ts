import jetbrainsMono400woff from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"
import jetbrainsMono400woff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2"
import lexend400woff from "@fontsource/lexend/files/lexend-latin-400-normal.woff"

import lexend400woff2 from "@fontsource/lexend/files/lexend-latin-400-normal.woff2"
import publicSans400woff from "@fontsource/public-sans/files/public-sans-latin-400-normal.woff"
import publicSans400woff2 from "@fontsource/public-sans/files/public-sans-latin-400-normal.woff2"
import "@fontsource/lexend/latin.css"
import "@fontsource/public-sans/latin.css"
import "@fontsource/jetbrains-mono/latin.css"

export function useAddFonts() {
	useHead({
		link: [
			{ rel: "preload", as: "font", type: "font/woff", href: lexend400woff, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff2", href: lexend400woff2, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff", href: publicSans400woff, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff2", href: publicSans400woff2, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff", href: jetbrainsMono400woff, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff2", href: jetbrainsMono400woff2, crossorigin: "anonymous" }
		]
	})
}
