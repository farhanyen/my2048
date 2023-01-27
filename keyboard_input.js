
function KeyboardInputManager() {
    this.events = {}

    this.listen()
}

KeyboardInputManager.prototype.on = function(event, callback) {
    if (!this.events.hasOwnProperty(event)){
        this.events[event] = []
    }
    this.events[event].push(callback)
}

KeyboardInputManager.prototype.emit = function(event, data) {
    if (!this.events.hasOwnProperty(event)) {
        return
    }
    for (let callback of this.events[event]) {
        callback(data)
    }
}

KeyboardInputManager.prototype.listen = function() {
    let self = this
    let map = {
        "ArrowUp": 'u',
        "ArrowDown": 'd',
        "ArrowLeft": 'l',
        "ArrowRight": 'r',
        "w": 'u',
        "s": 'd',
        "a": 'l',
        "d": 'r',
    }
    document.addEventListener("keydown", (e) => {
        if (map.hasOwnProperty(e.key)){
            let dir = map[e.key]
            self.emit("move", dir)
            return
        }

        if (e.key == "r") {
            self.emit("restart", null)
        }
    })
}

