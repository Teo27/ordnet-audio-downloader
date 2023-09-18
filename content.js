createButton();

function createButton() {
  const soundDivWrapperID = "id-udt";
  const downloadImageUrl = chrome.runtime.getURL("./download.png");
  const element = document.getElementById(soundDivWrapperID);

  if (!element) return;

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

async function downloadButtonClick() {
  const tableKey = "tableWords";
  const result = await chrome.storage.local.get([tableKey]);

  let words = result[tableKey];

  if (!words) {
    await chrome.storage.local.set({ [tableKey]: [] });
    const newResult = await chrome.storage.local.get([tableKey]);
    words = newResult[tableKey];
  }

  const firstAudioLink = document
    .getElementsByTagName("audio")[0]
    .getElementsByTagName("a")[0].href;

  const id = getIDFromAudioURL(firstAudioLink);

  if (words.find((word) => word.id === id)) {
    window.alert("Word already added.");
    return;
  }

  const eng = prompt("Please enter english translation:");

  if (!eng) return;

  const dk = getDanishWord();
  let wordType = getWordType();

  let enOrEt = undefined;
  if (wordType.startsWith("substantiv")) {
    const splitWords = wordType.split(",");

    wordType = splitWords[0].trim();
    enOrEt = splitWords[1].trim();
  }

  // konjunktion
  // substantiv
  // infinitivpartikel
  // adjektiv

  const suffixes = document
    .getElementById("id-boj")
    ?.getElementsByClassName("tekstmedium")[0].innerText;

  const audioHTMLCollection = document
    .getElementById("id-udt")
    ?.getElementsByClassName("tekstmedium")[0].children;

  const audioSpellTag = "lydskrift";
  const audioTenseTag = "diskret";

  let audioHTMLString = "Base: ";

  const audioFilesURLs = [];

  // Base / nutid / datid / fornutid

  for (const audioHTML of audioHTMLCollection) {
    if (audioHTML.classList.contains(audioSpellTag)) {
      const spelling = extractTextContent(audioHTML.innerText).trim();

      const audioTag = audioHTML.getElementsByTagName("audio")[0];
      audioHTMLString += spelling;

      if (audioTag) {
        const audioURL = audioTag.getElementsByTagName("a")[0]?.href;
        const audioName = getAudioName(audioURL);

        audioHTMLString += audioName;
        audioFilesURLs.push(audioURL);
      }
    } else if (audioHTML.classList.contains(audioTenseTag)) {
      const tense = getTenses(audioHTML.innerText);
      if (tense) {
        audioHTMLString += "<br>" + tense;
      }
    }
  }

  const val = {
    eng,
    dk,
    audio: audioHTMLString,
    audioFilesURLs,
    id,
    wordType,
    enOrEt,
  };

  words.push(val);

  await chrome.storage.local.set({ [tableKey]: words });
}

function extractTextContent(htmlText) {
  const span = document.createElement("span");
  span.innerHTML = htmlText;
  return span.textContent || span.innerText;
}

function getDanishWord() {
  const wordDOM = document.querySelector(".definitionBoxTop > .match");
  for (const child of wordDOM.children) {
    child.remove();
  }

  return wordDOM.innerText;
}

function getWordType() {
  const wordDOM = document.querySelector(".definitionBoxTop > .tekstmedium");
  return extractTextContent(wordDOM.innerText);
}

function getAudioName(path) {
  return `[sound:${path.split("/").pop()}]`;
}

function getIDFromAudioURL(path) {
  return path.split("/").pop().split(".")[0].split("_")[0];
}

function getTenses(htmlContent) {
  const nutid = "præsens";
  const datid = "præteritum";
  const fornutid = "præteritum participium";

  const extractedText = extractTextContent(htmlContent);

  switch (extractedText) {
    case nutid:
      return "Nutid: ";
    case datid:
      return "Datid: ";
    case fornutid:
      return "Førnutid: ";
  }
}
