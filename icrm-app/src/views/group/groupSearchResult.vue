<template>
	<div>
		<nav-bar title="条件群组" type="2" leftIcon />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				filterArr:[]
			}
		},
		methods: {
			
		},
		mounted() {
			this.filterArr = JSON.parse(this.$route.params.filterArr)
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
</style>
