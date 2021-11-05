---

layout: post
title: "Some learnings from my first side-project"
date: 2020-11-05 19:00:00 +0530
categories: Code
excerpt: Just a list of some miscellaneous learnings from my first product built with Next.js, TailwindCSS and Supabase.

---

The idea started with building an analytics app for Twitter.
I had no idea of Twitter API, or analytics or anything, 
I just wanted to build something from the things I had
recently learned, like Next.js and TailwindCSS and dive deeper in both.

Long story short, after playing with Twitter API and
multiple fails to push a bare version, I ended up working
on a full-fledged Twitter app. Yes, all using Twitter's data I started building
timelines, tweet compose and all the basic features Twitter has.
**The idea was not to clone but to make my version** of Twitter
with all the features I wanted and simpler and cleaner UI.

3 months into all this development in side I was able to put up
a usable version of [Kizie](https://kizie.co), heck I liked the idea
of where it was going and it gave me a reason to wake up to (literally).

Fast forward to now I sent the last commit to Kizie just couple minutes ago.
I'm using it as a Twitter replacement but for some things like Messages, 
to check Notifications for likes and follows etc. The reason for this is because
Twitter API's current state is very aggressive in terms of rate-limits and scope
(this topic can be another blog post in itself).

So here are some of the things I've learnt in this journey of 6 months or so.

## Build things for fun to learn

This project started as a fun project with sole-purpose of learning,
it grew on me so much that I pushed myself into learning Stripe integration,
crazy animations, Node.js and much more.

## Build in Public

![Tweet on TailwindCSS](/images/posts/kizie-learnings/tailwind-tweet-kizie.jpg)

My plan was to share all the learnings and experiments 
[on my Twitter](https://twitter.com/thelifeofrishi) while I was working on Kizie.
One day I experimented with a multi-pane modals and [shared a video of it on Twitter](https://twitter.com/thelifeofrishi/status/1411547063095988231?s=20).

This tweet of mine went places and was RTed by [@TailwindCSS](https://twitter.com/TailwindCSS) folks. This tweet alone helped me connect with some amazing
devs and designers on Twitter. Currently that tweets is standing 
on **over 140K impressions, more than a thousand likes** and **got me 100s of new followers**.

Another good thing about building in public is that you get a lot of
feedback from great people and it really helps.

## Organic Traffic is important

Side Projects are easy to build and 
just as easy to abandon. It takes a lot of effort to generate decent MRR
from a side-project. Although it wasn't my goal with Kizie, 
I've learned that organic traffic is very important. 
You can share your project on ProductHunt, HackerNews etc. and get a lot of
temporary traffic, but a lot of that traffic is one time. 
To make money out of your project you have to build a source of traffic,
or a marketing channel to keep the growth. I started with making public profiles on Kizie and optimize those pages for Search Engines 
so they can get indexed and maybe rank good, help with traffic some day.

## Technical learnings

- **`fetch` is powerful and RAW** : After sucking Twitter API like a JavaScript bee,
I've learnt that `fetch` requests are an amazing invention. 
But it's important to calculate your budget for whether to use `fetch` or `axios`
or some other tool to make API calls. In case of Kizie, `fetch` requests are all over
the places, from `util` function to workers etc. I could've reduced and simplified 
a lot of code if I had gone with `axios` or recently discovered [ohmyfetch](https://github.com/unjs/ohmyfetch).

- **Consider Virtual Lists/Windowing before implementation**: 
I was talking to Chirag few days back and 
he mentioned how lists got slow in one of the apps he's working on.
Although his issue was because of loading tons of image 
which made his RN app slow. It reminded me of my situation with Kizie.
Kizie is full of lists of tweets, loading in traditional mapped list
is what I started with but over time the app started to have memory 
and performance issues. The only solution was to use Virtual List
but I had already done my component to load individual tweets etc.
Personally I feel most Virtual Lists libraries are very complicated
to implement because of the way they work. And using those libraries
with the components I've already spent a lot of time building was a
tedious task. Learning is to plan such things accordingly before implementation.

- **Learn Backend**: I've thought about it multiple times in last couple months. Node.js as backend didn't cut well for Kizie. 
Having a proper backend would've helped me build even faster
and performant Kizie.

- **Use Web and Service Workers**: Web Workers can really help in performance
by offloading the processing in separate thread. 
This also helps in preventing UI blockers and glitching 
while processing complex JavaScript.
Service Workers are useful in caching data, using both in Kizie has
helped gain some significant performance benefits.

And there are bunch of small things I've learnt while building this app and still learning. 
It all got possible because of the curiosity of building and trying.
I'm glad I started with Kizie, I'm planning to start working on a new
side-project idea, in parallel I'll continue improving Kizie.