javascript:(function() {

	/*  
      AUTHOR:       NSF_Zebras 

      Version:      1.0-b1

      Description:  This bookmarklet will pull the source from git each time it is run.  
      				Therefore automatically getting the latest and greatest version each time.

	  Branch:       Beta

   */

    /* 
    	Change this between the various "release" branches.  Which can be found in the readme on the project page: 
		https://github.com/nsf-zebras/reddit-associated-links
    */
    var ralBranch = "beta" ;

	/* First remove any previous imports. */
	jQuery( "script[src*='reddit-associated-links']" ).remove() ;

	/* Then import the reddit associated links script. */
	var fileref = document.createElement( 'script' ) ;

	fileref.setAttribute( "type", "text/javascript" ) ;
	fileref.setAttribute( "src", "//raw.githubusercontent.com/nsf-zebras/reddit-associated-links/" + ralBranch + "/src/reddit_associated_links.js" ) ;

	document.getElementsByTagName( "head" )[0].appendChild( fileref ) ;

})();