<template>
	<div class="echartsOutBox">
		<div class="echartsTitle" v-if="title">{{title}}</div>
		<div class="echartsBox" ref="echarts"></div>
	</div>
</template>

<script>
	export default {
		name: "echarts-line",
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
					return ["#C23431", "#2D4456", "#62A0A8", "#D71C29", "#FFB445", "#BDA29A"]
				}
			},
			data: {
				type: Array,
				required: true,
				default: () => {
					return []
				}
			},
			date: {
				type: Array,
				required: false,
				default: () => {
					return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10']
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
				var selected = {};
				for (var i = 0; i < this.data.length; i++) {
					if (i == 0) {
						selected[this.data[i].name] = true;
					} else {
						selected[this.data[i].name] = false;
					}
				}
				for (let item of this.data) {
					selected[item.name]
				}
				var myChart = this.$echarts.init(this.$refs.echarts);
				// 指定图表的配置项和数据
				var option = {
					color: this.color,
					tooltip: {
						trigger: 'axis',
					},
					legend: {
						orient: 'horizontal',
						x: 'center',
						y: '85%',
						data: this.data.map((item) => {
							return item.name
						}),
						selected,
						itemWidth: 16,
						itemHeight: 8,
						padding: 0,
						// itemGap:5
					},
					grid: {
						x: '18%',
						y: '12%',
						x2: '8%',
						y2: '35%'
					},
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: this.date,
						axisLabel: {
							show: true,
							rotate: 60, //角倾斜显示
						},
					}],
					yAxis: [{
						type: 'value',
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						scale: true,
						axisLabel: {
							formatter: '{value}' + this.unit
						}
					}],
					series: this.data.map((item) => {
						return {
							name: item.name,
							type: 'line',
							symbol: 'emptyCircle',
							// itemStyle : {normal: {areaStyle: {type: 'default'}}},
							data: item.value
						}
					})
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
		height: 3rem;
		margin: 0 auto;
		padding-bottom: 0.1rem;
	}
</style>
