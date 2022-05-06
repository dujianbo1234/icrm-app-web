<template>
	<div class="echartsOutBox">
		<div class="echartsTitle" v-if="title">{{title}}</div>
		<div class="echartsBox" ref="echarts"></div>
	</div>
</template>

<script>
	export default {
		name: "echarts-bar",
		props: {
			title: {
				type: String,
				required: false,
				default: () => {
					return ""
				}
			},
			color: {
				type: Array,
				required: false,
				default: () => {
					return ["#5F88DB", "#266B9A", "#29A488", "#62DFCE", "#FFB445", "#BDA29A", "#5F88DB", "#266B9A"]
				}
			},
			data: {
				type: Array,
				required: true,
				default: () => {
					return []
				}
			},
			unit: {
				type: String,
				required: false,
				default: () => {
					return ""
				}
			},
		},
		data() {
			return {

			}
		},
		methods: {
			drawEcharts() {
				var myChart = this.$echarts.init(this.$refs.echarts);
				// 指定图表的配置项和数据
				var option = {
					color: this.color,
					tooltip: {
						trigger: 'axis',
						formatter: "{c}" + this.unit,
						// position: [20,80],
						axisPointer: {
							type: 'shadow'
						}
					},
					grid: {
						top: 20,
						bottom: 30
					},
					xAxis: {
						type: 'value',
						position: 'bottom',
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						}
					},
					yAxis: {
						type: 'category',
						axisLine: {
							show: true
						},
						axisLabel: {
							show: false
						},
						axisTick: {
							show: false
						},
						splitLine: {
							show: true
						},
						data: this.data.map(item => item.name)
					},
					series: [{
						type: 'bar',
						label: {
							show: true,
							formatter: '{b}'
						},
						data: this.data.map(item => item.value)
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart && myChart.setOption(option);
			}
		}
	}
</script>

<style scoped>
	.echartsOutBox {
		background-color: #FFFFFF;
		width: 100%;
		position: relative;
		padding: 0.1rem 0;
		margin-bottom: 0.02rem;
		z-index: 1;
	}

	.echartsTitle {
		width: 88%;
		line-height: 0.28rem;
		font-size: 0.18rem;
		font-weight: 600;
		padding-left: 0.1rem;
		text-align: left;
		margin: 0 auto 0.1rem;
	}

	.echartsBox {
		box-shadow: 0rem 0.01rem 0.05rem -0.02rem #888888;
		border-radius: 0.05rem;
		width: 88%;
		height: 2rem;
		margin: 0 auto;
	}
</style>
