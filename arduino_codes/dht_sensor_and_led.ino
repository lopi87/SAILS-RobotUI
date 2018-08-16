// Servo - Version: Latest
#include <Servo.h>

#include <SimpleDHT.h>

int pinDHT11 = 4;
int photosensorPin = A0;   // select the analog input pin for the photoresistor
String inData = "";

SimpleDHT11 dht11;

void setup() {
  Serial.begin(9600);
  pinMode(12, OUTPUT);

  servoMotor.attach(9);
}

void loop() {
  while (Serial.available() > 0) {
    char received = Serial.read();
    inData.concat(received);

    // ON OFF LED
    if (received == '\n') {
      inData.trim();
      Serial.print(inData);
      if (inData == "H") {
        analogWrite(12, 255);
      }
      if (inData == "L") {
        analogWrite(12, 0);
      }
      inData = "";
    }
  }

  delay(30);
  // read without samples.
  byte temperature = 0;
  byte humidity = 0;
  int err = SimpleDHTErrSuccess;
  // if ((err = dht11.read(pinDHT11, &temperature, &humidity, NULL)) != SimpleDHTErrSuccess) {
  //   Serial.print("Read DHT11 failed, err="); Serial.println(err);delay(1000);
  // }

  dht11.read(pinDHT11, &temperature, &humidity, NULL);

  if ( (int)temperature != 0 and (int)humidity != 0 ){
    Serial.print((int)temperature); Serial.print(" *C, ");
    Serial.print((int)humidity); Serial.println(" H");
  }

  delay(30);

  Serial.println(analogRead(photosensorPin));

  //SERVO CONTROL

  // DHT11 sampling rate is 1HZ.
  delay(30);

  // Desplazamos a la posición 0º
  servoMotor.write(0);
  // Esperamos 1 segundo
  delay(1000);

  // Desplazamos a la posición 90º
  servoMotor.write(90);
  // Esperamos 1 segundo
  delay(1000);

  // Desplazamos a la posición 180º
  servoMotor.write(180);
  // Esperamos 1 segundo
  delay(1000);

}
