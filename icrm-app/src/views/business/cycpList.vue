<template>
	<div class="home">
		<nav-bar title="持有产品" type="2" leftIcon />
		<div class="placeBox" ref="placeBox">
			<div class="item titlePlace" ref="titlePlace">
				<div class="itemPlate" v-for="(titleItem,i) in titleList" :key="'tt'+i"
					:style="{width: titleItem.width+'px'}">{{titleItem.label}}</div>
			</div>
			<div style="height: 0.55rem;background-color: #F5F5F5"></div>
			<div class="item valuePlace" ref="valuePlace" v-for="(dataItem,m) in dataList" :key="'dd'+m"
				:style="{color: dataItem.colorBlack?'#262626':'#8C8C8C'}">
				<div class="itemPlate" v-for="(titleItem,n) in titleList" :key="'dt'+n"
					:style="{width: titleItem.width+'px'}">{{dataItem[titleItem.key]}}</div>
			</div>
		</div>
		<div class="bottomLine">
			<div class="bottomText">到底啦，我是有底线的</div>
		</div>
		<div class="bottomZW"></div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				titleList: [],
				dataList: [],
			}
		},
		methods: {
			handleScroll() {
				var scrollLeft = this.$refs.placeBox.pageXOffset || this.$refs.placeBox.scrollLeft;
				this.$refs.titlePlace.style.left = scrollLeft * -1 + "px";
			}
		},
		mounted() {
			var list = JSON.parse(this.$route.params.list);
			this.titleList = list.label;
			this.dataList = list.list;
			this.$refs.placeBox.addEventListener('scroll', this.handleScroll)
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

	.home {
		font-size: 0.12rem;
		background-color: #FFFFFF;
	}

	.placeBox {
		width: 100%;
		overflow: auto;
	}

	.titlePlace,
	.valuePlace {
		font-family: PingFangSC-Medium, PingFang SC;
	}

	.titlePlace {
		font-size: 0.15rem;
		font-weight: 500;
		color: #595959;
		position: fixed;
	}

	.valuePlace {
		font-size: 0.13rem;
		font-weight: 400;
	}

	.item {
		display: flex;
		flex-wrap: nowrap;
		height: 0.55rem;
		align-items: center;
		box-shadow: inset 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.08);
	}

	.item div {
		flex-shrink: 0;
		height: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		background: #FFFFFF;
		border-bottom: solid 0.01rem #F0F0F0;
	}

	.bottomLine {
		height: 0.2rem;
		width: 60%;
		margin: 0.05rem auto;
		border-bottom: solid 0.01rem #F4F4F4;
		position: relative;
		display: flex;
		justify-content: center;
	}

	.bottomText {
		font-size: 0.12rem;
		padding: 0 0.1rem;
		color: #D8D8D8;
		background-color: #FFFFFF;
		position: absolute;
		bottom: -50%;
	}
</style>
