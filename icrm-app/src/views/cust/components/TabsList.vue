<template>
  <!-- 客户视图-产品信息列表 -->
  <div class="tabsLists">
    <van-tabs class="tabss" v-model:active="active">
      <van-tab :title="item.name" :disabled="item.disabled" v-for="(item, index) in setList" :key="index">
        <el-table size="small" :data="item.list" fit :header-row-style="headerStyle">
            <el-table-column :prop="i.key" :label="i.label" :fixed="i.fixed" :show-overflow-tooltip="i.tooltip" :align="i.align || 'center'" :width="i.width" v-for="(i, iIindex) in item.label" :key="iIindex">
              <template  #default="scope">
                {{scope.row[i.key] || scope.row[i.key] == 0 ? scope.row[i.key] : '-'}}
              </template>
            </el-table-column>
        </el-table>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  props: {
    setList: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      headerStyle: {
        'font-size': '0.12rem',
        'font-family': 'PingFangSC-Medium, PingFang SC',
        'color': '#595959'
      },
      active: "0"
    };
  },
  methods: {}
};
</script>

<style lang="less" scoped>
  .tabsLists {
    .tabss {
      --van-tab-text-color: #8C8C8C;
      --van-tab-active-text-color: #026DFF;
      --van-tabs-bottom-bar-color: #026DFF;
      &:deep(.van-tabs__content) {
        margin-top: 0.12rem;
      }
      &:deep(.van-tabs__line) {
        width: 0.6rem;
      }
      &:deep(.van-tabs__nav) {
        border-radius: 0 !important;
      }
    }
  }
</style>