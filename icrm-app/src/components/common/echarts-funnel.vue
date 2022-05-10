<template>
	<div class="echartsOutBox">
		<div class="echartsTitle" v-if="title">{{title}}</div>
		<div class="echartsBox" ref="echarts"></div>
	</div>
</template>

<script>
	export default {
		name: "echarts-funnel",
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
					calculable: true,
					series: [{
						name: '金字塔',
						type: 'funnel',
						x: '5%',
						y: '10%',
						width: '45%',
						y2: '10%',
						sort: 'ascending',
						itemStyle: {
							normal: {
								label: {
									position: 'right',
									textStyle: {
										fontSize: 12
									}
								},
								labelLine: {
									show: true,
									length: 8,
								}
							}
						},
						data: [{
								value: 1,
								name: '私行客户数：' + this.data.find(item => item.name == '私行客户数').value
							},
							{
								value: 2,
								name: '钻石客户数：' + this.data.find(item => item.name == '钻石客户数').value
							},
							{
								value: 3,
								name: '白金客户数：' + this.data.find(item => item.name == '白金客户数').value
							},
							{
								value: 4,
								name: '金卡客户数：' + this.data.find(item => item.name == '金卡客户数').value
							},
							{
								value: 5,
								name: '理财客户数：' + this.data.find(item => item.name == '理财客户数').value
							},
							{
								value: 6,
								name: '大众客户数：' + this.data.find(item => item.name == '大众客户数').value
							},
							{
								value: 7,
								name: '未达标客户数：' + this.data.find(item => item.name == '未达标客户数').value
							}
						]
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
		/* padding: 0.1rem 0; */
		/* margin-bottom: 0.02rem; */
		z-index: 1
	}

	.echartsTitle {
		width: 100%;
		line-height: 0.28rem;
		font-size: 0.18rem;
		font-weight: 600;
		padding-left: 0.1rem;
		text-align: left;
		margin: 0 auto 0.1rem;
	}

	.echartsBox {
		/* box-shadow: 0rem 0.01rem 0.05rem -0.02rem #888888; */
		/* border-radius: 0.05rem; */
		width: 100%;
		height: 2rem;
		margin: 0 auto;
	}
</style>
