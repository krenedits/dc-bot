import { Message } from 'discord.js';
import { TClient } from '../..';

const event = {
    name: 'messageCreate',
    async execute(client: TClient, message: Message) {
        if (message.author.bot) return;
        const words = message.content.split(' ');
        const to = words[0];
        client.users.cache.get(to)?.send(words.slice(1).join(' ') || 'xd');
    },
};

export default event;
