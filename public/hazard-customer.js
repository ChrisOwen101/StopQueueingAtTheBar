// Customer hazard perception test. Clip markup and keyframes: hazard-customer.html / .css.
// A pool of ten clips; the player deals five at random. Each clip is 10s and pauses on
// the hazard at 5s (the player defaults). There are no captions: the clip tells the
// story with movement and speech bubbles, the sounds are cues at [ms, name].

HazardTest.init(document.getElementById('hpt'), {
  posterAt: 2600,
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
  clips: [
    {
      label: 'A single-file queue at one barperson while most of the bar sits empty. You walk in.',
      sounds: [
        [300, 'door'],
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
      label: 'You are in a gap at the bar. A barperson finishes serving and looks along the bar.',
      sounds: [
        [2600, 'clink'], // the barperson finishes a pint and looks along the bar
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
      label: 'Someone reaches the bar just before you. The barperson goes to them and signals that you are next.',
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
      label: 'You leave a table of six to buy a round. The barperson comes over and asks what you are having.',
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
      label: 'You walk in. A long line of people snakes away from the pool table. The bar is empty and four staff are standing idle.',
      sounds: [
        [300, 'door'],
        [7400, 'clink'], // served straight away
      ],
      question: "There's a long line by the pool table. The bar's empty. What do you do?",
      options: [
        { text: "Join the end. It's probably for the bar.", say: "It isn't. That's a Phantom Queue. There's no bar at the end of it. It's for the pool table. Wrong kind of cue." },
        { text: 'Ask the person in front what it\'s for', say: "They don't know. Nobody knows. That's what makes it a Phantom Queue. Meanwhile, four staff are standing behind an empty bar." },
        { text: 'Walk past it, straight to the bar', ok: true, say: 'Correct. Follow the bar, not the queue. Four staff, nobody being served. That line was for the pool table.' },
      ],
    },
    {
      label: 'You are waiting in a gap at the bar. Someone walks in and lines up right behind you, though there is plenty of room along the bar.',
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
      label: 'You have been served and your drinks are on the bar. The bar is full, and two people are waiting behind you for a gap.',
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
      label: 'Someone reaches the bar just before you. A barperson comes over, between you both, and asks who is next.',
      sounds: [
        [200, 'door'],
        [1400, 'door'],
        [7000, 'clink'], // theirs
        [9200, 'clink'], // yours
      ],
      question: 'The barperson asks who is next. They were here before you. What do you do?',
      options: [
        { text: 'Point to the person who was here first', ok: true, say: 'Correct. They were first, so point at them. The Cluster runs on honesty. And you are next anyway.' },
        { text: 'Say "Me!" before they can', say: 'Technically fast. Morally slow. The barperson saw that. They always see that.' },
        { text: 'Say nothing and stare at the taps', say: "Silence isn't an answer. It's a delay. And somebody is still thirsty." },
      ],
    },
    {
      label: 'You walk in with four mates and the five of you head for the bar together to buy one round.',
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
      label: 'You are at the bar. One pint is poured and the barperson is pouring your last one. Other people are waiting either side of you.',
      sounds: [
        [1200, 'clink'],
        [2000, 'pour'],
        [7200, 'beep'], // card tapped
        [8800, 'clink'],
      ],
      question: "Your last pint's nearly poured. What do you do while you wait?",
      options: [
        { text: 'Get your card out now', ok: true, say: 'Correct. Card out while they pour. Tap. Beep. Done. The barperson is on to the next person before your pint has stopped fizzing.' },
        { text: 'Wait for the total, then find your wallet', say: "Every pocket. Then the coat. Then the other coat. That's three minutes nobody else at the bar gets served." },
        { text: "Nip to the loo. They'll mind your pints.", say: "They're a barperson, not a cloakroom. Now they're minding two pints and a card machine for a stranger." },
      ],
    },
  ],
});
