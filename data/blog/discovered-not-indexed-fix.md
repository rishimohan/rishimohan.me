---

layout: post
title: How I fixed "Discovered not indexed" issue in Google Search
date: 2022-01-03 13:00:00 +0530
categories: personal
excerpt: It's not uncommon to have some of your sitemap links to not be indexed in Google search. Google tags these links as "Discovered not indexed". Here's how I fixed the issue and got my links indexed in Google search.

---

![](/images/posts/google-search-console-sitemap.png)

After you submit your sitemap in Google Search Console,
Google crawls each URL from submitted sitemap and 
decides whether to index the links in 
its search results or not. Google doesn't share a clear idea of
how it decides whether to index a link or not, 
and hence it's a tricky problem to resolve the issue
of indexing the URLs that Google doesn't index.

## What is "Discovered not indexed"?

"Discovered not indexed" links are those links which
Google knows that exists and has crawled, but Google
thinks the link is not good enough to be indexed 
in the search results. At least that's what the understanding
I and some people have about it.

You can submit such links or force Google to crawl
the links again through **URL Inspection tool** but its' not going to work.
At least it didn't work in my case and 
Google also has it mentioned in their docs.

## How I fixed it and got links indexed in search results?

In my case, I had worked on some tools in one of my side-project
and really wanted to target some search engine traffic for these.
[Twitter Thread Writer](https://kizie.co/compose) and 
[Tweet to Image](https://kizie.co/tools/twitter-image) are small
tools which are straightforward to use. 
But since these are just tools, there was 
not much scope of putting in a lot of text content.

I had submitted these links to Google Search Console and waited
for almost a month to get these indexed, but even after a month
these were labelled under Discovered not indexed tag.

**Here are some things I had already taken care of before submitting.**

- Had proper meta title, description and open graph tags
- Had decent amount of textual content on pages
- Had proper robots.txt file

After submitting the sitemap, these got discovered but not indexed
and for a long time.

After a month or so of waiting I decided to make some changes,
and surprisingly these changes worked. These two got links 
indexed in some days after **I've made the below changes**.

- Added proper `rel="canonical"` tags for these pages
- Added more relevant textual information on the pages
- Built more backlinks

I figured out there was no `canonical` tag in the pages,
and my idea was that Google takes care of it on its own.
I was wrong, Google doesn't take two URLs 
same with different UTM parameters. 
I also wrote a blog post about 
[why canonical tag is important](/blog/nextjs-canonical-tag).

This can be specific to my case, but adding more textual content,
having proper canonical tag setup doesn't hurt.