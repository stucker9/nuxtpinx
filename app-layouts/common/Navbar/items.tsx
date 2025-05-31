import type { MenuMixedOption } from "naive-ui/es/menu/src/interface"
import { h } from "vue"
import { RouterLink } from "vue-router"
import { renderIcon } from "@/utils"

const BlankIcon = "carbon:document-blank"

// eslint-disable-next-line unused-imports/no-unused-vars
export default function getItems(args: { mode: "vertical" | "horizontal"; collapsed: boolean }): MenuMixedOption[] {
	// This is an array of menu items. Each {...} object is one item.
	return [
		// ITEM 1: A Non-Clickable Heading
		// It's a simple object with 'type: "group"'.
		{
			type: "group",
			label: "Main Section", // The label is just a string.
			key: "main-section-heading" // A unique key for the heading.
		}, // <-- Notice the comma separating it from the next item.

		// ITEM 2: A Clickable Link
		// This is a separate object for the link.
		{
			// The 'label' is a function that creates the link.
			label: () =>
				h(
					RouterLink,
					{
						// The 'to' prop tells the RouterLink where to navigate.
						to: {
							name: "BlankPage"
						}
					},
					// The 'default' slot is the visible text of the link.
					{ default: () => "Blank Page" }
				),
			// The unique key for the link item.
			key: "BlankPage",
			// The icon for the link item.
			icon: renderIcon(BlankIcon)
		}
	]
}
