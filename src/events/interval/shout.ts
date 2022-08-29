import { TClient } from "../..";
import getRandomVoiceChannel from "../../utils/getRandomVoiceChannel.js";
import { connectToVoiceChannel } from "../client/voiceStateUpdate.js";
import * as fs from 'fs';
import randomInterval from "../../utils/randomInterval.js";

const MIN_TIME_BETWEEN_APPERANCES = 3 * 60 * 1000;
const MAX_TIME_BETWEEN_APPERANCES = 5 * 60 * 1000;

const playShout = async (client: TClient) => {
    const channel = await getRandomVoiceChannel(client);
    if (!channel) return;
    const soundFiles = fs.readdirSync(`./src/sounds/kuka`).filter((file) => file.endsWith('.mp3'));
    // get a random sound file
    const soundFile = soundFiles[Math.floor(Math.random() * soundFiles.length)];
    connectToVoiceChannel(channel, client, '/../../sounds/kuka/' + soundFile);
    setTimeout(() => {
        playShout(client);
    }, randomInterval(MIN_TIME_BETWEEN_APPERANCES, MAX_TIME_BETWEEN_APPERANCES));
};

const event = {
    name: 'shout',
    async execute(client: TClient) {
        setTimeout(() => playShout(client), 1000);
    },
};      

export default event;