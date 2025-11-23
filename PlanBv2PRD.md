# **Product Requirements Document: PlanBee (v2.0)**

**Mission:** To gamify "Deep Work" by organizing tasks into "Cells" (25m blocks) and intelligently scheduling them into calendar gaps to defend the user's focus.

## **1\. Core Terminology & Concept**

To maximize immersion, we replace standard productivity terms with "Hive" terminology.

| Standard Term | PlanBee Term | Description |
| :---- | :---- | :---- |
| **Pomodoro (25m)** | **Cell** | The fundamental unit of work. Users "fill cells" with nectar (focus). |
| **Short Break (5m)** | **Breather** | A quick pause to "clean wings." |
| **Long Break (15m)** | **Refuel** | A longer break to eat/rest. |
| **Daily Goal** | **Quota** | The target number of Cells to fill per day. |
| **Project** | **Comb** | A collection of related tasks. |
| **User** | **Beekeeper** | The human managing the hive. |

## **2\. Technical Stack (Production Ready)**

* **Framework:** Next.js 16 (App Router)  
* **Language:** TypeScript  
* **Styling:** Tailwind CSS v4 (Using CSS variables for theming)  
* **Auth:** Better-Auth (Google OAuth with Calendar Scopes)  
* **Database:** PostgreSQL (Supabase/Neon/Railway)  
* **ORM:** Prisma  
* **State:** Zustand (Global Timer State) \+ React Query (Server State)  
* **External APIs:**  
  * Google Calendar API (Read/Write)  
  * Spotify Web Playback SDK (Premium Music Integration)

## **3\. Database Schema (Prisma)**

**Instructions for Agent:** Copy this schema into prisma/schema.prisma.

generator client {  
  provider \= "prisma-client-js"  
}

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

// \------------------------------  
// 1\. AUTHENTICATION (Better-Auth)  
// \------------------------------  
model User {  
  id            String    @id @default(cuid())  
  email         String    @unique  
  name          String?  
  emailVerified Boolean?  
  image         String?  
  createdAt     DateTime  @default(now())  
  updatedAt     DateTime  @updatedAt

  sessions      Session\[\]  
  accounts      Account\[\]

  // User Settings  
  workStartTime String    @default("09:00") // 24h format e.g. "09:00"  
  workEndTime   String    @default("17:00")  
  intensityMode Intensity @default(WORKER\_BEE)  
    
  // Gamification Stats  
  totalCells    Int       @default(0) // Total lifetime cells filled  
  currentStreak Int       @default(0)   
  lastActiveDate DateTime?   
    
  // Relations  
  projects      Project\[\]  
  tasks         Task\[\]  
  focusSessions FocusSession\[\]  
    
  @@map("user")  
}

model Session {  
  id        String   @id  
  userId    String  
  expiresAt DateTime  
  ipAddress String?  
  userAgent String?  
  user      User     @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@map("session")  
}

model Account {  
  id           String    @id  
  userId       String  
  accountId    String  
  provider     String  
  accessToken  String?  
  refreshToken String?  
  expiresAt    DateTime?  
  password     String?  
  user         User      @relation(fields: \[userId\], references: \[id\], onDelete: Cascade)

  @@map("account")  
}

model Verification {  
  id         String    @id  
  identifier String  
  value      String  
  expiresAt  DateTime  
    
  @@map("verification")  
}

// \------------------------------  
// 2\. APP LOGIC  
// \------------------------------

enum Intensity {  
  GLIDER       // Light: \~4 Cells/day  
  WORKER\_BEE   // Decent: \~8-10 Cells/day (Default)  
  HERO\_MODE    // Heavy: 12+ Cells/day  
}

enum TaskStatus {  
  TODO  
  IN\_PROGRESS  
  DONE  
  ARCHIVED  
}

model Project {  
  id          String   @id @default(cuid())  
  title       String  
  color       String   @default("\#F59E0B") // Default Bee Gold  
  isArchived  Boolean  @default(false)  
  createdAt   DateTime @default(now())  
  updatedAt   DateTime @updatedAt  
    
  userId      String  
  user        User     @relation(fields: \[userId\], references: \[id\])  
    
  tasks       Task\[\]  
}

model Task {  
  id             String   @id @default(cuid())  
  title          String  
  description    String?  
  status         TaskStatus @default(TODO)  
    
  // Planning  
  estimatedCells Int      @default(1) // How many cells (25m) expected  
  completedCells Int      @default(0) // Actual count  
  dueDate        DateTime?  
  priority       Int      @default(1) // 1=Low, 2=Med, 3=High  
    
  // Hierarchy  
  projectId      String  
  project        Project  @relation(fields: \[projectId\], references: \[id\], onDelete: Cascade)  
  userId         String  
  user           User     @relation(fields: \[userId\], references: \[id\])  
    
  // Logs  
  focusSessions  FocusSession\[\]  
}

// \------------------------------  
// 3\. ANALYTICS & LOGS  
// \------------------------------

model FocusSession {  
  id          String   @id @default(cuid())  
  startTime   DateTime @default(now())  
  duration    Int      // in minutes (usually 25\)  
  isCompleted Boolean  @default(false) // Did they finish or cancel?  
    
  // Gamification \- Snapshot of rewards at time of completion  
  nectarEarned Int     @default(0)   
    
  taskId      String?  
  task        Task?    @relation(fields: \[taskId\], references: \[id\])  
  userId      String  
  user        User     @relation(fields: \[userId\], references: \[id\])  
}

## **4\. Feature Specifications**

### **4.1. Onboarding (The "Hatching")**

**Goal:** Configure the user's "Intensity" and "Calendar" permissions without overwhelming them.

