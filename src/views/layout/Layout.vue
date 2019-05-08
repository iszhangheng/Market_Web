<template>
  <div class="tiny-wrap"
    :class="{hideSidebar:!sidebar.opened}">
    <div class="tiny-sidebar">
      <div class="tiny-logo">
        <router-link to="/">
          <img class="logo-max"
            v-if="sidebar.opened"
            src="../../assets/images/sunline_logo.png">
          <img class="logo-mini"
            v-else
            src="../../assets/images/sunline_logo_mini.png">
        </router-link>
      </div>
      <sidebar class="sidebar-container"></sidebar>
    </div>
    <div class="tiny-layout">
      <app-header @updatePassword="openForm"></app-header>
      <app-main class="tiny-layout-content"></app-main>
      <div class="tiny-layout-footer"></div>
    </div>
    <div>
      <el-dialog title="修改密码"
        :before-close="removeData"
        :visible.sync="dialogFormVisible">
        <el-form model="form"
          size="mini"
          label-position="right"
          label-suffix="：">
          <el-row>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="18">
              <el-form-item label="原密码"
                :label-width="formLabelWidth">
                <el-input v-model="form.originalPassword"
                  maxlength="15"
                  clearable="true"
                  show-password
                  autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="18">
              <el-form-item label="新密码"
                :label-width="formLabelWidth">
                <el-input v-model="form.newPassword"
                  maxlength="15"
                  clearable="true"
                  show-password
                  autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="18">
              <el-form-item label="验证密码"
                :label-width="formLabelWidth">
                <el-input v-model="form.checkPassword"
                  maxlength="15"
                  clearable="true"
                  show-password
                  autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="removeData">取 消</el-button>
          <el-button type="primary"
            @click="submitForm">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, AppHeader } from '@/views/layout/components';
import { updatePwd } from '@/api/login';
export default {
  name: 'layout',
  components: {
    Sidebar,
    AppMain,
    AppHeader
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        originalPassword: '',
        newPassword: '',
        checkPassword: ''
      },
      formLabelWidth: '100px'
    };
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    submitForm() {
      const data = {
        originalPassword: this.form.originalPassword,
        newPassword: this.form.newPassword
      };
      updatePwd(data)
        .then(res => {
          if (res.robj.updateStatus) {
            this.$message.success(res.robj.msg);
          } else {
            this.$message.error(res.robj.msg);
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
      this.removeData();
    },
    openForm() {
      this.dialogFormVisible = true;
    },
    removeData() {
      this.form.originalPassword = '';
      this.form.newPassword = '';
      this.form.checkPassword = '';
      this.dialogFormVisible = false;
    }
  }
};
</script>
