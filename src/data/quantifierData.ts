import { Chapter, QuantifierWord, QuizQuestion, Sticker, NounItem } from '../types/game';

export const STICKERS_COLLECTION: Sticker[] = [
  {
    id: 'sticker-ch1',
    chapterId: 1,
    title: 'Clue Hunter Detective',
    subtitle: 'Chapter 1 Award',
    icon: '🔍',
    badgeColor: 'from-amber-400 to-yellow-600',
    description: 'Awarded for spotting and identifying sneaky quantifiers in mystery case files!',
    requirement: 'Complete Chapter 1: The Detective\'s Eye'
  },
  {
    id: 'sticker-ch2',
    chapterId: 2,
    title: 'The Great Balancer',
    subtitle: 'Chapter 2 Award',
    icon: '⚖️',
    badgeColor: 'from-emerald-400 to-teal-600',
    description: 'Awarded for mastering Countable vs Uncountable nouns and the Fewer vs Less rule!',
    requirement: 'Complete Chapter 2: The Alchemist\'s Scale'
  },
  {
    id: 'sticker-ch3',
    chapterId: 3,
    title: 'Sentence Master Builder',
    subtitle: 'Chapter 3 Award',
    icon: '✍️',
    badgeColor: 'from-indigo-400 to-purple-600',
    description: 'Awarded for using few, a few, little, a little, fewer, less, much, and a lot of accurately in sentences!',
    requirement: 'Complete Chapter 3: The Grand Architect\'s Blueprint'
  },
  {
    id: 'sticker-noun-lab',
    chapterId: 0,
    title: 'Noun Science Specialist',
    subtitle: 'Lab Expert Award',
    icon: '🧪',
    badgeColor: 'from-cyan-400 to-blue-600',
    description: 'Awarded for sorting countable and uncountable nouns with 100% precision!',
    requirement: 'Classify 10 nouns in the Countable vs Uncountable Noun Lab'
  },
  {
    id: 'sticker-quiz-95',
    chapterId: 0,
    title: 'Grand Honors Trophy',
    subtitle: 'Mastery Award',
    icon: '🏆',
    badgeColor: 'from-amber-300 via-yellow-400 to-amber-600',
    description: 'Awarded for achieving 95%+ on the 10-Item Official Quiz and unlocking the Certificate!',
    requirement: 'Score 95% or higher on the 10-Item Quiz'
  }
];

// Rich library of Primary 6 Countable and Uncountable Nouns
export const NOUN_ITEMS: NounItem[] = [
  {
    id: 'n1',
    noun: 'apples',
    isCountable: true,
    pluralForm: 'apples (1 apple, 2 apples)',
    icon: '🍎',
    explanation: 'You can count individual apples! (1 apple, 2 apples, 3 apples).',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'many', 'a lot of']
  },
  {
    id: 'n2',
    noun: 'water',
    isCountable: false,
    icon: '💧',
    explanation: 'Water is a liquid mass. You cannot say "two waters" to mean units of liquid.',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n3',
    noun: 'pencils',
    isCountable: true,
    pluralForm: 'pencils (1 pencil, 2 pencils)',
    icon: '✏️',
    explanation: 'Pencils are separate objects you can count one by one.',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'a lot of']
  },
  {
    id: 'n4',
    noun: 'homework',
    isCountable: false,
    icon: '📚',
    explanation: 'Homework is an uncountable concept! We never say "three homeworks". We say "pieces of homework" or "a lot of homework".',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n5',
    noun: 'coins',
    isCountable: true,
    pluralForm: 'coins (1 coin, 2 coins)',
    icon: '🪙',
    explanation: 'Coins are countable units of metal currency. (Note: "money" is uncountable, but "coins" are countable!)',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'a lot of']
  },
  {
    id: 'n6',
    noun: 'advice',
    isCountable: false,
    icon: '💡',
    explanation: 'Advice is always uncountable in English! You cannot say "many advices". You say "a little advice" or "pieces of advice".',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n7',
    noun: 'books',
    isCountable: true,
    pluralForm: 'books (1 book, 2 books)',
    icon: '📖',
    explanation: 'Books have singular and plural forms and can be counted directly.',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'a lot of']
  },
  {
    id: 'n8',
    noun: 'sugar',
    isCountable: false,
    icon: '🧂',
    explanation: 'Sugar is made of countless tiny grains, so it is treated as an uncountable mass.',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n9',
    noun: 'bottles',
    isCountable: true,
    pluralForm: 'bottles (1 bottle, 2 bottles)',
    icon: '🍼',
    explanation: 'Bottles are physical containers you can count: 1 bottle, 2 bottles.',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'a lot of']
  },
  {
    id: 'n10',
    noun: 'milk',
    isCountable: false,
    icon: '🥛',
    explanation: 'Milk is a continuous liquid, making it an uncountable noun.',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n11',
    noun: 'mistakes',
    isCountable: true,
    pluralForm: 'mistakes (1 mistake, 2 mistakes)',
    icon: '❌',
    explanation: 'You can count each error: "I made fewer mistakes on this test!"',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'a lot of']
  },
  {
    id: 'n12',
    noun: 'information',
    isCountable: false,
    icon: 'ℹ️',
    explanation: 'Information cannot be counted directly. Never say "an information" or "many informations".',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n13',
    noun: 'students',
    isCountable: true,
    pluralForm: 'students (1 student, 2 students)',
    icon: '🎒',
    explanation: 'People and classmates are countable individuals: "Fewer students were absent today."',
    exampleQuantifiers: ['few', 'a few', 'fewer', 'a lot of']
  },
  {
    id: 'n14',
    noun: 'luggage',
    isCountable: false,
    icon: '🧳',
    explanation: 'Luggage refers to baggage collectively as an uncountable mass noun.',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n15',
    noun: 'time',
    isCountable: false,
    icon: '⏰',
    explanation: 'When referring to duration, time is uncountable: "We have less time" or "a little time". (Hours/minutes are countable).',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  },
  {
    id: 'n16',
    noun: 'furniture',
    isCountable: false,
    icon: '🪑',
    explanation: 'Furniture is an uncountable category word. We say "pieces of furniture", never "many furnitures".',
    exampleQuantifiers: ['little', 'a little', 'less', 'much', 'a lot of']
  }
];

