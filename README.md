# CSV TO JSON
This app has converting a csv file to json format

## Example:
- data.csv
 ```
  name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender
  Rohit,Prasad,35,A-563 Rakshak Society,New Pune Road,Pune,Maharashtra,male
  Sarah,Smith,28,123 Main Street,Apt 4B,New York,NY,female
  Michael,Johnson,45,456 Oak Ave,Santa Monica,CA,male
  Emily,Davis,32,789 Elm St,Apt 3C,Chicago,IL,female
  Daniel,Williams,50,101 Park Plaza,Suite 120,Dallas,TX,male
  James,Brown,22,21 Jasmine Lane,Los Angeles,CA,male
  Jessica,Thomas,30,32 Spruce Street,Apt 2D,Boston,MA,female
  Robert,Anderson,42,567 Pine Drive,Denver,CO,male
  Maria,Garcia,25,890 Maple Lane,Apt 1E,Seattle,WA,female
  David,Martinez,38,111 Cedar Rd,Apt 3F,Philadelphia,PA,male
```

- output.json
```    [
  {
    "name": {
      "firstName": "Rohit",
      "lastName": "Prasad"
    },
    "age": 35,
    "address": {
      "line1": "A-563 Rakshak Society",
      "line2": "New Pune Road",
      "city": "Pune",
      "state": "Maharashtra"
    },
    "gender": "male"
  },
  {
    "name": {
      "firstName": "Sarah",
      "lastName": "Smith"
    },
    "age": 28,
    "address": {
      "line1": "123 Main Street",
      "line2": "Apt 4B",
      "city": "New York",
      "state": "NY"
    },
    "gender": "female"
  },
  {
    "name": {
      "firstName": "Michael",
      "lastName": "Johnson"
    },
    "age": 45,
    "address": {
      "line1": "456 Oak Ave",
      "line2": "Santa Monica",
      "city": "CA",
      "state": "male"
    }
  },
  {
    "name": {
      "firstName": "Emily",
      "lastName": "Davis"
    },
    "age": 32,
    "address": {
      "line1": "789 Elm St",
      "line2": "Apt 3C",
      "city": "Chicago",
      "state": "IL"
    },
    "gender": "female"
  },
  {
    "name": {
      "firstName": "Daniel",
      "lastName": "Williams"
    },
    "age": 50,
    "address": {
      "line1": "101 Park Plaza",
      "line2": "Suite 120",
      "city": "Dallas",
      "state": "TX"
    },
    "gender": "male"
  },
  {
    "name": {
      "firstName": "James",
      "lastName": "Brown"
    },
    "age": 22,
    "address": {
      "line1": "21 Jasmine Lane",
      "line2": "Los Angeles",
      "city": "CA",
      "state": "male"
    }
  },
  {
    "name": {
      "firstName": "Jessica",
      "lastName": "Thomas"
    },
    "age": 30,
    "address": {
      "line1": "32 Spruce Street",
      "line2": "Apt 2D",
      "city": "Boston",
      "state": "MA"
    },
    "gender": "female"
  },
  {
    "name": {
      "firstName": "Robert",
      "lastName": "Anderson"
    },
    "age": 42,
    "address": {
      "line1": "567 Pine Drive",
      "line2": "Denver",
      "city": "CO",
      "state": "male"
    }
  },
  {
    "name": {
      "firstName": "Maria",
      "lastName": "Garcia"
    },
    "age": 25,
    "address": {
      "line1": "890 Maple Lane",
      "line2": "Apt 1E",
      "city": "Seattle",
      "state": "WA"
    },
    "gender": "female"
  },
  {
    "name": {
      "firstName": "David",
      "lastName": "Martinez"
    },
    "age": 38,
    "address": {
      "line1": "111 Cedar Rd",
      "line2": "Apt 3F",
      "city": "Philadelphia",
      "state": "PA"
    },
    "gender": "male"
  }
]
```
