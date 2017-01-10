var io = require('./node_modules/socket.io').listen(8085, { log: false });
    dl  = require('delivery');
 
io.sockets.on('connection', function(socket){
  var delivery = dl.listen(socket);
  delivery.on('delivery.connect',function(delivery){
 
    delivery.send({
      name: 'image_stream.jpg',
      path : './stream/image_stream.jpg',
      params: {foo: 'bar'}
    });
 
    delivery.on('send.success',function(file){
      console.log('File successfully sent to client!');
    });
 
  });
});
