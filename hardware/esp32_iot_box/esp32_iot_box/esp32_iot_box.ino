#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// ---------------- WIFI ----------------
const char* WIFI_SSID = "Test";
const char* WIFI_PASSWORD = "zoyakhan6";

// Use your computer's LAN IP, NOT localhost.
const char* API_URL =
  "http://192.168.0.109:3000/api/admin/readings";

const char* BOX_CODE = "HB-BOX-001";

// Use the raw device secret generated when registering the box.
// Never use the database hash here.
const char* DEVICE_SECRET = "1a985bc68800aff0f2b4bd55952dd9f04137aa75033ac5b7e7467e7b96411291";

// ==================================================
// SENSOR PINS
// ==================================================

#define DHT_PIN 4
#define DHT_TYPE DHT22
#define DS18B20_PIN 5

#define GREEN_LED 18
#define BLUE_LED 19
#define RED_LED 23

// ==================================================
// OBJECTS
// ==================================================

DHT dht(DHT_PIN, DHT_TYPE);

OneWire oneWire(DS18B20_PIN);
DallasTemperature foodSensor(&oneWire);

Adafruit_SH1106G display(128, 64, &Wire, -1);

// ==================================================
// TIMING
// ==================================================

const unsigned long READ_INTERVAL_MS = 10000;
const unsigned long WIFI_TIMEOUT_MS = 15000;
const unsigned long WIFI_RETRY_DELAY_MS = 20000;

unsigned long lastReadTime = 0;
unsigned long wifiAttemptStarted = 0;
unsigned long nextWifiAttemptAt = 0;

bool wifiAttemptActive = false;
bool wifiWasConnected = false;
bool oledAvailable = false;

// ==================================================
// WI-FI CONNECTION MANAGEMENT
// ==================================================

void startWiFiAttempt() {
  Serial.println();
  Serial.println("Starting Wi-Fi connection attempt...");

  // Disconnect an expired attempt before retrying.
  WiFi.disconnect(false, false);
  delay(100);

  wifiAttemptStarted = millis();
  wifiAttemptActive = true;

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Wi-Fi connection requested.");
}

void manageWiFi() {
  unsigned long now = millis();

  if (WiFi.status() == WL_CONNECTED) {
    wifiAttemptActive = false;

    if (!wifiWasConnected) {
      wifiWasConnected = true;

      Serial.println();
      Serial.println("Wi-Fi connected!");
      Serial.print("ESP32 IP address: ");
      Serial.println(WiFi.localIP());

      Serial.print("Wi-Fi signal strength: ");
      Serial.print(WiFi.RSSI());
      Serial.println(" dBm");

      // Synchronize time using UTC.
      configTime(0, 0, "pool.ntp.org", "time.nist.gov");
    }

    return;
  }

  if (wifiWasConnected) {
    wifiWasConnected = false;
    wifiAttemptActive = false;

    Serial.println("Wi-Fi connection lost.");

    nextWifiAttemptAt = now + WIFI_RETRY_DELAY_MS;
  }

  // Allow the current attempt time to expire before retrying.
  if (wifiAttemptActive && now - wifiAttemptStarted >= WIFI_TIMEOUT_MS) {

    wifiAttemptActive = false;
    nextWifiAttemptAt = now + WIFI_RETRY_DELAY_MS;

    Serial.print("Wi-Fi connection timed out. Status code: ");
    Serial.println((int)WiFi.status());

    Serial.println("Will retry after 20 seconds.");
    WiFi.disconnect(false, false);
  }

  // Start a new attempt only if none is active.
  if (!wifiAttemptActive && (long)(now - nextWifiAttemptAt) >= 0) {
    startWiFiAttempt();
  }
}

// ==================================================
// TIMESTAMP
// ==================================================

String getTimestamp() {
  time_t now = time(nullptr);

  // Reject timestamps until NTP has synchronized.
  if (now < 1767225600) {
    return "";
  }

  struct tm timeInfo;
  gmtime_r(&now, &timeInfo);

  char timestamp[25];

  strftime(
    timestamp,
    sizeof(timestamp),
    "%Y-%m-%dT%H:%M:%SZ",
    &timeInfo);

  return String(timestamp);
}

// ==================================================
// OLED DISPLAY
// ==================================================

void showReadings(
  float airTemp,
  float humidity,
  float foodTemp) {
  if (!oledAvailable) {
    return;
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);

  display.setCursor(0, 0);
  display.println("HungerBridge IoT");

  display.setCursor(0, 14);
  display.print("Air: ");
  display.print(airTemp, 1);
  display.println(" C");

  display.setCursor(0, 26);
  display.print("Food: ");
  display.print(foodTemp, 1);
  display.println(" C");

  display.setCursor(0, 38);
  display.print("Humidity: ");
  display.print(humidity, 1);
  display.println(" %");

  display.setCursor(0, 53);

  if (WiFi.status() == WL_CONNECTED) {
    display.println("WiFi connected");
  } else {
    display.println("WiFi offline");
  }

  display.display();
}

// ==================================================
// SEND READING TO HUNGERBRIDGE BACKEND
// ==================================================

