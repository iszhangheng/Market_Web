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
      // 绘制饼图数据
      dataShow: false,
      loading: true,
      pieOption: {
        title: {
          text: '用户注册年龄分布情况', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['90后', '80后', '70后', '69前'] // 待传值
        },
        series: [
          {
            name: '注册年龄', // 待传值
            // radius: '55%',
            roseType: 'radius',
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
        .registerAge(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const pieData = [];
            res.robj.items.forEach(item => {
              pieData.push({
                value: item.post90sNum,
                name: '90后'
              });
              pieData.push({
                value: item.post80sNum,
                name: '80后'
              });
              pieData.push({
                value: item.post70sNum,
                name: '70后'
              });
              pieData.push({
                value: item.before69Num,
                name: '69前'
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
    // pieOption_legend_data(pieData) {
    //   const pie = [];
    //   for (let i = 0; i < pieData.length; i++) {
    //     let tager = true;
    //     for (let j = 0; j < pie.length; j++) {
    //       if (pie[j] === pieData[i].name) {
    //         tager = false;
    //       }
    //     }
    //     if (tager) {
    //       pie.push(pieData[i].name);
    //     }
    //   }
    //   return pie;
    // }
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
