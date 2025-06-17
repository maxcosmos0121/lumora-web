<script setup>

const {proxy} = getCurrentInstance();
const {contentType} = proxy.useDict("content_type");

const data = reactive({
  form: {},
  rules: {
    postName: [{required: true, message: "岗位名称不能为空", trigger: "blur"}],
    postCode: [{required: true, message: "岗位编码不能为空", trigger: "blur"}],
    postSort: [{required: true, message: "岗位顺序不能为空", trigger: "blur"}],
  }
});

const {queryParams, form, rules} = toRefs(data);

</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-form-item label="日期" prop="day">
          <el-input v-model="form.day" placeholder="请输入日期"/>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="星期" prop="week">
          <el-input v-model="form.week" placeholder="请输入星期"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="天气" prop="weather">
          <el-input v-model="form.weather" placeholder="请输入天气"/>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="心情" prop="mood">
          <el-input v-model="form.mood" placeholder="请输入心情"/>
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
      <el-card style="margin-top: 20px">
        <el-row justify="space-between">
          <el-select v-model="form.contentType" placeholder="请选择日报类型" clearable style="width: 200px">
            <el-option
                v-for="dict in contentType"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:post:remove']"
          >删除
          </el-button>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-input
              v-model="form.content"

              :rows="10"
              type="textarea"
              placeholder="请输入日报内容"
          />
        </el-row>
      </el-card>
      <el-card style="margin-top: 20px">
        <el-row justify="space-between">
          <el-select v-model="form.contentType" placeholder="请选择日报类型" clearable style="width: 200px">
            <el-option
                v-for="dict in contentType"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:post:remove']"
          >删除
          </el-button>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-input
              v-model="form.content"

              :rows="10"
              type="textarea"
              placeholder="请输入日报内容"
          />
        </el-row>
      </el-card>
      <el-card style="margin-top: 20px">
        <el-row justify="space-between">
          <el-select v-model="form.contentType" placeholder="请选择日报类型" clearable style="width: 200px">
            <el-option
                v-for="dict in contentType"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
          </el-select>
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['system:post:remove']"
          >删除
          </el-button>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-input
              v-model="form.content"

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
