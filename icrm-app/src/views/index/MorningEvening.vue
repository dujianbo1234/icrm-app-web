<template>
  <div class="MorningEvening">
    <!-- 顶部title -->
    <nav-bar type="2" title="晨夕会" leftIcon />
    <!-- 日历 -->
    <div class="calendar"></div>
  </div>
</template>

<script>
export default {
  name: 'MorningEvening',
  data() {
    return {};
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.MorningEvening {
  .calendar {
    height: 0.45rem;
    background: pink;
  }
}
</style>