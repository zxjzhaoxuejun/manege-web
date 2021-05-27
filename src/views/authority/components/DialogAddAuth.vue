<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
    <el-form-item :label="$t('authority.prentId')" prop="parentId">
      <el-select v-model="ruleForm.parentId" :disabled="!!editObj" @change="authTreeChange">
        <el-option v-for="item in authTree" :key="item._id" :label="item.menuName" :value="item._id" />
      </el-select>
    </el-form-item>
    <el-form-item :label="$t('authority.authName')" prop="menuName">
      <el-input v-model="ruleForm.menuName" />
    </el-form-item>
    <el-form-item :label="$t('authority.authCode')" prop="menuCode">
      <el-input v-model="ruleForm.menuCode" />
    </el-form-item>
    <el-form-item :label="$t('authority.authType')" prop="type">
      <el-radio-group v-model="ruleForm.type" :disabled="!!editObj">
        <el-radio :label="0">{{ $t('authority.menu') }}</el-radio>
        <el-radio :label="1">{{ $t('authority.btn') }}</el-radio>
      </el-radio-group>
    </el-form-item>

    <span class="dialog-footer">
      <el-button @click="cancel">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">{{ $t('common.save') }}</el-button>
    </span>

  </el-form>
</template>

<script>
import { addAuth, editAuth } from '@/api/authority'
export default {
  props: {
    nodeDirectory: {
      type: Array,
      default: () => []
    },
    editObj: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      ruleForm: {
        parentId: '0',
        menuCode: '',
        menuName: '',
        level: 0,
        type: 0 // 0菜单，1按钮
      },
      rules: {
        menuCode: [
          { required: true, message: this.$t('authority.authCodeError'), trigger: 'blur' }
        ],
        menuName: [
          { required: true, message: this.$t('authority.authNameError'), trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    authTree() {
      return [{ parentId: '0', _id: '0', menuName: '根节点', level: -1, type: 0 }].concat(this.nodeDirectory)
    }
  },
  created() {
    console.log(this.editObj)
    if (this.editObj) {
      const { parentId, menuCode, menuName, type, level } = this.editObj
      this.ruleForm = { ...this.ruleForm, parentId, menuCode, menuName, type, level }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.editObj) {
            // 编辑
            editAuth({ ...this.ruleForm, '_id': this.editObj._id }).then(res => {
              this.returnResult(res)
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 添加
            addAuth(this.ruleForm).then(res => {
              this.returnResult(res)
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    returnResult(res) {
      this.$message({
        message: res.msg,
        type: 'success'
      })
      this.loading = false
      this.$emit('on_change')
    },
    authTreeChange(id) {
      const curAuth = this.authTree.filter(item => item._id === id)[0]
      console.log(curAuth)
      this.ruleForm.level = curAuth.level + 1
    },
    cancel() {
      // 取消
      this.$emit('on_cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.dialog-footer{
    display:block;
    width: 100%;
    text-align: right;
}
</style>
