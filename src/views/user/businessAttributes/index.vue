<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.businessAttributes')}}</h3>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间查询 -->
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
    </el-form>
    <div class="uba-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="this.$t('business.cardNum')"
          name="first">
          <cardnum-user v-if="activeName === 'first'"
            ref="cardNumChild"
            :date="datePop"></cardnum-user>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('business.bankNum')"
          name="second">
          <banknum-user v-if="activeName === 'second'"
            ref="bankNumChild"
            :date="datePop"></banknum-user>
        </el-tab-pane>
        <!-- <el-tab-pane :label="this.$t('business.message')"
          name="third">
          <user-info-business v-if="activeName === 'third'"
            ref="userInfoChild"
            :date="datePop"></user-info-business>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import banknumUser from './banknumUser/index';
import cardnumUser from './cardnumUser/index';
import userInfoBusiness from './userInfoBusiness/index';
import mixin from '@/utils/mixin';
import userApi from '@/api/user';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'businessAttributes',
  mixins: [mixin],
  components: { cardnumUser, banknumUser, userInfoBusiness, ExportExcel },
  data() {
    return {
      columns: [],
      listExcel: [],
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      datePop: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      activeName: 'first'
    };
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
      }
    },
    initExcelList() {
      // 导出数据请求
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      if (this.activeName === 'first') {
        this.columns = this.$refs.cardNumChild.columns;
        userApi
          .cardnumUser(data)
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
        this.columns = this.$refs.bankNumChild.columns;
        userApi
          .bankUserInfo(data)
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
      if (this.activeName === 'third') {
        this.columns = this.$refs.userInfoChild.columns;
        userApi
          .userInfo(data)
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
    }
  }
};
</script>
