// Customer hazard perception test. Clip markup and keyframes: hazard-customer.html / .css.
// Each clip is 10s and pauses on the hazard at 5s (the player defaults).

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
      events: [
        [0, 'Friday, 7pm. You walk in.'],
        [2200, 'One queue. One barperson working. Three watching.'],
        [5100, 'Walk to the bar. Pick a gap.'],
        [8800, 'Served.', 'clink'],
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
      events: [
        [0, 'Saturday. Busy. You find a gap at the bar.'],
        [2600, 'The barperson finishes a pint and looks along the bar.', 'clink'],
        [5100, 'A nod. A raised eyebrow.'],
        [7000, 'Spotted.'],
        [8800, 'Served.', 'clink'],
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
      events: [
        [0, 'Two of you arrive. They got there just before you.'],
        [2700, 'The barperson heads to them, and catches your eye.'],
        [5100, "They know who's next."],
        [6400, null, 'clink'],
        [7800, 'They always know.'],
        [9200, 'Served.', 'clink'],
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
      events: [
        [0, 'Your round. Six at the table.'],
        [2700, 'You get to the bar. The barperson comes straight over.'],
        [5100, 'Know the order before you get to the bar.'],
        [7600, 'Six pints. One trip.', 'clink'],
        [8600, null, 'clink'],
      ],
      question: "You're buying for six. They ask what you're having. What do you do?",
      options: [
        { text: 'Turn round and shout "WHAT ARE YOU ALL HAVING?"', say: '"What are you having" is a question for the table. Not the bar. Everyone behind you just aged a year.' },
        { text: 'Order one drink, then go back and ask the next person', say: "That's six trips. It's not a round. It's a relay." },
        { text: 'Reel off the order you sorted at the table', ok: true, say: 'Correct. Know the order before you get to the bar. Four lagers, a Guinness, and a lime and soda. Done.' },
      ],
    },
  ],
});
