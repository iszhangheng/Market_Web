<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.userAttributes')}}</h3>
    <!-- 时间选择 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <el-form-item prop="name"
        :label="this.$t('views.dateType')">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
      <!-- 查询按钮 -->
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
      <!-- 导出模块 -->
      <el-form-item label="">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns='columns'
          :list='listExcel'
          @initExcelList='initExcelList'></export-excel>
      </el-form-item>
      <!-- 上传文件 -->
      <!-- <el-form-item label="">
        <el-upload class="upload-demo"
          ref="upload"
          action="flow=uploadExcel"
          :limit="1"
          :file-list="fileList"
          :before-upload="beforeUpload">
          <el-button slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <div slot="tip"
            class="el-upload__tip">只能上传excel文件，且不超过5MB</div>
        </el-upload>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到后端</el-button>
      </el-form-item> -->
      <!-- <el-form-item label=""  v-if="activeName === 'first'">
        <upload-excel-component @on-selected-file='selected'></upload-excel-component>
      </el-form-item> -->
      <!-- <el-form-item label=""  v-if="activeName === 'first'">
         <egrid border
          style="width: 100%;margin-top:20px;"
          :column-key-map="{ label: 'name' }"
          :data="tableData"
          :columns="tableHeader">
        </egrid>
      </el-form-item> -->
    </el-form>
    <!-- 地区选择 -->
    <el-form class="search-form"
      v-if="activeName === 'third' || activeName === 'seventh'"
      size="mini">
      <el-form-item :label="this.$t('date.area')">
        <v-distpicker class="el-area"
          name="Area"
          @province="onChangeProvince"
          @city="onChangeCity"
          @area="onChangeArea">
        </v-distpicker>
      </el-form-item>
    </el-form>
    <!-- 标签页 -->
    <div class="uba-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="this.$t('user.sex')"
          name="first">
          <reg-sex v-if="activeName === 'first'"
            ref="sexChild"
            :date="datePop"></reg-sex>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('user.age')"
          name="second">
          <reg-age v-if="activeName === 'second'"
            ref="ageChild"
            :date="datePop"></reg-age>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('user.area')"
          name="third">
          <reg-area v-if="activeName === 'third'"
            ref="areaChild"
            :condition="infomation"
            :date="datePop"></reg-area>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('user.channel')"
          name="fourth">
          <reg-channel v-if="activeName === 'fourth'"
            ref="channelChild"
            :date="datePop"></reg-channel>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('user.login')"
          name="fifth">
          <reg-login v-if="activeName === 'fifth'"
            ref="loginChild"
            :date="datePop"></reg-login>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('user.avgTime')"
          name="sixth">
          <reg-avg-time v-if="activeName === 'sixth'"
            ref="avgTimeChild"
            :date="datePop"></reg-avg-time>
        </el-tab-pane>
        <!-- <el-tab-pane :label="this.$t('user.mobileArea')"
          name="seventh">
          <reg-mobile-area v-if="activeName === 'seventh'"
            ref="mobileAreaChild"
            :date="datePop"></reg-mobile-area>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import regSex from './regSex/index';
