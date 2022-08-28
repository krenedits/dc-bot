import { Interaction } from 'discord.js';
import { TClient } from '../..';

const event = {
    name: 'interactionCreate',
    async execute(client: TClient, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) {
                return;
            }

            try {
                command.execute(client, interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Something went wrong!', ephemeral: true });
            }
        }
    },
};

export default event;
