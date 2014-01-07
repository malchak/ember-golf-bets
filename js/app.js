App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter;

App.Router.map(function() {
  this.resource('rounds', function(){
  });
});

App.Round = DS.Model.extend({
	winnings: DS.attr('number'),
	datePlayed: DS.attr('date')
});

App.RoundsRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('round');
	}
});

App.RoundsController = Ember.ArrayController.extend({
	inTheRed: false,
	isVisible: false,
	placeHolder: "input winnings, then hit enter",

	actions: {
		add: function(){
			var winnings = this.get('winnings');
			if (!winnings.trim()){return;}
			var round = this.store.createRecord('round', {
				winnings: parseInt(winnings),
				datePlayed: new Date()
			});
			round.save()
			this.set('winnings', '');
			this.transitionToRoute('rounds');
		},
		toggleNew: function(){
			this.toggleProperty('isVisible');
		}
	},
	
	wins: function(){
		var arr = this.filter(function(round){
			return round.get('winnings') > 0;
		});
		return arr;
	}.property('@each'),

	losses: function(){
		var arr = this.filter(function(round){
			return round.get('winnings') < 0;
		});
		return arr;
	}.property('@each'),

	sum: function(arr){
		total = 0
		for(var i = 0; i < arr.length; i++){total = total + arr[i];}
		return total;
	},

	totalRounds: function(){
		return this.get('length');
	}.property('@each'),

	totalWinningRounds: function(){
		return this.get('wins').get('length');
	}.property('wins'),

	totalLosingRounds: function(){
		return this.get('losses').get('length');
	}.property('losses'),

	totalAmountWon: function(){
		return this.sum(this.get('wins').mapProperty('winnings'));
	}.property('wins'),

	totalAmountLost: function(){
		return this.sum(this.get('losses').mapProperty('winnings'));
	}.property('@each'),
	
	netWinnings: function(){
		var netAmount = this.get('totalAmountWon') + this.get('totalAmountLost');
		if (netAmount < 0)
			{this.set('inTheRed', true);}
		else
			{this.set('inTheRed', false);}
		return netAmount;
	}.property('totalAmountWon', 'totalAmountLost'),

	avgWin: function(){
		return parseInt(this.get('totalAmountWon') / this.get('totalWinningRounds'));
	}.property('totalAmountWon', 'totalWinningRounds'),

	avgLoss: function(){
		return parseInt(this.get('totalAmountLost') / this.get('totalLosingRounds'));
	}.property('totalAmountLost', 'totalLosingRounds'),

	largestWin: function(){
		var sortedWins = this.get('wins').mapProperty('winnings').sort();
		return sortedWins.get('lastObject');
	}.property('wins'),

	worstLoss: function(){
		var sortedLosses = this.get('losses').mapProperty('winnings').sort();
		return sortedLosses.get('lastObject');
	}.property('losses'),

	trending: function(){
		var allRounds = this.filter(function(round){return round;});
		var lastThreeWinnings = allRounds.mapProperty('winnings').slice(-3);
		if (this.sum(lastThreeWinnings) > 0)
			{ return 'Up';}
		else if (this.sum(lastThreeWinnings) < 0)
			{return 'Down';}
		else
			{return "Trending even"}
	}.property('@each')
});

Ember.TextField.reopen({
	attributeBindings: ['autofocus']
});

App.AddRoundView = Ember.View.extend({
	tagName: 'div'
});

