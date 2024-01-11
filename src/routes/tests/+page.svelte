<script lang="ts">
	import { Renderer } from '$lib/index.js';

	export let data;
</script>

<div id="with-html-nodes"><Renderer {...data.withHtmlNodes} /></div>

<div id="without-html-nodes"><Renderer {...data.withoutHtmlNodes} /></div>