// Primary 6 Quantifier Dictionary focused on the core requested items
export const QUANTIFIER_DICTIONARY: QuantifierWord[] = [
  {
    word: 'a few',
    category: 'countable',
    pairedWith: 'countable',
    definition: 'A small number, but enough (positive meaning).',
    examples: ['I have a few pencils, so I can lend you one.', 'A few students stayed after school to help.'],
    tips: 'Primary 6 rule: "A few" is positive! It means you have some, which is helpful.'
  },
  {
    word: 'few',
    category: 'countable',
    pairedWith: 'countable',
    definition: 'Hardly any; almost none (negative meaning).',
    examples: ['Few students passed the surprise test because it was so hard.', 'He has few friends and feels lonely.'],
    tips: 'Primary 6 rule: "Few" without "a" expresses scarcity or disappointment (almost zero).'
  },
  {
    word: 'fewer',
    category: 'countable',
    pairedWith: 'countable',
    definition: 'A smaller number of countable items (comparative form).',
    examples: ['I made fewer mistakes on this quiz than on the last one.', 'There were fewer cars on the road today.'],
    tips: 'Primary 6 rule: ALWAYS use "fewer" for plural countable nouns you can count (fewer books, fewer pens).'
  },
  {
    word: 'a little',
    category: 'uncountable',
    pairedWith: 'uncountable',
    definition: 'A small amount, but enough (positive meaning).',
    examples: ['We still have a little milk left for cereal.', 'She gave me a little advice on my project.'],
    tips: 'Primary 6 rule: "A little" is used for uncountable nouns and has a positive tone ("enough to use").'
  },
  {
    word: 'little',
    category: 'uncountable',
    pairedWith: 'uncountable',
    definition: 'Hardly any; almost none (negative meaning).',
    examples: ['There is little time left before the bell rings, so hurry!', 'He showed little interest in sports.'],
    tips: 'Primary 6 rule: "Little" without "a" means not enough, almost zero uncountable amount.'
  },
  {
    word: 'less',
    category: 'uncountable',
    pairedWith: 'uncountable',
    definition: 'A smaller amount of an uncountable mass or quantity (comparative form).',
    examples: ['Drink less soda and more water for your health.', 'We had less homework yesterday.'],
    tips: 'Primary 6 rule: Use "less" with uncountable nouns (less water, less sugar, less noise).'
  },
  {
    word: 'much',
    category: 'uncountable',
    pairedWith: 'uncountable',
    definition: 'A large amount of an uncountable noun (mainly in questions and negative sentences).',
    examples: ['We don\'t have much time before the bus leaves.', 'Did you drink much water after PE?'],
    tips: 'Primary 6 rule: Use "much" with uncountable nouns, usually with "not" or in questions.'
  },
  {
    word: 'a lot of',
    category: 'both',
    pairedWith: 'both',
    definition: 'A large number or amount (friendly and flexible for both countable and uncountable).',
    examples: ['There are a lot of students in the canteen (countable).', 'She drank a lot of water after running (uncountable).'],
    tips: 'Primary 6 rule: "A lot of" is the super-friendly quantifier that works with BOTH countable and uncountable nouns!'
  },
  {
    word: 'many',
    category: 'countable',
    pairedWith: 'countable',
    definition: 'A large number of individual people or items.',
    examples: ['Many children joined the science club.', 'How many pencils do you have?'],
    tips: 'Used with plural countable nouns.'
  },
  {
    word: 'several',
    category: 'countable',
    pairedWith: 'countable',
    definition: 'More than two or three, but not a large number.',
    examples: ['Several classmates helped decorate the classroom.'],
    tips: 'Always pairs with plural countable nouns.'
  },
  {
    word: 'some',
    category: 'both',
    pairedWith: 'both',
    definition: 'An unspecified amount or number.',
    examples: ['I need some pens (countable).', 'Please pour some milk (uncountable).'],
    tips: 'Great for positive statements and polite offers ("Would you like some juice?").'
  },
  {
    word: 'any',
    category: 'both',
    pairedWith: 'both',
    definition: 'Used in negative statements and questions.',
    examples: ['I don\'t have any homework today.', 'Are there any apples in the basket?'],
    tips: 'Standard in questions and sentences with "not".'
  }
];

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    title: "The Detective's Eye",
    subtitle: "Objective 1: Spot & Identify Quantifiers in Given Texts",
    theme: "amber",
    icon: "Search",
    objective: "Identify quantifiers in the given text",
    description: "Help Inspector Lexi investigate the School Library Mystery! Look at clues and witness notes to hunt down every quantifier that answers 'How many?' or 'How much?'.",
    narrative: {
      character: "Inspector Lexi",
      avatar: "🕵️‍♀️",
      story: [
        "Welcome to the Junior Detective Academy! I am Inspector Lexi.",
        "Someone misplaced the mystery books in the school library! The clues left behind tell us about amounts and quantities.",
        "Your first mission is to spot quantifiers. A quantifier is a word or phrase (like 'few', 'a few', 'much', or 'a lot of') that tells us the amount of a noun without giving an exact number!"
      ]
    },
    keyRules: [
      {
        title: "Rule 1: What is a Quantifier?",
        explanation: "Quantifiers are words that sit before nouns to describe how much or how many of something there is.",
        examples: [
          { text: "There were a few footprints near the science room door.", highlight: "a few" },
          { text: "The librarian found a lot of bookmarks on the table.", highlight: "a lot of" },
          { text: "We had little time to find the missing dictionary before class.", highlight: "little" }
        ],
        proTip: "Ask: 'Does this word tell me how many items or how much stuff there is?' If yes, you've spotted a quantifier!"
      },
      {
        title: "Rule 2: Don't Confuse with Describing Adjectives!",
        explanation: "Colors and sizes (like 'red', 'wooden', 'heavy') describe how something looks. Quantifiers (like 'few', 'much', 'a lot of') describe quantity.",
        examples: [
          { text: "He carried heavy boxes. ('Heavy' describes the box, NOT a quantifier).", highlight: "Heavy" },
          { text: "He carried a lot of boxes. ('A lot of' tells how many boxes, it IS a quantifier!).", highlight: "a lot of" }
        ],
        proTip: "Words like 'very' or 'really' are adverbs. Look for words directly measuring the noun!"
      }
    ],
    practiceTasksCount: 3,
    minigameId: "scanner",
    minigameName: "Lexi's Clue Scanner",
    minigameDescription: "Scan clues from the school library and tap every quantifier before the timer runs out to earn your Chapter 1 Detective Sticker!",
    rewardSticker: STICKERS_COLLECTION[0]
  },
  {
    id: 2,
    title: "The Alchemist's Scale",
    subtitle: "Objective 2: Distinguish Countable vs Uncountable Nouns & Quantifiers",
    theme: "emerald",
    icon: "FlaskConical",
    objective: "Distinguish between quantifiers used with countable and uncountable nouns",
    description: "Join Master Caelum in the Science Kitchen! Master the golden Primary 6 rule: using 'few', 'a few', and 'fewer' for countable nouns, and 'little', 'a little', 'less', and 'much' for uncountable nouns.",
    narrative: {
      character: "Master Caelum",
      avatar: "🧙‍♂️",
      story: [
        "Welcome to the Science & Cooking Lab, apprentice!",
        "Every noun belongs to a team: Team Countable (things you can tally: apples, coins, pencils) or Team Uncountable (liquids and masses: water, milk, sugar, advice, homework).",
        "If you use 'fewer' with water, or 'less' with apples, your recipe fails! Let us balance the scale and master 'fewer' vs 'less' and 'few' vs 'little'!"
      ]
    },
    keyRules: [
      {
        title: "The Golden Primary 6 Rule: Fewer vs Less",
        explanation: "Use FEWER for countable plural nouns (things with -s that you can count: apples, mistakes, students). Use LESS for uncountable mass nouns (things you measure: water, sugar, homework, time).",
        examples: [
          { text: "CORRECT: 'I ate fewer cookies today.' (Cookies are countable: 1, 2, 3 cookies).", highlight: "fewer cookies" },
          { text: "CORRECT: 'Add less sugar to the tea.' (Sugar is an uncountable mass).", highlight: "less sugar" },
          { text: "TRAP: Never say 'less students'! Always say 'fewer students'!", highlight: "fewer students" }
        ],
        proTip: "Quick test: Can you count 'one, two, three...'? If yes, choose FEWER!"
      },
      {
        title: "Few vs Little & The Magic 'A'",
        explanation: "'Few' pairs with countable nouns. 'Little' pairs with uncountable nouns. Adding 'A' gives it a happy, positive meaning ('enough to help')! Without 'A', it means a disappointing lack ('almost none')!",
        examples: [
          { text: "'I have a few coins.' (Positive: I can buy a snack!)", highlight: "a few coins" },
          { text: "'I have few coins.' (Negative: I am almost broke and cannot buy anything.)", highlight: "few coins" },
          { text: "'We have a little juice left.' (Positive: There is enough for a cup!)", highlight: "a little juice" },
          { text: "'We have little juice left.' (Negative: Barely a drop, not enough!)", highlight: "little juice" }
        ],
        proTip: "Remember: 'A' adds hope! Without 'a', it sounds like you ran out."
      }
    ],
    practiceTasksCount: 4,
    minigameId: "sorter",
    minigameName: "The Cauldron Sorter",
    minigameDescription: "Sort ingredients and quantifiers into Countable, Uncountable, or Both to earn your Chapter 2 Scale Balancer Sticker!",
    rewardSticker: STICKERS_COLLECTION[1]
  },
  {
    id: 3,
    title: "The Grand Architect's Blueprint",
    subtitle: "Objective 3: Use Quantifiers Appropriately in Sentences",
    theme: "indigo",
    icon: "Compass",
    objective: "Use quantifiers appropriately in sentences",
    description: "Work with Architect Soren to inscribe the School Year Time Capsule! Choose the exact right quantifier: 'much' vs 'a lot of', 'fewer' vs 'less', and positive vs negative context.",
    narrative: {
      character: "Grand Architect Soren",
      avatar: "🏛️",
      story: [
        "Welcome to the Design Studio! I am Architect Soren.",
        "Now that you can identify quantifiers and sort countable from uncountable nouns, it is time to put them to work in real sentences!",
        "Every sentence has clues about quantity, tone (positive or negative), and whether the noun is countable. Let us lock in the keystones and build perfect sentences!"
      ]
    },
    keyRules: [
      {
        title: "Much vs A Lot Of in Real Sentences",
        explanation: "'Much' is mainly used in negative sentences ('There isn't much milk') and questions ('Is there much homework?'). In positive sentences, Primary 6 writers use 'a lot of' ('We have a lot of homework').",
        examples: [
          { text: "Negative: 'We don't have much time before the assembly starts.'", highlight: "much" },
          { text: "Question: 'Did you get much sleep last night?'", highlight: "much" },
          { text: "Positive: 'Our teacher gave us a lot of praise today.'", highlight: "a lot of" }
        ],
        proTip: "'A lot of' works with both countable ('a lot of books') and uncountable ('a lot of water')!"
      },
      {
        title: "Tricky Trap Nouns for Primary 6",
        explanation: "In English exams, watch out for: advice, homework, equipment, furniture, and luggage. These are UNCOUNTABLE! You must use 'less', 'a little', 'much', or 'a lot of' with them — NEVER 'fewer' or 'many'!",
        examples: [
          { text: "CORRECT: 'My older sister gave me a lot of good advice.'", highlight: "a lot of good advice" },
          { text: "INCORRECT: 'My sister gave me many advices.' (Wrong!)", highlight: "many advices" }
        ],
        proTip: "If you cannot say 'two advices' or 'three homeworks', use uncountable quantifiers!"
      }
    ],
    practiceTasksCount: 4,
    minigameId: "sentence_dash",
    minigameName: "Architect's Sentence Dash",
    minigameDescription: "Complete sentences under time pressure using few, a few, fewer, less, little, a little, much, and a lot of to claim your Chapter 3 Master Sticker!",
    rewardSticker: STICKERS_COLLECTION[2]
  }
];

