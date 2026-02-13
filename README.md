# Equality-Compass
An extension that scans job sites in the U.S. and assigns them a color based on the Movement Advancement Project’s score for LGBTQ+ rights within that state to allow LGBTQ+ folk to make more informed decisions on job applications.

<p align = center><img width="603" height="329" alt="Screenshot 2025-07-20 at 15-15-01 (19) Jobs LinkedIn" src="https://github.com/user-attachments/assets/733a18b9-e6a0-4373-8665-44c082021b71" /></p>
<p align = center><img width="338" height="285" alt="Screenshot 2025-07-20 at 15-49-56 1 000 Jobs (NOW HIRING) in Seattle WA - ZipRecruiter" src="https://github.com/user-attachments/assets/cc433319-b298-4fc0-9572-bf8ac33955de" /></p>

# Installation

## Firefox
To install this development build for Firefox, [download the latest release](https://github.com/Kubia-Beta/Equality-Compass/releases/latest). Once you have the ZIP file, navigate to the URL [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox), select "Temporary Extensions", and load this as a temporary addon by selecting the ZIP.

## Chrome
To install this development build for Chrome, [download the latest release](https://github.com/Kubia-Beta/Equality-Compass/releases/latest) and unzip the contents to a folder you can access. Navigate to the URL [chrome://extensions](chrome://extensions) (or three dots->manage->extensions). Turn on Developer mode in the top right, select "Load unpacked", and then select the extracted file folder.


# Advanced Information
Works by searching for specific spans and divs that each respective website uses to hold the location information of their job listings. A window of the state information runs in the background for the regex to pull matches from, which then get passed on to the span processing functions to remove the original text and reconstruct it, but with the state on a colored background.

+ I do not store or use any of your data in any way.
+ No use of innerHTML, the locations are processed as plaintext using textContent. When inserted, it is not executed as code, avoiding XSS.
+ Styling, Tooltips, and location data are all hardcoded to prevent injection.
+ No remote code, everything is local to the machine you're running the extension on.
+ Only third-party code is WebExtension browser API Polyfill, made by Mozilla, the org behind Firefox.

# FAQ

> When will this release?

I lack the funding to really get behind any project at the moment, so I appreciate [Ko-Fi](https://ko-fi.com/Q5Q41GXDPM) tips a ton.

> Why make this extension?

The inability of people to exist legally in some states while in public motivated the creation of this extension.

> When will automatic updates come?

At extension release. Currently, I'd have to self-sign this using the same storefronts that I am intending to upload to.

> Why can't I just install this normally?

Because it is an in-development extension, and so is not signed by either platform.
