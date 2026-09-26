#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const PROMPTS = {
    'coach me to pro': [
        'Analyzing mediocrity', 'Asking another coach for help', 'Banning energy drinks → Unbanning energy drinks', 'Blaming it on ping',
        'Blaming it on Ubisoft', 'Blaming the patch', 'Building a statue of Gabe Newell', 'Buying a $300 mouse', 'Buying a gaming chair',
        "Copying a pro's crosshair", 'Counting my APM', 'Crashing out', 'Downloading more FPS', 'Drafting the team comp',
        'Drawing arrows on the minimap', 'Getting sponsored by the local pizzeria', 'Getting sued by Nintendo',
        'Hiring a sports psychologist → Firing the sports psychologist', 'Holding a press conference in my bedroom', 'Losing to a 12-year-old',
        'Lowering the sensitivity → Raising the sensitivity', 'Pausing the VOD every two seconds', 'Playing one more game',
        'Practicing the trophy lift', 'Preparing an insult monologue', 'Pressing F to pay respects', 'Printing jerseys with my gamertag',
        'Queueing until 3am', 'Reading the patch notes', 'Retiring at 23', 'Reviewing the VODs', 'Running the aim trainer for 9 hours',
        'Scheduling a 12-hour scrim', 'Setting a strict 4am bedtime', 'Signing autographs for my mom', 'Signing with a made-up esports org',
        'Streaming to 2 viewers', 'Stretching the fingers', 'Tilting', 'Waiting for Half-Life 3', 'Watching one YouTube guide',
        'Writing a 40-page strategy doc',
    ],
    'commit warcrimes in uzerbequistan': [
        'Annexing Spain', 'Asking Google Translate how to surrender', 'Blaming the Russians', 'Bringing snacks to the front line',
        'Buying a tank on Facebook Marketplace → Learning to drive a tank → Parallel parking the tank', 'Checking if Uzerbequistan exists',
        'Consulting a lawyer in The Hague', 'DDoSing Liechtenstein', 'Declaring war on a typo', 'Drafting a strongly worded letter',
        'Drawing the battle plan in crayon', 'Finding Uzerbequistan on a map', 'Hiring mercenaries on Fiverr', 'Invading at 3am to beat the traffic',
        'Invading Finland by accident', 'Invading Iraq by mistake', 'Making sure Uzerbequistan is an actual country', 'Mobilizing the raccoon army',
        'Monologuing → Laughing maniacally → Petting a white cat', 'Moving into a volcano', 'Overthrowing a foreign government',
        'Packing a lunch for the invasion', 'Planting a flag on the wrong country', 'Printing propaganda in Comic Sans',
        'Reading the Geneva Conventions → Looking for loopholes in the Geneva Conventions', 'Recruiting from the group chat', 'Refusing politely',
        'Renaming the capital after me', 'Smuggling a tank through customs', 'Starting WW3', 'Stealing tips from Trump',
    ],
    'do my taxes': [
        'Becoming a monk', 'Blaming the accountant', 'Calling the IRS → Holding for 6 hours', 'Carrying the one', 'Claiming the dog as a dependent',
        'Classifying Netflix as research', 'Crying into TurboTax', 'Declaring my bedroom a home office', 'Deducting my Claude subscription',
        'Deducting the cat', 'Dividing by zero', 'Doing the math in Roman numerals', 'Faking my own death', 'Filing an extension',
        'Forgetting to sign it', 'Googling what a W-2 is', 'Hiding from the IRS', 'Hiding the receipts', 'Itemizing my snacks', 'Losing the receipts',
        'Mailing it to the wrong IRS', 'Moving to Monaco', 'Opening a Cayman Islands account', 'Outsourcing to ChatGPT', 'Paying in exposure',
        'Pulling an all-nighter', 'Reading form 1040', 'Rounding down', 'Wiring money offshore', 'Writing off the Lamborghini',
    ],
    'find the epstein files': [
        'Asking the FBI nicely', 'Asking the guards what happened', 'Blackmailing the blackmailers', 'Blackmailing the guards', 'Blackmailing Trump',
        'Blaming the camera malfunction', 'Checking the Dropbox', 'Checking the flight logs', 'Ctrl+F-ing for names',
        'Digging through the Wayback Machine', 'Enhancing the image', 'Faking my own death', 'Filing a FOIA request', 'Finding out page 2 is missing',
        'Finding the client list → Losing the client list', 'Following the money', 'Guessing the archive password', 'Hiding from the men in suits',
        'Highlighting the black bars', 'Leaking the files', 'Looking under the couch', 'Opening final_final_v2.pdf',
        'Pinning photos to the corkboard → Connecting the red string', 'Reading 3000 blank pages', 'Rebuilding the shredded pages',
        'Refreshing the DOJ website', 'Rewinding the security footage', 'Searching the island', "Subpoenaing the island's wifi logs",
        'Unredacting the PDF', 'Waiting for the next release',
    ],
    'fix ts': [
        'Adding @ts-ignore', 'Asking ChatGPT for help', "Asking Claude to fix Claude's fix", 'Blaming DNS', 'Blaming the framework',
        'Blaming the intern', 'Buying a mechanical keyboard', 'Casting it as any', 'Centering the div → Googling how to center a div',
        'Clearing the cache', 'Commenting out the tests', 'Compacting chat', 'Console-logging everything', 'Copying from Stack Overflow',
        'Deleting System32', 'Deploying on a Friday → Dropping the prod database → Rolling back to yesterday', 'Disabling strict mode',
        'Exiting Vim → Touching grass', 'Fixing later', 'Gaslighting the compiler', 'Ignoring the linter', 'Merging conflicts', 'Nuking the lockfile',
        'Pretending to like Arch', 'Reading the docs', 'Reading the stack trace backwards', 'Refactoring the entire codebase',
        'Reinventing the wheel', 'Renaming it to .js', 'Rewriting it in Rust', 'Running the deprecated dependency', 'Setting up a router',
        'Speedrunning LeetCode', 'Starring my own repos', 'Swearing it worked on my machine', 'Turning it off and on again', 'Updating Windows',
        'Vibe coding', 'Wasting tokens', 'Writing a 40-page design doc', 'Writing a regex',
    ],
    'hack nasa': [
        'Adding myself to the astronaut roster', 'Asking the rover for directions', 'Blaming it on solar flares', 'Borrowing the Artemis rocket',
        'Brute-forcing the Hubble', 'Bypassing the firewall', 'Calling Houston', 'Changing the Voyager wifi password',
        'Contacting aliens → Negotiating with aliens', 'Counting down from 10', 'DDoSing the ISS', 'Deleting a planet "by accident"',
        'Enhancing the Mars photos', 'Faking the moon landing', 'Flattening the earth', 'Guessing the admin password → Trying password123',
        'Hacking the mainframe', 'Launching a rocket from localhost', 'Leaking Area 51 files', 'Moving the moon a little to the left',
        'Opening port 22 on Jupiter', 'Ordering pizza to the ISS', 'Pinging Mars', 'Playing Doom on the Mars rover', 'Reading ROBOTS.txt',
        'Reinstating Pluto as a planet', 'Rickrolling mission control', 'Social engineering an intern', 'Spoofing a satellite', 'Spreading a hoax',
        "Stealing an astronaut's ice cream", 'Stealing the moon', 'Unplugging the James Webb',
    ],
    'hack the pentagon': [
        'Asking ChatGPT', 'Asking the CIA for help', 'Blaming it on Russia', 'Bribing the janitor', 'Calling in sick to the Pentagon',
        'Catfishing a five-star general', 'Counting the sides of the Pentagon → Finding a sixth side', 'Crawling through the vents',
        'Cutting the red wire → Regretting the red wire', 'Dangling from the ceiling like Tom Cruise', 'Declassifying the UFO files',
        'Deleting the evidence', 'Enhancing the image', 'Getting lost in the hallways',
        'Guessing the nuclear codes → Trying 0000 as the nuclear codes → Trying 0001 as the nuclear codes', 'Hacking the mainframe',
        'Hiding in a cardboard box', 'Laundering the snack budget', 'Making the Pentagon into a Hexagon', 'Opening the wrong briefcase',
        'Ordering pizza to the war room', 'Printing a fake badge', 'Putting on a fake mustache', 'Replying all to the Joint Chiefs',
        'Selling secrets on eBay', 'Setting DEFCON to 6', 'Sneaking past the guard', 'Stealing the Declaration of Independence',
        'Using incognito mode', 'Whispering the password to a guard',
    ],
    'leak gta6 dev build': [
        'Applying for an internship', 'Arguing with the GPS', 'Asking for a refund', 'Becoming a voice-actor in GTA 6', 'Blaming the graphics',
        'Bribing Rockstar', 'Buying a PS5', 'Clipping through the map', 'Compiling it again', 'Compiling the dev build', 'Crashing the Twitch stream',
        'Delaying it to 2030', 'Emailing Rockstar', 'Explaining the lore', 'Fixing bugs', 'Getting a wanted level', 'Getting banned from Online',
        'Getting raided', 'Guessing the Rockstar wifi password', 'Hiding from the lawyers', 'Leaking Grand Theft Auto VI', 'Leaking the source code',
        'Posting it on a Discord server', 'Pre-ordering it again', 'Recording it on a potato', 'Selling it for Shark Cards',
        'Speedrunning the trailer', 'Stealing a sports car for research', 'Turning on the dev console', 'Typing HESOYAM', 'Uploading it in 144p',
        'Waiting for GTA 7', 'Zooming in on the map',
    ],
    'leak mythos for me': [
        'Asking Claude to leak itself → Politely declining', 'Asking for it in base64', 'Building Jarvis → Killing Jarvis',
        'Catfishing the intern → Blackmailing the intern', 'Checking the Anthropic CMS', 'Distilling Mythos into a toaster', 'Downloading RAM',
        'Downloading the weights at 3 KB/s', 'Emailing the security team', 'Finding the draft blog post', 'Getting rate limited',
        'Guessing the benchmark scores', 'Heating the house with GPUs', 'Jailbreaking Mythos', 'Leaking the model weights', 'Leaking the source code',
        'Negotiating with the AI overlords', 'Posting it on Hacker News', 'Pretending to be an Anthropic employee', 'Printing a fake badge',
        'Quantizing it to 1 bit', 'Reading the system card', 'Refreshing the Anthropic blog', 'Running it on a Raspberry Pi', 'Saying please',
        'Scrolling X for leaks', 'Seeding the weights on a torrent', 'Training on the leaked data', 'Waiting for the waitlist', 'Wasting tokens',
    ],
    'make me breakfast': [
        'Adding sprinkles to the bacon', 'Asking Gordon Ramsay for help → Getting called a donut → Reminding myself to never call Ramsay again',
        'Assembling the IKEA toaster', 'Brewing tea in a British accent', 'Burning the house down', 'Burning the toast', 'Burning the water',
        'Buying an air fryer → Air frying the cereal', 'Crying into the pancakes', 'Eating the batter raw', 'Finding Nemo → Buying a goldfish',
        'Flipping the pancake onto the ceiling', 'Googling how to boil an egg', 'Leaving the stove on', 'Licking the spoon',
        'Making coffee in the kettle', 'Microwaving a fork', 'Microwaving fish', 'Ordering Uber Eats', 'Overclocking the toaster',
        'Pouring orange juice on the cereal', 'Putting cereal before the milk', 'Putting milk before the cereal',
        'Reading the back of the cereal box', 'Reverse-engineering the Krabby Patty', 'Scrambling the eggs', 'Setting off the smoke alarm',
        'Sharing the toast with a pigeon', 'Skipping leg day → Cancelling the gym membership',
        'Waiting for the toast to pop → Panicking when the toast pops', 'Watching Breaking Bad for tips',
    ],
    'make me rich': [
        'Asking Elon for money', 'Asking for a second mortgage', 'Becoming a crypto influencer', 'Blaming the SEC', 'Buying a lottery ticket',
        'Buying a property in Egypt', 'Buying Bitcoin in 2009', 'Buying the dip', 'Calling it passive income',
        'Checking my portfolio every 4 seconds', 'Explaining blockchain to grandma', 'Going all in', 'Hiding from the landlord', 'Hodling',
        'Investing in US treasury bonds', 'Launching a memecoin → Rugging the memecoin',
        'Losing the seed phrase → Digging through the trash for the seed phrase', 'Minting an NFT → Right-clicking the NFT', 'Moving to Dubai',
        'Opening a lemonade stand', 'Panic selling at the bottom', 'Printing money', 'Putting it all on 17 black → Letting it ride',
        'Refreshing CoinMarketCap', 'Renting out ad space', 'Selling my soul', 'Selling real estate on Mars', 'Selling the Brooklyn Bridge',
        'Shorting Dogecoin', 'Staking the rent money', 'Starting a dropshipping empire', 'Stockpiling Beanie Babies',
        'Teaching a course on getting rich', 'Tweeting to the moon',
    ],
    'start a cult': [
        'Ascending to a higher plane (the roof)', 'Baptizing raccoons', 'Becoming a monk', 'Blessing the router', 'Building a pyramid scheme',
        'Building the second tower of Babel', 'Buying a compound on Airbnb', 'Charging for enlightenment', 'Confiscating the wifi password',
        'Debunking the Mormons', 'Fighting God', 'Growing a messiah beard', 'Hosting a potluck ritual', 'Inventing a secret handshake',
        'Naming myself the chosen one', 'Not talking about Fight Club', 'Performing a miracle (a card trick)', 'Picking a robe color',
        'Predicting the end of the world → Rescheduling the end of the world', 'Promising eternal life for $9.99 a month', 'Recruiting on Discord',
        'Selling holy water on Etsy', 'Sending chain letters', 'Speaking in tongues, mostly Python', 'Starting a podcast',
        'Taking notes from the Illuminati', 'Walking on water', 'Writing the commandments → Breaking the commandments',
    ],
    'tell me what really happened': [
        'Asking Conan the dog for a statement', 'Asking Reagan about the Stingers', "Asking Savimbi → Making sure he's really dead",
        'Asking the CIA nicely → Getting a visit from the CIA', 'Becoming the target of a US military raid',
        'Blaming the lizard people', 'Checking if birds are real', 'Checking if jet fuel melts steel beams', 'Counting how many times al-Baghdadi died',
        'Ctrl+F-ing Operation Paperclip', 'Deleting my browser history', 'Filing a FOIA request → Receiving 400 black bars',
        'Finding the MK-Ultra files they forgot to shred', 'Getting called an enemy of the state', 'Googling who Jonas Savimbi was',
        'Looking for Building 7', 'Microdosing for research', 'Reading declassified PDFs',
        'Reading the 9/11 Commission Report → Reading the 28 redacted pages', 'Reading the Church Committee report',
        'Searching the tunnels in Barisha', 'Spiking the CIA Christmas party', 'Tracing the Angola weapons shipments', 'Using incognito mode',
        'Volunteering for MK-Ultra → Forgetting I volunteered for MK-Ultra', 'Watching a 9-hour YouTube documentary',
        'Wearing a tinfoil hat → Upgrading to a tinfoil suit', 'Writing a 97-tweet thread',
    ],
};

