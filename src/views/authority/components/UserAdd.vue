<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
  >
    <el-form ref="formList" :model="forms" :rules="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名称" prop="userName">
        <el-input v-model="forms.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="userEmail">
        <el-input v-model="forms.userEmail" placeholder="请输入用户邮箱" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="forms.mobile" placeholder="请输入用户手机号" />
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input v-model="forms.job" placeholder="请输入用户岗位" />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="forms.state" placeholder="请选择">
          <el-option label="在职" :value="1" />
          <el-option label="离职" :value="2" />
          <el-option label="试用期" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户角色" prop="role">
        <el-select v-model="forms.role" placeholder="请选择">
          <el-option label="管理员" :value="0" />
          <el-option label="普通用户" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="系统角色" prop="roleList">
        <el-select v-model="forms.roleList" multiple placeholder="请选择">
          <el-option
            v-for="item in roleListMap"
            :key="item._id"
            :label="item.roleName"
            :value="item._id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所在部门" prop="deptId">
        <el-cascader
          v-model="forms.deptId"
          :options="deptList"
          :props="{ checkStrictly: true,value:'_id',label:'deptName' }"
          clearable
        />
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
import { getRoleList, getDeptList } from '@/api/role'
import { postUserOperate } from '@/api/users'
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
      userName: '',
      userEmail: '',
      mobile: '',
      job: '',
      state: null,
      roleList: null,
      deptId: '',
      role: 1
    })
    const dialogTitle = ref('')
    const ruleForm = reactive({
      userName: [
        { required: true, message: '请输入用户名称', trigger: 'blur' }
      ],
      userEmail: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' }
      ]
    })

    watch(() => props.info, () => {
      dialogTitle.value = props.info.action === 'edit' ? '编辑用户' : '新增用户'
      const { userName = '',
        userEmail = '',
        mobile = '',
        job = '',
        state = '',
        roleList = '',
        deptId = '',
        role = 1 } = props.info
      forms.userEmail = userEmail
      forms.userName = userName
      forms.role = role
      forms.mobile = mobile
      forms.job = job
      forms.roleList = roleList
      forms.deptId = deptId
      forms.state = state
    }, { deep: true, immediate: true })

    const formList = ref(null)
    const loading = ref(false)

    const dialogVisible = computed({
      get: () => {
        return props.show
      },
      set: (val) => {
        console.log(val)
        emit('update:show', val)
      }
    })

    const deptList = ref([])
    const roleListMap = ref([])
    // 获取所有角色
    const getRoleListData = () => {
      getRoleList().then(res => {
        roleListMap.value = res.data
      })
    }
    // 获取部门数据
    const getDeptListData = () => {
      getDeptList().then(res => {
        deptList.value = res.data
      })
    }

    // 提交
    const submitForm = () => {
      formList.value.validate((valid) => {
        if (valid) {
          loading.value = true
          postUserOperate(forms).then(res => {
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
      getRoleListData()
      getDeptListData()
    })
    return {
      forms,
      roleListMap,
      dialogVisible,
      ruleForm,
      deptList,
      formList,
      loading,
      dialogTitle,
      getRoleListData,
      getDeptListData,
      submitForm
    }
  }
}
</script>

<style scoped>

</style>
