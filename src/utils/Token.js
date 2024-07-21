/*
 * ~/src/TokenMark.js
 */

import { Mark } from 'tiptap';
import EditorToken from '../components/EditorToken';

export default class TokenMark extends Mark {
  get name() {
    return 'token';
  }

  get schema() {
    return {
      attrs: {
        'data-label-name': { default: undefined },
        'data-label-color': { default: undefined },
        'data-token-id': { default: undefined },
      },
      group: 'inline',
      parseDOM: [
        {
          tag: 'div',
          getAttrs: (dom) => ({
            'data-label-name': dom.getAttribute('data-label-name'),
          }),
        },
      ],
      toDOM: (node) => ['token', node.attrs],
    };
  }

  get view() {
    return EditorToken;
  }
}
