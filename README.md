# User

## Request: Checking the availability of user account
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/user/`<int:nik>`**</span>

### Responses:
#### Request: Checking the availability of user account
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": {
        "nik": 1,
        "username": "John Doe",
        "email_address": "johnDoe@example.com",
        "id_role": 1,
        "device_token": "ux8s9f-sad9x-asdasw",
        "phone_number": "6281200000000",
        "gender": "male",
        "date_of_birth": "1999-01-01"
    }
}
```

#### Request: Checking the availability of user account(not found)
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
    "nik": 1234556,
    "name": "John Doe",
    "id_role": 1,
    "email_address": "johndoe@example.com",
    "phone_number": "6281200000000",
    "gender": "male",
    "date_of_birth": "1999-01-01"

}
```

### Responses:
#### User account registration
![Created](https://badgen.net/badge/Created/201/green)
```json
{
    "status": "success",
    "message": "Account created successfully",
    "data": {
        "nik": 1234556,
        "name": "John Doe",
        "id_role": 1,
        "email_address": "johndoe@example.com",
        "phone_number": "6281200000000",
        "gender": "male",
        "date_of_birth": "1999-01-01"
    }
}
```
#### User account registration (account already registered)
![Bad Request](https://badgen.net/badge/Bad%20Request/400/red)
```json
{
    "status": "error",
    "message": "Account already registered"
}
```

## Request: Edit user data
![PUT](https://badgen.net/badge/Method/PUT/blue)
<span style="margin-left:12px; font-size:12pt;">**/api/user/`<int:nik>`**</span>

```json
{
        "name": "John Doe",
        "id_role": 1,
        "email_address": "johndoe@example.com",
        "phone_number": "6281200000000",
        "gender": "male",
        "date_of_birth": "1999-01-01",
        "password": "johndoe123456"
}
```

### Responses:
#### Edit user data
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "User updated successfully",
    "data": {
        "nik": 1234556,
        "name": "John Doe",
        "id_role": 1,
        "email_address": "johndoe@example.com",
        "phone_number": "6281200000000",
        "gender": "male",
        "date_of_birth": "1999-01-01",
    }
}
```
#### Edit user data (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "User does not exist"
}
```
## Request: Login User Account
![POST](https://badgen.net/badge/Method/POST/yellow)<span style="margin-left:12px; font-size:12pt;">**/api/user/login**</span>

```json
{
    "nik": 123456,
    "email_address": "johndoe@example.com",
    "password": "johndoe123"
}
```

### Responses:
#### Login User Account
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "Successfully logged in"
}
```
#### Login User Account (Wrong Credentials)
![Unauthorized](https://badgen.net/badge/Unauthorized/401/red)
```json
{
    "status": "error",
    "message": "Unauthorized: invalid credentials (wrong email/nik/password)"
}
```

## Request: Change password
![PUT](https://badgen.net/badge/Method/PUT/blue)<span style="margin-left:12px; font-size:12pt;">**/api/user/change-password**</span>

```json
{
    "nik": 123456,
    "new_password": "johndoedoedoe"
}
```

### Responses:
#### Change password
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "message": "Password reset successfully"
}
```

#### Change password (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "NIK does not exist"
}
```

# Role

## Request: Checking user role by id
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/role/`<int:id_role>`**</span>

### Responses:
#### Request: Checking user role by id
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": {
        "id" : 1,
        "role": "Admin"
    }
}
```

#### Request: Checking user role by id (not found)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "Role not found"
}
```
## Request: Get all user roles
![GET](https://badgen.net/badge/Method/GET/green)<span style="margin-left:12px; font-size:12pt;">**/api/role**</span>

### Responses:
#### Request: Get all user roles
![OK](https://badgen.net/badge/OK/200/green)
```json
{
    "status": "success",
    "data": [
        {
            "id" : 1,
            "role": "Admin",
        },
        {
            "id" : 2,
            "role": "User",
        }
    ]
    
}
```

#### Request: Get all user roles (Data Empty)
![Not Found](https://badgen.net/badge/Not%20Found/404/red)
```json
{
    "status": "error",
    "message": "Data Role is empty"
}
```