export const TEN_ITEM_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    chapter: 1,
    objective: 'identify',
    categoryTag: 'Spotting Quantifiers',
    prompt: 'Read this sentence from the school newspaper: "A few students brought a lot of canned food, but there was little juice left." Which list contains ONLY the quantifiers?',
    options: [
      'students, food, juice',
      'a few, a lot of, little',
      'brought, was, left',
      'canned, school, newspaper'
    ],
    correctAnswer: 'a few, a lot of, little',
    explanation: '"A few" (countable students), "a lot of" (uncountable food), and "little" (uncountable juice) are the three quantifiers that express quantity.'
  },
  {
    id: 2,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Fewer vs Less Rule',
    prompt: 'Mr. Tan was pleased because his students made _______ mistakes in their spelling test today.',
    options: ['fewer', 'less', 'little', 'a little'],
    correctAnswer: 'fewer',
    explanation: '"Mistakes" is a plural countable noun (1 mistake, 2 mistakes). For countable nouns, the correct comparative quantifier is "fewer", never "less".'
  },
  {
    id: 3,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Countable vs Uncountable',
    prompt: 'Which of the following nouns should be paired with "less" rather than "fewer"?',
    options: ['pencils', 'books', 'water', 'apples'],
    correctAnswer: 'water',
    explanation: '"Water" is an uncountable liquid noun, so we use "less water". Pencils, books, and apples are countable, so they take "fewer".'
  },
  {
    id: 4,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Few vs A Few Nuance',
    prompt: 'Sarah was happy at her new school because she already made _______ close friends who eat lunch with her every day.',
    options: ['a few', 'few', 'little', 'less'],
    correctAnswer: 'a few',
    explanation: '"A few" has a positive meaning (some, enough to be happy with). "Few" without "a" would mean almost none and sad. "Friends" is countable, so "little/less" cannot be used.'
  },
  {
    id: 5,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Little vs A Little Nuance',
    prompt: 'Hurry up! The bus is leaving and we have _______ time to pack our bags!',
    options: ['little', 'a little', 'few', 'a few'],
    correctAnswer: 'little',
    explanation: '"Time" is uncountable here. "Little" (without "a") expresses negative scarcity ("hardly any time / almost out of time!"), which matches the urgent warning "Hurry up!".'
  },
  {
    id: 6,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Much in Negatives',
    prompt: 'Which sentence correctly uses "much"?',
    options: [
      'We don\'t have much milk left in the fridge.',
      'There are much apples on the dining table.',
      'I have much friends in the basketball club.',
      'Much students passed the swimming exam.'
    ],
    correctAnswer: 'We don\'t have much milk left in the fridge.',
    explanation: '"Milk" is uncountable, and "much" is commonly used in negative statements ("don\'t have much"). Apples, friends, and students are countable, so they cannot use "much".'
  },
  {
    id: 7,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Tricky Nouns: Advice',
    prompt: 'Our teacher gave us _______ helpful advice before our science project presentation.',
    options: ['a lot of', 'many', 'a few', 'fewer'],
    correctAnswer: 'a lot of',
    explanation: '"Advice" is strictly an uncountable noun in English. "A lot of" works with uncountable nouns. "Many", "a few", and "fewer" can only be used with plural countable nouns.'
  },
  {
    id: 8,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Fewer vs Less Comparison',
    prompt: 'During the dry season, the garden received _______ rain than usual.',
    options: ['less', 'fewer', 'few', 'a few'],
    correctAnswer: 'less',
    explanation: '"Rain" is uncountable. Therefore, when comparing quantities, "less rain" is grammatically correct. ("Fewer" is for countable nouns).'
  },
  {
    id: 9,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'A Lot Of Flexibility',
    prompt: 'Which of the following sentences correctly uses "a lot of"?',
    options: [
      'He drank a lot of water after soccer practice.',
      'She borrowed a lot of books from the library.',
      'We had a lot of fun at the school carnival.',
      'All of the above are correct!'
    ],
    correctAnswer: 'All of the above are correct!',
    explanation: '"A lot of" is a flexible quantifier that correctly works with uncountable nouns (water, fun) AND plural countable nouns (books)!'
  },
  {
    id: 10,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Error Detection',
    prompt: 'Find the sentence that contains a GRAMMATICAL MISTAKE in Primary 6 English:',
    options: [
      'There is less traffic on Sunday mornings.',
      'She has fewer homework than her older brother.',
      'I need a little help carrying this heavy box.',
      'Only a few students were late for the assembly.'
    ],
    correctAnswer: 'She has fewer homework than her older brother.',
    explanation: '"Homework" is an uncountable noun. It should be "less homework", NOT "fewer homework". The other three sentences are all grammatically correct.'
  }
];

