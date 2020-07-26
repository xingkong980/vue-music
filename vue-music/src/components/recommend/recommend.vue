<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="banners.length" class="slider-wrapper">
          <div class="slider-content">
            <slider>
              <div v-for="item in banners" v-bind:key="item.id">
                <a :href="item.linkUrl">
                  <img @load="loadImage" :src="item.picUrl" />
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="(item,index) in discList" v-bind:key="index" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgUrl" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creatorName"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
// import { getTopBanner, getBanner} from "@/api/recommend";
import { topBanners, discList } from "common/js/my-resource";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";

export default {
  data() {
    return {
      banners: [],
      discList: [],
    };
  },
  created() {
    setTimeout(() => {
      this._getTopBanner();
    });

    setTimeout(() => {
      this._getDiscList();
    }, 2000);
  },
  methods: {
    _getTopBanner() {
      this.banners = topBanners;
    },
    _getDiscList() {
      this.discList = discList;
    },
    loadImage() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        this.checkLoaded = true;
      }
    },
  },
  components: {
    Slider,
    Scroll,
    Loading,
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden; // 对超出的内容隐藏，可是height为100%为什么会超出？因为内容太多？

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
