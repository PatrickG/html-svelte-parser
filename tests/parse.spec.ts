import { expect, test } from '@playwright/test';
import { isTag, isText } from 'domhandler';
import type { ComponentType } from 'svelte';
import { parse } from '../src/lib/parse.js';
import { NodeType } from '../src/lib/types.js';
import { html, svg } from './data.js';

for (const value of [
	undefined,
	null,
	{},
	[],
	true,
	false,
	0,
	1,
	() => {}, // eslint-disable-line @typescript-eslint/no-empty-function
	'date',
]) {
	test('throws error for value: ' + value, () => {
		expect(() =>
			parse((value === 'date' ? new Date() : value) as unknown as string),
		).toThrow(TypeError);
	});
}

test('parses "" to []', () => {
	expect(parse('')).toEqual({ components: [], nodes: [] });
});

for (const [name, value] of [
	['comment', html.comment],
	['doctype', html.doctype],
]) {
	test('skips ' + name, () => {
		expect(parse(value)).toEqual({ components: [], nodes: [] });
	});
}

test("returns text node if it's not HTML", () => {
	const string = 'text';
	expect(parse(string)).toEqual({
		components: [],
		nodes: [{ type: NodeType.Text, data: string }],
	});
});

test.describe('parses single HTML element with comment', () => {
	// comment should be ignored
	test('with html nodes', () => {
		expect(parse(html.single + html.comment)).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<p>foo</p>' }],
		});
	});

	test('without html nodes', () => {
		expect(parse(html.single + html.comment, { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'p',
					children: [{ type: NodeType.Text, data: 'foo' }],
				},
			],
		});
	});
});

test.describe('parses multiple HTML elements', () => {
	test('with html nodes', () => {
		expect(parse(html.multiple)).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<p>foo</p><p>bar</p>' }],
		});
	});

	test('without html nodes', () => {
		expect(parse(html.multiple, { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'p',
					children: [{ type: NodeType.Text, data: 'foo' }],
				},
				{
					type: NodeType.Tag,
					tag: 'p',
					children: [{ type: NodeType.Text, data: 'bar' }],
				},
			],
		});
	});
});

test.describe('parses textarea correctly', () => {
	test('with html nodes', () => {
		expect(parse(html.textarea)).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Html,
					data: '<textarea>&lt;p&gt;foo&lt;/p&gt;&lt;p&gt;bar&lt;/p&gt;</textarea>',
				},
			],
		});
	});

	test('without html nodes', () => {
		expect(parse(html.textarea, { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'textarea',
					children: [{ type: NodeType.Text, data: '<p>foo</p><p>bar</p>' }],
				},
			],
		});
	});
});

test.describe('parses complex HTML without doctype', () => {
	test('with html nodes', () => {
		expect(parse(html.doctype + html.complex)).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Html,
					data:
						'<html>' +
						'<head>' +
						'<meta charSet="utf-8">' +
						'<title>Title</title>' +
						'<link rel="stylesheet" href="style.css">' +
						'</head>' +
						'<body>' +
						'<header id="header">Header</header>' +
						'<h1 style="color:#000;font-size:42px">Heading</h1>' +
						'<hr>' +
						'<p>Paragraph</p>' +
						'<img src="image.jpg">' +
						'<div class="class1 class2">' +
						'Some ' +
						'<em>text</em>' +
						'.' +
						'</div>' +
						'<script>alert();</script>' +
						'</body>' +
						'</html>',
				},
			],
		});
	});

	test('without html nodes', () => {
		expect(parse(html.doctype + html.complex, { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'html',
					children: [
						{
							type: NodeType.Tag,
							tag: 'head',
							children: [
								{
									type: NodeType.Tag,
									tag: 'meta',
									attributes: { charSet: 'utf-8' },
								},
								{
									type: NodeType.Tag,
									tag: 'title',
									children: [{ type: NodeType.Text, data: 'Title' }],
								},
								{
									type: NodeType.Tag,
									tag: 'link',
									attributes: { rel: 'stylesheet', href: 'style.css' },
								},
							],
						},
						{
							type: NodeType.Tag,
							tag: 'body',
							children: [
								{
									type: NodeType.Tag,
									tag: 'header',
									attributes: { id: 'header' },
									children: [{ type: NodeType.Text, data: 'Header' }],
								},
								{
									type: NodeType.Tag,
									tag: 'h1',
									attributes: { style: 'color:#000;font-size:42px' },
									children: [{ type: NodeType.Text, data: 'Heading' }],
								},
								{ type: NodeType.Tag, tag: 'hr' },
								{
									type: NodeType.Tag,
									tag: 'p',
									children: [{ type: NodeType.Text, data: 'Paragraph' }],
								},
								{
									type: NodeType.Tag,
									tag: 'img',
									attributes: { src: 'image.jpg' },
								},
								{
									type: NodeType.Tag,
									tag: 'div',
									attributes: { class: 'class1 class2' },
									children: [
										{ type: NodeType.Text, data: 'Some ' },
										{
											type: NodeType.Tag,
											tag: 'em',
											children: [{ type: NodeType.Text, data: 'text' }],
										},
										{ type: NodeType.Text, data: '.' },
									],
								},
								{
									type: NodeType.Html, // script is always a `HtmlNode`
									data: '<script>alert();</script>',
								},
							],
						},
					],
				},
			],
		});
	});
});

