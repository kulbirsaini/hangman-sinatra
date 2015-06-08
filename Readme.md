## Hangman

[Sinatra](http://www.sinatrarb.com/) (backend) + [Angularjs](https://angularjs.org/) (frontend) implementation of [Hangman](http://en.wikipedia.org/wiki/Hangman_%28game%29) for fun.

Demo [yd9.net](http://www.yd9.net/)

## API Endpoints

#### `GET /games.json` => Get all games

###### Request

```bash
curl -H 'Content-Type: application/json' \
     -w '\nResponse Code: %{http_code}\n' \
     -X GET http://yd9.net/games.json
```

###### Response

```javascript
  [
    {
      "id":1,
      "tries_left":0,
      "guessed_chars":"jldgnykihf",
      "status":"fail",
      "word":"diyarbakir",
      "created_at":1433591284,
      "updated_at":1433591373
    },
    {
      "id":2,
      "tries_left":5,
      "guessed_chars":"eurnlkiab",
      "status":"success",
      "word":"unlikable",
      "created_at":1433591284,
      "updated_at":1433591373
    },
    {
      "id":6,
      "tries_left":4,
      "guessed_chars":"jpei",
      "status":"busy",
      "word":"...i.e..",
      "created_at":1433591284,
      "updated_at":1433591373
    },
    ...
  ]
  Response Code: 200
```

#### `POST /games.json` => Creates a new game with random word

###### Request

```bash
curl -H 'Content-Type: application/json' \
     -d '{}' \
     -w '\nResponse Code: %{http_code}\n' \
     -X POST http://yd9.net/games.json
```

###### Response

```javascript
  {
    "id":12,
    "tries_left":6,
    "guessed_chars":"",
    "status":"busy",
    "word":".........",
    "created_at":1433591989,
    "updated_at":1433591989
  }
  Response Code: 201
```

#### `GET /games/:id.json` => Get game details

###### Request

```bash
curl -H 'Content-Type: application/json' \
     -w '\nResponse Code: %{http_code}\n' \
     -X GET http://yd9.net/games/2.json
```

###### Response

```javascript
  {
    "id":2,
    "tries_left":5,
    "guessed_chars":"eurnlkiab",
    "status":"success",
    "word":"unlikable",
    "created_at":1433591989,
    "updated_at":1433591989
  }
  Response Code: 200
```

#### `POST /games/:id.json` => Make a guess

###### Request

```bash
curl -H 'Content-Type: application/json' \
     -d '{ "char": "e" }' \
     -w '\nResponse Code: %{http_code}\n' \
     -X POST http://yd9.net/games/10.json
```

###### Response

```javascript
  {
    "id":10,
    "tries_left":5,
    "guessed_chars":"he",
    "status":"busy",
    "word":"...e...ee.",
    "guess_status":"correct",
    "notice":"Correct guess",
    "created_at":1433591408,
    "updated_at":1433591408
  }
  Response Code: 200
```

## <a name="about_me"></a>About Me
[Kulbir Saini](http://saini.co.in/),
Senior Developer / Programmer,
Hyderabad, India

## Contact Me
Kulbir Saini - contact [AT] saini.co.in / [@_kulbir](https://twitter.com/_kulbir)

## <a name="license"></a>License
Copyright (c) 2015 Kulbir Saini

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
