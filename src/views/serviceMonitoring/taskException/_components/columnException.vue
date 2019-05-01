<template>
  <div>
    <!-- <span style="color:#20A0FF">{{row[col.prop]}}</span><br/> -->
    <span>{{newValue}}&nbsp;&nbsp;&nbsp;&nbsp;<el-button @click="dialogVisible = true"
        size="mini"
        icon="el-icon-search"
        circle></el-button></span>
    <el-dialog :title="this.$t('views.exception')"
      :visible.sync="dialogVisible"
      width="60%">
      <div class="content"
        v-html="detailVal"></div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary" size="small"
          @click="dialogVisible = false">{{this.$t('table.confirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ['row', 'col', 'column', 'val'],
  data() {
    return {
      dialogVisible: false
    };
  },
  computed: {
    detailVal() {
      // console.log(JSON.stringify(this.val));
      let result = JSON.stringify(this.val);
      result = result.replace(/\\r\\n\\t/g, '<br/>');
      result = result.replace(/\\r\\n/g, '<br/>');
      result = result.replace(/\\n\\t/g, '<br/>');
      return result;
    },
    newValue() {
      return this.val.substr(0, 20) + ' ...';
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 400px;
  padding: 0 20px;
  overflow: auto;
}
</style>
