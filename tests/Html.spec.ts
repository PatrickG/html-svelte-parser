import { expect, test } from '@playwright/experimental-ct-svelte';
import type { Page } from '@playwright/test';
import { expect as expectSSR, test as testSSR } from '@playwright/test';
import Html from '../src/lib/Html.svelte';
import type { parse } from '../src/lib/parse.js';
import { NodeType } from '../src/lib/types.js';
import Test from './Test.svelte';
import { html, svg } from './data.js';

const getHtml = async (page: Page) => (await page.locator('#root')).innerHTML();

test('transforms HTML entities into hex code in html nodes', async ({
	mount,
}) => {
	const component = await mount(Test);
	const element = await component.locator('#result');
	const result = await element.evaluate(element =>
		(element as { parse?: typeof parse }).parse!(
			`<i>asdf &amp; &yuml; &uuml; &apos;</i>`,
		),
	);

	expect(result).toEqual({
		components: [],
		nodes: [
			{ type: NodeType.Html, data: `<i>asdf &amp; &#xff; &#xfc; &apos;</i>` },
		],
	});
});

test('decodes HTML entities in tag nodes', async ({ mount }) => {
	const component = await mount(Test);
	const element = await component.locator('#result');
	const result = await element.evaluate(element =>
		(element as { parse?: typeof parse }).parse!(
			`<i>asdf &amp; &yuml; &uuml; &apos;</i>`,
			{ noHtmlNodes: true },
		),
	);

	expect(result).toEqual({
		components: [],
		nodes: [
			{
				type: NodeType.Tag,
				tag: 'i',
				children: [{ type: NodeType.Text, data: "asdf & ÿ ü '" }],
			},
		],
	});
});

test.describe('converts "text" to "text"', () => {
	const html = 'text';

	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html } });
		expect(await getHtml(page)).toBe(html);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html, noHtmlNodes: true } });
		expect(await getHtml(page)).toBe(html);
	});
});

test.describe('single DOM node', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.single } });
		expect(await getHtml(page)).toBe(html.single);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.single, noHtmlNodes: true } });
		expect(await getHtml(page)).toBe(html.single);
	});
});

test.describe('multiple DOM nodes', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.multiple } });
		expect(await getHtml(page)).toBe(html.multiple);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.multiple, noHtmlNodes: true } });
		expect(await getHtml(page)).toBe(html.multiple);
	});
});

test.describe('converts <textarea> correctly', () => {
	test.describe('with javascript', () => {
		test('with html nodes', async ({ mount, page }) => {
			const component = await mount(Html, { props: { html: html.textarea } });
			expect(await getHtml(page)).toBe(
				'<textarea>&lt;p&gt;foo&lt;/p&gt;&lt;p&gt;bar&lt;/p&gt;</textarea>',
			);
			expect(await component.inputValue()).toBe('<p>foo</p><p>bar</p>');
		});

		test('without html nodes', async ({ mount, page }) => {
			const component = await mount(Html, {
				props: { html: html.textarea, noHtmlNodes: true },
			});
			expect(await getHtml(page)).toBe(
				'<textarea>&lt;p&gt;foo&lt;/p&gt;&lt;p&gt;bar&lt;/p&gt;</textarea>',
			);
			expect(await component.inputValue()).toBe('<p>foo</p><p>bar</p>');
		});
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=textarea');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><textarea>&lt;p&gt;foo&lt;/p&gt;&lt;p&gt;bar&lt;/p&gt;</textarea><!-- HTML_TAG_END -->',
			);
			expectSSR(
				await (await page.locator('#with-html-nodes textarea')).inputValue(),
			).toBe('<p>foo</p><p>bar</p>');

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(
				'<textarea>&lt;p&gt;foo&lt;/p&gt;&lt;p&gt;bar&lt;/p&gt;</textarea>',
			);
			expectSSR(
				await (await page.locator('#without-html-nodes textarea')).inputValue(),
			).toBe('<p>foo</p><p>bar</p>');
		});
	});
});

