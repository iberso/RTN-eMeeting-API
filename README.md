# Headers

## Request Headers
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Responses:
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "token valid"
}
```

![Forbidden](https://badgen.net/badge/Forbidden/403/red)
```json
{
    "status": "error",
    "message": "user are not logged in"
}
```
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "token expired"
}
```
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "invalid token"
}
```

# User

## Request: get current login user
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/user**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Responses:
#### Request: get current login user
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": {
        "nik": 123450,
        "email_address": "loremipsum@example.com",
        "device_token": null
    }
}
```

#### Request : get current login user (user not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```

## Request: User account registration
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user**</span>

```json
{
    "nik": 123456,
    "email_address": "loremipsum@example.com"
}
```

### Responses:
#### Request : User account registration
![Created](https://badgen.net/badge/Created/201/green)
```json
{
    "status": "success",
    "message": "Account created successfully!",
    "data": {
        "nik": 123456,
        "email_address": "loremipsum@example.com"
    }
}
```
*) default user password will be send into registered `email_address`

#### Request : User account registration (account already registered)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)
```json
{
    "status": "error",
    "message": "User already exist"
}
```
#### Request: User account registration (one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : email_address
{
    "status": "error",
    "message": "email_address is not present in body"
}
```

## Request: get all users
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/users**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Responses:
#### Request: get all users
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
        {
            "nik": 123450,
            "email_address": "loremipsum@example.com",
            "device_token": null
        },
        ...
    ]
}
```

#### Request : get all users (user not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "Data user is empty"
}
```

## Request: User login
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user/login**</span>

```json
{
    "nik": "123456",
    "password": "examplepassword"
}
```
### Responses:
#### Request: user login
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "Successfully logged in",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NjE3OTQ1NTYsImRhdGEiOnsibmlrIjoxMjM0NTAsImVtYWlsX2FkZHJlc3MiOiJjMTQxOTAxODlAam9obi5wZXRyYS5hYy5pZCIsImRldmljZV90b2tlbiI6bnVsbH0sImlhdCI6MTY2MTE4OTc1Nn0.i8c8ufwa59FD1lyEF_YC6x0AtDZSOCb_ijZgUMIBdhw"
}
```
#### Request: user login (one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : nik
{
    "status": "error",
    "message": "nik is not present in body"
}
```
#### Request : user login (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```
#### Request : user login (wrong password)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "Unauthorized",
    "message": "Invalid Credentials (Wrong Password)"
}
```

## Request: User logout
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user/logout**</span>

### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

*) just send empty body 

### Responses:
#### Request: User logout
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "User logged out successfully"
}
```
#### Request : User logout (invalid)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "Unauthorized",
    "message": "token invalid"
}
```

## Request: Edit user data
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user**</span>

### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Body :
```json
{
    "email_address": "examplelorem@example.com",
    "new_password" : "passwordexample"
}
```

### Responses:
#### Request: Edit user data
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "Account updated successfully",
    "data": {
        "nik": 123456,
        "email_address": "examplelorem@example.com"
    }
}
```
#### Request : Edit user data (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```
#### Request : Edit user data (one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : nik
{
    "status": "error",
    "message": "nik is not present in body"
}
```

## Request: request change password
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user/request-change-password**</span>
```json
{
    "nik":123450
}
```

### Responses:
#### Request: request change password
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "Email sent successfully, passsword reset link sent to your email account"
}
```

#### Request : request change password (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```
#### Request : request change password (one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : nik
{
    "status": "error",
    "message": "nik is not present in body"
}
```

## Request: reset password
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user/reset-password/`<string:token>`**</span>

```json
{
    "new_password" : "examplepassword"
}
```
### Responses:
#### Request: reset password
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "Password updated successfully"
}
```
#### Request : reset password (one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : new_password
{
    "status": "error",
    "message": "new_password is not present"
}
```

#### Request : reset password (invalid new_password)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "new password cannot be the same as old password"
}
```
#### Request : reset password (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```
#### Request : reset password (invalid)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "Unauthorized",
    "message": "invalid token"
}
```

#### Request : reset password (invalid)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "Unauthorized",
    "message": "token expired"
}
```


