import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect } from 'react';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

export default function RichTextEditor({
  label,
  value = '',
  onChange,
  disabled = false,
  placeholder = '',
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noreferrer',
          target: '_blank',
        },
      }),
    ],
    content: value || '',
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'admin-wysiwyg__editor',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = sanitizeHtml(current.getHTML());
      onChange?.(html === '<p></p>' ? '' : html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (sanitizeHtml(current) !== sanitizeHtml(next) && next !== current) {
      editor.commands.setContent(next || '', { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) return null;

  function setLink() {
    const previous = editor.getAttributes('link').href;
    const url = window.prompt('URL du lien', previous || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  return (
    <div className={`admin-wysiwyg${disabled ? ' is-disabled' : ''}`}>
      {label ? <span className="admin-wysiwyg__label">{label}</span> : null}

      <div className="admin-wysiwyg__toolbar" role="toolbar" aria-label="Formatage">
        <button
          type="button"
          className={editor.isActive('bold') ? 'is-active' : ''}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Gras
        </button>
        <button
          type="button"
          className={editor.isActive('italic') ? 'is-active' : ''}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italique
        </button>
        <button
          type="button"
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Liste
        </button>
        <button
          type="button"
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numéros
        </button>
        <button
          type="button"
          className={editor.isActive('link') ? 'is-active' : ''}
          disabled={disabled}
          onClick={setLink}
        >
          Lien
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        >
          Effacer
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
