// app.js

function doSearch(word) {
	const website = "https://zh.wikipedia.org";
	const wikiUrl = "/wiki/";

	// set content of search bar
	$("#content").val(word);

	// empty relations
	$("#relations").empty();

	// mediawiki api cannot meet the requirements, so download html page directly instead of use api.

	// download page source
	const pageUrl = website + wikiUrl + encodeURIComponent(word);
	// const wikiRegex = /^(?:(?:https?:)?\/+[a-zA-Z]+\.wikipedia\.org)?\/+wiki\/([^\/:#]+)(?:#.*)?$/;

	// only zh.wikipedia.org
	const wikiRegex = /^(?:(?:https?:)?\/+zh\.wikipedia\.org)?\/+wiki\/([^\/:#]+)(?:#.*)?$/;
	let result = {};
	$.ajax(pageUrl, {
		success: (data) => {
			const pageContent = $(data);
			$("a", pageContent).each(function () {
				// extract other wiki items
				let match = wikiRegex.exec($(this).attr('href'));
				if (match) {
					let item = decodeURIComponent(match[1]);
					if (item !== word) {
						if (result.hasOwnProperty(item)) {
							result[item]++;
						} else {
							result[item] = 1;
						}
					}
				}
			});

			// sort
			let sortedResult = [];
			for (let item in result) {
				if (result.hasOwnProperty(item)) {
					let count = result[item];
					if (sortedResult.hasOwnProperty(count)) {
						sortedResult[count].push(item);
					} else {
						sortedResult[count] = [item];
					}
				}
			}

			// empty relations
			$("#relations").empty();

			// insert relations
			for (let i = sortedResult.length - 1; i >= 0; i--) {
				if (i in sortedResult) {
					for (let items = sortedResult[i], j = items.length - 1; j >= 0; j--) {
						$("#relations").append("<li><a class=\"relation\" href=\"#\">"
							+ items[j] + "</a> : " + i + "</li>")
					}
				}
			}

			// bind onclick event
			$(".relation").click(function () {
				doSearch(this.text);
			});
		}
	});

	// return false to stop submit
	return false;
}
