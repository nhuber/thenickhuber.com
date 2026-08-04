---
title: "I vibe-coded my favorite defunct game in seven days."
date: 2026-08-03
legacyCanonical: "https://thenickhuber.com/vibe-coding-my-favorite-defunct-game"
slug: "vibe-coding-my-favorite-defunct-game"
---

<h2 class="post-deck">Most of my “users” were bots.</h2>

For the past 18 months, I have had a private benchmark for coding agents: can they rebuild my favorite defunct game? (An autobattler called [Storybook Brawl](https://en.wikipedia.org/wiki/Storybook_Brawl), that imploded after the FTX bankruptcy, which occurred a few months after acquiring the game’s studio).

Every few months, I have tried again with the newest tools – in early 2025, with Cursor and Sonnet 3.7, in late 2025 with Claude Code and Opus 4.5, at some point I spent a weekend hacking on a Lovable project with I think GPT-5, and more recently with a combination of both Codex and Claude Code.

Earlier attempts were impressive until they weren’t. I could get a basic template of something running, but complex interactions – the real meat of any strategy game – eventually became impossible. The agent would confidently tell me a change was finished when it either hadn’t worked or had broken three unrelated things. It was tantalizingly, agonizingly close – but no cigar.

This time, I can say that this benchmark is basically saturated. This is my journey.

## FableBrawl: an overview

In roughly seven days of full-time work, I built FableBrawl as a [website](https://fablebrawl.com/) and an iOS app. It has Google and Apple sign-in, subscriptions through Stripe, a Vite-based game client, Postgres on Railway, deployment through GitHub Actions and Vercel, activation emails through Resend, analytics logs in Cloudflare R2, and a staging environment where I could test changes before shipping them. I had heard of most of these tools before but had never built on top of them; I can’t in full honesty say I still understand what all of them do, except to say that “it works.”<sup><a href="#fablebrawl-note-1" aria-label="Go to footnote 1">1</a></sup> I felt especially seen when Stripe’s onboarding flow had specific hooks for building with coding agents.

<figure class="post-figure post-figure-wide">
  <img src="/assets/fablebrawl-system-architecture.png" alt="Diagram of the FableBrawl web app, iOS app, shared game core, Railway backend, storage, providers, and operations">
  <figcaption>The production architecture behind FableBrawl.</figcaption>
</figure>

<p class="post-footnote" id="fablebrawl-note-1"><sup>1</sup> <a href="https://hooverpresidentialfoundation.org/speeches/engineering-as-a-profession/">“Engineering as a Profession,” Herbert Hoover Presidential Library Foundation</a></p>

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
      <span class="sound-meta"><strong>Main menu theme</strong><small>Background music · 1:00</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-card" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Move a card</strong><small>Shop interaction · 0:01</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-buff" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Monster gets a buff</strong><small>Power-up · 0:01</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
    <button class="sound-button" type="button" data-audio="fablebrawl-audio-spell" aria-pressed="false">
      <span class="sound-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 10v4h3l4 4V6L8 10H5Zm10.4 2a3.4 3.4 0 0 0-1.7-2.95v5.9A3.4 3.4 0 0 0 15.4 12Zm-1.7-7v2.1a5.5 5.5 0 0 1 0 9.8V19a7.5 7.5 0 0 0 0-14Z"/></svg></span>
      <span class="sound-meta"><strong>Cast Fireball</strong><small>Spell effect · 0:01</small></span>
      <span class="sound-status" aria-live="polite">Play</span>
    </button>
  </div>
  <audio id="fablebrawl-audio-menu" preload="none" src="/assets/fablebrawl-menu-theme.mp3"></audio>
  <audio id="fablebrawl-audio-card" preload="none" src="/assets/fablebrawl-card-move.mp3"></audio>
  <audio id="fablebrawl-audio-buff" preload="none" src="/assets/fablebrawl-monster-buff.mp3"></audio>
  <audio id="fablebrawl-audio-spell" preload="none" src="/assets/fablebrawl-fireball.mp3"></audio>
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

It was especially fun to build suggestions from players in a few hours while they were still playing, like a Mortal Kombat-style “killing blow” cutscene that wasn’t even in the original game.

<figure class="post-figure post-figure-wide">
  <img src="/assets/fablebrawl-killing-blow.gif" alt="Animated FableBrawl killing-blow cutscene where Merlin defeats Grandmother with arcane lightning">
  <figcaption>A player suggestion, built and shipped while people were still playing.</figcaption>
</figure>

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
