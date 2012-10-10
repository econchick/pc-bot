$(function() {

//
// Models
//

// Base class for handling flask.jsonify-style JSON.
var FlaskCollection = Backbone.Collection.extend({
    parse: function(resp, xhr) {
        return resp.objects;
    }
});

// An individual Talk object.
var Talk = Backbone.Model.extend({});

// A list of talks.
var TalkCollection = FlaskCollection.extend({
    model: Talk,
    url: '/api/talks/ungrouped',
    comparator: function(talk) {
        return talk.get('talk_id');
    }
});

// A thunderdome group.
var Group = Backbone.Model.extend({});

// The list of groups.
var GroupCollection = FlaskCollection.extend({
    model: Group,
    url: '/api/groups',
    comparator: function(group) {
        return group.get('number');
    }
});

//
// Views
//

// A single talk row.
var TalkView = Backbone.View.extend({
    tagName: "tr",
    template: _.template($('#talk-row-template').html()),

    events: {
        "click": "toggleSelect"
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    toggleSelect: function() {
        this.$el.toggleClass('selected');
    }
});

// The list of ungrouped talks down the side.
var UngroupedTalkListView = Backbone.View.extend({
    el: $("#talks"),

    initialize: function() {
        this.collection.on('add', this.addOne, this);
        this.collection.on('reset', this.addAll, this);
        this.collection.on('all', this.render, this);
        this.collection.fetch();
    },

    addOne: function(talk) {
        var tv = new TalkView({model: talk});
        this.$('table').append(tv.render().el);
    },
    addAll: function() {
        this.collection.each(this.addOne, this);
    }
});

// A single group list item.
var GroupView = Backbone.View.extend({
    tagName: "li",
    attributes: {"class": "span5"},
    template: _.template($('#group-row-template').html()),

    events: {
        'click .add-talks': 'addTalksToGroup',
        'click .remove-group': 'removeThisGroup'
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    addTalksToGroup: function() {
        alert('add talks to group ' + this.model.get('name'));
    },

    removeThisGroup: function() {
        alert('remove group ' + this.model.get('name'));
    }
});

// The group list view
var GroupListView = Backbone.View.extend({
    el: $("#groups"),

    events: {
        'click #new-group': 'addNewGroup'
    },

    initialize: function() {
        this.collection.bind('add', this.addOne, this);
        this.collection.bind('reset', this.addAll, this);
        this.collection.bind('all', this.render, this);
        this.collection.fetch();
    },

    addOne: function(group) {
        var gv = new GroupView({model: group});
        this.$('ul').append(gv.render().el);
    },

    addAll: function() {
        this.collection.each(this.addOne, this);
    },

    addNewGroup: function() {
        alert('new group');
    }
});

//
// main, as it were
//
var ungroupedTalks = new TalkCollection();
var ungroupedTalksView = new UngroupedTalkListView({collection: ungroupedTalks});
var groups = new GroupCollection();
var groupView = new GroupListView({collection: groups});

});