import { isTag, parse } from '$lib';

/** @type {import('./$types').PageServerLoad} */
export const load = () => {
	return {
		content: parse(
			`<p><a class="btn" href="https://svelte.dev/">Svelte</a> rocks</p>`,
			{
				processNode(node) {
					if (
						isTag(node) &&
						node.name === 'a' &&
						node.attribs.class?.split(/\s/).includes('btn')
					) {
						// We use a `string` for the `component` property.
						return { component: 'Button', props: node.attribs };
					}
				},
			},
		),
	};
};
