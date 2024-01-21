module.exports = {
    name: 'eval',
    aliases: ['e'],
    description: '',
    category: 'Owner',
    usage: '',
    cooldown: 3,
    userPermissions: [''],
    botPermissions: [''],
    owner: true,
    run: async (client, message, args) => {
  
      const content = message.content
          .split(" ")
          .slice(1)
          .join(" ");
  
      const result = new Promise(resolve => resolve(eval(content)));
  
      return result
        .then(output => {
          if (typeof output !== "string") {
            output = require("util").inspect(output, { depth: 0 });
          }
          if (output.includes(client.token)) {
            output = output.replace(
              client.token,
              "NDFJSFJKDNMKDMJKADNJSDNJSDNJKSDFKSDJOKAdmksdmksdmksmdksmdk"
            );
          }
  
          message.reply({ content: `\`\`\`js\n${output}\n\`\`\`` })
        })
        .catch(err => {
          err = err.toString();
          if (err.includes(client.token)) {
            err = err.replace(client.token, "ABE SALE");
          }
          message.reply({ content: `\`\`\`js\n${err}\n\`\`\`` })
        });
  
    }
  };