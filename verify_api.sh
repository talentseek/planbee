#!/bin/bash
echo "Creating Project..."
PROJECT_RES=$(curl -s -X POST http://localhost:3001/api/projects -H "Content-Type: application/json" -d '{"title":"Test Project", "color":"#FFD700"}')
echo "Response: $PROJECT_RES"
PROJECT_ID=$(echo $PROJECT_RES | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Project ID: $PROJECT_ID"

if [ -z "$PROJECT_ID" ]; then
  echo "Failed to create project"
  exit 1
fi

echo "Creating Section..."
SECTION_RES=$(curl -s -X POST http://localhost:3001/api/sections -H "Content-Type: application/json" -d "{\"title\":\"Test Section\", \"projectId\":\"$PROJECT_ID\"}")
echo "Response: $SECTION_RES"
SECTION_ID=$(echo $SECTION_RES | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Section ID: $SECTION_ID"

echo "Creating Task..."
TASK_RES=$(curl -s -X POST http://localhost:3001/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Test Task\", \"estimatedPomodoros\":2, \"projectId\":\"$PROJECT_ID\", \"sectionId\":\"$SECTION_ID\"}")
echo "Response: $TASK_RES"
TASK_ID=$(echo $TASK_RES | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Task ID: $TASK_ID"

echo "Logging Pomodoro..."
curl -s -X POST http://localhost:3001/api/pomodoro -H "Content-Type: application/json" -d "{\"taskId\":\"$TASK_ID\", \"duration\":25, \"startTime\":\"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"}"
echo ""

echo "Listing Projects..."
curl -s http://localhost:3001/api/projects
