**Product Requirements Document — Make My Event** 

# **1. Product Overview** 

**Product name:** Make My Event **Product type:** Web application **Primary users:** Individuals and families planning and managing events **Initial communication channel:** Email **AI:** Not included in V1 

# **Product vision** 

Make My Event is a collaborative digital platform that allows an individual or family to plan, manage, and coordinate an entire event from one place. 

An event can contain multiple **sub-events/functions** , each with its own guests, RSVP information, budget, tasks, schedule, and photo album. 

The platform should reduce the need to manage event information across spreadsheets, messaging apps, email threads, paper lists, and separate photo-sharing tools. 

# **2. Problem Statement** 

Planning an event can involve many disconnected activities: 

- Managing guest lists 

- Knowing which guests are attending which function 

- Sending invitations 

- Collecting RSVPs 

- Tracking the number of people coming with a family 

- Managing multiple event functions 

- Coordinating family members 

- Tracking budgets 

- Managing tasks 

- Sharing event information 

- Collecting photographs 

- Keeping everything organized 

This becomes especially complicated for events such as Indian weddings, where a single event can contain several functions with different guests, venues, schedules, and budgets. 

Make My Event brings these activities into one centralized platform. 

# **3. Product Goals** 

# **Primary goals** 

1. Allow users to create and manage complete events. 

2. Allow an event to contain multiple functions/sub-events. 

3. Allow family members to collaboratively manage an event. 

4. Make guest and family-party management simple. 

5. Allow function-specific invitations and RSVPs. 

6. Provide a simple budget-vs-spending management system. 

7. Provide function-specific photo albums. 

8. Allow guests to upload photos without creating accounts. 

9. Centralize event information for organizers and guests. 

10. Reduce the administrative effort involved in event planning. 

# **Secondary goals** 

- Make the product useful for many types of events. 

- Build an architecture that can later support WhatsApp. 

- Keep guest interaction friction extremely low. 

- Establish a foundation for future AI features without including AI in V1. 

# **4. Non-Goals / Out of Scope for V1** 

The following should **not** be built initially: 

- AI Event Assistant 

- AI-generated event planning 

- AI-generated invitations 

- AI budget recommendations 

- AI photo categorization 

- WhatsApp integration 

- SMS integration 

- Complex accounting/bookkeeping 

- Vendor marketplace 

- Accommodation management 

- Transportation management 

- Seating arrangement system 

- Native mobile applications 

The architecture should leave room for these capabilities later, but they should not expand the initial scope. 

# **5. User Types** 

# **5.1 Event Owner** 

The person who creates the event. 

Example: 

Rahul creates "Rahul & Priya's Wedding." 

The owner has complete control. 

# **Permissions** 

- Create/edit/delete event 

- Create/edit/delete functions 

- Manage guests 

- Manage invitations 

- Manage RSVP 

- Manage budget 

- Manage tasks 

- Manage albums 

- Invite managers 

- Assign permissions 

- Remove managers 

- Delete event 

# **5.2 Event Manager** 

A family member or trusted person invited by the owner to help manage the event. Example: 

Rahul invites his father as Event Manager. 

Depending on permissions, the manager can: 

- Edit event 

- Manage functions 

- Manage guests 

- Manage invitations 

- Manage RSVP 

- Manage budget 

- Manage tasks 

- Manage albums 

The owner remains the highest-level authority. 

# **5.3 Guest / Invitee** 

Guests **do not create accounts** . 

They interact through secure email invitation links. 

They can: 

- Open invitation 

- Accept/decline 

- Provide RSVP 

- Specify number of attendees 

- View relevant event information 

- Receive reminders 

- Access photo upload 

- Upload photos 

# **6. Event Model** 

The central data structure is: 

Event 

│ 

- `├` ── Functions / Sub-events 

- │ `├` ── Guests 

- │ `├` ── RSVP │ `├` ── Budget 

- │ `├` ── Tasks 

- │ `├` ── Schedule 

- │ `├` ── Album 

- │   └── QR Code 

│ 

- `├` ── Event-level Guests 

- `├` ── Event-level Budget 

- `├` ── Event-level Tasks 

- `├` ── Managers 

└── Event Settings 

This structure must support any event type. 

**Wedding example** 

Rahul & Priya's Wedding 

│ 

- `├` ── Mehendi 

`├` ── Haldi 

- `├` ── Sangeet 

- `├` ── Wedding └── Reception 

**Birthday example** 

Rahul's 30th Birthday 

│ 

- `├` ── Family Lunch 

- `├` ── Friends Party └── Dinner 

The application should **not hard-code wedding-specific functionality into the core architecture** . 

