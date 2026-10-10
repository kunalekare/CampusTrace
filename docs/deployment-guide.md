# CampusTrace: Complete Microsoft Azure Cloud Deployment Guide

This guide walks through step-by-step provisioning, configuring, and deploying CampusTrace across Microsoft Azure services.

---

## 1. Prerequisites
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed (`az version >= 2.50.0`)
- Active Microsoft Azure Subscription
- GitHub repository with automated workflow permissions

---

## 2. Resource Group & Base Setup

Login and initialize your cloud resource group:
```bash
az login
az group create --name rg-campustrace-prod-eastus --location eastus
```

---

## 3. Azure SQL Database Provisioning

1. Create the Logical SQL Server:
```bash
az sql server create \
  --name sql-campustrace-prod \
  --resource-group rg-campustrace-prod-eastus \
  --location eastus \
  --admin-user campustrace_admin \
  --admin-password 'YourSecurePassword!2026'
```

2. Configure Azure Firewall to allow internal Azure connections:
```bash
az sql server firewall-rule create \
  --resource-group rg-campustrace-prod-eastus \
  --server sql-campustrace-prod \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

3. Provision the Serverless Database:
```bash
az sql db create \
  --resource-group rg-campustrace-prod-eastus \
  --server sql-campustrace-prod \
  --name CampusTraceDB \
  --edition GeneralPurpose \
  --family Gen5 \
  --capacity 2 \
  --auto-pause-delay 60 \
  --compute-model Serverless
```

4. Initialize database schema in Azure Portal Query Editor (or via SSMS) using:
   - `database/schema.sql`
   - `database/indexes.sql`
   - `database/constraints.sql`
   - `database/seed.sql`
   - `database/views.sql`

---

## 4. Azure Blob Storage Setup

Create a storage account and the private container for item photographs:
```bash
az storage account create \
  --name stcampustraceprod \
  --resource-group rg-campustrace-prod-eastus \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2 \
  --allow-blob-public-access true

az storage container create \
  --account-name stcampustraceprod \
  --name item-photos \
  --public-access blob
```

Retrieve the connection string for app configuration:
```bash
az storage account show-connection-string \
  --name stcampustraceprod \
  --resource-group rg-campustrace-prod-eastus \
  --query connectionString -o tsv
```

---

## 5. Backend Deployment (Azure App Service)

1. Create a Linux App Service Plan:
```bash
az appservice plan create \
  --name plan-campustrace-prod \
  --resource-group rg-campustrace-prod-eastus \
  --is-linux \
  --sku B1
```

2. Create the Express API Web App:
```bash
az webapp create \
  --name app-campustrace-api-prod \
  --resource-group rg-campustrace-prod-eastus \
  --plan plan-campustrace-prod \
  --runtime "NODE:20-lts"
```

3. Configure Application Settings in App Service:
```bash
az webapp config appsettings set \
  --resource-group rg-campustrace-prod-eastus \
  --name app-campustrace-api-prod \
  --settings \
    NODE_ENV=production \
    PORT=8080 \
    FRONTEND_URL=https://your-frontend.azurestaticapps.net \
    JWT_SECRET=super_secure_campustrace_production_jwt_secret_key_32_characters \
    DB_SERVER=sql-campustrace-prod.database.windows.net \
    DB_NAME=CampusTraceDB \
    DB_USER=campustrace_admin \
    DB_PASSWORD='YourSecurePassword!2026' \
    DB_ENCRYPT=true \
    AZURE_STORAGE_ACCOUNT=stcampustraceprod \
    AZURE_STORAGE_CONTAINER=item-photos \
    AZURE_STORAGE_CONNECTION_STRING="<your-storage-connection-string>"
```

4. Deploy via GitHub Actions (`.github/workflows/backend-deploy.yml`) or ZIP deployment:
```bash
az webapp deploy --resource-group rg-campustrace-prod-eastus --name app-campustrace-api-prod --src-path ./backend.zip
```

---

## 6. Frontend Deployment (Azure Static Web Apps)

1. Provision the Azure Static Web App resource:
```bash
az staticwebapp create \
  --name swa-campustrace-prod \
  --resource-group rg-campustrace-prod-eastus \
  --location eastus2 \
  --source https://github.com/<your-username>/CampusTrace \
  --branch main \
  --app-location "/frontend" \
  --output-location "dist"
```

2. Set the production backend URL in Static Web App settings:
```bash
az staticwebapp appsettings set \
  --name swa-campustrace-prod \
  --setting-names VITE_API_BASE_URL="https://app-campustrace-api-prod.azurewebsites.net/api"
```

---

## 7. Telemetry & Application Insights

Create the Application Insights component for real-time monitoring:
```bash
az monitor app-insights component create \
  --app appi-campustrace-prod \
  --location eastus \
  --resource-group rg-campustrace-prod-eastus \
  --application-type web
```

Copy the `ConnectionString` into `app-campustrace-api-prod` under `APPLICATIONINSIGHTS_CONNECTION_STRING`.

---

## 8. Expected Cloud Costs & Cleanup

### Cost Optimization:
- **Azure SQL Serverless**: Pauses automatically during inactivity ($5–$15/month).
- **Azure App Service B1**: Baseline tier (~$13/month).
- **Azure Static Web Apps**: Free Tier tier ($0).
- **Blob Storage & Telemetry**: Pay-as-you-go (<$2/month).

### Complete Teardown:
To prevent recurring charges after coursework evaluation:
```bash
az group delete --name rg-campustrace-prod-eastus --yes --no-wait
```