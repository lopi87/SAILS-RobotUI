#include <SimpleDHT.h>

#define E1 10  // Enable Pin for motor 1
#define I1 8  // Control pin 1 for motor 1
#define I2 9 // Control pin 2 for motor 1

#define E2 13  // Enable Pin for motor 2
#define D1 12  // Control pin 1 for motor 2
#define D2 11 // Control pin 2 for motor 2

// Temperatura y humedad
int pinDHT11 = 3;
int photosensorPin = A1;   // select the analog input pin for the photoresistor
String inData = "";


// Shock
int shockPin = 7; // Pin 7 como pin de datos
int shockVal = HIGH; // Valor medido
boolean bAlarm = false;
unsigned long lastShockTime; // Record the time that we measured a shock
int shockAlarmTime = 250; // Number of milli seconds to keep the shock alarm high

//IR sensor
int ir_sensor = A2;
int value;
int cm;
bool stop = false;

// Sensor de luz
int light_val;
int data_light = A1;
bool on_pressed = false;

// Motores
int servo_x, motor;

//Temperatura
SimpleDHT11 dht11;

void setup() {
  Serial.begin(9600);

  pinMode (shockPin, INPUT) ; // shock KY-002

  pinMode(2, OUTPUT); //luces
  pinMode(6, OUTPUT); //laser

  pinMode(E1, OUTPUT);
  pinMode(I1, OUTPUT);
  pinMode(I2, OUTPUT);

  pinMode(E2, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D1, OUTPUT);

  // Direccion de rotación inicial
  digitalWrite(I1, LOW);
  digitalWrite(I2, HIGH);
  digitalWrite(D1, LOW);
  digitalWrite(D2, HIGH);
}

void loop() {

  //MQ-2 Gas
  int adc_MQ = analogRead(A3); //Leemos la salida analógica del MQ
  float voltaje = adc_MQ * (5.0 / 1023.0); //Convertimos la lectura en un valor de voltaje
  Serial.print("adc:");
  Serial.print(adc_MQ);
  Serial.print("    voltaje:");
  Serial.println(voltaje);


  //IR
  value = analogRead(ir_sensor);
  cm = (6787.0 / (value - 3.0)) - 4.0; //Calculate distance in cm
  //Serial.println(cm);
  //Serial.println(" cm");
  delay(200); //Wait


  if(cm <= 10){
    stop = true;
  } else {
    stop = false;
  }

  // ON OFF LED
  if (light_val < 20 and ! on_pressed) {
    digitalWrite(2, HIGH);
    digitalWrite(6, HIGH);
  }
  if (light_val > 20 and ! on_pressed) {
    digitalWrite(2, LOW);
    digitalWrite(6, LOW);
  }

  while (Serial.available() > 0) {
    char received = Serial.read();
    inData.concat(received);

    if (received == '\n') {
      inData.trim();

      // ON OFF LED
      if (inData == "H") {
        on_pressed = true;
        analogWrite(2, HIGH);
      }
      if (inData == "L") {
        on_pressed = false;
        analogWrite(2, LOW);
      }

      //Direction
      if (inData.startsWith("SRV")){
          if (sscanf(inData.c_str(), "SRV-%d", &servo_x) == 1) {
            Serial.println(servo_x);
          }

          if( servo_x <= 51 && servo_x >= -51){
            // stop
            Serial.println('STOP');
            digitalWrite(E2, LOW);
            digitalWrite(D1, LOW);
            digitalWrite(D2, LOW);
          }

          if( servo_x > 51){
            Serial.println('Running...');
            analogWrite(E2, servo_x);
            digitalWrite(D1, HIGH);
            digitalWrite(D2, LOW);
          }

          if( servo_x < -51){
            Serial.println('Running...');
            servo_x = servo_x * -1;
            analogWrite(E2, servo_x);
            digitalWrite(D1, LOW);
            digitalWrite(D2, HIGH);
          }

      }

      //MOTOR
      if (inData.startsWith("MOTOR")){
          if (sscanf(inData.c_str(), "MOTOR-%d", &motor) == 1) {
            Serial.println(motor);
          }

          if( ( motor <= 51 && motor >= -51 ) || stop ){
            // stop
            Serial.println('STOP');
            digitalWrite(E1, LOW);
            digitalWrite(I1, LOW);
            digitalWrite(I2, LOW);
          }

          if( motor > 51){

            analogWrite(E1, motor);
            digitalWrite(I1, HIGH);
            digitalWrite(I2, LOW);
          }

          if( motor < -51 and ! stop){
            motor = motor * -1;
            analogWrite(E1, motor);
            digitalWrite(I1, LOW);
            digitalWrite(I2, HIGH);
          }
      }
      inData = "";
    }
  }

  //Luz
  light_val = analogRead(data_light);   //connect grayscale sensor to Analog 0
  Serial.println(light_val);//print the value to serial

  // Lectura temperatura
  byte temperature = 0;
  byte humidity = 0;
  int err = SimpleDHTErrSuccess;

  dht11.read(pinDHT11, &temperature, &humidity, NULL);

  if ( (int)temperature != 0 and (int)humidity != 0 ){
    Serial.print((int)temperature); Serial.print(" *C, ");
    Serial.print((int)humidity); Serial.println(" H");
  }


  //Shock sensor
  shockVal = digitalRead (shockPin) ; // read the value from our sensor

  if (shockVal == LOW) // If we're in an alarm state
  {
    lastShockTime = millis(); // record the time of the shock
    // The following is so you don't scroll on the output screen
    if (!bAlarm){
      Serial.println("Shock Alarm");
      bAlarm = true;
    }
  }
  else
  {
    if( (millis()-lastShockTime) > shockAlarmTime  &&  bAlarm){
      Serial.println("no alarm");
      bAlarm = false;
    }
  }


  delay(30);

}