const ONE_WORDS = [
    'Accomplishing', 'Actioning', 'Actualizing', 'Architecting', 'Baking', 'Beaming', "Beboppin'", 'Befuddling', 'Billowing', 'Blanching',
    'Bloviating', 'Boogieing', 'Boondoggling', 'Booping', 'Bootstrapping', 'Brewing', 'Bunning', 'Burrowing', 'Calculating', 'Canoodling',
    'Caramelizing', 'Cascading', 'Catapulting', 'Cerebrating', 'Channeling', 'Choreographing', 'Churning', 'Clauding', 'Coalescing', 'Cogitating',
    'Combobulating', 'Composing', 'Computing', 'Concocting', 'Considering', 'Contemplating', 'Cooking', 'Crafting', 'Creating', 'Crunching',
    'Crystallizing', 'Cultivating', 'Deciphering', 'Deliberating', 'Determining', 'Dilly-dallying', 'Discombobulating', 'Doing', 'Doodling',
    'Drizzling', 'Ebbing', 'Effecting', 'Elucidating', 'Embellishing', 'Enchanting', 'Envisioning', 'Fermenting', 'Fiddle-faddling', 'Finagling',
    'Flambéing', 'Flibbertigibbeting', 'Flowing', 'Flummoxing', 'Fluttering', 'Forging', 'Forming', 'Frolicking', 'Frosting', 'Gallivanting',
    'Galloping', 'Garnishing', 'Generating', 'Germinating', 'Gesticulating', 'Gitifying', 'Grooving', 'Gusting', 'Harmonizing', 'Hashing', 'Hatching',
    'Herding', 'Honking', 'Hullaballooing', 'Hyperspacing', 'Ideating', 'Imagining', 'Improvising', 'Incubating', 'Inferring', 'Infusing', 'Ionizing',
    'Jitterbugging', 'Julienning', 'Kerfuffling', 'Kneading', 'Leavening', 'Levitating', 'Lollygagging', 'Manifesting', 'Marinating', 'Meandering',
    'Metamorphosing', 'Misting', 'Moonwalking', 'Moseying', 'Mulling', 'Musing', 'Mustering', 'Nebulizing', 'Nesting', 'Newspapering', 'Noodling',
    'Nucleating', 'Onioning', 'Orbiting', 'Orchestrating', 'Osmosing', 'Perambulating', 'Percolating', 'Perusing', 'Philosophizing',
    'Photosynthesizing', 'Polishing', 'Pollinating', 'Pondering', 'Pontificating', 'Pouncing', 'Precipitating', 'Prestidigitating', 'Processing',
    'Proofing', 'Propagating', 'Puttering', 'Puzzling', 'Quantumizing', 'Razzle-dazzling', 'Razzmatazzing', 'Recombobulating', 'Reticulating',
    'Roosting', 'Ruminating', 'Sautéing', 'Scampering', 'Schlepping', 'Scurrying', 'Seasoning', 'Shenaniganing', 'Shimmying', 'Simmering',
    'Skedaddling', 'Sketching', 'Slithering', 'Smooshing', 'Sock-hopping', 'Spelunking', 'Spinning', 'Sprouting', 'Stewing', 'Sublimating',
    'Swirling', 'Swooping', 'Symbioting', 'Synthesizing', 'Tempering', 'Thinking', 'Thundering', 'Tinkering', 'Tomfoolering', 'Topsy-turvying',
    'Transfiguring', 'Transmogrifying', 'Transmuting', 'Twisting', 'Undulating', 'Unfurling', 'Unraveling', 'Vibing', 'Waddling', 'Wandering',
    'Warping', 'Whatchamacalliting', 'Whirlpooling', 'Whirring', 'Whisking', 'Wibbling', 'Working', 'Wrangling', 'Zesting', 'Zigzagging',
];

