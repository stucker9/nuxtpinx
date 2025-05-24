<template>
	<div class="p-6">
		<h1 class="mb-4 text-3xl font-bold">Dashboard Overview</h1>
		<p>Welcome to your new dashboard page!</p>
	</div>
</template>

<script lang="ts" setup>
// You can define page-specific metadata here
definePageMeta({
	title: "Dashboard Overview",
	auth: true, // Requires authentication to access
	roles: "all" // All authenticated roles can access
})
</script>

<style scoped>
/* Add page-specific styles here if needed */
</style>
