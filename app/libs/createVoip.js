
var createVoip = {};
var http = require('http');
var twilio = require('twilio');

createVoip.makevoip = function(body){
    // Create an HTTP server, listening on port 1337
    http.createServer(function (req, res) {
        // Create a TwiML response and a greeting
        var resp = new twilio.TwimlResponse();
        resp.say({voice:'woman'}, 'Welcome to Care to call!');
     
        // The <Gather> verb requires nested TwiML, so we pass in a function
        // to generate the child nodes of the XML document
        resp.gather({ timeout:30 }, function() {
     
            // In the context of the callback, "this" refers to the parent TwiML
            // node. The parent node has functions on it for all allowed child
            // nodes. For <Gather>, these are <Say> and <Play>.
            resp.say({voice:'woman'},body);
            //this.say(body);
     
        });
     
        //Render the TwiML document using "toString"
        res.writeHead(200, {
            'Content-Type':'text/xml'
        });
        res.end(resp.toString());
     
    }).listen(9000);
};

module.exports = createVoip;