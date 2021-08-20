<template>
  <div class="user-mode">
    <div class="search-filter">
      <el-form ref="ruleForm" :inline="true" :model="formFilter" :rules="rules" class="demo-form-inline">
        <el-form-item label="部门名称" prop="deptName">
          <el-select v-model="formFilter.deptName" placeholder="全部">
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
        <el-button v-has="'dept-create'" type="primary" size="mini" @click="handleAdd(1)">创建</el-button>
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
          v-bind="item"
        />
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              v-has="'dept-edit'"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              v-has="'dept-delete'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <DeptOperate v-if="showAdd" v-model:show="showAdd" :menu-data="menuList" :info="userInfo" @on-change="getDeptListData" />
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { getDeptList, postDelete } from '@/api/dept'
import DeptOperate from './components/DeptOperate.vue'
import { parseTime } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { DeptOperate },
  setup() {
    const formFilter = reactive({
      deptName: ''
    })
    // 自定义表格样式
    const columns = reactive([
      {
        label: '部门名称',
        prop: 'deptName'
      },
      {
        label: '负责人',
        prop: 'userName'
      },
      {
        label: '创建时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return parseTime(value)
        }
      },
      {
        label: '更新时间',
        prop: 'updateTime',
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
      // console.log(checked.value)
    }

    // 编辑
    const handleEdit = async(index, row) => {
      // TODO
      userInfo.value = { ...userInfo.value, ...row }
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
          getDeptListData()
        })
      }).catch(() => {
      //  已取消删除
      })
    }
    const handleAdd = (type, row) => {
      // 新增
      userInfo.value = {}
      userInfo.value.action = 'add'
      showAdd.value = true
    }
    const handleFilter = () => {
      // 查询
      getDeptListData()
    }

    const reset = () => {
      // 重置
      ruleForm.value.resetFields()
      getDeptListData()
    }

    const getDeptListData = () => {
      // 获取部门信息列表
      getDeptList(formFilter).then(res => {
        tableData.value = res.data
        menuList.value = JSON.parse(JSON.stringify(res.data))
        const obj = {
          'parentId': [],
          '_id': 'null',
          'deptName': '公司',
          'userEmail': 'admin@qq.com',
          'userId': '1000002',
          'userName': 'admin'
        }
        menuList.value.unshift(obj)
        // total.value = res.data.total || 0
      })
    }

    onMounted(() => {
      getDeptListData()
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
      getDeptListData,
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
