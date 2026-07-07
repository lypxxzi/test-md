<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <span>竞拍记录</span>
      </template>
      
      <el-table :data="tableData" border>
        <el-table-column prop="auctionDate" label="竞拍日期" width="120" />
        <el-table-column prop="userName" label="用户姓名" width="120" />
        <el-table-column prop="agentCode" label="代理人代码" width="150" />
        <el-table-column prop="businessArea" label="营业区" />
        <el-table-column prop="bidPrice" label="竞拍价格" width="120">
          <template #default="{ row }">{{ row.bidPrice }}🍎</template>
        </el-table-column>
        <el-table-column prop="isWinning" label="是否中标" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isWinning === 1 ? 'success' : 'info'">
              {{ row.isWinning === 1 ? '中标' : '未中标' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bidTime" label="竞拍时间" width="180">
          <template #default="{ row }">{{ formatDateTime(row.bidTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="showTimeline(row)">动态</el-button>
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

    <el-dialog v-model="timelineVisible" :title="timelineTitle" width="600px">
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
              {{ item.userName }}（{{ item.businessArea }}）· 竞拍日期：{{ item.auctionDate || '-' }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBidRecordList, getUserBidTimeline } from '@/api/admin'

const tableData = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatDateTime = (dt) => {
  if (!dt) return ''
  const d = new Date(dt)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const timelineVisible = ref(false)
const timelineData = ref([])
const timelineTitle = ref('竞拍动态')

const showTimeline = async (row) => {
  try {
    timelineTitle.value = `${row.userName} 的竞拍动态`
    const data = await getUserBidTimeline(row.userId)
    timelineData.value = data.records || []
    timelineVisible.value = true
  } catch (error) {
    console.error(error)
  }
}

const loadData = async () => {
  try {
    const data = await getBidRecordList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    tableData.value = data.records
    total.value = data.total
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
