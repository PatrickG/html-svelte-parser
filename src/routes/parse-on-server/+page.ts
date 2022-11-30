import { loadComponents } from '$lib';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => ({
	...data,
	myHtml: loadComponents(
		data.myHtml,
		component => import(`../components/${component}.svelte`),
	),
});
