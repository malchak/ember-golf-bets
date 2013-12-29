App = Ember.Application.create();

App.ApplicationAdapter = DS.LSAdapter;

App.Round = DS.Model.extend({
	winnings: DS.attr('number'),
	datePlayed: DS.attr('date')
});

App.Router.map(function() {
  this.resource('rounds');
});

App.RoundsRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('round');
	},
	setupController: function(controller, model){
		controller.set('content', model);
	}
});

App.RoundsController = Ember.ArrayController.extend({
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
		}
	},

	inTheRed: false,

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

	amountWon: function(){
		return this.sum(this.get('wins').mapProperty('winnings'));
	}.property('wins'),

	amountLost: function(){
		return this.sum(this.get('losses').mapProperty('winnings'));
	}.property('@each'),
	
	netWinnings: function(){
		var netAmount = this.get('amountWon') + this.get('amountLost');
		if (netAmount < 0)
			{this.set('inTheRed', true);}
		else
			{this.set('inTheRed', false);}
		return netAmount;
	}.property('amountWon', 'amountLost'),

	avgWin: function(){
		return parseInt(this.get('amountWon') / this.get('totalWinningRounds'));
	}.property('amountWon', 'totalWinningRounds'),

	avgLoss: function(){
		return parseInt(this.get('amountLost') / this.get('totalLosingRounds'));
	}.property()

});









