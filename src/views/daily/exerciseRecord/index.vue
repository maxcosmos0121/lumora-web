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


    <el-table v-loading="loading" :data="exerciseRecordList">
      <el-table-column label="日期" align="center" prop="day"/>
      <el-table-column label="星期" align="center" prop="week">
        <template #default="scope">
          <dict-tag :options="week" :value="scope.row.week"/>
        </template>
      </el-table-column>

      <el-table-column label="体重" align="center" prop="weight"/>


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

<script setup>

import {listExerciseRecord} from "@/api/daily/exerciseRecord";

const showSearch = ref(true);
const loading = ref(true);
const total = ref(0);

const {proxy} = getCurrentInstance();
const {week} = proxy.useDict("week");

const exerciseRecordList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    day: undefined,
    week: undefined
  }
});

const {queryParams, form} = toRefs(data);
/** 查询岗位列表 */
function getList() {
  loading.value = true;
  listExerciseRecord(queryParams.value).then(response => {
    exerciseRecordList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

getList();
</script>
