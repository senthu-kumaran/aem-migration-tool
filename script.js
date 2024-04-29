$(function() {

	$.ajax({
        type: "GET",
        url: "https://web-scraper-endpoint.vercel.app/scrape?url=https://fmcna-stage65a.adobecqms.net/insights/articles/influenza-vaccination-keeps-dialysis-patients-hospital/",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
			console.log(data)			
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus)
        }

    });

	var resultJSON = [];

	$(".destination-page-holder .content-area").droppable({
		drop: function(event, ui) {
			$(this).append($(ui.draggable).clone());
		},
		classes: {
			'ui-droppable-hover': 'highlight'
		}
	});
	$(".source-page-holder section").draggable({
		helper: 'clone',
		start: function(event, ui) {
		  $(ui.helper).css('width', "45%");
		},
		stop: function(event, ui) {
		  $(ui.helper).css('width', "100%");
		},
        snap: true, 
	});

	$('.render-data').click(function(){
		console.log($('.content-area').text().trim())
		if($('#destination .destination-page-holder').text().trim().length){

			$('.html-result').fadeIn().text(JSON.stringify({ html: $("#destination").html() }))

			resultJSON=[];
			$('#destination ul li').each(function() {
			resultJSON.push({ name: $(this).html() });
			});

			$('.json-result').fadeIn().text(JSON.stringify(resultJSON))
		}
	})


});