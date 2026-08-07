const os = require("os");

module.exports = {
  config: {
    name: "uptime",
    description: "Calculates and displays the bot's total active runtime and system statistics.",
    usage: "!uptime",
    author: "Senior Node.js Developer"
  },
  run: async (api, event, args) => {
    // Calculate uptime duration
    const uptimeInSeconds = process.uptime();
    const days = Math.floor(uptimeInSeconds / (3600 * 24));
    const hours = Math.floor((uptimeInSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeInSeconds % 60);

    let uptimeString = "";
    if (days > 0) uptimeString += `${days}d `;
    if (hours > 0 || days > 0) uptimeString += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) uptimeString += `${minutes}m `;
    uptimeString += `${seconds}s`;

    // Calculate memory usage
    const memoryUsage = process.memoryUsage();
    const heapUsedMB = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);

    // Get system platform
    const platform = os.platform();
    const arch = os.arch();

    const response = [
      "⚡ **BOT SYSTEM STATUS & UPTIME**",
      "==================================",
      `• **Bot Uptime:** ${uptimeString}`,
      `• **Node.js Version:** ${process.version}`,
      `• **Heap Memory Used:** ${heapUsedMB} MB`,
      `• **Host RAM Usage:** ${(totalMemGB - freeMemGB).toFixed(2)} GB / ${totalMemGB} GB`,
      `• **Operating System:** ${platform} (${arch})`,
      "==================================",
      "💚 Keeping connections alive and running smoothly."
    ].join("\n");

    api.sendMessage(response, event.threadID, event.messageID);
  }
};
