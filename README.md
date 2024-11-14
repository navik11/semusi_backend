# Installation
## Use Docker for testing
```
git clone https://github.com/navik11/semusi_backend
docker-compose up --build
```
Server would be ready at http://localhost:3000
## Or Install manually
```bash
git clone https://---
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
```
### Start the server
```
npm run start
```
This will start the server at [localhost:3000](http://localhost:3000) by default.

# API Endpoints
```
Server url: `http://localhost:3000/api/v1`
```
##  [Download API collection]()
## PublicAPI Route `/publicapi`
### `/getQuotes`
Method: GET  
URL: http://localhost:3000/api/v1/publicapi/getQuotes  
Funtion: To get some quotes from a free public API, [DummyJSON](https://dummyjson.com/). Data will be saved as `./public/quotes.csv` and also get added to the PostgreSQL database.  
     
Response object structure:
```{
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
```
{
    "statusCode": 200,
    "data": {},
    "messege": "Quotes deleted successfully",
    "success": true
}
``` 