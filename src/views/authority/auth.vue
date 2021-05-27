<template>
  <div class="auth-mode">
    <el-row>
      <el-button type="primary" @click="addAuth">新增权限</el-button>
      <el-button disabled>修改权限</el-button>
      <el-button disabled>删除权限</el-button>
      <el-button>初始化权限</el-button>
    </el-row>

    <div class="auth-list-mode">
      <div class="auth-select">
        <el-tree
          :props="defaultProps"
          :data="data"
          show-checkbox
          @check-change="handleCheckChange"
        />
      </div>
      <div class="auth-list">
        <el-table
          :data="authList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="menuName"
            label="权限名称"
          />
          <el-table-column
            prop="menuCode"
            label="权限编码"
          />
          <el-table-column
            label="权限类型"
          >
            <template #default="{row}">
              <span>{{ row.type?'按钮':'菜单' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
          >
            <template #default="{row}">
              <el-button type="text" size="small" @click="editAuth(row)">编辑</el-button>
              <el-button type="text" size="small" @click="delAuth(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="authDialogTitle"
      width="500px"
      @close="handleCancel"
    >
      <DialogAddAuth v-if="dialogVisible" :edit-obj="editObj" :node-directory="nodeDirectory" @on_cancel="handleCancel" @on_change="refreshList" />
    </el-dialog>
  </div>
</template>

<script>
import DialogAddAuth from './components/DialogAddAuth.vue'
import { findAuth } from '@/api/authority'
export default {
  components: { DialogAddAuth },
  data() {
    return {
      dialogVisible: false,
      authList: [],
      editObj: null,
      authDialogTitle: '',
      nodeDirectory: [], // 节点目录
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getAuthList()
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    addAuth() {
      // 添加
      this.authDialogTitle = this.$t('authority.dailogAddTitle')
      this.dialogVisible = true
    },
    editAuth(row) {
      // 编辑
      this.editObj = row
      this.authDialogTitle = this.$t('authority.dailogEditTitle')
      this.dialogVisible = true
    },
    delAuth(row) {
      // 删除
    },
    handleCancel() {
      this.dialogVisible = false
      this.editObj = null
    },
    getAuthList() {
      findAuth().then(res => {
        this.authList = res.data
        this.nodeDirectory = res.data.filter(item => item.level === 0)
      })
    },
    refreshList() {
      this.getAuthList()
      this.dialogVisible = false
      this.editObj = null
    }
  }
}
</script>

<style scoped lang="scss">
    .auth-list-mode{
        display: flex;
        margin-top:15px;

        .auth-select{
            width: 20%;
            padding: 15px;
            border:1px $border-eee solid;
        }

        .auth-list{
            width: 78%;
            margin-left: 1.5%;

            ::v-deep(.has-gutter){

                tr,th{
                    background: $bodyBg;
                    text-align: center;
                    color: $titleText;
                }
            }
        }
    }

</style>
