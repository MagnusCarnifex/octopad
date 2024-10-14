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
      <div v-if="fileName" class="file-name">Current File: {{ fileName }}</div>
      <Editor
        ref="editorInstance"
        :content="mockData"
        @updated="onEditorUpdate"
        @focused="onEditorFocusChange"
      />
      <button id="saveButton" @click="saveFile">Save as .json</button>
      <button id="saveButtonDocx" @click="saveFileDocx">Save as .docx</button>
      <button id="loadButton" @click="loadFile">Load</button>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import Editor from "./Editor.vue";
import { DOMSerializer } from "prosemirror-model";
import htmlToDocx from "html-to-docx";

export default {
  name: "TestPage",
  components: {
    Editor
  },
  data() {
    return {
      editorJson: null,
      editorHtml: null,
      editorFocused: false,
      fileName: ""
    };
  },
  computed: {
    ...mapGetters(["mockData"])
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
      const jsonString = JSON.stringify(this.editorJson, null, 2);
      console.log("dbg: got jsonString:", jsonString);

      // Check if the File System Access API is supported
      if ("showSaveFilePicker" in window) {
        try {
          // Use the stored fileName if available, otherwise use a default name
          // Show the save file picker
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: this.fileName ? this.fileName : "octopad-file.json",
            types: [
              {
                description: "JSON Files",
                accept: { "application/json": [".json"] }
              }
            ]
          });

          // Create a writable stream
          const writableStream = await fileHandle.createWritable();

          // Write the JSON string to the file
          await writableStream.write(jsonString);

          // Close the file and write the contents to disk
          await writableStream.close();

          alert("File saved successfully!");
        } catch (error) {
          console.error("Error saving file:", error);
          alert("Failed to save file.");
        }
      } else {
        alert("The File System Access API is not supported in this browser.");
      }
    },
    saveFileDocx: async function() {
      const fragment = DOMSerializer.fromSchema(
        this.$refs.editorInstance.editor.schema
      ).serializeFragment(this.$refs.editorInstance.editor.state.doc.content);
      const div = document.createElement("div");
      div.appendChild(fragment);
      //TODO: why are we doing this DOM appending? can I just use the fragment?
      const contentHtml = div.innerHTML;
      const docx = await htmlToDocx(contentHtml);
      console.log(docx);
      // Check if the File System Access API is supported
      if ("showSaveFilePicker" in window) {
        try {
          // get the suggested name
          let suggestedName = this.fileName
            ? this.fileName
            : "octopad-file.docx";
          if (!suggestedName.toLowerCase().endsWith(".docx")) {
            suggestedName =
              suggestedName
                .split(".")
                .slice(0, -1)
                .join(".") + ".docx";
          }
          // Show the save file picker
          const fileHandle = await window.showSaveFilePicker({
            suggestedName,
            types: [
              {
                description: "DOCX Files",
                accept: {
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                    ".docx"
                  ]
                }
              }
            ]
          });

          // Create a writable stream
          const writableStream = await fileHandle.createWritable();

          // Write the JSON string to the file
          await writableStream.write(docx);

          // Close the file and write the contents to disk
          await writableStream.close();

          alert("File saved successfully!");
        } catch (error) {
          console.error("Error saving file:", error);
          alert("Failed to save file.");
        }
      } else {
        alert("The File System Access API is not supported in this browser.");
      }
    },
    loadFile: async function() {
      // Check if the File System Access API is supported
      if ("showOpenFilePicker" in window) {
        try {
          const [fileHandle] = await window.showOpenFilePicker({
            types: [
              {
                description: "Text and JSON Files",
                accept: {
                  "application/json": [".json"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                    ".docx"
                  ]
                  //'text/plain': ['.*'],
                }
              }
            ],
            multiple: false
          });

          // Get the file from the file handle
          const file = await fileHandle.getFile();

          // Store the file name
          this.fileName = file.name;

          // Read the file's text
          const fileContent = await file.text();

          // Parse the JSON content
          const jsonContent = JSON.parse(fileContent);
          // TODO: next step is to hook up editorJson as a vuex aware variable, so Editor can run setContent on the prosemirror instance. We may have to update the component to render editorJson as well
          // TODO: no^ actually, let's have the TestPage, the parent, call a function on this component to setContent on the prosemirror instance. No need to expose the editor's functions outside of the parent scope afaict
          this.$refs.editorInstance.loadJson(jsonContent);
        } catch (e) {
          console.error("Error: failed to read file: ", e);
        }
      }
    }
  }
};
</script>

<style scoped>
.grid-container {
  height: 90vh;
  display: flex;
  flex-direction: column;
  grid-template-columns: 50% 1fr;
  grid-template-rows: min-content 1fr 1fr;
  gap: 1rem;
  grid-template-areas:
    "nav nav"
    "editor feedback-json"
    "editor feedback-html";
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

.file-name {
  margin-bottom: 10px;
  font-weight: bold;
}

.feedback-json pre,
.feedback-html pre {
  overflow-x: clip;
  padding: 1rem;
}
</style>
