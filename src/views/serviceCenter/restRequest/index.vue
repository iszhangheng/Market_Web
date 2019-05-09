<template>
  <div class="tiny-container"
    style="hight:300px">
    <h3 class="page-title">请休假申请</h3>
    <!-- 请假表头 -->
    <el-form ref="form"
      class="leftHeader"
      :model="form"
      size="mini"
      label-width="120px">
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="单据号：">
            <el-input v-model="form.formId"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="申请日期：">
            <el-input v-model="form.requestDate"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="申请人：">
            <el-input v-model="form.employeeName"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="部门：">
            <el-input v-model="form.deptName"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="标题：">
            <el-input v-model="form.formTitle"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="休假类型：">
            <el-select v-model="form.restType"
              placeholder="请选择">
              <el-option v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item label="工作代理人：">
            <el-input v-model="form.replaceName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="联系电话：">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-form-item label="备注：">
            <el-input type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              size="mini"
              placeholder="请输入内容"
              v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-form-item prop="name"
            label="请假时间：">
            <el-date-picker v-model="form.date"
              type="daterange"
              align="center"
              unlink-panels
              @change="computeSumDay"
              :start-placeholder="this.$t('date.start')"
              :end-placeholder="this.$t('date.end')"
              :default-time="['00:00:00', '23:59:59']"
              value-format="timestamp"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总天数">
            <el-input v-model="form.sumDay"
              disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="primary"
              @click="onSubmit">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import serviceCenterApi from '@/api/serviceCenter';
import store from '@/store';
export default {
  name: 'pageAccess',
  data() {
    return {
      form: {
        formId: '', // 流程ID
        requestDate: '', // 请假日期
        employeeName: '', // 员工姓名
        deptName: '', // 部门名
        formTitle: '', // 标题
        replaceName: '', // 工作代理人
        phone: '', // 代理人电话
        remark: '', // 备注
        date: [], // 请假时间段
        sumDay: '', // 总天数
        restType: '' // 请假类型
      },
      options: [
        {
          value: '事假',
          label: '事假'
        },
        {
          value: '病假',
          label: '病假'
        },
        {
          value: '婚假',
          label: '婚假'
        },
        {
          value: '看护假',
          label: '看护假'
        },
        {
          value: '丧假',
          label: '丧假'
        }
      ],
      value: ''
    };
  },
  created() {
    this.initForm();
  },
  methods: {
    init() {
      // 查询表格信息
      this.listLoading = true;
      const data = {
        formId: this.form.formId,
        requestDate: this.form.requestDate,
        employeeId: store.getters.authId,
        employeeName: this.form.employeeName,
        deptName: this.form.deptName,
        formTitle: this.form.formTitle,
        replaceName: this.form.replaceName,
        phone: this.form.phone,
        remark: this.form.remark,
        startDate: this.form.date[0] + '',
        endDate: this.form.date[1] + '',
        restType: this.form.restType,
        state: '待审批'
      };
      serviceCenterApi
        .addRestInfo(data)
        .then(res => {
          if (res.robj.addStatus) {
            this.$message.success('保存成功!');
          }
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
        });
    },
    // 保存请假单
    onSubmit() {
      this.init();
      this.initForm();
    },
    computeSumDay() {
      if (this.form.date != null) {
        this.form.sumDay = Math.round(
          (this.form.date[1] - this.form.date[0]) / (3600 * 1000 * 24)
        );
      } else {
        this.form.sumDay = 0;
      }
    },
    initForm() {
      var myDate = new Date();
      this.form.formId = 'QXJ' + myDate.getTime();
      this.form.requestDate = this.myFormatDate(myDate);
      this.form.employeeName = store.getters.name;
      this.form.deptName = store.getters.deptName;
      this.form.formTitle = store.getters.name + '的请假流程';
      this.form.replaceName = '';
      this.form.phone = '';
      this.form.remark = '';
      this.form.sumDay = 1;
      this.form.restType = '事假';
      this.form.date = [
        new Date().setTime(new Date()),
        new Date().setTime(new Date().getTime() + 3600 * 1000 * 24 * 1)
      ];
    },
    myFormatDate(date) {
      var strDate = date.getFullYear() + '-';
      const month = date.getMonth() + 1;
      strDate += (month < 10 ? '0' + month : month) + '-';
      const day = date.getDate();
      strDate += day < 10 ? '0' + day : day;
      return strDate;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

