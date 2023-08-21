const tableKey = "tableWords";

generateTable();

addExportHandler();

function generateTable() {
  chrome.storage.local.get([tableKey], (result) => {
    const words = result[tableKey];

    if (!words) return;

    const tableDOM = document.getElementById("ordnetTable");

    const table = document.createElement("table");

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

function addExportHandler() {
  const exportButton = document.getElementById("exportAll");
  exportButton.onclick = exportAll;
}

async function exportAll() {
  const result = await chrome.storage.local.get([tableKey]);
  const words = result[tableKey];
  console.log(words);
  generateFileContent(words);
  //   clearOldData();
}

async function clearOldData() {
  await chrome.storage.local.clear();
  const tableDOM = document.getElementById("ordnetTable");
  tableDOM.remove();
}

function generateFileContent(words) {
  let content = "";
  const headerSeparator = "#separator:Semicolon";
  const headerHTML = "#html:true";
  const newLine = "\r\n";

  content += headerSeparator + newLine;
  content += headerHTML + newLine;

  for (const word of words) {
    content += word.eng + ";" + word.dk + ";" + word.audio + newLine;
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
