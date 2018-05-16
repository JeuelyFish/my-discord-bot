import { Client } from 'discord.js';
import { sample, startsWith, includes } from 'lodash';
import { getGeneralChat, isJeuely, notJeuelyOrBot } from './helpers/common.js';
import { bulkDelete, defaultDelete, purge } from './helpers/admin/commands.js';
import { complimentMentionedUsers } from './helpers/admin/responses.js';
import { complimentRandomUser } from './helpers/compliments.js';
import { denyCommand, giveReply } from './helpers/replies.js';
import { checker, dailyPurge, dailyCompliment } from './helpers/cronJobs.js';

//
//
const client = new Client();
let timeOfLastPurge = 1525149600000; //time for crons

client.on('ready', () => {
    // set up crons
    dailyPurge(client, timeOfLastPurge).start();
    // dailyCompliment(client).start()
    checker().start();

    // and say hello
    console.log("Hello World!")
});


//
// Do something with a command
const handleCommand = (message) => {
    const msgContent = message.content;
    const author = message.author;
    const channel = getGeneralChat(client);

    if (startsWith(message.content, '!purge')) {
        purge(channel, timeOfLastPurge);
    }

    if (startsWith(message.content, '!delete')) {
        const splitMsg = msgContent.split(' ');
        if (splitMsg.length === 1) {
            defaultDelete(channel);
        } else {
            bulkDelete(channel, splitMsg);
        }
    }
}

//
// Respond in some way to a user
const handleResponse = (message) => {
    const msgContent = message.content;
    const channel = getGeneralChat(client);

    if (includes(message.content, 'compliment')) {
        complimentMentionedUsers(message, channel);
    }

}


//
// Listen to every message
client.on('message', message => {
    //message is a command
    if (startsWith(message.content, '!') && isJeuely(message.author)) {
        handleCommand(message)
    }
    //message mentions bot
    if (message.isMentioned('434765029816926218')) {
        if (notJeuelyOrBot(message.author)) {
            giveReply(message);
        } else if (isJeuely(message.author)) {
            handleResponse(message);
        }
    }

});

client.login(process.env.BOT_TOKEN);
