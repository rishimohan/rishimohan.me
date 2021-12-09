---

layout: post
title: "The issue with Next.js <Link /> tag"
date: 2021-12-05 19:00:00 +0530
categories: Next.js
excerpt: Next.js Link tag makes it fast to navigate between pages, but it comes with a big accessibility issue

---

Next.js Link tag makes it fast to navigate between pages
and has many benefits, 
but it comes with a big accessibility issue.

The issue is when you try to open the `Link` tag content,
you won't be able open it in new tab.
It works as a `onClick` handler by default
which is a big accessibility and SEO issue.

Search engines crawl pages by looking at
the links in `<a>` tag. Since there's no
actual link when you use `<Link>` tag,
search engines can't see and recognise the link
that you've set and hence it can cause 
Search Engines to ignore that link.

It's also a big accessibility issue,
when you define a link you expect it to act like a link
and not a function assigned to a `div`.
You should be able to open the links
in new tab, or with `Cmd + Click`.

## The fix

A simple Link tag use looks something like this:

```
<Link href="/blog">Blog</Link>
```

To fix the accessibility issue,
all we need to do is wrap the contents of
`Link` tag in a `<a>` tag. 
This will make it an actual link
which you can open in a new-tab
and which Search Engines can recognise.

Here's how it looks:

```
<Link href="/blog">
  <a>Blog</a>
</Link>
```
