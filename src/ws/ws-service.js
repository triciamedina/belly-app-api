const WebSocketService = {
    ab2str(buf) {
        return String.fromCharCode.apply(null, new Uint8Array(buf));
    },
    getUniqueID() {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        return s4() + s4() + '-' + s4();
    },
}

module.exports = WebSocketService;