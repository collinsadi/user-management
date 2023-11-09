# User Management Microservice Documentation

## Table of Contents
1. Introduction
2. Service Overview
   - 2.1. Purpose
   - 2.2. Functionality
3. API Endpoints
   - 3.1. User Registration
   - 3.2. User Email Verification
   - 3.3. User Login
   - 3.4. User Password Forgotten
   - 3.5. User Password Reset
   - 3.6. User Change Email
   - 3.7. User Verify New Email
   - 3.8. User Change Profile Picture
   - 3.9. User Follow another User
   - 3.10. User Unfollow  User
   - 3.11. User Check Following
   - 3.12. User Profile
4. Data Schema
   - 4.1. User Data Structure
5. Security Measures
   - 5.1. Authentication
   - 5.2. Password Encryption
6. Error Handling
7. Performance and Scalability
8. Deployment
9. Testing
10. Maintenance and Support
11. Conclusion
12. Appendices
   - A. API Examples
   - B. Error Codes
   - C. References

## 1. Introduction
- This document provides detailed documentation for the User Management Microservice, a crucial component of our Web Code Editor platform. It describes the microservice's purpose, functionality, API endpoints, data schema, security measures, and more.

## 2. Service Overview
### 2.1. Purpose
- The User Management Microservice is responsible for user-related functionalities, including registration, authentication, and profile management.

### 2.2. Functionality
- It allows users to create accounts, log in securely, and manage their profiles, including personal information, and preferences.

## 3. API Endpoints
- The User Management Microservice offers the following API endpoints:

### 3.1. User Registration
- **Endpoint:** POST `/api/V1/users/signup`
- **Description:** Allows users to create an account by providing necessary information.
- **Request Body:**
    ```json
    {
    "email": "user_email@example.com",
    "username": "user_name",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe",
    "country": "United States"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Account Created",
    "email": "user_email@example.com"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "username already in use",
    "error_code": 400,
    "error_details": "the Username provided by the client is already associated with another user"
    }
    ```

    ```json
    {
    "status": false,
    "message": "email is required",
    "error_code": 422,
    "error_details": "The Client Did not send the email in the request body"
    }
    ```

### 3.2. User Email Verification
- **Endpoint:** POST `/api/V1/users/signup/verify`
- **Description:** Enables Users to Verify There Email Addresses ||  this endpoint would also be used to verify login for users
- **Request Body:**
    ```json
    {
        "email": "user_email@example.com",
        "code": "419607"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "validation successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Invalid Code",
    "error_code": 400,
    "error_details": "the Email Verification code Provided by the client for this user appears to be invalid"
    }
    ```


### 3.3. User Login
- **Endpoint:** POST `/api/V1/users/login`
- **Description:** Enables Users to Login with Validated Credentials
- **Request Body:**
    ```json
    {
        "email": "user_email@example.com",
        "password": "securePassword123"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Authorization Required",
    "email": "user_email@example.com"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Invalid Credentials",
    "error_code": 400,
    "error_details": "the Email provided by the client is not Associated with any user"
    }
    ```


### 3.4. User Forgotten Password
- **Endpoint:** POST `/api/V1/users/password/forgotten`
- **Description:** Enables Users to Request for a Password Reset Link Using a Valid Email
- **Request Body:**
    ```json
    {
        "email": "user_email@example.com"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Password Reset Code Sent"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "No User With This Email Was Found",
    "error_code": 404,
    "error_details": "No User Was Found With Thr Email Address Provided By the Client"
    }
    ```


### 3.5. User Password Reset
- **Endpoint:** POST `/api/V1/users/password/reset`
- **Description:** Enables Users to Reset Their Password from Link Gotten from their Email
- **Request Body:**
    ```json
    {
        "code": "bdgdgdgf3874846848g4ugu48y886864",
        "password": "newSecurePassword123"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Password Reset Sucessful"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Invalid Token",
    "error_code": 404,
    "error_details": "The Token Received from the Client Appears to Be Invalid"
    }
    ```


### 3.6. User Change Email
- **Endpoint:** POST `/api/V1/users/profile/edit/email`
- **Description:** Enables Users to Change Their Email to a New One `|| Authenticated Route`
- **Request Body:**
    ```json
    {
        "email": "myNewEmail@gmail.com"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Verify New Email"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "email Already In Use",
    "error_code": 400,
    "error_details": "The New email provided buy the client is already associated with another user"
    }
    ```


### 3.7. User Verify New Email
- **Endpoint:** POST `/api/V1/users/profile/edit/email/verify`
- **Description:** Enables Users to Verify The New Email They Provided `|| Authenticated Route`
- **Request Body:**
    ```json
    {
        "code": "298376"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Email Changed Sucessfully"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "verification Code Expired, Try Again",
    "error_code": 400,
    "error_details": "The Email Verification Code Received From the Client has Passed 20 minutes Validity Time"
    }
    ```


