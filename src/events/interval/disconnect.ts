import { Collection, PermissionFlagsBits } from 'discord.js';
import { TClient } from '../..';
import getRandomVoiceChannel from '../../utils/getRandomVoiceChannel.js';
import randomInterval from '../../utils/randomInterval.js';
import { disconnect } from '../client/voiceStateUpdate.js';

const MIN_TIME_BETWEEN_APPERANCES = 10 * 60 * 1000;
const MAX_TIME_BETWEEN_APPERANCES = 20 * 60 * 1000;

const disconnecting = async (client: TClient) => {
    const channel = await getRandomVoiceChannel(client);
    if (!channel?.members) return;
    const { members } = channel;
    //check members type
    if (members instanceof Collection) {
        let member = members.filter((member) => !member.permissions.has(PermissionFlagsBits.Administrator)).random();
        if (!(member && member.kickable && channel && channel.isVoiceBased())) return;

        disconnect(member, channel, client);
        
        setTimeout(() => {
            disconnecting(client);
        }, randomInterval(MIN_TIME_BETWEEN_APPERANCES, MAX_TIME_BETWEEN_APPERANCES));
    }
};

const event = {
    name: 'disconnect',
    async execute(client: TClient) {
        setTimeout(() => disconnecting(client), randomInterval(MIN_TIME_BETWEEN_APPERANCES, MAX_TIME_BETWEEN_APPERANCES));
    },
};

export default event;
