<template>
  <div class="tiny-container">
    <!-- 查询模块 -->
    <el-form class="search-form"
      :inline="true"
      :model="searchForm"
      label-width="100px"
      ref="searchForm"
      size="mini">
      <el-form-item label="名字"
        prop="name">
        <el-input v-model="searchForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱"
        prop="email">
        <el-input v-model="searchForm.email"></el-input>
      </el-form-item>
      <el-form-item label="等级"
        v-show="searchShow"
        prop="string">
        <el-input v-model="searchForm.string"></el-input>
      </el-form-item>
      <el-form-item label="字段1"
        v-show="searchShow"
        prop="string">
        <el-input v-model="searchForm.string"></el-input>
      </el-form-item>
      <el-form-item label="字段2"
        v-show="searchShow"
        prop="string">
        <el-input v-model="searchForm.string"></el-input>
      </el-form-item>
      <el-form-item label="字段3"
        v-show="searchShow"
        prop="string">
        <el-input v-model="searchForm.string"></el-input>
      </el-form-item>
      <el-form-item label="字段4"
        v-show="searchShow"
        prop="string">
        <el-input v-model="searchForm.string"></el-input>
      </el-form-item>
      <el-form-item label="字段5"
        v-show="searchShow"
        prop="string">
        <el-input v-model="searchForm.string"></el-input>
      </el-form-item>
      <el-form-item label=""
        :class="{isBlock:searchShow}">
        <el-button @click="submitSearchForm('searchForm')"
          type="primary"
          icon="el-icon-search">{{$t('table.search')}}</el-button>
        <el-button @click="resetForm('searchForm')">{{$t('table.reset')}}</el-button>
        <el-button @click="searchShow = !searchShow"
          type="text">{{$t('table.advancedQuery')}}&nbsp;<i v-if="!searchShow"
            class="el-icon-arrow-down"></i><i v-else
            class="el-icon-arrow-up"></i></el-button>
      </el-form-item>
    </el-form>
    <!-- 表格功能模块 -->
    <el-button-group style="margin-bottom:10px;">
      <el-button @click="addMesg"
        type="primary"
        size="mini"
        icon="el-icon-plus">新增</el-button>
      <el-button type="primary"
        size="mini">中间</el-button>
      <el-button type="primary"
        size="mini">中间</el-button>
      <el-button @click="removeAll"
        type="primary"
        size="mini"
        icon="el-icon-delete">删除</el-button>
    </el-button-group>
    <!-- 表格展示模块 -->
    <egrid v-loading.body="listLoading"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      :column-type="['selection','index']"
      :column-type-props="columnTypeProps"
      :column-key-map="{ label: 'name' }"
      :data="list"
      :columns="columns"
      :columns-props="columnsProps"
      :columns-handler="columnsHandler"
      :columns-schema="columnsSchema"
      @selection-change="changeSelection">
    </egrid>
    <!-- 表格分页 -->
    <el-pagination v-if="pagination.total !== 0"
      class="tiny-pagination"
      @current-change="handleCurrentChange"
      background
      layout="prev, pager, next, jumper"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.currentPage">
    </el-pagination>

    <!-- 功能内容调用 -->
    <el-dialog :title="dialogMesg.edit ? $t('table.edit') : $t('table.add')"
      :append-to-body="true"
      :visible.sync="dialogMesg.visible">
      <table-form ref="formItem"
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
import columnStyle from '@/views/tableList/_components/columnStyle';
import Operate from '@/views/tableList/_components/operate';
import tableForm from '@/views/tableList/_components/tableForm';
import {
  getList,
  saveInfo,
  removeInfo,
  updateInfo,
  removeManyInfo
} from '@/api/table';

