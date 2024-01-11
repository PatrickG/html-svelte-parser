<script lang="ts">
	import { Html, Text, isTag, type ProcessNode } from '$lib/index.js';

	const html = `
		<p id="remove">remove me</p>
		<p id="keep">keep me</p>
	`;

	const processNode: ProcessNode = domNode => {
		if (isTag(domNode)) {
			if (domNode.attribs.id === 'remove') {
				return false;
			}

			if (domNode.attribs.id === 'keep') {
				domNode.attribs.id = 'i-stay';
				domNode.children = [new Text('i stay!')];
			}
		}
	};
</script>

<Html {html} {processNode} />

<!--
	Equivalent to:

	<p id="i-stay">i stay!</p>
-->
