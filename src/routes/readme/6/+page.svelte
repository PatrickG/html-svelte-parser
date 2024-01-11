<script lang="ts">
	import { Renderer } from '$lib/index.js';

	export let data;
</script>

<Renderer {...data.content} />

<!--
	Equivalent to:

	<p><Button class="btn" href="https://svelte.dev/">Svelte</Button> rocks</p>
-->
