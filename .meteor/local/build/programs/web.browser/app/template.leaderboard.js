(function(){
Template.body.addContent((function() {
  var view = this;
  return HTML.DIV({
    id: "outer"
  }, "\n    ", Spacebars.include(view.lookupTemplate("leaderboard")), "\n  ");
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("leaderboard");
Template["leaderboard"] = new Template("Template.leaderboard", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "leaderboard"
  }, "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("players"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("player")), "\n    " ];
  }), "\n  "), "\n\n  ", Blaze.If(function() {
    return Spacebars.call(view.lookup("selected_name"));
  }, function() {
    return [ "\n  ", HTML.DIV({
      "class": "details"
    }, "\n    ", HTML.DIV({
      "class": "name"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("selected_name"));
    })), "\n    ", HTML.INPUT({
      type: "button",
      "class": "inc",
      value: "Give 5 points"
    }), "\n  "), "\n  " ];
  }), "\n\n  ", Blaze.Unless(function() {
    return Spacebars.call(view.lookup("selected_name"));
  }, function() {
    return [ "\n  ", HTML.DIV({
      "class": "none"
    }, "Click a player to select"), "\n  " ];
  }) ];
}));

Template.__checkName("player");
Template["player"] = new Template("Template.player", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "player ", Spacebars.mustache(view.lookup("selected")) ];
    }
  }, "\n    ", HTML.SPAN({
    "class": "name"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  })), "\n    ", HTML.SPAN({
    "class": "score"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("score"));
  })), "\n  ");
}));

})();
