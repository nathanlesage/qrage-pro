# QRage Pro

> The No-BS QR code generator. Generate QR codes for links, emails, WiFis,
> calendars, VCards, and business cards and more. 100% customizable, 0% cost.

QRage Pro (pron. *Courage Pro*) is a professional QR code generator for
everybody. It generates QR codes from many pieces of data relevant to
individuals and companies alike. Moreso, it offers all necessary features to
fully customise your QR codes and adapt them to your brand with custom colors,
logos, and shapes.

All free features at a glance:

* Encode URLs, phone numbers, emails, WiFi credentials, business cards, calendar
  events, and much more
* Custom colors: Choose from a set of sensible defaults, or apply your own brand
  color
* Different aesthetic styles: Choose between the default block shape, dots, and
  a fluid Rorschach blot appearance
* Make your QR code a brand ambassador: Emboss your company's logo onto the
  QR code to strengthen your brand

Start creating your QR codes today with QRage Pro!

## Usage

QRage Pro is implemented as a progressive web app on top of modern web
technologies. It runs in any modern browser, including Chrome, Safari, or
Firefox. To get started, simply start the app, choose the type of QR code you
want to create, and enter the appropriate data. Depending on what type of data
you encode into the QR code, smartphones will offer various actions:

* open URLs in the web browser
* add VCards to the address book
* add events to the calendar
* connect to a network using the provided WiFi credentials

After you have decided upon and entered the necessary data, click on the
settings tab to begin customizing your QR code. Here you have a variety of
choices:

* **Style**: Select the general appearance of the QR code: Squares will create a
  standard QR code, dots will create a more subtle appearance, and Rorschach
  blot will create a dynamic and fluid code.
* **Error correction**: You can safely keep this at the default (medium), but if
  your QR code will be scanned from further away, or you want your logo to
  appear larger, you may need to increase this setting.
* **Size**: How large the QR code will be. This setting determines the size of
  an individual block in pixels
* **Margin**: The margin around the QR code, which makes it easier for scanners
  to decode the information. You can remove it entirely, if you like to.
* **Logo**: Upload your custom logo here. Ensure that it has a sufficient size
  so that it does not look blurry.
* **Logo size**: How large the logo will appear. The larger, the more difficult
  it will be for scanners to decode the QR code.
* **Foreground color**: Select the QR code's color (default: black). Ensure this
  has an appropriate contrast to the background color.
* **Background color**: Select a background color (default: white). The first
  color is transparent. Ensure it has an adequate contrast with the foreground
  color.

After you are done, you can export the QR code to your computer.

> [!TIP]
> Always test out your QR codes with your own smartphone to see if they work. If
> your smartphone doesn't detect the code, you may have to change the colors,
> shape, error correction level, or logo size.

## Contributing

PRs to add functionality and fix bugs are highly appreciated.

## Motivation

Okay, let's cut through the BS. I absolutely hate "free" QR code readers and
this is the only reason this project even exists. It all started with me
thinking "Hey, for this presentation, it would be great to have some QR codes
that folks can quickly scan!" So I ventured out and searched for some simple QR
code generator.

The first Google result was a complete SEO-pothole. Yes, I could create a very
simple URL-based QR code, and I was able to click download. And it would even
download it, *but* only after presenting me a "Please sign up and give me your
data" banner for – I measured – 15 seconds. Even worse, that wanker even added
an event listener so that when you would do anything else but stare at that pity
excuse of a "service" it would stop the counter, and never restart it, so that
you would have to manually click on "X", click on Download again and this time
stop using your computer until the download would actually initiate. And all of
this while telling me "Please wait – Generating QR code!" You know how long it
takes to generate a bloody QR code? *Fractions of a second!* Try it out on this
generator: Enter a ton of data, then add a 2 Megabyte logo and try regenerating
that thing – it will be almost instantaneous. Absolute garbage.

But it doesn't stop there. After I decided that I'm not a guinnea pig in an
experiment of how long you can make people stare at an ad for gratification
before they turn violent, I tried out a dozen other generators. But it got even
worse. Half of those things would let you patiently enter data into some form
and offer you a "Download" button only to reveal to you that the button is
mislabeled. Instead of "Downloading", they wanted to say "Give us your data and
we may let you generate a QR code." The other half put most of the basic
features behind a paywall. Why the bloody hell should I pay for generating a
10kb image of some data, implemented using an open protocol? Do you know how
much it costs to generate a QR code? You'll have to generate a few hundred
thousands until you may be able to see it on your utilities bill. How much does
it cost to maintain such a website? The protocols haven't changed in decades and
they likely won't in the next few.

Okay, so, anything out in the wild has fallen prey to the enshittification of
the internet. So let's head out to Open Source versions! … right? Well, I mean
those were finally ad-free and fully open with no data, but … at that point I've
seen that maybe customizing the color would be nice after all.

And that's why this project exists. To offer all of these pretty basic features
at no cost and no data. In fact, I don't want any of your data. That's just work
for me. I don't wanna be the responsible party when your data gets lost
somewhere. You can do that pretty well yourself. And yes, your first reading of
the name was more correct than "Courage", but those people have probably already
stopped reading after the Usage section.

So, rant over. Please enjoy the service while it's not enshittified ;)

And, if you do in fact *want* to show some appreciation – without me forcing
you –, please consider sponsoring me. But again, this whole thing is free.

## License

This software is licensed via the [GNU GPL v3-License](https://www.gnu.org/licenses/gpl-3.0.en.html).
