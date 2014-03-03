var application_root = __dirname,
  cluster       = require('cluster'),
  numCPUs       = require("os").cpus().length,
  //WebSocketServer = require('ws').Server,
  //WebSocket     = require('ws'),
  express       = require( 'express' ), //Web framework    
  path        = require( 'path' ), //Utilities for dealing with file paths            
  debug       = true;

if (cluster.isMaster && !debug) {
  
  //create a process for each CPU 
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();
    });
    
} else {
  var app = express();
  
  // Configure server
  app.configure( function() {
    
    //gzip
    app.use( express.compress() );
    
      //parses request body and populates request.body
    app.use( express.bodyParser() );
  
      //checks request.body for HTTP method overrides
      app.use( express.methodOverride() );
  
      //strip off any trailing slash and redirect with a proper 301.
    app.use(function(req, resp, next) {
      
      if(req.url.substr(-1) == '/' && req.url.length > 1){
        resp.redirect(301, req.url.slice(0, -1));
      } else {
        next();
      }
    });
      
      //perform route lookup based on url and HTTP method
      app.use( app.router );
  
      //Where to serve static content       
      app.use(express.static(path.join(application_root, '../')));
  
      //Show all errors in development
      app.use( express.errorHandler({ dumpExceptions: true, showStack: true }));
      
  });
  
  
  //API Test End point -- should be removed eventually
  app.get('/api/' , function(req, resp){
    resp.send('API is running');
  });
  
  var port = 4711;
  app.listen( port, function() {
    if(debug){
      console.log( 'Debug Express server listening on port %d in %s mode', port, app.settings.env);
    } else {
      console.log( 'Express server listening on port %d in %s mode, worker: %d', port, app.settings.env, cluster.worker.id);  
    }
      
  });
  
  //load the routes
  require("./routes")(app);
}