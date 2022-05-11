<template>
	<div class="home">
		<nav-bar title="我的" type="2" />
		<div class="plate1">
			<div class="plate1_1">
				<van-icon :name="require('../../assets/image/mine_main_userIcon.png')" size="60"/>
				<div class="plate1_1_msgBox">
					<div class="plate1_1_empname">{{$store.state.userMsg.empname}}</div>
					<div class="plate1_1_roleName">{{$store.state.userMsg.roleName}}岗</div>
				</div>
			</div>
			<div class="plate1_2">
				<div class="plate1_2_1 ycsl">
					<van-icon :name="require('../../assets/image/mine_main_userIcon.png')" size="18"/>
					<span>工号:{{userInfo.empno}}</span>
				</div>
				<div class="plate1_2_1 ycsl" style="width: 50%;">
					<van-icon :name="require('../../assets/image/mine_main_userIcon.png')" size="18"/>
					<span>机构:{{userInfo.orgName}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		getEmpInfo
	} from "../../request/theme.js";
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		methods: {
			
		},
		mounted() {
			getEmpInfo({}, (res) => {
				if (res.data) {
					this.userInfo = res.data;
				} else {
					Toast.fail("用户信息数据为空");
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
	
	.plate1 {
		width: 100%;
		height: 1.37rem;
		background: #FFFFFF;
		box-shadow: 0 0.01rem 0.02rem 0 rgba(244,244,244,0.66);
		position: fixed;
		z-index: 100000;
		padding: 0 0.26rem;
	}
	
	.plate1_1 {
		width: 100%;
		height: 0.97rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		border-bottom: solid 1px #EFEFEF;;
	}
	
	.plate1_1_msgBox {
		margin-left: 0.15rem;
	}
	
	.plate1_1_empname {
		font-family: PingFangSC-Medium;
		font-size: 0.18rem;
		line-height: 0.25rem;
		color: #20243A;
		letter-spacing: 0;
		text-align: center;
		font-weight: 500;
		text-align: left;
	}
	
	.plate1_1_roleName {
		margin-top: 0.02rem;
		opacity: 0.7;
		font-family: PingFangSC-Regular;
		font-size: 0.12rem;
		color: #555555;
		letter-spacing: 0;
		font-weight: 400;
		text-align: left;
	}
	
	.plate1_2 {
		width: 100%;
		height: 0.4rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
	}
	
	.plate1_2_1 {
		font-family: PingFangSC-Regular;
		font-size: 0.11rem;
		color: #20243A;
		letter-spacing: 0;
		text-align: center;
		font-weight: 400;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
	}
</style>
