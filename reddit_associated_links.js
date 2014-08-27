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

  var globalVersion = "v1.0.0 - NSF_Zebras" ;

  function main() { 

    importJQUI() ; 

    var selectedLink = getSelectionLink() ;
    /*console.log( selectedLink ) ; */    

    run( selectedLink ) ; 

  }

  function run( selectedLink ) { 

    jQuery.ajax({

      url: "http://www.reddit.com/submit?url=" + jQuery( selectedLink ).attr( "href" ),
      type: "GET"

    }).success( function( seenit ) { 

      searchCrossPosts( seenit ) ; 

    }) ; 

  }

  function searchCrossPosts( seenit ) { 

    var links = new Array() ;
    var otherSubmissionsCount = jQuery( "a.comments", seenit ).length ; 

    jQuery( "a.comments", seenit ).each( function( key, commentsUrl ) { 

      /*console.debug( key + " -> " + value ) ; */
      searchSpecificPost( links, commentsUrl ) ; 

    }) ; 

    links.sort( function (a,b) {
      return b.split( "|" )[0] - a.split( "|" )[0] ;
    }) ; 

    showModal( links ) ; 

  }

  function searchSpecificPost( links, commentsUrl ) { 

    jQuery.ajax({

      url: commentsUrl,
      type: "GET",
      async: false

    }).success( function( data ){

      jQuery( "div.entry", data ).each( function( key, comment ) { 

        var points = jQuery( "span.unvoted", comment ).text().split( " " )[ 0 ] ; 
        var link = jQuery( "div.usertext-body p a", comment ) ; 

        if( link ) { 

          var joined = points + "|" + jQuery( link ).attr( "href" ) + "|" + jQuery( link ).text() ; 
          /*console.log( joined ) ; */

          links.push( joined ) ;

        }

      })  ; 

    }) ;

  }

  function importJQUI(){

    if( !window.jQuery.ui ) {
      
      /*import jQueryUI js*/
      var fileref = document.createElement( 'script' ) ;

      fileref.setAttribute( "type", "text/javascript" ) ;
      fileref.setAttribute( "src", "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js" ) ;

      document.getElementsByTagName( "head" )[0].appendChild( fileref ) ;

      /*import jQueryUI css (smoothness theme)*/
      var cssref = document.createElement( 'link' ) ;

      cssref.setAttribute( "rel", "stylesheet" ) ;
      cssref.setAttribute( "type", "text/css" ) ; 
      cssref.setAttribute( "href", "//code.jquery.com/ui/1.11.1/themes/smoothness/jquery-ui.css" ) ;

      document.getElementsByTagName( "head" )[0].appendChild( cssref ) ;

    }    

  }

  function showModal( links ) {
    
    /*First remove all previously added modals*/
    jQuery( "div#dialog" ).remove() ;

    var div = buildDiv( links ) ; 
    jQuery( "body" ).append( div ) ; 
    jQuery( "div#dialog" ).dialog({
      width:'auto'
    }) ;

  }

  function buildDiv( links ) { 

    var div = "<div id='dialog' title='R.A.L. - " + globalVersion + "'>" ;

    for( var i = 0 ; i < links.length ; i++ ) { 

      var linkSplit = links[i].split( "|" ) ; 
      if( linkSplit[1] != "undefined" ) { 
        div += "<p>" + linkSplit[0] + " -> <a href='" + linkSplit[1] + "'>" + linkSplit[2] + "</a></p>" ; 
      }

    }

    div += "</div>" ;

    return div ; 

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

  main() ; 

})();