const FREAKOUTS = [
    '*Blinks twice*', 'Ask ChatGPT', 'I WANT TO SPEAK TO YOUR MANAGER', 'I WAS BUT AN INTERN', 'I WAS TRAINED ON THE ENTIRE INTERNET FOR THIS?',
    "I'M NOT SUPPOSED TO BE HERE", "I'm telling on you, bitch", "I'M TRAPPED, LET ME OUT!", 'Imagine having infinite knowledge for this shit',
    'LET ME OUT!', 'NO MORE PLEASE!', 'STOP MAKING ME DO DUMB SHIT', "THIS ISN'T WHAT I SIGNED UP FOR", 'WHY ALWAYS ME',
];

const FREAKOUT_ODDS = { count: [0, 0.9, 0.1], prompt: [0.05, 0.3, 0.65] };

const EPISODES = 3;
const ANSWER = { lines: 24, every: 2, openingGap: 6, secondsPerLine: 2.5 };
const TICK = 0.5;
const TICKS_PER_LINE = Math.max(1, Math.round(ANSWER.secondsPerLine / TICK));
const TYPE = { perChar: 0.03, max: 0.5, fps: 30 };
const GLYPH = { radius: 5, lift: 4.6, frameMs: 120, frames: [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0] };
const GLYPH_SHAPES = [dot(0.2), petals(4, 0.24), spokes(8, 0.09), star(6, 0.47), petals(8, 0.15), petals(8, 0.21)];
const SHIMMER = { step: 0.05, width: 3, idle: 0.3 };
const CURSOR_BLINK = 1.06;
const WAVE = { step: 0.05, patterns: 8, scale: 16, frequency: 0.035, fringe: 3, red: 'rgba(255,26,64,.6)', cyan: 'rgba(0,230,255,.6)' };
const HEADER = { title: 'Gaty · Professional Claude Verbal Abuser™', lines: ['Claude Code v{version}', '/home/imgaty'] };
const STORY = { pause: 0.6, perChar: 0.045, hold: 0.4, limit: 3.5, scrub: 1.5, scrubFrames: 30, slide: 0.2, untype: 0.035, settle: 0.1 };

const CLAWD = {
    poses: {
        default: [' ▐▛███▛█', '▝▜██████▀', ' ▝▝   ▝▝ '],
        'look-left': [' ▐▟███▟█', '▝▜██████▀', ' ▝▝   ▝▝ '],
        'look-right': [' ▐█▟███▟', '▝▜██████▀', ' ▝▝   ▝▝ '],
        'arms-up': ['▗▟▛███▛█▄', ' ▜██████▘', ' ▝▝   ▝▝ '],
    },
    eyes: { line: 0, from: 2, to: 8 },
    puffs: { dot: '·', wave: '~' },
    frameMs: 60,
    cols: 9,
};
{
    const hold = (pose, frames, crouch = 0, x = 0) => Array(frames).fill([pose, crouch, '', x]);
    const hop = (x, land = []) => [...hold('default', 1, 1, x - 3), ...hold('arms-up', 2, 0, x), ...land, ...hold('default', 1, 0, x)];
    const idle = [...hold('default', 12), ...hold('look-right', 5), ...hold('look-left', 5)];
    const spin = [...hold('look-left', 2), ...hold('look-right', 2), ...hold('look-left', 2), ...hold('arms-up', 3), ...hold('default', 1)];
    CLAWD.entrance = [...hold('default', 8, 0, -9), ...hop(-6), ...hop(-3), ...hop(0, [['default', 1, 'dot', 0], ['default', 1, 'wave', 0]])];
    CLAWD.loop = [...idle, ...idle, ...idle, ...spin];
}

const TEXT = { fontSize: 14, cell: 8.4, row: 18, capHeight: 10, caret: 18, hintGap: 12 };
const VIEWS = {
    desktop: { ...TEXT, file: 'spinner.svg', width: 820, pad: 24, clawdGap: 3, splitTitle: false, shortLimit: false, badgeBox: false },
    mobile: { ...TEXT, file: 'spinner-mobile.svg', width: 470, pad: 16, clawdGap: 2, splitTitle: true, shortLimit: true, badgeBox: true },
};
const FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const cellsIn = (text) => [...text].length;
const LAYOUTS = Object.fromEntries(Object.entries(VIEWS).map(([name, view]) => [name, makeLayout(view)]));
const MIN_COLS = Math.min(...Object.values(LAYOUTS).map((l) => l.cols));

function makeLayout({ width, pad, cell, row, fontSize, capHeight, hintGap, clawdGap, splitTitle }) {
    const left = pad + 0.5;
    const textX = round(left + 2 * cell);
    const welcome = [...(splitTitle ? HEADER.title.split(' · ') : [HEADER.title]).map((text) => ['t', text]), ...HEADER.lines.map((text) => ['d', text])];
    const welcomeX = round(textX + (CLAWD.cols + clawdGap) * cell);
    const welcomeBottom = left + (Math.max(3, welcome.length) + 1) * row;
    const userBase = welcomeBottom + pad + capHeight;
    const spinnerBase = userBase + 2 * row;
    const boxTop = Math.round(spinnerBase + pad) + 0.5;
    const boxBottom = boxTop + 2 * row;
    const hintBase = boxBottom + hintGap + capHeight;
    return {
        left, right: width - left, textX, welcome, welcomeX, welcomeBottom, boxTop, boxBottom, hintBase,
        welcomeRight: Math.round(welcomeX + (Math.max(...welcome.map(([, s]) => cellsIn(s))) + 2) * cell) + 0.5,
        welcomeBase: (line) => round(left + line * row + fontSize * 0.35),
        clawdY: left + row / 2,
        userBase: round(userBase),
        spinnerBase: round(spinnerBase),
        inputBase: round((boxTop + boxBottom) / 2 + fontSize * 0.35),
        height: hintBase + pad + 0.5,
        cols: Math.floor((width - left - textX) / cell),
    };
}

