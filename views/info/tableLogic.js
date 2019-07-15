var tableBuried=document.getElementById('Table_Buried');
var tableSurface=document.getElementById('Table_Surface');
var socket = io();

  socket.on('initCells', function(cellArr){
    cellArr.forEach(function(cell){
        if(cell.type=='BURIED_MINE'){
            addToTable(cell,tableBuried);
        }else if(cell.type=='SURFACE_MINE'){
            addToTable(cell,tableSurface);
        }
     })
    });
  socket.on('newCell', function(cell){
    if(cell.type=='BURIED_MINE'){
        addToTable(cell,tableBuried);
    }else if(cell.type=='SURFACE_MINE'){
        addToTable(cell,tableSurface);
    }
  });
  socket.on('updateCell', function(cell){
        var newType=cell.type;
        //cell updated might was in the table or not 
        var row=document.getElementById(cell.row+cell.col);
        
        if(row!=undefined){//row exist in either buried or surface tables
            //delete it
            if(row.parentElement.parentElement.id=='Table_Buried'){
                tableBuried.deleteRow(row.rowIndex);
            }else{
                tableSurface.deleteRow(row.rowIndex);
            }
           // row.rowIndex
        }
        if(cell.type=='BURIED_MINE'){
            addToTable(cell,tableBuried);
        }else if(cell.type=='SURFACE_MINE'){
            addToTable(cell,tableSurface);
        }

  });


  function addToTable(cell,table,counter){
    var rowInserted=table.insertRow();
    rowInserted.insertCell(0).innerHTML=cell.col;
    rowInserted.insertCell(1).innerHTML=cell.row;
    rowInserted.id=cell.row+cell.col;
}