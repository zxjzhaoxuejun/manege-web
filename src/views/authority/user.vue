<template>
  <div class="user-mode">
    <div class="search-filter">
      <el-form ref="ruleForm" :inline="true" :model="formFilter" :rules="rules" class="demo-form-inline">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="formFilter.userId" placeholder="输入用户ID" />
        </el-form-item>

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="formFilter.userName" placeholder="请输入用户名称" />
        </el-form-item>

        <el-form-item label="用户状态" prop="state">
          <el-select v-model="formFilter.state" placeholder="全部">
            <el-option label="在职" value="1" />
            <el-option label="离职" value="2" />
            <el-option label="试用期" value="3" />
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
        <el-button type="primary" size="mini" @click="handleAdd">新增</el-button>
        <el-button type="danger" size="mini" @click="handleDelAll">批量删除</el-button>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :prop="item.prop"
        />
        <el-table-column
          label="操作"
        >
          <template #default="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
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
    <UserAdd v-if="showAdd" v-model:show="showAdd" :info="userInfo" @on-change="getUserListData" />
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { getUserList } from '@/api/users'
import Pagination from '@/components/Pagination/index.vue'
import UserAdd from './components/UserAdd.vue'
import { parseTime } from '@/utils'
export default {
  components: { Pagination, UserAdd },
  setup() {
    const formFilter = reactive({
      state: null,
      userName: '',
      userId: '',
      pageNum: 1,
      pageSize: 20
    })
    // 自定义表格样式
    const columns = reactive([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'userName'
      },
      {
        label: '用户邮箱',
        prop: 'userEmail'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter(row, column, value) {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter(row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return parseTime(value)
        }
      },
      {
        label: '最后登录时间',
        prop: 'lastLoginTime',
        formatter(row, column, value) {
          return parseTime(value)
        }
      }
    ])
    const userInfo = ref({})
    const showAdd = ref(false)

    const total = ref(0)

    const ruleForm = ref(null)

    const tableData = ref([])

    const handleSelectionChange = (val) => {
      console.log(val)
    }

    // 编辑
    const handleEdit = async(index, row) => {
      // TODO
      userInfo.value = { ...userInfo.value, ...row }
      userInfo.value.action = 'edit'
      showAdd.value = true
    }

    // 删除
    const handleDelete = (index, row) => {
      // TODO
    }

    const handleDelAll = () => {
      // 批量删除
    }

    const handleAdd = () => {
      // 新增
      userInfo.value = {}
      userInfo.value.action = 'add'
      showAdd.value = true
    }
    const handleFilter = () => {
      // 查询
      getUserListData()
    }

    const reset = () => {
      // 重置
      ruleForm.value.resetFields()
      getUserListData()
    }

    const getUserListData = () => {
      // 获取用户信息列表
      getUserList(formFilter).then(res => {
        console.log(res)
        tableData.value = res.data.list
        total.value = res.data.total || 0
      })
    }

    const handleCurrentChange = (page) => {
      getUserListData()
    }

    onMounted(() => {
      getUserListData()
    })
    return {
      formFilter,
      tableData,
      handleSelectionChange,
      handleEdit,
      handleDelete,
      handleFilter,
      handleDelAll,
      handleAdd,
      reset,
      getUserListData,
      handleCurrentChange,
      ruleForm,
      total,
      showAdd,
      userInfo,
      columns
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
