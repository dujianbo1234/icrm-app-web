<template>
	<div class="home">
		<nav-bar :title="pageChange?'重要潜客登记':'重要潜客详情'" type="2" leftIcon />
		<div class="progressBox">
			<div class="progressItem_a" style="z-index: 3;">意向阶段</div>
			<div :class="baseMsg.curTage=='1'?'progressItem':'progressItem_a'" style="z-index: 2;">促成阶段</div>
			<div class="progressItem_a" v-if="baseMsg.curTage=='4'" style="z-index: 1;">已流失</div>
			<div :class="baseMsg.curTage=='3'?'progressItem_a':'progressItem'" v-else style="z-index: 1;">已完成</div>
		</div>
		<div style="width: 100%;height: 0.48rem;"></div>
		<van-cell-group title="基本信息">
			<template #title v-if="true">
				<div style="position: relative;">
					<div>基本信息</div>
					<div class="fpBtn" v-if="$store.state.userMsg.roleId!='00000004'&&!pageChange"
						@click="$refs.custList.showPopup()">分配</div>
				</div>
			</template>
			<van-field label="客户名称" v-model="baseMsg.cstName" readonly :disabled="pageChange" input-align="right" />
			<van-field label="关键人" v-model="baseMsg.impPerson" :readonly="!pageChange"
				:placeholder="pageChange?'请输入关键人':''" input-align="right" />
			<van-field label="联系电话" v-model="baseMsg.phone" :readonly="!pageChange" placeholder="请输入"
				input-align="right" />
			<van-field label="业务类型" v-model="baseMsg.busiTypeNm" readonly :disabled="pageChange" input-align="right" />
			<van-field label="预估成交额" v-if="busiType==='0'||busiType==='1'" :readonly="!pageChange" class="labelREM"
				v-model="baseMsg.estAmt" :formatter="formatter2" :placeholder="pageChange?'万元':''" input-align="right"
				type="number" />
			<van-field label="预估获客数" v-if="busiType==='0'||busiType==='2'" :readonly="!pageChange" class="labelREM"
				v-model="baseMsg.estCst" :formatter="formatter1" :placeholder="pageChange?'人':''" input-align="right"
				type="number" />
			<div :class="pageChange?'flexWrap':'flexWrap_a'">
				<van-field label="客户描述" v-model="baseMsg.cstDesc" :readonly="!pageChange" :rows="pageChange?'4':'1'"
					:placeholder="pageChange?'请输入客户描述':''" input-align="left" maxlength="200" type="textarea"
					:autosize="!pageChange" />
			</div>
			<div class="bottomLine"></div>
			<van-field label="创建时间" v-model="baseMsg.createDate" readonly :disabled="pageChange" input-align="right" />
		</van-cell-group>
		<van-cell-group title="营销信息" v-if="!pageChange">
			<van-field label="机构名称" v-model="baseMsg.orgName" readonly input-align="right" />
		</van-cell-group>
		<div v-if="!pageChange" class="allTime">总用时：{{allTime}}</div>
		<van-steps v-if="!pageChange" direction="vertical" :active="active" active-icon="success"
			active-color="#B7B7B7">
			<van-step v-if="curTage1List.length">
				<div class="YXTitle">意向阶段</div>
				<div class="YXItem" v-for="(item,i) in curTage1List" :key="'curTage1Item'+i">
					<div class="YXDesc" :style="{'-webkit-line-clamp':item.showDesc?'100':'15'}" @click="item.showDesc=!item.showDesc">
						{{item.tageDesc}}</div>
					<div class="YXTime">跟进人：{{item.cstMagName}}（{{item.cstMagNo}}）</div>
					<div class="YXTime">跟进时间：{{item.markTime}}</div>
				</div>
				<div class="YXTime" style="padding-top: 0.1rem;">阶段用时：{{curTage1Time}}</div>
				<div class="YXDate">
					<div class="YXDate1">
						{{curTage1List[0].markTime.slice(5,10).split("-").join("/")}}
					</div>
					<div class="YXDate2">{{curTage1List[0].markTime.slice(-8)}}</div>
				</div>
				<template #active-icon>
					<div class="active-icon-out">
						<div class="active-icon-in"></div>
					</div>
				</template>
				<template #inactive-icon>
					<div class="inactive-icon"></div>
				</template>
			</van-step>
			<van-step v-if="curTage2List.length">
				<div class="YXTitle">促成阶段</div>
				<div class="YXItem" v-for="(item,i) in curTage2List" :key="'curTage2Item'+i">
					<div class="YXDesc" :style="{'-webkit-line-clamp':item.showDesc?'100':'15'}" @click="item.showDesc=!item.showDesc">
						{{item.tageDesc}}</div>
					<div class="YXTime">跟进人：{{item.cstMagName}}（{{item.cstMagNo}}）</div>
					<div class="YXTime">跟进时间：{{item.markTime}}</div>
				</div>
				<div class="YXTime">阶段用时：{{curTage2Time}}</div>
				<div class="YXDate">
					<div class="YXDate1">
						{{curTage2List[0].markTime.slice(5,10).split("-").join("/")}}
					</div>
					<div class="YXDate2">{{curTage2List[0].markTime.slice(-8)}}</div>
				</div>
				<template #active-icon>
					<div class="active-icon-out">
						<div class="active-icon-in"></div>
					</div>
				</template>
				<template #inactive-icon>
					<div class="inactive-icon"></div>
				</template>
			</van-step>
			<van-step v-if="curTage3List.length">
				<div class="YXTitle">已完成</div>
				<div class="YXItem" v-for="(item,i) in curTage3List" :key="'curTage3Item'+i">
					<div class="YXDesc" :style="{'-webkit-line-clamp':item.showDesc?'100':'15'}" @click="item.showDesc=!item.showDesc">
						{{item.tageDesc}}</div>
					<div class="YXTime">跟进人：{{item.cstMagName}}（{{item.cstMagNo}}）</div>
					<div class="YXTime">跟进时间：{{item.markTime}}</div>
				</div>
				<div class="YXDate">
					<div class="YXDate1">
						{{curTage3List[0].markTime.slice(5,10).split("-").join("/")}}
					</div>
					<div class="YXDate2">{{curTage3List[0].markTime.slice(-8)}}</div>
				</div>
				<template #active-icon>
					<div class="active-icon-out">
						<div class="active-icon-in"></div>
					</div>
				</template>
				<template #inactive-icon>
					<div class="active-icon-out">
						<div class="active-icon-in"></div>
					</div>
				</template>
			</van-step>
			<van-step v-if="curTage4List.length">
				<div class="YXTitle">已流失</div>
				<div class="YXItem" v-for="(item,i) in curTage4List" :key="'curTage4Item'+i">
					<div class="YXDesc" :style="{'-webkit-line-clamp':item.showDesc?'100':'15'}" @click="item.showDesc=!item.showDesc">
						{{item.tageDesc}}</div>
					<div class="YXTime">跟进人：{{item.cstMagName}}（{{item.cstMagNo}}）</div>
					<div class="YXTime">跟进时间：{{item.markTime}}</div>
				</div>
				<div class="YXDate">
					<div class="YXDate1">
						{{curTage4List[0].markTime.slice(5,10).split("-").join("/")}}
					</div>
					<div class="YXDate2">{{curTage4List[0].markTime.slice(-8)}}</div>
				</div>
				<template #active-icon>
					<div class="active-icon-out">
						<div class="active-icon-in"></div>
					</div>
				</template>
				<template #inactive-icon>
					<div class="active-icon-out">
						<div class="active-icon-in"></div>
					</div>
				</template>
			</van-step>
		</van-steps>
		<van-cell-group title="营销信息" v-if="pageChange&&(baseMsg.curTage=='1'||baseMsg.curTage=='2')">
			<van-field label="客户经理" v-model="cstMagName" disabled input-align="right" />
			<van-field label="机构名称" v-model="baseMsg.orgName" disabled input-align="right" />
			<van-field label="当前阶段" v-model="nowTage.codeName" readonly placeholder="请选择阶段" @click="showTage=true"
				is-link input-align="right" />
			<van-field label="实际成交额" v-if="(busiType==='0'||busiType==='1')&&nowTage.codeValue=='3'&&baseMsg.estAmt"
				class="labelREM" v-model="actAmt" :formatter="formatter2" placeholder="万元" input-align="right"
				type="number" />
			<van-field label="实际获客数" v-if="(busiType==='0'||busiType==='2')&&nowTage.codeValue=='3'&&baseMsg.estCst"
				class="labelREM" v-model="actCst" :formatter="formatter1" placeholder="人" input-align="right"
				type="number" />
			<div class="flexWrap">
				<van-field label="阶段描述" v-model="tageDesc" :placeholder="nowTage.codeValue?'请输入阶段描述':'请先选择阶段'"
					:disabled="!nowTage.codeValue" input-align="left" border maxlength="1000" rows="4"
					type="textarea" />
			</div>
		</van-cell-group>
		<div class="bottomBox" v-if="$store.state.userMsg.roleId=='00000004'">
			<div class="subBtn" v-if="pageChange" @click="updateMsg">保存</div>
			<div class="subBtn" v-else @click="pageChange=true">修改</div>
			<div class="bottomZW"></div>
		</div>
		<div style="width: 100%;height: 1rem;" v-if="$store.state.userMsg.roleId=='00000004'"></div>
		<div class="bottomZW"></div>
		<van-popup v-model:show="showTage" position="bottom" round z-index="10000">
			<div class="tageTop">
				<span class="tageCancle" @click="showTage=false">取消</span>
				<span>选择阶段</span>
			</div>
			<van-cell class="tagePopup" v-for="(tageItem,i) in tageList" :key="'tageItem'+i"
				v-show="!(baseMsg.curTage=='2'&&tageItem.codeValue=='1')" center :title="tageItem.codeName"
				:label="tageItem.text" @click="chooseTage(tageItem)">
				<template #value>
					<van-icon v-if="tageItem.codeValue==nowTage.codeValue" style="margin-right: 0.1rem;" name="success"
						color="#026DFF" size="0.24rem" />
				</template>
			</van-cell>
			<div class="bottomZW"></div>
		</van-popup>
		<cust-list-cs ref="custList" @activeCust="activeCust" />
	</div>
