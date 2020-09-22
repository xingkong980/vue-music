<template>
  <transition name="slider">
    <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong,processSongsUrl } from "common/js/song";
import MusicList from 'components/music-list/music-list'

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(["singer"]),
    title(){
      return this.singer.name
    },
    bgImage(){
      return this.singer.avatar
    }
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      if (this.singer && this.singer.id) {
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSong(res.data.list);
            processSongsUrl(this.songs).then(res=>{
              this.songs = res
            });
          }
        });
      } else {
        this.$router.push({
          path: `/singer`,
        });
      }
    },
    _normalizeSong(list) {
      let ret = [];
      list.forEach((item) => {
        // 过滤？把item里的musicData赋值，其他不要
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
  components:{
    MusicList
  }
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">



.slider-enter-active, .slider-leave-active {
  transition: all 0.3s;
}

.slider-enter, .slider-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>