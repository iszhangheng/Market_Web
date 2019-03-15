<template>
  <el-form class="form-container"
    label-position="top"
    :model="postForm"
    :rules="rules"
    size="mini"
    ref="postForm"
    label-width="80px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="名字"
          prop="name">
          <el-input v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
          prop="email">
          <el-input v-model="postForm.email"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="地址"
          prop="url">
          <el-input v-model="postForm.url"></el-input>
        </el-form-item>
        <el-form-item label="等级"
          prop="string">
          <el-input v-model="postForm.string"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { getInfo } from '@/api/table';

const defaultForm = {
  name: '',
  url: '',
  email: '',
  string: ''
};
export default {
  name: 'tableForm',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    mesgId: {
      type: String,
      default: false
    }
  },
  watch: {
    mesgId: 'fetchData'
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      if (this.isEdit) {
        getInfo({ _id: this.mesgId })
          .then(response => {
            this.postForm = response.data;
          })
          .catch(err => {
            console.log(err);
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