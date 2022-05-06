<template>
	<div>
		<div class="custBtnType"></div>
		<van-popup v-model:show="show" position="bottom" :style="{ height: '70%' }" teleport="#app" :overlay="overlay">
			<van-search class="searchBox" v-model="searchValue" show-action placeholder="请输入搜索关键词" @search="search">
				<template #action>
					<div @click="cancle">取消</div>
				</template>
			</van-search>
			<div class="listBox">
				<div class="chooseAll" @click="checkAll">查看全部</div>
				<div v-if="params.parentRankType=='tz'&&(params.rankType=='1'||params.rankType=='3')">
					<div class="custItem" :class="item.searchResultId==chooseItem.searchResultId?'custItem_a':''" v-for="(item,i) in resList"
						:key="'item'+i" @click="checkItem(item)">
						<van-icon name="search" color="#FF3333" />
						<span style="margin-left: 0.1rem;color: #666666;">{{item.searchResultCxt}}</span>
					</div>
				</div>
				<div v-else>
					<div class="custItem" :class="item.searchResultId==chooseItem.searchResultId?'custItem_a':''" v-for="(item,i) in resList"
						:key="'item'+i" @click="checkItem(item)">
						<div class="leftIcon"></div>
						<div class="rightMsg">
							<div class="topMsg">
								<div class="custName">{{item.searchResultCxt}}</div>
								<div class="custId">工号：{{item.searchResultId}}</div>
							</div>
							<div class="custOrg">归属机构：{{item.searchResultOrgName}}</div>
						</div>
					</div>
				</div>
				<van-loading type="spinner" size="24px" v-show="resList.length==0&&!nodata">加载中...</van-loading>
				<div v-show="nodata" class="nodata">暂无数据</div>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import {
		querySaleRankSearchList
	} from "../../request/index.js";
	import {
		Toast
	} from "vant";
	export default {
		props: {
			orgId: {
				type: String,
				default: ""
			},
			overlay: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				show: false,
				resList: [],
				searchValue: "",
				chooseItem: {},
				params: {},
				canSearch: true,
				nodata: false,
			}
		},
		methods: {
			showPopup(params, searchVal) {
				this.params = params;
				if (searchVal.value) {
					this.show = true;
				} else {
					this.clear();
					this.show = true;
					this.search();
				}
			},
			cancle() {
				this.show = false;
			},
			clear() {
				this.searchValue = "";
				this.resList = [];
				this.chooseItem = {};
			},
			checkItem(item) {
				this.chooseItem = item;
				this.cancle();
				this.$emit("activeItem", item);
			},
			checkAll() {
				this.clear();
				this.cancle();
				this.$emit("activeItem", {});
			},
			search() {
				if (!this.canSearch) return;
				this.canSearch = false;
				this.nodata = false;
				this.resList = [];
				this.chooseItem = {};
				this.getList();
			},
			getList() {
				this.params.searchCxt = this.searchValue;
				querySaleRankSearchList(this.params, (res) => {
					if (res.data && res.data.length) {
						this.resList = res.data;
					} else {
						this.nodata = true;
					}
					this.$nextTick(()=>{
						this.canSearch = true;
					});
				})
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

	.custBtnType {
		width: 0;
		height: 0;
		margin: 0;
		padding: 0;
		border: 0;
	}

	.searchBox {
		width: 100%;
		background-color: #FFFFFF;
		height: 0.5rem;
		padding-left: 3.5%;
		padding-right: 2%;
		border-bottom: solid 1px #EFEFEF !important;
	}

	.listBox {
		margin-top: 0rem;
		height: calc(100% - 0.5rem);
		background-color: #FFFFFF;
		overflow: auto;
	}

	.chooseAll {
		width: 100%;
		font-size: 0.16rem;
		border-bottom: solid 1px #F5F5F5;
		line-height: 0.45rem;
		text-align: center;
		color: #0088FF;
	}

	.custItem {
		width: 95%;
		margin: 0 auto;
		font-size: 0.16rem;
		border-bottom: solid 1px #F5F6FA;
		padding: 0.1rem;
		text-align: left;
		color: #333333;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}

	.custItem_a {
		background-color: #DFDFDF;
	}

	.leftIcon {
		width: 0.25rem;
		height: 0.25rem;
		margin: 0 0.15rem 0 0.02rem;
		background-image: url(../../assets/image/child_custlist_searchUser.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}

	.rightMsg {
		width: calc(100% - 0.35rem);
	}

	.topMsg {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
	}

	.custName {
		width: 35%;
		font-size: 0.16rem;
		font-weight: 500;
		color: #555555;
	}

	.custId {
		font-size: 0.15rem;
		color: #666666;
	}

	.custOrg {
		font-size: 0.15rem;
		color: #666666;
		margin-top: 0.02rem;
	}
	
	.nodata {
		width: 100%;
		line-height: 0.4rem;
		font-size: 0.16rem;
		background-color: #F5F6FA;
		text-align: center;
		color: #888888;
	}
</style>
