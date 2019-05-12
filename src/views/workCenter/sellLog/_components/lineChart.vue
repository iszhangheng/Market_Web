<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
      <!-- <el-form-item prop="name"
        :label="this.$t('date.label')">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          :change="test"
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp">
        </el-date-picker>
      </el-form-item> -->
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
import workCenterApi from '@/api/workCenter';
export default {
  props: ['productName'],
  components: { lineMarker },
  data() {
    return {
      dataShow: false,
      loading: true,
      date: [],
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
          data: ['折扣']
        },
        xAxis: {
          name: '折扣',
          data: []
        },
        yAxis: {
          name: ''
        },
        series: [
          {
            name: '销售数量',
            type: 'line',
            data: []
          }
        ]
      }
    };
  },
  mounted() {
    this.initForm();
  },
  methods: {
    test() {
      alert(1);
    },
    initForm() {
      const data = {
        productName: this.productName,
        startDate: this.date !== null ? this.date[0] : '',
        endDate: this.date !== null ? this.date[1] : ''
      };
      workCenterApi
        .getProductSellLine(data)
        .then(res => {
          const Xdate = [];
          const Ydate = [];
          res.robj.items.forEach(element => {
            Xdate.push(element.discount);
            Ydate.push(element.num);
          });
          this.lineOption.xAxis.data = Xdate;
          this.lineOption.series[0].data = Ydate;
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
