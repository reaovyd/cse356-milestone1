class DequeSingleton {
    constructor() {
        if(DequeSingleton._instance) {
            return DequeSingleton._instance 
        }
        this.deque = []
        this.set = new Set()
        DequeSingleton._instance = this
    }

    append(element) {
        if(this.set.has(element)) {
            this.deque = this.deque.filter(elem => elem != element) 
        } else {
            if(this.deque.length >= 10) {
                this.set.delete(this.deque.pop())
            }
            this.set.add(element)
        }
        this.deque.unshift(element)
    }
    getElements() {
        return this.deque
    }
}

module.exports = DequeSingleton
