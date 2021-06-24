<template>
  <div class="user-mode">
    <div class="search-filter">
      <el-form ref="ruleForm" :inline="true" :model="formFilter" :rules="rules" class="demo-form-inline">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formFilter.roleName" placeholder="输入角色名称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list">
      <div class="user-action">
        <el-button v-has="'role-create'" type="primary" size="mini" @click="handleAdd">新增</el-button>
        <!-- <el-button type="danger" size="mini" @click="handleDelAll">批量删除</el-button> -->
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :prop="item.prop"
          :width="item.width"
        />
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              v-has="'role-edit'"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-has="'role-set-permission'"
              size="mini"
              type="primary"
              @click="handleSet(scope.row)"
            >设置权限</el-button>
            <el-button
              v-has="'role-delete'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.roleId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-mode">
        <Pagination
          v-model:limit.sync="formFilter.pageSize"
          v-model:page.sync="formFilter.pageNum"
          layout="prev, pager, next"
          :total="total"
          @pagination="handleCurrentChange"
        />
      </div>
    </div>
    <RoleOperate v-if="showAdd" v-model:show="showAdd" :info="userInfo" @on-change="getRoleListData" />
    <SetPermission v-if="showPermission" v-model:showPermission="showPermission" :role-info="roleInfo" :menu-data="menuData" @on-change="getRoleListData" />
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { getRoleList, postDelete } from '@/api/role'
import { getMenuList } from '@/api/menu'
import Pagination from '@/components/Pagination/index.vue'
import RoleOperate from './components/RoleOperate.vue'
import SetPermission from './components/SetPermission.vue'
import { parseTime } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { Pagination, RoleOperate, SetPermission },
  setup() {
    const formFilter = reactive({
      roleName: '',
      pageNum: 1,
      pageSize: 20
    })
    const actionList = reactive({
      actionMap: {}
    })
    const roleInfo = ref({})
    // 自定义表格样式
    const columns = reactive([
      {
        label: '角色ID',
        prop: 'roleId'
      },
      {
        label: '角色名称',
        prop: 'roleName'
      },
      {
        label: '备注',
        prop: 'remark'
      },
      {
        label: '权限列表',
        prop: 'permissionList',
        width: 200,
        formatter: (row, column, value) => {
          const names = []
          const list = value.halfCheckedKeys || []
          list.map(key => {
            if (key && actionList.actionMap[key])names.push(actionList.actionMap[key])
          })
          return names.join(',')
        }
      },
      {
        label: '创建时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return parseTime(value)
        }
      }
    ])

    const userInfo = ref({})
    const showAdd = ref(false)
    const checked = ref([])
    const showPermission = ref(false)
    const menuData = ref([])

    const total = ref(0)

    const ruleForm = ref(null)

    const tableData = ref([])

    // 编辑
    const handleEdit = async(index, row) => {
      // TODO
      userInfo.value = { ...userInfo.value, ...row }
      userInfo.value.action = 'edit'
      showAdd.value = true
    }

    // 删除
    const handleDelete = (roleId) => {
      // TODO
      const roleIds = [roleId]
      postDeleteMethod(roleIds)
    }

    // 设置权限
    const handleSet = (row) => {
      roleInfo.value = row
      showPermission.value = true
    }

    // 获取菜单
    const getMenuData = async() => {
      await getMenuList().then(async res => {
        menuData.value = res.data
        await getActionMap(res.data)
      })
    }

    // 遍历选择的权限
    const getActionMap = (list) => {
      const actionMap = {}
      const deep = (arr) => {
        while (arr.length) {
          const item = arr.pop()
          if (item.children && item.action) {
            // 表示最后一级且是按钮
            actionMap[item._id] = item.menuName
          }
          if (item.children && !item.action) {
            // 表示不是最后一级
            deep(item.children)
          }
        }
      }
      deep(JSON.parse(JSON.stringify(list)))
      actionList.actionMap = actionMap
    }

    const postDeleteMethod = (roleIds) => {
      ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postDelete({ roleIds }).then(res => {
          ElMessage.success({
            message: res.msg,
            type: 'success'
          })
          getRoleListData()
        })
      }).catch(() => {
      //  已取消删除
      })
    }

    const handleAdd = () => {
      // 新增
      userInfo.value = {}
      userInfo.value.action = 'add'
      showAdd.value = true
    }
    const handleFilter = () => {
      // 查询
      getRoleListData()
    }

    const reset = () => {
      // 重置
      ruleForm.value.resetFields()
      getRoleListData()
    }

    const getRoleListData = () => {
      // 获取列表
      getRoleList(formFilter).then(res => {
        tableData.value = res.data.list
        total.value = res.data.total || 0
      })
    }

    const handleCurrentChange = (page) => {
      getRoleListData()
    }

    onMounted(() => {
      getRoleListData()
      getMenuData()
    })
    return {
      formFilter,
      tableData,
      handleEdit,
      handleDelete,
      handleFilter,
      handleAdd,
      reset,
      getRoleListData,
      handleCurrentChange,
      ruleForm,
      total,
      showAdd,
      userInfo,
      getActionMap,
      actionList,
      columns,
      checked,
      postDeleteMethod,
      handleSet,
      showPermission,
      getMenuData,
      menuData,
      roleInfo
    }
  }
}
</script>

<style scoped lang="scss">
.user-mode{

    .search-filter{
        padding: 15px;
        background: $whiteBg;

        :deep(.el-form-item){
            margin-bottom: 0;
        }
    }

    .user-list{
        margin-top: 15px;
        background: $whiteBg;
        min-height: 400px;

        .user-action{
            padding: 15px;
        }
    }

    .page-mode{
        text-align: right;
        margin-top: 20px;
    }
}
</style>
