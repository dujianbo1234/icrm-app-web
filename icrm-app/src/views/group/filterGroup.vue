<template>
	<div class="home">
		<nav-bar title="条件群组" type="2" leftIcon />
		<van-tabs v-model:active="active" ref="mainTab" scrollspy sticky>
			<van-tab v-for="(filterItem,i) in filterList" :key="'filterItem'+i" v-show="!filterItem.disabled"
				:title="filterItem.value">
				<div class="plateTitle">{{filterItem.title}}</div>
				<div class="filterItemBox">
					<div class="filterEmpty" v-if="!filterItem.list.length">
						—— 暂无可筛选指标 ——
					</div>
					<div class="filterItem" v-for="(filterItemChild,j) in filterItem.list" :key="'filterItemChild'+j"
						:class="(activeChild1.code==filterItemChild.code||findFilter(filterItemChild,4,true)>=0)?'filterItem_a':''"
						v-show="!filterItemChild.disabled" @click="checkChild1(filterItemChild)">
						<span class="ycsl" style="width: 100%;">
							{{findFilter(filterItemChild,4)?findFilter(filterItemChild,4).name.split("#")[0]:filterItemChild.title}}
						</span>
						<span class="ycsl" style="width: 100%;font-size: 0.11rem;"
							v-if="findFilter(filterItemChild,4,true)>=0">
							<span v-if="findFilter(filterItemChild,4).value">
								{{findFilter(filterItemChild,4).value}}
							</span>
							<span
								v-else-if="findFilter(filterItemChild,4).minValue&&findFilter(filterItemChild,4).maxValue">
								[{{findFilter(filterItemChild,4).minValue}},{{findFilter(filterItemChild,4).maxValue}})
							</span>
							<span v-else-if="findFilter(filterItemChild,4).minValue">
								≥{{findFilter(filterItemChild,4).minValue}}
							</span>
							<span v-else-if="findFilter(filterItemChild,4).maxValue">
								＜{{findFilter(filterItemChild,4).maxValue}}
							</span>
							<span v-else-if="findFilter(filterItemChild,4).values">
								{{findFilter(filterItemChild,4).values}}
							</span>
						</span>
						<div class="delButton" v-if="findFilter(filterItemChild,4,true)>=0"
							@click.stop="delFilter(filterItemChild)"></div>
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
		<van-popup v-model:show="defaultShow" position="bottom" style="height: 5rem" round :lock-scroll="false"
			:close-on-click-overlay="true" close-on-popstate>
			<div ref="positionBox" style="position: relative;height: 100%;width: 100%;">
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
						<div class="child2Remark" v-show="!child3Show&&!child3Show_c&&activeChild2.remark">
							{{activeChild2.remark}}
						</div>
					</div>
				</div>
				<div class="btnBox">
					<div class="btnItem btnItem1" @click="defaultShow=false">取消</div>
					<div class="btnItem btnItem2" v-if="canConfirm" @click="defaultConfirm">确定</div>
					<div class="btnItem btnItem3" v-else>确定</div>
				</div>
				<div class="child3BoxDirection" ref="child3BoxDirection" v-show="child3Show||child3Show_c">
					<div class="child3BoxDirectionChild"></div>
				</div>
				<div class="child3Box" ref="child3Box" v-show="child3Show">
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
		</van-popup>
		<van-popup v-model:show="MCCShow" position="bottom" style="height: 5rem" round :lock-scroll="false"
			:close-on-click-overlay="true" close-on-popstate>
			<div class="popupTitle_dfdw">行业MCC码</div>
			<div class="childListOutBox" style="padding: 0.12rem 0.18rem 0;">
				<div class="checkedBox">
					<div class="checkedBox1">{{activeChild1.remark}}</div>
					<div class="checkedBox2">已选（{{MCCChecked.length}}）</div>
					<div class="checkedBox3" v-for="(MCCNameItem,i) in MCCChecked" :key="'MCCNameItem'+i">
						{{MCCNameItem}}
					</div>
				</div>
				<div class="searchBox">
					<van-search v-model="searchValue" shape="round" show-action placeholder="请输入行业MCC码"
						@update:model-value="onSearch" :left-icon="require('../../assets/image/common_search.png')">
						<template #action>
							<div style="color: #026DFF;font-size: 0.14rem;padding-left: 0.1rem;" @click="onSearch">搜索
							</div>
						</template>
					</van-search>
				</div>
				<van-checkbox-group v-model="MCCChecked">
					<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
						:immediate-check="false">
						<van-checkbox
							v-for="(MCCNameItem,i) in (showLength>=MCCShowList.length?MCCShowList:MCCShowList.slice(0,showLength))"
							:key="'dfdwItem'+i" :name="MCCNameItem" style="text-align: left;">
							{{MCCNameItem}}
						</van-checkbox>
					</van-list>
				</van-checkbox-group>
			</div>
			<div class="btnBox">
				<div class="btnItem btnItem1" @click="MCCShow=false">取消</div>
				<div class="btnItem btnItem2" v-if="MCCChecked.length" @click="MCCConfirm">确定</div>
				<div class="btnItem btnItem3" v-else>确定</div>
			</div>
		</van-popup>
		<van-popup v-model:show="dfdwShow" position="bottom" style="height: 5rem" round :lock-scroll="false"
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
					<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
						:immediate-check="false">
						<van-checkbox
							v-for="(dfdwItem,i) in (showLength>=dfdwShowList.length?dfdwShowList:dfdwShowList.slice(0,showLength))"
							:key="'dfdwItem'+i" :name="dfdwItem" style="text-align: left;">
							{{dfdwItem}}
						</van-checkbox>
					</van-list>
				</van-checkbox-group>
			</div>
			<div class="btnBox">
				<div class="btnItem btnItem1" @click="dfdwShow=false">取消</div>
				<div class="btnItem btnItem2" v-if="dfdwChecked.length" @click="dfdwConfirm">确定</div>
				<div class="btnItem btnItem3" v-else>确定</div>
			</div>
		</van-popup>
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
		queryFilterResultCount
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
				dfdwList: [],
				dfdwShowList: [],
				MCCShow: false,
				MCCChecked: [],
				MCCList: [],
				MCCShowList: [],
				searchValue: "",
				pageReady: 0,
				loading: false,
				finished: false,
				showLength: 0,
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
					this.searchValue = "";
					this.dfdwShowList = this.dfdwList;
				} else {
					this.loading = false;
					this.finished = false;
					this.showLength = 0;
					setTimeout(() => {
						this.onLoad();
					}, 300)
				}
			},
			MCCShow() {
				if (!this.MCCShow) {
					this.activeChild1 = {};
					this.searchValue = "";
					this.MCCShowList = this.MCCList;
				} else {
					this.loading = false;
					this.finished = false;
					this.showLength = 0;
					setTimeout(() => {
						this.onLoad();
					}, 300)
				}
			},
		},
		computed: {
			canConfirm() {
				if (this.activeChild2.title) {
					if (this.activeChild2.title == "自定义") {
						if (this.activeChild2.minValue == "." || this.activeChild2.minValue == "-" ||
							this.activeChild2.maxValue == "." || this.activeChild2.maxValue == "-") {
							return false;
						} else {
							return this.activeChild2.minValue || this.activeChild2.maxValue;
						}
					} else {
						if (this.activeChild2.list.length) {
							if (this.activeChild3.title) {
								if (this.activeChild3.title == "自定义") {
									if (this.activeChild3.minValue == "." || this.activeChild3.minValue == "-" ||
										this.activeChild3.maxValue == "." || this.activeChild3.maxValue == "-") {
										return false;
									} else {
										return this.activeChild3.minValue || this.activeChild3.maxValue;
									}
								} else {
									return true;
								}
							} else {
								return false;
							}
						} else {
							return true;
						}
					}
				} else {
					return false;
				}
			}
		},
		methods: {
			findFilter(item, length, index) {
				if (index) {
					return this.filterArr.findIndex(items => items.code.slice(0, length) == item.code.slice(0, length))
				} else {
					return this.filterArr.find(items => items.code.slice(0, length) == item.code.slice(0, length))
				}
			},
			onLoad() {
				if (this.pageReady < 2) return;
				this.loading = true;
				this.finished = false;
				this.showLength += 10;
				this.loading = false;
				if (this.dfdwShow) {
					if (this.showLength >= this.dfdwShowList.length) {
						this.finished = true;
					}
				} else if (this.MCCShow) {
					if (this.showLength >= this.MCCShow.length) {
						this.finished = true;
					}
				}
			},
			onSearch() {
				this.dfdwShowList = [];
				this.MCCShowList = [];
				this.dfdwList.forEach((item) => {
					if (item.includes(this.searchValue)) this.dfdwShowList.push(item)
				});
				this.MCCList.forEach((item) => {
					if (item.includes(this.searchValue)) this.MCCShowList.push(item)
				});
			},
			checkChild1(item) {
				item.minValue = "";
				item.maxValue = "";
				this.activeChild1 = item;
				switch (item.code) {
					case "03020000":
						var MCC = this.filterArr.find(item => item.code == "03020000");
						if (MCC) {
							this.MCCChecked = MCC.values.split(",");
						} else {
							this.MCCChecked = [];
						}
						this.MCCShow = true;
						break;
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
						var thirdItem = this.findFilter(item, 4);
						if (thirdItem && thirdItem.code.slice(-2) != "00") {
							let cc2_item = this.activeChild1.list.find(ac1 => ac1.code.slice(0, 6) == thirdItem.code.slice(
								0, 6));
							let cc2_i = this.activeChild1.list.findIndex(ac1 => ac1.code.slice(0, 6) == thirdItem.code
								.slice(0, 6));
							setTimeout(() => {
								this.checkChild2(cc2_item, cc2_i);
							}, 220);
						};
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
					var outBox = this.$refs.positionBox;
					var top = box.getBoundingClientRect().top,
						left = box.getBoundingClientRect().left,
						width = box.offsetWidth,
						delTop = outBox.getBoundingClientRect().top;
					this.$refs.child3BoxDirection.style.top = "calc(" + (top + 10 - delTop) + "px + 0.25rem)";
					this.$refs.child3BoxDirection.style.left = "calc(" + (left + width / 2) + "px - 0.1rem)";
					if (this.activeChild2.title == "自定义") {
						this.$refs.child3Box_c.style.top = "calc(" + (top + 10 - delTop) + "px + 0.35rem)";
						this.child3Show_c = true;
					}
					if (this.activeChild2.list.length) {
						this.$refs.child3Box.style.top = "calc(" + (top + 10 - delTop) + "px + 0.35rem)";
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
				if (addChild.maxValue && addChild.minValue && Number(addChild.maxValue) < Number(addChild.minValue)) {
					Toast("最大值不能小于最小值");
					return;
				}
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
			MCCConfirm() {
				this.activeChild1.values = this.MCCChecked.join(",");
				var addChild = JSON.parse(JSON.stringify(this.activeChild1));
				var itemIndex = this.filterArr.findIndex(item => item.code == this.activeChild1.code);
				if (itemIndex < 0) {
					this.filterArr.push(addChild);
				} else {
					this.filterArr.splice(itemIndex, 1, addChild);
				}
				this.MCCShow = false;
				this.afterConfirm();
			},
			afterConfirm() {
				Toast.loading({
					message: "正在查询",
					forbidClick: true,
					duration: 0,
				});
				queryFilterResultCount({
					listCustFilter: this.filterArr
				}, (res) => {
					Toast.clear();
					this.custNumber = res.data;
				})
			},
			delFilter(item) {
				var index = this.findFilter(item, 4, true);
				if (index >= 0) {
					this.filterArr.splice(index, 1);
					if (this.filterArr.length) {
						this.afterConfirm();
					} else {
						this.custNumber = 0;
					}
				}
			},
			toSearchRes() {
				if (this.filterArr.length <= 0) {
					Toast("请至少选择1项")
				} else if (this.custNumber <= 0) {
					Toast("当前筛选条件下无用户")
				} else {
					localStorage.setItem("newFilterGroup", "0");
					this.$router.push({
						name: 'groupSearchResult',
						params: {
							filterArr: JSON.stringify(this.filterArr)
						}
					})
				}
			},
			mounted_m() {
				var timer = setInterval(() => {
					if (this.pageReady >= 2) {
						clearInterval(timer);
						timer = "";
						Toast.clear();
						this.onLoad();
					}
				}, 100)
			}
		},
		beforeRouteEnter(to, from, next) {
			if (from.name == "cust") localStorage.setItem("newFilterGroup", "1");
			next();
		},
		mounted() {
			localStorage.setItem("newFilterGroup", "0");
			queryCustAgentCompanyList({
				pageNum: "1",
				pageSize: "9999",
				searchType: "1"
			}, (res) => {
				if (res.data && res.data.records && res.data.records.length) {
					var result1 = [];
					res.data.records.forEach(item => result1.push(item.agentCompany))
					result1 = result1.join(",").split(",");
					result1.forEach((item) => {
						if (this.dfdwList.findIndex(dfdwItem => dfdwItem == item) < 0) {
							this.dfdwList.push(item)
						}
					})
					this.dfdwShowList = this.dfdwList;
					this.pageReady++;
				}
			})
			queryCustAgentCompanyList({
				pageNum: "1",
				pageSize: "9999",
				searchType: "2"
			}, (res) => {
				if (res.data && res.data.records && res.data.records.length) {
					var result2 = [];
					res.data.records.forEach(item => result2.push(item.mccCodeNm));
					result2 = result2.join(",").split(",");
					result2.forEach((item) => {
						if (this.MCCList.findIndex(MCCItem => MCCItem == item) < 0) {
							this.MCCList.push(item)
						}
					})
					this.MCCShowList = this.MCCList;
					this.pageReady++;
				}
			})
			this.mounted_m();
		},
		activated() {
			if (localStorage.getItem("newFilterGroup") == "0") {
				localStorage.setItem("newFilterGroup", "1")
				this.$refs.mainTab.scrollTo(this.active)
			} else {
				this.active = 0;
				this.activeChild1 = {};
				this.activeChild2 = {};
				this.activeChild3 = {};
				this.defaultShow = false;
				this.filterArr = [];
				this.custNumber = 0;
				this.child3Show = false;
				this.child3Show_c = false;
				this.dfdwShow = false;
				this.dfdwChecked = [];
				this.MCCShow = false;
				this.MCCChecked = [];
				this.searchValue = "";
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
		padding: 0.04rem 0.1rem;
		height: 0.4rem;
		background: #F5F5F5;
		border-radius: 0.2rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.16rem;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		position: relative;
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

	.child2Remark {
		width: 100%;
		font-size: 0.11rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		line-height: 0.18rem;
		text-align: left;
		padding-top: 0.08rem;
		margin-top: 0.02rem;
		border-top: 0.01rem solid #F5F5F5;
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
		position: absolute;
		left: 0.18rem;
		z-index: 9999;
		width: calc(100% - 0.36rem);
		background-color: #F2F8FF;
		border: solid 0.01rem #CEE5FF;
		border-radius: 0.08rem;
	}

	.child3BoxDirection {
		box-sizing: border-box;
		position: absolute;
		width: 0.2rem;
		height: 0.2rem;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		z-index: 10000;
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

	.delButton {
		width: 0.15rem;
		height: 0.15rem;
		position: absolute;
		top: -0.02rem;
		right: -0.02rem;
		background-image: url(../../assets/image/common_delete.png);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
</style>
