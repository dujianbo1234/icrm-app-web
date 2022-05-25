<template>
  <!-- 客户视图 -->
  <div class="clCustomerView">
    <!-- 顶部title -->
    <nav-bar title="客户视图" type="2" leftIcon rightText="客户拜访" rightColor="rgba(2, 109, 255, 1)"/>
    <!-- 客户信息 -->
    <div class="card custInfo">
      <div class="custInfoName">
        <div class="custInfoLeft"></div>
        <div class="custInfoRight">
          <div class="custName">
            <div class="custItem1_2_1">{{custBase.cstName}}</div>
            <div class="custItem1_2_2" :style="`background-image:url(${require(`@/assets/image/business_chooseCust_type0.png`)})`"></div>
          </div>
          <div class="custItem1_2_3">
            <template v-for="(text, j) in ['vipCstFlg','agentPayCstFlg', 'basicCstCnt', 'merntCstFlg', 'ioinHoldLoan', 'crdtCrdCstFlg']">
              <div :class="`iconText ${text}`" v-if="custBase[text] == 1" :key="j">{{['财','代','新','商','贷','信'][j]}}</div>
            </template>
            <template v-for="(text, s) in ['ioinSgnMobbank','ioinSgnAlpy','ioinSgnWchtPymt', 'ioinSgnYsf']" :key="s">
              <van-icon :name="require(`@/assets/image/business_chooseCust_${['jjyh','zfb','wx','ysf'][s]}${['.png','_a.png'][custBase[text] || 0]}`)" size="16" style="margin-right: 0.04rem;" />
            </template>
          </div>
        </div>
      </div>
      <!-- 客户编号 -->
      <div class="custInfoNo">
        <div>
          <div>客户编号</div>
          <div>{{custBase.custNum || '-'}}</div>
        </div>
        <div>
          <div>证件号码</div>
          <div>{{custBase.certNum || '-'}}</div>
        </div>
      </div>
      <!-- 联系方式 -->
      <div class="custInfoPhone">
        <div class="textContent">
          <span class="title">联系电话</span>
          <span class="phoneStyle">{{custBase.ctcTel || '-'}}</span>
          <van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12" @click="editPhone"/>
        </div>
        <div class="textContent" style="padding-top: 0.07rem;">
          <span class="title">详细地址</span>
          <span class="textStyle">{{custBase.famAddr || '-'}}</span>
          <van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12" @click="editAddress"/>
        </div>
      </div>
      <!-- 客户经理信息 -->
      <div class="custManager">
        <div>
          <span>客户经理：</span>
          <span>{{custBase.belgCustMgrNm ? `${custBase.belgCustMgrNm}(${custBase.belgCustMgr})` : '-'}}</span>
        </div>
        <div>
          <span>所属机构：</span>
          <span>{{custBase.belongOrgNm || '-'}}</span>
        </div>
      </div>
    </div>
    <!-- 客户画像 -->
    <div class="card custPortrait">
      <div class="custPortrait_title">
        <div class="custPortrait_title_l">
          <van-icon class="icon" :name="require(`@/assets/image/cust_edit_user.png`)" size="14"/>
          <span>客户画像</span>
        </div>
        <div class="custPortrait_title_r">
          <span class="btnAdd" @click="addTag">
            <van-icon name="plus" size="10" color="#8C8C8C"/>
            <span>自定义标签</span>
          </span>
          <span class="btnText" @click="portraitbtn = !portraitbtn">
            <span>{{portraitbtn ? '展开' : '收起'}}</span>
            <van-icon :name="portraitbtn ? 'arrow-down' : 'arrow-up'" size="14" color="#8C8C8C"/>
          </span>
        </div>
      </div>
      <div class="custPortrait_main">
        <template v-for="(item, index) in tagList" :key="item.label">
          <div v-if="portraitbtn ? index == 0 : item">
            <!-- 类型名 -->
            <div class="main_label">
              <span>{{item.label}}：</span>
              <van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12" style="padding-top: 0.02rem;" v-if="item.label === '自定义标签'" @click="editTag = !editTag"/>
            </div>
            <!-- 标签 -->
            <template v-for="tag in item.tag" :key="tag">
              <!-- 自定义标签 -->
              <span class="portraitIcon" v-if="item.label === '自定义标签'">
                <div :class="editTag ? 'labelD' : 'label'" @click.stop="editTagFun(tag)">
                  {{tag.labNm}}
                  <div class="iconX" v-if="editTag" @click.stop="delTagFun(tag)">
                    <van-icon name="cross" class="badge-icon" size="0.07rem" color="#026DFF"/>
                  </div>
                </div>
              </span>
              <!-- 普通标签 -->
              <div class="label" v-else>{{tag}}</div>
            </template>
          </div>
        </template>
      </div>
    </div>

    <div class="tabsList">
      <van-tabs class="tabs" v-model:active="active">
        <van-tab title="资产总览">
          <!-- 资产总览(元) -->
          <!-- <div class="contentItem" style="margin-top: 0.12rem"> -->
          <TitleCard :cardData="cardData" :dalongShow="['等内容..']"></TitleCard>
          <!-- </div> -->
          <!-- 分割线 -->
          <div class="dividers"></div>
          <!-- 资产分布图 -->
          <div class="card">
            <div class="custStyle aumStyle">
              <span class="title">资产分布图</span>
              <span class="iconBox" @click="assetFlag = !assetFlag">
                <van-icon :name="require('@/assets/image/list_1.png')" size="0.32rem" v-if="assetFlag"/>
                <van-icon :name="require('@/assets/image/list_2.png')" size="0.32rem" v-else/>
              </span>
            </div>
            <!-- 列表 -->
            <div style="margin-top: 0.07rem;">
              <Table :listLabel="listLabel" :listData="listData" :listType="listType" :lableArr="['a','b','c', 'd']" v-if="assetFlag"></Table>
              <!-- <echarts-pie ref="aumDisDiaChart" unit="万元" :data="aumDisDiaData" v-else/> -->
            </div>
          </div>
          
        </van-tab>
        <van-tab title="产品信息">产品信息</van-tab>
        <van-tab title="交易分析">交易分析</van-tab>
        <van-tab title="商机记录">商机记录</van-tab>
      </van-tabs>
    </div>
    <!-- 弹框组件 -->
    <div class="dialog">
      <van-dialog theme="round-button" to=".dialog" v-model:show="show" :title="dialogTitle" show-cancel-button>

        <div v-if="type == 'delPhone' || type == 'delTag' || type == 'delAdr'">{{dialogText}}</div>

        <van-field v-model="value" :label="dialogLable" :placeholder="dialogHolder" show-word-limit maxlength="10" :formatter="(value) => value.replace(/\s/g, '')" v-else/>
        
        <template #footer>
          <div class="bootomBtn">
            <van-button class="btnL" size="small" round plain type="primary" @click="show = false">取消</van-button>
            <van-button class="btnR" size="small" round type="primary" @click="handOk">确认</van-button>
          </div>
        </template>

      </van-dialog>
    </div>
    <!-- 联系人弹窗 -->
    <div class="dialogs">
      <van-dialog theme="round-button" to=".dialogs" v-model:show="openDialog" :title="['联系电话','新增联系电话','修改联系电话','详细地址','新增联系地址','修改联系地址'][dialogTitles]" show-cancel-button>        
        
        <div v-if="dialogTitles == 0" class="swipe">
          <template v-for="item in phoneList" :key="item.id">
            <van-swipe-cell :disabled="item.dataSrc == 1">
              <van-cell :border="true" :title="item.telType" :value="item.ctcTel"/>
              <template #right>
                <van-button square type="warning" text="删除" @click="delBtn(item)"/>
                <van-button square type="danger" text="修改" @click="editBtn(item)"/>
              </template>
            </van-swipe-cell>
          </template>
        </div>

        <div v-else-if="dialogTitles == 3" class="swipes">
          <template v-for="item in addressList" :key="item.id">
            <van-swipe-cell :disabled="item.dataSrc == 1">
              <van-cell :border="true" :title="item.adrType" :value="item.ctcAdr"/>
              <template #right>
                <van-button square type="warning" text="删除" @click="delBtn(item)"/>
                <van-button square type="danger" text="修改" @click="editBtn(item)"/>
              </template>
            </van-swipe-cell>
          </template>
        </div>

        <div v-else-if="dialogTitles == 1 || dialogTitles == 2">
          <van-field v-model="phoneType" readonly label="电话类型" placeholder="选择类型" @click="showPicker = true" right-icon="arrow-down"/>
          <van-field v-model="phoneText" type="tel" label="联系电话" placeholder="请输入电话"/>
        </div>

        <div v-else>
          <van-field v-model="adrType" readonly label="地址类型" placeholder="选择类型" @click="showPicker = true" right-icon="arrow-down"/>
          <van-field v-model="adrText" label="联系地址" placeholder="请输入地址"/>
        </div>

        <template #footer>
          <div class="bootomBtn">
            <van-button class="btnL" size="small" round plain type="primary" @click="onClear">取消</van-button>
            <van-button class="btnR" size="small" round type="primary" @click="addOk">{{dialogTitles == 0 || dialogTitles == 3 ? '新增' : '确定'}}</van-button>
          </div>
        </template>
      </van-dialog>
    </div>
    <van-popup v-model:show="showPicker" round position="bottom">
      <van-picker :title="dialogTitles < 4 ? '电话类型' :'地址类型'" :columns="dialogTitles < 4 ? ['单位电话','移动电话','财务联系电话'] : ['个人通讯地址','工作单位地址']" @cancel="showPicker = false" @confirm="onConfirm"/>
    </van-popup>
  </div>
