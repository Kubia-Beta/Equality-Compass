# Equality-Compass
An in-development Firefox plugin that scans job sites for the United States and assigns them a corresponding color based on the Movement Advancement Project’s score for LGBTQ+ rights within that state to allow LGBTQ+ folk to make more informed decisions on job applications.

# Advanced Information
+ No use of innerHTML, the locations are processed as plaintext. When inserted, it is not executed as code, avoiding most XSS attempts (if LinkedIn is putting XSS attacks as location data, we have bigger issues).
+ Styling, Tooltips, and Location data are all hardcoded to prevent injection.
+ No remote code, everything is local to the machine.

# Installation
To install this development build for Firefox, grab either the latest alpha release or download this repository from Main as a ZIP file. Once you have the file, navigate to about:debugging#/runtime/this-firefox and load this as a temporary addon by selecting the ZIP.

# FAQ
> Where is the Chrome version?

Planned. I want to be more release-ready before I port this over to Chrome as well. It's my first Chrome addon, so I have to pay a fee.

> When will this release?

Full release should be done by the end of 2025. I lack the funding to really get behind any project at the moment, so I appreciate [Ko-Fi](https://ko-fi.com/Q5Q41GXDPM) donations a ton.

> Why make this addon?

The inability of people to exist legally in some states while in public motivated the creation of this addon.
