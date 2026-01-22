# 🧠 MindBridge

MindBridge is a community-based web application that allows users to create and join supportive circles, share posts, interact through comments, and receive real-time notifications using Firebase.

---

## 📌 Project Overview

MindBridge helps users connect in safe spaces called **Circles**.
Each circle can be public or private, with admin-controlled access and interactions.

---

## 🚀 Features

### 🔐 Authentication

* User signup and login (Firebase Authentication)
* Persistent login using `onAuthStateChanged`

### 👥 Circles

* Create public or private circles
* Join public circles instantly
* Request access to private circles
* Admin approval/rejection system
* Role-based access (Admin / Member)

### 🛠 Circle Admin Panel

* Approve or reject join requests
* Edit circle details
* Remove members
* Promote members to admin

### 📝 Circle Feed

* Create posts inside circles
* Comment on posts
* Real-time updates using Firestore listeners

### 🔔 Notifications

* Join request approval notifications
* Member removal notifications
* Mark notifications as read
* Unread notification badge

---

## 🛠️ Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Firebase

  * Firebase Authentication
  * Cloud Firestore
* **Realtime Updates**: Firestore `onSnapshot`

---

## 📂 Folder Structure

```
/assets
  └── images
/css
  └── style.css
/js
  ├── firebase.js
  ├── circles.js
  ├── circle-detail.js
  ├── notifications.js
/html
  ├── login.html
  ├── signup.html
  ├── circles.html
  ├── circle-detail.html
```

---

## 🗂 Firestore Database Structure

### circles

```
circles/
  circleId/
    title
    description
    visibility
    createdBy
    members
    joinRequests
```

### posts

```
posts/
  postId/
    circleId
    title
    body
    createdBy
    createdAt
```

### comments

```
comments/
  commentId/
    postId
    body
    createdBy
    createdAt
```

### notifications

```
notifications/
  notificationId/
    toUserId
    message
    isRead
    createdAt
```

---

## ⚙️ Setup Instructions

1. Clone the repository
2. Create a Firebase project
3. Enable:

   * Email/Password Authentication
   * Cloud Firestore
4. Add Firebase configuration in `firebase.js`
5. Run using Live Server or a local server

---

## 🔐 Security (Overview)

* Only authenticated users can access data
* Only admins can manage circle settings
* Users can only read their own notifications

---

## 📈 Future Enhancements

* Search and filter circles
* Profile avatars
* Push notifications
* Mood tracking & journaling
* AI-based circle recommendations

---

## 👩‍💻 Author

**Mahak Dhuware**
Web Development | Firebase | JavaScript
 