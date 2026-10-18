# HungerBridge 🌱
### AI-Powered Food Donation, Smart Food Monitoring & Sustainable Delivery Platform

HungerBridge is a technology-driven food redistribution platform designed to reduce food waste and improve access to surplus food for people in need. The system connects food donors, non-governmental organizations (NGOs), and delivery partners through a centralized digital platform that helps coordinate food donations, manage collection and delivery, and monitor food conditions using an IoT-enabled reusable container called **ZeroWaste Box**.

By combining web technologies, Internet of Things (IoT) hardware, machine learning, and sustainable logistics, HungerBridge aims to make food donation more organized, transparent, and environmentally responsible.

The project addresses the gap between edible surplus food and communities that need it by providing a structured process for donation registration, NGO coordination, delivery tracking, food-condition monitoring, and reusable-container management.

---

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [User Roles](#-user-roles)
- [ZeroWaste Box: IoT Hardware](#-zerowaste-box-iot-hardware)
- [AI and Machine Learning](#-ai-and-machine-learning)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Workflow](#-project-workflow)
- [Sustainability and Social Impact](#-sustainability-and-social-impact)
- [Security and Reliability](#-security-and-reliability)
- [Getting Started](#-getting-started)
- [Project Status](#-project-status)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [Disclaimer](#-disclaimer)
- [License](#-license)

---

## 🌍 Project Overview

Food waste and food insecurity are two interconnected challenges. Restaurants, bakeries, caterers, and other food providers may have surplus food that could potentially be redistributed, while NGOs and community organizations work to provide meals to people who need them.

HungerBridge provides a digital coordination system to facilitate this redistribution.

The platform is designed around four major components:

1. **Food Donation Management** — enables donors to manage surplus-food donations and provide relevant food and collection details.
2. **NGO Coordination** — helps NGOs discover and coordinate suitable food donations according to their requirements.
3. **Delivery Management** — connects approved delivery partners with the donation and distribution process.
4. **ZeroWaste Box and Smart Monitoring** — introduces a reusable food container with environmental sensors for monitoring temperature and humidity during food handling and transportation.

An AI/ML component is also being developed to support food-condition assessment and risk estimation. The objective is to provide additional information for decision-making rather than replace appropriate food-safety procedures.

## ❗ Problem Statement

Food redistribution involves several practical challenges:

- Surplus food may go unused because donors and recipient organizations lack an effective coordination mechanism.
- Manual donation management can make it difficult to organize collection, allocation, and delivery.
- Food conditions can change during storage and transportation.
- NGOs may have different meal requirements and capacity constraints.
- Reusable containers need a practical process for tracking distribution and return.
- Limited transparency can make it difficult to review donation and delivery activity.
- Conventional single-use packaging can contribute to unnecessary waste.

HungerBridge aims to address these challenges through a connected platform that brings donation management, logistics, sensor-based monitoring, and sustainability features into one system.

## 💡 Our Solution

HungerBridge creates a coordinated digital workflow between donors, NGOs, and delivery partners.

Donors can register and manage their profiles, provide food-donation information, and coordinate surplus-food availability. NGOs can participate in the donation process and organize suitable collections. Approved delivery partners help move food from donors to recipient organizations or distribution points.

The ZeroWaste Box extends the platform beyond software by introducing reusable-container management and environmental monitoring. Sensor readings can provide visibility into temperature and humidity conditions, while the proposed AI/ML component can support food-condition risk assessment.

Together, these components aim to make food redistribution more traceable, efficient, and sustainable.

---

## ✨ Key Features

### 1. Donor Management

- Donor registration and account management.
- Donor profile completion and business information management.
- Food-donation information and availability management.
- Support for food providers such as restaurants, bakeries, caterers, and other eligible donors.
- Centralized access to donation-related activities.
- Administrative review of relevant donor information, where applicable.

### 2. NGO Management

- NGO registration and profile management.
- NGO information and operational details.
- Coordination with available food donations.
- Support for matching donation availability with recipient requirements.
- Centralized access to relevant donation and delivery information.

### 3. Delivery Partner Management

- Delivery partner registration and profile management.
- Collection of contact and vehicle information.
- Administrative verification of delivery partner registrations.
- Access to partner verification status.
- Support for organizing the movement of donated food.

### 4. Food Donation Coordination

- Structured management of food donation information.
- Coordination between donors and recipient organizations.
- Support for recording relevant food details and availability.
- Improved visibility into the donation lifecycle.
- A foundation for reducing delays between food availability and collection.

### 5. Administrative Dashboard

- Centralized administration interface.
- Donor and NGO management.
- Pending delivery partner verification.
- Review of submitted registration details.
- Approval workflows for eligible delivery partners.
- Clear status indicators and organized management interfaces.

### 6. ZeroWaste Box Management

ZeroWaste Box is the project's reusable-container concept, intended to support food transportation while reducing dependence on disposable packaging.

Planned and prototype-oriented capabilities include:

- Reusable stainless-steel food container.
- Temperature and humidity monitoring.
- Sensor-based visibility into transportation conditions.
- Food-condition monitoring during handling and delivery.
- Support for recording container distribution and return.
- QR code and NFC-based identification or verification workflows.
- Container usage and return tracking.
- Potential incentives for timely container returns.

The availability of each capability depends on the current hardware integration and application implementation.

### 7. Food Condition and Risk Monitoring

- Temperature and humidity readings from the IoT hardware.
- Monitoring of environmental conditions during food handling and transportation.
- A foundation for detecting conditions that may require additional attention.
- Integration potential between sensor readings and the AI/ML component.
- Support for more informed handling decisions.

**Important:** Sensor readings alone cannot establish whether food is safe to consume. Food safety also depends on factors such as food type, preparation, initial condition, time, handling, and validated storage requirements.

### 8. AI and Machine Learning

The project includes an AI/ML component intended to assist with food-condition assessment and risk estimation.

The development approach uses a machine-learning model built with Python-based tools. The model's role is to support the wider monitoring workflow, rather than independently certify food as safe or unsafe.

The proposed pipeline includes:

- Structured food-condition data.
- Food-category information.
- Model training and evaluation.
- Prediction through a backend API.
- Potential integration with the IoT monitoring workflow.

### 9. Sustainability and Social Impact

- Encourages redistribution of surplus food.
- Promotes reusable food containers.
- Supports coordination between food donors and NGOs.
- Encourages accountability in the container return process.
- Provides a foundation for measuring donations and redistribution activity.
- Aims to reduce avoidable food and packaging waste.

---

## 📦 ZeroWaste Box: IoT Hardware

ZeroWaste Box is the hardware component of HungerBridge. It is designed to explore how low-cost embedded systems can improve visibility into food-storage and transportation conditions.

### Hardware Components

| Component | Purpose |
|---|---|
| ESP32 DevKit V1 | Main microcontroller for sensor integration and data processing |
| DHT22 sensor | Measures ambient temperature and relative humidity |
| DS18B20 sensor | Provides temperature measurements through a digital sensor interface |
| SH1106 OLED display | Displays relevant monitoring information locally |
| Breadboard and jumper wires | Used for prototype assembly and circuit connections |
| Reusable stainless-steel container | Physical container concept for food transportation |

### Prototype Pin Configuration

| Component | ESP32 connection |
|---|---|
| DHT22 | GPIO 4 |
| DS18B20 | GPIO 5 |
| RGB indicator | GPIO 18, GPIO 19, GPIO 23 |
| SH1106 OLED | I²C, address `0x3C` |

*These are the prototype's intended connections. Actual wiring, I²C pin assignments, power requirements, and sensor-library configuration should be verified against the implemented circuit.*

### How the Hardware Works

1. The ESP32 communicates with the connected sensors.
2. The DHT22 provides temperature and humidity readings.
3. The DS18B20 provides an additional temperature measurement.
4. The OLED display presents selected monitoring information.
5. RGB indicators can be used to communicate defined monitoring states.
6. Sensor data can be made available to the wider system when connectivity and backend integration are implemented.
7. The collected data can support further analysis of environmental conditions during food transportation.

### Why Use Two Temperature Sensors?

The DHT22 and DS18B20 provide different sensing capabilities. Using both can support comparisons between measurements and provide flexibility in the prototype's monitoring design. Their readings should be interpreted according to their placement, calibration, response time, and intended measurement environment.

### QR, NFC, and Container Traceability

The proposed container workflow can use QR codes or NFC identifiers to associate a reusable box with a donation or delivery record.

This can support workflows such as:

- Identifying a container.
- Associating a container with a donation.
- Recording collection or handover events.
- Tracking container returns.
- Supporting accountability through recorded events.

These identifiers provide traceability, not proof of food quality. Any claims about location, timestamps, or handover verification depend on how those events are captured and validated by the application.

---

## 🤖 AI and Machine Learning

HungerBridge explores machine learning as a supporting layer for food-condition assessment.

### Development Technologies

- **Python** — model development and data processing.
- **PyTorch** — machine-learning framework.
- **Hugging Face Transformers** — access to transformer architectures and model tooling.
- **DistilBERT** — proposed model architecture for suitable structured or text-based classification tasks.
- **FastAPI** — proposed API layer for serving model predictions.

### Proposed Dataset

The development dataset is organized around food categories such as:

- Cooked vegetarian meals.
- Cooked non-vegetarian meals.
- Dairy products.
- Mixed meals.

The initial dataset plan contains approximately 600 records, with a proposed 80/20 training-validation split (480 and 120 records respectively). These figures describe the planned dataset and split, not independently verified model performance.

### Intended Workflow

1. Prepare and validate the food-condition dataset.
2. Encode the relevant input features.
3. Train and evaluate the selected model.
4. Expose predictions through an API.
5. Integrate appropriate outputs into the application.
6. Evaluate the model using suitable metrics and representative real-world data.

### Role of AI in Food Safety

A machine-learning prediction is an estimate, not a food-safety certification. Reliable food-safety decisions require validated food-specific rules, suitable data, and expert review. The model must not be presented as capable of guaranteeing edibility or determining exact remaining shelf life unless those capabilities have been rigorously validated.

---

## 🛠️ Technology Stack

### Frontend

- React
- JavaScript
- Tailwind CSS
- React Router
- Lucide React

### Backend

- Node.js
- Express.js
- REST API architecture

### Database

- PostgreSQL
- Drizzle ORM

### Authentication and Security

- Session or cookie-based authentication, according to the configured authentication flow.
- Password hashing using Argon2.
- Role-based access control.
- Registration and verification workflows.

### IoT and Embedded Systems

- ESP32 DevKit V1
- DHT22
- DS18B20
- SH1106 OLED
- Embedded firmware and sensor libraries

### AI/ML

- Python
- PyTorch
- Hugging Face Transformers
- DistilBERT
- FastAPI

*Some technologies and integrations represent the intended architecture and should be checked against the latest implementation before being described as fully operational.*

---

## 🏗️ System Architecture

HungerBridge is designed as a modular system connecting the user interface, application backend, database, IoT hardware, and AI/ML services.

```text
                 HUNGERBRIDGE PLATFORM
                          |
           +--------------+--------------+
           |              |              |
        Donors           NGOs      Delivery Partners
           |              |              |
           +--------------+--------------+
                          |
                    React Frontend
                          |
                    Express.js API
                          |
                PostgreSQL Database
                          |
             +------------+------------+
             |                         |
       Donation & User           Delivery and
        Management              Box Management
                                       |
                                  ZeroWaste Box
                                       |
                                     ESP32
                                       |
                        +--------------+--------------+
                        |                             |
                     DHT22                         DS18B20
                  Temperature &                  Temperature
                    Humidity                         |
                        +--------------+--------------+
                                       |
                              Monitoring Interface
                                       |
                              AI/ML Service
                         (subject to integration)
```

This diagram represents the intended logical architecture. The final data flow depends on which hardware communication and AI service integrations are implemented and tested.

---

## 🔄 Project Workflow

### Food Donation and Delivery

1. A donor registers and completes the relevant profile information.
2. The donor provides details of available surplus food.
3. An NGO coordinates with the available donation according to its requirements.
4. An eligible delivery partner participates in the collection and transportation process.
5. Relevant donation, delivery, and container events can be recorded.
6. The food reaches the intended recipient or distribution point.

### Delivery Partner Verification

1. A delivery partner submits registration details.
2. The application records the submitted information.
3. An administrator reviews the pending registration.
4. The administrator verifies or declines the registration according to the implemented workflow.
5. The verification status is reflected in the application.

### ZeroWaste Box Monitoring

1. The reusable container is associated with a donation or delivery.
2. The ESP32 obtains readings from the connected sensors.
3. Monitoring information is displayed locally or transferred to the application when the relevant integration is available.
4. Environmental readings can be reviewed as part of the delivery workflow.
5. Container handover and return events can be recorded through the implemented identification mechanism.

---

## 🌱 Sustainability and Social Impact

HungerBridge is designed around three sustainability objectives.

**1. Reducing avoidable food waste**

By improving communication and coordination between donors and recipient organizations, the platform aims to help redirect eligible surplus food toward people who need it.

**2. Encouraging reusable packaging**

ZeroWaste Box introduces a reusable stainless-steel container concept intended to reduce dependence on single-use packaging. Its environmental benefit depends on actual reuse, cleaning practices, transport, and lifecycle considerations.

**3. Improving accountability**

Digital records, delivery coordination, and container-return workflows can improve visibility into donation activities and help organizations understand how resources are being used.

The broader goal is to combine social impact with practical, measurable technology rather than treating food donation as a standalone listing website.

---

## 🔐 Security and Reliability

The platform's security design includes or is intended to include:

- Secure password hashing.
- Authenticated access to protected routes.
- Role-specific access for donors, NGOs, administrators, and delivery partners.
- Server-side authorization for administrative operations.
- Input validation for incoming requests.
- Controlled access to sensitive account information.
- Error handling for API operations.

Security must be enforced by the backend, not only by hiding interface elements. Production deployment should also include appropriate HTTPS configuration, secure cookie settings, environment-based secrets, rate limiting, and testing of authorization boundaries.

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm.
- PostgreSQL.
- Git.
- A compatible web browser.

Python and the relevant hardware toolchain are needed only when working on the AI/ML or IoT components.

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd HungerBridge
```

Replace the repository URL with your actual GitHub repository URL. The folder name may differ depending on your repository.

### 2. Set Up the Backend

```bash
cd server
npm install
```

Configure the backend environment variables using your project's existing `.env` configuration. Typical settings include the PostgreSQL connection string, authentication secrets, and the port used by the server.

**Do not commit `.env` files, passwords, API keys, or other credentials to GitHub.**

### 3. Configure the Database

Create a PostgreSQL database and configure the backend to connect to it.

Run the database migration or schema setup command defined in the backend's `package.json`. The exact command depends on the project's configured Drizzle migration workflow.

### 4. Start the Backend

Run the development script configured in the backend's `package.json`, for example:

```bash
npm run dev
```

Keep the terminal running while using the application.

### 5. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd <FRONTEND_DIRECTORY>
npm install
```

Configure the frontend API base URL if necessary:

```env
VITE_API_URL=http://localhost:3000/api
```

This value assumes the backend runs on port `3000` and exposes its routes under `/api`. Adjust it if your configuration differs.

Start the frontend using its configured development script, commonly:

```bash
npm run dev
```

Open the local URL printed in the terminal.

### 6. Run the IoT Prototype

1. Assemble the ESP32 and sensors according to the verified circuit diagram.
2. Install the required sensor and display libraries in the selected firmware development environment.
3. Configure the firmware for the actual pin assignments.
4. Upload the firmware to the ESP32.
5. Confirm that sensor readings and display output work as expected.
6. Configure data transmission only after the relevant communication interface and backend endpoint are implemented.

### 7. Run the AI/ML Component

If the AI/ML service has been configured separately, install its Python dependencies using the project's dependency file and run the configured FastAPI application. The exact startup command, model path, and environment settings depend on the implementation.

---

## 📊 Project Status

HungerBridge is being developed as an integrated academic project combining web application development, IoT prototyping, AI/ML research, and sustainable food redistribution.

| Component | Scope |
|---|---|
| Web application | User interfaces and role-specific workflows |
| Backend and database | API endpoints, data management, and authorization |
| Donor and NGO management | Profile and donation coordination workflows |
| Delivery partner verification | Administrative review and approval workflow |
| ZeroWaste Box | Reusable-container and sensor-monitoring prototype |
| AI/ML | Model development and evaluation for food-condition assessment |
| QR/NFC traceability | Container identification and event-recording workflows |
| End-to-end integration | Requires testing across the connected software and hardware components |

Feature availability may vary between the implemented application, the working hardware prototype, and planned enhancements. Only tested functionality should be described as complete in a project demonstration or release.

---

## 🔮 Future Enhancements

Potential future improvements include:

- Real-time sensor-data transmission to the backend.
- Historical temperature and humidity graphs.
- Validated food-category-specific handling rules.
- Improved AI/ML evaluation using expert-reviewed data.
- More reliable food-condition risk alerts.
- QR/NFC-based container lifecycle management.
- Donation and delivery status notifications.
- NGO demand and donation matching improvements.
- Verified handover records and return tracking.
- Donor and delivery-partner performance summaries.
- Impact analytics for food redistributed, deliveries completed, and reusable-container cycles.
- Offline-friendly workflows for areas with limited connectivity.
- Independent validation with food-safety professionals and pilot organizations.

---

## 🤝 Contributing

Contributions that improve usability, reliability, accessibility, food-safety validation, hardware integration, or sustainability are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Test the affected functionality.
5. Submit a pull request describing the changes.

Please avoid committing credentials, personal information, or unverified food-safety claims.

---

## ⚠️ Disclaimer

HungerBridge is a food-redistribution and monitoring project under development. Its IoT sensors and AI/ML component are intended to support environmental monitoring and decision-making. They do not independently guarantee that food is safe to consume.

Food handling, storage, transportation, cleaning, and distribution must follow applicable food-safety requirements and validated procedures. Hardware readings, model outputs, and estimated shelf-life information should not replace professional food-safety assessment.

---

## 📄 License

A license has not yet been specified. Add an appropriate license file before presenting the repository as open source.

---

**HungerBridge — Connecting surplus food with those who need it, through technology and sustainability.** 🌱
