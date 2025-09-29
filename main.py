import http.server
import socketserver
import json
import os

PORT = 8000

class GameHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Указываем правильную директорию для файлов
        super().__init__(*args, directory=".", **kwargs)
    
    def do_GET(self):
        print(f"📨 GET запрос: {self.path}")
        
        # Главная страница
        if self.path == '/':
            self.path = '/static/index.html'
        # CSS файл
        elif self.path == '/static/style.css':
            self.path = '/static/style.css'
        # JS файл
        elif self.path == '/static/script.js':
            self.path = '/static/script.js'
        # Иконка (игнорируем)
        elif self.path == '/favicon.ico':
            self.send_response(204)
            return
        
        try:
            # Пробуем отдать файл
            return super().do_GET()
        except:
            self.send_error(404, "File not found")
    
    def do_POST(self):
        if self.path == '/api/save_score':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode())
            
            print(f"🎮 Результаты игры:")
            print(f"   Счет: {data.get('score', 0)}")
            print(f"   Победа: {data.get('won', False)}")
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "ok"}).encode())
        else:
            self.send_error(404)
    
    def log_message(self, format, *args):
        # Убираем стандартное логирование, используем свое
        pass

print("🎮 Запускаем сервер игры 2048...")
print("📍 Проверяем файлы...")

# Проверяем что файлы существуют
files_to_check = ['static/index.html', 'static/style.css', 'static/script.js']
for file in files_to_check:
    if os.path.exists(file):
        print(f"✅ {file} - найден")
    else:
        print(f"❌ {file} - не найден!")

print(f"\n🚀 Сервер запущен: http://localhost:{PORT}")
print("⚡ Используй Ctrl+C для остановки")

try:
    with socketserver.TCPServer(("", PORT), GameHandler) as httpd:
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\n🛑 Сервер остановлен")
except Exception as e:
    print(f"❌ Ошибка: {e}")