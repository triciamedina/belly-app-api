# Belly REST API
Belly is a real-time bill splitting calculator for collaborating with others on complicated food bills.

## Live App
https://belly-app.now.sh/

## REST API

The REST API for [Belly](https://github.com/triciamedina/belly-app).
- [Login](#login)
- [Create a user](#create-user)
- [Fetch a user](#fetch-user)
- [Fetch all bills owned by a user](#fetch-bills-owned)
- [Fetch all bills shared with a user](#fetch-bills-shared)
- [Create a new bill for a user](#create-bill-owned)
- [Add a bill to a user's shared list](#create-bill-shared)
- [Fetch details for a bill owned by a user](#fetch-bill-owned)
- [Fetch details for a bill shared with a user](#fetch-bill-shared)
- [Update a bill owned by a user](#update-bill-owned)
- [Update a bill shared by a user](#update-bill-shared)
- [Create a new item for a bill](#create-item)
- [Fetch item by id](#fetch-item)
- [Update an item](#update-item)
- [Create a new splitter](#create-splitter)
- [Update a splitter](#update-splitter)
- [Add a splitter to an item](#add-item-splitter)
- [Update a splitter for an item](#update-item-splitter)
- [Add a bill view for a user](#add-view)
- [Getting Started](#getting-started)
- [Built With](#built-with)

## <a id="login"></a> Login

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

## <a id="create-user"></a> Create a user

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

## <a id="fetch-user"></a> Fetch a user

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

## <a id="fetch-bills-owned"></a> Fetch all bills owned by a user

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

## <a id="fetch-bills-shared"></a> Fetch all bills shared with a user

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

## <a id="create-bill-owned"></a> Create a new bill for a user

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

## <a id="create-bill-shared"></a> Add a bill to a user's shared list

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

## <a id="fetch-bill-owned"></a> Fetch details for a bill owned by a user

Requires user authentication.

### Request

`GET /api/bill/owned/:bill_id`

### Response

```
Status: 200 OK

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

## <a id="fetch-bill-shared"></a> Fetch details for a bill shared with a user

Requires user authentication.

### Request

`GET /api/bill/shared/:bill_id`

### Response

```
Status: 200 OK

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

## <a id="update-bill-owned"></a> Update a bill owned by a user

Requires user authentication.

### Request

`PATCH /api/bill/owned/:bill_id`

### Parameters

```
{
    "billName": "Shake Shack", 
    "billThumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0,
    "deleted": null
}
```

### Response

```
Status: 200 OK

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

## <a id="update-bill-shared"></a> Update a bill shared by a user

Requires user authentication.

### Request

`PATCH /api/bill/shared/:bill_id`

### Parameters

```
{
    "billName": "Shake Shack", 
    "billThumbnail": "🍔", 
    "discounts": 0, 
    "tax": 1.50, 
    "tip": 3,
    "fees": 0
}
```

### Response

```
Status: 200 OK

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

## <a id="create-item"></a> Create a new item for a bill

Requires user authentication.

### Request

`POST /api/item`

### Parameters

```
{
    "item_name": "Burger, 
    "bill_id": 1,
    "quantity": 3,
    "price": 12.95
}
```

### Response

```
Status: 201 Created

{
    "id": 3,
    "bill_id": 1,
    "item_name": "Burger,
    "quantity": 3,
    "price": 12.95
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="fetch-item"></a> Fetch item by id

Requires user authentication.

### Request

`GET /api/item/:item_id`

### Response

```
Status: 200 OK

{
    "id": 3,
    "bill_id": 1,
    "item_name": "Burger,
    "quantity": 3,
    "price": 12.95
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="update-item"></a> Update an item

Requires user authentication.

### Request

`PATCH /api/item/:item_id`

### Parameters

```
{
    "item_name": "Burger", 
    "quantity": 1, 
    "price": 3.99, 
    "deleted": null
}
```

### Response

```
Status: 200 OK

{
    "id": 3,
    "bill_id": 1,
    "item_name": "Burger",
    "quantity": 1,
    "price": 3.99
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="create-splitter"></a> Create a new splitter

Requires user authentication.

### Request

`POST /api/splitter`

### Parameters

```
{
    "nickname": "Sam", 
    "avatar": "#405cf7"
}
```

### Response

```
Status: 201 Created

{
    "id": 1,
    "nickname": "Sam", 
    "avatar": "#405cf7"
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="update-splitter"></a> Update a splitter

Requires user authentication.

### Request

`PATCH /api/splitter/:splitter_id`

### Parameters

```
{
    "nickname": "Sam", 
    "avatar": "#405cf7",
    "deleted": "2020-02-07T13:23:12.378Z"
}
```

### Response

```
Status: 200 OK

{
    "id": 1,
    "nickname": "Sam", 
    "avatar": "#405cf7"
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="add-item-splitter"></a> Add a splitter to an item

Requires user authentication.

### Request

`POST /api/splitter/:splitter_id/:item_id`

### Parameters

```
{
    "share_qty": 2
}
```

### Response

```
Status: 201 Created

{
    "splitter_id": 1,
    "item_id": 2,
    "share_qty": 2,
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="update-item-splitter"></a> Update a splitter for an item

Requires user authentication.

### Request

`PATCH /api/splitter/:splitter_id/:item_id`

### Parameters

```
{
    "share_qty": 2,
    "deleted": "2020-02-07T13:23:12.378Z"
}
```

### Response

```
Status: 200 OK

{
    "splitter_id": 1,
    "item_id": 2,
    "share_qty": 2,
    "created_at": "2020-02-07T13:23:12.378Z"
}
```

## <a id="add-view"></a> Add a bill view for a user

Requires user authentication.

### Request

`POST /api/view`

### Parameters

```
{
    "bill_id": 2
}
```

### Response

```
Status: 201 Created

{
    "id": 1,
    "bill_id": 2,
    "user_id": 1,
    "last_viewed": "2020-02-07T13:23:12.378Z"
}
```

## <a id="getting-started"></a> Getting Started

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

## <a id="built-with"></a> Built With
- [ws: a Node.js WebSocket library](https://github.com/websockets/ws)
- [Node](https://nodejs.org/en/docs/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Moment.js](https://momentjs.com/)
