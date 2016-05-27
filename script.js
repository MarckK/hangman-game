var maximumGuesses = 2;

$(document).ready(function() {
	$('.console').hide();
	$('.remaining-guesses').hide();

	$(document).on('click', '#new-game', function() {
		$(this).hide();
		$('.attempts').html('');
		$('.remaining-guesses').show();
		$('.console').slideToggle(1100);
		$('.letter').focus();
		$('.letter').removeClass('error');
		makeNewGame();
	})
	
	$(document).on('click', '#guess', function (){
		makeAGuess($('.letter').val());
		$('.letter').val('').focus();
	})
})

function updateToken (token) {
	$('.token').text(token);
}

function updateWord (word){
	$('.hangman-word').text(word);
}

function displayAttempt (guess, correct) {
	$('.attempts').append('<span class="'+ (correct ? 'correct' : 'wrong') +'">' + guess + '</span>');
}

function refreshRemainingGuesses () {
	var numberWrongAnswers = $('.wrong').length;
	var remainingGuesses = maximumGuesses - numberWrongAnswers;
	$('.remaining').html(remainingGuesses);
	isGameEnded(remainingGuesses);
}

function isGameEnded (remainingGuesses) {
	if(remainingGuesses <= 0) {
		$('.remaining-guesses').hide();
		$('.attempts').hide();
		$('.console').slideToggle(1100);
		$('#new-game').show();
		getSolution();
	} 
}

function getSolution (){
	$.ajax({
    	type: "GET",
    	dataType: 'json',
    	url: "http://hangman-api.herokuapp.com/hangman",
    	data: { 
    		"token": $('.token').text() 
    	},
  	}).done(function(data) {
  		updateWord(data.solution);
  	})
}

function makeNewGame() {
	$.ajax({
		url: "http://hangman-api.herokuapp.com/hangman",
		type: 'POST',
	}).done(function(data) {
		updateWord(data.hangman);
		updateToken(data.token);
		refreshRemainingGuesses();
	})
}

function makeAGuess(guess) {

	console.log("guessing... " +guess)
	$('.letter').addClass('error');
	if ($.isNumeric(guess)) {
		return;
	} 
	var previousAttemps = $('.attempts').text();
	if (previousAttemps && previousAttemps.indexOf(guess) >= 0) {
		return;
	}
	$('.letter').removeClass('error');
	$.ajax({
		url: "http://hangman-api.herokuapp.com/hangman",
		type: 'PUT',
		data: { 
			token: $('.token').text(),
			letter: guess 
		},
	}).done(function(data) {
		updateToken(data.token);
		updateWord(data.hangman);
		displayAttempt(guess, data.correct);
		refreshRemainingGuesses();

		console.log(data);
	})

}