<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.pageDictionary')}}</h3>
    <!-- 添加 -->
    <!-- <el-button-group style="margin-bottom:10px;">
      <el-button type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addMesg()">{{this.$t('table.add')}}</el-button>
    </el-button-group> -->
    <!-- 表格展示模块 -->
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <el-form-item :label="this.$t('views.divtPageName')"
        prop="name">
        <el-input v-model="searchName"
          @keyup.enter.native="query()"
          :placeholder="this.$t('dictionary.pageName')"
          clearable></el-input>
      </el-form-item>
      <el-form-item :label="this.$t('views.pageType')">
        <el-select v-model="pageType">
          <el-option label="H5"
            value="H5"></el-option>
          <el-option label="APP"
            value="APP"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
    </el-form>
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :default-sort="columnSort"
      @sort-change="sortChange"
      :column-type="['index']"
      :column-type-props="columnTypeProps"
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns="columns"
      :columns-handler="columnsHandler">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="total !== 0"
      class="tiny-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSize"
      :page-sizes="[10, 20, 40]"
      :current-page="currentPage">
    </el-pagination>

    <!-- 弹窗 -->
    <el-dialog :title="dialogMesg.edit ? $t('table.edit') : $t('table.add')"
      top="5vh"
      width="50%"
      :append-to-body="true"
      :visible.sync="dialogMesg.visible">
      <table-form ref="formItem"
        :mesg="dialogMesg.mesg"
        :isEdit="dialogMesg.edit"></table-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button size="small"
          :disabled="dialogMesg.disabled"
          @click="submitForm('formItem')"
          type="primary">{{this.$t('table.confirm')}}</el-button>
        <el-button size="small"
          @click="dialogMesg.visible = false">{{this.$t('table.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import columnStyle from './_components/operate';
import tableForm from './_components/tableForm';
import dictionaryApi from '@/api/dictManage';

export default {
  name: 'pageAccess',
  components: {
    tableForm
  },
  data() {
    return {
      dialogMesg: {
        visible: false,
        disabled: false,
        edit: false,
        mesg: '',
        id: ''
      },
      columnSort: {
        prop: '',
        order: ''
      },
      pageType: 'APP',
      list: [],
      searchName: '',
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
      // 表头数据
      return [
        {
          name: this.$t('views.pageAddress'),
          prop: 'pageUrl'
        },
        {
          name: this.$t('views.pageName'),
          prop: 'pageName'
        },
        {
          name: this.$t('views.updateTime'),
          prop: 'updateTime',
          sortable: 'custom',
          align: 'center',
          width: 180
        },
        {
          name: this.$t('views.createTime'),
          prop: 'createTime',
          sortable: 'custom',
          align: 'center',
          width: 180
        }
      ];
    }
  },
  created() {
    this.init();
  },
  methods: {
    sortChange(column) {
      this.columnSort.prop = column.prop;
      this.columnSort.order = column.order;
      if (this.total <= 0) {
        return;
      }
      this.init();
    },
    query() {
      this.currentPage = 1;
      this.init();
    },
    init() {
      // 查询数据库获取表格信息
      this.listLoading = true;
      const data = {
        pageNo: (this.currentPage - 1) * this.pageSize,
        pageSize: this.pageSize,
        pageName: this.searchName,
        pageType: this.pageType,
        prop:
          this.columnSort.prop === 'createTime'
            ? 'create_time'
            : this.columnSort.prop && this.columnSort.prop === 'updateTime'
            ? 'update_time'
            : this.columnSort.prop,
        order: this.columnSort.order === 'descending' ? 'DESC' : 'ASC'
      };
      dictionaryApi
        .pageList(data)
        .then(res => {
          this.list = res.robj.items;
          this.total = res.robj.total;
          this.listLoading = false;
        })
        .catch(res => {
          this.$message.error('数据请求失败!');
        });
    },
    columnsHandler(cols) {
      const that = this;
      return cols.concat({
        width: 120,
        fixed: 'right',
        label: this.$t('views.operation'),
        align: 'center',
        component: columnStyle,
        listeners: {
          // 'delect-msg'(row) {
          //   that.delectMsg(row.id);
          // },
          'modify-msg'(row) {
            that.modifyMsg(row);
          }
        }
      });
    },
    modifyMsg(row) {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = true;
      this.dialogMesg.mesg = row;
    },
    // 表格操作 （待添加权限功能解除注释）
    // delectMsg(id) {
    //   this.$confirm(this.$t('prompt.delete'), this.$t('prompt.prompt'), {
    //     confirmButtonText: this.$t('table.confirm'),
    //     cancelButtonText: this.$t('table.cancel'),
    //     type: 'error'
    //   }).then(() => {
    //     const data = {
    //       id: id
    //     };
    //     dictionaryApi
    //       .pageRemove(data)
    //       .then(res => {
    //         if (res.robj.msg === true) {
    //           this.$message.success('删除成功!');
    //           this.init();
    //         } else {
    //           this.$message.error('删除失败!');
    //         }
    //       })
    //       .catch(res => {
    //         this.$message.error('请求失败!');
    //       });
    //   });
    // },
    // addMesg() {
    //   this.dialogMesg.visible = true;
    //   this.dialogMesg.edit = false;
    //   this.dialogMesg.mesg = '';
    // },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.init();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.init();
    },
    // submitForm(formItem) {
    //   this.$refs[formItem].$refs.postForm.validate(valid => {
    //     if (valid) {
    //       this.dialogMesg.disabled = true;
    //       const data = {
    //         jsonArray: [{
    //           id: this.$refs[formItem].postForm.recordId,
    //           pageUrl: this.$refs[formItem].postForm.pageAddress,
    //           pageName: this.$refs[formItem].postForm.pageName
    //         }]
    //       };
    //       const updateData = {
    //         id: this.$refs[formItem].postForm.recordId,
    //         pageUrl: this.$refs[formItem].postForm.pageAddress,
    //         pageName: this.$refs[formItem].postForm.pageName
    //       };
    //       if (this.dialogMesg.edit) {
    //         dictionaryApi
    //           .pageUpdate(updateData)
    //           .then(res => {
    //             if (res.robj.msg === true) {
    //               this.$message.success('修改成功');
    //               this.init();
    //               this.dialogMesg.disabled = false;
    //               this.dialogMesg.visible = false;
    //             } else {
    //               this.$message.error('修改失败');
    //             }
    //           })
    //           .catch(error => {
    //             console.log(error);
    //             this.dialogMesg.disabled = false;
    //           });
    //       } else {
    //         dictionaryApi
    //           .pageAddInfo(data)
    //           .then(res => {
    //             if (res.robj.msg === true) {
    //               this.$message.success('新增成功');
    //               this.init();
    //               this.dialogMesg.id = 'newChange';
    //               this.dialogMesg.disabled = false;
    //               this.dialogMesg.visible = false;
    //             } else {
    //               this.$message.error('新增失败');
    //             }
    //           })
    //           .catch(error => {
    //             console.log(error);
    //             this.dialogMesg.disabled = false;
    //           });
    //       }
    //     } else {
    //       return false;
    //     }
    //   });
    // }
    submitForm(formItem) {
      this.$refs[formItem].$refs.postForm.validate(valid => {
        if (valid) {
          const updateData = {
            id: this.$refs[formItem].postForm.recordId,
            pageName: this.$refs[formItem].postForm.pageName
          };
          // console.log(this.$refs[formItem].postForm);
          // console.log(updateData);
          if (this.dialogMesg.edit) {
            dictionaryApi
              .pageUpdate(updateData)
              .then(res => {
                if (res.robj.msg === true) {
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
          }
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>