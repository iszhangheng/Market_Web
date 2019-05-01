<template>
  <div class="tiny-container">
    <h3 class="page-title">{{this.$t('route.deviceAttributes')}}</h3>
    <el-form class="search-form"
      :inline="true"
      size="mini">
      <!-- 设备选择 -->
      <el-form-item :label="this.$t('views.deviceModel')"
        v-if="activeName === 'first'"
        prop="name">
        <el-select v-model="nameObj.name"
          clearable
          placeholder="请选择设备型号">
          <el-option v-for="item in nameObj.list"
            :key="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 时间选择 -->
      <el-form-item prop="name"
        v-if="activeName === 'second' || activeName === 'first'"
        :label="this.$t('views.dateType')">
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
        <el-button @click="query()"
          type="primary"
          icon="el-icon-search">{{$t('table.query')}}</el-button>
      </el-form-item>
      <!-- 导出模块 -->
      <el-form-item label="">
        <export-excel id="test"
          ref="exportExcelChild"
          :columns='columns'
          :list='listExcel'
          @initExcelList='initExcelList'></export-excel>
      </el-form-item>
    </el-form>
    <div class="uba-content">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="this.$t('equipment.model')"
          name="first">
          <equ-type v-if="activeName === 'first'"
            ref="equtypeChild"
            :date="datePop"
            :name="name"></equ-type>
        </el-tab-pane>
        <el-tab-pane :label="this.$t('equipment.os')"
          name="second">
          <os-usernum v-if="activeName === 'second'"
            ref="osChild"
            :date="datePop"></os-usernum>
        </el-tab-pane>
        <!-- <el-tab-pane :label="this.$t('equipment.message')"
          name="third">
          <equip-info-replace v-if="activeName === 'third'"
            ref="equcycChild"
            :date="datePop"></equip-info-replace>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import equipInfoReplace from './equipInfoReplace/index';
import equType from './equType/index';
import osUsernum from './osUsernum/index';
import mixin from '@/utils/mixin';
import userApi from '@/api/user';
import ExportExcel from '@/components/ExportExcel/index';
export default {
  name: 'deviceattribute',
  mixins: [mixin],
  components: { equipInfoReplace, equType, osUsernum, ExportExcel },
  data() {
    return {
      columns: [],
      listExcel: [],
      nameObj: {
        list: [],
        name: ''
      },
      date: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      name: '',
      datePop: [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date()
      ],
      activeName: 'first'
    };
  },
  mounted() {
    // this.$refs.equtypeChild.init();
    const data = {
      startDate: '',
      endDate: ''
    };
    userApi
      .devVersion(data)
      .then(res => {
        const nameList = [];
        res.robj.items.map(item => {
          if (
            item.devModel === undefined ||
            item.devModel === null ||
            item.devModel === ''
          ) {
            item.devModel === '未知';
          }
          nameList.push(item.devModel);
        });
        this.nameObj.list = [];
        for (let i = 0; i < nameList.length; i++) {
          let tager = true;
          for (let j = 0; j < this.nameObj.list.length; j++) {
            if (this.nameObj.list[j] === nameList[i]) {
              tager = false;
            }
          }
          if (tager) {
            this.nameObj.list.push(nameList[i]);
          }
        }
        // console.log(this.nameObj.list);
      })
      .catch(res => {
        this.message.error('数据请求失败');
      });
  },
  methods: {
    query() {
      if (this.activeName === 'first') {
        this.datePop = this.date;
        this.name = this.nameObj.name;
      }
      if (this.activeName === 'second') {
        this.datePop = this.date;
      }
      if (this.activeName === 'third') {
        this.datePop = this.date;
      }
    },
    initExcelList() {
      // 导出数据请求
      const data = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      if (this.activeName === 'first') {
        this.columns = this.$refs.equtypeChild.columns;
        const data = {
          startDate: this.startDate,
          endDate: this.endDate,
          devModel: this.nameObj.name
        };
        userApi
          .devVersion(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'second') {
        this.columns = this.$refs.osChild.columns;
        userApi
          .osUserNum(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
      if (this.activeName === 'third') {
        this.columns = this.$refs.equcycChild.columns;
        userApi
          .userInfoDev(data)
          .then(res => {
            if (res.robj.items.length > 0) {
              this.listExcel = res.robj.items;
            } else {
              this.$message.warning('数据为空,不能执行导出操作');
              this.$refs.exportExcelChild.downloadLoading = false;
            }
          })
          .catch(res => {
            this.$message.error('导出数据请求失败');
          });
      }
    }
  }
};
</script>
