<template>
  <transition name="slider">
    <div class="singer-detail"></div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import {createSong} from "common/js/song"

export default {
  data(){
    return {}
  },
  computed: {
    ...mapGetters(["singer"]),
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if (this.singer && this.singer.id) {
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.data.list)
            console.log(res.data.list)
          }
        });
      } else {
        this.$router.push({
          path: `/singer`,
        });
      }
    },
    _normalizeSong(list){
      let ret = []
      list.forEach(item => {
        // 过滤？把item里的musicData赋值，其他不要
        let {musicData} = item
        if(musicData.songid && musicData.albummid){
          ret.push(createSong(musicData))
        }
      });
      return ret;
    }
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable';

.singer-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: $color-background;
}

.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>