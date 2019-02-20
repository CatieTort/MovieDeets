var movieDeets = {};

movieDeets.database = {};

movieDeets.loadAssets = function (){
	$.getJSON('db/movies.json', function (data){
			movieDeets.database = data;
			movieDeets.init();
	});
}

movieDeets.init = function (){
	movieDeets.filterSlider();
	movieDeets.getTypes();
	movieDeets.getDirectors();
	movieDeets.showSelections();
	movieDeets.generateMarkup();
	movieDeets.getRating();
};

movieDeets.filterSlider = function (){
	$('.filter.open').on('click', function (){
		$('.filter_container').slideToggle(300, function (){

					var btn = $(this).prev();

					if(btn.hasClass("active")){
						$('.filter.open').find('.btn_title').text("Filter");
 						$('.filter.open').find('.far.fa-caret-square-down').removeClass("hidden");
						$('.filter.open').find('.far.fa-caret-square-up').addClass('hidden');
						btn.removeClass('active');
					}else{
						$('.filter.open').find('.btn_title').text("Close");
						$('.filter.open').find('.far.fa-caret-square-down').addClass('hidden');
	 					$('.filter.open').find('.far.fa-caret-square-up').removeClass("hidden");
						btn.addClass('active');
					}
		});
	});
};

movieDeets.showSelections = function (){
	var categories = $('.select_list#categories')
	var directors = $('.select_list#directors')
	var catList = '.options_list#categories';
	var dirList = '.options_list#directors';
	var currentSelect = '';

	categories.on('click', function (){
		categories.find(catList).slideToggle(300, function(){
				categories.find('.option').on('click', function (){
					currentSelect = $('.options_list .selected')
					var select = $(this);
					var newVal = select.data('value');

					currentSelect.removeClass('selected');
					select.addClass('selected');
					categories.find('div.selected span.selected').text(select.text());
					categories.find('div.selected').attr('data-value', newVal);
				});
		});
	})

	directors.on('click', function (){
		directors.find(dirList).slideToggle(300, function(){
			directors.find('.option').on('click', function (){
				currentSelect = $('.options_list .selected')
				var select = $(this);
				var newVal = select.data('value');

				currentSelect.removeClass('selected');
				select.addClass('selected');
				directors.find('div.selected span.selected').text(select.text());
				directors.find('div.selected').attr('data-value', newVal);
			});
		});
	})
}

movieDeets.getRating = function (){

	var star = '<span class="fas fa-star"></span>'
	var id  = ''

	$.each(movieDeets.database, function(index){
		var db = movieDeets.database[index];
		var rate = '';

		if(db.rating && id != db.id){
			for (var i = 0; i <= db.rating - 1; i++){
				rate += star
				id = db.id
			}
		}

		$('#'+db.id).find('.movie_rating').append(rate);
	});
	movieDeets.showDescription();
	movieDeets.startFilter();
}

movieDeets.generateMarkup = function (){
	var template = '';

	$.each(movieDeets.database, function(index){
		var movie = movieDeets.database;

		template += '<div class="movie_item" id="'+movie[index].id+'">';
		template += 	'<div class="movie_item--main">';
		template += 		'<div class="movie_rating">';
		template += 		'</div>';
		template += 		'<div class="movie_header">';
		template += 			'<div class="movie_poster">';
		template += 				'	<img src="db/images/movies/'+movie[index].img+'">';
		template += 			'</div>';
		template += 		'</div>';
		template += 		'<div class="movie_stats">';
		template += 				'<h3>'+movie[index].title+'</h3>';
		template += 			'<div class="stat-1">';
		template += 				'<strong>Year:</strong>';
		template += 					'<span class="content">'+movie[index].year+'</span>';
		template += 			'</div>';
		template += 			'<div class="stat-2">';
		template += 				'<strong>Director:</strong>';
		template += 				'<span class="content">'+movie[index].director+'</span>';
		template += 			'</div>';
		template += 			'<div class="stat-3">';
		template += 				'<strong>Genre:</strong>';
		template += 				'<span class="content">'+movie[index].type+'</span>';
		template += 			'</div>';
		template += 		'</div>';
		template += 	'</div>';
		template += 	'<div class="show_desc">See Description</div>';
		template += '</div>';
		template += 	'<div class="movie_description" id="'+movie[index].id+'">';
		template += 		'<strong>Description:</strong>';
		template += 		'<span class="content_desc">'+movie[index].desc+'</span>';
		template += 	'</div>';

	});

	$('.main_container').append(template);
}

movieDeets.showDescription = function (){
	$('.show_desc').on('click', function (){
		var $this = $(this);
		var parent = $(this).parents().eq(2);
		var parentID = $(this).parent().prop('id');
		var el = parent.find('.movie_description'+'#'+parentID);

			el.slideToggle(300, function(){
				if($this.hasClass('active')){
					$this.text('See Description').removeClass('active');
				}else{
					$this.text('Hide Description').addClass('active');
				}
			});
	});
}

movieDeets.startFilter = function (){

	$('.options_list .option').on('click',function (){
		var db = movieDeets.database;
		var type = $('.select_list#categories').find($(this)).data('value');
		var director = $('.select_list#directors').find($(this)).data('value');
		
		var results = [];

		$.each(db, function(index){

			if(db[index].type === type){
				results.push(db[index].id)
			}
			if(db[index].director === director){
				results.push(db[index].id);
			}
		})

		if(results.length < 1){
			$('.movie_item').show();
		}else{
			var uniArray =  [];

			$.each(results, function(i, e){
				if($.inArray(e, uniArray) == -1){
					uniArray.push(e);
				}
			});

				console.log(uniArray)

			$('.movie_item').hide();
			$.each(uniArray, function(i,e){
				$('div#'+e).show();
			})
		}

	});
}

movieDeets.getTypes = function (){
	var types = [];

	$.each(movieDeets.database, function(index){
		var typeVal = movieDeets.database[index].type;

		if($.inArray(typeVal, types)){
			types.push(typeVal);
			$('#categories').find('.options_list').append('<div class="option" data-value="'+typeVal+'">'+typeVal+'</div>')
		}
	});
};

movieDeets.getDirectors = function (){
	var dirList = [];

	$.each(movieDeets.database, function(index){
		var director = movieDeets.database[index].director;

		if($.inArray(director, dirList)){
			dirList.push(director);
			$('#directors').find('.options_list').append('<div class="option" data-value="'+director+'">'+director+'</div>')
		}

	});
};


movieDeets.loadAssets();
