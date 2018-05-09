import {sample} from 'lodash';
import { logError } from './common.js';

const smileEmojis = [
    '😀', '😁', '😂', '🤣', '😃', '😄', '😆', '😉', '😊', '😋', '😎', '😍',
    '😘', '😗', '😙', '😚', '🙂', '🤗', '🤩', '😏', '😛', '😜', '😝', '🦈'
]

export const denyCommand = (message) => {
    const user = message.author
    if (user === 'dog') {
        message.reply('Woof woof! Woof! WOOF!')
          .catch(logError(err));
    } else if(user === 'loarf') {
        message.reply('Squeek squeek! SQUEEK! squeek!')
          .catch(logError(err));
    } else {
        message.reply("I can't... [Thhpptpt] understand... [PlhHHhpptpt] your accent. [ThhppttTtpt]")
          .catch(logError(err));
    }
}

export const giveReply = (message) => {
    message.reply(sample(smileEmojis))
};
