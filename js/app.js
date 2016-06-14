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
	jQuery.ajax({  
        url: website + wikiUrl + encodeURIComponent(word),  
        type: "GET",  
        success: function (data) {  
			console.log(data);
        },  
        dataType: "html"  
    }); 
	return false;
}
