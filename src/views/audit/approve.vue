<template>
  <div class="user-mode">
    <div class="search-filter">
      <el-form ref="ruleForm" :inline="true" :model="formFilter" :rules="rules" class="demo-form-inline">
        <el-form-item label="审批状态" prop="applyState">
            <!-- 审批状态，1.待审批，2.审批中，3审批拒绝，4.审批通过，5.作废 -->
          <el-select v-model="formFilter.applyState" placeholder="全部">
            <el-option label="全部" :value="null" />
            <el-option label="待审批" :value="1" />
            <el-option label="审批中" :value="2" />
            <el-option label="审批拒绝" :value="3" />
            <el-option label="审批通过" :value="4" />
            <el-option label="作废" :value="5" />
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
        <!-- <el-button type="primary" size="mini">申请休假</el-button> -->
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
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
              size="mini"
              @click="handleView(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="scope.row.curAuditUserName==userInfo.userName&&[1,2].includes(scope.row.applyState)"
              @click="handleCheck(scope.$index, scope.row)"
            >审核</el-button>
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
    
 <el-dialog
    title="审核"
    v-model="dialogDetails"
    width="40%">
    <el-form ref="applyForms" :model="applyForm" :rules="applyRules">
      <el-form-item label="申请人:">
          <div class="des-list-item">
            {{viewData.applyUser.userName}}
          </div>
      </el-form-item>
      <el-form-item label="休假类型：">
          <div class="des-list-item">
            {{applyTypeFilter(viewData.applyType)}}
          </div>
      </el-form-item>
      <el-form-item label="休假时间：">
          <div class="des-list-item">
            {{dateFilter(viewData.startTime)}} - {{dateFilter(viewData.endTime)}}
          </div>
      </el-form-item>
      <el-form-item label="休假时长：">
          <div class="des-list-item">
            {{viewData.leaveTime}}
          </div>
      </el-form-item>
      <el-form-item label="休假原因：">
          <div class="des-list-item">
            {{viewData.reasons}}
          </div>
      </el-form-item>
      <el-form-item label="审批状态：">
          <div class="des-list-item">
            {{applyStateFilter(viewData.applyState)}}
          </div>
      </el-form-item>
      <el-form-item label="审批人：">
          <div class="des-list-item">
            {{viewData.curAuditUserName}}
          </div>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :rows="3" v-model="applyForm.remark" placeholder="请输入备注..."></el-input>
      </el-form-item>
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="handleApprove('pass')">审核通过</el-button>
        <el-button @click="handleApprove('refuse')">驳回</el-button>
      </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed } from 'vue'