### 3.8. User Change Profile Picture
- **Endpoint:** POST `/api/V1/users/profile/edit/picture`
- **Description:** Enables Users to Change their Profile Picture `|| Authenticated Route`
- **Request Body:**
    ```json
    {
        "profilePicture": "profile_picture_url"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Profile Picture Updated Sucessfully"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Image String Missing",
    "error_code": 422,
    "error_details": "The Client Side did not Send The URL for the new Image"
    }
    ```


### 3.9. User Follow Another User
- **Endpoint:** POST `/api/V1/users/follow?user=`
- **Description:** Enables Users to Follow Each Other `|| Authenticated Route`
- **Request Query:**
    ```json
    {
        "user": "mongo_db_user_id"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "Follow Successful"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Invalid User Id",
    "error_code": 422,
    "error_details": "Ther User Id Provided by the client is Invalid"
    }
    ```


### 3.10. User Unfollow User
- **Endpoint:** POST `/api/V1/users/unfollow?user=`
- **Description:** Enables Users to Unfollow Users `|| Authenticated Route`
- **Request Query:**
    ```json
    {
        "user": "mongo_db_user_id"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "message": "unFollow Successful"
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Invalid User Id",
    "error_code": 422,
    "error_details": "Ther User Id Provided by the client is Invalid"
    }
    ```


### 3.11. User Check Following 
- **Endpoint:** GET `/api/V1/users/check/following?user=`
- **Description:** Enables Users to Know if they are following a Particular User or not `|| Authenticated Route`
- **Request Query:**
    ```json
    {
        "user": "mongo_db_user_id"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "following": true
    }
    ```
    Or

    ```json
    {
    "status": true,
    "following": false
    }
    ```
- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Invalid User Id",
    "error_code": 422,
    "error_details": "Ther User Id Provided by the client is Invalid"
    }
    ```


### 3.12. User Profile 
- **Endpoint:** GET `/api/V1/users/profile?user=`
- **Description:** Enables Users to View a Users Profile with username 
- **Request Query:**
    ```json
    {
        "user": "username"
    }
    ```
- **Response (Success):**
    ```json
    {
    "status": true,
    "user": {
        "_id": "654bcef958c69ccd2c4c4ab2",
        "username": "user_name",
        "firstName": "John",
        "lastName": "Doe",
        "country": "United States",
        "badges": [],
        "followers": [
            {
                "_id": "654bd21e73f0fad0db5d31ff",
                "username": "user_name12"
            }
        ],
        "following": [
            {
                "_id": "654bcf3c58c69ccd2c4c4ab9",
                "username": "user_name1"
            }
        ],
        "followersCount": 1,
        "followingCount": 1,
        "projectsCount": 1,
        "createdAt": "2023-11-08T18:10:01.180Z"
        }
    }
    ```


- **Response (Error):**
    ```json
    {
    "status": false,
    "message": "Account Disabled",
    "error_code": 400,
    "error_details": "Account Permanently or Temporarily Disabled"
    }
    ```
    ```json
    {
    "status": false,
    "message": "User Not Found",
    "error_code": 400,
    "error_details": "the username Provided by the Client is not Associated with any user"
    }
    ```



## 4. Data Schema
### 4.1. User Data Structure
- The microservice uses a database schema to store user data, including user ID, username, email, password hash, and profile details.

## 5. Security Measures
### 5.1. Authentication
- User login is secured with a JSON Web Token (JWT) mechanism, ensuring only authorized users can access their accounts.

### 5.2. Password Encryption
- Passwords are securely stored using industry-standard encryption algorithms and salted to protect against unauthorized access.

## 6. Error Handling
- The microservice provides clear and structured error responses, including error codes and descriptions for easy debugging.

## 7. Performance and Scalability
- The microservice is designed for performance and can be scaled horizontally to handle increased user loads.

## 8. Deployment
- Details the deployment environment, including dependencies and configuration settings.

## 9. Testing
- Describes the testing approach, including unit tests, integration tests, and user testing.

## 10. Maintenance and Support
- Discusses ongoing maintenance, monitoring, and user support.

## 11. Conclusion
- This documentation provides an in-depth understanding of the User Management Microservice. It serves as a reference for developers, testers, and administrators to ensure the smooth operation of this essential component.

## 12. Appendices
- Include additional information such as API request/response examples, error codes, and references.

This comprehensive documentation for the User Management Microservice includes code snippets and response examples, 
serving as a practical guide for your project team. It can be customized further based on your specific project requirements and needs.

