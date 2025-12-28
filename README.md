# Javanese Islamic Archaeology Archive Information System (ArkeoGIS)
_A Database Project for Basis Data KOMA 2025 - Universitas Gadjah Mada_

---

## 1. Project Summary  

This repository contains the database project for the "Basis Data" course.  
The project, titled **"Javanese Islamic Archaeology Archive Information System ,"** is a comprehensive relational database designed to catalog, manage, and analyze archaeological data from the Islamic period in Java.

The primary goal of this system is to create a structured repository for data that is currently scattered across various research notes and publications.  
By modeling the complex relationships between historical kingdoms (**Kerajaan**), geographical sites (**Situs Arkeologi**), historical figures (**Tokoh**), and discovered artifacts (**Objek Temuan**), this database provides the foundation for powerful analytical queries — such as mapping the geographical distribution of a kingdom based on its archaeological footprint.

This database is designed to be flexible, accommodating the inherent incompleteness of historical data, such as figures with unclear political affiliations or anonymous, unattributed artifacts.

---

## 2. Group Members  

- Ravif Gayuh Wicaksono – 24/540583/PA/22953
- Revy Satya Gunawan – 24/538296/PA/22835

---

## 3. Technical Changes
During development, we upgraded our architecture from the initial proposal to better suit the project needs:
1.  **DBMS**: Switched from MySQL to **PostgreSQL** to utilize native `ENUM` types and better spatial data support.
2.  **Architecture**: Moved to a **Decoupled Architecture** (REST API Backend + Modular Frontend) to allow for a more interactive map interface.
3.  **Security**: Implemented **JWT Authentication** and **Role-Based Access Control (RBAC)** to enforce the verification workflow.