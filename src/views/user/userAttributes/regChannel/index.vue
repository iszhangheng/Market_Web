<template>
  <div>
    <div class="charts-cut">
      <span @click="chartCut('table')"
        :class="{current:groupItem ==='table'}">
        <svg-icon icon-class="tableCharts" /></span>
      <!-- <span @click="chartCut('piechart')"
        :class="{current:groupItem ==='piechart'}">
        <svg-icon icon-class="pieCharts" /></span> -->
      <span @click="chartCut('linechart')"
        :class="{current:groupItem ==='linechart'}">
        <svg-icon icon-class="lineCharts" /></span>
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
    <!-- <div v-if="groupItem === 'piechart'">
      <pie-Chart :date="date"></pie-Chart>
    </div> -->
    <div v-if="groupItem === 'linechart'">
      <line-Chart :date="date"></line-Chart>
    </div>
  </div>
</template>

<script>
// import { yhtChannelFilter } from '@/filters';
import userApi from '@/api/user';
import mixin from '@/utils/mixin';
// import pieChart from './_components/pieChart';
import lineChart from './_components/lineChart';
export default {
  name: 'regChannel',
  mixins: [mixin],
  props: ['date'],
  components: {
    lineChart
    // pieChart
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
        {
          name: this.$t('views.nums'),
          prop: 'totalNum',
          align: 'center'
        },
        { name: this.$t('views.weChat'), prop: 'weChat', align: 'center' },
        {
          name: this.$t('views.qq'),
          prop: 'qq',
          align: 'center'
        },
        {
          name: this.$t('views.app'),
          prop: 'app',
          align: 'center'
        },
        {
          name: this.$t('views.applet'),
          prop: 'applet',
          align: 'center'
        },
        {
          name: this.$t('views.public'),
          prop: 'public',
          align: 'center'
        },
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
  created() {
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
        weChat: 0,
        qq: 0,
        app: 0,
        applet: 0,
        public: 0,
        totalNum: 0,
        dateType: ''
      };
      if (item.channel === '微信') {
        data.weChat = item.num;
      }
      if (item.channel === 'APP') {
        data.app = item.num;
      }
      if (item.channel === 'QQ') {
        data.qq = item.num;
      }
      if (item.channel === '小程序') {
        data.applet = item.num;
      }
      if (item.channel === '公众号') {
        data.public = item.num;
      }
      data.dateType = item.dateType;
      data.totalNum = item.num;
      return data;
    },
    getData(old, item) {
      const data = {
        weChat: old.weChat + item.weChat,
        qq: old.qq + item.qq,
        app: old.app + item.app,
        applet: old.applet + item.applet,
        public: old.public + item.public,
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
        .userChannel(data)
        .then(res => {
          const list = [];
          const temp = [];
          if (res.robj.items.length > 0) {
            res.robj.items.forEach(item => {
              if (temp.indexOf(item.dateType) === -1) {
                temp.push(item.dateType);
                list.push(this.createColumns(item));
              } else {
                list.forEach((ele, index) => {
                  if (item.dateType === ele.dateType) {
                    const data = this.getData(ele, this.createColumns(item));
                    list.splice(index, 1, data);
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
          // const obj = this.channelObj;
          // for (let i = 1; i < res.robj.total; i++) {
          //   this.channelList.push({
          //     weChat: 0,
          //     qq: 0,
          //     app: 0,
          //     applet: 0,
          //     public: 0,
          //     totalNum: 0,
          //     dateType: ''
          //   });
          // }
          // res.robj.items.map(item => {
          //   this.channelList.map(element => {
          //     if (element.dateType === '') {
          //       //
          //       element.dateType = item.dateType;
          //       if (item.channel === '微信') {
          //         element.weChat = item.num;
          //       }
          //       if (item.channel === 'APP') {
          //         element.app = item.num;
          //       }
          //       if (item.channel === 'QQ') {
          //         element.qq = item.num;
          //       }
          //       if (item.channel === '小程序') {
          //         element.applet = item.num;
          //       }
          //       if (item.channel === '公众号') {
          //         element.public = item.num;
          //       }
          //     }
          //     if (
          //       element.dateType !== item.dateType &&
          //       elemnt.dateType !== ''
          //     ) {
          //       // continue;
          //     }
          //     if (element.dateType === item.dateType) {
          //       //
          //       if (item.channel === '微信') {
          //         element.weChat += item.num;
          //       }
          //       if (item.channel === 'APP') {
          //         element.app += item.num;
          //       }
          //       if (item.channel === 'QQ') {
          //         element.qq += item.num;
          //       }
          //       if (item.channel === '小程序') {
          //         element.applet += item.num;
          //       }
          //       if (item.channel === '公众号') {
          //         element.public += item.num;
          //       }
          //     }
          //     element.totalNum =
          //       element.weChat +
          //       element.qq +
          //       element.app +
          //       element.applet +
          //       element.public;
          //     this.channelObj.dateType = element.dateType;
          //     this.channelObj.weChat = element.weChat;
          //     this.channelObj.qq = element.qq;
          //     this.channelObj.app = element.app;
          //     this.channelObj.applet = element.applet;
          //     this.channelObj.public = element.public;
          //     this.channelObj.totalNum = element.totalNum;
          //   });
          // });
          // this.list.push(this.channelObj);
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    }
  }
};
</script>