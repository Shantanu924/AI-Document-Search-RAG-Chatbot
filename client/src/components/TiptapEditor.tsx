import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from "@/lib/utils";
import { useEffect } from 'react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export function TiptapEditor({ content, onChange, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing your masterpiece...",
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[400px]',
      },
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="relative w-full border border-input rounded-xl overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-primary transition-all duration-200">
      <div className="border-b border-border bg-muted/20 p-2 flex gap-1 flex-wrap">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("p-2 rounded hover:bg-muted text-sm font-medium transition-colors", 
            editor.isActive('bold') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          )}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("p-2 rounded hover:bg-muted text-sm font-medium transition-colors", 
            editor.isActive('italic') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          )}
        >
          Italic
        </button>
        <div className="w-px h-6 bg-border mx-1 self-center" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={cn("p-2 rounded hover:bg-muted text-sm font-medium transition-colors", 
            editor.isActive('heading', { level: 1 }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          )}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={cn("p-2 rounded hover:bg-muted text-sm font-medium transition-colors", 
            editor.isActive('heading', { level: 2 }) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          )}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn("p-2 rounded hover:bg-muted text-sm font-medium transition-colors", 
            editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
          )}
        >
          List
        </button>
      </div>
      <div className="p-6">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
