import { defineStore } from 'pinia'

interface Visitor {
	id: string
	name: string
	phoneNumber: string
	lastVisit: Date
	lastPantryVisit: Date | null
	totalVisits: number
}

export const useVisitorsStore = defineStore('visitors', {
	state: () => ({
		visitors: [] as Visitor[],
		loading: false,
		error: null as string | null
	}),
	
	getters: {
		sortedVisitors: (state) => {
			return [...state.visitors].sort((a, b) => 
				b.lastVisit.getTime() - a.lastVisit.getTime()
			)
		}
	},
	
	actions: {
		async fetchVisitors() {
			this.loading = true
			try {
				// TODO: Replace with actual API call
				// Mock data for now
				this.visitors = [
					{
						id: '1',
						name: 'John Doe',
						phoneNumber: '(555) 123-4567',
						lastVisit: new Date('2024-03-15'),
						lastPantryVisit: new Date('2024-03-01'),
						totalVisits: 5
					},
					{
						id: '2',
						name: 'Jane Smith',
						phoneNumber: '(555) 987-6543',
						lastVisit: new Date('2024-03-14'),
						lastPantryVisit: null,
						totalVisits: 2
					}
				]
			} catch (error) {
				this.error = 'Failed to fetch visitors'
				console.error(error)
			} finally {
				this.loading = false
			}
		},
		
		async deleteVisitor(id: string) {
			try {
				// TODO: Replace with actual API call
				this.visitors = this.visitors.filter(v => v.id !== id)
			} catch (error) {
				this.error = 'Failed to delete visitor'
				console.error(error)
			}
		},
		
		async updateVisitor(visitor: Visitor) {
			try {
				// TODO: Replace with actual API call
				const index = this.visitors.findIndex(v => v.id === visitor.id)
				if (index !== -1) {
					this.visitors[index] = visitor
				}
			} catch (error) {
				this.error = 'Failed to update visitor'
				console.error(error)
			}
		}
	}
}) 