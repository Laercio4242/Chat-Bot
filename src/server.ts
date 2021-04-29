import { http } from "./http";
import "./websocket/client";

http.listen(3333, () => console.log("Server rodando na porta 3333"));