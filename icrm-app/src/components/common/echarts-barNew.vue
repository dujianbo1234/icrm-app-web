<template>
	<!-- 柱状图组件 -->
	<div class="echarts-barNew">
		<div class="echarts" ref="echart"></div>
		<div class="title">
			<div class="top">
				<span class="timeText" v-if="timeUnit == 0">{{moment(axisValue).format('YYYY-MM-DD')}}</span>
				<span class="timeText" v-else>{{moment(axisValue).format('YYYY-MM')}}</span>
			</div>
			<div class="bottom">
				<span class="left">
					{{yName}}:
					<span
						:style="{'color': currentNum > 0 ? 'red' : (currentNum < 0 ? '#37cd37' : '#8C8C8C') }">{{`${currentNum > 0 ? '+' : ''}${numFliter(currentNum)}${unit}`}}</span>
				</span>
				<span class="right" v-if="numType != 'no'">{{numType}}：<span
						class="text">{{unit == '万元' ? numFliter(pepoe) : pepoe}}{{numUnit}}</span></span>
			</div>
		</div>
		<span class="time">{{['日期','月份'][timeUnit]}}</span>
	</div>
</template>

<script>
	import moment from "moment"
	export default {
		name: "echarts-barNew",
		props: {
			dataDate: String,
			barData: {
				type: Object,
				default: () => {
					return {
						xAxis: [],
						series: []
					}
				}
			},
			timeUnit: Number,
			yName: {
				type: String,
				default: '增长人数'
			},
			unit: {
				type: String,
				default: '人'
			},
			numType: {
				type: String,
				default: '客户总数'
			},
			numUnit: {
				type: String,
				default: ''
			}
		},
		watch: {
			barData(newData, oldData) {
				this.initData(newData.xAxis, newData.series)
			}
		},
		data() {
			return {
				currentNum: 0,
				axisValue: moment(),
				pepoe: 0,
				option: {
					tooltip: {
						show: true,
						trigger: 'axis',
						padding: [0, 2.5],
						formatter: params => {
							this.axisValue = params[0].data.time
							this.currentNum = params[0].value
							this.pepoe = params[0].data.totalBalance
							let string =
								`<div style="display: flex;justify-content: space-between;align-items: center;">
              <span style="width: 0.05rem; height: 0.05rem; border-radius: 50%; background: ${params[0].color}; margin-right: 0.06rem"></span>
              <span>${this.unit == '人' ? params[0].value : this.numFliter(params[0].value) }${this.unit}</span>
            </div>`
							return string
						},
						axisPointer: {
							type: 'cross',
							snap: true,
							label: {
								show: false
							}
						},
					},
					grid: {
						left: '0%',
						right: 20,
						top: '20%',
						bottom: '3%',
						containLabel: true, // 是否包含XY轴的文字
					},
					axisLabel: {
						show: true,
						color: "#8C8C8C"
					},
					xAxis: {
						type: "category",
						axisLine: {
							show: true,
							lineStyle: {
								type: 'dashed',
								color: '#8C8C8C'
							}
						},
						axisTick: {
							show: false
						},
						data: [],
					},
					yAxis: {
						type: "value",
						// name: this.yName,
						nameTextStyle: {
							color: '#8C8C8C',
							// align: "center"
						},
						splitLine: {
							lineStyle: {
								type: 'dashed', //虚线
							},
							show: true //隐藏
						}
					},
					series: [{
						type: "bar",
						data: [],
					}, ],
				}
			};
		},
		created() {
			this.$nextTick(() => {
				this.initData(this.barData.xAxis, this.barData.series)
			})
		},
		methods: {
			moment,
			initData(xAxis, series) {
				if(series){
					let myChart = this.$echarts.init(this.$refs.echart);
					// 使用刚指定的配置项和数据显示图表
					this.option.xAxis.data = xAxis
					this.option.series[0].data = this.setNum(series)
					// myChart.clear()
					myChart && myChart.setOption(this.option);
				}
			},
			/* 判断每条数据显示的颜色 */
			setNum(arr) {
				let newArr = []
				arr.forEach((item, index) => {
					let obj = {
						value: item.value,
						time: item.time,
						totalBalance: item.totalBalance,
						itemStyle: {
							color: item.value < 0 ? '#8C8C8C' : '#026DFF'
						}
					}
					newArr.push(obj)
					// 初始化顶部展示数据日期
					if (moment(item.time).format('YYYY-MM') == moment(this.dataDate).format('YYYY-MM')) {
						switch (this.timeUnit) {
							case 0:
								if (moment(item.time).format('YYYY-MM-DD') == moment(this.dataDate).format(
										'YYYY-MM-DD')) {
									this.axisValue = item.time
									this.currentNum = item.value // 较上日
									this.pepoe = item.totalBalance // 总数
								}
								break;
							case 1:
								if (moment(item.time).format('YYYY-MM') == moment(this.dataDate).format(
									'YYYY-MM')) {
									this.axisValue = item.time
									this.currentNum = item.value // 较上日
									this.pepoe = item.totalBalance // 总数
								}
								break;
						}
					} else {
						if (index == arr.length - 1) {
							this.axisValue = item.time
							this.currentNum = item.value // 较上日
							this.pepoe = item.totalBalance // 总数
						}
					}
				})
				return newArr
			},
			numFliter(value, tip) {
				if (value == undefined && value == NaN) {
					return '0'
				}
				value = this.unit == "元" ? Number(value).toFixed(2) : Number(value).toFixed(0)
				let n = value.toString().split('.')
				let z = /\d{1,3}(?=(\d{3})+$)/g
				let b = Number(value) > 0 && tip ? '+' : ''
				if (value.toString().indexOf('.') >= 0) {
					return `${b}${n[0].replace(z, '$&,')}.${n[1]}`
				} else {
					return `${b}${value.toString().replace(z, '$&,')}`
				}
			},
		},
	};
</script>
<style lang="less" scoped>
	.echarts-barNew {
		position: relative;
		width: 100%;
		height: 1.87rem;
		padding: 0;
		margin-bottom: 0.02rem;
		z-index: 1;

		.echarts {
			width: 100%;
			height: 100%;
		}

		.title {
			position: absolute;
			top: -10%;
			left: 0;
			padding-right: 0.1rem;

			.top {
				text-align: left;
				margin-bottom: 0.06rem;
				font-size: 0.12rem;

				.timeText {
					padding: 0.02rem 0.08rem;
					background: rgba(2, 109, 255, 0.08);
					border-radius: 0.04rem;
					color: #595959;
					letter-spacing: 0;
					margin: auto 0;
				}
			}

			.bottom {
				display: flex;
				justify-content: space-between;

				&>span {
					padding: 0.02rem 0.08rem;
					background: rgba(2, 109, 255, 0.08);
					border-radius: 0.04rem;
					color: #595959;
					letter-spacing: 0;
					margin: auto 0;
				}

				.left {
					font-size: 0.12rem;
					margin-right: 0.1rem;
				}

				.right {
					font-size: 0.12rem;

					.text {
						font-size: 0.1rem;
					}
				}
			}
		}

		.time {
			position: absolute;
			bottom: -3.5%;
			right: 2%;
			color: #8C8C8C;
			font-size: 0.1rem
		}
	}
</style>
