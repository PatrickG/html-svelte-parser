<script>
	import { Renderer } from '$lib';
	import Card from './Card.svelte';

	/** @type {import('$lib').RendererProps} */
	export let title;

	/** @type {import('$lib').RendererProps} */
	export let content;

	/** @type {import('$lib').RendererProps} */
	export let actions;
</script>

<Card>
	<Renderer slot="title" {...title} />
	<Renderer {...content} />
	<Renderer slot="actions" {...actions} />
</Card>
