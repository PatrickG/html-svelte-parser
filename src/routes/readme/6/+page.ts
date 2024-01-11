import { loadComponents } from '$lib/index.js';

export async function load({ data }) {
	return {
		content: await loadComponents(data.content, componentName => {
			// `componentName` is the `component` we returned in `+page.server.js`
			return import(`./components/${componentName}.svelte`);
		}),
	};
}
