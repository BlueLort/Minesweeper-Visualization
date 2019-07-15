function Create2DArray(rows) {
    var arr = [];
    for (var i=0;i<rows;i++) {
       arr[i] = [];
    }
    return arr;
}
//distances used to correct locations of newly added elements [Modified on Text Translation]
var distMovedX=0;
var distMovedY=0;
function transformToCurrentSpace(object,distX,distY){
   object.position.x+=distX;
   object.position.y+=distY;
}
function translateCells(cells,currentCell){
   var distX=-(SQUARE_SIZE/2)-currentCell.Line.position.x;
   var distY=(SQUARE_SIZE/2)-currentCell.Line.position.y;

   cells.forEach(function(cell) {
         transformToCurrentSpace(cell.Line,distX,distY);
         transformToCurrentSpace(cell.Plane,distX,distY);
   });
}
function translateTextMesh(textMeshArr,currentCell){
   var distX=-(SQUARE_SIZE/2)-currentCell.Line.position.x;
   var distY=(SQUARE_SIZE/2)-currentCell.Line.position.y;
   distMovedX+=distX;
   distMovedY+=distY;
   textMeshArr.forEach(function(text) {
         transformToCurrentSpace(text,distX,distY);
   });
}


function constructNewCell(cell,Cells,availableCells,scene){
      //construct new cell
      //row & col indexed from 0 
   var col=cell.col.toUpperCase().charCodeAt(0)-65;
   var row=Number(cell.row)-1;
   var startX=col*SQUARE_SIZE - (SQUARE_SIZE/2) + col*MARGIN +distMovedX;
   var startY=row*SQUARE_SIZE + (SQUARE_SIZE/2) + row*MARGIN +distMovedY;
   var newCell = addCell(startX,startY,scene,cell.type,cell.time,cell.row+cell.col);
   Cells[row][col]=newCell;
   availableCells.push(newCell);
}


var cellsVisited=[];//to not render same text twice
var cellsAvailableText=[];//all rendered text mesh
//[0 to 19] is [a to t] and [20 to 39] is [1 to 19]
function getTextGeometry(text,font){
   var geometry = new THREE.TextGeometry( text, {
      font: font,
      size: 6,
      height: 1,
      curveSegments: 20
  } );
return geometry;
}
function createGridText(row,col,scene){
   var material = new THREE.MeshBasicMaterial({color:0xf5f5f5});
   var loader = new THREE.FontLoader();
   loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
   var colVal=col.toUpperCase().charCodeAt(0)-65;
   if(cellsVisited[colVal]!=true){
      var geoCol = getTextGeometry(col,font);
      var meshCol = new THREE.Mesh(geoCol,material);
      meshCol.position.set(colVal*SQUARE_SIZE -SQUARE_SIZE + colVal*MARGIN +MARGIN +distMovedX ,-SQUARE_SIZE + MARGIN +distMovedY ,10);
      new TWEEN.Tween( meshCol.position ).to( {z:-1}, 1500 ).easing(TWEEN.Easing.Quadratic.InOut).start();
      scene.add(meshCol);
      cellsVisited[colVal]=true;
      meshCol.matrixAutoUpdate  = true;
      cellsAvailableText.push(meshCol);
   }
   var rowVal=Number(row)-1;
   if(cellsVisited[rowVal+19]!=true){
      var geoRow = getTextGeometry(row,font);
      var meshRow = new THREE.Mesh(geoRow,material);
      meshRow.position.set(-2*SQUARE_SIZE - MARGIN +distMovedX,rowVal*SQUARE_SIZE + rowVal*MARGIN +MARGIN +distMovedY ,10);
      new TWEEN.Tween( meshRow.position ).to( {z:-1}, 1500 ).easing(TWEEN.Easing.Quadratic.InOut).start();
      scene.add(meshRow);
      cellsVisited[rowVal+19]=true;
      cellsAvailableText.push(meshRow);
   }
} );
   
}
