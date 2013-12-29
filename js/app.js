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

	sum: function(arr){
		total = 0
		for(var i = 0; i < arr.length; i++){total = total + arr[i];}
		return total;
	},

	totalRounds: function(){
		return this.get('length');
	}.property('@each'),

	totalWinningRounds: function(){
		var content = this.filter(function(round){
			return round.get('winnings') > 0;
		});
		return content.get('length');
	}.property('@each.winnings'),

	totalLosingRounds: function(){
		var content = this.filter(function(round){
			return round.get('winnings') < 0;
		});
		return content.get('length');
	}.property('@each.winnings'),

	amountWon: function(){
		var array = this.filter(function(round){
			return round.get('winnings') > 0;
		});
		return this.sum(array.mapProperty('winnings'));
	}.property('@each'),

	amountLost: function(){
		var content = this.filter(function(round){
			return round.get('winnings') < 0;
		});
		return this.sum(content.mapProperty('winnings'));
	}.property('@each'),
	
	netWinnings: function(){
		var netAmount = this.get('amountWon') + this.get('amountLost');
		if (netAmount < 0)
			{this.set('inTheRed', true);}
		else
			{this.set('inTheRed', false);}
		return netAmount;
	}.property('amountWon', 'amountLost')
	
});









