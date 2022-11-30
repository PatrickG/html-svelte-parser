<script lang="ts">
	import { base } from '$app/paths';
	import GithubCorner from 'svelte-github-corner';
</script>

<GithubCorner href="https://github.com/PatrickG/html-svelte-parser" />

<nav>
	<ul>
		<li><a href="{base}/">Home</a></li>
		<li><a href="{base}/svg/">SVG</a></li>
		<li><a href="{base}/parse-on-server/">Parse on server</a></li>
	</ul>
</nav>

<main><slot /></main>
