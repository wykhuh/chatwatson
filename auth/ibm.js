var config = require('./local.env');

// defaults for dev outside bluemix
var service_url = config.service_url;
var service_username = config.service_username;
var service_password = config.service_password;

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
if (process.env.VCAP_SERVICES) {
  console.log('Parsing VCAP_SERVICES');
  var services = JSON.parse(process.env.VCAP_SERVICES);
  //service name, check the VCAP_SERVICES in bluemix to get the name of the services you have
  var service_name = 'machine_translation';
  
  if (services[service_name]) {
    var svc = services[service_name][0].credentials;
    service_url = svc.url;
    service_username = svc.username;
    service_password = svc.password;
  } else {
    console.log('The service '+service_name+' is not in the VCAP_SERVICES, did you forget to bind it?');
  }

} else {
  console.log('No VCAP_SERVICES found in ENV, using defaults for local development');
}

console.log('service_url = ' + service_url);
console.log('service_username = ' + service_username);
console.log('service_password = ' + new Array(service_password.length).join("X"));

var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');
