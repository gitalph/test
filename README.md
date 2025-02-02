# test

```
+-------------------+
|     Frontend      | on prod only
+---------+---------+
          |
          | HTTP Requests
          |
+---------v----------+
|   Nginx (Load      | on prod only
|    Balancer)       |
+----+---------+-----+
     |         |
     |         |
+----v-----+ +--v------+
| Frontend | | Frontend| on prod only
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
```

## Quick Start

Follow these steps:

1. Run `sudo apt update`
2. Run `sudo apt install -y protobuf-compiler`

3. Rename the environment file: run `mv example.env .env`

4. Run `npm install`
5. Run `npm run generate-proto`
6. Run `npm run test:coverage`
7. Run `docker compose up -d`
8. Run `npm run start:local`

9. Open and check `http://localhost:3000/docs`
