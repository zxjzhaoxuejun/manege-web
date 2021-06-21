<template>
  <el-dialog
    v-model="dialogVisible"
    title="权限设置"
    width="600px"
  >
    <el-form label-width="100px">
      <el-form-item label="角色名称">
        {{ roleInfo.roleName }}
      </el-form-item>
      <el-form-item label="选择权限">
        <el-tree
          ref="treePermissing"
          :data="menuData"
          show-checkbox
          node-key="_id"
          :props="{label:'menuName'}"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { postUpdatePermission } from '@/api/role'
import { ElMessage } from 'element-plus'
export default {
  props: {
    showPermission: {
      type: Boolean,
      default: false
    },
    menuData: {
      type: Array,
      default: () => []
    },
    roleInfo: {
      type: Object,
      default: () => {
        return {
          'roleName': ''
        }
      }
    }
  },
  emits: ['update:showPermission', 'on-change'],
  setup(props, { emit }) {
    const treePermissing = ref(null)
    const dialogVisible = computed({
      get: () => {
        return props.showPermission
      },
      set: (val) => {
        emit('update:showPermission', val)
      }
    })

    const menuList = ref([])

    watch(() => props.roleInfo, async(val) => {
      const { checkedKeys } = props.roleInfo.permissionList
      setTimeout(() => {
        treePermissing.value.setCheckedKeys(checkedKeys)
      })
    }, {
      deep: true,
      immediate: true
    })

    const handleSubmit = () => {
      const nodes = treePermissing.value.getCheckedNodes()
      const halfKeys = treePermissing.value.getHalfCheckedKeys()
      const checkedKeys = []
      const parentKeys = []
      nodes.map(node => {
        if (!node.children) {
          checkedKeys.push(node._id)
        } else {
          parentKeys.push(node._id)
        }
      })
      const params = {
        roleId: props.roleInfo.roleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys)
        }
      }
      postUpdatePermission(params).then(res => {
        ElMessage.success({
          message: res.msg,
          type: 'success'
        })
        dialogVisible.value = false
        emit('on-change')
      })
    }

    return {
      dialogVisible,
      menuList,
      treePermissing,
      handleSubmit
    }
  }
}
</script>

<style scoped>

</style>
