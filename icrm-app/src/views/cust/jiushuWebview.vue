<template>
	<div>
		<nav-bar :title="title" type="2" leftIcon />
		<div class="iframeBox">
			<iframe class="iframeCard" :src="url" id="mobsf" frameborder="0"></iframe>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				title: "九数",
				url: "",
			}
		},
		methods: {

		},
		mounted() {
			this.title = this.$route.params.title;
			this.url = this.$route.params.url;
		}
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.iframeBox {
		width: 100%;
		height: calc(100vh - calc(constant(safe-area-inset-top) + 0.46rem) - constant(safe-area-inset-bottom));
		height: calc(100vh - calc(env(safe-area-inset-top) + 0.46rem) - env(safe-area-inset-bottom));
	}

	.iframeCard {
		width: 100%;
		height: 100%;
	}
</style>
