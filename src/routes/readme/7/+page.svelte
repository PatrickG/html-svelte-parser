<script>
	import { Html, isTag } from '$lib';
	import Button from './Button.svelte';
	import CardWrapper from './CardWrapper.svelte';

	const html = `
		<div class="card">
			<h1 class="card--title">My Card</h1>

			<div class="card--content">
				<p>This gets replaced with a nice Card component</p>
				<p><a href="https://svelte.dev/">Svelte</a> is cool.</p>
			</div>

			<div class="card--actions">
				<a class="btn" href="/whatever">Call to action</a>
			</div>
		</div>
	`;

	// lets define some helpers

	const hasClass = (
		/** @type {import('domhandler').Element} */ node,
		/** @type {string} */ className,
	) => node.attribs.class?.split(/\s/).includes(className);

	const findChildWithClass = (
		/** @type {import('domhandler').ParentNode} */ node,
		/** @type {string} */ className,
	) =>
		/** @type {import('domhandler').Element | undefined} */ (
			node.children.find(child => isTag(child) && hasClass(child, className))
		);

	/** @type {import('$lib').ProcessNode} */
	const processNode = node => {
		if (!isTag(node)) return;

		// add attributes to external links
		if (node.name === 'a' && !node.attribs.href?.startsWith('/')) {
			node.attribs.target = '_blank';
			node.attribs.rel = 'noreferrer nofollow';
		}

		if (hasClass(node, 'card')) {
			return {
				component: CardWrapper,

				// don't process child nodes / no "default" slot for `CardWrapper`
				noChildren: true,

				// transform specific child nodes into props that get passed to
				// `CardWrapper` and can be rendered in a named slot with `Renderer`
				rendererProps: {
					// even if `findChildWithClass` returns undefined, `CardWrapper`
					// still gets a `title` prop
					title: findChildWithClass(node, 'card--title'),

					// for `content` and `actions`, we want only the children of the
					// selected element to be rendered
					content: findChildWithClass(node, 'card--content')?.children,
					actions: findChildWithClass(node, 'card--actions')?.children,
				},
			};
		}

		if (hasClass(node, 'btn')) {
			return { component: Button, props: node.attribs };
		}
	};
</script>

<Html {html} {processNode} />

<!--
	Equivalent to:

	<Card>
		<svelte:fragment slot="title">
			<h1 class="card--title">My Card</h1>
		</svelte:fragment>

		<p>This gets replaced with a nice Card component</p>
		<p><a href="https://svelte.dev/" target="_blank" rel="noreferrer nofollow">Svelte</a> is cool.</p>

		<svelte:fragment slot="actions">
			<Button class="btn" href="/whatever">Call to action</Button>
		</svelte:fragment>
	</Card>
-->
