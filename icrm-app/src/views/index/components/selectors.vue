<template>
  <div class="selectors">
    <div :style="type == 0 ? btnStyle : {}" @click="clickThis(0)">{{title[0]}}</div>
    <div :style="type == 1 ? btnStyle : {}" @click="clickThis(1)">{{title[1]}}</div>
  </div>
</template>

<script>
export default {
  name: 'selectors',
  props: {
    title: {
      type: Array,
      default: ['选项1','选项2']
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

<style scoped>
.selectors {
  background: rgba(23,51,89,0.08);
  padding: 0.02rem;
  display: flex;
  justify-content: space-between;
  border-radius: 0.04rem;
}
.selectors > div {
  padding: 0.04rem 0.08rem;
  border-radius: 0.04rem;
}
</style>