const express = require('express');

import { Server as webSocketServer } from 'socket.io';
import { v4 as uuid } from 'uuid';
// const webSocketServer = require('socket.io')
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new webSocketServer(server);
let notes = [];

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('nueva conexion:' + socket.id);
  socket.emit('server:loadnotes', notes);
  socket.on('client:newnote', (newNote) => {
    const note = {
      ...newNote,
      id: uuid(),
    };
    console.log(note);
    notes.push(note);
    socket.emit('server:newnote', note);
  });

  socket.on('client:deletenote', (noteId) => {
    notes = notes.filter((note) => note.id !== noteId);
    socket.emit('server:loadnotes', notes);
  });

  socket.on('client:getnote', (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    socket.emit('server:selectednote', note);
  });

  socket.on('client:updatenote', (note) => {
    console.log(note);
  });
});

server.listen(3000);
console.log('Server on port', 3000);
