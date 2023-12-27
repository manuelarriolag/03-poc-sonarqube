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


metric,value,componentKey,bestValue
drop table if exists metrics;
create table metrics (
    metric VARCHAR(100),
    value VARCHAR(500),
    componentKey VARCHAR(100),
    bestValue boolean
); 
