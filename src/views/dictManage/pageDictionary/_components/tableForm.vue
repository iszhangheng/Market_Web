<template>
  <el-form class="form-container"
    size="mini"
    ref="postForm"
    :model="postForm"
    :rules="rules"
    label-width="100px">
    <el-row :gutter="10">
      <el-col :span="23">
         <el-form-item :label="this.$t('views.pageAddress')"
          prop="pageAddress">
          <el-input disabled  :placeholder="this.$t('dictionary.pageAddress')"
            v-model="postForm.pageAddress"></el-input>
        </el-form-item>
         <el-form-item :label="this.$t('views.pageName')"
          prop="pageName">
          <el-input :placeholder="this.$t('dictionary.pageName')"
            v-model="postForm.pageName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import dictionaryApi from '@/api/dictManage';
const defaultForm = {
  recordId: '',
  pageAddress: '',
  pageName: ''
};
export default {
  name: 'tableForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    mesg: {
      default: false
    }
  },
  watch: {
    mesg: 'init'
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      isLoading: false,
      selectData: [],
      rules: {
        // pageAddress: [
        //   { required: true, message: '请输入页面URL', trigger: 'blur' }
        // ],
         pageName: [
          { required: true, message: '请输入页面名称', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (this.isEdit) {
        dictionaryApi
          .pageList({})
          .then(res => {
            // 传值
            this.postForm.recordId = this.mesg.id;
            this.postForm.pageAddress = this.mesg.pageUrl;
            this.postForm.pageName = this.mesg.pageName;
          })
          .catch(err => {
            console.log(err);
            // this.$message.error('查询失败!');
          });
      } else {
        this.postForm = Object.assign({}, defaultForm);
      }
      this.$nextTick(() => {
        this.$refs['postForm'].clearValidate();
      });
    }
    // fetchData() {
    // }
  }
};
</script>
<style lang="scss">
.form-container {
  .flex-item .el-form-item__content{
    display: flex;
    align-items: flex-start;
  }
  .el-form-item__label {
    padding: 0 12px 0 0 !important;
    line-height: 28px !important;
  }
}
</style>
