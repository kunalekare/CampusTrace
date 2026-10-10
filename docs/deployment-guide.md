# CampusTrace: Microsoft Azure Production Deployment Guide

This guide details the complete deployment of the **CampusTrace** application to Microsoft Azure using your existing Azure resources and GitHub repository ([`https://github.com/kunalekare/CampusTrace.git`](https://github.com/kunalekare/CampusTrace.git)).

---

## 1. Existing Active Azure Resources

- **Resource Group**: `CampusTrace-RG`
- **Azure SQL Server**: `campustrace.database.windows.net`
- **Azure SQL Database**: `CampusTraceDB`
- **Storage Account**: `campustracestorage`
- **Blob Container**: `campustrace-images`
- **GitHub Repository**: `https://github.com/kunalekare/CampusTrace.git`

---

## 2. Deployment Architecture Overview

```
[Student / Campus User]
          │
          ▼ HTTPS
[Azure Static Web Apps] (React + Vite SPA Frontend)
          │
          ▼ REST API calls (HTTPS / CORS enabled)
[Azure App Service (Linux, Node.js 20 LTS)] (Express Backend API)
     ┌────┴───────────────────────────┐
     ▼ Entra ID Token / TLS           ▼ SAS / Connection String
[Azure SQL Database: CampusTraceDB]   [Azure Blob Storage: campustracestorage]
```

---

## 3. Step 1: Deploy Backend REST API to Azure App Service

### Option A: Via Azure Portal (Recommended)

1. Open the [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** > **Web App**.
3. Fill in the **Basics** tab:
   - **Subscription**: Your Azure Subscription
   - **Resource Group**: Select your existing `CampusTrace-RG`
   - **Name**: `app-campustrace-api` (or a unique name, e.g. `campustrace-api-<unique>`)
   - **Publish**: `Code`
   - **Runtime stack**: `Node 20 LTS`
   - **Operating System**: `Linux`
   - **Region**: Same region as your resource group (e.g. `East US` or `Central India`)
   - **Pricing Plan**: `Free F1` or `Basic B1`
4. Click **Review + create** > **Create**.

### Configure App Service Environment Variables (Application Settings)
Once created, open your App Service in Azure Portal:
1. In the left menu, select **Configuration** (or **Environment variables**).
2. Under **Application settings**, add the following key-value pairs:

| Name | Recommended Value |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `DB_SERVER` | `campustrace.database.windows.net` |
| `DB_NAME` | `CampusTraceDB` |
| `DB_AUTH_MODE` | `azure-identity` |
| `AZURE_TENANT_ID` | `3fa4e4bd-010b-47e1-b418-16840b1509fa` |
| `AZURE_STORAGE_ACCOUNT` | `campustracestorage` |
| `AZURE_STORAGE_CONTAINER_NAME` | `campustrace-images` |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpointsProtocol=https;AccountName=campustracestorage;AccountKey=...;EndpointSuffix=core.windows.net` |
| `JWT_SECRET` | A secure random 64-character secret string |
| `JWT_EXPIRES_IN` | `7d` |
| `USE_MOCK_DB` | `false` |

3. Click **Save** and **Continue**.

### Deploy Code via Deployment Center (GitHub CI/CD)
1. In the App Service left menu, click **Deployment Center**.
2. **Source**: Select `GitHub`.
3. Authorize GitHub, select organization `kunalekare`, repository `CampusTrace`, and branch `main`.
4. In build settings, set directory to `backend`.
5. Click **Save**. Azure will automatically generate a GitHub Actions workflow to build and deploy your backend!

---

## 4. Step 2: Grant Managed Identity & Azure SQL Database Access

To allow your Azure App Service to query Azure SQL Database securely:

1. In your App Service, go to **Identity** (under Settings) > Set **Status** to **On** > Click **Save**.
2. Note the App Service name (e.g. `app-campustrace-api`).
3. In Azure Portal, open your SQL Database **CampusTraceDB** > **Query Editor**.
4. Log in as Entra ID admin and run:
   ```sql
   CREATE USER [app-campustrace-api] FROM EXTERNAL PROVIDER;
   ALTER ROLE db_datareader ADD MEMBER [app-campustrace-api];
   ALTER ROLE db_datawriter ADD MEMBER [app-campustrace-api];
   ```
5. In your Storage Account **`campustracestorage`** > **Access Control (IAM)** > **Add role assignment**:
   - Role: `Storage Blob Data Contributor`
   - Members: Select Managed Identity > Choose `app-campustrace-api`.

---

## 5. Step 3: Deploy Frontend to Azure Static Web Apps

1. In Azure Portal, click **Create a resource** > search for **Static Web App** > Click **Create**.
2. Fill in the **Basics** tab:
   - **Resource Group**: `CampusTrace-RG`
   - **Name**: `campustrace-web`
   - **Plan type**: `Free`
   - **Deployment details**: Select `GitHub`
   - **Organization**: `kunalekare`
   - **Repository**: `CampusTrace`
   - **Branch**: `main`
3. Under **Build Details**:
   - **Build Presets**: `Custom`
   - **App location**: `frontend`
   - **Api location**: *(leave empty)*
   - **Output location**: `dist`
4. Click **Review + Create** > **Create**.

### Set Frontend Environment Variable
1. Open your newly created Static Web App in Azure Portal.
2. Go to **Environment variables** (or **Configuration**).
3. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-backend-app-name>.azurewebsites.net/api`
4. Click **Save**.

---

## 6. Step 4: Configure CORS on Backend App Service

Because the frontend runs on an `azurestaticapps.net` domain and calls the backend on `azurewebsites.net`, you must enable CORS:

1. Open your App Service in Azure Portal.
2. In the left menu, select **API** > **CORS**.
3. Under **Allowed Origins**, enter:
   - `https://<your-static-web-app-name>.azurestaticapps.net`
   - `http://localhost:5173` *(for local development)*
4. Check the box **"Enable Access-Control-Allow-Credentials"**.
5. Click **Save**.

---

## 7. Verification Checklist

- [ ] Backend health check responds: `https://<app-name>.azurewebsites.net/api/health` returns `200 OK` with `status: "healthy"`.
- [ ] Frontend loads smoothly on your Azure Static Web Apps URL.
- [ ] Student login works and creates an Entra-backed session.
- [ ] Reporting a lost item with a photo uploads to `campustracestorage` container `campustrace-images`.
- [ ] Browsing directory displays uploaded photographs with click-to-expand lightbox.