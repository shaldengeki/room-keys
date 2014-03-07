days_of_week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Keys = new Meteor.Collection("keys");
  
if (Meteor.isClient) {
  Template.key_list.keys = function() {
    return Keys.find({}, {sort: {last_updated: -1, person: 1}})
  };

  Template.key_info.maybe_selected = function() {
    return Session.equals("selected_key_id", this._id) ? "selected" : "";
  };

  Template.key_info.updated_string = function() {
    d = this.last_updated;
    return d.getHours() + ":" + d.getMinutes() + " on " + days_of_week[d.getDay()];
  };

  Template.key_info.events = {
    'click': function() {
      if (Session.equals("selected_key_id", this._id)) {
        Session.set('selected_key_id', undefined);
        Session.set('selected_key', undefined);
      } else {
        Session.set('selected_key_id', this._id);
        Session.set('selected_key', this);
      }
    }
  };

  Template.add_key_menu.hidden_if_key_selected = function() {
    return Session.equals("selected_key_id", undefined) ? "" : "hidden";
  }
  Template.selected_key_menu.showing_if_key_selected = function() {
    return Session.equals("selected_key_id", undefined) ? "hidden" : "";
  }
  Template.selected_key_menu.key_id = function() {
    return Session.get('selected_key_id');
  }
  Template.selected_key_menu.key_person = function() {
    return Session.get('selected_key') == undefined ? undefined : Session.get('selected_key').person;
  }

  function add_key() {
    new_key = {
      'person': $('#add_key_form input[name="person"]')[0].value,
      'last_updated': new Date()
    };

    Keys.insert(new_key, function(err) {
      if (!err) {
        $('#add_key_form')[0].reset();
      } else {
        console.log(err);
      }
    });
  }
  Template.add_key_menu.events({
    'submit': function() {
      add_key();
      event.preventDefault();
    }
  });

  function update_key() {
    new_fields = {
      'person': $('#update_key_form input[name="person"]')[0].value,
      'last_updated': new Date()
    };

    Keys.update(Session.get('selected_key')._id, {$set: new_fields}, function(err) {
      if (!err) {
        $('#update_key_form')[0].reset();
      } else {
        console.log(err);
      }
    });
  }
  function delete_key() {
    Keys.remove(Session.get('selected_key')._id, function(err) {
      if (!err) {
        $('#update_key_form')[0].reset();
      } else {
        console.log(err);
      }
    });
  }

  Template.selected_key_menu.events({
    'submit': function() {
      update_key();
      event.preventDefault();
    },
    'click #delete': function() {
      delete_key();
      event.preventDefault();
    }
  });
  Template.selected_key_menu.rendered = function() {
    // focus the update form upon render.
    $('#update_key_form input[name="person"]')[0].focus();
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}