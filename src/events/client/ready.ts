import { ICommand } from '../..';

const event: ICommand = {
    name: 'ready',
    once: true,
    async execute(client) {
        if (client.user) {
            console.log(`${client.user.tag} is ready!`);
        }
    },
};

export default event;
