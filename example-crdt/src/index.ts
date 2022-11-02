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
        ['update', 'insert', 'delete', 'toHTML'].forEach(f => (this as any)[f] = (this as any)[f].bind(this));
        this.ydoc.on("update", (update : Uint8Array, origin: any) => {
            const toSend = {
                data: update
            }
            const ret = JSON.stringify(toSend)
            this.cb(ret, origin === null)
        })
    }
    update(update: string) {
        const json = JSON.parse(update)
        if(json.event == "sync") {
            for(let update of json.data) {
                Y.applyUpdate(this.ydoc, update, this.ydoc.clientID)
            }
        } else {
            Y.applyUpdate(this.ydoc, json.data, this.ydoc.clientID)
        }
    }
    insert(index: number, content: string, format: CRDTFormat) {
        this.ytext.insert(index, content, format)
    }
    delete(index: number, length: number) {
        this.ytext.delete(index, length)
    }
    toHTML() {
        let arr = this.ytext.toDelta()
        return new qd.QuillDeltaToHtmlConverter(arr, {}).convert()
    }
};
