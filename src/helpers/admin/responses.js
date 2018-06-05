import { forEach } from 'lodash';
import { notJeuelyOrBot } from '../common';
import { complimentUser } from '../compliments';


export const complimentMentionedUsers = (message, channel) => {
  const mentionedUsers = message.mentions.users.filter(user => notJeuelyOrBot(user)).array();
  forEach(mentionedUsers, (user) => {
    complimentUser(user, channel);
  });
};
