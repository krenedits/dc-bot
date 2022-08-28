import dotenv from 'dotenv';
import { Client, GatewayIntentBits, Collection, Partials } from 'discord.js';
import fs from 'fs';

dotenv.config();

export interface ICommand {
    name: string;
    once?: boolean;
    execute: (client: Client, ...args: unknown[]) => void;
}

export type TClient = Client & {
    commands: Collection<string, ICommand>;
    commandArray: ICommand[];
    handleEvents: () => void;
    handleCommands: () => void;
    busy: boolean;
};

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel],
}) as TClient;

client.commands = new Collection();
client.commandArray = [];

const getFunctions = async () => {
    const functionFolders = fs.readdirSync('./src/functions');
    for (const folder of functionFolders) {
        const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file) => file.endsWith('.ts'));
        for (const file of functionFiles) {
            const importedFunction = await import(`./functions/${folder}/${file}`);
            importedFunction.default(client);
        }
    }
};

getFunctions().then(() => {
    client.login(process.env.token).then(() => {
        client.user && client.user.setStatus('dnd');
        client.handleEvents();
        client.handleCommands();
    });
});
