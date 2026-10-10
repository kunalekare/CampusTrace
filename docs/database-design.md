# CampusTrace: Database Design & Entity Relationship Specifications

## 1. Entity-Relationship Diagram (ERD)

The relational schema is implemented in 3NF on **Azure SQL Database**:

```mermaid
erDiagram
    USERS ||--o{ ITEM_REPORTS : "submits"
    USERS ||--o{ CLAIMS : "files"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ AUDIT_LOGS : "triggers"
    ITEM_REPORTS ||--o{ POTENTIAL_MATCHES : "lost_report_id"
    ITEM_REPORTS ||--o{ POTENTIAL_MATCHES : "found_report_id"
    ITEM_REPORTS ||--o{ CLAIMS : "claimed_item"
    POTENTIAL_MATCHES ||--o{ CLAIMS : "associated_match"

    USERS {
        int UserId PK
        string FullName
        string Email UK
        string PasswordHash
        string Role
        string AccountStatus
        datetime CreatedAt
    }

    ITEM_REPORTS {
        int ReportId PK
        int UserId FK
        string ReportType
        string Title
        string Category
        string Description
        string Brand
        string Color
        string Location
        date EventDate
        string ImageBlobName
        string Status
        string PrivateVerificationDetails
    }

    POTENTIAL_MATCHES {
        int MatchId PK
        int LostReportId FK
        int FoundReportId FK
        decimal Score
        string MatchReasons
        string Status
    }

    CLAIMS {
        int ClaimId PK
        int MatchId FK
        int ReportId FK
        int ClaimantId FK
        string VerificationEvidence
        string VerificationStatus
        int ReviewedBy FK
        string HandoverStatus
    }

    NOTIFICATIONS {
        int NotificationId PK
        int UserId FK
        string Type
        string Message
        boolean IsRead
    }

    AUDIT_LOGS {
        int AuditLogId PK
        int ActorUserId FK
        string Action
        string EntityType
        int EntityId
        datetime Timestamp
    }
```

---

## 2. Table Catalog & Constraint Enforcements

- **Users**: Normalized email constraint (`UQ_Users_Email`), role guard check (`CK_Users_Role` for student, faculty, admin).
- **ItemReports**: Disallows arbitrary report types (`CK_ItemReports_ReportType`), tracks status (`OPEN`, `MATCHED`, `CLAIMED`, `RESOLVED`, `EXPIRED`).
- **PotentialMatches**: Prevents duplicate pairs via unique constraint (`UQ_PotentialMatches_Pair`), bounds score between 0.0 and 100.0 (`CK_PotentialMatches_Score`).
- **Claims**: Two-tier verification (`VerificationStatus`: PENDING, APPROVED, REJECTED; `HandoverStatus`: PENDING, CONFIRMED).
- **Notifications**: Indexed by `UserId` and `IsRead` for zero-latency in-app bell counters.
- **AuditLogs**: Immutable operational tracking for compliance and dispute mediation.