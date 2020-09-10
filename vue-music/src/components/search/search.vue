<template>
  <div>
      搜索页面
  </div>
</template>

<script>
import { getTopBanner,testProxy } from "@/api/recommend";
export default {
  data() {
    return {};
  },
  created() {
    this._getTopBanner();
  },
  methods: {
    _getTopBanner() {
      console.log("进入方法");
      const e = testProxy();
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
</style>