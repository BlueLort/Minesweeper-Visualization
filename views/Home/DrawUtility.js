const  BURIED_MINE_COLOR=0xff3300;
const  SURFACE_MINE_COLOR=0xe68a00;
const  EMPTY_CELL_COLOR=0x00ff99;
const  CURRENT_CELL_COLOR=0x0099cc;
function getColor(type){
    switch(type){
        case 'BURIED_MINE': return BURIED_MINE_COLOR;
        case 'SURFACE_MINE': return SURFACE_MINE_COLOR;
        case 'CURRENT_CELL': return CURRENT_CELL_COLOR;
        default: return EMPTY_CELL_COLOR;
    }
}
function RecolorCell(currentCell,type){
    currentCell.Line.material.color.set(getColor(type));
    currentCell.Plane.material.color.set(getColor(type));
}

function addCell(locX,locY,scene,type,time,id){
    //create the lines
    var lineGeo= new THREE.Geometry();
    lineGeo.vertices.push(new THREE.Vector3( -SQUARE_SIZE/2, SQUARE_SIZE/2, 0) );
    lineGeo.vertices.push(new THREE.Vector3( SQUARE_SIZE/2, SQUARE_SIZE/2, 0) );
    lineGeo.vertices.push(new THREE.Vector3( SQUARE_SIZE/2, -SQUARE_SIZE/2, 0) );
    lineGeo.vertices.push(new THREE.Vector3( -SQUARE_SIZE/2, -SQUARE_SIZE/2, 0) );
    lineGeo.vertices.push(new THREE.Vector3( -SQUARE_SIZE/2, SQUARE_SIZE/2, 0) );
    var matCol=getColor(type);
    var matLine = new THREE.LineBasicMaterial( {  color: matCol } );
    var line=new THREE.Line( lineGeo, matLine );
    //fix line location
    line.position.set(locX,locY,0);
    //create ground
    var groundGeo = new THREE.PlaneGeometry( SQUARE_SIZE, SQUARE_SIZE, 0 );
    var matGround = new THREE.MeshBasicMaterial( {color: matCol,transparent:true,opacity:0.6} );
    var plane = new THREE.Mesh( groundGeo, matGround );
    //fix plane location
    plane.position.set(locX,locY,0);
    //animations using TweenJS
    var tweenA=new TWEEN.Tween( plane.material ).to( { opacity: 0.15 }, 2000 ).easing(TWEEN.Easing.Quadratic.InOut);
    var tweenB=new TWEEN.Tween( plane.material ).to( { opacity: 0.65 }, 2000 ).easing(TWEEN.Easing.Quadratic.InOut);
    tweenA.start();
    tweenA.onComplete(function() {
       tweenB.start(); 
    });
    tweenB.onComplete(function(){
        tweenA.start();
    })

    //make line and plane ready for animation
    line.position.z=32;
    plane.position.z=32;
    //Add Cell
    scene.add(line,plane);
    new TWEEN.Tween( line.position ).to( {z:0}, 1500 ).easing(TWEEN.Easing.Quadratic.InOut).start();
    new TWEEN.Tween( plane.position ).to( {z:0}, 1500 ).easing(TWEEN.Easing.Quadratic.InOut).start();
    return ({Line: line , Plane: plane,Type:type,Time:time,ID:id});
}