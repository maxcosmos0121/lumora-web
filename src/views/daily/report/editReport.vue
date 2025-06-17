<script setup>

import {getReport} from "@/api/daily/report";

import {ref, reactive, toRefs, getCurrentInstance} from 'vue';
import {useDict} from '@/utils/dict';

const route = useRoute();

const {proxy} = getCurrentInstance();
const {content_type} = useDict("content_type");

const form = reactive({
  dailyReport: {
    day: null,
    week: null,
    city: null,
    weather: null,
    mood: null,
  },
  dailyReportContents: [
    {
      contentType: null,
      content: null
    }
  ]
});

const rules = reactive({
  postName: [{required: true, message: "岗位名称不能为空", trigger: "blur"}],
  postCode: [{required: true, message: "岗位编码不能为空", trigger: "blur"}],
  postSort: [{required: true, message: "岗位顺序不能为空", trigger: "blur"}],
});

function handleAdd() {
  form.dailyReportContents.push({
    contentType: null,
    content: null
  });
}

function handleDelete(index) {
  if (form.dailyReportContents.length > 1) {
    form.dailyReportContents.splice(index, 1);
  } else {
    proxy.$modal.msgWarning("至少保留一个日报");
  }
}

function getReportInfo(reportId) {
  getReport(reportId).then((response) => {
    console.log(response.data)
    form.dailyReport = response.data.dailyReport || {};
    form.dailyReportContents = response.data.dailyReportContents || [];
    if (form.dailyReportContents.length === 0) {
      form.dailyReportContents.push({
        contentType: null,
        content: null
      });
    }
  })

}


(() => {
  const reportId = route.params && route.params.reportId;
  if (reportId) {
    getReportInfo(reportId)
  }
})();

</script>

<template>
  <div class="app-container">
    <el-row :gutter="20" v-if="form">
      <el-col :span="5">
        <el-form-item label="日期" prop="day">
          <el-input v-model="form.dailyReport.day" placeholder="请输入日期"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="星期" prop="week">
          <el-input v-model="form.dailyReport.week" placeholder="请输入星期"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.dailyReport.city" placeholder="请输入城市"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="天气" prop="weather">
          <el-input v-model="form.dailyReport.weather" placeholder="请输入天气"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="心情" prop="mood">
          <el-input v-model="form.dailyReport.mood" placeholder="请输入心情"/>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
        >新增日报
        </el-button>
      </el-col>
    </el-row>

    <el-col>
      <el-card v-for="(item, index) in form.dailyReportContents" :key="index" style="margin-top: 20px">
        <el-row justify="space-between">
          <el-select v-model="item.contentType" placeholder="请选择日报类型" clearable style="width: 200px">
            <el-option
                v-for="dict in content_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
          <el-button
              type="danger"
              plain
              icon="Delete"
              @click="handleDelete(index)"
              v-hasPermi="['system:post:remove']"
          >删除
          </el-button>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-input
              v-model="item.content"
              :rows="10"
              type="textarea"
              placeholder="请输入日报内容"
          />
        </el-row>
      </el-card>

    </el-col>

    <el-row justify="end" style="margin-top: 20px">
      <el-button
          type="primary"
          plain
          @click="handleAdd"
      >保存
      </el-button>
      <el-button
          type="success"
          plain
          @click="handleAdd"
      >提交
      </el-button>
    </el-row>


  </div>
</template>

<style scoped lang="scss">

</style>
