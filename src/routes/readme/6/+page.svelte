<script>
	import { Renderer } from '$lib';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Renderer {...data.content} />

<!--
	Equivalent to:

	<p><Button class="btn" href="https://svelte.dev/">Svelte</Button> rocks</p>
-->
