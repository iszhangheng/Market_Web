<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.depositsToBuy')}}</h3>
    <div>
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 用户相关查询框 -->
        <el-form-item :label="this.$t('depositsToBuy.userPhone')"
          prop="name">
          <el-input v-model="userPhone"
            :placeholder="this.$t('please.userPhone')"
            clearable></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('views.userName')"
          prop="name">
          <el-input v-model="userName"
            :placeholder="this.$t('please.userName')"
            clearable></el-input>
        </el-form-item>
      </el-form>
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 银行相关查询框 -->
        <el-form-item :label="this.$t('views.LegalPersonCode')"
          prop="name">
          <el-input v-model="LegalPersonCode"
            :placeholder="this.$t('please.LegalPersonCode')"
            clearable></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('views.bankCode')"
          prop="name">
          <el-input v-model="bankCode"
            :placeholder="this.$t('dictionary.bankCode')"
            clearable></el-input>
        </el-form-item>
        <el-form-item :label="this.$t('views.bankName')"
          prop="name">
          <el-input v-model="bankName"
            :placeholder="this.$t('dictionary.bankName')"
            clearable></el-input>
        </el-form-item>
      </el-form>
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
        <!-- 地区选择 -->
        <el-form-item :label="this.$t('date.area')">
          <v-distpicker class="el-area"
            name="Area"
            @province="onChangeProvince"
            @city="onChangeCity"
            @area="onChangeArea">
          </v-distpicker>
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item label="">
          <el-button @click="query()"
            type="primary"
            icon="el-icon-search">{{$t('table.query')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('linechart')"
        :class="{current:groupItem ==='linechart'}">
        <svg-icon icon-class="lineCharts" /></span>
    </div>
    <div v-show="groupItem === 'table'">
      <!-- 表格展示模块 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :column-key-map="{ label: 'name' }"
        :column-type="['index']"
        :column-type-props="columnTypeProps"
        :data="list"
        :columns="columns">
      </egrid>
      <!-- 表格分页 -->
      <el-pagination v-if="total !== 0"
        class="tiny-pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, prev, sizes, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        :current-page="currentPage">
      </el-pagination>
    </div>
    <div v-if="groupItem === 'linechart'">
      <line-Chart :date="date" ref="lineChild"></line-Chart>
    </div>
  </div>
</template>

<script>
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
import VDistpicker from 'v-distpicker';
import lineChart from './_components/lineChart';
export default {
  name: 'depositPurchase',
  mixins: [mixin],
  components: {
    VDistpicker,
    lineChart
  },
  data() {
    return {
      groupItem: 'table',
      channelObj: {
        list: [],
        name: ''
      },
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      condition: {
        dataProvince: '',
        dataCity: '',
        dataArea: ''
      },
      userPhone: '',
      userName: '',
      LegalPersonCode: '',
      bankCode: '',
      bankName: '',
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
    };
  },
  computed: {
    columnTypeProps() {
      return {
        index: {
          fixed: 'left',
          label: this.$t('views.index'),
          width: 50,
          align: 'center'
        }
      };
    },
    columns() {
      return [
        // 表头数据
        { name: this.$t('views.channel'), prop: 'channel' },
        { name: this.$t('depositsToBuy.area'), prop: 'area' },
        { name: this.$t('depositsToBuy.userPhone'), prop: 'mobile' },
        { name: this.$t('views.userName'), prop: 'userName' },
        { name: this.$t('views.LegalPersonCode'), prop: 'trcorp' },
        { name: this.$t('views.bankCode'), prop: 'bkcode' },
        { name: this.$t('views.bankName'), prop: 'bkname' },
        { name: this.$t('transactions.numSuccess'), prop: 'sucTotal' },
        { name: this.$t('transactions.numFail'), prop: 'failTotal' },
        { name: this.$t('views.successRate'), prop: 'sucPercent' },
        { name: this.$t('transactions.successAmount'), prop: 'sucMoney' },
        { name: this.$t('transactions.failAmount'), prop: 'failMoney' },
        { name: this.$t('views.statisticDate'), prop: 'date' }
      ];
    },
    verify() {
      return JSON.stringify(this.condition);
    }
  },
  watch: {
    // date() {
    //   this.init();
    // },
    // condition: {
    //   deep: true,
    //   handler() {
    //     this.condition = this.condition;
    //     this.init();
    //   }
    // }
  },
  created() {
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
  mounted() {
    this.init();
  },
  methods: {
    query() {
      this.currentPage = 1;
      this.init();
      this.$refs.lineChild.init();
    },
    chartCut(name) {
      this.groupItem = name;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    onChangeProvince(data) {
      this.condition.dataProvince = data.value;
    },
    onChangeCity(data) {
      this.condition.dataCity = data.value;
    },
    onChangeArea(data) {
      this.condition.dataArea = data.value;
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        province:
          this.condition.dataProvince === '省'
            ? ''
            : this.condition.dataProvince,
        city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
        area: this.condition.dataArea === '区' ? '' : this.condition.dataArea,
        channel: this.channelObj.name,
        userName: this.userName,
        mobile: this.userPhone,
        trcorp: this.legalPerson,
        bkcode: this.bankCode,
        bkname: this.bankName
      };
      productApi
        .depositsBuy(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              item.area = item.province + '—' + item.city + '—' + item.area;
              if (item.userName === null || item.userName === undefined) {
                item.userName = '未知';
              }
              if (item.bkcode === null || item.bkcode === undefined) {
                item.bkcode = '未知';
              }
              if (item.bkname === null || item.bkname === undefined) {
                item.bkname = '未知';
              }
              if (item.trcorp === null || item.trcorp === undefined) {
                item.trcorp = '未知';
              }
              if (item.mobile === null || item.mobile === undefined) {
                item.mobile = '未知';
              }
              return item;
            });
            this.total = res.robj.total;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.list = [];
            this.total = 0;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>

<style lang="scss">
.el-area {
  select {
    font-size: 12px;
    padding: 0 5px;
    height: 28px !important;
    line-height: 28px !important;
  }
}
</style>
