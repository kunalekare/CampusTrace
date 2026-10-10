-- ============================================================================
-- CampusTrace: Check Constraints & Business Rules (T-SQL)
-- ============================================================================

-- Valid User Roles
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Users_Role')
BEGIN
    ALTER TABLE dbo.Users
    ADD CONSTRAINT CK_Users_Role CHECK (Role IN ('student', 'faculty', 'admin'));
END;

-- Valid Account Statuses
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Users_AccountStatus')
BEGIN
    ALTER TABLE dbo.Users
    ADD CONSTRAINT CK_Users_AccountStatus CHECK (AccountStatus IN ('ACTIVE', 'SUSPENDED'));
END;

-- Valid Report Types
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_ItemReports_ReportType')
BEGIN
    ALTER TABLE dbo.ItemReports
    ADD CONSTRAINT CK_ItemReports_ReportType CHECK (ReportType IN ('LOST', 'FOUND'));
END;

-- Valid Report Statuses
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_ItemReports_Status')
BEGIN
    ALTER TABLE dbo.ItemReports
    ADD CONSTRAINT CK_ItemReports_Status CHECK (Status IN ('OPEN', 'MATCHED', 'CLAIMED', 'RESOLVED', 'EXPIRED'));
END;

-- Valid PotentialMatch Statuses
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_PotentialMatches_Status')
BEGIN
    ALTER TABLE dbo.PotentialMatches
    ADD CONSTRAINT CK_PotentialMatches_Status CHECK (Status IN ('PENDING', 'CONFIRMED', 'DISMISSED'));
END;

-- Valid Match Score: 0 to 100
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_PotentialMatches_Score')
BEGIN
    ALTER TABLE dbo.PotentialMatches
    ADD CONSTRAINT CK_PotentialMatches_Score CHECK (Score >= 0.0 AND Score <= 100.0);
END;

-- Valid Verification Statuses for Claims
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Claims_VerificationStatus')
BEGIN
    ALTER TABLE dbo.Claims
    ADD CONSTRAINT CK_Claims_VerificationStatus CHECK (VerificationStatus IN ('PENDING', 'APPROVED', 'REJECTED'));
END;

-- Valid Handover Statuses for Claims
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Claims_HandoverStatus')
BEGIN
    ALTER TABLE dbo.Claims
    ADD CONSTRAINT CK_Claims_HandoverStatus CHECK (HandoverStatus IN ('PENDING', 'CONFIRMED'));
END;