# Equality-Compass
An in-development Firefox plugin that scans job sites for the United States and assigns them a corresponding color based on the Movement Advancement Project’s score for LGBTQ+ rights within that state to allow LGBTQ+ folk to make more informed decisions on job applications.

# Advanced Information
+ No use of innerHTML, the locations are processed as plaintext and when inserted it is not executed as code, avoiding most XSS attempts (if LinkedIn is putting XSS attacks as location data we have bigger issues).
+ Styling and Tooltips are both hardcoded to prevent injection.
+ No remote code, everything is local to the machine.

# Installation
To install this development build for Firefox, grab either the latest alpha release or download this repository as a ZIP file. Once you have the file, navigate to about:debugging#/runtime/this-firefox and load this as a temporary addon by selecting the ZIP.