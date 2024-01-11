import { isTag, isText, parse, type Props } from '$lib/index.js';

export function load() {
	const html = `<h1>Welcome to your library project</h1>
	<div><textarea><p>Test</p></textarea></div>
<p onclick="alert('test')">Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p><span style="font-style: italic">Visit</span> <a href="https://kit.svelte.dev">kit.svelte.<b>dev</b></a> to read the documentation</p>`;

	return {
		myHtml: parse(html, {
			noHtmlNodes: true,
			processNode(node) {
				if (isTag(node)) {
					if (node.name === 'h1') {
						node.name = 'h2';
					} else if (node.name === 'a') {
						return { component: 'Test', props: { a: 'B' } };
					} else if (node.name === 'b') {
						node.name = 'strong';
					} else if (node.name === 'textarea') {
						let props: Props | undefined;
						const child = node.children?.[0];
						if (child) {
							if (isText(child)) props = { value: child.data };
							node.children = [];
						}

						return { component: 'Textarea', props };
					}
				}
			},
		}),

		textareaTest: parse('<textarea><p><p>test</p></textarea>', {
			// noHtmlNodes: true,
		}),
	};
}