import {useStore} from 'vuex'
import { getLeaveList,approveOperate } from '@/api/leave'
import Pagination from '@/components/Pagination/index.vue'
import { parseTime } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name:'Approve',
  components: { Pagination },
  setup() {
    const store=useStore()
    const formFilter = reactive({
      applyState: 1,
      type:'approve',
      pageNum: 1,
      pageSize: 20
    })
    const viewData=ref({})
    const applyForm=reactive({
        remark:'',
    })

    const defaultTime = ref([
        new Date(2000, 1, 1, 10,0,0),
        new Date(2000, 2, 1, 19,0,0)
    ]) // 
    
    // 自定义表格样式
    const columns = reactive([
      {
        label: '单号',
        prop: 'orderNo'
      },
      {
        label: '申请人',
        prop: '',
        formatter(row){
          return row.applyUser.userName
        }
      },
      {
        label: '休假时间',
        prop: '',
        formatter(row, column, value) {
          return (
            parseTime(row.startTime)+'至'+parseTime(row.endTime)
          )
        }
      },
      {
        label: '休假时长',
        prop: 'leaveTime'
      },
      {
        label: '休假类型',//1.事假，2.调休，3.年假
        prop: 'applyType',
        formatter(row, column, value) {
          return {
            1: '事假',
            2: '调休',
            3: '年假'
          }[value]
        }
      },
      {
        label: '休假原因',
        prop: 'reasons'
      },
      {
        label: '申请时间',
        prop: 'createTime',
        formatter(row, column, value) {
          return parseTime(value)
        }
      },
      {
        label: '审批人',
        prop: 'auditUsers'
      },
      {
        label: '当前审批人',
        prop: 'curAuditUserName'
      },
      {
        label: '申请状态',//1.待审批，2.审批中，3审批拒绝，4.审批通过，5.作废
        prop: 'applyState',
        formatter(row, column, value) {
          return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4:'审批通过',
            5:'作废'
          }[value]
        }
      },
    ])
    
    const loading=ref(false)
    const dialogDetails=ref(false)

    const total = ref(0)

    const ruleForm = reactive({
        
    })
    const applyForms=ref(null)

    const applyRules=reactive({
        remark:[
           {required: true, message: '请填写备注', trigger: 'blur'} 
        ]
    })

    const tableData = ref([])

    // 查看
    const handleView = (index, row) => {
      // TODO
      viewData.value=row
      dialogDetails.value=true
    }

    const dateFilter=(val)=>{
        return parseTime(val)
    }

    const applyTypeFilter=(value)=>{
    return {
            1: '事假',
            2: '调休',
            3: '年假'
        }[value]
    }

    const applyStateFilter=(value)=>{
        return {
            1: '待审批',
            2: '审批中',
            3: '审批拒绝',
            4:'审批通过',
            5:'作废'
          }[value]
    }

    const stepStateFilter=(value)=>{
        return {
            1: '审批拒绝/审批通过',
            2: '审批拒绝/审批通过',
            3: '审批拒绝',
            4:'审批通过',
            5:'作废'
          }[value]
    }



    // 审核
    const handleCheck = (index, row) => {
      viewData.value=row
      dialogDetails.value=true
    }

    const postDeleteMethod = (id) => {
      ElMessageBox.confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        leaveOperate({ _id:id,action:'delete' }).then(res => {
          ElMessage.success({
            message: res.msg,
            type: 'success'
          })
          getApplyListData()
        })
      }).catch(() => {
      //  已取消删除
      })
    }
    

   
    const handleFilter = () => {
      // 搜索查询
      getApplyListData()
    }

    const reset = () => {
      // 重置查询
      ruleForm.value.resetFields()
      getApplyListData()
    }
    const resetForm = () => {
      // 重置申请表单
      applyForms.value.resetFields()
      dialogDetails.value = false
    }

    const getApplyListData = () => {
      // 获取列表
      getLeaveList(formFilter).then(res => {
        tableData.value = res.data.list
        total.value = res.data.total || 0
      })
    }

    const handleApprove=(action)=>{
      applyForms.value.validate((valid) => {
        if (valid) {
          loading.value = true
          let params={...applyForm,action,_id:viewData.value._id}
          approveOperate(params).then(res=>{
            ElMessage.success({
              message: res.msg,
              type: 'success'
            })
            resetForm()
            store.dispatch('user/getLeaveCount')
            getApplyListData()
          }).finally(()=>{
              loading.value = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    const handleCurrentChange = (page) => {
      getApplyListData()
    }

    onMounted(async() => {
      getApplyListData()
    })
    return {
      formFilter,
      userInfo:computed(()=>store.getters.userInfo),
      tableData,
      applyRules,
      defaultTime,
      applyTypeFilter,
      applyStateFilter,
      stepStateFilter,
      dateFilter,
      loading,
      handleView,
      handleCheck,
      dialogDetails,
      handleFilter,
      viewData,
      resetForm,
      handleApprove,
      reset,
      getApplyListData,
      handleCurrentChange,
      ruleForm,
      applyForms,
      total,
      columns,
      postDeleteMethod,
      applyForm
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

.steps-list{
    width: 90%;
    margin: 0 auto;
}

.des-list{
    margin:15px 0;

    .des-list-item{
        margin-bottom: 15px;
    }

    .item-name{
        color: #888;
        margin-right: 6px;
    }

    .item-val{
        color:#282828;
    }
}
</style>
