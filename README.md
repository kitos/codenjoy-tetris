# WebPurple Codenjoy

Если ты читаешь этот readme, значит ты пришёл на первый Codenjoy от WebPurple посвящённый игре `tetris` или ещё как-то забрёл на репозиторий.

Добро пожаловать!

Как мы уже отметили, сегодня мы будем писать бота для популярной когда-то игры tetris.
Ниже можно ознакомиться с инструкцией по развёртыванию клиента.

## Что такое тетрис

Если вдруг ты не знаком с тетрисом, [здесь](https://ru.wikipedia.org/wiki/%D0%A2%D0%B5%D1%82%D1%80%D0%B8%D1%81) можешь о нём почитать :smiley:

## Правила

С правилами игры можно ознакомиться по [ссылке](http://codenjoy.com/portal/?p=170)

## Как приступить к игре

1. Зарегистрироваться.
 
   Для этого открыть страницу  с [сервером](http://192.168.88.110:8080/), пройти по ссылке `Register` и ввести имя пользователя (ip менять не нужно).

1. Установить клиент
 
   По умолчанию мы предоставляем клиент для nodejs (мы ведь в первую очередь frontend комьюнити).
   Также у создателей платформы можно найти [java клиент](http://codenjoy.com/portal/?p=317) и [C#](http://codenjoy.com/portal/?p=119).
   При желании можно воспользоваться и любым другим языком - взаимодействие осуществляется через сокеты.

   * Скачать nodejs можно с этого репозитория воспользовавшись кнопкой `Clone or download` и выбрав удобный вам способ.
   * Выполнить команду `npm install`
   * поменять имя пользователя (на то, что указывали при регистрации) в файле `index.js` и параметры сервера (по-умолчанию они правильные, но мало ли)
   * выполнить команду `npm run develop` (она запустит клиент и будет переапускать его на каждое изменение файлов) или `npm start` (обычный старт)

1. Наслаждаться

   всё готово! можно открывать файл `strategy.js` и имплементировать свой алгоритм