1. **Welcome Screen:** "Welcome to the Hive. Let's build your schedule."  
2. **Auth Provider:** Sign in with Google (Request Scope: calendar.events).  
3. **Intensity Selector (The Flight Path):**  
   * **Garden Glider:** Target 4 Cells (2h). For light days.  
   * **Worker Bee (Recommended):** Target 8-10 Cells (4-5h). The "Decent Day."  
   * **Hero Mode:** Target 12+ Cells. Warning: High burn rate.  
4. **Work Hours:** "When do you start and end your day?" (Default 09:00 \- 17:00).

### **4.2. Dashboard (The Hive)**

**Visual Metaphor:** A grid of hexagons representing the day's quota.

* **Empty Hexagon:** Available slot in the "Quota".  
* **Filling Hexagon:** Currently active timer (fills up like liquid nectar).  
* **Gold Hexagon:** Completed Cell.  
* **Grey Hexagon:** Blocked by meeting.  
* **Current Focus:** Large central display of the current active task.

### **4.3. Smart Scheduling Algorithm**

**Logic for the /planning route:**

1. **Fetch Constraints:** Get Google Calendar events for Today.  
2. **Fetch Tasks:** Get Task\[\] from DB where status \!= DONE, sorted by Priority.  
3. **Identify Gaps:**  
   * Calculate free time slots between workStartTime and workEndTime.  
   * Subtract Meeting Duration \+ 5m Buffer before/after.  
   * **Lunch Rule:** If no event exists between 12:00-14:00, force a 45m break.  
4. **Fill Gaps:**  
   * Insert Cells (25m) into free slots.  
   * Insert Breather (5m) after every Cell.  
   * Insert Refuel (15m) after every 4th Cell.  
5. **Render Timeline:** Display the resulting schedule visually.  
6. **Action:** Clicking a "Scheduled Cell" launches the Timer for that specific task.

### **4.4. The Timer (Nectar Collector)**

**The Heart of the App.**

* **Timer Visual:** Hexagon shape counting down.  
* **Spotify Integration:**  
  * *Requires Premium.*  
  * User selects a "Focus Playlist" and "Break Playlist" in settings.  
  * **State: Running** → Volume 100%, Focus Playlist.  
  * **State: Paused/Break** → Volume 50% or Switch to Break Playlist.  
* **Sound Effects (Web Audio API):**  
  * *Start:* Bee wings fluttering (Subtle).  
  * *Near End (1 min left):* Soft ticking.  
  * *Complete:* "Nectar Drop" sound (Satisfying bloop/chime).

### **4.5. Gamification**

* **XP System:** 1 Cell \= 10ml Nectar.  
* **Streak:** Consecutive days hitting the "Quota."  
* **Leaderboard:**  
  * Fetch top 50 users by currentStreak.  
  * Toggle in Settings: "Share stats with Hive?" (Privacy).

## **5\. UI/UX & Design System (Tailwind v4)**

**Theme Colors:**

:root {  
  \--color-pollen: \#FCD34D; /\* Light Yellow \*/  
  \--color-gold: \#F59E0B;   /\* Main Brand \*/  
  \--color-honey: \#D97706;  /\* Dark Accent \*/  
  \--color-royal: \#FFFBEB;  /\* Background Light \*/  
  \--color-hive: \#1F2937;   /\* Background Dark \*/  
}

**Components:**

* **HexButton:** A button shaped like a hexagon using clip-path: polygon(...).  
* **ProgressComb:** A row of small hexagons filling up to show project progress.

## **6\. Antigravity/Cursor Agent Instructions (Implementation Plan)**

If you are using an AI agent, feed it these tasks one by one.

### **Phase 1: Foundation & Auth**

* \[ \] Initialize Next.js 16 app with Tailwind v4.  
* \[ \] Set up PostgreSQL database and run prisma init.  
* \[ \] Copy the provided Schema into schema.prisma and run prisma db push.  
* \[ \] Install Better-Auth and configure Google Provider.  
* \[ \] Create a middleware.ts to protect /dashboard and /timer routes.

### **Phase 2: CRUD & Data**

* \[ \] Create API Server Actions for createProject, createTask, updateTaskStatus.  
* \[ \] Build the "Project List" view (Grid of cards).  
* \[ \] Build the "Task Creation" Modal (Title, Priority, Estimated Cells).

### **Phase 3: The Timer & State**

* \[ \] Create a global useTimerStore (Zustand) to handle time, active task, and state (Focus/Break).  
* \[ \] Build the Hexagon Timer UI component.  
* \[ \] Implement the countdown logic (Web Workers recommended to prevent throttling).  
* \[ \] Add the "Log Session" API call when timer hits 0\.

### **Phase 4: Calendar & Planning**

* \[ \] Enable Google Calendar API in Google Cloud Console.  
* \[ \] Create a utility function fetchCalendarEvents(userId, date).  
* \[ \] Implement the "Smart Schedule" algorithm (as defined in PRD Section 4.3).  
* \[ \] Build the "Daily Plan" timeline view.

### **Phase 5: Polish & Sound**

* \[ \] Integrate Spotify Web Playback SDK (Create a SpotifyPlayer component).  
* \[ \] Add sound effects for Timer Start/End.  
* \[ \] Implement "Streaks" logic (Check last active date on login).

## **7\. Next Steps for Developer**

1. **Set up the Database:** Ensure your PostgreSQL server is running and DATABASE\_URL is set in .env.  
2. **Google Cloud Console:** Create a project, enable Calendar API, and get Client ID/Secret for Better-Auth.  
3. **Start Phase 1:** Begin with the Database Schema migration.