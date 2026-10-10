-- ============================================================================
-- CampusTrace: Relational Analytics Views
-- ============================================================================

-- 1. Public Item Reports View (Excludes PrivateVerificationDetails)
CREATE OR ALTER VIEW dbo.vw_PublicReports AS
SELECT 
    r.ReportId,
    r.UserId,
    r.ReportType,
    r.Title,
    r.Category,
    r.Description,
    r.Brand,
    r.Color,
    r.Location,
    r.EventDate,
    r.ImageBlobName,
    r.Status,
    r.StorageLocation,
    r.CreatedAt,
    r.UpdatedAt,
    u.FullName AS ReporterName,
    u.Role AS ReporterRole
FROM dbo.ItemReports r
INNER JOIN dbo.Users u ON r.UserId = u.UserId;
GO

-- 2. Potential Matches Overview View
CREATE OR ALTER VIEW dbo.vw_MatchSummary AS
SELECT 
    m.MatchId,
    m.Score,
    m.MatchReasons,
    m.Status AS MatchStatus,
    m.CreatedAt AS MatchCreatedAt,
    lr.ReportId AS LostReportId,
    lr.Title AS LostTitle,
    lr.Category AS LostCategory,
    lr.Location AS LostLocation,
    lr.UserId AS OwnerId,
    lu.FullName AS OwnerName,
    lu.Email AS OwnerEmail,
    fr.ReportId AS FoundReportId,
    fr.Title AS FoundTitle,
    fr.Location AS FoundLocation,
    fr.StorageLocation,
    fr.UserId AS FinderId,
    fu.FullName AS FinderName
FROM dbo.PotentialMatches m
INNER JOIN dbo.ItemReports lr ON m.LostReportId = lr.ReportId
INNER JOIN dbo.ItemReports fr ON m.FoundReportId = fr.ReportId
INNER JOIN dbo.Users lu ON lr.UserId = lu.UserId
INNER JOIN dbo.Users fu ON fr.UserId = fu.UserId;
GO

-- 3. Recovery Rate & Category Analytics View
CREATE OR ALTER VIEW dbo.vw_AnalyticsSummary AS
SELECT 
    COUNT(*) AS TotalReports,
    SUM(CASE WHEN ReportType = 'LOST' THEN 1 ELSE 0 END) AS TotalLost,
    SUM(CASE WHEN ReportType = 'FOUND' THEN 1 ELSE 0 END) AS TotalFound,
    SUM(CASE WHEN Status = 'OPEN' THEN 1 ELSE 0 END) AS OpenReports,
    SUM(CASE WHEN Status = 'RESOLVED' THEN 1 ELSE 0 END) AS RecoveredItems,
    CAST(
        SUM(CASE WHEN Status = 'RESOLVED' THEN 1 ELSE 0 END) * 100.0 / 
        NULLIF(SUM(CASE WHEN ReportType = 'LOST' THEN 1 ELSE 0 END), 0)
        AS DECIMAL(5,2)
    ) AS RecoveryRatePercentage
FROM dbo.ItemReports;
GO