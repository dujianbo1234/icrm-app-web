<template>
	<div class="MorningEvening">
		<!-- 顶部title -->
		<nav-bar type="2" title="晨夕会" v-if="show" />
		<nav-bar type="2" title="晨夕会" leftIcon
			:rightText="($store.state.userMsg.roleId!='00000003'&&$store.state.userMsg.roleId!='00000004'&&$store.state.userMsg.roleId!='00000008'&&$store.state.userMsg.roleId!='00000009') ? orgName : ''"
			rightColor="rgba(2, 109, 255, 1)" @back="goback" @touchRight="$refs.orgList.showPopup()" v-else />
		<!-- 日历 -->
		<div class="calendar">
			<div class="date">{{showTime.format('YYYY年MM月DD日')}}</div>
			<span class="toDay" @click="toDay">当日</span>
		</div>
		<!-- 日历选择器 -->
		<div class="arrow">
			<!-- 2022.06.24 -->
			<van-calendar ref="calendar" :default-date="defaultDate._d" :min-date="minDate" :max-date="maxDate._d"
				row-height="40" :poppable="false" teleport=".arrow" color="#026DFF" :show-confirm="false"
				:show-title="false" :show-subtitle="false" :safe-area-inset-bottom="false" :style="{ height: '3rem' }"
				@select="selectDate" />
			<!-- 分割线 -->
		</div>
		<van-empty v-if="showEmpty" style="margin-top: 0.5rem;" :image="require('../../assets/image/common_empty.png')"
			image-size="120" description="暂无记录" />
		<!-- 播放组件 -->
		<div class="playAudio" v-if="dataList.length">
			<play-audio ref="PlayAudio" :audioItem="audioItem" @selectOtherSound="selectOtherSound" />
		</div>
		<!-- 会议列表 -->
		<van-list class="vanListStyle" v-model:loading="loading" :finished="finished" finished-text=""
			@load="loadQuery">
			<van-swipe-cell v-for="(item,i) in dataList" :key="'item'+i" style="padding-bottom: 0.12rem;"
				:disabled="item.crtUsrNo != $store.state.userMsg.empno">
				<!-- 会议主题 -->
				<div class="minutesMeeting">
					<div class="card">
						<div class="title">
							<div class="label">会议主题</div>
							<div class="editBtn">{{item.crtTm}}</div>
						</div>
						<!-- input -->
						<div style="display: flex; margin: 0.1rem 0;">
							<div class="soundRecCaption">{{item.soundRecCaption}}</div>
						</div>
						<!-- 录音列表 -->
						<div class="audioList_list">
							<template v-for="(items, indexs) in item.soundList" :key="items">
								<div class="list_item" :class="audioItem == items.url ? 'list_item_a' : ''"
									@click="selectSound(items)">
									<van-icon :name="require(`@/assets/image/play-mp3.png`)" size="0.45rem" />
									<div class="list_item_title">{{`录音${indexs + 1}`}}</div>
								</div>
							</template>
						</div>
						<!-- 照片列表 -->
						<div class="photos">
							<van-uploader v-model="item.photoList" preview-size="0.5rem" :deletable="deletable"
								:readonly="true" :show-upload="false" @delete="deleteImg" />
						</div>
						<!-- 创建人 机构 -->
						<div class="creatMsg">
							<div class="creatMsgItem ycsl">创建人：{{item.crtUsrName}}</div>
							<div class="creatMsgItem ycsl">机构：{{item.belongOrgName}}</div>
						</div>
					</div>
				</div>
				<template #right>
					<div class="rightBtn">
						<div @click.stop="itemEdit(item)">
							<van-icon :name="require(`@/assets/image/eidt_icon.png`)" size="0.3rem" />
							<div class="text">修改</div>
						</div>
						<div @click.stop="itemDel1(item)">
							<van-icon :name="require(`@/assets/image/cust_zyqk_delete.png`)" size="0.3rem" />
							<div class="text">删除</div>
						</div>
					</div>
				</template>
			</van-swipe-cell>
		</van-list>
		<van-overlay :show="showDel" style="z-index: 99;">
			<div class="plate6">
				<div class="plate6_1">提示</div>
				<div class="plate6_5">是否删除会议记录？</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showDel = false">取消</div>
					<div class="palte6_4_2" @click="itemDel2">确定</div>
				</div>
			</div>
		</van-overlay>
		<!-- 选择机构组件 -->
		<org-list ref="orgList" :type="2" @activeOrg="activeOrg" />
		<!-- 新增记录 -->
		<van-icon class="addRecord" name="add" size="0.58rem" color="#026DFF" @click.stop="addNewRecord"
			v-if="addBtn&&sameDay" />
		<!-- 底部弹出 -->
		<van-popup v-model:show="show" round position="bottom" :style="{ background: '#F8F8F8' }">
			<AddNewRecord v-if="show" :type="recordType" :record="record" @clearBtn="clearBtn" />
		</van-popup>
		<!-- 这是底线 -->
		<div class="bottomLine">
			<span></span>
			<div class="bottomText">到底啦，我是有底线的</div>
			<span></span>
		</div>
	</div>
