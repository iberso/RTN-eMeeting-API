# REST API DOCUMENTATION

### Request Headers

```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses
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

# User Endpoint

## Request: get current login user
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/user**</span>

### Headers:
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
        "nik": 123456,
        "email_address": "example@example.example",
        "device_token": "<String: device token from firebase>",
        "role": {
            "id": 0,
            "role_name": "Super Admin"
        }
    }
}
```

#### Request: get current login user (user not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User not found"
}
```

## Request : get all users
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/users**</span>

### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses:
#### Request:  get all users
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
                {
                    "nik": 123450,
                    "email_address": "example@example.example",
                    "profile_picture_path": "assets/images/users_profile/1666332535986.png",
                    "device_token": "<String: device token from firebase>",
                    "role": {
                        "id": 0,
                        "role_name": "Super Admin"
                    }
                },
                ...
            ]
}
```

#### Request:  get all users (users data empty)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "users is empty"
}
```

## Request: user account registration
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user**</span>

```json
{
    "nik": 123456,
    "email_address": "loremipsum@example.com"
}
```

### Responses:
#### Request: user account registration
![Created](https://badgen.net/badge/Created/201/green)
```json
{
    "status": "success",
    "message": "account created successfully",
}
```
*) default user password will be send into registered `email_address`

#### Request: user account registration (account already registered)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)
```json
{
    "status": "error",
    "message": "user already exist"
}
```

#### Request: user account registration (email address taken by another user)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)
```json
{
    "status": "error",
    "message": "email address already taken by another user"
}
```

## Request: user login
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
    "token": "<String: JWT TOKEN>"
}
```

#### Request: user login (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
}
```
#### Request: user login (wrong password)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "Unauthorized",
    "message": "invalid credentials"
}
```

## Request: user logout
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user/logout**</span>

### Headers:
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
*) just send empty body 

### Responses:
#### Request: user logout
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "user logged out successfully"
}
```
#### Request: user logout (invalid)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "Unauthorized",
    "message": "token invalid"
}
```

## Request: edit user data
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user**</span>

### Headers:
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```
### Body:
```json
{
    "email_address": "examplelorem@example.com",
}
```

### Responses:
#### Request: edit user data
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "successfully edit user data",
    "token": "<String: JWT TOKEN>"
}
```

#### Request: edit user data (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
}
```

#### Request: edit user data (email address taken by another user)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)
```json
{
    "status": "error",
    "message": "email address already taken by another user"
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
    "message": "email sent successfully, passsword reset link sent to your email account"
}
```

#### Request : request change password (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
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
    "message": "password updated successfully"
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
    "message": "user not found"
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


## Request: update user device token
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user/device_token**</span>

### Headers:
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Body:
```json
{
    "device_token": "<String: device token from firebase>",
}
```

### Responses:
#### Request: update user device token
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
}
```

## Request: update user profile picture
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user/`<int:nik>`/profile**</span>

### Body:
```json
// multipart/form-data
{
    "profile_photo": "FILE IMAGE",
}
```

### Responses:
#### Request: update user profile picture
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "user profile picture updated";
}
```

#### Request : update user profile picture (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
}
```

#### Request : update user profile picture (not found)
![Not Found](https://badgen.net/badge/Forbidden/403/red)
```json
{
    "status": "error",
    "message": "Only .png, .jpg, .jpeg format Allowed!"
}
```

## Request : get user profile image
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/user/`<int:nik>`/profile**</span>

### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses:
#### Request:  get user profile image
![OK](https://badgen.net/badge/OK/200/green)
```json
IMAGE FILE
```

#### Request:  get user profile image(users data empty)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
}
```

## Request: update user role
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user/`<int:nik>`/role**</span>

### Body:
```json
{
    "role_id": 1,
}
```

### Responses:
#### Request: update user role
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "success change user role";
}
```

#### Request : update user role (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "user not found"
}
```

#### Request : update user role (not Super Admin)
![Not Found](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "current user was not Super Admin"
}
```
*) Super Admin can promote User into Admin And Super Admin, Admin can promote User into Admin, Super Admin can demoted Admin into User

