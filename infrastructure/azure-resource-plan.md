# CampusTrace: Microsoft Azure Resource Provisioning Plan

This infrastructure blueprint outlines the sizing, tiering, security boundaries, and scaling models for deploying **CampusTrace** in Microsoft Azure.

---

## 1. Cloud Architecture Topology

| Layer | Service | SKU / Tier | Purpose & Configuration |
| :--- | :--- | :--- | :--- |
| **Frontend CDN / SPA** | Azure Static Web Apps | Standard | Global content distribution, SSL certificate automation, custom domain |
| **Backend API** | Azure App Service (Linux) | B2 / P1v3 | Express.js REST application hosting with auto-scaling rules (1â€“4 instances) |
| **Database** | Azure SQL Database | Serverless (General Purpose, 1â€“4 vCores) | Relational storage for users, reports, algorithmic matches, claims, audit logs |
| **Media Storage** | Azure Blob Storage | Standard V2 (Hot Tier) | Public container for item thumbnails; Private SAS container for claim receipts |
| **Async Processor** | Azure Functions (Linux) | Flex Consumption (Node.js 20) | Event-driven matching evaluation and email/push alert worker |
| **Message Broker** | Azure Service Bus | Standard Tier | Decouples report creation from the heuristic matching execution engine |
| **Key Vault** | Azure Key Vault | Standard | Secret management for connection strings, JWT signing keys, storage keys |
| **Monitoring** | Azure Application Insights | Pay-As-You-Go | Distributed request tracing, error telemetry, slow query diagnosis |

---

## 2. Resource Group & Tags
- **Resource Group**: `rg-campustrace-prod-eastus`
- **Location**: `East US`
- **Resource Naming Standards**:
  - Web App: `app-campustrace-api-prod`
  - SQL Server: `sql-campustrace-prod`
  - SQL Database: `sqldb-campustrace-prod`
  - Storage Account: `stcampustraceprod`
  - Key Vault: `kv-campustrace-prod`
  - Service Bus: `sb-campustrace-prod`

---

## 3. Security & Compliance
- Azure Managed Identity: App Service and Azure Functions authenticate to Azure SQL and Azure Blob Storage without hardcoded credentials.
- Encryption at Rest: Azure SQL Transparent Data Encryption (TDE) and Blob Storage 256-bit AES encryption.
- Firewall: Azure SQL server restricts connections strictly to Azure services and administrative VPN IPs.