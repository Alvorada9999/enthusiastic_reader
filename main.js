let lastSavedUrl = ''
let chapterTitle = ''
let workTitle = ''
let currentUrl = ''

function getMainDomain(url) {
  const parsedUrl = new URL(url);
  const hostnameParts = parsedUrl.hostname.split('.');

  if (hostnameParts.length <= 2) {
    return parsedUrl.hostname; // Already a main domain (like example.com)
  }

  // Handle common public suffixes like co.uk, com.au, etc.
  const tlds = ['co.uk', 'com.au', 'org.uk']; // Extend as needed
  const lastTwo = hostnameParts.slice(-2).join('.');
  const lastThree = hostnameParts.slice(-3).join('.');

  if (tlds.includes(lastTwo)) {
    return lastThree;
  }

  return lastTwo;
}

function sendStatus() {
  switch (getMainDomain(currentUrl)) {
    case 'archiveofourown.org':
      chapterTitle = Object.entries(document.getElementsByClassName("title")).filter(x => x['1'].localName === 'h3')['0']['1'].innerText
      workTitle = document.getElementsByClassName('title heading')[0].innerText
      break;
    case 'royalroad.com':
      chapterTitle = document.getElementsByClassName('font-white break-word')['0'].innerText
      workTitle = document.getElementsByClassName('font-white inline-block')[0].innerText
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