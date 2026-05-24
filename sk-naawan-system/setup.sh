#!/bin/bash

# SK Naawan IMS - Complete Setup Script
# This script sets up the entire Vue.js + Node.js + PostgreSQL stack

echo "╔══════════════════════════════════════════════════════╗"
echo "║                                                      ║"
echo "║     SK Naawan IMS - Setup Script                   ║"
echo "║     Version 2.0.0 - Full Stack Edition             ║"
echo "║                                                      ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if PostgreSQL is installed
echo -e "${BLUE}📦 Checking prerequisites...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL is not installed${NC}"
    echo -e "${YELLOW}Please install PostgreSQL 14+ first${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js 18+ first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Database setup
echo -e "${BLUE}🗄️  Setting up database...${NC}"
read -p "Enter PostgreSQL username (default: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -p "Enter PostgreSQL password: " -s DB_PASSWORD
echo ""

read -p "Enter database name (default: sk_naawan_ims): " DB_NAME
DB_NAME=${DB_NAME:-sk_naawan_ims}

# Check if database exists
DB_EXISTS=$(psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -w $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 0 ]; then
    echo -e "${YELLOW}Creating database: $DB_NAME${NC}"
    PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER $DB_NAME
    echo -e "${GREEN}✅ Database created${NC}"
else
    echo -e "${YELLOW}Database $DB_NAME already exists${NC}"
    read -p "Do you want to drop and recreate it? (y/N): " RECREATE
    if [ "$RECREATE" = "y" ] || [ "$RECREATE" = "Y" ]; then
        PGPASSWORD=$DB_PASSWORD dropdb -U $DB_USER $DB_NAME
        PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER $DB_NAME
        echo -e "${GREEN}✅ Database recreated${NC}"
    fi
fi

# Run schema
echo -e "${BLUE}Running database schema...${NC}"
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -d $DB_NAME -f database/schema.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database schema applied${NC}"
else
    echo -e "${RED}❌ Failed to apply schema${NC}"
    exit 1
fi
echo ""

# Backend setup
echo -e "${BLUE}🔧 Setting up backend...${NC}"
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating backend .env file${NC}"
    cp .env.example .env

    # Generate JWT secret
    JWT_SECRET=$(openssl rand -base64 32)

    # Update .env file
    sed -i "s/your_password_here/$DB_PASSWORD/g" .env
    sed -i "s/your_super_secret_jwt_key_change_this_in_production/$JWT_SECRET/g" .env
    sed -i "s/postgres/$DB_USER/g" .env
    sed -i "s/sk_naawan_ims/$DB_NAME/g" .env

    echo -e "${GREEN}✅ Backend .env created${NC}"
else
    echo -e "${YELLOW}.env file already exists in backend${NC}"
fi

echo -e "${BLUE}Installing backend dependencies...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

echo -e "${BLUE}Building backend TypeScript...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo -e "${RED}❌ Failed to build backend${NC}"
    exit 1
fi

cd ..
echo ""

# Frontend setup
echo -e "${BLUE}🎨 Setting up frontend...${NC}"

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo -e "${YELLOW}Frontend directory doesn't exist yet${NC}"
    echo -e "${BLUE}Creating Vue.js project...${NC}"

    read -p "Do you want to create a new Vue.js project? (Y/n): " CREATE_FRONTEND
    CREATE_FRONTEND=${CREATE_FRONTEND:-y}

    if [ "$CREATE_FRONTEND" = "y" ] || [ "$CREATE_FRONTEND" = "Y" ]; then
        npm create vue@latest frontend -- --typescript --router --pinia

        cd frontend

        echo -e "${BLUE}Installing frontend dependencies...${NC}"
        npm install
        npm install axios @vueuse/core date-fns lucide-vue-next sonner
        npm install -D tailwindcss@4.1.12 postcss autoprefixer

        echo -e "${BLUE}Initializing Tailwind CSS...${NC}"
        npx tailwindcss init -p

        # Create .env file
        echo "VITE_API_URL=http://localhost:5000/api" > .env

        echo -e "${GREEN}✅ Frontend project created${NC}"
        echo -e "${YELLOW}⚠️  Please follow MIGRATION_GUIDE.md to complete Vue.js setup${NC}"

        cd ..
    else
        echo -e "${YELLOW}Skipping frontend setup${NC}"
    fi
else
    echo -e "${GREEN}Frontend directory already exists${NC}"
    cd frontend

    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}Installing frontend dependencies...${NC}"
        npm install
    fi

    if [ ! -f ".env" ]; then
        echo "VITE_API_URL=http://localhost:5000/api" > .env
        echo -e "${GREEN}✅ Frontend .env created${NC}"
    fi

    cd ..
fi

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}║          🎉 Setup Complete! 🎉                       ║${NC}"
echo -e "${GREEN}║                                                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🚀 To start the application:${NC}"
echo ""
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo "  cd backend"
echo "  npm run dev"
echo "  # Runs on http://localhost:5000"
echo ""
echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo "  cd frontend"
echo "  npm run dev"
echo "  # Runs on http://localhost:5173"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  - README.md           - Project overview"
echo "  - MIGRATION_GUIDE.md  - Complete migration guide"
echo "  - SYSTEM_GUIDE.md     - User documentation"
echo ""
echo -e "${BLUE}👥 Default Login Credentials:${NC}"
echo "  Chairperson: president / president"
echo "  Treasurer:   treasurer / treasurer"
echo "  Secretary:   secretary / secretary"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