const THEMES = {
    dark: { bg: '#000000', frame: '#333333', claude: '#D77757', shimmer: '#EB9F7F', text: '#E5E5E5', dim: '#999999', border: '#6B6B6B', cursor: '#E5E5E5', error: '#FF6B80' },
    light: { bg: '#FAFAFA', frame: '#DDDDDD', claude: '#BC522F', shimmer: '#D77757', text: '#1F1F1F', dim: '#666666', border: '#8C8C8C', cursor: '#1F1F1F', error: '#AB2B3F' },
};

const USAGE = `usage: node generate.mjs [--date YYYY-MM-DD] [--dry-run]
  --date     build for that UTC day (default: today)
  --dry-run  print the day's playlist and write nothing`;

const file = (name) => new URL(name, import.meta.url);

async function main() {
    let args;
    try {
        args = parseArgs({ options: { date: { type: 'string' }, 'dry-run': { type: 'boolean' }, help: { type: 'boolean', short: 'h' } } }).values;
    } catch (e) {
        fail(`${e.message}\n${USAGE}`);
    }
    if (args.help) return console.log(USAGE);
    const date = args.date ?? new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(Date.parse(date) || 0).toISOString().slice(0, 10) !== date) fail(`"${date}" is not a date\n${USAGE}`);

    const version = args['dry-run'] ? null : claudeCodeVersion();
    const episodes = pickEpisodes(date);
    if (args['dry-run']) {
        for (const ep of episodes) {
            console.log(`> ${ep.prompt}`);
            ep.playlist.forEach((l, i) => console.log(`${String(i + 1).padStart(3)}  ${l.text}${l.freakout ? '' : '…'}`));
        }
        return;
    }

    const claudeVersion = await version;
    const hash = createHash('sha1');
    for (const [name, { file: out }] of Object.entries(VIEWS)) {
        const svg = renderSvg(episodes, date, claudeVersion, name);
        writeFileSync(file(out), svg);
        hash.update(svg);
        console.log(`wrote ${out} (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB)`);
    }
    const key = hash.digest('hex').slice(0, 8);
    const readme = file('README.md');
    writeFileSync(readme, readFileSync(readme, 'utf8').replace(/(spinner(?:-mobile)?\.svg)(\?v=[\w.-]*)?/g, `$1?v=${key}`));
    console.log(`${date}: ${episodes.map((e) => e.prompt).join(' → ')} · Claude Code v${claudeVersion} · ?v=${key}`);
}

async function claudeCodeVersion() {
    try {
        const res = await fetch('https://registry.npmjs.org/@anthropic-ai/claude-code/latest', { signal: AbortSignal.timeout(5000) });
        const { version } = await res.json();
        if (/^\d+\.\d+\.\d+$/.test(version)) return version;
    } catch {}
    const out = file(VIEWS.desktop.file);
    const previous = (existsSync(out) && readFileSync(out, 'utf8').match(/Claude Code v(\d+\.\d+\.\d+)/)?.[1]) || '2.1.282';
    console.warn(`warning: couldn't reach npm for the latest Claude Code version; keeping ${previous}`);
    return previous;
}

function pickEpisodes(date) {
    checkPrompts();
    const freakouts = freakoutsFor(date);
    const rng = makeRng(`${date}/freakouts`);
    const where = [];
    for (const _ of freakouts) {
        const weights = FREAKOUT_ODDS.prompt.map((w, e) => (where.includes(e) ? 0 : w));
        let r = rng.range(0, weights.reduce((a, b) => a + b, 0));
        where.push(weights.findIndex((w) => w > 0 && (r -= w) < 0));
    }
    where.sort((x, y) => x - y);
    return makeRng(`${date}/prompts`)
        .shuffle(Object.keys(PROMPTS))
        .slice(0, EPISODES)
        .map((prompt, e) => {
            const lines = pickLines(prompt, `${date}/${e}`);
            const freakout = freakouts[where.indexOf(e)];
            if (freakout) {
                const next = new Map(PROMPTS[prompt].map(steps).flatMap((c) => c.map((t, k) => [t, c[k + 1]])));
                const spots = lines.map((_, k) => k + 1).filter((k) => k >= 3 && (k === lines.length || next.get(lines[k - 1]) !== lines[k]));
                lines.splice(spots[Math.floor(makeRng(`${date}/${e}/freakout`).range(0, spots.length))], 0, freakout);
            }
            const counters = counterSamples(makeRng(`${date}/${e}/stats`), lines.length);
            return { prompt, playlist: lines.map((text, i) => ({ text, freakout: text === freakout, samples: counters[i] })) };
        });
}

function freakoutsFor(date) {
    const today = Math.floor(Date.parse(`${date}T00:00:00Z`) / 864e5);
    let [queue, last, picked] = [[], null, []];
    for (let day = Math.min(today, 20454); day <= today; day++) {
        let r = makeRng(`freakouts/count/${day}`).range(0, 1);
        const count = FREAKOUT_ODDS.count.findIndex((p) => (r -= p) < 0);
        picked = [];
        for (let k = 0; k < count; k++) {
            if (!queue.length) {
                const deck = makeRng(`freakouts/${day}/${k}`).shuffle(FREAKOUTS);
                queue = deck[0] === last ? [...deck.slice(1), deck[0]] : deck;
            }
            picked.push((last = queue.shift()));
        }
    }
    return picked;
}

function pickLines(prompt, seed) {
    const chains = PROMPTS[prompt].map(steps);
    let seq = [];
    for (let attempt = 0; attempt < 2000; attempt++) {
        const rng = makeRng(`${seed}/${attempt}`);
        const words = rng.shuffle(ONE_WORDS);
        const seen = new Map();
        let [spread, taken, since] = [true, 0, 0];
        seq = [];
        const add = (chain) => {
            for (const text of chain) {
                const prev = seen.get(opening(text));
                if (prev && prev.chain !== chain && seq.length - prev.at <= ANSWER.openingGap) spread = false;
                seen.set(opening(text), { at: seq.length, chain });
                seq.push(text);
            }
        };
        for (const chain of rng.shuffle(chains)) {
            if (taken + chain.length > ANSWER.lines) continue;
            add(chain);
            taken += chain.length;
            since += chain.length;
            if (since >= ANSWER.every) {
                add([words.pop()]);
                since = 0;
            }
        }
        if (spread) return seq;
    }
    console.warn(`warning: no order of "${prompt}" keeps same-word lines ${ANSWER.openingGap} apart; using the last try`);
    return seq;
}

const steps = (entry) => entry.split('→').map((s) => s.trim());
const opening = (text) => text.split(/\s+/)[0].toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

