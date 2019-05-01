<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.accountService')}}</h3>
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
    </el-form>
    <!-- 地区选择 -->
    <el-form class="search-form"
      v-if="activeName === 'third' || activeName === 'sixth'"
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
    <el-form class="search-form"
      v-if="activeName === 'fifth' || activeName === 'sixth'"
      :inline="true"
      size="mini">
      <!-- 用户相关查询框 -->
      <el-form-item :label="this.$t('depositsToBuy.userPhone')"
        prop="name">
        <el-input v-model="userPhone"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.userPhone')"
          clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$t('views.userName')"
        prop="name">
        <el-input v-model="userName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.userName')"
          clearable></el-input>
      </el-form-item>
    </el-form>
    <el-form class="search-form"
      v-if="activeName === 'fourth' || activeName === 'sixth'"
      :inline="true"
      size="mini">
      <!-- 银行相关查询框 -->
      <el-form-item :label="this.$t('views.LegalPersonCode')"
        prop="name">
        <el-input v-model="LegalPersonCode"
          @keyup.enter.native="query()"
          :placeholder="this.$t('please.LegalPersonCode')"
          clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$t('views.bankCode')"
        prop="name">
        <el-input v-model="bankCode"
          @keyup.enter.native="query()"
          :placeholder="this.$t('dictionary.bankCode')"
          clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$t('views.bankName')"
        prop="name">
        <el-input v-model="bankName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('dictionary.bankName')"
          clearable></el-input>
      </el-form-item>
    </el-form>
    <el-form class="search-form"
      v-if="activeName === 'second' || activeName === 'sixth'"
      :inline="true"
      size='mini'>
      <!-- 渠道选择 -->
      <el-form-item :label="this.$t('views.channel')"
        prop="name">
        <el-select v-model="channelObj.name"
          clearable
          placeholder="请选择渠道">
          <el-option v-for="item in channelObj.list"
            :key="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 标签页 -->
    <div class="uba-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="this.$t('accountService.platform')"
          name="first">
          <platform v-if="activeName === 'first'"
            ref="platformChild"
            :date="datePop"></platform>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('accountService.channel')"
          name="second">
          <channel v-if="activeName === 'second'"
            ref="channelChild"
            :name="name"
            :date="datePop"></channel>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('accountService.location')"
          name="third">
          <location v-if="activeName === 'third'"
            ref="locationChild"
            :condition="infomation"
            :date="datePop"></location>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('accountService.bank')"
          name="fourth">
          <bank v-if="activeName === 'fourth'"
            ref="bankChild"
            :bkCode="bkCode"
            :bkName="bkName"
            :lpCode="lpCode"
            :date="datePop"></bank>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('accountService.user')"
          name="fifth">
          <user v-if="activeName === 'fifth'"
            ref="userChild"
            :usName="usName"
            :mobile="mobile"
            :date="datePop"></user>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('accountService.gather')"
          name="sixth">
          <gather v-if="activeName === 'sixth'"
            ref="gatherChild"
            :usName="usName"
            :mobile="mobile"
            :bkCode="bkCode"
            :bkName="bkName"
            :lpCode="lpCode"
            :name="name"
            :condition="infomation"
            :date="datePop"></gather>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import serviceApi from '@/api/service';
