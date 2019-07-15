var express=require('express'),
    app=express(),
    bodyParser=require('body-parser'),
    mongoose=require('mongoose');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

var http = require('http').createServer(app);
var io = require('socket.io')(http);
var isFirstCell=true;
var counter=0;
var currentCell=null;

app.set('view engine','ejs');
app.use(express.static('public'));
//======================================================================================
//DATABASE CONNECTION AND SETUP
//======================================================================================
mongoose.connect('mongodb://localhost/Mine_Sweeper', {useNewUrlParser: true},function(){
    if(mongoose.connection.readyState)//connected to DB Successfully
         mongoose.connection.db.dropDatabase();//reset database on every server restart
    else
        console.log('[ERROR] COULD NOT CONNECT TO MONGODB SERVER!');
});
var CellSchema=mongoose.Schema({
row: String , col: String , type: String , time: Number ,id:String
})

var Cell=mongoose.model('cells',CellSchema);
//======================================================================================
//ROUTES
//======================================================================================
app.get('/',function(req,res){
        res.render('Home/home');

})
app.get('/addinfo',function(req,res){
    res.render('addInfo/addInfo');
})
app.get('/info',function(req,res){
    res.render('info/table');
})

app.post('/addcell',function(req,res){
    var object={row:req.body.row
        ,col:req.body.col.toUpperCase().charAt(0)
        ,type:req.body.type
        ,time:counter
        ,id:req.body.row+req.body.col.toUpperCase().charAt(0)};
        if(object.col.charCodeAt(0)>=84){
            res.redirect('addinfo');
            return;
        }
    counter++;
    Cell.find({id:object.id},function(err,result){
        if(result[0]){
            Cell.updateOne(
                { "id": object.id },
                { "$set": { "type": object.type } },
                function (err, raw) {
                    if (err) {  console.log('[ERROR] COULD NOT UPDATE DB');  }
                }
            );
            io.emit('updateCell',object);  
        }else{
            
            new Cell(object).save();
            io.emit('newCell',object);
            if(isFirstCell){
                isFirstCell=false;
                io.emit('defineCurrentCell',object);
                currentCell=object;
             }
        }
    })
    
    res.redirect('addinfo');
    
})
app.post('/currentcell',function(req,res){
    Cell.find({id:req.body.row+req.body.col.toUpperCase().charAt(0)},function(err,result){
        if(result[0]){
            io.emit('refreshCurrentCell',result[0]);
            currentCell=result[0];
        } 
    })
    res.redirect('addinfo');

})
//======================================================================================
//SOCKET.IO LOGIC
//======================================================================================

io.on('connection', function(socket){
    var clientIp = socket.request.connection.remoteAddress;  
    console.log('Connection From: '+clientIp);
    if(isFirstCell)return;
    //on connection i need to send all saved cells in the database and define the current cell
    Cell.find({},function(err,dbcells){
        if(err) console.log("[ERROR] COULDN'T SEND CELLS TO NEWLY CONNECTED DEVICE!");
        else if(dbcells.length==0)console.log("[ERROR] NO CELLS IN THE DB!");
        else socket.emit('initCells',dbcells);
    });
    //send current cell after socket finishes initialization
    socket.on('finishedInitialization',function(){
        if(currentCell!=null){
            socket.emit('defineCurrentCell',currentCell);
        }
    });
   
});


//======================================================================================
//SERVER LISTENING
//======================================================================================
http.listen(process.env.PORT||8080,process.env.IP, function(){
    console.log('Server Start [Port : 8080]');
  });
//app.listen(process.env.PORT||8080,process.env.IP,function(){
  //  console.log('Server Start');
//})