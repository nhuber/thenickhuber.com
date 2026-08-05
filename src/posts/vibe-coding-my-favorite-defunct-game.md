---
title: "A tour inside the kitchen of my software restaurant"
date: 2026-08-03
legacyCanonical: "https://thenickhuber.com/vibe-coding-my-favorite-defunct-game"
slug: "vibe-coding-my-favorite-defunct-game"
---

<h2 class="post-deck">My private benchmark is finally saturated: How I vibe-coded my favorite defunct game in seven days and most of my “users” ended up being bots.</h2>

For the past 18 months, I have had a private benchmark for coding agents: can they rebuild my favorite defunct game? (An autobattler called [Storybook Brawl](https://en.wikipedia.org/wiki/Storybook_Brawl), which imploded after [being acquired by FTX](https://www.pcgamer.com/storybook-brawl-crypto-review-bomb/)).

Every few months, I have tried again with the newest tools – in early 2025, with Cursor and Sonnet 3.7, in late 2025 with Claude Code and Opus 4.5, at some point I spent a weekend hacking on Lovable project with I think GPT-5, and more recently with a combination of both Codex and Claude Code.

Earlier attempts were impressive until they weren’t. I could get a basic template of *something* running, but complex interactions – the real meat of any strategy game – eventually became impossible. The agent would confidently tell me a change was finished when it either hadn’t worked or had broken three unrelated things. It was tantalizingly, agonizingly close – but no cigar.

This time, I can say that this benchmark is basically saturated. This is my journey.

## FableBrawl: an overview

In roughly seven days of full-time work, I built FableBrawl as a [website](https://fablebrawl.com/) and an iOS app. It has Google and Apple sign-in, subscriptions through Stripe, a Vite-based game client, Postgres on Railway, deployment through GitHub Actions and Vercel, activation emails through Resend, analytics logs in Cloudflare R2, and a staging environment where I could test changes before shipping them. I had heard of most of these tools before but had never built on top of them; I can’t in full honesty say I still understand what all of them do, except to say that “[it works](https://hooverpresidentialfoundation.org/speeches/engineering-as-a-profession/).” I felt especially seen when Stripe’s onboarding flow had specific hooks for building with coding agents.

<figure class="post-figure post-figure-wide">
  <img src="/assets/fablebrawl-system-architecture.png" alt="Diagram of the FableBrawl web app, iOS app, shared game core, Railway backend, storage, providers, and operations">
  <figcaption>The production architecture behind FableBrawl.</figcaption>
</figure>

While some of the game engine was getting built in multi-hour refinements, it was nice to be able to do more emotive work like choosing visuals and sound effects in parallel. In the end, the game shipped with two visual modes: high-fantasy art from OpenAI image models, the original default aesthetic I personally wanted, and community-suggested MS Paint-style stick art for the anti-AI set (more on that later) that eventually became the default.

<div class="post-media-pair" aria-label="FableBrawl visual modes on web and iOS">
  <figure class="post-figure">
    <img src="/assets/fablebrawl-web-home.jpg" alt="FableBrawl web home screen in Rough Draft art mode">
    <figcaption>The web home screen in community-requested Rough Draft mode.</figcaption>
  </figure>
  <figure class="post-figure post-figure-phone">
    <img src="/assets/fablebrawl-ios-home.png" alt="FableBrawl iOS home screen in Rough Draft art mode">
    <figcaption>FableBrawl running as an iOS app.</figcaption>
  </figure>
</div>

My background tracks for different game scenes were basically one-shot from the ElevenLabs music model and the sound effects come from their SFX model. Surprisingly, I had to generate ~30-40 sound effects for each that ended up in the game to get exactly what I wanted; the models still feel somewhat stunted when it comes to multi-modality and human taste – a lot of the SFX were really bothersome or overly shrill, at least to my ears.

<div class="soundboard" aria-label="FableBrawl sound samples">
  <div class="soundboard-heading">
    <strong>Hear FableBrawl</strong>
    <span>Nothing plays until you tap an icon.</span>
  </div>
  <div class="sound-grid">
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-menu" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Main background track</strong><small>Music · 1:00</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-card" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Move a card</strong><small>Board interaction · 0:01</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-buy" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Buy a card</strong><small>Shop interaction · 0:01</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-win" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Win a battle</strong><small>Victory cue · 0:02</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
  </div>
  <audio id="fablebrawl-audio-menu" preload="none" src="/assets/fablebrawl-menu-theme.mp3"></audio>
  <audio id="fablebrawl-audio-card" preload="none" src="/assets/fablebrawl-card-move.mp3"></audio>
  <audio id="fablebrawl-audio-buy" preload="none" src="/assets/fablebrawl-buy-card.mp3"></audio>
  <audio id="fablebrawl-audio-win" preload="none" src="/assets/fablebrawl-win-battle.mp3"></audio>
</div>

I made an admin dashboard to grant free subscriptions and monitor live usage. I built a comprehensive logging suite and in-app bug reporting feature. Every build ran about 400 automated tests, about a 100 I told the coding agent to write and about 300 I had it make for itself. I’m not a SWE so I don’t really know if these are good tests, but they seemed to catch some regressions.

<figure class="post-figure post-figure-wide">
  <img src="/assets/fablebrawl-live-court.png" alt="FableBrawl Live Court admin dashboard showing one current player and daily active users, with suspected bots excluded">
  <figcaption>The Live Court dashboard separated likely humans from suspected bot traffic.</figcaption>
</figure>

Above all, I was able to faithfully and accurately resurrect the core game mechanics of my favorite defunct game with all of its crunchy, tactical decisions in an appropriate, high-fantasy setting – and be able to play on a live multiplayer server with other people!

<div class="player-reactions" aria-label="Player reactions to FableBrawl">
  <img src="/assets/fablebrawl-player-reactions-collage.png" alt="Three Discord player reactions: Pix praises FableBrawl and bug reporting, wait4godot says they will check it out, and House praises the quick turnaround">
</div>

It was especially fun to build suggestions from players in a few hours while they were still playing, like a Mortal Kombat-style “killing blow” cutscene that wasn’t even in the original game. Also, the in-game AI opponent (with no specific steering or customization – more on this later as well) was significantly better than what shipped with the original game.

<figure class="post-figure post-figure-wide post-figure-lightened">
  <img src="/assets/fablebrawl-killing-blow.gif" alt="Animated FableBrawl killing-blow cutscene where Merlin defeats Grandmother with arcane lightning">
  <figcaption>A player suggestion, built and shipped while people were still playing.</figcaption>
</figure>

## A peek inside my software kitchen

There is a heated debate on Twitter right now over if “software factories” – the idea of agents autonomously, continuously building high-quality software – are [real](https://x.com/dexhorthy/status/2080697380379427275) or [not](https://x.com/GeoffreyHuntley/status/2082525589416923314). I’m not an expert, but what I will say is that my experience working with these agents felt more like running a slightly chaotic, but happy family restaurant more than operating a factory.

Overall, my biggest takeaway is – **damn,** **it’s fun to build**! The amount of iteration you’re able to do in just a few minutes or a single session made me always wanting to put more time into it, similar to that feeling of starting a new video game captured perfectly by ProZD:

<div class="video-embed">
  <iframe src="https://www.youtube-nocookie.com/embed/D7aotMarYQU" title="ProZD video about starting a new game" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

At the same time, it was slightly chaotic because most of the time I was context-switching across ~20 threads to keep myself from being the rate-limiting factor towards progress, which ranged from making game assets to ruling on mechanic nuances to polishing the UI/UX to testing the game features. I enjoyed it when I had a few minutes to take a breath while waiting for “big dishes” to be ready, when I could more peacefully refine “would be nice” small touches that any small business owned and operated on passion has.

In terms of my tool stack journey, I initially started exclusively with Claude Code because I wanted to try Fable 5 and the desktop app’s git UI/UX gave me comfort about tracking what was done vs. in-progress.<sup class="footnote-ref"><a id="fnref-1" href="#fn-1" aria-label="Read footnote 1">1</a></sup> I initially only started to use Codex because I wanted to use its image tool without paying the API costs; eventually, I realized its in-app browser is way better than Claude’s and truly valuable for automating work that needs to be logged into a website like configuring Stripe or submitting to the App Store.

A game-changing, utterly magical moment was being able to use OpenAI’s new duplex, voice model<sup class="footnote-ref"><a id="fnref-2" href="#fn-2" aria-label="Read footnote 2">2</a></sup> to fully control my computer remotely and build ~5-7 major features while in my car. I was waiting at a doctor’s office for about 45 minutes and what previously would’ve been a frustrating experience turned into one of my most productive work sessions, in no small part because the ChatGPT app has a great CarPlay integration.

Codex still has room to improve: it needs better syncing of mobile/remote sessions to the desktop app, richer thread management, and I still find the in-app partition across Chat/Work pretty crude<sup class="footnote-ref"><a id="fnref-3" href="#fn-3" aria-label="Read footnote 3">3</a></sup>, but the foundation is incredibly strong. I wouldn’t be surprised to see Codex/OpenAI pull away from Claude Code on code generation in the next few months – perhaps not in terms of revenue since ~80% of Claude Code’s revenue is likely longer-term enterprise contracts, but certainly in terms of developer traction and feature superiority.<sup class="footnote-ref"><a id="fnref-4" href="#fn-4" aria-label="Read footnote 4">4</a></sup> For someone at my level of software engineering or at least the tasks I was jamming on, I couldn’t see a discernible difference in the quality of Sol Max and Fable’s output, so the native, end-to-end voice form factor is a true differentiator for me.

My end-state set-up that I think will become more common for people was to have my main machine always plugged in at home/office, set to never sleep, and logged into all critical web-based services.<sup class="footnote-ref"><a id="fnref-5" href="#fn-5" aria-label="Read footnote 5">5</a></sup> This then gave me the flexibility to **do anything** **from my phone** via a remote connection that I could do physically sitting at my desk, as long as I could verbalize what I wanted. By the end of this project, I was probably logging ~75% of my contributions from my phone vs. at my desk – in part because I was on a vacation in the middle, but I could also see this as a way to get outside, exercise, and spend more time in nature.<sup class="footnote-ref"><a id="fnref-6" href="#fn-6" aria-label="Read footnote 6">6</a></sup> I always had more ideas while walking, showering or waiting in line – and now building immediately in-state is just a short voice-transcribed note away. It felt like having not just an executive assistant, but also a team of engineers, designers & data scientists.

Speaking of: **voice** – have you joined the voice revolution yet? While I still love quietly typing my thoughts out (as I’m doing now), for most practical tasks it’s ~3x faster to dictate it and speech-to-text models have gotten so accurate and cheap that you’re just leaving time on the table if you’re not using them.<sup class="footnote-ref"><a id="fnref-7" href="#fn-7" aria-label="Read footnote 7">7</a></sup> My set-up is a simple [dedicated Bluetooth mic](https://www.amazon.com/dp/B0DJSM8PHP?ref=ppx_yo2ov_dt_b_fed_asin_title) that clips to my shirt and WisprFlow because I like to have custom overrides stored for technical, easy-to-conflate words, but I don’t even think this is the ultimate end-state here. I plan to help my 6 year-old build a software game with me and Codex, in part to see how she interacts with the computer by talking to it, unburdened by the decades of hard-wired habits that are still in my brain.

<div class="post-media-pair post-media-pair-even" aria-label="Two posters encouraging people to talk to their computers">
  <figure class="post-figure">
    <img src="/assets/fablebrawl-talk-to-computer.png" alt="Vintage poster saying Do your part: Talk to your computer">
  </figure>
  <figure class="post-figure">
    <img src="/assets/fablebrawl-talk-to-computer-more.png" alt="Vintage poster saying You probably should be talking to your computer more">
  </figure>
</div>

The most “factory-like” or at least “production-line” aspect of my humble software restaurant was my bug reporting and resolution workflow. I knowingly shipped the game in a barely working state, because even as such I expected some people would want to play it, it was still fun, and we could collaboratively iron out the game engine together – rather than relying on me laboriously testing different interactions. Over the course of ~3 days, we received ~100 bug reports – at first in Discord messages but eventually via an in-app reporting flow that also serialized the game state in the report. After about a day of responding to emails myself, I realized about 90% of the time, I was just copying and pasting the report into the coding agents verbatim and so built a Claude Code routine where every hour it would read the bug reports from [hello@fablebrawl.com](mailto:hello@fablebrawl.com) and automatically resolve them as long as they were low- to medium-risk and didn’t have any ambiguity.<sup class="footnote-ref"><a id="fnref-8" href="#fn-8" aria-label="Read footnote 8">8</a></sup> The community seemed to really like how quickly their issues were addressed (average resolution time of ~3h), and even received an agent-written email explaining the resolution as a sort of checksum to ensure we fixed it correctly.

<figure class="post-figure post-figure-wide">
  <div class="post-media-crop post-media-crop-inbox">
    <img src="/assets/fablebrawl-bug-inbox.png" alt="Gmail inbox showing the top unread FableBrawl bug reports">
  </div>
  <figcaption>The top of the bug-report queue.</figcaption>
</figure>

<div class="ai-opponents" aria-label="Examples of FableBrawl heroes controlled by the game AI">
  <div class="ai-opponents-heading">
    <strong>AI opponents</strong>
    <span>No special steering or customization required.</span>
  </div>
  <div class="ai-opponents-grid">
    <figure><img src="/assets/fablebrawl-ai-merlin.webp" alt="Merlin hero portrait"><figcaption>Merlin</figcaption></figure>
    <figure><img src="/assets/fablebrawl-ai-grandmother.webp" alt="Grandmother hero portrait"><figcaption>Grandmother</figcaption></figure>
    <figure><img src="/assets/fablebrawl-ai-muerte.webp" alt="Muerte hero portrait"><figcaption>Muerte</figcaption></figure>
  </div>
</div>

The one frustration experience I had was using the coding agents to improve the in-game AI opponent’s decision-making. While the “out-of-the-box” (e.g. no customization) performance was significantly better than the original game, it was nowhere near the skill of a top player. An adult human who learned the basic game mechanics could probably beat the in-game AIs within 30-45 minutes; the in-game AI has no chance of ever getting close to beating a top player that has put hundreds-thousands of hours into the game. I tried a few things: I talked to the coding agents about what I observed the in-game AIs doing poorly and this was able to improve average placement by ~0.4 points (for context, the game is 8-player, so 4.5 is an average placement). I tried ~10 times to steer the coding agents to make some kind of RL environment where the in-game AIs could play against each other and tune their weights; this failed horribly even after many scripts and hundreds of hours of wall time. Fundamentally, I think the game’s state space is too large to be “vibe-trained” on.<sup class="footnote-ref"><a id="fnref-9" href="#fn-9" aria-label="Read footnote 9">9</a></sup> I even tried meaningfully reducing the search space by trying to improve the in-game AI for a single one of the game’s 44 unique heroes, but even that didn’t work, and I didn’t care enough to more precisely define the learning problem. There’s a chance too that OpenAI/Anthropic are intentionally making their public-facing model APIs worse at writing machine learning code due to competitive concerns.<sup class="footnote-ref"><a id="fnref-10" href="#fn-10" aria-label="Read footnote 10">10</a></sup>

A few final thoughts for other aspiring software restauranteurs:

- Codex Fast mode feels meaningfully faster, but consumes quota way too quickly to be worth it – it’s perhaps 50% faster but for what felt like 2.5x quota drawdown
- This is especially relevant since Codex (unlike Claude) doesn’t give discounts for large usage credit purchases if you ever run over your weekly quota
- In the first few days, I spent a bunch of time maximizing use of screen real estate on web, mobile web & iOS because it was fun to get that immediate gratification, but in retrospect once you’re trying to maintain consistently across multiple surfaces, it’s important to have colors, padding, spacing, fonts, iconography, etc. canonically defined somewhere.
  - I think the best current way to do this is to have [Claude Design](https://www.anthropic.com/news/claude-design-anthropic-labs) make a design system for you that you approve, but I can’t verify this because I only did this after the fact when I basically had gotten everything looking how I wanted it to.
  - The killer features here are being able to drop a comment *associated with a location* on the screen, just like you’d rev a mockup with a designer, and even draw on the screen to communicate sizings and locations visually

## Community response – so, did anyone care?

At its peak, Storybook Brawl had [~250,000 copies installed](https://steamdb.info/app/1367020/charts/) and a peak concurrent users of ~3k, which I think can roughly represent the total market size for this game, as it’s relatively complex and has a niche appeal. About a week after launch, we have ~100 sign-ups, an average 5-10 players per day, and 0 paying subscribers. The [Reddit launch post](https://www.reddit.com/r/StorybookBrawl/comments/1v5vigc/i_really_missed_sbb/) got ~40 upvotes and ~3k views in r/StorybookBrawl; I tried to post the game link in the StorybookBrawl Discord but its current moderators are making their own successor game and seemingly therefore deleted my post ☹️. I put top players’ in-game ratings on the homepage and there seem to be a handful of players that are seemingly gunning for the top spot that resets every month, even though most of the games they’re matched into are against weak AI opponents.

The most interesting part of the community response was the guttural rejection of AI-generated art. A streamer even backed out of streaming the game after he discovered we were using AI assets. I found that many indie games that launch these days have an [AI](https://www.reddit.com/r/incremental_games/comments/1tyw6ef/sludgineers_releasing_august_25th_pt/) [disclaimer](https://www.reddit.com/r/tycoon/comments/1v3dl5b/my_global_supplychain_sim_factory_default_build/) attached to them. As someone who mostly marvels at the promised productivity gains of AI, I cannot fully understand this worldview but respect it enough to make the default art style programmatically generated stick art, which I admit has grown on me. Only one person asked if the code running the game was AI-generated. I would’ve loved for more people to use the game to justify further investment, but I probably will just park this into maintenance mode for the foreseeable future.

<figure class="post-figure post-figure-compact">
  <img src="/assets/fablebrawl-ai-art-reaction.png" alt="A Discord user asks who did the art for FableBrawl">
  <figcaption>The most revealing question in the community response.</figcaption>
</figure>

### Most of my users were bots

Probably the funniest moment was when I realized that all of the analytics dashboards I was so proud of were utterly glazing me. Originally, the game didn’t have any sign-up wall and so was fully available to crawlers/botters and for some reason some bots were playing hundreds of games with my bots. I only noticed after shipping a sign-up wall and the bot script dying. I have no idea why someone would bot a resurrection of a long-defunct tactical auto-battler.

<p class="post-closing-question">If you build with coding agents, what’s your private benchmark? If you run a software factory/restaurant, what could I have done differently? Feel free to comment below or on X.</p>

<section class="post-footnotes" aria-labelledby="footnotes-label">
  <h2 id="footnotes-label">Footnotes</h2>
  <ol>
    <li id="fn-1" tabindex="-1"><a class="footnote-backref" href="#fnref-1" aria-label="Return to footnote 1 in the article" title="Return to footnote 1"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">1</span></a><p>Eventually, I added to my system instructions to not even bother me with git issues which was a joy to do. I also told the different threads to stop bringing up to me that “some files were touched by other in-progress worktrees.”</p></li>
    <li id="fn-2" tabindex="-1"><a class="footnote-backref" href="#fnref-2" aria-label="Return to footnote 2 in the article" title="Return to footnote 2"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">2</span></a><p>A duplex model means it streams input and output simultaneously, so it won’t interrupt you as much as the old ChatGPT Advanced Voice mode would and you can interrupt it more fluidly. Native voice models are trained on audio tokens and tend to be better than speech-to-text -&gt; text response -&gt; text to speech pipelines because they can understand pauses and intonation.</p></li>
    <li id="fn-3" tabindex="-1"><a class="footnote-backref" href="#fnref-3" aria-label="Return to footnote 3 in the article" title="Return to footnote 3"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">3</span></a><p>I imagine the partition is intentional due to enterprise security requirements, but it still seems like there needs to be more/better ways to switch between them in-app than tapping the side menu, tapping ChatGPT, toggling to/from Chat/Work, and then still trying to remember whatever you were doing.</p></li>
    <li id="fn-4" tabindex="-1"><a class="footnote-backref" href="#fnref-4" aria-label="Return to footnote 4 in the article" title="Return to footnote 4"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">4</span></a><p>I tried to set up Claude Code with Dispatch multiple times but had Bluetooth pairing problems.</p></li>
    <li id="fn-5" tabindex="-1"><a class="footnote-backref" href="#fnref-5" aria-label="Return to footnote 5 in the article" title="Return to footnote 5"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">5</span></a><p>I’ve happily used <a href="https://apps.apple.com/us/app/amphetamine/id937984704?mt=12">Amphetamine</a> for ~2 years for this and to solve various MacOS waking issues.</p></li>
    <li id="fn-6" tabindex="-1"><a class="footnote-backref" href="#fnref-6" aria-label="Return to footnote 6 in the article" title="Return to footnote 6"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">6</span></a><p>As long as said nature has a strong 5G connection!</p></li>
    <li id="fn-7" tabindex="-1"><a class="footnote-backref" href="#fnref-7" aria-label="Return to footnote 7 in the article" title="Return to footnote 7"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">7</span></a><p>“Speech Is 3x Faster than Typing for English and Mandarin Text Entry on Mobile Devices” <a href="https://hci.stanford.edu/research/speech/paper/speech_paper.pdf">https://hci.stanford.edu/research/speech/paper/speech_paper.pdf</a></p></li>
    <li id="fn-8" tabindex="-1"><a class="footnote-backref" href="#fnref-8" aria-label="Return to footnote 8 in the article" title="Return to footnote 8"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">8</span></a><p>I probably would’ve used Codex for this as well except its Gmail connector seems to really prefer/only allow a single inbox, and it was already connected to my personal account.</p></li>
    <li id="fn-9" tabindex="-1"><a class="footnote-backref" href="#fnref-9" aria-label="Return to footnote 9 in the article" title="Return to footnote 9"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">9</span></a><p>The rough math is: 44 unique heroes x 109 unique cards x 55 unique spells x 76 unique treasures x 17 turns, the duration of an average game x 3-4 decisions per turn x 20 ways a decision can mutate the game state. Battles, the core mechanic of the game, are also inherently non-deterministic, with O(thousands) of possible outcomes per board configuration.</p></li>
    <li id="fn-10" tabindex="-1"><a class="footnote-backref" href="#fnref-10" aria-label="Return to footnote 10 in the article" title="Return to footnote 10"><svg class="footnote-return-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7 4 12l5 5M5 12h8a6 6 0 0 1 6 6"/></svg><span aria-hidden="true">10</span></a><p>After all, Anthropic has restricted its competitors from using its products for ~2 years, but access can be easily laundered through intermediaries. Both stated that making an automated AI researcher would be a key strategic pillar for each of them</p></li>
  </ol>
</section>

<section class="post-comments" aria-labelledby="post-comments-title">
  <p class="post-comments-kicker">Comments</p>
  <h2 id="post-comments-title">Join the conversation</h2>
  <p>Questions, counterarguments, private benchmarks of your own—I’d love to hear them. Reply on X, or browse the latest conversation below.</p>
  <a class="post-comments-action" href="https://x.com/intent/post?text=Thoughts%20on%20Nick%27s%20FableBrawl%20software%20kitchen%3A&amp;url=https%3A%2F%2Fthenickhuber.com%2Fvibe-coding-my-favorite-defunct-game%2F" target="_blank" rel="noopener">Comment on X <span aria-hidden="true">↗</span></a>
  <div class="post-x-feed">
    <a class="twitter-timeline" data-height="560" data-theme="light" data-chrome="noheader nofooter noborders transparent" href="https://twitter.com/nhuber">Posts by @nhuber</a>
  </div>
  <p class="post-comments-note">The feed is loaded from X and may require their cookies. If it doesn’t appear, <a href="https://x.com/nhuber">open @nhuber on X</a>.</p>
</section>

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

<script>
  (() => {
    const buttons = [...document.querySelectorAll(".sound-button")];
    let activeButton = null;

    const resetButton = (button) => {
      if (!button) return;
      button.classList.remove("is-playing");
      button.setAttribute("aria-pressed", "false");
      button.querySelector(".sound-status").textContent = "Play";
    };

    const stop = (button, rewind = true) => {
      if (!button) return;
      const audio = document.getElementById(button.dataset.audio);
      audio.pause();
      if (rewind) audio.currentTime = 0;
      resetButton(button);
      if (activeButton === button) activeButton = null;
    };

    buttons.forEach((button) => {
      const audio = document.getElementById(button.dataset.audio);
      audio.addEventListener("ended", () => stop(button));
      button.addEventListener("click", async () => {
        if (activeButton === button && !audio.paused) {
          stop(button);
          return;
        }
        if (activeButton) stop(activeButton);
        activeButton = button;
        button.classList.add("is-playing");
        button.setAttribute("aria-pressed", "true");
        button.querySelector(".sound-status").textContent = "Stop";
        try {
          await audio.play();
        } catch {
          stop(button);
          button.querySelector(".sound-status").textContent = "Unavailable";
        }
      });
    });
  })();
</script>

<script>
  (() => {
    const images = [...document.querySelectorAll(".prose img")];
    if (!images.length) return;

    const lightbox = document.createElement("div");
    lightbox.id = "image-lightbox";
    lightbox.className = "image-lightbox";
    lightbox.hidden = true;
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Full-screen image viewer");

    const closeButton = document.createElement("button");
    closeButton.className = "image-lightbox-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close full-screen image");
    closeButton.textContent = "×";

    const stage = document.createElement("div");
    stage.className = "image-lightbox-stage";
    const media = document.createElement("div");
    media.className = "image-lightbox-media";
    const fullImage = document.createElement("img");
    fullImage.className = "image-lightbox-image";
    const caption = document.createElement("p");
    caption.className = "image-lightbox-caption";

    media.append(fullImage);
    stage.append(media, caption);
    lightbox.append(closeButton, stage);
    document.body.append(lightbox);

    let activeImage = null;
    let priorPaddingRight = "";
    let backgroundStates = [];

    const imageCaption = (image) => {
      const figureCaption = image.closest("figure")?.querySelector("figcaption")?.textContent.trim();
      return figureCaption || image.getAttribute("alt")?.trim() || "";
    };

    const closeLightbox = () => {
      if (lightbox.hidden) return;
      lightbox.hidden = true;
      document.body.classList.remove("image-lightbox-open");
      document.body.style.paddingRight = priorPaddingRight;
      backgroundStates.forEach(({ element, wasInert }) => { element.inert = wasInert; });
      backgroundStates = [];
      fullImage.removeAttribute("src");
      fullImage.style.removeProperty("filter");
      activeImage?.focus({ preventScroll: true });
      activeImage = null;
    };

    const openLightbox = (image) => {
      activeImage = image;
      const text = imageCaption(image);
      fullImage.src = image.currentSrc || image.src;
      fullImage.alt = image.alt || text;
      fullImage.style.filter = image.closest(".post-figure-lightened") ? "brightness(1.35)" : "";
      caption.textContent = text;
      caption.hidden = !text;
      priorPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
      backgroundStates = [...document.body.children]
        .filter((element) => element !== lightbox)
        .map((element) => ({ element, wasInert: element.inert }));
      backgroundStates.forEach(({ element }) => { element.inert = true; });
      document.body.classList.add("image-lightbox-open");
      lightbox.hidden = false;
      closeButton.focus({ preventScroll: true });
    };

    images.forEach((image) => {
      const text = imageCaption(image);
      image.dataset.lightboxReady = "true";
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-haspopup", "dialog");
      image.setAttribute("aria-controls", lightbox.id);
      image.setAttribute("aria-label", `View full screen: ${text || image.alt || "image"}`);
      image.addEventListener("click", (event) => {
        event.preventDefault();
        openLightbox(image);
      });
      image.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openLightbox(image);
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    fullImage.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox || event.target === stage || event.target === media) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
    });
  })();
</script>
