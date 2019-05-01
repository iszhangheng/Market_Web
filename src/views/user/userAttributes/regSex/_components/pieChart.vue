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
  components: { pieMarker },
  data() {
    return {
      dataShow: false,
      loading: true,
      // 绘制饼图数据
      pieOption: {
        title: {
          text: '用户注册性别分布情况(昨日统计)', // 待传值
          subtext: '数量比例' // 待传值
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a}: {b} 人数: {c}人 占比({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['男', '女', '未知'] // 待传值
        },
        series: [
          {
            name: '注册性别', // 待传值
            roseType: 'radius',
            // radius: ['50%', '70%'],
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
        startDate: '',
        endDate: ''
      };
      userApi
        .registerSexSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const pieData = [];
            res.robj.items.forEach(item => {
              if (item.sex === undefined || item.sex === null) {
                item.sex = '未知';
              }
              pieData.push({
                value: item.man,
                name: '男'
              });
              pieData.push({
                value: item.woman,
                name: '女'
              });
              pieData.push({
                value: item.mystery,
                name: '未知'
              });
            });
            this.pieOption.series[0].data = pieData;
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
