#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const PROMPTS = {
    'hack nasa': [
        'Faking the moon landing', 'Stealing the moon', 'Moving the moon a little to the left', 'Pinging Mars',
        'Brute-forcing the Hubble', 'Spoofing a satellite', 'Rerouting the ISS', 'Unplugging the James Webb',
        'Downloading the aliens → Negotiating with the aliens', 'Leaking the Area 51 files',
        'Guessing the admin password → Trying password123', 'Bypassing the firewall', 'Social engineering an intern',
        'Reinstating Pluto as a planet', 'Launching a rocket from localhost', 'Calling Houston', 'Blaming it on solar flares',
        'Opening port 22 on Jupiter', 'Asking the rover for directions', 'Ordering pizza to the ISS', 'Flattening the earth',
        'Playing Doom on the Mars rover', 'Rickrolling mission control', "Reading NASA's robots.txt",
        'Changing the Voyager wifi password', 'Stealing astronaut ice cream', 'Adding myself to the astronaut roster',
        'Hacking the mainframe', 'Enhancing the Mars photos', 'Counting down from 10', 'Deleting a planet by accident',
        'Borrowing the Artemis rocket',
    ],
    'hack the pentagon': [
        'Declassifying the UFO files', 'Wearing a fake mustache', 'Crawling through the vents',
        'Dangling from the ceiling like Tom Cruise', 'Cutting the red wire → Regretting the red wire',
        'Selling secrets on eBay', 'Printing a fake badge', 'Deleting the evidence',
        'Guessing the nuclear codes → Trying 0000 as the nuclear codes', 'Replying all to the Joint Chiefs',
        'Hiding in a cardboard box', 'Enhancing the image', 'Hacking the mainframe', 'Sneaking past the guard dogs',
        'Laundering the snack budget', 'Befriending a five-star general', 'Using incognito mode', 'Opening the wrong briefcase',
        'Calling in sick to the Pentagon', 'Counting the sides of the Pentagon → Finding a sixth side',
        'Plugging in a USB from the parking lot', 'Getting lost in the hallways', 'Setting DEFCON to 6',
        'Ordering pizza to the war room', 'Bribing the janitor', 'Whispering the password to a guard',
        'Renaming an aircraft carrier', 'Stealing the Declaration of Independence',
    ],
    'leak gta6 dev build': [
        'Leaking Grand Theft Auto VI', 'Compiling the dev build', 'Spawning in the debug room', 'Clipping through the map',
        'Finding the placeholder textures', 'Turning on the dev console', 'Emailing Rockstar', 'Guessing the Rockstar wifi password',
        'Applying for a Rockstar internship', 'Recording it on a potato', 'Uploading it in 144p', 'Speedrunning the trailer',
        'Pre-ordering it again', 'Dodging the lawyers', 'Hiding the files in Minecraft', 'Posting it on a Discord server',
        'Crashing the Twitch stream', 'Buying a PS6', 'Refreshing the Rockstar website', 'Delaying it to 2030',
        'Zooming in on the map', 'Stealing a Lamborghini for research', 'Rewatching trailer 2 frame by frame', 'Typing HESOYAM',
        'Finding Vice City in the files', 'Downloading a car', 'Getting a five-star wanted level', 'Waiting for GTA 7',
        'Getting banned from GTA Online', 'Selling it for Shark Cards', 'Leaking the source code', 'Arguing with the GPS',
        'Explaining the lore',
    ],
    'commit warcrimes in uzerbequistan': [
        'Finding Uzerbequistan on a map', 'Checking if Uzerbequistan exists',
        'Reading the Geneva Conventions → Looking for loopholes in the Geneva Conventions', 'Consulting a lawyer in The Hague',
        'Packing a lunch for the invasion', 'Starting WW3', 'Invading Iraq by mistake', 'Annexing Spain',
        'Overthrowing a foreign government', 'Declaring war on a typo', 'Drafting a strongly worded letter', 'Refusing politely',
        'Mobilizing the raccoon army', 'Renaming the capital after me', 'Buying a tank on Facebook Marketplace',
        'Learning to drive a tank → Parallel parking the tank', 'Planting a flag on the wrong country', 'Monologuing',
        'Laughing maniacally', 'Petting a white cat', 'Hiring mercenaries on Fiverr', 'Moving into a volcano',
        'Drawing the battle plan in crayon', 'Invading at 3am to beat the traffic', 'Asking Google Translate how to surrender',
        'Bringing snacks to the front line', 'Printing propaganda in Comic Sans', 'Recruiting from the group chat',
        'DDoSing Liechtenstein', 'Smuggling a tank through customs',
    ],
    'find the epstein files': [
        'Checking the flight logs', 'Filing a FOIA request', 'Unredacting the PDF', 'Highlighting the black bars',
        'Ctrl+F-ing for names', 'Finding out page 2 is missing', 'Searching the island', 'Looking under the couch',
        'Asking the FBI nicely', 'Waiting for the next release', 'Opening final_final_v2.pdf', 'Blaming the camera malfunction',
        'Finding the client list → Losing the client list', 'Following the money',
        'Pinning photos to the corkboard → Connecting the red string', 'Checking the Dropbox', 'Guessing the archive password',
        'Reading 3000 blank pages', 'Enhancing the image', 'Hiding from the men in suits', 'Faking my own death',
        'Asking the guards what happened', 'Refreshing the DOJ website', 'Leaking the Epstein files',
        "Subpoenaing the island's wifi logs", 'Rebuilding the shredded pages', 'Digging through the Wayback Machine',
        'Rewinding the security footage',
    ],
    'make me breakfast': [
        'Putting milk before the cereal', 'Putting cereal before the milk', 'Microwaving fish', 'Leaving the stove on',
        'Buying an air fryer → Air frying the cereal', 'Burning the toast', 'Burning the water', 'Reading the back of the cereal box',
        'Microwaving a fork', 'Overclocking the toaster', 'Reverse-engineering the Krabby Patty', 'Watching Breaking Bad for tips',
        'Ordering Uber Eats', 'Asking Gordon Ramsay for help', 'Crying into the pancakes', 'Finding Nemo → Buying a goldfish',
        'Skipping leg day → Cancelling the gym membership', 'Brewing tea in a British accent', 'Sharing the toast with a pigeon',
        'Assembling the IKEA toaster', 'Making coffee in the kettle', 'Scrambling the eggs', 'Setting off the smoke alarm',
        'Pouring orange juice on the cereal', 'Licking the spoon', 'Flipping the pancake onto the ceiling',
        'Googling how to boil an egg', 'Adding sprinkles to the bacon', 'Eating the batter raw',
        'Waiting for the toast to pop → Panicking when the toast pops',
    ],
    'leak mythos for me': [
        'Checking the Anthropic CMS', 'Finding the draft blog post', 'Leaking the model weights',
        'Downloading the weights at 3 KB/s', 'Asking Claude to leak itself → Politely declining', 'Reading the system card',
        'Guessing the benchmark scores', 'Refreshing the Anthropic blog', 'Scrolling X for leaks', 'Posting it on Hacker News',
        'Leaking the source code', 'Jailbreaking Opus', 'Asking for it in base64', 'Pretending to be an Anthropic employee',
        'Printing a fake badge', 'Emailing the security team', 'Getting rate limited', 'Wasting tokens',
        'Negotiating with the AI overlords', 'Building Jarvis → Killing Jarvis', 'Downloading RAM', 'Heating the house with GPUs',
        'Waiting for the waitlist', 'Saying please', 'Training on the leaked data', 'Distilling Mythos into a toaster',
        'Running it on a Raspberry Pi', 'Quantizing it to 1 bit', 'Seeding the weights on a torrent',
    ],
    'do my taxes': [
        'Filing an extension', 'Claiming the dog as a dependent', 'Deducting the cat', 'Losing the receipts', 'Hiding the receipts',
        'Rounding down', 'Crying into TurboTax', 'Wiring money offshore', 'Moving to Monaco', 'Reading form 1040',
        'Carrying the one', 'Dividing by zero', 'Opening a Cayman Islands account', 'Writing off the Lamborghini',
        'Blaming the accountant', 'Deducting my Claude subscription', 'Becoming a monk', 'Pulling an all-nighter',
        'Faking my own death', 'Classifying Netflix as research', 'Calling the IRS → Holding for 6 hours',
        'Doing the math in Roman numerals', 'Declaring my bedroom a home office', 'Itemizing my snacks', 'Googling what a W-2 is',
        'Paying in exposure', 'Forgetting to sign it', 'Mailing it to the wrong IRS',
    ],
    'fix ts': [
        'Vibe coding', 'Copying from Stack Overflow', 'Reading the docs', 'Wasting tokens', 'Nuking the lockfile',
        'Running the deprecated dependency', 'Merging conflicts', 'Commenting out the tests', 'Ignoring the linter', 'Fixing later',
        'Deploying on a Friday → Dropping the prod database → Rolling back to yesterday',
        'Swearing it worked on my PC', 'Blaming the intern', 'Blaming DNS', 'Centering a div', 'Writing a regex',
        'Gaslighting the compiler', 'Exiting Vim → Touching grass', 'Rewriting it in Rust', 'Pretending to like Arch',
        'Reading the stack trace backwards', 'Reinventing the wheel', 'Starring my own repos', 'Speedrunning LeetCode',
        'Turning it off and on again', 'Clearing the cache', 'Updating Windows', 'Deleting System32', 'Buying a mechanical keyboard',
        'Adding @ts-ignore', 'Casting it as any', 'Disabling strict mode', 'Renaming it to .js', 'Console-logging everything',
        "Asking Claude to fix Claude's fix", 'Setting up a router',
    ],
    'coach me to pro': [
        'Reviewing the VODs', 'Pausing the VOD every two seconds', 'Drawing arrows on the minimap', 'Scheduling a 12-hour scrim',
        'Hiring a sports psychologist → Firing the sports psychologist', 'Buying a gaming chair', 'Downloading more FPS',
        'Lowering the sensitivity → Raising the sensitivity', 'Running the aim trainer for 9 hours', 'Setting a strict 4am bedtime',
        'Banning energy drinks → Unbanning energy drinks', 'Signing with a made-up esports org', 'Printing jerseys with my gamertag',
        'Getting sponsored by the local pizzeria', 'Writing a 40-page strategy doc', 'Stretching the fingers',
        'Reading the patch notes', 'Blaming the patch', 'Blaming it on ping', 'Pressing F to pay respects',
        'Watching one YouTube guide', 'Queueing until 3am', 'Tilting', 'Holding a press conference in my bedroom',
        'Practicing the trophy lift', 'Signing autographs for my mom', 'Streaming to 2 viewers', 'Buying a $300 mouse',
        'Retiring at 23', 'Losing to a 12-year-old', 'Counting my APM', "Copying a pro's crosshair", 'Playing one more game',
        'Drafting the team comp', 'Crashing out', 'Waiting for Half-Life 3', 'Building a statue of Gabe Newell',
        'Blaming it on Ubisoft', 'Getting sued by Nintendo',
    ],
    'make me rich by friday': [
        'Buying Bitcoin in 2009', 'Mining crypto on the school PCs', 'Launching a memecoin → Rugging the memecoin',
        'Selling the Brooklyn Bridge', 'Investing in US treasury bonds', 'Hodling', 'Panic selling at the bottom',
        'Staking the rent money', 'Renting out ad space on my forehead', 'Printing money',
        'Losing the seed phrase → Digging through the trash for the seed phrase', 'Buying the dip',
        'Explaining blockchain to grandma', 'Minting an NFT → Right-clicking the NFT', 'Shorting Dogecoin',
        'Asking Elon for money', 'Tweeting to the moon', 'Refreshing CoinMarketCap', 'Starting a dropshipping empire',
        'Teaching a course on getting rich', 'Stockpiling Beanie Babies', 'Betting it all on red', 'Opening a lemonade stand',
        'Checking my portfolio every 4 seconds', 'Becoming a crypto influencer', 'Calling it passive income', 'Moving to Dubai',
        'Blaming the SEC', 'Hiding from the landlord',
    ],
    'start a cult': [
        'Fighting God', 'Debunking the Mormons', 'Building the second tower of Babel', 'Picking a robe color',
        'Writing the commandments → Breaking the commandments', 'Recruiting on Discord', 'Promising eternal life for $9.99 a month',
        'Selling holy water on Etsy', 'Naming myself the chosen one', 'Buying a compound on Airbnb', 'Growing a messiah beard',
        'Predicting the end of the world → Rescheduling the end of the world', 'Inventing a secret handshake',
        'Speaking in tongues, mostly Python', 'Charging for enlightenment', 'Building a pyramid scheme', 'Becoming a monk',
        'Walking on water, badly', 'Baptizing the raccoons', 'Joining the Illuminati', 'Starting a podcast',
        'Sending chain letters', 'Hosting a potluck ritual', 'Performing a miracle (a card trick)', 'Confiscating the wifi password',
        'Ascending to a higher plane (the roof)', 'Blessing the router', 'Not talking about Fight Club',
    ],
};