import regAge from './regAge/index';
import regArea from './regArea/index';
import regChannel from './regChannel/index';
import regLogin from './regLogin/index';
import regAvgTime from './regAvgTime/index';
// import regMobileArea from './regMobileArea/index';
import mixin from '@/utils/mixin';
import VDistpicker from 'v-distpicker';
// import UploadExcelComponent from '@/components/UploadExcel/index.vue';
import userApi from '@/api/user';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'attributes',
  mixins: [mixin],
  components: {
    regSex,
    regAge,
    regArea,
    regChannel,
    regAvgTime,
    regLogin,
    // regMobileArea,
    VDistpicker,
    ExportExcel
    // UploadExcelComponent
  },
  data() {
    return {
      listExcel: [],
      columns: [],
      // tableData: [],
      // tableHeader: [],
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      datePop: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      activeName: 'first',
      condition: {
        dataProvince: '',
        dataCity: '',
        dataArea: ''
      },
      infomation: {
        dataProvince: '',
        dataCity: '',
        dataArea: ''
      }
    };
  },
  computed: {
    verify() {
      return JSON.stringify(this.condition);
    }
  },
  methods: {
    query() {
      if (this.activeName === 'first') {
        this.datePop = this.date;
      }
      if (this.activeName === 'second') {
        this.datePop = this.date;
      }
      if (this.activeName === 'third') {
        this.datePop = this.date;
        this.infomation = this.condition;
      }
      if (this.activeName === 'fourth') {
        this.datePop = this.date;
      }
      if (this.activeName === 'fifth') {
        this.datePop = this.date;
      }
      if (this.activeName === 'sixth') {
        this.datePop = this.date;
      }
      // if (this.activeName === 'seventh') {
      //   this.datePop = this.date;
      // }
    },
    initExcelList() {
      // 导出数据请求
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      if (this.activeName === 'first') {
        this.columns = this.$refs.sexChild.columns;
        userApi
          .registerSex(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'second') {
        this.columns = this.$refs.ageChild.columns;
        userApi
          .registerAge(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = this.$refs.ageChild.list;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'third') {
        this.columns = this.$refs.areaChild.columns;
        userApi
          .registAreaUser(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'fourth') {
        this.columns = this.$refs.channelChild.columns;
        userApi
          .userChannel(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = this.$refs.channelChild.list;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'fifth') {
        this.columns = this.$refs.loginChild.columns;
        userApi
          .userLogin(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'sixth') {
        this.columns = this.$refs.avgTimeChild.columns;
        userApi
          .registerAvgTime(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
    },
    // beforeUpload(file) {
    //   debugger;
    //   console.log(file, '文件');
    //   this.files = file;
    //   const extension = file.name.split('.')[1] === 'xls';
    //   const extension2 = file.name.split('.')[1] === 'xlsx';
    //   const isLt2M = file.size / 1024 / 1024 < 5;
    //   if (!extension && !extension2) {
    //     this.$message.warning('上传模板只能是 xls、xlsx格式!');
    //     return;
    //   }
    //   if (!isLt2M) {
    //     this.$message.warning('上传模板大小不能超过 5MB!');
    //     return;
    //   }
    //   this.fileName = file.name;
    //   return false;
    // },
    // submitUpload() {
    //   debugger;
    //   console.log('上传' + this.files.name);
    //   if (this.fileName === '') {
    //     this.$message.warning('请选择要上传的文件！');
    //     return false;
    //   }
    //   const fileFormData = new FormData();
    //   fileFormData.append('file', this.files, this.fileName);
    //   const requestConfig = {
    //     headers: {
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   };
    //   this.$http
    //     .post(
    //       `10.25.0.170:8000/api/user_info.tml?flow=uploadExcel` + this.company,
    //       fileFormData,
    //       requestConfig
    //     )
    //     .then(res => {
    //       debugger;
    //       if (data && data.code === 0) {
    //         this.$message({
    //           message: '操作成功',
    //           type: 'success',
    //           duration: 1500,
    //           onClose: () => {
    //             this.visible = false;
    //             this.$emit('refreshDataList');
    //           }
    //         });
    //       } else {
    //         this.$message.error(data.msg);
    //       }
    //     });
    // },
    // selected(data) {
    //   this.tableData = data.results;
    //   this.tableHeader = data.header.map(item => {
    //     const rObj = {
    //       name: item,
    //       prop: item
    //     };
    //     return rObj;
    //   });
    //   console.log(this.tableData);
    //   console.log(this.tableHeader);
    // },
    onChangeProvince(data) {
      this.condition.dataProvince = data.value;
    },
    onChangeCity(data) {
      this.condition.dataCity = data.value;
    },
    onChangeArea(data) {
      this.condition.dataArea = data.value;
    }
  }
};
</script>
<style lang="scss">
// ...
.el-area {
  select {
    font-size: 12px;
    padding: 0 5px;
    height: 28px !important;
    line-height: 28px !important;
  }
}
</style>