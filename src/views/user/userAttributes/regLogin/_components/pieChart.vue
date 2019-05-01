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
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  mixins: [mixin],
  props: ['date'],
  components: { pieMarker },
  data() {
    return {
      dataShow: false,
      loading: true,
      // 绘制饼图数据
      pieOption: {
        title: {
          text: '用户登录时间分布情况', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b}(小时)/h 人数: {c}人 占比({d}%)'
        },
        legend: {
          data: [] // 待传值
        },
        series: [
          {
            name: '登录时间(半径模式)', // 待传值
            type: 'pie',
            radius: [20, 110],
            center: ['25%', '50%'],
            roseType: 'radius',
            data: [] // 待传值
          },
          {
            name: '登录时间(面积模式)', // 待传值
            type: 'pie',
            radius: [30, 110],
            center: ['75%', '50%'],
            roseType: 'area',
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
      userApi
        .userLoginSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const pieData = [];
            res.robj.items.forEach(item => {
              if (item.time === undefined || item.time === null) {
                item.time = '未知';
              }
              pieData.push({
                value: item.num,
                name: item.time
              });
            });
            this.pieOption.legend.data = this.pieOption_legend_data(pieData);
            this.pieOption.series[0].data = pieData;
            this.pieOption.series[1].data = pieData;
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
    },
    pieOption_legend_data(pieData) {
      const pie = [];
      for (let i = 0; i < pieData.length; i++) {
        let tager = true;
        for (let j = 0; j < pie.length; j++) {
          if (pie[j] === pieData[i].name) {
            tager = false;
          }
        }
        if (tager) {
          pie.push(pieData[i].name);
        }
      }
      return pie;
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
.elForm {
  text-align: right;
}
</style>
