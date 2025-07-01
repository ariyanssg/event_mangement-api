# Event Management API

A robust, production-ready REST API for managing restaurant events, built with Node.js, Express, and MongoDB. Designed for scalability, security, and maintainability, this project demonstrates best practices in modern backend development.

---

## 🚀 Features
- **Create, Update, Retrieve, Delete Events** for restaurants
- **Comprehensive Validation** for all input data
- **Secure by Default**: Rate limiting, CORS, Helmet, and error handling
- **Modular Architecture**: Separation of concerns for easy maintenance
- **Seed Script**: Quickly populate the database with sample data
- **Consistent API Responses**
- **Ready for Extension**: Easily add authentication, more resources, or new endpoints

---

## 🗂️ Project Structure

```
project/
  config/           # Database connection
  controllers/      # Business logic for events
  middleware/       # Validation and error handling
  models/           # Mongoose schemas
  routes/           # API route definitions
  utils/            # Seed script
  server.js         # Main entry point
  package.json      # Dependencies and scripts
  README.md         # Project documentation
```

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd project
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment setup:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/event_management
   NODE_ENV=development
   API_BASE_URL=http://localhost:3000
   ```
4. **Seed the database (optional):**
   ```bash
   node utils/seedData.js --seed
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```
6. **Start the production server:**
   ```bash
   npm start
   ```

---

## 📚 API Endpoints

**Base URL:** `http://localhost:3000/api/v1/admin`

### 1. Create Event
- **POST** `/addEvent`
- **Body:** See [Event Model](#event-model)

### 2. Update Event
- **PUT** `/updateEvent`
- **Body:** `{ _id, ...fieldsToUpdate }`

### 3. Get Events for Restaurant
- **GET** `/getEventData/:rid`

### 4. Delete Event
- **DELETE** `/DeleteEvent`
- **Body:** `{ _id }`

#### Example Request (Create Event)
```json
{
  "restaurant_id": "61b6fa7db0f0f8e3bc44c7d9",
  "event_title": "Live Music Night",
  "event_description": "Join us for an amazing night of live jazz and delicious food.",
  "cover_image": "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
  "entry_fee_per_person": 500,
  "start_date": "2025-07-15",
  "end_date": "2025-07-15",
  "start_time": "19:00",
  "end_time": "23:00",
  "contact_address": "123 Banani Road, Dhaka",
  "email": "events@restaurant.com",
  "mobile": "+880123456789",
  "is_active": true
}
```

---

## 🗃️ Data Models

### Event Model
- `restaurant_id`: ObjectId (required, references Restaurant)
- `event_title`: String (required, max 200 chars)
- `event_description`: String (required, max 1000 chars)
- `cover_image`: String (required, valid image URL)
- `entry_fee_per_person`: Number (required, min 0)
- `start_date`: Date (required, not in past)
- `end_date`: Date (required, >= start_date)
- `start_time`: String (required, HH:MM format)
- `end_time`: String (required, HH:MM format)
- `contact_address`: String (required, max 500 chars)
- `email`: String (required, valid email)
- `mobile`: String (required, international format)
- `is_active`: Boolean (default: true)

### Restaurant Model
- `name`: String (required)
- `address`: String (required)
- `phone`: String (required)
- `email`: String (required, valid email)
- `is_active`: Boolean (default: true)

---

## ✅ Validation & Error Handling
- **All input is validated** using express-validator and custom logic
- **Dates**: Start date cannot be in the past; end date >= start date
- **Times**: Must be in HH:MM format; end time > start time for same-day events
- **IDs**: Must be valid MongoDB ObjectIds
- **Emails**: Must be valid format
- **Mobile**: Must be in international format (+880...)
- **Cover Image**: Must be a valid image URL
- **Entry Fee**: Cannot be negative
- **Consistent error responses** for all endpoints

---

## 🔒 Security Features
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Secure HTTP headers
- **Centralized Error Handling**: No stack traces in production
- **Environment Variables**: No secrets in code

---

## 🧪 Testing
- **Manual**: Use cURL, Postman, or the provided PowerShell scripts (`test-api.ps1`, `test-update-only.ps1`)
- **Automated**: (Ready for Jest/Supertest integration)
- **Seed Script**: Quickly populate the DB for testing

---

## 🏗️ Extending the Project
- Add authentication (JWT, OAuth)
- Add more resources (users, bookings)
- Add automated tests
- Add CI/CD pipeline

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the ISC License.