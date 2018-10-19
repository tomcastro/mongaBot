exports.sendHelp = function(bot, userID) {
  const helpMessage = "Bienvenido al TurriBot. Aquí están todos los comandos:\n\n \
  Comandos de chat: \n\n \
  !skoda - Te diré cuánto me gustan los autos Skoda. \n \
  !alopecico - dile al Beltrán lo que se merece. \n \
  !disparatudisparoyo - el juego más bélico del mercado. Juegue bajo su propio riesgo. \n\n \
  Comandos de voz:\n\n \
  !wtf - what the FACK. \n \
  !wololo - convierte a todas las unidades de tu enemigo. \n \
  !epicsave - EPICU SAVERU \n \
  !whatasave - cuando te mandas el mejor fake del mundo. \n \
  !tetoide - el momento más épico de nuestro querido amigo Martín (alias El Tetoide)";

  bot.sendMessage({
    to: userID,
    message: helpMessage
  });
};
