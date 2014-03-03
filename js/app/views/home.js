app.view = app.view || {};

app.view.Home = Backbone.View.extend({
  template: 'home',
  el: $('#wrapper'),

  events: {
    'click #login': 'login'
  },

  initialize: function() {
    this.render();        
  },

  render: function() {
    var that = this;

    // display the template
    app.getTemplate(this.template, {}).done(function(_template) {
      $(that.el).html(_template);          
    });
  },
  
  login: function(e){
    e.preventDefault();
    
    var username = $('#username').val(), password = $('#password').val();
    
    $.ajax({
      url: 'http://localhost:4711/api/v1/users/login',
      type: 'POST',      
      context: this,
      data: 'username=' + username + '&password=' + password,
      success:function(resp){
        $(this.el).html('<code>' + resp.result.givenName + '</code>');
      }, error:function(error){
        $(this.el).html('<code>' + JSON.stringify(error) + '</code>');
      }      
    });    
  }
});