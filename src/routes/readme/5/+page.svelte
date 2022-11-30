<script>
	import { Html, isTag, Text } from '$lib';
	import Span from './Span.svelte';

	const html = `<p id="replace">text</p>`;

	/** @type {import('$lib').ProcessNode} */
	const processNode = domNode => {
		if (isTag(domNode) && domNode.attribs.id === 'replace') {
			domNode.children = [new Text('replaced')];
			return { component: Span, props: { class: 'my-span' } };
		}
	};
</script>

<Html {html} {processNode} />

<!--
	Equivalent to:

	<span class="my-span">replaced</span>
-->
