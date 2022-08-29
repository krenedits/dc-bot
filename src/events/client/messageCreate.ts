import { ChannelType, Message, VoiceBasedChannel } from 'discord.js';
import { TClient } from '../..';
import { getVoiceStream } from '../../tts/index.js';
import { connectToVoiceChannel } from '../../events/client/voiceStateUpdate.js';

const handleSpeak = (message: Message, client: TClient) => {
    const { author } = message;
    const channel = 
    client.channels.cache.find((channel) => channel.type === ChannelType.GuildVoice && channel.members.has(author.id));
    if (channel?.type !== ChannelType.GuildVoice) return;
    const stream = getVoiceStream(message.content.split(' ').slice(1).join(' '));
    connectToVoiceChannel(channel, client, stream);
}

const event = {
    name: 'messageCreate',
    async execute(client: TClient, message: Message) {
        const words = message.content.split(' ');
        const to = words[0];
        if (to === 'speak') {
            return handleSpeak(message, client);
        }
        if (message.author.bot) return;
        client.users.cache.get(to)?.send(words.slice(1).join(' ') || 'xd');
    },
};

export default event;
