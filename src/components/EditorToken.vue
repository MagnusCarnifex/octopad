<!--
  * ~/src/components/EditorToken.vue
  * component used inside editor for intelligent sentence context
  *
-->

<template>
  <span
    class="token"
    :class="classObj"
    :style="cssVars"
    @click="onClickToken()"
  >
    <span>
      {{ node.textContent }}
    </span>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'EditorToken',
  props: ['node', 'updateAttrs', 'editable', 'options', 'view', 'getPos'],
  mounted() {
    console.log(this.node);
  },
  computed: {
    ...mapGetters(['analyseMode']),
    labelName() {
      return this.node.attrs['data-label-name'];
    },
    tokenId() {
      return this.node.attrs['data-token-id'];
    },
    classObj() {
      return this.analyseMode ? ['is-analyse', 'is-unselectable'] : '';
    },
    cssVars() {
      return {
        '--bg-token-color': this.node.attrs['data-label-color'],
      };
    },
  },
  methods: {
    onClickToken() {
      if (this.analyseMode) {
        alert('node is clicked');
      }
    },
  },
};
</script>

<style scoped>
.token.is-analyse {
  cursor: pointer;
  transition: background-color 300ms ease;
}
.token.is-analyse:hover {
  background-color: var(--bg-token-color);
}
</style>