# **7. Event Management** 

# **7.1 Create Event** 

Required information: 

- Event name 

- Event type 

- Start date 

- End date 

- Location 

- Description 

- Cover image 

- Overall budget 

**Event types** 

Initial predefined options: 

- Wedding 

- Birthday 

- Anniversary 

- Engagement 

- Baby Shower 

- Party 

- Religious Event 

- Family Gathering 

- Corporate Event 

- Other 

# **7.2 Event Dashboard** 

The dashboard is the main command center. 

It should show: 

# **Event overview** 

- Event name 

- Event dates 

- Countdown 

- Location 

# **Functions** 

- Number of functions 

- Upcoming function 

- Function timeline 

# **Guests** 

- Total invited 

- Total allowed attendees 

- Confirmed 

- Pending 

- Declined 

# **Budget** 

- Total budget 

- Amount spent 

- Remaining budget 

# **Tasks** 

- Total tasks 

- Pending 

- Completed 

- Overdue 

# **Activity** 

Recent changes: 

Father added 12 guests 

Rahul updated wedding venue 

5 guests accepted invitation 

# **8. Function / Sub-Event Management** 

Every event can have multiple functions. 

# **Create Function** 

Fields: 

- Function name 

- Date 

- Start time 

- End time 

- Venue 

- Description 

- Dress code 

- Budget 

- Cover image 

Examples: 

Haldi Mehendi Sangeet Wedding Reception 

# **Function Dashboard** 

Each function should have its own management page containing: 

- Function details 

- Guest list 

- RSVP status 

- Budget 

- Tasks 

- Schedule 

- Album 

- QR code 

- Invitation information 

# **9. Guest & Family Management** 

This is a core module. 

# **9.1 Guest Contact** 

The organizer can create an invitation contact. 

Example: 

# **Radha Sharma** 

- Name 

- Email 

- Phone — optional 

- Family/party name 

- Notes 

The email is the primary communication identifier. 

# **10. Guest Party / Family Invitation** 

The system must support family/group invitations. 

Example: 

**Party name:** Sharma Family **Contact:** Radha Sharma **Email:** <u>radha@example.com</u> **Allowed attendees:** 5 

The organizer does **not** need to enter all five family members individually. 

**RSVP** 

The family receives: 

You are invited with up to 5 people. 

They can respond: 

**4 people attending** The system records: Sharma Family 

Allowed: 5 Confirmed: 4 

# **11. Function-Specific Guest Assignment** 

A guest party can be invited to different functions. 

Example: 

**Function Allowed** 

Mehendi 3 Sangeet 5 Wedding 5 

# **Function Allowed** 

Reception 5 

Therefore guest assignment must exist at the **function level** . 

# **12. Invitation Management** 

# **Invitation Templates** 

The platform provides predefined invitation templates. 

Templates should support: 

- Event name 

- Host names 

- Date 

- Time 

- Venue 

- Description 

- Images 

- RSVP action 

# **Invitation Customization** 

Organizer can customize supported template fields. 

The invitation should pull event information dynamically. 

For example, if the venue changes, the system should be capable of reflecting the updated event information rather than requiring the organizer to manually recreate everything. 

# **13. Email Invitations** 

V1 communication channel: 

# **Email** 

Organizer can send invitations to selected guests. 

The system should track: 

- Invitation created 

- Sent 

- Opened — if technically supported 

- Accepted 

- Declined 

- RSVP pending 

# **14. Guest RSVP** 

Guests should be able to RSVP without creating an account. 

# **RSVP flow** 

Email ↓ Open invitation ↓ View invitation ↓ 

Accept / Decline 

↓ 

Select number attending 

↓ 

Submit For function-specific invitations: Mehendi → 3 attending Sangeet → 5 attending Wedding → 5 attending Reception → 4 attending 

# **15. RSVP Dashboard** 

Organizer sees: 

**Overall** 

- Total invited parties 

- Total allowed attendees 

- Total confirmed attendees 

- Pending responses 

- Declined 

# **Per function** 

Example: 

# **Wedding** 

Invited parties: 75 Allowed attendees: 210 Confirmed: 182 Pending: 20 Declined: 8 

# **16. RSVP Reminders** 

The system can send reminder emails to guests who haven't responded. 

Organizer should be able to: 

- See pending RSVPs 

- Send reminder 

- Potentially schedule reminders later 

# **17. Event Managers / Collaboration** 

Owner can invite another person to manage the event. 

# **Flow** 

Owner 

↓ 

Invite manager 

↓ 

Manager receives email 

↓ 

Manager creates/logs into account ↓ Manager joins event ↓ 

