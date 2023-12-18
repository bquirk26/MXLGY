#!/bin/sh
(trap 'kill 0' SIGINT; cd mxlgy-backend && npm run devstart  & cd ../mxlgy-web && npm run dev)
