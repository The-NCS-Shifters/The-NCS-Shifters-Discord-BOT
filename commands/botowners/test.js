const { MessageEmbed } = require("discord.js");
module.exports = {
   name: "test",
   aliases: ["testcommand"],
   cooldowns: 3000,
   description: "Just Test Command for Developers make",
   usage: "",
   toggleOff: false,
   developersOnly: true,
   userpermissions: ["SEND_MESSAGES", "VIEW_CHANNEL"],

   run: async (client, message, args) => {
      
      var argsdata = args[0];
	   
      const channelfinder = message.guild.channels.cache.filter(cat => cat.name == `StreamChat` && cat.type === "GUILD_CATEGORY");
      const channelsend = message.guild.channels.cache.filter(c => c.name == `${argsdata}-vimm` && c.type == "GUILD_TEXT");
       
     
      message.guild.channels.create("StreamChat", { type: "GUILD_CATEGORY" }).then(channel => {
         message.guild.channels.create(`${argsdata}-vimm`, {
            type: "text",
            permissionOverwrites: [{
               id: message.guild.roles.everyone, 
               allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
               deny: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY'],
            }],
            parent: channel.id
        }).then(channel1 => {
        	 
            const Vimm = require("vimm-chat-lib")

            const chat = new Vimm.VimmChat({
	               token: "BOT TOKEN HERE",
	               debug: false
            })

            function Connect(){

	            chat.connect([argsdata]).then(meta => {
	
		         chat.on("message", msg => {
			         if (msg.roles[0].bot == true) return
                  
                  client.channels.cache.get(channelsend.id).send(`[${msg.chatter}]: ${msg.message}`);
                  
               })
		
		            chat.on("close", event => {
				    
				    console.log(event);

			            if(event){
			
				            chat.connect([argsdata])
				
			            }
			
		            })
		
	            })
	
            }

            Connect() // Initiates connection to Vimm's WS Server.
        })
      })
   },
};