Manager receives assigned permissions 

**18. Roles & Permissions** 

Initial roles: 

**Owner** 

Full control. 

# **Manager** 

Can manage the event according to assigned permissions. 

The permission system should eventually support: 

- Event management 

- Function management 

- Guest management 

- Invitation management 

- RSVP management 

- Budget management 

- Task management 

- Album management 

This allows future roles such as: 

Guest Manager Budget Manager Invitation Manager without redesigning the entire authorization system. 

# **19. Expense / Budget Manager** 

The application will use the terminology **Budget Manager** , rather than positioning this as accounting software. 

Its purpose is: 

**Budget allocated vs amount spent.** 

**Overall Event** 

Example: 

**Budget:** ₹15,00,000 **Spent:** ₹11,25,000 **Remaining:** ₹3,75,000 

# **Function Budget** 

Example: 

**Haldi** 

Budget: ₹1,00,000 Spent: ₹80,000 Remaining: ₹20,000 

# **Categories** 

Potential categories: 

- Venue 

- Food 

- Decoration 

- Photography 

- Entertainment 

- Clothing 

- Transport 

- Invitations 

- Gifts 

- Other 

# **20. Budget Dashboard** 

Show: 

- Total budget 

- Total spent 

- Remaining 

- Percentage utilized 

- Function-level budgets 

- Category-level budgets 

- Over-budget areas 

The emphasis is on **visibility and planning** , not detailed financial accounting. 

# **21. Task Management** 

Events involve many tasks. 

Examples: 

- Confirm venue 

- Book photographer 

- Finalize invitation 

- Confirm catering 

- Purchase decorations 

Each task can contain: 

- Task name 

- Description 

- Assigned manager 

- Due date 

- Priority 

- Status 

- Function 

- Notes 

Statuses: 

- To Do 

- In Progress 

- Completed 

- Overdue 

# **22. Event Schedule** 

Organizers can create a schedule for each function. 

Example: 

# **Wedding** 

7:00 PM — Baraat 

8:00 PM — Ceremony 

10:00 PM — Dinner 

Schedule items: 

- Name 

- Time 

- Location 

- Description 

Relevant schedule information can be visible to guests. 

# **23. Photo Albums** 

Every function gets a separate album. 

Example: 

Wedding 

- │ `├` ── Haldi Album 

- `├` ── Mehendi Album 

- `├` ── Sangeet Album `├` ── Wedding Album └── Reception Album The album is automatically associated with its function. 

# **24. QR Photo Upload** 

Every function receives a unique QR code. 

Example: 

# **Haldi** 

HALDI 

[ QR CODE ] 

Scan to share your photos 

Scanning opens a mobile-friendly photo upload page. 

# **25. Guest Photo Upload** 

Guests do **not** need accounts. 

Flow: 

Scan QR 

↓ 

Photo upload page 

↓ Select photos 

↓ 

Upload ↓ Success The QR code identifies the relevant function. Therefore: Haldi QR → Haldi album Wedding QR → Wedding album Reception QR → Reception album Guests shouldn't have to manually choose the album. 

# **26. Album Management** 

Organizer/manager can: 

- View photos 

- Delete photos 

- Hide photos 

- Moderate uploads 

- View album 

- Share album 

Future possibilities: 

- Likes 

- Comments 

- Downloads 

- Slideshow 

These are not necessary for the first implementation. 

# **27. Event Communication** 

Initial communication: 

**Email** 

Used for: 

- Invitations 

- RSVP confirmation 

- RSVP reminders 

- Event reminders 

- Event updates 

- Manager invitations 

Future: 

- WhatsApp 

- SMS 

- Push notifications 

# **28. Event Announcements** 

Organizer/manager can publish event updates. 

Example: 

# **Venue Update** 

The wedding venue has changed to Taj Palace. 

Guests can receive the update through email. 

# **29. Activity History** 

Because multiple managers can modify an event, the system should maintain an activity log. 

Examples: 

Rahul added Radha Sharma. 

Father changed the Sangeet venue. 

Mother sent 42 invitations. 

4 guests accepted the wedding invitation. 

This provides transparency between family members. 

# **30. Security & Access** 

Because guests use invitation links rather than accounts, security is particularly important. 

The system should use: 

- Secure unique invitation links 

- Secure photo-upload links 

- Expirable/revocable access tokens where appropriate 

- Permission checks 

- Owner/manager authorization 

- Protected event data 

- Protected management dashboard 

A guest should only be able to access the information associated with their invitation. 

# **31. Key User Journeys** 

**Journey 1 — Create Event** 

Sign up 

↓ Create Event 

