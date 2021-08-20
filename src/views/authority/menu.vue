<template>
  <div class="user-mode">
    <div class="search-filter">
      <el-form ref="ruleForm" :inline="true" :model="formFilter" :rules="rules" class="demo-form-inline">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="formFilter.menuName" placeholder="输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="formFilter.menuState" placeholder="全部">
            <el-option label="正常" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list">
      <div class="user-action">
        <el-button v-has="'menu-create'" type="primary" size="mini" @click="handleAdd(1)">新增</el-button>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="_id"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
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
          width="260"
        >
          <template #default="scope">
            <el-button
              v-has="'menu-create'"
              size="mini"
              type="primary"
              @click="handleAdd(2, scope.row)"
            >新增</el-button>
            <el-button
              v-has="'menu-edit'"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-has="'menu-delete'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <MenuOperate v-if="showAdd" v-model:show="showAdd" :menu-data="menuList" :info="userInfo" @on-change="getMenuListData" />
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { getMenuList, postDelete } from '@/api/menu'
import MenuOperate from './components/MenuOperate.vue'
import { parseTime } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { MenuOperate },
  setup() {
    const formFilter = reactive({
      menuState: null,
      menuName: ''
    })
    // 自定义表格样式
    const columns = reactive([
      {
        label: '菜单名称',
        prop: 'menuName'
      },
      {
        label: '图标Icon',
        prop: 'icon',
        width: 150
      },
      {
        label: '菜单类型',
        prop: 'menuType',
        width: 100,
        formatter(row, column, value) {
          return {
            1: '菜单',
            2: '按钮'
          }[value]
        }
      },
      {
        label: '权限标识',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '路由地址',
        prop: 'path'
      },
      {
        label: '组件路径',
        prop: 'component'
      },
      {
        label: '菜单状态',
        prop: 'menuState',
        width: 100,
        formatter(row, column, value) {
          return {
            1: '正常',
            2: '停用',
            3: '试用期'
          }[value]
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
    const menuList = ref([])
    const showAdd = ref(false)
    const checked = ref([])

    const total = ref(0)

    const ruleForm = ref(null)

    const tableData = ref([])

    const handleSelectionChange = (val) => {
      checked.value = val.map(item => {
        return item.userId
      })
    }

    // 编辑
    const handleEdit = async(index, row) => {
      // TODO
      userInfo.value = { ...userInfo.value, ...row }
      console.log(row)
      userInfo.value.action = 'edit'
      showAdd.value = true
    }

    // 删除
    const handleDelete = (id) => {
      // TODO
      postDeleteMethod(id)
    }

    const postDeleteMethod = (_id) => {
      ElMessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        postDelete({ _id }).then(res => {
          ElMessage.success({
            message: res.msg,
            type: 'success'
          })
          getMenuListData()
        })
      }).catch(() => {
      //  已取消删除
      })
    }
    const handleAdd = (type, row) => {
      // 新增
      userInfo.value = {}
      userInfo.value.action = 'add'
      if (type === 2) {
        userInfo.value.parentId = [...row.parentId, row._id].filter(item => item)
      }
      showAdd.value = true
    }
    const handleFilter = () => {
      // 查询
      console.log(424)
      getMenuListData()
    }

    const reset = () => {
      // 重置
      ruleForm.value.resetFields()
      getMenuListData()
    }

    const getMenuListData = () => {
      // 获取菜单信息列表
      getMenuList(formFilter).then(res => {
        tableData.value = res.data
        menuList.value = JSON.parse(JSON.stringify(res.data))
        const obj = {
          'parentId': [],
          '_id': 'null',
          'menuType': 1,
          'menuName': '根节点',
          'menuCode': '',
          'menuState': 1
        }
        menuList.value.unshift(obj)
        // total.value = res.data.total || 0
      })
    }

    onMounted(() => {
      getMenuListData()
    })
    return {
      formFilter,
      tableData,
      handleSelectionChange,
      handleEdit,
      handleDelete,
      handleFilter,
      handleAdd,
      reset,
      getMenuListData,
      ruleForm,
      total,
      showAdd,
      userInfo,
      columns,
      checked,
      postDeleteMethod,
      menuList
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
