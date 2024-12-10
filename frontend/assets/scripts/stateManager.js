export class StateManager {
    constructor(initialState, callbacks) {
        this.state = initialState;
        this.callbacks = callbacks;
    }

    updateState(newState) {
        this.state = newState;
        if (this.callbacks[newState]) this.callbacks[newState]();
    }

    getState() {
        return this.state;
    }
}
