<template>
  <el-form class="form-container"
    size="mini"
    ref="postForm"
    label-width="140px">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="模板名称"
          prop="name">
          <el-input placeholder="请输入名称"
            v-model="postForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模板说明"
          prop="name">
          <el-input placeholder="请输入说明"
            v-model="postForm.explain"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-form-item label="页面选择"
          prop="email">
          <el-select style="width:100%"
            v-model="postForm.pages"
            filterable
            multiple
            placeholder="请选择">
            <el-option v-for="item in options"
              :key="item.url"
              :label="item.title"
              :value="item.url">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-button @click="addPages"
          type="mini">添加</el-button>
      </el-col>
    </el-row>
    <h4>链路关系</h4>
    <el-row :gutter="20">
      <el-col :span="11">
        <el-form-item v-for="(item,i) in selectData"
          :key="i"
          :label="item.title"
          prop="name">
          <el-select style="width:100%"
            @change="urlChange"
            v-model="item.result"
            multiple
            placeholder="请选择">
            <el-option v-for="arr in item.list"
              :key="arr.url"
              :label="arr.title"
              :value="arr.url">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="13">
        <graph-chart v-if="isLoading"
          :data="graphOption"></graph-chart>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import operationApi from '@/api/operation';
import yhtRouter from '@/filters/yhtRouter';
import graphChart from '@/components/Charts/graphMarker';
const defaultForm = {
  name: '',
  explain: '',
  pages: []
};
export default {
  name: 'tableChild',
  components: { graphChart },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      postForm: Object.assign({}, defaultForm),
      isLoading: false,
      graphOption: {
        title: {
          text: 'aaa'
        },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
          {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true, // 是否开启鼠标缩放
            label: {
              normal: {
                show: true
              }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              normal: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            lineStyle: {
              normal: {
                opacity: 0.9,
                width: 2,
                curveness: 0.2
              }
            },
            data: [],
            links: []
          }
        ]
      },
      options: yhtRouter,
      selectData: []
    };
  },
  mounted() {
    this.queryInit();
    // this.fetchData();
  },
  methods: {
    queryInit() {
      // 根据id查询数据
      const data = {
        templateID: this.id
      };
      operationApi
        .templateManage(data)
        .then(res => {
          // 传值
          this.postForm.name = res.robj.items[0].templateName;
          this.postForm.explain = res.robj.items[0].templateExplain;
          this.graphOption = JSON.parse(res.robj.items[0].nodeDetail);
          this.postForm.pages = [];
          this.graphOption.series[0].data.map(item => {
            this.postForm.pages.push(item.name);
          });

          // 获取selectData
          this.selectData = [];
          this.postForm.pages.map(item => {
            const result = [];
            this.graphOption.series[0].links.map(element => {
              if (item === element.source) {
                result.push(this.yhtTitleFilter(element.target));
              }
            });
            const list = [];
            result.map(str => {
              list.push({ title: this.yhtRouterFilter(str), url: str });
            });
            const obj = {
              list: list,
              result: result,
              title: item,
              url: this.yhtTitleFilter(item)
            };
            this.selectData.push(obj);
          });
          this.fetchData();
        })
        .catch(res => {
          this.$message.error('查询失败!');
        });
    },
    updateInit() {
      const data = {
        templateID: this.id,
        templateName: this.postForm.name,
        templateExplain: this.postForm.explain,
        nodeDetail: JSON.stringify(this.graphOption)
      };
      operationApi
        .templateUpdateInfo(data)
        .then(res => {
          if (res.robj.msg === true) {
            this.$message.success('修改成功!');
          } else {
            this.$message.error('修改失败!');
          }
        })
        .catch(res => {
          this.$message.error('请求失败!');
        });
    },
    addPages() {
      if (this.postForm.pages.length === 0) return;
      this.selectData = [];
      this.isLoading = false;
      this.selectData = this.postForm.pages.map(item => {
        const obj = {
          url: item,
          title: this.yhtRouterFilter(item),
          result: [],
          list: this.pageListFilter(item)
        };
        return obj;
      });
      this.fetchData();
    },
    pageListFilter(url) {
      const list = [];
      yhtRouter.forEach(item => {
        this.postForm.pages.forEach(page => {
          if (page === item.url && page !== url) {
            list.push(item);
          }
        });
      });
      return list;
    },
    yhtRouterFilter(url) {
      let result = '';
      yhtRouter.forEach(item => {
        url =
          url.lastIndexOf('/') === url.length - 1
            ? url.substr(0, url.length - 1)
            : url;
        if (item.url === url) {
          result = item.title;
        }
      });
      return result;
    },
    yhtTitleFilter(title) {
      let result = '';
      yhtRouter.forEach(item => {
        if (item.title === title) {
          result = item.url;
        }
      });
      return result;
    },
    urlChange() {
      this.fetchData();
    },
    fetchData() {
      this.graphOption.series[0].data = [];
      this.graphOption.series[0].links = [];
      this.graphOption.series[0].data = this.selectData.map((item, index) => {
        let x = 200 + (index + 1) * 100;
        let y = 200 + (index + 1) * 100;
        if (index % 2 === 0) {
          x = x + 100;
          y = y - 100;
        }
        const obj = {
          name: item.title,
          x: x,
          y: y
        };
        return obj;
      });
      const linkArr = [];
      this.selectData.forEach(item => {
        item.result.forEach(page => {
          const obj = {
            source: this.yhtRouterFilter(item.url),
            target: this.yhtRouterFilter(page)
          };
          linkArr.push(obj);
        });
      });
      this.graphOption.series[0].links = linkArr;
      this.isLoading = true;
    }
  }
};
</script>
<style lang="scss">
.form-container {
  .el-form-item__label {
    padding: 0 12px 0 0 !important;
    line-height: 28px !important;
  }
}
</style>
