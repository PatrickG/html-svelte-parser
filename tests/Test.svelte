<script lang="ts">
	import { onMount } from 'svelte';
	import Html from '../src/lib/Html.svelte';
	import { parse } from '../src/lib/parse';

	export let noHtmlNodes = false;

	let html = `<p class="test">foo</p>`;

	const changeHtml = () => {
		html = `<div data-test>bar</div>`;
	};

	let result: HTMLDivElement;
	onMount(() => {
		(result as { parse?: typeof parse }).parse = parse;
	});
</script>

<div id="result" bind:this={result}>
	<Html {html} {noHtmlNodes} />
</div>

<button type="button" on:click={changeHtml}>Change html</button>
