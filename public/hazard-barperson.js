// Barperson hazard perception test: first person from behind the bar.
// Clip markup and keyframes: hazard-barperson.html / .css.

// Copy the shared scenery into every view before the player reads the clips.
document.querySelectorAll('[data-decor]').forEach((view) => {
  const tpl = document.getElementById(`bm-decor-${view.dataset.decor}`);
  view.prepend(tpl.content.cloneNode(true));
});

HazardTest.init(document.getElementById('hpt'), {
  posterAt: 3300,
  links: [
    { href: 'hazard-customer.html', text: 'Now try it as a customer' },
    { href: '/#petition-section', text: 'Sign the petition' },
  ],
  grades: [
    [1, 'Landlord material.', 'You see everyone. You serve them in order. Nobody queues.'],
    [0.8, 'Head bartender.', 'One slip. Nobody noticed. Probably.'],
    [0.6, 'Bar staff.', 'Eyes up. Let the Guinness settle on its own.'],
    [0.4, 'Glass collector.', 'Back to the dishwasher for now.'],
    [0, 'Barred.', 'From behind the bar. Read the Bar Rule again.'],
  ],
  clips: [
    {
      label: 'Opening time. The bar is empty, then customers arrive and line up one behind the other, straight in front of you.',
      events: [
        [0, 'Opening time. Twenty feet of empty bar.'],
        [600, null, 'door'],
        [1700, 'Here they come. One behind the other.'],
        [3300, 'Straight at you. Like a post office.'],
        [5150, 'Point along the bar.'],
        [7900, 'Five at the bar. You can see every one of them.'],
      ],
      question: 'A single file is forming right in front of you. What do you do?',
      options: [
        { text: 'Serve the front one. Then the next. Then the next.', say: "That's the Single File. One at a time, five deep, while nineteen feet of bar sits empty." },
        { text: 'Point along the bar: "Spread out, I\'ll come to you."', ok: true, say: "Correct. Point along the bar. Spread out, I'll come to you. Now you can see everyone, and so can the rest of the staff." },
        { text: 'Fetch a rope and two posts. Make it official.', say: "Congratulations. You've built a post office. A bar is not a post office." },
      ],
    },
    {
      dur: 13000,
      cue: 6000,
      label: 'A customer orders a Guinness. You turn to the taps and pour it three-quarters full. It needs to settle, and another customer is waiting.',
      events: [
        [0, 'Two at the bar. The one on the left was first.'],
        [2500, 'You turn to the taps.', 'whoosh'],
        [3400, null, 'surge'],
        [4300, 'Three-quarters full. Now it has to settle.'],
        [6150, 'Leave it. Turn back.', 'whoosh'],
        [7000, 'Take the next order while it settles.'],
        [8700, null, 'whoosh'],
        [9500, 'Two lagers.', 'pour'],
        [11000, 'Then top up the Guinness.'],
        [12300, 'Three drinks. One trip.', 'clink'],
      ],
      question: 'The Guinness has to settle. Someone else is waiting. What do you do?',
      options: [
        { text: 'Watch it settle. It deserves your full attention.', say: "It settles without supervision. Meanwhile someone's been stood at the bar for two minutes, watching you watch a pint." },
        { text: 'Top it up now. Nobody will notice.', say: 'They will notice. Everyone notices. Flat pint, long stare, bad review.' },
        { text: 'Leave it to settle. Take the next order.', ok: true, say: 'Correct. A Guinness settles on its own. Your hands are free, so take the next order while it does.' },
      ],
    },
    {
      dur: 12000,
      cue: 6000,
      label: 'While you serve a gin and tonic, one customer arrives on the right. You turn to pour, and in the back-bar mirror you see another arrive in the middle.',
      events: [
        [0, 'Busy now. Gin and tonic on the left.'],
        [1400, 'Someone arrives on the right.'],
        [2600, 'You turn to pour.', 'whoosh'],
        [3400, null, 'fizz'],
        [3700, 'Keep an eye on the mirror.'],
        [4500, 'Someone else arrives. In the middle.'],
        [5300, 'You turn back.', 'whoosh'],
        [6200, "Nod to the middle. You're next."],
        [7800, 'Serve the right. They were here first.'],
        [9400, null, 'clink'],
        [10000, "You know who's next. You always know."],
      ],
      question: 'Two people waiting. Who do you serve next?',
      options: [
        { text: 'The one on the right. They got here first.', ok: true, say: 'Correct. The right one arrived first. You clocked them before you turned, and watched the middle one arrive in the mirror. Give the middle one a nod.' },
        { text: "The one in the middle. They're nearest.", say: 'Nearest is not next. The right one was here first. You saw them arrive before you turned round.' },
        { text: 'Whoever waves their card hardest.', say: "That's how you train a whole pub to wave. Never reward the tenner-waver." },
      ],
    },
    {
      label: 'A customer pays by card. The card machine is slow to connect, and another customer is waiting on the right.',
      events: [
        [0, "That's eleven forty, please."],
        [1000, 'Someone new on the right.', 'door'],
        [1500, 'Card. Of course.'],
        [2400, 'The card machine is thinking about it.'],
        [5200, 'Hand it over.'],
        [5600, 'Turn to the next customer.'],
        [7400, 'Approved.', 'beep'],
        [8800, 'Two customers. Nobody stood about.', 'clink'],
      ],
      question: "The card machine is connecting. Someone's waiting. What do you do?",
      options: [
        { text: 'Hold it and stare at it until it says approved.', say: "Staring doesn't help. It never has. Meanwhile someone on the right is holding a tenner and losing faith." },
        { text: 'Hand them the machine. Take the next order while it thinks.', ok: true, say: "Correct. Hand it over, turn your head, take the next order. The machine doesn't need supervising." },
        { text: 'Ask the next customer to wait behind the one paying.', say: 'And there it is. A single file, started by you, from behind the bar.' },
      ],
    },
    {
      dur: 12000,
      cue: 6000,
      label: 'One customer orders a round of five lagers and a Guinness. You turn to the taps with six empty glasses.',
      events: [
        [0, 'Friday. One person, one big round.'],
        [2500, 'You turn to the taps.', 'whoosh'],
        [3500, 'Six glasses. Five lagers. One Guinness.'],
        [6200, 'Guinness first.', 'surge'],
        [7000, 'Lagers while it settles.', 'pour'],
        [8400, null, 'pour'],
        [9800, null, 'pour'],
        [11000, 'Top it up. Six drinks, one trip.'],
        [11600, null, 'clink'],
      ],
      question: 'Six drinks. One of them is a Guinness. What do you pour first?',
      options: [
        { text: 'The lagers, in the order they asked.', say: 'Then five lagers go flat while the Guinness settles at the end, and everyone waits for the last pint.' },
        { text: "The Guinness last, so it's freshest.", say: 'The freshest Guinness in London, and five warm lagers. Nobody has ever said thank you for that.' },
        { text: 'The Guinness first. Pour the lagers while it settles.', ok: true, say: "Correct. Guinness first. It settles while you pour the other five, and everything's ready at once." },
      ],
    },
  ],
});
