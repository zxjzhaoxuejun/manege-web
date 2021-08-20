<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="600px"
  >
    <el-form ref="formList" :model="forms" :rules="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="父级菜单" prop="parentId">
        <el-cascader
          v-model="forms.parentId"
          :options="menuData"
          :props="{ checkStrictly: true,label:'menuName',value:'_id' }"
          clearable
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="forms.menuType">
          <el-radio :label="1">菜单</el-radio>
          <el-radio :label="2">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="forms.menuType==1?'菜单名称':'按钮名称'" prop="menuName">
        <el-input v-model="forms.menuName" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item v-show="forms.menuType==1" label="菜单图标" prop="icon">
        <el-select v-model="forms.icon" clearable placeholder="请选择">
          <el-option
            v-for="item in iconMap"
            :key="item.label"
            :label="item.label"
            :value="item.label"
          >
            <i :class="item.label" />
            <span>{{ item.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="forms.menuType==1" label="路由地址" prop="path">
        <el-input v-model="forms.path" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item v-show="forms.menuType==1" label="组件路径" prop="component">
        <el-input v-model="forms.component" placeholder="请输入组件路径" />
      </el-form-item>
      <el-form-item v-show="forms.menuType==1" label="组件名称" prop="componentName">
        <el-input v-model="forms.componentName" placeholder="请输入组件名称" />
      </el-form-item>
      <el-form-item v-show="forms.menuType==2" label="权限标识" prop="menuCode">
        <el-input v-model="forms.menuCode" placeholder="请输入权限标识" />
      </el-form-item>
      <el-form-item v-show="forms.menuType==1" label="菜单状态" prop="menuState">
        <el-radio-group v-model="forms.menuState">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="2">停用</el-radio>
        </el-radio-group>
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
import { postMenuData } from '@/api/menu'
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
      menuName: '',
      menuType: 1,
      menuState: 1,
      menuCode: '',
      path: '',
      component: '',
      componentName:'',
      icon: '',
      action: '',
      _id: ''
    })
    const iconMap = ref([
      {
        label: 'el-icon-user-solid'
      },
      { label: 'el-icon-user' },
      { label: 'el-icon-key' },
      {
        label: 'el-icon-phone-outline'
      },
      {
        label: 'el-icon-setting'
      },
      {
        label: 'el-icon-goods'
      }, {
        label: 'el-icon-success'
      },
      {
        label: 'el-icon-circle-plus'
      }, {
        label: 'el-icon-s-help'
      },
      {
        label: 'el-icon-s-operation'
      }, {
        label: 'el-icon-s-home'
      },
      {
        label: 'el-icon-menu'
      }, {
        label: 'el-icon-s-data'
      },
      {
        label: 'el-icon-document'
      }, {
        label: 'el-icon-paperclip'
      },
      {
        label: 'el-icon-notebook-1'
      }, {
        label: 'el-icon-discover'
      },
      {
        label: 'el-icon-place'
      }
    ])
    const dialogTitle = ref('')
    const ruleForm = reactive({
      menuName: [
        { required: true, message: '请输入名称', trigger: 'blur' }
      ],
      parentId: [
        { required: true, message: '请选择父级菜单', trigger: 'blur' }
      ]
    })

    watch(() => props.info, () => {
      dialogTitle.value = props.info.action === 'edit' ? '编辑菜单' : '新增菜单'
      const { menuName = '',
        icon = '',
        _id = '',
        path = '',
        menuType = 1,
        menuState = 1,
        component = '',
        componentName='',
        menuCode = '',
        parentId = [],
        action = 'add' } = props.info
      forms.menuName = menuName
      forms.icon = icon
      forms._id = _id
      forms.menuType = menuType
      forms.menuState = menuState
      forms.menuCode = menuCode
      forms.component = component
      forms.componentName = componentName
      forms.path = path
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
    // 提交
    const submitForm = () => {
      formList.value.validate((valid) => {
        if (valid) {
          loading.value = true
          forms.parentId = forms.parentId.filter(item => item && item !== 'null')
          postMenuData(forms).then(res => {
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
      submitForm,
      iconMap
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
