import React, {useState, useEffect, useRef, useCallback }from 'react'
import Quill from 'quill';
import { QuillBinding } from 'y-quill'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import 'react-quill/dist/quill.snow.css';
import QuillCursors from 'quill-cursors'

Quill.register('modules/cursors', QuillCursors)

const Editor = (documentId) => {
    // const ydoc = useRef(new Y.Doc())
    // const [text, setText] = useState('')
    // const [quill, setQuill] = useState(<></>)
    // useEffect(() => {
    //     setQuill(<ReactQuill theme = "snow" value={text} onChange={setText}/>)
    //     const provider = new WebrtcProvider(`quill-room-${documentId}`, ydoc.current) 
    //     const ytext = ydoc.current.getText('quill')
    //     const binding = new QuillBinding(ytext, quill, provider.awareness)
    // }, [])
    //useEffect(() => {
    //    const quill = new Quill(document.getElementById('#editor'), {
    //      theme: 'snow' 
    //    })
    //}, [])
    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return
        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const quill = new Quill(editor, {
            theme : "snow",
            modules:{
                cursors: true,
            }
        })
        const ydoc = new Y.Doc()
        const provider = new WebrtcProvider(`quill-room-${documentId}`, ydoc)
        const ytext = ydoc.getText('quill')
        const binding = new QuillBinding(ytext, quill, provider.awareness)
    }, [])
    return( 
        <div id="editor" ref={wrapperRef}>
        </div>
    )
}

export default Editor;
