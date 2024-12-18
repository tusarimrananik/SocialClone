// serverState.js

let isServerBusy = false;  // Flag to indicate whether the server is busy

// Function to get the current server state (whether it's busy or not)
function getServerState() {
    return isServerBusy;
}

// Function to set the server state (busy or not)
function setServerState(state) {
    isServerBusy = state;
}

module.exports = {
    getServerState,
    setServerState
};
