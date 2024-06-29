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
