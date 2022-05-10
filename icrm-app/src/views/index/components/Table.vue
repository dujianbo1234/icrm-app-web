<template>
  <div class="Table">
    <table border="0" cellspacing="0" cellpadding="0">
      <!-- 表头 -->
      <tr height="32">
        <th v-for="item in listLabel" :key="item" :align="item.align">{{ item.label }}</th>
      </tr>
      <tr v-for="item in listData" :key="item.name" height="32">
        <td align="left" valign="middle">{{item.name}}</td>
        <td align="right" valign="middle" v-for="name in listArr" :key="name">
          <span class="textS">
            <span :style="{'color' : (item[name] > 0 && name != 'a') ? '#FF3A3A' : (item[name] < 0 ? ' #37CD37' : '#595959')}">{{numFliter(item[name], name != 'a')}}</span>
            <template v-if="name != 'a'">
              <!-- 上升 -->
              <van-icon :name="require('@/assets/image/index_arrow_top.png')" size="0.16rem" v-if="item[name] > 0"/>
              <!-- 下降icon -->
              <van-icon :name="require('@/assets/image/index_main_numDown.png')" size="0.16rem" v-else-if="item[name] < 0"/>
              <!-- 无数据 -->
              <van-icon :name="require('@/assets/image/index_main_numLine.png')" size="0.16rem" v-else/>
            </template>
          </span>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    listLabel: Array,
    listData: Array,
    listType: Number
  },
  data() {
    return {
      listArr: ['a','b','c','d']
    };
  },
  watch: {
    listType(n, l){
      if(n == 1){
        this.listArr = ['a','b','c']
      }else{
        this.listArr = ['a','b','c', 'd']
      }
    }
  },
  methods: {
    numFliter(value, tip){
      if(value == undefined){
        return '0'
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
  overflow-x: scroll;
  &:deep(table) {
    min-width: 4.27rem;
    th, td{
      word-break: keep-all;
      word-wrap:break-word;
      border-bottom: 0.005rem solid rgba(0,0,0,0.08);
      .textS {
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>