import productApi from '@/api/product';
import platform from './platform/index';
import channel from './channel/index';
import location from './location/index';
import bank from './bank/index';
import user from './user/index';
import gather from './gather/index';
import mixin from '@/utils/mixin';
import VDistpicker from 'v-distpicker';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'accountService',
  mixins: [mixin],
  components: {
    platform,
    channel,
    location,
    bank,
    user,
    gather,
    VDistpicker,
    ExportExcel
  },
  data() {
    return {
      listExcel: [],
      columns: [],
      userPhone: '',
      userName: '',
      LegalPersonCode: '',
      bankCode: '',
      bankName: '',
      channelObj: {
        list: [],
        name: ''
      },
      name: '',
      lpCode: '',
      bkCode: '',
      bkName: '',
      mobile: '',
      usName: '',
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
  mounted() {
    const data = {
      codeType: 'channel'
    };
    productApi
      .channelChange(data)
      .then(res => {
        this.channelObj.list = [];
        res.robj.items.map(item => {
          this.channelObj.list.push(item.codename);
        });
      })
      .catch(res => {
        this.$message.error('数据请求失败!');
      });
  },
  methods: {
    query() {
      if (this.activeName === 'first') {
        this.datePop = this.date;
      }
      if (this.activeName === 'second') {
        this.datePop = this.date;
        this.name = this.channelObj.name;
      }
      if (this.activeName === 'third') {
        this.datePop = this.date;
        // this.name = this.channelObj.name;
        this.infomation = this.condition;
      }
      if (this.activeName === 'fourth') {
        this.datePop = this.date;
        // this.name = this.channelObj.name;
        // this.infomation = this.condition;
        this.lpCode = this.LegalPersonCode;
        this.bkCode = this.bankCode;
        this.bkName = this.bankName;
      }
      if (this.activeName === 'fifth') {
        this.datePop = this.date;
        // this.name = this.channelObj.name;
        // this.infomation = this.condition;
        // this.lpCode = this.LegalPersonCode;
        // this.bkCode = this.bankCode;
        // this.bkName = this.bankName;
        this.mobile = this.userPhone;
        this.usName = this.userName;
      }
      if (this.activeName === 'sixth') {
        this.datePop = this.date;
        this.name = this.channelObj.name;
        this.infomation = this.condition;
        this.lpCode = this.LegalPersonCode;
        this.bkCode = this.bankCode;
        this.bkName = this.bankName;
        this.mobile = this.userPhone;
        this.usName = this.userName;
      }
    },
    initExcelList() {
      // 导出数据请求
      if (this.activeName === 'first') {
        const data = {
          startDate: this.startDate,
          endDate: this.endDate
        };
        this.columns = this.$refs.platformChild.columns;
        serviceApi
          .accountOopeningService(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
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
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          channel: this.channelObj.name
        };
        this.columns = this.$refs.channelChild.columns;
        serviceApi
          .accountOopeningService(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
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
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          // channel: this.channelObj.name,
          province:
            this.condition.dataProvince === '省'
              ? ''
              : this.condition.dataProvince,
          city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
          area: this.condition.dataArea === '区' ? '' : this.condition.dataArea
        };
        this.columns = this.$refs.locationChild.columns;
        serviceApi
          .accountOopeningService(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
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
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          // channel: this.channelObj.name,
          // province:
          //   this.condition.dataProvince === '省'
          //     ? ''
          //     : this.condition.dataProvince,
          // city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
          // area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
          trcorp: this.legalPerson,
          bkcode: this.bankCode,
          bkname: this.bankName
        };
        this.columns = this.$refs.bankChild.columns;
        serviceApi
          .accountOopeningService(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
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
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          // channel: this.channelObj.name,
          // province:
          //   this.condition.dataProvince === '省'
          //     ? ''
          //     : this.condition.dataProvince,
          // city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
          // area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
          userName: this.userName,
          mobile: this.userPhone
          // trcorp: this.legalPerson,
          // bkcode: this.bankCode,
          // bkname: this.bankName
        };
        this.columns = this.$refs.userChild.columns;
        serviceApi
          .accountOopeningService(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
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
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          channel: this.channelObj.name,
          province:
            this.condition.dataProvince === '省'
              ? ''
              : this.condition.dataProvince,
          city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
          area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
          userName: this.userName,
          mobile: this.userPhone,
          trcorp: this.legalPerson,
          bkcode: this.bankCode,
          bkname: this.bankName
        };
        this.columns = this.$refs.gatherChild.columns;
        serviceApi
          .accountOopeningService(data)
          .then(res => {
            if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
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