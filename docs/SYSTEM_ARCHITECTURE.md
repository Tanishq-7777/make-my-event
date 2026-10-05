**Make My Event — Architecture Decisions Summary** 

# **1. Product Architecture** 

**Architecture style:** Modular Monolith 

We will build one cohesive product rather than microservices, but internally separate the codebase into clear modules. 

Make My Event 

│ `├` ── Authentication 

`├` ── Users `├` ── Events `├` ── Functions `├` ── Guests `├` ── Invitations `├` ── RSVP `├` ── Collaboration `├` ── Budget `├` ── Tasks `├` ── Albums `├` ── Photos `├` ── Notifications `├` ── Email └── Activity 

This fits the expected scale and keeps development and deployment relatively simple. 

**2. Expected Scale** 

For the initial product: 

**~100 guests per event** 

This means we do **not** need to architect for massive event traffic initially. 

The architecture should nevertheless avoid obvious scalability problems, particularly around: 

- Image uploads 

- Email sending 

- Background notifications 

- Database queries 

- Authentication/session handling 

We can scale individual components later without prematurely introducing microservices. 

# **3. Frontend** 

**Technology:** Next.js 

**Deployment:** Vercel 

The frontend will provide: 

- Organizer dashboard 

- Event management UI 

- Manager interface 

- Guest invitation/RSVP interface 

- Photo upload interface 

- Album interface 

- Authentication screens 

Next.js will be the primary frontend framework. 

# **4. Backend** 

**Technology:** Node.js + Express 

Rather than using Next.js API routes as our primary backend, we're going with a **separate Express backend** . 

Architecture: 

Browser 

│ `├` ────────────── ► Next.js / Vercel │ └────────────── ► Express API / Backend │ ▼ 

MongoDB Atlas 

This gives us a clear separation between: 

# **Frontend application** 

and 

# **Backend/business logic/API.** 

Even though they're separate deployments, we will still treat the overall product as a **modular monolithic system** , not microservices. 

# **5. Database** 

**Database:** MongoDB Atlas 

MongoDB will store application data such as: 

- Users 

- Events 

- Functions 

- Guest parties 

- Invitations 

- RSVP records 

- Managers 

- Permissions 

- Budgets 

- Tasks 

- Albums 

- Photo metadata 

- Notifications 

- Activity logs 

We will use **MongoDB Atlas managed by MongoDB.com** , rather than self-hosting MongoDB. 

# **6. Image/File Storage** 

You have shortlisted: 

**Amazon S3 or Cloudinary** 

The important architecture decision is: 

# **Photos themselves will not be stored in MongoDB.** 

MongoDB stores metadata/reference information. 

For example: 

Photo 

- `├` ── eventId 

- `├` ── functionId 

- `├` ── albumId 

- `├` ── uploadedBy 

- `├` ── storageKey / public reference 

- `├` ── status 

└── timestamps 

Actual image: 

Object Storage └── Event └── Function └── image files 

**My preference for this product** 

I'd lean toward **S3** for the core architecture because it keeps storage independent from your application and gives us a straightforward path to signed/direct browser uploads. Cloudinary is attractive if we want image transformation, optimization, thumbnails, and delivery capabilities handled for us. 

**Decision status:** S3 or Cloudinary — final provider can be selected during the detailed architecture/design stage. 

# **7. Authentication** 

**Authentication:** Email + Password 

All registered users will have accounts. 

This includes: 

- Event Owners 

- Event Managers 

- Guests 

The guest model is now confirmed: 

**A guest must log in to confirm the invitation and submit RSVP.** 

Guest invitation email → login/sign up → invitation → RSVP. 

# **8. Sessions** 

**Session mechanism:** Cookie-based sessions. 

We will not use a client-side token-only authentication model as our primary approach. 

The intended concept is: 

Login 

↓ 

Server validates credentials 

↓ 

Session created 

↓ 

Secure cookie 

↓ 

Browser sends cookie 

↓ 

Backend validates session 

We'll need to define the exact session storage strategy in the architecture document. 

One likely approach is storing session information server-side rather than putting all authorization information into the cookie. 

# **9. Guest Access** 

The guest does **not** need to be treated as an anonymous user for RSVP. The flow is: 

Invitation Email 

↓ 

Invitation Link 

↓ 

Login / Sign Up ↓ Guest Account ↓ Invitation ↓ 

Accept / Decline 

