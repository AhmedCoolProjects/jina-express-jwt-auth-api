# Jina Express JWT Auth API

## Register Student

`/api/student/`

- first_name
- last_name
- room_number
- email
- password

- email_verified: **false**

## Get All Students

`/api/student/all`

## Get Student By ID

`/api/student/:id`

## Update Student By ID

`/api/student/update/:id`

- first_name
- last_name
- room_number

## Delete Student By ID

`/api/student/delete/:id`

## Login

`/api/student/login`

- email
- password

## Profile

`/api/student/profile`

`Authorization: JWT <token>`

## Email Verification

`/api/student/sendemail`

- \_id

## Verify

`/api/student/verify/:token`
_this one is sent inside the email verification_
