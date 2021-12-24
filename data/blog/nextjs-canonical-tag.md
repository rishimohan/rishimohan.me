---

layout: post
title: "Adding canonical tag in Next.js"
date: 2021-12-24 19:00:00 +0530
categories: Next.js
excerpt: Make it easy for search engines to find out correct URL in your Next.js blog or website.

---

Next.js doesn't come SEO optimized 
and you need to do some things on your own
to make sure that your Next.js based blog
or website is properly optimized to be
indexed and ranked well in Search Engines.

## The Problem

First, what is canonical URL or canonical tag?

Canonical URL is a URL which tells search engines
the original source of a particular page. 
Let's take the example of this URL:

```
https://kizie.co
```

This is a straightforward URL. So when Google
crawls this link it would know that 
the source and canonical of the page is same,
which is `https://kizie.co`.

The problem arises in cases when there are
some query with the URL or when there are UTM
parameters. Whole lot of sites like to add
UTM parameters to external links and for various reasons.

The same URL with UTM parameters can look like this:

```
https://kizie.co/?ref=vercel.com
```

In this case, the search engine would consider the
canonical URL of this page same as the original URL
which also includes the UTM parameters.

Which means that search engine might consider these:

```
https://kizie.co
https://kizie.co/?ref=vercel.com
```

as two different sources or URLs.
But we know both these URL are same.
The use of canonical URL is to tell
search engines that these two URLs 
are same and that search engines should
consider these as same and not different sources.

## Setting up `canonical` tag in Next.js

Adding `canonical` tag in Next.js is pretty
simple. There are two steps to it: 

- Determining the canonical URL
- then Adding it in `Head`

### Determining the canonical URL in Next.js apps

People who have used Next.js might think
this as an easy thing to do, you just
import the `router` and then use `router.pathname`
to figure out the canonical URL. 

```
// URL: https://kizie.co/example

const canonical = `https://kizie.co` + router.pathname;

// canonical will be https://kizie.co/example
```

Thats it, no? The first search result's [most upvoted
answer](https://stackoverflow.com/a/65078853) says so. But it's, **wrong!**

Although the above setup would work in most cases,
it won't work in sites that use ISR
(Incrementally statically generated pages)
or have dynamically generated routes.
In ISR blogs and dynamically generated setups,
if you access: 

```
// URL: https://kizie.co/example/isr-generated-page

const canonical = `https://kizie.co` + router.pathname;

// canonical will be https://kizie.co/example/[slug]
```

Certainly `https://kizie.co/example/[slug]` is not the
canonical for this page. The issue is that `router.pathname`
doesn't know the actual slug of statically or dynamically 
generate pages.

**The solution**

The solution is to use router's `asPath` 
because it works even on dynamically generated pages.

```
// URL: https://kizie.co/example/isr-generated-page

const canonical = `https://kizie.co` + router.asPath;

// canonical will be https://kizie.co/example/isr-generated-page
```

And to make sure the canonical URL doesn't contain
any UTM parameters, we can use the following.

```
// URL: https://kizie.co/example/isr-generated-page?ref=vercel.com

const canonical = (`https://kizie.co` + router.asPath).split("?")[0];

// canonical will be https://kizie.co/example/isr-generated-page
```

Basically, we are just stripping off the 
UTM parameters part in the URL.


## Adding `canonical` tag in `Head`

For this I highly recommend to use [NextSEO](https://github.com/garmeeh/next-seo) 
npm library since it makes really easy not just
to add canonical tag but also other tags like `title`,
`description` and Open Graph tags.

Open the `pages/_app.js` file in your Next.js project
and make the changes like below. Also make sure to change 
`kizie.co` with your site's domain name.

```
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = (`https://kizie.co` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];


  return (
    <>
      <DefaultSeo
        canonical={canonicalUrl}
      />
      
      // Other stuff
    </>
  );
}

export default MyApp;
```

If you don't want to use NextSEO, you can also use
Next.js's `Head` to add the canonical tag like so:

```
import { useRouter } from "next/router";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const canonicalUrl = (`https://kizie.co` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];


  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      
      // Other stuff
    </>
  );
}

export default MyApp;
```

The above will make sure you have proper canonical URL
in all the pages of your sites, even the pages
which are generated through ISR or SSR.