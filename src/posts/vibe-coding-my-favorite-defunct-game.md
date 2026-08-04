---
title: "I vibe-coded my favorite defunct game in seven days. Most of my “users” were bots."
date: 2026-08-03
legacyCanonical: "https://thenickhuber.com/vibe-coding-my-favorite-defunct-game"
slug: "vibe-coding-my-favorite-defunct-game"
---

<p class="post-deck">What FableBrawl taught me about AI coding agents, verification, and the stubborn importance of distribution.</p>

For the past 18 months, I have had a private benchmark for coding agents: can they rebuild my favorite defunct game? (An autobattler called Storybook Brawl, that imploded after the FTX bankruptcy).

Every few months, I have tried again with the newest tools – in early 2025, with Cursor and pygame, in late 2025 with Claude Code and Opus 4.5, and more recently with both Codex/Claude Code.

Earlier attempts were impressive until they weren’t. I could get a basic game running in higher and higher fidelity, but complex interactions – the real meat of any strategy game – eventually became impossible to iterate on. The agent would confidently tell me a change was finished when it either hadn’t worked or had broken three unrelated things.

This time, the benchmark seems basically saturated. This is a writeup of my journey.

In roughly seven days of full-time work, I built [FableBrawl](https://fablebrawl.vercel.app/) as a website and an iOS app. It had Google and Apple sign-in, subscriptions through Stripe, a Vite-based game client, Postgres on Railway, deployment through GitHub Actions and Vercel, activity emails through Resend, logs in Cloudflare R2, and a staging environment where I could test changes before shipping them.

Every build ran about 400 automated tests. I made an admin dashboard to grant subscriptions and monitor live usage. The game had two visual modes: high-fantasy art from OpenAI image models and MS Paint-style placeholder stick art for the surprisingly vocal anti-AI set.

<figure class="post-figure">
  <img src="/assets/fablebrawl-system-architecture.jpg" alt="Diagram of the FableBrawl web, iOS, backend, storage, and operations architecture">
  <figcaption>The production architecture behind FableBrawl.</figcaption>
</figure>

This wasn’t a weekend mockup. It was a real piece of software with all the unglamorous plumbing that “I built an app with AI” demos usually leave out.

<figure class="post-figure">
  <img src="/assets/fablebrawl-web-home.jpg" alt="FableBrawl web home screen in Rough Draft art mode">
  <figcaption>FableBrawl on the web, in its default Rough Draft art mode.</figcaption>
</figure>

<figure class="post-figure post-figure-phone">
  <img src="/assets/fablebrawl-ios-home.jpg" alt="FableBrawl iOS home screen on an iPhone">
  <figcaption>The native iOS app uses the same shared game core.</figcaption>
</figure>

## What actually changed

The biggest unlock wasn’t a single model. It was the workflow around the models.

Speech-to-text is now good enough that, with a cheap dedicated microphone, I can talk about three times faster than I can write. That changes how much context I’m willing to give an agent and how quickly I can correct it. Codex voice mode, computer use, and the in-app browser made it possible to work across more of the product loop. Claude Code’s Git workflow and Claude Design helped with implementation and the design system.

Fast modes were genuinely useful, but the economics still felt odd. My rough experience was about 50% more speed for 2.5 times the quota. That is wonderful when I’m blocked and hard to justify as a default.

The fun surprised me, too. Building this way is extremely enjoyable. You can move from an idea to a working interaction fast enough that the feedback loop starts to feel like play.

## The agents were amazing at breadth—and unreliable at closure

AI was excellent at getting a huge surface area into place: integrations, tests, deployment, operational tools, bug-fixing loops, and a first pass at the game’s opponents. With almost no steering, the AI opponents were already better than the original game’s. But when I tried to improve them further, progress mostly stopped.

That pattern showed up everywhere. The agents could make a feature look 90% finished astonishingly quickly. The dangerous part was the final 10%: interactions between systems, regressions, and the gap between “the code changed” and “the feature works.”

The practical response was not better prompting. It was verification: staging, automated tests, isolated changes, and actually trying the feature after the agent declared victory. AI’s superpower is getting you to version one. Its failure mode is making you believe version one is finished.

## The least technical lesson was the most important

The reaction to AI in gaming was stark. People had much stronger feelings about AI-assisted games than I expected. The fact that AI helped make the game was not automatically a benefit to players; for some, it was a reason to distrust it.

Then there was distribution. I dramatically overestimated how many people were looking for this game. One Reddit thread reached 43 upvotes, but I couldn’t turn that moment into sustained growth.

For a while, I thought I had around ten daily active users. Then I realized seven of them were bots. I still don’t know why anyone was botting my tiny game, but it was an efficient way to learn not to confuse activity with demand.

AI made the software radically cheaper to produce. It did not make attention cheaper, trust automatic, or distribution optional.

## What I learned

1. **The bottleneck moved.** Implementation is no longer the only scarce resource. Judgment—what to build, what “done” means, and what is worth polishing—matters more.
2. **Verification is part of the product.** If an agent can change three systems at once, tests and staging are not enterprise ceremony. They are how a solo builder keeps speed from turning into chaos.
3. **Better interfaces matter as much as better models.** Voice, computer use, browser control, Git ergonomics, and design tools changed my throughput more than a benchmark score could explain.
4. **Distribution is still everything.** AI can compress months of development into days, but it cannot force people to care. If anything, when building becomes abundant, taste, trust, positioning, and audience become more valuable.
5. **Personal benchmarks are useful.** Rebuilding the same difficult thing every few months gave me a much clearer picture of progress than watching model demos. This was the first time the tools crossed the line from “promising prototype” to “I can actually ship this.”

## Putting a pin in it

So this post is me putting a pin in FableBrawl.

It did not become a hit. It did become a benchmark I finally cleared, a real artifact I can point to, and one of the fastest ways I’ve found to understand where AI-assisted software development is actually going.

The most important question is no longer, “Can AI help me build this?” It is, “Now that I can build almost anything, what is actually worth building?”

If you build with coding agents, what’s your private benchmark?