# Meeting

## Request: Get all meeting by user id
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/user/`<int:id_user>`**?date=YYYY-MM-DD</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Responses:
#### Request: Get all meeting by user id
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
        {
            "id": "10f42c02-3719-41c3-bf26-981543abee7e",
            "topic": "Lorem Ipsum",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu porttitor eros. Pellentesque at imperdiet augue. Curabitur diam est, convallis vel quam tempor, feugiat sagittis velit.",
            "hasil_meeting": null,
            "time_start": "09:00",
            "time_end": "11:00",
            "date": "2022-08-19",
            "id_room": 1,
            "meeting_link": "meet.google.com/xxx-xxxx-xxx",
            "type": "Hybird",
            "notification_type": "Email",
            "participants": 7
        },
        ...
    ]
}
```

#### Request: Get all meeting by user id (with query params date filter)
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
        {
            "id": "10f42c02-3719-41c3-bf26-981543abee7e",
            "topic": "Lorem Ipsum",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu porttitor eros. Pellentesque at imperdiet augue. Curabitur diam est, convallis vel quam tempor, feugiat sagittis velit.",
            "hasil_meeting": null,
            "time_start": "09:00",
            "time_end": "11:00",
            "date": "2022-08-20",
            "id_room": 1,
            "meeting_link": "meet.google.com/xxx-xxxx-xxx",
            "type": "Hybird",
            "notification_type": "Email",
            "participants": 7
        },
        ...
    ]
}
```

#### Request: Get all meeting by user id (Meeting Not Found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "meeting not found"
}
```

#### Request: Get all meeting by user id (User Not Found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```

## Request: Get meeting by meeting id
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/`<string:id_meeting>`**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Responses:
#### Request: Get meeting by meeting id
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": {
        "id": "10f42c02-3719-41c3-bf26-981543abee7e",
        "topic": "Lorem Ipsum",
        "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu porttitor eros. Pellentesque at imperdiet augue. Curabitur diam est, convallis vel quam tempor, feugiat sagittis velit.",
        "hasil_meeting": null,
        "time_start": "09:00",
        "time_end": "11:00",
        "date": "2022-08-19",
        "room": {
            "id": 1,
            "room_name": "Gunung Bromo"
        },
        "meeting_link": "meet.google.com/xxx-xxxx-xxx",
        "type": "Hybird",
        "notification_type": "Email",
        "participants": [
            {
                "id_participant": 123450,
                "participant_type": "Host",
                "approve_notulensi": "false",
                "attendance": "false"
            },
            {
                "id_participant": 123451,
                "participant_type": "Notulis",
                "approve_notulensi": "false",
                "attendance": "false"
            },
            {
                "id_participant": 123455,
                "participant_type": "Participant",
                "approve_notulensi": "false",
                "attendance": "false"
            },
            {
                "id_participant": 123456,
                "participant_type": "Participant",
                "approve_notulensi": "false",
                "attendance": "false"
            },
            {
                "id_participant": 123452,
                "participant_type": "Participant",
                "approve_notulensi": "false",
                "attendance": "false"
            },
            {
                "id_participant": 123453,
                "participant_type": "Participant",
                "approve_notulensi": "false",
                "attendance": "false"
            },
            {
                "id_participant": 123454,
                "participant_type": "Participant",
                "approve_notulensi": "false",
                "attendance": "false"
            }
        ]
    }
}
```

#### Request: Get meeting by meeting id (Meeting Not Found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "meeting not found"
}
```
## Request: Get users for meeting
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/users**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Body :

```json
{
    "nik_host": 123450,
    "date": "2022-08-08",
    "time_start": "09:00",
    "time_end": "11:00"
}
```

### Responses:
#### Request: Get users for meeting
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
        {
            "nik": 123450,
            "email_address": "loremipsum123450@gmail.com",
            "is_busy": "true"
        },
        ...
    ]
}
```

#### Request: Get users for meeting (nik_host not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
}
```