↓ 

RSVP 

The guest account is therefore part of the product's authentication model. 

**10. Family / Guest Party Model** 

We will support inviting a **family/group through one primary contact** . 

Example: 

Guest Party 

Sharma Family 

Contact: 

Radha Sharma 

Email: 

radha@example.com 

Allowed attendees: 

5 

Radha can RSVP: 

4 people attending 

We don't need individual accounts for every family member. 

This is especially important for the expected event model. 

# **11. Function-Level Guest Management** 

An event can contain many functions/sub-events. 

Example: 

Wedding 

│ 

`├` ── Haldi 

`├` ── Mehendi 

- `├` ── Sangeet 

`├` ── Wedding └── Reception 

The same guest party can have different invitation/attendance limits per function. 

Example: 

Sharma Family 

Haldi       → 3 allowed Sangeet     → 5 allowed Wedding     → 5 allowed Reception   → 4 allowed 

This needs to be a fundamental part of the data model. 

# **12. Event Managers** 

An Event Owner can invite family members or other people to help manage an event. Example: 

Owner 

↓ 

Invites Father 

↓ 

Father becomes Event Manager 

↓ 

Father can edit/delete permitted event data 

The initial architecture will support: 

- Owner 

- Manager 

with authorization/permissions. 

We're also leaving room for more granular roles later. 

# **13. Permissions** 

The owner has full control. 

Managers can be given management capabilities such as: 

- Event management 

- Function management 

- Guest management 

- Invitation management 

- RSVP management 

- Budget management 

- Task management 

- Album management 

V1 uses explicit, configurable module permissions for each manager. A `manager` membership by itself grants no access; each protected action requires the corresponding permission, and the owner retains full control. V1 does not provide a broad manager access level. 

# **14. Email** 

**Primary email provider:** Resend 

Email is a major part of the application. 

Expected use cases: 

- Guest invitations 

- Manager invitations 

- RSVP confirmations 

- RSVP reminders 

- Event reminders 

- Event updates 

- Authentication-related emails 

We should abstract the email functionality behind our own application service rather than tightly coupling business logic to Resend. 

Conceptually: 

Application 

↓ 

Email Service 

↓ 

Resend 

↓ 

Recipient 

That makes changing providers later much easier. 

# **15. Event Notification Queue** 

Confirmed: 

**We will use a background notification/job queue.** 

This is important because email and reminders shouldn't block normal user requests. Example: 

Organizer sends 100 invitations 

↓ 

API creates notification jobs 

↓ Queue 

↓ 

Background worker 

↓ 

Resend 

↓ 

Guests 

This will also support future jobs such as: 

- RSVP reminders 

- Event reminders 

- Notification delivery 

- Cleanup jobs 

- Other scheduled processes 

# **16. WebSockets** 

# **Not included initially.** 

We will use regular HTTP/API communication. 

Therefore, the first version won't have: 

- Real-time dashboard updates 

- Live RSVP counters 

- Real-time activity feeds 

- WebSocket-based notifications 

We can add real-time capabilities later if actual product usage demonstrates the need. 

This keeps the initial architecture simpler. 

# **17. Expense / Budget Manager** 

The product will have an **Expense/Budget Manager** , not a full accounting system. 

The primary goal: 

**Budget allocated vs amount spent vs amount remaining.** 

Example: 

Wedding Budget 

₹15,00,000 

Spent 

₹11,25,000 

Remaining 

₹3,75,000 

We will likely support: 

- Event budget 

- Function budget 

- Category budget 

- Spending entries 

- Automatic spent calculation 

- Remaining budget 

But we're explicitly **not building accounting software** . 

# **18. Function-Specific Albums** 

Every function gets its own album. 

# Wedding 

│ 

- `├` ── Haldi Album 

- `├` ── Mehendi Album `├` ── Sangeet Album `├` ── Wedding Album └── Reception Album The album is directly connected to the function. 

# **19. QR Photo Upload** 

Every function gets a unique QR code. 

Example: 

Haldi 

↓ 

Haldi QR Code 

↓ 

Photo Upload Page 

↓ Upload photos 

↓ 

Haldi Album 

The QR should identify the destination function. 

The photo upload experience should be as frictionless as possible. 

The QR/photo flow does **not need to force the guest through the normal organizer dashboard** . 

# **20. Photo Metadata** 

