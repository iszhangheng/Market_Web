<template>
  <div>
    <div class="tiny-container">
      <h3 class="page-title">{{this.$t('route.pageRelation')}}</h3>
      <el-form class="search-form"
        :inline="true"
        size="mini">
        <!-- 模板选择 -->
        <el-form-item :label="this.$t('views.templateName')"
          prop="name">
          <el-select v-model="templateObj.name"
            @change="templateChange"
            clearable
            :placeholder="this.$t('please.template')">
            <el-option v-for="item in templateObj.list"
              :key="item.templateName"
              :value="item.templateName">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 时间选择 -->
        <el-form-item :label="this.$t('views.date')"
          prop="name">
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
        </el-form-item>
        <!-- 查询按钮 -->
        <el-form-item label="">
          <el-button @click="query"
            type="primary"
            icon="el-icon-search">{{$t('table.query')}}</el-button>
        </el-form-item>
        <!-- 导出模块 -->
        <el-form-item label=""
          v-show="templateShow">
          <export-excel id="test"
            ref="exportExcelChild"
            :columns='columns'
            :list='listExcel'
            @initExcelList='initExcelList'></export-excel>
        </el-form-item>
        <!-- 表格/流程图控制显隐 -->
        <div class="uba-content">
          <div class="charts-cut"
            v-show="stachart">
            <span @click="chartCut('table')"
              :class="{current:groupItem ==='table'}">
              <svg-icon icon-class="tableCharts" /></span>
            <span @click="chartCut('linkfigure')"
              :class="{current:groupItem ==='linkfigure'}">
              <svg-icon icon-class="linkfigure" /></span>
          </div>
        </div>
      </el-form>
      <!-- 表格展示模块 -->
      <div v-show="groupItem === 'table'">
      <egrid v-loading.body="listLoading"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        :column-type="['index']"
        :column-type-props="columnTypeProps"
        :column-key-map="{ label: 'name' }"
        :data="list"
        :columns="columns">
      </egrid>
      <!-- 表格分页 -->
      <el-pagination class="tiny-pagination"
        v-if="totalShow"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        :current-page="currentPage">
      </el-pagination>
      </div>
      <!-- 图表 -->
      <div v-show="groupItem === 'linkfigure'">
        <div v-if="stepchart" style="background:#f0f2f5;">
          <div v-if="treeG6"
            id="mountNode">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appApi from '@/api/app';
