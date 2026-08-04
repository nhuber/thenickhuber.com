---
title: "A tour inside the kitchen of my software restaurant"
date: 2026-08-03
legacyCanonical: "https://thenickhuber.com/vibe-coding-my-favorite-defunct-game"
slug: "vibe-coding-my-favorite-defunct-game"
---

<h2 class="post-deck">How I vibe-coded my favorite defunct game in seven days, but most of my “users” ended up being bots.</h2>

For the past 18 months, I have had a private benchmark for coding agents: can they rebuild my favorite defunct game? (An autobattler called [Storybook Brawl](https://en.wikipedia.org/wiki/Storybook_Brawl), which imploded after being acquired by FTX).

Every few months, I have tried again with the newest tools – in early 2025, with Cursor and Sonnet 3.7, in late 2025 with Claude Code and Opus 4.5, at some point I spent a weekend hacking on a Lovable project with I think GPT-5, and more recently with a combination of both Codex and Claude Code.

Earlier attempts were impressive until they weren’t. I could get a basic template of something running, but complex interactions – the real meat of any strategy game – eventually became impossible. The agent would confidently tell me a change was finished when it either hadn’t worked or had broken three unrelated things. It was tantalizingly, agonizingly close – but no cigar.

This time, I can say that this benchmark is basically saturated. This is my journey.

## FableBrawl: an overview

In roughly seven days of full-time work, I built FableBrawl as a [website](https://fablebrawl.com/) and an iOS app. It has Google and Apple sign-in, subscriptions through Stripe, a Vite-based game client, Postgres on Railway, deployment through GitHub Actions and Vercel, activation emails through Resend, analytics logs in Cloudflare R2, and a staging environment where I could test changes before shipping them. I had heard of most of these tools before but had never built on top of them; I can’t in full honesty say I still understand what all of them do, except to say that “it works.” I felt especially seen when Stripe’s onboarding flow had specific hooks for building with coding agents.

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

I made an admin dashboard to grant free subscriptions and monitor live usage. I built a comprehensive logging suite and in-app bug reporting feature. Every build ran about 400 automated tests, about 100 I told the coding agent to write and about 300 I had it make for itself. I’m not a SWE so I don’t really know if these are good tests, but they seemed to catch some regressions.

<figure class="post-figure post-figure-wide">
  <img src="/assets/fablebrawl-live-court.png" alt="FableBrawl Live Court admin dashboard showing one current player and daily active users, with suspected bots excluded">
  <figcaption>The Live Court dashboard separated likely humans from suspected bot traffic.</figcaption>
</figure>

Above all, I was able to faithfully and accurately resurrect the core game mechanics of my favorite defunct game with all of its crunchy, tactical decisions in an appropriate, high-fantasy setting – and be able to play on a live multiplayer server with other people!

<div class="player-reactions" aria-label="Player reactions to FableBrawl">
  <img src="/assets/fablebrawl-player-pix.png" alt="A Discord player says they had a lot of fun playing FableBrawl and reporting bugs">
  <img src="/assets/fablebrawl-player-wait4godot.png" alt="A Discord player says they will check out FableBrawl">
  <img src="/assets/fablebrawl-player-house.png" alt="A Discord player praises the quick turnaround and says maybe AI deserves a wink">
</div>

It was especially fun to build suggestions from players in a few hours while they were still playing, like a Mortal Kombat-style “killing blow” cutscene that wasn’t even in the original game. Also, the in-game AI opponent (with no specific steering or customization – more on this later as well) was significantly better than what shipped with the original game.

<figure class="post-figure post-figure-wide">
  <img src="/assets/fablebrawl-killing-blow.gif" alt="Animated FableBrawl killing-blow cutscene where Merlin defeats Grandmother with arcane lightning">
  <figcaption>A player suggestion, built and shipped while people were still playing.</figcaption>
</figure>

## A peek inside my software kitchen

There is a heated debate on Twitter right now over if “software factories” – the idea of agents autonomously, continuously building high-quality software – are real or not. I’m not an expert, but what I will say is that my experience working with these agents felt more like running a slightly chaotic, but happy family restaurant than operating a factory.

Overall, my biggest takeaway is – damn, it’s fun to build! The amount of iteration you’re able to do in just a few minutes or a single session made me always want to put more time into it, similar to that feeling of starting a new video game captured perfectly by ProZD:

<div class="video-embed">
  <iframe src="https://www.youtube-nocookie.com/embed/D7aotMarYQU" title="ProZD video about starting a new game" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

At the same time, it was slightly chaotic because most of the time I was context-switching across ~20 threads to keep myself from being the rate-limiting factor towards progress, which ranged from making game assets to ruling on mechanic nuances to polishing the UI/UX to testing the game features. I enjoyed it when I had a few minutes to take a breath while waiting for “big dishes” to be ready, when I could more peacefully refine “would be nice” small touches that any small business owned and operated on passion has.

In terms of my tool stack journey, I initially started exclusively with Claude Code because I wanted to try Fable 5 and the desktop app’s Git UI/UX gave me comfort about tracking what was done vs. in-progress. I initially only started to use Codex because I wanted to use its image tool without paying the API costs; eventually, I realized its in-app browser is way better than Claude’s and truly valuable for automating work that needs to be logged into a website, like configuring Stripe or submitting to the App Store.

A game-changing, utterly magical moment was being able to use OpenAI’s new duplex voice model to fully control my computer remotely and build ~5-7 major features while in my car. I was waiting at a doctor’s office for about 45 minutes and what previously would’ve been a frustrating experience turned into one of my most productive work sessions, in no small part because the ChatGPT app has a great CarPlay integration.

Codex still has room to improve: it needs better syncing of mobile/remote sessions to the desktop app, richer thread management, and I still find the in-app partition across Chat/Work pretty crude, but the foundation is incredibly strong. I wouldn’t be surprised to see Codex/OpenAI pull away from Claude Code on code generation in the next few months – perhaps not in terms of revenue since ~80% of Claude Code’s revenue is likely longer-term enterprise contracts, but certainly in terms of developer traction and feature superiority. For someone at my level of software engineering, or at least for the tasks I was jamming on, I couldn’t see a discernible difference in the quality of Sol Max and Fable’s output, so the native, end-to-end voice form factor is a true differentiator for me.

My end-state setup that I think will become more common for people was to have my main machine always plugged in at home or the office, set to never sleep, and logged into all critical web-based services. This then gave me the flexibility to do anything from my phone via a remote connection that I could do physically sitting at my desk, as long as I could verbalize what I wanted. By the end of this project, I was probably logging ~75% of my contributions from my phone vs. at my desk – in part because I was on a vacation in the middle, but I could also see this as a way to get outside, exercise, and spend more time in nature. I always had more ideas while walking, showering, or waiting in line – and now building immediately in-state is just a short voice-transcribed note away. It felt like having not just an executive assistant, but also a team of engineers, designers, and data scientists.

Speaking of voice – have you joined the voice revolution yet? While I still love quietly typing my thoughts out (as I’m doing now), for most practical tasks it’s ~3x faster to dictate it and speech-to-text models have gotten so accurate and cheap that you’re just leaving time on the table if you’re not using them. My setup is a simple dedicated Bluetooth mic that clips to my shirt and WisprFlow because I like to have custom overrides stored for technical, easy-to-conflate words, but I don’t even think this is the ultimate end-state here. I plan to help my 6-year-old build a software game with me and Codex, in part to see how she interacts with the computer by talking to it, unburdened by the decades of hard-wired habits that are still in my brain.

<div class="post-media-pair post-media-pair-even" aria-label="Two posters encouraging people to talk to their computers">
  <figure class="post-figure">
    <img src="/assets/fablebrawl-talk-to-computer.png" alt="Vintage poster saying Do your part: Talk to your computer">
  </figure>
  <figure class="post-figure">
    <img src="/assets/fablebrawl-talk-to-computer-more.png" alt="Vintage poster saying You probably should be talking to your computer more">
  </figure>
</div>

The most “factory-like,” or at least “production-line,” aspect of my humble software restaurant was my bug reporting and resolution workflow. I knowingly shipped the game in a barely working state, because even as such I expected some people would want to play it, it was still fun, and we could collaboratively iron out the game engine together – rather than relying on me laboriously testing different interactions. Over the course of ~3 days, we received ~100 bug reports – at first in Discord messages but eventually via an in-app reporting flow that also serialized the game state in the report. After about a day of responding to emails myself, I realized about 90% of the time I was just copying and pasting the report into the coding agents verbatim, and so built a Claude Code routine where every hour it would read the bug reports from hello@fablebrawl.com and automatically resolve them as long as they were low- to medium-risk and didn’t have any ambiguity. The community seemed to really like how quickly their issues were addressed (average resolution time of ~3h), and even received an agent-written email explaining the resolution as a sort of checksum to ensure we fixed it correctly.

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

A few final thoughts for other aspiring software restauranteurs:

- Codex Fast mode feels meaningfully faster, but consumes quota way too quickly to be worth it – it’s perhaps 50% faster but for what felt like 2.5x quota drawdown.
- This is especially relevant since Codex (unlike Claude) doesn’t give discounts for large usage-credit purchases if you ever run over your weekly quota.
- In the first few days, I spent a bunch of time maximizing use of screen real estate on web, mobile web, and iOS because it was fun to get that immediate gratification, but in retrospect once you’re trying to maintain consistently across multiple surfaces, it’s important to have colors, padding, spacing, fonts, iconography, etc. canonically defined somewhere.
- I think the best current way to do this is to have Claude Design make a design system for you that you approve, but I can’t verify this because I only did this after the fact, when I basically had gotten everything looking how I wanted it to.
- The killer features here are being able to drop a comment associated with a location on the screen, just like you’d rev a mockup with a designer, and even draw on the screen to communicate sizings and locations visually.

## Community response

The reaction to AI in gaming was stark and surprising. The question people kept coming back to was not how the game worked, but who made its art.

<figure class="post-figure post-figure-compact">
  <img src="/assets/fablebrawl-ai-art-reaction.png" alt="A Discord user asks who did the art for FableBrawl">
  <figcaption>The most revealing question in the community response.</figcaption>
</figure>

This wasn’t unique to FableBrawl. You could see the same fault line in discussions around [Sludgineers](https://www.reddit.com/r/incremental_games/comments/1tyw6ef/sludgineers_releasing_august_25th_pt/) and a [global supply-chain simulation](https://www.reddit.com/r/tycoon/comments/1v3dl5b/my_global_supplychain_sim_factory_default_build/). One attempt to share FableBrawl in a Discord was deleted because of conflicts of interest.

What I find funny about this is that no one asked if the code running the game was AI-generated, whether the opponents were AI-assisted, or whether AI was responding to their bug reports. The invisible automation was judged by whether it worked; the visible automation became a statement about values.

Distribution is still everything. I really overestimated how many people were looking for this game. [One Reddit thread](https://www.reddit.com/r/StorybookBrawl/comments/1v5vigc/comment/ozz1jvw/?context=1&screen_view_count=2) got 43 upvotes, but I couldn’t grow much beyond that.

I thought I had ~10 daily active users, but realized seven of them were bots. I don’t know why my game was being botted, either.

<p class="post-closing-question">If you build with coding agents, what’s your private benchmark?</p>

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
