# Minesweeper-Visualization
My first NodeJS &amp; ThreeJS Visualize to Visualize how the mines are put into the grid in Minesweeper robotics competition in Real-Time.
Competition Website:https://landminefree.org/

You can find NODEMCU module code that can interact with the application easily in "nodemcucode" directory.


ThreeJS is used to visualize the grid.
Socket.io is used to make it in real-time.
MongoDB is for saving the data so any user can connect at any time and find the same results.
There are 3 main pages -> "/" , "/addinfo" , "/info"
"/" is for visualizing the grid.
"/info" have the mines vector representation (Also updated in real-time).
"/addinfo" used as a debugger to make post requests to the application and see how that affects the grid.

You can check the project from here:https://youtu.be/64japjPGJeU

#### Requirements
   - NodeJS installed
   - MongoDB installed
#### Usage
   - Just run "node app.js".
   - From The Robot find a way to send POST request to the server for example you can use the NODEMCU module and once it sends a json format the scene will add/update the new cell with its new value and you can also update the current location of the robot.
