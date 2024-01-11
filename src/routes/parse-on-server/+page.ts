import { loadComponents } from '$lib/index.js';

export async function load({ data }) {
	return {
		...data,
		myHtml: await loadComponents(
			data.myHtml,
			component => import(`../components/${component}.svelte`),
		),
		textareaTest: {
			...data.textareaTest,
			components: {},
		},
	};
}
