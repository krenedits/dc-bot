import { ChannelType, Collection, VoiceChannel } from "discord.js";
import { TClient } from "..";

const getRandomVoiceChannel = async (client: TClient) => {
    await client.guilds.fetch();
    const voiceChannels: Collection<string, VoiceChannel>[] = client.guilds.cache
        .map((guild) =>
            guild.channels.cache.filter((channel) => {
                return channel.type === ChannelType.GuildVoice && channel.members.size > 0;
            }),
        )
        .filter((channels) => channels.size > 0) as Collection<string, VoiceChannel>[];
    const channelCollection = voiceChannels[Math.floor(Math.random() * voiceChannels.length)];
    if (!(channelCollection && channelCollection.first())) return null;
    return channelCollection.random() || null;
}

export default getRandomVoiceChannel;