<script lang="ts">
	import { appendPassengersFromTagList, generateCommand, generateTagList } from '$lib/combiner';
	import BigRadio from './big-radio.svelte';
	import { onMount } from 'svelte';
	import CopyButton from './copyButton.svelte';
	let input = $state('');

	let options = $state({
		globalCoord: true,
		clearPathAhead: false,
		downwardMotion: false,
		chunkCount: 1
	});

	// auto resize input box
	let inputArea = $state<HTMLTextAreaElement>();
	$effect(() => {
		if (inputArea) {
			input;
			inputArea.style.height = 'auto';
			inputArea.style.height = inputArea.scrollHeight + 'px';
		}
	});

	onMount(() => {
		console.log('mounted');
		input =
			localStorage.getItem('commands') ||
			`# this line is a commant
setblock @{~ ~ ~} red_wool
setblock @{~1 ~ ~} yellow_wool
setblock @{~2 ~ ~} orange_wool
setblock @{~3 ~ ~} green_wool
setblock @{~4 ~ ~} blue_wool
setblock @{~5 ~ ~} purple_wool`;
	});

	$effect(() => localStorage.setItem('commands', input));

	let commandList = $derived(
		input.split('\n').filter((line) => line !== '' && !line.startsWith('#'))
	);

	let error = $state('');

	let output = $state('');
	let entityCount = $state(0);
	let eggOutput = $derived(
		`give @p parrot_spawn_egg{EntityTag:{id:falling_block,BlockState:{Name:command_block},TileEntityData:{Command:"${output.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",auto:1b}},display:{Name:'[{"text":"Cloop-in-a-box","italic":false,"bold":true,"color":"light_purple"}]'},Enchantments:[{id:sharpness}],HideFlags:1} 1`
	);

	$effect(() => {
		console.log('main processing');
		try {
			const tagList = generateTagList([
				`fill ~ ~ ~ ~ ~${commandList.length} ~ air`,
				...commandList.reverse()
			]);
			entityCount = tagList.length;
			output = `summon falling_block ~ ~1 ~ ${appendPassengersFromTagList(tagList)}`;
			// output = `summon falling_block ~ ~1 ~ {BlockState:{Name:"minecraft:spawner"},TileEntityData:{Delay:0,SpawnCount:1,SpawnPotentials:[{data:{entity:{BlockState:{Name:"minecraft:redstone_block"},Passengers:[{DeathTime:20,Health:0.0f,Motion:[0.0d,10.0d,0.0d],Passengers:[{BlockState:{Name:"minecraft:activator_rail"},Time:1,id:"minecraft:falling_block"},{Command:"/tag @e[type=minecraft:command_block_minecart,distance=..10] add kill",id:"minecraft:command_block_minecart"},{Command:'/summon falling_block ~ ~ ~-1 {BlockState:{Name:"minecraft:command_block"},TileEntityData:{auto:1b,Command:"kill @e[type=command_block_minecart,tag=kill]"},Time:1,Motion:[0.0,-10.0,0.0],Passengers:[{id:"minecraft:falling_block",BlockState:{Name:"minecraft:command_block"},TileEntityData:{auto:1b,Command:"/fill ~ ~2 ~ ~ ~-1 ~1 air"},Time:1,Motion:[0.0,-10.0,0.0]}]}',id:"minecraft:command_block_minecart"}],id:"minecraft:cow"}],Time:1,id:"minecraft:falling_block"}},weight:1}],SpawnRange:0},Time:1,id:"minecraft:falling_block"}`;
		} catch (err) {
			console.error(err);
			error = err as any;
			console.log('settting error as ' + err);
			// return null;
		}
	});

	let outputDisplays = $derived([
		{
			label: 'Full output (/summon)',
			detail: `${output?.length} / 32500 characters · ${entityCount} entities`,
			data: output ?? error ?? 'An unexpected error occured, please check browser console.'
		},
		{
			label: 'Full egg output (/give)',
			detail: `${eggOutput?.length} / 32500 characters · ${entityCount} entities`,
			data: eggOutput ?? error ?? 'An unexpected error occured, please check browser console.'
		}
	]);
</script>

<section class="mx-auto max-w-7xl px-4">
	<h1 class="mb-8 text-3xl font-bold">Minecraft Command Combiner v2</h1>
	<!-- options -->
	<div class="flex flex-col gap-6">
		<p class="text-2xl font-bold">Select Mode</p>
		<div class="flex flex-wrap gap-6">
			<BigRadio title="Tower Mode" desc="uses more vertical space · allow splitting · fancy"
			></BigRadio>
			<BigRadio title="Minecart Mode" desc="more space efficient · unfolds faster · boring"
			></BigRadio>
		</div>
		<div class="w-fit rounded-xl bg-base-200 p-4">
			<label class="label cursor-pointer">
				<span class="label-text"
					>Prepend <kbd class="kbd kbd-xs">gamerule commandBlockOutput false</kbd></span
				>
				<input type="checkbox" class="toggle ml-8" />
			</label>
			<label class="label cursor-pointer">
				<span class="label-text">Process global coordinates</span>
				<input type="checkbox" class="toggle ml-8" />
			</label>
			<label class="label cursor-pointer">
				<span class="label-text">Clear path ahead</span>
				<input type="checkbox" class="toggle ml-8" />
			</label>
			<label class="label cursor-pointer">
				<span class="label-text">Downward motion to make everything fast</span>
				<input type="checkbox" class="toggle ml-8" />
			</label>
			<label class="label cursor-pointer">
				<span class="label-text">Chunks</span>
				<input type="number" class="input input-bordered" />
			</label>
		</div>
		<!-- input -->

		<label class="form-control">
			<div class="label">
				<span class="label-text">Enter your command list</span>
			</div>
			<textarea
				bind:this={inputArea}
				class=" textarea textarea-bordered min-h-32 overflow-hidden bg-base-300 font-mono text-sm"
				placeholder="Enter one command per line (prefix a line with # to indicate comment)"
				bind:value={input}
			></textarea>
			<div class="label">
				<span class="label-text-alt">{commandList.length} commands</span>
			</div>
		</label>
	</div>

	<br />

	<!-- output -->

	<h2 class="mb-4 text-2xl font-bold">Output</h2>
	<!-- <div>
		<span class="flex items-center"
			>{output?.length} / 32500 characters
			<div
				class="tooltip"
				data-tip="Minecraft only allows maximum of 32,500 characters inside a command block."
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="my-auto ml-1 size-5"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
					/>
				</svg>
			</div>
		</span>
	</div> -->

	<div class="label">
		<div class="flex gap-2">
			<CopyButton label="Copy /summon" data={output} />
			<CopyButton label="Copy /give egg" data={eggOutput} />
		</div>
	</div>
	{#each outputDisplays as { label, detail, data }}
		<details class="collapse collapse-arrow bg-base-200">
			<summary class="collapse-title">
				<p class="font-medium">{label}</p>
				<span class="text-xs">{detail}</span>
			</summary>
			<div class="collapse-content">
				<div class="textarea textarea-bordered break-words break-all font-mono text-xs/5">
					{data}
				</div>
			</div>
		</details>
	{/each}
</section>
