<template>
  <scroll
    class="listview"
    ref="listview"
    :data="data"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
  >
    <ul>
      <li class="list-group" v-for="(group,index) in data" :key="index" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" @click="select(item)" v-for="(item,index) in group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar" />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart($event)"
      @touchmove.stop.prevent="onShortcutTouchMove($event)"
    >
      <ul>
        <li
          v-for="(item,index) in shortList"
          :key="index"
          class="item"
          :data-index="index"
          :class="{'current': currentIndex === index}"
        >{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";

// 样式定义的每个索引元素的高度，font-size+padding*2（上下）
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  props: {
    data: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
    };
  },
  created() {
    // data，props，computed的数据是会被vue检测的，而在created里创建的则不会，仅作为共享数据使用
    this.probeType = 3;
    this.listenScroll = true;
    this.touch = {};
    this.listHeight = [];
  },
  computed: {
    shortList() {
      return this.data.map((group) => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return null;
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    },
  },
  components: {
    Scroll,
    Loading,
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      if (
        !this.listHeight ||
        (this.listHeight && this.listHeight.length === 0)
      ) {
        this._calculateHeight();
      }
      const listHeight = this.listHeight;
      // 为什么不起作用？可能是少个等于？
      if (newY >= 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length; i++) {
        // 提取边界
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (!height2 || (-newY >= height1 && -newY < height2)) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop === fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
  },
  methods: {
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      //记录当前touch的Y值，e.touches即你的手指碰到位置？
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      // console.log(firstTouch.pageY);
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      //需要记录开始到结束滚动的距离，即初始高度和结束高度之差
      //move拿到的确定是最后的高度吗？
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    select(item){
      this.$emit('select',item)
    },
    _calculateHeight() {
      //计算每个item的高度
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        // 一个item是指包括title在内的item的一个li的内容，直接取它的clientHeight
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    _scrollTo(index) {
      // 滚动到相应地方同时获取Y值
      if (!index && index !== 0) {
        return;
      }
      // 边界处理（小于零的为0，大于底部为底）
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        //这里是什么意思呢？减去listHeight包括的顶线0和底线z的底部
        index = this.listHeight.length - 2;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      this.scrollY = -this.listHeight[index];
    },
  },
};
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: fixed;
    z-index: 30;
    right: 0;
    top: 20%;
    transform: translateY(0);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>