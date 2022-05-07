<template>
  <div class="Table">
    <table border="0" cellspacing="0" cellpadding="0" width="100%">
      <!-- 表头 -->
      <tr height="32">
        <th v-for="item in listLabel" :key="item" :align="item.align">{{ item.label }}</th>
      </tr>
      <tr v-for="item in listData" :key="item.name" height="32">
        <td align="left" valign="middle">{{item.name}}</td>
        <td align="right" valign="middle">{{item.a}}</td>
        <td align="right" valign="middle">{{item.b}}</td>
        <td align="right" valign="middle">{{item.c}}</td>
        <td align="right" valign="middle">{{item.d}}</td>
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
  },
  data() {
    return {};
  },

  methods: {
    numFliter(value, tip) {
      if (value == undefined) {
        return "0";
      }
      let n = value.toString().split(".");
      let z = /\d{1,3}(?=(\d{3})+$)/g;
      let b = Number(value) > 0 && tip ? "+" : "";
      if (value.toString().indexOf(".") >= 0) {
        return `${b}${n[0].replace(z, "$&,")}.${n[1]}`;
      } else {
        return `${b}${value.toString().replace(z, "$&,")}`;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.Table {
  font-size: 0.12rem;
  width: 3.27rem;
  overflow-x:scroll;
  &:deep(table) {
    th, td{
      border-bottom: 0.005rem solid rgba(0,0,0,0.08);
    }
  }
}
</style>