<template>
  <div class="app-container">
    <div class="form-mode">
      <div class="lang-mode">
        <langSelect :show-text="true" />
      </div>
      <h3 class="title">{{ $t('login.title') }}</h3>
      <el-form ref="form" :model="form" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="userName">
          <el-input v-model="form.userName" prefix-icon="el-icon-user" :placeholder="$t('register.userPlaceholder')" />
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" prefix-icon="el-icon-mobile" :placeholder="$t('register.telPlaceholder')" />
        </el-form-item>
        <el-form-item prop="userEmail">
          <el-input v-model="form.userEmail" prefix-icon="el-icon-message" :placeholder="$t('register.emailPlaceholder')" />
        </el-form-item>

        <el-form-item prop="sex">
          <el-select v-model="form.sex" style="width:100%" :placeholder="$t('register.sexPlaceholder')">
            <template #prefix>
              <i class="el-icon-female" />
            </template>
            <el-option label="男" value="0" />
            <el-option label="女" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input v-model="form.userPwd" type="password" prefix-icon="el-icon-lock" :placeholder="$t('register.pwdPlaceholder')" />
        </el-form-item>
        <el-form-item prop="notarizePwd">
          <el-input v-model="form.notarizePwd" type="password" prefix-icon="el-icon-lock" :placeholder="$t('register.notarizePwdPlaceholder')" />
        </el-form-item>
        <div class="input-two">
          <el-form-item prop="code">
            <el-input v-model="form.code" maxlength="4" :placeholder="$t('register.code')" prefix-icon="el-icon-finished" />
          </el-form-item>
          <span class="code-img" @click="refreshCode" v-html="codeImg" />
        </div>
        <el-form-item class="btn-center">
          <el-button type="primary" class="login-btn" :loading="loading" size="small" @click="submitForm('form')">{{ $t('register.regBtn') }}</el-button>
          <div class="info-btn">
            <el-button size="small" class="reg-btn" type="text" @click="goLogin">{{ $t('login.loginBtn') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { register, getCode } from '@/api/users'
import sha1 from 'sha1'
import langSelect from '@/components/langSelect/index.vue'
import checkMinis from './mini'
export default {
  name: 'Login',
  components: { langSelect },
  mixins: [checkMinis],
  data() {
    return {
      loading: false,
      codeImg: '/',
      form: {
        userName: '',
        userPwd: '',
        mobile: '',
        sex: null,
        userEmail: '',
        notarizePwd: '',
        code: ''
      },
      rules: {
        code: [
          { required: true, message: this.$t('register.code'), trigger: 'blur' }
        ],
        userName: [
          { required: true, message: this.$t('register.userPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkUserName }
        ],
        mobile: [
          { required: true, message: this.$t('register.telPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkPhone }
        ],
        sex: [
          { required: true, message: this.$t('register.sexPlaceholder'), trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: this.$t('register.emailPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkEmail }
        ],
        userPwd: [
          { required: true, message: this.$t('register.pwdPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkPassword }
        ],
        notarizePwd: [
          { required: true, message: this.$t('register.notarizePwdPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkNotarizePwd }
        ]
      }
    }
  },
  created() {
    this.getCodeImg()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过 TODO
          this.loading = true
          const { userName, userPwd, mobile, sex, userEmail, code } = this.form
          register({ userName, 'userPwd': sha1(userPwd), mobile, sex, userEmail, code }).then(res => {
            this.loading = false
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
    getCodeImg() {
      getCode().then(res => {
        this.codeImg = res.data
      })
    },
    refreshCode() {
      this.getCodeImg()
    },
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped lang="scss">
@import './index.scss'
</style>
