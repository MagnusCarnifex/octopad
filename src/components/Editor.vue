<!--
  * ~/src/components/Editor.vue
  * text editor component
  *
-->

<template>
  <section>
    <editor-menu-bar
      class="toolbar"
      :editor="editor"
      v-slot="{ commands, isActive }"
    >
      <div class="toolbar-flex">
        <!-- HEADING GROUP -->
        <button
          class="button is-small mr-3"
          :class="{ 'is-active': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          <span class="icon is-small">
            <icon-heading />
          </span>
        </button>

        <!-- BOLD AND ITALIC GROUP -->
        <div class="field has-addons">
          <p class="control">
            <button
              class="button is-small"
              :class="{ 'is-active': isActive.bold() }"
              @click="commands.bold"
            >
              <span class="icon is-small">
                <icon-bold />
              </span>
            </button>
          </p>
          <p class="control">
            <button
              class="button is-small"
              :class="{ 'is-active': isActive.italic() }"
              @click="commands.italic"
            >
              <span class="icon is-small">
                <icon-italic />
              </span>
            </button>
          </p>
        </div>

        <!-- ANALYSE MODE TOGGLE -->
        <button
          class="button is-small"
          :class="{ 'is-primary': analyseMode }"
          style="margin-left: auto"
          @click="TOGGLE_ANALYSE_MODE()"
        >
          <span class="icon is-small">
            <icon-analyse />
          </span>
        </button>
      </div>
    </editor-menu-bar>

    <editor-content class="content" :editor="editor" />
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import { Bold, Italic, Heading, History } from 'tiptap-extensions';
import Token from '../utils/Token';
import IconBold from './IconBold';
import IconItalic from './IconItalic';
import IconHeading from './IconHeading';
import IconAnalyse from './IconAnalyse.vue';

export default {
  name: 'Editor',
  components: {
    EditorMenuBar,
    EditorContent,
    IconBold,
    IconItalic,
    IconHeading,
    IconAnalyse,
  },
  props: {
    content: {
      type: [Object, String],
      default: null,
    },
  },
  data() {
    return {
      // Create an `Editor` instance with some default content. The editor is
      // then passed to the `EditorContent` component as a `prop`
      editor: new Editor({
        extensions: [
          new Token(),
          new Bold(),
          new Italic(),
          new Heading({ levels: [3] }),
          new History(),
        ],
        content: '',
        onUpdate: ({ getJSON, getHTML }) => {
          this.$emit('updated', { json: getJSON(), html: getHTML() });
        },
        onFocus: () => {
          this.$emit('focused', true);
        },
        onBlur: () => {
          this.$emit('focused', false);
        },
      }),
    };
  },
  computed: {
    ...mapGetters(['analyseMode']),
  },
  watch: {
    analyseMode(isTrue) {
      if (isTrue) {
        this.editor.setOptions({ editable: false });
      } else {
        this.editor.setOptions({ editable: true });
      }
    },
  },
  mounted() {
    if (this.content) this.editor.setContent(this.content, true);
  },
  beforeDestroy() {
    // Always destroy your editor instance when it's no longer needed
    this.editor.destroy();
  },
  methods: {
    ...mapMutations(['TOGGLE_ANALYSE_MODE']),
  },
};
</script>

<style scoped>
.content >>> .ProseMirror {
  font-family: monospace;
  font-size: 1rem;
  line-height: 1.4rem;
}
.content >>> .ProseMirror-focused {
  outline: none;
}
.toolbar {
  margin-bottom: 1rem;
}
.toolbar-flex {
  display: flex;
}
</style>