</template>

<script>
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		saveCustomersInfo,
		queryPoteCustomersMarketing,
		saveCustomersMarketing,
		updatePoteCustomersInfo
	} from "../../request/custinfo.js";
	import {
		Toast
	} from "vant";
	import custlistCS from "../../components/cust/custlistCS.vue";
	export default {
		data() {
			return {
				baseMsg: {},
				pageChange: false,
				nowTage: {},
				showTage: false,
				tageList: [],
				tageDesc: "",
				actAmt: "",
				actCst: "",
				curTage1List: [],
				curTage1Time: "",
				curTage2List: [],
				curTage2Time: "",
				curTage3List: [],
				curTage4List: [],
				allTime: "",
				active: 0,
			}
		},
		components: {
			"cust-list-cs": custlistCS
		},
		computed: {
			busiType() {
				if (this.baseMsg.busiType == "2" || this.baseMsg.busiType == "9") return "0"
				else if (this.baseMsg.busiType == "1") return "1"
				else return "2";
			},
			cstMagName() {
				return this.baseMsg.cstMagName + " (" + this.baseMsg.cstMagNo + ")"
			},
		},
		methods: {
			formatter1(val) {
				return val.split(".")[0].split("-").join("");
			},
			formatter2(val) {
				var valArr = val.split(".");
				if (valArr.length > 1) {
					val = valArr[0] + "." + valArr[1].substring(0, 2)
				}
				return val.split("-").join("");
			},
			chooseTage(item) {
				this.nowTage = item;
				this.showTage = false;
			},
			updateMsg() {
				if (!this.baseMsg.phone) {
					Toast.fail("请输入联系电话");
					return;
				}
				if (this.busiType === '1' && !this.baseMsg.estAmt) {
					Toast.fail("请输入预估成交额");
					return;
				}
				if (this.busiType === '2' && !this.baseMsg.estCst) {
					Toast.fail("请输入预估获客数");
					return;
				}
				if (this.busiType === '0' && !(this.baseMsg.estAmt || this.baseMsg.estCst)) {
					Toast.fail("请输入预估获客数或预估成交额");
					return;
				}
				if (this.nowTage.codeValue === '3' && this.busiType === '1' && !this.actAmt) {
					Toast.fail("请输入实际成交额");
					return;
				}
				if (this.nowTage.codeValue === '3' && this.busiType === '2' && !this.actCst) {
					Toast.fail("请输入实际获客数");
					return;
				}
				if (this.nowTage.codeValue === '3' && this.busiType === '0' && !(this.actCst || this.actAmt)) {
					Toast.fail("请输入实际成交额或实际获客数");
					return;
				}
				if (this.nowTage.codeValue && !this.tageDesc) {
					Toast.fail("请输入阶段描述");
					return;
				}
				Toast.loading({
					message: "正在修改基本信息",
					forbidClick: true,
					duration: 0
				});
				saveCustomersInfo({
					custNo: this.baseMsg.custNo,
					phone: this.baseMsg.phone,
					impPerson: this.baseMsg.impPerson,
					estCst: this.baseMsg.estCst || "",
					estAmt: this.baseMsg.estAmt || "",
					cstDesc: this.baseMsg.cstDesc,
				}, (res) => {
					if (this.nowTage.codeValue) {
						Toast.loading({
							message: "正在提交营销信息",
							forbidClick: true,
							duration: 0
						});
						saveCustomersMarketing({
							custNo: this.baseMsg.custNo,
							curTage: this.nowTage.codeValue,
							actAmt: this.actAmt,
							actCst: this.actCst,
							tageDesc: this.tageDesc
						}, (res) => {
							Toast.success("提交成功");
							this.baseMsg.curTage = this.nowTage.codeValue;
							this.pageChange = false;
							this.nowTage = {};
							this.tageDesc = "";
							this.actAmt = "";
							this.actCst = "";
							this.getYXMsg();
						})
					} else {
						Toast.success("修改成功");
						this.pageChange = false;
					}
				})

			},
			getYXMsg() {
				queryPoteCustomersMarketing({
					custNo: this.baseMsg.custNo
				}, (res) => {
					var allTime = res.data[res.data.length - 1].totCostTime;
					this.allTime = Math.trunc(allTime / (3600 * 24)) + "天" + (Math.trunc(allTime / 3600) % 24) +
						"小时";
					this.curTage1List = [];
					this.curTage2List = [];
					this.curTage3List = [];
					this.curTage4List = [];
					res.data.forEach((item) => {
						item.showDesc = false;
						switch (item.curTage) {
							case "1":
								this.curTage1List.push(item);
								break;
							case "2":
								this.curTage2List.push(item);
								break;
							case "3":
								this.curTage3List.push(item);
								break;
							case "4":
								this.curTage4List.push(item);
								break;
						}
					})
					var curTage1Time = 0;
					var curTage2Time = 0;
					this.curTage1List.forEach((item) => {
						curTage1Time += Number(item.costTime)
					})
					this.curTage2List.forEach((item) => {
						curTage2Time += Number(item.costTime)
					})
					this.curTage1Time = Math.trunc(curTage1Time / (3600 * 24)) + "天" + (Math.trunc(curTage1Time /
						3600) % 24) + "小时";
					this.curTage2Time = Math.trunc(curTage2Time / (3600 * 24)) + "天" + (Math.trunc(curTage2Time /
						3600) % 24) + "小时";
					if (this.curTage1List.length) this.active = 0;
					if (this.curTage2List.length) this.active = 1;
					if (this.curTage3List.length) this.active = 2;
					if (this.curTage4List.length) this.active = 2;
				})
			},
			activeCust(item) {
				updatePoteCustomersInfo({
					custNos: [this.baseMsg.custNo],
					cstMagName: item.empName,
					cstMagNo: item.empId,
					orgId: item.orgCode,
					orgName: item.orgName
				}, (res) => {
					this.baseMsg.orgName = item.orgName;
					this.baseMsg.cstMagName = item.empName;
					this.baseMsg.cstMagNo = item.empId;
					Toast.success("分配成功");
				})
			},
		},
		mounted() {
			this.baseMsg = this.$route.params;
			this.getYXMsg();
			getSysCodeByType({
				codeType: "cur_tage"
			}, (res) => {
				if (res.data) {
					this.tageList = res.data.map((item) => {
						switch (item.codeValue) {
							case "1":
								item.text = "客户或本行单方面意思表达";
								break;
							case "2":
								item.text = "客户和本行双方同意并符合基本要求";
								break;
							case "3":
								item.text = "业务合作已落地";
								break;
							case "4":
								item.text = "业务流失";
								break;
						}
						return item;
					})
				} else {
					Toast.fail("阶段列表数据为空")
				}
			});
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

	:deep(.van-cell-group__title) {
		/* padding-top: 0.16rem;
		padding-bottom: 0.16rem; */
	}

	.progressBox {
		width: 100%;
		display: flex;
		overflow: hidden;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		padding: 0.08rem 0;
		position: fixed;
		z-index: 9;
		box-shadow: 0 0 0.1rem 0 #DDDDDD;
	}

	.progressItem {
		width: 30%;
		font-size: 0.13rem;
		margin-right: 0.01rem;
		line-height: 0.32rem;
		background-color: #EBEBEB;
		color: #B2B2B2;
		position: relative;
	}

	.progressItem::after {
		content: '';
		display: block;
		border-top: 0.16rem solid transparent;
		border-bottom: 0.16rem solid transparent;
		border-left: 0.1rem solid #EBEBEB;
		position: absolute;
		top: 0;
		right: -0.1rem;
	}

	.progressItem::before {
		content: '';
		display: block;
		border-top: 0.16rem solid transparent;
		border-bottom: 0.16rem solid transparent;
		border-left: 0.1rem solid #FFFFFF;
		position: absolute;
		top: 0;
		left: 0;
	}

	.progressItem_a {
		width: 30%;
		font-size: 0.13rem;
		margin-right: 0.01rem;
		line-height: 0.32rem;
		background-color: #026DFF;
		color: #FFFFFF;
		position: relative;
	}

	.progressItem_a::after {
		content: '';
		display: block;
		border-top: 0.16rem solid transparent;
		border-bottom: 0.16rem solid transparent;
		border-left: 0.1rem solid #026DFF;
		position: absolute;
		top: 0;
		right: -0.1rem;
	}

	.progressItem_a::before {
		content: '';
		display: block;
		border-top: 0.16rem solid transparent;
		border-bottom: 0.16rem solid transparent;
		border-left: 0.1rem solid #FFFFFF;
		position: absolute;
		top: 0;
		left: 0;
	}

	:deep(.van-cell-group__title) {
		background-color: #F8F8F8;
		font-size: 0.17rem;
		font-weight: 500;
		color: #222222;
		text-align: left;
		padding: 0.19rem 0.15rem;
	}

	:deep(.van-cell) {
		background-color: #FFFFFF;
		font-size: 0.16rem;
		padding: 0.15rem 0.15rem;
	}

	.flexWrap,
	.flexWrap_a {
		width: 100%;
	}

	.flexWrap :deep(.van-cell),
	.flexWrap_a :deep(.van-cell) {
		flex-wrap: wrap;
	}

	.flexWrap :deep(.van-cell__title),
	.flexWrap_a :deep(.van-cell__title) {
		width: 100%;
		margin-right: 0;
		text-align: left;
	}

	.flexWrap :deep(.van-cell__value) {
		width: 100%;
		margin-right: 0;
		text-align: left;
		border: solid 1px #DDDDDD;
		border-radius: 0.08rem;
		padding: 0.1rem 0.1rem;
		margin-top: 0.1rem;
		font-size: 0.16rem;
	}

	.flexWrap_a :deep(.van-cell__value) {
		width: 100%;
		margin-right: 0;
		text-align: left;
		border-radius: 0.08rem;
		padding: 0.1rem 0.1rem;
		margin-top: 0.1rem;
		font-size: 0.16rem;
	}

	:deep(.van-field__label) {
		color: #333333;
		width: 25%;
	}

	.labelREM :deep(.van-field__label) {
		width: 1.5rem;
	}

	.busiBox {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin-bottom: -0.1rem;
	}

	.busiItem {
		width: 30%;
		font-size: 0.13rem;
		padding: 0.03rem 0;
		text-align: center;
		margin: 0 calc(10% / 6) 0.09rem;
		border: solid 0.01rem #E3E3E3;
		color: #4F4F4F;
		border-radius: 0.03rem;
	}

	.busiItem_a {
		background: url(../../assets/image/cust_zyqk_busiItem_a.png) no-repeat center;
		background-size: 100% 100%;
		border: solid 0.01rem #DEF1FF;
		color: #026DFF;
	}

	.readOnly :deep(.van-field__label) {
		width: 0.8rem;
		margin-right: 0;
		padding-left: 0.1rem;
		position: relative;
	}

	.readOnly :deep(.van-field__control) {
		color: #888888;
		font-size: 0.14rem;
	}

	.yxjdLeft {
		width: 0.03rem;
		height: 0.18rem;
		background-color: #026DFF;
		border-radius: 0.1rem;
		position: absolute;
		top: 0.02rem;
		left: 0;
	}

	.bottomBox {
		width: 100%;
		background-color: #FFFFFF;
		position: fixed;
		bottom: 0;
		left: 0;
		box-shadow: 0 0 0.08rem -0.02rem #888888;
		z-index: 9999;
	}

	.subBtn {
		width: 90%;
		margin: 0.12rem auto;
		background-color: #026DFF;
		border-radius: 0.08rem;
		color: #FFFFFF;
		font-size: 0.16rem;
		font-weight: 500;
		text-align: center;
		line-height: 0.45rem;
	}

	.bottomLine {
		width: 92%;
		height: 0;
		margin: 0 auto;
		border-bottom: solid 1px rgba(240, 240, 240, .6);
	}

	.tageTop {
		width: 100%;
		padding: 0 5%;
		border-bottom: solid 1px #E6E6E6;
		font-size: 0.16rem;
		color: #333333;
		line-height: 0.5rem;
		text-align: center;
		position: relative;
	}

	.tageCancle {
		position: absolute;
		font-size: 0.14rem;
		color: #888888;
		left: 5%;
	}

	.tagePopup :deep(.van-cell__title) {
		width: 80%;
		flex: 0 1 auto;
		text-align: left;
	}

	.tagePopup :deep(.van-cell__value) {
		width: 20%;
		text-align: right;
	}

	:deep(.van-steps--vertical) {
		padding: 0 0 0 var(--van-padding-xl);
	}

	.allTime {
		width: 100%;
		padding: 0 4%;
		line-height: 0.6rem;
		font-size: 0.16rem;
		text-align: right;
		background-color: #FFFFFF;
	}

	.YXTitle {
		font-size: 0.16rem;
		color: #262626;
		font-weight: 500;
		padding-bottom: 0.02rem;
	}

	.YXItem {
		padding: 0.1rem 0;
		border-bottom: solid 1px #F6F6F6;
	}

	.YXDesc {
		font-size: 0.12rem;
		color: #646464;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.YXTime {
		padding-top: 0.05rem;
		font-size: 0.12rem;
		color: #8C8C8C;
	}

	:deep(.van-step--vertical:not(:last-child):after) {
		border-bottom-width: 0;
	}

	:deep(.van-step) {
		padding: 0 0.1rem 0.4rem;
		text-align: left;
	}

	:deep(.van-steps__items) {
		margin-left: 20%;
	}

	.YXDate {
		text-align: right;
		position: absolute;
		top: 0;
		left: calc(-20% - var(--van-padding-xl));
	}

	.YXDate1 {
		font-size: 0.17rem;
		color: #262626;
		font-weight: 500;
		padding-bottom: 0.02rem;
	}

	.YXDate2 {
		font-size: 0.15rem;
		color: #8C8C8C;
	}

	.inactive-icon {
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 0.04rem;
		background-color: #CCCCCC;
	}

	.active-icon-out {
		width: 0.16rem;
		height: 0.16rem;
		padding: 0.04rem;
		border-radius: 0.08rem;
		background-color: rgba(51, 136, 255, .2);
	}

	.active-icon-in {
		width: 0.08rem;
		height: 0.08rem;
		border-radius: 0.04rem;
		background-color: #026DFF;
	}

	.fpBtn {
		position: absolute;
		top: 0;
		right: 0;
		color: #026DFF;
		font-size: 0.14rem;
		font-weight: 400;
	}
</style>
