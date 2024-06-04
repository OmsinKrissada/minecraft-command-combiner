<script lang="ts">
	import { generateCommand } from '$lib/combiner';
	let input = $state('');

	let parsed = $derived(parse(input));
	function parse(text: string) {
		return text.split('\n').filter((line) => line !== '' && !line.startsWith('#'));
	}
</script>

<h1>Minecraft Command Combiner v1.2</h1>

<input type="checkbox" name="" id="" />

<h2>Input</h2>
<textarea name="" id="" bind:value={input}></textarea>

<h2>Output</h2>
<p>{generateCommand(parsed)}</p>
