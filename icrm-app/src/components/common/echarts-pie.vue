<template>
	<div class="echartsOutBox">
		<div class="echartsTitle" v-if="title">{{title}}</div>
		<div class="echartsBox" ref="echarts"></div>
		<div class="centerText">
			<div class="centerValue">{{centerText.value}}</div>
			<div class="centerTitle">{{centerText.title}}</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "echarts-pie",
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
					return ["#5F88DB", "#266B9A", "#29A488", "#62DFCE", "#FFB445", "#BDA29A"]
				}
			},
			data: {
				type: Array,
				required: true,
				default: () => {
					return []
				}
			},
			centerText: {
				type: Object,
				required: false,
				default: () => {
					return {}
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
						trigger: 'item',
						formatter: "{b} : {c}" + this.unit + " ({d}%)",
						position: [20, 80]
					},
					legend: {
						orient: 'vertical',
						// right: 0,
						// top: 30,
						itemWidth: 12,
						itemHeight: 8,
						// textStyle:{
						//  lineHeight:20,
						// },
						padding: 0,
						formatter: function(params) {
							let tip1 = "";
							let tip = "";
							let le = params.length //图例文本的长度
							if (le > 6) { //几个字换行大于几就可以了
								let l = Math.ceil(le / 6) //有些不能整除，会有余数，向上取整
								for (let i = 1; i <= l; i++) { //循环
									if (i < l) { //最后一段字符不能有\n
										tip1 += params.slice(i * 6 - 6, i * 6) + '\n'; //字符串拼接
									} else if (i === l) { //最后一段字符不一定够6个
										tip = tip1 + params.slice((l - 1) * 6, le) //最后的拼接在最后
									}
								}
								return tip;
							} else {
								tip = params //前面定义了tip为空，这里要重新赋值，不然会替换为空
								return tip;
							}
						},
						// orient : 'vertical',
						x: '66%',
						y: 'center',
						data: this.data.map((item) => {
							return item.name
						}),
						// itemWidth : 8,
						// itemHeight : 8,
						// textStyle : {
						// color : "#888888"
						// }
					},
					series: [{
						startAngle: 130,
						center: ['34%', '50%'],
						type: 'pie',
						radius: ['52%', '75%'],
						itemStyle: {
							normal: {
								borderColor: "#FFFFFF",
								borderWidth: "1",
								label: {
									show: false
								},
								labelLine: {
									show: false
								}
							},
							emphasis: {
								borderColor: "#FFFFFF",
								borderWidth: "1",
								label: {
									show: false,
								},
								labelLine: {
									show: false,
								}
							}
						},
						data: this.data
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart&&myChart.setOption(option);
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
		z-index: 1
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

	.centerText {
		position: absolute;
		width: 8%;
		height: 10%;
		top: 50%;
		left: 32%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.centerValue {
		white-space: nowrap;
		font-size: 0.16rem;
		font-weight: 600;
		line-height: 0.425rem;
		margin-top: -0.05rem;
	}

	.centerTitle {
		white-space: nowrap;
		color: #888888;
		font-size: 0.32rem;
		transform: scale(0.92);
		line-height: 0.425rem;
	}
</style>
