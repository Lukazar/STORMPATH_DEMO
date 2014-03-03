app.router = app.router || {};

app.router.Router = Backbone.Router.extend({
  view: null,
  routes: {
    '': 'home'    
  },

  home: function() {

    if (this.view) {
      this.destroyView();
    }

    this.view = new app.view.Home();
  }  
});