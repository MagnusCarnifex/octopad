# Background

Basing work off this [codesandbox example](https://codesandbox.io/s/tiptap-test-zdxmm).

# Notes

## Vue CLI
Vue CLI is being used to scaffold the project, think of it less of a cli tool and more of a framework around which we have the server/transpilation/etc.

## Storage
Starting testing with S3, using versioned buckets, and server-side S3 managed key encryption (SSE-S3). Object lock is disabled.

Consider testing combinations of encryptions/non-encryption, versioning, object lock, etc

## Approach

### File downloads
When it comes to saving the content locally, we should use the File System API where possible, otherwise, do the horrible \<a\> tag stuff. Right now, only File System API is supported, so Firefox is not supported.

Also, add option to save to .odt would be nice

### Chores:
next: accept aws creds for bucket writing/retrieval on main webpage, store in localStorage so users don't have to re-enter it all the time.
eventually: Have this run in docker so users can run it anywhere without setup
