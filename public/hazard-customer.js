// Customer hazard perception test. Clip markup: hazard-customer.html; drawing: hazard-kit.js/.css.
// A pool of ten clips; the player deals five at random. Most clips are 10s and pause on the
// hazard at 5s (the player defaults).
// There are no captions: the clip tells the story with movement and speech bubbles, the
// sounds are cues at [ms, name].

const clips = [
  {
    label: 'Seen from the room, a single-file queue of four waits at one barperson while three more staff stand idle along an empty bar. From behind the bar, you walk in and stop beside the column of faces.',
    sounds: [
      [1500, 'door'], // you walk in (staff-side cut)
      [8800, 'clink'], // served
    ],
    question: "There's a queue. Most of the bar is empty. What do you do?",
    options: [
      { text: 'Join the back of the queue', say: "That's the Single File. You've just made it longer. One barperson works. The other three watch." },
      { text: 'Walk up to an empty bit of the bar', ok: true, say: 'Correct. Walk to the bar. Not behind someone. To the bar. Three staff were standing idle.' },
      { text: 'Stand a metre back and wait to be invited', say: "That's The Hoverer. You're not in a queue. You're in the way. Step in." },
    ],
  },
  {
    label: 'You wait in a gap at a busy bar, seen from the room. A barperson hands over a pint, looks along the bar, and their eyes land on you.',
    sounds: [
      [2600, 'clink'], // the barperson hands over a pint, then looks along the bar
      [8800, 'clink'], // served
    ],
    question: 'The barperson looks your way. What do you do?',
    options: [
      { text: 'Click your fingers and shout "Oi, mate!"', say: "No waving. No clicking. They're a barperson, not a spaniel." },
      { text: "Look at your phone so you don't seem pushy", say: "They can't serve someone who isn't there. Eyes up. Catching an eye is the whole system." },
      { text: 'Catch their eye. A nod. A raised eyebrow.', ok: true, say: "Correct. A nod, a raised eyebrow, a tenner held with quiet confidence. That's all it takes." },
    ],
  },
  {
    label: 'Seen from the room, someone walks up to the bar just before you. The barperson smiles at them, then points at you and says "you\'re next".',
    sounds: [
      [6400, 'clink'], // their pint
      [9200, 'clink'], // yours
    ],
    question: "They got there first. The barperson says you're next. What do you do?",
    options: [
      { text: 'Say "Excuse me, I was here first"', say: "You weren't. And even if you were, the barperson knows. Do not test them." },
      { text: 'Trust the barperson. Wait your turn.', ok: true, say: "Correct. They know who's next. They always know. It's their entire job." },
      { text: 'Stand behind them, just to be safe', say: "And now you've started a queue. Someone will join it. Then it never ends." },
    ],
  },
  {
    label: 'A tactics board shows your table of six. You walk up to a busy bar to buy the round, and a barperson leans over and asks what you are having.',
    sounds: [
      [7600, 'clink'], // six pints, one trip
      [8600, 'clink'],
    ],
    question: "You're buying for six. They ask what you're having. What do you do?",
    options: [
      { text: 'Turn round and shout "WHAT ARE YOU ALL HAVING?"', say: '"What are you having" is a question for the table. Not the bar. Everyone behind you just aged a year.' },
      { text: 'Order one drink, then go back and ask the next person', say: "That's six trips. It's not a round. It's a relay." },
      { text: 'Reel off the order you sorted at the table', ok: true, say: 'Correct. Know the order before you get to the bar. Four lagers, a Guinness, and a lime and soda. Done.' },
    ],
  },
  {
    label: 'Seen from behind the bar, you walk in and stop at the end of a long line. It leads to the pool table, where the person at the front holds a cue. The bar in front of them is empty, and four staff are standing idle.',
    sounds: [
      [300, 'door'],
      [8400, 'clink'], // served straight away
    ],
    question: "There's a long line by the pool table. The bar's empty. What do you do?",
    options: [
      { text: "Join the end. It's probably for the bar.", say: "It isn't. That's a Phantom Queue. There's no bar at the end of it. It's for the pool table. Wrong kind of cue." },
      { text: 'Ask the person in front what it\'s for', say: "They don't know. Nobody knows. That's what makes it a Phantom Queue. Meanwhile, four staff are standing behind an empty bar." },
      { text: 'Walk past it, straight to the bar', ok: true, say: 'Correct. Follow the bar, not the queue. Four staff, nobody being served. That line was for the pool table.' },
    ],
  },
  {
    label: 'You wait in a gap at a busy bar, seen from the room. Someone walks in past an empty stretch of bar and lines up right behind you.',
    sounds: [
      [700, 'door'],
      [8000, 'clink'], // yours
      [9400, 'clink'], // theirs
    ],
    question: "Someone's just lined up right behind you. What do you do?",
    options: [
      { text: 'Point them to the gap next to you', ok: true, say: 'Correct. Point at the gap. Side by side is a cluster. One behind the other is the start of a queue.' },
      { text: 'Nothing. Queues are polite.', say: "Queues are polite in a post office. This is a pub. Give it ten minutes and that line reaches the door." },
      { text: 'Turn round and tut', say: "A tut is not a policy. It's a noise. Use your words. Or at least your finger." },
    ],
  },
  {
    label: 'Seen from behind the bar: you have been served, paid, and your two pints are on the bar in front of you. The bar is full, and two people hover behind the crowd, eyeing your spot. One says "ahem".',
    sounds: [
      [1400, 'clink'],
      [2400, 'clink'],
      [3200, 'till'], // paid
      [9000, 'clink'], // the next person is served in your gap
    ],
    question: "You've got your drinks. People are waiting for a gap. What do you do?",
    options: [
      { text: 'Stay put. You earned this spot.', say: 'You earned a drink. The spot was on loan. The bar is for ordering, not for living.' },
      { text: 'Take your drinks and step away', ok: true, say: 'Correct. Served means done. Take your drinks, free the gap. Someone behind you has been very patient.' },
      { text: 'Stay and chat to the barperson', say: "They're lovely. They're also working. Two people behind you would like a turn at lovely." },
    ],
  },
  {
    label: 'Seen from the room: someone reaches the bar just before you. A barperson comes over, stands between you both, shrugs and asks who is next.',
    sounds: [
      [200, 'door'],
      [1400, 'door'],
      [7000, 'clink'], // theirs
      [8900, 'clink'], // yours
    ],
    question: 'The barperson asks who is next. They were here before you. What do you do?',
    options: [
      { text: 'Point to the person who was here first', ok: true, say: 'Correct. They were first, so point at them. The Cluster runs on honesty. And you are next anyway.' },
      { text: 'Say "Me!" before they can', say: 'Technically fast. Morally slow. The barperson saw that. They always see that.' },
      { text: 'Say nothing and stare at the taps', say: "Silence isn't an answer. It's a delay. And somebody is still thirsty." },
    ],
  },
  {
    label: 'Seen from behind the bar: you walk in with four mates, and the five of you head for the bar together as a clump to buy one round.',
    sounds: [
      [300, 'door'],
      [6600, 'door'],
      [7600, 'clink'],
      [8800, 'clink'],
    ],
    question: 'Five of you. One round. Who goes to the bar?',
    options: [
      { text: 'All five, so everyone can choose', say: 'Five people, one round, half the bar. Everyone else is now watching your mate choose crisps.' },
      { text: 'All five, in a nice tidy line', say: "Five of you, single file, buying one round. That's not a queue. That's a conga." },
      { text: 'Just you. The rest grab a table.', ok: true, say: 'Correct. One round, one person, one gap. The rest of you find a table and start arguing about whose round is next.' },
    ],
  },
  {
    dur: 10400,
    label: 'Seen from the room: you are at the bar between two other customers. Your first pint is on the bar and the barperson is pouring your last one. Your hands are empty.',
    sounds: [
      [1200, 'clink'],
      [2000, 'pour'],
      [7200, 'beep'], // card tapped
      [8500, 'clink'],
    ],
    question: "Your last pint's nearly poured. What do you do while you wait?",
    options: [
      { text: 'Get your card out now', ok: true, say: 'Correct. Card out while they pour. Tap. Beep. Done. The barperson is on to the next person before your pint has stopped fizzing.' },
      { text: 'Wait for the total, then find your wallet', say: "Every pocket. Then the coat. Then the other coat. That's three minutes nobody else at the bar gets served." },
      { text: "Nip to the loo. They'll mind your pints.", say: "They're a barperson, not a cloakroom. Now they're minding two pints and a card machine for a stranger." },
    ],
  },
];

const root = document.getElementById('hpt');
// Build the cartoon clips (figures, sets, the pundit freeze) before the player reads them.
HazardKit.build(root, clips);

HazardTest.init(root, {
  clips,
  posterAt: 600,
  links: [
    { href: 'hazard-barperson.html', text: 'Now try it from behind the bar' },
    { href: '/#petition-section', text: 'Sign the petition' },
  ],
  grades: [
    [1, 'Full licence.', 'You may approach any bar in the land.'],
    [0.75, 'Pass.', 'Mind the Hoverers. Beware the Phantom Queue.'],
    [0.5, 'Provisional licence.', 'Practise on a quiet Tuesday. Bring an adult.'],
    [0, 'Fail.', 'Back to the sticker. Read the Bar Rule again.'],
  ],
});
