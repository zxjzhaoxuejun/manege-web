import { isIllegalCharCheck, validPhone, validStringLen, validPassword, validEmail } from '@/utils/validate'
export default {
  methods: {
    checkPhone(rule, value, callback) {
      if (!validPhone(value)) {
        callback(new Error(this.$t('register.telError')))
      } else {
        callback()
      }
    },
    checkEmail(rule, value, callback) {
      if (!validEmail(value)) {
        callback(new Error(this.$t('register.emailError')))
      } else {
        callback()
      }
    },
    checkPassword(rule, value, callback) {
      if (!validPassword(value)) {
        callback(new Error(this.$t('register.passwordError')))
      } else {
        callback()
      }
    },
    checkNotarizePwd(rule, value, callback) {
      if (!validPassword(value)) {
        callback(new Error(this.$t('register.passwordError')))
      } else if (value !== this.form.userPwd) {
        callback(new Error(this.$t('register.notarizePwdError')))
      } else {
        callback()
      }
    },
    checkUserName(rule, value, callback) {
      if (isIllegalCharCheck(value)) {
        callback(new Error(this.$t('register.isIllegalCharCheck')))
      } else if (!validStringLen(value, 30)) {
        callback(new Error(this.$t('register.userNameError')))
      } else {
        callback()
      }
    }

  }
}
