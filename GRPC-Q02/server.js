const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")

const server = new grpc.Server();
const SERVER_ADDRES = "3000";

// carregando  protobuf
const proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("protos/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let users = []

// cliente entra no chat
function join(call, callback){
    users.push(call);
    notifyChat({ 
        user: "Server",
        text: "Novo usuário participando."})
}

//mensagem recebida
function send(call, callback) {
    notifyChat(call.request)
}

// mensagem enviada para clientes conectados
function notifyChat(message){
    users.forEach(user => {
        user.write(message);
    })
}

server.addService(proto.example.Chat.service, {join: join, send: send });
server.bind(SERVER_ADDRES, grpc.ServerCredentials.createInsecure());
server.start();


