<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { cssVariables, applyCssVariables } from '../lib/stores/theme.js';

	// Apply theme CSS variables when they change
	onMount(() => {
		const unsubscribe = cssVariables.subscribe(variables => {
			applyCssVariables(variables);
		});

		return unsubscribe;
	});
</script>

<main class="app-container">
	<slot />
</main>

<style>
	:global(html) {
		height: 100%;
	}

	:global(body) {
		height: 100%;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	.app-container {
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}
</style>
