import React, { useState, useEffect, useRef } from 'react';
import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import styles from './CodeEditor.module.css'

function getLangState(lang) {
    switch (lang) {
        case 'JAVA':
            return java();
        case 'C++':
            return cpp();
        case 'C':
            return cpp();
        default:
            return javascript();
    }
}

const CodeEditor = ({ language, setSrcCode, editable, srcCode, fullWidth, customBackground }) => {
    const editorRef = useRef(null);
    const [editView, setEditView] = useState(null);

    useEffect(() => {
        if (editorRef.current) {
            const startState = EditorState.create({
                doc: srcCode ? srcCode : "",
                extensions: [
                    basicSetup,
                    getLangState(language),
                    EditorView.editable.of(editable),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            if (setSrcCode) setSrcCode(update.state.doc.toString());
                        }
                    }),
                    EditorView.theme({
                        "&": {
                            backgroundColor: customBackground ? customBackground : "#fff",
                        }
                    }, { dark: false })
                ],
            });

            const view = new EditorView({
                state: startState,
                parent: editorRef.current,
            });

            setEditView(view);

            return () => {
                view.destroy();
            };
        }
    }, [])

    useEffect(() => {
        if (editView) {
            editView.dispatch({
                effects: StateEffect.reconfigure.of([
                    basicSetup,
                    getLangState(language),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            setSrcCode(update.state.doc.toString());
                        }
                    })]),
            });
        }
    }, [language])

    return (
        <div className={`${styles.container} ${fullWidth && styles.fullWidth}`} ref={editorRef}></div>
    );
}

export default CodeEditor;