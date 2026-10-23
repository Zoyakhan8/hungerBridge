# HungerBridge — AI-Powered Food Redistribution & Smart Food Safety Monitoring

> **HungerBridge** is a technology-driven surplus-food redistribution platform that connects food donors with verified NGOs and combines web-based donation management, AI-assisted food classification, delivery tracking, and IoT-based food-condition monitoring through a reusable smart container called **ZeroWaste Box**.

**Project type:** Full-stack web application + AI/ML + Internet of Things (IoT)  
**Project name:** HungerBridge  
**Smart container:** ZeroWaste Box  
**Primary goal:** Reduce avoidable food waste and improve the transparency, traceability, and safety monitoring of surplus-food donations.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Objectives](#3-objectives)
4. [Our Solution](#4-our-solution)
5. [Core Features](#5-core-features)
6. [Technology Stack](#6-technology-stack)
7. [System Architecture](#7-system-architecture)
8. [Application Workflow](#8-application-workflow)
9. [AI Food Classification](#9-ai-food-classification)
10. [ZeroWaste Box — IoT System](#10-zerowaste-box--iot-system)
11. [Food Safety Monitoring Logic](#11-food-safety-monitoring-logic)
12. [Backend Architecture](#12-backend-architecture)
13. [Database Design](#13-database-design)
14. [API Endpoints](#14-api-endpoints)
15. [Frontend Architecture](#15-frontend-architecture)
16. [Delivery Management and QR Verification](#16-delivery-management-and-qr-verification)
17. [Geolocation and Distance Calculation](#17-geolocation-and-distance-calculation)
18. [Installation and Setup](#18-installation-and-setup)
19. [Environment Variables](#19-environment-variables)
20. [Running the AI Service](#20-running-the-ai-service)
21. [Connecting the ESP32](#21-connecting-the-esp32)
22. [Testing and Troubleshooting](#22-testing-and-troubleshooting)
23. [Security Considerations](#23-security-considerations)
24. [Limitations](#24-limitations)
25. [Future Enhancements](#25-future-enhancements)
26. [Project Significance](#26-project-significance)
27. [Contributing](#27-contributing)
28. [License](#28-license)

---

## 1. Project Overview

A significant amount of edible food is discarded by restaurants, bakeries, caterers, households, and other food businesses, while people experiencing food insecurity depend on charitable organizations for meals.

Food donation involves more than finding someone willing to donate and someone willing to receive food. It also requires coordination, reliable information, transportation, accountability, and appropriate food-safety practices.

HungerBridge addresses these challenges through an integrated digital platform.

The system brings together four major components:

- **Food redistribution platform:** Manages donors, donations, NGO requests, and delivery coordination.
- **AI-assisted food classification:** Identifies food-related categories from the food name and ingredients to support the food-safety decision process.
- **ZeroWaste Box:** A reusable smart food container equipped with temperature and humidity sensors.
- **Delivery traceability:** Records delivery stages and supports QR-based pickup and handover verification.

The goal is to make surplus-food redistribution more organized, measurable, and transparent.

### Project concept

**Donor → HungerBridge → ZeroWaste Box → Delivery Partner → Verified NGO**

The exact use of the smart box depends on its availability and assignment to a donation.

---

## 2. Problem Statement

Existing food donation activities can face several challenges:

1. **Food wastage:** Surplus edible food may be discarded because donors cannot quickly find suitable recipients.
2. **Coordination difficulties:** Donors and NGOs need a reliable way to manage available food and requests.
3. **Limited traceability:** Manual processes may not provide a consistent record of acceptance, pickup, transportation, and handover.
4. **Food-condition uncertainty:** A donation record alone cannot establish how food was stored or transported.
5. **Transportation coordination:** Donations require suitable delivery arrangements between the donor and recipient.
6. **Limited accountability:** Without structured records, it can be difficult to review the status of a donation.
7. **Reusable-container management:** Smart containers need to be assigned, tracked, and returned for subsequent use.

HungerBridge aims to address these challenges using web technologies, AI-assisted classification, location information, and IoT monitoring.

---

## 3. Objectives

The primary objectives are:

- Connect food donors with verified NGOs.
- Allow donors to register and submit surplus-food donations.
- Allow NGOs to review and respond to donation requests.
- Coordinate deliveries through delivery partners.
- Use AI to assist in identifying relevant food categories.
- Monitor ambient temperature, food temperature, and humidity using IoT sensors.
- Associate sensor readings with the appropriate smart box.
- Record important delivery events through QR verification.
- Use location coordinates to support distance-based partner assignment.
- Maintain structured records for donations, requests, delivery activity, and smart-container assignments.
- Encourage reusable food-container circulation and reduce unnecessary waste.
- Build a foundation for future impact analytics and improved food-distribution planning.

---

## 4. Our Solution

HungerBridge combines a conventional full-stack application with two specialized components: an AI service and an IoT monitoring device.

### 4.1 HungerBridge web application

The web application manages users, donor profiles, food donations, NGO requests, delivery partners, and administrative operations.

### 4.2 AI food classification service

A separate Python service uses a fine-tuned DistilBERT model to predict food-related categories from a food name and its ingredients.

These predictions can be connected to a food-safety rules system to determine which storage rules are relevant.

### 4.3 ZeroWaste Box

ZeroWaste Box is a reusable smart food container designed to capture environmental and food-temperature measurements. An ESP32 reads the sensors and transmits readings to the HungerBridge backend.

### 4.4 Delivery and traceability system

The delivery workflow records the status of a delivery and supports QR-based pickup and handover verification. The application can also associate an IoT box and its readings with a donation when an appropriate assignment exists.

**Important distinction:** Sensor monitoring and rule-based estimates provide supporting information. They do not independently prove that food is safe to consume.

---

## 5. Core Features

| Feature | Purpose |
|---|---|
| Donor registration and profile | Stores donor information required by the platform |
| Food donation management | Creates and tracks surplus-food donations |
| NGO request management | Enables NGOs to respond to available donations |
| Delivery partner management | Supports delivery-partner profiles and availability |
| Location-aware assignment | Uses coordinates to compare distances |
| AI food classification | Predicts food categories from names and ingredients |
| Food-safety rules | Applies category- and storage-related time limits |
| Smart-container monitoring | Reads temperature and humidity measurements |
| Device authentication | Uses a device secret when uploading IoT readings |
| QR-based delivery verification | Supports pickup and handover events |
| IoT assignment history | Records relationships between donations and boxes |
| Administrative monitoring | Provides a foundation for operational oversight and reporting |

Feature availability depends on the relevant module being configured and integrated in the running application.

---

## 6. Technology Stack

### 6.1 Frontend

| Technology | Role |
|---|---|
| React | Builds reusable, interactive user-interface components |
| JavaScript / JSX | Implements frontend logic and UI rendering |
| HTML | Structures application content |
| CSS and Tailwind CSS | Styles layouts and responsive interfaces |
| Fetch API | Communicates with backend endpoints |
| React Hooks | Manage component state, effects, and reusable logic |

**Why React?**

React makes it easier to create reusable components for dashboards, forms, donation cards, delivery status indicators, and monitoring displays. Component-based development also helps keep different user workflows manageable.

Tailwind CSS is part of the project's frontend design direction; the exact styling approach may differ between individual screens.

### 6.2 Backend

| Technology | Role |
|---|---|
| Node.js | Runs the JavaScript server environment |
| Express.js | Handles HTTP requests, routing, and middleware |
| TypeScript | Adds static types to backend code |
| Drizzle ORM | Defines database schemas and constructs typed queries |
| PostgreSQL | Stores persistent application data |
| Multer | Handles multipart file uploads |
| Cloudinary | Supports cloud storage of uploaded images and documents |
| Authentication middleware | Protects routes and identifies authenticated users |

**Why Express?**

Express provides a lightweight way to build REST API endpoints and connect application modules.

**Why TypeScript?**

TypeScript helps detect many programming mistakes during development and makes the structure of requests, responses, and database operations easier to understand.

**Why Drizzle ORM?**

Drizzle allows the application to define tables and relations in TypeScript and interact with PostgreSQL using structured queries rather than writing every query manually.

**Why PostgreSQL?**

PostgreSQL provides relational tables, constraints, foreign keys, transactions, and consistent storage for interconnected entities such as users, donations, requests, delivery partners, and deliveries.

### 6.3 AI and machine learning

| Technology | Role |
|---|---|
| Python | Implements the separate AI service |
| FastAPI | Exposes AI functionality through HTTP endpoints |
| Hugging Face Transformers | Loads and runs the classification model |
| DistilBERT | Provides the pretrained transformer architecture used for fine-tuning |
| PyTorch | Runs model inference and training where configured |
| Pandas | Supports dataset preparation and analysis |
| JSON | Transfers prediction inputs and outputs |

### 6.4 IoT hardware

| Component | Purpose |
|---|---|
| ESP32 DevKit V1 | Reads sensor data and communicates over Wi-Fi |
| DHT22 | Measures ambient temperature and relative humidity |
| DS18B20 | Measures temperature using a digital one-wire sensor |
| SH1106 OLED, 128 × 64 | Displays local monitoring information |
| RGB indicator LEDs | Provide simple local status indications |
| Arduino framework | Runs the ESP32 firmware |
| Wi-Fi | Connects the device to the backend's network |
| HTTPClient | Sends sensor readings to the API |
| NTP | Synchronizes the device clock |

The current firmware uses a DS18B20 for the temperature measurement labelled as food temperature. The sensor's actual placement and contact with the food or container must be appropriate for the measurement to represent food temperature.

### 6.5 Supporting technologies

- **REST API:** Communication between the web frontend, backend, AI service, and IoT device.
- **JSON:** Standard data format for API requests and responses.
- **QR codes:** Support delivery-event verification.
- **Latitude and longitude:** Represent geographic coordinates.
- **Distance calculations:** Help compare possible delivery partners.
- **OpenStreetMap-related geographic data:** Can support mapping or geocoding when configured.

Only technologies actually configured in the project should be listed as production dependencies in the final deployment configuration.

---

## 7. System Architecture

HungerBridge is designed as a multi-component system rather than a single application.

```mermaid
flowchart TD
    Donor[Food Donor]
    NGO[Verified NGO]
    Partner[Delivery Partner]
    Admin[Administrator]

    Frontend[React Frontend]
    Backend[Express and TypeScript API]
    Database[(PostgreSQL)]
    AI[FastAPI AI Service]
    Model[Fine-tuned DistilBERT]
    Rules[Food Safety Rules]
    ESP32[ESP32 Smart Box]
    Sensors[DHT22 and DS18B20]
    DeviceAPI[IoT Reading Endpoint]

    Donor --> Frontend
    NGO --> Frontend
    Partner --> Frontend
    Admin --> Frontend

    Frontend <--> Backend
    Backend <--> Database

    Backend <--> AI
    AI --> Model
    Backend --> Rules

    Sensors --> ESP32
    ESP32 --> DeviceAPI
    DeviceAPI --> Database
```

### How the components interact

1. A donor submits a donation through the frontend.
2. The backend validates the request and stores the relevant data.
3. An NGO reviews the available donation and responds to the request.
4. The backend creates and manages the delivery record when the request is accepted.
5. An eligible delivery partner can be assigned based on availability and distance.
6. If a suitable ZeroWaste Box is available, the system can associate it with the donation.
7. The ESP32 periodically reads the sensors and submits readings to the backend.
8. The backend associates readings with the registered box and its donation where the implementation supports that relationship.
9. Delivery partners use the delivery workflow to verify pickup and handover.
10. The resulting records support operational monitoring and later analysis.

The Express backend is the central application API. The FastAPI service handles model inference separately, while the ESP32 communicates with the designated IoT endpoint.

---

## 8. Application Workflow

### Step 1: Donor registration

A donor registers and provides the information required by the platform. Depending on the donor type, the profile may include business details, an address, location, storage facilities, and supporting documents.

### Step 2: Donation creation

The donor submits information such as:

- Food name
- Ingredients
- Food quantity and other donation details
- Collection or pickup information
- Relevant storage information

The backend validates the request and creates a donation record.

### Step 3: Food classification

The application can submit the food name and ingredients to the AI service.

The model predicts relevant categories, such as cooked poultry or cooked rice. The classification output can then be used by the food-safety rules component.

### Step 4: NGO request

An NGO reviews the donation and submits or manages a request according to the application's request workflow.

### Step 5: Acceptance and delivery creation

When a donation request is accepted, the backend updates the request and donation status and creates a delivery record with the initial `pending` status.

The backend then attempts to assign an available, verified delivery partner.

- If a suitable partner is available, the delivery can move to `assigned`.
- If no suitable partner is available, the delivery remains `pending` until the assignment workflow successfully assigns one.

### Step 6: Smart-box assignment

If a compatible, active, unassigned IoT box is available, the system can associate the box with the donation and record its assignment history.

If no box is available, the donation and delivery workflow must be able to handle that situation without assuming that monitoring is active.

### Step 7: Sensor monitoring

The ESP32 reads environmental measurements, prepares a JSON payload, and uploads it to the configured API endpoint.

### Step 8: Pickup and handover

The delivery partner uses QR verification to progress through the delivery workflow.

The intended status progression is:

`pending → assigned → in_transit → delivered`

The exact status transitions are enforced by backend logic.

### Step 9: Box release and reuse

Where the delivery completion workflow is configured to release the box, the system closes the active assignment and makes the container available for a later donation.

---

## 9. AI Food Classification

### 9.1 Purpose

Food-safety rules depend on the type of food being handled. HungerBridge uses AI-assisted classification to identify categories that may be relevant to a donation.

For example, a donation named **Chicken Biryani** might contain:

- Rice
- Chicken
- Spices
- Curd

The classification system can predict multiple food-related categories rather than requiring every dish to belong to exactly one category.

### 9.2 Model

The project uses a fine-tuned DistilBERT model.

DistilBERT is a smaller transformer-based language model derived from BERT. It can learn contextual relationships between words while being less computationally expensive than the original BERT architecture.

The model is used for a multi-label classification task.

In a multi-label system, more than one category can be relevant to a single food item.

### 9.3 Dataset and model files

The current project includes the following AI assets:

```text
hungerBridgeAi/
├── models/
│   └── hungerbridge/
├── data/
│   └── food_dataset_cooked_2000.csv
└── ...
```

The model directory contains the saved model artifacts, while the CSV provides the food examples used in the classification workflow.

The dataset's size, source, quality, label distribution, and train/validation/test split should be documented alongside the final model evaluation before making claims about accuracy.

### 9.4 Inference process

```mermaid
flowchart TD
    Input[Food Name and Ingredients]
    Preprocess[Input Preprocessing]
    Tokenize[DistilBERT Tokenization]
    Model[Fine-tuned DistilBERT]
    Scores[Category Scores]
    Threshold[Apply Classification Threshold]
    Output[Predicted Food Categories]
    Rules[Relevant Food Safety Rules]

    Input --> Preprocess
    Preprocess --> Tokenize
    Tokenize --> Model
    Model --> Scores
    Scores --> Threshold
    Threshold --> Output
    Output --> Rules
```

The model returns a score for each category. The current configuration uses a classification threshold of `0.5`.

A score above the configured threshold is treated as a positive prediction by the classification logic. It should not automatically be interpreted as a calibrated probability that the food is safe.

### 9.5 Example prediction

An example result from the current model testing is:

| Predicted category | Example score |
|---|---:|
| `cooked_poultry` | 0.9394 |
| `cooked_rice` | 0.6419 |
| `roti` | 0.1054 |

With a threshold of `0.5`, the first two categories would pass the threshold in this example.

These values are illustrative model outputs, not independently validated accuracy measurements.

### 9.6 FastAPI service

The AI service is designed to expose the model through two endpoints:

- `GET /health` — checks whether the AI service is responding.
- `POST /predict` — accepts food information and returns predicted categories.

Example request:

```json
{
  "food_name": "Chicken Biryani",
  "ingredients": [
    "chicken",
    "rice",
    "spices",
    "curd"
  ]
}
```

The exact response structure depends on the FastAPI implementation.

### 9.7 Why use a separate AI service?

Separating AI inference from the Express application offers several benefits:

- Python has a mature ecosystem for machine learning.
- FastAPI makes it straightforward to expose model predictions through HTTP.
- The frontend and primary backend do not need to load the transformer model directly.
- The model can be developed and evaluated independently.
- The AI service can be scaled separately if the project grows.

### 9.8 Important limitations

AI classification identifies likely food categories. It does not directly detect bacterial contamination, toxins, or the complete food history.

Food classification should therefore be combined with validated rules, reliable storage records, and appropriate food-handling procedures.

---

## 10. ZeroWaste Box — IoT System

### 10.1 Overview

ZeroWaste Box is the smart-container component of HungerBridge.

It is intended to help track food-condition measurements during the donation and delivery process while supporting reusable container management.

The current ESP32 firmware reads:

- Ambient temperature
- Ambient relative humidity
- A temperature reading from the DS18B20
- A UTC timestamp when network time is available

### 10.2 Hardware connections

The current firmware uses the following pin configuration:

| Component | ESP32 pin / setting |
|---|---|
| DHT22 data | GPIO 4 |
| DS18B20 data | GPIO 5 |
| Green LED | GPIO 18 |
| Blue LED | GPIO 19 |
| Red LED | GPIO 23 |
| OLED SDA | GPIO 21 |
| OLED SCL | GPIO 22 |
| OLED I²C address | `0x3C` |

The display is initialized using the Adafruit SH110X library.

These pin assignments describe the firmware configuration. Actual wiring, pull-up resistors, sensor power, grounding, and voltage compatibility must be verified on the physical circuit.

### 10.3 Sensor libraries

The firmware uses:

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>
```

Each library has a specific role:

| Library | Purpose |
|---|---|
| `WiFi.h` | Connects the ESP32 to a wireless network |
| `HTTPClient.h` | Sends HTTP requests to the backend |
| `time.h` | Handles timestamps and synchronized system time |
| `Wire.h` | Provides I²C communication for the display |
| `Adafruit_GFX.h` | Supplies graphics and text drawing functions |
| `Adafruit_SH110X.h` | Controls the SH1106 OLED display |
| `DHT.h` | Reads temperature and humidity from the DHT22 |
| `OneWire.h` | Implements one-wire communication |
| `DallasTemperature.h` | Reads temperature from the DS18B20 |

### 10.4 Device identity

The current firmware identifies the box with a code such as:

```text
HB-BOX-001
```

The device sends this code with each reading so the backend can identify the registered device.

The device secret is sent in an HTTP header named:

```text
x-device-secret
```

The raw device secret belongs in the ESP32 configuration, while the backend should validate it against the registered device credentials using the project's authentication logic.

### 10.5 Sensor payload

The firmware creates a JSON payload in this format:

```json
{
  "boxCode": "HB-BOX-001",
  "temperature": 31.2,
  "foodTemperature": 32.5,
  "humidity": 44.1,
  "recordedAt": "2026-10-23T19:45:33Z"
}
```

The numbers above are an example of the payload structure, not a current live measurement.

| Field | Meaning |
|---|---|
| `boxCode` | Registered smart-container identifier |
| `temperature` | Ambient temperature reading |
| `foodTemperature` | Temperature measured by the DS18B20 |
| `humidity` | Ambient relative humidity |
| `recordedAt` | UTC timestamp of the reading |

### 10.6 Upload frequency

The firmware uses a reading interval of 10,000 milliseconds, or approximately 10 seconds.

It also includes Wi-Fi timeout and retry logic so the sensor-reading loop can continue when the network is unavailable.

Uploads are skipped if the sensors return invalid readings or the device clock has not synchronized.

### 10.7 OLED display and LEDs

The OLED displays the latest valid measurements and basic Wi-Fi status.

The firmware also uses GPIO-controlled LEDs as simple ambient-temperature indicators.

These indicators are not a validated food-safety alarm system and do not certify food as safe or unsafe.

### 10.8 IoT communication endpoint

The current firmware is configured to send readings to:

```text
POST /api/admin/readings
```

The full URL is configured in `API_URL`.

The backend endpoint must be running, reachable from the ESP32, and configured to accept the expected JSON fields and device-authentication header.

---

## 11. Food Safety Monitoring Logic

HungerBridge combines food-category predictions with storage-related rules.

The basic principle is to select relevant rules based on the predicted category and the food's recorded storage conditions.

### 11.1 Rule-based processing

A conceptual processing sequence is:

1. Receive the food name and ingredients.
2. Obtain the AI-predicted food categories.
3. Retrieve the applicable food-safety rules.
4. Identify the relevant storage condition.
5. Compare recorded time and temperature information with the rule.
6. Display the resulting monitoring information with its limitations.

### 11.2 Storage conditions

The rule structure can distinguish between:

- Room-temperature storage
- Refrigerated storage
- Frozen storage

Rules may be categorized according to the relevant food type and storage condition.

The project has explored example time limits for cooked rice under different storage conditions. Such values must be verified against authoritative food-safety guidance and the actual conditions in which the food is handled before being used operationally.

### 11.3 Why combine AI and rules?

AI can help interpret food descriptions and identify relevant categories. A rule-based component can then apply explicit conditions to those categories.

This makes the final decision logic easier to inspect and explain than relying on an unconstrained model-generated safety decision.

### 11.4 What the system cannot establish on its own

A temperature sensor does not detect all pathogens or toxins. A normal reading does not prove that food is safe, and a temperature measurement at one location may not represent the entire food container.

The monitoring system should not replace validated food-handling procedures, proper temperature measurement, or professional food-safety guidance.

---

## 12. Backend Architecture

The backend uses Express and TypeScript to provide API endpoints and coordinate database operations.

A typical request passes through the following layers:

1. **Routing:** Selects the endpoint corresponding to the request.
2. **Authentication:** Identifies the user or device and checks credentials where required.
3. **Authorization:** Checks whether the requester is allowed to perform the operation.
4. **Validation:** Checks required fields and input formats.
5. **Business logic:** Performs donation, request, assignment, delivery, or IoT processing.
6. **Database access:** Uses Drizzle to query or update PostgreSQL.
7. **Response:** Returns JSON containing the result or an appropriate error.

### Backend technologies and their responsibilities

**Express.js**

Receives HTTP requests and connects them to the relevant controller or service.

**TypeScript**

Provides type checking and helps organize controllers, schemas, and utility functions.

**Drizzle ORM**

Builds SQL queries and maps application operations to database tables.

**PostgreSQL**

Persists records across requests and supports relationships and constraints.

**Multer and Cloudinary**

Support file uploads and cloud-hosted media where configured.

**Authentication middleware**

Protects endpoints and provides the authenticated identity needed for role-specific operations.

### Backend code organization

The project's backend contains modules for areas such as:

- User and donor management
- Donation and request handling
- NGO operations
- Delivery partner operations
- Delivery status and QR verification
- IoT boxes and assignments
- IoT readings
- Database schemas and connections
- Geocoding and distance calculations
- Authentication and authorization

The exact folder structure should be taken from the current repository rather than assumed from this logical organization.

---

## 13. Database Design

PostgreSQL stores the application's structured data, while Drizzle defines and queries the database schema.

The following tables and relationships reflect the entities used by the current project. This is a conceptual overview rather than a replacement for the actual schema files.

### 13.1 Main entities

| Entity / table | Purpose |
|---|---|
| `users` | Stores user identities and account information |
| `donations` | Stores donated-food records |
| `donation_requests` | Stores NGO requests and their statuses |
| `delivery_partners` | Stores delivery-partner information and availability |
| `deliveries` | Stores delivery status and assignment information |
| `iot_boxes` | Stores smart-container information |
| `iot_box_assignments` | Maintains box-to-donation assignment history |
| IoT readings table | Stores incoming sensor measurements |

Additional application modules may use tables for NGO profiles, donor profiles, complaints, or other operational records, depending on the current schema.

### 13.2 Relationships

The main relationships are:

- A user can have a donor, NGO, or delivery-partner profile, depending on the account model.
- A donation can be associated with one or more requests, according to the implemented constraints.
- A donation request refers to the donation being requested.
- A delivery references a donation request.
- A delivery may be assigned to a delivery partner.
- An IoT box can be associated with a donation.
- Assignment-history records track the relationship between a box and a donation over time.
- Sensor readings are associated with a registered IoT device according to the reading schema.

### 13.3 Delivery status

The current delivery status model includes:

| Status | Meaning |
|---|---|
| `pending` | Delivery exists but has not been assigned |
| `assigned` | A delivery partner has been assigned |
| `in_transit` | Pickup has been verified and delivery is underway |
| `delivered` | Handover has been verified |
| `cancelled` | Delivery has been cancelled |

### 13.4 Request status

The request workflow uses statuses such as:

- `pending`
- `accepted`
- `declined`

The request status and delivery status represent different things. For example, accepting an NGO request does not necessarily mean a delivery partner has already been assigned.

### 13.5 Why relational database design?

Relational data structures help maintain consistency between users, donations, requests, delivery records, and smart-container assignments.

Foreign keys reduce the risk of references to nonexistent records. Transactions can group related operations so a failure does not leave partially updated records.

Unique constraints, such as the delivery-to-request relationship, also prevent certain duplicate records.

---

## 14. API Endpoints

The endpoints below are documented according to the project's known implementation and integration points. This list is not a claim that every possible endpoint has been implemented.

### 14.1 IoT readings

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/admin/readings` | Receives sensor readings from a registered IoT box |

The ESP32 sends JSON data and includes the `x-device-secret` header.

The server should validate the device credentials, box identity, and incoming measurements before storing a reading.

### 14.2 AI service

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Checks whether the AI service is available |
| `POST` | `/predict` | Predicts food-related categories |

These paths belong to the FastAPI service and may run on a different port from the Express backend.

### 14.3 Donor API

Known donor route operations include:

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/dashboard` | Retrieves donor dashboard information |
| `POST` | `/classify` | Requests food classification |
| `POST` | `/create-donation` | Creates a food donation |
| `POST` | `/create-profile` | Creates or completes a donor profile |

These paths may be mounted beneath a parent router, so their full URLs depend on the router configuration.

### 14.4 Delivery partner API

Known delivery-partner operations include:

- Retrieving deliveries assigned to the authenticated partner.
- Updating availability and location.
- Assigning an eligible pending delivery when a partner becomes available.
- Scanning pickup and handover QR tokens.
- Updating delivery status and releasing an IoT box after successful handover, where the relevant workflow is configured.

The exact full paths and HTTP methods should be verified in the Express route files.

### API conventions

The frontend communicates with the backend using HTTP requests and JSON. Authenticated routes use the configured authentication mechanism, which may include cookies and authorization headers.

For successful operations, the backend returns the relevant data. For failures, it should return an appropriate HTTP status and a useful error message.

---

## 15. Frontend Architecture

The frontend is organized around the different roles and operations in the platform.

### Donor interface

The donor workflow covers profile completion, donation creation, food classification, and donation management.

### NGO interface

The NGO workflow supports reviewing donation information and handling donation requests.

### Delivery partner interface

The delivery partner dashboard supports availability management, assigned deliveries, location-related information, and QR-based delivery actions.

### Administrative interface

Administrative screens can provide visibility into platform activity, registered participants, donation and delivery records, complaints, and IoT monitoring information where those modules are integrated.

### IoT monitoring interface

The IoT monitoring interface can display the box assigned to a donation and its latest sensor reading.

The frontend must use the response shape actually returned by the backend. For example, if the backend returns the box and its latest reading under an `iot` object, the frontend must read those nested fields instead of assuming that all IoT information is at the top level.

---

## 16. Delivery Management and QR Verification

### 16.1 Partner assignment

The backend checks whether a delivery partner is eligible for assignment.

Relevant conditions include:

- The partner is verified.
- The partner is available.
- The partner has usable location coordinates when distance-based assignment is required.
- The delivery is still pending and unassigned.

Distance can be used to prioritize suitable partners, but proximity alone does not establish that a partner is eligible.

### 16.2 Pending deliveries

A delivery may remain pending when no eligible partner is available at the time an NGO accepts a request.

The application therefore needs a mechanism to retry assignment when a partner becomes available.

The intended workflow is:

1. A delivery is created as pending.
2. The system attempts to assign a partner.
3. If no suitable partner is available, the delivery remains pending.
4. A delivery partner finishes their current delivery and becomes available.
5. The backend checks for an eligible pending delivery.
6. If one is found and assignment succeeds, the delivery becomes assigned.
7. The partner dashboard refreshes to show the newly assigned delivery.

The assignment operation should be protected against concurrent requests to avoid assigning one delivery to multiple partners.

### 16.3 QR pickup verification

The pickup QR token identifies the pickup action for a delivery. A valid scan moves an eligible delivery from `assigned` to `in_transit` and records the pickup time.

### 16.4 QR handover verification

The handover QR token verifies the handover action. A valid scan moves an eligible delivery from `in_transit` to `delivered` and records the handover and delivery timestamps.

The backend must verify the token and current delivery state rather than trusting a status value sent by the frontend.

### 16.5 IoT box release

After a successful delivery, the backend can close the box's active assignment history and release the box for future reuse.

The box should only be released after the relevant delivery and assignment checks succeed.

---

## 17. Geolocation and Distance Calculation

HungerBridge can use latitude and longitude to compare the locations of NGOs, donors, and delivery partners.

### 17.1 Geographic coordinates

Latitude and longitude represent a point on the Earth's surface.

- **Latitude** indicates the north-south position.
- **Longitude** indicates the east-west position.

Coordinates can be used to calculate approximate geographic distance between two points.

### 17.2 Distance-based partner selection

A typical selection process is:

1. Retrieve eligible delivery partners.
2. Read their stored coordinates.
3. Compare their locations with the relevant pickup location.
4. Sort eligible partners by calculated distance.
5. Attempt to assign the delivery to an available partner.
6. Confirm the assignment in the database.

### 17.3 What the distance means

A straight-line geographic distance is not the same as road distance or actual travel time.

For more accurate logistics, a future version could use a routing service to estimate road distance, traffic, and travel time.

### 17.4 Geocoding

Geocoding converts a human-readable address into geographic coordinates. Reverse geocoding converts coordinates into a readable location description.

A geocoding service can support address-based workflows, but it must be configured and its response validated. Mapping and geocoding provider availability should not be assumed from the presence of latitude and longitude fields alone.

---

## 18. Installation and Setup

This section describes the intended development setup. Exact scripts, environment variable names, and dependency versions must be checked against the current repository.

### 18.1 Prerequisites

Install the tools required for the modules you intend to run:

- Node.js and npm
- PostgreSQL
- Git
- Python 3
- A Python virtual environment
- Arduino IDE or an equivalent ESP32 development environment
- ESP32 board support and the required sensor/display libraries

### 18.2 Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd hungerBridge
```

Replace the placeholder with the actual repository URL.

### 18.3 Install frontend and backend dependencies

If the frontend and backend have separate `package.json` files, install dependencies in their respective directories:

```bash
npm install
```

Run this command inside each applicable project directory.

Use the actual scripts defined in the repository's `package.json` files to start the development server.

### 18.4 Configure PostgreSQL

1. Install and start PostgreSQL.
2. Create a database for HungerBridge.
3. Create a database user with appropriate permissions.
4. Configure the connection string in the backend environment.
5. Run the project's existing Drizzle migration or schema-push workflow.
6. Verify that the backend can connect to the database.

Do not run destructive schema commands against a database containing records you want to preserve.

### 18.5 Start the backend

From the backend directory, run the development command defined in its `package.json`, for example:

```bash
npm run dev
```

The actual command may differ depending on the project's scripts.

Confirm that the server starts without database or configuration errors.

### 18.6 Start the frontend

From the frontend directory, run its configured development script, for example:

```bash
npm run dev
```

Configure the frontend API base URL to point to the running Express backend.

### 18.7 Start the AI service

Follow the instructions in the [AI service section](#20-running-the-ai-service) to create the virtual environment, install Python dependencies, and launch FastAPI.

### 18.8 Configure the IoT device

Update the ESP32 firmware with the appropriate Wi-Fi credentials, backend IP address, API route, box code, and device secret.

Do not use a guessed IP address or assume the backend port without checking the server configuration.

---

## 19. Environment Variables

The names below are illustrative configuration names. Use the exact names expected by the current code.

### Backend configuration

```dotenv
NODE_ENV=development
PORT=3000

DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE_NAME

HUNGERBRIDGE_AI_URL=http://127.0.0.1:8000

# Configure the authentication secret and upload settings
# using the names expected by the backend.
```

If Cloudinary is enabled, its account credentials should be stored in environment variables and never committed to the repository.

### AI configuration

The AI service needs the model artifacts and Python dependencies used by the implementation.

A typical local development address is:

```text
http://127.0.0.1:8000
```

The actual model directory must match the path configured in the FastAPI code.

### ESP32 configuration

The firmware contains settings for:

- Wi-Fi SSID
- Wi-Fi password
- Backend URL
- Registered box code
- Device secret

These values are configuration inputs, not values to publish in a public README.

The ESP32 communicates with the backend using a LAN address when the server is hosted locally. `localhost` on the ESP32 refers to the ESP32 itself, not the laptop.

**Important:** A local HTTP endpoint is suitable only for controlled development and testing. Production deployment should use appropriately secured transport and device authentication.

---

## 20. Running the AI Service

### 20.1 Navigate to the AI directory

In the current development layout, the AI project is located at:

```text
hungerBridge/hungerBridgeAi/
```

### 20.2 Create a virtual environment

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, follow the appropriate local Python environment instructions rather than disabling system security controls indiscriminately.

### 20.3 Install dependencies

If the AI directory contains a `requirements.txt` file:

```powershell
pip install -r requirements.txt
```

The installed versions should be compatible with the saved model artifacts and the project's Python code.

### 20.4 Start FastAPI

If the application entry point is `main.py` and it exports an `app` object:

```powershell
uvicorn main:app --host 0.0.0.0 --port 8000
```

Adjust the module name if the actual entry point differs.

### 20.5 Test the health endpoint

Open the following address in a browser or send a GET request:

```text
http://127.0.0.1:8000/health
```

A successful response confirms that the endpoint is reachable; it does not by itself prove that the model is loaded correctly.

### 20.6 Test prediction

Send a request to the `/predict` endpoint using the input schema implemented by the service.

Verify that the response includes the expected categories and scores before connecting the AI service to the Express donation workflow.

---

## 21. Connecting the ESP32

### 21.1 Upload the firmware

1. Open the ESP32 sketch in Arduino IDE.
2. Select the correct ESP32 board and serial port.
3. Install the required libraries.
4. Verify the pin assignments against the circuit.
5. Update the Wi-Fi and API configuration.
6. Upload the sketch.
7. Open Serial Monitor at `115200` baud.

### 21.2 Verify Wi-Fi connectivity

The Serial Monitor should show whether the device connected to Wi-Fi and its assigned IP address.

If the device cannot connect, check the SSID, password, hotspot compatibility, signal strength, and reported disconnect reason.

### 21.3 Verify backend connectivity

Ensure that:

- The backend is running.
- The API URL uses the correct laptop IP and port.
- The endpoint is registered in Express.
- The server listens on an interface reachable from the ESP32.
- The laptop and ESP32 can communicate through the same network.
- Firewall settings permit the connection.

### 21.4 Verify sensor readings

Confirm that the DHT22 produces valid temperature and humidity values and that the DS18B20 is detected.

Invalid sensor readings should not be uploaded as valid food-monitoring records.

### 21.5 Verify HTTP response

A successful connection should produce an HTTP status code and a backend response.

An error such as `connection refused` usually indicates a connection-level issue, such as no listener at the requested IP and port. It is different from an HTTP `401`, `403`, `404`, or `500`, which indicates that an HTTP server responded.

### 21.6 Verify the database

After a successful upload, inspect the relevant IoT reading record and verify that it is associated with the correct registered box.

The presence of sensor output in Serial Monitor alone does not prove that the reading was stored in PostgreSQL.

---

## 22. Testing and Troubleshooting

### 22.1 Backend and database

- Confirm that PostgreSQL is running.
- Confirm that `DATABASE_URL` is correct.
- Check the backend startup logs.
- Confirm that migrations or schema changes have been applied.
- Verify that required records exist before testing dependent workflows.

### 22.2 AI service

- Confirm that the model path is correct.
- Confirm that required model files are present.
- Test `/health` and `/predict`.
- Verify the request and response formats.
- Check model scores and classification thresholds.
- Evaluate predictions on held-out examples rather than relying only on sample predictions.

### 22.3 IoT communication

**Problem:** `HTTP request failed: connection refused`

Possible causes:

- Express is not running.
- The ESP32 is using an outdated laptop IP address.
- The port in the URL is wrong.
- The server is bound only to localhost.
- The network or firewall is preventing the connection.

**Problem:** HTTP `401` or `403`

Possible causes:

- The device secret is missing or incorrect.
- The registered box cannot be authenticated.
- The endpoint applies authorization rules that the device does not satisfy.

**Problem:** HTTP `404`

Possible causes:

- The URL path is wrong.
- The router is mounted under a different prefix.
- The requested endpoint does not exist in the running server.

**Problem:** HTTP `500`

Possible causes:

- An unhandled backend exception.
- A database failure.
- Invalid assumptions in the request-processing logic.
- A missing or inconsistent device or box record.

### 22.4 Delivery workflow

When testing partner assignment:

1. Confirm the donation request has been accepted.
2. Confirm the delivery exists.
3. Confirm the delivery is pending and unassigned.
4. Confirm the partner is verified and has usable coordinates.
5. Confirm the partner can become available.
6. Trigger the assignment workflow.
7. Confirm that the delivery is assigned to the correct partner.
8. Refresh the partner dashboard and verify the delivery appears.

### 22.5 IoT box assignment

If a delivery exists but no box is displayed:

1. Check whether the box is active.
2. Check whether the box is already linked to another donation.
3. Check the assignment-history records.
4. Verify that the backend returns the box and latest reading.
5. Verify that the frontend reads the fields in the actual response structure.

A delivery can exist without an IoT box assignment, so the two records should be checked independently.

---

## 23. Security Considerations

The application handles account information, business information, location data, delivery details, and device credentials. These records require appropriate protection.

Recommended safeguards include:

- Store credentials and secret keys in environment variables or a suitable secrets manager.
- Never commit passwords, raw device secrets, API keys, or private database connection strings.
- Authenticate users and authorize role-specific operations on the server.
- Validate user input and uploaded files.
- Verify device credentials before accepting IoT readings.
- Avoid trusting user-supplied delivery statuses or box assignments.
- Validate QR tokens against the expected delivery and current delivery state.
- Use database transactions for multi-step operations that must remain consistent.
- Prevent duplicate or conflicting assignments through conditional updates and suitable constraints.
- Use HTTPS and appropriately secured device communication in production.
- Apply rate limits and logging to sensitive endpoints.
- Restrict access to personal documents and uploaded verification files.
- Avoid exposing private user data in public API responses or logs.

A device secret embedded in ESP32 firmware can potentially be extracted by someone with physical access to the device. For production, consider per-device credentials, revocation, rotation, and additional protections.

---

## 24. Limitations

The current design has several limitations that should be considered during evaluation and future development.

### AI limitations

- Predictions depend on the quality and coverage of the training data.
- Multi-label predictions may miss relevant categories or produce false positives.
- A threshold of `0.5` is a configuration choice, not a guarantee of classification quality.
- Food classification does not directly detect pathogens, spoilage toxins, or contamination.

### IoT limitations

- Sensor readings represent the conditions at the sensor location.
- Sensor accuracy, calibration, placement, and response time affect measurements.
- A single measurement cannot establish the complete temperature history of food.
- A Wi-Fi or backend outage can interrupt data transmission.
- The current firmware skips uploads when readings are invalid or time synchronization is unavailable.
- An uploaded measurement is useful only if the backend authenticates, stores, and associates it correctly.

### Logistics limitations

- Straight-line distance does not account for traffic or road networks.
- Partner availability can change between selection and assignment.
- Concurrent assignment attempts must be handled safely.
- A delivery partner's verification status does not independently guarantee delivery quality.

### Operational limitations

- Reliable redistribution requires real donors, NGO participation, and a sustainable delivery process.
- Reusable boxes need a practical return, cleaning, inspection, and maintenance process.
- Food donation decisions must comply with applicable food-safety and local operational requirements.

---

## 25. Future Enhancements

Potential improvements include:

### AI and food safety

- Expand and validate the food dataset.
- Report precision, recall, F1-score, and per-category performance.
- Evaluate thresholds independently for different food categories.
- Add better handling of unknown or ambiguous ingredients.
- Incorporate validated storage and handling guidance.
- Display clear explanations of which rules were applied and why.

### IoT

- Add tamper detection or a lid-state sensor.
- Add more robust offline buffering and retry handling.
- Introduce device-health monitoring and sensor calibration records.
- Support authenticated device provisioning and credential rotation.
- Add time-series charts and alerts for missing or unusual readings.
- Improve box identification and return tracking.

### Delivery and operations

- Improve assignment reliability under concurrent requests.
- Add road-distance and travel-time estimation.
- Improve delivery-event audit logs.
- Add operational dashboards for donors, NGOs, and administrators.
- Improve exception handling for cancelled, failed, or reassigned deliveries.
- Add notifications for new assignments and delivery milestones.

### Impact measurement

- Track meals or portions redistributed.
- Track donation acceptance and completion rates.
- Measure unused or cancelled donations.
- Track reusable-container circulation.
- Measure delivery completion times.
- Develop impact reports using verified records rather than unsupported estimates.

### Deployment

- Add automated testing and continuous integration.
- Containerize services where appropriate.
- Add structured logging and monitoring.
- Configure secure production hosting and HTTPS.
- Document database backup and recovery procedures.

---

## 26. Project Significance

HungerBridge combines software engineering, machine learning, database design, networking, and embedded systems around a real-world social challenge.

### Social significance

The platform aims to make it easier for surplus-food donors and NGOs to coordinate food redistribution.

### Technical significance

The project demonstrates how a web application can communicate with a separate AI inference service and a physical IoT device.

### Data and traceability significance

Structured donation, request, delivery, and assignment records can improve operational visibility and support later analysis.

### Sustainability significance

A reusable smart container can support repeated donation cycles, provided that its return, cleaning, and maintenance processes are implemented effectively.

### Educational significance

The project provides practical experience in:

- Full-stack web development
- REST API design
- Relational database modeling
- Authentication and authorization
- AI model inference
- Embedded programming
- Wi-Fi and HTTP communication
- Sensor integration
- Location-based calculations
- System integration and debugging

---

## 27. Contributing

Contributions can help improve the project's reliability, accessibility, food-safety logic, and operational usefulness.

A suggested contribution workflow is:

1. Create a feature branch.
2. Make a focused change.
3. Test the affected module.
4. Check for secrets and sensitive data.
5. Document any new environment variables or setup requirements.
6. Submit a pull request describing the change.

Keep credentials and private user information out of source control.

---

## 28. License

Choose and add an appropriate license before publicly distributing the repository.

Until a license is added, do not assume that other people have permission to reuse, modify, or redistribute the code.

---

## Project Summary

**HungerBridge** is a surplus-food redistribution platform that combines a React frontend, an Express and TypeScript backend, PostgreSQL with Drizzle ORM, a FastAPI-based DistilBERT classification service, and ESP32-based ZeroWaste Box monitoring.

Its main workflow connects food donations with NGO requests, supports delivery-partner assignment and QR-based delivery verification, and provides a foundation for monitoring food-related conditions through sensor readings.

The long-term objective is to make surplus-food redistribution more organized, traceable, and sustainable while treating AI predictions and sensor measurements as supporting tools rather than guarantees of food safety.

---

*Documentation note: Before publishing this README, verify the repository's actual directory structure, package scripts, environment-variable names, complete route paths, model evaluation results, and currently implemented features. Do not publish real passwords, device secrets, private database URLs, or personal verification documents.*
