<template>
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :background="background"
    :page-sizes="pageSizes"
    :layout="layout"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import { computed } from 'vue'
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'prev, pager, next, sizes, jumper'
    },
    background: {
      type: Boolean,
      default: true
    }
  },
  emits: ['pagination', 'update:limit', 'update:page'],
  setup(props, { emit }) {
    const pageSize = computed({
      get: () => {
        return props.limit
      },
      set: (val) => {
        emit('update:limit', val)
      }
    })
    const currentPage = computed({
      get: () => {
        return props.page
      },
      set: (val) => {
        emit('update:page', val)
      }
    })
    const handleSizeChange = (val) => {
      // TODO
      emit('pagination', { page: currentPage.value, limit: val })
    }
    const handleCurrentChange = (val) => {
      // 页码
      emit('pagination', { page: val, limit: pageSize.value })
    }
    return {
      pageSize,
      handleSizeChange,
      handleCurrentChange,
      currentPage
    }
  }
}
</script>

<style scoped>

</style>
