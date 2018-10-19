var Discord = require("discord.io");
var logger = require("winston");
var fs = require("fs");
require("dotenv").config();

var help = require("./sendHelp.js");

const beltranID = process.env.BELTRAN_ID;

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true
});
logger.level = "debug";

// Initialize Discord Bot
var bot = new Discord.Client({
  token: process.env.TOKEN,
  autorun: true
});

let isReady = false;
let dispara = [];

bot.on("ready", function(evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
  isReady = true;
  dispara = [];

  bot.setPresence({
    game: {
      name: "a todos los culiaos o.o",
      type: 3
    }
  });

  bot.on("presence", function(user, userID, status, game, event) {
    console.log(user, userID, status, game);
  });
});

function playAudio(file, serverID, userID) {
  const VCID = bot.servers[serverID].members[userID].voice_channel_id;

  bot.joinVoiceChannel(VCID, function(error, events) {
    if (error) return console.error(error);

    bot.getAudioContext(VCID, function(error, stream) {
      if (error) return console.error(error);

      fs.createReadStream(file).pipe(
        stream,
        { end: false }
      );

      stream.on("done", function() {
        bot.leaveVoiceChannel(VCID);
      });
    });
  });
}

function reactToMessage(channelID, messageID) {
  bot.addReaction(
    {
      channelID: channelID,
      messageID: messageID,
      reaction: "💩"
    },
    function(err, res) {
      if (err) console.error(err);
    }
  );
}

function killUser(userID, serverID) {
  bot.ban({
    serverID: serverID,
    userID: userID
  });
}

bot.on("message", (user, userID, channelID, message, evt) => {
  const serverID = evt.d.hasOwnProperty("guild_id")
    ? bot.channels[channelID].guild_id
    : false;
  const messageID = evt.d.id;

  // Our bot needs to know if it will execute a command
  // It will listen for messages that will start with `!`
  if (message.substring(0, 1) === "!" && serverID) {
    var args = message.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);

    switch (cmd) {
      case "help":
        help.sendHelp(bot, userID);
        break;

      case "skoda":
        reactToMessage(channelID, messageID);
        bot.sendMessage({
          to: channelID,
          message: "Me encantan los Skoda!",
          tts: true
        });

        break;

      case "wtf":
        reactToMessage(channelID, messageID);
        if (isReady) {
          isReady = false;
          playAudio("wtf.mp3", serverID, userID);
          isReady = true;
        }
        break;

      case "wololo":
        reactToMessage(channelID, messageID);
        if (isReady) {
          isReady = false;
          playAudio("wololo.mp3", serverID, userID);
          isReady = true;
        }
        break;

      case "epicsave":
        reactToMessage(channelID, messageID);
        if (isReady) {
          isReady = false;
          playAudio("epic_save_1.ogg", serverID, userID);
          isReady = true;
        }
        break;

      case "whatasave":
        reactToMessage(channelID, messageID);
        if (isReady) {
          isReady = false;
          playAudio("what_a_save_1.mp3", serverID, userID);
          isReady = true;
        }
        break;

      case "tetoide":
        reactToMessage(channelID, messageID);
        if (isReady) {
          isReady = false;
          playAudio("martin.mp3", serverID, userID);
          isReady = true;
        }
        break;

      case "alopecico":
        reactToMessage(channelID, messageID);
        bot.sendMessage({
          to: channelID,
          message: "<@!" + beltranID + "> alopécico iletrado.",
          tts: true
        });
        break;

      case "disparatudisparoyo":
        if (dispara.length === 0) {
          dispara.push(userID);
          bot.sendMessage({
            to: channelID,
            message: "<@!" + userID + "> esperando rival."
          });
        } else if (dispara.length === 1) {
          dispara.push(userID);

          const dead = dispara[Math.floor(Math.random() * dispara.length)];

          bot.sendMessage({
            to: channelID,
            message: "<@!" + userID + "> retó a <@!" + dispara[0] + ">"
          });

          dispara = [];

          setTimeout(() => {
            bot.sendMessage({
              to: channelID,
              message: "Adiós, <@!" + dead + ">"
            });
          }, 2000);

          setTimeout(() => {
            killUser(userID, serverID);
          }, 5000);
        }
        break;

      default:
        bot.sendMessage({
          to: channelID,
          message:
            "No sé qué chucha estai diciendo, intenta otro comando. Usa el comando !help para ayuda."
        });

        break;
    }
  }
});

require("http")
  .createServer()
  .listen(3000);
