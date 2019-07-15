
//REFERENCED FROM: https://techtutorialsx.com/2016/07/21/esp8266-post-requests/
//===============================================================
//APPLICATION ON NODMCU TO TEST the NODEJS APPLICATION
//==============================================================
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
 
void setup() {
  pinMode(D4,OUTPUT);
  Serial.begin(115200);                                  //Serial connection
  WiFi.begin("Mind Cloud", "mc201924#1");   //WiFi connection
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion
    delay(500);
    Serial.println("Waiting for connection");
  }
  digitalWrite(D4,LOW);//light up the led after connection;
 
}
const String IP_ADDRESS="http://192.168.1.2:8080";
const String ADD_CELL=IP_ADDRESS+"/addcell";
const String UPDATE_CURRENT=IP_ADDRESS+"/currentcell";
bool isAddingCell=true;
const String JSON_ROW="\"row\":\"";
const String JSON_COL="\"col\":\"";
const String JSON_TYPE="\"type\":\"";
void loop() {
  int num = random(0,18);
 String randLetter=String((char)('A'+num));
 num = random(1,19);
 String randNumber=String(num);
 num = random(0,6);//some bigger factor to be empty cell
 String randType;
 switch(num){
    case 0:randType="BURIED_MINE";break;
    case 1:randType="SURFACE_MINE";break;
    default:randType="EMPTY_CELL";break;
 }
 if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
   HTTPClient http;    //Declare object of class HTTPClient

  
   if(isAddingCell){
         http.begin(ADD_CELL);     
         http.addHeader("Content-Type", "application/json");  //Specify content-type header
         http.POST("{"+JSON_ROW+randNumber +"\","+JSON_COL+randLetter+"\","+JSON_TYPE+randType+"\"}");
   }else{
         http.begin(UPDATE_CURRENT); 
         http.addHeader("Content-Type", "application/json");  //Specify content-type header
         http.POST("{"+JSON_ROW+randNumber +"\","+JSON_COL+randLetter+"\"}");
   }
   http.end();  //Close connection
 }else{
    Serial.println("Error in WiFi connection");   
 }
 num = random(0,4);
 switch(num){
  case 0:isAddingCell=false;break;
  default:isAddingCell=true;break;
 }
 delay(2000);
 
}
