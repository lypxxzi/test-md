<template>
  <div class="login-container">
    <div class="login-box">
      <div class="logo-area">
        <h1 class="title">港大CAREER FAIR 2026</h1>
        <h2 class="subtitle">招募活動競拍</h2>
      </div>
      <el-form :model="form" class="login-form">
        <el-form-item>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="請輸入訪問密碼"
            size="large"
            @keyup.enter="handleLogin"
            clearable
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            size="large" 
            class="login-button"
            @click="handleLogin"
            :loading="loading"
          >
            確認登入
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { verifyPassword } from '@/api/auction'

const router = useRouter()
const form = ref({
  password: ''
})
const loading = ref(false)

const handleLogin = async () => {
  if (!form.value.password) {
    ElMessage.warning('請輸入訪問密碼')
    return
  }
  
  loading.value = true
  try {
    await verifyPassword(form.value.password)
    ElMessage.success('驗證成功')
    router.push('/auction')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  backdrop-filter: blur(10px);
}

.logo-area {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 20px;
  font-weight: 600;
  color: #764ba2;
  margin: 0;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  height: 45px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
}

.login-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* 手机端适配 */
@media screen and (max-width: 480px) {
  .login-box {
    padding: 40px 25px;
    border-radius: 15px;
    margin: 10px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .subtitle {
    font-size: 16px;
  }
}
</style>