import dictionaryApi from '@/api/dictManage';
import G6 from '@antv/g6';
import mixin from '@/utils/mixin';
import ExportExcel from '@/components/ExportExcel/index';
import '@antv/g6/build/plugin.layout.dagre';
export default {
  name: 'appRelation',
  mixins: [mixin],
  components: {
    ExportExcel
  },
  data() {
    return {
      listExcel: [],
      templateShow: false,
      templateObj: {
        name: '',
        list: [],
        result: ''
      },
      groupItem: 'table',
      stachart: false,
      stepchart: false,
      treeG6: false,
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      optionNodes: [],
      optionEdges: [],
      options: [],
      list: [],
      total: 0,
      listLoading: false,
      currentPage: 1,
      pageSize: 10,
      totalShow: true
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
        {
          name: this.$t('views.link'),
          prop: 'sourceUrl'
        },
        { name: this.$t('views.entryTimes'), prop: 'entryTimes' },
        { name: this.$t('views.userNum'), prop: 'userNum' }
      ];
    }
  },
  created() {
    const data = {
      startDate: '',
      endDate: ''
    };
    appApi.appTemplateInfo(data).then(res => {
      this.templateObj.list = res.robj.items;
    });
  },
  mounted() {
    this.getUrl();
  },
  methods: {
    getUrl() {
      const data = {
        pageType: 'APP'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.options = res.robj.items;
          this.init();
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    },
    yhtRouterFilter(url) {
      let result = '';
      this.options.forEach(item => {
        url =
          url.lastIndexOf('/') === url.length - 1
            ? url.substr(0, url.length - 1)
            : url;
        if (item.pageUrl === url) {
          result = item.pageName;
        }
      });
      return result;
    },
    chartCut(name) {
      this.groupItem = name;
      this.totalShow = false;
    },
    query() {
      if (this.templateObj.name) {
        this.initTableData();
        this.stachart = true;
        this.stepchart = true;
        this.totalShow = false;
        this.templateShow = true;
        this.groupItem = 'linkfigure';
      } else {
        this.init();
        this.templateChange();
        this.stachart = false;
        this.templateShow = false;
        this.groupItem = 'table';
      }
    },
    templateChange() {
      this.templateObj.list.forEach(item => {
        if (this.templateObj.name === '') {
          this.templateObj.result = '';
        }
        if (this.templateObj.name === item.templateName) {
          this.templateObj.result = item.templateId;
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.templateObj.result = '';
      this.templateObj.name = '';
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.templateObj.result = '';
      this.templateObj.name = '';
      this.init();
    },
    init() {
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      appApi
        .appUrlRel(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.total = res.robj.total;
            this.list = res.robj.items.map(item => {
              item.sourceUrl = item.sourceName + '=>' + item.currentName;
              return item;
            });
            this.listLoading = false;
            this.totalShow = true;
          } else {
            this.totalShow = false;
            this.list = [];
            this.listLoading = false;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    initTableData() {
      this.totalShow = false;
      this.treeG6 = false;
      this.listLoading = true;
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        templateId: this.templateObj.result || ''
      };
      if (data.templateId === '') {
        this.totalShow = true;
      }
      appApi
        .appUrlRelTemplateInfo(data)
        .then(res => {
          if (res.robj.option) {
            this.optionNodes = JSON.parse(res.robj.option).series[0].data.map(
              item => {
                item.shape = 'rect';
                item.id = this.yhtRouterFilter(item.name);
                return item;
              }
            );
            this.optionEdges = JSON.parse(JSON.stringify(res.robj.items));
          }
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              item.sourceUrl = item.source + ' => ' + item.target;
              return item;
            });
            this.listLoading = false;
            this.totalShow = false;
          } else {
            this.list = [];
            this.listLoading = false;
            this.totalShow = false;
          }
          if (this.templateObj.name) {
            this.treeG6 = true;
            setTimeout(() => {
              this.G6View();
            });
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    // 导出数据请求
    initExcelList() {
      const data = {
        startDate: this.startDate,
        endDate: this.endDate,
        templateId: this.templateObj.result || ''
      };
      appApi
        .appUrlRelTemplateInfo(data)
        .then(res => {
          if (res.robj.items.length > 0) {
            this.list = res.robj.items.map(item => {
              item.sourceUrl = item.source + ' => ' + item.target;
              return item;
            });
            this.listExcel = this.list;
          } else {
            this.$message.warning('数据为空,不能执行导出操作');
            this.$refs.exportExcelChild.downloadLoading = false;
          }
        })
        .catch(res => {
          this.$message.error('导出数据请求失败!');
        });
    },
    G6View() {
      // 第一步：获取数据
      const _that = this;
      var data = {
        nodes: JSON.parse(JSON.stringify(this.optionNodes)),
        edges: JSON.parse(JSON.stringify(this.optionEdges))
      };
      // 第二步：注册图形
      G6.registerNode('rect', {
        // 设置锚点
        getPath: function getPath(item) {
          var width = 100; // 一半宽
          var height = 30; // 一半高
          return G6.Util.getRectPath(
            -width / 2,
            -height / 2,
            width,
            height,
            10
          );
        }
      });
      const dagre = new G6.Layouts.Dagre({
        rankdir: 'TB', // 布局方向 TB, BT, LR, or RL
        align: 'DL', // 对其参数 UL, UR, DL or DR
        edgesep: 80, // 同层边分间距
        ranksep: 50, // 节点分层间距
        marginx: 0, // 整图水平间距
        marginy: 0 // 整图竖直间距
      });
      var graph = new G6.Graph({
        container: 'mountNode',
        fitView: 'cc',
        height: window.innerHeight - 180, // 画布高
        layout: dagre,
        defaultIntersectBox: 'rect' // 使用矩形包围盒
      });

      graph.node({
        shape: 'rect',
        label: function label(model) {
          model.label = {
            // text: model.name,
            text: _that.yhtRouterFilter(model.name),
            fill: '#5c5d5f'
          };
          return model.label;
        },
        style: {
          stroke: '#f0f2f5',
          fill: '#f0f2f5',
          // fillOpacity: 0.45,
          lineWidth: 1
        }
      });
      graph.edge({
        color: 'red',
        style: {
          endArrow: true
        },
        label: function label(model) {
          return '' + model.entryTimes;
          // return {
          //   text: '跳转次数:' + model.val,
          //   fill: '#000'
          // };
        }
      });
      graph.read(data);
    }
  }
};
</script>

<style lang="scss">
.charts-cut {
  top: -18px !important;
}
</style>
