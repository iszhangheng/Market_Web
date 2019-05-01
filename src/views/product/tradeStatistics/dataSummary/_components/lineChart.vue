<template>
  <div>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <!-- 折线图 -->
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
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { lineMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
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
          data: ['交易笔数', '成交笔数', '交易失败笔数']
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
            name: '交易笔数',
            type: 'line',
            data: []
          },
          {
            name: '成交笔数',
            type: 'line',
            data: []
          },
          {
            name: '交易失败笔数',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  watch: {
    date() {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      productApi
        .dataSummary(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            for (let i = 0; i < res.robj.items.length - 1; i++) {
              for (let j = i + 1; j < res.robj.items.length; j++) {
                if (
                  parseInt(res.robj.items[i].date) >
                  parseInt(res.robj.items[j].date)
                ) {
                  const temp = res.robj.items[i];
                  res.robj.items[i] = res.robj.items[j];
                  res.robj.items[j] = temp;
                }
              }
            }
            this.list = res.robj.items;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.list = [];
            this.dataShow = true;
            this.loading = false;
          }
          const tradData = []; // 交易笔数
          const dealData = []; // 成交笔数
          const tradFailData = []; // 交易失败笔数
          const chartData = [];
          if (this.list.length > 0) {
            this.list.map(item => {
              chartData.push(item.date);
              tradData.push(item.sumTotal);
              dealData.push(item.sucTotal);
              tradFailData.push(item.failTotal);
            });
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = tradData;
            this.lineOption.series[1].data = dealData;
            this.lineOption.series[2].data = tradFailData;
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