export default {
  data() {
    this.columnTypeProps = {
      selection: {
        fixed: 'left',
        width: 50,
        align: 'center'
      },
      index: {
        fixed: 'left',
        label: '序号',
        width: 50,
        align: 'center'
      }
    };
    return {
      searchShow: false,
      searchForm: {
        name: '',
        email: '',
        string: ''
      },
      // columns: [
      //   {
      //     name: '名字',
      //     prop: 'name',
      //     fixed: 'left',
      //     'show-overflow-tooltip': true
      //   },
      //   { name: '地址', prop: 'url' },
      //   { name: '邮箱', prop: 'email' },
      //   { name: '等级', prop: 'string' }
      // ],
      list: null,
      // columnsProps 用于定义所有 columns 公共的属性，
      // 这里属性可以参考这里： http://element.eleme.io/#/zh-CN/component/table#table-column-attributes
      columnsProps: {
        // width: 120,
        sortable: true
      },
      // columnsSchema 可以用来单独定义 columns 的某一列，这里的设置会覆盖 columnsProps 的配置属性
      columnsSchema: {
        地址: {
          align: 'center',
          width: '200',
          // propsHandler 可用于转换传给自定义组件的 props
          propsHandler({ col, row, column }) {
            return {
              col,
              row,
              column,
              val: row[col.prop]
            };
          },
          component: columnStyle
        },
        邮箱: {
          align: 'left',
          width: '150',
          formater(row, col) {
            return row[col.prop] + '...';
          }
        }
      },
      listLoading: true,
      dialogMesg: {
        visible: false,
        disabled: false,
        edit: false,
        id: ''
      },
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10
      },
      multipleSelection: []
      // rules: {
      //   name: [
      //     { required: false, message: '请输入名称', trigger: 'blur' },
      //     { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
      //   ]
      // }
    };
  },
  computed: {
    columns() {
      return [
        {
          name: 'id主键',
          prop: 'id',
          fixed: 'left',
          'show-overflow-tooltip': true
        },
        { name: '日期', prop: 'dateType' },
        { name: '性别', prop: 'sex' },
        { name: '用户数量', prop: 'num' }
      ];
    }
  },
  components: {
    tableForm
  },
  created() {
    this.fetchData();
  },
  mounted() {},
  methods: {
    // columnsHandler 可用于在现有的 columns 进行操作，对 columns 进行增删改，这里新增了操作列
    columnsHandler(cols) {
      const _that = this;
      return cols.concat({
        width: 120,
        fixed: 'right',
        label: '操作',
        align: 'center',
        component: Operate,
        // listeners 可用于监听自定义组件内部 $emit 出的事件
        listeners: {
          'remove-mesg'(row) {
            _that.removeMesg(row._id);
          },
          'updata-mesg'(row) {
            _that.updataMesg(row._id);
          }
        }
      });
    },
    fetchData(obj) {
      this.listLoading = true;
      const data = Object.assign({}, obj);
      data.currentPage = this.pagination.currentPage;
      data.pageSize = this.pagination.pageSize;
      getList(data)
        .then(response => {
          this.list = response.data.items;
          this.pagination.total = response.data.total;
          this.pagination.currentPage = response.data.currentPage;
          this.listLoading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitSearchForm(formName) {
      const data = this.searchForm;
      this.fetchData(data);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addMesg() {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = false;
      this.dialogMesg.id = '';
    },
    changeSelection(val) {
      this.multipleSelection = val;
    },
    removeAll() {
      if (this.multipleSelection.length === 0) {
        this.$message('请先选择数目');
        return;
      }
      const data = {};
      // const _idArr = [];
      // this.multipleSelection.forEach(element => {
      //   _idArr.push(element._id);
      // });
      const _idArr = this.multipleSelection.map(item => {
        return item._id;
      });
      data._id = JSON.stringify(_idArr);

      this.$confirm('是否删除多个信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        removeManyInfo(data)
          .then(response => {
            this.fetchData();
            // this.list = this.list.filter(item => !_idArr.includes(item._id));
            this.$message({
              type: 'success',
              message: '已删除!'
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    removeMesg(id) {
      this.$confirm('是否删除此信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        removeInfo({ _id: id })
          .then(response => {
            this.fetchData();
            // this.list.forEach((element, index) => {
            //   if (element._id === id) {
            //     this.list.splice(index, 1);
            //   }
            // });
            this.$message({
              type: 'success',
              message: '已删除!'
            });
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    updataMesg(id) {
      this.dialogMesg.visible = true;
      this.dialogMesg.edit = true;
      this.dialogMesg.id = id;
    },
    submitForm(formItem) {
      this.$refs[formItem].$refs.postForm.validate(valid => {
        if (valid) {
          this.dialogMesg.disabled = true;
          const data = this.$refs[formItem].postForm;
          if (this.dialogMesg.edit) {
            updateInfo(data)
              .then(response => {
                this.fetchData();
                // this.list.forEach((element, index) => {
                //   if (element._id === data._id) {
                //     this.list.splice(index, 1, data);
                //   }
                // });
                this.$message({
                  type: 'success',
                  message: '成功!'
                });
                this.dialogMesg.disabled = false;
                this.dialogMesg.visible = false;
              })
              .catch(error => {
                console.log(error);
                this.dialogMesg.disabled = false;
              });
          } else {
            saveInfo(data)
              .then(response => {
                this.fetchData();
                // this.list.unshift(response.data);
                this.$message({
                  type: 'success',
                  message: '成功!'
                });
                this.dialogMesg.id = 'newChange';
                this.dialogMesg.disabled = false;
                this.dialogMesg.visible = false;
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
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchData();
    }
  }
};
</script>
