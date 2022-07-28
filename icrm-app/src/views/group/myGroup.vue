<template>
	<div class="home">
		<nav-bar :title="$route.params.gdParams?'选择群组':'我的群组'" type="2" leftIcon
			:backName="$route.params.gdParams?'':'cust'" />
		<van-tabs v-if="!$route.params.gdParams" v-model:active="active" color="#026DFF" title-active-color="#026DFF"
			title-inactive-color="#595959" line-width="0.84rem" line-height="0.02rem" @change="changeTab">
			<van-tab v-for="(tab,i) in ['动态群组','固定群组']" :key="'tab'+i" :title="tab" />
		</van-tabs>
		<div v-if="!$route.params.gdParams" style="height: 0.61rem;"></div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
			@load="onLoad">
			<van-swipe-cell v-for="(groupItem,i) in groupList" :key="'groupItem'+i">
				<div class="groupCard" @click="toGroupDetail(groupItem)">
					<div class="groupCardLeft">
						<div class="groupItem1 ycsl">{{active==0?groupItem.acGroupNm:groupItem.custGroupNm}}</div>
						<div class="groupItem2">
							<div class="groupItem2_child">
								<span class="groupItem2_childTitle">人数:</span>
								<span class="groupItem2_childValue">{{(groupItem.custCnt||0).toLocaleString()}}人</span>
							</div>
							<div class="groupItem2_child">
								<span class="groupItem2_childTitle">AUM总额:</span>
								<span class="groupItem2_childValue">{{formatNumW(groupItem.aumBal||0)}}万元</span>
							</div>
							<div class="groupItem2_child">
								<span class="groupItem2_childTitle">归属人:</span>
								<span
									class="groupItem2_childValue">{{active==0?groupItem.creatorNm:groupItem.modifUsrName}}</span>
							</div>
							<div class="groupItem2_child ycsl">
								<span class="groupItem2_childTitle">机构:</span>
								<span
									class="groupItem2_childValue">{{active==0?groupItem.crtInstNm:groupItem.menderBelongOrgNm}}</span>
							</div>
						</div>
						<div class="groupItem3_g" v-if="active==0">
							<template v-for="(filterItem,i) in groupItem.listGroupCdtnChc" :key="'filterItem'+i">
								<span>#</span>
								<span>{{filterItem.chcFldNm.split("#")[0]}}&nbsp;</span>
								<span v-if="filterItem.chcValue">{{filterItem.chcValue}}</span>
								<span v-else-if="filterItem.chcValueMin&&filterItem.maxValue">
									({{filterItem.minValue}},{{filterItem.chcValueMax}}]</span>
								<span v-else-if="filterItem.chcValueMin">≥{{filterItem.chcValueMin}}</span>
								<span v-else-if="filterItem.chcValueMax">＜{{filterItem.chcValueMax}}</span>
								<span v-else-if="filterItem.chcValues">＜{{filterItem.chcValues}}</span>
								<span># </span>
							</template>
						</div>
						<div v-if="!$route.params.gdParams&&$store.state.userMsg.roleId != '00000005'"
							class="groupItem4" @click.stop="openMbox(groupItem)">
							<van-icon :name="require('../../assets/image/sendMessage.png')" size="0.25rem" />
						</div>
					</div>
					<!-- <div class="groupCardRight">
						<van-icon name="arrow" size="0.18rem" color="#e4e4e4" @click="toGroupDetail(groupItem)" />
					</div> -->
				</div>
				<template #right>
					<div class="delBtn" @click="beforeDelGroupItem(groupItem)">
						<van-icon :name="require('../../assets/image/cust_zyqk_delete.png')" size="0.3rem" />
						<div class="delBtnText">删除</div>
					</div>
				</template>
			</van-swipe-cell>
		</van-list>
		<div class="addGroup" v-show="active==1&&!$route.params.gdParams" @click="newGroup={};showAdd=true;">
			<van-icon :name="require('../../assets/image/btn_add.png')" size="0.56rem" />
		</div>
		<div class="bottomZW"></div>
		<send-message ref="sendMessage" />
		<div class="createOutBox">
			<van-popup v-model:show="showAdd" z-index="11" :close-on-click-overlay="false">
				<div class="createBox">
					<div class="createTitle">创建固定群组</div>
					<div class="titleLine"></div>
					<van-field v-model="newGroupTitle" type="text" label="群组名称" maxlength="10" required
						placeholder="请输入名称" />
					<van-field v-model="newGroupDesc" type="textarea" label="客群描述" placeholder="请输入说明" rows="1" autosize
						maxlength="30" show-word-limit />
					<div class="createBtns">
						<div class="createBtn createBtn1" @click="showAdd=false">取消</div>
						<div class="createBtn createBtn2" @click="addGroup">创建</div>
					</div>
				</div>
			</van-popup>
		</div>
		<van-dialog v-model:show="showDelete">
			<template #default>
				<div class="dialogValue">确定删除该群组？</div>
			</template>
			<template #footer>
				<div class="dialogBtns">
					<div class="dialogBtn dialogBtn1" @click="showDelete=false">取消</div>
					<div class="dialogBtn dialogBtn2" @click="delGroupItem">确认</div>
				</div>
			</template>
		</van-dialog>
		<van-dialog v-model:show="showJoin">
			<template #title>
				<div class="dialogTitle">提示</div>
			</template>
			<template #default>
				<div class="dialogValue" style="margin-top: 0;">确定加入{{joinGroup.custGroupNm}}？</div>
			</template>
			<template #footer>
				<div class="dialogBtns">
					<div class="dialogBtn dialogBtn1" @click="showJoin=false">取消</div>
					<div class="dialogBtn dialogBtn2" @click="afterJoinGroup">确认</div>
				</div>
			</template>
		</van-dialog>
	</div>
