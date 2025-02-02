# test

+-------------------+
|     Frontend      |
+---------+---------+
          |
          | HTTP Requests
          |
+---------v----------+
|   Nginx (Load      |
|    Balancer)       |
+----+---------+-----+
     |         |
     |         |
+----v-----+ +--v------+
| Frontend | | Frontend|
|  API #1  | |  API #x |
+----+-----+ +---+-----+
     |           |
     |           |
+----v-----------v------+
|       Services        |
| +-----------+---------+
| | Auth      |    x    | <-----+  
| | Service   |         |       |
| +-----------+---------+       |
| | Product   |    x    |       |
| | Service   |         |       |
| +-----------+---------+       |
| | Collect...|    1    |       |
| | Service   |         |       |
| +-----------+---------+       |
| | Repository|    x    |       |
| | Service   |         |       |
| +-----------+---------+       |
+-----------------------+       |
                                |
            +-------------------v-----------------+
            |               Databases             |
            +-----------------+-------------------+
            |  Redis          |   PostgreSQL      |
            |  +---------+    |   +-----------+   |
            |  |  Auth   |    |   | Repository|   |
            |  | Service |    |   |  Service  |   |
            |  +---------+    |   +-----------+   |
            |  | Repo... |    |                   |
            |  |  Service|    |                   |
            |  +---------+    |                   |
            +-----------------+-------------------+

## Quick Start

Follow these steps:

1. Rename the environment file: run `mv example.env .env`
2. Run `npm install`
3. Run `npm run generate-proto`
4. Run `npm run test:coverage`
5. Run `docker compose up -d`
6. Run `npm run start:local`

