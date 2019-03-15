<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.h5UrlUsersCount')}}</h3>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- <el-form-item :label="$t('views.date')"
        prop="name"
        name="date">
        <el-date-picker v-model="date"
          type="month"
          :placeholder="$t('views.selectmonth')"
          name="selectmonth">
        </el-date-picker>
      </el-form-item> -->
    </el-form>
    <el-tabs v-model="activeName"
      @tab-click="handleClick"
      style='width:100%'>
      <!-- 表格 -->
      <el-tab-pane :label="$t('views.tablechart')"
        name="tablechart">
        <table-chart
          v-if="tableLoading"
          ></table-chart>
      </el-tab-pane>
      <!-- 折线图 -->
      <!-- <el-tab-pane :label="$t('views.linechart')"
        name="linechart">
        <line-marker :data='lineOption'
          v-if="lineLoading"></line-marker>
      </el-tab-pane> -->
      <!-- 柱状图 -->
      <!-- <el-tab-pane :label="$t('views.barchart')"
        name="barchart">
        <bar-marker :data='barOption'
          v-if="barLoading"></bar-marker>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script>
import operationApi from '@/api/operation';
// import barMarker from '@/components/Charts/barMarker';
import tableChart from './_components/tableChart';
// import lineMarker from '@/components/Charts/lineMarker';
export default {
  name: 'h5UrlUsersCount',
  components: {
    // barMarker,
    tableChart
    // lineMarker
  },
  data() {
    return {
      date: new Date(), // 选中时间的值
      activeName: 'tablechart',
      lineLoading: false,
      barLoading: false,
      tableLoading: false,
      // 绘制折线图数据
      lineOption: {
        // 折线图参数
        title: {
          text: '绑卡银行分布'
        },
        legend: {
          data: ['用户数量']
        },
        xAxis: [
          {
            name: '银行数量'
          }
        ],
        yAxis: [
          {
            name: '用户数量'
          }
        ],
        series: [
          {
            name: ['用户数量'],
            data: []
          }
        ]
      },
      // 绘制柱状图数据
      barOption: {
        // 柱状图参数
        title: {
          text: '绑卡银行分布'
        },
        legend: {
          data: ['用户数量']
        },
        xAxis: [
          {
            name: '银行数量'
          }
        ],
        yAxis: [
          {
            name: '用户数量'
          }
        ],
        series: [
          {
            name: ['用户数量'],
            data: []
          }
        ]
      }
    };
  },
  watch: {
    date: function() {
      // 当时间更改时，更新数据
        this.initViewData();
    }
  },
  created() {
    this.initViewData();
  },
  methods: {
    initViewData() {
      // 根据条件向数据库请求数据，填充展示数组
      const data = {
        flow: 'chart',
        date:
          this.date == null ? '' : this.$moment(this.date).format('YYYYMM')
      };
      operationApi.urlUsersCount(data)
        .then(res => {
          let chartData = [];
          res.robj.items.forEach(item => {
            chartData.push([item.bankNum, item.num]);
          });
          chartData = this.showDataSort(chartData);
          this.barOption.series[0].data = [];
          this.barOption.xAxis[0].data = [];
          chartData.forEach(item => {
            this.barOption.series[0].data.push(item[1]);
            this.barOption.xAxis[0].data.push(item[0]);
          });
          this.lineOption.series[0].data = chartData;
          this.tableLoading = true;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    showDataSort: function(chartData) {
      for (let i = 0; i < chartData.length - 1; i++) {
        for (let j = i + 1; j < chartData.length; j++) {
          let temp = [];
          if (chartData[i][0] > chartData[j][0]) {
            temp = chartData[i];
            chartData[i] = chartData[j];
            chartData[j] = temp;
          }
        }
      }
      return chartData;
    },
    handleClick(tab, event) {
      this.lineLoading = false;
      this.barLoading = false;
      switch (tab.name) {
        case 'linechart':
          this.lineLoading = true;
          break;
        case 'barchart':
          this.barLoading = true;
          break;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
// ...
</style>

