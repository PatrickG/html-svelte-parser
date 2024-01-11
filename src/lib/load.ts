import type { ComponentType } from 'svelte';
import type { Node } from './types.js';

export const loadComponents = async <T extends string = string>(
	{ nodes, components: componentNames }: { nodes: Node[]; components: T[] },
	loader: (
		componentName: T,
	) => Promise<ComponentType | { default: ComponentType }>,
) => {
	const components: Record<T, ComponentType> = {} as Record<T, ComponentType>;
	const promises: Promise<ComponentType>[] = [];

	for (const componentName of componentNames) {
		promises.push(
			loader(componentName).then(
				mod =>
					(components[componentName] = 'default' in mod ? mod.default : mod),
			),
		);
	}

	await Promise.all(promises);
	return { nodes, components };
};
