<script setup>

import {getReport, submit, save} from "@/api/daily/report";

import {ref, reactive, toRefs, getCurrentInstance} from 'vue';
import {useDict} from '@/utils/dict';

const route = useRoute();

const type = ref('edit');

const {proxy} = getCurrentInstance();
const formRef = ref(null);
const {content_type} = useDict("content_type");
const {week} = proxy.useDict("week");

const form = reactive({
  dailyExpense: {
    day: null,
    week: null,
    totalAmount: null,
  },
  dailyExpenseDetails: [
    {
      expenseType: null,
      expenseAmount: null,
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
  form.dailyExpenseDetails.push({
    contentType: null,
    content: null,
    status: 'add'
  });
  console.log('dailyExpenseDetails after add:', form.dailyExpenseDetails);
}

function handleSubmit() {
  console.log(form, 'form')
  submit(form).then(response => {
    const obj = {path: "/daily/report"};
    proxy.$router.go(-1);
    proxy.$tab.closeOpenPage(obj);

  })
}

function handleSave() {
  console.log(form, 'form')
  save(form).then(response => {
    const obj = {path: "/daily/report"};
    proxy.$router.go(-1);
    proxy.$tab.closeOpenPage(obj);

  })
}

function handleCancel() {
  const obj = {path: "/daily/report"};
  proxy.$router.go(-1);
  proxy.$tab.closeOpenPage(obj);

}

function handleDelete(index) {
  const nonDeletedItems = form.dailyExpenseDetails.filter(item => item.status !== 'delete');
  if (nonDeletedItems.length === 1) {
    proxy.$modal.msgWarning("至少保留一个日报内容！");
    return;
  }

  proxy.$modal.confirm('确认删除该日报内容吗？').then(() => {
    if (form.dailyExpenseDetails[index].status === 'add') {
      // 新增项可以直接移除
      form.dailyExpenseDetails.splice(index, 1);
    } else {
      // 已有项标记为删除
      form.dailyExpenseDetails[index].status = 'delete';
    }
    proxy.$modal.msgSuccess("删除成功");
    console.log(form)
  }).catch(() => {
  });
}


function getReportInfo(reportId) {
  getReport(reportId).then((response) => {
    console.log(response.data)
    form.dailyExpense = response.data.dailyExpense || {};
    form.dailyExpenseDetails = (response.data.dailyExpenseDetails || []).map(item => ({
      ...item,
      status: 'none' // 从后端获取的数据，状态为无变化
    }));
    if (form.dailyExpenseDetails.length === 0) {
      form.dailyExpenseDetails.push({
        expenseType: null,
        expenseAmount: null,
        status: 'add' // 默认新增状态
      });
    }
  })

}


(() => {

  type.value = route.query.type;

  let obj = Object.assign({}, proxy.$route,
      {title: type.value === 'edit' ? '修改日报' : '查看日报'}
  )
  proxy.$tab.updatePage(obj);

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
        <el-col :span="6">
          <el-form-item label="日期" prop="day">
            <el-input v-model="form.dailyExpense.day" placeholder="请输入日期" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="星期" prop="week">
            <el-select
                v-model="form.dailyExpense.week"
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

        <el-col :span="6">
          <el-form-item label="总金额" prop="city">
            <el-input v-model="form.dailyExpense.totalAmount" placeholder="请输入总金额" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10" class="mb8" v-if="type === 'edit'">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
          >新增支出
          </el-button>
        </el-col>
      </el-row>

      <el-col>

        <template v-for="(item, index) in form.dailyExpenseDetails" :key="index">
          <el-card v-if="item.status !== 'delete'" style="margin-top: 20px">
            <el-row >

              <el-col :span="4">
                <el-select
                    v-model="item.expenseType"
                    placeholder="请选择支付类型"
                    clearable
                    style="width: 200px"
                    :disabled="type !== 'edit'"
                >
                  <el-option
                      v-for="dict in content_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                  />
                </el-select>
              </el-col>

              <el-col :span="4">
                <el-input
                    v-model="item.expenseAmount"
                    :rows="10"
                    placeholder="请输入支付金额"
                    :disabled="type !== 'edit'"
                />
              </el-col>

              <el-col :span="4">
                <el-input
                    v-model="item.expenseAmount"
                    :rows="10"
                    placeholder="请输入备注"
                    :disabled="type !== 'edit'"
                />
              </el-col>

              <el-col :span="2">
                <el-button
                    type="danger"
                    plain
                    icon="Delete"
                    @click="handleDelete(index)"
                    v-if="type === 'edit'"
                >
                  删除
                </el-button>
              </el-col>

            </el-row>


          </el-card>
        </template>


      </el-col>

      <el-row justify="end" style="margin-top: 20px" v-if="type === 'edit'">
        <el-button
            type="warning"
            plain
            @click="handleCancel"
        >取消
        </el-button>
        <el-button
            type="primary"
            plain
            @click="handleSave"
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