</template>

<script>
	import {
		queryMemSoundRecList,
		deleteMemSoundRec
	} from "@/request/index.js";
	import {
		Toast,
		Dialog
	} from 'vant';
	import PlayAudio from "@/components/common/PlayAudio.vue"
	import AddNewRecord from "@/views/index/addNewRecord.vue"
	import moment from 'moment';
	export default {
		name: 'MorningEvening',
		components: {
			PlayAudio,
			AddNewRecord
		},
		data() {
			return {
				orgName: '选择机构',
				dataList: [],
				show: false,
				loading: false,
				finished: true,
				pageIndex: 0,
				params: {},
				chooseItems: [],
				showBatchSend: false,
				defaultDate: moment(),
				showTime: moment(),
				minDate: new Date(2022, 5, 1), //功能上线月份
				maxDate: moment(),
				textarea: '测试内容',
				minuDisabled: true,
				audioItem: '',
				openPlay: true,
				openImg: true,
				audioList: [],
				deletable: false,
				recordType: true,
				record: {},
				addBtn: false,
				// showPlayTime: 0, // 录音总时长(毫秒)
				// totalDuration: 0
				showDel: false,
				waitDelItem: {},
				showEmpty: false,
			};
		},
		computed: {
			sameDay() {
				return this.showTime.format('YYYYMMDD') === this.maxDate.format('YYYYMMDD')
			}
		},
		created() {
			this.clickQuery()
			this.addBtn = this.$store.state.userMsg.roleId == '00000003' || this.$store.state.userMsg.roleId ==
				'00000004' || this.$store.state.userMsg.roleId == '00000008' || this.$store.state.userMsg.roleId ==
				'00000009'
		},
		methods: {
			moment,
			/* 选中日期时 */
			selectDate(value) {
				this.showTime = moment(value)
				this.clickQuery()
			},
			/* 当日 */
			toDay() {
				this.showTime = moment()
				this.$refs['calendar'].reset()
				this.clickQuery()
			},
			/* 会议记录修改 */
			itemEdit(item) {
				this.record = item
				this.recordType = false
				this.$nextTick(() => {
					this.show = true
				})
			},
			/* 关闭弹窗 */
			clearBtn(v) {
				this.show = false
				if (v) {
					this.clickQuery()
				}
			},
			/* 会议记录删除 */
			itemDel1(item) {
				this.waitDelItem = item;
				this.showDel = true;
			},
			itemDel2() {
				let body = {
					id: this.waitDelItem.id
				}
				deleteMemSoundRec(body, res => {
					this.showDel = false;
					this.clickQuery();
				})
			},
			/* 新增记录 */
			addNewRecord() {
				// if(this.dataList.length){
				//   this.$refs['PlayAudio'].init()
				// }
				this.record = {}
				this.recordType = true
				this.show = true
			},
			/* 下拉加载更多 */
			loadQuery() {
				this.pageIndex++;
				this.queryLsit()
			},
			/* 选择日期查询列表 */
			clickQuery() {
				this.pageIndex = 1
				this.dataList = []
				this.queryLsit()
			},
			/* 查询列表 */
			queryLsit(orgNo) {
				this.showEmpty = false;
				if (window.recordsAudio) {
					window.recordsAudio.pause();
				}

				this.finished = false;
				this.loading = true;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				let body = {
					belongOrg: orgNo || '',
					crtTm: moment(this.showTime).format('YYYY-MM-DD'),
					pageNum: this.pageIndex.toString(),
					pageSize: '10'
				}
				queryMemSoundRecList(body, res => {
					if (res && res.data) {
						this.dataList = this.dataList.concat(res.data.records || []);
						this.dataList.forEach(item => {
							if (item.soundList instanceof Array) {
								item.soundList.forEach(i => {
									i.url = `${this.$store.state.baseUrl}${i.fileServerPath}`
								})
							} else {
								item.soundList = []
							}
							if (item.photoList instanceof Array) {
								item.photoList.forEach(i => {
									i.url = `${this.$store.state.baseUrl}${i.fileServerPath}`
								})
							} else {
								item.photoList = []
							}
						})
						if (this.dataList.length >= res.data.total) this.finished = true;
						this.$nextTick(() => {
							this.showEmpty = this.dataList.length <= 0;
						})
					} else {
						this.finished = true
					}
					Toast.clear();
				})
			},
			/* 选择机构 */
			activeOrg(value) {
				this.orgName = value.text || '选择机构';
				this.pageIndex = 1;
				this.dataList = [];
				this.queryLsit(value.value);
			},
			/* 选择录音 */
			selectSound(item) {
				if (this.audioItem) {
					window.recordsAudio.pause();
				}
				this.audioItem = item.url
				this.$nextTick(() => {
					this.$refs['PlayAudio'].init();
				})
			},
			/* 切换录音 */
			selectOtherSound(type) {
				var index1 = "",
					index2 = "";
				for (var i = 0; i < this.dataList.length; i++) {
					index2 = this.dataList[i].soundList.findIndex(item => item.url === this.audioItem);
					if (index2 >= 0) {
						index1 = i;
						break;
					}
				}
				switch (type) {
					case "R":
						if (index2 <= 0) {
							Toast('已是第一条录音!');
							return;
						} else {
							this.selectSound(this.dataList[index1].soundList[index2 - 1]);
						}
						break;
					case "A":
						if (index2 >= this.dataList[index1].soundList.length - 1) {
							Toast('已是最后一条录音!');
							return;
						} else {
							this.selectSound(this.dataList[index1].soundList[index2 + 1]);
						}
						break;
				}
			},
			/* 返回路由时触发 */
			goback() {
				window.recordsAudio.pause();
			},
			/**
			 * 选择录音
			 */
			chooseRecord() {
				// this.recordPlay = false;
				// this.showPlayTime = 0;
				// this.recordPlaying = this.recordList[i];
				window.recordsAudio = new Audio();
				window.recordsAudio.src = this.audioItem;
				// this.totalDuration = window.recordsAudio.duration
				// window.recordsAudio.ontimeupdate = ()=>{
				//   this.showPlayTime = this.resetTime(window.recordsAudio.currentTime)
				// };
				// window.recordsAudio.onended = ()=>{this.recordPS()};
			},
			/**
			 * 时间格式转换
			 */
			// resetTime(time){
			//   let result = parseInt(time)
			//   let m = Math.floor((result / 60));
			//   let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
			//   let newTime = `${m}:${s}`;
			//   return newTime;
			// },
			/**
			 * 录音播放与暂停
			 */
			// recordPS(){
			//   // this.recordPlay = !this.recordPlay;
			//   if(this.recordPlay){
			//     window.recordsAudio.play()
			//   }else{
			//     window.recordsAudio.pause()
			//   };
			// },
		},
	};
