<script lang="ts">
	type Modes = 'tower' | 'minecart' | undefined;

	let { mode: selectedMode = $bindable() }: { mode: Modes } = $props();

	const modes: { title: string; detail: string; id: Modes }[] = [
		{
			title: 'Tower Mode',
			detail: 'uses more space · allow splitting · fancy',
			id: 'tower'
		},
		{ title: 'Minecart Mode', detail: 'may break with lot of commands · boring', id: 'minecart' }
	];
</script>

<div class="flex flex-wrap gap-6" role="radiogroup">
	{#each modes as mode}
		<button
			class="flex w-full items-center justify-between gap-8 rounded-sm sm:w-auto {mode.id ===
			selectedMode
				? 'bg-white/15'
				: 'bg-white/5'} hover:bg-white-10 px-5 py-4 text-sm/6 transition-colors"
			role="radio"
			aria-checked={mode.id === selectedMode}
			onclick={() =>
				selectedMode === mode.id ? (selectedMode = undefined) : (selectedMode = mode.id)}
		>
			<div class="text-left">
				<p class="font-semibold text-white">{mode.title}</p>
				<div class="text-white/50">{mode.detail}</div>
			</div>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
					class:opacity-0={mode.id !== selectedMode}
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
					/>
				</svg>
			</div>
		</button>
	{/each}
	<!-- <BigRadio title="Tower Mode" desc="uses more vertical space · allow splitting · fancy" checked
	></BigRadio>
	<BigRadio title="Minecart Mode" desc="may break with lot of commands · boring"></BigRadio> -->
</div>
