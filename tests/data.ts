export const html = {
	single: '<p>foo</p>',
	multiple: '<p>foo</p><p>bar</p>',
	nested: '<div><p>foo <em>bar</em></p></div>',
	attributes:
		'<hr id="foo" class="bar baz" style="background:#fff;text-align:center" data-foo="bar"/>',
	events: `<button onclick="location.href = '/'">Test</button>`,
	complex:
		'<html><head><meta charSet="utf-8"/><title>Title</title><link rel="stylesheet" href="style.css"/></head><body><header id="header">Header</header><h1 style="color:#000;font-size:42px">Heading</h1><hr/><p>Paragraph</p><img src="image.jpg"/><div class="class1 class2">Some <em>text</em>.</div><script>alert();</script></body></html>',
	textarea: '<textarea><p>foo</p><p>bar</p></textarea>',
	textareaWithInvalidHtml: '<textarea><p><p>foo</p></p></textarea>',
	script: '<script>alert(1 < 2);</script>',
	style: '<style>body > .foo { color: #f00; }</style>',
	img: '<img src="http://stat.ic/img.jpg" alt="Image"/>',
	void: '<link/><meta/><img/><br/><hr/><input/>',
	comment: '<!-- comment -->',
	doctype: '<!DOCTYPE html>',
	doctypeAndComment: '<!DOCTYPE html><p>foo</p><!-- comment --><p>foo</p>',
	title: '<title><em>text</em><b>text</b></title>',
	customElement:
		'<custom-element class="myClass" custom-attribute="value" style="-o-transition: all .5s; line-height: 1;"></custom-element>',
	form: '<input type="text" value="foo" checked="checked">',
};

export const svg = {
	simple: '<svg viewBox="0 0 512 512" id="foo">Inner</svg>',
	complex:
		'<svg height="400" width="450"><path id="lineAB" d="M 100 350 l 150 -300" stroke="red" stroke-width="3" fill="none"></path><g stroke="black" stroke-width="3" fill="black"><circle id="pointA" cx="100" cy="350" r="3"></circle></g><g font-size="30" font-family="sans-serif" fill="black" stroke="none" text-anchor="middle"><text x="100" y="350" dx="-30">A</text></g>Your browser does not support inline SVG.</svg>',
};
