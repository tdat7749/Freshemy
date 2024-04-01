# Freshemy

# Step to start the project in local

1. Clone the project at: 
  - git clone https://github.com/cvn-intern/Freshemy.git
2. Before start the project, ensure that you have downloaded MYSQL yet.
2. Move working directory to project: 
  - cd Freshemy
3. Open 2 terminals:
 - First terminal run Backend and start the server:
    - Add .env file into root:
      - PORT = 3001
      - DATABASE_URL= 'mysql://root:Abc@1234@localhost:3306/freshemy'
      - TOKEN_HEADER_KEY = "gfg_token_header_key"
      - DOMAIN_NAME = "http://localhost:3000"
      - EMAIL_SERVER = "freshemyteam@gmail.com"
      - PASSWORD_SERVER = ""
      - TOKEN_ACCESS_EXPIRED_TIME = "15m"
      - TOKEN_REFRESH_EXPIRED_TIME = "10d"
      - PUBLIC_URL = "http://localhost:3001"
      - PUBLIC_API_URL = "http://localhost:3001/api"
      - JWT_SECRET_KEY = "Freshemy"
      - HASH_SALT = "10"
      - CLOUDINARY_NAME = ""
      - CLOUDINARY_API_KEY = ""
      - CLOUDINARY_API_SECRET = ""
      - PUBLIC_URL_FOLDER_VIDEOS = "/public/videos"
      - UPLOAD_PATH = "/root/videos/"
    - cd backend
    - npx prisma db push (update database in MYSQL)
    - npm install (download necessary packages)
    - npm run dev
  - Second terminal run Frontend:
    - Add .env file into root:
      - REACT_APP_BASE_URL=http://localhost:3001/api
    - cd frontend
    - npm install (download necessary packages)
    - npm start
# Requirement

## I/ Purpose

- Provide a website where anyone can share knowledge with each other by courses. Users can buy courses, create and uploads video for their courses

## II/ Functional Requirements

### User Registration and Authentication

- Allow users to register for a new account and log in to the system.

### Forgot Password

- Allows users to retrieve their password when forgotten. Users will be sent a password reset link via their email. The user will then be redirected to the password change page and change the new password

### Update profile

- Allow users to update their information (avatar, lastname, firstname,...) after logging in

### Create New Course

- User after login the ability to create another course and post it for other users to use

### Update Courses

- Users have the ability to update their courses (add/delete videos, update course status, edit course information, ...)

### Manage Enrolled Courses

- Users have the ability to view and unsubscribe from other author's courses that they have previously subscribed to

### Rating Course

- Users after logging in have the ability to rate other authors' courses when they have started learning (comments, rating stars...)

### Watch video

- Users after logging in can watch the videos in the registered courses. At the same time, you can watch the video you posted yourself.

## III/ Non-functional Requirements

### Performance

- The response time and display on the system when there is data input is less than 3s

- Time to upload video to the system up to 30s

### Security

- Accounts that are wrongly logged in up to 5 times, if they are wrong more than 5 times, they will be locked account

### Scalability

- The system can meet many people to visit at the same time and watch the same video content (200 users)

### Reliability

- System access failure rate is 2 times out of 1000 hits.

### Cross-platform Compatibility

- The application can run on many different browsers

## IV/ Target users

- Internal user: logged-in user

- External: Students and students from schools in Vietnam

## V/ Business Goals

### Ease of use

- Easy-to-use, easy-to-interact and user-friendly functions

- Users are allowed to search for new courses according to their interests by categories

- At the same time, users can upload their videos and share them with others

### Cross-platform

- Responsive application on different devices for a comfortable user experience

## VI/ Structure

![image](https://github.com/cvn-intern/Freshemy/assets/70811800/2b2e1771-a642-48c2-8276-ca8146260cb5)

## V/ Use-case diagram

![image-1](https://github.com/cvn-intern/Freshemy/assets/70811800/6760925a-07a2-4b39-a75a-689db8685f7f)

## VI/ Functional MVP Requirement

### Manage Enrolled Courses

- Purpose: After logging in, users can manage registered courses
- Targeted user: Logged in user
- Description:
  - User selects Enrolled Course on navbar
  - Users type the course name to search on the search bar to search for the course by name
  - User selects a video that he wants to search
  - User chooses to unsubscribe from the course when clicking the unsubscribe button
  - Users choose Vote to rate and comment on the course
  - Users can view courses related to the author when clicking on the author's name in the video description
- Use-case:
    ![image-2](https://github.com/cvn-intern/Freshemy/assets/70811800/71597ce0-3490-45bd-a781-5c9695d27a99)

### Manage Personal Courses

- Purpose: After logging in, users can manage the courses they have created
- Targeted user: Logged in user
- Description:
  - User selects My Course on navbar
  - Users type the course name to search on the search bar to search for the course by name
  - Users select a video that they want to search to enter the management page of that course's lessons
  - User clicks "Create New" button to create a new course
  - User clicks on the "Delete" icon to delete the corresponding course
  - The user selects the "Edit" icon in any course to edit the course's information (Add lesson, Edit lesson's info, Delete lesson, Update status course)
  - Users can also see comments and reviews about their courses when clicking on any course
  - Courses are divided into multiple pages (maximum 5 courses per page)
- Use-case:
    ![image-3](https://github.com/cvn-intern/Freshemy/assets/70811800/445f3617-d418-47e3-89f5-8d729082a3c5)
