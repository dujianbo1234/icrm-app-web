<template>
  <!-- 客户视图 -->
  <div class="clCustomerView">
    <!-- 顶部title -->
    <nav-bar title="客户视图" type="2" leftIcon :rightText="$store.state.userMsg.roleId != '00000004' ? '客户拜访' : ''" rightColor="rgba(2, 109, 255, 1)"/>
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
          <van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12"/>
        </div>
        <div class="textContent" style="padding-top: 0.07rem;">
          <span class="title">详细地址</span>
          <span class="textStyle">{{custBase.famAddr || '-'}}</span>
          <van-icon class="icon" :name="require(`@/assets/image/cust_edit.png`)" size="12"/>
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
          <span class="btnAdd">
            <van-icon name="plus" size="10" color="#8C8C8C"/>
            <span>自定义标签</span>
          </span>
          <span class="btnText" @click="portraitbtn = !portraitbtn">
            <span>{{portraitbtn ? '展开' : '收起'}}</span>
            <van-icon :name="portraitbtn ? 'arrow-down' : 'arrow-up'" size="14" color="#8C8C8C"/>
          </span>
        </div>
      </div>
      <div class="custPortrait_main" :style="{'min-height': portraitbtn ? '0.1rem' : '3rem'}">
        <div v-if="portraitbtn">
          <div>基本属性：</div>
          <div class="label">开户1年-3年</div>
          <div class="label">男</div>
          <div class="label">35岁-45岁</div>
          <div class="label">35岁</div>
          <div class="label">35岁-45岁</div>
          <div class="label">35岁-45岁</div>
        </div>
        <div style="width: 100%;height: 100%; background: yellow;" v-else></div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  queryCustBaseInfo,
  queryCustTagInfo
} from "@/request/custinfo.js"
export default {
  name: "clCustomerView",
  data() {
    return {
      activeNames: ['1'],
      custBase: {},
      assetInfo: {},
      portraitbtn: true
    };
  },
  created(){
    this.queryCustInfo(this.$route.query.custNum)
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
        // console.log('基础信息',this.custBase)
      })
    },
    /* 客户标签信息查询 */
    queryCustTag(custNum){
      let body = {
        custNum: custNum
      }
      queryCustTagInfo(body,res => {
        console.log('标签信息',res)
      })
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
  .card {
    background: #fff;
    padding: 0.07rem 0.075rem;
    border-radius: 0.08rem;
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
      .label {
        display: inline-block;
        padding: 0.01rem 0.04rem;
        margin: 0.04rem 0.04rem 0 0;
        // font-size: 0.11rem;
        color: #026DFF;
        background: #E6F4FF;
        border-radius: 0.04rem 0 0.04rem 0;
      }
    }
  }
}
</style>