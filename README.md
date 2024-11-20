# CLI Portfolio Website

My personal portfolio website that simulates a command-line interface (CLI) for user interaction. Built with React frontend and Django backend, providing a terminal experience while showcasing projects and skills.

## 🚀 Features

- Interactive CLI interface
- Custom terminal commands
- Project showcase
- Real-time command processing

## 🛠️ Tech Stack

### Frontend
- React.js
- Terminal UI components
- Typescript

### Backend
- Django REST Framework
- SQLite database
- Python

### Infrastructure (Planned)
- AWS cloud deployment
- Terraform IaC
- Container orchestration

## 🏗️ Project Structure

```
project-root/
├── frontend/           # React CLI interface
│   ├── src/
│   └── package.json
├── backend/           # Django API
│   ├── api/
│   ├── portfolio/     # Main Django project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── projects/      # Projects app
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── skills/        # Skills app (planned)
│   ├── about/         # About app (planned)
│   ├── contact/       # Contact app (planned)
│   ├── db.sqlite3
│   └── requirements.txt
└── infrastructure/    # Terraform files (planned)
    └── main.tf
```

## 📱 Django Apps (Planned)

### Current & Planned Apps
1. **Projects App**
   - Models for portfolio projects
   - API endpoints for project listing and details

2. **Skills App** (To be implemented)
   - Technical skills categorization
   - Proficiency levels
   - Years of experience

3. **About App** (To be implemented)
   - Personal information
   - Professional summary
   - Education
   - Work experience

4. **Contact App** (To be implemented)
   - Contact form
   - Social media links
   - Professional profiles

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.8+)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/FPolygon/FPortfolio.git
```

2. Start the frontend:
```bash
cd frontend
npm install
npm start
```

3. Start the backend:
```bash
python -m venv venv
pip install -r requirements.txt
cd backend
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
python manage.py migrate
python manage.py runserver
```

## 📝 Available Commands

| Command | Description |
|---------|------------|
| `help`  | Shows available commands |
| `about` | Displays personal info |
| `projects` | Lists portfolio projects |
| `skills` | Shows technical skills |
| `contact` | Displays contact information |

## 🔄 Development Status

- [x] Frontend CLI interface
- [x] Backend API setup
- [x] Projects app
- [ ] Skills app
- [ ] About app
- [ ] Contact app
- [ ] Docker containerization
- [ ] Terraform configuration
- [ ] AWS deployment
- [ ] CI/CD pipeline
