<script lang="ts">
	import { Html, Text, isTag, type ProcessNode } from '$lib/index.js';
	import Span from './Span.svelte';

	const html = `<p id="replace">text</p>`;

	const processNode: ProcessNode = domNode => {
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
