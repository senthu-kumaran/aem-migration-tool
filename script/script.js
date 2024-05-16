$(function() {

	$('#import').change(function(){
		if(this.files.length && this.files[0].type == 'application/json'){
			console.log(this.files[0].type)

			var reader = new FileReader(); 
    
			reader.addEventListener('load', function() {
				var result = JSON.parse(reader.result); 
				loadPage(result)
			});
			reader.readAsText(this.files[0]);
		}
	})

	var requestURL
	$('.page-loader input').focus()
	
	if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
		console.log('asdf')
		requestDomain = "http://localhost:3000"
	}else{
		requestDomain = "https://web-scraper-endpoint.vercel.app"
		$('.load-url input').val('')
	}

	$('.page-loader button').click(function(e){
		e.preventDefault()
		requestURL = $('.load-url input').val();

		if(requestURL.trim().length){
			$("#loader-container").show()

			// https://fmcna.com/insights/articles/5-diamond-status-kathleen-belmonte/"
			// https://fmcna-stage65a.adobecqms.net/insights/articles/influenza-vaccination-keeps-dialysis-patients-hospital/",
	
			$.ajax({
				type: "GET",
				url: requestDomain+"/scrape?url="+requestURL,
				contentType: "application/json; charset=utf-8",
				success: function (data) {
					loadPage(data)
				},
				error: function (textStatus, errorThrown) {
					console.log(textStatus)
				}
			});
		}		
	})
	
	$('.switch input[type=checkbox]').change(function(){
		$(".action-container").hide()
		$('#import').val('')
		if($(this).is(":checked")){
			$('.load-text').text('Toggle to load from URL')
			$('.load-data').hide()
			$('.load-json').fadeIn()
		}else{
			$('.load-text').text('Toggle to load from JSON')
			$('.load-data').hide()
			$('.load-url').fadeIn()
			$('.page-loader input').focus()
		}
	});
	
	$('body').delegate('.drop-container span.close','click', function(){
		$(this).next().remove().end().remove()
	});

	var resultJSON = [], socialShareURLs = [];
	$('.render-data').click(function(){
		if($('.content-area').text().trim().length){
			let removeClose = new RegExp('<span class=\"close\">X</span>', 'g');
			resultJSON=[], socialShareURLs = [];

			$('.social-share-container').each(function(){
				pushToArray(socialShareURLs,$(this).find('label').text(),$(this).find('input').val())
			})

			resultJSON.push({
				url: requestURL,
				pre_title: $('.pre-title').text(),
				page_banner: $('.banner-image').html().replace(removeClose, ''),
				page_title: $('.page-title').text(),
				page_content: $('.page-content').html().replace(removeClose, ''),
				social_share_url: socialShareURLs
			})
			
			$('.json-result').fadeIn().text(JSON.stringify(resultJSON))
		}
	})

	
function pushToArray(array, key, val) {
    var obj = {};
    obj[key] = val;
    array.push(obj);
}

function loadPage(data){

	resetPage()
	$('.source-page-holder').html('').append("<p>"+data.pageHeading+"</div>")	
	$('.source-page-holder').append("<img src='"+data.pageHeadingImageURL[0].img+"' alt='Alt TAG'>")
	$('.source-page-holder').append(data.pageContent)	
	
	$.each(data.socialShareURL,function(index,value){
		
		let key = Object.keys(data.socialShareURL[index]),
			keyValue = data.socialShareURL[index][key];

		$('.destination-page-holder').append('<div class="social-share-container"><label for="'+key+'">'+key+'</label><input type="text" value="'+keyValue+'" class="social-share-input"/></div>')
	})

	$("#loader-container").hide()
	$('.action-container').fadeIn(function(){

		$(".source-page-holder > *").draggable({
			helper: 'clone',
			start: function(event, ui) {
				$(ui.helper).css('width', "45%");
			},
			stop: function(event, ui) {
				$(ui.helper).css('width', "100%");
			},
			snap: true, 
		});

		$(".destination-page-holder .drop-container").droppable({
			drop: function(event, ui) {
				var setEdit = $(ui.draggable).text().length ? true: false
				$(this).append($(ui.draggable).clone().attr('contenteditable',setEdit));	
				// $("<span class='close'>&#x2716</span>").insertAfter($(this).find('.ui-draggable'))	
				$(this).find('.ui-draggable').each(function(){
					if(!$(this).prev().is($('.close'))){
						$("<span class='close'>X</span>").insertBefore($(this))
					}
				})
			},
			classes: {
				'ui-droppable-hover': 'highlight'
			}
		});
	})
}

function resetPage(){
	$('.drop-container').html('')
	$('.social-share-container').remove()
}

});