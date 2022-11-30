<div class="card">
	{#if $$slots.title}
		<div class="title"><slot name="title" /></div>
	{/if}

	<div class="content"><slot /></div>

	{#if $$slots.actions}
		<div class="actions"><slot name="actions" /></div>
	{/if}
</div>
