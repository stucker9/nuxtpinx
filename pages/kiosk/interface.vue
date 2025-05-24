<template>
	<div class="h-full flex flex-col items-center justify-center p-8">
		<h1 class="text-4xl font-bold mb-8">Welcome to Operation Stand Down RI</h1>
		<div class="grid grid-cols-2 gap-6 max-w-4xl w-full">
			<button
				v-for="service in services"
				:key="service.id"
				@click="selectService(service)"
				class="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
			>
				<h2 class="text-xl font-semibold mb-2">{{ service.name }}</h2>
				<p class="text-gray-600">{{ service.description }}</p>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
const services = [
	{
		id: 1,
		name: 'Food Pantry',
		description: 'Access our food pantry services (30-day eligibility rule applies)'
	},
	{
		id: 2,
		name: 'Housing Services',
		description: 'Get information about housing assistance and support'
	},
	{
		id: 3,
		name: 'Veteran Resources',
		description: 'Browse available resources and support services'
	},
	{
		id: 4,
		name: 'Rental Payment',
		description: 'Make a rental payment or check payment status'
	}
]

function selectService(_service: typeof services[0]) {
	// TODO: Implement service selection logic
	// console.log('Selected service:', service)
}
</script> 