export const MULTIPLAYER_BATTLE_QUESTIONS: QuizQuestion[] = [
  {
    id: 201,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Fewer vs Less',
    prompt: 'Choose the correct word: "Eat _______ sweets if you want healthy teeth!"',
    options: ['fewer', 'less', 'little', 'much'],
    correctAnswer: 'fewer',
    explanation: '"Sweets" is countable plural, so we use "fewer sweets".',
  },
  {
    id: 202,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Fewer vs Less',
    prompt: 'Choose the correct word: "Drink _______ sugary juice before bedtime."',
    options: ['less', 'fewer', 'a few', 'few'],
    correctAnswer: 'less',
    explanation: '"Juice" is uncountable, so we use "less juice".',
  },
  {
    id: 203,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Few vs A Few',
    prompt: 'Positive meaning: "I have _______ spare pens, so you can borrow one!"',
    options: ['a few', 'few', 'little', 'much'],
    correctAnswer: 'a few',
    explanation: '"A few" means some / enough to share, with a positive tone.',
  },
  {
    id: 204,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Little vs A Little',
    prompt: 'Warning tone: "We have _______ time before the test begins, please sit down!"',
    options: ['little', 'a little', 'fewer', 'few'],
    correctAnswer: 'little',
    explanation: '"Little" expresses a negative lack ("almost no time").',
  },
  {
    id: 205,
    chapter: 1,
    objective: 'identify',
    categoryTag: 'Spot Quantifier',
    prompt: 'Spot the quantifier in: "There wasn\'t much noise in the library."',
    options: ['much', 'noise', 'library', 'wasn\'t'],
    correctAnswer: 'much',
    explanation: '"Much" is the quantifier modifying the uncountable noun "noise".',
  },
  {
    id: 206,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Countable vs Uncountable',
    prompt: 'Which noun can be used with "a few"?',
    options: ['cookies', 'milk', 'sugar', 'furniture'],
    correctAnswer: 'cookies',
    explanation: '"Cookies" is a plural countable noun. Milk, sugar, and furniture are uncountable.',
  },
  {
    id: 207,
    chapter: 3,
    objective: 'use',
    categoryTag: 'A Lot Of',
    prompt: 'True or False: "A lot of" can be used with BOTH countable and uncountable nouns.',
    options: ['True', 'False', 'Only with countable', 'Only with negative sentences'],
    correctAnswer: 'True',
    explanation: '"A lot of" is flexible and works with both ("a lot of books" and "a lot of water").',
  },
  {
    id: 208,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Homework Rule',
    prompt: 'Which quantifier correctly fits with "homework"?',
    options: ['a lot of', 'many', 'a few', 'fewer'],
    correctAnswer: 'a lot of',
    explanation: '"Homework" is uncountable, so only "a lot of" (or "less/much/a little") fits.',
  },
  {
    id: 209,
    chapter: 3,
    objective: 'use',
    categoryTag: 'Few (Negative)',
    prompt: '"The museum was almost empty; _______ visitors were present."',
    options: ['few', 'a few', 'less', 'much'],
    correctAnswer: 'few',
    explanation: '"Few" conveys negative scarcity ("hardly any visitors").',
  },
  {
    id: 210,
    chapter: 2,
    objective: 'distinguish',
    categoryTag: 'Much vs Many',
    prompt: 'Complete the question: "How _______ pencils are in your pencil case?"',
    options: ['many', 'much', 'less', 'little'],
    correctAnswer: 'many',
    explanation: '"Pencils" is countable plural, so we say "How many pencils?".',
  }
];

