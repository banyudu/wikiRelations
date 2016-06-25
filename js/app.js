// app.js
'use strict';

let svg = $("#svg");
const maxSize = 5;
const maxCount = 15;


function doSearch(word) {
	const website = "https://zh.wikipedia.org";
	const wikiUrl = "/wiki/";

	// set content of search bar
	$("#content").val(word);

	// empty graph
	if (svg) {
		svg.remove();
		svg = null;
	}

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
			$("a", pageContent).each(function() {
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

			let nodes = [{ "name": word, "size": 5 }];
			let links = [];
			let index = 1;
			for (let item in result) {
				if (result.hasOwnProperty(item)) {
					let size = result[item] >= maxSize? maxSize: result[item];
					nodes.push({ "name": item, "size": size });
					links.push({ "source": 0, "target": index, "value": size });
					index++;
					if (index > maxCount)
						break;
				}
			}

			drawGraph(nodes, links);

			// bind onclick event
			$(".relation").click(function() {
				doSearch(this.text);
			});
		}
	});

	// return false to stop submit
	return false;
}

$(".relation").click(function() {
	doSearch(this.text);
});

$("#searchBar").submit(function() {
	return doSearch($("#content").val());
});

function drawGraph(nodes, links) {
	let width = 900, height = 650;

	if (svg) {
		svg.remove();
		svg = null;
	}

	svg = d3.select("body")
		.append("svg")
	    .attr("id", "svg")
		.attr("width", width)
		.attr("height", height);

	let svg_links = svg.selectAll("line")
		.data(links)
		.enter()
		.append("line")
		.style("stroke", "#ccc")
		.style("stroke-width", 1);

	let force = d3.layout.force()
		.nodes(nodes)
		.links(links)
		.size([width, height])
		.linkDistance(225)
		.charge(function(d) { return - d.size * d.size * 150; });
	force.start();

	let color = d3.scale.category20();

	//添加节点
	var svg_nodes = svg.selectAll("circle")
		.data(nodes)
		.enter()
		.append("circle")
		.attr("r", function(d) { return Math.sqrt(d.size) * 25; })
		.style("fill", function(d, i) {
			return color(i);
		})
		.call(force.drag);  //使得节点能够拖动

	//添加描述节点的文字
	let svg_texts = svg.selectAll("text")
		.data(nodes)
		.enter()
		.append("text")
		.style("fill", "black")
		.attr("dx", 0)
		.attr("dy", 0)
	    .attr("text-anchor", "middle")
		.text(function(d) {
			return d.name;
		});

	force.on("tick", function() { //对于每一个时间间隔
		//更新连线坐标
		svg_links.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

		//更新节点坐标
		svg_nodes.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

		//更新文字坐标
		svg_texts.attr("x", function(d) { return d.x; })
			.attr("y", function(d) { return d.y; });
	});
}

// init force layout
let nodes = [];
let links = [];

drawGraph(nodes, links);
