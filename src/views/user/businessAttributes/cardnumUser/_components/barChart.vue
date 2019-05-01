<template>
  <div>
    <div class="page"
      v-if="dataShow">
      <p>暂无数据</p>
    </div>
    <!-- 柱状图 -->
    <bar-marker v-else
      v-loading="loading"
      element-loading-text="Loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 255)"
      :data='barOption'></bar-marker>
  </div>
</template>

<script>
import barMarker from '@/components/Charts/barMarker';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
export default {
  props: ['date'],
  mixins: [mixin],
  components: { barMarker },
  data() {
    return {
      dataShow: true,
      loading: true,
      barOption: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['用户数量']
        },
        xAxis: [
          {
            name: '用户数量',
            type: 'value',
            data: []
          }
        ],
        yAxis: [
          {
            name: '绑卡数量',
            type: 'category',
            data: []
          }
        ],
        series: [
          {
            name: '用户数量',
            type: 'bar',
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
        .cardnumUserSum(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            const cardNumData = []; // 绑卡数量
            const numUserData = []; // 用户人数
            res.robj.items.map(item => {
              if (item.cardNum === null || item.cardNum === undefined) {
                item.cardNum === '未知';
              }
              if (item.num === null || item.num === undefined) {
                item.num === '未知';
              }
              cardNumData.push(item.cardNum);
              numUserData.push(item.num);
            });
            this.barOption.yAxis[0].data = cardNumData;
            this.barOption.series[0].data = numUserData;
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
