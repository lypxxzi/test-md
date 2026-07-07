<template>
  <div class="auction-container">
    <div class="header">
      <div class="title-area">
        <h1 class="title">港大CAREER FAIR 2026</h1>
        <h2 class="subtitle">招募活動競拍</h2>
      </div>
    </div>

    <!-- PC端表格视图 -->
    <div class="auction-content pc-view">
      <el-table 
        :data="auctionList" 
        stripe 
        border
        style="width: 100%"
        :header-cell-style="{ background: '#667eea', color: '#fff', fontSize: '16px' }"
      >
        <el-table-column prop="auctionDate" label="活動日期" width="150" align="center">
          <template #default="{ row }">
            {{ formatDate(row.auctionDate) }}
          </template>
        </el-table-column>

        <el-table-column prop="activityName" label="活動名稱" width="200" align="center">
          <template #default="{ row }">
            <span v-if="row.activityName">{{ row.activityName }}</span>
            <span v-else style="color: #999;">-</span>
          </template>
        </el-table-column>

        <el-table-column label="倒計時" width="200" align="center">
          <template #default="{ row }">
            <div class="countdown-cell" v-if="row.countdown">
              <span class="countdown-cell-label" v-if="row.countdown.label">{{ row.countdown.label }}</span>
              <span class="countdown-cell-text" :class="row.countdown.type">{{ row.countdown.text }}</span>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="currentPrice" label="目前競拍價格" width="200" align="center">
          <template #default="{ row }">
            <span class="price">{{ row.currentPrice }}🍎</span>
          </template>
        </el-table-column>
        
        <el-table-column label="競拍按鈕" width="150" align="center">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              :disabled="!row.canBid"
              @click="showBidDialog(row)"
            >
              競拍
            </el-button>
          </template>
        </el-table-column>
        
        <el-table-column prop="winningBusinessArea" label="中標營業區" align="center">
          <template #default="{ row }">
            <span v-if="row.winningBusinessArea">{{ row.winningBusinessArea }}</span>
            <span v-else style="color: #999;">-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 手机端卡片视图 -->
    <div class="auction-content mobile-view">
      <div class="auction-card" v-for="item in auctionList" :key="item.id">
        <div class="card-header">
          <span class="card-date">{{ formatDate(item.auctionDate) }}</span>
          <el-tag v-if="item.status === 1" type="success" size="small">進行中</el-tag>
          <el-tag v-else-if="item.status === 2" type="info" size="small">已結束</el-tag>
          <el-tag v-else type="warning" size="small">待開始</el-tag>
        </div>
        <div class="card-body">
          <div class="card-row" v-if="item.activityName">
            <span class="card-label">活動名稱</span>
            <span class="card-value">{{ item.activityName }}</span>
          </div>
          <div class="card-row" v-if="item.countdown">
            <span class="card-label">{{ item.countdown.label }}</span>
            <span class="card-countdown" :class="item.countdown.type">{{ item.countdown.text }}</span>
          </div>
          <div class="card-row">
            <span class="card-label">目前價格</span>
            <span class="card-price">{{ item.currentPrice }}🍎</span>
          </div>
          <div class="card-row">
            <span class="card-label">中標營業區</span>
            <span class="card-value">{{ item.winningBusinessArea || '-' }}</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button 
            type="primary" 
            :disabled="!item.canBid"
            @click="showBidDialog(item)"
            class="bid-btn"
          >
            {{ item.canBid ? '立即競拍' : '暫不可競拍' }}
          </el-button>
        </div>
      </div>
    </div>

    <el-dialog 
      v-model="dialogVisible" 
      title="競拍資訊填寫" 
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <div class="dialog-countdown" v-if="selectedItem?.countdown">
        <span class="dialog-countdown-label">{{ selectedItem.countdown.label }}：</span>
        <span class="dialog-countdown-text">{{ selectedItem.countdown.text }}</span>
      </div>
      <el-form :model="bidForm" label-width="80px" class="bid-form">
        <el-form-item label="當前價格">
          <el-text>{{ selectedItem?.currentPrice }}🍎</el-text>
        </el-form-item>
        <el-form-item label="目標價格" required>
          <div class="target-price-input">
            <el-input-number 
              v-model="bidForm.targetPrice" 
              :min="selectedItem?.currentPrice + 100"
              :step="100"
              :precision="0"
              controls-position="right"
              @change="validateTargetPrice"
            />
            <span class="price-unit">🍎</span>
          </div>
          <div class="price-hint">最低 {{ selectedItem?.currentPrice + 100 }}🍎，需為100的整數倍</div>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="bidForm.name" placeholder="請輸入姓名" />
        </el-form-item>
        <el-form-item label="代理人碼" required>
          <el-input v-model="bidForm.agentCode" placeholder="請輸入代理人代碼" />
        </el-form-item>
        <el-form-item label="營業區" required>
          <el-input v-model="bidForm.businessArea" placeholder="請輸入營業區名稱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBid" :loading="bidLoading">
          確認競拍
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getAuctionList, placeBid } from '@/api/auction'

