-- Runs only when the postgres-data volume is empty (first container start).
-- Creates a separate database for the automated test suite.
CREATE DATABASE autopulse_test;