import { loadComponents } from '$lib/index.js';

const loader = (component: string) =>
	import(`./components/${component}.svelte`);

export async function load({ data }) {
	const [withHtmlNodes, withoutHtmlNodes] = await Promise.all([
		loadComponents(data.withHtmlNodes, loader),
		loadComponents(data.withoutHtmlNodes, loader),
	]);

	return {
		...data,
		withHtmlNodes,
		withoutHtmlNodes,
	};
}
