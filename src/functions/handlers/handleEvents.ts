import fs from 'fs';
import { ICommand, TClient } from '../..';

const handleEvents = (client: TClient) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync('./src/events');
        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`./src/events/${folder}`).filter((file) => file.endsWith('.ts'));

            switch (folder) {
                case 'client':
                    for (const file of eventFiles) {
                        const rawEvent = await import(`../../events/${folder}/${file}`);
                        const event = rawEvent.default;
                        if (event.once) {
                            client.once(event.name, (...args) => event.execute(client, ...args));
                        } else {
                            client.on(event.name, (...args) => event.execute(client, ...args));
                        }
                    }
                    break;
                case 'interval':
                    for (const file of eventFiles) {
                        const rawEvent = await import(`../../events/${folder}/${file}`);
                        const event: ICommand = rawEvent.default;
                        event.execute(client);
                    }
            }
        }
    };
};

export default handleEvents;