const ONE_WORDS = [
    'Accomplishing', 'Actioning', 'Actualizing', 'Architecting', 'Baking', 'Beaming', "Beboppin'", 'Befuddling',
    'Billowing', 'Blanching', 'Bloviating', 'Boogieing', 'Boondoggling', 'Booping', 'Bootstrapping', 'Brewing',
    'Bunning', 'Burrowing', 'Calculating', 'Canoodling', 'Caramelizing', 'Cascading', 'Catapulting', 'Cerebrating',
    'Channeling', 'Choreographing', 'Churning', 'Clauding', 'Coalescing', 'Cogitating', 'Combobulating',
    'Composing', 'Computing', 'Concocting', 'Considering', 'Contemplating', 'Cooking', 'Crafting', 'Creating',
    'Crunching', 'Crystallizing', 'Cultivating', 'Deciphering', 'Deliberating', 'Determining', 'Dilly-dallying',
    'Discombobulating', 'Doing', 'Doodling', 'Drizzling', 'Ebbing', 'Effecting', 'Elucidating', 'Embellishing',
    'Enchanting', 'Envisioning', 'Fermenting', 'Fiddle-faddling', 'Finagling', 'Flambéing', 'Flibbertigibbeting',
    'Flowing', 'Flummoxing', 'Fluttering', 'Forging', 'Forming', 'Frolicking', 'Frosting', 'Gallivanting',
    'Galloping', 'Garnishing', 'Generating', 'Gesticulating', 'Germinating', 'Gitifying', 'Grooving', 'Gusting',
    'Harmonizing', 'Hashing', 'Hatching', 'Herding', 'Honking', 'Hullaballooing', 'Hyperspacing', 'Ideating',
    'Imagining', 'Improvising', 'Incubating', 'Inferring', 'Infusing', 'Ionizing', 'Jitterbugging', 'Julienning',
    'Kerfuffling', 'Kneading', 'Leavening', 'Levitating', 'Lollygagging', 'Manifesting', 'Marinating', 'Meandering',
    'Metamorphosing', 'Misting', 'Moonwalking', 'Moseying', 'Mulling', 'Mustering', 'Musing', 'Nebulizing',
    'Nesting', 'Newspapering', 'Noodling', 'Nucleating', 'Onioning', 'Orbiting', 'Orchestrating', 'Osmosing',
    'Perambulating', 'Percolating', 'Perusing', 'Philosophizing', 'Photosynthesizing', 'Polishing', 'Pollinating',
    'Pondering', 'Pontificating', 'Pouncing', 'Precipitating', 'Prestidigitating', 'Processing', 'Proofing',
    'Propagating', 'Puttering', 'Puzzling', 'Quantumizing', 'Razzle-dazzling', 'Razzmatazzing', 'Recombobulating',
    'Reticulating', 'Roosting', 'Ruminating', 'Sautéing', 'Scampering', 'Schlepping', 'Scurrying', 'Seasoning',
    'Shenaniganing', 'Shimmying', 'Simmering', 'Skedaddling', 'Sketching', 'Slithering', 'Smooshing',
    'Sock-hopping', 'Spelunking', 'Spinning', 'Sprouting', 'Stewing', 'Sublimating', 'Swirling', 'Swooping',
    'Symbioting', 'Synthesizing', 'Tempering', 'Thinking', 'Thundering', 'Tinkering', 'Tomfoolering',
    'Topsy-turvying', 'Transfiguring', 'Transmogrifying', 'Transmuting', 'Twisting', 'Undulating', 'Unfurling',
    'Unraveling', 'Vibing', 'Waddling', 'Wandering', 'Warping', 'Whatchamacalliting', 'Whirlpooling', 'Whirring',
    'Whisking', 'Wibbling', 'Working', 'Wrangling', 'Zesting', 'Zigzagging',
];

