javascript:(function() {

  /*  
      AUTHOR:       NSF_Zebras 

      Version:      1.0 

      Description:  Quickly search cross posts (of highlighted link) on reddit 
                    for any links posted as a comment, hoping to find the source! 
                    In other words, it will show you every link that has been 
                    posted as a response, including other postings. 

      Issues:   1:  Sometimes searching for a link's previous posts ends up at a login page
   */

  var globalVersion = "v1.0 - NSF_Zebras" ;

  /*Class definitions*/

  function Link( points, href, text ) { 

      this.points = safelyParseInt( points, 0 ) ; 
      this.href = href ; 
      this.text = text ; 

      this.occurrences = 1 ; 

  }

  /*Script */

  function main() { 

    importJQUI() ; 

    /* Check if it's just a single item page. */
    var isSinglePage = jQuery( "body" ).hasClass( "single-page" ) ;

    var selectedLink = isSinglePage? jQuery( "div.thing:first div.entry a.title" ) : getSelectionLink() ;
    /*console.log( selectedLink ) ; */    

    if( selectedLink == null ) { 
      /* check if there is a checked ral-manual-checkbox checked */
      selectedLink = getSelectionCheckbox() ; 
    }

    /* if it's still null, add the checkboxes */
    if( selectedLink == null ) { 

      /* Add a link beside each post that will let you perform the same function. */
      if( jQuery( "div.ral-message" ).length == 0 ) { 
        jQuery( "div#siteTable div:first" ).before( "<div class='ral-message'>Check the one to search for, and run the bookmarklet again</div>" ) ; 
      }

      /* remove any existing checkboxes, then add them */
      jQuery( "input.ral-manual-checkbox" ).remove() ; 
      jQuery( "a.title" ).after( "<input type='checkbox' class='ral-manual-checkbox' />" ) ; 

    } else { 

      setTimeout( function(){
        run( selectedLink ) ; 
      }, 0 ) ;

    }
    
  }

  function getPostBesideRelLink( relLink ) { 
    console.log( relLink ) ; 
  }

  function run( selectedLink ) { 

    if( !selectedLink ) { 
      return ;
    }

    var encodedUrl = "/submit?url=" + encodeURIComponent( jQuery( selectedLink ).attr( "href" ) ) ;
    /*console.debug( "Encoded URL", encodedUrl ) ;*/

    jQuery.ajax({

      url: encodedUrl,
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
    var totalSubmissionsToSearch = jQuery( "a.comments", seenit ).length ;
    var submissionsSearched = 0 ; 

    jQuery( "a.comments", seenit ).each( function( key, commentsUrl ) { 

      /*console.debug( key + " -> " + value ) ; */
      searchSpecificPost( links, commentsUrl ) ; 
      links.sort( reverseSort ) ;
      showModal( ++submissionsSearched, totalSubmissionsToSearch, links ) ;

    }) ; 

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

      /* Insert css for the results table */
      jQuery('html > head').append( jQuery( 
        '<style>' +
          '.ral-table tr.title { background-color: lightgray; text-align: center; } ' +
          '.ral-table tr.title td { padding-left: 4px; padding-right: 4px; } ' + 
          '.ral-table td.ral-number { text-align: right; padding-right: 15px; } ' +
        '</style>' 
      )) ;

    }    

  }

  function showModal( submissionsSearched, totalSubmissionsToSearch, links ) {
    
    /*First remove all previously added modals*/
    jQuery( "div#ral-dialog" ).remove() ;

    var div = buildDiv( submissionsSearched, totalSubmissionsToSearch, links ) ; 

    /* If it already exists... */
    if( jQuery( "div#ral-dialog" )[0] ) { 
      jQuery( "div#ral-dialog" ).html( jQuery( div ).html() ) ; 

    /* Else: create it */
    } else { 
      jQuery( "body" ).append( div ) ; 
    }

    jQuery( "div#ral-dialog" ).dialog({
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

  function buildDiv( submissionsSearched, totalSubmissionsToSearch, links ) { 

    var div = "<div id='ral-dialog' title='R.A.L. - " + globalVersion + "'>" ;

    div += "<a>Submissions Searched: " + submissionsSearched + "/" + totalSubmissionsToSearch + "</a><hr />" ; 
    div += "<table class='ral-table'>" ;
    div += "<tr class='title'><td>Link Occurrences</td><td>Combined Points</td><td>Link</td></tr>" ; 

    links = collapseLinks( links ) ; 
    for( var i = 0 ; i < links.length ; i++ ) { 

      var link = links[i] ; 

      if( link.href != "undefined" ) { 
        div += "<tr><td class='ral-number'>" + link.occurrences + "</td><td class='ral-number'>" + link.points + "</td><td><a href='" + link.href + "'>" + link.text + "</td></tr>" ; 
      }

    }

    div += "</table></div>" ;

    return div ; 

  }

  function getSelectionLink() {
    
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    
    if( text ) { 
      return $('a').filter( function(index) { return $(this).text() === text ; } ) ;
    }
    return null ; 

  }

  function getSelectionCheckbox() { 

    var checked = jQuery( "input.ral-manual-checkbox:checked:first" ) ;     
    if( checked.length > 0 ) { 
      return jQuery( checked ).parent().find( "a.title" ) ; 
    }
    
    return null ; 

  }

  main() ; 

})();