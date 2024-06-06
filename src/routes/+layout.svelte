<script>
	import '../app.css';
	import Footer from './footer.svelte';
</script>

<div class="py-8">
	<slot></slot>
</div>

<Footer></Footer>

<style>
	/* div {
		background: radial-gradient(circle at 1.98% 76.04%, #00d2ff33, transparent 100%),
			radial-gradient(circle at 98.02% 82.99%, #3a7bd533, transparent 100%),
			radial-gradient(circle at 50% 50%, #16c27a33, #16c27a33 100%);
	} */
</style>
