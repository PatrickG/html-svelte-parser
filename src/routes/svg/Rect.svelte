<script lang="ts">
	export let attributes: Record<string, string>;
</script>

<rect {...attributes}><slot /></rect>
