<svelte:options immutable /><script lang="ts">
	// Funny formatting because we don't want to render any extra whitespace
	// Special handling of `svg` tags to let svelte know we are in svg namespace

	import type { ComponentType } from 'svelte';
	import SvgRenderer from './SvgRenderer.svelte';
	import type { Node, Props } from './types.js';
	import { NodeType } from './types.js';
	import { getComponent, getComponentProps } from './utils.js';

	/** Nodes returned from `parse`. */
	export let nodes: Node[];

	/** Object of components in the form of `{ componentName: component }` */
	export let components: Record<string, ComponentType> = {};

	/** Object of props in the form of `{ componentName: Props }` */
	export let props: Record<string, Props> = {};

	/** A fallback component */
	export let fallback: ComponentType | undefined = undefined;
</script>{#each nodes as node}{#if node.type === NodeType.Text}{node.data}{:else if node.type === NodeType.Html}{@html node.data}{:else if node.type === NodeType.Tag}{#if node.tag === 'svg'}<svg {...node.attributes}><SvgRenderer nodes={node.children || []} {components} {props} {fallback} /></svg>{:else if node.children?.length}<svelte:element this={node.tag} {...node.attributes}><svelte:self nodes={node.children} {components} {props} {fallback} /></svelte:element>{:else}<svelte:element this={node.tag} {...node.attributes} />{/if}{:else if node.children?.length}<svelte:component this={getComponent(node, components) || fallback} {...getComponentProps(node, props, components, fallback)}><svelte:self nodes={node.children} {components} {props} {fallback} /></svelte:component>{:else}<svelte:component this={getComponent(node, components) || fallback} {...getComponentProps(node, props, components, fallback)} />{/if}{/each}