**MongoDB:** photo metadata **Object storage:** actual image file This is confirmed. 

We'll design the exact upload flow later, but I recommend: 

Guest Browser 

↓ 

Backend authorization 

↓ 

Signed upload URL 

↓ 

S3/Cloudinary 

↓ 

Photo metadata saved in MongoDB 

This prevents our Express server from becoming an unnecessary middleman for large image files. 

# **21. AI** 

**No AI in V1.** 

The initial product is entirely manual. 

Normal application automation is allowed: 

- Automatically calculate RSVP totals 

- Automatically calculate remaining budget 

- Automatically create a function album 

- Automatically generate function QR code 

- Automatically update dashboard statistics 

- Automatically send scheduled reminders 

But there will be **no AI Event Assistant or AI planning functionality** in the current scope. 

AI is future roadmap only. 

# **22. Deployment** 

Current deployment direction: 



<!-- Start of picture text -->
                 Internet<br>                    │<br>          ┌───────── ┴ ─────────┐<br>          │                   │<br>▼ ▼<br><!-- End of picture text -->

Next.js / Vercel     Express / Backend 



Render / Railway / 

AWS / other 



MongoDB Atlas 

│ ┌──────────── `┴` ────────────┐ │                         │ 

S3 / Cloudinary              Resend 

**Confirmed** 

**Frontend → Vercel** 

# **Backend → separate hosting provider** 

# **Database → MongoDB Atlas** 

# **Still open** 

Exact backend hosting provider: 

- Render 

- Railway 

- AWS 

- Other 

For ~100 guests/event, we don't need to optimize prematurely for massive infrastructure. 

# **23. Current Technology Stack** 

|**Layer**|**Decision**|
|---|---|
|Architecture|Modular Monolith|
|Frontend|Next.js|



Frontend Hosting Vercel 

Backend Node.js + Express Backend Hosting Render / Railway / AWS / TBD Database MongoDB Atlas Authentication Email + Password Sessions Cookie-based Email Resend Background Jobs Notification/Event Queue Real-time None / No WebSockets Image Storage S3 or Cloudinary Photo Metadata MongoDB 

# **Layer Decision** 

AI None in V1 

# **24. Things We Have Not Yet Locked** 

I don't think we need to make all of these decisions right now, but they should be addressed before the architecture document is finalized: 

**Backend hosting:** Render vs Railway vs AWS. 

**Queue technology:** For example, BullMQ + Redis versus a managed queue/service. 

**Session storage:** Exactly where server-side sessions will live. 

**Image provider:** S3 vs Cloudinary. 

**API style:** REST is my current recommendation for this application. 

**Frontend/backend repository structure:** Monorepo vs separate repositories. 

**Permission granularity:** Locked for V1: managers receive only explicitly assigned module permissions; there is no broad manager access level. 

**Database modeling:** Exact MongoDB collections, indexes, embedding vs references. 

# **My recommended baseline** 

Putting everything together, I'd currently build it as: 

┌─────────────────────────┐ │       Next.js            │ │       Vercel             │ │                          │ │ Organizer / Manager UI   │ │ Guest UI                 │ └──────────── `┬` ────────────┘ │ HTTPS │ 

┌──────────── ▼ ────────────┐ │    Node.js + Express    │ │                         │ │     Modular Monolith    │ │                         │ │ Auth                     │ │ Events                   │ │ Functions                │ │ Guests                   │ │ Invitations              │ │ RSVP                     │ │ Collaboration            │ │ Budget                   │ │ Tasks                    │ │ Albums                   │ │ Notifications            │ └────── `┬` ──────── `┬` ──────────┘ │        │ ┌────── ▼ ───┐  ┌─ ▼ ───────────┐ │ MongoDB  │  │ Job/Queue   │ │  Atlas   │  │             │ └──────────┘  └───── `┬` ───────┘ │ ┌──── ▼ ────┐ │ Resend  │ └─────────┘ 

Photos ─────────────── ► S3 / Cloudinary 

Metadata ───────────── ► MongoDB Atlas 

This is a good starting point for the scale and feature set you've defined, without introducing unnecessary distributed-system complexity. 

**I would consider everything above approved only after you review it. Once you approve this baseline, the next step is the actual System Design Architecture document, where we'll go considerably deeper into component boundaries, database schema, API contracts, authentication/session flows, permission model, queue architecture, photo upload flow, security, deployment, and failure handling.** 

