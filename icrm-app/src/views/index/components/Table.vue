<template>
  <div class="Table">
    <table border="0" cellspacing="0" cellpadding="0">
      <div class="left">
        <!-- 表头 -->
        <tr height="32" valign="middle">
          <template v-for="(item,index) in listLabel">
            <th :align="item.align" :key="item" v-if="index == 0">
              <span class="text">{{ item.label }}</span>
            </th>
          </template>
        </tr>
        <!-- 第一列 -->
        <tr v-for="item in listData" :key="item.name" height="32">
          <td align="left" valign="middle">
            <span class="text">{{ item.name }}</span>
          </td>
        </tr>
      </div>
      <div ref="right" class="right">
        <div class="text">
          <!-- 表头 -->
          <tr height="32" valign="middle">
            <template v-for="(item,index) in listLabel">
              <th :align="item.align" :key="item" v-if="index > 0"><span class="content">{{ item.label }}</span></th>
            </template>
          </tr>
          <!-- 除第一列 -->
          <tr v-for="item in listData" :key="item.name" height="32">
            <td align="right" valign="middle" v-for="name in lableArr" :key="name">
              <span class="textS">
                <span class="content" :style="{'color' : (item[name] > 0 && name != 'a') ? '#FF3A3A' : (item[name] < 0 ? ' #37CD37' : '#595959')}">{{numFliter(item[name], name != 'a')}}</span>
                <template v-if="name != 'a'">
                  <van-icon :name="require('@/assets/image/index_arrow_top.png')" size="0.16rem" v-if="item[name] > 0"/>
                  <van-icon :name="require('@/assets/image/index_arrow_dowm.png')" size="0.16rem" v-else-if="item[name] < 0"/>
                  <van-icon :name="require('@/assets/image/index_main_numLine.png')" size="0.16rem" v-else/>
                </template>
              </span>
            </td>
          </tr>
        </div>
      </div>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    listLabel: Array,
    listData: Array,
    listType: Number,
    lableArr: Array
  },
  data() {
    return {
      listArr: ['a','b','c','d']
    };
  },
  watch: {
    listType(n, l){
      // if(n == 1){
      //   this.listArr = ['a','b','c']
      // }else{
      //   this.listArr = ['a','b','c', 'd']
      // }
      this.$refs['right'].scrollLeft = 0
    }
  },
  methods: {
    numFliter(value, tip){
      if(value == undefined){
        return '0.00'
      }
      value = (Number(value)/10000).toFixed(2)
      let n = value.toString().split('.')
      let z = /\d{1,3}(?=(\d{3})+$)/g
      let b = Number(value) > 0 && tip ? '+' : ''
      if(value.toString().indexOf('.') >= 0){
        return `${b}${n[0].replace(z, '$&,')}.${n[1]}`
      }else{
        return `${b}${value.toString().replace(z, '$&,')}`
      }
    },
  },
};
</script>
<style lang="less" scoped>
.Table {
  font-size: 0.12rem;
  width: 3.27rem;
  &:deep(table) {
    display: flex;
    .left {
      width: 24%;
      box-shadow: 0.05rem 0.05rem 0.1rem rgba(125, 123, 123, 0.1);
      th, th {
        min-width: 0.8rem;
      }
    }
    .right {
      width: 76%;
      overflow-x: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      .content {
        min-width: 0.75rem;
      }
    }
    th, td{
      word-break: keep-all;
      word-wrap:break-word;
      border-bottom: 0.005rem solid rgba(0,0,0,0.08);
      .textS {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>