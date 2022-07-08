<template>
	<div class="home">
		<nav-bar title="我的群组" type="2" leftIcon />
		<van-tabs v-model:active="active" color="#026DFF" title-active-color="#026DFF" title-inactive-color="#595959"
			line-width="0.84rem" line-height="0.02rem">
			<van-tab v-for="(tab,i) in ['动态群组','固定群组']" :key="'tab'+i" :title="tab" />
		</van-tabs>
		<div style="height: 0.61rem;"></div>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false"
			@load="onLoad">
			<van-swipe-cell v-for="(groupItem,i) in groupList" :key="'groupItem'+i">
				<div class="groupCard">
					<div class="groupCardLeft">
						<div class="groupItem1 ycsl">{{groupItem.value0}}</div>
						<div class="groupItem2">
							<div class="groupItem2_child">
								<span class="groupItem2_childTitle">人数:</span>
								<span class="groupItem2_childValue">{{groupItem.value1.toLocaleString()}}人</span>
							</div>
							<div class="groupItem2_child ycsl">
								<span class="groupItem2_childTitle">AUM总额:</span>
								<span class="groupItem2_childValue">{{formatNum(groupItem.value2/10000)}}万元</span>
							</div>
							<div class="groupItem2_child">
								<span class="groupItem2_childTitle">归属人:</span>
								<span class="groupItem2_childValue">{{groupItem.value3}}</span>
							</div>
							<div class="groupItem2_child ycsl">
								<span class="groupItem2_childTitle">机构:</span>
								<span class="groupItem2_childValue">{{groupItem.value4}}</span>
							</div>
						</div>
						<div class="groupItem3" v-if="active==0">
							<div class="groupItem3_child" style="color: #FFFFFF;" v-for="(item,j) in groupItem.value5"
								:key="'item'+j">{{item}}</div>
						</div>
						<div class="groupItem4">
							<van-icon :name="require('../../assets/image/sendMessage.png')" size="0.25rem"
								@click="openMbox(groupItem)" />
						</div>
					</div>
					<div class="groupCardRight">
						<van-icon name="arrow" size="0.18rem" color="#e4e4e4" @click="toGroupDetail(groupItem)" />
					</div>
					<div class="groupCardBottom" v-if="active==0">
						<div class="groupItem3_child" v-for="(item,j) in groupItem.value5" :key="'item'+j">{{item}}
						</div>
					</div>
				</div>
				<template #right>
					<div class="delBtn">
						<van-icon :name="require('../../assets/image/cust_zyqk_delete.png')" size="0.3rem"
							@click="delGroupItem(groupItem)" />
						<div class="delBtnText" @click="delGroupItem(groupItem)">删除</div>
					</div>
				</template>
			</van-swipe-cell>
		</van-list>
		<div class="addGroup" v-show="active==1" @click="newGroup={};showAdd=true;">
			<van-icon :name="require('../../assets/image/btn_add.png')" size="0.56rem" />
		</div>
		<div class="bottomZW"></div>
		<send-message ref="sendMessage" />
		<van-overlay :show="showAdd" z-index="11">
			<div class="plate6">
				<div class="plate6_1">创建固定群组</div>
				<div class="plate6_5">
					<van-field v-model="newGroup.groupTitle" label="群组名称" label-align="right" required
						placeholder="请输入名称" maxlength="20" />
					<van-field v-model="newGroup.groupDesc" type="textarea" label="客群描述" label-align="right"
						placeholder="请输入说明" rows="1" autosize maxlength="20" />
				</div>
				<div class="plate6_4">
					<div class="palte6_4_1" @click="showAdd=false">取消</div>
					<div class="palte6_4_2" @click="addGroup">确定</div>
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
	import {
		Toast
	} from "vant";
	import {
		formatNum
	} from "../../api/common.js";
	import sendMessage from "../../components/common/sendMessage.vue";
	export default {
		data() {
			return {
				active: 0,
				loading: false,
				finished: false,
				pageIndex: 0,
				groupList: [],
				showAdd: false,
				newGroup: {},
			}
		},
		components: {
			sendMessage
		},
		methods: {
			formatNum,
			onLoad() {
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				setTimeout(() => {
					for (let i = 0; i < 10; i++) {
						this.groupList.push({
							value0: "资产提升群组" + (i + 1),
							value1: 1234,
							value2: 123456789,
							value3: "陈二狗",
							value4: "九江银行八里湖支行",
							value5: ["#资产10万以上#", "#极差值100万以上#"],
							value6: "客户信誉优良",
							value7: 123456789,
						});
					}
					Toast.clear();
					this.loading = false;
					if (this.groupList.length >= 40) {
						this.finished = true;
					}
				}, 1000);
			},
			openMbox(item) {
				this.$refs.sendMessage.openMbox({
					type: "groupSendAll",
					searchData: {},
					list: [],
					shrtmsgCnl: "3"
				})
			},
			toGroupDetail(item) {
				localStorage.setItem("groupDetail", JSON.stringify(item));
				this.$router.push({
					name: 'groupDetail',
					params: {
						groupItem: JSON.stringify(item)
					}
				})
			},
			delGroupItem(item) {
				alert("删除" + item + "?")
			},
			addGroup() {
				if (this.newGroup.groupTitle) {
					alert("新增 " + this.newGroup.groupTitle + " 群组：" + this.newGroup.groupDesc);
					this.showAdd = false;
				} else {
					Toast("请输入群组名称")
				}
			},
		},
		mounted() {
			this.onLoad();
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
		width: calc(100% - 0.29rem);
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
		right: 0;
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
</style>
