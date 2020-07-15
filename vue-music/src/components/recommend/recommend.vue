<template>
  <div>
    推荐页面
  </div>
</template>

<script>
import { getTopBanner } from "@/api/recommend";
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
      const e = getTopBanner();
      console.log(e);
    }
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus"></style>
