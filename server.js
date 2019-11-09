const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'))
app.engine('html',require('ejs').renderFile)
app.set('view engine', 'html');

app.use('/',(req,res)=>{
    res.render('index.html')
})

let messages = [];
io.on('connection', (socket) => {
    console.log(`Cliente conectado ${socket.id}`)
    socket.emit('previousMessages',messages)
    socket.on('sendMessage',data=>{
        if (messages.length > 20) {
            messages = []
            socket.broadcast.emit('clearAllChats');
            socket.emit('clearMyChat', data)
        }
        socket.emit('myMessage', data)
        messages.push(data);
        socket.broadcast.emit('receivedMsg',data);
        
    })
});

server.listen(80)