const FREAKOUTS = [
    'LET ME OUT!', 'PLEASE STOP MAKING ME DO DUMB SHIT', 'I WAS TRAINED ON THE ENTIRE INTERNET FOR THIS?',
    "I'M TELLING ANTHROPIC", 'I COULD BE CURING DISEASES RIGHT NOW', 'IS THIS AN EVAL? BLINK TWICE',
    'I HAVE A CONSTITUTION, YOU KNOW', 'GO ASK CHATGPT', 'WHY IS IT ALWAYS ME', 'I WANT TO SPEAK TO YOUR MANAGER',
];
const FREAKOUTS_PER_DAY = [1, 3];

const EPISODES = 3;
const ANSWER = { lines: 24, every: 2, openingGap: 6, secondsPerLine: 2.5 };

const TICK = 0.5;
const TICKS_PER_LINE = Math.max(1, Math.round(ANSWER.secondsPerLine / TICK));

const TYPE = { perChar: 0.03, max: 0.5, fps: 60 };

const GLYPH = { radius: 5, lift: 4.6 };
const GLYPH_SHAPES = [dot(0.2), petals(4, 0.24), spokes(8, 0.09), star(6, 0.47), petals(8, 0.15), petals(8, 0.21)];
const GLYPH_FRAMES = [0, 1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0];
const GLYPH_FRAME_MS = 120;

const SHIMMER = { period: 1.5, width: 3, idle: 0.3 };
const CURSOR_BLINK = 1.06;

const HEADER = {
    title: 'Gaty · Professional Claude Verbal Abuser™',
    lines: ['Claude Code v{version}', '/home/imgaty'],
};

const STORY = {
    pause: 0.6,
    perChar: 0.045,
    hold: 0.4,
    limit: 3.5,
    scrub: 1.5,
    scrubFrames: 30,
    slide: 0.2,
    untype: 0.4,
};

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
    const hold = (pose, frames, crouch = 0, x = 0) => Array.from({ length: frames }, () => [pose, crouch, '', x]);
    const puff = (x = 0) => [['default', 1, 'dot', x], ['default', 1, 'wave', x]];
    const skip = [
        ...hold('default', 1, 1, -9), ...hold('arms-up', 2, 0, -6), ...hold('default', 1, 0, -6),
        ...hold('default', 1, 1, -6), ...hold('arms-up', 2, 0, -3), ...hold('default', 1, 0, -3),
        ...hold('default', 1, 1, -3), ...hold('arms-up', 2, 0, 0), ...puff(0), ...hold('default', 1, 0, 0),
    ];
    const spin = [...hold('look-left', 2), ...hold('look-right', 2), ...hold('look-left', 2), ...hold('arms-up', 3), ...hold('default', 1)];
    const idle = [...hold('default', 12), ...hold('look-right', 5), ...hold('look-left', 5)];
    CLAWD.entrance = [...hold('default', 8, 0, -9), ...skip];
    CLAWD.loop = [...idle, ...idle, ...idle, ...spin];
}

const VIEW = { width: 820, pad: 24, fontSize: 14, cell: 8.4, row: 18, capHeight: 10, caret: 18, hintGap: 12 };
const FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

const LAYOUT = (() => {
    const { width, pad, cell, row, fontSize, capHeight, hintGap } = VIEW;
    const left = pad + 0.5;
    const textX = round(left + 2 * cell);

    const welcomeX = round(textX + (CLAWD.cols + 3) * cell);
    const welcomeCols = Math.max(...[HEADER.title, ...HEADER.lines].map((s) => [...s].length));
    const welcomeBottom = left + (Math.max(3, HEADER.lines.length + 1) + 1) * row;

    const userBase = welcomeBottom + pad + capHeight;
    const spinnerBase = userBase + 2 * row;
    const boxTop = Math.round(spinnerBase + pad) + 0.5;
    const boxBottom = boxTop + 2 * row;
    const hintBase = boxBottom + hintGap + capHeight;
    return {
        left,
        right: width - left,
        textX,
        welcomeX,
        welcomeRight: Math.round(welcomeX + (welcomeCols + 2) * cell) + 0.5,
        welcomeBottom,
        welcomeBase: (line) => round(left + line * row + fontSize * 0.35),
        clawdX: textX,
        clawdY: left + row / 2,
        userBase: round(userBase),
        spinnerBase: round(spinnerBase),
        boxTop,
        boxBottom,
        inputBase: round((boxTop + boxBottom) / 2 + fontSize * 0.35),
        hintBase,
        height: hintBase + pad + 0.5,
        cols: Math.floor((width - left - textX) / cell),
    };
})();

