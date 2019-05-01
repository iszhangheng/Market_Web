<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <span @click="chartCut('mapchart')"
        :class="{current:groupItem ==='mapchart'}">
        <svg-icon icon-class="mapCharts" /></span>
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
    <div v-if="groupItem === 'mapchart'">
      <map-Chart :date="date"></map-Chart>
    </div>
  </div>
</template>

<script>
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
import mapChart from './_components/mapChart';
export default {
  name: 'regArea',
  mixins: [mixin],
  props: ['date', 'condition'],
  components: {
    mapChart
  },
  data() {
    return {
      groupItem: 'table',
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1, // 当前页码
      pageSize: 10 // 页面大小
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
        { name: this.$t('user.area'), prop: 'province', align: 'center' },
        // { name: this.$t('views.city'), prop: 'city' },
        // { name: this.$t('views.area'), prop: 'area' },
        { name: this.$t('views.num'), prop: 'num', align: 'center' },
        {
          name: this.$t('views.statisticDate'),
          prop: 'dateType',
          align: 'center'
        }
      ];
    }
    // verify() {
    //   return JSON.stringify(this.condition);
    // }
  },
  watch: {
    date() {
      this.init();
    },
    condition: {
      deep: true,
      handler() {
        this.condition = this.condition;
        this.init();
      }
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
    init() {
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        province:
          this.condition.dataProvince === '省'
            ? ''
            : this.condition.dataProvince,
        city: this.condition.dataCity === '市' ? '' : this.condition.dataCity,
        area: this.condition.dataArea === '区' ? '' : this.condition.dataArea
      };
      userApi
        .registAreaUser(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              item.province = item.province + '—' + item.city;
              return item;
            });
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
