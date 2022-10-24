import React, {useState, useEffect}from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Editor = () => {
    const [text, setText] = useState('')
    return( 
        <div>
            <ReactQuill theme = "snow" value={text} onChange={setText}/>
        </div>
    )
}

export default Editor;
