import { loadComponents } from '$lib';

/** @type {import('./$types').PageLoad} */
export const load = ({ data }) => ({
	content: loadComponents(data.content, componentName => {
		// `componentName` is the `component` we returned in `+page.server.js`
		return import(`./components/${componentName}.svelte`);
	}),
});
