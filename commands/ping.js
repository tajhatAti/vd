module.exports = {
  config: {
    name: "ping",
    description: "Calculates the execution delay and checks bot responsiveness.",
    usage: "!ping",
    author: "Senior Node.js Developer"
  },
  run: async (api, event, args) => {
    const sendTime = Date.now();
    const timestampDiff = sendTime - Number(event.timestamp);

    api.sendMessage("⏳ Calculating latency...", event.threadID, (err, info) => {
      if (err) {
        console.error("[PING] Error sending temporary message:", err);
        return;
      }
      
      const receiveTime = Date.now();
      const apiLatency = receiveTime - sendTime;

      // Construct a clean, informative response
      const response = [
        "🏓 **PONG!**",
        "==========================",
        `• Network Latency: ${Math.abs(timestampDiff)} ms`,
        `• API Response Time: ${apiLatency} ms`,
        "==========================",
        "🟢 Bot is fully responsive and running smoothly!"
      ].join("\n");

      // Send the final result as a reply/edit
      api.sendMessage(response, event.threadID, event.messageID);
    });
  }
};
