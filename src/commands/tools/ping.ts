import { CacheType, ChatInputCommandInteraction } from 'discord.js';
import { TClient } from '../..';

import { SlashCommandBuilder } from 'discord.js';

const ping = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Pong!'),
    async execute(client: TClient, interaction: ChatInputCommandInteraction<CacheType>) {
        const message = await interaction.deferReply({
            fetchReply: true,
        });

        const content = 'Ping: ' + client.ws.ping + ' geci';
        await interaction.editReply({
            content,
        });
    },
};

export default ping;
