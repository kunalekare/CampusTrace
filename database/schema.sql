-- ============================================================================
-- CampusTrace: Azure SQL Database Core Relational Schema (T-SQL)
-- Conforming to Section 5: Database Design Specifications
-- ============================================================================

-- 1. Users Table
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        UserId INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT 'student', -- 'student', 'faculty', 'admin'
        AccountStatus NVARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED'
        Department NVARCHAR(100) NULL,
        PhoneNumber NVARCHAR(30) NULL,
        StudentId NVARCHAR(50) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_Users_Email UNIQUE (Email)
    );
END;

-- 2. ItemReports Table
IF OBJECT_ID('dbo.ItemReports', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.ItemReports (
        ReportId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        ReportType NVARCHAR(20) NOT NULL, -- 'LOST' or 'FOUND'
        Title NVARCHAR(200) NOT NULL,
        Category NVARCHAR(100) NOT NULL, -- 'Electronics', 'ID Cards & Wallets', 'Keys', 'Bags & Backpacks', 'Books & Stationery', 'Clothing & Accessories', 'Other'
        Description NVARCHAR(MAX) NOT NULL,
        Brand NVARCHAR(100) NULL,
        Color NVARCHAR(50) NULL,
        Location NVARCHAR(150) NOT NULL, -- Campus Location / Building
        EventDate DATE NOT NULL, -- Date lost or found
        ImageBlobName NVARCHAR(500) NULL, -- Azure Blob Storage unique blob identifier
        Status NVARCHAR(50) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'MATCHED', 'CLAIMED', 'RESOLVED', 'EXPIRED'
        DistinctiveCharacteristics NVARCHAR(500) NULL,
        PrivateVerificationDetails NVARCHAR(500) NULL, -- NEVER exposed publicly
        HandoverNotes NVARCHAR(500) NULL, -- Handover instructions for found items
        StorageLocation NVARCHAR(150) NULL, -- Physical office/desk holding the item
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_ItemReports_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
    );
END;

-- 3. PotentialMatches Table
IF OBJECT_ID('dbo.PotentialMatches', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.PotentialMatches (
        MatchId INT IDENTITY(1,1) PRIMARY KEY,
        LostReportId INT NOT NULL,
        FoundReportId INT NOT NULL,
        Score DECIMAL(5,2) NOT NULL, -- 0.00 to 100.00
        MatchReasons NVARCHAR(MAX) NOT NULL, -- JSON array of matched reasons
        Status NVARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED', 'DISMISSED'
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_PotentialMatches_LostReport FOREIGN KEY (LostReportId) REFERENCES dbo.ItemReports(ReportId),
        CONSTRAINT FK_PotentialMatches_FoundReport FOREIGN KEY (FoundReportId) REFERENCES dbo.ItemReports(ReportId),
        CONSTRAINT UQ_PotentialMatches_Pair UNIQUE (LostReportId, FoundReportId)
    );
END;

-- 4. Claims Table
IF OBJECT_ID('dbo.Claims', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Claims (
        ClaimId INT IDENTITY(1,1) PRIMARY KEY,
        MatchId INT NULL, -- Optional link to a specific PotentialMatch
        ReportId INT NOT NULL, -- The Found ItemReport being claimed
        ClaimantId INT NOT NULL, -- The user claiming ownership
        VerificationEvidence NVARCHAR(MAX) NOT NULL, -- Protected evidence: serial number, secret marks, purchase proof
        EvidenceBlobName NVARCHAR(500) NULL, -- Azure Blob identifier for uploaded invoice/photo
        VerificationStatus NVARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
        ReviewedBy INT NULL, -- Admin / Officer who verified
        ReviewedAt DATETIME2 NULL,
        AdminNotes NVARCHAR(500) NULL,
        HandoverStatus NVARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'CONFIRMED'
        HandoverConfirmedAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        UpdatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Claims_Report FOREIGN KEY (ReportId) REFERENCES dbo.ItemReports(ReportId),
        CONSTRAINT FK_Claims_Claimant FOREIGN KEY (ClaimantId) REFERENCES dbo.Users(UserId),
        CONSTRAINT FK_Claims_Reviewer FOREIGN KEY (ReviewedBy) REFERENCES dbo.Users(UserId),
        CONSTRAINT FK_Claims_Match FOREIGN KEY (MatchId) REFERENCES dbo.PotentialMatches(MatchId)
    );
END;

-- 5. Notifications Table
IF OBJECT_ID('dbo.Notifications', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Notifications (
        NotificationId INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Type NVARCHAR(50) NOT NULL, -- 'POTENTIAL_MATCH', 'CLAIM_SUBMITTED', 'CLAIM_APPROVED', 'CLAIM_REJECTED', 'HANDOVER_CONFIRMED', 'STATUS_CHANGE'
        Message NVARCHAR(MAX) NOT NULL,
        RelatedReportId INT NULL,
        RelatedMatchId INT NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId)
    );
END;

-- 6. AuditLogs Table
IF OBJECT_ID('dbo.AuditLogs', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLogs (
        AuditLogId INT IDENTITY(1,1) PRIMARY KEY,
        ActorUserId INT NULL,
        Action NVARCHAR(100) NOT NULL, -- 'LOGIN', 'REPORT_CREATED', 'CLAIM_REVIEWED', 'HANDOVER_CONFIRMED', 'USER_STATUS_UPDATED'
        EntityType NVARCHAR(50) NOT NULL, -- 'User', 'ItemReport', 'Claim', 'PotentialMatch'
        EntityId INT NULL,
        Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        Metadata NVARCHAR(MAX) NULL -- Non-sensitive contextual metadata in JSON format
    );
END;