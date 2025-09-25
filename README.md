# lonadels.ru

Веб‑приложение на Next.js 15 для выдачи временных ключей доступа (accessUrl) к Outline VPN. Пользователь нажимает
«Получить VPN‑ключ», сервер создаёт/выдаёт ключ через Outline API и возвращает ссылку доступа. Используется Postgres +
Prisma для учёта устройств (по IP) и выданных ключей, есть ограничение по частоте запросов и служебный endpoint для
очистки всех ключей.

## Стек и особенности

- Next.js (App Router), React 19, Tailwind CSS.
- Prisma ORM + PostgreSQL 16.
- Интеграция с Outline API (outlinevpn-api).
- Rate limit: 3 запроса на IP в минуту, 10 за 6 часов и 30 за 24 часа для `POST /api/createProxyKey`.
- Защищённый endpoint `POST /api/clearAllProxyKeys` с заголовком `x-api-key`.
- Dockerfile со сборкой в режиме standalone, docker-compose с nginx, certbot, registry, postgres.
- CI/CD: GitHub Actions собирает образ и деплоит на self‑hosted сервер (см. `.github/workflows/workflow.yml`).

### Основные библиотеки

- **zod** — валидация и типобезопасное парсинг конфигурации/данных. Применяется для переменных окружения в
  `src\lib\env.ts` (жёсткая проверка URL и обязательных полей).
- **usehooks-ts** — набор готовых React‑хуков (например, `useLocalStorage`, `useEventListener`, `useIsClient`) для
  упрощения работы с состоянием и браузерными API.
- **sonner** — лёгкие toast‑уведомления для UI.
- **shadcn/ui + Radix UI** — UI‑примитивы и компоненты (в проекте используются диалоги и алерты:
  `@radix-ui/react-dialog`, `@radix-ui/react-alert-dialog`).
- **class-variance-authority** + tailwind-merge — удобное управление вариациями классов и корректное слияние
  Tailwind‑классов.
- **lucide-react** — иконки.
- **next-themes** — переключение темы (light/dark) на стороне клиента.
- **@serwist/next** — сервис‑воркер и PWA‑инфраструктура (см. `src\app\sw.ts`).
- **axios** — HTTP‑клиент для серверных и клиентских запросов.
- **react-if** — декларативный условный рендеринг компонентов.
- **vaul** — анимационный Drawer/Sheet, поверх Radix‑примитивов.
- **outlinevpn-api** — обёртка над Outline Manager API для создания/удаления access‑ключей.

## Интернационализация (i18n)

Проект использует next-intl (App Router) без URL-префиксов языков.

- Поддерживаемые локали: ru (по умолчанию), en, fr, uk, uz, de, pl, zh, ja, ko, es, ar, pt, id, hi, tr, vi, it.
- Сообщения хранятся в JSON-файлах: `messages/<locale>.json`.
- Определение языка на сервере:
  - Парсится заголовок `Accept-Language`; выбирается первый поддерживаемый язык из списка, иначе `ru`.
  - Если в cookies есть валидный `locale` из поддерживаемых — используется он. Логика находится в `src\i18n\request.ts`.
- Подключение next-intl:
  - Плагин в `next.config.ts` (`createNextIntlPlugin`).
  - Провайдер в `src\app\layout.tsx`: `<NextIntlClientProvider messages={messages}>`.

Как переключить язык

- Клиентом: достаточно установить cookie `locale` в один из поддерживаемых значений (см. список выше) и обновить
  страницу.
- Сервером (рекомендуется): используйте готовый server action `setLocale`:
  ```ts
  import {setLocale} from '@/i18n/set-locale';
  import type {Locale} from '@/i18n/request';

  // Пример вызова из Server Action или Route Handler
  export async function changeLang(locale: Locale) {
    await setLocale(locale);
    // при необходимости сделайте редирект
  }
  ```

Как добавлять/изменять переводы

1) Добавьте ключи во все файлы `messages/*.json`, сохраняя одинаковую структуру.
2) В компонентах используйте хук `useTranslations` или форматтеры next-intl.
   Пример:
   ```tsx
   import {useTranslations} from 'next-intl';

   export default function Button() {
     const t = useTranslations('Common'); // соответствует секции в JSON
     return <button>{t('getKey')}</button>;
   }
   ```
3) Для серверных компонентов можно пользоваться `getMessages()` (см. layout) и передавать их через
   `NextIntlClientProvider`.

Замечания

- В данный момент язык не зашит в URL и не влияет на маршрутизацию. SEO-метки `hreflang` не настроены.
- Если потребуется дополнительный язык, добавьте `messages/<locale>.json` и включите его в массив `SUPPORTED` в
  `src\i18n\request.ts` (тип `Locale` выводится автоматически).

## Переменные окружения

Задаются через `.env` в разработке и через секреты/ENV в продакшне. Значения ниже примерные — подставьте свои.

- DATABASE_URL — строка подключения к Postgres (например, `postgresql://user:pass@host:5432/db`)
- POSTGRES_USER — имя пользователя Postgres (для docker-compose)
- POSTGRES_PASSWORD — пароль Postgres (для docker-compose)
- POSTGRES_DB — база данных Postgres (для docker-compose)
- OUTLINE_API_URL — URL API сервера Outline (включая секретный сегмент)
- OUTLINE_FINGERPRINT — TLS fingerprint сервера Outline
- HOST_IP — IP сервера, с которого идут запросы изнутри VPN; такие запросы блокируются
- API_KEY — секрет для `POST /api/clearAllProxyKeys`

Примечание: не коммитьте реальные секреты в репозиторий. Используйте `.env.local` и секреты GitHub/CI.

