<template>
  <div>
    <el-button @click="getMesg()"
      size="small"
      type="text"
      circle>{{this.$t('views.checkLog')}}</el-button>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  data() {
    return {};
  },
  methods: {
    getMesg() {
      this.$emit('get-logs', this.val);
    }
  }
};
</script>

