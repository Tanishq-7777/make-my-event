# **1. API Architecture** 

The frontend runs on Vercel and communicates with the Express backend. 

Next.js 

│ │ HTTPS / JSON ▼ 

Node.js + Express 

│ 

- `├` ── Auth Module 

- `├` ── Event Module 

- `├` ── Function Module 

- `├` ── Guest Module 

- `├` ── Invitation Module 

- `├` ── RSVP Module 

- `├` ── Collaboration Module 

- `├` ── Budget Module 

- `├` ── Task Module 

- `├` ── Album Module 

- `├` ── Photo Module 

- `├` ── Notification Module 

└── Activity Module 

│ 

- `├` ── MongoDB Atlas 

- `├` ── Queue 

- `├` ── Resend 

- └── S3 / Cloudinary 

Base URL: 

https://api.yourdomain.com/api/v1 

# **2. API Layer Structure** 

Inside Express, I recommend: 

routes 

↓ controllers ↓ services ↓ repositories ↓ MongoDB With supporting layers: middleware validators errors utils queue 

So a controller should **not directly contain MongoDB logic** . 

For example: 

POST /events/:eventId/guests 

↓ GuestController ↓ GuestService 

↓ 

GuestRepository 

↓ MongoDB 

This keeps the monolith modular. 

# **3. Authentication APIs** 

# **Register** 

POST /api/v1/auth/register 

{ "name": "Rahul Sharma", "email": "rahul@example.com", "password": "********" } Response: { "user": { "id": "...", "name": "Rahul Sharma", "email": "rahul@example.com" } } 

Server creates the session and sends the session cookie. 

**Login** 

POST /api/v1/auth/login { "email": "rahul@example.com", "password": "********" 

} 

# **Logout** 

POST /api/v1/auth/logout 

Session is invalidated server-side. 

# **Current User** 

GET /api/v1/auth/me 

Returns current authenticated user and basic account information. 

# **Verify Email** 

POST /api/v1/auth/verify-email 

# **Forgot Password** 

POST /api/v1/auth/forgot-password 

# **Reset Password** 

POST /api/v1/auth/reset-password 

**4. Events API** 

**List My Events** 

GET /api/v1/events 

Possible query parameters: ?page=1&limit=20&status=active 

# **Create Event** 

POST /api/v1/events 

{ 

"name": "Rahul & Priya Wedding", "type": "wedding", "startDate": "2026-12-10", "endDate": "2026-12-14", "timeZone": "Asia/Kolkata", "description": "Wedding celebration", "budget": 1500000 } Response: { "event": { "id": "evt_123", "name": "Rahul & Priya Wedding", "type": "wedding", "startDate": "2026-12-10", "endDate": "2026-12-14", "timeZone": "Asia/Kolkata" } } 

# **Get Event** 

GET /api/v1/events/:eventId 

**Update Event** 

PATCH /api/v1/events/:eventId Only permitted users. 

**Delete Event** 

DELETE /api/v1/events/:eventId 

I'd recommend soft deletion internally for important records rather than immediately destroying the entire event. 

# **5. Event Dashboard API** 

I recommend having a dedicated summary endpoint rather than forcing the frontend to make 10 separate requests. 

GET /api/v1/events/:eventId/overview 

Example response: 

{ "event": {}, "functions": { "total": 5, "next": {} }, "guests": { "parties": 72, "allowedAttendees": 205, "confirmedAttendees": 178, "pendingParties": 14, "declinedParties": 8 }, "budget": { "allocated": 1500000, "spent": 1125000, "remaining": 375000 }, "tasks": { "total": 42, 

"completed": 27, "pending": 15, "overdue": 3 } } This will make the dashboard much simpler and faster. 

**6. Functions API** 

**List Functions** GET /api/v1/events/:eventId/functions 

**Create Function** 

POST /api/v1/events/:eventId/functions { "name": "Haldi", "date": "2026-12-12", "startTime": "10:00", "endTime": "13:00", "timeZone": "Asia/Kolkata", "venue": { "name": "Sharma Residence", "address": "..." }, "dressCode": "Yellow", "budgetAmount": 100000 } 

When a function is created, the backend can automatically create: 

- Its album 

• Its QR upload token 

That's normal application automation. 

**Get Function** 

GET /api/v1/events/:eventId/functions/:functionId 

**Update Function** PATCH /api/v1/events/:eventId/functions/:functionId 

