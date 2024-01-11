<script lang="ts">
	import { Renderer } from '$lib/index.js';

	export let data;
</script>

<p>parse html and process nodes on the server.</p>

<div>
	<Renderer {...data.myHtml} />
</div>

<div>
	<p>Textarea test</p>
	<Renderer {...data.textareaTest} />
</div>

<style>
	div {
		padding: 1rem;
		border: solid 1px red;
	}
</style>