</script>
<style scoped>
	* {
		box-sizing: border-box;
	}
</style>
<style lang="less" scoped>
	.MorningEvening {
		.card {
			background: #fff;
			padding: 0.12rem;
			border-radius: 0.08rem;
			border: 0.005rem solid #E5E5E5;
		}

		.calendar {
			position: relative;
			padding: 0.12rem;
			font-size: 0.15rem;
			text-align: center;
			border: 0.005rem solid #E5E5E5;
			background: #fff;

			.date {
				margin: 0 auto;
				color: #1D70F5;
			}

			.toDay {
				position: absolute;
				right: 0.12rem;
				top: 50%;
				transform: translateY(-50%);
				color: #1D70F5;
			}
		}

		.arrow {
			background: #fff;
			border-radius: 0 0 0.08rem 0.08rem;

			&:deep(.van-calendar__selected-day) {
				width: 0.24rem;
				height: 0.24rem;
				border-radius: 50%;
			}
		}

		.title {
			// background: pink;
			display: flex;
			justify-content: space-between;
			// padding: 0.12rem;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;

			.label {
				font-size: 0.15rem;
				color: #222222;
			}

			.editBtn {
				font-size: 0.14rem;
				color: #666666;
			}
		}

		.playAudio {
			margin: 0.12rem 0;
		}

		.vanListStyle {
			// padding: 1.83rem 0.12rem 0;
			max-width: 100%;
			overflow: hidden;

			// .custItem {
			// 	width: 100%;
			// 	margin: 0.12rem auto;
			// 	background: #FFFFFF;
			// 	// box-shadow: 0 0.02rem 0.2rem 0 rgba(217, 229, 242, 0.6);
			// 	border-radius: 0.08rem;
			// 	// padding: 0.12rem;
			// 	position: relative;
			// 	transition: margin-left 0.3s;
			// 	.leftCheckBox {
			// 		width: 0.2rem;
			// 		height: 0.2rem;
			// 		flex-shrink: 0;
			// 		position: absolute;
			// 		top: 50%;
			// 		left: -10%;
			// 		transform: translateY(-50%);
			// 		display: flex;
			// 		justify-content: flex-end;
			// 	}
			// }
			.minutesMeeting {
				.audioList_list {
					display: flex;
					justify-content: flex-start;

					.list_item {
						width: 0.88rem;
						height: 1.02rem;
						display: flex;
						flex-wrap: wrap;
						align-items: center;
						justify-content: center;
						font-size: 0.15rem;
						color: #131313;
						padding: 0.12rem 0;

						.list_item_title {
							width: 0.88rem;
							font-size: 0.15rem;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
						}
					}

					.list_item:nth-child(2) {
						margin: 0 calc(calc(100% - 2.64rem) / 2);
					}

					.list_item_a {
						border-radius: 0.04rem;
						border: 0.01rem solid #026DFF;
						border-radius: ;
						color: #026DFF;
					}
				}

				.photos {
					display: flex;
					padding: 0.12rem 0 0.12rem 0.0425rem;

					&:deep(.van-uploader__preview) {
						margin-bottom: 0;
					}
				}

				.creatMsg {
					display: flex;

					.creatMsgItem {
						width: 50%;
						font-size: 0.15rem;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						text-align: left;
						color: #595959;
					}
				}
			}

			.rightBtn {
				height: 100%;
				padding: 0 0.4rem;
				display: flex;
				align-items: center;

				div:first-child {
					padding-right: 0.35rem;
				}

				&>div {
					font-size: 0.09rem;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #262626;

					.text {
						font-size: 0.09rem;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #262626;
					}
				}
			}
		}

		// .meetingPhotos {
		//   .imgContent {
		//     background: #fff;
		//     border-radius: 0.08rem;
		//     border: 0.005rem solid #E5E5E5;
		//     padding: 0.11rem 0 0 0.11rem;
		//     width: 100%;
		//     display: flex;
		//     &:deep(.van-uploader__preview){
		//       margin: 0 0.11rem 0.11rem 0;
		//     }
		//     &:deep(.van-uploader__upload){
		//       background: #fff;
		//     }
		//   }
		// }
		.addRecord {
			position: fixed;
			bottom: 0.645rem;
			right: 0.12rem;
			z-index: 99;
			// background: #fff;
			// border-radius: 50%;
		}

		.bottomLine {
			width: 60%;
			margin: 0.5rem auto 0.35rem;
			padding-bottom: 0.2rem;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&>span {
				width: 10.7%;
				height: 0.005rem;
				opacity: 0.7;
				border-top: 0.005rem solid rgba(191, 191, 191, 1);
			}

			.bottomText {
				margin: 0 2.7%;
				font-size: 0.12rem;
				padding: 0 0.1rem;
				color: #BFBFBF;
			}
		}
	}

	.plate6 {
		width: 74.7%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		position: absolute;
		top: calc(50% - 1rem);
		left: 12.65%;
		padding: 0.2rem 0.12rem;
	}

	.plate6_1 {
		width: 100%;
		height: 0.22rem;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 500;
		margin-bottom: 0.24rem;
	}

	.plate6_4 {
		width: 100%;
		height: 0.3rem;
		margin-top: 0.24rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
	}

	.palte6_4_1 {
		width: 1.08rem;
		height: 0.3rem;
		border: 0.01rem solid #026DFF;
		border-radius: 0.15rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #026DFF;
		text-align: center;
		line-height: 0.3rem;
		font-weight: 500;
	}

	.palte6_4_2 {
		width: 1.08rem;
		height: 0.3rem;
		background: #026DFF;
		border-radius: 0.15rem;
		font-family: PingFangSC-Medium;
		font-size: 0.13rem;
		color: #FFFFFF;
		text-align: center;
		line-height: 0.3rem;
		font-weight: 500;
	}

	.plate6_5 {
		width: 100%;
		font-family: PingFangSC-Medium;
		font-size: 0.14rem;
		color: #262626;
		text-align: center;
		line-height: 0.22rem;
		font-weight: 400;
		margin-bottom: 0.28rem;
		margin-top: 0.15rem;
	}

	.soundRecCaption {
		width: 100%;
		text-align: left;
		min-height: 1rem;
		padding: 0.05rem 0.12rem;
		border-radius: 0.06rem;
		border: 0.01rem solid #E5E5E5;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.25rem;
		word-break: break-all; // 只对英文起作用，以字母作为换行依据。
		word-wrap: break-word; // 只对英文起作用，以单词作为换行依据。
		white-space: pre-wrap; // 只对中文起作用，强制换行。
	}
</style>
