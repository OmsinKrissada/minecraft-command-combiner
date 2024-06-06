<script lang="ts">
	let { label, data }: { label: string; data: string } = $props();

	let showChecked = $state(false);
	let timeout: number | null = null;

	function handleClick() {
		navigator.clipboard.writeText(data);
		showChecked = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			showChecked = false;
			timeout = null;
		}, 1000);
	}
</script>

<button onclick={handleClick} class="btn btn-outline flex items-center gap-2">
	{label}
	<span class="swap {showChecked ? 'swap-active' : ''}">
		<svg xmlns="http://www.w3.org/2000/svg" class="swap-on w-6 fill-current" viewBox="0 0 24 24"
			><title>clipboard-check-outline</title><path
				d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7.5,13.5L9,12L11,14L15.5,9.5L17,11L11,17L7.5,13.5Z"
			/>
		</svg>
		<svg xmlns="http://www.w3.org/2000/svg" class="swap-off w-6 fill-current" viewBox="0 0 24 24"
			><title>clipboard-outline</title><path
				d="M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7Z"
			/>
		</svg>
	</span>
</button>
