<script lang="ts">
	let {
		title,
		desc,
		checked = $bindable()
	}: { title: string; desc: string; checked?: boolean } = $props();
</script>

<div
	class="flex items-center justify-between gap-8 rounded-lg {checked
		? 'bg-white/10'
		: 'bg-white/5'} cursor-pointer px-5 py-4 text-sm/6"
	role="radio"
	aria-checked={checked}
>
	<div>
		<p class="font-semibold text-white">{title}</p>
		<div class="text-white/50">{desc}</div>
	</div>
	<div>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
			class:opacity-0={!checked}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
			/>
		</svg>
	</div>
</div>
