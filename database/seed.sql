-- ============================================================================
-- CampusTrace: Seed Data (Demo Users and Synthetic Reports)
-- Contains the representative calculator match scenario and control items
-- ============================================================================

-- 1. Demo Users (Bcrypt hash for password 'Password@123': $2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG)
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'admin@campustrace.edu')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, PasswordHash, Role, AccountStatus, Department, PhoneNumber)
    VALUES ('Chief Security Officer', 'admin@campustrace.edu', '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG', 'admin', 'ACTIVE', 'Campus Safety', '+15551002000');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'student@campus.edu')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, PasswordHash, Role, AccountStatus, Department, PhoneNumber, StudentId)
    VALUES ('Alex Mercer', 'student@campus.edu', '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG', 'student', 'ACTIVE', 'Computer Science', '+15551003001', 'STU-10492');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'finder@campus.edu')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, PasswordHash, Role, AccountStatus, Department, PhoneNumber, StudentId)
    VALUES ('Sam Taylor', 'finder@campus.edu', '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG', 'student', 'ACTIVE', 'Mathematics', '+15551004002', 'STU-10884');
END;

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'faculty@campus.edu')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, PasswordHash, Role, AccountStatus, Department, PhoneNumber)
    VALUES ('Dr. Sarah Jenkins', 'faculty@campus.edu', '$2a$10$GJHltGncNTclqK3l9RRcrONsYogmQs4ruCxFi1FJdNqCTOHRLgzpG', 'faculty', 'ACTIVE', 'Engineering', '+15551005003');
END;

-- 2. Synthetic Test Reports
DECLARE @StudentId INT = (SELECT UserId FROM dbo.Users WHERE Email = 'student@campus.edu');
DECLARE @FinderId INT = (SELECT UserId FROM dbo.Users WHERE Email = 'finder@campus.edu');

-- Report 1: Lost Scientific Calculator (Alex Mercer)
IF NOT EXISTS (SELECT 1 FROM dbo.ItemReports WHERE Title = 'Lost Texas Instruments TI-84 Plus Calculator')
BEGIN
    INSERT INTO dbo.ItemReports (UserId, ReportType, Title, Category, Description, Brand, Color, Location, EventDate, ImageBlobName, Status, DistinctiveCharacteristics, PrivateVerificationDetails)
    VALUES (
        @StudentId,
        'LOST',
        'Lost Texas Instruments TI-84 Plus Calculator',
        'Electronics',
        'Left my black TI-84 graphing calculator on the 2nd-floor study desks in the Central Library after studying for calculus.',
        'Texas Instruments',
        'Black',
        'Central Library 2nd Floor',
        CAST(SYSUTCDATETIME() AS DATE),
        'ti84_sample.jpg',
        'OPEN',
        'Slight scratch across the back battery cover and silver initials AM written in faint marker.',
        'Serial Number: K-0418M-29402; Battery compartment contains rechargeable Panasonic AAA batteries.'
    );
END;

-- Report 2: Found Scientific Calculator (Matching characteristics - Sam Taylor)
IF NOT EXISTS (SELECT 1 FROM dbo.ItemReports WHERE Title = 'Found Graphing Calculator in Central Library')
BEGIN
    INSERT INTO dbo.ItemReports (UserId, ReportType, Title, Category, Description, Brand, Color, Location, EventDate, ImageBlobName, Status, HandoverNotes, StorageLocation)
    VALUES (
        @FinderId,
        'FOUND',
        'Found Graphing Calculator in Central Library',
        'Electronics',
        'Found a black Texas Instruments scientific graphing calculator unattended on a table in the Central Library.',
        'Texas Instruments',
        'Black',
        'Central Library 2nd Floor',
        CAST(SYSUTCDATETIME() AS DATE),
        'ti84_found.jpg',
        'OPEN',
        'Deposited at the front circulation desk with Student Security assistant.',
        'Library Front Desk Lost & Found Box #3'
    );
END;

-- Report 3: Unrelated Found Item (Hydro Flask water bottle in Gym)
IF NOT EXISTS (SELECT 1 FROM dbo.ItemReports WHERE Title = 'Found Blue Hydro Flask Water Bottle')
BEGIN
    INSERT INTO dbo.ItemReports (UserId, ReportType, Title, Category, Description, Brand, Color, Location, EventDate, ImageBlobName, Status, HandoverNotes, StorageLocation)
    VALUES (
        @FinderId,
        'FOUND',
        'Found Blue Hydro Flask Water Bottle',
        'Clothing & Accessories',
        'Blue 32oz Hydro Flask with assorted campus stickers left on the gym bleachers.',
        'Hydro Flask',
        'Blue',
        'Campus Recreation Center Gymnasium',
        CAST(SYSUTCDATETIME() AS DATE),
        'waterbottle.jpg',
        'OPEN',
        'Kept in gym staff office.',
        'Recreation Center Room 102'
    );
END;

-- Report 4: Lost Keys on North Quad
IF NOT EXISTS (SELECT 1 FROM dbo.ItemReports WHERE Title = 'Lost Dorm Keys with Green Lanyard')
BEGIN
    INSERT INTO dbo.ItemReports (UserId, ReportType, Title, Category, Description, Brand, Color, Location, EventDate, ImageBlobName, Status, DistinctiveCharacteristics, PrivateVerificationDetails)
    VALUES (
        @StudentId,
        'LOST',
        'Lost Dorm Keys with Green Lanyard',
        'Keys',
        'Set of 3 brass keys on a university green lanyard lost near the dining hall entrance.',
        'Standard Brass',
        'Green',
        'North Quad Dining Hall Entrance',
        CAST(SYSUTCDATETIME() AS DATE),
        NULL,
        'OPEN',
        'Green nylon lanyard with gold university crest print.',
        'Small red miniature flashlight attached to the brass key ring.'
    );
END;