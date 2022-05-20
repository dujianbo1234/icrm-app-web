<template>
	<div class="home">
		<van-swipe :autoplay="3000" indicator-color="#026DFF">
			<van-swipe-item v-for="image in swipeImg" :key="image">
				<img style="width: 100vw;" :src="image" />
			</van-swipe-item>
		</van-swipe>
		<div class="menuBox">
			<div class="menuItem" v-for="(menuItem,i) in menuList1" v-show="menuItem.show" :key="'menu1Item'+i"
				@click="openModel(menuItem)" :style="{width:fiveMenu?'20%':'25%'}">
				<div class="menuIcon" :style="{'background-image':'url('+menuItem.icon+')'}"></div>
				<div class="menuName">{{menuItem.title}}</div>
			</div>
		</div>
		<van-notice-bar color="#969696" background="#FFFFFF" mode="link" @click="openModel">
			<template #left-icon>
				<div class="messageIcon"></div>
			</template>
			<span class="msgValue">没有新客怎么办？数据告诉你答案</span>
			<template #right-icon>
				<van-icon :name="require('../../assets/image/tabbar_cust_main_messagePoint.png')" size="8" />
				<van-icon name="arrow" color="#969696" />
			</template>
		</van-notice-bar>
		<div class="busiTitle">商机专区</div>
		<div class="menuOutBox">
			<div class="menuBox" style="flex-wrap: nowrap;">
				<div class="menuItem" v-for="(menuItem,i) in menuList2" :key="'menu2Item'+i" :style="{width:'18.5%'}"
					@click="openModel(menuItem)" style="flex-shrink: 0;">
					<div class="menuIcon" :style="{'background-image':'url('+menuItem.icon+')'}"></div>
					<div class="menuName">{{menuItem.title}}</div>
				</div>
			</div>
		</div>
		<div class="bdOutBox">
			<div class="bdBox">
				<div class="bdTitle">
					<div class="titleIcon"></div>
					<div class="titleTab">
						<div class="tabItem" v-for="(tabItem,i) in busiBdList" :key="'tab1Item'+i"
							:class="i==busiBdIndex?'tabItem_a':''" @click="changeBusiBdTab(i)">{{tabItem}}</div>
					</div>
					<div class="titleMore" @click="showMore">
						<span>更多</span>
						<van-icon name="arrow" color="#48616B" />
					</div>
				</div>
				<div class="bdItem" v-for="(busiBdItem,i) in busiBdValue" :key="'busiBdItem'+i">
					<van-icon :name="require('../../assets/image/tabbar_cust_main_bdTop'+(i+1)+'.png')" size="12" />
					<span style="margin-left: 0.08rem;">{{busiBdItem}}</span>
				</div>
			</div>
		</div>
		<div class="dataOutBox" v-if="$store.state.userMsg.roleId=='00000004'">
			<van-tabs v-model:active="active" line-width="80" color="#0088FF" title-active-color="#0066FF"
				title-inactive-color="#8A8A8A">
				<van-tab title="客户维护情况" />
				<van-tab title="" disabled />
				<van-tab title="" disabled />
			</van-tabs>
			<div class="custDate" ref="dateDrop" @click="showDate=!showDate">
				<span>{{dataDate}} </span>
				<van-icon v-if="showDate" name="arrow-up" />
				<van-icon v-else name="arrow-down" />
			</div>
			<div style="width: 100%; height: 0.1rem;"></div>
			<div class="dataBox">
				<div class="dataItem" v-for="(dataItem,i) in list1" :key="'data1Item'+i" v-show="active==0">
					<div class="dataValue" :style="{color: dataItem.value==0?'#7D7D7D':'#0088FF'}">{{dataItem.value}}
					</div>
					<div class="dataTitle">{{dataItem.title}}</div>
				</div>
				<div class="dataItem" v-for="(dataItem,i) in list2" :key="'data2Item'+i" v-show="active==1">
					<div class="dataValue" :style="{color: dataItem.value==0?'#7D7D7D':'#0088FF'}">{{dataItem.value}}
					</div>
					<div class="dataTitle">{{dataItem.title}}</div>
				</div>
			</div>
		</div>
		<div class="dataOutBox" v-else>
			<van-tabs v-model:active="active" line-width="80" color="#0088FF" title-active-color="#0066FF"
				title-inactive-color="#8A8A8A">
				<van-tab title="客户维护情况" />
				<van-tab title="登录数据统计" />
				<van-tab title="" disabled />
			</van-tabs>
			<van-dropdown-menu :close-on-click-outside="false" active-color="#1989fa">
				<van-dropdown-item ref="orgDrop" :title="chooseOrg.text" @open="$refs.orgList.showPopup()"
					@close="$refs.orgList.cancle()" />
				<van-dropdown-item ref="custDrop" :title="chooseCust.custManagerName" @open="$refs.custList.showPopup()"
					@close="$refs.custList.cancle()" />
				<van-dropdown-item ref="dateDrop" :title="dataDate" @open="showDate=true" @close="showDate=false" />
			</van-dropdown-menu>
			<div class="dataBox">
				<div class="dataItem" v-for="(dataItem,i) in list1" :key="'data1Item'+i" v-show="active==0">
					<div class="dataValue" :style="{color: dataItem.value==0?'#7D7D7D':'#0088FF'}">{{dataItem.value}}
					</div>
					<div class="dataTitle">{{dataItem.title}}</div>
				</div>
				<div class="dataItem" v-for="(dataItem,i) in list2" :key="'data2Item'+i" v-show="active==1">
					<div class="dataValue" :style="{color: dataItem.value==0?'#7D7D7D':'#0088FF'}">{{dataItem.value}}
					</div>
					<div class="dataTitle">{{dataItem.title}}</div>
				</div>
			</div>
		</div>
		<van-popup v-model:show="showDate" :overlay="false" position="bottom">
			<van-datetime-picker v-model="currentDate" type="date" title="选择日期" :min-date="minDate" :max-date="maxDate"
				@cancel="showDate=false;$refs.dateDrop.toggle(false)" @confirm="activeDate" />
		</van-popup>
		<org-list ref="orgList" type="2" :overlay="false" @close="closeOrg" @activeOrg="activeOrg" />
		<cust-list ref="custList" :overlay="false" :orgId="chooseOrg.value" @close="closeCust"
			@activeCust="activeCust" />
		<div class="bottomLine">
			<div class="bottomText">到底啦，我是有底线的</div>
		</div>
	</div>
