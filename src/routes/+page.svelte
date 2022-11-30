<script lang="ts">
	import type { ProcessNode } from '$lib';
	import { Html, isTag } from '$lib';
	import Test from './components/Test.svelte';

	let html = `<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>`;

	const changeHtml = () =>
		(html = `<h2>This text was changed!</h2>
<p>Hello <a href="/">world</a></p>`);

	const processNode: ProcessNode = node => {
		if (!isTag(node)) {
			return;
		}

		switch (node.name) {
			case 'a':
				if (!node.attribs.href?.startsWith('/')) {
					node.attribs['data-sveltekit-reload'] = '';
				}

				if (node.attribs.class?.includes('btn')) {
					return { component: Test, props: { attributes: node.attribs } };
				}

				break;

			case 'button':
				return { component: Test, props: { attributes: node.attribs } };
		}
	};
</script>

<button on:click={changeHtml}>Change html</button>

<Html {html} {processNode} props={{ Test: { a: 'overwritten' } }} />

<Html html="<textarea><p><p>test</p></textarea>" noHtmlNodes />

<Html
	html="<br>"
	processNode={domNode => {
		console.dir(domNode, { depth: null });
	}}
/>
