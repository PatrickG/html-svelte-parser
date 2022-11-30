<svelte:options namespace="svg" immutable /><script lang="ts">
	// Funny formatting because we don't want to render any extra whitespace
	// Wrap `HtmlNode`s with an extra `g` (see https://github.com/sveltejs/svelte/issues/5764#issuecomment-753292326)

	import type { ComponentType } from 'svelte';
	import type { Node, Props } from './types';
	import { NodeType } from './types';
	import { getComponent, getComponentProps } from './utils';

	export let nodes: Node[];
	export let components: Record<string, ComponentType> = {};
	export let props: Record<string, Props> = {};
	export let fallback: ComponentType | undefined = undefined;
</script>{#each nodes as node}{#if node.type === NodeType.Text}{node.data}{:else if node.type === NodeType.Html}<g>{@html node.data}</g>{:else if node.type === NodeType.Tag}{#if node.children?.length}<svelte:element this={node.tag} {...node.attributes}><svelte:self nodes={node.children} {components} {props} {fallback} /></svelte:element>{:else}<svelte:element this={node.tag} {...node.attributes} />{/if}{:else if node.children?.length}<svelte:component this={getComponent(node, components) || fallback} {...getComponentProps(node, props, components, fallback)}><svelte:self nodes={node.children} {components} {props} {fallback} /></svelte:component>{:else}<svelte:component this={getComponent(node, components) || fallback} {...getComponentProps(node, props, components, fallback)} />{/if}{/each}