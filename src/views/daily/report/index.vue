<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="日期" prop="day">
        <el-input
            v-model="queryParams.day"
            placeholder="请输入查询的日期"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item label="星期" prop="week">
        <el-select v-model="queryParams.week" placeholder="星期" clearable style="width: 200px">
          <el-option
              v-for="dict in week"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--            type="primary"-->
<!--            plain-->
<!--            icon="Plus"-->
<!--            @click="handleAdd"-->
<!--            v-hasPermi="['daily:report:add']"-->
<!--        >新增-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="reportList">
      <el-table-column label="日期" align="center" prop="day"/>
      <el-table-column label="星期" align="center" prop="week">
        <template #default="scope">
          <dict-tag :options="week" :value="scope.row.week"/>
        </template>
      </el-table-column>

      <el-table-column label="城市" align="center" prop="city"/>
      <el-table-column label="天气" align="center" prop="weather"/>
      <el-table-column label="心情" align="center" prop="mood"/>

      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['daily:report:edit']" v-if="scope.row.reportStatus === 'N'">
            修改
          </el-button>
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['daily:report:edit']" v-if="scope.row.reportStatus === 'Y'">
            查看
          </el-button>
<!--          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"-->
<!--                     v-hasPermi="['daily:report:remove']">删除-->
<!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
    />

  </div>
</template>

<script setup name="Report">

import router from "@/router";
import {listReport, delReport} from "@/api/daily/report";

const {proxy} = getCurrentInstance();
const {week} = proxy.useDict("week");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    day: undefined,
    week: undefined
  },
  rules: {
    postName: [{required: true, message: "岗位名称不能为空", trigger: "blur"}],
    postCode: [{required: true, message: "岗位编码不能为空", trigger: "blur"}],
    postSort: [{required: true, message: "岗位顺序不能为空", trigger: "blur"}],
  }
});

const showSearch = ref(true);
const loading = ref(true);

const reportList = ref([]);
const total = ref(0);

const {queryParams, form, rules} = toRefs(data);

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增按钮操作 */
function handleAdd() {
  // 1
}

/** 查询岗位列表 */
function getList() {
  loading.value = true;
  listReport(queryParams.value).then(response => {
    console.log(response)
    reportList.value = response.rows;
    total.value = response.total;
    loading.value = false;

  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  proxy.$modal.confirm('是否要删除当前日报').then(function () {
    console.log(row)
    return delReport(row.reportId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

function handleUpdate(row) {
  router.push({path: "/daily/report-edit/index/" + row.reportId});
}

getList();
</script>