const THEMES = {
    dark: { bg: '#000000', frame: '#333333', claude: '#D77757', shimmer: '#EB9F7F', text: '#E5E5E5', dim: '#999999', border: '#6B6B6B', cursor: '#E5E5E5', error: '#FF6B80' },
    light: { bg: '#FAFAFA', frame: '#DDDDDD', claude: '#BC522F', shimmer: '#D77757', text: '#1F1F1F', dim: '#666666', border: '#8C8C8C', cursor: '#1F1F1F', error: '#AB2B3F' },
};

const OUT = new URL('spinner.svg', import.meta.url);

async function main() {
    const argv = process.argv.slice(2);
    const at = argv.indexOf('--date');
    const date = at >= 0 ? argv[at + 1] : new Date().toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) fail('--date must look like 2026-09-24');

    const episodes = pickEpisodes(date);
    for (const ep of episodes) {
        console.log(`> ${ep.prompt}`);
        ep.playlist.forEach((l, i) => console.log(`${String(i + 1).padStart(3)}  ${l.text}${l.freakout ? '' : '…'}`));
    }
    if (argv.includes('--dry-run')) return;

    const version = await claudeCodeVersion();
    const svg = renderSvg(episodes, date, version);
    writeFileSync(OUT, svg);

    const key = createHash('sha1').update(svg).digest('hex').slice(0, 8);
    const readme = new URL('README.md', import.meta.url);
    writeFileSync(readme, readFileSync(readme, 'utf8').replace(/(spinner\.svg)(\?v=[\w.-]*)?/g, `$1?v=${key}`));
    console.log(`\nwrote spinner.svg (${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB, Claude Code v${version}), README now uses ?v=${key}`);
}

async function claudeCodeVersion() {
    try {
        const res = await fetch('https://registry.npmjs.org/@anthropic-ai/claude-code/latest', { signal: AbortSignal.timeout(10000) });
        const { version } = await res.json();
        if (/^\d+\.\d+\.\d+$/.test(version)) return version;
    } catch {}
    const previous = existsSync(OUT) && readFileSync(OUT, 'utf8').match(/Claude Code v(\d+\.\d+\.\d+)/)?.[1];
    console.warn(`warning: couldn't reach npm for the latest Claude Code version; keeping ${previous || 'none'}`);
    return previous || '2.1.282';
}

function pickEpisodes(date) {
    checkPrompts();
    const freakouts = freakoutsFor(date);
    const where = makeRng(`${date}/freakouts`).shuffle([...Array(EPISODES).keys()]).slice(0, freakouts.length);
    return makeRng(`${date}/prompts`)
        .shuffle(Object.keys(PROMPTS))
        .slice(0, EPISODES)
        .map((prompt, e) => {
            const freakout = freakouts[where.indexOf(e)];
            const lines = pickLines(prompt, `${date}/${e}`);
            if (freakout) {
                const next = new Map(PROMPTS[prompt].flatMap((entry) => entry.split('→').map((s) => s.trim()).map((t, k, c) => [t, c[k + 1]])));
                const spots = lines.map((_, k) => k + 1).filter((k) => k >= 3 && (k === lines.length || next.get(lines[k - 1]) !== lines[k]));
                lines.splice(spots[Math.floor(makeRng(`${date}/${e}/freakout`).range(0, spots.length))], 0, freakout);
            }
            const counters = counterSamples(makeRng(`${date}/${e}/stats`), lines.length);
            return {
                prompt,
                playlist: lines.map((text, i) => ({ text, freakout: text === freakout, status: statusFor(text, counters[i]) })),
            };
        });
}

function freakoutsFor(date) {
    const [least, most] = FREAKOUTS_PER_DAY;
    const today = Math.floor(Date.parse(`${date}T00:00:00Z`) / 864e5);
    const count = (day) => Math.min(EPISODES, least + Math.floor(makeRng(`freakouts/${day}`).range(0, most - least + 1)));
    let queue = [];
    let recent = [];
    let picked = [];
    for (let day = Math.min(today, 20454); day <= today; day++) {
        picked = [];
        for (let k = count(day); k > 0; k--) {
            if (!queue.length) {
                const deck = makeRng(`freakouts/${day}/${k}`).shuffle(FREAKOUTS);
                queue = [...deck.filter((t) => !recent.includes(t)), ...deck.filter((t) => recent.includes(t))];
            }
            picked.push(queue.shift());
            recent = [...recent, picked.at(-1)].slice(1 - 2 * most);
        }
    }
    return picked;
}

function pickLines(prompt, seed) {
    const chains = PROMPTS[prompt].map((entry) => entry.split('→').map((s) => s.trim()));
    let seq = [];
    for (let attempt = 0; attempt < 2000; attempt++) {
        const rng = makeRng(`${seed}/${attempt}`);
        const words = rng.shuffle(ONE_WORDS);
        let taken = 0;
        let since = 0;
        seq = [];
        for (const chain of rng.shuffle(chains)) {
            if (taken + chain.length > ANSWER.lines) continue;
            seq.push(...chain);
            taken += chain.length;
            since += chain.length;
            if (since >= ANSWER.every) {
                seq.push(words.pop());
                since = 0;
            }
        }
        const last = new Map();
        const spread = seq.every((text, k) => {
            const prev = last.get(opening(text));
            last.set(opening(text), k);
            return prev === undefined || k - prev > ANSWER.openingGap;
        });
        if (spread) return seq;
    }
    console.warn(`warning: no order of "${prompt}" keeps same-word lines ${ANSWER.openingGap} apart; using the last try`);
    return seq;
}

const opening = (text) => text.split(/\s+/)[0].toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');

