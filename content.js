createButton();

function createButton() {
  const soundDivWrapperID = "id-udt";
  const downloadImageUrl = chrome.runtime.getURL("./download.png");
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

// function downloadButtonClick() {
//   const audioFileLocation = document
//     .getElementsByTagName("audio")[0]
//     .getElementsByTagName("a")[0].href;

//   chrome.runtime.sendMessage({ data: audioFileLocation });
// }

async function downloadButtonClick() {
  const eng = prompt("Please enter english translation:");

  if (!eng) return;

  const dk = getDanishWord();

  const audioFileLocation = document
    .getElementsByTagName("audio")[0]
    .getElementsByTagName("a")[0].href;
  chrome.runtime.sendMessage({ data: audioFileLocation });
  const val = { eng, dk, audio: audioFileLocation };
  const tableKey = "tableWords";

  const result = await chrome.storage.local.get([tableKey]);

  let words = result[tableKey];

  if (!words) {
    await chrome.storage.local.set({ [tableKey]: [] });
    const newResult = await chrome.storage.local.get([tableKey]);
    words = newResult[tableKey];
  }

  words.push(val);

  await chrome.storage.local.set({ [tableKey]: words });
}

function getDanishWord() {
  const wordDOM = document.querySelector(".definitionBoxTop > .match");
  return wordDOM.innerText;
}
