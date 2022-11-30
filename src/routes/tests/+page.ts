import { loadComponents } from '$lib';
import type { PageLoad } from './$types';

const loader = (component: string) =>
	import(`./components/${component}.svelte`);

export const load: PageLoad = async ({ data }) => ({
	...data,
	withHtmlNodes: loadComponents(data.withHtmlNodes, loader),
	withoutHtmlNodes: loadComponents(data.withoutHtmlNodes, loader),
});
