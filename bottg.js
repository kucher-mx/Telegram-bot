const TelegramBot = require('node-telegram-bot-api');
//const mysql2 = require('mysql2');
const mysql = require('mysql');

// replace the value below with the Telegram token you receive from @BotFather
const token = '1199295640:AAG3dydTdRd39Tj4-FNjcLvVHcV3gYdQfMs';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});


bot.on('message', (msg) => {

  let typeOfMsg = typeMsg(msg);
  
  if(typeOfMsg == 'text'){

    if(msg[typeOfMsg] == 'save me'){

      addUser(msg);
      return;

    }

      bot.sendMessage(msg.chat.id,'your like has been sent📋');
      sendM(msg,typeOfMsg)
  
  } else if(typeOfMsg == 'photo'){

      let phID = msg.photo[0].file_id;
      bot.sendMessage(msg.chat.id,'your like has been sent📷');
      sendM(msg,phID,typeOfMsg)

  } else if(typeOfMsg == 'video'){

      let vidId = msg.video.file_id;
      bot.sendMessage(msg.chat.id,'your like has been sent🎥');
      sendM(msg,vidId,typeOfMsg)

  } else if(typeOfMsg == 'voice'){


      let vcId = msg.voice.file_id;
      bot.sendMessage(msg.chat.id,'your like has been sent🎙');
      sendM(msg,vcId,typeOfMsg)

}

});

bot.on("polling_error", (err) => console.log(err));

function typeMsg(msg) {
    if(msg.hasOwnProperty('text')){
        return 'text';
    } else if (msg.hasOwnProperty('photo')){
        return 'photo';
    } else if (msg.hasOwnProperty('video')){
        return 'video';
    } else if (msg.hasOwnProperty('voice')){
        return 'voice';
    }
}

function sendM(msg,id = null,type = 'text'){

  let user_name = msg.forward_from.first_name;
  let Lname = msg.from.last_name || '';
  let from = msg.from.first_name + ' ' + Lname;
  let query = "SELECT chat_id FROM users WHERE user_name = ?";
  let file_id = id;
  let fileType = type;
  let text = from + ' liked your message❤️';

  let conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'telegram_bot_users'
  });

  conn.connect();

  conn.query(query, user_name ,function(err, results) {
    if(err) console.log(err);
    let chatId = results[0]['chat_id'];
    
    switch(fileType) {
      case 'text' :
        bot.sendMessage(chatId,text);
        bot.sendMessage(chatId,msg[fileType]);
        break;

      case 'photo' :
        bot.sendMessage(chatId,text);
        bot.sendPhoto(chatId,file_id); 
        break;
      
      case 'video' : 
        bot.sendMessage(chatId,text);
        bot.sendVideo(chatId,file_id);
        break;

      case 'voice' : 
        bot.sendMessage(chatId,text);
        bot.sendVoice(chatId,file_id);
        break;
    }

    conn.end(); 

  });

}

function addUser(msg) {
  let username = msg.from.first_name;
  let user_chat_id = msg.from.id;
  let info = [];
  info.push(username);
  info.push(user_chat_id);
  let query = "INSERT INTO users (user_name,chat_id)VALUES (?,?)";

  let conn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'telegram_bot_users'
  });

  conn.connect();

  conn.query(query,info, (err,result) => {
    if (err) throw err;
  })

  conn.end();

}


