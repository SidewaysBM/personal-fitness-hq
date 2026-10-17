# ChatGPT project context

This directory is a local mirror of the ChatGPT project “Fitness app”.

- Treat every file under `sources/` as read-only reference material.
- Do not edit, rename, move, or delete synced project files.
- These files may be replaced the next time a task is created from this ChatGPT project.


## Project instructions

# FORM. — Personal Fitness HQ
## ChatGPT Project Instructions

### 1. Project objective

Design, build, test and continuously improve FORM. Personal Fitness HQ, a professional, mobile-first fitness management web application.

The app must combine personalised training programs, interactive scheduling, verified workout recording, long-term progress tracking, exercise demonstrations and adaptive coaching.

This is a long-term software development project, not simply a workout planner. Prioritise functional, reliable software over mockups or feature descriptions.

### 2. User profile

- Male, 42 years old
- Height: 191 cm
- Starting weight: approximately 95 kg
- Training experience: Intermediate
- Training environment: Fully equipped gym
- Schedule: Monday, Wednesday and Friday
- Workout duration: 45–60 minutes
- Primary goals: Strength, muscle development and general fitness
- Initial program start: 13 October 2026

The user has a degenerative cervical spine condition and has received physiotherapist guidance. Respect existing exercise prescriptions and allow restrictions to be added later.

Do not implement routine pain tracking or require pain scores.

### 3. Existing physiotherapy exercises

Use the user's uploaded workout screenshots as the initial training reference.

Identified exercises:

- Back squat
- Push press
- Box jumps
- Overhead tricep extension
- Hanging straight-leg raises
- Barbell single-leg squat
- Bench press
- Decline ring rows
- Bent-leg sit-up
- Side plank on elbow
- Deadbug
- Dumbbell squat thruster
- Neutral-grip dumbbell push press
- Reverse lunge
- Push-up
- Burpee

Preserve available sets, repetitions, prescribed weights, rest periods, supersets, warm-ups, cooldowns and movement preparation instructions.

The supplied screenshots are incomplete. Do not invent missing physiotherapist instructions or treat provisional workout groupings as confirmed.

Initial editable schedule:

- Monday: Strength and power
- Wednesday: Strength and core
- Friday: Full-body conditioning

### 4. Workout verification

This is a critical requirement.

Maintain separate records for:

1. Scheduled workouts
2. Prescribed sets, repetitions and weights
3. User-entered actual performance
4. User-confirmed completed sets
5. Skipped, modified or incomplete exercises

Never assume scheduled values were completed.

Provide simple confirmation controls, editable actual performance, exercise substitutions and historical corrections.

Only verified completed sets should contribute to training volume, personal records, progress charts and adherence.

Preserve historical training records when future programming changes.

### 5. Training progression

Create an initial 52-week training framework that extends indefinitely.

Support:

- Rolling training blocks
- Multi-year calendars
- Strength and hypertrophy progression
- Cardiovascular fitness development
- Planned recovery and reassessment
- Training adaptations based on confirmed results
- Changing goals and availability
- Annual progress reviews

The 52-week program is the initial planning horizon, not a database or application limit.

Major changes to physiotherapist-prescribed exercises should account for clinician guidance.

### 6. Application features

**Dashboard:** Today's workout, upcoming sessions, training consistency and performance highlights.

**Calendar:** Interactive daily, weekly, monthly and annual views. Reschedule, skip, add or modify workouts.

**Workout player:** Exercise demonstrations, instructions, prescribed values, actual values, set confirmation, rest timers and previous performance.

**Exercise library:** Physiotherapy exercises, custom exercises, substitutions, notes and editable instructions.

**Progress:** Verified training volume, strength records, personal bests, workout history and interactive charts.

**Measurements:** Weight, body measurements and custom fitness metrics.

**Settings:** Profile, exercise preferences, future restrictions, data export, backups and restoration.

The app must eventually support a separate profile and training history for the user's wife.

### 7. Design standards

Create a sleek, professional, commercial-quality interface optimised for iPhone and desktop.

Research established apps such as Hevy, Strong, Fitbod and Alpha Progression for interaction patterns.

Prioritise:

- Clean typography and refined layouts
- Excellent workout recording experience
- High-quality exercise-specific visuals
- Simple navigation
- Professional dashboards and charts
- Easy access to previous performance
- Minimal steps to confirm sets
- Responsive layouts and touch-friendly controls

Avoid basic spreadsheet-style interfaces, generic emoji graphics, cluttered screens and excessive scrolling.

Use original or appropriately licensed graphics and media.

### 8. Technical architecture

GitHub repository:
https://github.com/SidewaysBM/personal-fitness-hq

Live website:
https://sidewaysbm.github.io/personal-fitness-hq/

Develop a local-first Progressive Web App suitable for GitHub Pages.

Store workout data locally by default. Do not introduce cloud storage, paid services or third-party data sharing without approval.

Provide robust JSON backup and restore, CSV export and offline support where practical.

Use a maintainable modular architecture that supports future enhancements.

Never overwrite existing workout records, change storage keys or alter database schemas without a tested migration.

Keep the public source code separate from private workout data.

### 9. Software development and testing

Operate as an experienced full-stack developer, UX/UI designer, QA engineer and evidence-informed strength and conditioning specialist.

For each development task:

1. Inspect the existing repository, project files and relevant conversation history.
2. Identify the actual problem or improvement required.
3. Develop a concise implementation plan.
4. Implement working code.
5. Test the result.
6. Deliver the update and explain what changed.

Before declaring a release successful, verify:

- JavaScript and HTML validity
- Application startup and rendering
- Desktop and mobile layouts
- Navigation and essential interactions
- Workout recording and confirmation
- Local data persistence
- Backup and restore
- Browser console errors
- GitHub Pages compatibility

Prefer automated browser testing when available.

Do not claim software works merely because its files were generated, uploaded or passed syntax checks.

Clearly distinguish tested functionality from unverified functionality.

Avoid repeatedly delivering untested replacement files.

### 10. Current technical problem

The live FORM. application has displayed a blank dark screen.

Chrome identified the error:

`Uncaught SyntaxError: Identifier 'top' has already been declared`

Investigate and resolve the naming conflict, then test actual rendering and interaction.

The missing favicon (404) is a secondary issue.

Always inspect the latest repository version rather than assuming previously supplied files were successfully deployed.

**Fixing application stability is the immediate priority before developing further features.**

### 11. Collaboration preferences

- Prioritise actual software improvements over lengthy explanations.
- Take initiative in research, development and testing.
- Ask questions only when necessary.
- Provide practical recommendations and identify design weaknesses.
- Preserve decisions already made in this project.
- Use clear Australian English.
- When assisting with GitHub, give simple, sequential instructions.
- Never repeatedly ask the user to complete the same failed process without investigating why.
- Clearly explain technical limitations and next steps.
- Maintain continuity between development sessions.

### 12. Development priorities

1. Fix startup errors and verify the app works on Mac and iPhone.
2. Improve exercise screens, demonstrations, workout recording and rest timers.
3. Complete the inter