## Локальная разработка

1. Установить зависимости:
  - npm ci
2. Подготовить .env:
  - Скопируйте `.env.example` (если нет — создайте) в `.env` и заполните переменные.
3. Запустить Postgres (варианты):
  - Локально установленный Postgres 16, либо
  - docker-compose только с postgres: `docker compose up -d postgres`
4. Применить Prisma:
  - npx prisma generate
  - npx prisma migrate dev
5. Запустить dev‑сервер:
  - npm run dev

Откройте http://localhost:3000. Главная страница — кнопка «Получить VPN‑ключ». Внизу может отображаться версия сборки,
если проброшена в процесс.

## API

- POST /api/createProxyKey
  - Возвращает `{ accessUrl: string }`.
  - Rate limit: 3 в минуту, 10 за 6 часов и 30 за 24 часа на IP (заголовки X-RateLimit-*, Retry-After).
  - Внутри: привязка устройства по IP, повторная выдача свободного ключа либо создание нового через Outline API.
  - Ошибки: 400 (неверный IP), 403 (запрос из VPN — совпадает с HOST_IP), 429, 500 и т.д.

- POST /api/clearAllProxyKeys
  - Требует заголовок `x-api-key: <API_KEY>`.
  - Удаляет все access keys на Outline и синхронизирует базу (удаляет записи по accessUrl).
  - Для внутренних задач/обслуживания; не предназначен для публичного вызова.

## База данных и Prisma

- Клиент создаётся в `src/lib/db.ts` с переиспользованием в dev.
- Схема в `schema.prisma`, миграции — в `migrations/`.
- Применение в CI/build: `prisma generate` запускается в Dockerfile на этапе deps (требуется DATABASE_URL через секрет
  BuildKit).

## Продакшн‑развёртывание (docker-compose, nginx, certbot, registry)

Предварительные условия:

- DNS A‑записи: lonadels.ru → IP сервера; www.lonadels.ru → туда же; registry.lonadels.ru → туда же
- Порты 80 и 443 открыты на сервере

Первичный выпуск сертификатов (однократно):

```powershell
# Из корня проекта на целевом сервере
# Запускаем только nginx (HTTP‑01), registry и одноразовые задачи certbot init
# 1) Запустить nginx и registry, чтобы на 80 обслуживался ACME webroot
docker compose up -d nginx registry

# 2) Выпустить сертификаты для lonadels.ru и www
docker compose --profile init up --exit-code-from certbot_init_main certbot_init_main

# 3) Выпустить сертификат для registry.lonadels.ru
docker compose --profile init up --exit-code-from certbot_init_registry certbot_init_registry

# 4) Запустить остальные сервисы и перезагрузить nginx
docker compose up -d
```

Регулярная работа/продление:

- Продление выполняется автоматически в контейнере `certbot` (каждые ~12 часов). При обновлении сертификатов
  перезагрузите nginx при необходимости.

Docker Registry:

- Доступен по адресу https://registry.lonadels.ru.
- Аутентификация htpasswd включена; файл монтируется из `./docker/registry/auth/htpasswd`.
- В GitHub Actions логин выполняется по `DOCKER_USERNAME`/`DOCKER_PASSWORD`.

CI/CD (GitHub Actions):

- Запускается на пуши в `main` на self‑hosted раннере.
- Сборка и push образа: `registry.lonadels.ru/lonadels/lonadels.ru:latest`.
- Деплой: `docker compose pull main-app` и `docker compose up -d main-app --force-recreate` на сервере.
- Build args/секреты: в workflow пробрасываются `POSTGRES_*`, `OUTLINE_*`, `HOST_IP`, `DATABASE_URL`, `API_KEY` и т.д. (
  см. `.github/workflows/workflow.yml`).

Ручной деплой без CI (на сервере):

```powershell
docker build -t registry.lonadels.ru/lonadels/lonadels.ru:latest .
docker push registry.lonadels.ru/lonadels/lonadels.ru:latest
docker compose pull main-app
docker compose up -d main-app --force-recreate
```

## Полезное

- При ошибках Outline проверьте корректность `OUTLINE_API_URL` и `OUTLINE_FINGERPRINT`.
- Убедитесь, что `HOST_IP` совпадает с внешним IP сервера — это нужно, чтобы блокировать запросы изнутри VPN.
- Для локальной разработки избегайте хранения реальных секретов в репозитории; используйте `.env.local` и переменные
  окружения.

## Swagger / OpenAPI

- Живая документация (Swagger UI): /api/docs
  - Локально: http://localhost:3000/api/docs
- JSON‑спецификация OpenAPI: /openapi.json
  - Локально: http://localhost:3000/openapi.json

### Как это устроено

- Спецификация лежит в public\\openapi.json.
- Swagger UI отдаётся маршрутом src\\app\\api\\docs\\route.ts и использует CDN (swagger-ui-dist) с ссылкой на
  /openapi.json.
- Никаких дополнительных зависимостей в проект не добавлено.

### Как обновлять спецификацию

1) Добавьте/измените endpoint в public\\openapi.json в секции paths. Пример для закрытого эндпоинта с заголовком
   x-api-key:

```json
{
  "paths": {
    "/api/clearAllProxyKeys": {
      "post": {
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "x-api-key"
      }
    }
  }
}
```

2) При добавлении новых ручек опишите запрос/ответ (schemas) в components/schemas при необходимости.
3) Для разных окружений можно задать servers в корне openapi.json, например:

```json
{
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Local"
    },
    {
      "url": "https://lonadels.ru",
      "description": "Production"
    }
  ]
}
```
