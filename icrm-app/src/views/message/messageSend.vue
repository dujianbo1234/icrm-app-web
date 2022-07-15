<template>
	<div class="home">
		<nav-bar type="2" title="短信审批列表" leftIcon />
		<div class="totalPlace">
			<span class="totalPlace1">筛选结果：共{{total}}条数据</span>
			<span class="totalPlace2" v-if="openPLSP" @click="cancleCheck">取消审批</span>
			<span class="totalPlace2" v-else @click="checked=[];openPLSP=true;">批量审批</span>
		</div>
		<div class="topZW"></div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" class="vanList">
			<van-checkbox-group v-model="checked" ref="checkboxGroup">
				<div v-for="(msgItem,i) in msgList" :key="'msgItem'+i" class="msgCardOutBox"
					:style="{'margin-left':openPLSP?'15%':'0%'}">
					<div class="leftCheckBox">
						<van-checkbox :name="msgItem.id" :disabled="msgItem.exapSt!='待审批'"></van-checkbox>
					</div>
					<div class="msgCard" @click="openPLSP?'':openDetail(msgItem)">
						<div class="msgValue1">
							<div class="msgValue1Left ycsl">{{ msgItem.tplNm }}</div>
							<div class="msgValue1Right">
								<div class="msgValue1RightItem" style="background-color: #026dff">
									{{ msgItem.tplTp }}
								</div>
								<div class="msgValue1RightItem"
									:style="{'background-color':msgItem.exapSt == '审批通过'? '#52C41A': msgItem.exapSt == '待审批'? '#026DFF': '#FF3A3A',}">
									{{ msgItem.exapSt }}
								</div>
							</div>
						</div>
						<div class="msgValue2">
							<div class="msgValue2Left ycsl">
								<span class="msgTitleColor">短信条数：</span>
								<span class="msgContent">{{ msgItem.shrtmsgNum }}条</span>
							</div>
							<div class="msgValue3Right">{{ msgItem.aplyTm }}</div>
						</div>
						<div class="msgValue3">{{msgItem.shrtmsgCntnt}}</div>
						<div class="msgValue4">
							<div class="msgValue4Left ycsl">
								<span class="msgTitleColor">机构名称：</span>
								<span class="msgContent">{{ msgItem.belongOrgName }}</span>
							</div>
							<div class="msgValue4Right ycsl">
								<span class="msgTitleColor">客户经理：</span>
								<span class="msgContent">{{ msgItem.aplyUsrName }}</span>
							</div>
						</div>
					</div>
				</div>
			</van-checkbox-group>
		</van-list>
		<div class="bottomZW2" v-if="openPLSP"></div>
		<div class="bottomZW"></div>
		<van-popup v-model:show="openPLSP" position="bottom" :overlay="false" :lock-scroll="false"
			safe-area-inset-bottom z-index="9">
			<div class="bottomBox">
				<div></div>
				<div class="btnBox">
					<div class="bottomBtn" @click="checkSpAll">全部审批</div>
					<div class="bottomBtn" @click="openDetail(false)">审批</div>
				</div>
			</div>
		</van-popup>
		<van-overlay :show="showApprove" :lock-scroll="false" z-index="10">
			<div class="wrapper" @click.stop>
				<div class="block">
					<div class="formList">
						<van-cell-group title="审批">
							<!-- <div class="flexWrap">
								<van-field v-model="shrtmsgCntnt" input-align="left" border maxlength="200" autosize
									type="textarea" readonly>
									<template #label>
										<span class="msgValueTitle2">短信内容</span>
									</template>
								</van-field>
							</div> -->
							<van-field>
								<template #label>
									<span class="msgValueTitle2">审批结果</span>
									<!-- <span style="color: #026dff; margin-left: 0.01rem">*</span> -->
								</template>
								<template #input>
									<div class="busiBox">
										<div class="busiItem ycsl" v-for="(approveItem, i) in approveTypeList"
											:key="'approveItem' + i" :class="i == approveIndex ? 'busiItem_a' : ''"
											@click="approveIndex = i">
											{{ approveItem.codeName }}
										</div>
									</div>
								</template>
							</van-field>
							<div class="flexWrap">
								<van-field v-model="exapOpnn" input-align="left" border autosize maxlength="100"
									rows="3" type="textarea" placeholder="请输入审批意见" show-word-limit>
									<template #label>
										<span class="msgValueTitle2">审批意见</span>
									</template>
								</van-field>
							</div>

						</van-cell-group>
					</div>
					<div class="btnStyle">
						<van-button plain type="primary" @click="showApprove = false">取消</van-button>
						<van-button type="primary" @click="saveApprove">提交</van-button>
					</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		Toast,
		Dialog,
		Overlay,
		Button
	} from "vant";
	import {
		queryMessageApproveList,
		approveMessageSendApply,
		approveAllMessageSendApply
	} from "../../request/market.js";
	export default {
		data() {
			return {
				showApprove: false,
				finished: false,
				pageIndex: 0,
				approveIndex: null,
				exapOpnn: '',
				approveTypeList: [{
					codeName: "审批通过",
					codeValue: "2",
				}, {
					codeName: "审批拒绝",
					codeValue: "3",
				}],
				msgList: [],
				total: 0,
				openPLSP: false,
				checked: [],
				spAll: false,
			};
		},
		watch: {
			showApprove() {
				if(!this.showApprove){
					this.spAll = false;
				}
			}
		},
		components: {},
		methods: {
			cancleCheck() {
				this.openPLSP = false;
				this.$refs.checkboxGroup.toggleAll(false);
			},
			saveApprove() {
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0,
				});
				let params = {
					ids: this.checked,
					exapSt: this.approveIndex + 2,
					exapOpnn: this.exapOpnn,
				};
				if (this.approveIndex == null) {
					Toast.fail("请选择审批结果");
					return false;
				}
				if (!params.exapOpnn && params.exapSt == '3') {
					Toast.fail("请输入审批意见");
					return false;
				}
				this.params = JSON.stringify(params);
				if (this.spAll) {
					approveAllMessageSendApply(params, (res) => {
						if (res.data) {
							this.showApprove = false;
							Toast.success("审批成功");
							this.approveIndex = null;
							this.exapOpnn = '';
							setTimeout(() => {
								this.pageIndex = 0;
								this.msgList = [];
								this.onLoad();
							}, 600)
						} else {
							Toast.fail("审批失败");
						}
						this.loading = false;
						this.openPLSP = false;
					});
				} else {
					approveMessageSendApply(params, (res) => {
						if (res.data) {
							this.showApprove = false;
							Toast.success("审批成功");
							this.approveIndex = null;
							this.exapOpnn = '';
							setTimeout(() => {
								this.pageIndex = 0;
								this.msgList = [];
								this.onLoad();
							}, 600)
						} else {
							Toast.fail("审批失败");
						}
						this.loading = false;
						this.openPLSP = false;
					});
				}
			},
			openDetail(elment) {
				if (elment) {
					this.checked = [elment.id]
				}
				if (this.checked.length) {
					this.approveIndex = null;
					this.exapOpnn = '';
					this.showApprove = true;
				} else {
					Toast("请先选择至少一条数据！")
				}
			},
			checkSpAll() {
				this.approveIndex = null;
				this.exapOpnn = '';
				this.spAll = true;
				this.showApprove = true;
			},
			onLoad() {
				this.finished = false;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				let params = {
					pageNum: this.pageIndex.toString(),
					pageSize: "10",
					tplNo: "",
					exapSt: "1",
					belongOrg: "",
					userId: "",
				};
				this.params = JSON.stringify(params);
				queryMessageApproveList(params, (res) => {
					if (res.data && res.data.records) {
						Toast.clear();
						this.total = res.data.total.toLocaleString();
						this.msgList = this.msgList.concat(res.data.records);
						if (this.msgList.length >= this.total) this.finished = true;
					} else {
						Toast.fail("短信审批列表为空");
						this.finished = true;
					}
					this.loading = false;
				});
			},
		},
		mounted() {},
	};
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.home {
		overflow: hidden;
		background-color: #f5f5f5;
	}

	.vanList {
		margin-top: 0.09rem;
	}

	.msgCardOutBox {
		width: 100%;
		position: relative;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		transition: margin-left 0.3s;
	}

	.msgCardBox {
		width: 100%;
		padding: 0.06rem 3%;
	}

	.msgCard {
		width: 93.6%;
		margin: 0 3.2% 0.1rem;
		background: #FFFFFF;
		width: 100%;
		box-shadow: 0 0 0.08rem -0.02rem #e0e0e0;
		border-radius: 0.1rem;
		padding: 0.1rem 0.15rem;
	}

	.msgValue1 {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.12rem;
	}

	.msgValue1Left {
		font-size: 0.16rem;
		font-weight: 500;
		flex-shrink: 1;
	}

	.msgValue1Right {
		display: flex;
		flex-shrink: 0;
	}

	.msgValue1RightItem {
		background-color: #2c3e50;
		color: #ffffff;
		font-size: 0.11rem;
		padding: 0.01rem 0.05rem;
		margin-left: 0.05rem;
		border-top-left-radius: 0.05rem;
		border-bottom-right-radius: 0.05rem;
	}

	.msgValue2,
	.msgValue3,
	.msgValue4 {
		width: 100%;
		font-size: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		margin-bottom: 0.08rem;
		justify-content: space-between;
	}

	.msgValue2Left,
	.msgValue3Left,
	.msgValue4Left {
		text-align: left;
		width: 60%;
		flex-shrink: 1;
	}

	.msgValue2Right,
	.msgValue3Right {
		text-align: left;
		width: 40%;
		flex-shrink: 1;
		font-weight: 400;
	}

	.msgContent {
		font-weight: 400;
	}

	.msgValue3 {
		border-bottom: solid 0.01rem #f5f5f5;
		padding-bottom: 0.08rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.17rem;
		text-align: left;
		max-height: 0.86rem;
		overflow-y: auto;
	}

	.msgValue4 {
		margin: 0.1rem 0 0;
	}

	.msgValue4Right {
		text-align: left;
		width: 40%;
		flex-shrink: 1;
	}

	.msgTitleColor {
		font-size: 00.12rem;
		color: #999999;
	}

	:deep(.van-cell) {
		background-color: #ffffff;
		font-size: 0.16rem;
		padding: 0.15rem 0.15rem;
	}

	.flexWrap {
		width: 100%;
	}

	.flexWrap :deep(.van-field__body) {
		overflow: auto;
	}

	.flexWrap :deep(.van-cell) {
		flex-wrap: wrap;
	}

	.flexWrap :deep(.van-cell__title) {
		width: 100%;
		margin-right: 0;
		text-align: left;
	}

	.flexWrap :deep(.van-cell__value) {
		width: 100%;
		margin-right: 0;
		text-align: left;
		border: solid 1px #dddddd;
		border-radius: 0.08rem;
		padding: 0.1rem 0.1rem;
		margin-top: 0.1rem;
		font-size: 0.12rem;
		color: #8C8C8C;
	}

	.msgValueTitle1 {
		height: 0.19rem;
		line-height: 0.19rem;
		text-align: left;
		padding: 0 0.15rem;
	}

	.msgValueTitle2 {
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
	}

	.msgValueTitle3 {
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
	}

	.autoBox {
		width: calc(100% - 0.15rem);
		display: flex;
		flex-wrap: nowrap;
		overflow-x: auto;
		padding: 0 0.15rem;
	}

	.autoCard {
		flex-shrink: 0;
		width: 90%;
		margin-right: 0.12rem;
	}

	.autoCard :deep(.van-cell) {
		flex-wrap: wrap;
		width: 100%;
		padding-left: 0;
		padding-right: 0;
		padding-top: 0.1rem;
	}

	.autoCard :deep(.van-cell__value) {
		margin-top: 0.03rem;
	}

	.busiBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: right;
		margin-bottom: -0.1rem;
		text-align: right;
	}

	.busiItem {
		width: 0.76rem;
		font-size: 0.13rem;
		padding: 0.03rem 0;
		text-align: center;
		margin: 0 calc(10% / 6) 0.09rem;
		border: solid 0.01rem #e3e3e3;
		color: #4f4f4f;
		border-radius: 0.03rem;
	}

	.busiItem_a {
		background: url(../../assets/image/cust_zyqk_busiItem_a.png) no-repeat center;
		background-size: 100% 100%;
		border: solid 0.01rem #def1ff;
		color: #026aff;
	}

	.wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.08rem;
		height: calc(100% - constant(safe-area-inset-top) - 0.46rem);
		height: calc(100% - env(safe-area-inset-top) - 0.46rem);
		margin-top: calc(constant(safe-area-inset-top) + 0.46rem);
		margin-top: calc(env(safe-area-inset-top) + 0.46rem);

	}

	.block {
		position: relative;
		width: 90%;
		max-height: 95%;
		background-color: #fff;
		border-radius: 0.08rem;
		overflow: auto;
	}

	.formList {
		width: 100%;
	}

	.block :deep(.van-hairline--top-bottom:after, .van-hairline-unset--top-bottom:after) {
		border-width: 0px;
	}

	.block :deep(.van-cell) {
		background-color: transparent;
	}

	.block :deep(.van-cell-group) {
		background-color: transparent;
	}

	.block :deep(.van-cell-group__title) {
		font-size: 0.16rem;
		color: #262626;
	}

	.btnStyle {
		width: 100%;
		display: flex;
		justify-content: space-around;
		margin-bottom: 0.2rem;
	}

	.btnStyle :deep(.van-button--primary) {
		width: 1.08rem;
		height: 0.3rem;
		border-radius: 0.15rem;
	}

	.btnStyle :deep(.van-button--plain.van-button--primary) {
		border: 0.01rem solid #026aff;
	}

	.totalPlace {
		width: 100%;
		padding: 0.08rem 3.2% 0;
		height: 0.42rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		background-color: #F5F5F5;
		position: fixed;
		top: calc(constant(safe-area-inset-top) + 0.46rem);
		top: calc(env(safe-area-inset-top) + 0.46rem);
		left: 0;
		z-index: 9;
	}

	.totalPlace1 {
		font-size: 0.1rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
	}

	.totalPlace2 {
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
	}

	.leftCheckBox {
		width: 12%;
		height: 0.2rem;
		flex-shrink: 0;
		position: absolute;
		left: -15%;
		display: flex;
		justify-content: flex-end;
	}

	.topZW {
		width: 100%;
		height: 0.45rem;
	}

	.bottomZW2 {
		width: 100%;
		height: 0.64rem;
	}

	.bottomBox {
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		height: 0.64rem;
		font-size: 0.12rem;
		padding-left: 6.5%;
		padding-right: 3%;
		border-top: solid 1px #F5F5F5;
	}

	.bottomBox :deep(.van-checkbox__label) {
		color: #888888;
	}

	.btnBox {
		display: flex;
		flex-wrap: nowrap;
	}

	.bottomBtn {
		width: 0.88rem;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 0.4rem;
		margin-right: 0.1rem;
	}
</style>
