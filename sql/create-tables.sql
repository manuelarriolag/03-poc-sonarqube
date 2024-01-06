-- CREATE DATABASE sonarqube
--     WITH
--     OWNER = postgres
--     ENCODING = 'UTF8'
--     LOCALE_PROVIDER = 'libc'
--     CONNECTION LIMIT = -1
--     IS_TEMPLATE = False;


-- drop table if exists metrics;
-- create table metrics (
--     id VARCHAR(50),
--     key VARCHAR(100),
--     type VARCHAR(50),
--     name VARCHAR(255),
--     description VARCHAR(255),
--     domain  VARCHAR(50),
--     direction integer,
--     qualitative boolean,
--     hidden boolean,
--     decimalScale integer,
--     total integer,
--     p integer,
--     ps integer
-- ); 

drop table if exists squads;
create table squads (
    project VARCHAR(100),
    squad VARCHAR(100),
    notes VARCHAR(255)
); 

drop table if exists components;
create table components (
    key VARCHAR(100),
    name VARCHAR(255),
    qualifier VARCHAR(10),
    project VARCHAR(100)
); 

drop table if exists measures;
create table measures (
    processDate timestamptz,
    componentKey VARCHAR(100),
    metric VARCHAR(100),
    value VARCHAR(1000),
    bestValue boolean
); 

-- drop table if exists issues;
-- create table issues (
--     processDate timestamptz,
--     componentKey VARCHAR(100),
--     metric VARCHAR(100),
--     value VARCHAR(1000),
--     bestValue boolean
-- ); 


-- drop table if exists statuses;
-- create table statuses (
--     processDate timestamptz,
--     componentKey VARCHAR(100),
--     status VARCHAR(10),
--     ignoredConditions boolean,
--     caycStatus VARCHAR(20)
-- ); 

-- drop table if exists conditions;
-- create table conditions (
--     processDate timestamptz,
--     componentKey VARCHAR(100),
--     status VARCHAR(10),
--     metricKey VARCHAR(100),
--     comparator VARCHAR(10),
--     errorThreshold decimal(10,2),
--     actualValue decimal(10,2)
-- ); 



--STORAGE_DIR = "/var/lib/pgadmin/storage"