**Delete Function** 

DELETE /api/v1/events/:eventId/functions/:functionId 

**7. Guest Party APIs** The primary object is the **Guest Party** , not individual attendees. **Create Guest Party** POST /api/v1/events/:eventId/guest-parties { "partyName": "Sharma Family", "contact": { "name": "Radha Sharma", "email": "radha@example.com", "phone": "+91..." }, "notes": "Close family" } 

# **List Guest Parties** 

GET /api/v1/events/:eventId/guest-parties 

Filters: 

?search=sharma ?status=pending ?functionId=fun_123 

# **Get Guest Party** 

GET /api/v1/events/:eventId/guest-parties/:guestPartyId 

# **Update Guest Party** 

PATCH /api/v1/events/:eventId/guest-parties/:guestPartyId 

# **Delete Guest Party** 

DELETE /api/v1/events/:eventId/guest-parties/:guestPartyId 

# **8. Invitation Assignment API** 

This is where we connect a family to functions. 

# **Create Invitation** 

POST /api/v1/events/:eventId/invitations { "guestPartyId": "party_123", "functions": [ { "functionId": "haldi_123", "maxAttendees": 3 }, { "functionId": "sangeet_123", "maxAttendees": 5 

}, { "functionId": "wedding_123", "maxAttendees": 5 } ] } This creates the invitation but doesn't necessarily send the email yet. 

**9. Invitation APIs List Invitations** GET /api/v1/events/:eventId/invitations 

**Get Invitation** 

GET /api/v1/events/:eventId/invitations/:invitationId 

# **Update Invitation** 

PATCH /api/v1/events/:eventId/invitations/:invitationId 

This can update: 

- Included functions 

- Allowed attendee count 

- Other invitation settings 

# **Send Invitation** 

POST /api/v1/events/:eventId/invitations/:invitationId/send This should **not send the email directly inside the request** . 

Instead: 

API 

↓ 

Create notification job 

↓ Queue ↓ Worker ↓ 

Resend 

# **Resend Invitation** 

POST /api/v1/events/:eventId/invitations/:invitationId/resend 

We should support an Idempotency-Key header for send operations to reduce accidental duplicate sends. 

# **10. Guest Invitation Flow** 

This needs special API treatment. 

The email could contain something like: 

https://app.yourdomain.com/invite/<secure-token> 

The initial invitation-page request can call: 

GET /api/v1/public/invitations/:token 

This endpoint returns **limited invitation information** . 

Example: 

{ "invitation": { "eventName": "Rahul & Priya Wedding", "contactName": "Radha Sharma", "functions": [ { 

"name": "Haldi", "date": "2026-12-12" }, { "name": "Wedding", "date": "2026-12-13" } ] } } 

It should not expose sensitive event-management data. 

**11. Guest Login / Invitation Claim** 

After clicking the email: 

Invitation 

↓ Login / Register 

↓ 

Claim invitation 

↓ 

RSVP 

We can have: 

POST /api/v1/guest/invitations/:token/claim 

The backend verifies: 

1. Token is valid. 

2. Invitation hasn't been revoked. 

3. Authenticated user's email matches the invited email. 

4. Invitation belongs to that guest party. 

This prevents someone forwarding the invitation URL to another person and having them claim it. 

**12. Guest RSVP API** 

**Get My Invitation** 

GET /api/v1/guest/invitations/:invitationId 

# **Submit or Update RSVP for One Function** 

PATCH /api/v1/guest/invitations/:invitationId/functions/:functionId/rsvp

Example request:

```json
{ "status": "accepted", "attendingCount": 3 }
```

The authenticated user must have claimed this invitation, and the account email must match the invited contact email. Each request updates only the specified function response; all other function responses remain unchanged and may stay pending. `status` is `accepted` or `declined`. For `accepted`, `attendingCount` must be at least 1 and no greater than that function's `maxAttendees`; for `declined`, store `attendingCount` as 0. The server sets `respondedAt`. Repeated identical requests are safe and produce the same state.

# **13. RSVP Management APIs — Organizer** 

**Get RSVP Summary** 

GET /api/v1/events/:eventId/rsvp/summary 

# **Get RSVP List** 

GET /api/v1/events/:eventId/rsvp 

Filters: ?functionId=... ?status=pending 

?status=accepted 

# **Send RSVP Reminder** 

