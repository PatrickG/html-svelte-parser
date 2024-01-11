<script lang="ts">
	import type { Attributes } from '$lib/types.js';

	export let attributes: Attributes;
</script>

<span {...attributes}><slot /></span>
