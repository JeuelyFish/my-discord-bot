import {sample} from 'lodash';
import { getRandomUser } from './common.js';


const compliments = [
    'You’re that “Nothing” when people ask me what I’m thinking about.',
    'You look great today.',
    'You’re a smart cookie.',
    'I bet you make babies smile.',
    'You have impeccable manners.',
    'I like your style.',
    'You have the best laugh.',
    'You are the most perfect you there is.',
    'Our system of inside jokes is so advanced that only you and I get it. And I like that.',
    'You’re strong. Like a high level Paladin!',
    'Your perspective is refreshing.',
    'You’re an awesome friend.',
    'You light up the room with your personality.',
    'You deserve a hug right now. <Gives Bot Hug>',
    'You should be proud of yourself. You are an amazing person!',
    'You’re more helpful than you realize.',
    'You have a great sense of humor.',
    'Is that your picture next to “charming” in the dictionary?',
    'Your kindness is a balm to all who encounter it.',
    'You’re all that and a super-size bag of chips.',
    'On a scale from 1 to 10, you’re an 11.',
    'You’re like sunshine on a rainy day.',
    'You bring out the best in other people.',
    'Everything would be better if more people were like you!',
    'You were cool way before hipsters were cool.',
    'Hanging out with you is always a blast.',
    'Being around you makes everything better!',
    'When you’re not afraid to be yourself is when you’re most incredible.',
    'You’re wonderful.',
    'Jokes are funnier when you tell them.',
    'You’re better than a triple-scoop ice cream cone. With sprinkles.',
    'You’re one of a kind! I like you!',
    'Me and you as a combo? Well, I looooOOOooovve that combo.',
    'You’re inspiring.',
    'You should be thanked more often. You contribute so much to everyone around you. So thank you!!',
    'Our community is better because you’re in it.',
    'Someone is getting through something hard right now because you’ve got their back.',
    'You have the best ideas.',
    'You always know how to find that silver lining.',
    'Everyone gets knocked down sometimes, but you always get back up and keep going.',
    'You’re a candle in the darkness.',
    'You’re a great example to others.',
    'Being around you is like being on a happy little vacation.',
    'You always know just what to say.',
    'You’re always learning new things and trying to better yourself, which is awesome.',
    'You could survive a Zombie apocalypse.',
    'You’re more fun than bubble wrap.',
    'Who raised you? They deserve a medal for a job well done.',
    'Your voice is magnificent, I wish I sounded as charming as you.',
    'The people you love are lucky to have you in their lives.',
    'You’re like a breath of fresh air.',
    'You’re gorgeous — and that’s the least interesting thing about you, too.',
    'You’re so thoughtful.',
    'Your creative potential seems limitless.',
    'You’re irresistible when you blush.',
    'Actions speak louder than words, and yours tell an incredible story.',
    'Somehow you make time stop and fly at the same time.',
    'When you make up your mind about something, nothing stands in your way.',
    'You seem to really know who you are.',
    'Any team would be lucky to have you on it. Thanks for being a part of this channel.',
    'In high school I bet you were voted “most likely to keep being awesome.”',
    'I bet you do the crossword puzzle in ink.',
    'Babies and small animals probably love you.',
    'You’re someone’s reason to smile.',
    'You have a good head on your shoulders.',
    'Has anyone ever told you that you have great posture?',
    'The way you treasure your loved ones is incredible.',
    'You’re really something special.',
    'You’re a gift to those around you.',
];
const greetings = [
    'Oh hi,',
    'Hey there,',
    'Hello,',
    'Hiya,',
    'Hey,',
    'Sup,',
    'Hi,',
    'Good day,',
    'Nice to see you today,',
    'Howdy,',
    'Yo,',
];


const getRandomCompliment = () => {
    return sample(compliments);
}

const getRandomGreeting = () => {
    return sample(greetings);
}

export const complimentUser = (user, channel, includeGreeting) => {
    const compliment = getRandomCompliment();
    const greeting = getRandomGreeting();
    channel.send(`${includeGreeting ? greeting : ''} ${user}. ${compliment}`);
};

export const complimentRandomUser = (channel) => {
    return complimentUser(getRandomUser(channel), channel, true);
};
