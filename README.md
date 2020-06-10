# Roots REST API

The REST API for [Belly](https://github.com/triciamedina/belly-app).

## Login

Returns a JWT allowing the user to access routes, services, and resources that are permitted with that token.

### Request

`POST /api/auth/login`

### Parameters

```
{
    "username": "Sam",
    "password": "password1"
}
```

### Response

```
Status: 200 OK

{
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1ODEwMzY4NzMsInN1YiI6InRlc3RAdGVzdC5jb20ifQ.IHOl95oC2-MtDaEZH58_uN4a6Lu2oCWx-oTsEN1Uyok"
}
```

## Create a user

### Request

`POST /api/user`

### Parameters

```
{
    "username": "Sam",
    "password": "password1",
    "avatar": "#405cf7"
}
```

### Response

```
Status: 201 Created

{
    "id": 1,
    "username": "Sam",
    "avatar": "#405cf7",
    "created_at": "2020-02-07T08:46:15.501Z"
}
```

## Fetch a user

Requires user authentication. Lists public and private profile information when authenticated through JWT auth.

### Request

`GET /api/user`

### Response

```
Status: 200 OK

{
    "id": 1,
    "username": "Sam",
    "avatar": "#405cf7",
    "created_at": "2020-02-07T08:46:15.501Z"
}
```

## Fetch all bills owned by a user

Requires user authentication.

### Request

`GET /api/bill/owned`

### Response

```
Status: 200 OK

{ ownedByMe:
  {
    id: 1,
    owner: 1,
    bill_name: "test-bill-1",
    bill_thumbnail: "🌯",
    discounts: 1,
    tax: 1.50,
    tip: 1.25,
    fees: 0.50,
    created_at: "2020-01-01T23:28:56.782Z",
    last_viewed: "2020-01-01T23:28:56.782Z",
    items: [
      {
        id: 1,
        bill_id: 1,
        item_name: "item-1",
        quantity: 3,
        price: 3.50,
        created_at: "2020-01-01T23:28:56.782Z",
        split_list: [
          {
            id: 1,
            item_id: 1,
            nickname: "Sam",
            avatar: "#405cf7",
            share_qty: 1,
            created_at: "2020-01-01T23:28:56.782Z"
          },
          {
            id: 2,
            item_id: 1,
            nickname: "Frodo",
            avatar: "#ca03a3",
            share_qty: 2,
            created_at: "2020-01-01T23:28:56.782Z"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    owner: 1,
    bill_name: "test-bill-2",
    bill_thumbnail: "🐓",
    discounts: 5.00,
    tax: 4.50,
    tip: 10.25,
    fees: 0,
    created_at: "2020-01-02T23:28:56.782Z",
    last_viewed: "2020-01-02T23:28:56.782Z",
    items: []
  }
}
```

## Fetch all bills shared with a user

Requires user authentication.

### Request

`GET /api/bill/shared`

### Response

```
Status: 200 OK

{ sharedWithMe:
  {
    id: 3,
    owner: 3,
    bill_name: "test-bill-3",
    bill_thumbnail: "🍕",
    discounts: 11.57,
    tax: 4.80,
    tip: 10.00,
    fees: 0,
    created_at: "2020-01-01T23:28:56.782Z",
    last_viewed: "2020-01-01T23:28:56.782Z",
    items: [
      {
        id: 45,
        bill_id: 3,
        item_name: "item-45",
        quantity: 1,
        price: 7.50,
        created_at: "2020-01-01T23:28:56.782Z",
        split_list: []
      },
      {
        id: 46,
        bill_id: 3,
        item_name: "item-46",
        quantity: 2,
        price: 6,
        created_at: "2020-01-01T23:28:56.782Z",
        split_list: [
          {
            id: 1,
            item_id: 46,
            nickname: "Gandalf",
            avatar: "#405cf7",
            share_qty: 1,
            created_at: "2020-01-01T23:28:56.782Z"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    owner: 10,
    bill_name: "test-bill-4",
    bill_thumbnail: "🍱",
    discounts: 0,
    tax: 0,
    tip: 3.00,
    fees: 0,
    created_at: "2020-01-02T23:28:56.782Z",
    last_viewed: "2020-01-01T23:28:56.782Z",
    items: []
  }
}
```

## Create a new bill for a user

Requires user authentication.

### Request

`POST /api/bill/owned`

### Parameters

```
{
    "owner": 1, 
    "bill_name": "Shake Shack", 
    "bill_thumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0
}
```

### Response

```
Status: 201 Created

{
    "id": 11,
    "owner": 1,
    "created_at": "2020-02-07T13:23:12.378Z",
    "bill_name": "Shake Shack", 
    "bill_thumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0
}
```

## Add a bill to a user's shared list

Requires user authentication.

### Request

`POST /api/bill/shared`

### Parameters

```
{
    "bill_id": 11
}
```

### Response

```
Status: 201 Created

{
    "id": 11,
    "ownder": 1,
    "created_at": "2020-02-07T13:23:12.378Z",
    "bill_name": "Shake Shack", 
    "bill_thumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0
}
```

## Fetch details for a bill owned by a user

Requires user authentication.

### Request

`GET /api/bill/owned/:bill_id`

### Response

```
Status: 200 OK

{
    "id": 11,
    "ownder": 1,
    "created_at": "2020-02-07T13:23:12.378Z",
    "bill_name": "Shake Shack", 
    "bill_thumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0
}
```

## Fetch details for a bill shared with a user

Requires user authentication.

### Request

`GET /api/bill/shared/:bill_id`

### Response

```
Status: 200 OK

{
    "id": 11,
    "ownder": 1,
    "created_at": "2020-02-07T13:23:12.378Z",
    "bill_name": "Shake Shack", 
    "bill_thumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0
}
```

## Getting Started

### Setting up

Install dependencies

```
npm install
```

Create development and test databases

```
createdb belly
createdb belly-test
```

Create database user

```
createduser belly
```

Grant priveleges to new user in `psql`

```
GRANT ALL PRIVELEGES ON DATABASE belly TO belly
GRANT ALL PRIVELEGES ON DATABASE "belly-test" TO belly
```

Bootstrap development database

```
npm run migrate 
```

Bootstrap test database

```
npm run migrate:test
```

### Sample Data

To seed the database for development

```
psql -U belly -d belly -a -f seeds/seed.belly_user.sql
```

### Testing

Run tests with Mocha, Chai, and SuperTest.

```
npm run test
```

## Built With
- [ws: a Node.js WebSocket library](https://github.com/websockets/ws)
- [Node](https://nodejs.org/en/docs/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Moment.js](https://momentjs.com/)
