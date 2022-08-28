import { GuildMember, VoiceBasedChannel, VoiceState } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { TClient } from '../..';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    VoiceConnectionStatus,
} from '@discordjs/voice';
import names from '../../utils/names.js';

const MIN_TIME_BETWEEN_APPERANCES = 3 * 60 * 1000;
const MAX_TIME_BETWEEN_APPERANCES = 5 * 60 * 1000;

export const connectToVoiceChannel = (
    channel: VoiceBasedChannel,
    client: TClient,
    resourceString: string,
    callback?: () => void,
) => {
    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });
    connection.on(VoiceConnectionStatus.Ready, () => {
        client.busy = true;
        const resource = createAudioResource(__dirname + resourceString);
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

const playMusic = (channel: VoiceBasedChannel, client: TClient) => {
    connectToVoiceChannel(channel, client, '/../../sounds/brendon.mp3');
    const randomInterval =
        Math.floor(Math.random() * (MAX_TIME_BETWEEN_APPERANCES - MIN_TIME_BETWEEN_APPERANCES + 1)) +
        MIN_TIME_BETWEEN_APPERANCES;
    setTimeout(() => {
        playMusic(channel, client);
    }, randomInterval);
};

const setNicknameOfJoinedMember = (member: GuildMember, client: TClient) => {
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
            playMusic(channel, client);
            setNicknameOfJoinedMember(newState.member, client);
        }
    },
};

export default event;
