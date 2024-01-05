CREATE DATABASE sonarqube
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
    
    
drop table if exists squads;
create table squads (
    project VARCHAR(100),
    squad VARCHAR(100),
    notes VARCHAR(255)
); 

drop table if exists metrics;
create table metrics (
    id VARCHAR(50),
    key VARCHAR(100),
    type VARCHAR(50),
    name VARCHAR(255),
    description VARCHAR(255),
    domain  VARCHAR(50),
    direction integer,
    qualitative boolean,
    hidden boolean,
    decimalScale integer,
    total integer,
    p integer,
    ps integer
); 

drop table if exists components;
create table components (
    key VARCHAR(100),
    name VARCHAR(255),
    qualifier VARCHAR(10),
    project VARCHAR(100)
); 

drop table if exists conditions;
create table conditions (
    processDate timestamptz,
    componentKey VARCHAR(100),
    status VARCHAR(10),
    metricKey VARCHAR(100),
    comparator VARCHAR(10),
    errorThreshold decimal(10,2),
    actualValue decimal(10,2)
); 

drop table if exists measures;
create table measures (
    processDate timestamptz,
    componentKey VARCHAR(100),
    metric VARCHAR(100),
    value VARCHAR(1000),
    bestValue boolean
); 

drop table if exists statuses;
create table statuses (
    processDate timestamptz,
    componentKey VARCHAR(100),
    status VARCHAR(10),
    ignoredConditions boolean,
    caycStatus VARCHAR(20)
); 



-- copy public.measures (metric, value, componentkey, bestvalue) 
-- FROM '<STORAGE_DIR>/measures.gd-aml-configuration.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8' QUOTE '"' ESCAPE '''';


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

insert into Scores values
    ('security_review_rating', 'A', 0.8, 1,    'Security Hotspots Reviewed are >= 80%'),
    ('security_review_rating', 'B', 0.7, 1, 'Security Hotspots Reviewed are >= 70% and <80%'),
    ('security_review_rating', 'C', 0.5, 0.69, 'Security Hotspots Reviewed are >= 50% and <70%'),
    ('security_review_rating', 'D', 0.3, 0.49, 'Security Hotspots Reviewed are >= 30% and <50%'),
    ('security_review_rating', 'E', 0-0, 29,   'Security Hotspots Reviewed are < 30%')
;

insert into Scores values
    ('sqale_rating', 'A', 0,    0.05, 'Technical debt ratio is less than 5.0%'),
    ('sqale_rating', 'B', 0.00, 0.1,  'Technical debt ratio between 6 to 10%'),
    ('sqale_rating', 'C', 0.11, 0.20, 'Technical debt ratio between 11 to 20%'),
    ('sqale_rating', 'D', 0.21, 0.5,  'Technical debt ratio between 21 to 50%'),
    ('sqale_rating', 'E', 0.51, 1,    'Technical debt ratio over 50%')
;

insert into Scores values
--    ('coverage', 'A+', 0.9, 1.00, 'less than 90.00%'),
    ('coverage', 'A',  0.6, 1, 'less than 80.00%'),
    ('coverage', 'B',  0.4, 0.59, 'less than 60.00%'),
    ('coverage', 'C',  0.0, 0.39, 'less than 40.00%')
;

insert into Scores values
--    ('duplicated_lines_density', 'A+', 0.000, 0.030, 'greater than 3%'),
    ('duplicated_lines_density', 'A',  0.000, 0.060, 'greater than 6%'),
    ('duplicated_lines_density', 'B',  0.061, 0.100, 'greater than 10%'),
    ('duplicated_lines_density', 'C',  0.101, 0.200, 'greater than 20%'),
    ('duplicated_lines_density', 'D',  0.201, 1.000, 'over 20.00%')
;

insert into Scores values
--    ('blocker_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('blocker_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('blocker_violations', 'B',  1, 1, 'worse than B (at least 1 Blocker Violations)'),
    ('blocker_violations', 'C',  2, 2, 'worse than C (at least 2 Blocker Violations)'),
    ('blocker_violations', 'D',  3, 999, 'over 2 Blocker Violations')
;

insert into Scores values
--    ('critical_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('critical_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('critical_violations', 'B',  1, 1, 'worse than B (at least 1 Critical Violations)'),
    ('critical_violations', 'C',  2, 2, 'worse than C (at least 2 Critical Violations)'),
    ('critical_violations', 'D',  3, 999, 'over 2 Blocker Violations')
;

insert into Scores values
--    ('major_violations', 'A+', 0, 0, 'worse than A (No Violations)'),
    ('major_violations', 'A',  0, 0, 'worse than A (No Violations)'),
    ('major_violations', 'B',  1, 1, 'worse than B (at least 1 Major Violations)'),
    ('major_violations', 'C',  2, 2, 'worse than C (at least 2 Major Violations)'),
    ('major_violations', 'D',  3, 999, 'over 2 Blocker Violations')
;

--Cyclomatic complexity
insert into Scores values
--    ('complexity', 'A+', 0,  10, 'greater than 10 (can be considered simple and testable)'),
    ('complexity', 'A',  0, 12, 'greater than 12 (can be considered simple and testable)'),
    ('complexity', 'B',  13, 15, 'greater than 15 (median complexity and hard to test)'),
    ('complexity', 'C',  16, 20, 'greater than 20 (high complexity and untestable)'),
    ('complexity', 'D',  21, 999, 'over 20 (very high complexity and very untestable)')
;

--Cognitive complexity	
insert into Scores values
--    ('cognitive_complexity', 'A+', 0,  13, 'greater than 13 (very easy to understand)'),
    ('cognitive_complexity', 'A',  0, 15, 'greater than 15 (easy to understand)'),
    ('cognitive_complexity', 'B',  16, 17, 'greater than 17 (difficult to understand)'),
    ('cognitive_complexity', 'C',  18, 20, 'greater than 20 (very difficult to understand)'),
    ('cognitive_complexity', 'D',  21, 999, 'over 20 (very-very difficult to understand)')
;

select * from Scores;

select 
	    metrickey, score || ' ' || name
    from scores