-- copy public.measures (metric, value, componentkey, bestvalue) 
-- FROM STDIN DELIMITER ',' CSV HEADER ENCODING 'UTF8' QUOTE '"' ESCAPE ''''

-- truncate components;

-- COPY components FROM '/bitnami/postgresql/data/tmp/sonarqube.components.csv' CSV HEADER

-- truncate measures;

-- COPY measures FROM '/bitnami/postgresql/data/tmp/sonarqube.measures.csv' CSV



-- select * from measures
-- where metric = 'quality_gate_details'

drop table if exists Scores;
create table Scores (
    metricKey VARCHAR(100),
    score VARCHAR(10),
	minValue DECIMAL(10,2),
	maxValue DECIMAL(10,2),
    name VARCHAR(100)
); 

insert into Scores values
    ('reliability_rating', 'A', 1, 1, '0 Bugs'),
    ('reliability_rating', 'B', 2, 2, 'at least 1 Minor Bug'),
    ('reliability_rating', 'C', 3, 3, 'at least 1 Major Bug'),
    ('reliability_rating', 'D', 4, 4, 'at least 1 Critical Bug'),
    ('reliability_rating', 'E', 5, 5, 'at least 1 Blocker Bug')
;

insert into Scores values
    ('security_rating', 'A', 1, 1, '0 Vulnerabilities'),
    ('security_rating', 'B', 2, 2, 'at least 1 Minor Vulnerability'),
    ('security_rating', 'C', 3, 3, 'at least 1 Major Vulnerability'),
    ('security_rating', 'D', 4, 4, 'at least 1 Critical Vulnerability'),
    ('security_rating', 'E', 5, 5, 'at least 1 Blocker Vulnerability')
;

-- insert into Scores values
--     ('security_review_rating', 'A', 1, 1, 'Security Hotspots Reviewed are >= 80%'),
--     ('security_review_rating', 'B', 2, 2, 'Security Hotspots Reviewed are >= 70% and < 80%'),
--     ('security_review_rating', 'C', 3, 3, 'Security Hotspots Reviewed are >= 50% and < 70%'),
--     ('security_review_rating', 'D', 4, 4, 'Security Hotspots Reviewed are >= 30% and < 50%'),
--     ('security_review_rating', 'E', 5, 5, 'Security Hotspots Reviewed are < 30%')
-- ;

insert into Scores values
    ('security_hotspots_reviewed', 'A', 80.0, 999.99,  'Security Hotspots Reviewed are >= 80%'),
    ('security_hotspots_reviewed', 'B', 70.0,  79.99,  'Security Hotspots Reviewed are >= 70% and < 80%'),
    ('security_hotspots_reviewed', 'C', 50.0,  69.99,  'Security Hotspots Reviewed are >= 50% and < 70%'),
    ('security_hotspots_reviewed', 'D', 30.0,  49.99,  'Security Hotspots Reviewed are >= 30% and < 50%'),
    ('security_hotspots_reviewed', 'E',  0.0,  29.99,  'Security Hotspots Reviewed are < 30%')
;

insert into Scores values
    ('sqale_rating', 'A',  0.00,   5.99, 'Technical debt ratio is less than 5%'),
    ('sqale_rating', 'B',  6.00,  10.99, 'Technical debt ratio between 6 to 10%'),
    ('sqale_rating', 'C', 11.00,  20.99, 'Technical debt ratio between 11 to 20%'),
    ('sqale_rating', 'D', 21.00,  50.99, 'Technical debt ratio between 21 to 50%'),
    ('sqale_rating', 'E', 51.00, 999.99, 'Technical debt ratio over 51%')
;

insert into Scores values
--    ('coverage', 'A+', 90.00, 100.00, 'less than 90.00%'),
    ('coverage', 'A',  60.00, 100.00, 'less than 80%'),
    ('coverage', 'B',  40.01,  60.00, 'less than 60%'),
    ('coverage', 'C',   0.00,  40.00, 'less than 40%')
;

insert into Scores values
--    ('duplicated_lines_density', 'A+', 0.00, 3.00, 'greater than 3%'),
    ('duplicated_lines_density', 'A',   0.00,    6.00, 'greater than 6%'),
    ('duplicated_lines_density', 'B',   6.01,   10.00, 'greater than 10%'),
    ('duplicated_lines_density', 'C',  10.01,   20.00, 'greater than 20%'),
    ('duplicated_lines_density', 'D',  20.01,  100.00, 'over 20.00%')
;

insert into Scores values
--    ('blocker_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('blocker_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('blocker_violations', 'B',  1, 1, 'worse than B (at least 1 Blocker Violations)'),
    ('blocker_violations', 'C',  2, 2, 'worse than C (at least 2 Blocker Violations)'),
    ('blocker_violations', 'D',  3, 999999, 'over 2 Blocker Violations')
;

insert into Scores values
--    ('critical_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('critical_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('critical_violations', 'B',  1, 1, 'worse than B (at least 1 Critical Violations)'),
    ('critical_violations', 'C',  2, 2, 'worse than C (at least 2 Critical Violations)'),
    ('critical_violations', 'D',  3, 999999, 'over 2 Blocker Violations')
;

insert into Scores values
--    ('major_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('major_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('major_violations', 'B',  1, 1, 'worse than B (at least 1 Major Violations)'),
    ('major_violations', 'C',  2, 2, 'worse than C (at least 2 Major Violations)'),
    ('major_violations', 'D',  3, 999999, 'over 2 Blocker Violations')
;

--Cyclomatic complexity
insert into Scores values
--    ('complexity', 'A+', 0,  10, 'greater than 10 (can be considered simple and testable)'),
    ('complexity', 'A',  0, 12, 'greater than 12 (can be considered simple and testable)'),
    ('complexity', 'B',  13, 15, 'greater than 15 (median complexity and hard to test)'),
    ('complexity', 'C',  16, 20, 'greater than 20 (high complexity and untestable)'),
    ('complexity', 'D',  21, 999999, 'over 20 (very high complexity and very untestable)')
;

--Cognitive complexity	
insert into Scores values
--    ('cognitive_complexity', 'A+', 0,  13, 'greater than 13 (very easy to understand)'),
    ('cognitive_complexity', 'A',  0, 15, 'greater than 15 (easy to understand)'),
    ('cognitive_complexity', 'B',  16, 17, 'greater than 17 (difficult to understand)'),
    ('cognitive_complexity', 'C',  18, 20, 'greater than 20 (very difficult to understand)'),
    ('cognitive_complexity', 'D',  21, 999999, 'over 20 (very-very difficult to understand)')
;