</template>

<script>
import { 
  queryCustBaseInfo,
  queryCustTagInfo,
  queryCustDefinedLabel,
  saveCustDefinedLabel,
  delCustDefinedLabel,
  queryCustContactList,
  saveCustContactInfo,
  delCustContactInfo,
  queryCustAddressList,
  saveCustAddressInfo,
  delCustAddressInfo,
  queryCustAssetAnalyInfo
} from "@/request/custinfo.js"
import {
	Toast,
	Dialog
} from "vant";

import TitleCard from "@/views/cust/components/TitleCard.vue"
import Table from "@/views/index/components/Table.vue"
import EchartsPie from "../../components/common/echarts-pie.vue";
export default {
  name: "clCustomerView",
  components: {
    TitleCard,
    Table,
    EchartsPie
  },
  data() {
    return {
      cardData: [4845976.75, 4409514, 4409514, 4409514],
      assetFlag: true,
      active: 0,
      showPicker: false,
      phoneType: '',
      phoneText: '',
      adrType: '',
      adrText: '',
      activeNames: ['1'],
      custBase: {},
      assetInfo: {},
      portraitbtn: true,
      tagList: [],
      show: false,
      openDialog: false,
      editTag: false,
      tagItem: null,
      itemData: null,
      value: '',
      dialogTitle: '',
      dialogTitles: 0,
      dialogLable: '',
      dialogHolder: '限10字以内',
      dialogText: '',
      type: '',
      phoneList: [],
      addressList: [],
      listLabel: [
        { label: '类型', align: 'left', fixed: true },
        { label: '金额(万元)', align: 'right' },
        { label: '较上日(万元)', align: 'right' },
        { label: '较上月(万元)', align: 'right' },
        { label: '较年初(万元)', align: 'right' },
      ],
      listData: [
        { name: '活期存款余额', a: '', b: '', c: '', d: '' },
        { name: '定期存款余额', a: '', b: '', c: '', d: '' },
        { name: '理财余额', a: '', b: '', c: '', d: '' },
        { name: '基金余额', a: '', b: '', c: '', d: '' },
        { name: '保险余额', a: '', b: '', c: '', d: '' },
        { name: '信托余额', a: '', b: '', c: '', d: '' },
        { name: '合计', a: '', b: '', c: '', d: '' },
      ],
      aumDisDiaData: [],
      listType: 0
    };
  },
  async created(){
    this.queryContactList()
    this.queryAddressList()
    this.queryCustInfo(this.$route.query.custNum)
    this.queryTagList(this.$route.query.custNum)
  },
  methods: {
    /* 客户基础信息查询 */
    queryCustInfo(custNum){
      let body = {
        custNum: custNum
      }
      queryCustBaseInfo(body,res => {
        if(res && res.data){
          this.custBase = res.data.custBase     // 客户基础信息
          this.assetInfo = res.data.assetInfo   // 资产分布图(列表信息)
        }
      })
    },
    async queryTagList(custNum){
      this.tagList = []
      await this.queryDefinedTag(custNum)
      this.queryCustTag(custNum)
    },
    /* 客户标签信息查询 */
    queryCustTag(custNum){
      let body = {
        custNum: custNum,
        judge: '0'
      }
      queryCustTagInfo(body,res => {
        if(res && res.data && res.data.LabelClass){
          let data = res.data.LabelClass
          let labelList = ['jbsx', 'zcxj', 'xwxg', 'yxxx', 'fxtz', 'khjz']
          labelList.forEach((item, index) => {
            if(data[item] && data[item].length > 0){
              this.tagList.push({
                label: ['基本属性', '资产信息', '行为习惯', '营销信息', '风险特征', '客户价值'][index],
                tag: data[item]
              })
            }
          })
        }
      })
    },
    /* 自定义标签信息查询 */
    queryDefinedTag(custNum){
      let body = {
        custNumc: custNum
      }
      queryCustDefinedLabel(body, res => {
        let data = res.data.contactList || []
        if(data && data .length > 0)
          this.tagList.unshift({
            label: '自定义标签',
            tag: data 
          })
      })
    },
    /* 自定义标签修改/新增 */
    saveDefinedTag(body){
      saveCustDefinedLabel(body, res => {
        Toast.clear();
        if(res.data){
          Toast.success(res.msg)
          this.show = false
          this.queryTagList(this.$route.query.custNum)
        }
      })
    },
    /* 自定义标签删除 */
    delDefinedTag(body){
      delCustDefinedLabel(body, res => {
        Toast.clear();
        if(res.data){
          Toast.success(res.msg)
          this.show = false
          this.queryTagList(this.$route.query.custNum)
        }
      })
    },
    /* 添加自定义标签 */
    addTag(){
      if(this.tagList[0].label == '自定义标签' && this.tagList[0].tag.length > 9){
        Dialog.alert({
          title: '提示',
          message: '自定义标签仅限10个。',
          theme: 'round-button',
          confirmButtonColor: '#026DFF'
        }).then(() => {
          // on close
        });
      }else{
        this.initDialog('addTag', '添加自定义标签')
      }
    },
    /* 弹窗确定 */
    handOk(){
      if(this.value || this.type == 'delTag' || this.type == 'delPhone' || this.type == 'delAdr'){
        Toast.loading({
          message: "正在加载",
          forbidClick: true,
          duration: 0,
        });
        switch (this.type) {
          case 'addTag':
            var body = {
              custNumc: this.custBase.custNum,      // 客户编号
              labNm: this.value,                    // 标签内容
            }
            this.saveDefinedTag(body)
          break
          case 'editTag':
            var body = {
              idc: this.tagItem.idc,                // id
              custNumc: this.custBase.custNum,      // 客户编号
              labNm: this.value,                    // 标签内容
            }
            this.saveDefinedTag(body)
          break;
          case 'delTag':
            var body = {
              idc: this.tagItem.idc,                // id
            }
            this.delDefinedTag(body)
          break;
          case 'delPhone':
            var body = {
              ids: [this.itemData.id]
            }
            delCustContactInfo(body, res => {
              Toast.clear();
              if(res.data){
                this.show = false
                this.queryContactList()
              }
            })
          break;
          case 'delAdr':
            var body = {
              ids: [this.itemData.id]
            }
            console.log(body)
            delCustAddressInfo(body, res => {
              Toast.clear();
              if(res.data){
                this.show = false
                this.queryAddressList()
              }
            })
          break;
        }
      }else{
        Toast.fail("标签内容为空!");
      }
      // this.show = false
    },
    /* 点击修改标签 */
    editTagFun(item){
      if(this.editTag){
        this.tagItem = item
        this.value = item.labNm
        this.initDialog('editTag', '修改自定义标签')
      }
    },
    /* 点击删除标签 */
    delTagFun(item){
      if(this.editTag){
        this.tagItem = item
        this.dialogText = '确定删除该标签？'
        this.initDialog('delTag', '提示')
      }
    },
    /* 初始化弹窗内容 类型 标题 输入框holder 输入框默认值 */
    initDialog(type, dialogTitle){
      this.show = true
      this.type = type
      this.dialogTitle = dialogTitle
    },
    /* 修改电话按钮 */
    editPhone(){
      this.openDialog = true
      this.dialogTitles = 0
    },
    /* 查询联系电话 */
    queryContactList(){
      let body = {
        custNum: this.$route.query.custNum
      }
      queryCustContactList(body, res => {
        if(res && res.data && res.data.contactList){
          this.phoneList = res.data.contactList
          this.$forceUpdate() 
        }else{
          Toast.fail("联系电话查询失败")
        }
      })
    },
    /* 查询联系地址 */
    queryAddressList(){
      let body = {
        custNum: this.$route.query.custNum
      }
      queryCustAddressList(body, res => {
        if(res && res.data && res.data.addressList){
          this.addressList = res.data.addressList
          console.log('赋值成功')
          this.$forceUpdate()
        }else{
          Toast.fail("联系地址查询失败")
        }
      })
    },
    /* 修改地址按钮 */
    editAddress(){
      this.openDialog = true
      this.type = 'editAddress'
      this.dialogTitles = 3
    },
    /* 删除按钮 */
    delBtn(item){
      this.dialogText = '确定删除该信息？'
      this.itemData = item
      if(this.dialogTitles == 0){
        this.initDialog('delPhone', '提示')
      }else{
        this.initDialog('delAdr', '提示')
      }
    },
    /* 修改按钮 */
    editBtn(item){
      switch (this.dialogTitles) {
        case 0 :
          this.itemData = item
          this.phoneType = item.telType
          this.phoneText = item.ctcTel
          this.dialogTitles = 2
        break
        case 3 :
          this.itemData = item
          this.adrType = item.adrType
          this.adrText = item.ctcAdr
          this.dialogTitles = 5
        break
      }
    },
    /* 新增/编辑 */
    addOk(){
      if(this.dialogTitles == 1 || this.dialogTitles == 2 ){
        Toast.loading({
          message: "正在加载",
          forbidClick: true,
          duration: 0,
        });
        this.saveCustPhone()
      }else if(this.dialogTitles == 4 || this.dialogTitles == 5){
        Toast.loading({
          message: "正在加载",
          forbidClick: true,
          duration: 0,
        });
        this.saveAddress()
      }else{
        switch(this.dialogTitles){
          case 0 :
            this.dialogTitles = 1
            this.phoneType = ''
            this.phoneText = ''
          break
          case 3 :
            this.dialogTitles = 4
            this.adrType = ''
            this.adrText = ''
          break
        }
      }
    },
    /* 联系电话保存 */
    saveCustPhone(){
      let obj = {
        '单位电话': '12',
        '移动电话': '13',
        '财务联系电话': '15',
      }
      let body = {
        ctcTel: this.phoneText,
        telType: obj[this.phoneType],
        custNum: this.$route.query.custNum,
        dataSrc: '2',
      }
      if(this.dialogTitles == 2){
        body.id = this.itemData.id
      }
      saveCustContactInfo(body, res => {
        if(res && res.data){
          this.queryContactList()
          this.dialogTitles = 0
          Toast.success(body.id ? "修改成功" : '保存成功')
        }
      })
    },
    /* 联系地址保存 */
    saveAddress(){
      let obj = {
        '个人通讯地址': '119',
        '工作单位地址': '115',
      }
      let body = {
        ctcAdr: this.adrText,
        adrType: obj[this.adrType],
        custNum: this.$route.query.custNum,
        dataSrc: '2',
      }
      if(this.dialogTitles == 5){
        body.id = this.itemData.id
      }
      saveCustAddressInfo(body, res => {
        if(res && res.data){
          this.queryAddressList()
          this.dialogTitles = 3
          Toast.success(body.id ? "修改成功" : '保存成功')
        }
      })
    },
    /* 取消按钮 */
    onClear(){
      switch(this.dialogTitles){
        case 1:
          this.dialogTitles = 0;
        break
        case 2:
          this.dialogTitles = 0;
        break
        case 4:
          this.dialogTitles = 3;
        break
        case 5:
          this.dialogTitles = 3;
        break
        default: 
          this.openDialog = false;
        break
      }
    },
    /* 选中类型 */
    onConfirm(value){
      if(this.dialogTitles > 2){
        this.adrType = value
      }else{
        this.phoneType = value
      }
      this.showPicker = false
    }
  },
};
</script>

