<script>
	import { Html, isTag } from '$lib';
	import Paragraph from './Paragraph.svelte';
</script>

<Html
	html="<p>Hello, World!</p>"
	processNode={node => {
		if (isTag(node) && node.name === 'p') {
			return { component: Paragraph };
		}
	}}
/>

<!--
	Equivalent to:

	<Paragraph>Hello, World!</Paragraph>
-->
