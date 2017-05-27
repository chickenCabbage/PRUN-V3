    ___________      ____________       ____     ____      ____     ____  
    |  ______ /      |  ______  /       |  |     |  /      |   \    |  /  
    |  |    | |      |  |    |  |       |  |     |  |      |    \   |  |  
    |  | || | |      |  | || |  |       |  |     |  |      |  \  \  |  |  
    |  |____| |      |  |____/  |       |  |     |  |      |  |\  \ |  |  
    |   ______/      |  ________/       |  |     |  |      |  | \  \|  |  
    |  |             |  |  \  \         |  |     |  |      |  |  \  \  |  
    |  |             |  |   \  \        |  |     |  |      |  |   \    |  
    |  |             |  |    \  \       |  |_____|  |      |  |    \   |  
    |__|         ||  |__|     \__\  ||  \___________/  ||  |__|     \__|  
  
    PRAGUE       .   RACE           .   UPDATE         .   NOTIFIER


Built and maintained by Alon Shiboleth and Idan Lerman  
Prague Race by the awsome Petra Nordlund  
praguerace.com website by Hiveworks  


This is a website and service for notifiying readers of the comic Prague Race
when the comic updates and a new page comes out.


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


# **DO NOT RENAME OR CHANGE THE LOCATIONS OF ANY FILES!**