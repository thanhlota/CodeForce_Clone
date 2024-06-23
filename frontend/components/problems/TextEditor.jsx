import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import styles from "./TextEditor.module.css"
import { modules, formats } from '@/config/quillConfig';
const TextEditor = ({ text, handleTextChange }) => {
    return (
        <div className={styles.editorContainer}>
            <ReactQuill
                value={text}
                onChange={handleTextChange}
                modules={modules}
                formats={formats}
                className={styles.editor}
            />
        </div>
    )
}

export default TextEditor;
