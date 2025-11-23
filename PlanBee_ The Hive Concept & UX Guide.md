# **PlanBee: The Hive Concept & UX Guide**

**Purpose:** This document defines the narrative, terminology, and user experience philosophy of PlanBee. It serves as the reference for UI copy, gamification logic, and onboarding flows.

## **1\. The Core Philosophy: "Defending the Hive"**

PlanBee is not just a timer; it is a **defense system** for the user's focus.

* **The Problem:** Modern work is a swarm of interruptions.  
* **The Solution:** PlanBee builds a "protective comb" around the user's schedule.  
* **The Vibe:** Industrious, warm, focused, and satisfying. Not stressful.

### **Terminology Translation Table**

We use these terms consistently in the UI.

| Standard Term | Hive Term | UI Context / Usage |
| :---- | :---- | :---- |
| **Pomodoro (25m)** | **Cell** | "Fill a Cell," "Cell Completed" |
| **Short Break (5m)** | **Breather** | "Take a Breather," "Clean your wings" |
| **Long Break (15m)** | **Refuel** | "Time to Refuel," "Return to Hive" |
| **XP / Score** | **Nectar** | "10ml Nectar collected" |
| **Daily Goal** | **Quota** | "Daily Quota: 8/10 Cells" |
| **Project** | **Comb** | "Create a new Comb," "Project Comb" |
| **User** | **Beekeeper** | Used in settings/profile (e.g., "Beekeeper Profile") |
| **Focus Mode** | **Sealed** | When the timer is running, the cell is "Sealed." |

## **2\. Onboarding: "The Hatching"**

The first experience must feel magical, not like filling out a tax form.

### **Screen 1: The Welcome**

* **Visual:** A golden hexagon pulsing slowly.  
* **Headline:** "Welcome to the Hive."  
* **Subtext:** "Let's turn your busy day into a focused one."

### **Screen 2: The Flight Path (Intensity Selector)**

Instead of asking "How many hours do you want to work?", we ask about energy levels.

* **Option A: Garden Glider (Light)**  
  * *Description:* "I need a gentle pace today."  
  * *Logic:* Target 4 Cells (2 hrs).  
  * *UI Feedback:* A small, slow-moving bee icon.  
* **Option B: Worker Bee (Standard \- Default)**  
  * *Description:* "I want a decent, productive day."  
  * *Logic:* Target 8-10 Cells (4-5 hrs).  
  * *UI Feedback:* An industrious bee buzzing consistently.  
* **Option C: Hero Mode (Intense)**  
  * *Description:* "I have a deadline to crush."  
  * *Logic:* Target 12+ Cells.  
  * *UI Feedback:* A bee with a tiny helmet or goggles.

### **Screen 3: The Perimeter (Calendar)**

* **Copy:** "Defend your time."  
* **Explanation:** "Connect your calendar so we can find the safe gaps for your Cells. We will mark your focus time as *'Busy: Focusing'* to warn others."

## **3\. The "Cell" Experience (The Timer)**

### **Visuals**

* **Empty State:** A grey outline of a hexagon.  
* **Active State:** The hexagon fills from bottom to top with golden liquid (nectar) as time passes.  
* **Completed State:** The hexagon flashes bright gold, then solidifies. A satisfying "Pop" sound plays.

### **Audio & Atmosphere**

* **The Soundscape:** We don't use jarring alarms.  
  * *Start:* A soft "woosh" or wing flutter.  
  * *End:* A gentle chime (like a wind chime).  
* **Spotify Integration:**  
  * *Focus Playlist:* Triggers automatically when a Cell starts.  
  * *Break Logic:* Music volume dips to 30% or pauses during a "Breather."

## **4\. Gamification & Privacy**

This is critical: **We gamify effort, not private data.**

### **The Nectar System (XP)**

* **1 Completed Cell** \= 10ml Nectar.  
* **Streak Bonus** \= \+2ml per cell if Streak \> 3 days.  
* **Early Bird Bonus** \= \+5ml for finishing the first Cell before 10 AM.

### **The Streak (The Chain)**

* A visual chain of filled honeycombs representing consecutive days meeting the **Quota**.  
* *Forgiveness Rule:* If a user misses a day, they can "repair" the streak by doing double the quota the next day (costing Nectar).

### **The Leaderboard (The Swarm)**

* **Default State:** Private. You only see your own stats.  
* **Opt-in:** "Join the Public Swarm?"  
* **Privacy Rule:**  
  * **Public:** User Name, Avatar, Current Streak, Total Nectar.  
  * **PRIVATE (Always):** Task Titles, Project Names, Calendar Events.  
  * *Explanation:* "Your colleagues can see *that* you are working, but never *what* you are working on."

## **5\. Tone of Voice & Micro-Copy**

The app should sound helpful and slightly playful, but never distracting.

* **Good:** "Quota met\! The Hive is happy."  
* **Bad:** "Good job user, you did the task."  
* **Good:** "Distraction detected? Seal the cell to keep the nectar." (Pause menu).  
* **Error Messages:**  
  * *Network Error:* "Lost connection to the Hive."  
  * *Calendar Error:* "Could not scout the perimeter (Calendar sync failed)."

## **6\. Help & "Bee-ducation"**

Instead of a boring manual, we use "Worker Bee Tips" that appear in empty states.

* *Tip:* "Did you know? Taking a Breather actually makes your next Cell more productive. Go stretch\!"  
* *Tip:* "Don't overload the comb. 8 Cells is a solid day's work."  
* *Tip:* "Protect your Queen (Your Brain). Hydrate during the Refuel break."

## **7\. Implementation Checklist for Developer**

When building the UI, ensure these elements are present:

1. **Privacy Toggle:** In User Settings, a clear switch for "Public Leaderboard Visibility."  
2. **Visual Feedback:** Every button press should feel tactile (bouncy transitions).  
3. **Empty States:** Never leave a blank screen; always show a "Ghost Hexagon" or a prompt to "Start a new Comb."