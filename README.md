# Equality-Compass
An extension that scans job sites in the U.S. and assigns them a color based on the Movement Advancement Project’s score for LGBTQ+ rights within that state to allow LGBTQ+ folk to make more informed decisions on job applications.

# Installation

## Firefox
To install this development build for Firefox, download this release. Once you have the ZIP file, navigate to about:addons (or puzzle piece->manage extensions) and select the cog wheel with the option "install add-on from file", and select the ZIP file. Alternatively, navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox), select "Temporary Extensions", and load this as a temporary addon by selecting the ZIP.

## Chrome
To install this development build for Chrome, download this release and unzip the contents to a folder you can access. Navigate to [chrome://extensions](chrome://extensions) (or three dots->manage->extensions). Turn on Developer mode in the top right, select "Load unpacked", and then select the extracted file folder.

##Note

These will not automatically update, as they have not been obtained from the platform's respective extension/addon pages. Once they are available on the respective storefronts, automatic updates and easier installation will be supported, allowing you to download and install them normally.


# Advanced Information
Works by searching for specific spans and divs that each respective website uses to hold the location information of their job listings. A window of the state information runs in the background for the regex to pull matches from, which then get passed on to the span processing functions to remove the original text and reconstruct it but with the state on a colored background.

+ I do not store or use any of your data in any way.
+ No use of innerHTML, the locations are processed as plaintext using textContent. When inserted, it is not executed as code, avoiding XSS.
+ Styling, Tooltips, and Location data are all hardcoded to prevent injection.
+ No remote code, everything is local to the machine you're running the extension with.
+ Only third-party code is WebExtension browser API Polyfill, made by Mozilla, the org behind Firefox.

# FAQ

> When will this release?

Full release should be done by the end of July 2025. I lack the funding to really get behind any project at the moment, so I appreciate [Ko-Fi](https://ko-fi.com/Q5Q41GXDPM) donations a ton.

> Why make this extension?

The inability of people to exist legally in some states while in public motivated the creation of this extension.
