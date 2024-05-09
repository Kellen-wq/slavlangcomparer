const targetLanguages = ['be', 'uk', 'pl', 'cs', 'hr', 'bs','sk','sl','sr', 'bg','mk'];

function formatText(text) {
  return text.trim().replace(/[^\w\s]/gi, '').toLocaleUpperCase();
}

async function translateText(fromText, targetLanguage) {
  const apiURL = `https://api.mymemory.translated.net/get?q=${fromText}!&langpair=ru|${targetLanguage}`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    return formatText(data.responseData.translatedText);
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    return '';
  }
}

function updateDOM(translateResults) {
  Object.keys(translateResults).forEach((targetLanguage) => {
    document.querySelector(`.${targetLanguage}`).textContent = translateResults[targetLanguage];
  });
  document.getElementById('result').style.display = 'inline-flex';
}

function write() {
  const fromText = document.querySelector('.wordInsert').value;
  const translateResults = {};
  targetLanguages.forEach((targetLanguage) => {
    translateResults[targetLanguage] = translateText(fromText, targetLanguage);
  });
  updateDOM(translateResults);
  return true;
}
