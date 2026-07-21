---
title: "Quantified Self, a Decade in Review"
date: 2026-01-13
legacyCanonical: "http://thenickhuber.com/quantified-self-a-decade-in-review"
slug: "quantified-self-a-decade-in-review"
---
Ten years ago, the ‘quantified self’ movement promised that individual telemetry + data analysis would provide meaningful health, wellness & self-reflection outcomes. \[1\] I was an early user of products that were cutting edge at the time like Mint & RescueTime, but they were limited tools and made little to no impact on my life. With OpenAI and Anthropic announcing purpose-built, AI-driven, vertical health products this week, I think it’s worth taking a minute to understand why AI could be such a gamechanger here.

## The Accidental Gift of Regulation <a href="#the-accidental-gift-of-regulation_2" class="head_anchor">#</a>

In 2018, the European Union passed the General Data Protection Regulation. The headlines were about consent forms and cookie banners. \[2\] But buried in Article 20 was something more interesting: the right to data portability. Companies of a certain size/scale had to let you download your own data in a machine-readable format.

This was expensive for BigTech. Really expensive. Every major platform had to build export pipelines, format converters, documentation. Facebook alone probably spent tens of millions of engineering hours on compliance. The original intent was to let users switch between competing services, which hasn’t really happened. \[3\]

But an unintended consequence of this regulation is that while human data analysts don’t typically like writing long, one-time schema definition pipelines and caring about the difference between Postgres’s implementation of timestamps vs. BigQuery’s, AIs will happily do it for you and are really good at \[human / machine\] language translation.

## A Thing That I Did <a href="#a-thing-that-i-did_2" class="head_anchor">#</a>

Over the past few weeks I’ve been uploading my data exports to Zo Computer, a new tool built by @0thernet and @perceptnet and letting it build queryable databases. \[4\]

Here’s the datasets about myself that I can now access in a natural language interface:

- **Spotify** (2012-2025): 180,150 (!) plays across 14 years. Every song, timestamp, device, and skip. \[5\]
- **Amazon** (2005-2025): 20 years of purchase history, plus Audible listening, Prime Video watching, and Kindle reading sessions. 1,855 orders total.
- **Twitter** (2009-2026): Every tweet, like, and follow from the past 17 years.
- **Facebook** (2009-2025): 16 years of posts, reactions, and event responses.
- **Google** (YouTube, Chrome, Maps): 30,000+ YouTube videos watched, browser history, map reviews.

Combined, this is probably the most complete record of my digital existence that’s ever been assembled in one place. **And I can just ask questions about it**.

These models – or perhaps more appropriately said, “their cousins” – are awesome at looking at a cookie trail to understand what I might buy, so why not use them to learn something about myself?

## Things I Learned About Myself <a href="#things-i-learned-about-myself_2" class="head_anchor">#</a>

The factoids that emerged were strange and specific in ways no year-in-review summary would ever surface:

- **I have listened to 337 days of music on Spotify.** Nearly a full year of my life, accumulated over 14 years. 8,087 hours. My pandemic year (2020) alone was 956 hours, almost triple my typical year.
- **My most-played song ever is “Go the Distance” from Hercules.** 262 complete plays. I value crisp execution and pushing through adversity so it makes sense. Disney soundtracks and musical theater are threaded throughout my top tracks in ways I wouldn’t have predicted.
- **I almost never skip Queen.** 98% completion rate. Every other artist, I skip sometimes. Freddie Mercury gets my full attention, I guess. Aaaaaayyyyyy-ooooooo
- **I’ve spent \$79,839 on Amazon over 20 years** with a noticeable \$/year peak this last year after we moved back to the US. First order: October 7, 2005. That’s not counting the 978 hours of audiobooks I’ve listened to through Audible, which is a separate number that slightly terrifies me.
- **My Twitter peak was 2011.** 689 tweets that year. Now I post about 80 per year. The arc of my social media engagement is visible in a single query.
- **I’ve only ever used the “angry” reaction on Facebook three times.** Out of 5,321 total reactions. 93% of my reactions are plain likes. I am, statistically, a mild person online \[6\]
- **\[Sensitive findings redacted\]**. A bunch of things I don’t want to be on the public internet.

## A Promise, Long-Delayed but Finally Delivered <a href="#a-promise-longdelayed-but-finally-delivered_2" class="head_anchor">#</a>

A decade ago, getting these answers would have required writing custom parsers for each platform’s export format, loading them into a database, and writing SQL queries. Maybe 40 hours of work for a motivated, well-caffeinated, technical person. Impossible for everyone else – and frustrating for most data analysts tbqh.

Now I drag a zip file into a chat window, wait maybe 5 mins, and ask questions in English.

The GDPR forced companies to build the export pipelines. They did so grudgingly, and the exports are often messy (Twitter gives you JavaScript files, YouTube gives you HTML, Facebook’s export is pretty incomplete). But the data exists, and language models are remarkably good at parsing weird formats and answering natural language questions about structured data.

This feels like the version of quantified self that was always promised but never delivered. Not just step counts, but your whole digital footprint, queryable.

## What Comes Next <a href="#what-comes-next_2" class="head_anchor">#</a>

I don’t think most people will do this. Downloading exports is still tedious – the most annoying part is waiting days for the data job to run and catching the email returned. The interfaces aren’t seamless. And maybe a lot of people don’t want to know that they’ve spent 337 days listening to music or \$80,000 on Amazon.

But for those who do want to know, the tools now exist. Regulation intended to constrain tech companies’ monopolistic powers accidentally created the substrate for personal data analysis that I think is just the beginning.

The result is that your data, which was always yours in theory, is finally becoming yours in practice. But again, I think this is just the beginning – especially when we consider, for a moment, health.

There is so much structured data in health that is interesting, valuable, sensitive, high-signal, predictive, etc. etc. From ICD-10 diagnostic codes to hormone levels to genetic markers. Of course, it’s high-stakes stuff – for the individual, insurance companies, and doctors – and all subject to HIPAA (in the US), but the fact that the two biggest labs are heavily investing in this space tells me they agree with my diagnosis.

The quantified self, a decade later, finally has the tooling to match the ambition. I still believe it will take us to a better place, newly catalyzed by AI, but let’s leave the doomer-or-pollyanna discussion for another day.

------------------------------------------------------------------------

\[1\] <https://karpathy.github.io/2014/08/03/quantifying-productivity/>

\[2\] I still chuckle at <https://x.com/Altimor/status/2003019102777172360>

\[3\] If EU regulators understood internet economics, this probably should have been predictable at the time but c'est la vie

\[4\] There are a bunch of pre-built prompts specific for different BigTech services that Zo lists publicly, but Opus 4.5 is also great at doing ones that don’t have pre-built prompt pipelines if you just talk to it

\[5\] Thanks Spotify! This was by far the most interesting dataset because (a) music is such a high-baud channel and (b) it goes back to the very beginning of my account’s life. I think this is perhaps because (i) Spotify is a European company so perhaps is pro-regulation and (ii) listening history isn’t very sensitive data if it were to leak

\[6\] Or want to appear as one (I suspect) :-\]
