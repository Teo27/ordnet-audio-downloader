const tableKey = "tableWords";

generateTable();

addExportHandler();

addClearAllHandler();

setWordCount();

function generateTable() {
  chrome.storage.local.get([tableKey], (result) => {
    const words = result[tableKey];

    if (!words) return;

    const tableDOM = document.getElementById("ordnetTable");

    const table = document.createElement("table");

    const thEng = document.createElement("th");
    const thDk = document.createElement("th");

    thEng.innerText = "English";
    thDk.innerText = "Danish";

    const trTh = document.createElement("tr");
    trTh.append(thEng, thDk);

    table.appendChild(trTh);

    for (const word of words) {
      const tr = table.insertRow();
      const eng = tr.insertCell();
      const dk = tr.insertCell();

      eng.appendChild(document.createTextNode(word.eng));
      dk.appendChild(document.createTextNode(word.dk));
    }

    tableDOM.appendChild(table);
  });
}

async function setWordCount() {
  const result = await chrome.storage.local.get([tableKey]);
  const words = result[tableKey];
  const wordCount = document.getElementById("wordCount");

  wordCount.innerText = !words ? 0 : words.length;
}

function addExportHandler() {
  const exportButton = document.getElementById("exportAll");
  exportButton.onclick = exportAll;
}

function addClearAllHandler() {
  const clearButton = document.getElementById("clearAll");
  clearButton.onclick = clearAll;
}

async function clearAll() {
  const result = await chrome.storage.local.get([tableKey]);
  const words = result[tableKey];

  if (!words || words.length === 0) return;

  if (window.confirm("Do you really want to clear all?")) {
    clearOldData();
  }
}

async function exportAll() {
  const result = await chrome.storage.local.get([tableKey]);
  const words = result[tableKey];

  if (!words || words.length === 0) return;

  generateFileContent(words);
  clearOldData();
}

async function clearOldData() {
  await chrome.storage.local.clear();
  const tableDOM = document.getElementById("ordnetTable");
  tableDOM.remove();
  window.close();
}

function generateFileContent(words) {
  let content = "";
  const headerSeparator = "#separator:Semicolon";
  const headerHTML = "#html:true";
  const newLine = "\r\n";

  content += headerSeparator + newLine;
  content += headerHTML + newLine;

  for (const word of words) {
    // By putting ID first, Anki can check for uniqueness
    content +=
      word.id +
      ";" +
      word.eng +
      ";" +
      word.dk +
      ";" +
      word.wordType +
      ";" +
      (word.enOrEt || "") +
      ";" +
      word.audio +
      newLine;
    word.audioFilesURLs.forEach((file) => downloadMedia(file));
  }

  downloadFile(content);
}

function getAudioName(path) {
  return `[sound:${path.split("/").pop()}]`;
}

function downloadFile(fileContent) {
  const fileBlob = new Blob([fileContent], { type: "plain/text" });
  const url = window.URL.createObjectURL(fileBlob);
  console.log(url);

  chrome.runtime.sendMessage({ data: url, type: "words" });

  //   const encodedUri = encodeURI(fileContent);
  //   window.open(encodedUri);
}

function downloadMedia(url) {
  chrome.runtime.sendMessage({ data: url, type: "media" });
}
