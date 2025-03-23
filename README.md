# Hermony

## Team Members
- Hrisihika Samani
- Dhanshree Suresh Baravkar
- Preksha Patil
- Abegail Santos

## 💡 Project Overview

> A Work-Life Harmony and Mentorship Ecosystem for Women in Tech

### Inspiration
Our project was inspired by the challenges women in tech face when trying to balance career advancement with personal well-being. We recognized that many professionals struggle with burnout, isolation, and limited access to mentorship opportunities. Hermony was born from our desire to create a supportive ecosystem where women can thrive professionally without sacrificing their personal lives.

### Impact of the Solution
Hermony addresses these challenges through an integrated platform that combines:

1. **Well-Being Companion**: The Burnout Tracker monitors work patterns and stress levels using a work-to-personal time ratio methodology. Our research indicates that a ratio above 2.0 correlates with increased burnout symptoms, allowing us to provide timely interventions.

2. **Schedule Analytics**: Our app has a dashboard that tracks your work life balance based on Smart Balance Scheduler and personal calendar.
   
3. **Smart Balance Scheduler**: Our app integrates with work calendars and uses intelligent algorithms to identify potential overload situations. By sending "Boundary Alerts" and providing "No-Zone" features, users can protect their personal time while still meeting professional obligations.

5. **Community Support System**: Through peer-to-peer mentoring and networking features, Hermony breaks down isolation barriers and creates access to guidance from those who have navigated similar challenges.

### Tech Stack Used
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Real-time Database)
- **APIs**: Google Calendar API, Dialogflow (for Balance Buddy AI)
- **Analytics**: Custom dashboard for Burnout Tracker visualization

## 📎 Submission Links

- **Video Demo**: [Link to video demo](https://example.com/demo)
- **GitHub Repository**: [https://github.com/byte-bosses/hermony](https://github.com/byte-bosses/hermony)

## ⚠ Additional Information

### Challenges Faced
1. **Calendar Integration Complexity**: Integrating with various calendar systems while maintaining privacy presented significant challenges. We solved this by creating a secure middleware layer that only extracts necessary scheduling data without accessing personal details.

2. **Balance Metric Algorithm**: Developing an algorithm that accurately reflects work-life balance was difficult. After multiple iterations and user testing, we created a ratio-based system that provides meaningful insights without being overly simplistic.

3. **Real-time Mentorship Matching**: Creating an efficient system for matching mentors and mentees required sophisticated filtering. We implemented a tag-based system combined with availability windows to overcome this challenge.

### Future Scope
1. **Mobile Applications**: Develop native iOS and Android apps for improved user experience
2. **AI-Enhanced Recommendations**: Expand the Balance Buddy AI capabilities to provide more personalized suggestions
3. **Corporate Partnerships**: Create enterprise solutions for companies looking to support their female employees
4. **International Expansion**: Adapt the platform for various cultural contexts and time zones
5. **Advanced Analytics**: Implement predictive burnout detection using machine learning

### AI Tool Disclosure
- We used ChatGPT and Claude AI to brainstorm feature  ideas and development of the application

### Presentation Link
- [Final Presentation](https://example.com/presentation)

## ✨ Key Features

### 🗓️ Smart Balance Scheduler
- Calendar integration with work and personal priorities
- "Boundary Alerts" to prevent scheduling overload
- "No-Zone" feature to protect personal time
- Schedule Analytics to visualize work-life balance metrics

### 🧘‍♀️ Well-Being Companion
- Burnout Tracker to monitor work hours and stress levels
- Self-Care Toolkit with mindfulness exercises and boundary-setting templates
- Balance Buddy AI offering personalized suggestions and encouragement

### 👯‍♀️ Peer-to-Peer Mentoring Hub *(Coming Soon)*
- AI-driven Mentor Match based on skills, goals, and life stage
- Micro-Mentoring Sessions for quick, convenient guidance
- Peer Circles organized around common interests and challenges

### 🌐 Networking Made Simple *(Coming Soon)*
- Opportunity Feed with time-commitment-tagged positions
- Calendar-synced Coffee Chats with fellow women in tech
- Community Forum for questions, celebrations, and support

## 🚀 Getting Started

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/byte-bosses/hermony.git
cd hermony
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure Firebase
   - Create a `.env` file in the root directory
   - Add your Firebase configuration variables (see `.env.example`)

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📊 Work-Life Balance Metrics

Hermony uses a work-to-personal time ratio to help users maintain a healthy balance:
- **Optimal Range**: 1.0 to 1.5 ratio of work to personal time
- **Warning Zone**: 1.5 to 2.0 ratio (mild burnout risk)
- **Danger Zone**: Above 2.0 ratio (significant burnout risk)

---

**Hermony**: Because ambition shouldn't cost your well-being.
