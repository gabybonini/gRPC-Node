const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const readline = require("readline")

const readTerminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const proto = grpc.loadPackageDefinition (
    protoLoader.loadSync("protos/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

const SERVER = "3030"
let username;

const client = new proto.example.Chat (
    SERVER,
    grpc.credentials.createInsecure()
);

// Stream entre servidor e cliente
function startChat() {
    const channel = client.join ({ user: username }) 

    channel.on("data", onData)
    
    readTerminal.on("line", function(text) {
        client.send({ user: username, text: text }, res => {})
    })
};

function onData(message){
    if(message.user == username){
        return;
    }
    console.log(`${message.user}: ${message.text}`)
};

readTerminal.question("Qual seu nome?", answer => {
    username = answer
    startChat();
});