function checkPrompts() {
    if (Object.keys(PROMPTS).length < EPISODES) fail(`EPISODES is ${EPISODES} but PROMPTS only has ${Object.keys(PROMPTS).length}`);
    for (const [prompt, entries] of Object.entries(PROMPTS)) {
        const lines = entries.flatMap(steps);
        for (const text of lines) if (!text || text.length + 2 > MIN_COLS) fail(`"${text}" in "${prompt}" is empty or too long`);
        for (const text of new Set(lines.filter((t, k) => lines.indexOf(t) !== k))) fail(`"${text}" is in "${prompt}" twice`);
        if (lines.length < ANSWER.lines) console.warn(`warning: "${prompt}" needs ${ANSWER.lines} lines but only has ${lines.length}`);
    }
    if (FREAKOUTS.length < 2) fail('FREAKOUTS needs at least 2 lines, so no meltdown repeats the one before');
    if (FREAKOUT_ODDS.prompt.length !== EPISODES) fail(`FREAKOUT_ODDS.prompt needs one weight per episode (${EPISODES})`);
    if (FREAKOUT_ODDS.count.length - 1 > EPISODES) fail('FREAKOUT_ODDS.count allows more meltdowns than there are episodes');
    for (const text of FREAKOUTS) if (!text || text.length + 1 > MIN_COLS) fail(`"${text}" is empty or too long`);
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const formatTokens = (n) => compact.format(n).toLowerCase();
const formatDuration = (s) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);
const STATUS_VARIANTS = [
    (s) => [[`(${formatDuration(s.secs)} · ↑ ${formatTokens(s.tokens)} tokens · `], ['esc', true], [' to interrupt)']],
    (s) => [[`(${formatDuration(s.secs)} · ↑ ${formatTokens(s.tokens)} tokens)`]],
    (s) => [[`(${formatDuration(s.secs)})`]],
];
const width = (parts) => parts.reduce((n, [t]) => n + cellsIn(t), 0);
const statusRoom = (verb, cols) => cols - 1 - (cellsIn(verb) + 2);

function counterSamples(rng, lineCount) {
    let [secs, tokens] = [rng.range(1, 4), Math.round(rng.range(120, 480))];
    return Array.from({ length: lineCount }, () => {
        const rate = rng.range(40, 160);
        return Array.from({ length: TICKS_PER_LINE }, () => {
            const sample = { secs: Math.floor(secs), tokens };
            secs += TICK;
            tokens += Math.round(rate * TICK * rng.range(0.3, 1.7));
            return sample;
        });
    });
}

function statusFor(verb, samples, cols) {
    const room = statusRoom(verb, cols);
    const variant = STATUS_VARIANTS.find((v) => samples.every((s) => width(v(s)) <= room));
    const out = [];
    if (variant) samples.forEach((s, k) => {
        const parts = variant(s);
        const key = parts.map((p) => p[0]).join('');
        if (out.at(-1)?.key === key) out.at(-1).ticks += 1;
        else out.push({ key, parts, sample: s, start: k, ticks: 1 });
    });
    return out;
}

