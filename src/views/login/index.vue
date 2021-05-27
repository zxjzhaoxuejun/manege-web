<template>
  <div class="app-container">
    <div class="form-mode">
      <div class="lang-mode">
        <langSelect :show-text="true" />
      </div>
      <h3 class="title">{{ $t('login.title') }}</h3>
      <el-form ref="form" :model="form" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="form.userName" prefix-icon="el-icon-user" :placeholder="$t('login.userPlaceholder')" />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input v-model="form.userPwd" type="password" prefix-icon="el-icon-lock" :placeholder="$t('login.pwdPlaceholder')" />
        </el-form-item>
        <el-form-item class="btn-center">
          <el-button type="primary" class="login-btn" :loading="loading" size="small" @click="submitForm('form')">{{ $t('login.loginBtn') }}</el-button>
          <div class="info-btn">
            <el-button size="small" class="reg-btn" type="text" @click="register">{{ $t('login.forgotBtn') }}</el-button>
            <el-button size="small" class="reg-btn" type="text" @click="register">{{ $t('login.regBtn') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/users'
import langSelect from '@/components/langSelect/index.vue'
export default {
  name: 'Login',
  components: { langSelect },
  data() {
    return {
      loading: false,
      form: {
        userName: '',
        userPwd: ''
      },
      rules: {
        userName: [
          { required: true, message: this.$t('login.userPlaceholder'), trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: this.$t('login.pwdPlaceholder'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过 TODO
          this.loading = true
          login(this.form).then(res => {
            this.loading = false
            this.$store.dispatch('user/saveUserInfo', res.data)
            this.$router.replace('/')
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    register() {
      this.$router.push('/register')
    }
  }
}
</script>

<style scoped lang="scss">
@import './index.scss'
</style>
