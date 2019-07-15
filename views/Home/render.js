import * as THREE from './build/three.module.js';
import Stats from './jsm/libs/stats.module.js';
import { GUI } from './jsm/libs/dat.gui.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';

const SQUARE_SIZE=8;
const MARGIN=0.5;
var clock = new THREE.Clock();
var Cells=Create2DArray(19);//because the competition rule book specified a 19x19 grid

var cellsAvailableGrid=[];//have the current drawn cells only so its easier and faster to translate them
var currentCell=null;


if ( WEBGL.isWebGLAvailable() ) {
    //======================================================================================
    var scene = new THREE.Scene();
    //======================================================================================
    //SOCKET SETUP
    //======================================================================================

    var socket = io();
  socket.on('initCells', function(cellArr){
    cellArr.forEach(function(cell){
      constructNewCell(cell,Cells,cellsAvailableGrid,scene);
      createGridText(cell.row,cell.col,scene);
     })
     socket.emit('finishedInitialization');
    });
  socket.on('defineCurrentCell', function(cell){
        var col=cell.col.charCodeAt(0)-65;
        var row=Number(cell.row)-1;
        currentCell=Cells[row][col];
        RecolorCell(currentCell,'CURRENT_CELL');
        //TRANSLATE TEXT BEFORE CELLS [Current might be translated and mess up with text]
        translateTextMesh(cellsAvailableText,currentCell);
        translateCells(cellsAvailableGrid,currentCell);
        
    });
  socket.on('refreshCurrentCell', function(cell){
      var col=cell.col.charCodeAt(0)-65;
      var row=Number(cell.row)-1;
      if(currentCell!=null)RecolorCell(currentCell,currentCell.type);
      currentCell=Cells[row][col];
      RecolorCell(currentCell,'CURRENT_CELL');
        //TRANSLATE TEXT BEFORE CELLS [Current might be translated and mess up with text]
      translateTextMesh(cellsAvailableText,currentCell);
      translateCells(cellsAvailableGrid,currentCell);
      
      
  });
  socket.on('newCell', function(cell){
    constructNewCell(cell,Cells,cellsAvailableGrid,scene);
    createGridText(cell.row,cell.col,scene);
    if(currentCell!=null){
      //TRANSLATE TEXT BEFORE CELLS [Current might be translated and mess up with text]
      //translateTextMesh(cellsAvailableText,currentCell);
      //translateCells(cellsAvailableGrid,currentCell);
    }
  });
  socket.on('updateCell', function(cell){
    
    var col=cell.col.charCodeAt(0)-65;
    var row=Number(cell.row)-1;
    Cells[row][col].type=cell.type;
    if(currentCell.ID!=cell.id)RecolorCell(Cells[row][col],cell.type);
  });
    //======================================================================================
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1024 );
    camera.position.set( 0, 0, 100 );
    camera.lookAt( 0, 0, 0 );
    scene.add(camera );
    //======================================================================================
    //RENDERER SETUP
    //======================================================================================
    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    //======================================================================================
    //CONTROLS (ORBIT)
    //======================================================================================
    var controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.minPolarAngle = -Math.PI * 0.5;
    controls.minAzimuthAngle =-Math.PI * 0.25;
    controls.maxAzimuthAngle =Math.PI * 0.25;
	  controls.minDistance = 16;
    controls.maxDistance = 256;
    controls.saveState();
    controls.enableKeys=false;
     //====================================================================================== 
     //CONTROLS  (KEYBOARD)      
    //====================================================================================== 
    document.addEventListener("keydown", onDocumentKeyDown, false);
    function onDocumentKeyDown(event) {
     var keyCode = event.which;
      if(keyCode==82)controls.reset();
    };
     //======================================================================================        
    var stats = new Stats();
    document.body.appendChild( stats.dom );
     //======================================================================================
    var animate = function () {
        requestAnimationFrame( animate );
        const delta = clock.getDelta();
        
        stats.update();
        TWEEN.update();
        //composer.render();
        renderer.render( scene, camera );
       
    };
    // Initiate function or other initializations here
    animate();
    } else {
        var warning = WEBGL.getWebGLErrorMessage();
        document.body.appendChild( warning );
    
    }

    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize() {
        var width = window.innerWidth;
		var height = window.innerHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
    renderer.setSize( width, height );
    }