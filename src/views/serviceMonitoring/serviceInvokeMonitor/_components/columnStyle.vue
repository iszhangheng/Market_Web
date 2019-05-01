<template>
  <div>
    <el-tag v-if="col.prop === 'total'"
      size="small"
      type="info">{{val}}</el-tag>
    <el-tag v-if="col.prop === 'success'"
      size="small"
      type="success">{{val}}</el-tag>
    <el-tag v-if="col.prop === 'successRate'"
      size="small">{{val}}</el-tag>
    <el-tag v-if="col.prop === 'fail' && row.serviceName !== '前置调用'"
      type="danger"
      size="small">{{val}}</el-tag>
    <el-tag
      style="cursor:pointer;"
      v-else-if="col.prop === 'fail' && row.serviceName === '前置调用'"
      type="danger"
      size="small"
      round
      @click.native="clickTo">
      {{val}}
    </el-tag>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'val'],
  data() {
    return {};
  },
  methods: {
    clickTo() {
      // 使用路由跳转到任意页面
      this.$router.push({
        // 地址
        path: 'service-error-info',
        // 参数
        query: {
          // 将yyyymmdd转化成yyyy-mm-dd形式
          date: this.row.invokeDay.replace(
            /^(\d{4})(\d{2})(\d{2})$/,
            '$1-$2-$3'
          ),
          name: this.row.serviceName
        }
      });
    }
  }
};
</script>

