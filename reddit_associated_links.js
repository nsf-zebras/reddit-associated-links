javascript:(function() {

  /*  
      AUTHOR:       NSF_Zebras 

      Version:      1.0 

      Description:  Quickly search cross posts (of highlighted link) on reddit 
                    for any links posted as a comment, hoping to find the source! 
                    In other words, it will show you every link that has been 
                    posted as a response, including other postings. 

      TODO:     1:  Progress bar for search status
                2:  Put results in a table instead of simple paragraph rows.
   */

  var globalVersion = "v1.0 - NSF_Zebras" ;

  /*Class definitions*/

  function Link( points, href, text ) { 

      this.points = safelyParseInt( points, 0 ) ; 
      this.href = href ; 
      this.text = text ; 

      this.occurrences = 1 ; 

    /*  function isValid() { 
        return href && text ;
      }*/

  }

  /*Script */

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

  function safelyParseInt( str, defaultVal ) { 
    return parseInt( str ) || defaultVal ; 
  }

  function reverseSort( a, b ) { 
    return b.points - a.points ;
  }

  function searchCrossPosts( seenit ) { 

    var links = new Array() ;
    var submissionsSearched = jQuery( "a.comments", seenit ).length ; 

    jQuery( "a.comments", seenit ).each( function( key, commentsUrl ) { 

      /*console.debug( key + " -> " + value ) ; */
      searchSpecificPost( links, commentsUrl ) ; 

    }) ; 

    links.sort( reverseSort ) ; 
    showModal( submissionsSearched, links ) ; 

  }

  function searchSpecificPost( links, commentsUrl ) { 

    jQuery.ajax({

      url: commentsUrl,
      type: "GET",
      async: false

    }).success( function( data ){

      jQuery( "div.entry", data ).each( function( key, comment ) { 

        var points = jQuery( "span.unvoted", comment ).text().split( " " )[ 0 ] ; 
        jQuery( "div.usertext-body p a", comment ).each( function( key, commentLink ){

          if( commentLink ) { 

            var link = new Link( 
              points, 
              jQuery( commentLink ).attr( "href" ), 
              jQuery( commentLink ).text() 
            ) ;

            if( link.href ) {
              links.push( link ) ; 
            }

          }

        }) ; 

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

  function showModal( submissionsSearched, links ) {
    
    /*First remove all previously added modals*/
    jQuery( "div#dialog" ).remove() ;

    var div = buildDiv( submissionsSearched, links ) ; 
    jQuery( "body" ).append( div ) ; 
    jQuery( "div#dialog" ).dialog({
      width:'auto'
    }) ;

  }

  function collapseLinks( links ) { 

    var linksCollapsed = new Array() ;  
    var linksCollapsedIndex = new Array() ; 

    for( var i = 0 ; i < links.length ; i++ ) { 
      
      var indexOfLink = linksCollapsedIndex.indexOf( links[i].href ) ; 
      if( indexOfLink == -1 ) { 
        
        linksCollapsed.push( links[i] ) ; 
        linksCollapsedIndex.push( links[i].href ) ; 

      } else { 

        var linkModified = linksCollapsed[ indexOfLink ] ; 
        linkModified.occurrences++ ;
        linkModified.points += links[i].points ; 

        linksCollapsed[ indexOfLink ] = linkModified ; 

      }

    }

    return linksCollapsed ; 

  }

  function buildDiv( submissionsSearched, links ) { 

    var div = "<div id='dialog' title='R.A.L. - " + globalVersion + "'>" ;

    div += "<a>Submissions Searched: " + submissionsSearched + "</a><hr />" ; 
    div += "<p>Link Occurrences -> Combined Points -> Link</p>" ; 

    links = collapseLinks( links ) ; 
    for( var i = 0 ; i < links.length ; i++ ) { 

      var link = links[i] ; 

      if( link.href != "undefined" ) { 
        div += "<p>" + link.occurrences + " -> " + link.points + " -> <a href='" + link.href + "'>" + link.text + "</a></p>" ; 
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