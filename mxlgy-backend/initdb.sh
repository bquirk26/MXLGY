#!/bin/sh

createdb mxlgy
psql -d mxlgy -f schema.sql
node populatedb.js
