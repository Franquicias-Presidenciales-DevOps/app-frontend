export class BroadcastSession {
  constructor() {
    if (BroadcastSession.instance) {
      throw new Error(
        "Error: Solo se puede crear una instancia de BroadcastSession"
      );
    }
    this.currentId = Date.now().toString();
    this.broadcast = new BroadcastChannel("session_channel");

    BroadcastSession.instance = this;

    window.addEventListener("beforeunload", () => {
      this.broadcast.close();
    });
  }

  static getInstance() {
    if (!BroadcastSession.instance) {
      BroadcastSession.instance = new BroadcastSession();
    }

    return BroadcastSession.instance;
  }

  sendSession(session) {
    this.broadcast.postMessage(session);
  }

  sendReloadWindow(uri = null) {
    this.broadcast.postMessage({ status: "reload", id: this.currentId, uri });
  }

  receiveReloadSession() {
    this.broadcast.onmessage = (event) => {
      const { status, id, uri } = event.data;

      if (status === "reload" && id !== this.currentId) {
        window.location.href = uri ?? "/";
      }
    };
  }
}
