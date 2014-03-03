/**
 * Login router module, brokers the API access to STORMPATH
 * 
 * @module API
 * @submodule Users
 * @for login
 */

var exec = require('child_process').exec, config = require('../../configs/constants.json');

module.exports = function(app){
  app.post('/api/v1/users/login', function(req, resp){    
    
    //assuming proper data at this point... should validate
    validateUser(req.body.username, req.body.password, function(err, result){
      if(err){
        resp.json({success:false, error:err});
      } else {
        
        if(result.account && result.account.href){
        
          //user was valid, lets just their details
          getUserDetails(result.account.href, function(err, result){
            if(err){
              resp.json({success:false, error:err});
            } else {
              resp.json({success:true, result:result});
            }
          });
        } else {
          resp.json({success:false, error: 'User was authenticated, but not details found!'});
        }
      }
    });    
  });
}


function validateUser(username, password, callback){
  var auth = username + ':' + password, basic, command, data = {};
  
  basic = new Buffer(auth).toString('base64');
  
  data.type = 'basic';
  data.value = basic;
  
  
  command = 'curl -X POST --user ' + config.public_key + ':' + config.private_key + ' ' + 
  		        '-H "Accept: application/json" ' +
  		        '-H "Content-Type: application/json" ' +
  		        '-d \'' + JSON.stringify(data) + '\' ' +
  		        config.api_url + config.login_api;
  
  exec(command, function(error, stdout, stderr){
    
    if(error){
      callback(error, null);
    } else {
      callback(null, JSON.parse(stdout));
    }        
  });
 
  
  
}

function getUserDetails(user, callback){
  var command;
  
  command = 'curl -X GET --user ' + config.public_key + ':' + config.private_key + ' ' + 
              '-H "Accept: application/json" ' +
              '-H "Content-Type: application/json" ' +
              user;
  
  exec(command, function(error, stdout, stderr){
    if(error){
      callback(error, null);              
    } else {
      callback(null, JSON.parse(stdout));
    }
  });    
}