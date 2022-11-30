<script>
	import { Html, isTag, Text } from '$lib';

	const html = `
		<p id="remove">remove me</p>
		<p id="keep">keep me</p>
	`;

	/** @type {import('$lib').ProcessNode} */
	const processNode = domNode => {
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
