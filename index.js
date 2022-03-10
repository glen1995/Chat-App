import express from 'express';
import { createServer } from "http";
import { Server } from "socket.io";
import path from 'path'
import { dirname } from 'path';
import {fileURLToPath} from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, 
  {cors: {
    origin: "http://localhost:3000",
  }}  
);

app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

var name;

io.on('connection', (socket) => {
  console.log("connected");

  socket.on('joining msg', (username) => {
    name = username
  	io.emit('chat message', `--- ${name} joined the chat---`);
  });
  
  socket.on('disconnect', () => {
    io.emit('chat message', `--- ${name} left the chat---`);
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });
});

httpServer.listen(8080, () => {
  console.log('Server listening on :8080');
});