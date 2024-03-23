// utils/SessionStore.js

class SessionStore {
    constructor() {
        this.sessions = new Map(); 
    }

    // Create or update a session with a text or audio socket
    addSocket(sessionId, socket, type) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, {});
        }
        const session = this.sessions.get(sessionId);
        session[type] = socket;
        console.log(`Added ${type} socket for session ${sessionId}`);
    }

    // Remove a socket from a session
    removeSocket(sessionId, type) {
        const session = this.sessions.get(sessionId);
        if (session && session[type]) {
            delete session[type];
            console.log(`Removed ${type} socket for session ${sessionId}`);
        }
        // Optional: Remove the session if it has no more sockets
        if (session && Object.keys(session).length === 0) {
            this.sessions.delete(sessionId);
            console.log(`Deleted session ${sessionId}`);
        }
    }

    // Get a specific socket for a session
    getSocket(sessionId, type) {
        const session = this.sessions.get(sessionId);
        return session ? session[type] : null;
    }

    // Optional: Extend the class with methods for long-term storage, etc.
}

module.exports = new SessionStore(); // Export as a singleton
