$(function() {
	$('.page-loader input').focus()
	$('.page-loader button').click(function(e){
		e.preventDefault()
		var requestURL = $('.page-loader input').val();

		$("#loader-container").show()

		$.ajax({
			type: "GET",
			url: requestURL,
			// url: "https://web-scraper-endpoint.vercel.app/scrape?url=https://fmcna.com/insights/articles/5-diamond-status-kathleen-belmonte/",
			// url: "https://web-scraper-endpoint.vercel.app/scrape?url=https://fmcna-stage65a.adobecqms.net/insights/articles/influenza-vaccination-keeps-dialysis-patients-hospital/",
			contentType: "application/json; charset=utf-8",
			success: function (data) {
				$('.source-page-holder').html('').append("<p>"+data.pageHeading+"</div>")	
				$('.source-page-holder').append("<img src='"+data.pageHeadingImageURL[0].img+"' alt='Alt TAG'>")
				$('.source-page-holder').append(data.pageContent)		

				$("#loader-container").hide()
				$('.action-container').fadeIn(function(){

					$(".source-page-holder > *").draggable({
						helper: 'clone',
						start: function(event, ui) {
							// console.log(event)
						  $(ui.helper).css('width', "45%");
						},
						stop: function(event, ui) {
						  $(ui.helper).css('width', "100%");
						},
						snap: true, 
					});

					$(".destination-page-holder .content-area").droppable({
						drop: function(event, ui) {
							var setEdit = $(ui.draggable).text().length ? true: false
							$(this).append($(ui.draggable).clone().attr('contenteditable',setEdit));							
						},
						classes: {
							'ui-droppable-hover': 'highlight'
						}
					});
				})
			},
			error: function (textStatus, errorThrown) {
				console.log(textStatus)
			}
		});
	})
	

	var resultJSON = [];
	$('.render-data').click(function(){
		if($('#destination .destination-page-holder').text().trim().length){

			$('.html-result').fadeIn().text(JSON.stringify({ html: $("#destination").html().trim().replace(/\n/g, '').replace(/ui-droppable/g, '') }))

			// resultJSON=[];
			// $('#destination ul li').each(function() {
			// 	resultJSON.push({ name: $(this).html() });
			// });
			
			// $('.json-result').fadeIn().text(JSON.stringify(resultJSON))
		}
	})


});