</template>

<script>
	import {
		querySysDate
	} from "../../request/index.js";
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				swipeImg: [
					require('../../assets/image/tabbar_cust_main_swipe1.png'),
					require('../../assets/image/tabbar_cust_main_swipe1.png'),
					require('../../assets/image/tabbar_cust_main_swipe1.png'),
				],
				topOpacity: 0,
				fiveMenu: false,
				menuList1: [{
						title: "重要潜客",
						icon: require('../../assets/image/tabbar_cust_main_menu01.png'),
						show: false
					},
					{
						title: "我的群组",
						icon: require('../../assets/image/tabbar_cust_main_menu02.png'),
						show: false
					},
					{
						title: "条件群组",
						icon: require('../../assets/image/tabbar_cust_main_menu03.png'),
						show: false
					},
					{
						title: "动态分析",
						icon: require('../../assets/image/tabbar_cust_main_menu04.png'),
						show: false
					},
					{
						title: "鱼骨图",
						icon: require('../../assets/image/tabbar_cust_main_menu05.png'),
						show: false
					},
					{
						title: "提醒",
						icon: require('../../assets/image/tabbar_cust_main_menu06.png'),
						show: false
					},
					{
						title: "存量客户",
						icon: require('../../assets/image/tabbar_cust_main_menu07.png'),
						show: false
					},
					{
						title: "客户公共池",
						icon: require('../../assets/image/tabbar_cust_main_menu08.png'),
						show: false
					},
					{
						title: "短信审批",
						icon: require('../../assets/image/tabbar_cust_main_menu09.png'),
						show: false
					},
					{
						title: "更多",
						icon: require('../../assets/image/tabbar_cust_main_menu10.png'),
						show: false
					}
				],
				menuList2: [{
						title: "全部客群",
						icon: require('../../assets/image/tabbar_cust_main_menu16.png')
					}, {
						title: "财富客群",
						icon: require('../../assets/image/tabbar_cust_main_menu11.png')
					},
					{
						title: "贷款客群",
						icon: require('../../assets/image/tabbar_cust_main_menu12.png')
					},
					{
						title: "商户客群",
						icon: require('../../assets/image/tabbar_cust_main_menu13.png')
					},
					{
						title: "代发客群",
						icon: require('../../assets/image/tabbar_cust_main_menu14.png')
					},
					{
						title: "新客客群",
						icon: require('../../assets/image/tabbar_cust_main_menu15.png')
					}
				],
				busiBdIndex: 0,
				busiBdList: ["热榜", "成交榜", "好评榜"],
				busiBdValue: ["商户有效率提升", "金卡客户数提升", "VIP客户提升-代发客群"],
				active: 0,
				dataDate: "",
				showDate: false,
				currentDate: "",
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(2025, 10, 1),
				chooseOrg: {
					text: "选择机构",
					value: ""
				},
				chooseCust: {
					custManagerName: "客户经理",
					custManagerID: ""
				},
				list1: [{
						title: "商机跟进数",
						value: "3"
					},
					{
						title: "提醒阅读数",
						value: "0"
					},
					{
						title: "必办完成数",
						value: "0"
					},
					{
						title: "潜客录入数",
						value: "6"
					},
				],
				list2: [{
						title: "已登录人数",
						value: "21"
					},
					{
						title: "未登录人数",
						value: "36"
					},
				]
			}
		},
		methods: {
			changeBusiBdTab(i) {
				if (this.busiBdIndex == i) return;
				this.busiBdIndex = i;
			},
			// 打开商机热榜
			showMore() {
				this.$router.push('shangJiHot')
			},
			openModel(val) {
				switch (val.title) {
					case "重要潜客":
						this.$router.push('./impQZCust');
						break;
					case "存量客户":
						this.$router.push('./clCustList');
						break;
					case "短信审批":
						this.$router.push('messageSend');
						break;
					case "提醒":
						this.$router.push('./message');
						break;
					case "全部客群":
						this.$router.push('./business');
						break;
					case "财富客群":
						this.$router.push({
							name: 'business',
							params: {
								pageType: 1
							}
						});
						break;
					case "贷款客群":
						this.$router.push({
							name: 'business',
							params: {
								pageType: 4
							}
						});
						break;
					case "商户客群":
						this.$router.push({
							name: 'business',
							params: {
								pageType: 2
							}
						});
						break;
					case "代发客群":
						this.$router.push({
							name: 'business',
							params: {
								pageType: 3
							}
						});
						break;
					case "新客客群":
						this.$router.push({
							name: 'business',
							params: {
								pageType: 5
							}
						});
						break;
					default:
						Toast("功能开发中");
						break;
				}
			},
			closeOrg() {
				this.$refs.orgDrop.toggle(false)
			},
			closeCust() {
				this.$refs.custDrop.toggle(false)
			},
			activeOrg(orgValue) {
				if (orgValue.value) {
					this.chooseOrg = orgValue
				} else {
					this.chooseOrg = {
						text: "选择机构",
						value: ""
					}
				};
				this.chooseCust = {
					custManagerName: "客户经理",
					custManagerID: ""
				};
				this.$refs.custList.clear();
				this.$refs.orgDrop.toggle(false);
				this.getData();
			},
			activeCust(custMsg) {
				if (custMsg.custManagerID) {
					this.chooseCust = custMsg
				} else {
					this.chooseCust = {
						custManagerName: "客户经理",
						custManagerID: ""
					};
				};
				this.getData();
			},
			activeDate(val) {
				var dateArr = val.toLocaleString().split(" ")[0].split("/");
				dateArr[1].length < 2 ? dateArr[1] = '0' + dateArr[1].toString() : '';
				dateArr[2].length < 2 ? dateArr[2] = '0' + dateArr[2].toString() : '';
				this.dataDate = dateArr.join(".");
				this.$refs.dateDrop.toggle(false);
				this.getData();
			},
			getData() {

			},
		},
		mounted() {
			var menu = [];
			switch (this.$store.state.userMsg.roleId) {
				// case "00000001":menu = ["存量客户管理","潜在客户管理","统计报表","短信审批","VIP客户群","贷款客户群","收单客户群"];break;// 总行管理员（业务）
				// case "00000002":menu = ["存量客户管理","潜在客户管理","统计报表","短信审批","VIP客户群","贷款客户群","收单客户群"];break;// 分行管理员
				// case "00000003":menu = ["存量客户管理","潜在客户管理","统计报表","短信审批","客户公共池管理","VIP客户群","贷款客户群","收单客户群"];break;// 支行管理员
				// case "00000004":menu = ["存量客户管理","潜在客户管理","营销服务","百户长营销活动","客户公共池管理","VIP客户群","贷款客户群","收单客户群"];break;// 客户经理
				// case "00000005":menu = ["存量客户管理","潜在客户管理","统计报表","VIP客户群","贷款客户群","收单客户群"];break;// 系统管理员（科技）
				// case "00000006":menu = ["存量客户管理","潜在客户管理","VIP客户群","贷款客户群","收单客户群"];break;// 总行领导
				// case "00000007":menu = ["存量客户管理","潜在客户管理","VIP客户群","贷款客户群","收单客户群"];break;// 分行领导
				// case "00000008":menu = ["存量客户管理","潜在客户管理","统计报表","客户公共池管理","短信审批","VIP客户群","贷款客户群","收单客户群"];break;// 二级支行管理员
				// case "00000009":menu = ["存量客户管理","潜在客户管理","统计报表","客户公共池管理","VIP客户群","贷款客户群","收单客户群"];break;// 理财经理
				case "00000001":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "短信审批", "更多"];
					break; // 总行管理员（业务）
				case "00000002":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "短信审批", "更多"];
					break; // 分行管理员
				case "00000003":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "客户公共池", "短信审批", "更多"];
					break; // 支行管理员
				case "00000004":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "客户公共池", "更多"];
					break; // 客户经理
				case "00000005":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "更多"];
					break; // 系统管理员（科技）
				case "00000006":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "更多"];
					break; // 总行领导
				case "00000007":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "更多"];
					break; // 分行领导
				case "00000008":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "客户公共池", "短信审批", "更多"];
					break; // 二级支行管理员
				case "00000009":
					menu = ["重要潜客", "我的群组", "条件群组", "动态分析", "鱼骨图", "提醒", "存量客户", "客户公共池", "更多"];
					break; // 理财经理
			}
			menu.forEach((mItem) => {
				console.log(mItem)
				this.menuList1.find(item => item.title == mItem).show = true
			})
			let showMenu = this.menuList1.map(item => item.show);
			this.fiveMenu = showMenu.length > 8;
			querySysDate({}, (res) => {
				if (res.data) {
					this.dataDate = res.data.slice(0, 4) + "." + res.data.slice(4, 6) + "." + res.data.slice(6,
						8);
					var nowDateArr = this.dataDate.split(".");
					var date = new Date(this.dataDate.split(".").join("/"));
					date.setMonth(date.getMonth() - 3);
					date.toLocaleDateString();
					this.minDate = date;
					this.maxDate = this.currentDate = new Date(Number(nowDateArr[0]), Number(nowDateArr[1]) -
						1, Number(
							nowDateArr[2]));
					this.getData();
				} else {
					Toast.fail("系统跑批日期数据为空")
				}
			})
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
		background-color: #FFFFFF;
		margin-top: calc(calc(constant(safe-area-inset-top) + 0.5rem) * -1);
		margin-top: calc(calc(env(safe-area-inset-top) + 0.5rem) * -1);
		padding-bottom: 0.2rem;
	}

	.menuOutBox {
		width: 100%;
		padding: 0 0.05rem;
		overflow-y: auto;
	}

	.menuOutBox::-webkit-scrollbar {
		display: none;
	}

	.menuBox {
		margin: 0 auto 0.11rem;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}

	.menuItem {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.menuIcon {
		width: 0.24rem;
		height: 0.24rem;
		margin-top: 0.16rem;
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
	}

	.menuName {
		width: 100%;
		height: 0.18rem;
		margin-top: 0.1rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #262626;
		line-height: 0.18rem;
	}

	:deep(.van-notice-bar) {
		margin: 0 3%;
		padding: 0 0.05rem;
		border: solid 0.01rem #F7F7F7;
		font-size: 0.13rem;
		border-radius: 0.02rem;
	}

	.messageIcon {
		width: 0.31rem;
		height: 0.13rem;
		background: url(../../assets/image/tabbar_cust_main_message.png) no-repeat center;
		background-size: 100%;
		margin-right: 0.07rem;
	}

	.msgValue {
		font-size: 0.13rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #8C8C8C;
	}

	.busiTitle {
		margin-top: 0.1rem;
		padding: 0 0.13rem;
		width: 100%;
		height: 0.21rem;
		font-size: 0.17rem;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #262626;
		line-height: 0.21rem;
		text-align: left;
	}

	.bdOutBox::-webkit-scrollbar {
		display: none;
	}

	.bdBox {
		background: #FFFFFF;
		box-shadow: 0rem 0.02rem 0.1rem 0rem rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		width: 93.6%;
		margin: 0.03rem 3.2%;
	}

	.bdTitle {
		width: 100%;
		height: 0.44rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		background-image: linear-gradient(to right, #f4f7fd, #e4f2fd, #dbeffe, #c5e3fd, #adcbfc);
		font-size: 0.12rem;
		align-items: center;
		padding: 0 0.15rem;
		border-top-left-radius: 0.08rem;
		border-top-right-radius: 0.08rem;
	}

	.titleIcon {
		width: 0.66rem;
		height: 0.14rem;
		background: url(../../assets/image/tabbar_cust_main_sjbd.png) no-repeat center;
		background-size: contain;
		flex-shrink: 0;
		margin-right: 0.23rem;
	}

	.titleTab {
		display: flex;
		width: 100%;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
		flex-shrink: 1;
	}

	.tabItem {
		height: 0.16rem;
		background: #FAFAFA;
		border-radius: 0.09rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #BFBFBF;
		line-height: 0.16rem;
		padding: 0 0.12rem;
	}

	.tabItem_a {
		height: 0.17rem;
		background: #FFFFFF;
		border-radius: 0.09rem;
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #026DFF;
		line-height: 0.17rem;
	}

	.titleMore {
		font-size: 0.12rem;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #595959;
		width: 0.75rem;
		text-align: right;
	}

	.bdItem {
		width: 90%;
		margin: 0 auto;
		font-size: 0.15rem;
		text-align: left;
		padding: 0.15rem 0;
		border-bottom: solid 1px #F2F2F2;
	}

	.bdItem:last-child {
		border: 0;
	}

	.bottomLine {
		height: 0.2rem;
		width: 60%;
		margin: 0.1rem auto;
		border-bottom: solid 0.01rem #F4F4F4;
		position: relative;
		display: flex;
		justify-content: center;
	}

	.bottomText {
		font-size: 0.12rem;
		padding: 0 0.1rem;
		color: #D8D8D8;
		background-color: #FFFFFF;
		position: absolute;
		bottom: -50%;
	}

	.dataOutBox {
		background: #FFFFFF;
		box-shadow: 0rem 0.02rem 0.1rem 0rem rgba(217, 229, 242, 0.6);
		border-radius: 0.08rem;
		width: 93.6%;
		margin: 0.1rem 3.2%;
		padding-bottom: 0.18rem;
		position: relative;
	}

	.dataBox {
		width: 92%;
		margin: 0 auto;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		overflow-x: auto;
	}

	.dataBox::-webkit-scrollbar {
		display: none;
	}

	.dataItem {
		width: 1rem;
		padding: 0.1rem;
		border: solid 0.01rem #F0F0F0;
		margin-right: 0.07rem;
		border-radius: 0.05rem;
		flex-shrink: 0;
	}

	.dataValue {
		font-size: 0.18rem;
		text-align: left;
		font-weight: 500;
	}

	.dataTitle {
		color: #7D7D7D;
		font-size: 0.13rem;
		text-align: left;
	}

	:deep(.van-dropdown-menu__bar) {
		border-bottom: 0 !important;
	}

	.custDate {
		font-size: 0.14rem;
		position: absolute;
		top: 0.15rem;
		right: 0.25rem;
	}
</style>