export interface ScannerLevel {
  id: number;
  title: string;
  context: string;
  tokens: { text: string; isQuantifier: boolean; explanation?: string }[];
}

export const SCANNER_LEVELS: ScannerLevel[] = [
  {
    id: 1,
    title: "Clue at the Library Desk",
    context: "Inspector Lexi reads the librarian's notepad after school.",
    tokens: [
      { text: "There", isQuantifier: false },
      { text: "were", isQuantifier: false },
      { text: "a few", isQuantifier: true, explanation: "'A few' quantifies countable notebooks." },
      { text: "notebooks", isQuantifier: false },
      { text: "and", isQuantifier: false },
      { text: "a lot of", isQuantifier: true, explanation: "'A lot of' quantifies bookmarks." },
      { text: "bookmarks", isQuantifier: false },
      { text: "on", isQuantifier: false },
      { text: "the", isQuantifier: false },
      { text: "table.", isQuantifier: false },
      { text: "However,", isQuantifier: false },
      { text: "there", isQuantifier: false },
      { text: "was", isQuantifier: false },
      { text: "little", isQuantifier: true, explanation: "'Little' quantifies uncountable ink left in the bottle." },
      { text: "ink", isQuantifier: false },
      { text: "remaining.", isQuantifier: false }
    ]
  },
  {
    id: 2,
    title: "Science Fair Preparation",
    context: "The science club members take inventory of their supplies.",
    tokens: [
      { text: "We", isQuantifier: false },
      { text: "have", isQuantifier: false },
      { text: "fewer", isQuantifier: true, explanation: "'Fewer' compares countable batteries." },
      { text: "batteries", isQuantifier: false },
      { text: "today,", isQuantifier: false },
      { text: "so", isQuantifier: false },
      { text: "we", isQuantifier: false },
      { text: "must", isQuantifier: false },
      { text: "use", isQuantifier: false },
      { text: "less", isQuantifier: true, explanation: "'Less' quantifies uncountable power/electricity." },
      { text: "power", isQuantifier: false },
      { text: "for", isQuantifier: false },
      { text: "the", isQuantifier: false },
      { text: "robot.", isQuantifier: false }
    ]
  },
  {
    id: 3,
    title: "The Canteen Line",
    context: "Prefect report on the school recess line.",
    tokens: [
      { text: "Only", isQuantifier: false },
      { text: "few", isQuantifier: true, explanation: "'Few' expresses scarcity of countable students remaining." },
      { text: "students", isQuantifier: false },
      { text: "waited,", isQuantifier: false },
      { text: "because", isQuantifier: false },
      { text: "there", isQuantifier: false },
      { text: "wasn't", isQuantifier: false },
      { text: "much", isQuantifier: true, explanation: "'Much' quantifies uncountable soup left in the pot." },
      { text: "soup", isQuantifier: false },
      { text: "left.", isQuantifier: false }
    ]
  }
];

