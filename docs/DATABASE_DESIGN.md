The most important thing is getting the **Event / Function / Guest Party / Invitation / RSVP** relationship right, because almost every other feature depends on it. 

# **1. Proposed MongoDB collections** 

I’d start with these: 

users events event_members 

functions schedule_items 

guest_parties event_invitations 

invitation_designs 

budgets budget_entries 

tasks 

albums photos 

notifications activity_logs 

sessions 

We don't need 30–40 collections for V1. 

# **2. users** 

All authenticated people live here: 

- Event owners 

- Event managers 

- Guests 

A user can have multiple roles across different events. 

Example: 

{ 

_id, name, 

email, emailNormalized, 

passwordHash, 

profileImage, emailVerifiedAt, 

status, 

createdAt, 

updatedAt 

} 

# **Important** 

# There is **no separate Guest collection** . 

A guest is simply a User who has been associated with an event through an invitation. 

That means the same person can later: 

- be a guest at one event 

- manage another event 

- own their own event 

**3. sessions** 

Since we're using: Email + Password + Cookie Sessions 

we need server-side session data. 

Something like: 

{ _id, userId, sessionTokenHash, expiresAt, createdAt, lastUsedAt, ipAddress, userAgent } 

We can use a TTL index on expiresAt. 

The exact session storage decision can be finalized along with our infrastructure/Redis decision. 

# **4. events** 

This is the primary entity. 

{ _id, ownerId, 

name, type, 

startDate, 

endDate, 

location: { name, address, city, state, country, coordinates }, description, coverImage, 

status, 

createdAt, updatedAt } Example: Event └── Rahul & Priya's Wedding Owner → Rahul Type → Wedding Start → 10 Dec End → 14 Dec 

I would **not embed functions, guests, photos, tasks, etc. inside the event document** . Those can grow and change independently. 

**5. event_members** 

This handles collaboration. { _id, eventId, userId, role: "owner" | "manager", 

permissions: [ "event.manage", "functions.manage", "guests.manage", "invitations.manage", "rsvp.manage", "budget.manage", "tasks.manage", "albums.manage" ], status, invitedBy, invitedAt, joinedAt, createdAt, updatedAt } 

This is better than putting managers directly inside events because authorization becomes much easier to query and extend. 

Example: 

Event │ `├` ── Rahul → Owner `├` ── Father → Manager └── Sister → Manager 

# **6. functions** 

Every sub-event gets its own document. 

{ _id, eventId, 

name, date, startTime, endTime, 

venue: { name, address }, 

description, dressCode, 

budgetAmount, 

createdAt, updatedAt } Example: functions 

Haldi Mehendi Sangeet Wedding Reception 

Every function is connected to exactly one event. 

# **6.1 schedule_items**

Each schedule item is a separate document belonging to exactly one function. This supports guest-visible schedule queries and independent item updates without growing the function document.

```js
{
  _id,
  eventId,
  functionId,
  title,
  startTime, // local time interpreted in the event timezone
  endTime,   // optional local time interpreted in the event timezone
  location,  // optional
  description,
  guestVisible,
  sortOrder,
  createdBy,
  createdAt,
  updatedAt
}
```

Every schedule item stores both `eventId` and `functionId` so the backend can enforce the event security boundary and verify that the function belongs to that event. Store schedule times as function-local times; interpret them using the event's IANA timezone.

# **7. guest_parties** 

This is where your **Sharma family concept** comes in. 

{ _id, eventId, 

partyName: "Sharma Family", 

primaryContact: { userId, name, email, phone 

}, 

notes, 

createdAt, updatedAt 

} 

The important thing is that the party is **event-specific** . 

For example: 

Event A └── Sharma Family 

Event B 

└── Sharma Family 

These are independent guest-party records even though the underlying user may be the same. 

# **8. event_invitations** 

This is the collection I'd like us to pay the most attention to. 

Instead of creating a separate invitation document for every individual function, I currently recommend: 

**One event invitation per guest party, containing the function invitations inside it.** 

Example: 

{ _id, 

eventId, 

guestPartyId, 

contactUserId, 

contactEmail, 

invitationStatus, 

functions: [ 

{ functionId, 

maxAttendees, 

rsvpStatus, 

attendingCount, 

respondedAt 

} ], 

sentAt, 

openedAt, 

createdAt, 

updatedAt 

} 

