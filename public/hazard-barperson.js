// Barperson hazard perception test: first person from behind the bar.
// Clip markup and keyframes: hazard-barperson.html / .css.

// Copy the shared scenery into every view before the player reads the clips.
document.querySelectorAll('[data-decor]').forEach((view) => {
  const tpl = document.getElementById(`bm-decor-${view.dataset.decor}`);
  view.prepend(tpl.content.cloneNode(true));
});

HazardTest.init(document.getElementById('hpt'), {
  posterAt: 3300,
  ambience: 'pub',
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
      // Opening time. They come in one behind the other, straight at you.
      sounds: [
        [600, 'door'],
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
      sounds: [
        [2500, 'whoosh'], // turn to the taps
        [3400, 'surge'], // three-quarters full, then it has to settle
        [6150, 'whoosh'], // leave it, turn back, take the next order
        [8700, 'whoosh'],
        [9500, 'pour'], // two lagers, then top up the Guinness
        [12300, 'clink'],
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
      sounds: [
        [2600, 'whoosh'], // turn to pour; the mirror shows someone arrive in the middle
        [3400, 'fizz'],
        [5300, 'whoosh'], // turn back; nod to the middle, serve the right
        [9400, 'clink'],
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
      sounds: [
        [1000, 'door'], // someone new on the right
        [7400, 'beep'], // approved, while you take the next order
        [8800, 'clink'],
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
      sounds: [
        [2500, 'whoosh'], // turn to the taps: six glasses
        [6200, 'surge'], // Guinness first
        [7000, 'pour'], // lagers while it settles
        [8400, 'pour'],
        [9800, 'pour'],
        [11600, 'clink'], // topped up: six drinks, one trip
      ],
      question: 'Six drinks. One of them is a Guinness. What do you pour first?',
      options: [
        { text: 'The lagers, in the order they asked.', say: 'Then five lagers go flat while the Guinness settles at the end, and everyone waits for the last pint.' },
        { text: "The Guinness last, so it's freshest.", say: 'The freshest Guinness in London, and five warm lagers. Nobody has ever said thank you for that.' },
        { text: 'The Guinness first. Pour the lagers while it settles.', ok: true, say: "Correct. Guinness first. It settles while you pour the other five, and everything's ready at once." },
      ],
    },
    {
      label: 'Two customers at the bar. The one on the left was there first and waits quietly. The one on the right comes in later and waves a ten pound note at you.',
      sounds: [
        [500, 'door'], // the waver comes in after the quiet one
        [6900, 'pour'], // the quiet one's lager
        [8100, 'clink'],
      ],
      question: "Someone's waving a tenner at you. Who do you serve?",
      options: [
        { text: "The tenner. They're clearly in a hurry.", say: 'Reward one tenner and the whole pub learns to wave. By nine o\'clock it looks like a semaphore convention.' },
        { text: 'Neither, until the waving stops.', say: 'Now nobody gets a drink. The quiet one was here first, and their only crime is standing there nicely.' },
        { text: 'The quiet one. They were here first.', ok: true, say: "Correct. The quiet one was here first, so serve them. Then tell the tenner they're next. Waving gets you served at exactly the same time as not waving." },
      ],
    },
    {
      dur: 12000,
      cue: 6000,
      label: 'You take a lager order and turn to pour. In the back-bar mirror you see someone come in and stop a metre short of the bar, then someone else walk straight up to it. You turn back.',
      sounds: [
        [2300, 'whoosh'], // turn to pour; the mirror shows who comes in first
        [2700, 'door'],
        [3000, 'pour'],
        [4500, 'whoosh'], // turn back
        [5300, 'clink'],
        [10300, 'clink'], // the Hoverer's cider
      ],
      question: "Someone's hovering a metre back from the bar. What do you do?",
      options: [
        { text: "Wave them into the gap. They were here first.", ok: true, say: "Correct. That's The Hoverer. They came in before the one at the bar, so wave them into the gap and serve them next. Hovering is not a queue." },
        { text: "Serve the one at the bar. If they wanted a drink, they'd come up.", say: "They do want a drink. They were here first. They're just waiting to be invited in, like a vampire." },
        { text: 'Wait for them to catch your eye.', say: "They won't. A Hoverer can hover until closing. Some of them have been there since 2020." },
      ],
    },
    {
      label: 'The bar is empty. A queue for the toilets runs along the back wall, behind the pool table. New customers come in and join the end of it, thinking it is the queue for the bar.',
      sounds: [
        [700, 'flush'], // someone goes in; the toilet queue shuffles up
        [1600, 'door'], // newcomers join the end of it
        [7000, 'pour'],
        [7600, 'clink'],
        [9000, 'clink'],
      ],
      question: "There's a queue by the toilets. The bar is empty. What do you do?",
      options: [
        { text: 'Nothing. They know where the bar is.', say: "They don't. They think the bar is at the end of that queue. It isn't. It's a toilet." },
        { text: 'Call them over. "The bar\'s over here!"', ok: true, say: 'Correct. That\'s the Phantom Queue. A queue with no bar at the end of it. Call them over before it reaches the pool table.' },
        { text: 'Join the queue. See where it goes.', say: "It goes to the toilet. You've left an empty bar to queue for the loo. The landlord would like a word." },
      ],
    },
    {
      label: 'Two customers wait, one on the left and one on the right. You and a colleague both go to the one on the left and ask what they would like, at the same time. The one on the right says hello.',
      sounds: [
        [400, 'door'],
        [7300, 'clink'], // your colleague serves the left
        [8100, 'pour'],
        [9100, 'clink'], // you serve the right
      ],
      question: "You and a colleague are both going for the same customer. What do you do?",
      options: [
        { text: 'Call it. "You take them, I\'ve got the right."', ok: true, say: 'Correct. Call it out loud and split the bar. Two staff, two customers, and nobody saying hello to an empty bit of bar.' },
        { text: 'Both serve them. Double the service.', say: "Two people taking one order isn't double the service. It's half. And the one on the right is still saying hello." },
        { text: 'Race your colleague to them. Winner pours.', say: 'Very competitive. Very fast. Meanwhile the customer on the right has started their own petition.' },
      ],
    },
    {
      dur: 11500,
      cue: 5000,
      label: 'You ask a customer what they would like. They turn round to ask their table, and the table asks them back. Another customer on the right is waiting, ready to order.',
      sounds: [
        [500, 'door'],
        [7100, 'whoosh'], // turn to pour the next customer's IPA
        [7700, 'pour'],
        [9000, 'whoosh'], // turn back, just as the round is decided
        [9700, 'clink'],
      ],
      question: "They're asking their table what everyone wants. What do you do?",
      options: [
        { text: 'Wait. They were first. Rules are rules.', say: "They were first to the bar, and they'll be last to decide. Meanwhile the next customer is visibly ageing." },
        { text: 'Suggest six lagers. Save everyone the bother.', say: "Bold. Efficient. Now someone at that table is drinking a lager they didn't want, very slowly, while staring at you." },
        { text: 'Serve the next one while they ask the table.', ok: true, say: "Correct. That's The Round. What are you having is a question for the table, not the bar. Serve the next one while they find out, then go back." },
      ],
    },
  ],
});
