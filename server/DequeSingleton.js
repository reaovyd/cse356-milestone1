class DequeSingleton {
    constructor() {
        if(DequeSingleton._instance) {
            return DequeSingleton._instance 
        }
        this.deque = []
        DequeSingleton._instance = this
    }

    append(element) {
        if(this.deque.length >= 10) {
            this.deque.pop()
        }
        this.deque.unshift(element)
    }
    getElements() {
        return this.deque
    }
}

module.exports = DequeSingleton
