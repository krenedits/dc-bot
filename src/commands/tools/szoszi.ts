import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from 'discord.js';

const szoszi = {
    data: new SlashCommandBuilder().setName('szoszi').setDescription('megmondja a frankót'),
    async execute(_: unknown, interaction: ChatInputCommandInteraction<CacheType>) {
        await interaction.deferReply({
            fetchReply: true,
        });
        await interaction.editReply({
            content: 'szoooszi cigányom rák tegyen beléd gyereket',
        });
    },
};

export default szoszi;
