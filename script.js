const targetLanguages = ['be', 'uk', 'pl', 'cs', 'hr', 'bs','sk','sl','sr', 'bg','mk'];

function formatText(text) {
  console.log(`Formatting text: ${text}`);
  return text.trim()
  .replace(/[^\w\s]/gi, '') // remove punctuation
  .replace(/\s+/g,'') // remove extra spaces
  .split(' ')[0] // take only the first word
  .toLocaleLowerCase(); // convert to lowercase
}

async function translateText(fromText, targetLanguage) {
  console.log(`Translating to ${targetLanguage}: ${fromText}`);
  const apiURL = `https://api.mymemory.translated.net/get?q=${fromText}!&langpair=ru|${targetLanguage}`;
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    console.log(`Translated text: ${data.responseData.translatedText}`);
    return formatText(data.responseData.translatedText);
  } catch (error) {
    console.error(`Error translating to ${targetLanguage}:`, error);
    return '';
  }
}

function compareSimilarity(fromText, translatedText) {
  console.log(`Comparing similarity: ${fromText} vs ${translatedText}`);
  const fromTextNormalized = fromText.normalize('NFKD').casefold();
  const translatedTextNormalized = translatedText.normalize('NFKD').casefold();

  const jaroWinklerDistance = jaroWinkler(fromTextNormalized, translatedTextNormalized);
  const similarity = Math.round((1 - jaroWinklerDistance) * 100);

  console.log(`Similarity: ${similarity}%`);
  return similarity;
}

function jaroWinkler(a, b) {
  console.log(`Calculating Jaro-Winkler distance: ${a} vs ${b}`);
  const m = Math.min(a.length, b.length);
  const p = 0.1;
  let l = 0;
  let r = 0;
  let t = 0;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        l++;
        t++;
        break;
      }
    }
  }

  if (l === 0) return 0;

  r = (a.length + b.length) / 2;
  l = l / r;

  let p1 = l;
  let p2 = l;

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (a[i] === b[j]) {
        p1 += p;
        p2 += p;
        break;
      }
    }
  }

  p1 /= a.length;
  p2 /= b.length;

  return (p1 + p2) / 2;
}

function updateDOM(translateResults, similarity) {
  console.log(`Updating DOM: ${translateResults} and similarity ${similarity}%`);
  Object.keys(translateResults).forEach((targetLanguage) => {
    document.querySelector(`.${targetLanguage}`).textContent = translateResults[targetLanguage];
  });
  document.getElementById('result').style.display = 'inline-flex';
  document.getElementById('by_cript').innerHTML = `Схожесть ${similarity}%`;
}

function write() {
  const fromText = document.querySelector('.wordInsert').value;
  console.log(`From text: ${fromText}`);
  const translateResults = {};
  targetLanguages.forEach((targetLanguage) => {
    translateResults[targetLanguage] = translateText(fromText, targetLanguage);
  });
  const similarity = compareSimilarity(fromText, Object.values(translateResults).join(' '));
  updateDOM(translateResults, similarity);
  return true;
}
