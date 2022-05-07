<template>
  <div class="selectors">
    <div :class="['padding_8','padding_15'][typeP]" :style="type == 0 ? btnStyle : {}" @click="clickThis(0)">{{title[0]}}</div>
    <div :class="['padding_8','padding_15'][typeP]" :style="type == 1 ? btnStyle : {}" @click="clickThis(1)">{{title[1]}}</div>
  </div>
</template>

<script>
export default {
  name: 'selectors',
  props: {
    title: {
      type: Array,
      default: ['选项1','选项2']
    },
    typeP: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      btnStyle: {
        'background': '#fff',
        'color': '#026DFF'
      },
      type: 0
    }
  },
  methods: {
    clickThis(type){
      this.type = type
      this.$emit('change', type)
    }
  }
};
</script>
<style lang="less" scoped>
.selectors {
  background: rgba(23,51,89,0.08);
  padding: 0.02rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.04rem;
  &>div {
    border-radius: 0.04rem;
  }
  .padding_8 {
    padding: 0.04rem 0.08rem;
  }
  .padding_15 {
    padding: 0.04rem 0.15rem;
  }
}
</style>