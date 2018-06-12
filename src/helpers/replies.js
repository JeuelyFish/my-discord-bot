import { sample } from 'lodash';
import { logError, isLoarf, isBezzaton } from './common';

const smileEmojis = [
  '😀', '😁', '😂', '🤣', '😃', '😄', '😆', '😉', '😊', '😋', '😎', '😍',
  '😘', '😗', '😙', '😚', '🙂', '🤗', '😏', '😛', '😜', '😝', '🦈',
];

const muteEmojis = ['💤', '😶', '😴', '😪', '🤐', '🦈',];

export const denyCommand = (message) => {
  const user = message.author;
  if (isBezzaton(user)) {
    message.reply('Woof woof! Woof! WOOF!')
      .catch(err => logError(err));
  } else if (isLoarf(user)) {
    message.reply('Squeek squeek! SQUEEK! squeek!')
      .catch(err => logError(err));
  } else {
    message.reply("I can't... [Thhpptpt] understand... [PlhHHhpptpt] your accent. [ThhppttTtpt]")
      .catch(err => logError(err));
  }
};

export const giveSmilieReply = (message) => {
  message.reply(sample(smileEmojis));
};

export const giveMuteReply = (message) => {
    message.reply(sample(muteEmojis))
}
