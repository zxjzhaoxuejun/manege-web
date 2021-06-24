<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
  >
    <el-form ref="formList" :model="forms" :rules="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="上级部门" prop="parentId">
        <el-cascader
          v-model="forms.parentId"
          :options="menuData"
          :props="{ checkStrictly: true,label:'deptName',value:'_id' }"
          clearable
        />
      </el-form-item>
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="forms.deptName" placeholder="请输入部门名称" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="userObj">
        <el-select v-model="forms.userObj" clearable placeholder="请选择" @change="checkUserChange">
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="`${item.userId}/${item.userEmail}/${item.userName}`"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人邮箱" prop="userEmail">
        <el-input v-model="forms.userEmail" disabled placeholder="请输入邮箱" />
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
import { postOperate } from '@/api/dept'
import { getUserList } from '@/api/users'
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
    },
    menuData: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:show', 'on-change'],
  setup(props, { emit }) {
    const forms = reactive({
      parentId: [],
      deptName: '',
      userName: '',
      userEmail: '',
      userObj: '',
      action: '',
      _id: ''
    })
    const userList = ref([])
    const dialogTitle = ref('')
    const ruleForm = reactive({
      deptName: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      userObj: [
        { required: true, message: '请选择负责人', trigger: 'blur' }
      ],
      checkId: [
        { required: true, message: '请选择部门', trigger: 'blur' }
      ]
    })

    watch(() => props.info, () => {
      dialogTitle.value = props.info.action === 'edit' ? '编辑部门' : '创建部门'
      const { deptName = '',
        userName = '',
        _id = '',
        userId = '',
        userEmail = '',
        parentId = [],
        action = 'add' } = props.info
      forms.deptName = deptName
      forms.userName = userName
      forms._id = _id
      forms.userId = userId
      forms.userObj = userId ? userId + '/' + userEmail + '/' + userName : ''
      forms.userEmail = userEmail
      forms.parentId = parentId.length ? parentId : ['null']
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
    const getUserDate = () => {
      getUserList().then(res => {
        userList.value = res.data.list
      })
    }
    const checkUserChange = (val) => {
      const checkUser = val.split('/')
      forms.userId = checkUser[0]
      forms.userEmail = checkUser[1]
      forms.userName = checkUser[2]
      console.log(checkUser)
    }
    // 提交
    const submitForm = () => {
      formList.value.validate((valid) => {
        if (valid) {
          loading.value = true
          forms.parentId = forms.parentId.filter(item => item && item !== 'null')
          postOperate(forms).then(res => {
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
      getUserDate()
    })
    return {
      forms,
      dialogVisible,
      ruleForm,
      formList,
      loading,
      dialogTitle,
      submitForm,
      userList,
      getUserDate,
      checkUserChange
    }
  }
}
</script>

<style scoped lang="scss">
:deep(.el-select-dropdown__item){
  display: flex;
  align-items: center;
}
</style>
