(function(){
  
  app.getTemplate = function(name, data) {
    return $.get('js/app/templates/' + name + '.hbs').then(function(src) {
        return Handlebars.compile(src)(data);
    }).fail(function(e){
      debugger; 
      console.log(e);});
  };
  
  app.router.inst = new app.router.Router();
  Backbone.history.start();
})();