chrome.runtime.onMessage.addListener((request) => {
  if (request?.data) {
    if (request.type === "media") {
      downloadMedia(request.data);
    } else if (request.type === "words") {
      downloadWordContent(request.data);
    }
  }
});

function downloadMedia(data) {
  chrome.downloads.download({ url: data });
}

function downloadWordContent(data) {
  chrome.downloads.download({
    url: data,
    saveAs: true,
    filename: "wordList" + Date.now() + ".txt",
  });
}
