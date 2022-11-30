<script lang="ts">
	import type { Attributes } from '$lib';

	export let attributes: Attributes;
	export let a: string;
</script>

<test-link {...attributes}>{a} <slot /></test-link>
