<script lang="ts">
	import { appendPassengersFromTagList, generateCommand, generateTagList } from '$lib/combiner';
	import { onMount } from 'svelte';
	import CopyButton from './copyButton.svelte';
	import RadioGroup from './modeSelector.svelte';
	import ModeSelector from './modeSelector.svelte';
	import { options, reset, optionError } from '$lib/stores';
	let input = $state('');

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
			`# this line is a comment
# here are sample commands to place colored wools on the ground
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
		`give @p axolotl_spawn_egg{EntityTag:{id:falling_block,BlockState:{Name:command_block},TileEntityData:{Command:"${output.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",auto:1b}},display:{Name:'[{"text":"Cloop-in-a-box","italic":false,"bold":true,"color":"light_purple"}]'},Enchantments:[{id:sharpness}],HideFlags:1} 1`
	);

	$effect(() => {
		console.log('main processing');
		try {
			const tagList = generateTagList([
				`fill ~ ~-1 ~ ~ ~${commandList.length} ~ air`,
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
			label: 'Click to show full output (/summon)',
			detail: `${output?.length} / 32500 characters · ${entityCount} entities`,
			data: output ?? error ?? 'An unexpected error occured, please check browser console.'
		},
		{
			label: 'Click to show full egg output (/give)',
			detail: `${eggOutput?.length} / 32500 characters · ${entityCount} entities`,
			data: eggOutput ?? error ?? 'An unexpected error occured, please check browser console.'
		}
	]);
</script>

<section class="mx-auto max-w-7xl px-4">
	<h1 class="mb-4 text-3xl font-bold">Minecraft Command Combiner v2</h1>
	<!-- options -->
	<div class="flex flex-col gap-6">
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

		<div>
			<p class="text-2xl font-bold">Select Mode</p>
			<span class="text-sm text-accent">just select one and try it out in game</span>
		</div>

		<ModeSelector bind:mode={$options.mode} />

		{#if $options.mode === 'tower'}
			<div class="flex items-center gap-4">
				<p class="text-xl font-bold">Configuration</p>
				<button class="btn btn-outline btn-error btn-sm" onclick={reset}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
					Reset
				</button>
			</div>

			{#if $optionError}
				<div role="alert" class="alert alert-warning">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6 shrink-0 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/></svg
					>
					<span>{$optionError}</span>
				</div>
			{/if}

			<div
				class="grid-flow grid w-fit grid-cols-1 gap-6 rounded-xl bg-base-200 p-4 sm:grid-cols-2 xl:grid-cols-3"
			>
				<label class="label cursor-pointer">
					<span class="label-text"
						>Run <kbd class="kbd kbd-xs">gamerule commandBlockOutput false</kbd> before everything else</span
					>
					<input type="checkbox" class="toggle ml-8" bind:checked={$options.prependGamerule} />
				</label>

				<label class="label cursor-pointer">
					<span class="label-text">Process global coordinates</span>
					<input type="checkbox" class="toggle ml-8" bind:checked={$options.globalCoords} />
				</label>

				<label class="label cursor-pointer">
					<div class="flex flex-col">
						<span class="label-text">Clear path ahead</span>
						<span class="mt-1 text-xs/4 text-accent"
							>Add a pre-tower to clear blocks above the spawn point</span
						>
					</div>
					<input type="checkbox" class="toggle ml-8" bind:checked={$options.clearSky} />
				</label>

				<label class="label cursor-pointer">
					<div class="flex flex-col">
						<span class="label-text">Downward motion to make everything fast</span>
						<span class="mt-1 text-xs/4 text-accent"
							>Add <code class="kbd kbd-xs">Motion</code> tag to make blocks fall way faster</span
						>
					</div>
					<input type="checkbox" class="toggle ml-8" bind:checked={$options.downMotion} />
				</label>

				<label class="label cursor-pointer">
					<div class="flex flex-col">
						<span class="label-text">Chunks</span>
						<span class="mt-1 text-xs/4 text-accent"
							>Splits command into multiple round of /summon to overcome entity limit in some server
							configurations</span
						>
					</div>
					<input
						type="number"
						class="input input-sm input-bordered ml-8 flex w-14 items-center text-right"
						bind:value={$options.chunks}
						min="1"
					/>
				</label>

				<div class="label">
					<div class="flex flex-col">
						<span class="label-text">Offset</span>
					</div>
					<div class="flex gap-2">
						<label class="input input-sm input-bordered flex items-center">
							X:
							<input type="number" class="w-10 text-right" bind:value={$options.offsetX} />
						</label>
						<label class="input input-sm input-bordered flex items-center">
							Y:
							<input type="number" class="w-10 text-right" bind:value={$options.offsetY} />
						</label>
						<label class="input input-sm input-bordered flex items-center">
							Z:
							<input type="number" class="w-10 text-right" bind:value={$options.offsetZ} />
						</label>
						<!-- <label class="input input-sm input-bordered flex w-20 items-center pr-0">
							Y
							<input type="number" class="text-right" placeholder="" />
						</label>
						<label class="input input-sm input-bordered flex w-20 items-center pr-0">
							Z
							<input type="number" class="text-right" placeholder="" />
						</label> -->
					</div>
				</div>
			</div>
		{:else if $options.mode === 'minecart'}
			coming soon :)
		{/if}
		<!-- input -->
	</div>

	{#if $options.mode === 'tower' && !$optionError}
		<div class="divider my-12">Grab the output and enjoy!</div>

		<!-- <p class="text-2xl font-bold">Egg (optional)</p> -->

		<!-- output -->
		<section id="output">
			<h2 class="mb-4 text-2xl font-bold">Output</h2>

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
	{/if}
</section>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