POST /api/v1/events/:eventId/rsvp/reminders This creates notification jobs. 

**14. Event Manager APIs** 

V1 has no broad manager access. Each manager membership has an explicit set of module permissions, and every protected operation checks the required permission. The owner can grant or revoke permissions individually; the manager role label alone grants no management capability. Supported V1 permissions are `event.manage`, `functions.manage`, `guests.manage`, `invitations.manage`, `rsvp.manage`, `budget.manage`, `tasks.manage`, and `albums.manage`.

**List Managers** 

GET /api/v1/events/:eventId/members 

# **Invite Manager** 

POST /api/v1/events/:eventId/members/invitations 

{ 

"email": "father@example.com", "name": "Rajesh Sharma", "role": "manager", "permissions": [ "functions.manage", "guests.manage", "budget.manage", "tasks.manage", "albums.manage" ] } 

# **Update Manager Permissions** 

PATCH /api/v1/events/:eventId/members/:memberId 

**Remove Manager** 

DELETE /api/v1/events/:eventId/members/:memberId 

# **15. Manager Invitation Acceptance** 

GET /api/v1/public/member-invitations/:token Then after login: POST /api/v1/member-invitations/:token/accept The backend ensures the authenticated user's email matches the invitation email. 

**16. Authorization Model** 

Every protected event endpoint should go through something like: authenticateSession 

↓ 

loadEvent 

↓ 

checkEventMembership 

↓ 

checkPermission 

↓ controller 

Example: PATCH /events/:eventId/budget requires: 

authenticated user 

+ 

member of event 

+ 

budget.manage permission 

This should be centralized middleware rather than rewritten in every controller. 

**17. Budget APIs** 

**Get Budget** 

GET /api/v1/events/:eventId/budget 

Response: 

{ "allocated": 1500000, "spent": 1125000, "remaining": 375000, "utilizationPercentage": 75 } 

# **Update Event Budget** 

PATCH /api/v1/events/:eventId/budget 

# **Set Function Budget** 

PATCH /api/v1/events/:eventId/functions/:functionId/budget 

# **18. Budget Entry APIs** 

The organizer records spending entries. 

# **Add Spending** 

POST /api/v1/events/:eventId/budget/entries { "functionId": "sangeet_123", "category": "food", "description": "Catering advance", "amount": 85000, "spentAt": "2026-09-27", "notes": "Advance payment" } The API calculates spent rather than allowing the frontend to directly set it. 

**List Spending** GET /api/v1/events/:eventId/budget/entries Filters: ?functionId=... ?category=food 

# **Update Spending** 

PATCH /api/v1/events/:eventId/budget/entries/:entryId 

# **Delete Spending** 

DELETE /api/v1/events/:eventId/budget/entries/:entryId 

**19. Task APIs Create Task** POST /api/v1/events/:eventId/tasks { "title": "Finalize Sangeet DJ", "functionId": "sangeet_123", "assignedTo": "user_123", "priority": "high", "dueDate": "2026-11-20" } 

# **List Tasks** 

GET /api/v1/events/:eventId/tasks Filters: ?status=pending ?assignedTo=user_123 ?functionId=... ?priority=high 

# **Update Task** 

PATCH /api/v1/events/:eventId/tasks/:taskId 

# **Delete Task** 

DELETE /api/v1/events/:eventId/tasks/:taskId 

# **20. Schedule APIs** 

Since schedule items belong to a function, I'd expose them as nested resources. 

Schedule items are stored separately and contain `eventId`, `functionId`, `title`, `startTime`, optional `endTime`, optional `location`, `description`, `guestVisible`, `sortOrder`, `createdBy`, and timestamps. Times are local to the function and interpreted in the event's IANA timezone. The backend verifies that the function belongs to the event and checks `functions.manage` on writes.

GET /api/v1/events/:eventId/functions/:functionId/schedule 

POST /api/v1/events/:eventId/functions/:functionId/schedule 

PATCH /api/v1/events/:eventId/functions/:functionId/schedule/:itemId 

DELETE /api/v1/events/:eventId/functions/:functionId/schedule/:itemId 

Request example:

```json
{
  "title": "Wedding ceremony",
  "startTime": "20:00",
  "endTime": "21:30",
  "location": "Main hall",
  "description": "Ceremony begins",
  "guestVisible": true,
  "sortOrder": 20
}
```

