import { forEach } from 'lodash';
import { getGeneralChat, notJeuelyOrBot } from '../common.js';
import { complimentUser } from '../compliments.js';


export const complimentMentionedUsers = (message, channel) => {
    const mentionedUsers = message.mentions.users.filter(function(user) {
        return notJeuelyOrBot(user);
    }).array();
    forEach(mentionedUsers, (user) => {
        complimentUser(user, channel)
    })
};
