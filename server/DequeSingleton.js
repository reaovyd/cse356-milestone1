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
        if(this.set.has(element.id)) {
            this.deque = this.deque.filter(elem => elem.id != element.id) 
        } else {
            if(this.deque.length >= 10) {
                this.set.delete(this.deque.pop().id)
            }
            this.set.add(element.id)
        }
        this.deque.unshift(element)
    }
    getElements() {
        return this.deque
    }
    deleteElement(elementId) {
        if(this.set.has(elementId)) {
            this.deque = this.deque.filter(elem => elem.id != elementId)
            this.set.delete(elementId)
        }
    }
}

module.exports = DequeSingleton