Guest-visible schedule items are returned only to an authenticated, claimed invitee for a function included in their invitation:

GET /api/v1/guest/invitations/:invitationId/functions/:functionId/schedule

# **21. Album APIs** 

Every function gets an album. 

**List Albums** 

GET /api/v1/events/:eventId/albums 

**Get Album** 

GET /api/v1/events/:eventId/albums/:albumId 

**Update Album** 

PATCH /api/v1/events/:eventId/albums/:albumId 

# **22. QR Code APIs** 

**Get Function QR** 

GET /api/v1/events/:eventId/functions/:functionId/qr 

The backend can return either: 

- QR image URL 

- QR SVG/data 

- upload page URL 

# **Regenerate QR** 

POST /api/v1/events/:eventId/functions/:functionId/qr/regenerate This should invalidate the old token. 

# **23. Public Photo Upload API** 

This is intentionally different from normal authenticated APIs. QR sends the user to something like: https://app.yourdomain.com/upload/<token> The frontend calls: GET /api/v1/public/photo-upload/:token to validate the QR. Then: POST /api/v1/public/photo-upload/:token/presign Example: { "fileName": "IMG_1234.jpg", "contentType": "image/jpeg", "fileSize": 5242880 } Backend returns a temporary signed upload URL. Then: 

Browser ↓ S3 / Cloudinary The application server doesn't have to handle the actual large image payload. 

# **24. Complete Photo Upload** 

After successful storage upload: POST /api/v1/public/photo-upload/:token/complete 

{ 

"storageKey": "events/evt_123/functions/haldi/photo_123.jpg", 

"originalFileName": "IMG_1234.jpg", 

"mimeType": "image/jpeg", 

"size": 5242880 

} 

Backend creates the MongoDB photos document. 

# **25. Photo Upload Security** 

Because QR upload is publicly accessible, this endpoint needs stronger protection than normal authenticated endpoints. 

We should have: 

- Signed QR tokens 

- Rate limiting 

- Maximum file size 

- Allowed MIME types 

- Maximum number of uploads per request 

- Upload limits per QR token/IP 

- Malware/content scanning strategy where appropriate 

- Storage-side validation 

- Ability to revoke QR 

- Moderation status 

This is one of the areas I would explicitly cover in the security section of the system design. 

# **26. Notification APIs** 

Users can view application notifications: 

GET /api/v1/notifications 

Mark as read: 

PATCH /api/v1/notifications/:notificationId/read 

Mark all as read: POST /api/v1/notifications/read-all But we should **not expose queue internals through public APIs** . For example, we should not have an endpoint like: 

The application service creates a job internally. 

# **27. Activity APIs** 

**Event Activity** 

GET /api/v1/events/:eventId/activity Example response: { "items": [ { "id": "act_123", "actor": { "id": "usr_1", "name": "Rajesh Sharma" }, "action": "guest_party.created", "description": "Added Sharma Family", "createdAt": "2026-09-27T16:30:00Z" } ] } 

# **28. API Response Convention** 

I recommend a consistent response format. 

**Success** 

{ "data": {}, "meta": {} } For lists: { "data": [], "meta": { "page": 1, "limit": 20, "total": 87 } } 

We don't necessarily need pagination on every endpoint, but major lists should support it. 

# **29. Error Convention** 

All API errors should use the same shape. 

{ "error": { "code": "INVITATION_ALREADY_ACCEPTED", "message": "This invitation has already been accepted.", 

"details": {}, 

"requestId": "req_123" } } Useful HTTP codes: 

# **Status Meaning** 

|200|Successful request|
|---|---|
|201|Created|
|204|Successful, no response body|
|400|Malformed request|
|401|Not authenticated|
|403|Not authorized|
|404|Resource not found|
|409|Conflict|
|422|Validation error|
|429|Rate limited|
|500|Internal error|
|**30. AP**|**I Validation**|
|Every|write endpoint should validate input server-side.|
|I woul|d recommend a schema validation library such as**Zod**.|
|For ex|ample:|
|Reque|st|
|↓||
|Zod va|lidation|
|↓||
|Contr|oller|
|↓||
|Servic|e|
|Never|trust frontend validation alone.|



# **31. Date & Time Convention** 

I'd make this explicit: 

# **Database timestamps** 

Store timestamps in: 

**UTC** 

# **Event/function timezone** 

Store: 

Asia/Kolkata 

