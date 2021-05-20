<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div style="cursor: pointer;">
      <span v-if="showText">{{ $t('navbar.language') }}</span>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language==='zh'" command="zh">
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language==='en'" command="en">
          English
        </el-dropdown-item>
      <!-- <el-dropdown-item :disabled="language==='ja'" command="ja">
        日本語
      </el-dropdown-item> -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    showText: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      language: this.$stroage.getItem('language')
    }
  },
  // computed: {
  //   language() {
  //     console.log(this.$stroage.getItem('language'))
  //     return this.$stroage.getItem('language')
  //   }
  // },
  methods: {
    handleSetLanguage(lang) {
      this.$i18n.locale = lang
      this.$stroage.setItem('language', lang)
      this.language = lang
      this.$message({
        message: this.$t('common.switchLanguage'),
        type: 'success'
      })
    }
  }
}
</script>

