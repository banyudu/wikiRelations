// app.js

function doSearch(word) {
	'use strict';
	let website = "https://zh.wikipedia.org";
	let wikiUrl = "/wiki/";

	// set content of search bar
	$("#content").val(word);
	// return false to stop submit

	// mediawiki api cannot meet the requirements, so download html page directly instead of use api.

	// download page source
	let pageUrl = website + wikiUrl + encodeURIComponent(word)
	jQuery.ajax({  
        url: pageUrl,  
        type: "GET",  
        success: function (data) {  
			let page = $(data);
			let links = $("a", page).map(function() {
                return this.pathname;
            });
        },  
        dataType: "html"  
    }); 
	return false;
}
