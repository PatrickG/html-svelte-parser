<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export let href: string | undefined = undefined;
	export let type: HTMLButtonAttributes['type'] = 'button';
</script>

{#if href}
	<a {...$$restProps} {href}><slot /></a>
{:else}
	<button {...$$restProps} {type}><slot /></button>
{/if}
