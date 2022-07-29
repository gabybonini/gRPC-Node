const grpc = require('grpc')
const notesProto = grpc.load('notes.proto')

const notes = [
    {id: '1', title: 'Arquivo 1', content: 'Content 1'},
    {id: '2', title: 'Arquivo 2', content: 'Content 2'}, 
    {id: '3', title: 'Arquivo 3', content: 'Content 3'}  
]

const server = new grpc.Server();

server.addService(notesProto.NoteService.service, {
    list: (_, callback) => {
        callback(null, notes)
    },
})

server.bind('localhost:3333', grpc.ServerCredentials.createInsecure())
console.log('Server running at http://localhost:3333')
server.start()