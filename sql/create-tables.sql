CREATE DATABASE sonarqube
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LOCALE_PROVIDER = 'libc'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
    
    
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


drop table if exists measures;
create table measures (
    processDate timestamptz,
    componentKey VARCHAR(100),
    metric VARCHAR(100),
    value VARCHAR(1000),
    bestValue boolean
); 



## copy public.measures (metric, value, componentkey, bestvalue) 
## FROM '<STORAGE_DIR>/measures.gd-aml-configuration.csv' DELIMITER ',' CSV HEADER ENCODING 'UTF8' QUOTE '"' ESCAPE '''';


select * from measures
where metric = 'quality_gate_details'

