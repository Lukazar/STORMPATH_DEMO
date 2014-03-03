/**
 * Loads the submodules
 * 
 * @module API
 */

module.exports = function(app) {
 
  //routes to access the user login
  require('./users/login')(app);
 
};
