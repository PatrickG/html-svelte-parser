# <img alt="html-svelte-parser Logo" src="./static/logo.svg" width="64px" /> html-svelte-parser

HTML to Svelte parser that works on both the server (Node.js) and the client (browser).

To replace an element with a svelte component, check out the [`processNode`](#processnode) option.

#### Example

_Paragraph.svelte_

```svelte
<p><slot /></p>
```

_App.svelte_

```svelte
<script>
	import { Html, isTag } from 'html-svelte-parser';
	import Paragraph from './Paragraph.svelte';
</script>

<Html
	html="<p>Hello, World!</p>"
	processNode={node => {
		if (isTag(node) && node.name === 'p') {
			return { component: Paragraph };
		}
	}}
/>

<!--
	Equivalent to:

	<Paragraph>Hello, World!</Paragraph>
-->
```

---

<details>
<summary>Table of Contents</summary>

- [Install](#install)
- [Usage](#usage)
  - [processNode](#processnode)
    - [Modify/remove nodes](#modifyremove-nodes)
    - [Replace nodes](#replace-nodes)
  - [Usage with sveltekit](#usage-with-sveltekit)
  - [Named slots](#named-slots)
- [Credits](#credits)

</details>

## Install

Install the [NPM package _html-svelte-parser_](https://www.npmjs.com/package/html-svelte-parser) with your favorite package manager:

```sh
npm install html-svelte-parser
# pnpm add html-svelte-parser
# yarn add html-svelte-parser
```

## Usage

```svelte
<script>
	import { Html } from 'html-svelte-parser';
</script>

<!-- Single element: -->
<Html html="<h1>single</h1>" />

<!-- Multiple elements: -->
<ul>
	<Html html="<li>Item 1</li><li>Item 2</li>" />
</ul>

<!-- Nested elements: -->
<Html html="<div><p>Lorem ipsum</p></div>" />

<!-- Element with attributes: -->
<Html
	html={`<hr id="foo" class="bar" data-attr="baz" custom="qux" style="top:42px;">`}
/>
```

### processNode

The `processNode` option is a function that allows you to modify or remove a DOM node or replace it with a svelte component. It receives one argument which is [domhandler](https://github.com/fb55/domhandler)'s node (either [`Element`](https://github.com/fb55/domhandler/blob/88fb7a71446e221f5a09cd3c41713c51043be2a7/src/node.ts#L271) or [`Text`](https://github.com/fb55/domhandler/blob/88fb7a71446e221f5a09cd3c41713c51043be2a7/src/node.ts#L155)):

```svelte
<Html
	html="<br>"
	processNode={domNode => {
		console.dir(domNode, { depth: null });
	}}
/>
```

Console output:

```js
Element {
  type: 'tag',
  parent: null,
  prev: null,
  next: null,
  startIndex: null,
  endIndex: null,
  children: [],
  name: 'br',
  attribs: {}
}
```

#### Modify/remove nodes

You can directly modify the DOM nodes or remove them by returning `false`:

```svelte
<script>
	import { Html, isTag, Text } from 'html-svelte-parser';

	const html = `
		<p id="remove">remove me</p>
		<p id="keep">keep me</p>
	`;

	/** @type {import('html-svelte-parser').ProcessNode} */
	const processNode = domNode => {
		if (isTag(domNode)) {
			if (domNode.attribs.id === 'remove') {
				return false;
			}

			if (domNode.attribs.id === 'keep') {
				domNode.attribs.id = 'i-stay';
				domNode.children = [new Text('i stay!')];
			}
		}
	};
</script>

<Html {html} {processNode} />

<!--
	Equivalent to:

	<p id="i-stay">i stay!</p>
-->
```

#### Replace nodes

To replaced a DOM node with a svelte component return an object with a `component` property.\
Additionally the object can have a `props` property.

_Span.svelte_

```svelte
<span {...$$props}><slot /></span>
```

_App.svelte_

```svelte
<script>
	import { Html, isTag, Text } from 'html-svelte-parser';
	import Span from './Span.svelte';

	const html = `<p id="replace">text</p>`;

	/** @type {import('html-svelte-parser').ProcessNode} */
	const processNode = domNode => {
		if (isTag(domNode) && domNode.attribs.id === 'replace') {
			domNode.children = [new Text('replaced')];
			return { component: Span, props: { class: 'my-span' } };
		}
	};
</script>

<Html {html} {processNode} />

<!--
	Equivalent to:

	<span class="my-span">replaced</span>
-->
```

### Usage with sveltekit

`html-svelte-parser` exports more than just the `Html` component, which makes it possible to delegate the work of parsing and processing to the server. An added bonus, you ship less code to the client.

<details>
<summary>Other files</summary>

_components/Button.svelte_

```svelte
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
```

</details>

_+page.server.js_

```js
import { isTag, parse } from 'html-svelte-parser';

/** @type {import('./$types').PageServerLoad} */
export const load = () => {
	return {
		content: parse(
			`<p><a class="btn" href="https://svelte.dev/">Svelte</a> rocks</p>`,
			{
				processNode(node) {
					if (
						isTag(node) &&
						node.name === 'a' &&
						node.attribs.class?.split(/\s/).includes('btn')
					) {
						// We use a `string` for the `component` property.
						return { component: 'Button', props: node.attribs };
					}
				},
			},
		),
	};
};
```

_+page.js_

```js
import { loadComponents } from 'html-svelte-parser';

/** @type {import('./$types').PageLoad} */
export const load = ({ data }) => ({
	content: loadComponents(data.content, componentName => {
		// `componentName` is the `component` we returned in `+page.server.js`
		return import(`./components/${componentName}.svelte`);
	}),
});
```

_+page.svelte_

```svelte
<script>
	import { Renderer } from 'html-svelte-parser';

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<Renderer {...data.content} />

<!--
	Equivalent to:

	<p><Button class="btn" href="https://svelte.dev/">Svelte</Button> rocks</p>
-->
```

### Named slots

What if your component has named slots? Unfortunately it is currently not possible to render named slots dynamically with svelte.\
Fortunately, we can work around the problem with a wrapper component and the `Renderer` component.

<details>
<summary>Other files</summary>

_Button.svelte_

```svelte
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
```

_Card.svelte_

```svelte
<div class="card">
	{#if $$slots.title}
		<div class="title"><slot name="title" /></div>
	{/if}

	<div class="content"><slot /></div>

	{#if $$slots.actions}
		<div class="actions"><slot name="actions" /></div>
	{/if}
</div>
```

</details>

_CardWrapper.svelte_\
This is our wrapper component.

```svelte
<script>
	import { Renderer } from 'html-svelte-parser';
	import Card from './Card.svelte';

	/** @type {import('html-svelte-parser').RendererProps} */
	export let title;

	/** @type {import('html-svelte-parser').RendererProps} */
	export let content;

	/** @type {import('html-svelte-parser').RendererProps} */
	export let actions;
</script>

<Card>
	<Renderer slot="title" {...title} />
	<Renderer {...content} />
	<Renderer slot="actions" {...actions} />
</Card>
```

_App.svelte_

```svelte
<script>
	import { Html, isTag } from 'html-svelte-parser';
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

	/** @type {import('html-svelte-parser').ProcessNode} */
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
	Equivalent to

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
```

## TODO

- API docs
- cleanup tests & more tests
- GH page

## Credits

- [html-dom-parser](https://github.com/remarkablemark/html-dom-parser)
- [htmlparser2](https://github.com/fb55/htmlparser2)
- [domhandler](https://github.com/fb55/domhandler)
- [dom-serializer](https://github.com/cheeriojs/dom-serializer)

Inspired by [html-react-parser](https://github.com/remarkablemark/html-react-parser) and [html-to-react](https://github.com/aknuds1/html-to-react).
