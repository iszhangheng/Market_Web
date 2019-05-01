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
import { yhtChannelFilter } from '@/filters';
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
          text: '用户注册渠道分布情况', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: [] // 待传值
        },
        series: [
          {
            name: '注册渠道', // 待传值
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
        .userChannelSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const pieData = [];
            res.robj.items.forEach(item => {
              if (item.channel === undefined || item.channel === null) {
                item.channel = '未知';
              }
              pieData.push({
                value: item.num,
                name: yhtChannelFilter(item.channel)
              });
            });
            this.pieOption.legend.data = this.pieOption_legend_data(pieData);
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
