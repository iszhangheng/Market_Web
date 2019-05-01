<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <el-form-item prop="name">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <line-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='lineOption'></line-marker>
  </div>
</template>

<script>
import lineMarker from '@/components/Charts/lineMarker';
import serviceMonitoringApi from '@/api/serviceMonitoring';
import mixin from '@/utils/mixin';
export default {
  props: ['name', 'newdate'],
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      date: this.newdate,
      list: [],
      lineOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          }
        },
        legend: {
          right: 10,
          top: 10,
          bottom: 10,
          data: ['总数量', '成功数量', '失败数量']
        },
        xAxis: {
          name: '日期',
          data: []
        },
        yAxis: {
          name: ''
        },
        series: [
          {
            name: '总数量',
            type: 'line',
            data: []
          },
          {
            name: '成功数量',
            type: 'line',
            data: []
          },
          {
            name: '失败数量',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  watch: {
    name() {
      this.initViewData();
    },
    date() {
      this.initViewData();
    }
  },
  created() {
    this.initViewData();
  },
  methods: {
    initViewData() {
      const data = {
        serviceName: this.name,
        startDate: this.startDate,
        endDate: this.endDate
      };
      serviceMonitoringApi
        .serviceInvokeMonitor(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            for (let i = 0; i < res.robj.items.length - 1; i++) {
              for (let j = i + 1; j < res.robj.items.length; j++) {
                if (
                  parseInt(res.robj.items[i].invokeDay) >
                  parseInt(res.robj.items[j].invokeDay)
                ) {
                  const temp = res.robj.items[i];
                  res.robj.items[i] = res.robj.items[j];
                  res.robj.itms[j] = temp;
                }
              }
            }
            this.list = res.robj.items;
          } else {
            this.list = [];
          }
          if (this.list.length > 0) {
            const failData = [];
            const successData = [];
            const totalData = [];
            const chartData = [];
            res.robj.items.forEach(item => {
              if (item.fail === null || item.fail === undefined) {
                item.fail = 0;
                item.success = 0;
                item.total = 0;
              }
              chartData.push(item.invokeDay);
              failData.push(item.fail);
              successData.push(item.success);
              totalData.push(item.total);
            });
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = totalData;
            this.lineOption.series[1].data = successData;
            this.lineOption.series[2].data = failData;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.dataShow = true;
            this.loading = false;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  padding: 20px 0;
  p {
    color: #999;
    font-size: 16px;
    text-align: center;
  }
}
</style>
