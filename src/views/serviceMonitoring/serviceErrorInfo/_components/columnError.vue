<template>
  <div>
    <el-button @click="getMsg"
        size="small"
        type="text"
        circle>{{this.$t('views.checkMsg')}}</el-button>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  data() {
    return {};
  },
  methods: {
    getMsg() {
      this.$emit('get-msg', this.val);
    }
  }
};
</script>