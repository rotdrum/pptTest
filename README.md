# Project Overview

This project is a web application designed to manage user registrations and positions for an event. It includes features for user authentication, displaying user details, managing positions, and administrative capabilities.

## Features

- **User Authentication:** Secure login and authentication system.
- **User Dashboard:** Display user details and event registration status.
- **Admin Dashboard:** Manage user registrations and event positions.
- **Search and Sort:** Filter and sort user registrations based on different criteria.
- **Pagination:** Navigate through user registrations with pagination.

## ข้อมูลแบบนี้ equirement ดังนี้

- **User** สามารถลงชื่อตนเองในการเขา้งานได้ หากยังมีที่นั่งคงเหลือ โดยระบุ ชื่อนามสกลุล และเบอร์โทร
- **User** สามารถเห็นชื่อ บุคคลที่เคยลงทะเบียนได้ในรูปแบบตารางและสามารถ sort และ search ได้
- **User** เห็นจำนวนคงเหลือได้
- **User** เห็นจำนวนคนที่ลงทะเบียนทั้งหมดได้
- **Admin** สามารถดูข้อมูล คนที่ลงทะเบียน โดยข้อมูลที่แสดงคือ ชื่อ นามสกุล และเบอร์โทร ในรูปแบบตารางและ สามารถ sort และ search ได้
- **Admin** กำหนดที่นั่ง ของคนที่จะเข้ามาลงทะเบียนได้
- **Admin** เห็นจำนวนที่นั่ง คงเหลือ ได้
- **Admin** เห็นจำนวนคนที่ลงทะเบียนทั้งหมดได้

## Technologies Used

### Frontend

- **Framework/Library:** React.js
- **Styling:** CSS with styled-components

### Backend

- **Framework:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)

### Deployment

- **Platform:** Heroku
- **CI/CD:** GitHub Actions for automated testing and deployment

## Getting Started

To get a local copy up and running, follow these steps:

### Prerequisites

- Node.js (version 14.x or higher)
- MongoDB

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/rotdrum/pptTest.git
