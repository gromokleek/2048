import urllib.request
import urllib.parse
import json
import time

# ПОЛУЧИ ТОКЕН у @BotFather
API_TOKEN = "8255402098:AAEx0QzTOdEJif7h0AXT27IHgHyx19j7_1A"
BASE_URL = f"https://api.telegram.org/bot{API_TOKEN}"

def send_message(chat_id, text):
    url = f"{BASE_URL}/sendMessage"
    data = {
        'chat_id': chat_id,
        'text': text
    }
    
    # Преобразуем данные в JSON
    json_data = json.dumps(data).encode('utf-8')
    
    # Создаем запрос
    req = urllib.request.Request(
        url,
        data=json_data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        response = urllib.request.urlopen(req)
        return json.loads(response.read().decode())
    except Exception as e:
        print(f"Ошибка отправки сообщения: {e}")
        return None

def get_updates(offset=None):
    url = f"{BASE_URL}/getUpdates"
    if offset:
        url += f"?offset={offset}&timeout=100"
    else:
        url += "?timeout=100"
    
    try:
        response = urllib.request.urlopen(url)
        return json.loads(response.read().decode())
    except Exception as e:
        print(f"Ошибка получения обновлений: {e}")
        return {'result': []}

def main():
    print("🤖 Бот запущен (используем urllib)...")
    print("⏳ Ожидаем сообщения...")
    last_update_id = None
    
    while True:
        try:
            updates = get_updates(last_update_id)
            
            if 'result' in updates:
                for update in updates['result']:
                    last_update_id = update['update_id'] + 1
                    
                    if 'message' in update:
                        message = update['message']
                        chat_id = message['chat']['id']
                        text = message.get('text', '')
                        
                        print(f"📨 Получено сообщение: {text}")
                        
                        if text == '/start':
                            send_message(chat_id, 
                                "🎮 Привет! Игра 2048 готова!\n\n"
                                "Пока играй здесь:\n"
                                "http://localhost:8000\n\n"
                                "Скоро добавим кнопку прямо в Telegram! 🚀"
                            )
                            print("✅ Отправлено приветственное сообщение")
                        elif text == '/play':
                            send_message(chat_id, 
                                "Открывай игру: http://localhost:8000\nУдачи! 🎯"
                            )
                        else:
                            send_message(chat_id, 
                                "Напиши /start для начала или /play для игры"
                            )
            
            time.sleep(2)
            
        except Exception as e:
            print(f"❌ Ошибка: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()