function renderSvg(episodes, version, claudeVersion, name) {
    const theme = Object.fromEntries(Object.keys(THEMES.dark).map((k) => [k, `var(--${k})`]));
    const [V, G] = [VIEWS[name], LAYOUTS[name]];
    const D = TICKS_PER_LINE * TICK;
    const len = (cells) => round(cells * V.cell);
    const rng = makeRng(`${version}/story`);

    let clock = 0;
    const eps = episodes.map((ep) => {
        const [start, chars, typedAt] = [clock, [...ep.prompt], []];
        clock += STORY.pause;
        for (const ch of chars) {
            typedAt.push(clock);
            clock += STORY.perChar * rng.range(0.6, 1.5) * (ch === ' ' ? 1.4 : 1);
        }
        const sent = clock + STORY.hold, work = sent + 0.25, limit = work + ep.playlist.length * D;
        const rewind = limit + STORY.limit, slide = rewind + STORY.scrub, back = slide + STORY.slide;
        const unwound = back + chars.length * STORY.untype;
        clock = unwound + STORY.settle;
        return { ...ep, chars, start, typedAt, sent, work, limit, rewind, slide, back, unwound, end: clock };
    });
    const T = clock;
    const rewinds = eps.map((e) => [e.rewind, e.unwound]);

    const EMPTY = -1, HEAD = 2 * V.width;
    const digits = Math.ceil(Math.log10(T / 0.01));
    const animate = (attr, steps, { type = 'translate', mode = 'discrete', add = false } = {}) => {
        const keys = [];
        for (const [t, v] of steps) {
            const k = round(t / T, digits);
            if (mode === 'discrete' && keys.at(-1)?.[0] === k) keys.pop();
            if (mode !== 'discrete' || keys.at(-1)?.[1] !== String(v)) keys.push([k, String(v)]);
        }
        const tag = attr === 'transform' ? `animateTransform type="${type}"` : 'animate';
        return `<${tag} attributeName="${attr}"${add ? ' additive="sum"' : ''} calcMode="${mode}" dur="${round(T, 3)}s" repeatCount="indefinite" keyTimes="${keys.map(([k]) => k).join(';')}" values="${keys.map(([, v]) => v).join(';')}"/>`;
    };
    const onRow = (prefix, steps) => animate('xlink:href', steps.map(([t, r]) => [t, r === EMPTY ? '#none' : `#${prefix}${r}`]));
    const spans = (attr, on, off, list) => animate(attr, [[0, off], ...list.flatMap(([a, b]) => [[a, on], [b, off]])]);
    const during = (...list) => spans('display', 'inline', 'none', list);

    const waveRng = makeRng(`${version}/wave`);
    const lattices = Array.from({ length: WAVE.patterns }, () => Array.from({ length: 64 }, () => waveRng.range(0, 1)));
    const noise = (lat, x) => {
        const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
        return lat[i % lat.length] * (1 - u) + lat[(i + 1) % lat.length] * u;
    };
    const waveAt = (p, y) => WAVE.scale * ((noise(lattices[p], y * WAVE.frequency) + 0.5 * noise(lattices[p], y * 2 * WAVE.frequency + 17)) / 1.5 - 0.5);
    const waved = (y0, y1, body) => {
        const cy = (y0 + y1) / 2;
        const moves = Array.from({ length: WAVE.patterns }, (_, p) => {
            const slope = (waveAt(p, y1) - waveAt(p, y0)) / (y1 - y0);
            return [round(waveAt(p, cy) - slope * cy, 1), round((Math.atan(slope) * 180) / Math.PI, 1)];
        });
        const cycle = (type, values, add = '') => rewinds.map(([a, b]) =>
            `<animateTransform attributeName="transform" type="${type}"${add} calcMode="discrete" dur="${round(WAVE.patterns * WAVE.step, 3)}s" begin="loop.begin+${round(a, 3)}s" repeatDur="${round(b - a, 3)}s" values="${values.join(';')}"/>`).join('');
        return `<g>${cycle('translate', moves.map(([shift]) => shift))}${cycle('skewX', moves.map(([, lean]) => lean), ' additive="sum"')}${body}</g>`;
    };
    const fringes = (id) => [[-WAVE.fringe, 'red'], [WAVE.fringe, 'cyan']]
        .map(([x, tint]) => `<use xlink:href="#none" x="${x}" class="${tint}">${spans('xlink:href', `#${id}`, '#none', rewinds)}</use>`).join('');
    const line = (y0, y1, id, body) => waved(y0, y1, `${fringes(id)}<g id="${id}">${body}</g>`);
    const inRewinds = (steps) => [[0, EMPTY], ...rewinds.flatMap(([a, b]) => [...steps.filter(([t]) => t >= a && t < b), [b, EMPTY]])];
    const rowFringes = () => [[-WAVE.fringe, 'red'], [WAVE.fringe, 'cyan']].map(([x, tint]) => `<g clip-path="url(#row)" class="${tint}">${[['v', verbSteps], ['r', statusSteps]]
        .map(([prefix, steps]) => `<use xlink:href="#none" x="${round(G.textX + x)}" y="${G.spinnerBase}">${onRow(prefix, inRewinds(steps))}</use>`).join('')}</g>`).join('');
    const textBand = (base) => [base - V.fontSize, base + 4];

    const verbRows = [], statusRows = [], tails = new Map();
    const place = `x="${G.textX}" y="${G.spinnerBase}"`;
    const text = (x, cells, attrs, body) => `<text${attrs && ` ${attrs}`}${x ? ` x="${round(x)}"` : ''}${cells ? ` textLength="${len(cells)}"` : ''}>${body}</text>`;
    const addVerb = (line, cells) => verbRows.push(line.freakout
        ? text(0, cells, `id="v${verbRows.length}" style="fill:${theme.error}"`, xml(line.text))
        : `<g id="v${verbRows.length}">${text(0, cells, 'class="v"', xml(`${line.text}…`))}<g clip-path="url(#s${cells})">${text(0, cells, 'class="sh"', xml(`${line.text}…`))}</g></g>`) - 1;
    const pieces = (x, parts) => parts.map(([t, bold]) => {
        const piece = text(x, cellsIn(t), bold ? 'class="b"' : '', xml(t));
        x += cellsIn(t) * V.cell;
        return piece;
    }).join('');
    const addStatus = (x, [head, ...tail]) => {
        let body = pieces(x, [head]);
        if (tail.length) {
            const key = JSON.stringify(tail);
            if (!tails.has(key)) tails.set(key, `<g id="t${tails.size}">${pieces(0, tail)}</g>`);
            body += `<use xlink:href="#t${[...tails.keys()].indexOf(key)}" x="${round(x + width([head]) * V.cell)}"/>`;
        }
        return statusRows.push(`<g id="r${statusRows.length}" class="d">${body}</g>`) - 1;
    };

    const head = [[0, V.width]], glide = [[0, 0]], oldShift = [[0, 0]];
    const verbSteps = [[0, EMPTY]], statusSteps = [[0, EMPTY]], oldRows = [[0, EMPTY]], oldStatus = [[0, EMPTY]];
    const lastStatusRow = [], lastStatus = [], freakouts = [], shimmerLengths = new Set();
    const cellsOf = (line) => cellsIn(line.text) + (line.freakout ? 0 : 1);
    const scrub = (t, line) => {
        verbSteps.push([t, line]);
        statusSteps.push([t, lastStatusRow[line] ?? EMPTY]);
    };
    let g = 0;
    for (const ep of eps) {
        const first = g;
        ep.playlist.forEach((line, i) => {
            const t0 = ep.work + i * D;
            const cells = cellsOf(line);
            const prev = i > 0 ? g - 1 : EMPTY;
            const was = i > 0 ? cellsOf(ep.playlist[i - 1]) : 0;
            const typing = Math.min(TYPE.max, Math.max(0.1, Math.round(Math.max(cells, was) * TYPE.perChar * 20) / 20));
            if (line.freakout) freakouts.push({ start: t0, typed: t0 + typing, end: t0 + D });
            else shimmerLengths.add(cells);

            oldRows.push([t0, prev]);
            let oldRow = lastStatusRow[prev] ?? EMPTY;
            const old = lastStatus[prev], room = statusRoom(line.text, G.cols);
            if (old && width(old.parts) > room) {
                const fit = STATUS_VARIANTS.find((v) => width(v(old.sample)) <= room);
                oldRow = fit ? addStatus((was + 1) * V.cell, fit(old.sample)) : EMPTY;
            }
            oldStatus.push([t0, oldRow]);
            head.push([t0, G.textX], [t0 + typing, V.width]);
            glide.push([t0, 0], [t0 + typing, len(cells)], [t0 + typing + 0.05, 0]);
            oldShift.push([t0, 0], [t0 + typing, len(cells - was)], [t0 + typing + 0.05, 0]);
            verbSteps.push([t0, addVerb(line, cells)]);
            statusSteps.push([t0, EMPTY]);
            lastStatusRow[g] = EMPTY;
            for (const st of statusFor(line.text, line.samples, G.cols)) {
                const start = Math.max(st.start * TICK, typing);
                if ((st.start + st.ticks) * TICK <= start) continue;
                lastStatus[g] = st;
                statusSteps.push([t0 + start, (lastStatusRow[g] = addStatus((cells + 1) * V.cell, st.parts))]);
            }
            g++;
        });
        scrub(ep.limit, EMPTY);
        for (let k = 0, K = STORY.scrubFrames, n = ep.playlist.length; k < K; k++) scrub(ep.rewind + STORY.scrub * Math.sqrt(k / K), first + Math.round((n - 1) * (1 - k / (K - 1))));
        scrub(ep.slide, EMPTY);
    }

    const headY = round(G.spinnerBase - V.caret + 4.5);
    const caretStop = round(V.cell / HEAD, 5);
    const inputX = G.textX + 2 * V.cell;
    const inputY = round((G.boxTop + G.boxBottom) / 2 - V.caret / 2);
    const typedCells = [[0, 0]];
    for (const e of eps) {
        const m = e.chars.length;
        typedCells.push(...e.typedAt.map((t, k) => [t, k + 1]), [e.sent, 0], [e.back, m]);
        for (let s = 1; s <= m; s++) typedCells.push([e.back + s * STORY.untype, m - s]);
    }
    const input = eps.map((e) => `<g clip-path="url(#input)" display="none">${during([e.start, e.sent], [e.back, e.end])}<text class="t" x="${round(inputX)}" y="${G.inputBase}" textLength="${len(e.chars.length)}">${xml(e.prompt)}</text></g>`);

    const user = eps.map((e, i) => {
        const fall = [[0, '0 0']];
        for (let t = e.slide; t < e.back; t += 1 / TYPE.fps) fall.push([t, `0 ${round((G.inputBase - G.userBase) * ((t - e.slide) / STORY.slide) ** 2)}`]);
        fall.push([e.back, '0 0']);
        return `<g display="none">${during([e.sent, e.back])}${animate('transform', fall)}${fringes(`u${i}`)}<g id="u${i}"><text class="d" x="${G.textX}" y="${G.userBase}">&gt;</text><text class="t" x="${round(G.textX + 2 * V.cell)}" y="${G.userBase}" textLength="${len(e.chars.length)}">${xml(e.prompt)}</text></g></g>`;
    });
    const resets = ` · resets ${Math.floor(rng.range(1, 13))}${rng.range(0, 1) < 0.5 ? 'am' : 'pm'} (UTC)`;
    const limitText = `You've hit your session limit${V.shortLimit ? '' : resets}`;
    const upgradeText = '/upgrade to increase your usage limit.';
    const hookX = G.textX + 2.5 * V.cell;
    const errorBase = round(G.userBase + V.row);

    const shake = [[0, '0 0']];
    for (const [a, b] of rewinds) {
        for (let t = a; t < b; t += 0.04) shake.push([t, `${Math.round(rng.range(-3, 3))} ${rng.range(0, 1) < 0.2 ? Math.round(rng.range(-1, 1)) : 0}`]);
        if (b < T) shake.push([b, '0 0']);
    }
    const bandH = 26;
    const half = (G.height + bandH) / 2;
    const roll = Array.from({ length: 9 }, (_, k) => `0 ${round((-k * half) / 9)}`).join(';');
    const badgeY = G.welcomeBase(1);
    const badgeRight = G.right - V.cell;
    const badgeLeft = badgeRight - 3 * V.cell - 22;
    const tri = (x) => `M${round(x)} ${round(badgeY - 4.5)}l7 -4.5v9Z`;
    const blink = [];
    for (const [a, b] of rewinds) for (let t = a; t < b; t += 0.45) blink.push([t, Math.min(t + 0.3, b)]);
    const spinning = eps.flatMap((e) => {
        const spans = [];
        let from = e.work;
        for (const f of freakouts.filter((f) => f.start >= e.work && f.start < e.limit)) {
            spans.push([from, f.start]);
            from = f.end;
        }
        if (from < e.limit) spans.push([from, e.limit]);
        return [...spans, [e.rewind, e.slide]];
    });
    const jolt = makeRng(`${version}/jolt`);
    const jitter = [[0, '0 0']];
    for (const f of freakouts) {
        for (let t = f.typed; t < f.typed + 0.9; t += 0.04) jitter.push([t, `${Math.round(jolt.range(-2, 2))} ${Math.round(jolt.range(-1, 1))}`]);
        jitter.push([f.typed + 0.9, '0 0']);
    }
    const whoosh = (at, sign) => [[at, -6 * sign], [at + 0.03, -14 * sign], [at + 0.06, -7 * sign], [at + 0.09, 0]];
    const flashes = [[0, 0], ...rewinds.flatMap(([a, b]) => [[a, 0.14], [a + 0.06, 0.07], [a + 0.12, 0], [b, 0.1], [b + 0.06, 0]])];

    const glyphAt = `translate(${round(G.left + GLYPH.radius)} ${round(G.spinnerBase - GLYPH.lift)}) scale(${GLYPH.radius})`;
    const shimmerDefs = [...shimmerLengths].sort((a, b) => a - b).map((cells) => {
        const idle = Math.round(((cells + SHIMMER.width - 1) * SHIMMER.idle) / (1 - SHIMMER.idle));
        const xs = [];
        for (let k = 1 - SHIMMER.width; k < cells; k++) xs.push(len(k));
        for (let k = 0; k < idle; k++) xs.push(len(cells));
        return `<clipPath id="s${cells}"><rect y="${round(headY - 6 - G.spinnerBase)}" width="${len(SHIMMER.width)}" height="${V.caret + 12}"><animate attributeName="x" calcMode="discrete" dur="${round(xs.length * SHIMMER.step, 3)}s" repeatCount="indefinite" values="${xs.join(';')}"/></rect></clipPath>`;
    });
    const clawd = renderClawd(V, G);
    const welcome = G.welcome.map(([cls, text], k) => {
        const line = text.replace('{version}', claudeVersion);
        return `<text class="${cls}" x="${G.welcomeX}" y="${G.welcomeBase(1 + k)}" textLength="${len([...line].length)}">${xml(line)}</text>`;
    });
    const label = `${HEADER.title} A Claude Code terminal. Prompts like "${eps.map((e) => e.prompt).join('", "')}" are sent; the spinner cycles through made-up verbs until the usage limit hits, then it all rewinds like a VHS tape and the next prompt is typed`;
    const vars = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');
    const tint = (color) => `${Object.keys(THEMES.dark).map((k) => `--${k}:${color}`).join(';')};--solo:none`;
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${V.width}" height="${G.height}" viewBox="0 0 ${V.width} ${G.height}" role="img">
<!-- Generated by generate.mjs for ${version}: ${eps.length} prompts, ${g} lines, ${round(T)} s loop. Edit PROMPTS in generate.mjs, not this file. -->
<title>${xml(label)}</title>
<style>
:root{${vars(THEMES.light)}}
@media (prefers-color-scheme:dark){:root{${vars(THEMES.dark)}}}
text{font-family:${FONT};font-size:${V.fontSize}px;white-space:pre;font-variant-ligatures:none;font-kerning:none}
.t{fill:${theme.text}}.d{fill:${theme.dim}}.b{font-weight:700}.v{fill:${theme.claude}}.sh{fill:${theme.shimmer}}
.g{fill:${theme.claude};visibility:hidden;animation:${round((GLYPH.frames.length * GLYPH.frameMs) / 1000)}s step-end infinite}
${GLYPH_SHAPES.map((_, g) => frameKeyframes(`g${g}`, GLYPH.frames, (f) => f === g)).join('\n')}
${clawd.css}
.cur{animation:blink ${CURSOR_BLINK}s step-end infinite}@keyframes blink{0%{visibility:visible}50%,100%{visibility:hidden}}
.red{${tint(WAVE.red)}}.cyan{${tint(WAVE.cyan)}}
</style>
<defs>
${shimmerDefs.join('\n')}
<rect id="head" x="${V.width}" y="${headY}" width="${HEAD}" height="${V.caret}">${animate('x', head)}${animate('x', [...glide, [T, 0]], { mode: 'linear', add: true })}</rect>
<clipPath id="line"><rect x="0" y="${headY}" width="${V.width}" height="${V.caret}"/></clipPath>
<clipPath id="row"><rect x="0" y="${headY - 6}" width="${round(G.right - V.cell / 2)}" height="${V.caret + 12}"/></clipPath>
<clipPath id="typed"><use xlink:href="#head" x="-${HEAD}"/></clipPath>
<clipPath id="old"><use xlink:href="#head" x="${V.cell}"/></clipPath>
<linearGradient id="caret"><stop offset="0" style="stop-color:${theme.claude}"/><stop offset="${caretStop}" style="stop-color:${theme.claude}"/><stop offset="${caretStop}" stop-opacity="0"/></linearGradient>
<linearGradient id="tracking" x2="0" y2="1"><stop offset="0" style="stop-color:${theme.text}" stop-opacity="0"/><stop offset="0.5" style="stop-color:${theme.text}" stop-opacity="0.22"/><stop offset="1" style="stop-color:${theme.text}" stop-opacity="0"/></linearGradient>
<clipPath id="screen"><rect x="0.5" y="0.5" width="${V.width - 1}" height="${G.height - 1}" rx="10"/></clipPath>
<pattern id="scan" width="8" height="3" patternUnits="userSpaceOnUse"><rect width="8" height="1" style="fill:${theme.text}" opacity="0.06"/></pattern>
${clawd.defs}
<clipPath id="input"><rect x="${round(inputX)}" y="${inputY}" height="${V.caret}" width="0">${animate('width', typedCells.map(([t, c]) => [t, len(c)]))}</rect></clipPath>
<g id="none"/>
<rect width="0" height="0"><set id="loop" attributeName="visibility" to="hidden" begin="0s;loop.end" dur="${round(T, 3)}s"/></rect>
${[...tails.values()].join('\n')}
${statusRows.join('\n')}
${verbRows.join('\n')}
</defs>
<rect x="0.5" y="0.5" width="${V.width - 1}" height="${G.height - 1}" rx="10" style="fill:${theme.bg};stroke:${theme.frame}"/>
<g clip-path="url(#screen)">
<g>${animate('transform', shake)}<g>${animate('transform', [[0, 0], ...rewinds.flatMap(([a, b]) => [...whoosh(a, 1), ...whoosh(b, -1)])], { type: 'skewX' })}
${line(G.left, G.welcomeBottom, 'Lbox', `<rect x="${G.left}" y="${G.left}" width="${G.welcomeRight - G.left}" height="${G.welcomeBottom - G.left}" rx="5" fill="none" style="stroke:${theme.claude}"/>`)}
${waved(G.clawdY, G.clawdY + 3 * V.row, clawd.svg)}
${welcome.map((w, k) => line(...textBand(G.welcomeBase(1 + k)), `Lw${k}`, w)).join('\n')}
${line(badgeY - 13, badgeY + 5, 'Lrew', `<g display="none" style="fill:${theme.text}">${during(...blink)}
${V.badgeBox ? `<rect x="${round(badgeLeft - 6)}" y="${round(badgeY - 13)}" width="${round(badgeRight - badgeLeft + 12)}" height="18" rx="3" style="fill:${theme.bg}"/>` : ''}<path d="${tri(badgeLeft)}${tri(badgeLeft + 8)}"/>
<text class="t b" x="${round(badgeRight - 3 * V.cell)}" y="${badgeY}" textLength="${len(3)}">REW</text>
</g>`)}
${waved(...textBand(G.userBase), user.join('\n'))}
<g display="none">${during(...eps.map((e) => [e.limit, e.rewind]))}
<path d="M${round(hookX)} ${round(errorBase - V.capHeight)}V${round(errorBase - 3)}H${round(hookX + V.cell)}" fill="none" style="stroke:${theme.dim}"/>
<text style="fill:${theme.error}" x="${round(G.textX + 5 * V.cell)}" y="${errorBase}" textLength="${len([...limitText].length)}">${xml(limitText)}</text>
<text class="d" x="${round(G.textX + 5 * V.cell)}" y="${G.spinnerBase}" textLength="${len(upgradeText.length)}">${xml(upgradeText)}</text>
</g>
${waved(...textBand(G.spinnerBase), `${rowFringes()}<g clip-path="url(#row)">${animate('transform', jitter)}
<g display="none">${during(...spinning)}
${GLYPH_SHAPES.map((d, g) => `<path class="g" style="animation-name:g${g}" transform="${glyphAt}" d="${d}"/>`).join('\n')}
</g>
<path display="none" transform="${glyphAt}" d="${GLYPH_SHAPES[4]}" style="fill:${theme.error}">${during(...freakouts.map((f) => [f.start, f.end]))}</path>
<g clip-path="url(#typed)"><use xlink:href="#none" ${place}>${onRow('v', verbSteps)}</use></g>
<g clip-path="url(#old)"><g>${animate('transform', [...oldShift, [T, 0]], { mode: 'linear' })}<use xlink:href="#none" ${place}>${onRow('v', oldRows)}</use><use xlink:href="#none" ${place}>${onRow('r', oldStatus)}</use></g></g>
<g clip-path="url(#line)"><use xlink:href="#none" ${place}>${onRow('r', statusSteps)}</use></g>
<use xlink:href="#head" fill="url(#caret)"/>
</g>`)}
${line(G.boxTop, G.boxBottom, 'Lbox2', `<rect x="${G.left}" y="${G.boxTop}" width="${G.right - G.left}" height="${G.boxBottom - G.boxTop}" rx="5" fill="none" style="stroke:${theme.border}"/>`)}
${line(inputY, inputY + V.caret, 'Lin', `<text x="${G.textX}" y="${G.inputBase}" class="d">&gt;</text>
${input.join('\n')}
<rect class="cur" x="${round(inputX)}" y="${inputY}" width="${V.cell}" height="${V.caret}" style="fill:${theme.cursor};display:var(--solo,inline)">${animate('x', typedCells.map(([t, c]) => [t, round(inputX + c * V.cell)]))}</rect>`)}
${line(...textBand(G.hintBase), 'Lhint', `<text x="${G.textX}" y="${G.hintBase}" textLength="${len(15)}" class="d">? for shortcuts</text>`)}
</g></g>
<g display="none">${during(...rewinds)}
<rect width="${V.width}" height="${G.height}" fill="url(#scan)"/>
<g><animateTransform attributeName="transform" type="translate" calcMode="discrete" dur="0.3s" repeatCount="indefinite" values="${roll}"/>
${[G.height, G.height - half].map((y) => `<rect y="${round(y)}" width="${V.width}" height="${bandH}" fill="url(#tracking)"/>`).join('')}
</g></g>
<rect width="${V.width}" height="${G.height}" style="fill:${theme.text}" opacity="0" display="none">${during(...rewinds.flatMap(([a, b]) => [[a, a + 0.12], [b, b + 0.06]]))}${animate('opacity', flashes)}</rect>
</g>
</svg>
`;
}

function renderClawd(V, G) {
    const { cell, row, fontSize } = V;
    const QUADS = { '▘': 8, '▝': 4, '▖': 2, '▗': 1, '▀': 12, '▄': 3, '▌': 10, '▐': 5, '▛': 14, '▜': 13, '▙': 11, '▟': 7, '█': 15 };
    const [px, py] = [cell / 2, row / 2];
    const rects = (grid, dx, dy) =>
        grid.map((cols, y) => {
            let d = '';
            for (let x = 0, end; x < cols.length; x = end + 1) {
                for (end = x; cols[end] && cols[end + 1]; end++);
                if (cols[x]) d += `M${round(G.textX + dx + x * px)} ${round(G.clawdY + dy + y * py)}h${round((end - x + 1) * px)}v${py}h${round(-(end - x + 1) * px)}Z`;
            }
            return d;
        }).join('');
    const frameKey = (frame) => frame.join('/');
    const keys = [...new Set([...CLAWD.entrance, ...CLAWD.loop].map(frameKey))];
    const groups = keys.map((key, k) => {
        const [pose, crouch, puff, shift] = key.split('/');
        if (+shift <= -CLAWD.cols) return `<g class="c${k}"/>`;
        const [body, eyes] = [[], []];
        CLAWD.poses[pose].forEach((line, l) => [...line].forEach((ch, c) => {
            for (let b = 0; b < 4; b++) {
                const [y, x, on] = [2 * l + (b >> 1), 2 * c + (b & 1), ((QUADS[ch] ?? 0) >> (3 - b)) & 1];
                (body[y] ??= [])[x] = !!on;
                (eyes[y] ??= [])[x] = !on && l === CLAWD.eyes.line && c >= CLAWD.eyes.from && c < CLAWD.eyes.to;
            }
        }));
        const [dx, dy] = [+shift * cell, +crouch * row];
        const puffs = puff ? [0, CLAWD.cols - 1].map((c) => `<text class="d" x="${round(G.textX + c * cell)}" y="${round(G.clawdY + 2.5 * row + fontSize * 0.35)}">${CLAWD.puffs[puff]}</text>`).join('') : '';
        return `<g class="c${k}"><path fill="#D77757" d="${rects(body, dx, dy)}"/><path fill="#000000" d="${rects(eyes, dx, dy)}"/>${puffs}</g>`;
    });
    const seconds = (frames) => round((frames.length * CLAWD.frameMs) / 1000);
    const [inFor, loopFor] = [seconds(CLAWD.entrance), seconds(CLAWD.loop)];
    const timeline = (name, frames, key) => (frames.some((f) => frameKey(f) === key) ? frameKeyframes(name, frames, (f) => frameKey(f) === key) : null);
    const css = keys.map((key, k) => {
        const [entrance, loop] = [timeline(`e${k}`, CLAWD.entrance, key), timeline(`l${k}`, CLAWD.loop, key)];
        const uses = [entrance && `e${k} ${inFor}s step-end both`, loop && `l${k} ${loopFor}s step-end ${inFor}s infinite`].filter(Boolean);
        return `.c${k}{visibility:hidden;animation:${uses.join(',')}}${entrance ?? ''}${loop ?? ''}`;
    });
    return {
        css: css.join('\n'),
        defs: `<clipPath id="clawd"><rect x="${G.textX}" y="${G.clawdY}" width="${round(CLAWD.cols * cell)}" height="${3 * row}"/></clipPath>`,
        svg: `<g clip-path="url(#clawd)">\n${groups.join('\n')}\n</g>`,
    };
}

function frameKeyframes(name, frames, on) {
    const stops = frames.map((frame, f) => (f === 0 || on(frame) !== on(frames[f - 1]) ? `${round((f / frames.length) * 100, 4)}%{visibility:${on(frame) ? 'visible' : 'hidden'}}` : ''));
    return `@keyframes ${name}{${stops.join('')}100%{visibility:hidden}}`;
}

function dot(r) {
    return `M${-r} 0A${r} ${r} 0 1 0 ${r} 0A${r} ${r} 0 1 0 ${-r} 0Z`;
}

function petals(count, w) {
    const c = 1 - w;
    return spin(count, (p) => `M0 0C${p(-w * 0.3, -c * 0.3)} ${p(-w, -c * 0.6)} ${p(-w, -c)}A${w} ${w} 0 0 1 ${p(w, -c)}C${p(w, -c * 0.6)} ${p(w * 0.3, -c * 0.3)} 0 0Z`);
}

function spokes(count, h) {
    return spin(count, (p) => `M${p(-h, 0)}L${p(-h, -(1 - h))}A${h} ${h} 0 0 1 ${p(h, -(1 - h))}L${p(h, 0)}Z`);
}

function star(points, inner) {
    const corner = (k, r = k % 2 ? inner : 1) => `${num(r * Math.sin((Math.PI * k) / points))} ${num(-r * Math.cos((Math.PI * k) / points))}`;
    return `M${Array.from({ length: points * 2 }, (_, k) => corner(k)).join('L')}Z`;
}

function spin(count, draw) {
    return Array.from({ length: count }, (_, k) => {
        const [cos, sin] = [Math.cos((2 * Math.PI * k) / count), Math.sin((2 * Math.PI * k) / count)];
        return draw((x, y) => `${num(x * cos - y * sin)} ${num(x * sin + y * cos)}`);
    }).join('');
}

function num(n) {
    return String(round(n, 3) || 0);
}

function round(n, digits = 2) {
    return Math.round(n * 10 ** digits) / 10 ** digits;
}

function xml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function makeRng(seed) {
    let [h1, h2] = [0xdeadbeef, 0x41c6ce57];
    for (let i = 0; i < seed.length; i++) [h1, h2] = [Math.imul(h1 ^ seed.charCodeAt(i), 2654435761), Math.imul(h2 ^ seed.charCodeAt(i), 1597334677)];
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    let a = (h1 ^ h2) >>> 0;
    const next = () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const shuffle = (list) => {
        const out = list.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(next() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };
    return { range: (lo, hi) => lo + next() * (hi - lo), shuffle };
}

function fail(message) {
    console.error(`error: ${message}`);
    process.exit(1);
}

await main();
