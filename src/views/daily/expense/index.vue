<template>
  <div class="app-container">

    <!-- 抽屉编辑控制面板 -->
    <el-drawer
        v-model="drawer"
        title="编辑支出"
        :direction="direction"
        :before-close="handleClose"
        size="40%"
        custom-class="no-scroll-drawer"
    >
      <el-form :model="editForm">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="日期">
              <el-input v-model="editForm.dailyExpense.day" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="星期">
              <el-select v-model="editForm.dailyExpense.week" disabled>
                <el-option v-for="dict in week" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总金额">
              <el-input v-model="editForm.dailyExpense.totalAmount" disabled/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="2.5">
            <el-button type="primary" plain @click="handleAdd" v-if="type === 'edit'">新增</el-button>
          </el-col>
          <el-col :span="2.5">
            <el-button type="warning" plain @click="handleSave" v-if="type === 'edit'">保存</el-button>
          </el-col>
          <el-col :span="2.5">
            <el-button type="success" plain @click="handleSubmit" v-if="type === 'edit'">提交</el-button>
          </el-col>


        </el-row>

        <template v-for="(item, index) in editForm.dailyExpenseDetails" :key="index">
          <el-card v-if="item.status !== 'delete'" style="margin-top: 20px">
            <el-row>
              <el-col :span="5">
                <el-select v-model="item.expenseType" placeholder="请选择支付类型" clearable
                           :disabled="type !== 'edit'">
                  <el-option v-for="dict in expense_type" :key="dict.value" :label="dict.label" :value="dict.value"/>
                </el-select>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-top: 10px">
              <el-col :span="6">
                <el-input-number
                    v-model="item.expenseAmount"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                    :disabled="type !== 'edit'"
                />

              </el-col>

              <el-col :span="15">
                <el-input v-model="item.remark" placeholder="请输入备注" :disabled="type !== 'edit'"/>
              </el-col>

              <el-col :span="3">
                <el-button type="danger" plain icon="Delete" @click="handleDelete(index)" v-if="type === 'edit'">
                  删除
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </template>


      </el-form>
    </el-drawer>

    <!-- 筛选表单 -->
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
          <el-option v-for="dict in week" :key="dict.value" :label="dict.label" :value="dict.value"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="expenseList">
      <el-table-column label="日期" align="center" prop="day"/>
      <el-table-column label="星期" align="center" prop="week">
        <template #default="scope">
          <dict-tag :options="week" :value="scope.row.week"/>
        </template>
      </el-table-column>
      <el-table-column label="总金额" align="center" prop="totalAmount"/>
      <el-table-column label="操作" width="180" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['daily:expense:edit']" v-if="scope.row.expenseStatus === 'N'">编辑
          </el-button>
          <el-button link type="primary" icon="Edit" @click="handleInfo(scope.row)"
                     v-hasPermi="['daily:expense:query']" v-if="scope.row.expenseStatus === 'Y'">
            查看
          </el-button>
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

<script setup name="Expense">
import {ref, reactive, toRefs, getCurrentInstance, watch} from 'vue'
import {ElMessageBox, ElMessage} from 'element-plus'
import {listExpense, getExpense, saveExpense, submitExpense} from '@/api/daily/expense'

const {proxy} = getCurrentInstance()
const {week} = proxy.useDict("week")
const {expense_type} = proxy.useDict("expense_type")

const drawer = ref(false)
const direction = ref('ltr')
const loading = ref(true)
const showSearch = ref(true)
const expenseList = ref([])
const total = ref(0)
const type = ref('edit')

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    day: undefined,
    week: undefined
  }
})
const {queryParams} = toRefs(data)

const editForm = reactive({
  dailyExpense: {
    day: null,
    week: null,
    totalAmount: null
  },
  dailyExpenseDetails: []
})

const handleClose = (done) => {
  if (type !== 'edit'){
    drawer.value = false
    return
  }
  ElMessageBox.confirm('确认关闭编辑？未保存的更改将丢失。')
      .then(() => done())
      .catch(() => {
      })
}

const handleUpdate = (row) => {
  type.value = 'edit'
  getExpense(row.expenseId).then(res => {
    console.log(res, 'res')
    editForm.dailyExpense = res.data.dailyExpense || {}
    editForm.dailyExpenseDetails = (res.data.dailyExpenseDetails || []).map(item => ({
      ...item,
      status: 'none' // 标记为无变化
    }))
    if (editForm.dailyExpenseDetails.length === 0) {
      editForm.dailyExpenseDetails.push({
        expenseType: null,
        expenseAmount: null,
        remark: null,
        status: 'add'
      })
    }
    drawer.value = true
  })

}


const handleSubmit = () => {
  submitExpense(editForm).then(() => {
    ElMessage.success('提交成功')
    drawer.value = false
    getList()
  })
}

const handleSave = () => {
  console.log(editForm, 'editForm')
  saveExpense(editForm).then(() => {

    ElMessage.success('保存成功')
    drawer.value = false
    getList()
  })
}

const handleQuery = () => {
  queryParams.value.pageNum = 1
  getList()
}

const resetQuery = () => {
  proxy.resetForm("queryRef")
  handleQuery()
}

const getList = () => {
  loading.value = true
  listExpense(queryParams.value).then((response) => {
    expenseList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

const handleAdd = () => {
  // 新增一条支出详情，字段名和状态和之前代码保持一致
  editForm.dailyExpenseDetails.push({
    expenseType: null,
    expenseAmount: null,
    remark: null, // 备注字段需要新增
    status: 'add'
  })
}

const handleDelete = (index) => {
  const nonDeletedItems = editForm.dailyExpenseDetails.filter(item => item.status !== 'delete')
  if (nonDeletedItems.length === 1) {
    proxy.$modal.msgWarning("至少保留一个日报内容！")
    return
  }

  proxy.$modal.confirm('确认删除该日报内容吗？').then(() => {
    if (editForm.dailyExpenseDetails[index].status === 'add') {
      // 新增项直接删除
      editForm.dailyExpenseDetails.splice(index, 1)
    } else {
      // 已有项标记为删除状态
      editForm.dailyExpenseDetails[index].status = 'delete'
    }
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {
    // 取消删除不做操作
  })
}

const handleInfo = (row) => {
  type.value = 'info'
  getExpense(row.expenseId).then(res => {
    editForm.dailyExpense = res.data.dailyExpense || {}
    editForm.dailyExpenseDetails = res.data.dailyExpenseDetails || []
    drawer.value = true
  })
}


watch(() => editForm.dailyExpenseDetails, (newVal) => {
  const total = newVal.reduce((sum, item) => {
    if (item.status !== 'delete' && item.expenseAmount) {
      return sum + Number(item.expenseAmount)
    }
    return sum
  }, 0)
  editForm.dailyExpense.totalAmount = total.toFixed(2)
}, {deep: true})


getList()
</script>

<style scoped>
::v-deep(.no-scroll-drawer .el-drawer__body) {
  overflow-y: auto !important; /* 允许滚动 */
  scrollbar-width: none; /* Firefox 隐藏滚动条 */
  -ms-overflow-style: none; /* IE 10+ 隐藏滚动条 */
}

::v-deep(.no-scroll-drawer .el-drawer__body::-webkit-scrollbar) {
  display: none; /* Chrome/Safari 隐藏滚动条 */
}

</style>

