# HealthyLifestyle
**Full-stack health & fitness platform** (ASP.NET Core + React + SQL Server + Docker)  
🔗 [Frontend (localhost:3000)](#4-доступ-до-програми) | [Backend Swagger (localhost:5000/swagger)](#4-доступ-до-програми)

HealthyLifestyle — запуск з використанням Docker Compose.

Цей проєкт включає бекенд на ASP.NET Core, фронтенд на React і базу даних SQL Server, упаковані в Docker-контейнери для легкого розгортання та запуску.

## Зміст:
- Попередні вимоги
- Налаштування проєкту
- Запуск програми з Docker Compose
- Доступ до програми
- Підключення до бази даних SQL Server
- Зупинення програми
- Усунення несправностей

## 1. Попередні вимоги

Для запуску цього проєкту вам знадобиться таке програмне забезпечення:

**Git**: для клонування репозиторію.  
Завантажити Git.

**Docker Desktop**: включає Docker Engine та Docker Compose. Переконайтеся, що він запущений та працює.  
Завантажити Docker Desktop.

## 2. Налаштування проєкту

**Клонуйте репозиторій**: відкрийте термінал (наприклад, PowerShell або Git Bash) та виконайте:
```bash
git clone https://github.com/YevheniiHuriev/HealthyLifestyleApp.git
cd HealthyLifestyle
```
**Створіть файл .env**: у кореневій директорії проєкту (HealthyLifestyle/) створіть файл з ім'ям `.env`.  
Цей файл міститиме змінні оточення для вашої бази даних та JWT-токенів.

Скопіюйте наступний вміст у файл `.env`:
```bash
SA_PASSWORD=your password
MSSQL_DB=your DB
MSSQL_USER=your USER
MSSQL_PORT=your port
JWT_KEY=your key
JWT_ISSUER=your ISSUER
JWT_AUDIENCE=your AUDIENCE
REACT_APP_API_URL=your URL
GOOGLE_CLIENT_ID=your ID
GOOGLE_CLIENT_SECRET=your SECRET
MINIO_ACCESS_KEY=your ACCESS_KEY
MINIO_SECRET_KEY=your SECRET_KEY
STRIPE_PUBLISHABLE_KEY=your PUBLISHABLE_KEY
STRIPE_SECRET_KEY=your SECRET_KEY
WEBHOOK_SECRET=your WEBHOOK_SECRET
```
**Важливо**: для продакшн-середовища потрібно використовувати надійніші та безпечніші методи управління секретами.

## 3. Запуск програми з Docker Compose

Після налаштування файлу `.env` можна запустити всі сервіси за допомогою Docker Compose.

1. Відкрийте термінал у кореневій директорії проєкту (HealthyLifestyle/).
2. Запустіть Docker Compose:
```bash
docker-compose up --build
```
Ця команда збере образи та запустить усі контейнери.

`--build`: переконайтеся, що образи перезбираються, щоб увімкнути останні зміни в коді або Dockerfile.

3. Зачекайте, доки всі сервіси запустяться. Ви побачите логи від `healthy_mssql`, `healthy_backend` та `healthy_frontend`.

**Очікуваний висновок у логах healthy_backend:**

Ви повинні побачити повідомлення про застосування міграцій Entity Framework Core та про те, що програма ASP.NET Core почала слухати запити:
```bash
healthy_backend | info: Microsoft.Hosting.Lifetime[14]
healthy_backend | Now listening on: http://[::]:8080
healthy_backend | info: Microsoft.Hosting.Lifetime[0]
healthy_backend | Application started. Press Ctrl+C to shut down.
```
(Зверніть увагу на порт 8080 усередині контейнера, який мапиться на 5000 на вашому хості).

## 4. Доступ до програми

Після успішного запуску контейнерів ви можете отримати доступ до програми:

- **Фронтенд (React)**: відкрийте у браузері: http://localhost:3000
- **Бекенд (ASP.NET Core API) — Swagger UI**: відкрийте у браузері: http://localhost:5000/swagger

Тут ви зможете переглянути документацію API та протестувати ендпоінти.

## 5. Підключення до бази даних SQL Server

Ви можете підключитися до бази даних SQL Server, яка працює в контейнері, використовуючи будь-який SQL-клієнт (наприклад, SQL Server Management Studio (SSMS), Azure Data Studio, DBeaver).

**Дані для підключення:**
- Ім'я сервера (Server Name): `localhost,1433` або `127.0.0.1,1433`
- Тип аутентифікації (Authentication): SQL Server Authentication
- Ім'я користувача (Login): your login
- Пароль (Password): your password (з вашого .env файлу)
- Ім'я бази даних (Database Name): your Database Name (з вашого .env файлу)

**Приклад підключення (для SSMS/Azure Data Studio):**
1. Запустіть ваш SQL-клієнт.
2. У вікні підключення до сервера введіть `localhost,1433` у полі "Server name".
3. Виберіть "SQL Server Authentication" як тип аутентифікації.
4. Введіть "your login" у полі "Login" та "your password" у полі "Password".
5. Натисніть "Connect".

Після успішного підключення ви зможете переглядати схеми, таблиці та дані вашої бази даних.

## 6. Зупинення програми

Щоб зупинити всі запущені Docker-контейнери та видалити їх (але зберегти томи з даними бази даних):
```bash
docker-compose down
```
## 7. Усунення несправностей

**Контейнер healthy_mssql показує (unhealthy):**  
Це часто буває помилковим спрацюванням healthcheck. Якщо healthy_backend успішно запускається і підключається до бази даних, MSSQL працює нормально, і ви можете ігнорувати цей статус.

**Порт уже використовується:**  
Якщо ви бачите помилку "port is already in use", це означає, що порт 5000 (для бекенду) або 3000 (для фронтенду) уже зайнятий іншим додатком на вашому комп'ютері.  
Ви можете змінити ці порти у файлі `docker-compose.yml` (наприклад, "5001:8080" для бекенду).

**Проблеми із запуском бекенду або міграціями:**  
Якщо бекенд не запускається або не застосовує міграції, перевірте логи:
```bash
docker-compose logs backend
```
Шукайте повідомлення про помилки. Якщо ви змінили Dockerfile і зіткнулися з помилками, спробуйте виконати повне перескладання:
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up --build
```
**Error response from daemon: failed to create task for container: ... executable file not found in $PATH**  
Ця помилка вказує на те, що Docker не може знайти виконуваний файл (наприклад, bash або sh) всередині контейнера.  
Це може бути пов'язане з пошкодженням образу чи несумісністю.  
Спробуйте виконати повне очищення системи Docker:
```bash
docker-compose down
docker rmi healthylifestyle-backend:latest # Видалити образ бекенда
docker system prune --all --volumes -f # Очистити всі дані, що не використовуються Docker (обережно!)
docker-compose up --build # Зібрати і запустити заново
```