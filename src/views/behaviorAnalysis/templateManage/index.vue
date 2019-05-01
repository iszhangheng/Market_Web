<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.templateManage')}}</h3>
    <el-button-group style="margin-bottom:10px;">
      <el-button type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addMesg()">{{this.$t('table.add')}}</el-button>
    </el-button-group>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-type="['index']"
      :column-type-props="columnTypeProps"
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns-handler="columnsHandler"
      :columns="columns">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>

    <!-- 功能内容调用 -->
    <el-dialog :title="dialogMesg.edit ? $t('table.edit') : $t('table.add')"
      top="5vh"
      width="80%"
      :append-to-body="true"
      :visible.sync="dialogMesg.visible">
      <table-form ref="formItem"
        :pageRelationsList="pageRelationsList"
        v-if="dialogMesg.visible"
        :mesgId="dialogMesg.id"
        :isEdit="dialogMesg.edit"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          @click="dialogMesg.visible = false">{{this.$t('table.cancel')}}</el-button>
        <el-button size="small"
          :disabled="dialogMesg.disabled"
          @click="submitForm('formItem')"
          type="primary">{{this.$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import tableForm from './_components/tableForm';
import columnTowards from './_components/columnTowards';
import behaviorApi from '@/api/behavior';
import dictionaryApi from '@/api/dictManage';
export default {
  name: 'templateManage',
  components: {
    tableForm
  },
  data() {
    return {
      pageRelationsList: [],
      dialogMesg: {
        visible: false,
        disabled: false,
        edit: false,
        id: ''
      },
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
        {
          name: this.$t('views.templateName'),
          prop: 'templateName',
          'show-overflow-tooltip': true
        },
        {
          name: this.$t('views.instructions'),
          prop: 'templateExplain'
        }
      ];
    }
  },
  watch: {},
  mounted() {
    this.getpageRelationsList();
  },
  methods: {
    getpageRelationsList() {
      const data = {
        pageType: 'APP'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.pageRelationsList = res.robj.items;
          this.init();
        })
        .catch(res => {
          this.$message.error('数据请求失败');
        });
    },
    init() {
      // 查询表格信息
      this.listLoading = true;
      const data = {
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize
      };
      behaviorApi
        .templateManage(data)
        .then(res => {
          if (res.robj.items.length > 0 && res.robj.items[0] !== null) {
            this.list = res.robj.items;
            this.total = res.robj.total;
            this.listLoading = false;
          } else {
            this.total = 0;
            this.list = [];
            this.listLoading = false;
          }
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 200,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnTowards,
        listeners: {
          'delect-msg'(row) {
            that.delectMsg(row.templateId);
          },
          'modify-msg'(row) {
            that.modifyMsg(row.templateId);
          }
        }
      });
    },
    modifyMsg(id) {
      // 修改
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = true;
      this.dialogMesg.id = id;
    },
    delectMsg(id) {
      // 删除
      this.$confirm(this.$t('prompt.delete'), this.$t('prompt.prompt'), {
        confirmButtonText: this.$t('table.confirm'),
        cancelButtonText: this.$t('table.cancel'),
        type: 'error'
      }).then(() => {
        const data = {
          templateId: id
        };
        behaviorApi
          .templateDeleteInfo(data)
          .then(res => {
            // 删除
            if (res.robj.deleteStatus === true) {
              this.$message.success('删除成功!');
              this.init();
            } else {
              this.$message.error('删除失败!');
            }
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    addMesg() {
      // 新增
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = false;
      this.dialogMesg.id = '';
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    yhtRouterFilter(url) {
      let result = '';
      this.pageRelationsList.forEach(item => {
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
    yhtTitleFilter(title) {
      let result = '';
      this.pageRelationsList.forEach(item => {
        if (item.pageName === title) {
          result = item.pageUrl;
        }
      });
      return result;
    },
    submitForm(formItem) {
      this.$refs[formItem].$refs.postForm.validate(valid => {
        if (valid) {
          const links = [];
          this.$refs.formItem.postForm.graphOption.series[0].links.forEach(
            item => {
              links.push({
                source: this.yhtTitleFilter(item.source),
                target: this.yhtTitleFilter(item.target)
              });
              return item;
            }
          );
          this.$refs.formItem.postForm.graphOption.series[0].links = links;
          const dataList = [];
          this.$refs.formItem.postForm.graphOption.series[0].data.forEach(
            item => {
              dataList.push({
                name: this.yhtTitleFilter(item.name),
                x: item.x,
                y: item.y
              });
              return item;
            }
          );
          this.$refs.formItem.postForm.graphOption.series[0].data = dataList;
          this.dialogMesg.disabled = true;
          const data = {
            templateName: this.$refs[formItem].postForm.name,
            templateExplain: this.$refs[formItem].postForm.explain,
            nodeDetail: JSON.stringify(
              this.$refs[formItem].postForm.graphOption
            )
          };
          if (this.dialogMesg.edit) {
            // 修改
            data.templateId = this.dialogMesg.id;
            behaviorApi
              .templateUpdateInfo(data)
              .then(res => {
                if (res.robj.updateStatus === true) {
                  this.$message.success('修改成功');
                  this.init();
                  this.dialogMesg.disabled = false;
                  this.dialogMesg.visible = false;
                } else {
                  this.$message.error('修改失败');
                }
              })
              .catch(error => {
                console.log(error);
                this.dialogMesg.disabled = false;
              });
          } else {
            behaviorApi
              .templateAddInfo(data)
              .then(res => {
                // 新增
                if (res.robj.insertStatus === true) {
                  this.$message.success('新增成功');
                  this.init();
                  this.dialogMesg.id = 'newChange';
                  this.dialogMesg.disabled = false;
                  this.dialogMesg.visible = false;
                } else {
                  this.$message.error('新增失败');
                }
              })
              .catch(error => {
                console.log(error);
                this.dialogMesg.disabled = false;
              });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