#### Request: Get users for meeting (if one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : nik_host
{
    "status": "error",
    "message": "nik_host is not present in body"
}
```
#### Request: Get users for meeting (time is not HH:mm format)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : time_start
{
    "status": "error",
    "message": "time_start is not in HH:mm format"
}
```
*) `time_start` and `time_end` must be in HH:mm format

## Request: add meeting
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/meeting**</span>

```json
{
    "topic": "Pertemuan Kantor Bulanan",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu porttitor eros. Pellentesque at imperdiet augue. Curabitur diam est, convallis vel quam tempor, feugiat sagittis velit.",
    "time_start": "09:00",
    "time_end": "11:00",
    "date": "2022-08-22",
    "id_room": 1,
    "meeting_link":"meet.google.com/xxx-xxxx-xxx",
    "type": "Hybird",
    "notification_type": "Email",
    "participants":[
        {
            "nik": 123450,
            "type": "Host"
        },
        {
            "nik": 123451,
            "type": "Notulis"
        },
        {
            "nik": 123455,
            "type": "Participant"
        },
        {
            "nik": 123456,
            "type": "Participant"
        }
        
    ]
}
```
### Responses:
#### Request: add meeting
![Created](https://badgen.net/badge/Created/201/green)
```json
{
    "status": "success",
    "message": "meeting created successfully"
}
```
#### Request: add meeting (one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : topic
{
    "status": "error",
    "message": "topic is not present in body"
}
```
#### Request: add meeting (time is not HH:mm format)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "time_start is not in HH:mm format"
}
```
*) `time_start` and `time_end` must be in HH:mm format

#### Request: add meeting (meeting_type is not valid)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "meeting_type is not valid, meeting_type must be in ['Online','Onsite','Hybird']"
}
```
*) `meeting_type` must be in `['Online','Onsite','Hybird']`

#### Request: add meeting (notification_type is not valid)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "notification_type is not valid, notification_type must be in ['email', 'Push Notification']"
}
```
*) `notification_type` must be in `['Email','Push Notification']`

#### Request: add meeting (participants is not present in body)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "participants is not present in body"
}
```

# Room

## Request: add room
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/room**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Body :
```json
{
    "room_name": "Gunung Salak"
}
```
### Responses:
#### Request: add room
![Created](https://badgen.net/badge/Created/201/green)
```json
{
    "status": "success",
    "message": "room created successfully"
}
```
#### Request: add room (room_name is not present in body)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "room_name is not present in body"
}
```

## Request: get room by room id
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/room/`<int:id_room>`**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses:
#### Request: get room by room id
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": {
        "id": 1,
        "room_name": "Gunung Bromo"
    }
}
```
#### Request: get room by room id (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)

```json
{
    "status": "error",
    "message": "room not found"
}
```
## Request: edit room by room id
![PUT](https://badgen.net/badge/Method/PUT/blue)<span style="margin-left:12px; font-size:12pt;">**/api/room/`<int:id_room>`**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Body :
```json
{
    "room_name": "Gunung Baruan"
}
```
### Responses:
#### Request: edit room by room id
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "room updated successfully"
}
```
#### Request: edit room by room id (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)

```json
{
    "status": "error",
    "message": "room not found"
}
```
## Request: Get rooms for meeting
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/rooms**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Body :
```json
{
    "date": "2022-08-08",
    "time_start": "09:00:00",
    "time_end": "15:00:00"
}
```

### Responses:
#### Request: Get rooms for meeting
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
        {
            "id": 1,
            "room_name": "Gunung Bromo",
            "is_avaliable": "true"
        },
        ...
    ]
}
```

#### Request: Get rooms for meeting (if one of the bodies is not present)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : date
{
    "status": "error",
    "message": "date is not present in body"
}
```
#### Request: Get rooms for meeting  (time is not HH:mm format)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
// example : time_start
{
    "status": "error",
    "message": "time_start is not in HH:mm format"
}
```
*) `time_start` and `time_end` must be in HH:mm format