</template>

<script>
	import {
		Toast,
		Dialog
	} from "vant";
	import {
		formatNumW,
		formatNums,
		formatNum
	} from "@/api/common.js";
	import sendMessage from "../../components/common/sendMessage.vue";
	import {
		queryGroupActiveList,
		deleteGroupActiveInfo,
		queryGroupFixList,
		deleteGroupFixInfo,
		saveGroupFixInfo,
		saveGroupFixCust,
		addGroupFixSelCust
	} from "../../request/market.js";
	export default {
		data() {
			return {
				pageReady: false,
				active: 0,
				loading: false,
				finished: false,
				pageIndex: 0,
				groupList: [],
				showAdd: false,
				newGroupTitle: "",
				newGroupDesc: "",
				delGroup: {},
				showDelete: false,
				showJoin: false,
				joinGroup: {},
			}
		},
		components: {
			sendMessage
		},
		watch: {
			showAdd() {
				if (this.showAdd) {
					this.newGroupTitle = "";
					this.newGroupDesc = "";
				}
			}
		},
		methods: {
			formatNumW,
			formatNums,
			formatNum,
			onLoad() {
				if (!this.pageReady) return;
				this.finished = false;
				this.loading = true;
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0,
				});
				this.pageIndex++;
				switch (this.active) {
					case 0:
						queryGroupActiveList({
							pageSize: "10",
							pageNum: this.pageIndex.toString()
						}, (res) => {
							if (res.data && res.data.records) {
								this.groupList = this.groupList.concat(res.data.records);
								if (this.groupList.length >= res.data.total || res.data.records.length <= 0) {
									this.finished = true;
								}
							} else {
								this.finished = true;
							}
							Toast.clear();
							this.loading = false;
						});
						break;
					case 1:
						queryGroupFixList({
							pageSize: "10",
							pageNum: this.pageIndex.toString()
						}, (res) => {
							if (res.data && res.data.records) {
								this.groupList = this.groupList.concat(res.data.records);
								if (this.groupList.length >= res.data.total || res.data.records.length <= 0) {
									this.finished = true;
								}
							} else {
								this.finished = true;
							}
							Toast.clear();
							this.loading = false;
						});
						break;
				}
			},
			changeTab() {
				this.pageIndex = 0;
				this.groupList = [];
				this.onLoad();
			},
			openMbox(item) {
				var params = {
					searchData: {},
					list: [],
					shrtmsgCnl: "3"
				}
				if (this.active == 0) {
					params.type = "activeGroupSendAll";
					params.sysId = item.sysId;
				} else {
					params.type = "fixGroupSendAll";
					params.groupId = item.groupId;
				}
				this.$refs.sendMessage.openMbox(params);
			},
			toGroupDetail(item) {
				if (this.$route.params.gdParams) {
					this.joinGroup = item;
					this.showJoin = true;
				} else {
					item.active = this.active;
					localStorage.setItem("groupDetail", JSON.stringify(item));
					localStorage.setItem("newMyGroup", "0")
					this.$router.push({
						name: 'groupDetail',
						params: {
							groupItem: JSON.stringify(item)
						}
					})
				}
			},
			afterJoinGroup() {
				this.showJoin = false;
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0,
				});
				var gdParams = JSON.parse(this.$route.params.gdParams);
				if (this.$route.params.backLevel == 2) {
					addGroupFixSelCust({
						groupId: this.joinGroup.groupId,
						...gdParams
					}, (res) => {
						if (res.data == "操作成功") {
							Toast.success("操作成功");
							setTimeout(() => {
								this.joinGroup.active = this.active;
								localStorage.setItem("groupDetail", JSON.stringify(this.joinGroup));
								localStorage.setItem("newMyGroup", "0")
								localStorage.setItem("newGroupSearchResult", "1")
								this.$router.push({
									name: 'groupDetail',
									params: {
										groupItem: JSON.stringify(this.joinGroup),
										backLevel: 2
									}
								})
							}, 800)
						} else {
							Toast.fail(res.msg)
						}
					})
				} else {
					saveGroupFixCust({
						sysId: this.joinGroup.groupId,
						...gdParams
					}, (res) => {
						if (res.data == "操作成功") {
							Toast.success("操作成功");
							setTimeout(() => {
								this.joinGroup.active = this.active;
								localStorage.setItem("groupDetail", JSON.stringify(this.joinGroup));
								localStorage.setItem("newMyGroup", "0")
								localStorage.setItem("newGroupSearchResult", "1")
								this.$router.push({
									name: 'groupDetail',
									params: {
										groupItem: JSON.stringify(this.joinGroup)
									}
								})
							}, 800)
						} else {
							Toast.fail(res.msg)
						}
					})
				}
			},
			beforeDelGroupItem(item) {
				this.delGroup = item;
				this.showDelete = true;
			},
			delGroupItem() {
				this.showDelete = false;
				Toast.loading({
					message: "正在操作",
					forbidClick: true,
					duration: 0,
				});
				if (this.active == 0) {
					deleteGroupActiveInfo({
						sysId: this.delGroup.sysId
					}, (res) => {
						if (res.data == "操作成功") {
							Toast.success("删除成功");
							setTimeout(() => {
								this.pageIndex = 0;
								this.groupList = [];
								this.onLoad();
							}, 800)
						} else {
							Toast.fail(res.msg)
						}
					})
				} else {
					deleteGroupFixInfo({
						groupId: this.delGroup.groupId
					}, (res) => {
						if (res.data == "操作成功") {
							Toast.success("删除成功");
							setTimeout(() => {
								this.pageIndex = 0;
								this.groupList = [];
								this.onLoad();
							}, 800)
						} else {
							Toast.fail(res.msg)
						}
					})
				}
			},
			addGroup() {
				if (this.newGroupTitle) {
					Toast.loading({
						message: "正在操作",
						forbidClick: true,
						duration: 0,
					});
					saveGroupFixInfo({
						custGroupNm: this.newGroupTitle,
						rmkExpln: this.newGroupDesc
					}, (res) => {
						if (res.data == "操作成功") {
							Toast.success("创建成功");
							this.showAdd = false;
							setTimeout(() => {
								this.pageIndex = 0;
								this.groupList = [];
								this.onLoad();
							}, 800)
						} else {
							Toast.fail(res.msg)
						}
					})
				} else {
					Toast("请输入群组名称")
				}
			},
			mounted_m() {
				window.addEventListener('popstate', null, false);
				if (localStorage.getItem("newMyGroup") == "2") {
					localStorage.setItem("newMyGroup", "1");
					this.active = 1;
				} else {
					this.active = this.$route.params.active ? Number(this.$route.params.active) : 0;
				}
				this.pageReady = true;
				this.onLoad();
			}
		},
		beforeRouteLeave(to, from, next) {
			window.removeEventListener('popstate', null, false);
			next();
		},
		mounted() {
			localStorage.setItem("newMyGroup", "0");
			this.mounted_m();
		},
		activated() {
			if (localStorage.getItem("newMyGroup") == "0") {
				localStorage.setItem("newMyGroup", "1")
			} else {
				this.pageReady = false;
				this.loading = false;
				this.finished = false;
				this.pageIndex = 0;
				this.groupList = [];
				this.showAdd = false;
				this.newGroup = {};
				try {
					this.$refs.sendMessage.cancle();
				} catch (e) {
					//TODO handle the exception
				}
				this.mounted_m();
			}
		},
	}
