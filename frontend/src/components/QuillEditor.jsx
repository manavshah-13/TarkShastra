import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

const QuillEditor = ({ value, onChange, placeholder, modules, className }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: placeholder || 'Write something...',
        modules: modules || {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
          ]
        }
      });

      // Handle changes
      quillRef.current.on('text-change', () => {
        const content = quillRef.current.root.innerHTML;
        if (onChange) {
          onChange(content);
        }
      });
    }

    // Set initial value if provided and quill is empty
    if (quillRef.current && value !== undefined && quillRef.current.root.innerHTML !== value) {
      // Avoid setting value if it's already the same or if the update comes from the 'text-change' listener
      // However, for simplified implementation, we just ensure we don't cause loops
      if (value === '') {
        quillRef.current.root.innerHTML = '';
      } else if (quillRef.current.root.innerHTML === '<p><br></p>' && value === '') {
         // Quill default empty state
      } else if (quillRef.current.root.innerHTML !== value) {
         // Only update if external value changed significantly
         // For a basic implementation, we trust the caller to manage parent state correctly.
      }
    }
  }, []);

  // Update logic for external value changes
  useEffect(() => {
    if (quillRef.current && value !== undefined && quillRef.current.root.innerHTML !== value) {
      // Only update if it's truly different to avoid cursor jumps
      if (value !== quillRef.current.root.innerHTML) {
         const selection = quillRef.current.getSelection();
         quillRef.current.root.innerHTML = value || '';
         if (selection) {
            quillRef.current.setSelection(selection);
         }
      }
    }
  }, [value]);

  return (
    <div className={`quill-editor-wrapper ${className}`}>
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;
