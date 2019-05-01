<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('barchart')"
        :class="{current:groupItem ==='barchart'}">
        <svg-icon icon-class="barCharts" /></span>
    </div>
    <div v-show="groupItem === 'table'">
      <!-- 表格展示模块 -->
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :column-key-map="{ label: 'name' }"
        :column-type="['index']"
        :column-type-props="columnTypeProps"
        :data="list"
        :columns="columns">
      </egrid>
      <!-- 表格分页 -->
      <el-pagination v-if="total !== 0"
        class="tiny-pagination"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, prev, sizes, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        :current-page="currentPage">
      </el-pagination>
    </div>
    <div v-if="groupItem === 'barchart'">
      <bar-chart :date="date"></bar-chart>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import barChart from './_components/barChart';
export default {
  name: 'regAge',
  mixins: [mixin],
  props: ['date'],
  components: { barChart },
  data() {
    return {
      groupItem: 'table',
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    columnTypeProps() {
      return {
        index: {
          fixed: 'left',
          label: this.$t('views.index'),
          width: 50,
          align: 'center'
        }
      };
    },
    columns() {
      return [
        // 表头数据
        { name: this.$t('views.nums'), prop: 'totalNum', align: 'center' },
        { name: '<19', prop: 'a', align: 'center' },
        { name: '19-25', prop: 'b', align: 'center' },
        { name: '26-35', prop: 'c', align: 'center' },
        { name: '36-45', prop: 'd', align: 'center' },
        { name: '46-55', prop: 'e', align: 'center' },
        { name: '>55', prop: 'f', align: 'center' },
        { name: '未知', prop: 'g', align: 'center' },
        {
          name: this.$t('views.statisticDate'),
          prop: 'dateType',
          align: 'center'
        }
      ];
    }
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
    chartCut(name) {
      this.groupItem = name;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    createColumns(item) {
      const data = {
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0,
        f: 0,
        g: 0,
        totalNum: 0,
        dateType: ''
      };
      if (item.age < 19) {
        data.a = item.num;
      }
      if (item.age >= 19 && item.age <= 25) {
        data.b = item.num;
      }
      if (item.age >= 26 && item.age <= 35) {
        data.c = item.num;
      }
      if (item.age >= 36 && item.age <= 45) {
        data.d = item.num;
      }
      if (item.age >= 46 && item.age <= 55) {
        data.e = item.num;
      }
      if (item.age > 55) {
        data.f = item.num;
      }
      if (item.age === null || item.age === undefined || item.age === '未知') {
        data.g = item.num;
      }
      data.dateType = item.dateType;
      data.totalNum = item.num;
      return data;
    },
    getData(old, item) {
      const data = {
        a: old.a + item.a,
        b: old.b + item.b,
        c: old.c + item.c,
        d: old.d + item.d,
        e: old.e + item.e,
        f: old.f + item.f,
        g: old.g + item.g,
        totalNum: old.totalNum + item.totalNum,
        dateType: old.dateType
      };
      return data;
    },
    init() {
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      userApi
        .registerAge(data)
        .then(res => {
          const list = []; // 最终 this.list结果集
          const temp = []; // dateType 去重结果
          if (res.robj.items.length > 0) {
            res.robj.items.forEach(item => {
              if (temp.indexOf(item.dateType) === -1) {
                temp.push(item.dateType);
                list.push(this.createColumns(item));
              } else {
                list.forEach((ele, index) => {
                  if (item.dateType === ele.dateType) {
                    const data = this.getData(ele, this.createColumns(item));
                    list.splice(index, 1, data); //
                  }
                });
              }
            });
            this.list = list;
            this.total = res.robj.total;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.total = 0;
            this.list = [];
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
</style>
