const targetLanguages = ['be', 'uk', 'pl', 'cs', 'hr', 'bs','sk','sl','sr', 'bg','mk'];

function formatText(text) {
  return text.trim().replace(/[^\w\s]/gi, '').split(' ')[0].toLocaleLowerCase();
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

function compareSimilarity(fromText, translatedText) {
  const fromTextArray = fromText.toLowerCase().split('');
  const translatedTextArray = translatedText.toLowerCase().split('');
  let similarity = 0;
  for (let i = 0; i < fromTextArray.length; i++) {
    if (translatedTextArray.includes(fromTextArray[i])) {
      similarity++;
    }
  }
  return Math.round((similarity / fromTextArray.length) * 100);
}

function updateDOM(translateResults, similarity) {
  Object.keys(translateResults).forEach((targetLanguage) => {
    document.querySelector(`.${targetLanguage}`).textContent = translateResults[targetLanguage];
  });
  document.getElementById('result').style.display = 'inline-flex';
  document.getElementById('by_cript').innerHTML = `Схожесть ${similarity}%`;
}

function write() {
  const fromText = document.querySelector('.wordInsert').value;
  const translateResults = {};
  targetLanguages.forEach((targetLanguage) => {
    translateResults[targetLanguage] = translateText(fromText, targetLanguage);
  });
  const similarity = compareSimilarity(fromText, Object.values(translateResults).join(' '));
  updateDOM(translateResults, similarity);
  return true;
}
