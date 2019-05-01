<template>
  <el-form class="form-container"
    size="mini"
    ref="postForm"
    :model="postForm"
    :rules="rules"
    label-width="100px">
    <el-row :gutter="10">
      <el-col :span="23">
        <el-form-item v-if="!isEdit" :label="this.$t('views.LegaPpersonCode')"
          prop="LegaPpersonCode">
          <el-input :placeholder="this.$t('dictionary.LegaPpersonCode')"
            v-model="postForm.LegaPpersonCode"></el-input>
        </el-form-item>
         <el-form-item :label="this.$t('views.bankCode')"
          prop="bankCode">
          <el-input :placeholder="this.$t('dictionary.bankCode')"
            v-model="postForm.bankCode"></el-input>
        </el-form-item>
         <el-form-item :label="this.$t('views.bankName')"
          prop="bankName">
          <el-input :placeholder="this.$t('dictionary.bankName')"
            v-model="postForm.bankName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import dictionaryApi from '@/api/dictManage';
const defaultForm = {
  LegaPpersonCode: '',
  bankCode: '',
  bankName: ''
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
      rules: {
        LegaPpersonCode: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 6, message: '最大长度为6个字符', trigger: 'blur' }
        ],
         bankCode: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
         bankName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.isEdit) {
        dictionaryApi
          .bankList({})
          .then(res => {
            // 传值
            this.postForm.LegaPpersonCode = this.mesg.trcorp;
            this.postForm.bankCode = this.mesg.bkcode;
            this.postForm.bankName = this.mesg.bkname;
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
