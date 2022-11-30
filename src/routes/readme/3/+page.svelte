<script>
	import { Html } from '$lib';
</script>

<Html
	html="<br>"
	processNode={domNode => {
		console.dir(domNode, { depth: null });
	}}
/>
