<svelte:options immutable />

<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { parse } from './parse';
	import Renderer from './Renderer.svelte';
	import type { Options, Props } from './types';

	interface $$Props extends Options {
		/** The html string to parse */
		html: string;

		/** Object of components in the form of `{ componentName: component }` */
		components?: Record<string, ComponentType>;

		/** Object of component props in the form of `{ componentName: Props }` */
		props?: Record<string, Props>;

		/** A fallback component */
		fallback?: ComponentType;
	}

	export let html: string;
	export let components: Record<string, ComponentType> = {};
	export let props: Record<string, Props> = {};
	export let fallback: ComponentType | undefined = undefined;
</script>

<Renderer
	nodes={parse(html, $$restProps).nodes}
	{components}
	{props}
	{fallback}
/>
