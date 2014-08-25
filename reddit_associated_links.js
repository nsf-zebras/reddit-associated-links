javascript:(function() {

  /*  
      AUTHOR:       NSF_Zebras 

      Version:      1.0.0 

      Description:  Quickly search cross posts (of highlighted link) on reddit 
                    for any links posted as a comment, hoping to find the source! 
                    In other words, it will show you every link that has been 
                    posted as a response, including other postings. 

      TODO:     1:  Ensure selected post itself is included in the search
                2:  Put results in a jQueryUI modal instead of a simple alert box.
   */

  function main() { 

    importJQUI() ; 

    var selectedLink = getSelectionLink() ;
    /*console.log( selectedLink ) ; */    

    run( selectedLink ) ; 

  }

  function importJQUI(){

    if( !window.jQuery.ui ) {
      
      var fileref = document.createElement( 'script' ) ;

      fileref.setAttribute( "type", "text/javascript" ) ;
      fileref.setAttribute( "src", "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js" ) ;

      document.getElementsByTagName( "head" )[0].appendChild( fileref ) ;

    }    

  }

  function getSelectionLink() {
    
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    
    return $('a').filter(function(index) { return $(this).text() === text ; }) ;

  }

  function run( selectedLink ) { 

    jQuery.ajax({

      url: "http://www.reddit.com/submit?url=" + jQuery( selectedLink ).attr( "href" ),
      type: "GET"

    }).success( function( seenit ) { 

      var links = new Array() ;
      var otherSubmissionsCount = jQuery( "a.comments", seenit ).length ; 

      jQuery( "a.comments", seenit ).each( function( key, value ) { 

        /*console.debug( key + " -> " + value ) ; */
        jQuery.ajax({

          url: value,
          type: "GET",
          async: false

        }).success( function( data ){

          jQuery( "div.entry", data ).each( function( key, value ) { 

            var points = jQuery( "span.unvoted", value ).text().split( " " )[ 0 ] ; 
            var link = jQuery( "div.usertext-body p a", value ).attr( "href" ) ; 

            if( link ) { 

              var joined = points + " -> " + link ; 
              /*console.log( joined ) ; */

              links.push( joined ) ;

            }

          })  ; 

        }) ;

      }) ; 

      links.sort( function (a,b) {
        return b.split( " " )[0] - a.split( " " )[0] ;
      }) ; 

      var alertMessage = "Highlighted link found in " + otherSubmissionsCount + " submissions. Below is every link submitted as a comment on those submissions.  \n\nPoints -> Link.\n" ; 
      for( var i = 0 ; i < links.length ; i++ ) { 
        alertMessage += links[i] + "\n" ;
      }

      if( links.length ) { 
        alert( alertMessage ) ; 
      } else { 
        alert( "No links found." ) ;
      }

    }) ; 

  }

  main() ; 

})();