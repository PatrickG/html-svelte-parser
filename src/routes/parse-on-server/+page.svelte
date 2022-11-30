<script lang="ts">
	import { Renderer } from '$lib';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<p>parse html and process nodes on the server.</p>

<div>
	<Renderer {...data.myHtml} />
</div>

<style>
	div {
		padding: 1rem;
		border: solid 1px red;
	}
</style>
