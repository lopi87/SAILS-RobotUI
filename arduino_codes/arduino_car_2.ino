
#include <SimpleDHT.h>

#define E1 10  // Enable Pin for motor 1
#define I1 8  // Control pin 1 for motor 1
#define I2 9 // Control pin 2 for motor 1

#define E2 6  // Enable Pin for motor 2
#define D1 5  // Control pin 1 for motor 2
#define D2 4 // Control pin 2 for motor 2

int pinDHT11 = 4;
int photosensorPin = A0;   // select the analog input pin for the photoresistor
String inData = "";

int servo_x, motor;

SimpleDHT11 dht11;

void setup() {
  Serial.begin(9600);
  pinMode(12, OUTPUT);

  pinMode(E1, OUTPUT);
  pinMode(I1, OUTPUT);
  pinMode(I2, OUTPUT);

  pinMode(E2, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D1, OUTPUT);

  // Set initial rotation direction
  digitalWrite(I1, LOW);
  digitalWrite(I2, HIGH);
  digitalWrite(D1, LOW);
  digitalWrite(D2, HIGH);
}

void loop() {

  while (Serial.available() > 0) {
    char received = Serial.read();
    inData.concat(received);

    if (received == '\n') {
      inData.trim();

      // ON OFF LED
      if (inData == "H") {
        analogWrite(12, 255);
      }
      if (inData == "L") {
        analogWrite(12, 0);
      }

      //Direction
      if (inData.startsWith("SRV")){
          if (sscanf(inData.c_str(), "SRV-%d", &servo_x) == 1) {
            Serial.println(servo_x);
          }

          if( servo_x == 0){
            // stop
            digitalWrite(E2, LOW);
            digitalWrite(D1, LOW);
            digitalWrite(D2, LOW);
          }

          if( servo_x > 0){
            analogWrite(E2, servo_x);
            digitalWrite(D1, HIGH);
            digitalWrite(D2, LOW);
          }

          if( servo_x < 0){
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

          if( motor == 0){
            // stop
            digitalWrite(E1, LOW);
          }

          if( motor > 0){
            analogWrite(E1, motor);
            digitalWrite(I1, HIGH);
            digitalWrite(I2, LOW);
          }

          if( motor < 0){
            motor = motor * -1;
            analogWrite(E1, motor);
            digitalWrite(I1, LOW);
            digitalWrite(I2, HIGH);
          }
      }
      inData = "";
    }
  }

  // read without samples.
  byte temperature = 0;
  byte humidity = 0;
  int err = SimpleDHTErrSuccess;
  // if ((err = dht11.read(pinDHT11, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
  //   Serial.print("Read DHT11 failed, err="); Serial.println(err);delay(1000);
  // }

  dht11.read(pinDHT11, &temperature, &humidity, NULL);

  if ( (int)temperature != 0 and (int)humidity != 0 ){
    //Serial.print((int)temperature); Serial.print(" *C, ");
    //Serial.print((int)humidity); Serial.println(" H");
  }

  delay(30);

  //Serial.println(analogRead(photosensorPin));

}
