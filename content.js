createButton();

function createButton() {
  const soundDivWrapperID = "id-udt";
  const downloadImageUrl = chrome.extension.getURL("./download.png");
  const element = document.getElementById(soundDivWrapperID);

  const downloadButton = document.createElement("button");
  downloadButton.onclick = downloadButtonClick;
  downloadButton.name = "audioDownload";
  downloadButton.setAttribute(
    "style",
    `background: url('${downloadImageUrl}');`
  );
  downloadButton.style.backgroundSize = "cover";
  downloadButton.style.height = "25px";
  downloadButton.style.width = "25px";

  element.appendChild(downloadButton);
}

function downloadButtonClick() {
  const audioFileLocation = document
    .getElementsByTagName("audio")[0]
    .getElementsByTagName("a")[0].href;

  chrome.runtime.sendMessage({ data: audioFileLocation });
}
