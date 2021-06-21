<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
  >
    <el-form ref="formList" :model="forms" :rules="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="forms.roleName" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="forms.remark" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, computed, onMounted, ref, watch } from 'vue'
import { postRolesOperate } from '@/api/role'
import { ElMessage } from 'element-plus'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: () => {
        return {
          action: 'add'
        }
      }
    }
  },
  emits: ['update:show', 'on-change'],
  setup(props, { emit }) {
    const forms = reactive({
      roleName: '',
      remark: '',
      roleId: '',
      action: ''
    })
    const dialogTitle = ref('')
    const ruleForm = reactive({
      roleName: [
        { required: true, message: '请输入角色名称', trigger: 'blur' }
      ],
      remark: [
        { required: true, message: '请输入备注', trigger: 'blur' }
      ]
    })

    watch(() => props.info, () => {
      dialogTitle.value = props.info.action === 'edit' ? '编辑角色' : '新增角色'
      const { roleName = '',
        remark = '',
        roleId = '',
        action = 'add' } = props.info
      forms.roleName = roleName
      forms.remark = remark
      forms.roleId = roleId
      forms.action = action
    }, { deep: true, immediate: true })

    const formList = ref(null)
    const loading = ref(false)

    const dialogVisible = computed({
      get: () => {
        return props.show
      },
      set: (val) => {
        emit('update:show', val)
      }
    })
    // 提交
    const submitForm = () => {
      formList.value.validate((valid) => {
        if (valid) {
          loading.value = true
          postRolesOperate(forms).then(res => {
            loading.value = false
            dialogVisible.value = false
            ElMessage.success({
              message: res.msg,
              type: 'success'
            })
            emit('on-change')
          }).finally(() => {
            loading.value = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    onMounted(() => {

    })
    return {
      forms,
      dialogVisible,
      ruleForm,
      formList,
      loading,
      dialogTitle,
      submitForm
    }
  }
}
</script>

<style scoped>

</style>
