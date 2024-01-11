<script lang="ts">
	import { Html } from '$lib/index.js';
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
