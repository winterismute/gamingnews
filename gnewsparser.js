$(document).ready(function () {
				$('nav a,footer a.up').click(function(e) {
					$.scrollTo( this.hash || 0, 1500);
					e.preventDefault();
				});
			
				$.get('http://store.steampowered.com/search/?specials=1', function(res) { //get the html source of this website
					var link = null;
					var name = null;
					var oldprice = null;
					var newprice = null;
					var element = null;
					var myformat = "<li><a href=\"{0}\"><strong>{1}</strong></a> - Old price: {2} -> <strong>NEW PRICE: {3}</strong></li>";
					$(res.responseText).find('#search_result_container').children(':eq(6)').children().each(function() {
						if ($(this).hasClass('search_result_row'))
						{
							if (link != null)
							{
								var ele = myformat.format(link, name, oldprice, newprice);
								$('#steamsale').append(ele);
							}
							link = $(this).attr('href');
						}
						if ($(this).hasClass('search_name'))
						{
							name = $(this).find('h4').text();
						}
						if ($(this).hasClass('search_price'))
						{
							var str = $(this).text().split('€');
							oldprice = str[0]+'€';
							newprice = str[1]+'€';
						}
					
					});
					var ele = myformat.format(link, name, oldprice, newprice);
					$('#steamsale').append(ele);
				});
				
				$.getJSON('http://gdata.youtube.com/feeds/api/users/gametrailers/uploads?v=2&max-results=6&alt=jsonc', function(json, status) {
					var myformat = "<p><iframe class=\"youtube-player\" type=\"text/html\" width=\"300\" height=\"225\" src=\"http://www.youtube.com/embed/{0}\" frameborder=\"0\"></p>";
					var i = 0;
					$.each(json.data.items, function() {
						var ele = myformat.format(this.id);
						var ci = i % 3;
						$('#c'+ci).append(ele);
						i++;
					})
				});
				
				function RSSFeed(){}

				RSSFeed.Entries = function(feed_url, callback){
					requestURL = "http://pipes.yahoo.com/pipes/pipe.run?_id=2f740a6440a7e61853613d4f4661e3b3&_render=json&_callback=?&feed=" + feed_url;
					$.getJSON(requestURL, function(json, status){
						callback(json.value.items, status);
					});
				}
				
				RSSFeed.Entries("http://feeds.feedburner.com/RockPaperShotgun?format=xml", function(json, status){
					var outputTemplate = "<p><a href=\"{0}\"><strong>{1}</strong></a><br />{2}<br /><small>{3} by {4}</small></p>";
					var narticles = 0;
					$.each(json, function(i){
						if (narticles < 8) {
							var createdAt = $.browser.msie ? this.pubDate : $.timeago(dateFormat(this.pubDate,"isoUtcDateTime"));
							var aut = (this.author == undefined) ? 'RockPaperShotgun' : this.author;
							$("#RPSFeed").append(outputTemplate.format(this.link, this.title, this.description, createdAt, aut));
						}
						narticles++;
					})
				})
				
				RSSFeed.Entries("http://www.everyeye.it/news_rss.asp?categoria=videogiochi", function(json, status){
					var myformat = "<p><a href=\"{0}\"><strong>{1}</strong></a><br />{2}<br /><small>{3} by {4}</small></p>";
					var narticles = 0;
					$.each(json, function(){
						if (narticles < 8) {
							var createdAt = $.browser.msie ? this.pubDate : $.timeago(dateFormat(this.pubDate,"isoUtcDateTime"));
							var aut = (this.author == undefined) ? 'EveryEye' : this.author;
							$("#EEFeed").append(myformat.format(this.link, this.title, this.description, createdAt, aut));
						}
						narticles++;
					})
					$('#EEFeed p').children("img").remove();
				})
				
				RSSFeed.Entries("http://feeds.gawker.com/Kotaku/full", function(json, status){
					var myformat = "<p><a href=\"{0}\"><strong>{1}</strong></a><br />{2}<br /><small>{3} by {4}</small></p>";
					var narticles = 0;
					$.each(json, function(){
						if (narticles < 8) {
							var createdAt = $.browser.msie ? this.pubDate : $.timeago(dateFormat(this.pubDate,"isoUtcDateTime"));
							var aut = (this.author == undefined) ? 'Kotaku' : this.author;
							$("#KFeed").append(myformat.format(this.link, this.title, this.description, createdAt, aut));
						}
						narticles++;
					})
					$('#KFeed p').children("img").remove();
				})
				
			});
			
			String.prototype.format = function () {
				var s = this,
				i = arguments.length;
				while (i--) {
					s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
				}
				return s;
			};