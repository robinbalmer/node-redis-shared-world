var express = require('express'),
	redis = require('redis'),
	async = require('async'),
    app = express(),
    socketListener = require('http').createServer(),
    io = require('socket.io').listen(socketListener);

    red = redis.createClient();


/*


red.lrange('map:row2',0,10,function(err, res){
	var map = res;
	console.log(map[5]);
	});


*/

//some global variables, because I am a monster apparently
var width = 10,
	height = 10;

var world = {},
	processed = 0;
	
/*
	 // make a custom html template
  app.register('.html', {
    compile: function(str, options){
      return function(locals){
        return str;
      };
    }
  });
*/

//function to check if all tiles are loaded
function checkMap(res,query,value){
	
	
	world[query] = value;

	processed++;
	
	if(processed > (width*height)-1){

		res.end(JSON.stringify(world));
	}
	
}

//app.use(express.logger());

app.get('/loadmap*', function(req, res){
	var start = req.query.start;
	var end = req.query.end;
	var queries = [];
	
	var obj;
	
	for(var i=0 ; i<width ; i++){
	
		for(var j=0 ; j<height ; j++){						
		
			
			queries.push("world1:row"+i+":col"+j);
		}
	
	}
	
	/*
		red.get("world1:row"+i+":col"+j, function(err,suc){
				console.log("A get for world1:row"+i+":col"+j+" has occurred." );				
				checkMap(res,i,j,suc);
			})
	*/
	
	async.forEach(queries, function(query){
		
		red.get(query, function(err,suc){
//				console.log("A get for world1:row"+i+":col"+j+" has occurred." );				
				checkMap(res,query,suc);
			})
		
		}, function(err){
		
		console.log('ASYNC ERROR')
		
	});
		
});


app.get('/sandbox', function(req, res){
	console.log('Eh, ma!');
  res.sendfile("sandbox.html");
});

//SOCKET logic
io.sockets.on('connection', function (socket) {
	
  socket.on('change', function (key) {
	  console.log('received a message for ' + key);
	  
	  red.incr(key);

      io.sockets.emit('refresh', { hello: 'world' });

  });
  
})




app.listen(3000);
socketListener.listen(3001);