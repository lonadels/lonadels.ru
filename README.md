Это проект [Next.js](https://nextjs.org), созданный с помощью [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Начало работы

Сначала запустите сервер разработки:

```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

Откройте в браузере [http://localhost:3000](http://localhost:3000), чтобы увидеть результат.

Вы можете начать редактирование страницы, изменив файл `app/page.tsx`. Страница автоматически обновляется по мере внесения изменений.

Этот проект использует [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) для автоматической оптимизации и загрузки шрифта [Geist](https://vercel.com/font), нового семейства шрифтов от Vercel.

## Продакшн‑развёртывание (docker-compose, nginx, certbot, registry)

Предварительные условия:
- DNS A-записи: lonadels.ru → IP вашего сервера; www.lonadels.ru → туда же; registry.lonadels.ru → туда же
- На сервере открыты порты 80 и 443

Первичный выпуск сертификатов (однократно):

```powershell
# Из корня проекта на целевом сервере
# Запускаем только nginx (для HTTP-01), registry и одноразовые задачи certbot init
# 1) Запустите nginx и registry, чтобы на порту 80 обслуживался ACME webroot
docker compose up -d nginx registry

# 2) Выпустите сертификаты для lonadels.ru и www
docker compose --profile init up --exit-code-from certbot_init_main certbot_init_main

# 3) Выпустите сертификат для registry.lonadels.ru
docker compose --profile init up --exit-code-from certbot_init_registry certbot_init_registry

# 4) Теперь запустите остальные сервисы и перезагрузите nginx
docker compose up -d
```

Регулярная работа/продление:
- Продление запускается автоматически в контейнере `certbot` (каждые 12 часов). При необходимости перезагрузите nginx после продления.

Docker Registry:
- Доступен по адресу https://registry.lonadels.ru (по умолчанию без аутентификации). Позже при необходимости включите авторизацию.

CI/CD (GitHub Actions):
- Workflow запускается только при коммитах в ветку `main` на self-hosted раннере.
- Он собирает образ Next.js и пушит его в `registry.lonadels.ru/lonadels/lonadels.ru:latest`, затем переразвёртывает `main-app` через `docker compose`.

Ручной деплой без CI (на сервере):
```powershell
docker build -t registry.lonadels.ru/lonadels/lonadels.ru:latest .
docker push registry.lonadels.ru/lonadels/lonadels.ru:latest
docker compose pull main-app
docker compose up -d main-app --force-recreate
```

## Дополнительные материалы

Чтобы узнать больше о Next.js, ознакомьтесь со следующими ресурсами:

- [Документация Next.js](https://nextjs.org/docs) — особенности и API Next.js.
- [Learn Next.js](https://nextjs.org/learn) — интерактивный учебник по Next.js.

Вы также можете посмотреть [репозиторий Next.js на GitHub](https://github.com/vercel/next.js) — отзывы и вклад приветствуются!
