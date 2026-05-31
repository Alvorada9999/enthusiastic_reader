let lastSavedUrl = ''
let chapterTitle = ''
let workTitle = ''
let currentUrl = ''
console.log("enthusiastic reader")
const readingSitesUrls = ['archiveofourown.org', 'royalroad.com', 'webnovel.com', 'ranobes.net', 'scribblehub.com'];

function getMainDomain(url) {
  const parsedUrl = new URL(url);
  const hostnameParts = parsedUrl.hostname.split('.');

  return hostnameParts.slice(-2).join('.');
}

function getAndSendStatus() {
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
      workTitle = document.getElementsByClassName('dib ell vam c_000')[0].innerText
      break;
    case 'ranobes.net':
      placeholder = document.getElementsByClassName('h4 title')[0].innerText
      chapterTitle = placeholder.slice(0, placeholder.indexOf('\n'))
      workTitle = placeholder.slice(placeholder.indexOf('\n'))
      break;
    case 'scribblehub.com':
      chapterTitle = document.getElementsByClassName('chapter-title')[0].innerText
      workTitle = document.getElementsByClassName('chp_byauthor')[0].innerText
  }
  browser.runtime.sendMessage({ website: getMainDomain(currentUrl), chapterTitle, workTitle, chapterLink: currentUrl })
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && readingSitesUrls.includes(getMainDomain(currentUrl))) {
    getAndSendStatus()
  }
});

(function () {
  const onUrlChange = () => {
    const newUrl = location.href;
    console.log(`New url: ${newUrl} - Current url: ${currentUrl}`)
    if (newUrl !== currentUrl && readingSitesUrls.includes(getMainDomain(newUrl))) {
      currentUrl = newUrl;
      getAndSendStatus()
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
  setInterval(onUrlChange, 5000);
})();