test.describe('parses empty <script>', () => {
	test('with html nodes', () => {
		expect(parse('<script></script>')).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<script></script>' }],
		});
	});

	test('without html nodes', () => {
		expect(parse('<script></script>', { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{ type: NodeType.Html, data: '<script></script>' }, // script is always a `HtmlNode`
			],
		});
	});
});

test.describe('parses empty <style>', () => {
	test('with html nodes', () => {
		expect(parse('<style></style>')).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<style></style>' }],
		});
	});

	test('without html nodes', () => {
		expect(parse('<style></style>', { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{ type: NodeType.Html, data: '<style></style>' }, // style is always a `HtmlNode`
			],
		});
	});
});

test.describe('parses form', () => {
	test('with html nodes', () => {
		expect(parse(html.form)).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Html,
					data: '<input type="text" value="foo" checked="checked">',
				},
			],
		});
	});

	test('without html nodes', () => {
		expect(parse(html.form, { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'input',
					attributes: { type: 'text', value: 'foo', checked: 'checked' },
				},
			],
		});
	});
});

test.describe('parses SVG', () => {
	test('with html nodes', () => {
		expect(parse(svg.complex)).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Html,
					data:
						'<svg height="400" width="450">' +
						'<path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none"/>' +
						'<g stroke="black" stroke-width="3" fill="black">' +
						'<circle id="pointA" cx="100" cy="350" r="3"/>' +
						'</g>' +
						'<g font-size="30" font-family="sans-serif" fill="black" stroke="none" text-anchor="middle">' +
						'<text x="100" y="350" dx="-30">A</text>' +
						'</g>' +
						'Your browser does not support inline SVG.' +
						'</svg>',
				},
			],
		});
	});

	test('without html nodes', () => {
		expect(parse(svg.complex, { noHtmlNodes: true })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'svg',
					attributes: { height: '400', width: '450' },
					children: [
						{
							type: NodeType.Tag,
							tag: 'path',
							attributes: {
								id: 'lineAB',
								d: 'M 100 350 l 150 -300',
								stroke: 'red',
								'stroke-width': '3',
								fill: 'none',
							},
						},
						{
							type: NodeType.Tag,
							tag: 'g',
							attributes: {
								stroke: 'black',
								'stroke-width': '3',
								fill: 'black',
							},
							children: [
								{
									type: NodeType.Tag,
									tag: 'circle',
									attributes: { id: 'pointA', cx: '100', cy: '350', r: '3' },
								},
							],
						},
						{
							type: NodeType.Tag,
							tag: 'g',
							attributes: {
								'font-size': '30',
								'font-family': 'sans-serif',
								fill: 'black',
								stroke: 'none',
								'text-anchor': 'middle',
							},
							children: [
								{
									type: NodeType.Tag,
									tag: 'text',
									attributes: { x: '100', y: '350', dx: '-30' },
									children: [{ type: NodeType.Text, data: 'A' }],
								},
							],
						},
						{
							type: NodeType.Text,
							data: 'Your browser does not support inline SVG.',
						},
					],
				},
			],
		});
	});
});

