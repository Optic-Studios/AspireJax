// Define a mapping of adverbs to their possible verbs
const adverbsWithVerbs: { [adverb: string]: string[] } = {
  Well: ['done'],
  Great: ['', 'job', 'work'],
  Fantastic: ['', 'job', 'work'],
  Excellent: ['', 'work', 'job'],
  Nice: ['', 'job', 'effort', 'work'],
  Perfect: [''],
  Looks: ['great', 'perfect'],
};

// Define the list of emojis
const emojis: string[] = [
  '🎉',
  '👍',
  '👏',
  '🌟',
  '🔥',
  '💪',
  '🎊',
  '😊',
  '🥳',
  '🏆',
  '😃',
  '🤩',
  '🙌',
  '💥',
  '😎',
  '😇',
  '🙈',
  '✨',
  '⭐️',
  '💖',
  '❤️',
  '💓',
  '✅',
  '★',
  '👁️👄👁️',
  ':)',
  'XD',
  ':D',
  'ʕ •ᴥ•ʔ',
  ':3',
  '(/◕ヮ◕)/',
];

// Function to generate a random validation message
function generateValidationMessage(): string {
  // Get a random adverb
  const adverbs = Object.keys(adverbsWithVerbs);
  const randomAdverb = adverbs[Math.floor(Math.random() * adverbs.length)];

  // Get a random verb from the list of verbs for the selected adverb
  const verbs = adverbsWithVerbs[randomAdverb];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];

  // Get a random emoji
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  let message = '';

  if (Math.random() < 0.8) {
    // Combine adverb and verb
    if (randomVerb == '') {
      message = randomAdverb;
    } else {
      message = `${randomAdverb} ${randomVerb}`;
    }

    // 50% chance to add an exclamation mark
    if (Math.random() < 0.5) {
      message += '!';
    }

    // 50% chance to add an emoji
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        message += ` ${randomEmoji}`;
      } else {
        message = `${randomEmoji} ` + message;
      }
    }
  } else {
    message = `${randomEmoji}`;
  }
  return message;
}

export { generateValidationMessage };
