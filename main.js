let lastSavedUrl = ''
let chapterTitle = ''
let workTitle = ''
let currentUrl = ''

function getMainDomain(url) {
  const parsedUrl = new URL(url);
  const hostnameParts = parsedUrl.hostname.split('.');

  return hostnameParts.slice(-2).join('.');
}

function sendStatus() {
  let placeholder = ''
  switch (getMainDomain(currentUrl)) {
    case 'archiveofourown.org':
      chapterTitle = Object.entries(document.getElementsByClassName("title")).filter(x => x['1'].localName === 'h3')['0']['1'].innerText
      workTitle = document.getElementsByClassName('title heading')[0].innerText
      break;
    case 'royalroad.com':
      chapterTitle = document.getElementsByClassName('font-white break-word')['0'].innerText
      workTitle = document.getElementsByClassName('font-white inline-block')[0].innerText
      break;
    case 'webnovel.com':
      chapterTitle = document.getElementsByClassName('j_chapIdx')['0'].innerText + ' ' + document.getElementsByClassName('j_chapName')['0'].innerText
      workTitle = document.getElementsByClassName('lh1 mb16 mla mra oh lh1.2')[0].innerText
      break;
    case 'ranobes.net':
      placeholder = document.getElementsByClassName('h4 title')[0].innerText
      chapterTitle = placeholder.slice(0, placeholder.indexOf('\n'))
      workTitle = placeholder.slice(placeholder.indexOf('\n'))
      break;
  }
  browser.runtime.sendMessage({ website: getMainDomain(currentUrl), chapterTitle, workTitle })
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    sendStatus()
  }
});

(function () {
  currentUrl = '';

  const onUrlChange = () => {
    const newUrl = location.href;
    if (newUrl !== currentUrl) {
      currentUrl = newUrl;
      sendStatus()
    }
  };

  // Patch History API
  const patchHistoryMethod = (type) => {
    const original = history[type];
    history[type] = function (...args) {
      const result = original.apply(this, args);
      onUrlChange();
      return result;
    };
  };

  patchHistoryMethod("pushState");
  patchHistoryMethod("replaceState");
  window.addEventListener("popstate", onUrlChange);

  // Fallback interval (for safety)
  setInterval(onUrlChange, 500);
})();
