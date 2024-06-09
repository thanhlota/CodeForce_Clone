import React, { useState, useEffect, useRef } from 'react';
import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import styles from './CodeEditor.module.css'

const CodeEditor = ({ language, setSrcCode }) => {
    const editorRef = useRef(null);
    const [editView, setEditView] = useState(null);

    useEffect(() => {
        if (editorRef.current) {
            const startState = EditorState.create({
                doc: '',
                extensions: [
                    basicSetup,
                    javascript(),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            setSrcCode(update.state.doc.toString());
                        }
                    })
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
            const languageExtension = (lang) => {
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
            };
            editView.dispatch({
                effects: StateEffect.reconfigure.of([
                    basicSetup,
                    languageExtension(language),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged) {
                            setSrcCode(update.state.doc.toString());
                        }
                    })]),
            });
        }
    }, [language])

    return (
        <div className={styles.container} ref={editorRef}></div>
    );
}

export default CodeEditor;