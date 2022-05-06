<template>
	<div class="home">
		<nav-bar title="团战" />
		<div id="topPlace" class="topPlace" :style="{height: topHeight+'px'}">
			<div class="welcome">欢迎您，{{$store.state.userMsg.empname}} !</div>
			<div class="quarterData">{{quarterData}}</div>
		</div>
		<van-sticky :offset-top="offsetTop">
			<div class="mainTab" ref="mainTab">
				<div class="mainTabItem" v-for="(mainTabItem, i) in mainTabList" :key="'mainTabItem'+i"
					:class="mainTabIndex==i?'mainTabItem_a':''" @click="changeMainTab(i)">{{mainTabItem}}</div>
			</div>
			<div class="zbzbAdate">
				<div class="zbzb" @click="showZbzbList=!showZbzbList">
					<div class="zbzbTitle">战报指标</div>
					<div class="zbzbValue ycsl">{{zbzbList[zbzbIndex].text}}</div>
					<van-icon v-if="showZbzbList" style="padding-right: 0.05rem;" name="arrow-up" />
					<van-icon v-else style="padding-right: 0.05rem;" name="arrow-down" />
				</div>
				<div class="zbzb" @click="showDateBox=!showDateBox">
					<div class="zbzbTitle">选择时间</div>
					<div class="zbzbValue ycsl">{{showDate}}</div>
					<van-icon v-if="showDateBox" style="padding-right: 0.05rem;" name="arrow-up" />
					<van-icon v-else style="padding-right: 0.05rem;" name="arrow-down" />
				</div>
			</div>
			<van-tabs v-model:active="secondTabIndex" color="#0088FF" line-height="2px" duration="0"
				title-active-color="#0088FF" title-inactive-color="#888888" @change="changeSecondTab">
				<van-tab v-for="(secondTabItem,i) in secondTabList[mainTabIndex]" :key="'secondTab'+i"
					:title="secondTabItem.text">
				</van-tab>
			</van-tabs>
			<div class="thirdTab">
				<div class="thirdTabBox"
					v-for="(thirdTabItem,i) of mainTabIndex==2&&zbzbList[zbzbIndex].value=='4'?[thirdTabList[mainTabIndex][0],thirdTabList[mainTabIndex][1],thirdTabList[mainTabIndex][2]]:thirdTabList[mainTabIndex]"
					:key="'thirdTabItem'+i" :class="thirdTabIndex==i?'thirdTabBox_a':''" @click="changeThirdTab(i)">
					{{thirdTabItem.text}}
				</div>
			</div>
			<div class="valueBox dataTitle" v-if="ownMsg.rankNum">
				<div class="value01" v-show="value01">排名</div>
				<div class="value02" v-show="value02">{{ownDataNameTitle}}</div>
				<div class="value03" v-show="value03">申请量</div>
				<div class="value04" v-show="value04">成功量</div>
				<div class="value05" v-show="value05">{{dataValueTitle}} {{dataValueUnit}}</div>
			</div>
			<div class="valueBox dataValue" v-if="ownMsg.rankNum">
				<div class="value01" v-show="value01">
					<img v-if="ownMsg.rankNum==1" src="../../assets/image/teamFight_main_rank1.png">
					<img v-else-if="ownMsg.rankNum==2" src="../../assets/image/teamFight_main_rank2.png">
					<img v-else-if="ownMsg.rankNum==3" src="../../assets/image/teamFight_main_rank3.png">
					<span v-else>{{ownMsg.rankNum}}</span>
				</div>
				<div class="value02" v-show="value02">
					<span v-if="showDataName">{{ownMsg[showDataName]}}</span>
					<span v-else-if="mainTabIndex==1">
						<div class="value02-1">{{ownMsg.empName+"("+ownMsg.empNo+")"}}</div>
						<div class="value02-2">{{ownMsg.orgName}}</div>
					</span>
					<span v-else-if="mainTabIndex==2">
						<div class="value02-1">{{ownMsg.staffName+"("+ownMsg.staffId+")"}}</div>
						<div class="value02-2">{{ownMsg.groupName}}</div>
					</span>
				</div>
				<div class="value03" v-show="value03">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{ownMsg.allSize?ownMsg.allSize.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{ownMsg.allSizeLd?ownMsg.allSizeLd.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{ownMsg.allSizeLm?ownMsg.allSizeLm.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{ownMsg.allSizeDn?ownMsg.allSizeDn.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value04" v-show="value04">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{ownMsg.successSize?ownMsg.successSize.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{ownMsg.successSizeLd?ownMsg.successSizeLd.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{ownMsg.successSizeLm?ownMsg.successSizeLm.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{ownMsg.successSizeDn?ownMsg.successSizeDn.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value05" v-show="value05">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{dealData?fixedNum(ownMsg.resaleNum):ownMsg.resaleNum?ownMsg.resaleNum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{dealData?fixedNum(ownMsg.resaleNumLd):ownMsg.resaleNumLd?ownMsg.resaleNumLd.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{dealData?fixedNum(ownMsg.resaleNumLm):ownMsg.resaleNumLm?ownMsg.resaleNumLm.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{dealData?fixedNum(ownMsg.resaleNumLy):ownMsg.resaleNumLy?ownMsg.resaleNumLy.toLocaleString():"0"}}
					</span>
				</div>
			</div>
			<div class="valueBox dataTitle">
				<div class="value01" v-show="value01">排名</div>
				<div class="value02 ycsl" v-show="value02">
					<span>{{dataNameTitle}}</span>
					<span style="margin-left: 0.05rem;" @click="openOrgBox" v-if="mainTabIndex==0&&secondTabIndex!=0">
						<van-icon name="search" color="#FF3333" />
						<span>{{searchOrg.text}}</span>
					</span>
					<span style="margin-left: 0.05rem;" @click="openSearchBox"
						v-if="mainTabIndex==1||(mainTabIndex==2&&secondTabIndex==2)">
						<van-icon name="search" color="#FF3333" />
					</span>
				</div>
				<div class="value03" v-show="value03">申请量</div>
				<div class="value04" v-show="value04">成功量</div>
				<div class="value05 valueTitle05" v-show="value05">
					<div class="textImg" @click="showQuesDialog"></div>
					<div class="valueTitle">
						<div>&nbsp;{{dataValueTitle}}</div>
						<div>&nbsp;{{dataValueUnit}}</div>
					</div>
					<div class="ordImg"
						:style="{'background-image':orderType=='DESC'?'url('+require('../../assets/image/teamFight_main_desc.png')+')':'url('+require('../../assets/image/teamFight_main_asc.png')+')'}"
						@click="changeOrderType">
					</div>
				</div>
				<div class="value06" v-show="value06">成员</div>
			</div>
			<div class="valueBox dataValue">
				<div class="value01" v-show="value01">合计</div>
				<div class="value02" v-show="value02"></div>
				<div class="value03" v-show="value03">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{totalMsg.allSizeSum?totalMsg.allSizeSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{totalMsg.allSizeLdSum?totalMsg.allSizeLdSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{totalMsg.allSizeLmSum?totalMsg.allSizeLmSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{totalMsg.allSizeLmSum?totalMsg.allSizeDnSum.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value04" v-show="value04">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{totalMsg.successSizeSum?totalMsg.successSizeSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{totalMsg.successSizeLdSum?totalMsg.successSizeLdSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{totalMsg.successSizeLmSum?totalMsg.successSizeLmSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{totalMsg.allSizeLmSum?totalMsg.allSizeDnSum.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value05" style="margin-right: 0.05rem;" v-show="value05">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{dealData?fixedNum(totalMsg.resaleNumSum):totalMsg.resaleNumSum?totalMsg.resaleNumSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{dealData?fixedNum(totalMsg.resaleNumLdSum):totalMsg.resaleNumLdSum?totalMsg.resaleNumLdSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{dealData?fixedNum(totalMsg.resaleNumLmSum):totalMsg.resaleNumLmSum?totalMsg.resaleNumLmSum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{dealData?fixedNum(totalMsg.resaleNumLySum):totalMsg.resaleNumLySum?totalMsg.resaleNumLySum.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value06" v-show="value06"></div>
			</div>
		</van-sticky>
		<van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" offset="10" @load="onLoad">
			<div class="valueBox dataValue" v-for="(dataItem,i) of dataList" :key="'dataItem'+i">
				<div class="value01" v-show="value01">
					<img v-if="dataItem.rankNum==1" src="../../assets/image/teamFight_main_rank1.png">
					<img v-else-if="dataItem.rankNum==2" src="../../assets/image/teamFight_main_rank2.png">
					<img v-else-if="dataItem.rankNum==3" src="../../assets/image/teamFight_main_rank3.png">
					<span v-else>{{dataItem.rankNum}}</span>
				</div>
				<div class="value02" v-show="value02">
					<span v-if="showDataName">{{dataItem[showDataName]}}</span>
					<span v-else-if="mainTabIndex==1">
						<div class="value02-1">{{dataItem.empName+"("+dataItem.empNo+")"}}</div>
						<div class="value02-2">{{dataItem.orgName}}</div>
					</span>
					<span v-else-if="mainTabIndex==2">
						<div class="value02-1">{{dataItem.staffName+"("+dataItem.staffId+")"}}</div>
						<div class="value02-2">{{dataItem.groupName}}</div>
					</span>
				</div>
				<div class="value03" v-show="value03">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{dataItem.allSize?dataItem.allSize.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{dataItem.allSizeLd?dataItem.allSizeLd.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{dataItem.allSizeLm?dataItem.allSizeLm.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{dataItem.allSizeDn?dataItem.allSizeDn.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value04" v-show="value04">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{dataItem.successSize?dataItem.successSize.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{dataItem.successSizeLd?dataItem.successSizeLd.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{dataItem.successSizeLm?dataItem.successSizeLm.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{dataItem.successSizeDn?dataItem.successSizeDn.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value05" style="margin-right: 0.05rem;" v-show="value05">
					<span v-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='T'">
						{{dealData?fixedNum(dataItem.resaleNum):dataItem.resaleNum?dataItem.resaleNum.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='D'">
						{{dealData?fixedNum(dataItem.resaleNumLd):dataItem.resaleNumLd?dataItem.resaleNumLd.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='M'">
						{{dealData?fixedNum(dataItem.resaleNumLm):dataItem.resaleNumLm?dataItem.resaleNumLm.toLocaleString():"0"}}
					</span>
					<span v-else-if="thirdTabList[mainTabIndex][thirdTabIndex].value=='Y'">
						{{dealData?fixedNum(dataItem.resaleNumLy):dataItem.resaleNumLy?dataItem.resaleNumLy.toLocaleString():"0"}}
					</span>
				</div>
				<div class="value06" v-show="value06" @click="openGroupDetail(dataItem)">详情</div>
			</div>
		</van-list>
		<van-popup v-model:show="showZbzbList" position="bottom" style="max-height: 50%;">
			<div class="zbzbItem" :class="i==zbzbIndex?'zbzbItem_a':''" v-for="(zbzbItem,i) in zbzbList"
				:key="'zbzbItem'+i" @click="changeZbzb(i)">
				{{zbzbItem.text}}
			</div>
			<div class="bottomZW"></div>
		</van-popup>
		<van-popup v-model:show="showDateBox" position="bottom">
			<van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate"
				@cancel="showDateBox=false" @confirm="changeDate" />
			<div class="bottomZW"></div>
		</van-popup>
		<org-list-tf ref="orgList" type="2" @activeOrg="activeOrg" />
		<cust-list-tf ref="custList" @activeItem="activeItem" />
		<van-dialog v-model:show="help_main0_1" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				<br>
				使用信贷日报表数据，筛选零售贷款品种，再以经办机构统计贷款余额。
				<br><br>
				备注：统计业务提供指定贷款产品，数据时效为T+1
				<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main0_2" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				<br>
				依据信贷日报表中经办机构为社区金融事业部的账号使用分解平台数据，筛选零售贷款品种，再以分解客户经理归属的机构统计贷款余额。<br>
				<br>
				备注：统计业务提供指定贷款产品，数据时效为T+2
				<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main0_3" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				<br>
				1.使用信贷日报表数据，筛选零售贷款品种；<br>
				2.剔除按揭贷款、剔除余额小于1万的贷款；<br>
				3.再以经办机构合并ECIF客户号。<br>
				<br>
				备注：统计业务提供指定贷款产品，数据时效为T+1
				<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main0_4" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				<br>
				1.查找信贷日报表中经办机构为社区金融事业部的账号；<br>
				2.根据账号使用分解平台数据，筛选零售贷款品种，剔除按揭贷款、剔除余额小于1万的贷款；<br>
				3.再以分解客户经理归属的机构合并ECIF客户号。<br>
				<br>
				备注：统计业务提供指定贷款产品，数据时效为T+2
				<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main1_1" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				定期余额 = 2021年11月末定期余额 - 2021年10月末定期余额<br>
				定期人均余额 =（2021年11月末定期余额-2021年10月末定期余额）/ 团队人员数量<br>
				定期储蓄一年期（含）及以上以2021年10月31日的定期储蓄余额为基数<br>
				活动总分80分，其中定期储蓄占比50%，活期储蓄占比30%。最终定期储蓄分数计算以新增额最高者得50分，其它机构分数以此为基数进行线性计算得分，例如：定期得分 = 定期人均余额 * 50 / max
				（定期人均余额）<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main1_2" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				定期余额 = 2021年11月末定期余额-2021年10月末定期余额<br>
				定期人均余额 =（2021年11月末定期余额-2021年10月末定期余额）/ 团队人员数量<br>
				定期储蓄一年期（含）及以上以2021年10月31日的定期储蓄余额为基数<br>
				活动总分100分，其中定期储蓄占比60%，活期储蓄占比40%。最终定期储蓄分数计算以新增额最高者得60分，其它机构分数以此为基数进行线性计算得分，例如：定期得分 = 定期人均余额 * 60 / max
				（定期人均余额）<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main1_3" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				活期余额 = 2021年11月至2021年12月活期日均 - 2021年全年活期日均<br>
				活期人均余额 =（2021年11月至2021年12月活期日均-2021年全年活期日均）/ 团队人员数量<br>
				活期储蓄以2021年全年活期储蓄日均为基数<br>
				活动总分80分，其中定期储蓄占比50%，活期储蓄占比30%。最终活期储蓄分数计算以新增额最高者得30分，其它机构分数以此为基数进行线性计算得分，例如：活期得分 = 活期人均余额 * 30 / max
				（活期人均余额）<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main1_4" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				活期余额 = 2021年11月至2021年12月活期日均-2021年全年活期日均<br>
				活期人均余额 =（2021年11月至2021年12月活期日均-2021年全年活期日均）/ 团队人员数量<br>
				活期储蓄以2021年全年活期储蓄日均为基数<br>
				活动总分100分，其中定期储蓄占比60%，活期储蓄占比40%。最终活期储蓄分数计算以新增额最高者得40分，其它机构分数以此为基数进行线性计算得分，例如：活期得分 = 活期人均余额 * 40 / max
				（活期人均余额）<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main1_5" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				零售贷款余额完成率 =（2022年3月末零售贷款余额 - 2021年12月末零售贷款余额）/ 任务数<br>
				零售贷款以2021年12月31日零售贷款余额为基数，3月末零售贷款余额以最后五天平均值计算<br>
				活动总分100分，其中定期储蓄占比50%，活期储蓄占比30%，零售贷款占比20%。最终零售贷款分数计算以完成率最高者得20分，其它团队分数以此为基数进行线性计算得分，例如：零售贷款得分 = 零售贷款余额完成率
				* 20 / max （零售贷款余额完成率）<br>
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main2_1" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				贷款余额：<br>
				零售贷款（每日数据，频率日）= 当日余额 -上年末零售贷款余额<br>
				数据累计从2021年4月份开始统计，从信贷日报表取数<br>
				（直营中心客户经理移交日期之前的业绩不在统计范围内）
			</div>
		</van-dialog>
		<van-dialog v-model:show="help_main2_2" title="数据统计规则" confirmButtonText="知道了">
			<div class="quesDiog">
				贷款客户数：<br>
				客户数新增=当日贷款客户数-上年末贷款客户数<br>
				数据累计从2021年4月份开始统计，从信贷日报表取数,统计单笔大于1万的贷款客户<br>
				（直营中心客户经理移交日期之前的业绩不在统计范围内）
			</div>
		</van-dialog>
		<van-dialog v-model:show="showGroupDetailBox" title="团队详情">
			<div class="groupDetailBox">
				<div class="groupDetailTitle">
					<div class="groupDetailValue1">机构</div>
					<div class="groupDetailValue2">客户经理</div>
					<div class="groupDetailValue3" v-if="mainTabIndex==2">申请量</div>
					<div class="groupDetailValue4" v-if="mainTabIndex==2">成功量</div>

					<div class="groupDetailValue5">{{dataValueTitle}}</div>
				</div>
				<div class="groupDetailValueBox">
					<div class="groupDetailValue" v-for="(groupDetailItem,i) of detailData" :key="'groupDetailItem'+i">
						<div class="groupDetailValue1">{{groupDetailItem.orgName}}</div>
						<div class="groupDetailValue2">
							{{mainTabIndex==1?groupDetailItem.empName:mainTabIndex==2?groupDetailItem.staffName:""}}
						</div>
						<div class="groupDetailValue3" v-if="mainTabIndex==2&&thirdTabIndex==0">
							{{groupDetailItem.allSize?groupDetailItem.allSize.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue3" v-if="mainTabIndex==2&&thirdTabIndex==1">
							{{groupDetailItem.allSizeLd?groupDetailItem.allSizeLd.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue3" v-if="mainTabIndex==2&&thirdTabIndex==2">
							{{groupDetailItem.allSizeLm?groupDetailItem.allSizeLm.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue3" v-if="mainTabIndex==2&&thirdTabIndex==3">
							{{groupDetailItem.allSizeDn?groupDetailItem.allSizeDn.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue4" v-if="mainTabIndex==2&&thirdTabIndex==0">
							{{groupDetailItem.successSize?groupDetailItem.successSize.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue4" v-if="mainTabIndex==2&&thirdTabIndex==1">
							{{groupDetailItem.successSizeLd?groupDetailItem.successSizeLd.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue4" v-if="mainTabIndex==2&&thirdTabIndex==2">
							{{groupDetailItem.successSizeLm?groupDetailItem.successSizeLm.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue4" v-if="mainTabIndex==2&&thirdTabIndex==3">
							{{groupDetailItem.successSizeDn?groupDetailItem.successSizeDn.toLocaleString():"0"}}
						</div>
						<div class="groupDetailValue5" v-if="thirdTabIndex==0">
							{{dealData?fixedNum(groupDetailItem.resaleNum):groupDetailItem.resaleNum.toLocaleString()}}
						</div>
						<div class="groupDetailValue5" v-if="thirdTabIndex==1">
							{{dealData?fixedNum(groupDetailItem.resaleNumLd):groupDetailItem.resaleNumLd.toLocaleString()}}
						</div>
						<div class="groupDetailValue5" v-if="thirdTabIndex==2">
							{{dealData?fixedNum(groupDetailItem.resaleNumLm):groupDetailItem.resaleNumLm.toLocaleString()}}
						</div>
						<div class="groupDetailValue5" v-if="thirdTabIndex==3">
							{{dealData?fixedNum(groupDetailItem.resaleNumLy):groupDetailItem.resaleNumLy.toLocaleString()}}
						</div>
					</div>
				</div>
			</div>
		</van-dialog>
		<van-image-preview v-model:show="showSharePic" :showIndex="false" :images="images" :loop="false"
			@click="showSharePic=false">
			<template v-slot:cover>
				<div class="savePic" @click.stop="saveSharePic">保存图片</div>
			</template>
		</van-image-preview>
		<div class="shareBtn" @click.stop="createSharePic" v-if="!(mainTabIndex==2&&thirdTabIndex==3)"></div>
		<div class="shareBox">
			<div class="shareBox-jg" v-if="shareMsgJG.length" id="sharePicture0">
				<div class="shuiyin">
					<span style="margin-right: 2.2rem;" v-for="i of 2000" :key="i">{{$store.state.userMsg.empname}}
						{{$store.state.userMsg.empno}} {{$store.state.userMsg.loginTime}}</span>
				</div>
				<div class="shareJGCard1">
					{{showDate.split("-")[0]}}年{{showDate.split("-")[1]}}月{{showDate.split("-")[2]}}日
				</div>
				<div class="shareJGCard2">{{quarterData}}</div>
				<div class="shareJGCard3"></div>
				<div class="shareJGCard4">{{secondTabList[mainTabIndex][secondTabIndex].text}} /
					{{zbzbList[zbzbIndex].text?zbzbList[zbzbIndex].text.split("(")[0]:""}}
				</div>
				<div class="shareJGCard5" v-for="(shareJGList,i) in shareMsgJG" :key="'shareJGList'+i">
					<div class="shareJGTitle">{{shareJGList.title}}</div>
					<div class="shareJGValueBox">
						<div class="shareJGValue">
							<div class="shareJGValue1">{{secondTabIndex==0?"序号":"排行"}}</div>
							<div class="shareJGValue2">名称</div>
							<div class="shareJGValue3">业绩{{dataValueUnit}}</div>
						</div>
						<div class="shareJGValue" v-for="(shareJGItem,j) in shareJGList.list" :key="'shareJGItem'+j">
							<div class="shareJGValue1">{{shareJGItem.msgRank}}</div>
							<div class="shareJGValue2">{{shareJGItem.msgName}}</div>
							<div class="shareJGValue3">
								{{dealData?fixedNum(shareJGItem.msgDetail):shareJGItem.msgDetail.toLocaleString()}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="shareBox">
			<div class="shareBox-tz" v-if="shareMsgTZ.length" id="sharePicture1">
				<div class="shuiyin">
					<span style="margin-right: 2.2rem;" v-for="i of 2000" :key="i">{{$store.state.userMsg.empname}}
						{{$store.state.userMsg.empno}} {{$store.state.userMsg.loginTime}}</span>
				</div>
				<div class="shareTZCard1">
					{{showDate.split("-")[0]}}年{{showDate.split("-")[1]}}月{{showDate.split("-")[2]}}日
				</div>
				<div class="shareTZCard2">{{secondTabList[mainTabIndex][secondTabIndex].text}}</div>
				<div class="shareTZCard3">{{quarterData}}</div>
				<div class="shareTZCard4"></div>
				<div class="shareTZCard5"></div>
				<div class="shareTZCard6">
					<div class="shareTZCard6BG"></div>
					<div class="shareTZCard6Value">{{shareMsgTZ[0].teamNm}}</div>
				</div>
				<div class="shareTZCard7"></div>
				<div class="shareTZCard8">
					<div class="shareTZCard8BG"></div>
					<div class="shareTZCard8Value"
						v-for="(tzShareItem,i) in [shareMsgTZ[1],shareMsgTZ[2],shareMsgTZ[3],shareMsgTZ[4]]"
						:key="'tz2ShareItem'+i">
						<div class="ycsl">{{tzShareItem.teamNm.split("（")[0]}}</div>
						<div>（{{tzShareItem.teamNm.split("（")[1]}}</div>
					</div>
				</div>
				<div class="shareTZCard9"></div>
				<div class="shareTZCard10">
					<div class="shareTZCard10Value"
						v-for="(tzShareItem,i) in [shareMsgTZ[shareMsgTZ.length-5],shareMsgTZ[shareMsgTZ.length-4],shareMsgTZ[shareMsgTZ.length-3]]"
						:key="'tz3ShareItem'+i">{{tzShareItem.teamNm}}
					</div>
				</div>
				<div class="shareTZCard11">
					<div class="shareTZCard11Value"
						v-for="(tzShareItem,i) in [shareMsgTZ[shareMsgTZ.length-2],shareMsgTZ[shareMsgTZ.length-1]]"
						:key="'tz4ShareItem'+i">{{tzShareItem.teamNm}}
					</div>
				</div>
				<div class="shareTZCard12">
					<div class="shareTZCard12Top">
						<div class="shareTZDate">{{quarterData}}</div>
					</div>
					<div class="shareTZItem shareTZItemTitle" style="height: 0.7rem;">
						<div class="shareTZValue1">排名</div>
						<div class="shareTZValue2">团队名称</div>
						<div class="shareTZValue3">人数</div>
						<div :class="secondTabIndex==2||secondTabIndex==3?'shareTZValue4-1':'shareTZValue4-2'">
							活期日均新增<br />(万元)</div>
						<div :class="secondTabIndex==2||secondTabIndex==3?'shareTZValue5-1':'shareTZValue5-2'">
							一年期以上定期余额新增(万元)</div>
						<div class="shareTZValue6" v-if="secondTabIndex==0||secondTabIndex==1">零售贷款新增<br />(万元)</div>
						<div class="shareTZValue7">人均总得分</div>
					</div>
					<div class="shareTZItem" v-for="(tzShareItem,i) in shareMsgTZ" :key="'tz5ShareItem'+i">
						<div class="shareTZValue1">{{i+1}}</div>
						<div class="shareTZValue2 ycsl" style="font-size: 0.18rem;">{{tzShareItem.teamNm}}</div>
						<div class="shareTZValue3">{{tzShareItem.groupNum||""}}</div>
						<div :class="secondTabIndex==2||secondTabIndex==3?'shareTZValue4-1':'shareTZValue4-2'">
							{{fixedNum(tzShareItem.prcptAddHq)}}</div>
						<div :class="secondTabIndex==2||secondTabIndex==3?'shareTZValue5-1':'shareTZValue5-2'">
							{{fixedNum(tzShareItem.prcptAddDq)}}</div>
						<div class="shareTZValue6" v-if="secondTabIndex==0||secondTabIndex==1">
							{{fixedNum(tzShareItem.prcptAddDk)}}</div>
						<div class="shareTZValue7">{{tzShareItem.totalPart2}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="shareBox">
			<div class="shareBox-yx" v-if="shareMsgYX.length" id="sharePicture2">
				<div class="shuiyin">
					<span style="margin-right: 2.2rem;" v-for="i of 2000" :key="i">{{$store.state.userMsg.empname}}
						{{$store.state.userMsg.empno}} {{$store.state.userMsg.loginTime}}</span>
				</div>
				<div class="shareYXCard1">
					{{showDate.split("-")[0]}}年{{showDate.split("-")[1]}}月{{showDate.split("-")[2]}}日
				</div>
				<div class="shareYXCard2">{{quarterData}}</div>
				<div class="shareYXCard3"></div>
				<div class="shareYXCard4">{{secondTabList[mainTabIndex][secondTabIndex].text}} /
					{{zbzbList[zbzbIndex].text?zbzbList[zbzbIndex].text.split("(")[0]:""}}
				</div>
				<div class="shareYXCard5">
					<div class="shareYXTitle">{{thirdTabList[2][thirdTabIndex].text}}业绩榜</div>
					<div class="shareYXValueBox">
						<div class="shareYXValue">
							<div class="shareYXValue1">排行</div>
							<div :class="zbzbList[zbzbIndex].value=='3'?'shareYXValue2-1':'shareYXValue2-2'">
								{{secondTabIndex==0?"分部":secondTabIndex==1?"团队":secondTabIndex==2?"个人":""}}</div>
							<div class="shareYXValue3" v-if="zbzbList[zbzbIndex].value=='3'">申请量</div>
							<div class="shareYXValue4" v-if="zbzbList[zbzbIndex].value=='3'">成功量</div>
							<div :class="zbzbList[zbzbIndex].value=='3'?'shareYXValue5-1':'shareYXValue5-2'">
								业绩{{dataValueUnit}}</div>
						</div>

						<div class="shareYXValue" v-for="(shareYXItem,i) in shareMsgYX" :key="'shareYXItem'+i">
							<div class="shareYXValue1">{{shareYXItem.rankNum}}</div>
							<div :class="zbzbList[zbzbIndex].value=='3'?'shareYXValue2-1':'shareYXValue2-2'">
								{{secondTabIndex==0?shareYXItem.orgManagerName:secondTabIndex==1?shareYXItem.groupName:shareYXItem.staffName+'('+shareYXItem.staffId+')'}}
							</div>
							<div class="shareYXValue3" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 0">
								{{shareYXItem.allSize?shareYXItem.allSize.toLocaleString():"0"}}</div>
							<div class="shareYXValue3" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 1">
								{{shareYXItem.allSizeLd?shareYXItem.allSizeLd.toLocaleString():"0"}}</div>
							<div class="shareYXValue3" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 2">
								{{shareYXItem.allSizeLm?shareYXItem.allSizeLm.toLocaleString():"0"}}</div>
							<div class="shareYXValue3" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 3">
								{{shareYXItem.allSizeDn?shareYXItem.allSizeDn.toLocaleString():"0"}}</div>
							<div class="shareYXValue4" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 0">
								{{shareYXItem.successSize?shareYXItem.successSize.toLocaleString():"0"}}</div>
							<div class="shareYXValue4" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 1">
								{{shareYXItem.successSizeLd?shareYXItem.successSizeLd.toLocaleString():"0"}}</div>
							<div class="shareYXValue4" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 2">
								{{shareYXItem.successSizeLm?shareYXItem.successSizeLm.toLocaleString():"0"}}</div>
							<div class="shareYXValue4" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 3">
								{{shareYXItem.successSizeDn?shareYXItem.successSizeDn.toLocaleString():"0"}}</div>
							<div class="shareYXValue5-1" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 0">
								{{fixedNum(shareYXItem.resaleNum)}}</div>
							<div class="shareYXValue5-1" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 1">
								{{fixedNum(shareYXItem.resaleNumLd)}}</div>
							<div class="shareYXValue5-1" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 2">
								{{fixedNum(shareYXItem.resaleNumLm)}}</div>
							<div class="shareYXValue5-1" v-if="zbzbList[zbzbIndex].value=='3'&&thirdTabIndex == 3">
								{{fixedNum(shareYXItem.resaleNumLy)}}</div>
							<div class="shareYXValue5-2" v-if="zbzbList[zbzbIndex].value=='4'&&thirdTabIndex == 0">
								{{shareYXItem.resaleNum.toLocaleString()}}</div>
							<div class="shareYXValue5-2" v-if="zbzbList[zbzbIndex].value=='4'&&thirdTabIndex == 1">
								{{shareYXItem.resaleNumLd.toLocaleString()}}</div>
							<div class="shareYXValue5-2" v-if="zbzbList[zbzbIndex].value=='4'&&thirdTabIndex == 2">
								{{shareYXItem.resaleNumLm.toLocaleString()}}</div>
							<div class="shareYXValue5-2" v-if="zbzbList[zbzbIndex].value=='4'&&thirdTabIndex == 3">
								{{shareYXItem.resaleNumLy.toLocaleString()}}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="shareBoxTop"></div>
	</div>
</template>

<script>
	import {
		querySysDate,
		queryOrgSaleRankList,
		querySaleRankByEmpID,
		queryGroupSaleRankList,
		queryGroupRankDetails,
		queryDirectSaleRankList,
		queryDirectRankDetails,
		queryDirectSaleRankByEmpID,
		queryGroupSaleRankShareList
	} from "../../request/index.js";
	import {
		getSysCodeByType
	} from "../../request/common.js";
	import {
		Toast,
		Dialog
	} from "vant";
	import orglistTF from "../../components/teamFight/orglistTF.vue";
	import custlistTF from "../../components/teamFight/custlistTF.vue";
	import html2canvas from 'html2canvas';
	export default {
		data() {
			return {
				offsetTop: 0,
				topHeight: 0,
				quarterData: "",
				mainTabList: ["机构排名", "团战排名", "营销中心"],
				mainTabIndex: 0,
				zbzbList: [{}],
				zbzbIndex: 0,
				showZbzbList: false,
				showDate: "",
				postDate: "",
				currentDate: new Date(),
				minDate: new Date(),
				maxDate: new Date(),
				showDateBox: false,
				secondTabList: [
					[{
						text: "分行排名",
						value: "3"
					}, {
						text: "传统支行",
						value: "2"
					}, {
						text: "社区支行",
						value: "1"
					}],
					[{
						text: "支行团队",
						value: "1"
					}, {
						text: "支行个人",
						value: "2"
					}, {
						text: "社区团队",
						value: "3"
					}, {
						text: "社区个人",
						value: "4"
					}],
					[{
						text: "分部排名",
						value: "1"
					}, {
						text: "团队排名",
						value: "2"
					}, {
						text: "个人排名",
						value: "3"
					}]
				],
				secondTabIndex: 0,
				thirdTabList: [
					[{
						text: "当日",
						value: "T"
					}, {
						text: "较上日新增",
						value: "D"
					}, {
						text: "较上月新增",
						value: "M"
					}, {
						text: "较年初新增",
						value: "Y"
					}],
					[{
						text: "当日",
						value: "T"
					}, {
						text: "较上日新增",
						value: "D"
					}, {
						text: "较上月新增",
						value: "M"
					}],
					[{
						text: "当日",
						value: "T"
					}, {
						text: "较上日新增",
						value: "D"
					}, {
						text: "较上月新增",
						value: "M"
					}, {
						text: "当年",
						value: "Y"
					}]
				],
				// 三级tab标识
				thirdTabIndex: 0,
				orderType: "DESC",
				pageIndex: 0,
				loading: true,
				finished: false,
				dataList: [],
				searchOrg: {
					text: "全行",
					value: ""
				},
				searchVal: {},
				ownMsg: {},
				totalMsg: {},
				yxTotal: 0,
				canOnLoad: false,
				help_main0_1: false,
				help_main0_2: false,
				help_main0_3: false,
				help_main0_4: false,
				help_main1_1: false,
				help_main1_2: false,
				help_main1_3: false,
				help_main1_4: false,
				help_main1_5: false,
				help_main2_1: false,
				help_main2_2: false,
				showGroupDetailBox: false,
				detailData: [],
				shareMsgJG: [],
				shareMsgTZ: [],
				shareMsgYX: [],
				showSharePic: false,
				images: [],
			}
		},
		components: {
			"org-list-tf": orglistTF,
			"cust-list-tf": custlistTF
		},
		computed: {
			showDataName() {
				if (this.mainTabIndex == 0) {
					return "brManagerNm";
				}
				if (this.mainTabIndex == 1) {
					if (this.secondTabIndex == 0 || this.secondTabIndex == 2) return "groupName";
					if (this.secondTabIndex == 1 || this.secondTabIndex == 3) return false;
				}
				if (this.mainTabIndex == 2) {
					if (this.secondTabIndex == 0) return "orgManagerName";
					if (this.secondTabIndex == 1) return "groupName";
					if (this.secondTabIndex == 2) return false;
				}
			},
			dealData() {
				if (this.mainTabIndex == 0) {
					if (this.zbzbList[this.zbzbIndex].value == "1") return true;
					if (this.zbzbList[this.zbzbIndex].value == "2") return false;
				}
				if (this.mainTabIndex == 1) {
					return true;
				}
				if (this.mainTabIndex == 2) {
					if (this.zbzbList[this.zbzbIndex].value == "3") return true;
					if (this.zbzbList[this.zbzbIndex].value == "4") return false;
				}
			},
			ownDataNameTitle() {
				if (this.mainTabIndex == 0) {
					return "当前机构";
				}
				if (this.mainTabIndex == 1) {
					if (this.secondTabIndex == 0 || this.secondTabIndex == 2) return "当前团队";
					if (this.secondTabIndex == 1 || this.secondTabIndex == 3) return "我的";
				}
				if (this.mainTabIndex == 2) {
					if (this.secondTabIndex == 0) return "当前分部";
					if (this.secondTabIndex == 1) return "当前团队";
					if (this.secondTabIndex == 2) return "我的";
				}
			},
			dataValueTitle() {
				if (this.mainTabIndex == 0) {
					if (this.zbzbList[this.zbzbIndex].value == "1") return "贷款余额";
					if (this.zbzbList[this.zbzbIndex].value == "2") return "贷款客户数";
				}
				if (this.mainTabIndex == 1) {
					if (this.zbzbList[this.zbzbIndex].value == "1") return "定期余额";
					if (this.zbzbList[this.zbzbIndex].value == "2") return "活期日均";
					if (this.zbzbList[this.zbzbIndex].value == "3") return "贷款余额";
				}
				if (this.mainTabIndex == 2) {
					if (this.zbzbList[this.zbzbIndex].value == "3") return "贷款余额";
					if (this.zbzbList[this.zbzbIndex].value == "4") return "贷款客户数";
				}
			},
			dataValueUnit() {
				if (this.mainTabIndex == 0) {
					if (this.zbzbList[this.zbzbIndex].value == "1") return "(万元)";
					if (this.zbzbList[this.zbzbIndex].value == "2") return "(人)";
				}
				if (this.mainTabIndex == 1) {
					return "(万元)";
				}
				if (this.mainTabIndex == 2) {
					if (this.zbzbList[this.zbzbIndex].value == "3") return "(万元)";
					if (this.zbzbList[this.zbzbIndex].value == "4") return "(人)";
				}
			},
			dataNameTitle() {
				if (this.mainTabIndex == 0) {
					if (this.secondTabIndex == 0) return "分行";
					if (this.secondTabIndex == 1) return "传统支行";
					if (this.secondTabIndex == 2) return "社区支行";
				}
				if (this.mainTabIndex == 1) {
					if (this.secondTabIndex == 0 || this.secondTabIndex == 2) return "团队";
					if (this.secondTabIndex == 1 || this.secondTabIndex == 3) return "客户经理";
				}
				if (this.mainTabIndex == 2) {
					if (this.secondTabIndex == 0) return "分部";
					if (this.secondTabIndex == 1) return "团队";
					if (this.secondTabIndex == 2) return "客户经理";
				}
			},
			value01() {
				return true;
			},
			value02() {
				return true;
			},
			value03() {
				if (this.mainTabIndex == 2 && this.zbzbList[this.zbzbIndex].value == '3') return true;
				else return false;
			},
			value04() {
				if (this.mainTabIndex == 2 && this.zbzbList[this.zbzbIndex].value == '3') return true;
				else return false;
			},
			value05() {
				if (this.mainTabIndex == 2 && this.zbzbList[this.zbzbIndex].value == '3' && this.thirdTabList[this
						.mainTabIndex][this.thirdTabIndex].value == 'Y') return false;
				else return true;
			},
			value06() {
				if (this.mainTabIndex == 0) {
					return false;
				}
				if (this.mainTabIndex == 1) {
					if (this.secondTabIndex == 0 || this.secondTabIndex == 2) return true;
					if (this.secondTabIndex == 1 || this.secondTabIndex == 3) return false;
				}
				if (this.mainTabIndex == 2) {
					if (this.thirdTabIndex == 3) return false;
					if (this.secondTabIndex == 0) return false;
					if (this.secondTabIndex == 1) return true;
					if (this.secondTabIndex == 2) return false;
				}
			},
		},
		methods: {
			changeMainTab(i) {
				if (i == this.mainTabIndex) return;
				this.searchOrg = {
					text: "全行",
					value: ""
				};
				this.searchVal = {};
				this.mainTabIndex = i;
				this.secondTabIndex = 0;
				this.thirdTabIndex = 0;
				this.getZbzbList();
				switch (i) {
					case 0:
						this.resetTime(0);
						break;
					case 1:
						this.resetTime(-1);
						break;
					case 2:
						this.resetTime("now");
						break;
				}
			},
			changeZbzb(i) {
				this.zbzbIndex = i;
				this.showZbzbList = false;
				if (this.mainTabIndex == 2 && this.thirdTabIndex == 3) this.thirdTabIndex = 0;
				this.onLoad(true);
			},
			changeDate(date) {
				var y = date.getFullYear();
				var m = date.getMonth() + 1;
				m = m < 10 ? "0" + m : m;
				var d = date.getDate();
				d = d < 10 ? "0" + d : d;
				this.showDate = y + "-" + m + "-" + d;
				this.postDate = y.toString() + m.toString() + d.toString();
				this.showDateBox = false;
				this.onLoad(true);
			},
			changeSecondTab() {
				this.searchOrg = {
					text: "全行",
					value: ""
				};
				this.thirdTabIndex = 0;
				this.onLoad(true);
			},
			changeThirdTab(i) {
				if (i == this.thirdTabIndex) return;
				this.thirdTabIndex = i;
				this.onLoad(true);
			},
			changeOrderType() {
				if (this.orderType == "DESC") {
					this.orderType = "ASC"
				} else {
					this.orderType = "DESC"
				}
				this.onLoad(true);
			},
			getZbzbList() {
				var codeType;
				switch (this.mainTabIndex) {
					case 0:
						codeType = "RESALE_TYPE";
						break;
					case 1:
						codeType = "RESALE_G_TYPE_TZ";
						break;
					case 2:
						codeType = "RESALE_G_TYPE_ZY";
						break;
				};
				getSysCodeByType({
					codeType
				}, (res) => {
					if (res.data) {
						this.zbzbIndex = 0;
						this.zbzbList = res.data.map((item) => {
							return {
								text: item.codeName,
								value: item.codeValue
							}
						});
					} else {
						Toast.fail("战报指标数据为空")
					}
				})
			},
			resetTime(n) {
				switch (n) {
					case "now":
						this.dealDate(new Date());
						break;
					default:
						querySysDate({}, (res) => {
							if (res.data) {
								var date = [res.data.slice(0, 4), res.data.slice(4, 6), res.data.slice(6)].join(
									"/");
								this.dealDate(new Date(date), n);
							} else {
								Toast.fail("系统跑批日期数据为空")
							}
						});
						break;
				}
			},
			dealDate(maxDate, n) {
				if (n && n != 0) maxDate.setDate(maxDate.getDate() + n);
				var max_y = maxDate.getFullYear();
				var max_m = maxDate.getMonth() + 1;
				max_m = max_m < 10 ? "0" + max_m : max_m;
				var max_d = maxDate.getDate();
				max_d = max_d < 10 ? "0" + max_d : max_d;
				var minDate = new Date(max_y + "/" + max_m + "/" + max_d);
				minDate.setMonth(minDate.getMonth() - 3);
				minDate.toLocaleDateString();
				var min_y = minDate.getFullYear();
				var min_m = minDate.getMonth() + 1;
				var min_d = minDate.getDate();
				this.quarterData = max_y + ".0" + Math.ceil(Number(max_m) / 3);
				this.showDate = max_y + "-" + max_m + "-" + max_d;
				this.postDate = max_y.toString() + max_m.toString() + max_d.toString();
				this.currentDate = new Date(max_y + "/" + max_m + "/" + max_d);
				this.maxDate = new Date(max_y + "/" + max_m + "/" + max_d);
				this.minDate = new Date(min_y + "/" + min_m + "/" + min_d);
				this.canOnLoad = true;
				this.onLoad(true);
			},
			getOwnMsg() {
				if (this.mainTabIndex == 2) {
					queryDirectSaleRankByEmpID({
						rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
						dataDate: this.postDate,
						resaleGType: this.zbzbList[this.zbzbIndex].value || "3",
						orderType: this.orderType,
						orderFiled: this.thirdTabList[this.mainTabIndex][this.thirdTabIndex].value,
					}, (res) => {
						if (res.data) this.ownMsg = res.data
						else this.ownMsg = {}
					});
				} else {
					querySaleRankByEmpID({
						parentRankType: this.mainTabIndex == 0 ? "01" : this.mainTabIndex == 1 ? "02" : "",
						rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
						dataDate: this.postDate,
						resaleType: this.zbzbList[this.zbzbIndex].value || "1",
						orderType: this.orderType,
						orderFiled: this.thirdTabList[this.mainTabIndex][this.thirdTabIndex].value,
					}, (res) => {
						if (res.data) this.ownMsg = res.data
						else this.ownMsg = {}
					});
				}
			},
			dealRes(res) {
				if (res.data) {
					this.totalMsg = res.data.rankTotal;
				} else {
					Toast.fail("获取到的数据为空");
					this.finished = true;
					this.loading = false;
					return;
				};
				if (this.mainTabIndex == 2) this.yxTotal = res.data.rankList.total;
				this.dataList = this.dataList.concat(res.data.rankList.records);
				this.loading = false;
				Toast.clear();
				if (this.dataList.length >= res.data.rankList.total) this.finished = true;
			},
			fixedNum(val) {
				if (!val) return "0.00";
				val = Number(val) / 10000;
				val = Number(val).toFixed(2);
				var re = /\d{1,3}(?=(\d{3})+$)/g;
				return val.toString().replace(/^(\d+)((\.\d+)?)$/, (s, s1, s2) => {
					return s1.replace(re, "$&,") + s2;
				});
			},
			onLoad(reset) {
				if (!this.canOnLoad) return;
				this.loading = true;
				this.finished = false;
				if (reset) {
					this.pageIndex = 0;
					this.dataList = [];
					this.getOwnMsg();
				};
				Toast.loading({
					message: "正在加载",
					forbidClick: true,
					duration: 0
				});
				this.pageIndex++;
				var params = {
					pageNum: this.pageIndex.toString(),
					pageSize: "20",
					dataDate: this.postDate,
					rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
					orderFiled: this.thirdTabList[this.mainTabIndex][this.thirdTabIndex].value,
					orderType: this.orderType,
					isShareList: "0"
				};
				switch (this.mainTabIndex) {
					case 0:
						params.resaleType = this.zbzbList[this.zbzbIndex].value || "1";
						params.orgID = this.searchOrg.value;
						queryOrgSaleRankList(params, (res) => {
							this.dealRes(res)
						});
						break;
					case 1:
						params.resaleType = this.zbzbList[this.zbzbIndex].value || "1";
						params.searchId = this.searchVal.searchResultId || "";
						queryGroupSaleRankList(params, (res) => {
							this.dealRes(res)
						});
						break;
					case 2:
						params.resaleGType = this.zbzbList[this.zbzbIndex].value || "3";
						params.searchId = this.searchVal.searchResultId || "";
						queryDirectSaleRankList(params, (res) => {
							this.dealRes(res)
						});
						break;
				};
			},
			openOrgBox() {
				var type = this.secondTabList[this.mainTabIndex][this.secondTabIndex].value;
				if (type == "2") this.$refs.orgList.showPopup(this.searchOrg, "ct")
				else if (type == "1") this.$refs.orgList.showPopup(this.searchOrg, "sq");
			},
			openSearchBox() {
				var params = {
					rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
					dataDate: this.postDate,
					resaleType: this.zbzbList[this.zbzbIndex].value
				}
				if (this.mainTabIndex == 1) params.parentRankType = "tz"
				else if (this.mainTabIndex == 2) params.parentRankType = "zy";
				this.$refs.custList.showPopup(params, this.searchVal)
			},
			activeOrg(orgValue) {
				if (orgValue.value) {
					this.searchOrg = orgValue;
				} else {
					this.searchOrg = {
						text: "全行",
						value: ""
					}
				};
				this.onLoad(true)
			},
			activeItem(item) {
				if (item.searchResultId) {
					this.searchVal = item;
				} else {
					this.searchVal = {}
				};
				this.onLoad(true)
			},
			showQuesDialog() {
				if (this.mainTabIndex == 0 && this.zbzbList[this.zbzbIndex].value == "1" && this.secondTabIndex != 2) this
					.help_main0_1 = true;
				if (this.mainTabIndex == 0 && this.zbzbList[this.zbzbIndex].value == "1" && this.secondTabIndex == 2) this
					.help_main0_2 = true;
				if (this.mainTabIndex == 0 && this.zbzbList[this.zbzbIndex].value == "2" && this.secondTabIndex != 2) this
					.help_main0_3 = true;
				if (this.mainTabIndex == 0 && this.zbzbList[this.zbzbIndex].value == "2" && this.secondTabIndex == 2) this
					.help_main0_4 = true;
				if (this.mainTabIndex == 1 && this.zbzbList[this.zbzbIndex].value == "1" && (this.secondTabIndex == 0 ||
						this.secondTabIndex == 1)) this.help_main1_1 = true;
				if (this.mainTabIndex == 1 && this.zbzbList[this.zbzbIndex].value == "1" && (this.secondTabIndex == 2 ||
						this.secondTabIndex == 3)) this.help_main1_2 = true;
				if (this.mainTabIndex == 1 && this.zbzbList[this.zbzbIndex].value == "2" && (this.secondTabIndex == 0 ||
						this.secondTabIndex == 1)) this.help_main1_3 = true;
				if (this.mainTabIndex == 1 && this.zbzbList[this.zbzbIndex].value == "2" && (this.secondTabIndex == 2 ||
						this.secondTabIndex == 3)) this.help_main1_4 = true;
				if (this.mainTabIndex == 1 && this.zbzbList[this.zbzbIndex].value == "3") this.help_main1_5 = true;
				if (this.mainTabIndex == 2 && this.zbzbList[this.zbzbIndex].value == "3") this.help_main2_1 = true;
				if (this.mainTabIndex == 2 && this.zbzbList[this.zbzbIndex].value == "4") this.help_main2_2 = true;
			},
			openGroupDetail(dataItem) {
				Toast.loading({
					duration: 0,
					message: '正在加载'
				});
				var params = {
					dataDate: this.postDate,
					groupID: dataItem.groupID
				}
				if (this.mainTabIndex == 1) {
					params.resaleType = this.zbzbList[this.zbzbIndex].value;
					queryGroupRankDetails(params, (res) => {
						this.detailData = res.data;
						Toast.clear();
						this.showGroupDetailBox = true;
					});
				} else if (this.mainTabIndex == 2) {
					params.resaleGType = this.zbzbList[this.zbzbIndex].value;
					queryDirectRankDetails(params, (res) => {
						this.detailData = res.data;
						Toast.clear();
						this.showGroupDetailBox = true;
					});
				};
			},
			createSharePic() {
				Toast.loading({
					duration: 0,
					message: '正在生成图片',
					forbidClick: true,
					loadingType: 'spinner'
				});
				var drawPic = () => {
					//获取到DOM节点的位置
					let picDom = document.getElementById("sharePicture" + this.mainTabIndex);
					//DOM元素的宽高
					let width = picDom.offsetWidth;
					let height = picDom.offsetHeight;
					//创建canvas
					let canvas = document.createElement("canvas")
					//放大比例
					let scale = 1
					//画板的宽高
					canvas.width = width * scale
					canvas.height = height * scale
					let options = {
						//日志开关，在控制台可以查看html2canvas的内部执行流程
						logging: true,
						width: width,
						height: height,
						//【重要】开启跨域配置
						useCORS: true,
						scale: scale,
						//自定义属性
						canvas: canvas,
					}
					html2canvas(picDom, options).then(canvas => {
						this.images = [canvas.toDataURL("image/png")];
						Toast.clear();
						this.showSharePic = true;
					})
				}
				switch (this.mainTabIndex) {
					case 0:
						queryOrgSaleRankList({
							pageNum: "1",
							pageSize: "40",
							rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
							dataDate: this.postDate,
							resaleType: this.zbzbList[this.zbzbIndex].value,
							orgID: "",
							orderType: this.orderType,
							orderFiled: this.thirdTabList[this.mainTabIndex][this.thirdTabIndex].value,
							isShareList: "1"
						}, (res) => {
							if (res.data && res.data.rankList && res.data.rankList.records) {
								var data = res.data.rankList.records;
								if (this.secondTabIndex == 0) {
									let list = [];
									for (var i = 0; i < data.length; i++) {
										if (data[i].brManagerNm == "九江分行") continue;
										list.push({
											msgRank: data[i].rankNum,
											msgName: data[i].brManagerNm,
											msgDetail: this.thirdTabIndex == 0 ? data[i].resaleNum : this
												.thirdTabIndex == 1 ? data[i].resaleNumLd : this
												.thirdTabIndex == 2 ? data[i].resaleNumLm : this
												.thirdTabIndex == 3 ? data[i].resaleNumLy : ""
										})
									}
									this.shareMsgJG = [{
										title: "业绩榜",
										list
									}]
								} else {
									let topTen = [],
										bottomTen = [];
									for (var i = 0; i < data.length; i++) {
										if (i < (res.data.rankList.size / 2)) {
											var addArr = topTen
										} else {
											var addArr = bottomTen
										};
										addArr.push({
											msgRank: data[i].rankNum,
											msgName: data[i].brManagerNm,
											msgDetail: this.thirdTabIndex == 0 ? data[i].resaleNum : this
												.thirdTabIndex == 1 ? data[i].resaleNumLd : this
												.thirdTabIndex == 2 ? data[i].resaleNumLm : this
												.thirdTabIndex == 3 ? data[i].resaleNumLy : ""
										});
									}
									this.shareMsgJG = [{
											title: "荣誉榜（前20名）",
											list: topTen
										},
										{
											title: "激励榜（后20名）",
											list: bottomTen
										}
									]
								};
								this.$nextTick(() => {
									drawPic()
								})
							} else {
								Toast.fail("获取到的分享数据为空");
								return;
							}
						});
						break;
					case 1:
						queryGroupSaleRankShareList({
							rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
							dataDate: this.postDate,
							resaleType: this.zbzbList[this.zbzbIndex].value
						}, (res) => {
							if (res.data && res.data.length) {
								this.shareMsgTZ = res.data;
								this.$nextTick(() => {
									drawPic()
								});
							} else {
								Toast.fail("获取到的分享数据为空");
								return;
							}
						});
						break;
					case 2:
						queryDirectSaleRankList({
							pageNum: "1",
							pageSize: this.yxTotal.toString(),
							dataDate: this.postDate,
							resaleGType: this.zbzbList[this.zbzbIndex].value,
							rankType: this.secondTabList[this.mainTabIndex][this.secondTabIndex].value,
							orderType: this.orderType,
							orderFiled: this.thirdTabList[this.mainTabIndex][this.thirdTabIndex].value,
							searchId: ""
						}, (res) => {
							if (res.data && res.data.rankList && res.data.rankList.records) {
								this.shareMsgYX = res.data.rankList.records;
								this.$nextTick(() => {
									drawPic()
								})
							} else {
								Toast.fail("获取到的分享数据为空");
								return;
							}
						});
						break;
				}
			},
			saveSharePic() {
				AlipayJSBridge.call('pictureTool', {
					type: "1",
					image: this.images[0].split("base64,")[1],
					localIdentifier: ""
				}, (res) => {
					Toast(res.msg);
					if (res.status == "000000") this.showSharePic = false;
				});
			}
		},
		mounted() {
			var width = document.getElementById("topPlace").offsetWidth;
			this.topHeight = width / 750 * 350;
			this.offsetTop = document.getElementById("topPlace").offsetTop;
			this.getZbzbList();
			this.resetTime(0);
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

	.topPlace {
		width: 100%;
		background: url(../../assets/image/teamFight_main_topBG.png) no-repeat center;
		background-size: contain;
		position: relative;
	}

	.welcome,
	.quarterData {
		position: absolute;
		right: 0.15rem;
		text-align: right;
		font-size: 0.15rem;
		font-weight: 500;
		color: #FFFFFF;
	}

	.welcome {
		top: 0.08rem;
	}

	.quarterData {
		top: 0.3rem;
	}

	.mainTab {
		width: 100%;
		height: 0.45rem;
		display: flex;
		flex-wrap: nowrap;
		background-color: #ebf0fa;
	}

	.mainTabItem {
		width: calc(100% / 3);
		text-align: center;
		line-height: 0.45rem;
		font-size: 0.16rem;
		color: #686868;
	}

	.mainTabItem_a {
		background-color: #FFFFFF;
		color: #000000;
	}

	.zbzbAdate {
		width: 100%;
		height: 0.45rem;
		background-color: #FFFFFF;
		border-bottom: solid 1px #F5F6FA;
		display: flex;
		flex-wrap: nowrap;
		font-size: 0.14rem;
	}

	.zbzb {
		width: 50%;
		display: flex;
		align-items: center;
	}

	.zbzbTitle {
		width: 45%;
		text-align: center;
		color: #888888;
	}

	.zbzbValue {
		padding-right: 0.05rem;
	}

	.thirdTab {
		width: 100%;
		height: 0.5rem;
		padding: 0 0.05rem;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-around;
		align-items: center;
		background-color: #FFFFFF;
		border-bottom: solid 1px #F5F6FA;
	}

	.thirdTabBox {
		height: 0.3rem;
		line-height: 0.3rem;
		font-size: 0.14rem;
		padding: 0 0.1rem;
		border-radius: 0.15rem;
		background-color: #F5F6FA;
		color: #888888;
	}

	.thirdTabBox_a {
		height: 0.3rem;
		line-height: 0.3rem;
		background-color: #FFFFFF;
		color: #0088FF;
		box-shadow: 0 0 0.08rem -0.02rem #0088FF;
	}

	.zbzbItem {
		width: 90%;
		margin: 0 auto;
		line-height: 0.45rem;
		border-bottom: solid 1px #F5F6FA;
		font-size: 0.15rem;
		text-align: center;
	}

	.zbzbItem_a {
		color: #0088FF;
	}

	.valueBox {
		color: #FFFFFF;
		width: 100%;
		padding: 0.05rem 3% 0.05rem 1%;
		overflow-y: hidden;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 1px #F5F6FA;
	}

	.value01 {
		width: 12%;
		height: 0.12rem;
		overflow: visible;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		flex-shrink: 0;
	}

	.value01>img {
		width: 0.2rem;
	}

	.value02 {
		width: 45%;
		text-align: left;
		flex-shrink: 1;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.value03 {
		width: 12%;
		text-align: center;
		flex-shrink: 0;
	}

	.value04 {
		width: 12%;
		text-align: center;
		flex-shrink: 0;
	}

	.value05 {
		width: 43%;
		text-align: right;
		flex-shrink: 1;
	}

	.value06 {
		color: #888888;
		width: 8%;
		text-align: center;
		flex-shrink: 0;
	}

	.dataTitle {
		color: #888888;
		height: 0.35rem;
		font-size: 0.12rem;
		background-color: #F5F6FA;
		line-height: 0.14rem;
	}

	.dataValue {
		color: #333333;
		min-height: 0.35rem;
		/* height: 0.35rem; */
		/* padding: 0.1rem 0; */
		font-size: 0.12rem;
		background-color: #FFFFFF;
	}

	.ordImg {
		width: 0.16rem;
		height: 0.16rem;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 100%;
		flex-shrink: 0;
	}

	.valueTitle05 {
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: flex-end;
		text-align: center;
	}

	.valueTitle {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		line-height: 0.14rem;
		padding-top: 0.02rem;
		flex-shrink: 1;
	}

	.textImg {
		width: 0.16rem;
		height: 0.16rem;
		background: url(../../assets/image/teamFight_main_text.png) center no-repeat;
		background-size: 100%;
		flex-shrink: 0;
	}

	.quesDiog {
		text-align: left;
		color: #666666;
		padding: 0 0.2rem 0.2rem 0.2rem;
	}

	.groupDetailBox {
		width: 100%;
		height: 50vh;
		font-size: 0.14rem;
	}

	.groupDetailValueBox {
		width: 100%;
		height: 50vh;
		overflow: auto;
	}

	.groupDetailTitle,
	.groupDetailValue {
		width: 100%;
		padding: 0 5%;
		height: 0.4rem;
		line-height: 0.4rem;
		display: flex;
		flex-wrap: nowrap;
	}

	.groupDetailTitle {
		background-color: #F5F6FA;
		color: #333333;
	}

	.groupDetailValue {
		color: #666666;
	}

	.groupDetailValue1 {
		width: 52%;
		text-align: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		flex-shrink: 1;
	}

	.groupDetailValue2 {
		width: 18%;
		text-align: center;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.groupDetailValue3 {
		width: 18%;
		text-align: center;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.groupDetailValue4 {
		width: 18%;
		text-align: center;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.groupDetailValue5 {
		width: 30%;
		text-align: right;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.shareBtn {
		background: url(../../assets/image/teamFight_main_share.png) no-repeat center;
		background-size: contain;
		width: 0.46rem;
		height: 0.46rem;
		position: fixed;
		bottom: calc(constant(safe-area-inset-bottom) + 0.6rem);
		bottom: calc(env(safe-area-inset-bottom) + 0.6rem);
		right: 0.1rem;
		border-radius: 0.23rem;
		overflow: hidden;
		box-shadow: 0.01rem 0.01rem 0.03rem 0rem #668899;
		z-index: 9;
	}

	.shareBox {
		width: 100vw;
		height: 80vh;
		color: #FFFFFF;
		font-size: 0.32rem;
		overflow: auto;
		position: fixed;
		top: 10vh;
		left: 0;
		z-index: -9;
	}

	.shareBox-jg {
		background: #FF4504 url(../../assets/image/teamFight_share_jgBg.png) no-repeat center top;
		background-size: 100%;
		width: 10rem;
		position: relative;
		overflow: hidden;
	}

	.shareJGCard1 {
		background-color: rgba(200, 200, 200, .4);
		position: absolute;
		top: 0.6rem;
		line-height: 0.6rem;
		right: 0;
		font-weight: 500;
		padding: 0 0.1rem 0 0.2rem;
		border-top-left-radius: 0.3rem;
		border-bottom-left-radius: 0.3rem;
	}

	.shareJGCard2 {
		position: absolute;
		top: 2.2rem;
		right: 3.3rem;
		font-size: 0.42rem;
		font-weight: 500;
	}

	.shareJGCard3 {
		width: 100%;
		height: 7rem;
	}

	.shareJGCard4 {
		width: 100%;
		font-size: 0.45rem;
	}

	.shareJGCard5 {
		width: 100%;
		position: relative;
		margin-top: 0.4rem;
		padding-top: 0.39rem;
		padding-bottom: 0.8rem;
	}

	.shareJGTitle {
		font-size: 0.4rem;
		padding: 0 0.2rem;
		background-color: rgba(175, 35, 42);
		position: absolute;
		width: 60%;
		line-height: 0.8rem;
		top: 0;
		left: 20%;
		border-radius: 0.4rem;
		border: solid 0.02rem #ddc199;
	}

	.shareJGValueBox {
		width: 92%;
		margin: 0 auto;
		padding-top: 0.6rem;
		border: solid 0.02rem #ddc199;
		border-radius: 0.1rem;
	}

	.shareJGValue {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		padding: 0.15rem 0.2rem 0.15rem 0;
		font-size: 0.35rem;
		border-bottom: solid 0.01rem rgba(221, 193, 153, .5);
	}

	.shareJGValue:last-child {
		border: 0;
	}

	.shareJGValue1 {
		width: 15%;
		text-align: center;
		flex-shrink: 0;
	}

	.shareJGValue2 {
		width: 55%;
		text-align: left;
		flex-shrink: 0;
	}

	.shareJGValue3 {
		width: 30%;
		text-align: right;
		flex-shrink: 0;
	}

	.shuiyin {
		color: #CDCDCD;
		position: absolute;
		top: -25%;
		left: -200%;
		z-index: 9;
		pointer-events: none;
		width: 500%;
		height: 150%;
		transform-origin: center center;
		transform: rotateZ(-10deg);
		font-size: 0.4rem;
		font-weight: 600;
		line-height: 1.8rem;
		opacity: .25;
	}

	.shareBoxTop {
		width: 100vw;
		height: 100vh;
		background-color: #F5F6FA;
		position: fixed;
		z-index: -8;
		top: 0;
		left: 0;
	}

	.savePic {
		width: 80%;
		line-height: 0.4rem;
		border-radius: 0.2rem;
		text-align: center;
		font-size: 0.16rem;
		position: fixed;
		bottom: 0.1rem;
		left: 10%;
		color: #333333;
		background-color: #FFFFFF;
	}

	:deep(.van-image-preview__swipe) {
		height: calc(100vh - 1.4rem - constant(safe-area-inset-top));
		height: calc(100vh - 1.4rem - env(safe-area-inset-top));
		top: calc(0.7rem + constant(safe-area-inset-top));
		top: calc(0.7rem + env(safe-area-inset-top));
	}

	.shareBox-tz {
		background: #A50B11 url(../../assets/image/teamFight_share_tzBg.png) no-repeat center top;
		background-size: 100%;
		width: 10rem;
		position: relative;
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		padding-bottom: 0.5rem;
	}

	.shareTZCard1,
	.shareTZCard2 {
		background-color: rgba(200, 200, 200, .4);
		position: absolute;
		line-height: 0.6rem;
		right: 0;
		font-weight: 500;
		padding: 0 0.2rem 0 0.4rem;
		border-top-left-radius: 0.3rem;
		border-bottom-left-radius: 0.3rem;
	}

	.shareTZCard1 {
		top: 0.6rem;
	}

	.shareTZCard2 {
		top: 1.5rem;
	}

	.shareTZCard3 {
		position: absolute;
		top: 2.5rem;
		right: 3.4rem;
		font-size: 0.45rem;
		font-weight: 500;
	}

	.shareTZCard4 {
		width: 100%;
		height: 7.5rem;
	}

	.shareTZCard5 {
		width: 100%;
		height: 0.7rem;
		background: url(../../assets/image/teamFight_share_tz1.png) no-repeat center;
		background-size: contain;
	}

	.shareTZCard6 {
		color: #795F01;
		background-color: #FEE68B;
		min-width: 50%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-top: 0.5rem;
		margin-left: 0.5rem;
		padding: 0.15rem 0.5rem 0.15rem 0.85rem;
		border-top-right-radius: 1rem;
		border-bottom-right-radius: 1rem;
	}

	.shareTZCard6BG {
		background: url(../../assets/image/teamFight_share_tzTop1.png) no-repeat center;
		background-size: contain;
		width: 1.4rem;
		height: 1.4rem;
		position: absolute;
		left: -0.7rem;
		top: -0.1rem;
	}

	.shareTZCard6Value {
		font-size: 0.35rem;
		font-weight: 500;
	}

	.shareTZCard7 {
		margin-top: 0.75rem;
		width: 100%;
		height: 0.65rem;
		background: url(../../assets/image/teamFight_share_tz2.png) no-repeat center;
		background-size: contain;
	}

	.shareTZCard8 {
		color: #7A6001;
		background-color: #FEC265;
		width: 92%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-between;
		position: relative;
		margin-top: 0.5rem;
		margin-left: 0.5rem;
		padding: 0.1rem 0.2rem 0.1rem 0.55rem;
		border-top-right-radius: 1rem;
		border-bottom-right-radius: 1rem;
	}

	.shareTZCard8BG {
		background: url(../../assets/image/teamFight_share_tzTop2.png) no-repeat center;
		background-size: contain;
		width: 1.4rem;
		height: 1.4rem;
		position: absolute;
		left: -0.7rem;
		top: -0.1rem;
	}

	.shareTZCard8Value {
		font-size: 0.28rem;
		font-weight: 500;
		max-width: calc(25% - 0.1rem);
	}

	.shareTZCard9 {
		margin-top: 0.7rem;
		width: 100%;
		height: 0.65rem;
		background: url(../../assets/image/teamFight_share_tz3.png) no-repeat center;
		background-size: contain;
	}

	.shareTZCard10,
	.shareTZCard11 {
		color: #7A6001;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: space-around;
		position: relative;
		margin-top: 0.3rem;
		padding: 0.15rem 0.25rem;
		border-radius: 1rem;
	}

	.shareTZCard10 {
		background-color: #E7A173;
		min-width: 60%;
	}

	.shareTZCard11 {
		background-color: #E7A173;
		min-width: 50%;
	}

	.shareTZCard10Value,
	.shareTZCard11Value {
		font-size: 0.25rem;
		font-weight: 500;
	}

	.shareTZCard12 {
		margin-top: 1rem;
		width: 93%;
		background-color: #FFFFFF;
		border-radius: 0.1rem;
		position: relative;
	}

	.shareTZCard12Top {
		background: url(../../assets/image/teamFight_share_tzTitle.png) no-repeat center;
		background-size: contain;
		width: 9.3rem;
		height: 3rem;
		margin-top: -0.25rem;
		margin-bottom: 0.45rem;
		position: relative;
	}

	.shareTZDate {
		position: absolute;
		color: #F20303;
		top: 1.08rem;
		left: calc(50% + 0.2rem);
		font-size: 0.38rem;
		font-weight: 600;
	}

	.shareTZItem {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		align-items: center;
		color: #333333;
		font-size: 0.2rem;
		border-top: solid 0.01rem #666666;
	}

	.shareTZItem>div {
		border-left: solid 0.01rem #666666;
		padding: 0.05rem 0;
		height: 100%;
		flex-shrink: 0;
	}

	.shareTZItemTitle>div {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.shareTZValue1 {
		width: 6%;
	}

	.shareTZValue2 {
		width: 32%;
	}

	.shareTZValue3 {
		width: 6%;
	}

	.shareTZValue4-1 {
		width: 24%;
	}

	.shareTZValue4-2 {
		width: 16%;
	}

	.shareTZValue5-1 {
		width: 24%;
	}

	.shareTZValue5-2 {
		width: 16%;
	}

	.shareTZValue6 {
		width: 16%;
	}

	.shareTZValue7 {
		width: 8%;
	}

	.shareBox-yx {
		background: #D10410 url(../../assets/image/teamFight_share_yxBg.png) no-repeat center top;
		background-size: 100%;
		width: 10rem;
		position: relative;
		overflow: hidden;
		padding-bottom: 0.5rem;
	}

	.shareYXCard1 {
		background-color: rgba(200, 200, 200, .4);
		position: absolute;
		top: 0.6rem;
		line-height: 0.6rem;
		right: 0;
		font-weight: 500;
		padding: 0 0.1rem 0 0.2rem;
		border-top-left-radius: 0.3rem;
		border-bottom-left-radius: 0.3rem;
	}

	.shareYXCard2 {
		position: absolute;
		top: 2.6rem;
		right: 3.2rem;
		font-size: 0.42rem;
		font-weight: 500;
	}

	.shareYXCard3 {
		width: 100%;
		height: 6.5rem;
	}

	.shareYXCard4 {
		width: 100%;
		font-size: 0.4rem;
		font-weight: 500;
	}

	.shareYXCard5 {
		width: 100%;
		position: relative;
		margin-top: 0.4rem;
		padding-top: 0.39rem;
		padding-bottom: 0.8rem;
	}

	.shareYXTitle {
		font-size: 0.4rem;
		padding: 0 0.2rem;
		background-color: rgba(175, 35, 42);
		position: absolute;
		width: 60%;
		line-height: 0.8rem;
		top: 0;
		left: 20%;
		border-radius: 0.4rem;
		border: solid 0.02rem #ddc199;
	}

	.shareYXValueBox {
		width: 92%;
		margin: 0 auto;
		padding-top: 0.6rem;
		border: solid 0.02rem #ddc199;
		border-radius: 0.1rem;
	}

	.shareYXValue {
		width: 100%;
		display: flex;
		flex-wrap: nowrap;
		justify-content: space-between;
		align-items: center;
		padding: 0.15rem 0.2rem 0.15rem 0;
		font-size: 0.35rem;
		border-bottom: solid 0.01rem rgba(221, 193, 153, .5);
	}

	.shareYXValue:last-child {
		border: 0;
	}

	.shareYXValue1 {
		width: 10%;
		text-align: center;
		flex-shrink: 0;
	}

	.shareYXValue2-1 {
		width: 30%;
		text-align: left;
		flex-shrink: 0;
	}

	.shareYXValue2-2 {
		width: 45%;
		text-align: left;
		flex-shrink: 0;
	}

	.shareYXValue3,
	.shareYXValue4 {
		width: 15%;
		text-align: center;
		flex-shrink: 0;
	}

	.shareYXValue5-1 {
		width: 30%;
		text-align: right;
		flex-shrink: 0;
	}

	.shareYXValue5-2 {
		width: 45%;
		text-align: right;
		flex-shrink: 0;
	}
</style>