↓ 

Enter event details 

↓ 

Create functions 

↓ 

Set budgets 

↓ Add family managers 

↓ 

Add guests 

↓ Send invitations 

# **Journey 2 — Add Family Manager** 

Event Owner 

↓ Event Settings ↓ Invite Manager 

↓ Enter email ↓ Select permissions ↓ Send invitation 

↓ Manager accepts ↓ Manager gets access 

**Journey 3 — Invite Family** 

Add Guest Party ↓ Sharma Family ↓ Contact: Radha Sharma 

↓ 

Email ↓ Allowed attendees: 5 ↓ Assign functions ↓ Send invitation 

**Journey 4 — Guest RSVP** 

Invitation Email ↓ Open Invitation ↓ View Event ↓ Accept ↓ Number attending: 4 ↓ Submit RSVP ↓ Confirmation No guest account. 

**Journey 5 — Upload Photos** Guest at Event ↓ Scan Function QR 

↓ 

Haldi Photo Upload 

↓ Select Photos ↓ Upload 

↓ 

Photos → Haldi Album 

# **32. Main Application Navigation** 

For the organizer/manager dashboard, I suggest: 

Dashboard Events Guests Tasks Budget Invitations Albums Notifications Settings When inside a specific event: 

Event Overview Functions Guests Invitations RSVP Budget Tasks 

Schedule 

Albums 

Managers 

Activity 

Settings 

The exact information architecture can be refined during the UI/UX phase. 

# **33. MVP Definition** 

For the first production version, I would consider the following mandatory: 

# **Authentication** 

- Organizer account 

- Manager account 

- Login 

- Registration 

- Password recovery 

# **Events** 

- Create/edit/delete event 

- Event dashboard 

- Event types 

- Event dates 

# **Functions** 

- Create/edit/delete function 

- Function dashboard 

- Function schedule 

- Function budget 

# **Guests** 

- Guest parties 

- Contact person 

- Email 

- Allowed attendee count 

- Function assignment 

- Guest search/filter 

# **Invitations** 

- Templates 

- Customization 

- Email sending 

- Invitation status 

# **RSVP** 

- No-account RSVP 

- Function-level RSVP 

- Number of attendees 

- RSVP dashboard 

- Reminder emails 

# **Collaboration** 

- Invite managers 

- Roles 

- Permissions 

# **Budget** 

- Event budget 

- Function budget 

- Category budget 

- Amount spent 

- Remaining budget 

# **Tasks** 

- Create 

- Assign 

- Due date 

- Status 

- Priority 

# **Albums** 

- Function albums 

- QR generation 

- Guest uploads 

- Album management 

# **Communication** 

- Email notifications 

- RSVP reminders 

- Event updates 

# **Activity** 

- Basic activity log 

# **34. V1 Success Criteria** 

We should eventually validate the product against measurable outcomes. 

Potential metrics: 

# **Event creation** 

- % of new users who create an event 

- Time from registration to event creation 

- Functions created per event 

# **Guest management** 

- Average guests added 

- Invitations sent 

- Invitation acceptance rate 

- RSVP completion rate 

# **Collaboration** 

- Managers invited per event 

- % of events using collaboration 

# **Budget** 

- % of events where a budget is created 

- Budget updates per event 

# **Photos** 

- QR scans 

- Photos uploaded 

- Functions with photo uploads 

# **Overall** 

The most important question: 

# **Can a family successfully plan and manage a real event using Make My Event without needing to maintain separate spreadsheets or systems for the core workflows?** 

That should be the central product validation question. 

# **35. Future Roadmap** 

After the core platform is stable: 

# **Phase 2** 

- WhatsApp integration 

- SMS 

- Advanced invitation designer 

- Calendar integration 

- Accommodation 

- Transportation 

- Vendor management 

- Advanced photo features 

# **Phase 3 — AI** 

Only later: 

- AI Event Assistant 

- AI event checklist 

- AI planning suggestions 

- AI budget suggestions 

- AI invitation generation 

- Natural-language event queries 

- AI photo organization 

**AI is deliberately excluded from the current product scope.** 

**One architectural decision I'd lock before development** 

The most important conceptual model is: 

**Event → Function → Guest Party → Invitation → RSVP** 

alongside: 

**Event → Managers → Permissions** 

and: 

**Function → Budget → Tasks → Album → QR** 

If we get those relationships right, most of the rest of the application becomes much easier to build. 

The next logical document after this PRD is the **technical/product architecture specification** : database entities and relationships, API/modules, authentication and guest-token flow, permission model, screen-by-screen sitemap, and the exact MVP development sequence. 

