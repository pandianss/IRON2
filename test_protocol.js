
try {
    const { ProtocolService } = require('./src/core/protocols/ProtocolService.js');
    console.log("ProtocolService loaded successfully.");
    console.log("Active Protocol:", ProtocolService.getActiveProtocol());
} catch (e) {
    console.error("Failed to load ProtocolService:", e);
}
