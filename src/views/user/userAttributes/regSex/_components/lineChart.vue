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
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { lineMarker },
  data() {
    return {
      dataShow: false,
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
          data: ['男用户数', '女用户数', '未知用户数']
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
            name: '男用户数',
            type: 'line',
            data: []
          },
          {
            name: '女用户数',
            type: 'line',
            data: []
          },
          {
            name: '未知用户数',
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
      userApi
        .registerSex(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            for (let i = 0; i < res.robj.items.length - 1; i++) {
              for (let j = i + 1; j < res.robj.items.length; j++) {
                if (
                  parseInt(res.robj.items[i].dateType) >
                  parseInt(res.robj.items[j].dateType)
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
            this.loading = true;
            this.dataShow = true;
          }
          const manData = []; // 男用户数
          const womanData = []; // 女用户数
          const mysteryData = []; // 未知
          const chartData = [];
          if (this.list.length > 0) {
            this.list.forEach(element => {
              chartData.push(element.dateType);
              manData.push(element.man);
              womanData.push(element.woman);
              mysteryData.push(element.mystery);
            });
            this.lineOption.xAxis.data = chartData;
            this.lineOption.series[0].data = manData;
            this.lineOption.series[1].data = womanData;
            this.lineOption.series[2].data = mysteryData;
            this.loading = false;
            this.dataShow = false;
          } else {
            this.loading = false;
            this.dataShow = true;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
    // showDataSort(chartData) {
    //   for (let i = 0; i < chartData.length - 1; i++) {
    //     for (let j = i + 1; j < chartData.length; j++) {
    //       let temp = [];
    //       if (chartData[i] > chartData[j]) {
    //         temp = chartData[i];
    //         chartData[i] = chartData[j];
    //         chartData[j] = temp;
    //       }
    //     }
    //   }
    //   return chartData;
    // }
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
