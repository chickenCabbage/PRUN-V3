# Prague Race Update Notifier - P.R.U.N


Built and maintained by Alon Shiboleth and Idan Lerman  
Prague Race by the awsome Petra Nordlund  
praguerace.com website by Hiveworks  


This is a website and service for notifiying readers of the comic Prague Race
when the comic updates and a new page comes out.


### Why use PRUN instead of an RSS feed reader?


Feeds are often a few minutes late. This is Bad™ if you want _immidiate_
updates. PRUN's maximal latency is 30 seconds, while readers can get to
10 minutes of delay.  
PRUN doesn't require an external program downloaded from who-knows-where,
and will give you a shoutout over e-mail wherever and whenever. It's pretty
handy, and very on-the-go. No app, no software, no download.  
PRUN has an awesome website I made by myself with my very awesome CSS skills
and it gives you information about the last update, such as the title, time,
and the latest comic page. It even has notifications, if you're using Chrome!
RSS readers don't have cool websites amirite?  
Feeds require code and stuff. It's ugly, it's prone to error, and it's XML
(no one likes XML). PRUN is just a sign-up. Much less confusing.

_Easy. Sleek. Everywhere._



### Technical details:


The system serves the website from the main directory (V3) using the server.js
script, while crawling the praguerace.com website and checking for new pages
using the update.js script. Both scripts are built in Node.js V0.10.29.
Mailer.jar and verify.jar are written in Java 1.8.0_121. In order to operate,
both Node.js and Java must be installed, and Java must be runnable from the
command line simply as `java`.


The Node.js scripts require the following modules:  
* node-metainspector
* child_process
* crypto
* http
* fs


The program uses ports 8888 (for serving the website) and 567 (for SMTP). 8888
must be configured in the router as a port to be forwarded to port 80 (HTTP),
or else incoming requests will be blocked. It also uses port 80 (HTTP) for
standard HTTP requests to praguerace.com.


The users folder contains all the website's users' data and should NOT be
tampered with in ANY case. File contents are encrypted and MUST NOT be touched.


### **DO NOT RENAME OR CHANGE ANY FILES OR THEIR LOCATIONS!**