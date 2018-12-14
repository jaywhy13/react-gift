const RAW = `The story is told of a little girl who was born a little too mature
Ordained to be a choleric, of the sexiest kind... Rationed in tact, supplemented only by intentions so pure 
A pursuer of dreams many aim for only behind the comfort of closed eyes, ambition defines her very core
Deep in intellect, sensational in wit, conversational dexterity and sarcastic allure
~~
A friend whose depth of love, forms historic hallmarks of dedication, pushing others to aspire
Such love that springs into action, never too tired to perform, expending whatever friendship may require
A love never disputed as real... arguably a rather tough kind, but who can mistake well intentioned friendly fire
Thank you for being amazing, from all the lessons I've learned and the countless people you inspire
~~
For me she became a mistress of the culinary arts, a chef of no mean order 
No exotic pastry, five star esteemed gourmet option, or rich, colored green juice was beyond her 
Healthy and tasty, rich and colorful, sumptuous and delightful, every spoon an experience to remember
The ecstacy that greets the eye, the arousal that surprises the taste buds, the journey offered the nasal passage, how many restaurants can offer? 
~~
My bowels have never been so fluid, through her love they have learnt the meaning of frequency 
Such care and love that extends into regions no nose can survive, she has trodded boldly 
Only due to a vested interest, the fruit of a love knowing no bound, growing and flowing endlessly 
My health is overcome with gratitude.. This husband can boast a wife doubling as doctor, nurse and pharmacy 
~~
On a journey acquainted with many mountains, and valleys alike, she represents much of the consistency that exists
A constant, unwavering commitment and dedication has been the protagonist in her story despite all of life's twists 
Her love and care, has displayed a clear dissatisfaction with mere survival of difficulty evidenced by how it persists 
Amazing, typically the word coined for her... But to accurately describe her, the English language barely assists 
~~
It matters not how many unattached, less stressed soldiers have conquered this mighty feat, 
Your audacity, perseverence, sagacity, resilience, all exemplify that which many colleagues cannot compete 
Only the folly gaze across the sea of uniforms thinking the battle is just the same for each soldier in the fleet, 
Result aside... You're my victorious trooper... Spirited, courageous, bold enough to walk this path... No result means defeat 
~~
To call her wife is the most esteemed honour I possess
That God has blessed me so lavishly, beyond denial, and beyond worth, words cannot impress 
My gratitude, my awe... My words...  they fail, I am overcome with gratefulness,
So today .. I celebrate you! The priceless half. Happy Birthday and God bless`;
const makeWord = (sentence, word, text) => ({ text, index: word, sentence });

const makeSentences = text => {
  const sentences = text.split("\n");
  const formattedSentences = [];
  for (let i = 0; i < sentences.length; i += 1) {
    console.log(sentences[i]);
    const words = sentences[i].split(" ");
    const formattedSentence = [];
    for (let j = 0; j < words.length; j += 1) {
      formattedSentence.push(makeWord(i, j, words[j]));
    }
    formattedSentences.push(formattedSentence);
  }
  return formattedSentences;
};

const SENTENCES = makeSentences(RAW);

export const getWordAfter = (currentSentence, currentWord) => {
  if (currentSentence < SENTENCES.length) {
    const words = SENTENCES[currentSentence];
    if (currentWord + 1 >= words.length) {
      return SENTENCES[currentSentence + 1][0];
    }
    return SENTENCES[currentSentence][currentWord + 1];
  }
  return null;
};

const getSentences = (currentSentence, currentWord) => {
  const sentences = [];
  for (let i = 0; i <= currentSentence; i += 1) {
    if (i < currentSentence) {
      sentences.push(SENTENCES[i]);
    } else {
      sentences.push(SENTENCES[i].slice(0, currentWord + 1));
    }
  }
  return sentences;
};

export { makeWord, getSentences };
