<script lang="ts">
	import { Renderer } from '$lib';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div id="with-html-nodes"><Renderer {...data.withHtmlNodes} /></div>

<div id="without-html-nodes"><Renderer {...data.withoutHtmlNodes} /></div>
