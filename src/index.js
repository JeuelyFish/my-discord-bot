import {
    Client
} from 'discord.js';
import {
    sample,
    startsWith,
    includes
} from 'lodash';
import {
    getGeneralChat,
    isJeuely,
    isBot,
    logError,
    getRandomUser
} from './helpers/common.js';
import {
    bulkDelete,
    defaultDelete,
    purge
} from './helpers/admin/commands.js';
import {
    complimentMentionedUsers
} from './helpers/admin/responses.js';
import {
    complimentRandomUser
} from './helpers/compliments.js';
import {
    denyCommand,
    giveReply
} from './helpers/replies.js';


import {
    makeChecker,
    makeDaily
} from './helpers/cronJobs.js';

//
//
const client = new Client();
let timeOfLastPurge = 1525149600000; //time for crons

client.on('ready', () => {
    const generalChat = getGeneralChat(client);
    // set up crons
    const purgeAndUpdateTime = () => {
        purge(generalChat, timeOfLastPurge);
        timeOfLastPurge = new Date().getTime();
    }
    const sendRandomCompliment = () => {
        setTimeout(function() {
            complimentRandomUser(generalChat);
        }, random(3600000, 43200000));
    }

    const dailyPurge = makeDaily(purgeAndUpdateTime);
    const dailyCompliment = makeDaily(purgeAndUpdateTime);
    const checker = makeChecker();
    dailyPurge.start();
    dailyCompliment.start();
    checker.start();

    // and say hello
    console.log("Hello World!")
});


//
// Do something with a command
const handleCommand = (message) => {
    const msgContent = message.content;
    const author = message.author;
    const channel = getGeneralChat(client);

    if (!isJeuely(author)) {
        denyCommand(message);
        return;
    }

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
    if (startsWith(message.content, '!')) {
        handleCommand(message)
    }
    //message mentions bot
    if (message.isMentioned('434765029816926218')) {
        if (!isJeuely(message.author)) {
            giveReply(message);
        } else {
            handleResponse(message)
        }
    }

});

client.login(process.env.BOT_TOKEN);
