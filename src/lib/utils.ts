import type { ComponentType } from 'svelte';
import type { ComponentNode, Props } from './types.js';

export const getComponent = (
	node: ComponentNode,
	components: Record<string, ComponentType>,
) =>
	typeof node.component === 'string'
		? components[node.component]
		: node.component;

export const getComponentProps = (
	node: ComponentNode,
	props: Record<string, Props>,
	components: Record<string, ComponentType>,
	fallback?: ComponentType,
) => ({
	...node.props,
	...(typeof node.component === 'string' ? props[node.component] : {}),
	...(node.rendererProps &&
		Object.fromEntries(
			Object.entries(node.rendererProps).map(([propName, nodes]) => [
				propName,
				{ nodes, props, components, fallback },
			]),
		)),
});