So: 

Sharma Family │ 

- `├` ── Haldi 

- │     max: 3 

- │     attending: 3 

│ 

`├` ── Sangeet 

│     max: 5 │     attending: 4 │ 

`├` ── Wedding │     max: 5 │     attending: 5 │ └── Reception 

max: 4 

attending: 4 

**Why I like this model** 

A family should generally receive **one event invitation** , rather than five separate emails just because they're attending five functions. 

The invitation can show all the functions they're invited to. 

# **9. RSVP** 

I would initially keep RSVP data **inside event_invitations** rather than creating a separate rsvps collection. 

At your scale, this is cleaner. 

Each function's RSVP is updated and saved independently, so other functions can remain pending. The primary contact must claim the invitation using an account whose email matches the invited email before responding.

For each function: 

{ 

functionId, 

maxAttendees: 5, rsvpStatus: "pending", attendingCount: 4, respondedAt 

} This gives us: Invited → Allowed → Responded → Attending without needing another entity. Later, if RSVP becomes significantly more sophisticated, we can separate it. 

# **10. Invitation Security** 

The guest's invitation email will contain a secure link. 

We should not store raw access tokens. 

Conceptually: 

{ 

invitationAccessTokenHash, 

tokenExpiresAt 

# } 

The actual token is sent to the guest. 

Database stores only a secure representation. 

This gives us: 

- Revocation 

- Expiration 

- Secure guest access 

- Invitation tracking 

# **11. Invitation Designs** 

We need a place to save: 

Selected template + organizer customization. I'd create: invitation_designs Example: 

{ _id, eventId, 

templateKey, 

theme: { primaryFont, secondaryFont, background, layout }, content: { headline, message, hostNames, customText }, 

assets: [ { type, storageKey } ], 

createdAt, 

updatedAt 

} 

The predefined templates themselves can live in the application rather than being stored in MongoDB. 

MongoDB stores the **user's selected/customized version** . 

# **12. Budget** 

I'd divide budget information into two concepts: 

# **budgets** 

The planned allocation. 

{ _id, eventId, 

totalBudget, 

functionAllocations: [ 

{ functionId, allocatedAmount 

} ], 

categoryAllocations: [ 

{ category, allocatedAmount 

} 

], 

createdAt, 

updatedAt } 

Example: Wedding Budget ₹15,00,000 

Haldi       ₹1,00,000 Sangeet     ₹3,00,000 Wedding     ₹8,00,000 Reception   ₹3,00,000 

# **13. budget_entries** 

Even though this isn't accounting software, I recommend storing individual spending entries. 

Example: 

{ _id, eventId, functionId, 

category: "Food", 

description: "Catering", 

amount: 85000, 

spentAt, 

notes, 

createdBy, 

createdAt, 

updatedAt } Then: 

Budget 

₹15,00,000 

Budget Entries 

₹50,000 ₹85,000 ₹20,000 ₹1,50,000 ... 

↓ calculate 

Spent 

₹11,25,000 

This is still a **budget manager** , not an accounting system. 

The organizer doesn't need complicated accounting workflows. 

**14. tasks** { _id, eventId, functionId, title, description, assignedTo, priority, status, dueDate, createdBy, createdAt, updatedAt } functionId can be optional. That gives us: Event Task "Finalize guest transportation" 

Function Task "Confirm Sangeet DJ" 

# **15. albums** 

Every function gets one album. 

{ _id, eventId, functionId, 

name, 

uploadEnabled, 

qrTokenHash, 

photoCount, 

coverPhotoId, 

createdAt, updatedAt } Example: Haldi └── Haldi Album └── QR token 

Sangeet 

└── Sangeet Album 

└── QR token 

**16. photos** MongoDB stores metadata only. { _id, eventId, functionId, albumId, 

storageProvider: "s3", storageKey, 

originalFileName, mimeType, 

size, width, height, 

uploadedByUserId, // nullable for anonymous QR upload 

moderationStatus, 

createdAt, updatedAt } 

Actual image: 

S3 / Cloudinary 

MongoDB: 

photo metadata + storage reference 

# **17. Anonymous QR Upload** 

Because the QR upload should be frictionless, someone can scan: 

Haldi QR 

↓ 

Haldi upload page without logging in. The database relationship is: 

QR token 

↓ 

# Album 

↓ 

Function 

↓ 

Event 

The upload service verifies the QR token before allowing the upload. 

This is one area where security and rate limiting will matter a lot. 

# **18. notifications** 

For application-level notification records: 

{ _id, 

userId, 

eventId, type, title, message, channel: "email", status, readAt, 

createdAt } The actual queued job should live in the **queue system** , not MongoDB. So: MongoDB └── Notification record Queue └── Notification job Resend └── Email delivery This separation is important. 

**19. activity_logs** Since multiple family members can edit the same event: { 

_id, 

eventId, 

actorUserId, 

action, entityType, 

entityId, 

metadata, 

createdAt 

} 

Examples: 

Father changed wedding venue 

Mother added Sharma Family 

Rahul created Sangeet 

Sister sent 50 invitations 

This gives us an audit trail without putting history directly into every document. 

# **20. Overall Relationship** 

The database would conceptually look like: 

USERS │ ┌──────────── `┼` ────────────┐ 

│            │            │ owns        manages       invited │            │            │ ▼ ▼ ▼ EVENTS │ ┌──────────────────── `┼` ────────────────────┐ │                    │                    │ ▼ ▼ ▼ FUNCTIONS / SCHEDULE_ITEMS   EVENT MEMBERS        GUEST PARTIES │                                         │ │                                         │ `├` ───────────────┐ ▼ │               │                  EVENT INVITATIONS ▼ ▼ │ ALBUM           BUDGET                      │ │               │                         │ ▼ ▼ ▼ PHOTOS      BUDGET ENTRIES                RSVP EVENT │ `├` ── TASKS `├` ── NOTIFICATIONS └── ACTIVITY LOGS **21. Indexes** 

Indexes will be very important even at modest scale, because most application queries are event-scoped. 

I would expect indexes roughly like: 

users 

emailNormalized → unique 

events 

ownerId 

createdAt 

event_members 

eventId + userId → unique 

userId + eventId 

functions 

eventId + date 

schedule_items

eventId + functionId + startTime

eventId + functionId + sortOrder

guest_parties 

eventId + primaryContact.email 

event_invitations 

eventId + guestPartyId → unique contactUserId 

eventId + functions.functionId 

tasks 

eventId + status assignedTo + status 

budget_entries 

eventId + functionId 

eventId + category 

photos 

albumId + createdAt functionId + createdAt 

activity_logs 

eventId + createdAt We can refine these after designing the actual query patterns. 

# **22. What I Would NOT Store** 

A few things should deliberately stay outside MongoDB: 

# **Actual photos** 

→ S3/Cloudinary 

# **Email queue jobs** 

→ Queue system 

**Large image files** 

→ S3/Cloudinary 

# **Predefined invitation templates** 

→ Application/template layer, unless we later need database-managed templates This keeps MongoDB focused on application state and metadata. 

# **23. One Important MongoDB Principle** 

I would use: 

# **Event ID as the primary security/data boundary.** 

Most event-specific documents should contain: 

eventId 

So every important backend query becomes conceptually: 

Does this authenticated user have access to event X? 

↓ 

What document belongs to event X? 

↓ 

Perform operation 

This is extremely important because a user might belong to: 

Event A Event B Event C 

and must never accidentally access data from another event. 

**25. Decisions Locked for V1** 

The following product decisions are reflected in this schema. 

**A. Invitation behavior** 

**One invitation email per family/event** , containing all functions they're invited to. Example: 

You're invited to Rahul & Priya's Wedding 

✓ Haldi — up to 3 ✓ Sangeet — up to 5 ✓ Wedding — up to 5 ✓ Reception — up to 4 

The primary contact registers or signs in and claims the invitation before responding. They can save an RSVP for each function independently. 

# **B. Budget entry behavior** 

**Organizer enters individual spending items** , and the system calculates "Spent." Example: 

Budget: ₹3,00,000 

Catering      ₹80,000 Decoration    ₹45,000 DJ            ₹25,000 

Spent:       ₹1,50,000 Remaining:   ₹1,50,000 This gives you accurate numbers while keeping the UI simple. 

Use this model for V1. 

# **C. Guest party RSVP** 

For a guest party with five allowed attendees, the primary contact enters one attending count per function (for example, four). V1 does not collect attendee names or adult/child breakdowns. Managers receive explicit, configurable module permissions; V1 does not grant broad manager access. 

