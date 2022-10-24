// ... add imports and fill in the code
import * as Y from 'yjs';
import * as qd from "quill-delta-to-html"

class CRDTFormat {
  public bold?: Boolean = false;
  public italic?: Boolean = false;
  public underline?: Boolean = false;
};

exports.CRDT = class {
    cb : (update: string, isLocal: Boolean) => void;
    ytext : any;
    ydoc:any;
    constructor(cb: (update: string, isLocal: Boolean) => void) {
        this.cb = cb;
        this.ydoc = new Y.Doc();
        this.ytext = this.ydoc.getText("text");

        // ydoc.get
        // ...
        ['update', 'insert', 'delete', 'toHTML'].forEach(f => (this as any)[f] = (this as any)[f].bind(this));
    }
    update(update: string) {
        console.log(update)
        this.cb("updated_string", false);
    // ...
    }
    insert(index: number, content: string, format: CRDTFormat) {
        this.ytext.insert(index, content, format);
        var html = this.toHTML()
        if(html.startsWith("<p>") && html.endsWith("</p>")) {
            html = html.slice(3, html.length - 4)
        }
        this.cb(html, true);
        // ...
    }
    delete(index: number, length: number) {
        this.ytext.delete(index, length)
        var html = this.toHTML()
        if(html.startsWith("<p>") && html.endsWith("</p>")) {
            html = html.slice(3, html.length - 4)
        }
        this.cb(html, true);
        // ...
    }
    toHTML() {
        let arr = this.ytext.toDelta()
        return new qd.QuillDeltaToHtmlConverter(arr, {}).convert()
    }
};
