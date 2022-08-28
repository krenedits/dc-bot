//https://kimiquotes.herokuapp.com/quotes

import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from 'discord.js';
import axios from 'axios';

const raikkonen = {
    data: new SlashCommandBuilder().setName('raikkonen').setDescription('raikkönen mondja'),
    execute: async function (_: unknown, interaction: ChatInputCommandInteraction<CacheType>) {
        const { data } = await axios.get('https://kimiquotes.herokuapp.com/quotes');
        await interaction.deferReply({
            fetchReply: true,
        });
        const random = Math.floor(Math.random() * data.length);
        await interaction.editReply({
            content: data[random].quote + ' - ' + data[random].year,
        });
    },
};

export default raikkonen;
