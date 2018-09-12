#include <TonePlayer.h>
#include <SimpleDHT.h>
#include <NewPing.h>

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

//Ultrasonidos
const int UltrasonicPin = 4;
const int MaxDistance = 1000;
int distancia_trasera = 0;
NewPing sonar(UltrasonicPin, UltrasonicPin, MaxDistance);

//SHARP
int IR_SENSOR = 0; // Sensor is connected to the analog A0
int intSensorResult = 0; //Sensor result
float fltSensorCalc = 0; //Calculated value

//Sensor de llama
const int sensorMin = 2;     // sensor minimo
const int sensorMax = 1024;  // sensor maximo


// Sensor de luz
int light_val;
int data_light = A1;
bool on_pressed = false;

// Motores
int servo_x, motor;

//Temperatura
SimpleDHT11 dht11;


//Buzzer
TonePlayer tone1 (TCCR5A, TCCR5B, OCR5AH, OCR5AL, TCNT5H, TCNT5L);  // pin D46

void setup() {
  Serial.begin(9600);

  pinMode (46, OUTPUT);


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
//  Serial.print("adc:");
//  Serial.print(adc_MQ);
//  Serial.print("    voltaje:");
//  Serial.println(voltaje);


bool stop = false;

//  if(cm <= 10){
//    stop = true;
//  } else {
//    stop = false;
//  }

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

          if( ( motor <= 51 && motor >= -51 ) || stop || ( distancia_trasera < 10 and distancia_trasera > 0) ){
            // stop
            stop = false;
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
  light_val = analogRead(data_light);
  //Serial.println(light_val);

  // Lectura temperatura
  byte temperature = 0;
  byte humidity = 0;
  int err = SimpleDHTErrSuccess;

  dht11.read(pinDHT11, &temperature, &humidity, NULL);

  if ( (int)temperature != 0 and (int)humidity != 0 ){
    Serial.print("tmp%");
    Serial.print((int)temperature); Serial.print(" *C, ");
    Serial.print((int)humidity); Serial.println(" H");
  }


  distancia_trasera = sonar.ping_cm();
  //  Serial.print(sonar.ping_cm()); // obtener el valor en cm (0 = fuera de rango)
  //  Serial.println("distancia cm");


  intSensorResult = analogRead(IR_SENSOR); //Obtener valor
  fltSensorCalc = (6787.0 / (intSensorResult - 3.0)) - 4.0; //Calculo de la distancia en cm

  //Serial.print(fltSensorCalc); //Imprimir distancia
  //Serial.println(" cm SENSOR IR DISTANCIA");

  if(fltSensorCalc < 10){
    stop = true;
  }

  // Lectura del sensor de llama en A2:
  int sensorReading = analogRead(A2);
  int range = map(sensorReading, sensorMin, sensorMax, 0, 3);

  // range value:
  switch (range) {
  case 0:    // Fuego cercano.
    Serial.println("fire%** Fuego!!! **");
    tone1.tone (440);     // play 440 Hz
    delay (500);          // wait half a second
    tone1.noTone ();      // stop playing
    break;
  case 1:    // Fuego próximo.
    Serial.println("fire%** Fuego próximo **");
    break;
  case 2:    // Fuego no detectado
    Serial.println("fire%Fuego no detectado");
    break;
  }

  delay(100);

}
