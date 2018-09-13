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
int IRpin = 0;
const bool stop = false;

//Sensor de llama
const int sensorMin = 2;     // sensor minimo
const int sensorMax = 1024;  // sensor maximo

// Sensor de luz
int light_val;
int data_light = A1;
bool on_pressed = true;

// Motores
int servo_x, motor;

//Temperatura
SimpleDHT11 dht11;

//Micrófono
int MIC = 4;
int mic_value;

//Buzzer
TonePlayer tone1 (TCCR5A, TCCR5B, OCR5AH, OCR5AL, TCNT5H, TCNT5L);  // pin D46

void setup() {
  Serial.begin(9600);

  //Micrófono
  pinMode(MIC, INPUT);

  pinMode(IRpin,INPUT); //SHARP

  pinMode (46, OUTPUT); //Buzzer

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

  mic_value = digitalRead(MIC);
  if( mic_value == HIGH){
    Serial.println("snd%**** SONIDO DETECTADO ****");
  }

  //MQ-2 Gas
  int adc_MQ = analogRead(A3); //Leemos la salida analógica del MQ
  float voltaje = adc_MQ * (5.0 / 1023.0); //Convertimos la lectura en un valor de voltaje
//  Serial.print("adc:");
//  Serial.print(adc_MQ);
//  Serial.print("    voltaje:");
//  Serial.println(voltaje);


bool stop = false;

  // ON OFF LED
  if (light_val < 20 and on_pressed) {
    digitalWrite(2, HIGH);
    digitalWrite(6, HIGH);
  }
  if (light_val > 20 and on_pressed) {
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
        digitalWrite(2, HIGH);
        digitalWrite(6, HIGH);
      }
      if (inData == "L") {
        on_pressed = false;
        digitalWrite(2, LOW);
        digitalWrite(6, LOW);
      }

      //SHARP
      int volts = analogRead(IRpin);
      int distance = (6787 / (volts - 3)) - 4;

      Serial.print("dst%");
      Serial.print(distance); //Imprimir distancia
      Serial.println(" cm");


      Serial.println(distance);

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

          if( ( motor <= 51 && motor >= -51 ) || ( distancia_trasera < 10 and distancia_trasera > 0) ){
            // stop
            Serial.println('STOP');
            digitalWrite(E1, LOW);
            digitalWrite(I1, LOW);
            digitalWrite(I2, LOW);
          }

          if( motor > 51 and ! stop ){
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

  // Lectura del sensor de llama en A2:
  int sensorReading = analogRead(A2);
  int range = map(sensorReading, sensorMin, sensorMax, 0, 3);

  // range value:
  switch (range) {
  case 0:    // A fire closer than 1.5 feet away.
    Serial.println("fire%** Fuego!!! **");
    tone1.tone (440);     // play 440 Hz
    delay (500);          // wait half a second
    tone1.noTone ();      // stop playing
    break;
  case 1:    // A fire between 1-3 feet away.
    Serial.println("fire%** Fuego próximo **");
    break;
  case 2:    // No fire detected.
    Serial.println("fire%Fuego no detectado");
    break;
  }

  delay(100);

}





