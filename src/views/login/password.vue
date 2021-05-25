<template>
  <div class="app-container">
    <div class="form-mode">

      <h3 class="title">{{ $t('password.title') }}</h3>
      <el-form ref="form" :model="form" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="oldPwd">
          <el-input v-model="form.oldPwd" type="password" prefix-icon="el-icon-lock" :placeholder="$t('password.oldpassword')" />
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input v-model="form.userPwd" type="password" prefix-icon="el-icon-lock" :placeholder="$t('password.pwdPlaceholder')" />
        </el-form-item>
        <el-form-item prop="notarizePwd">
          <el-input v-model="form.notarizePwd" type="password" prefix-icon="el-icon-lock" :placeholder="$t('password.notarizePwdPlaceholder')" />
        </el-form-item>

        <el-form-item class="btn-center">
          <el-button type="primary" class="login-btn" :loading="loading" size="small" @click="submitForm('form')">{{ $t('password.psdBtn') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { password } from '@/api/users'
import sha1 from 'sha1'
import checkMinis from './mini'
export default {
  name: 'Password',
  mixins: [checkMinis],
  data() {
    return {
      loading: false,
      form: {
        userPwd: '',
        notarizePwd: '',
        oldPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: this.$t('password.oldpassword'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkPassword }
        ],
        userPwd: [
          { required: true, message: this.$t('password.pwdPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkPassword }
        ],
        notarizePwd: [
          { required: true, message: this.$t('password.notarizePwdPlaceholder'), trigger: 'blur' },
          { trigger: 'blur', validator: this.checkNotarizePwd }
        ]
      }
    }
  },
  created() {
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 校验通过 TODO
          this.loading = true
          const { oldPwd, userPwd } = this.form
          password({ oldPwd: sha1(oldPwd), 'userPwd': sha1(userPwd) }).then(res => {
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
    }
  }
}
</script>

<style scoped lang="scss">
@import './index.scss'
</style>
