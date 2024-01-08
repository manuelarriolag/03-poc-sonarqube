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

