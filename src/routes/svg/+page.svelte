<script lang="ts">
	import { Html, isTag } from '$lib/index.js';
	import Group from './Group.svelte';
	import Rect from './Rect.svelte';

	const svg1 = `<svg width="418" height="1000" viewBox="0 0 418 1000" fill="none" xmlns="http://www.w3.org/2000/svg" class="svelte-14rkii5"><rect id="Base Upper Floor" x="-286" width="1000" height="1000" fill="#EEEEEE"></rect><rect width="418" height="1000" fill="#F5F5F5"></rect><g id="test123"><g id="utilities"><g id="Phone"><path id="Vector" d="M182.387 75.2221C180.548 75.2221 179.513 76.174 179.513 78.1223V98.2081C179.513 100.031 180.441 100.985 182.28 100.985H202.39C204.227 100.985 205.158 100.077 205.158 98.2081V78.1223C205.158 76.2218 204.229 75.2221 202.332 75.2221C202.331 75.2221 182.378 75.2138 182.387 75.2221Z" fill="#A8A19D"></path><path id="Vector_2" d="M192.48 77.2381C191.484 77.3486 187.864 79.0082 187.758 87.5672C187.65 96.5814 191.484 98.4786 192.492 98.4572V92.5032C191.661 92.5032 191.498 91.5991 191.306 89.7333C191.179 88.4976 191.143 86.9699 191.306 85.4489C191.419 84.3831 191.615 83.3421 192.484 83.3421L192.48 77.2381Z" fill="white"></path><path id="Vector_3" d="M194.627 98.4671C195.008 98.4671 195.281 98.1536 195.281 97.8039L195.286 97.7989C195.286 97.7989 195.281 93.1598 195.281 93.1582C195.281 92.7886 194.987 92.4999 194.627 92.4999H192.942V98.4687L194.622 98.4704L194.627 98.4671Z" fill="white"></path><path id="Vector_4" d="M194.627 83.3405C195.008 83.3405 195.281 83.027 195.281 82.6756L195.286 82.674C195.286 82.674 195.281 77.8996 195.281 77.8963C195.281 77.5284 194.987 77.2381 194.627 77.2381H192.942V83.3421C192.942 83.3421 194.622 83.3438 194.622 83.3421H194.627V83.3405Z" fill="white"></path></g></g></g></svg>`;
	const svg2 = `<div><svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg">
  <style>
    .small {
      font: italic 13px sans-serif;
    }
    .heavy {
      font: bold 30px sans-serif;
    }

    /* Note that the color of the text is set with the    *
     * fill property, the color property is for HTML only */
    .Rrrrr {
      font: italic 40px serif;
      fill: red;
    }
  </style>

  <text x="20" y="35" class="small">My</text>
  <text x="40" y="35" class="heavy">cat</text>
  <text x="55" y="55" class="small">is</text>
  <text x="65" y="55" class="Rrrrr">Grumpy!</text>
</svg></div>`;
</script>

<Html
	html={svg1}
	processNode={node => {
		if (!isTag(node)) return;
		switch (node.name) {
			case 'rect':
				return { component: Rect, props: { attributes: node.attribs } };
			case 'g':
				if (node.parent && isTag(node.parent) && node.parent.name === 'svg')
					return { component: Group, props: { attributes: node.attribs } };
		}
	}}
/>

<Html html={svg2} />
