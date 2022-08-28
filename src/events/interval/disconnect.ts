import { ChannelType, Collection, PermissionFlagsBits, VoiceChannel } from 'discord.js';
import { TClient } from '../..';
import { disconnect } from '../client/voiceStateUpdate.js';

const MIN_TIME_BETWEEN_APPERANCES = 5 * 60 * 1000;
const MAX_TIME_BETWEEN_APPERANCES = 10 * 60 * 1000;

const disconnecting = async (client: TClient) => {
    // find a voice channel that is not empty and kick a random member from it
    await client.guilds.fetch();
    const voiceChannels: Collection<string, VoiceChannel>[] = client.guilds.cache
        .map((guild) =>
            guild.channels.cache.filter((channel) => {
                return channel.type === ChannelType.GuildVoice && channel.members.size > 0;
            }),
        )
        .filter((channels) => channels.size > 0) as Collection<string, VoiceChannel>[];
    const channelCollection = voiceChannels[Math.floor(Math.random() * voiceChannels.length)];
    if (!(channelCollection && channelCollection.first())) return;
    const channel = channelCollection.random();
    const members = channel?.members;
    if (!members) return;
    //check members type
    if (members instanceof Collection) {
        let member = members.filter((member) => !member.permissions.has(PermissionFlagsBits.Administrator)).random();
        if (!(member && member.kickable && channel && channel.isVoiceBased())) return;

        disconnect(member, channel, client);
        const randomInterval =
            Math.floor(Math.random() * (MAX_TIME_BETWEEN_APPERANCES - MIN_TIME_BETWEEN_APPERANCES + 1)) +
            MIN_TIME_BETWEEN_APPERANCES;
        setTimeout(() => {
            disconnecting(client);
        }, randomInterval);
    }
};

const event = {
    name: 'disconnect',
    async execute(client: TClient) {
        console.log('meghívódik');
        await disconnecting(client);
    },
};

export default event;
