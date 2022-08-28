import { TClient } from '../..';

import fs from 'fs';
import { REST, Routes } from 'discord.js';

const handleCommands = async (client: TClient) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith('.ts'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const rawCommand = await import(`../../commands/${folder}/${file}`);
                const command = rawCommand.default;
                commands.set(command.data.name, command);
                if (Array.isArray(commandArray)) {
                    commandArray.push(command.data.toJSON());
                }
            }

            const clientId = '1012115440488689685';
            const rest = new REST({ version: '9' }).setToken(process.env.token || '');
            try {
                await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray });
            } catch (error) {
                console.log(error);
            }
        }
    };
};

export default handleCommands;
