# hapi-employee

A simple CRUD web APIs application using hapi framework and CouchDB.

## Prerequisits

Node.js or io.js.

CouchDB instance.

Employee database has to be manually created, for example: ```curl -X PUT http://192.168.59.103:5984/employee```

## Build

``` npm install ```

## Testing

```
npm test
npm run test-cover
```

## Starting server

If Docker is not used:

Development: ``` npm start 192.168.59.103 ```

Production: ``` node . 192.168.59.103 ```

## License

ISC
