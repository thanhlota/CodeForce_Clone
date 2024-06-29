import styles from "./TextEditor.module.css"
import katex from "katex";
import React from "react";
import ReactQuill, { Quill } from "react-quill";
import { useRef, useEffect } from "react";
import $ from "jquery";

const CUSTOM_OPERATORS = [
    ["\\pm", "\\pm"],
    ["\\sqrt{x}", "\\sqrt"],
    ["\\sqrt[3]{x}", "\\sqrt[3]{}"],
    ["\\sqrt[n]{x}", "\\nthroot"],
    ["\\frac{x}{y}", "\\frac"],
    ["\\sum^{s}_{x}{d}", "\\sum"],
    ["\\prod^{s}_{x}{d}", "\\prod"],
    ["\\coprod^{s}_{x}{d}", "\\coprod"],
    ["\\int^{s}_{x}{d}", "\\int"],
    ["\\binom{n}{k}", "\\binom"]
];


if (typeof window !== "undefined") {
    window.katex = katex;
    window.jQuery = window.$ = $;
    window.mathquill4quill = require("mathquill4quill");
    require("@edtr-io/mathquill/build/mathquill.js");
}

const TextEditor = ({ text, handleTextChange, options = { operators: CUSTOM_OPERATORS } }) => {
    const reactQuillRef = useRef(null);
    const didAttachQuillRefs = useRef(false);

    useEffect(() => {
        if (!didAttachQuillRefs.current) {
            attachQuillRefs();
            didAttachQuillRefs.current = true;
        }
    }, []);

    const attachQuillRefs = () => {
        const enableMathQuillFormulaAuthoring = window.mathquill4quill({ Quill, katex });
        enableMathQuillFormulaAuthoring(
            reactQuillRef.current.getEditor(),
            options
        );
    };

    return (
        <div className={styles.editorContainer}>
            <ReactQuill
                ref={reactQuillRef}
                value={text}
                onChange={handleTextChange}
                modules={{
                    formula: true,
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
                    ]
                }}
                theme={"snow"}
                placeholder={"Write some text here..."}
                bounds={".quill"}
                className={styles.editor}
            />
        </div>
    );
};


export default TextEditor;
