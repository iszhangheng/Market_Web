<template>
  <div>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <pie-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='pieOption'></pie-marker>
  </div>
</template>

<script>
import pieMarker from '@/components/Charts/pieMarker';
import productApi from '@/api/product';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { pieMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      // 绘制饼图数据
      pieOption: {
        title: {
          text: '交易数量统计', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} {c} 占比({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['交易成功', '交易失败'] // 待传值
        },
        series: [
          {
            name: '交易数量统计', // 待传值
            // roseType: 'radius',
            radius: ['50%', '70%'],
            data: [] // 待传值
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
  created() {
    this.init();
  },
  methods: {
    init() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      productApi
        .dataSummarySum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const pieData = [];
            res.robj.items.forEach(item => {
              pieData.push({
                value: item.sucTotal,
                name: '交易成功'
              });
              pieData.push({
                value: item.failTotal,
                name: '交易失败'
              });
            });
            this.pieOption.series[0].data = pieData;
            this.dataShow = false;
            this.loading = false;
          } else {
            this.dataShow = true;
            this.loading = true;
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
.page {
  padding: 20px 0;
  p {
    color: #999;
    font-size: 16px;
    text-align: center;
  }
}
</style>
