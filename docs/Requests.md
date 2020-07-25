# Waifu Server Request API

### Server Requests

Waifu server operates with an HTTP server bound to localhost on listening for requests on port 8000. Requests must maintain the following schema as defined below:

```
{
    "opcode": int,
    "userid": int,
    "data": {json} or null,
    "auth": [optional] int
}
```

__opcode:__

Opcode acts as a means of telling the server what to do with the request data. Below is a key of opcode functions.

```
    0 = no-op
    1 = addscore
    2 = remove score
    3 = leaderboard
    4 = session
    5 = unimplemented
    6 = register
    7 = deregister
```

__userid:__

Userid corresponds to the discord userid of the user sending this request.

__auth:__

Auth functions as an optional override to the backend permissions table. Auth values can exist in 3 states:

```
    0 = Not Registered
    1 = Registered
    2 = Administrator
```

And the opcode table is bound to the following permissions:

```
    0 = 0
    1 = 1 // Must have an auth override of 2 for manual submissions
    2 = 2
    3 = 0
    4 = 1 // Must have an auth override of 2 for manual manipulation
    5 = 0 // Currently no-op
    6 = 2
    7 = 2
```

### Server Responses

Server responses will be in JSON format and contain the following information

```
{
    "code": 0 or [error code],
    "data": null or [request data],
    "notif": null or [Array of notifications]
}
```

__code:__

Response codes indicate the status of the server transaction, their meanings are defined as such:

```
    0 = Success
    1 = Malformed Request
    2 = Invalid Request
    3 = Unauthorized Request
    4 = Invalid score
    // This list is still being made, subject to frequent additions
```

__notif:__

Notifications, if present on the server, will be stored in an array along with the request data. Notifications are expected to be PMd to Administrators on the client side. The current list of Administrators to receive notifications:

```
    abraker
    Lights
```

### Request Specfic Data

__gamecodes:__

Gamecodes are an integer that must be resolved from the name of the game being referred to before being sent to the server. Game codes are defined as such:

```
    0 = NA / All
    1 = Etterna
    2 = osu!mania
    3 = Flash Flash Revolution
    4 = Quaver
    5 = Robeats
```

