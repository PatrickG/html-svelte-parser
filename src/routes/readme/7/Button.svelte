<script>
	/** @type {string | undefined} */
	export let href = undefined;

	/** @type {'button' | 'submit' | 'reset'}*/
	export let type = 'button';
</script>

{#if href}
	<a {...$$restProps} {href}><slot /></a>
{:else}
	<button {...$$restProps} {type}><slot /></button>
{/if}
