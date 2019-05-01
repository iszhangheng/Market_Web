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
          data: ['交易失败笔数', '交易成功笔数']
        },
        xAxis: {
          name: '日期',
          data: []
        },
        yAxis: {
          name: '笔数'
        },
        series: [
          {
            name: '交易失败笔数',
            type: 'line',
            data: []
          },
          {
            name: '交易成功笔数',
            type: 'line',
            data: []
          }
        ]
      }
    };
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
        .depositsBuy(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            for (let i = 0; i < res.robj.items.lenght - 1; i++) {
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
            this.loading = false;
            this.dataShow = false;
          } else {
            this.list = [];
            this.dataShow = true;
            this.loading = false;
          }
          const successNum = []; // 交易成功笔数
          const failNum = []; // 交易失败笔数
          const chartData = [];
          if (this.list.length > 0) {
            this.list.map(element => {
              chartData.push(element.date);
              successNum.push(element.sucTotal);
              failNum.push(element.failTotal);
            });
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = failNum;
            this.lineOption.series[1].data = successNum;
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