test.describe('does not parse <textarea> value as html', () => {
	test.describe('with javascript', () => {
		test('with html nodes', async ({ mount, page }) => {
			const component = await mount(Html, { props: { html: html.textareaWithInvalidHtml } });
			expect(await getHtml(page)).toBe(
				'<textarea>&lt;p&gt;&lt;p&gt;foo&lt;/p&gt;&lt;/p&gt;</textarea>',
			);
			expect(await component.inputValue()).toBe('<p><p>foo</p></p>');
		});

		test('without html nodes', async ({ mount, page }) => {
			const component = await mount(Html, {
				props: { html: html.textareaWithInvalidHtml, noHtmlNodes: true },
			});
			expect(await getHtml(page)).toBe(
				'<textarea>&lt;p&gt;&lt;p&gt;foo&lt;/p&gt;&lt;/p&gt;</textarea>',
			);
			expect(await component.inputValue()).toBe('<p><p>foo</p></p>');
		});
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=textareaWithInvalidHtml');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><textarea>&lt;p&gt;&lt;p&gt;foo&lt;/p&gt;&lt;/p&gt;</textarea><!-- HTML_TAG_END -->',
			);
			expectSSR(
				await (await page.locator('#with-html-nodes textarea')).inputValue(),
			).toBe('<p><p>foo</p></p>');

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(
				'<textarea>&lt;p&gt;&lt;p&gt;foo&lt;/p&gt;&lt;/p&gt;</textarea>',
			);
			expectSSR(
				await (await page.locator('#without-html-nodes textarea')).inputValue(),
			).toBe('<p><p>foo</p></p>');
		});
	});
});

test.describe('does not escape <script> content', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.script } });

		expect(await getHtml(page)).toBe(html.script);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.script, noHtmlNodes: true } });

		expect(await getHtml(page)).toBe(html.script);
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=script');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><script>alert(1 < 2);</script><!-- HTML_TAG_END -->',
			);

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><script>alert(1 < 2);</script><!-- HTML_TAG_END -->',
			);
		});
	});
});

test.describe('does not escape <style> content', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.style } });

		expect(await getHtml(page)).toBe(html.style);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.style, noHtmlNodes: true } });

		expect(await getHtml(page)).toBe(html.style);
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=style');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><style>body > .foo { color: #f00; }</style><!-- HTML_TAG_END -->',
			);

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><style>body > .foo { color: #f00; }</style><!-- HTML_TAG_END -->',
			);
		});
	});
});

test.describe('renders void elements correctly', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.void } });

		expect(await getHtml(page)).toBe('<link><meta><img><br><hr><input>');
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.void, noHtmlNodes: true } });

		expect(await getHtml(page)).toBe('<link><meta><img><br><hr><input>');
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=void');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START --><link><meta><img><br><hr><input><!-- HTML_TAG_END -->',
			);

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe('<link><meta><img><br><hr><input>');
		});
	});
});

test.describe('skips doctype and comments', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.doctypeAndComment } });

		expect(await getHtml(page)).toBe(html.single + html.single);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, {
			props: { html: html.doctypeAndComment, noHtmlNodes: true },
		});

		expect(await getHtml(page)).toBe(html.single + html.single);
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=doctypeAndComment');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START -->' +
					html.single +
					html.single +
					'<!-- HTML_TAG_END -->',
			);

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(html.single + html.single);
		});
	});
});

test.describe('converts SVG element with viewBox attribute', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: svg.simple } });

		expect(await getHtml(page)).toBe(svg.simple);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: svg.simple, noHtmlNodes: true } });

		expect(await getHtml(page)).toBe(svg.simple);
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=simple');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe('<!-- HTML_TAG_START -->' + svg.simple + '<!-- HTML_TAG_END -->');

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(svg.simple);
		});
	});
});

test.describe('converts custom element with attributes', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Html, { props: { html: html.customElement } });

		expect(await getHtml(page)).toBe(html.customElement);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Html, {
			props: { html: html.customElement, noHtmlNodes: true },
		});

		expect(await getHtml(page)).toBe(
			'<custom-element class="myClass" custom-attribute="value" style="line-height: 1;"></custom-element>',
		);
	});

	testSSR.describe('without javascript', () => {
		testSSR.use({ javaScriptEnabled: false });

		testSSR('', async ({ page }) => {
			await page.goto('http://localhost:5173/tests?test=customElement');

			expectSSR(
				await (await page.locator('#with-html-nodes')).innerHTML(),
			).toBe(
				'<!-- HTML_TAG_START -->' +
					html.customElement +
					'<!-- HTML_TAG_END -->',
			);

			expectSSR(
				await (await page.locator('#without-html-nodes')).innerHTML(),
			).toBe(html.customElement);
		});
	});
});

test.describe('rerenders when html prop is changes dynamically', () => {
	test('with html nodes', async ({ mount, page }) => {
		await mount(Test);

		expect(await (await page.locator('#result')).innerHTML()).toBe(
			'<p class="test">foo</p>',
		);

		await (await page.locator('button')).click();

		expect(await (await page.locator('#result')).innerHTML()).toBe(
			'<div data-test="">bar</div>',
		);
	});

	test('without html nodes', async ({ mount, page }) => {
		await mount(Test, { props: { noHtmlNodes: true } });

		expect(await (await page.locator('#result')).innerHTML()).toBe(
			'<p class="test">foo</p>',
		);

		await (await page.locator('button')).click();

		expect(await (await page.locator('#result')).innerHTML()).toBe(
			'<div data-test="">bar</div>',
		);
	});
});
