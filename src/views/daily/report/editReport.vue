<script setup>

import {getReport, submit} from "@/api/daily/report";

import useTagsViewStore from '@/store/modules/tagsView'

import {ref, reactive, toRefs, getCurrentInstance} from 'vue';
import {useDict} from '@/utils/dict';

const route = useRoute();

const {proxy} = getCurrentInstance();
const formRef = ref(null);
const {content_type} = useDict("content_type");
const {week} = proxy.useDict("week");

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
      content: null,
      status: 'add' // 默认新增状态
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
    content: null,
    status: 'add'
  });
  console.log('dailyReportContents after add:', form.dailyReportContents);
}

function handleSubmit() {
  console.log(form, 'form')
  submit(form).then(response => {
    const obj = {path: "/daily/report"};
    proxy.$tab.closeOpenPage(obj);
    proxy.$router.go(-1);
  })
}

function handleDelete(index) {
  const nonDeletedItems = form.dailyReportContents.filter(item => item.status !== 'delete');
  if (nonDeletedItems.length === 1) {
    proxy.$modal.msgWarning("至少保留一个日报内容！");
    return;
  }

  proxy.$modal.confirm('确认删除该日报内容吗？').then(() => {
    if (form.dailyReportContents[index].status === 'add') {
      // 新增项可以直接移除
      form.dailyReportContents.splice(index, 1);
    } else {
      // 已有项标记为删除
      form.dailyReportContents[index].status = 'delete';
    }
    proxy.$modal.msgSuccess("删除成功");
    console.log(form)
  }).catch(() => {
  });
}


function getReportInfo(reportId) {
  getReport(reportId).then((response) => {
    console.log(response.data)
    form.dailyReport = response.data.dailyReport || {};
    form.dailyReportContents = (response.data.dailyReportContents || []).map(item => ({
      ...item,
      status: 'none' // 从后端获取的数据，状态为无变化
    }));
    if (form.dailyReportContents.length === 0) {
      form.dailyReportContents.push({
        contentType: null,
        content: null,
        status: 'add' // 默认新增状态
      });
    }
    console.log('dailyReportContents after getReportInfo:', form.dailyReportContents);
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
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="20" v-if="form">
        <el-col :span="4">
          <el-form-item label="日期" prop="day">
            <el-input v-model="form.dailyReport.day" placeholder="请输入日期" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="星期" prop="week">
            <el-select
                v-model="form.dailyReport.week"
                placeholder="请选择星期"
                clearable
                style="width: 200px"
                disabled
            >
              <el-option
                  v-for="dict in week"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
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

        <template v-for="(item, index) in form.dailyReportContents" :key="index">
          <el-card v-if="item.status !== 'delete'" style="margin-top: 20px">
            <el-row justify="space-between">
              <el-select
                  v-model="item.contentType"
                  placeholder="请选择日报类型"
                  clearable
                  style="width: 200px"
              >
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
              >
                删除
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
        </template>


      </el-col>

      <el-row justify="end" style="margin-top: 20px">
        <el-button
            type="primary"
            plain
            @click="handleSubmit"
        >保存
        </el-button>
        <el-button
            type="success"
            plain
            @click="handleSubmit"
        >提交
        </el-button>
      </el-row>
    </el-form>

  </div>
</template>

<style scoped lang="scss">

</style>
