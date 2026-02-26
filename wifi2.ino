#include <WiFi.h>
#include <ESPmDNS.h>
#include <WebServer.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>

#define LED_PIN 5    
#define LED_COUNT 8
// #define SENSOR_PIN 4

Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

const char* ssid = "...";
const char* password = "...";

WebServer server(80); 

void handleRoot(){
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200,"text/plain",WiFi.localIP().toString());
}

void addCORS() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleLEDOn(){
  strip.clear();
  for(int i=0;i<LED_COUNT;i++){
    strip.setPixelColor(i, 100, 100, 100);
  }
  strip.show();
  addCORS();
  server.send(200,"text/plain","LED_on");
}
void handleLEDOff(){
  strip.clear();
  strip.show();
  addCORS();
  server.send(200,"text/plain","LED_off");
}

void handleColorSet(){
  Serial.println("===== NEW REQUEST =====");
  Serial.print("Args count: ");
  Serial.println(server.args());

  for (int i = 0; i < server.args(); i++) {
    Serial.print("Arg ");
    Serial.print(server.argName(i));
    Serial.print(": ");
    Serial.println(server.arg(i));
  }

  String body = server.arg("plain");

  Serial.println("BODY:");
  Serial.println(body);

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    Serial.println("JSON ERROR");
    addCORS();
    server.send(400, "text/plain", "JSON parse error");
    return;
  }

  int r = doc["R"];
  int g = doc["G"];
  int b = doc["B"];

  Serial.printf("R=%d G=%d B=%d\n", r, g, b);

  for(int i=0;i<LED_COUNT;i++){
    strip.setPixelColor(i, r, g, b);
  }
  strip.show();

  addCORS();
  server.send(200, "text/plain", "Color updated");
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting...");
  }
  Serial.println("Connected!");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp32")) {
    Serial.println("mDNS responder started");
    Serial.println("Access via: http://esp32.local");
  } else {
    Serial.println("Error starting mDNS");
  }

  MDNS.addService("http", "tcp", 80);

  strip.begin();
  strip.setBrightness(50);
  strip.show();


  server.on("/setColor", HTTP_OPTIONS, []() {
    addCORS();
    server.send(204);
  });


  server.on("/",HTTP_GET,handleRoot); 
  server.on("/ledOn",HTTP_POST, handleLEDOn);
  server.on("/ledOff",HTTP_POST, handleLEDOff);
  server.on("/setColor",HTTP_POST,handleColorSet);

  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient(); 

  
}
