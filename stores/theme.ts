import type { GlobalThemeOverrides, ThemeCommonVars } from "naive-ui"
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface"
import { useWindowSize } from "@vueuse/core"
import _get from "lodash/get"
import _set from "lodash/set"
import { darkTheme, lightTheme } from "naive-ui"
import { acceptHMRUpdate, defineStore } from "pinia"
import { watch } from "vue"
import type { FontFamilyType, Layout, RouterTransition } from "@/types/theme.d"
import { FontFamilyType as FontFamilyTypeEnum, ThemeNameEnum } from "@/types/theme.d"
import { getCssVars, getDefaultState, getThemeOverrides } from "@/theme"

type DefaultState = ReturnType<typeof getDefaultState>
type ThemeState = DefaultState & {
	selectedFontFamilyType: FontFamilyType
	userDefaults: Omit<DefaultState, 'userDefaults'> | null
}

export const useThemeStore = defineStore("theme", {
	state: (): ThemeState => ({
		...getDefaultState(),
		selectedFontFamilyType: FontFamilyTypeEnum.Default,
		userDefaults: null
	}),
	actions: {
		reset() {
			console.log('Resetting theme state...')
			console.log('Current userDefaults:', this.userDefaults)
			
			// If user defaults exist, restore them, otherwise use system defaults
			if (this.userDefaults) {
				console.log('Restoring user defaults')
				// Create a new object without userDefaults to avoid circular reference
				const stateToRestore = { ...this.userDefaults }
				
				// Ensure all settings are properly restored
				if (stateToRestore.colors) {
					this.colors = {
						dark: { ...stateToRestore.colors.dark },
						light: { ...stateToRestore.colors.light }
					}
				}
				if (stateToRestore.boxed) {
					this.boxed = {
						enabled: stateToRestore.boxed.enabled,
						toolbar: stateToRestore.boxed.toolbar,
						width: stateToRestore.boxed.width
					}
				}
				if (stateToRestore.footer) {
					this.footer = {
						show: stateToRestore.footer.show
					}
				}
				
				// Use $patch to ensure reactivity
				this.$patch((state) => {
					Object.assign(state, stateToRestore)
				})
			} else {
				console.log('Restoring system defaults')
				// Reset to system defaults
				const defaultState = getDefaultState()
				this.$patch((state) => {
					Object.assign(state, defaultState)
				})
			}

			// Apply font family consistently after state update
			if (document) {
				const html = document.children[0] as HTMLElement
				const selectedFont = this.fontFamily[this.selectedFontFamilyType]
				
				// Set CSS variables for all font families
				document.documentElement.style.setProperty("--font-family-default", this.fontFamily.default)
				document.documentElement.style.setProperty("--font-family-display", this.fontFamily.display)
				document.documentElement.style.setProperty("--font-family-mono", this.fontFamily.mono)
				document.documentElement.style.setProperty("--font-family-serif", this.fontFamily.serif)
				
				// Set the current font family
				document.documentElement.style.setProperty("--font-family", selectedFont)
				
				// Apply to html element
				html.style.fontFamily = selectedFont
				
				// Apply to body element
				document.body.style.fontFamily = selectedFont
				
				// Apply to all elements that might have inherited font-family
				const allElements = document.getElementsByTagName('*')
				for (let i = 0; i < allElements.length; i++) {
					const element = allElements[i] as HTMLElement
					// Only apply to elements that don't have a specific font-family set
					if (!element.style.fontFamily) {
						element.style.fontFamily = selectedFont
					}
				}
				
				// Force a reflow to ensure styles are applied
				void document.body.offsetHeight
				
				// Update CSS variables
				this.setCssGlobalVars()
			}
			
			console.log('State after reset:', this.$state)
		},
		saveDefaults() {
			console.log('Saving current state as defaults...')
			console.log('Current state:', this.$state)
			
			// Create a copy of the current state without userDefaults
			const stateToSave = { ...this.$state } as Record<string, any>
			delete stateToSave.userDefaults
			
			// Ensure all settings are properly saved
			stateToSave.colors = {
				dark: { ...this.colors.dark },
				light: { ...this.colors.light }
			}
			stateToSave.boxed = {
				enabled: this.boxed.enabled,
				toolbar: this.boxed.toolbar,
				width: this.boxed.width
			}
			stateToSave.footer = {
				show: this.footer.show
			}
			
			// Save the state
			this.userDefaults = stateToSave as Omit<DefaultState, 'userDefaults'>
		},
		setLayout(layout: Layout): void {
			this.layout = layout;
		},
		setBoxed(boxed: boolean): void {
			this.boxed.enabled = boxed;
		},
		setFooterShow(show: boolean): void {
			this.footer.show = show;
		},
		setToolbarBoxed(boxed: boolean): void {
			this.boxed.toolbar = boxed;
		},
		setRouterTransition(routerTransition: RouterTransition): void {
			this.routerTransition = routerTransition;
		},
		setTheme(themeName: ThemeNameEnum): void {
			this.themeName = themeName;
		},
		setThemeLight(): void {
			this.themeName = ThemeNameEnum.Light;
		},
		setThemeDark(): void {
			this.themeName = ThemeNameEnum.Dark;
		},
		setColor(theme: ThemeNameEnum, colorName: string, color: string): void {
			(this.colors[theme] as Record<string, string>)[colorName] = color;
		},
		toggleTheme(): void {
			if (this.isThemeDark) {
				this.setThemeLight();
			} else {
				this.setThemeDark();
			}
		},
		toggleSidebar(): void {
			this.sidebar.collapsed = !this.sidebar.collapsed;
		},
		refreshSidebar(): void {
			// this is useful in context like NUXT
			this.sidebar.collapsed = !this.sidebar.collapsed;
			setTimeout(() => {
				this.sidebar.collapsed = !this.sidebar.collapsed;
			}, 10);
		},
		openSidebar(): void {
			this.sidebar.collapsed = false;
		},
		closeSidebar(): void {
			this.sidebar.collapsed = true;
		},
		updateResponsiveVars() {
			for (const key in this.responsive.override) {
				if (_get(this, key) && key in this.responsive.override) {
					_set(
						this,
						key,
						window.innerWidth <= this.responsive.breakpoint
							? this.responsive.override[key as keyof typeof this.responsive.override].mobile
							: this.responsive.override[key as keyof typeof this.responsive.override].desk
					);
				}
			}
		},
		ensureSidebarState() {
			// auto close sidebar on resize
			if (this.sidebar.autoClose) {
				if (!this.sidebar.collapsed && window.innerWidth <= this.sidebar.autoCloseBreakpoint) {
					this.sidebar.collapsed = true;
				}
			}
		},
		setDocumentThemeName(val: ThemeNameEnum, old?: ThemeNameEnum) {
			if (document) {
				const html = document.children[0] as HTMLElement;
				if (old) {
					html.classList.remove(`theme-${old}`);
				}
				html.classList.add(`theme-${val}`);
			}
		},
		setCssGlobalVars() {
			if (document) {
				const html = document.children[0] as HTMLElement
				const { style: htmlStyle } = html
				
				// Set all style variables
				for (const key in this.style) {
					htmlStyle.setProperty(`--${key}`, this.style[key])
				}
				
				// Set the current font family
				const selectedFont = this.fontFamily[this.selectedFontFamilyType]
				htmlStyle.setProperty("--font-family", selectedFont)
				
				// Also set it directly on the html element to ensure it's applied
				html.style.fontFamily = selectedFont
				
				// Apply to body element
				document.body.style.fontFamily = selectedFont
			}
		},
		startWatchers() {
			const { width } = useWindowSize();

			watch(() => this.style, () => {
				this.setCssGlobalVars();
			});

			watch(
				() => this.themeName,
				(val, old) => {
					this.setDocumentThemeName(val, old);
				}
			);

			watch(width, () => {
				this.updateResponsiveVars();
				this.ensureSidebarState();
			});
		},
		initTheme() {
			this.updateResponsiveVars()
			this.ensureSidebarState()
			
			// Set CSS variables and apply font family
			this.setCssGlobalVars()
			
			// Set document theme name
			this.setDocumentThemeName(this.themeName)
			
			// Start watchers
			this.startWatchers()
		},
		setFontFamilyType(fontFamilyType: FontFamilyType) {
			this.selectedFontFamilyType = fontFamilyType
			// Apply the font family immediately
			if (document) {
				const html = document.children[0] as HTMLElement
				const selectedFont = this.fontFamily[fontFamilyType]
				
				// Set the current font family
				document.documentElement.style.setProperty("--font-family", selectedFont)
				
				// Apply to html element
				html.style.fontFamily = selectedFont
				
				// Apply to body element
				document.body.style.fontFamily = selectedFont
				
				// Force a reflow to ensure styles are applied
				void document.body.offsetHeight
				
				// Update CSS variables
				this.setCssGlobalVars()
				
				// Save the current state as defaults
				this.saveDefaults()
			}
		}
	},
	getters: {
		naiveTheme(state): BuiltInGlobalTheme {
			return state.themeName === ThemeNameEnum.Dark ? darkTheme : lightTheme;
		},
		themeOverrides(state): GlobalThemeOverrides {
			return getThemeOverrides(state);
		},
		darkPrimaryColor(state): string {
			return state.colors.dark.primary;
		},
		lightPrimaryColor(state): string {
			return state.colors.light.primary;
		},
		naiveCommon(): ThemeCommonVars {
			return { ...this.naiveTheme.common, ...this.themeOverrides.common };
		},
		style(state): { [key: string]: string } {
			return getCssVars(state, this);
		},
		isThemeDark(state): boolean {
			return state.themeName === ThemeNameEnum.Dark;
		},
		isThemeLight(state): boolean {
			return state.themeName === ThemeNameEnum.Light;
		},
		isBoxed(state): boolean {
			return state.boxed.enabled;
		},
		isFooterShown(state): boolean {
			return state.footer.show;
		},
		isToolbarBoxed(state): boolean {
			return state.boxed.toolbar && state.boxed.enabled;
		},
		currentFontFamilyType(state): FontFamilyType {
			return state.selectedFontFamilyType;
		}
	},
	persist: {
		// use this param to save specific state chunk on localStorage
		pick: [
			"layout",
			"themeName",
			"routerTransition",
			"boxed",
			"sidebar.collapsed",
			"selectedFontFamilyType",
			"userDefaults",
			"colors",
			"footer.show",
			"sidebar.autoClose",
			"sidebar.autoCloseBreakpoint",
			"sidebar.animEase",
			"sidebar.animDuration",
			"sidebar.openWidth",
			"sidebar.closeWidth",
			"responsive.breakpoint",
			"responsive.override",
			"responsive.toolbarHeight",
			"toolbarHeight",
			"viewPadding",
			"headerBarHeight"
		]
	}
});

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot));
}
