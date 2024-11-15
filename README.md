# Installation
## Use Docker for testing
```bash
git clone https://github.com/navik11/semusi_backend
cd semusi_backend
docker-compose up --build
```
Server would be ready at http://localhost:3000  
In case docker didn't works, Please use manual installation.
## Or Install manually
```bash
git clonehttps://github.com/navik11/semusi_backend
cd semusi_backend
npm i
```
### Configure .env file
Rename `.env.sample` to `.env` and  do the neccessary changes
```
PORT=3000
CORS_ORIGIN = http://localhost:3000

# DBConnLink=postgresql://sachida...

DB_USER=sachida
DB_PASSWORD=2134
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=oosc_database

SQL_USER=sachida
SQL_HOST=localhost
SQL_PASSWORD=012345678
SQL_DB=semusi_sql
```
### Start the server
```bash
npm run start
```
This will start the server at [localhost:3000](http://localhost:3000) by default.

# API Endpoints
```
Server url: `http://localhost:3000/api/v1`
```
##  [Download API collection](https://res.cloudinary.com/dnoszukak/raw/upload/v1731656273/xkaqfcgo2ktjkihhfuhi.json)
## PublicAPI Route `/publicapi`
### `/getQuotes`
Method: GET  
URL: http://localhost:3000/api/v1/publicapi/getQuotes  
Funtion: To get some quotes from a free public API, [DummyJSON](https://dummyjson.com/). Data will be saved as `./public/quotes.csv` and also get added to the PostgreSQL database.  
     
Response object structure:
```json
{
    "statusCode": 200,
    "data": {
        "quotes": {
            "quotes": [
                {
                    "id": 1,
                    "quote": "Quote",
                    "author": "Author"
                },
                { .. },
                { .. },
                .
                .
            ]
        }
    }
    "messege": "Quotes fetched successfully",
    "success": true
}
``` 

### `/dropAllQuotes`
Method: DELETE  
URL: http://localhost:3000/api/v1/publicapi/dropAllQuotes  
Funtion: To remove all quotes from the database  
     
Response object structure:
```json
{
    "statusCode": 200,
    "data": {},
    "messege": "Quotes deleted successfully",
    "success": true
}
``` 

## User Route `/user`
### `/messages`
Method: GET  
URL: http://localhost:3000/api/v1/user/messages?lat=12.1long=12.5&page=1  
Funtion: To get the messages posted near you (<60 KMs)  
Caution: Param **lat** and **long** are required, additionaly you can use **page** to retreive data in chunks.
     
Response object structure:
```json
{
    "statusCode": 200,
    "data": [
        {
            "id": 4,
            "message": "This is a dummy message",
            "latitude": "12.500000",
            "longitude": "12.400000",
            "createdAt": "an hour ago",
            "distance": "45.79 km"
        },
        { .. },
        { .. },
        . 
        .
    ],
    "messege": "Messages retrieved successfully",
    "success": true
}
``` 

### `/message`
Method: POST  
URL: http://localhost:3000/api/v1/user/message  
Funtion: To post a message  
Request payload structure:
```json
{
    "message":"This is a dummy message",
    "longitude":12.4,
    "latitude":12.5
}
```
     
Response object structure:
```json
{
    "statusCode": 201,
    "data": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 5,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    },
    "messege": "Message posted successfully",
    "success": true
}
``` 

## Direct Database Queries `/pg & /sql`
Ypu can visualize database directly through API calls.
### `/pg`
Method: POST  
URL: http://localhost:3000/api/v1/sql  
Funtion: To query PostgreSQL direclty  
Request payload structure:
```json
{
    "query":"SELECT * FROM quotes"
}
```
     
Response object structure:
```json
{
    "statusCode": 200,
    "data": [
        {
            "id": 1,
            "quote": "Your heart ...",
            "author": "Rumi"
        },
        { .. },
        .
        .
    ],
    "messege": "Query executed successfully",
    "success": true
}
``` 
Ypu can visualize database directly through API calls.
### `/sql`
Method: POST  
URL: http://localhost:3000/api/v1/sql  
Funtion: To query MySQL direclty  
Request payload structure:
```json
{
    "query":"SELECT * FROM messages"
}
```
     
Response object structure:
```json
{
    "statusCode": 200,
    "data": [
        {
            "id": 1,
            "message": "This is a dummy message",
            "longitude": "12.400000",
            "latitude": "12.500000",
            "createdAt": "2024-11-15T05:11:04.000Z"
        },
        { .. },
        .
        .
    ],
    "messege": "Query executed successfully",
    "success": true
}
``` 

In case of any issue, please contact [Sachida(me)](mailto:navik09.me@gmail.com).