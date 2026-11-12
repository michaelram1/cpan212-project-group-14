TripTally — Travel Budget Tracker

CPAN 212 Term Project | Milestones 1–3 | Group 14
Student: Michael Rameshwar (@michaelram1)
Repository: https://github.com/michaelram1/cpan212-project-group-14
Submission: Individual (subject to instructor approval)

Overview

TripTally is a travel-budget application for creating trips, managing expenses, and converting foreign-currency spending into a trip's budget currency. Its two CRUD resources are Trips and Expenses.

Technology Stack: Node.js 24, Express 5, Next.js 16 App Router, React, and Frankfurter v2 exchange-rate API.

Features

Create, view, edit, and delete trips with destinations, dates, budgets, and currencies.

Create, view, edit, and delete expenses associated with trips.

Preview currency conversions and save the applied exchange rate and date.

Display total spending and remaining trip budgets.

Validate forms and display loading, empty, not-found, and API-error states.

Installation and Setup

Requirements: Node.js 24 and npm.

Backend — Express API

From the project root:

cd api
npm install
npm run dev

API endpoint: http://localhost:4000/api/trips

Frontend — Next.js

Open a second terminal from the project root:

cd web
npm install

Create web/.env.local:

EXPRESS_API_ORIGIN=http://localhost:4000

Start the frontend:

npm run dev

Application: http://localhost:3000/trips

The backend defaults to port 4000 and uses https://api.frankfurter.dev for exchange-rate requests.

Application Pages

Page

Route

Trips list

/trips

Trip details

/trips/[id]

Create trip

/trips/new

Edit trip

/trips/[id]/edit

Add expense

/trips/[id]/expenses/new

Edit expense

/expenses/[id]/edit

REST API Endpoints

Method

Endpoint

Description

GET

/api/trips

Retrieve all trips

GET

/api/trips/:id

Retrieve a trip

POST

/api/trips

Create a trip

PATCH

/api/trips/:id

Update a trip

DELETE

/api/trips/:id

Delete a trip and its expenses

GET

/api/expenses?tripId=:id

Retrieve expenses for a trip

GET

/api/expenses/:id

Retrieve an expense

POST

/api/expenses

Create an expense

PATCH

/api/expenses/:id

Update an expense

DELETE

/api/expenses/:id

Delete an expense

GET

/api/rates?from=USD&to=CAD&amount=50

Preview currency conversion

The API returns HTTP 400 for invalid input, 404 for missing resources, 502 for exchange-rate provider failures, and 504 for provider timeouts.

Errors follow this structure:

{
  "error": {
    "message": "Error description",
    "details": null
  }
}

External API Integration

TripTally uses the Frankfurter API to retrieve currency exchange rates.

No API key required.

Exchange rates are cached for one hour.

API requests have a three-second timeout.

Converted amounts, exchange rates, and rate dates are stored with expenses.

Exchange rates are indicative reference rates.

Testing

Backend

cd api
npm test

Frontend

cd web
npm run build

Project Documentation

Project Proposal and API Design

Application Wireframes

Express API Documentation

Contributions

Milestone Scope

M1: Project proposal, external API selection, data models, endpoint design, and wireframes.

M2: Express REST API with in-memory Trip and Expense CRUD operations, validation, error handling, and currency conversion.

M3: Next.js frontend with dynamic pages, forms, Express API integration, shared state, and responsive styling.

The application currently uses in-memory data. MongoDB persistence, authentication, and production deployment are planned for M4–M6.

## AI use

No AI Used
