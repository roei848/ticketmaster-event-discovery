#!/usr/bin/env python3
"""
Simple HTTP server that reads progress.json and serves kanban data as JSON
"""

import http.server
import socketserver
import json
from pathlib import Path
from urllib.parse import urlparse
from datetime import datetime

PORT = 8080

class KanbanRequestHandler(http.server.SimpleHTTPRequestHandler):

    def do_GET(self):
        parsed_path = urlparse(self.path)

        # API endpoint to get progress data
        if parsed_path.path == '/api/progress':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.end_headers()

            try:
                data = self.load_progress_json()
                # Update the lastUpdated timestamp to current time
                data['lastUpdated'] = datetime.now().isoformat()
                self.wfile.write(json.dumps(data, indent=2).encode())
            except Exception as e:
                error_data = {'error': str(e)}
                self.wfile.write(json.dumps(error_data).encode())
        else:
            # Serve static files (kanban.html, etc.)
            super().do_GET()

    def end_headers(self):
        # Add no-cache headers for HTML files
        if self.path.endswith('.html'):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        super().end_headers()

    def load_progress_json(self):
        """Load and return progress.json data"""
        progress_file = Path('.worktrees/initial-implementation/progress.json')

        if not progress_file.exists():
            return {
                'error': 'progress.json not found',
                'lastUpdated': datetime.now().isoformat(),
                'stats': {
                    'total': 0,
                    'completed': 0,
                    'inProgress': 0,
                    'todo': 0,
                    'progressPercent': 0
                },
                'tasks': {
                    'done': [],
                    'inProgress': [],
                    'todo': []
                }
            }

        try:
            with open(progress_file, 'r') as f:
                raw_data = json.load(f)

                # Transform the worktree progress.json format to kanban format
                def transform_task(task):
                    """Transform worktree task format to kanban task format"""
                    return {
                        'title': task.get('name', 'Untitled'),
                        'description': task.get('description', ''),
                        'files': ', '.join(task.get('files', [])),
                        'category': self.categorize_task(task.get('name', '')),
                        'commits': ', '.join(task.get('commits', []))
                    }

                done_tasks = [transform_task(t) for t in raw_data.get('done', [])]
                in_progress_tasks = [transform_task(t) for t in raw_data.get('inProgress', [])]
                todo_tasks = [transform_task(t) for t in raw_data.get('todo', [])]

                return {
                    'lastUpdated': raw_data.get('lastUpdated', datetime.now().isoformat()),
                    'stats': {
                        'total': raw_data.get('totalTasks', 0),
                        'completed': raw_data.get('completedCount', 0),
                        'inProgress': raw_data.get('inProgressCount', 0),
                        'todo': raw_data.get('todoCount', 0),
                        'progressPercent': raw_data.get('progressPercentage', 0)
                    },
                    'tasks': {
                        'done': done_tasks,
                        'inProgress': in_progress_tasks,
                        'todo': todo_tasks
                    }
                }
        except json.JSONDecodeError as e:
            return {
                'error': f'Invalid JSON in progress.json: {str(e)}',
                'lastUpdated': datetime.now().isoformat(),
                'stats': {
                    'total': 0,
                    'completed': 0,
                    'inProgress': 0,
                    'todo': 0,
                    'progressPercent': 0
                },
                'tasks': {
                    'done': [],
                    'inProgress': [],
                    'todo': []
                }
            }

    def categorize_task(self, task_name):
        """Determine category based on task name"""
        task_lower = task_name.lower()
        if 'backend' in task_lower:
            return 'Backend'
        elif 'frontend' in task_lower:
            return 'Frontend'
        elif 'documentation' in task_lower or 'readme' in task_lower:
            return 'Documentation'
        else:
            return 'General'

    def log_message(self, format, *args):
        """Custom log message to show cleaner output"""
        if self.path == '/api/progress':
            print(f"[{self.log_date_time_string()}] API Request: {self.path}")
        elif not self.path.endswith(('.css', '.js', '.ico')):
            super().log_message(format, *args)

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), KanbanRequestHandler) as httpd:
        print(f"╔════════════════════════════════════════════════╗")
        print(f"║   Kanban Board Server Running on Port {PORT}    ║")
        print(f"╚════════════════════════════════════════════════╝")
        print(f"")
        print(f"📊 Kanban Board: http://localhost:{PORT}/kanban.html")
        print(f"🔌 API Endpoint:  http://localhost:{PORT}/api/progress")
        print(f"📝 Data Source:   .worktrees/initial-implementation/progress.json")
        print(f"🔄 Refresh Rate:  15 seconds")
        print(f"")
        print(f"Press Ctrl+C to stop the server")
        print(f"")

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n\n👋 Server stopped")
