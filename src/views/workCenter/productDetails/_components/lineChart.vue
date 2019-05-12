<template>
  <div>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 时间选择 -->
      <!-- <el-form-item prop="name">
        <el-date-picker v-model="date"
          type="daterange"
          align="center"
          unlink-panels
          :start-placeholder="this.$t('date.start')"
          :end-placeholder="this.$t('date.end')"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-form-item>-->
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
import workCenterApi from '@/api/workCenter';
import lineMarker from '@/components/Charts/lineMarker';
import mixin from '@/utils/mixin';
export default {
  props: ['productName'],
  mixins: [mixin],
  components: { lineMarker },
  data() {
    return {
      dataShow: false,
      loading: true,
      date: this.newdate,
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
          data: ['商品销售数量']
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
    initForm() {
      // 查询表格信息
      this.listLoading = true;
      const data = {
        productName: this.productName,
        startDate: '',
        endDate: ''
      };
      workCenterApi
        .getProductLine(data)
        .then(res => {
          const Xdate = [];
          const Ydate = [];
          res.robj.items.forEach(element => {
            Xdate.push(element.date);
            Ydate.push(element.count);
          });
          this.lineOption.xAxis.data = Xdate;
          this.lineOption.series[0].data = Ydate;
          this.listLoading = false;
          if (res.robj.items.length === 0) {
            this.dataShow = true;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
          this.listLoading = false;
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
