import React, {useState, useCallback} from "react";
import {useParams} from "react-router-dom";
import Quill from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import 'quill/dist/quill.snow.css'
import axios from "axios";
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import QuillCursors from "quill-cursors"; 
import Cookies from 'js-cookie'
Quill.register('modules/cursors', QuillCursors);

const baseUrl = `http://jasons.cse356.compas.cs.stonybrook.edu`


const Editor = () => {
    const { id } = useParams()

     const wrapperRef = useCallback(wrapper => {
         if(wrapper == null) return
         const sse = new EventSource(`${baseUrl}/api/connect/${id}`, {withCredentials: true})
         var myToolbar= [
             ['bold', 'italic', 'underline', 'strike'],       
             ['blockquote', 'code-block'],

             [{ 'color': [] }, { 'background': [] }],         
             [{ 'font': [] }],
             [{ 'align': [] }],

             ['clean'],                                        
         ];

 
         wrapper.innerHTML = ""
         const editor = document.createElement("div")
         wrapper.append(editor)
         const doc = new Y.Doc()
         var type = doc.getText("quill")
         doc.on("update", (update, origin) => {
             console.log("i am update", update, origin)
             if(origin == null || origin == undefined) {

             } else if(doc.clientID === origin.doc.clientID) {
                 const data = Array.from(update)
                 axios.post(`${baseUrl}/api/op/${id}`, {data: data}, {withCredentials: true}).then(res => {
                     if(res.data.error == true) {
                         throw new Error(res.data.message)
                     }
                 }).catch(err => {
                 })
             }
         })
 
         const quill = new Quill(editor, {theme:'snow',
         modules: {
             toolbar: {
                 container: myToolbar,
             },
             cursors: true
         }})
         const cursors = quill.getModule('cursors');

         const sessionId = window.localStorage.getItem("sessionId") 
         const name = window.localStorage.getItem("name")
         const binding = new QuillBinding(type, quill)


         //cursors.createCursor(sessionId, name, "blue")
         //cursors.toggleFlag(sessionId, true)

         quill.on("selection-change", function(range, oldRange, source) {
             if(range) {
                 cursors.moveCursor(sessionId, range) 
                 axios.post(`${baseUrl}/api/presence/${id}`,{
                     index:range.index, 
                     length: range.length
                 }, {withCredentials:true}).then(res => {
                 }).catch(err => {
                     console.error(err)
                 })
             }
         })

 
         sse.addEventListener("sync", (e) => {
             const mapArray = JSON.parse(e.data).data.map(arr => new Uint8Array(arr))
             mapArray.forEach(arr => {
                 Y.applyUpdate(doc, arr, null)
             })
             console.log(type.toDelta())
             cursors.createCursor(sessionId, name, "blue")
             cursors.toggleFlag(sessionId, true)
         })
         sse.addEventListener("update", (e) =>{
             console.log(new Uint8Array(JSON.parse(e.data).data))
             Y.applyUpdate(doc, new Uint8Array(JSON.parse(e.data).data), null) 

             //console.log(type.toDelta())
             //var converter = new QuillDeltaToHtmlConverter(type.toDelta(),{})
             //console.log(converter.convert())
         })

         sse.addEventListener("presence", (e) => {
             const json = JSON.parse(e.data)
             if(json.session_id !== sessionId) {
                 cursors.createCursor(json.session_id, json.name, "blue")
                 cursors.toggleFlag(json.session_id, true)
                 cursors.moveCursor(json.session_id, json.cursor)
             }
         })
    }, [])
    return (
        <div id="editor" ref={wrapperRef}>
        </div>
    )
}

export default Editor;

