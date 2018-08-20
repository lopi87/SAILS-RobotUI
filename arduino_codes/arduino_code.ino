// Servo - Version: Latest
#include <Servo.h>

#include <SimpleDHT.h>

#define E1 10  // Enable Pin for motor 1
#define I1 8  // Control pin 1 for motor 1
#define I2 9 // Control pin 2 for motor 1

int pinDHT11 = 4;
int photosensorPin = A0;   // select the analog input pin for the photoresistor
String inData = "";

int servo_x, motor;

SimpleDHT11 dht11;

Servo servoMotor;

void setup() {
  Serial.begin(9600);
  pinMode(12, OUTPUT);

  pinMode(motorPin1, OUTPUT);
  pinMode(motorPin2, OUTPUT);
  servoMotor.attach(5);

  pinMode(E1, OUTPUT);
  pinMode(I1, OUTPUT);
  pinMode(I2, OUTPUT);
}

void loop() {

  analogWrite(E1, 153); // Run in half speed
  digitalWrite(I1, HIGH);
  digitalWrite(I2, LOW);
  delay(10000);

  // change direction
  digitalWrite(E1, LOW);

  delay(200);

  analogWrite(E1, 255);  // Run in full speed

  digitalWrite(I1, LOW);
  digitalWrite(I2, HIGH);

  delay(10000);

  while (Serial.available() > 0) {
    char received = Serial.read();
    inData.concat(received);

    if (received == '\n') {
      inData.trim();
      Serial.print(inData);

      // ON OFF LED
      if (inData == "H") {
        analogWrite(12, 255);
      }
      if (inData == "L") {
        analogWrite(12, 0);
      }

      //SERVO
      if (inData.startsWith("SRV")){

          if (sscanf(inData.c_str(), "SRV-%d", &servo_x) == 1) {
            Serial.println(servo_x);
          }

          if(servo_x < 30){
            servo_x = 30;
          }
          if (servo_x > 150){
            servo_x = 150;
          }
          servoMotor.write(servo_x);
          inData = "";
      }

      //MOTOR
      if (inData.startsWith("SRV")){
          if (sscanf(inData.c_str(), "MOTOR-%d", &motor) == 1) {
            Serial.println(motor);
          }

          if( motor == 0){
            // stop
            digitalWrite(E1, LOW);
          }

          if( motor > 0){
            analogWrite(E1, motor); // Run in half speed
            digitalWrite(I1, HIGH);
            digitalWrite(I2, LOW);
          }

          if( motor < 0){
            analogWrite(E1, motor * -1);
            digitalWrite(I1, LOW);
            digitalWrite(I2, HIGH);
          }
          motor = 0
      }
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
