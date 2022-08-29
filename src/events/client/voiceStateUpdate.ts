import { GuildMember, VoiceBasedChannel, VoiceState } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { TClient } from '../..';
import Stream from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel, VoiceConnectionStatus
} from '@discordjs/voice';
import introMap from '../../utils/introMap.js';
import names from '../../utils/names.js';

export const connectToVoiceChannel = (
    channel: VoiceBasedChannel,
    client: TClient,
    resourceString: Stream.PassThrough | string,
    callback?: () => void,
) => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.on(VoiceConnectionStatus.Ready, () => {
        client.busy = true;
        const resource = typeof resourceString === 'string' ? createAudioResource(__dirname + resourceString) : createAudioResource(resourceString);
        const player = createAudioPlayer();
        player.play(resource);
        player.on(AudioPlayerStatus.Idle, () => {
            callback?.();
            client.busy = false;
            connection.destroy();
        });
        connection.subscribe(player);
    });
};

export const disconnect = (member: GuildMember, channel: VoiceBasedChannel, client: TClient) => {
    member.voice.setMute(true);
    connectToVoiceChannel(channel, client, '/../../sounds/kick.mp3', () => {
        member.voice.setMute(false);
        member.timeout(60);
        member.timeout(null);
    });
};



const setNicknameOfJoinedMember = (member: GuildMember) => {
    if (member.kickable) {
        // const random name
        const randomName = names[Math.floor(Math.random() * names.length)];
        member.setNickname(randomName);
    }
};

const event = {
    name: 'voiceStateUpdate',
    async execute(client: TClient, oldState: VoiceState, newState: VoiceState) {
        //skip if the user is the bot
        if (newState.member?.user.bot || oldState.member?.user.bot) return;
        if (!oldState?.channel?.id && !client.busy) {
            const channel = newState.channel;
            if (!(channel && newState.member)) return; 
            const name = introMap.get(newState.member.id);
            const soundName = (name ? 'intros/' + name + '_intro' : 'brendon') + '.mp3'; 
            connectToVoiceChannel(channel, client, '/../../sounds/' + soundName);
            setNicknameOfJoinedMember(newState.member);
        }
    },
};

export default event;
