<template>
	<div class="home">
		<nav-bar title="条件群组" type="2" leftIcon />
		<van-tabs v-model:active="active" scrollspy sticky>
			<van-tab v-for="(filterItem,i) in filterList" :key="'filterItem'+i" v-show="!filterItem.disabled"
				:title="filterItem.value">
				<div class="plateTitle">{{filterItem.title}}</div>
				<div class="filterItemBox">
					<div class="filterEmpty" v-if="!filterItem.list.length">
						—— 暂无可筛选指标 ——
					</div>
					<div class="filterItem" v-for="(filterItemChild,j) in filterItem.list" :key="'filterItemChild'+j"
						:class="activeChild1.code==filterItemChild.code?'filterItem_a':''"
						v-show="!filterItemChild.disabled" @click="checkChild1(filterItemChild)">
						{{filterItemChild.title}}
					</div>
				</div>
				<div v-if="i==filterList.length-1">
					<div style="height: 0.58rem;"></div>
					<div class="bottomZW"></div>
				</div>
			</van-tab>
		</van-tabs>
		<div class="bottomCard">
			<div class="bottomCard1">
				已选<span style="color: #026DFF;">{{filterArr.length}}</span>项
			</div>
			<div class="bottomCard2">
				<div class="bottomCard1_1">
					已筛选<span style="color: #026DFF;">{{custNumber?custNumber.toLocaleString():0}}</span>位客户
				</div>
				<div class="bottomCard1_2" @click="toSearchRes">确定</div>
			</div>
		</div>
		<van-popup v-model:show="defaultShow" position="bottom" :style="{ height: '60%' }" round :lock-scroll="false"
			:close-on-click-overlay="true" close-on-popstate>
			<div class="popupTitle">{{activeChild1.title}}</div>
			<div class="childListOutBox">
				<div class="childListBox">
					<div class="childRemark">{{activeChild1.remark}}</div>
					<div class="childListItem" v-for="(childListItem,i) in activeChild1.list"
						v-show="!childListItem.disabled" :key="'childListItem'+i"
						:class="childListItem.code==activeChild2.code||(!activeChild2.code&&filterArr.find(item=>item.code==childListItem.code))?'childListItem_a':''"
						@click="checkChild2(childListItem,i)">
						{{childListItem.title}}
					</div>
				</div>
			</div>
			<div class="btnBox">
				<div class="btnItem btnItem1" @click="defaultShow=false">取消</div>
				<div class="btnItem btnItem2" v-if="activeChild2.list&&!activeChild2.list.length||activeChild3.code"
					@click="defaultConfirm">确定</div>
				<div class="btnItem btnItem3" v-else>确定</div>
			</div>
		</van-popup>
		<van-popup v-model:show="dfdwShow" position="bottom" :style="{ height: '70%' }" round :lock-scroll="false"
			:close-on-click-overlay="true" close-on-popstate>
			<div class="popupTitle_dfdw">代发单位</div>
			<div class="childListOutBox" style="padding: 0.12rem 0.18rem 0;">
				<div class="checkedBox">
					<div class="checkedBox1">{{activeChild1.remark}}</div>
					<div class="checkedBox2">已选（{{dfdwChecked.length}}）</div>
					<div class="checkedBox3" v-for="(dfdwNameItem,i) in dfdwChecked" :key="'dfdwNameItem'+i">
						{{dfdwNameItem}}
					</div>
				</div>
				<div class="searchBox">
					<van-search v-model="searchValue" shape="round" show-action placeholder="请输入代发单位名称"
						@update:model-value="onSearch" :left-icon="require('../../assets/image/common_search.png')">
						<template #action>
							<div style="color: #026DFF;font-size: 0.14rem;padding-left: 0.1rem;" @click="onSearch">搜索
							</div>
						</template>
					</van-search>
				</div>
				<van-checkbox-group v-model="dfdwChecked">
					<van-checkbox v-for="(dfdwItem,i) in dfdwShowList" :key="'dfdwItem'+i" :name="dfdwItem">{{dfdwItem}}
					</van-checkbox>
				</van-checkbox-group>
			</div>
			<div class="btnBox">
				<div class="btnItem btnItem1" @click="dfdwShow=false">取消</div>
				<div class="btnItem btnItem2" v-if="dfdwChecked.length" @click="dfdwConfirm">确定</div>
				<div class="btnItem btnItem3" v-else>确定</div>
			</div>
		</van-popup>
		<div class="child3Box" ref="child3Box" v-show="child3Show">
			<div class="child3BoxDirection" ref="child3BoxDirection">
				<div class="child3BoxDirectionChild"></div>
			</div>
			<div class="child3InBox">
				<div class="child3Box_1">{{activeChild2.code?activeChild2.remark:''}}</div>
				<div class="child3Box_2">
					<div class="child3BoxItem" v-for="(child3BoxItem,i) in activeChild2.list"
						v-show="!child3BoxItem.disabled" :key="'child3BoxItem'+i"
						:class="child3BoxItem.code==activeChild3.code||(!activeChild3.code&&filterArr.find(item=>item.code==child3BoxItem.code))?'child3BoxItem_a':''"
						@click="checkChild3(child3BoxItem)">
						{{child3BoxItem.title}}
					</div>
				</div>
				<div class="child3Box_4" style="padding: 0 0.08rem;" v-show="activeChild3.title=='自定义'">
					<van-field v-model="activeChild3.minValue" type="number" input-align="center" center
						placeholder="请输入最小值" />
					<div class="centerLine"></div>
					<van-field v-model="activeChild3.maxValue" type="number" input-align="center" center
						placeholder="请输入最大值" />
				</div>
				<div class="child3Box_3" v-if="activeChild3.remark">{{activeChild3.remark}}</div>
			</div>
		</div>
		<div class="child3Box" ref="child3Box_c" v-show="child3Show_c">
			<div class="child3BoxDirection" ref="child3BoxDirection_c">
				<div class="child3BoxDirectionChild"></div>
			</div>
			<div class="child3InBox">
				<div class="child3Box_4">
					<van-field v-model="activeChild2.minValue" type="number" input-align="center" center
						placeholder="请输入最小值" />
					<div class="centerLine"></div>
					<van-field v-model="activeChild2.maxValue" type="number" input-align="center" center
						placeholder="请输入最大值" />
				</div>
				<div class="child3Box_3" v-if="activeChild2.remark">{{activeChild2.remark}}</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		filterList
	} from "./filterGroup.js";
	import {
		Toast
	} from "vant";
	import {
		queryCustAgentCompanyList,
		queryFilterResultSum
	} from "../../request/market.js";
	export default {
		data() {
			return {
				filterList: filterList,
				active: 0,
				activeChild1: {},
				activeChild2: {},
				activeChild3: {},
				defaultShow: false,
				filterArr: [],
				custNumber: 0,
				child3Show: false,
				child3Show_c: false,
				dfdwShow: false,
				dfdwChecked: [],
				dfdwList: ["代发单位0", "代发单位1", "代发单位2", "代发单位3", "代发单位4", "代发单位5", "代发单位6", "代发单位7", "代发单位8"],
				dfdwShowList: ["代发单位0", "代发单位1", "代发单位2", "代发单位3", "代发单位4", "代发单位5", "代发单位6", "代发单位7", "代发单位8"],
				searchValue: "",
			}
		},
		watch: {
			defaultShow() {
				if (!this.defaultShow) {
					this.activeChild1 = {};
					this.activeChild2 = {};
					this.activeChild3 = {};
					this.child3Show = false;
					this.child3Show_c = false;
				}
			},
			dfdwShow() {
				if (!this.dfdwShow) {
					this.activeChild1 = {};
				}
			},
		},
		methods: {
			onSearch() {
				this.dfdwShowList = [];
				this.dfdwList.forEach((item) => {
					if (item.includes(this.searchValue)) this.dfdwShowList.push(item)
				});
			},
			checkChild1(item) {
				item.minValue = "";
				item.maxValue = "";
				this.activeChild1 = item;
				switch (item.code) {
					case "04010000":
						var dfdw = this.filterArr.find(item => item.code == "04010000");
						if (dfdw) {
							this.dfdwChecked = dfdw.values.split(",");
						} else {
							this.dfdwChecked = [];
						}
						this.dfdwShow = true;
						break;
					default:
						var zdy = this.activeChild1.list.find(item => item.title == "自定义");
						if (zdy) {
							var zdyItem = this.filterArr.find(item => item.code == zdy.code);
							if (zdyItem) {
								this.activeChild2 = zdyItem;
								setTimeout(() => {
									this.child3Show_c = true;
								}, 220);
							}
						}
						this.defaultShow = true;
						break;
				}
			},
			checkChild2(item, i) {
				this.child3Show = false;
				this.child3Show_c = false;
				if (item.code == this.activeChild2.code) {
					this.activeChild2 = {};
					this.activeChild3 = {};
				} else {
					item.minValue = "";
					item.maxValue = "";
					this.activeChild2 = item;
					this.activeChild3 = {};
					var box = document.getElementsByClassName("childListItem")[i];
					var top = box.getBoundingClientRect().top,
						left = box.getBoundingClientRect().left,
						width = box.offsetWidth;
					if (this.activeChild2.title == "自定义") {
						this.$refs.child3Box_c.style.top = "calc(" + (top + 10) + "px + 0.35rem)";
						this.$refs.child3BoxDirection_c.style.top = "calc(" + (top + 10) + "px + 0.25rem)";
						this.$refs.child3BoxDirection_c.style.left = "calc(" + (left + width / 2) + "px - 0.1rem)";
						this.child3Show_c = true;
					}
					if (this.activeChild2.list.length) {
						this.$refs.child3Box.style.top = "calc(" + (top + 10) + "px + 0.35rem)";
						this.$refs.child3BoxDirection.style.top = "calc(" + (top + 10) + "px + 0.25rem)";
						this.$refs.child3BoxDirection.style.left = "calc(" + (left + width / 2) + "px - 0.1rem)";
						var zdy = this.activeChild2.list.find(item => item.title == "自定义");
						if (zdy) {
							var zdyItem = this.filterArr.find(item => item.code == zdy.code);
							this.activeChild3 = zdyItem || {};
						}
						this.child3Show = true;
					}
				}
			},
			checkChild3(item) {
				if (item.code == this.activeChild3.code) {
					this.activeChild3 = {};
				} else {
					item.minValue = "";
					item.maxValue = "";
					this.activeChild3 = item;
				}
			},
			defaultConfirm() {
				var addChild = this.activeChild3.code ? this.activeChild3 : this.activeChild2;
				addChild = JSON.parse(JSON.stringify(addChild));
				var itemIndex = this.filterArr.findIndex(item => item.code.slice(0, 4) == addChild.code.slice(0, 4));
				if (itemIndex < 0) {
					this.filterArr.push(addChild);
				} else {
					this.filterArr.splice(itemIndex, 1, addChild);
				}
				this.defaultShow = false;
				this.afterConfirm();
			},
			dfdwConfirm() {
				this.activeChild1.values = this.dfdwChecked.join(",");
				var addChild = JSON.parse(JSON.stringify(this.activeChild1));
				var itemIndex = this.filterArr.findIndex(item => item.code == this.activeChild1.code);
				if (itemIndex < 0) {
					this.filterArr.push(addChild);
				} else {
					this.filterArr.splice(itemIndex, 1, addChild);
				}
				this.dfdwShow = false;
				this.afterConfirm();
			},
			afterConfirm() {
				Toast.loading({
					message: "正在查询",
					forbidClick: true,
					duration: 0,
				});
				queryFilterResultSum({
					listCustFilter: this.filterArr
				}, (res) => {
					Toast.clear();
					this.custNumber = res.data.custCnt;
				})
			},
			toSearchRes() {
				if (this.filterArr.length <= 0) {
					Toast("请至少选择1项")
				// } else if (this.custNumber <= 0) {
				// 	Toast("当前筛选条件下无用户")
				} else {
					this.$router.push({
						name: 'groupSearchResult',
						params: {
							filterArr: JSON.stringify(this.filterArr)
						}
					})
				}
			}
		},
		mounted() {
			queryCustAgentCompanyList({
				pageNum: '1',
				pageSize: '9999'
			}, (res) => {
				// console.log(res)
			})
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

	.home {
		height: calc(100vh - calc(constant(safe-area-inset-top) + 0.45rem));
		height: calc(100vh - calc(env(safe-area-inset-top) + 0.45rem));
		overflow-x: hidden;
		overflow-y: auto;
		padding-left: 26.67%;
	}

	:deep(.van-popup) {
		width: 100% !important;
		padding: 0 !important;
		margin: 0 !important;
	}

	:deep(.van-tabs) {
		display: flex;
		flex-wrap: nowrap;
	}

	:deep(.van-tabs>div:first-child) {
		width: 26.67%;
		position: fixed;
		left: 0;
	}

	:deep(.van-tabs__wrap) {
		height: auto;
	}

	:deep(.van-tabs__nav) {
		flex-wrap: wrap;
		padding: 0.27rem 0 0 !important;
		background-color: transparent;
	}

	:deep(.van-tab) {
		width: 100%;
		height: 0.37rem;
		line-height: 0.37rem;
		text-align: center;
		white-space: nowrap;
		padding: 0;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
	}

	:deep(.van-tab--active) {
		background-color: #FFFFFF;
		color: #026DFF;
	}

	:deep(.van-tabs__line) {
		display: none;
	}

	:deep(.van-tabs__content) {
		width: 100% !important;
		background-color: #FFFFFF;
	}

	:deep(.van-tab__panel) {
		width: 100%;
		padding: 0;
		margin: 0;
	}

	.bottomCard {
		width: 100%;
		height: calc(0.58rem + constant(safe-area-inset-bottom));
		height: calc(0.58rem + env(safe-area-inset-bottom));
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background-color: #FFFFFF;
		border-top: solid 0.01rem #F5F5F5;
		position: fixed;
		bottom: 0;
		left: 0;
		padding-left: 0.25rem;
		padding-right: 0.12rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.bottomCard1 {
		height: 0.2rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.2rem;
	}

	.bottomCard2 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.bottomCard1_1 {
		margin-right: 0.11rem;
		height: 0.2rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
		line-height: 0.2rem;
	}

	.bottomCard1_2 {
		width: 0.88rem;
		height: 0.4rem;
		background: #026DFF;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FFFFFF;
		line-height: 0.4rem;
	}

	.plateTitle {
		width: 100%;
		height: 0.48rem;
		border-bottom: solid 0.01rem #F5F5F5;
		padding: 0 0.14rem;
		line-height: 0.48rem;
		text-align: left;
		font-size: 0.17rem;
		font-family: PingFangSC-Semibold, PingFang SC;
		font-weight: 600;
		color: #262626;
	}

	.filterItemBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		padding: 0.06rem 0;
	}

	.filterItem {
		width: 44%;
		margin: 0.06rem 0 0.06rem 4%;
		padding: 0 0.1rem;
		height: 0.4rem;
		background: #F5F5F5;
		border-radius: 0.2rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.filterItem_a {
		background: #F2F8FF;
		color: #026DFF;
	}

	.popupTitle {
		width: 100%;
		height: 0.52rem;
		padding: 0 0.18rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-start;
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
	}

	.popupTitle_dfdw {
		width: 100%;
		height: 0.52rem;
		padding: 0 0.18rem;
		background: #FFFFFF;
		border-radius: 0.1rem 0.1rem 0rem 0rem;
		font-size: 0.16rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.52rem;
		text-align: left;
	}

	.childRemark {
		width: 100%;
		margin: 0.05rem 0;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.19rem;
		text-align: left;
	}

	.childListOutBox {
		width: 100%;
		padding: 0.07rem 0.14rem 0 0.2rem;
		height: calc(100% - 1.28rem - constant(safe-area-inset-bottom));
		height: calc(100% - 1.28rem - env(safe-area-inset-bottom));
		overflow-y: auto;
	}

	.childListBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.childListItem {
		min-width: calc(25% - 0.08rem);
		height: 0.35rem;
		background: #F5F5F5;
		border-radius: 0.2rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		margin: 0 0.08rem 0.12rem 0;
		padding: 0 0.1rem;
	}

	.childListItem_a {
		background: #F2F8FF;
		color: #026DFF;
	}

	.btnBox {
		width: 100;
		height: 0.76rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.btnItem {
		width: 0.88rem;
		height: 0.4rem;
		border-radius: 0.08rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		line-height: 0.4rem;
		margin: 0 0.12rem;
	}

	.btnItem1 {
		border: 0.01rem solid #026DFF;
		color: #026DFF;
	}

	.btnItem2 {
		background: #026DFF;
		color: #FFFFFF;
	}

	.btnItem3 {
		background: #C8C8C8;
		color: #FFFFFF;
	}

	.filterEmpty {
		width: 100%;
		height: 0.4rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #D8D8D8;
		line-height: 0.4rem;
		text-align: center;
	}

	.child3Box {
		position: fixed;
		top: 30%;
		left: 0.18rem;
		z-index: 9999;
		width: calc(100% - 0.36rem);
		background-color: #F2F8FF;
		border: solid 0.01rem #CEE5FF;
		border-radius: 0.08rem;
	}

	.child3BoxDirection {
		box-sizing: border-box;
		position: fixed;
		left: 50%;
		width: 0.2rem;
		height: 0.2rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
	}

	.child3BoxDirectionChild {
		width: 0.1rem;
		height: 0.1rem;
		background-color: #F2F8FF;
		transform: rotateZ(45deg);
		border-top: solid 0.01rem #CEE5FF;
		border-left: solid 0.01rem #CEE5FF;
	}

	.child3InBox {
		width: 100%;
		height: 100%;
		padding: 0.15rem 0.1rem 0.1rem;
	}

	.child3Box_1 {
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.19rem;
		text-align: left;
		margin-bottom: 0.12rem;
	}

	.child3Box_2 {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;

	}

	.child3BoxItem {
		line-height: 0.18rem;
		min-width: calc(25% - 0.08rem);
		height: 0.35rem;
		background: #FFFFFF;
		border-radius: 0.2rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.16rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		margin: 0 0.08rem 0.1rem 0;
		padding: 0 0.1rem;
	}

	.child3BoxItem_a {
		color: #026DFF;
	}

	.child3Box_3 {
		font-size: 0.1rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.15rem;
		text-align: left;
		padding-top: 0.08rem;
		margin-top: 0.02rem;
		border-top: 0.01rem solid #DAECFF;
	}

	.child3Box_4 {
		width: 100%;
		padding: 0.1rem 0.08rem 0.15rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
	}

	.child3Box_4 :deep(.van-cell) {
		border-radius: 0.05rem;
		height: 0.5rem;
		margin: 0 !important;
	}

	.centerLine {
		width: 0.33rem;
		height: 0.01rem;
		margin: 0 0.08rem;
		background-color: #FFFFFF;
		flex-shrink: 0;
	}

	.checkedBox {
		width: 100%;
		background: #F2F8FF;
		border-radius: 0.03rem;
		border: 0.01rem solid #CEE5FF;
		padding: 0.2rem 0.1rem 0.2rem 0.2rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.checkedBox1 {
		width: 100%;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.19rem;
		text-align: left;
	}

	.checkedBox2 {
		height: 0.25rem;
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.25rem;
		margin-right: 0.1rem;
		margin-top: 0.1rem;
	}

	.checkedBox3 {
		height: 0.25rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.25rem;
		padding: 0 0.1rem;
		margin-right: 0.1rem;
		margin-top: 0.1rem;
		background: #FFFFFF;
		border-radius: 0.18rem;
	}

	.childListOutBox :deep(.van-checkbox) {
		width: 100%;
		height: 0.55rem;
		border-bottom: solid 0.01rem #F2F2F2;
	}

	.childListOutBox :deep(.van-checkbox__label) {
		margin-left: 0.4rem;
		font-size: 0.14rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.18rem;
	}

	.searchBox {
		padding: 0.12rem 0;
	}

	.searchBox :deep(.van-field__left-icon) {
		display: flex;
		align-items: center;
		margin-right: 0.08rem;
	}
</style>
