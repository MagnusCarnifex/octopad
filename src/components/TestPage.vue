<!--
  * ~/src/components/TestPage.vue
  * test page
  *
-->

<template>
  <section class="page grid-container">
    <nav class="nav">
      <div class="nav-logo">
        Logo and stuff
      </div>
    </nav>
    <div class="editor" :class="{ 'is-focused': editorFocused }">
      <Editor
        :content="mockData"
        @updated="onEditorUpdate"
        @focused="onEditorFocusChange"
      />
    </div>
    <div class="feedback-json">
      <pre><code v-html="editorJson"></code></pre>
    </div>
    <div class="feedback-html">
      <pre><code>{{ editorHtml }}</code></pre>
    </div>
    <button id="saveButton" @click="saveFile">Save</button>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import Editor from './Editor.vue';

export default {
  name: 'TestPage',
  components: {
    Editor,
  },
  data() {
    return {
      editorJson: null,
      editorHtml: null,
      editorFocused: false,
    };
  },
  computed: {
    ...mapGetters(['mockData']),
  },
  methods: {
    onEditorUpdate({ json, html }) {
      this.editorJson = json;
      this.editorHtml = html;
    },
    onEditorFocusChange(payload) {
      this.editorFocused = payload;
    },
    saveFile: async function() {
      //@ts-ignore
      const jsonString = JSON.stringify(this.editorJson, null, 2);
      console.log('MDAS: got jsonString:', jsonString);

      // Check if the File System Access API is supported
      if ('showSaveFilePicker' in window) {
        try {
            // Show the save file picker
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'octopad-file.json',
                types: [{
                    description: 'JSON Files',
                    accept: {'application/json': ['.json']}
                }]
            });

          // Create a writable stream
          const writableStream = await fileHandle.createWritable();

          // Write the JSON string to the file
          await writableStream.write(jsonString);

          // Close the file and write the contents to disk
          await writableStream.close();

          alert('File saved successfully!');
        } catch (error) {
          console.error('Error saving file:', error);
          alert('Failed to save file.');
        }
      } else {
        alert('The File System Access API is not supported in this browser.');
      }
    },
  },
};

</script>

<style scoped>
.grid-container {
  height: 90vh;
  display: grid;
  grid-template-columns: 50% 1fr;
  grid-template-rows: min-content 1fr 1fr;
  gap: 1rem;
  grid-template-areas:
    'nav nav'
    'editor feedback-json'
    'editor feedback-html';
  padding: 1rem;
}
.nav {
  grid-area: nav;
  padding: 0.5rem;
  height: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: bisque;
  border-bottom: 1px dashed burlywood;
}
.nav img {
  width: 2rem;
  height: 2rem;
}
.editor {
  grid-area: editor;
  padding: 1rem;
  border: 1px dashed burlywood;
}
.editor.is-focused {
  border: 1px solid burlywood;
}
.feedback-json {
  grid-area: feedback-json;
}
.feedback-html {
  grid-area: feedback-html;
}
.feedback-json,
.feedback-html {
  overflow: auto;
  border: 1px dashed burlywood;
  background-color: #f5f5f5;
}

.feedback-json pre,
.feedback-html pre {
  overflow-x: clip;
  padding: 1rem;
}
</style>