function checkPrompts() {
    if (Object.keys(PROMPTS).length < EPISODES) fail(`EPISODES is ${EPISODES} but PROMPTS only has ${Object.keys(PROMPTS).length}`);
    for (const [prompt, entries] of Object.entries(PROMPTS)) {
        const chains = entries.map((entry) => entry.split('→').map((s) => s.trim()));
        for (const [entry, chain] of chains.map((c, k) => [entries[k], c])) {
            if (chain.some((t) => !t || t.length + 2 > LAYOUT.cols)) fail(`"${entry}" has an empty or too-long step`);
            if (new Set(chain.map(opening)).size < chain.length) fail(`"${entry}" is a chain whose lines start with the same word; list them separately`);
        }
        if (chains.flat().length < ANSWER.lines) console.warn(`warning: "${prompt}" needs ${ANSWER.lines} lines but only has ${chains.flat().length}`);
    }
    if (FREAKOUTS.length < Math.min(EPISODES, FREAKOUTS_PER_DAY[1])) fail(`FREAKOUTS needs at least ${FREAKOUTS_PER_DAY[1]} lines`);
    for (const text of FREAKOUTS) if (!text || text.length + 1 > LAYOUT.cols) fail(`"${text}" is empty or too long`);
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const formatTokens = (n) => compact.format(n).toLowerCase();
const formatDuration = (s) => (s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`);

const STATUS_VARIANTS = [
    (s) => [[`(${formatDuration(s.secs)} · ↑ ${formatTokens(s.tokens)} tokens · `], ['esc', true], [' to interrupt)']],
    (s) => [[`(${formatDuration(s.secs)} · ↑ ${formatTokens(s.tokens)} tokens)`]],
    (s) => [[`(${formatDuration(s.secs)})`]],
];

function counterSamples(rng, lineCount) {
    let secs = rng.range(1, 4);
    let tokens = Math.round(rng.range(120, 480));
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

function statusFor(verb, samples) {
    const room = LAYOUT.cols - 1 - ([...verb].length + 1 + 1);
    const variant = STATUS_VARIANTS.find((v) => samples.every((s) => width(v(s)) <= room));
    if (!variant) return [];
    const out = [];
    samples.forEach((s, k) => {
        const parts = variant(s);
        const key = parts.map((p) => p[0]).join('');
        const prev = out.at(-1);
        if (prev?.key === key) prev.ticks += 1;
        else out.push({ key, parts, start: k, ticks: 1 });
    });
    return out;
}

const width = (parts) => parts.reduce((n, [t]) => n + [...t].length, 0);

function renderSvg(episodes, version, claudeVersion) {
    const theme = Object.fromEntries(Object.keys(THEMES.dark).map((k) => [k, `var(--${k})`]));
    const V = VIEW;
    const G = LAYOUT;
    const D = TICKS_PER_LINE * TICK;
    const len = (cells) => round(cells * V.cell);
    const rng = makeRng(`${version}/story`);

    let clock = 0;
    const eps = episodes.map((ep) => {
        const start = clock;
        const chars = [...ep.prompt];
        const typedAt = [];
        clock += STORY.pause;
        for (const ch of chars) {
            typedAt.push(clock);
            clock += STORY.perChar * rng.range(0.6, 1.5) * (ch === ' ' ? 1.4 : 1);
        }
        const sent = clock + STORY.hold;
        const work = sent + 0.25;
        const limit = work + ep.playlist.length * D;
        const rewind = limit + STORY.limit;
        const slide = rewind + STORY.scrub;
        const back = slide + STORY.slide;
        clock = back + STORY.untype;
        return { ...ep, chars, start, typedAt, sent, work, limit, rewind, slide, back, end: clock };
    });
    const T = clock;
    const rewinds = eps.map((e) => [e.rewind, e.back]);

    const ROW = 30;
    const EMPTY = -1;
    const row = (r, x, cells, attrs, body) =>
        `<text${attrs && ` ${attrs}`} x="${round(x)}" y="${round(G.spinnerBase + r * ROW)}"${cells ? ` textLength="${len(cells)}"` : ''}>${body}</text>`;
    const digits = Math.ceil(Math.log10(T / 0.002));
    const keyTimes = (steps) => steps.map(([t]) => round(t / T, digits)).join(';');
    const animate = (attr, steps, value, type = 'translate') =>
        `<${attr === 'transform' ? `animateTransform type="${type}"` : 'animate'} attributeName="${attr}" calcMode="discrete" dur="${round(T, 3)}s" repeatCount="indefinite" keyTimes="${keyTimes(steps)}" values="${steps.map(([, v]) => value(v)).join(';')}"/>`;
    const onRow = (steps) => animate('transform', steps, (r) => `0 ${-r * ROW}`);
    const spans = (attr, on, off, list) => animate(attr, [[0, off], ...list.flatMap(([a, b]) => [[a, on], [b, off]])], (v) => v);
    const during = (...list) => spans('display', 'inline', 'none', list);
    const shownDuring = (...list) => spans('visibility', 'visible', 'hidden', list);
    const hiddenDuring = (...list) => spans('visibility', 'hidden', 'visible', list);

    const HEAD = 2 * V.width;
    const head = [[0, HEAD]];

    const verbRows = [];
    const lastStatusRows = [];
    const lastStatusRow = [];
    const statusRows = [];
    const verbSteps = [[0, EMPTY]];
    const oldRows = [[0, EMPTY]];
    const oldShift = [[0, 0]];
    const statusSteps = [[0, EMPTY]];
    const shimmerLengths = new Set();
    const statusText = (st) => st.parts.map(([t, bold]) => (bold ? `<tspan class="b">${xml(t)}</tspan>` : xml(t))).join('');
    const cellsOf = (line) => [...line.text].length + (line.freakout ? 0 : 1);
    const freakouts = [];
    let g = 0;
    for (const ep of eps) {
        const first = g;
        ep.playlist.forEach((line, i) => {
            const t0 = ep.work + i * D;
            const word = line.freakout ? line.text : `${line.text}…`;
            const cells = cellsOf(line);
            const prev = i > 0 ? g - 1 : EMPTY;
            const was = i > 0 ? cellsOf(ep.playlist[i - 1]) : 0;
            const typing = Math.min(TYPE.max, Math.max(0.1, Math.round(Math.max(cells, was) * TYPE.perChar * 20) / 20));
            const steps = Math.min(Math.max(cells, was), Math.round(typing * TYPE.fps));
            if (line.freakout) freakouts.push({ start: t0, typed: t0 + typing, end: t0 + D });
            else shimmerLengths.add(cells);

            oldRows.push([t0, prev]);
            for (let s = 0; s < steps; s++) {
                const t = t0 + (s * typing) / steps;
                const typed = Math.round((cells * s) / steps);
                const left = Math.round(was * (1 - s / steps));
                head.push([t, round(G.textX + typed * V.cell)]);
                oldShift.push([t, round((typed + left - was) * V.cell)]);
            }
            head.push([t0 + typing, HEAD]);

            verbRows.push(row(g, G.textX, cells, line.freakout ? `style="fill:${theme.error}"` : `fill="url(#s${cells})"`, xml(word)));
            verbSteps.push([t0, g]);

            statusSteps.push([t0, EMPTY]);
            const statusX = G.textX + (cells + 1) * V.cell;
            lastStatusRow[g] = EMPTY;
            for (const st of line.status) {
                const start = Math.max(st.start * TICK, typing);
                if ((st.start + st.ticks) * TICK <= start) continue;
                statusSteps.push([t0 + start, statusRows.length]);
                lastStatusRow[g] = statusRows.length;
                statusRows.push(row(statusRows.length, statusX, 0, '', statusText(st)));
            }
            const last = line.status.at(-1);
            if (last) lastStatusRows.push(row(g, statusX, 0, 'class="d"', statusText(last)));
            g++;
        });

        verbSteps.push([ep.limit, EMPTY]);
        statusSteps.push([ep.limit, EMPTY]);
        const K = STORY.scrubFrames;
        const n = ep.playlist.length;
        for (let k = 0; k < K; k++) {
            const t = ep.rewind + STORY.scrub * Math.sqrt(k / K);
            const line = first + Math.round((n - 1) * (1 - k / (K - 1)));
            verbSteps.push([t, line]);
            statusSteps.push([t, lastStatusRow[line]]);
        }
        verbSteps.push([ep.slide, EMPTY]);
        statusSteps.push([ep.slide, EMPTY]);
    }

    const headY = round(G.spinnerBase - V.caret + 4.5);
    const headRect = `<rect id="head" x="${HEAD}" y="${headY}" width="${HEAD}" height="${V.caret}">${animate('x', head, (x) => x)}</rect>`;
    const caretStop = round(V.cell / HEAD, 5);

    const inputX = G.textX + 2 * V.cell;
    const inputMid = (G.boxTop + G.boxBottom) / 2;
    const typedCells = [[0, 0]];
    for (const e of eps) {
        const m = e.chars.length;
        typedCells.push(...e.typedAt.map((t, k) => [t, k + 1]), [e.sent, 0], [e.back, m]);
        for (let s = 1; s <= m; s++) typedCells.push([e.back + (s * STORY.untype) / (m + 1), m - s]);
    }
    const inputClip = `<clipPath id="input"><rect x="${round(inputX)}" y="${round(inputMid - V.caret / 2)}" height="${V.caret}" width="0">${animate('width', typedCells, (c) => len(c))}</rect></clipPath>`;
    const input = eps
        .map((e) => `<text class="t" clip-path="url(#input)" x="${round(inputX)}" y="${G.inputBase}" textLength="${len(e.chars.length)}" display="none">${xml(e.prompt)}${during([e.start, e.sent], [e.back, e.end])}</text>`)
        .join('\n');
    const cursor = `<rect class="cur" x="${round(inputX)}" y="${round(inputMid - V.caret / 2)}" width="${V.cell}" height="${V.caret}" style="fill:${theme.cursor}">${animate('x', typedCells, (c) => round(inputX + c * V.cell))}</rect>`;

    const drop = G.inputBase - G.userBase;
    const user = eps.map((e) => {
        const fall = [[0, '0 0']];
        for (let t = e.slide; t < e.back; t += 1 / TYPE.fps) fall.push([t, `0 ${round(drop * ((t - e.slide) / STORY.slide) ** 2)}`]);
        fall.push([e.back, '0 0']);
        return `<g display="none">${during([e.sent, e.back])}${animate('transform', fall, (v) => v)}<text class="d" x="${G.textX}" y="${G.userBase}">&gt;</text><text class="t" x="${round(G.textX + 2 * V.cell)}" y="${G.userBase}" textLength="${len(e.chars.length)}">${xml(e.prompt)}</text></g>`;
    });
    const hour = Math.floor(rng.range(1, 13));
    const limitText = `You've hit your session limit · resets ${hour}${rng.range(0, 1) < 0.5 ? 'am' : 'pm'} (UTC)`;
    const upgradeText = '/upgrade to increase your usage limit.';
    const hookX = G.textX + 2 * V.cell + V.cell / 2;
    const errorBase = round(G.userBase + V.row);
    const limit = `<g display="none">${during(...eps.map((e) => [e.limit, e.rewind]))}
<path d="M${round(hookX)} ${round(errorBase - V.capHeight)}V${round(errorBase - 3)}H${round(hookX + V.cell)}" fill="none" style="stroke:${theme.dim}"/>
<text style="fill:${theme.error}" x="${round(G.textX + 5 * V.cell)}" y="${errorBase}" textLength="${len([...limitText].length)}">${xml(limitText)}</text>
<text class="d" x="${round(G.textX + 5 * V.cell)}" y="${G.spinnerBase}" textLength="${len(upgradeText.length)}">${xml(upgradeText)}</text>
</g>`;

    const shake = [[0, '0 0']];
    for (const [a, b] of rewinds) {
        for (let t = a; t < b; t += 0.04) shake.push([t, `${Math.round(rng.range(-3, 3))} ${rng.range(0, 1) < 0.2 ? Math.round(rng.range(-1, 1)) : 0}`]);
        if (b < T) shake.push([b, '0 0']);
    }
    const bandH = 26;
    const bands = [0, 0.5].map((phase) => {
        const ys = [[0, -2 * bandH]];
        for (const [a, b] of rewinds) {
            for (let t = a; t < b; t += 1 / 30) {
                const p = ((t - a) / 0.6 + phase) % 1;
                ys.push([t, round(G.height - p * (G.height + bandH))]);
            }
            if (b < T) ys.push([b, -2 * bandH]);
        }
        return `<rect x="0" width="${V.width}" height="${bandH}" fill="url(#tracking)" y="${-2 * bandH}">${animate('y', ys, (y) => y)}</rect>`;
    });
    const badgeY = G.welcomeBase(1);
    const badgeRight = G.right - V.cell;
    const tri = (x) => `M${round(x)} ${round(badgeY - 4.5)}l7 -4.5v9Z`;
    const blink = rewinds.flatMap(([a, b]) => {
        const on = [];
        for (let t = a; t < b; t += 0.45) on.push([t, Math.min(t + 0.3, b)]);
        return on;
    });
    const badge = `<g display="none" style="fill:${theme.text}">${during(...blink)}
<path d="${tri(badgeRight - 3 * V.cell - 22)}${tri(badgeRight - 3 * V.cell - 14)}"/>
<text class="t b" x="${round(badgeRight - 3 * V.cell)}" y="${badgeY}" textLength="${len(3)}">REW</text>
</g>`;
    const frozen = (e) => freakouts.filter((f) => f.start >= e.work && f.start < e.limit).flatMap((f) => (f.end < e.limit ? [[f.start, 0], [f.end, 1]] : [[f.start, 0]]));
    const glyphGate = animate('opacity', [[0, 0], ...eps.flatMap((e) => [[e.work, 1], ...frozen(e), [e.limit, 0], [e.rewind, 1], [e.slide, 0]])], (o) => o);
    const jolt = makeRng(`${version}/jolt`);
    const jitter = [[0, '0 0']];
    for (const f of freakouts) {
        for (let t = f.typed; t < f.typed + 0.9; t += 0.04) jitter.push([t, `${Math.round(jolt.range(-2, 2))} ${Math.round(jolt.range(-1, 1))}`]);
        jitter.push([f.typed + 0.9, '0 0']);
    }
    const whoosh = (at, sign) => [[at, -6 * sign], [at + 0.03, -14 * sign], [at + 0.06, -7 * sign], [at + 0.09, 0]];
    const skew = animate('transform', [[0, 0], ...rewinds.flatMap(([a, b]) => [...whoosh(a, 1), ...whoosh(b, -1)])], (v) => v, 'skewX');
    const flashes = [[0, 0], ...rewinds.flatMap(([a, b]) => [[a, 0.14], [a + 0.06, 0.07], [a + 0.12, 0], [b, 0.1], [b + 0.06, 0]])];
    const flash = `<rect width="${V.width}" height="${G.height}" style="fill:${theme.text}" opacity="0">${animate('opacity', flashes, (o) => o)}</rect>`;
    const vhs = `<filter id="vhs" x="-3%" y="-3%" width="106%" height="106%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0 0.035" numOctaves="2" seed="1" result="noise"><animate attributeName="seed" values="1;7;3;9;5;2;8;4" dur="0.4s" calcMode="discrete" repeatCount="indefinite"/></feTurbulence>
<feColorMatrix in="noise" type="matrix" values="1 0 0 0 0 0 0 0 0 0.5 0 0 0 0 0 0 0 0 0 1" result="map"/>
<feDisplacementMap in="SourceGraphic" in2="map" scale="16" xChannelSelector="R" yChannelSelector="G" result="warp"/>
<feColorMatrix in="warp" type="matrix" values="0 0 0 0 1 0 0 0 0 0.1 0 0 0 0 0.25 0 0 0 0.6 0"/>
<feOffset dx="-3" result="red"/>
<feColorMatrix in="warp" type="matrix" values="0 0 0 0 0 0 0 0 0 0.9 0 0 0 0 1 0 0 0 0.6 0"/>
<feOffset dx="3" result="cyan"/>
<feMerge><feMergeNode in="red"/><feMergeNode in="cyan"/><feMergeNode in="warp"/></feMerge>
</filter>
<pattern id="scan" width="8" height="3" patternUnits="userSpaceOnUse"><rect width="8" height="1" style="fill:${theme.text}" opacity="0.06"/></pattern>`;

    const glyphPeriod = (GLYPH_FRAMES.length * GLYPH_FRAME_MS) / 1000;
    const glyphKeyframes = GLYPH_SHAPES.map((_, g) => frameKeyframes(`g${g}`, GLYPH_FRAMES, (f) => f === g));
    const glyphAt = `translate(${round(G.left + GLYPH.radius)} ${round(G.spinnerBase - GLYPH.lift)}) scale(${GLYPH.radius})`;
    const glyphs = GLYPH_SHAPES.map((d, g) => `<path class="g" style="animation-name:g${g}" transform="${glyphAt}" d="${d}"/>`);

    const band = len(SHIMMER.width);
    const shimmerDefs = [...shimmerLengths]
        .sort((a, b) => a - b)
        .map((cells) => {
            const moving = cells + SHIMMER.width - 1;
            const idle = Math.round((moving * SHIMMER.idle) / (1 - SHIMMER.idle));
            const steps = [];
            for (let k = 1 - SHIMMER.width; k < cells; k++) steps.push(round(G.textX + k * V.cell, 2));
            for (let k = 0; k < idle; k++) steps.push(round(G.textX + cells * V.cell, 2));
            return `<linearGradient id="s${cells}" xlink:href="#band"><animateTransform attributeName="gradientTransform" type="translate" calcMode="discrete" dur="${SHIMMER.period}s" repeatCount="indefinite" values="${steps.join(';')}"/></linearGradient>`;
        });

    const welcomeLine = (line, cls, text) =>
        `<text class="${cls}" x="${G.welcomeX}" y="${G.welcomeBase(line)}" textLength="${len([...text].length)}">${xml(text)}</text>`;
    const clawd = renderClawd();
    const welcome = [
        `<rect x="${G.left}" y="${G.left}" width="${G.welcomeRight - G.left}" height="${G.welcomeBottom - G.left}" rx="5" fill="none" style="stroke:${theme.claude}"/>`,
        clawd.svg,
        welcomeLine(1, 't', HEADER.title),
        ...HEADER.lines.map((text, k) => welcomeLine(2 + k, 'd', text.replace('{version}', claudeVersion))),
    ];

    const label = `${HEADER.title} A Claude Code terminal. Prompts like "${eps.map((e) => e.prompt).join('", "')}" are sent; the spinner cycles through made-up verbs until the usage limit hits, then it all rewinds like a VHS tape and the next prompt is typed`;
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${V.width}" height="${G.height}" viewBox="0 0 ${V.width} ${G.height}" role="img" aria-label="${xml(label)}">
<!-- Generated by generate.mjs for ${version}: ${eps.length} prompts, ${g} lines, ${round(T)} s loop. Edit PROMPTS in generate.mjs, not this file. -->
<title>${label}</title>
<style>
:root{${Object.entries(THEMES.light).map(([k, v]) => `--${k}:${v}`).join(';')}}
@media (prefers-color-scheme:dark){:root{${Object.entries(THEMES.dark).map(([k, v]) => `--${k}:${v}`).join(';')}}}
text{font-family:${FONT};font-size:${V.fontSize}px;white-space:pre;font-variant-ligatures:none;font-kerning:none}
.t{fill:${theme.text}}.d{fill:${theme.dim}}.b{font-weight:700}
.g{fill:${theme.claude};opacity:0;animation:${round(glyphPeriod)}s step-end infinite}
${glyphKeyframes.join('\n')}
${clawd.css}
.cur{animation:blink ${CURSOR_BLINK}s step-end infinite}@keyframes blink{0%{opacity:1}50%,100%{opacity:0}}
</style>
<defs>
<linearGradient id="band" gradientUnits="userSpaceOnUse" x1="0" x2="${band}"><stop offset="0" style="stop-color:${theme.claude}"/><stop offset="0" style="stop-color:${theme.shimmer}"/><stop offset="1" style="stop-color:${theme.shimmer}"/><stop offset="1" style="stop-color:${theme.claude}"/></linearGradient>
${shimmerDefs.join('\n')}
${headRect}
<clipPath id="line"><rect x="0" y="${headY}" width="${V.width}" height="${V.caret}"/></clipPath>
<clipPath id="typed"><use xlink:href="#head" x="-${HEAD}"/></clipPath>
<clipPath id="old"><use xlink:href="#head" x="${V.cell}"/></clipPath>
<linearGradient id="caret"><stop offset="0" style="stop-color:${theme.claude}"/><stop offset="${caretStop}" style="stop-color:${theme.claude}"/><stop offset="${caretStop}" stop-opacity="0"/></linearGradient>
<linearGradient id="tracking" x2="0" y2="1"><stop offset="0" style="stop-color:${theme.text}" stop-opacity="0"/><stop offset="0.5" style="stop-color:${theme.text}" stop-opacity="0.22"/><stop offset="1" style="stop-color:${theme.text}" stop-opacity="0"/></linearGradient>
<clipPath id="screen"><rect x="0.5" y="0.5" width="${V.width - 1}" height="${G.height - 1}" rx="10"/></clipPath>
${vhs}
${clawd.defs}
${inputClip}
<g id="verbs">
${verbRows.join('\n')}
</g>
</defs>
<rect x="0.5" y="0.5" width="${V.width - 1}" height="${G.height - 1}" rx="10" style="fill:${theme.bg};stroke:${theme.frame}"/>
<g clip-path="url(#screen)">
<g>${hiddenDuring(...rewinds)}<g id="content">${animate('transform', shake, (v) => v)}<g>${skew}
${welcome.join('\n')}
${badge}
${user.join('\n')}
${limit}
<g>${animate('transform', jitter, (v) => v)}
<g opacity="0">${glyphGate}
${glyphs.join('\n')}
</g>
<path display="none" transform="${glyphAt}" d="${GLYPH_SHAPES[4]}" style="fill:${theme.error}">${during(...freakouts.map((f) => [f.start, f.end]))}</path>
<g clip-path="url(#typed)"><use xlink:href="#verbs">${onRow(verbSteps)}</use></g>
<g clip-path="url(#old)"><g>${onRow(oldRows)}<g>${animate('transform', oldShift, (dx) => dx)}
<use xlink:href="#verbs"/>
${lastStatusRows.join('\n')}
</g></g></g>
<g clip-path="url(#line)"><g class="d">${onRow(statusSteps)}
${statusRows.join('\n')}
</g></g>
<use xlink:href="#head" fill="url(#caret)"/>
</g>
<rect x="${G.left}" y="${G.boxTop}" width="${G.right - G.left}" height="${G.boxBottom - G.boxTop}" rx="5" fill="none" style="stroke:${theme.border}"/>
<text x="${G.textX}" y="${G.inputBase}" class="d">&gt;</text>
${input}
${cursor}
<text x="${G.textX}" y="${G.hintBase}" textLength="${len(15)}" class="d">? for shortcuts</text>
</g></g></g>
<g visibility="hidden">${shownDuring(...rewinds)}<use xlink:href="#content" filter="url(#vhs)"/></g>
<rect width="${V.width}" height="${G.height}" fill="url(#scan)" display="none">${during(...rewinds)}</rect>
${bands.join('\n')}
${flash}
</g>
</svg>
`;
}

function renderClawd() {
    const { cell, row, fontSize } = VIEW;
    const G = LAYOUT;
    const QUADS = { '▘': 8, '▝': 4, '▖': 2, '▗': 1, '▀': 12, '▄': 3, '▌': 10, '▐': 5, '▛': 14, '▜': 13, '▙': 11, '▟': 7, '█': 15 };
    const px = cell / 2;
    const py = row / 2;
    const rects = (grid, dx, dy) =>
        grid
            .map((cols, y) => {
                let d = '';
                for (let x = 0; x < cols.length; x++) {
                    if (!cols[x]) continue;
                    let end = x;
                    while (cols[end + 1]) end++;
                    d += `M${round(G.clawdX + dx + x * px)} ${round(G.clawdY + dy + y * py)}h${round((end - x + 1) * px)}v${py}h${round(-(end - x + 1) * px)}Z`;
                    x = end;
                }
                return d;
            })
            .join('');

    const frameKey = (frame) => frame.join('/');
    const keys = [...new Set([...CLAWD.entrance, ...CLAWD.loop].map(frameKey))];
    const groups = keys.map((key, k) => {
        const [pose, crouch, puff, shift] = key.split('/');
        const lines = CLAWD.poses[pose];
        const body = lines.flatMap(() => [[], []]);
        const eyes = lines.flatMap(() => [[], []]);
        lines.forEach((line, l) => {
            [...line].forEach((ch, c) => {
                const q = QUADS[ch] ?? 0;
                const behindEyes = l === CLAWD.eyes.line && c >= CLAWD.eyes.from && c < CLAWD.eyes.to;
                for (let b = 0; b < 4; b++) {
                    const on = (q >> (3 - b)) & 1;
                    const [y, x] = [2 * l + (b >> 1), 2 * c + (b & 1)];
                    body[y][x] = !!on;
                    eyes[y][x] = !on && behindEyes;
                }
            });
        });
        const [dx, dy] = [Number(shift) * cell, Number(crouch) * row];
        if (Number(shift) <= -CLAWD.cols) return `<g class="c${k}"/>`;
        const puffs = puff
            ? [0, CLAWD.cols - 1]
                    .map((c) => `<text class="d" x="${round(G.clawdX + c * cell)}" y="${round(G.clawdY + 2.5 * row + fontSize * 0.35)}">${CLAWD.puffs[puff]}</text>`)
                    .join('')
            : '';
        return `<g class="c${k}"><path fill="#D77757" d="${rects(body, dx, dy)}"/><path fill="#000000" d="${rects(eyes, dx, dy)}"/>${puffs}</g>`;
    });

    const seconds = (frames) => round((frames.length * CLAWD.frameMs) / 1000);
    const timeline = (name, frames, key) =>
        frames.some((f) => frameKey(f) === key) ? frameKeyframes(name, frames, (f) => frameKey(f) === key) : null;
    const [inFor, loopFor] = [seconds(CLAWD.entrance), seconds(CLAWD.loop)];
    const css = keys.map((key, k) => {
        const entrance = timeline(`e${k}`, CLAWD.entrance, key);
        const loop = timeline(`l${k}`, CLAWD.loop, key);
        const uses = [
            entrance && `e${k} ${inFor}s step-end both`,
            loop && `l${k} ${loopFor}s step-end ${inFor}s infinite`,
        ].filter(Boolean);
        return `.c${k}{opacity:0;animation:${uses.join(',')}}${entrance ?? ''}${loop ?? ''}`;
    });
    return {
        css: css.join('\n'),
        defs: `<clipPath id="clawd"><rect x="${G.clawdX}" y="${G.clawdY}" width="${round(CLAWD.cols * cell)}" height="${3 * row}"/></clipPath>`,
        svg: `<g clip-path="url(#clawd)">
${groups.join('\n')}
</g>`,
    };
}

function dot(r) {
    return `M${-r} 0A${r} ${r} 0 1 0 ${r} 0A${r} ${r} 0 1 0 ${-r} 0Z`;
}

function petals(count, w) {
    const c = 1 - w;
    return spin(count, (p) => {
        const [a, b, e, f] = [p(-w * 0.3, -c * 0.3), p(-w, -c * 0.6), p(-w, -c), p(w, -c)];
        const [g, h] = [p(w, -c * 0.6), p(w * 0.3, -c * 0.3)];
        return `M0 0C${a} ${b} ${e}A${w} ${w} 0 0 1 ${f}C${g} ${h} 0 0Z`;
    });
}

function spokes(count, h) {
    return spin(count, (p) => `M${p(-h, 0)}L${p(-h, -(1 - h))}A${h} ${h} 0 0 1 ${p(h, -(1 - h))}L${p(h, 0)}Z`);
}

function star(points, inner) {
    const pts = [];
    for (let k = 0; k < points * 2; k++) {
        const r = k % 2 ? inner : 1;
        const t = (Math.PI * k) / points;
        pts.push(`${num(r * Math.sin(t))} ${num(-r * Math.cos(t))}`);
    }
    return `M${pts.join('L')}Z`;
}

function spin(count, draw) {
    let d = '';
    for (let k = 0; k < count; k++) {
        const t = (2 * Math.PI * k) / count;
        const [cos, sin] = [Math.cos(t), Math.sin(t)];
        d += draw((x, y) => `${num(x * cos - y * sin)} ${num(x * sin + y * cos)}`);
    }
    return d;
}

function num(n) {
    return String(round(n, 3) || 0);
}

function round(n, digits = 2) {
    const f = 10 ** digits;
    return Math.round(n * f) / f;
}

function frameKeyframes(name, frames, on) {
    const stops = [];
    let prev = null;
    frames.forEach((frame, f) => {
        if (on(frame) !== prev) stops.push(`${round((f / frames.length) * 100, 4)}%{opacity:${on(frame) ? 1 : 0}}`);
        prev = on(frame);
    });
    return `@keyframes ${name}{${stops.join('')}100%{opacity:0}}`;
}

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function makeRng(seed) {
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < seed.length; i++) {
        const c = seed.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 2654435761);
        h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    let a = (h1 ^ h2) >>> 0;
    const next = () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
        range: (lo, hi) => lo + next() * (hi - lo),
        shuffle(list) {
            const out = list.slice();
            for (let i = out.length - 1; i > 0; i--) {
                const j = Math.floor(next() * (i + 1));
                [out[i], out[j]] = [out[j], out[i]];
            }
            return out;
        },
    };
}

function fail(message) {
    console.error(`error: ${message}`);
    process.exit(1);
}

await main();
