<template>
  <div class="word-cloud">
    <ul class="st-classify-rank-list" ref="hotWord">
      <li
        class="st-err-item"
        :class="[item.colorClass, item.fsClass]"
        v-for="item in wordCloudData"
        :key="item.id"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { tagsCloud, update } from "@/utils/tagsCloud.js";

export default {
  props: {
    wordCloudData: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      hotWordTimer: null,
    };
  },
  watch: {
    wordCloudData: {
      deep: true,
      immediate: true,
      handler: function (newValue, oldValue) {
        if (this.hotWordTimer) {
          clearInterval(this.hotWordTimer);
          this.hotWordTimer = null;
        }
        if (newValue) {
          this.renderHotWord();
        }
      },
    },
  },
  methods: {
    tagsCloud,
    update,
    renderHotWord() {
      if (this.hotWordTimer) {
        clearInterval(this.hotWordTimer);
        this.hotWordTimer = null;
      }
      this.$nextTick(() => {
        this.tagsCloud(this.$refs.hotWord);
        this.update();
        this.hotWordTimer = setInterval(this.update, 80);
      });
    },
  },
};
</script>
<style scoped >
.word-cloud {
  height: 100%;
  width: 100%;
}
</style>
