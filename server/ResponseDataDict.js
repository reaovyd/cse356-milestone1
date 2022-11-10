class ResponseDataDict {
    constructor() {
        if(ResponseDataDict._instance) {
            return ResponseDataDict._instance
        }
        ResponseDataDict._instance = this
        this.response_dct_lst = {}
        // this.writeQueueDict = {}
        this.user_response_lst = {}
        this.presence_cursor = {}
    }
    createNewRoom(resRoomId, email, response) {
        if(this.response_dct_lst[resRoomId] == undefined) {
            // this.writeQueueDict[resRoomId] = [] 
            this.response_dct_lst[resRoomId] = []
            this.presence_cursor[resRoomId] = {}
        }
        if(this.user_response_lst[email] == undefined) {
            this.user_response_lst[email] = []
        }

        this.response_dct_lst[resRoomId].push({email, response})
        this.user_response_lst[email].push(response)
    }
}

module.exports = ResponseDataDict
