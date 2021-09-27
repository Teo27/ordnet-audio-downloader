chrome.runtime.onMessage.addListener((request) => {
  console.log(request);
  if (request?.data) {
    chrome.downloads.download({ url: request.data });
  }
});
