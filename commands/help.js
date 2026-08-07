module.exports = {
  config: {
    name: "help",
    description: "Lists all available commands and provides details on how to use them.",
    usage: "!help [command_name]",
    author: "Senior Node.js Developer"
  },
  run: async (api, event, args) => {
    const prefix = "!"; // The configured prefix
    
    // If no argument is provided, display the general help menu
    if (args.length === 0) {
      let response = [
        "📚 **MESSENGER BOT HELP MENU**",
        "==================================",
        `Here is a list of all loaded commands. Use the prefix \`${prefix}\` before each command name.\n`
      ];

      let count = 1;
      global.commands.forEach((cmd, name) => {
        response.push(`${count++}. **${prefix}${name}** - ${cmd.config.description || "No description provided."}`);
      });

      response.push("\n==================================");
      response.push(`💡 Tip: Type \`${prefix}help <command_name>\` to get detailed instructions for a specific command.`);

      api.sendMessage(response.join("\n"), event.threadID, event.messageID);
    } 
    // If an argument is specified, look up that command specifically
    else {
      const searchName = args[0].toLowerCase();
      
      if (global.commands.has(searchName)) {
        const cmd = global.commands.get(searchName);
        const response = [
          `🔍 **COMMAND DETAILS: ${searchName.toUpperCase()}**`,
          "==================================",
          `• **Name:** ${cmd.config.name}`,
          `• **Description:** ${cmd.config.description || "No description available."}`,
          `• **Usage:** \`${cmd.config.usage || prefix + cmd.config.name}\``,
          `• **Author:** ${cmd.config.author || "Unknown"}`,
          "=================================="
        ].join("\n");

        api.sendMessage(response, event.threadID, event.messageID);
      } else {
        api.sendMessage(
          `❌ Command \`${prefix}${searchName}\` does not exist. Type \`${prefix}help\` to see all commands.`,
          event.threadID,
          event.messageID
        );
      }
    }
  }
};
