---

layout: post
title: "Using `theme-color` meta tag"
date: 2022-02-02 00:00:00 +0530
categories: ["HTML", "CSS"]
excerpt: "Learn how to use a special meta tag called theme-color to spice up your website's accent in Safari, Chrome and some other browsers."

---

If you use Safari 15 or above on macOS, 
you might have noticed that Safari has this option
to enable coloured tab bar. By default,
Safari automatically decides which colour to use
for the tab bar based on your website's
accent colour. But it's definitely possible 
to change this colour to a specific colour
you might want.

And Safari is not the only browser that supports
this feature. Safari on iOS, Chrome on Desktop app as well as
Mobile app, and some other browsers also support it 
as per [Can I Use](https://caniuse.com/meta-theme-color).

![](/images/posts/safari-tab-bar.png)

This colour can be set to your preferred colour using `theme-color` 
meta tag in between `<head>` tag of your site. 

```
<meta name="theme-color" content="#222" />
```

Just place the above line in between your website's head tag.
You can change the Hex colour in content to the colour
you want the tab bar to have on your website.

You also have the option to change this colour based on
system theme. You can specify different colours
for when the system is on light or when it's on dark theme.


```
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#f5f5f5">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#22222">
```

The first line in above code is to apply custom theme colour 
for tab bar when the system is in light mode and second one when on
dark mode. This is a great way to customize browser 
as per your site design's aesthetics.

A thing to note is that it only works in Safari when tab colors
is enabled in `Safari Preferences > Advanced > Show colour in compact tab bar`. 
If it's not enabled then Safari will show default gray color in light and black color in dark theme.