import { WebSocketServer } from 'ws'
const PORT = 8080;

const wss = new WebSocketServer({ port: PORT }, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

import { Client, ActivityType, PresenceBuilder } from 'discord-rpc-new'
// Environment variable for Discord Client ID
const DISCORD_CLIENT_ID = '1360799649363132528';
const client = new Client();
// Gracefully shuts down the RPC client on process termination.
const shutdown = async () => {
  console.log('Shutting down RPC client...');
  await client.destroy();
  console.log('RPC client destroyed. Exiting.');
  process.exit(0);
};
// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
// Login and print user info
const response = await client.login({ clientId: DISCORD_CLIENT_ID });
console.log('Logged in as:', response.user.username);


let currentWorkTitle = ''
let currentImage = {
  'archiveofourown.org': 'ao3_big_white_background_no_bg',
  'royalroad.com': 'royal_road_big_white_background_no_bg',
  'webnovel.com': 'webnovel_logo2',
  'ranobes.net': 'ranobes_logo2',
  'scribblehub.com': 'scribblehub_logo_final2'
}
let currentStartDate = null
function getStartDate(workTitle) {
  if (workTitle == currentWorkTitle) return currentStartDate
  currentStartDate = Date.now()
  currentWorkTitle = workTitle
  return currentStartDate
}

wss.on('connection', function connection(ws, req) {
  const clientAddr = req.socket.remoteAddress + ':' + req.socket.remotePort;
  console.log('Client connected:', clientAddr);

  ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to server' }));

  ws.on('message', async function incoming(data) {
    if (data == 'pong') {
      console.log(`Received a pong from ${clientAddr}`)
    } else {
      const message = JSON.parse(data);
      console.log(`Received from ${clientAddr}:`, message);
      switch (message.action) {
        case 'update':
          const activity = new PresenceBuilder()
            .setType(ActivityType.Playing)
            .setDetails(`${message.currentWorkTitle}`)
            .setState(`${message.currentChapterTitle}`)
            .setLargeImage(currentImage[message.currentWebsite])
            .setStartTimestamp(getStartDate(message.currentWorkTitle))
            .setButtons([{ label: 'Read together', url: message.chapterLink }])
            //.addButton('Read together', message.chapterLink)
            .build();
          await client.setActivity(activity);
          break;
        case 'delete':
          currentWorkTitle = ''
          await client.clearActivity();
          break;
      }
    }
  });

  ws.on('close', async () => {
    console.log('Client disconnected:', clientAddr);
    await client.clearActivity();
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
  setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) ws.send('ping');
    });
  }, 5000)
});