test('transforms HTML entities into hex code in html nodes', () => {
	const encodedEntities = 'asdf &amp; &yuml; &uuml; &apos;';
	const hexCode = 'asdf &amp; &#xff; &#xfc; &apos;';
	expect(parse(`<i>${encodedEntities}</i>`)).toEqual({
		components: [],
		nodes: [{ type: NodeType.Html, data: `<i>${hexCode}</i>` }],
	});
});

test('decodes HTML entities in text nodes', () => {
	const encodedEntities = 'asdf &amp; &yuml; &uuml; &apos;';
	const decodedEntities = "asdf & ÿ ü '";
	expect(parse(`<i>${encodedEntities}</i>`, { noHtmlNodes: true })).toEqual({
		components: [],
		nodes: [
			{
				type: NodeType.Tag,
				tag: 'i',
				children: [{ type: NodeType.Text, data: decodedEntities }],
			},
		],
	});
});

test('escapes tags inside of <title> in html nodes', () => {
	expect(parse(html.title)).toEqual({
		components: [],
		nodes: [
			{
				type: NodeType.Html,
				data: '<title>&lt;em&gt;text&lt;/em&gt;&lt;b&gt;text&lt;/b&gt;</title>',
			},
		],
	});
});

test('creates text node for content of <title>', () => {
	expect(parse(html.title, { noHtmlNodes: true })).toEqual({
		components: [],
		nodes: [
			{
				type: NodeType.Tag,
				tag: 'title',
				children: [{ type: NodeType.Text, data: '<em>text</em><b>text</b>' }],
			},
		],
	});
});

test('returns component names', () => {
	expect(
		parse(html.nested, {
			processNode(node) {
				if (isTag(node) && node.name === 'em') return { component: 'Test' };
			},
		}),
	).toEqual({
		components: ['Test'],
		nodes: [
			{
				type: NodeType.Tag,
				tag: 'div',
				children: [
					{
						type: NodeType.Tag,
						tag: 'p',
						children: [
							{ type: NodeType.Text, data: 'foo ' },
							{
								type: NodeType.Component,
								component: 'Test',
								children: [{ type: NodeType.Text, data: 'bar' }],
							},
						],
					},
				],
			},
		],
	});
});

test.describe('processNode option', () => {
	test('replaces the element if a svelte component is returned and removes the element if `false` is returned', () => {
		// We can not import .svelte files here
		const component = {} as unknown as ComponentType;
		expect(
			parse(html.complex, {
				processNode(node) {
					if (isTag(node)) {
						if (node.name === 'body') return false;
						if (node.name === 'meta') return { component, props: node.attribs };
						if (node.name === 'title') {
							if (isText(node.children?.[0]))
								node.children[0].data = 'Replaced Title';
							return { component };
						}
					}
				},
			}),
		).toEqual({
			components: [component],
			nodes: [
				{
					type: NodeType.Tag,
					tag: 'html',
					children: [
						{
							type: NodeType.Tag,
							tag: 'head',
							children: [
								{
									type: NodeType.Component,
									component,
									props: { charSet: 'utf-8' },
								},
								{
									type: NodeType.Component,
									component,
									children: [{ type: NodeType.Text, data: 'Replaced Title' }],
								},
								{
									type: NodeType.Html,
									data: '<link rel="stylesheet" href="style.css">',
								},
							],
						},
					],
				},
			],
		});
	});

	test('filters tags', () => {
		expect(parse(html.nested, { filterTags: ['em'] })).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<div><p>foo </p></div>' }],
		});
	});

	test('filters attributes', () => {
		expect(parse(html.attributes, { filterAttributes: ['style'] })).toEqual({
			components: [],
			nodes: [
				{
					type: NodeType.Html,
					data: '<hr id="foo" class="bar baz" data-foo="bar">',
				},
			],
		});
	});

	test('filters event attributes', () => {
		expect(parse(html.events, { filterEventAttributes: true })).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<button>Test</button>' }],
		});
	});
});

test.describe('htmlparser2 option', () => {
	test('parses XHTML with xmlMode enabled', () => {
		// using self-closing syntax (`/>`) for non-void elements is invalid
		// which causes elements to nest instead of being rendered correctly
		// enabling htmlparser2 option xmlMode resolves this issue
		expect(parse('<ul><li/><li/></ul>', { xmlMode: true })).toEqual({
			components: [],
			nodes: [{ type: NodeType.Html, data: '<ul><li/><li/></ul>' }],
		});
	});
});
