<script lang="ts">
	import { base } from '$app/paths';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export let href: string | undefined = undefined;
	export let type: HTMLButtonAttributes['type'] = 'button';
</script>

{#if href}
	<a {...$$restProps} href={href?.startsWith('/') ? base + href : href}
		><slot /></a
	>
{:else}
	<button {...$$restProps} {type}><slot /></button>
{/if}