</script>

<style scoped>
	* {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		border: 0;
	}

	:deep(.van-tabs__wrap) {
		height: 0.56rem;
		width: 100%;
		box-shadow: inset 0rem 0rem 0rem 0rem rgba(0, 0, 0, 0.04);
		overflow: visible;
		position: fixed;
		z-index: 9;
	}

	:deep(.van-tabs__nav--line) {
		padding: 0;
	}

	:deep(.van-tab) {
		font-size: 0.16rem;
		font-family: PingFangSC-Medium, PingFang SC;
	}

	:deep(.van-tabs__line) {
		bottom: -0.01rem;
	}

	:deep(.van-swipe-cell__right) {
		display: flex;
		align-items: center;
	}

	.groupCard {
		width: calc(100% - 0.24rem);
		margin: 0.1rem auto 0;
		padding: 0.16rem;
		background: #FFFFFF;
		box-shadow: 0rem 0.02rem 0.1rem 0rem rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		position: relative;
	}

	.groupCardLeft {
		/* width: calc(100% - 0.29rem); */
		width: 100%;
		position: relative;
	}

	.groupItem1 {
		width: calc(100% - 0.3rem);
		text-align: left;
		height: 0.21rem;
		font-size: 0.16rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		line-height: 0.21rem;
		margin-top: 0.05rem;
	}

	.groupItem2 {
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		display: flex;
		flex-wrap: wrap;
	}

	.groupItem2_child {
		width: 50%;
		height: 0.18rem;
		line-height: 0.18rem;
		text-align: left;
		margin-top: 0.08rem;
		white-space: nowrap;
	}

	.groupItem2_childTitle {
		color: #8C8C8C;
	}

	.groupItem2_childValue {
		color: #262626;
	}

	.groupCardBottom {
		max-width: calc(100% - 0.32rem);
		margin-top: 0.1rem;
		background: #F4F9FF;
		border-radius: 0.05rem;
		padding: 0.03rem 0.02rem 0.03rem 0.12rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		position: absolute;
		left: 0.16rem;
		bottom: 0.16rem;
	}

	.groupItem3 {
		width: calc(100% + 0.29rem);
		margin-top: 0.1rem;
		background: #FFFFFF;
		padding: 0.03rem 0.02rem 0.03rem 0.12rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.groupItem3_g {
		/* width: calc(100% + 0.29rem); */
		width: 100%;
		margin-top: 0.1rem;
		max-height: 0.51rem;
		overflow-y: auto;
		background: #F4F9FF;
		padding: 0.03rem 0.12rem;
		border-radius: 0.05rem;
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.15rem;
		text-align: left;
	}

	.groupItem3_child {
		height: 0.15rem;
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.15rem;
		margin-right: 0.1rem;
	}

	.groupItem4 {
		position: absolute;
		top: 0.04rem;
		right: 0.1rem;
		display: flex;
	}

	.groupCardRight {
		width: 0.29rem;
		padding-left: 0.16rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.delBtn {
		width: 0.9rem;
		padding-right: 0.12rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
	}

	.delBtnText {
		margin-top: 0.02rem;
		width: 100%;
		text-align: center;
		height: 0.13rem;
		font-size: 0.09rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.13rem;
	}

	.addGroup {
		width: 0.56rem;
		height: 0.56rem;
		border-radius: 0.28rem;
		overflow: hidden;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		position: fixed;
		bottom: calc(constant(safe-area-inset-bottom) + 0.25rem);
		bottom: calc(env(safe-area-inset-bottom) + 0.25rem);
		right: 0.12rem;
	}

	.plate6 {
		width: 91.47%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		position: absolute;
		top: calc(50% - 1rem);
		left: 4.13%;
		padding-bottom: 0.2rem;
	}

	.plate6_1 {
		width: 100%;
		height: 0.45rem;
		line-height: 0.45rem;
		text-align: center;
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		border-bottom: solid 0.01rem #E7E9EC;
	}

	.plate6_4 {
		width: 100%;
		height: 0.3rem;
		margin-top: 0.27rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
		align-items: center;
	}

	.palte6_4_1,
	.palte6_4_2 {
		width: 1.08rem;
		height: 0.3rem;
		border-radius: 0.15rem;
		border: 0.01rem solid #026DFF;
		font-size: 0.13rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #026DFF;
		line-height: 0.3rem;
		text-align: center;
		margin: 0 0.05rem;
	}

	.palte6_4_1 {
		border: 0.01rem solid #026DFF;
		color: #026DFF;
	}

	.palte6_4_2 {
		background: #026DFF;
		color: #FFFFFF;
	}

	.plate6_5 {}

	.plate6_5 :deep(.van-field) {
		width: 80%;
		margin: 0.23rem auto 0.06rem;
		align-items: center;
	}

	.plate6_5 :deep(.van-field__label) {
		width: 0.7rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		margin: 0;
		padding: 0 0.08rem 0 0;
		white-space: nowrap;
	}

	.plate6_5 :deep(.van-field__value) {
		background: #F5F5F5;
		border-radius: 0.05rem;
		padding: 0.11rem 0.13rem;
	}

	.plate6_5 :deep(.van-field__label--required:before) {
		color: #026DFF;
	}

	.plate6_5 :deep(.van-cell:after) {
		border: 0;
	}

	.dialogValue {
		width: 90%;
		margin: 0.36rem auto 0.24rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.22rem;
	}

	.dialogBtns {
		width: 100%;
		margin-bottom: 0.2rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
	}

	.dialogBtn {
		width: 1.08rem;
		height: 0.3rem;
		border-radius: 0.15rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		line-height: 0.3rem;
		margin: 0 0.08rem;
	}

	.dialogBtn1 {
		border: 0.01rem solid #026DFF;
		color: #026DFF;
	}

	.dialogBtn2 {
		background: #026DFF;
		color: #FFFFFF;
	}

	.createOutBox>:deep(.van-popup) {
		width: 91.47%;
		background-color: transparent;
	}

	.createBox {
		width: 100%;
		background: #FFFFFF;
		border-radius: 0.08rem;
		padding-bottom: 0.22rem;
	}

	.createTitle {
		width: 100%;
		height: 0.45rem;
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.45rem;
		text-align: center;
	}

	.titleLine {
		width: 100%;
		height: 0.07rem;
		box-shadow: inset 0rem 0.01rem 0rem 0rem #E7E9EC;
		margin-bottom: 0.04rem;
	}

	.createBox :deep(.van-cell) {
		width: calc(100% - 0.72rem);
		margin: 0.19rem auto 0.29rem;
	}

	.createBox :deep(.van-cell:after) {
		border-bottom: 0;
	}

	.createBox :deep(.van-cell__title) {
		text-align: right;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		width: 0.68rem;
		line-height: 0.4rem;
		white-space: nowrap;
	}

	.createBox :deep(.van-cell__value) {
		width: 100%;
		background-color: #F5F5F5;
		border-radius: 0.05rem;
	}

	.createBox :deep(.van-field__body) {
		min-height: 0.4rem;
		padding: 0 0.12rem;
	}

	.createBox :deep(.van-field__word-limit) {
		padding-right: 0.06rem;
	}

	.createBox :deep(.van-field__label--required:before) {
		color: #026DFF;
	}

	.createBtns {
		height: 0.3rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: center;
	}

	.createBtn {
		width: 1.08rem;
		height: 0.3rem;
		border-radius: 0.15rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		line-height: 0.3rem;
		text-align: center;
		margin: 0 0.1rem;
	}

	.createBtn1 {
		border: solid 0.01rem #026DFF;
		color: #026DFF;
	}

	.createBtn2 {
		background: #026DFF;
		color: #FFFFFF;
	}
</style>
