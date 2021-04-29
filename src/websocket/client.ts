import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { UserService } from "../services/UsersService";
import { MessageService } from "../services/MessagesService";

interface IParams {
    text: string;
    email: string;
}

io.on("connect", (socket) => {
    const connectionService = new ConnectionsService();
    const usersService = new UserService();
    const messageService = new MessageService();

    socket.on("client_first_acess", async (params) => {

        const socket_id = socket.id;
        const { text, email } = params as IParams;
        let user_id = null;

        const userExists = await usersService.findByEmail(email);

        if (!userExists) {
            const user = await usersService.create(email);
            await connectionService.create({
                socket_id,
                user_id: user.id,
            });

            user_id = user.id;
        } else {
            user_id = userExists.id;

            const connection = await connectionService.findyByUserId(userExists.id);

            if (!connection) {

                await connectionService.create({
                    socket_id,
                    user_id: userExists.id,
                });
            } else {
                connection.socket_id = socket_id;
                await connectionService.create(connection);
            }

        }

        await messageService.create({
            text,
            user_id
        });

    });
});