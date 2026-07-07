<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>竞拍商品列表</span>
          <el-button type="primary" @click="showAddDialog">添加商品</el-button>
        </div>
      </template>
      
      <el-table :data="tableData" border>
        <el-table-column prop="auctionDate" label="竞拍日期" width="150" />
        <el-table-column prop="activityName" label="活动名称" width="200" />
        <el-table-column prop="currentPrice" label="当前价格" width="120">
          <template #default="{ row }">{{ row.currentPrice }}🍎</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.status === 0">待开始</el-tag>
            <el-tag v-else-if="row.status === 1" type="success">进行中</el-tag>
            <el-tag v-else type="info">已结束</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="winningUserId" label="中标用户ID" width="120" />
        <el-table-column label="竞拍控制" width="150" align="center">
          <template #default="{ row }">
            <template v-if="row.status === 2">
              <el-tag type="info">已结束</el-tag>
            </template>
            <template v-else>
              <el-switch 
                :model-value="row.status === 1"
                active-text="开启"
                inactive-text="关闭"
                @change="(val) => { row.status = val ? 1 : 0; handleStatusChange(row) }"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" size="small" @click="showTimeline(row)">动态</el-button>
            <el-button 
              v-if="row.status === 1" 
              type="warning" 
              size="small" 
              @click="handleSettle(row)"
            >结算</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadData"
        style="margin-top: 20px; justify-content: center;"
      />
    </el-card>
    
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="竞拍日期">
          <el-date-picker v-model="form.auctionDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="form.activityName" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="起拍价">
          <el-input v-model.number="form.startPrice" type="number" />
        </el-form-item>
        <el-form-item label="加价幅度">
          <el-input v-model.number="form.priceIncrement" type="number" />
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.startTime" type="datetime" placeholder="选择开始时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择结束时间" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="timelineVisible" title="竞拍动态" width="600px">
      <div v-if="timelineData.length === 0" style="text-align: center; color: #999; padding: 40px 0;">
        暂无竞拍记录
      </div>
      <div v-else class="timeline-container">
        <div class="timeline-item" v-for="(item, index) in timelineData" :key="item.id">
          <div class="timeline-dot" :class="{ 'is-latest': index === 0, 'is-winning': item.isWinning === 1 }"></div>
          <div class="timeline-line" v-if="index < timelineData.length - 1"></div>
          <div class="timeline-content" :class="{ 'winning-content': item.isWinning === 1 }">
            <div class="timeline-header">
              <div class="timeline-price-area">
                <span class="timeline-price">出價 {{ item.bidPrice }}🍎</span>
                <el-tag v-if="item.isWinning === 1" type="success" size="small" effect="dark">中標</el-tag>
              </div>
              <span class="timeline-time">{{ formatDateTime(item.bidTime) }}</span>
            </div>
            <div class="timeline-body">
              {{ item.userName }}（{{ item.businessArea }}）· 代理人代碼：{{ item.agentCode }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAuctionList, addAuction, updateAuction, deleteAuction, updateAuctionStatus, getBidTimeline } from '@/api/admin'

const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const form = ref({
  auctionDate: '',
  startPrice: 1000,
  priceIncrement: 100,
  startTime: '09:30:00',
  endTime: '18:00:00'
})

const formatDateTime = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const loadData = async () => {
  try {
    const data = await getAuctionList({pageNum: pageNum.value, pageSize: pageSize.value})
    tableData.value = data.records
    total.value = data.total
  } catch (error) {
    console.error(error)
  }
}

const showAddDialog = () => {
  dialogTitle.value = '添加商品'
  form.value = {
    auctionDate: '',
    activityName: '',
    startPrice: 1000,
    priceIncrement: 100,
    startTime: '',
    endTime: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑商品'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    if (form.value.id) {
      await updateAuction(form.value)
      ElMessage.success('更新成功')
    } else {
      await addAuction(form.value)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    loadData()
  } catch (error) {
    console.error(error)
  }
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteAuction(id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {})
}

const handleStatusChange = async (row) => {
  // 防止已结束的商品被误操作
  if (row.status !== 0 && row.status !== 1) {
    loadData()
    return
  }
  try {
    await updateAuctionStatus(row.id, row.status)
    ElMessage.success(row.status === 1 ? '竞拍已开启' : '竞拍已关闭')
  } catch (error) {
    console.error(error)
    loadData()
  }
}

const handleSettle = (row) => {
  ElMessageBox.confirm('确定要结算该竞拍吗？结算后将标记最高价为中标，且无法再继续竞拍。', '结算确认', {
    confirmButtonText: '确定结算',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await updateAuctionStatus(row.id, 2)
      ElMessage.success('结算成功')
      loadData()
    } catch (error) {
      console.error(error)
    }
  }).catch(() => {})
}

const timelineVisible = ref(false)
const timelineData = ref([])

const showTimeline = async (row) => {
  try {
    const data = await getBidTimeline(row.id)
    timelineData.value = data.records || []
    timelineVisible.value = true
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 10px 0 10px 20px;
}

.timeline-item {
  position: relative;
  padding-left: 24px;
  padding-bottom: 20px;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dcdfe6;
}

.timeline-dot.is-latest {
  background: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
}

.timeline-dot.is-winning {
  background: #67c23a;
  box-shadow: 0 0 0 4px rgba(103, 194, 58, 0.2);
  width: 12px;
  height: 12px;
  left: -1px;
  top: 5px;
}

.timeline-line {
  position: absolute;
  left: 4px;
  top: 20px;
  width: 2px;
  bottom: 0;
  background: #e4e7ed;
}

.timeline-content {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px 16px;
}

.timeline-content.winning-content {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.timeline-price-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.timeline-price {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

.timeline-time {
  font-size: 12px;
  color: #909399;
}

.timeline-body {
  font-size: 13px;
  color: #606266;
}
</style>