void sendReading(
  float airTemp,
  float foodTemp,
  float humidity) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi unavailable; upload skipped.");
    return;
  }

  String timestamp = getTimestamp();

  if (timestamp.length() == 0) {
    Serial.println("Waiting for time synchronization.");
    Serial.println("Upload skipped; will retry next cycle.");
    return;
  }

  String payload = "{";
  payload += "\"boxCode\":\"" + String(BOX_CODE) + "\",";
  payload += "\"temperature\":" + String(airTemp, 2) + ",";
  payload += "\"foodTemperature\":" + String(foodTemp, 2) + ",";
  payload += "\"humidity\":" + String(humidity, 2) + ",";
  payload += "\"recordedAt\":\"" + timestamp + "\"";
  payload += "}";

  Serial.println();
  Serial.println("----- SENDING SENSOR READING -----");
  Serial.println(payload);

  WiFiClient client;
  HTTPClient http;

  if (!http.begin(client, API_URL)) {
    Serial.println("Could not initialize HTTP request.");
    return;
  }

  http.setConnectTimeout(5000);
  http.setTimeout(5000);

  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-secret", DEVICE_SECRET);

  int statusCode = http.POST(payload);

  if (statusCode > 0) {
    Serial.print("HTTP status: ");
    Serial.println(statusCode);

    Serial.println("Backend response:");
    Serial.println(http.getString());

    if (statusCode >= 200 && statusCode < 300) {
      Serial.println("SUCCESS: Reading accepted by backend.");
    } else {
      Serial.println("ERROR: Backend rejected the reading.");
    }
  } else {
    Serial.print("HTTP request failed: ");
    Serial.println(http.errorToString(statusCode));
  }

  http.end();
}

// ==================================================
// SETUP
// ==================================================

void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println();
  Serial.println("================================");
  Serial.println("   HUNGERBRIDGE IOT STARTING");
  Serial.println("================================");

  // Configure LEDs.
  pinMode(GREEN_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);

  digitalWrite(GREEN_LED, LOW);
  digitalWrite(BLUE_LED, HIGH);
  digitalWrite(RED_LED, LOW);

  // Initialize I2C and OLED.
  Wire.begin(21, 22);

  oledAvailable = display.begin(0x3C, true);

  if (oledAvailable) {
    display.clearDisplay();
    display.setTextSize(1);
    display.setTextColor(SH110X_WHITE);
    display.setCursor(0, 0);
    display.println("HungerBridge");
    display.println("Starting...");
    display.display();

    Serial.println("OLED initialized.");
  } else {
    Serial.println("OLED not found; continuing without display.");
  }

  // Initialize sensors.
  dht.begin();
  foodSensor.begin();

  Serial.println("Sensors initialized.");

  // Configure Wi-Fi.
  WiFi.onEvent([](WiFiEvent_t event, WiFiEventInfo_t info) {
    Serial.printf("Wi-Fi event: %d\n", event);

    if (event == ARDUINO_EVENT_WIFI_STA_DISCONNECTED) {
      Serial.printf(
        "Disconnect reason: %d\n",
        info.wifi_sta_disconnected.reason);
    }
  });
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.persistent(false);

  // Scan nearby networks for troubleshooting.
  Serial.println();
  Serial.println("Scanning nearby Wi-Fi networks...");

  int count = WiFi.scanNetworks();

  if (count == 0) {
    Serial.println("No Wi-Fi networks found.");
  } else if (count > 0) {
    for (int i = 0; i < count; i++) {
      Serial.print(WiFi.SSID(i));
      Serial.print(" | Signal: ");
      Serial.print(WiFi.RSSI(i));
      Serial.print(" dBm | Security: ");
      Serial.println(WiFi.encryptionType(i));
    }
  } else {
    Serial.println("Wi-Fi scan failed.");
  }

  WiFi.scanDelete();

  // Start one connection attempt.
  nextWifiAttemptAt = millis();
  startWiFiAttempt();

  Serial.println();
  Serial.println("Setup complete.");
  Serial.println("Sensor monitoring will continue offline.");
}

// ==================================================
// MAIN LOOP
// ==================================================

void loop() {
  // Manage Wi-Fi without repeatedly restarting an active attempt.
  manageWiFi();

  // Keep sensor readings on a 10-second interval.
  unsigned long now = millis();

  if (now - lastReadTime < READ_INTERVAL_MS) {
    delay(20);
    return;
  }

  lastReadTime = now;

  // Read DHT22.
  float airTemp = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Read DS18B20.
  foodSensor.requestTemperatures();
  float foodTemp = foodSensor.getTempCByIndex(0);

  bool dhtValid = !isnan(airTemp) && !isnan(humidity);

  bool foodValid =
    foodTemp != DEVICE_DISCONNECTED_C && foodTemp >= -55.0 && foodTemp <= 125.0;

  Serial.println();
  Serial.println("========== SENSOR READINGS ==========");

  if (dhtValid) {
    Serial.print("Air temperature: ");
    Serial.print(airTemp, 2);
    Serial.println(" C");

    Serial.print("Humidity: ");
    Serial.print(humidity, 2);
    Serial.println(" %");
  } else {
    Serial.println("ERROR: DHT22 reading failed.");
  }

  if (foodValid) {
    Serial.print("Food temperature: ");
    Serial.print(foodTemp, 2);
    Serial.println(" C");
  } else {
    Serial.println("ERROR: DS18B20 reading failed.");
  }

  // Simple air-temperature indicator only.
  // These LEDs do not certify food safety.
  if (dhtValid && airTemp < 30.0) {
    digitalWrite(GREEN_LED, HIGH);
    digitalWrite(RED_LED, LOW);
  } else if (dhtValid && airTemp < 35.0) {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, HIGH);
  } else {
    digitalWrite(GREEN_LED, LOW);
    digitalWrite(RED_LED, LOW);
  }

  // Display the latest valid sensor readings.
  if (dhtValid && foodValid) {
    showReadings(airTemp, humidity, foodTemp);

    // Upload only when both sensors have valid readings.
    sendReading(airTemp, foodTemp, humidity);
  } else {
    Serial.println("Upload skipped: invalid sensor reading.");
  }

  Serial.println("=====================================");
}