export interface SorterItem {
  id: string;
  label: string;
  category: 'countable' | 'uncountable' | 'both';
  icon: string;
  reason: string;
}

export const SORTER_ITEMS: SorterItem[] = [
  { id: 's1', label: 'fewer', category: 'countable', icon: '📉', reason: 'Primary 6 Rule: "Fewer" is exclusively for plural countable nouns (fewer apples, fewer mistakes).' },
  { id: 's2', label: 'less', category: 'uncountable', icon: '💧', reason: 'Primary 6 Rule: "Less" is exclusively for uncountable nouns (less water, less sugar, less homework).' },
  { id: 's3', label: 'few', category: 'countable', icon: '🔍', reason: 'Used with plural countable nouns to mean almost none (few friends, few books).' },
  { id: 's4', label: 'a few', category: 'countable', icon: '✨', reason: 'Used with plural countable nouns to mean a small helpful number (a few pencils).' },
  { id: 's5', label: 'little', category: 'uncountable', icon: '⏳', reason: 'Used with uncountable nouns to mean almost zero amount (little time, little milk).' },
  { id: 's6', label: 'a little', category: 'uncountable', icon: '🥛', reason: 'Used with uncountable nouns to mean a small positive amount (a little juice).' },
  { id: 's7', label: 'much', category: 'uncountable', icon: '🌊', reason: 'Used with uncountable nouns, mostly in questions and negative sentences (not much homework).' },
  { id: 's8', label: 'a lot of', category: 'both', icon: '📦', reason: 'Flexible! Works with BOTH countable ("a lot of books") and uncountable ("a lot of water")!' },
  { id: 's9', label: 'many', category: 'countable', icon: '🎒', reason: 'Used with plural countable nouns (many classmates).' },
  { id: 's10', label: 'some', category: 'both', icon: '⚖️', reason: 'Dual quantifier for countable ("some apples") and uncountable ("some soup").' }
];

