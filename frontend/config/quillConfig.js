import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const BlockEmbed = Quill.import('blots/block/embed');

class FormulaBlot extends BlockEmbed {
  static create(value) {
    const node = super.create();
    katex.render(value, node, {
      throwOnError: false
    });
    node.setAttribute('data-value', value);
    return node;
  }

  static value(node) {
    return node.getAttribute('data-value');
  }
}

FormulaBlot.blotName = 'formula';
FormulaBlot.tagName = 'div';

Quill.register({
  'formats/formula': FormulaBlot
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    [{ color: [] }],
    ['code-block', 'formula'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'script',
  'align',
  'color',
  'code-block',
  'formula',
];

export { modules, formats };
