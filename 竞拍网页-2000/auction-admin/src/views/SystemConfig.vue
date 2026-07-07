<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>系统配置</span>
      </template>
      
      <el-table :data="tableData" border>
        <el-table-column prop="configKey" label="配置键" width="250" />
        <el-table-column prop="configValue" label="配置值" width="200" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog v-model="dialogVisible" title="编辑配置" width="500px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="配置键">
          <el-input v-model="form.configKey" disabled />
        </el-form-item>
        <el-form-item label="配置值">
          <el-input v-model="form.configValue" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getConfigList, updateConfig } from '@/api/admin'

const tableData = ref([])
const dialogVisible = ref(false)
const form = ref({})

const loadData = async () => {
  try {
    const data = await getConfigList()
    tableData.value = data
  } catch (error) {
    console.error(error)
  }
}

const handleEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await updateConfig(form.value)
    ElMessage.success('更新成功')
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  height: 100%;
}
</style>
