<template>
	<n-config-provider>
		<slot />
	</n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider } from "naive-ui"
</script>

<style scoped lang="scss">
.ltr-context {
	direction: ltr;
}
</style>
