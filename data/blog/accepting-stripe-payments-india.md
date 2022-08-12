---

layout: post
title: "Accepting payments using Stripe for Indian users"
date: 2022-08-12 19:00:00 +0530
categories: Tech
excerpt: A guide on why and why shouldn't you use Stripe in your products, and how am I accepting INR and international payments as a Stripe Indian user

---

![Stripe Dashboard India](/images/posts/stripe-india-dashboard.png)

Stripe is a go-to platform for most developers for accepting payments,
and it works really well. The area where I personally feel
Stripe really shines is their API documentation and guides, 
and customer support. 

I've been using Stripe to accept payments in my SaaS products →
[Kizie](https://kizie.co) and [Pika](https://pika.style). 
I've faced multiple problems, sometimes
related to payments, sometimes because of business verification etc.
But overall I still feel like Stripe is a good, reasonable
and reliable way to accept payments.

This blog post aims to answer some of the questions 
that I frequently get asked on my Twitter, 
and other things that I've experienced and dealt with 
while using Stripe in my apps.


> This blog is written from Stripe India user's perspective,
and it may or may not be relevant for users of other regions.

## Why you shouldn't use Stripe

- Stripe doesn't handle taxes since it's not MoR(Merchant of Record)
- Some Stripe payments fail(the rate is low for me but it's still there)
- Stripe doesn't support Paypal

## Why you should be using Stripe

- Stripe is fairly easy to implement, and reliable
- Good documentation and amazing customer support
- **You can accept international payments as well as INR payments**
- The pricing is low as compared to Paddle(but Paddle also handles taxes)

The choices comes mostly down to Stripe vs Paddle for most users.
Paddle is mostly good, handles taxes, 
has payment links or modal payment flows, supports Paypal.
But I've also read about Paddle blocking accounts,
or delayed verifications and approvals 
from SaaS owners on Twitter, which kind of is scary.

With Stripe, I don't really need to think about anything
after setting up the payments once, which helps me
focus more on the product I'm building.

## Accepting International and INR payments as a Stripe India user

First things first, **I signed up as Sole Proprietor**.
I didn't have to submit any business details until recently
when Stripe started asking for business details for verification. 
For this verification, Indian users can submit their PAN
card which mentions the name of their business(in my case it's my name).

So once you setup your account, 
here's a way you can use for accepting both international payments
and INR payments.

- First, you'll need to create two versions of your product,
for ex. if you have an app for which you charge $9 a month,
you'll need to create two different products for it in Stripe.
One that is priced in USD and other priced in INR.

- Second, ask your user or detect if they're from India, 
and if so redirect them to payment page with INR pricing.
Else redirect them to USD pricing page.

- From my experience, Indian cards don't work with product payment
pages with USD pricing, but works well with
payment page for product priced in INR.

![Stripe Products Screen](/images/posts/stripe-products.png)

And that's how I'm accepting international payments 
as well as INR payments as an Indian Stripe user.

If you have more questions about using Stripe for payments in India, 
you can [DM me on Twitter @thelifeofrishi](https://twitter.com/thelifeofrishi).