export interface SentenceDashItem {
  id: number;
  sentenceBefore: string;
  sentenceAfter: string;
  nounType: 'Fewer vs Less' | 'Few vs A Few' | 'Little vs A Little' | 'Much vs A Lot Of';
  options: string[];
  correct: string;
  hint: string;
}

export const SENTENCE_DASH_ITEMS: SentenceDashItem[] = [
  {
    id: 1,
    sentenceBefore: "You should spend",
    sentenceAfter: "time playing video games and more time reading.",
    nounType: "Fewer vs Less",
    options: ["less", "fewer", "few", "a few"],
    correct: "less",
    hint: "'Time' is an uncountable noun, so choose 'less'!"
  },
  {
    id: 2,
    sentenceBefore: "Our class made",
    sentenceAfter: "errors on the grammar test than Section B.",
    nounType: "Fewer vs Less",
    options: ["fewer", "less", "little", "much"],
    correct: "fewer",
    hint: "'Errors' is a plural countable noun, so choose 'fewer'!"
  },
  {
    id: 3,
    sentenceBefore: "Don't worry, we still have",
    sentenceAfter: "minutes before the school bus arrives.",
    nounType: "Few vs A Few",
    options: ["a few", "few", "little", "a little"],
    correct: "a few",
    hint: "'Minutes' is countable, and 'Don't worry' signals positive sufficiency ('a few')."
  },
  {
    id: 4,
    sentenceBefore: "Sadly, very",
    sentenceAfter: "people attended the concert due to the thunderstorm.",
    nounType: "Few vs A Few",
    options: ["few", "a few", "less", "little"],
    correct: "few",
    hint: "'People' is countable, and 'Sadly' signals negative scarcity ('few')."
  },
  {
    id: 5,
    sentenceBefore: "Could you please add",
    sentenceAfter: "honey to my warm lemon drink?",
    nounType: "Little vs A Little",
    options: ["a little", "little", "a few", "few"],
    correct: "a little",
    hint: "'Honey' is uncountable, and a polite request asks for a helpful small amount ('a little')."
  },
  {
    id: 6,
    sentenceBefore: "There is",
    sentenceAfter: "hope of winning if we give up now!",
    nounType: "Little vs A Little",
    options: ["little", "a little", "few", "fewer"],
    correct: "little",
    hint: "'Hope' is uncountable, and the warning emphasizes almost zero hope ('little')."
  },
  {
    id: 7,
    sentenceBefore: "We don't have",
    sentenceAfter: "homework assigned for the weekend, hooray!",
    nounType: "Much vs A Lot Of",
    options: ["much", "many", "fewer", "few"],
    correct: "much",
    hint: "'Homework' is uncountable, and in negative statements ('don't have'), we use 'much'."
  },
  {
    id: 8,
    sentenceBefore: "The school library has",
    sentenceAfter: "fascinating books about astronomy.",
    nounType: "Much vs A Lot Of",
    options: ["a lot of", "much", "little", "less"],
    correct: "a lot of",
    hint: "'Books' is plural countable, so 'a lot of' fits perfectly in this positive statement."
  }
];
