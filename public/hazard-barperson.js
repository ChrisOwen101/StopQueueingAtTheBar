// Barperson hazard perception test: first person from behind the bar.
// Clip markup: hazard-barperson.html. Drawing: hazard-kit.js/.css; this test's wall
// colour is in hazard-barperson.css.

const config = {
  posterAt: 9600, // clip 1 settled: five regulars spread along the counter, faces to camera, no bubbles
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
      label: 'Opening time, seen from behind the bar. The bar is empty. Five customers come in through the door one at a time and line up one behind the other, from straight in front of you back towards the door, while the rest of the bar stays empty.',
      // Opening time. They come in one behind the other, straight at you.
      sounds: [
        [600, 'door'],
        [8800, 'clink'], // the front one's pint, once everyone has spread along the bar
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
      label: 'A grey-haired regular at the bar orders a Guinness, and a second customer comes over and waits on the right. You turn round to the taps and pour the Guinness three-quarters full. It sits on the drip tray, settling, while the mirror behind the taps shows the second customer still waiting, drumming their fingers.',
      sounds: [
        [2500, 'whoosh'], // turn round to the taps
        [3400, 'surge'], // three-quarters full, then it has to settle
        [6150, 'whoosh'], // leave it, turn back, take the next order
        [9000, 'whoosh'], // back to the taps
        [9700, 'pour'], // two lagers, then top up the Guinness
        [11600, 'whoosh'], // turn back with all three
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
      dur: 11000,
      cue: 6000,
      label: 'A customer on the left orders a gin and tonic, and while they do, another customer walks along the bar and stops on the right. You turn round to pour the tonic, and in the mirror behind the taps you see a third customer come in through the door and stop in the middle of the bar. You turn back with the drink. The one on the right and the one in the middle are both waiting.',
      sounds: [
        [2400, 'whoosh'], // turn round to pour; the mirror shows someone arrive in the middle
        [3400, 'fizz'],
        [4500, 'whoosh'], // turn back; nod to the middle, serve the right
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
      label: 'Seen from behind the bar. A customer on the left with a gin and a Guinness pays by card. You hold the card machine out; it shows the amount, they tap, and it starts connecting, a spinner going round and round. Meanwhile another customer comes in, waits at the bar on the right and watches the machine, drumming their fingers.',
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
      dur: 12800,
      cue: 6000,
      label: 'A grey-haired regular orders a round of five lagers and a Guinness. You turn round to the taps and set out six empty glasses in a row on the back counter, under four taps: two lager taps and the Guinness tap between them. The mirror above shows the customer waiting.',
      sounds: [
        [3000, 'whoosh'], // turn round to the taps: six glasses
        [6550, 'surge'], // Guinness first
        [7700, 'pour'], // lagers, two at a time, while it settles
        [9300, 'pour'],
        [10950, 'pour'], // the last lager, and the Guinness topped up
        [12100, 'clink'], // six drinks, ready at once
      ],
      question: 'Six drinks. One of them is a Guinness. What do you pour first?',
      options: [
        { text: 'The lagers, in the order they asked.', say: 'Then five lagers go flat while the Guinness settles at the end, and everyone waits for the last pint.' },
        { text: "The Guinness last, so it's freshest.", say: 'The freshest Guinness in London, and five warm lagers. Nobody has ever said thank you for that.' },
        { text: 'The Guinness first. Pour the lagers while it settles.', ok: true, say: "Correct. Guinness first. It settles while you pour the other five, and everything's ready at once." },
      ],
    },
    {
      label: 'Two customers at the bar, seen from behind it. The one on the left was there first and waits quietly, hands on the bar. The one on the right walks in from the door, stops at the bar, holds a ten pound note up high and waves it at you.',
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
      label: 'A customer on the right orders a lager and you turn round to pour it. In the mirror behind the taps you see someone come in through the door and stop a metre short of the bar, then someone else come in after them and walk straight up to the bar on the left. You turn back. The first one is still standing a metre back, shifting from foot to foot in the middle.',
      sounds: [
        [2000, 'whoosh'], // turn round to pour; the mirror shows who comes in first
        [2400, 'door'],
        [2850, 'pour'],
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
      label: 'Seen from behind the bar. The bar is empty. A queue for the toilets runs along the back wall, in front of the pool table, up to the WC door. Three customers come in through the front door, walk along the wall and join the end of it, thinking it is the queue for the bar. The last one asks if this is the bar queue.',
      sounds: [
        [500, 'door'], // newcomers come in and follow the line along the wall
        [700, 'flush'], // someone goes in; the toilet queue shuffles up
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
      dur: 11000,
      label: 'Seen from behind the bar. One customer waits on the left; another comes in and waits on the right. Your colleague steps in front of you from the right, and you both ask the one on the left what they would like, at the same time. They look from one of you to the other. The one on the right raises a hand and says hello.',
      sounds: [
        [400, 'door'],
        [7300, 'clink'], // your colleague serves the left
        [8600, 'pour'],
        [9800, 'clink'], // you serve the right
      ],
      question: "You and a colleague are both going for the same customer. What do you do?",
      options: [
        { text: 'Call it. "You take them, I\'ve got the right."', ok: true, say: 'Correct. Call it out loud and split the bar. Two staff, two customers, and nobody saying hello to an empty bit of bar.' },
        { text: 'Both serve them. Double the service.', say: "Two people taking one order isn't double the service. It's half. And the one on the right is still saying hello." },
        { text: 'Race your colleague to them. Winner pours.', say: 'Very competitive. Very fast. Meanwhile the customer on the right has started their own petition.' },
      ],
    },
    {
      dur: 12000,
      cue: 5000,
      label: 'You ask a customer at the bar on the right what they would like. They turn their back to the bar to ask their friends at a table behind them, and the table shrugs and asks them back. Another customer, who came in through the door, is waiting at the bar on the left, ready to order.',
      sounds: [
        [500, 'door'],
        [7300, 'whoosh'], // turn round to pour the next customer's IPA
        [7950, 'pour'],
        [9100, 'whoosh'], // turn back, just as the round is decided
        [9800, 'clink'],
      ],
      question: "They're asking their table what everyone wants. What do you do?",
      options: [
        { text: 'Wait. They were first. Rules are rules.', say: "They were first to the bar, and they'll be last to decide. Meanwhile the next customer is visibly ageing." },
        { text: 'Suggest six lagers. Save everyone the bother.', say: "Bold. Efficient. Now someone at that table is drinking a lager they didn't want, very slowly, while staring at you." },
        { text: 'Serve the next one while they ask the table.', ok: true, say: "Correct. That's The Round. What are you having is a question for the table, not the bar. Serve the next one while they find out, then go back." },
      ],
    },
  ],
};

const root = document.getElementById('hpt');
// Build the cartoon clips (figures, set, the pundit freeze) before the player reads them.
HazardKit.build(root, config.clips);
HazardTest.init(root, config);
