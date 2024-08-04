# Background

Basing work off this [codesandbox example](https://codesandbox.io/s/tiptap-test-zdxmm).

# Notes

## Vue CLI
Vue CLI is being used to scaffold the project, think of it less of a cli tool and more of a framework around which we have the server/transpilation/etc.

## Approach

### File downloads
When it comes to saving the content locally, we should use the File System API where possible, otherwise, do the horrible \<a\> tag stuff.

Also, add option to save to .docx and .odt
