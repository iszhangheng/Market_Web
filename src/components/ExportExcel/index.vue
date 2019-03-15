<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div>
    <!-- 文件名输入框  v-model:filename-->
    <!-- <label class="radio-label"
      style="padding-left:0;">Filename: </label>
    <el-input style='width:140px;'
      size="small"
      :placeholder="$t('excel.placeholder')"
      prefix-icon="el-icon-document"
      v-model="filename"></el-input> -->

    <!-- 宽度自适应  v-model:autoWidth-->
    <!-- <label class="radio-label">Cell Auto Width: </label>
    <el-radio-group size="small"
      v-model="autoWidth">
      <el-radio :label="true"
        border>True</el-radio>
      <el-radio :label="false"
        border>False</el-radio>
    </el-radio-group> -->
    <!-- 确定按钮 :click:handleDownload  :loading=downloadLoading -->
    <el-button type="primary"
      @click="handleDownload"
      :loading="downloadLoading">
      <svg-icon icon-class="export" /> {{$t('excel.export')}}</el-button>
  </div>
</template>

<script>
export default {
  name: 'exportExcel',
  props: ['columns', 'list'],
  data() {
    return {
      downloadLoading: false
      // filename: '',
      // autoWidth: true
    };
  },
  watch: {
    list() {
      this.exportExcel();
      // this.downloadLoading = false;
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true;
      this.$emit('initExcelList');
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [];
        const filterVal = [];
        this.columns.map(item => {
          tHeader.push(item.name);
          filterVal.push(item.prop);
        });
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'excel-list',
          autoWidth: true
        });
      });
      this.downloadLoading = false;
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    }
  }
};
</script>

<style>
/* .radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
} */
</style>

