let currentChapterTitle = ''
let currentWebsite = ''
let currentWorkTitle = ''
let currentTabId = ''

const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => console.log('open');
ws.onclose = () => console.log('closed');
ws.onerror = () => console.log('error');
ws.onmessage = e => {
  console.log('msg: ' + e.data);
  if (e.data === 'ping') ws.send('pong');
};

browser.runtime.onMessage.addListener((message, sender, _) => {
  if (message.website != currentWebsite || message.chapterTitle != currentChapterTitle || currentWorkTitle != message.workTitle) {
    currentChapterTitle = message.chapterTitle
    currentWebsite = message.website
    currentWorkTitle = message.workTitle
    chapterLink = message.chapterLink
    currentTabId = sender.tab.id
    ws.send(JSON.stringify({ currentChapterTitle, currentWorkTitle, currentWebsite, chapterLink, action: 'update' }))
  }
});

browser.tabs.onRemoved.addListener((tabId) => {
  if (currentTabId == tabId) {
    ws.send(JSON.stringify({ action: 'delete' }))
    currentChapterTitle = ''
    currentWebsite = ''
    currentWorkTitle = ''
    currentTabId = ''
  }
});
