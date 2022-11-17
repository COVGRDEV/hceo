REQUIREMENTS:
 ajaxMyTop currently requires PHP5. There is a version of processlist.php for PHP4 on the SF.net project page forums, but we have not yet incorporated it into the official package, so it does not have the full features of processlist.php, and is likely unstable with recent modifications. We have not planned to make ajaxMyTop PHP4-compatible until after the 1.0 release.

INSTALLATION:
 Unzip+untar into a directory on your web server.

CONFIGURATION:
 You can configure ajaxMyTop by editing the config.php file. 
 The db settings are straightforward, simply give the host (i.e., 'localhost'), user (i.e., 'ajaxmytop'), and password (i.e., 'ajaxmytop') for your MySQL server.
 The filters array is simply a variable used internally to make filtering code simpler(?). You do not need to modify it.

 MySQL:
 It is highly recommended that you create a new user for ajaxMyTop with the SUPER and PROCESS privileges rather than configure ajaxMyTop with an admin user.
 i.e.,
 GRANT SUPER, PROCESS ON *.* to 'ajaxmytop'@'localhost' identified by 'ajaxmytop';
 GRANT SUPER, PROCESS ON *.* to 'ajaxmytop'@'%' identified by 'ajaxmytop';

 Apparently you must also grant the SELECT privilege to the ajaxmytop user for all databases in which you may want to explain threads.
 i.e.,
 GRANT USAGE, SELECT ON test.* to 'ajaxmytop'@'localhost' identified by 'ajaxmytop';
 GRANT USAGE, SELECT ON test.* to 'ajaxmytop'@'%' identified by 'ajaxmytop';

KNOWN ISSUES:
 Cannot click on explanation panels in IE.
 Workaround: Use Firefox, duh! :)

SHORTCUT KEYS:
/ or ? : toggle shortcut key display
space bar : clear filter values
s : change refresh interval
c : Command filter
d : db filter
h : Host filter
i : toggle idle threads
k : kill thread
u : User filter

Please help out by submitting bugs, feature requests, and/or patches to the SF.net project page:
http://sourceforge.net/projects/ajaxmytop

Note: This software makes use of work from Tango Desktop Project licensed under CC-Attribution-ShareAlike 2.5. 
(http://tango.freedesktop.org/Tango_Desktop_Project)
I'm not a legal buff, but I think this means if you want to use ajaxMyTop in a closed-source product, you'd have to remove the Tango icons.
The icons taken from Tango are:
ASC.*
DESC.*
kill.png