const windowWidth = ref(window.innerWidth)
const dialogWidth = computed(() => windowWidth.value < 480 ? '90%' : '500px')

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const auctionList = ref([])
const dialogVisible = ref(false)
const selectedItemId = ref(null)
const selectedItem = computed(() => {
  if (!selectedItemId.value) return null
  return auctionList.value.find(item => item.id === selectedItemId.value) || null
})
const bidForm = ref({
  name: '',
  agentCode: '',
  businessArea: '',
  targetPrice: 0
})
const bidLoading = ref(false)
let timer = null
let refreshTimer = null

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

const updateCountdown = () => {
  if (!auctionList.value || auctionList.value.length === 0) return
  
  const now = new Date()
  
  for (const item of auctionList.value) {
    // 优先判断状态：如果已结束(status=2)，直接显示已结束
    if (item.status === 2) {
      item.countdown = { label: '', text: '已結束', type: 'countdown-ended' }
      continue
    }
    
    const startDateTime = new Date(item.startTime)
    const endDateTime = new Date(item.endTime)
    
    // 待开始状态(status=0)或时间未到
    if (item.status === 0 || now < startDateTime) {
      const diff = startDateTime - now
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      const timeStr = days > 0
        ? `${days}天 ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      
      item.countdown = { label: '距離開始', text: timeStr, type: 'countdown-pending' }
    } else if (item.status === 1 && now >= startDateTime && now < endDateTime) {
      // 进行中状态(status=1)且在时间范围内
      const diff = endDateTime - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      
      item.countdown = {
        label: '距離結束',
        text: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
        type: 'countdown-active'
      }
    } else {
      // 其他情况显示已结束
      item.countdown = { label: '', text: '已結束', type: 'countdown-ended' }
    }
  }
}

const loadAuctionList = async () => {
  try {
    const data = await getAuctionList()
    auctionList.value = data
    updateCountdown()
  } catch (error) {
    console.error('載入競拍列表失敗:', error)
  }
}

const showBidDialog = (item) => {
  selectedItemId.value = item.id
  const minPrice = item.currentPrice + 100
  bidForm.value = {
    name: '',
    agentCode: '',
    businessArea: '',
    targetPrice: minPrice
  }
  dialogVisible.value = true
}

const validateTargetPrice = (value) => {
  if (!selectedItem.value) return
  const minPrice = selectedItem.value.currentPrice + 100
  // 确保是100的整数倍
  const remainder = value % 100
  if (remainder !== 0) {
    bidForm.value.targetPrice = Math.ceil(value / 100) * 100
  }
  // 确保大于当前价格
  if (bidForm.value.targetPrice < minPrice) {
    bidForm.value.targetPrice = minPrice
  }
}

const handleBid = async () => {
  if (!bidForm.value.name || !bidForm.value.agentCode || !bidForm.value.businessArea) {
    ElMessage.warning('請填寫完整資訊')
    return
  }
  
  const minPrice = selectedItem.value.currentPrice + 100
  if (bidForm.value.targetPrice < minPrice || bidForm.value.targetPrice % 100 !== 0) {
    ElMessage.warning('目標價格必須大於當前價格且為100的整數倍')
    return
  }
  
  bidLoading.value = true
  try {
    await placeBid({
      auctionItemId: selectedItem.value.id,
      name: bidForm.value.name,
      agentCode: bidForm.value.agentCode,
      businessArea: bidForm.value.businessArea,
      targetPrice: bidForm.value.targetPrice
    })
    ElMessage.success('競拍成功！')
    dialogVisible.value = false
    await loadAuctionList()
  } catch (error) {
    console.error('競拍失敗:', error)
  } finally {
    bidLoading.value = false
  }
}

onMounted(async () => {
  await loadAuctionList()
  timer = setInterval(updateCountdown, 1000)
  refreshTimer = setInterval(loadAuctionList, 3000)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (refreshTimer) clearInterval(refreshTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.auction-container {
  min-height: 100vh;
  padding: 40px 20px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.title-area {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #764ba2;
  margin: 5px 0 0 0;
}

/* 行内倒计时样式 */
.countdown-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.countdown-cell-label {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}

.countdown-cell-text {
  font-variant-numeric: tabular-nums;
  letter-spacing: 1px;
}

.countdown-cell-text.countdown-pending {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
}

.countdown-cell-text.countdown-active {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.countdown-cell-text.countdown-ended {
  font-size: 14px;
  color: #c0c4cc;
}

.card-countdown {
  font-variant-numeric: tabular-nums;
}

.card-countdown.countdown-pending {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.card-countdown.countdown-active {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.card-countdown.countdown-ended {
  font-size: 14px;
  color: #c0c4cc;
}


.auction-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* PC端显示表格，手机端隐藏 */
.pc-view {
  display: block;
}

.mobile-view {
  display: none;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

/* 手机端卡片样式 */
.auction-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.card-date {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.card-body {
  padding: 15px 0;
}

.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-row:last-child {
  margin-bottom: 0;
}

.card-label {
  font-size: 14px;
  color: #666;
}

.card-price {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.card-value {
  font-size: 14px;
  color: #333;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.bid-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
}

:deep(.el-table) {
  font-size: 16px;
}

:deep(.el-table td) {
  padding: 20px 0;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  opacity: 0.9;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

/* 手机端适配 */
@media screen and (max-width: 768px) {
  .auction-container {
    padding: 15px 10px;
  }
  
  .header {
    flex-direction: column;
    padding: 15px 20px;
    gap: 15px;
    text-align: center;
  }
  
  .title-area {
    align-items: center;
  }
  
  .title {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 14px;
  }
  
  
  .pc-view {
    display: none;
  }
  
  .mobile-view {
    display: block;
    padding: 15px;
  }
  
  .auction-content {
    padding: 0;
    background: transparent;
    box-shadow: none;
  }
  
  :deep(.el-form-item__label) {
    width: 80px !important;
    font-size: 14px;
    white-space: nowrap;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 15px;
  }
  
  .bid-form {
    :deep(.el-form-item__label) {
      width: 70px !important;
    }
  }
}

.bid-form {
  :deep(.el-form-item) {
    display: flex;
    align-items: flex-start;
  }
  
  :deep(.el-form-item__label) {
    flex-shrink: 0;
    white-space: nowrap;
  }
}

.target-price-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-unit {
  font-size: 16px;
}

.price-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.dialog-countdown {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.dialog-countdown-label {
  font-size: 13px;
  opacity: 0.9;
}

.dialog-countdown-text {
  font-size: 20px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
}
</style>
