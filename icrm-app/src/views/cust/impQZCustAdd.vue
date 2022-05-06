<template>
	<div class="home">
		<nav-bar title="重要潜客新增" type="2" leftIcon />
		<van-cell-group title="基本信息">
			<van-field v-model="value1" placeholder="请输入完整客户信息/公司全称" input-align="right">
				<template #label>
					<span>客户名称</span>
					<span style="color: #026DFF;margin-left: 0.01rem;">*</span>
				</template>
			</van-field>
			<van-field v-model="value2" placeholder="请输入关键人" input-align="right">
				<template #label>
					<span>关键人</span>
				</template>
			</van-field>
			<van-field v-model="value3" placeholder="请输入" input-align="right">
				<template #label>
					<span>联系电话</span>
					<span style="color: #026DFF;margin-left: 0.01rem;">*</span>
				</template>
			</van-field>
			<van-field>
				<template #label>
					<span>业务类型</span>
					<span style="color: #026DFF;margin-left: 0.01rem;">*</span>
				</template>
				<template #input>
					<div class="busiBox">
						<div class="busiItem ycsl" v-for="(busiItem,i) in busiTypeList" :key="'busiItem'+i"
							:class="i==busiTypeIndex?'busiItem_a':''" @click="busiTypeIndex=i">{{busiItem.codeName}}
						</div>
					</div>
				</template>
			</van-field>
			<van-field v-if="busiType==='0'||busiType==='2'" class="labelREM" v-model="value4" :formatter="formatter1"
				placeholder="人" input-align="right" type="number">
				<template #label>
					<span>预估获客数</span>
				</template>
			</van-field>
			<div class="radioBoxBottom"></div>
			<van-field v-if="busiType==='0'||busiType==='1'" class="labelREM" v-model="value5" :formatter="formatter2"
				placeholder="万元" input-align="right" type="number">
				<template #label>
					<span>预估成交额</span>
				</template>
			</van-field>
			<div class="flexWrap">
				<van-field v-model="value6" placeholder="请输入客户描述" input-align="left" border maxlength="200" rows="4"
					type="textarea">
					<template #label>
						<span>客户描述</span>
					</template>
				</van-field>
			</div>
		</van-cell-group>
		<van-cell-group title="营销信息">
			<van-field class="readOnly" v-model="value7" input-align="left" readonly>
				<template #label>
					<div class="yxjdLeft"></div>
					<span>意向阶段</span>
				</template>
			</van-field>
			<div class="flexWrap">
				<van-field v-model="value8" placeholder="请输入阶段描述" input-align="left" border maxlength="1000" rows="4"
					type="textarea">
					<template #label>
						<span>阶段描述</span>
						<span style="color: #026DFF;margin-left: 0.01rem;">*</span>
					</template>
				</van-field>
			</div>
		</van-cell-group>
		<div class="bottomBox">
			<div class="subBtn" @click="addCust">保存</div>
			<div class="bottomZW"></div>
		</div>
		<div style="width: 100%;height: 1rem;"></div>
		<div class="bottomZW"></div>
	</div>
</template>

<script>
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		saveCustomersInfo
	} from "../../request/custinfo.js";
	import {
		Toast
	} from "vant";
	export default {
		data() {
			return {
				value1: "",
				value2: "",
				value3: "",
				value4: "",
				value5: "",
				value6: "",
				value7: "客户或本行单方面意思表达",
				value8: "",
				busiTypeList: [],
				busiTypeIndex: null,
			}
		},
		computed: {
			busiType() {
				if (this.busiTypeIndex === null) {
					return false;
				} else {
					if (this.busiTypeList[this.busiTypeIndex].codeValue == "2" || this.busiTypeList[this.busiTypeIndex]
						.codeValue == "9") return "0"
					else if (this.busiTypeList[this.busiTypeIndex].codeValue == "1") return "1"
					else return "2";
				}
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
			addCust() {
				if (!this.value1) {
					Toast.fail("请输入客户名称");
					return;
				}
				if (!this.value3) {
					Toast.fail("请输入联系电话");
					return;
				}
				if (this.busiTypeIndex === null) {
					Toast.fail("请选择业务类型");
					return;
				}
				if (this.busiType === '1' && !this.value5) {
					Toast.fail("请输入预估成交额");
					return;
				}
				if (this.busiType === '2' && !this.value4) {
					Toast.fail("请输入预估获客数");
					return;
				}
				if (this.busiType === '0' && !(this.value5 || this.value4)) {
					Toast.fail("请输入预估获客数或预估成交额");
					return;
				}
				if (!this.value8) {
					Toast.fail("请输入阶段描述");
					return;
				}
				Toast.loading({
					message: "正在提交",
					forbidClick: true,
					duration: 0
				});
				saveCustomersInfo({
					cstName: this.value1,
					phone: this.value3,
					impPerson: this.value2,
					busiType: this.busiTypeList[this.busiTypeIndex].codeValue,
					estCst: this.value4,
					estAmt: this.value5,
					cstDesc: this.value6,
					tageDesc: this.value8
				}, (res) => {
					Toast.success("新增成功");
					this.$router.go(-1);
				})
			},
		},
		mounted() {
			getSysCodeByType({
				codeType: "BUSI_TYPE"
			}, (res) => {
				if (res.data) {
					this.busiTypeList = res.data;
				} else {
					Toast.fail("业务类型列表数据为空")
				}
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

	.flexWrap {
		width: 100%;
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
		border: solid 1px #DDDDDD;
		border-radius: 0.08rem;
		padding: 0.1rem 0.1rem;
		margin-top: 0.1rem;
		font-size: 0.14rem;
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
		color: #026AFF;
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
		background-color: #0088FF;
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

	.radioBoxBottom {
		position: absolute;
		box-sizing: border-box;
		content: " ";
		pointer-events: none;
		right: var(--van-padding-md);
		bottom: 0;
		left: var(--van-padding-md);
		border-bottom: 1px solid var(--van-cell-border-color);
		transform: scaleY(.5);
	}
</style>
