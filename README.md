appreciate my work?
===================
Consider buying me a beer :)

Use paypal to send beer money here: nsfzebras@gmail.com

reddit-associated-links
=======================

A tool to help find the source of a gif

What it does is it will ask Reddit if the link has been posted before, then it searches through the comments of every post looking for links.  It then aggregates all the links together and shows you the list, reverse sorted by combined points.  Lots of times, you will see a link near the top entitled "source".

installation
============
After reading the following paragraphs in this section, the short form is this: (1) View the source of the specific script you choose to use.  (2)  Copy the contents of the script.  (3) Create a new bookmark, and in the place of the address, paste the code you copied from the script in step 2.  (4) Save.

This code is set up as a "bookmarklet", which means all you need to do is create a bookmark and set the destination of the bookmark to the script.  You're done!

You can choose between the raw script, and a "helper" style script.  The helper will automatically pull the latest core from the specified branch.  To use the helper, simply create a bookmark, and set it's address to the content of one of the scripts with "autoupdate" in the title.

release branches
================
If you want to manually edit your helper script to point to a different branch, find the part that specifies "var branch = BRANCHNAME" and change whatever is in the place of BRANCHNAME with with one of the following (without the quotes):

(Currently there is only one).

"beta"

usage
=====
There's three ways to use this tool.

1: The easiest way is when you're in the comments of a post.  Since there is only one link, RAL will assume this is the post you wish to search for and automatically begin searching for that one.

2: Highlight the link you wish to search for, then click the bookmarklet.

3: (Useful on mobile, where it's difficult to highlight a link and then run a bookmark): Click the bookmarklet, checkboxes will appear beside each post.  Check the one you wish to search for and run the bookmarklet again.

Here is an example of it running on Firefox for Android using above method #3
![Firefox for Android](https://raw.githubusercontent.com/nsf-zebras/reddit-associated-links/master/img/ral%20on%20mobile.png)
