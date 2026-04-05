🌍 ClimateCast — AI Weather Intelligence Dashboard
ClimateCast is a modern SaaS-style weather dashboard that combines real-time weather data with AI-powered insights to help users plan outdoor activities more effectively.

🚀 Live Demo
👉 https://climatecast-app.vercel.app/dashboard

✨ Features
🌆 Dynamic City Search — Get weather data for any city worldwide
📊 Interactive Temperature Chart — Visualize short-term forecast trends
🧠 AI Weather Insight — Smart recommendations based on weather score
⭐ Best Day Prediction — Identify optimal days for outdoor events
📱 Responsive Design — Works seamlessly on mobile and desktop
⚡ Real-Time Data — Powered by live weather APIs

🖼️ Dashboard Preview

![Dashboard](docs/screenshots/dashboard1.jpg)
![Dashboard](docs/screenshots/dashboard2.jpg)


🏗️ Tech Stack
Frontend
Next.js (App Router)
React
Tailwind CSS

Backend
Java (Spring Boot Microservices)
API Gateway architecture

Caching
Redis (Dockerized)

DevOps & Infrastructure

Docker (containerized services)
Database
MongoDB (planned for future integration)
☁️ Deployment
Frontend: Vercel
Backend: Docker (local), future cloud deployment planned (Azure / Render)
📂 Project Structure
```bash
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.js         
│   ├── layout.tsx           
│   ├── page.tsx             
│   └── globals.css          
│
├── components/
│   ├── Header.jsx           
│   ├── Sidebar.jsx          
│   ├── MobileWeather.jsx    
│   ├── RiskAssessment.jsx   
│   ├── BestDayCard.jsx      
│   ├── AIInsight.jsx        
│   ├── StatsCards.jsx       
│   ├── Footer.jsx           
│   └── WeatherChart.jsx     
│
├── services/
│   └── api.js               
│
├── utils/
│   └── riskUtils.js         
│
└── public/                  

```

⚙️ Installation & Setup
1. Clone the repository

git clone https://github.com/steveelorm80/climatecast.git
cd climatecast

2. Install dependencies

npm install

3. Run the development server
npm run dev

📈 Future Improvements 

📅 Calendar integration for event planning 
🔔 Smart weather alerts & notifications 
🌍 Multi-city comparison dashboard 
☁️ Cloud deployment with Azure 
🤖 Advanced ML-based weather predictions 

👨‍💻 Author
Stephen Kwaku Pometsey
@steveelorm80 GitHub: https://github.com/steveelorm80

📄 License

This project is open-source and available under the MIT License.