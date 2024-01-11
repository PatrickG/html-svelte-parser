<script lang="ts">
	import { Html } from '$lib/index.js';
</script>

<Html
	html="<br>"
	processNode={domNode => {
		console.dir(domNode, { depth: null });
	}}
/>
