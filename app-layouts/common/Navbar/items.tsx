import type { MenuMixedOption } from "naive-ui/es/menu/src/interface"
import { h } from "vue"
import { RouterLink } from "vue-router"
import { renderIcon } from "@/utils"

const DashboardIcon = "carbon:document-blank"
const KioskIcon = "carbon:document-blank"

// eslint-disable-next-line unused-imports/no-unused-vars
export default function getItems(args: { mode: "vertical" | "horizontal"; collapsed: boolean }): MenuMixedOption[] {
	return [
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "index"
						}
					},
					{ default: () => "Dashboard Overview" }
				),
			key: "dashboard-overview",
			icon: renderIcon(DashboardIcon)
		},
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "KioskSplash"
						}
					},
					{ default: () => "Kiosk" }
				),
			key: "KioskSplash",
			icon: renderIcon(KioskIcon)
		}
	]
}
