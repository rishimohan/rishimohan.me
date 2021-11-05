---

layout: post
title: "A Simple SVG Spinner Icon"
date: 2020-11-05 12:00:00 +0530
categories: Code
excerpt: An animated SVG for a spinner icon that can be used in any kind of project

---

Here's a small animated SVG snippet of a loading spinner.
Since it's a SVG, it scales well and can inherit the color,
so very customizable. It's already animated so you don't need
to add `keyframes` and hence I found it very flexible.

The below SVG can also be converted into a React component or
perhaps a `const` and used in React projects, 
which is what I'm doing in [Kizie](https://kizie.co).


## Preview

![Animate Spinner SVG](/images/posts/spinner.svg)

## Code

```js
  <svg
    version="1.0"
    width="100%"
    height="100%"
    viewBox="0 0 128 128"
  >
    <g>
      <path d="M59.6 0h8v40h-8V0z" fill="#000" />
      <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(30 64 64)" />
      <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(60 64 64)" />
      <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(90 64 64)" />
      <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(120 64 64)" />
      <path
        d="M59.6 0h8v40h-8V0z"
        fill="#b2b2b2"
        transform="rotate(150 64 64)"
      />
      <path d="M59.6 0h8v40h-8V0z" fill="#999" transform="rotate(180 64 64)" />
      <path
        d="M59.6 0h8v40h-8V0z"
        fill="#7f7f7f"
        transform="rotate(210 64 64)"
      />
      <path d="M59.6 0h8v40h-8V0z" fill="#666" transform="rotate(240 64 64)" />
      <path
        d="M59.6 0h8v40h-8V0z"
        fill="#4c4c4c"
        transform="rotate(270 64 64)"
      />
      <path d="M59.6 0h8v40h-8V0z" fill="#333" transform="rotate(300 64 64)" />
      <path
        d="M59.6 0h8v40h-8V0z"
        fill="#191919"
        transform="rotate(330 64 64)"
      />
      <animateTransform
        attributeName="transform"
        type="rotate"
        values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64"
        calcMode="discrete"
        dur="720ms"
        repeatCount="indefinite"
      ></animateTransform>
    </g>
  </svg>
```