or another IANA timezone. 

# **API** 

Use ISO 8601 for timestamps. 

Example: 

2026-12-13T13:30:00Z 

Function-local schedule times can be represented appropriately using the event timezone. 

This prevents future timezone bugs if the application expands internationally. 

# **32. API Security** 

Because we're using cookie sessions, the architecture should include: 

# **Authentication** 

- HTTP-only cookies 

- Secure cookies in production 

- Session expiration 

- Session revocation 

- Password hashing with Argon2id or bcrypt 

- Email verification 

# **Authorization** 

- Event membership checks 

- Permission checks 

- Owner-only operations 

# **Browser security** 

- CORS restricted to known frontend origin 

- CSRF protection appropriate to the cookie/session setup 

- Security headers 

- Input validation 

# **Abuse prevention** 

- Rate limiting on login 

- Password reset 

- Invitation endpoints 

- QR upload endpoints 

- Public token endpoints 

# **33. Queue Integration** 

The APIs should remain asynchronous where appropriate. 

Example: 

POST /events/:eventId/invitations/:id/send 

│ ▼ 

Validate request 

│ ▼ 

Create notification/job 

│ ▼ 

Queue 

│ 

▼ 

Worker ▼ 

Resend 

The API response can be: 

{ 

"data": { "status": "queued" } } 

rather than waiting for Resend to actually finish sending. 

# **34. What the Frontend Should Never Do** 

The Next.js frontend should never: 

- Talk directly to MongoDB 

- Talk directly to Resend 

- Decide whether a manager has permission 

- Calculate authoritative budget totals 

- Decide whether RSVP count is valid 

- Generate trusted invitation tokens 

- Generate trusted QR upload tokens 

- Store the session token in localStorage 

The backend remains the source of truth. 

# **35. Recommended Route Organization** 

I'd structure Express approximately like: 

/api/v1 

│ `├` ── /auth `├` ── /events │    └── /:eventId │ `├` ── /functions │ `├` ── /guest-parties │ `├` ── /invitations │ `├` ── /rsvp │ `├` ── /members │ `├` ── /budget │ `├` ── /tasks │ `├` ── /albums │ `├` ── /activity │         └── /overview │ `├` ── /guest │    └── /invitations │ `├` ── /public │ `├` ── /invitations │ `├` ── /member-invitations │    └── /photo-upload │ └── /notifications This is a clean representation of the product. 

**36. One Important Design Decision: Don't Expose Internal IDs Blindly** 

MongoDB gives us ObjectIds, but the API doesn't necessarily need to expose raw MongoDB implementation details everywhere. 

We have two reasonable approaches: 

# **Option A** 

Use MongoDB ObjectId as API IDs. 

# **Option B** 

Use application IDs such as: 

evt_123 fun_123 

party_123 

inv_123 

I'd lean toward **application-level IDs** , especially for invitation and public-facing resources. 

It gives us a cleaner API and avoids making the database implementation part of the external contract. 

**37. The Core API Flow** 

The API design now supports the complete product journey: 

CREATE EVENT 

│ ▼ 

CREATE FUNCTIONS 

│ ▼ 

ADD GUEST PARTIES 

│ ▼ 

ASSIGN FUNCTION INVITES │ 

▼ 

SEND INVITATIONS │ ▼ EMAIL │ ▼ GUEST LOGIN / SIGNUP │ ▼ RSVP │ ▼ ORGANIZER DASHBOARD │ ┌─────────── `┼` ────────────┐ ▼ ▼ ▼ Budget       Tasks        Managers │ ▼ Collaboration 

Function │ ▼ QR Code │ ▼ 

Guest Photo Upload 

│ ▼ S3 / Cloudinary │ ▼ 

Function Album 

**My recommendation for the API decisions** 

I would lock these as our baseline: 

**REST API** 

**/api/v1 versioning JSON request/response Cookie-based server sessions Event-scoped authorization Zod validation** 

**Dedicated overview/dashboard endpoints for aggregate data Background queue for email/notifications Signed direct-to-storage photo uploads Public token endpoints only where necessary No WebSockets No GraphQL** 

V1 decisions: guests must register or sign in and claim their invitation before RSVP; RSVPs are submitted function-by-function; and managers receive only explicitly assigned permissions, with no broad manager access. Schedule items are separate MongoDB documents and have nested CRUD APIs under their function. 

