export const ru = {
  common: {
    version: 'Версия {version}',
    close: 'Закрыть',
    copy: 'Скопировать',
  },
  home: {
    getKey: 'Получить VPN-ключ',
  },
  toasts: {
    copied: {
      title: 'Скопировано',
      description: 'Ключ для подключения скопирован в буфер обмена',
    },
    copyFailed: 'Не удалось скопировать',
    errors: {
      default: 'Произошла ошибка',
      badRequest: 'Некорректный запрос',
      unauthorized: 'Не авторизовано',
      disconnectVpn: 'Пожалуйста, отключитесь от VPN',
      tooMany: 'Слишком частые запросы',
      tryLater: 'Пожалуйста, попробуйте немного позже',
      server: 'Ошибка сервера',
      generic: 'Ошибка',
      failedToGetKey: 'Не удалось получить VPN-ключ',
    },
  },
  howToUse: {
    trigger: 'Как использовать',
    title: 'Инструкция',
    steps: {
      one: {
        textBefore: 'Загрузите и установите',
        linkText: 'клиент Outline',
        linkHref: 'https://s3.amazonaws.com/outline-vpn/ru/get-started/index.html#step-3',
      },
      two: {
        beforeBold: 'Нажмите',
        bold: 'Добавить сервер',
        afterBold: 'в приложении Outline.',
      },
      three: 'Введите ключ доступа, полученный после нажатия кнопки «Получить VPN‑ключ» на этом сайте.',
    },
  },
  dialog: {
    title: 'Ваш VPN-ключ',
    textareaAria: 'VPN ключ',
    copyAria: 'Скопировать VPN-ключ',
    closeAria: 'Закрыть диалог',
  },
} as const;

export type RuDict = typeof ru;