#### Request : update user role (role_id not valid)
![Not Found](https://badgen.net/badge/Bad%20Request/400/red)
```json
{
    "status": "error",
    "message": "role_id was not valid"
}
```



# Meeting Endpoint

## Request: Get all meeting by user id
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/user/`<int:id_user>`**?date=`<String: YYYY-MM-dd>`&type=`<String:participant_type>`</span>

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
            "time_start": "09:00",
            "time_end": "11:00",
            "date": "2022-08-19",
            "id_room": 1,
            "meeting_link": "meet.google.com/xxx-xxxx-xxx",
            "type": "Hybrid",
            "notification_type": "Email",
            "notulis": 1,
            "participants": 10,
            "isUserParticipant": "false"
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
        "id": "94303789-05db-41ba-9945-e2c5e69c2351",
        "topic": "Lorem Ipsum",
        "description": "asd",
        "time_start": "13:36",
        "time_end": "17:36",
        "date": "2022-11-08",
        "room": {
            "id": 1,
            "room_name": "example"
        },
        "meeting_link": "https://meet.google.com/xxx-xxxx-xxx",
        "type": "Hybrid",
        "notification_type": "Email",
        "participants": [
            {
                "id_participant": 123450,
                "participant_type": "Host",
                "approval_status": "In Review",
                "attendance": "false",
                "email_address": "example@gmail.com"
            },
            {
                "id_participant": 123453,
                "participant_type": "Notulis",
                "approval_status": "Waiting",
                "attendance": "false",
                "email_address": "example@gmail.com"
            }
            ...
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
    "current_meeting_id": "<String: UUID>",
    "date": "<String: YYYY-MM-dd>",
    "time_start": "<String: HH:mm:ss>",
    "time_end": "<String: HH:mm:ss>"
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

#### Request: add meeting (meeting_type is not valid)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "meeting_type is not valid, meeting_type must be in ['Online','Onsite','Hybrid']"
}
```
*) `meeting_type` must be in `['Online','Onsite','Hybrid']`

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

## Request: Edit meeting by meeting id
![PUT](https://badgen.net/badge/Method/PUT/blue)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/`<string:id_meeting>`**</span>
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
    "participants": [
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
            "type": "Participant",
        },
       ...
    ]
}
```

### Responses:
#### Request: add meeting
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "meeting updated successfully"
}
```

## Request: approve meeting notulensi
![PUT](https://badgen.net/badge/Method/PUT/blue)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/`<string:id_meeting>`/approval**</span>
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
    "meeting_id": "<String: UUID>",
    "approval_status": "Approve",
    "user_id": 12345
}
```

### Responses:
#### Request: approve meeting notulensi
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "approval status updated "
}
```

#### Request: approve meeting notulensi (approval_status is not valid)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)

```json
{
    "status": "error",
    "message": "approval_status is not valid, approval must be in ['Approved','In Review','Waiting']"
}
```
*) `approval_status` must be in `['Approved','In Review','Waiting']`


## Request: update users attendance in meeting 
![PUT](https://badgen.net/badge/Method/PUT/blue)<span style="margin-left:12px; font-size:12pt;">**/api/meeting/`<string:id_meeting>`/attendance**</span>
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
    "participants": [
            {
                "id_participant": 123450,
                "participant_type": "Host",
                "attendance": "false",
            },
            ...
            ]
}
```

### Responses:
#### Request:  update users attendance in meeting 
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "success update participants attendace"
}
```
### Responses:
#### Request:  update users attendance in meeting  (user was not Notulis or Host)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "current user was not Host or Notulis"
}
```
*) only host and notulis can update participants attendance


# Room Endpoint

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
    "current_meeting_id" : "<String: UUID>",
    "date": "<String: YYYY-MM-dd>",
    "time_start": "<String: HH:mm:ss>",
    "time_end": "<String: HH:mm:ss>"
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
            "is_available": "true"
        },
        ...
    ]
}
```


# Token Endpoint

## Request: check JWT token
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/check-token**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses:
#### Request: check JWT token
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "token valid"
}
```

### Responses:
#### Request: check JWT token
![OK](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "success",
    "message": "token expired"
}
```

### Responses:
#### Request: check JWT token
![OK](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "success",
    "message": "token invalid"
}
```

## Request: extend JWT token
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/token-extend**</span>
### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses:
#### Request: extend JWT token
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "token": "<String: JWT TOKEN>"
}
```

### Responses:
#### Request: extend JWT token
![OK](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "token expired"
}
```

### Responses:
#### Request: extend JWT token
![OK](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "token invalid"
}
```

# Password Endpoint

## Request: reset password check
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**api/reset-password-check/`<String: JWT token>`**</span>

### Responses:
#### Request: reset password check
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "token valid"
}
```

### Responses:
#### Request: reset password check
![OK](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "token expired"
}
```

### Responses:
#### Request: reset password check
![OK](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "token invalid"
}
```

# Setting Endpoint

## Request: get settings
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**api/settings**</span>

### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### Responses:
#### Request: get settings
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": {
        "reminder":10
    }
}
```

## Request: update settings
![PUT](https://badgen.net/badge/Method/PUT/blue)<span style="margin-left:12px; font-size:12pt;">**api/settings**</span>

### Headers :
```json
{
   "Content-Type": "application/json",
   "Authorization": "Bearer <String:jwt token>"
}
```

### body :
```json
{
   "reminder": 10,
}
```

### Responses:
#### Request: update settings
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "successful settings save changes"
}
```