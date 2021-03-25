const queueVoice = require('../models/queueChannel.js');
exports.run = async (bot, guildID) => {
    let queueChannel = await queueVoice.findOne({
        guildID: guildID
      });
      let queueGuild = await queueVoice.findOne({
        guildID: "42069"
      });
      if(!queueGuild.guilds.includes(guildID)) return;
      if(queueChannel){
        let time;
        let genre;
        if(queueChannel.timezone != 0){
          time = new Date().getHours() + +queueChannel.timezone;
          if(time > 24){
            time-=24;
          } else if(time < 1){
            time+=24;
          }
        } else {
          time = new Date().getHours();
        }
        if(time > 12){
          time-=12;
          if(time == 12){
            time+="PM"
          } else {
            time+="AM"
          }
        } else {
          if(time == 12){
            time+="AM"
          } else {
            time+="PM"
          }
        }
        if(queueChannel.songType == "Animal Crossing **City Folk**"){
          genre = "ACCF"
        } else if(queueChannel.songType == "Animal Crossing **New Horizon**"){
          genre = "ACNH"
        } else if(queueChannel.songType == "Animal Crossing **New Leaf**"){
          genre = "ACNL"
        } else if(queueChannel.songType == "Animal Crossing **Gamecube**"){
          genre = "ACGCN"
        } else {
          genre = "ERROR"
        }
        if(queueChannel.loop != ""){
          time = queueChannel.loop;
        }
        const channel = bot.channels.cache.get(queueChannel.voiceID);
        if (channel) {
        await channel.join().then(async connection => {
          const dispatcher = await connection.play(`./Music/${genre}/${time}.mp3`)
          dispatcher.on('finish', async function(){
            console.log(`./Music/${genre}/${time}.mp3`)
            let command = bot.commands.get("NEWSONG");
            command.run(bot, guildID);
          });
        });
        } else {
          console.log(`deleted ${guildID}`)
          queueGuild.guilds.splice(queueGuild.guilds.indexOf(guildID), 1);
        }
      await queueChannel.save().catch(e => console.log(e));
      await queueGuild.save().catch(e => console.log(e));
    } else return;
}
module.exports.config = {
    name: "NEWSONG",
    description: "dont use this command",
    accessableby: "Everyone",
    usage: "!refresh",
    aliases: []
}