<style lang="less" scoped>
// * {
//   box-sizing: border-box;
//   margin: 0;
//   padding: 0;
//   /* border: 0; */
// }
.clCustomerView {
  box-sizing: border-box;
  padding: 0.11rem 0.12rem;
  font-size: 0.14rem;
  color: #262626;
  .dialog,
  .dialogs {
    // --van-cell-vertical-padding: 0;
    // --van-cell-horizontal-padding: 0.215rem;
    .bootomBtn {
      padding: 0.2rem 0 0.145rem;
      .btnL,
      .btnR {
        width: 1.08rem;
      }
      .btnL {
        margin-right: 0.08rem;
      }
      .btnR {
        margin-left: 0.08rem;
      }
    }
  }
  .dialog {
    &:deep(.van-field__control){
      background: #FAFAFA;
      // height: 0.215rem;
      padding: 0.105rem 0.085rem;
    }
  }
  .dialogs {
    &:deep(.van-cell){
      border-top: 0.005rem solid #E7E9EC;
      border-bottom: 0.005rem solid #E7E9EC;
      &:after {
        border: none;
      }
    }
    .swipe {
      &:deep(.van-cell__title){
        text-align: left;
      }
      &:deep(.van-cell__value){
        text-align: right;
      }
    }
    .swipes {
      &:deep(.van-cell__title){
        flex: 2;
        text-align: left;
      }
      &:deep(.van-cell__value){
        flex: 3;
        text-align: left;
        font-size: 0.11rem;
        color: #262626;
      }
    }
    // .bom {
    //   border-bottom: 0.005rem solid #E7E9EC;
    // }
  }
  .card {
    background: #fff;
    padding: 0.07rem 0.075rem;
    border-radius: 0.08rem;
    .custStyle {
      font-size: 0.14rem;
      display: flex;
      justify-content: space-between;
    }
    .aumStyle {
      align-items: center;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 0.14rem;
        color: rgba(0,0,0,0.85);
        letter-spacing: 0;
        font-weight: 500;
      }
      .iconBox {
        height: 0.32rem;
      }
    }
  }
  .custInfo {
    // display: flex;
    // justify-content: space-between;
    .custInfoName {
      width: 100%;
      display: flex;
      align-items: center;
      padding-bottom: 0.12rem;
      box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);
      .custInfoLeft {
        width: 0.4rem;
        height: 0.4rem;
        background: url(~@/assets/image/mine_main_userIcon.png) no-repeat center;
        background-size: contain;
        border-radius: 0.2rem;
        overflow: hidden;
        margin-right: 0.1rem;
      }
      .custInfoRight {
        .custName {
          display: flex;
          .custItem1_2_1 {
            height: 0.24rem;
            font-family: PingFangSC-Medium;
            font-size: 0.16rem;
            // color: #262626;
            letter-spacing: 0;
            line-height: 0.24rem;
            font-weight: 500;
            margin: 0 0.08rem 0.04rem 0;
          }
          .custItem1_2_2 {
            width: 0.6rem;
            height: 0.16rem;
            margin: 0.04rem 0 0.08rem;
            background-repeat: no-repeat;
            background-position: left center;
            background-size: contain;
          }
        }
        .custItem1_2_3 {
          width: calc(100%);
          height: 0.16rem;
          display: flex;
          flex-wrap: nowrap;
          .iconText{
            width: 0.19rem;
            height: 0.16rem;
            border-radius: 0.02rem;
            text-align: center;
            line-height: 0.16rem;
            font-family: PingFangSC-Regular;
            font-size: 0.11rem;
            font-weight: 400;
            margin-right: 0.04rem;
          }
          .vipCstFlg {
            background-color: rgba(2,109,255,0.08);
            color: #026DFF;
          }
          .agentPayCstFlg {
            background-color: rgba(255,133,0,0.08);
            color: #FF8500;
          }
          .basicCstCnt {
            background-color: rgba(255,58,58,0.08);
            color: #FF3A3A;
          }
          .merntCstFlg {
            background-color: rgba(68,107,161,0.08);
            color: #446BA1;
          }
          .ioinHoldLoan {
            background-color: rgba(55,205,55,0.08);
            color: #13AD13;
          }
          .crdtCrdCstFlg {
            background-color: rgba(176,177,255,0.08);
            color: #B0B1FF
          }
        }
      }
    }
    .custInfoNo {
      display: flex;
      font-size: 0.12rem;
      text-align: left;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      // color: #8C8C8C;
      line-height: 0.18rem;
      padding: 0.07rem 0;
      box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);
      &>div {
        width: 50%;
        div:nth-child(2){
          color: #8C8C8C;
        }
      }
    }
    .custInfoPhone {
      font-size: 0.12rem;
      line-height: 0.18rem;
      padding: 0.07rem 0;
      box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.04);
      .textContent {
        width: 100%;
        display: flex;
        .title {
          width: 30%;
          color: #8C8C8C;
          text-align: left;
        }
        .phoneStyle,
        .textStyle {
          width: 63%;
          text-align: right;
        }
        // .phoneStyle {
        //   // padding-right: 0.07rem;
        //   text-align: right;
        // }
        // .textStyle {
        //   text-align: right;
        // }
        .icon {
          margin-left: 0.1rem;
          padding-top: 0.02rem;
        }
      }
    }
    .custManager {
      display: flex;
      font-size: 0.12rem;
      line-height: 0.18rem;
      padding-top: 0.07rem;
      &>div{
        width: 50%;
        text-align: left;
        span:nth-child(1){
          color: #8C8C8C;
        }
      }
    }

  }
  .custPortrait {
    margin-top: 0.05rem;
    .custPortrait_title {
      display: flex;
      justify-content: space-between;
      .custPortrait_title_l,
      .custPortrait_title_r {
        display: flex;
        align-items: center;
      }
      .custPortrait_title_l {
        font-weight: 500;
        &>span {
          margin-left: 0.08rem;
        }
      }
      .custPortrait_title_r {
        font-size: 0.12rem;
        .btnAdd,
        .btnText {
          display: flex;
          align-items: center;
        }
        .btnAdd {
          padding: 0.03rem 0.08rem;
          background: #EDEFF2;
          border-radius: 0.04rem;
          &>span {
            color: #595959;
            margin-left: 0.04rem;
          }
        }
        .btnText {
          margin-left: 0.12rem;
          color: #8C8C8C;
          &>span {
            margin-right: 0.02rem;
          }
        }
      }
    }
    .custPortrait_main {
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      font-size: 0.11rem;
      // line-height: 0.18rem;
      color: #595959;
      text-align: left;
      transition: 0.3s;
      overflow: hidden;
      &>div{
        margin-top: 0.08rem;
      }
      .main_label {
        display: flex;
        justify-items: center;
      }
      .portraitIcon {
        .iconX {
          position: absolute;
          width: 0.095rem;
          height: 0.095rem;
          display: flex;
          align-items: center;
          justify-content: center;
          top: -0.0475rem;
          right: -0.0475rem;
          background: #E6F4FF;
          border-radius: 50%;
          box-shadow: 0px 1px 2px 0px #D4E0EF;
        }
      }
      .label,
      .labelD {
        display: inline-block;
        padding: 0.01rem 0.04rem;
        // font-size: 0.11rem;
        color: #026DFF;
        background: #E6F4FF;
        border-radius: 0.04rem 0 0.04rem 0;
        transition: 0.3s;
      }
      .label {
        margin: 0.04rem 0.04rem 0 0;
      }
      .labelD {
        position: relative;
        margin: 0.08rem 0.125rem 0 0;
      }
    }
  }
  .tabsList {
    margin-top: 0.12rem;
    &:deep(.tabs) {
      --van-tab-text-color: #8C8C8C;
      --van-tab-active-text-color: #026DFF;
      --van-tabs-bottom-bar-color: #026DFF;
      .van-tabs__nav {
        border-radius: 0.08rem 0.08rem 0 0;
        background: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
      }
      .van-tabs__content {
        margin-top: 0.12rem;
        // background: #fff;
        // border-radius: 0.08rem;
        // padding: 0.07rem 0.075rem;
      }
      .van-tabs__line {
        width: 0.6rem;
      }
    }
    .dividers {
      margin: 0 5%;
      height: 0.001rem;
      border-bottom: 0.02rem dashed #fff;
    }
  }
}
</style>