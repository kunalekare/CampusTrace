-- ============================================================================
-- CampusTrace: Indexes for Search Performance and Relational Foreign Keys
-- ============================================================================

-- Fast lookup for Users by Email
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Email' AND object_id = OBJECT_ID('dbo.Users'))
    CREATE UNIQUE NONCLUSTERED INDEX IX_Users_Email ON dbo.Users(Email);

-- Fast filtering and pagination for ItemReports by ReportType, Status, and Category
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ItemReports_Filter' AND object_id = OBJECT_ID('dbo.ItemReports'))
    CREATE NONCLUSTERED INDEX IX_ItemReports_Filter 
    ON dbo.ItemReports(ReportType, Status, Category, Location)
    INCLUDE (Title, EventDate, Brand, Color, ImageBlobName, CreatedAt);

-- Fast lookup of user's own reports
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_ItemReports_UserId' AND object_id = OBJECT_ID('dbo.ItemReports'))
    CREATE NONCLUSTERED INDEX IX_ItemReports_UserId ON dbo.ItemReports(UserId, Status, CreatedAt DESC);

-- PotentialMatches lookups by Lost and Found report IDs
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PotentialMatches_Lost_Found' AND object_id = OBJECT_ID('dbo.PotentialMatches'))
    CREATE NONCLUSTERED INDEX IX_PotentialMatches_Lost_Found 
    ON dbo.PotentialMatches(LostReportId, FoundReportId, Score DESC);

-- Claims lookups by ReportId and ClaimantId
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Claims_Report_Claimant' AND object_id = OBJECT_ID('dbo.Claims'))
    CREATE NONCLUSTERED INDEX IX_Claims_Report_Claimant 
    ON dbo.Claims(ReportId, ClaimantId, VerificationStatus);

-- Notifications unread count and fetch
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Notifications_UserId_IsRead' AND object_id = OBJECT_ID('dbo.Notifications'))
    CREATE NONCLUSTERED INDEX IX_Notifications_UserId_IsRead 
    ON dbo.Notifications(UserId, IsRead, CreatedAt DESC);

-- AuditLogs timeline search
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_AuditLogs_Timestamp' AND object_id = OBJECT_ID('dbo.AuditLogs'))
    CREATE NONCLUSTERED INDEX IX_AuditLogs_Timestamp 
    ON dbo.AuditLogs(Timestamp DESC);