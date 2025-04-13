let currentChapterTitle = ''
let currentWebsite = ''
let currentWorkTitle = ''
let currentTabId = ''

let port = browser.runtime.connectNative("enthusiastic_reader_rpc")

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.website != currentWebsite || message.chapterTitle != currentChapterTitle || currentWorkTitle != message.workTitle) {
        currentChapterTitle = message.chapterTitle
        currentWebsite = message.website
        currentWorkTitle = message.workTitle
        currentTabId = sender.tab.id
        //send message to native host
        port.postMessage({ currentChapterTitle, currentWorkTitle, currentWebsite, action: 'update' })
    }
});

browser.tabs.onRemoved.addListener((tabId) => {
    if (currentTabId == tabId) {
        //send message to native host
        port.postMessage({ action: 'delete' })
        currentChapterTitle = ''
        currentWebsite = ''
        currentWorkTitle = ''
        currentTabId = ''
    }
});