<script lang="ts">
	import { Renderer, type RendererProps } from '$lib/index.js';
	import Card from './Card.svelte';

	export let title: RendererProps;
	export let content: RendererProps;
	export let actions: RendererProps;
</script>

<Card>
	<Renderer slot="title" {...title} />
	<Renderer {...content} />
	<Renderer slot="actions" {...actions} />
</Card>
