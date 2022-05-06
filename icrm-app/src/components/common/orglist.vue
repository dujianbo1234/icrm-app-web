<template>
	<div>
		<div class="orgBtnType0" @click="showPopup" v-if="type==0">
			<div style="margin-right: 0.05rem;" class="ycsl">{{chooseOrg.text||showText}}</div>
			<van-icon :name="show?'arrow-up':'arrow-down'" color="#999999" size="0.16rem" />
		</div>
		<div class="orgBtnType1" @click="showPopup" v-else-if="type==1">
			<div style="margin-right: 0.05rem;" class="ycsl">{{chooseOrg.text||showText}}</div>
			<van-icon :name="show?'arrow-up':'arrow-down'" color="#999999" size="0.16rem" />
		</div>
		<div class="orgBtnType2" v-else-if="type==2"></div>
		<van-popup v-model:show="show" position="bottom" :style="{ height: '55%' }" teleport="#app" :overlay="overlay">
			<div class="topBtn">
				<div class="cancle" @click="cancle">取消</div>
				<div class="title">选择机构</div>
				<div class="confirm" @click="activeOrg">确定</div>
			</div>
			<div class="listBox">
				<div class="chooseAll" @click="checkAll">查看全部</div>
				<div class="orgItem" v-for="(orgItem,i) in orgList" :key="'orgItem'+i"
					:style="{'padding-left':((orgItem.level-1)*0.26)+0.12+'rem'}"
					:class="orgItem.value==chooseOrg.value?'orgItem_a':''" @click="checkOrg(orgItem)">
					<van-icon :name="orgItem.open?'arrow-down':'arrow'"
						:color="(orgItem.level+startLevel)<4?'#0088FF':orgItem.value==chooseOrg.value?'#DFDFDF':'#FFFFFF'"
						style="margin-right: 0.1rem;" size="0.16rem" />
					<span :style="{color: orgItem.value=='-1'?'#AAAAAA':''}">{{orgItem.text}}</span>
				</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		getOrgTreeByAuth
	} from "../../request/common.js";
	import {
		Toast
	} from "vant";
	export default {
		props: {
			type: {
				type: Number,
				default: 0
			},
			showText: {
				type: String,
				default: "选择机构"
			},
			overlay: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				show: false,
				orgList: [],
				postMsg: {
					orgType: "",
					orgNo: ""
				},
				startLevel: 1,
				chooseOrg: {},
			}
		},
		methods: {
			showPopup() {
				if (this.orgList.length) {
					this.show = true;
				} else {
					this.show = true;
					this.getOrgList({
						text: "",
						value: "",
						level: 0,
						open: false
					});
				}
			},
			cancle() {
				this.show = false;
				this.$emit("close");
			},
			checkOrg(item) {
				if (item.value == "-1") return;
				this.chooseOrg = item;
				this.getOrgList(item)
			},
			getOrgList(item) {
				if (item.open) {
					var stopIndex = null;
					for (var i = this.orgList.indexOf(item) + 1; i < this.orgList.length; i++) {
						if (this.orgList[i].level <= item.level) {
							stopIndex = i - 1;
							break;
						}
					}
					if (stopIndex === null) {
						this.orgList.splice(this.orgList.indexOf(item) + 1)
					} else {
						this.orgList.splice(this.orgList.indexOf(item) + 1, stopIndex - this.orgList.indexOf(item))
					}
					item.open = false;
				} else {
					if (item.level + this.startLevel > 3) return;
					this.postMsg = {
						orgType: (item.level + this.startLevel).toString(),
						orgNo: item.value
					}
					getOrgTreeByAuth(this.postMsg, (res) => {
						if (res && res.code == 0 && res.data) {
							if (res.data.length) {
								var addList = res.data.map((resItem) => {
									return {
										text: resItem.orgCName,
										value: resItem.orgNo,
										level: item.level + 1,
										open: false
									}
								})
							} else {
								var addList = [{
									text: "无下属机构",
									value: "-1",
									level: 3,
									open: false
								}]
							}
							if (this.orgList.length) {
								this.orgList.splice(this.orgList.indexOf(item) + 1, 0, ...addList);
								item.open = true;
							} else {
								this.orgList = addList;
							}
						} else {
							Toast.fail("获取机构失败");
						}
					})
				}
			},
			checkAll() {
				this.chooseOrg = {};
				this.show = false;
				this.$emit("activeOrg", this.chooseOrg)
			},
			activeOrg() {
				this.show = false;
				this.$emit("activeOrg", this.chooseOrg)
			}
		},
		mounted() {
			switch (this.$store.state.userMsg.roleId) {
				case "00000001":
					this.postMsg.orgType = "1";
					this.startLevel = 1;
					break;
				case "00000002":
					this.postMsg.orgType = "2";
					this.startLevel = 2;
					break;
				case "00000003":
					this.postMsg.orgType = "3";
					this.startLevel = 3;
					break;
				case "00000004":
					this.postMsg.orgType = "4";
					this.startLevel = 4;
					break;
				case "00000005":
					this.postMsg.orgType = "1";
					this.startLevel = 1;
					break;
				case "00000006":
					this.postMsg.orgType = "1";
					this.startLevel = 1;
					break;
				case "00000007":
					this.postMsg.orgType = "2";
					this.startLevel = 2;
					break;
				case "00000008":
					this.postMsg.orgType = "3";
					this.startLevel = 3;
					break;
				case "00000009":
					this.postMsg.orgType = "3";
					this.startLevel = 3;
					break;
			}
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

	.orgBtnType0 {
		width: 100%;
		line-height: 0.4rem;
		text-align: left;
		padding: 0 5%;
		font-size: 0.15rem;
		background-color: #FFFFFF;
		color: #999999;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.orgBtnType1 {
		width: fit-content;
		max-width: 1.6rem;
		text-align: center;
		padding: 0.05rem 0.1rem 0.05rem 0.15rem;
		font-size: 0.15rem;
		background-color: #FFFFFF;
		color: #999999;
		border: solid 1px #CCCCCC;
		border-radius: 0.08rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.orgBtnType2 {
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.topBtn {
		width: 100%;
		height: 0.45rem;
		border-bottom: solid 1px #DDDDDD;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		position: absolute;
		top: 0;
		left: 0;
		background-color: #FFFFFF;
	}

	.topBtn>div {
		width: fit-content;
		padding: 0 0.2rem;
		height: 100%;
		line-height: 0.45rem;
		font-size: 0.16rem;
	}

	.cancle {
		color: #999999;
	}

	.title {
		font-weight: 600;
		font-size: 0.17rem !important;
	}

	.confirm {
		color: #0088FF;
	}

	.listBox {
		margin-top: 0.45rem;
		height: calc(100% - 0.45rem);
		background-color: #FFFFFF;
		overflow: auto;
	}

	:deep(.van-tabs) {
		border: 0 !important;
	}

	.chooseAll,
	.orgItem {
		width: 100%;
		font-size: 0.16rem;
		border-bottom: solid 1px #F5F5F5;
	}

	.chooseAll {
		line-height: 0.45rem;
		text-align: center;
		color: #0088FF;
	}

	.orgItem {
		padding: 0.1rem;
		text-align: left;
		color: #333333;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.orgItem_a {
		background-color: #DFDFDF;
	}
</style>
