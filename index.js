
console.log('Peep Peep!');

const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token);

client.on('ready', readyDiscord);


function readyDiscord(){
    console.log('ready');
    client.user.setActivity('Nothing! I am on development phase', {type:'WATCHING'}).catch(console.error);

}

// bot.user.setPresence({
//     status: 'online',
//     activity: {
//         name: 'with depression',
//         type: 'STREAMING',
//         url: 'https://www.twitch.tv/monstercat'
//     }
// })
const ytdl = require("ytdl-core");
 


const prefix = 'h!';
const cheerio = require('cheerio');
const request = require('request');

client.on('message', message => {
    let args = message.content.substring(prefix.length).split(" ");

    switch(args[0]){
        case 'image':

        image(message);

        break;
    }
});

function image(message){
    var options = {
      url: "https://www.google.com/imghp?q=" + "image",
      method: "GET",
      headers: {
        "Accept": "text/html",
        "User-Agent": "Chrome",
      }
    };
    request(options, function (error, _response, responseBody) {
            if (error) {
                return;
            }

            $ = cheerio.load(responseBody);

            var links = $(".image a.Link");

            var urls = new Array(links.length).fill(0).map((_v, i) => links.eq(i).attr("href"));

            console.log(urls);
            if (!urls.length) {

                return;
            }



            message.channel.send(urls[Math.floor(Math.random() * urls.length)] + " " + message.guild.members.random());
        });
  };
const queue = new Map();

client.once("ready", () => {
  console.log("Ready!");
});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
   };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Started playing: **${song.title}**`);
}



    // at the top of your file
    
    // inside a command, event listener, etc.
    const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Invite me')
        .setURL('https://discord.com/oauth2/authorize?client_id=782236920733630528&permissions=1133584&scope=bot')
        .setAuthor("Jarwis's help page", 'https://lh3.googleusercontent.com/a-/AOh14Gi5hMRqkpE8DD8OP1gneQ3EP3Syra97UbyOI2kb=s600-k-no-rp-mo', 'https://discord.js.org')
        .setDescription('A bot, currently in development phase..')
        .setThumbnail('https://lh3.googleusercontent.com/a-/AOh14Gi5hMRqkpE8DD8OP1gneQ3EP3Syra97UbyOI2kb=s600-k-no-rp-mo')
        .addFields(
            { name: "what's the prefix of the bot?", value: 'h!' },
            { name: '\u200B', value: '\u200B' },
            { name: 'What can the bot do?', value: "Currently, nothing! it's on development phase! And will have some intresting and unique feature after KewRiePie develops it!", inline: true },
            { name: 'When will the bot be fully functional?', value: 'After about a week', inline: true },
        )
        .addField('Thanks for being excited for the bot! even though you are not excited!', 'See You Soon!', true)
        .setTimestamp()
        .setFooter('A bot for a bot', '');

const replies = [
    'hello',
    'whats up?',
    'lol',
    'oof',
    'yes sir',
]

client.on('message', gotMessage);

function gotMessage(message){
    console.log(message.content);

    if(message.content === 'hi'){
        const r = Math.floor(Math.random() * replies.length);
        message.channel.send(replies[r]);
    }
    if (message.content === 'react') {
        message.react('😄');
    }
    if (message.content === prefix + `server`) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
    if (message.content === prefix + 'userinfo') {

        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
    if(message.content === prefix + 'help') {
        message.channel.send(exampleEmbed);
        message.react('✅');
    }
    if (message.content === prefix + 'avatar') {
        const user = message.author;
    
        return message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
    }
    // If the message content starts with "!kick"
        if (message.content.startsWith(prefix + 'kick')) {
          // Assuming we mention someone in the message, this will return the user
          // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
          const user = message.mentions.users.first();
          // If we have a user mentioned
          if (user) {
            // Now we get the member from the user
            const member = message.guild.member(user);
            // If the member is in the guild
            if (member) {
              /**
               * Kick the member
               * Make sure you run this on a member, not a user!
               * There are big differences between a user and a member
               */
              member
                .kick('Optional reason that will display in the audit logs')
                .then(() => {
                  // We let the message author know we were able to kick the person
                  message.reply(`Successfully kicked ${user.tag}`);
                })
                .catch(err => {
                  // An error happened
                  // This is generally due to the bot not being able to kick the member,
                  // either due to missing permissions or role hierarchy
                  message.reply('I was unable to kick the member');
                  // Log the error
                  console.error(err);
                });
            } else {
              // The mentioned user isn't in this guild
              message.reply("That user isn't in this guild!");
            }
            // Otherwise, if no user was mentioned
          } else {
            message.reply("You didn't mention the user to kick!");
          }
        }
        if (message.content.startsWith(prefix + 'ban')) {
            // Assuming we mention someone in the message, this will return the user
            // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
            const user = message.mentions.users.first();
            // If we have a user mentioned
            if (user) {
              // Now we get the member from the user
              const member = message.guild.member(user);
              // If the member is in the guild
              if (member) {
                /**
                 * Ban the member
                 * Make sure you run this on a member, not a user!
                 * There are big differences between a user and a member
                 * Read more about what ban options there are over at
                 * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
                 */
                member
                  .ban({
                    reason: 'They were bad!',
                  })
                  .then(() => {
                    // We let the message author know we were able to ban the person
                    message.reply(`Successfully banned ${user.tag}`);
                  })
                  .catch(err => {
                    // An error happened
                    // This is generally due to the bot not being able to ban the member,
                    // either due to missing permissions or role hierarchy
                    message.reply('I was unable to ban the member');
                    // Log the error
                    console.error(err);
                  });
              } else {
                // The mentioned user isn't in this guild
                message.reply("That user isn't in this guild!");
              }
            } else {
              // Otherwise, if no user was mentioned
              message.reply("You didn't mention the user to ban!");
            }
        }};