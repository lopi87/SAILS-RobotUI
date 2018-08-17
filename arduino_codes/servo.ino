// Servo - Version: Latest
#include <Servo.h>

#include <SimpleDHT.h>

int pinDHT11 = 4;
int photosensorPin = A0;   // select the analog input pin for the photoresistor
String inData = "";

int servo_x, servo_y;

SimpleDHT11 dht11;

Servo servoMotor;

void setup() {
  Serial.begin(9600);
  pinMode(12, OUTPUT);
  servoMotor.attach(5);
}

void loop() {
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
