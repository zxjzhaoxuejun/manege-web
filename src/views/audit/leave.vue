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
        <el-button type="primary" size="mini" @click="handleAdd">申请休假</el-button>
        <!-- <el-button v-has="'user-batch-delete'" type="danger" size="mini" @click="handleDelAll">批量删除</el-button> -->
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
              v-if="[1,2].includes(scope.row.applyState)"
              @click="handleDelete(scope.row._id)"
            >作废</el-button>
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
    <!-- 申请弹窗 -->
    <el-dialog
    title="休假申请"
    v-model="dialogForm"
    @close="resetForm"
    width="40%">
   <el-form :model="applyForm" :rules="applyRules" ref="applyForms" label-width="100px" class="demo-ruleForm">
  <el-form-item label="休假类型" prop="applyType">
    <el-select v-model="applyForm.applyType" placeholder="请选择休假类型">
      <el-option label="事假" :value="1"></el-option>
      <el-option label="调休" :value="2"></el-option>
      <el-option label="年假" :value="3"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="休假时间" prop="leaveDate">
    <el-date-picker
      v-model="applyForm.leaveDate"
      @change="changeDate"
      type="datetimerange"
      :default-time="defaultTime"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </el-form-item>
  <el-form-item label="休假时长" prop="leaveTime">
    <el-input v-model="applyForm.leaveTime" disabled></el-input>
  </el-form-item>
  <el-form-item label="休假原因" prop="reasons">
    <el-input type="textarea" v-model="applyForm.reasons" placeholder="请输入休假原因..." :rows="4"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm" :loading="loading">提交</el-button>
    <el-button @click="resetForm">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>

 <el-dialog
    title="申请休假详情"
    v-model="dialogDetails"
    width="40%">
    <div class="steps-list">
        <el-steps :active="viewData.applyState" align-center>
            <el-step title="待审批"></el-step>
            <el-step title="审批中"></el-step>
            <el-step :title="stepStateFilter(viewData.applyState)"></el-step>
        </el-steps>
    </div>
    <div class="des-list">
        <div class="des-list-item">
            <span class="item-name">休假类型：</span>
            <span class="item-val">{{applyTypeFilter(viewData.applyType)}}</span>
        </div>
        <div class="des-list-item">
            <span class="item-name">休假时间：</span>
            <span class="item-val">{{dateFilter(viewData.startTime)}} - {{dateFilter(viewData.endTime)}}</span>
        </div>
        <div class="des-list-item">
            <span class="item-name">休假时长：</span>
            <span class="item-val">{{viewData.leaveTime}}</span>
        </div>
        <div class="des-list-item">
            <span class="item-name">休假原因：</span>
            <span class="item-val">{{viewData.reasons}}</span>
        </div>
        <div class="des-list-item">
            <span class="item-name">审批状态：</span>
            <span class="item-val">{{applyStateFilter(viewData.applyState)}}</span>
        </div>
        <div class="des-list-item">
            <span class="item-name">审批人：</span>
            <span class="item-val">{{viewData.curAuditUserName}}</span>
        </div>
    </div>

 </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue'
import { getLeaveList,leaveOperate } from '@/api/leave'
import Pagination from '@/components/Pagination/index.vue'
import { parseTime } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  components: { Pagination },
  setup() {
    const formFilter = reactive({
      applyState: null,
      pageNum: 1,
      pageSize: 20
    })
    const viewData=ref({})
    const applyForm=reactive({
        leaveTime:'',
        reasons:'',
        applyType:null,
        startTime:'',
        endTime:'',
        leaveDate:'',
        action:''
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
    const dialogForm=ref(false)
    const loading=ref(false)
    const dialogDetails=ref(false)

    const total = ref(0)

    const ruleForm = reactive({
        
    })
    const applyForms=ref(null)

    const applyRules=reactive({
        applyType:[
            { required: true, message: '请选择休假类型', trigger: 'blur' }
        ],
        leaveTime:[
            {required: true, message: '请选择休假时长', trigger: 'blur'}
        ],
        leaveDate:[
           {required: true, message: '请选择休假时间', trigger: 'blur'} 
        ],
        reasons:[
           {required: true, message: '请填写休假原因', trigger: 'blur'} 
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



    // 删除
    const handleDelete = (id) => {
      // TODO
      postDeleteMethod(id)
    }

    //时间选择变化
    const changeDate=(val)=>{
        const day=(val[1]-val[0])/(24*60*60*1000)+1
        if((day-day.toString().split('.')[0])<0.375){
            applyForm.leaveTime=`${parseInt(day)-0.5}天`
        }else{
            applyForm.leaveTime=`${parseInt(day)}天`
        }
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
    const handleDelAll = () => {
      // 批量删除
      postDeleteMethod(userIds)
    }

    const handleAdd = () => {
      // 申请休假
      dialogForm.value = true
      applyForm.action='create'
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
      dialogForm.value = false
    }

    const getApplyListData = () => {
      // 获取列表
      getLeaveList(formFilter).then(res => {
        tableData.value = res.data.list
        total.value = res.data.total || 0
      })
    }

    const submitForm=()=>{
      applyForms.value.validate((valid) => {
        if (valid) {
          loading.value = true
          applyForm.startTime=applyForm.leaveDate[0]
          applyForm.endTime=applyForm.leaveDate[1]
          let params={...applyForm}
          delete params.leaveDate
          leaveOperate(params).then(res=>{
            ElMessage.success({
              message: res.msg,
              type: 'success'
            })
            resetForm()
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
      tableData,
      dialogForm,
      applyRules,
      changeDate,
      defaultTime,
      applyTypeFilter,
      applyStateFilter,
      stepStateFilter,
      dateFilter,
      loading,
      handleView,
      handleDelete,
      dialogDetails,
      handleFilter,
      handleDelAll,
      viewData,
      handleAdd,
      resetForm,
      submitForm,
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
