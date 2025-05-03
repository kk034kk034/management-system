# API Service

以 Fastify 框架構建 API 服務，使用 ESM 模式，模組架構清晰、開發風格統一。專案採用 Prettier + ESLint 格式規範，並以 plugins/models/routes 等功能分類目錄組織專案。支援 Swagger API 文件、多層 RBAC 權限、MQTT 裝置管理與資料遷移流程，適合作為雲端管理平台後端基礎。

本專案採模組化架構(低耦合、高內聚)，依據功能劃分目錄如下：

- `plugins/`：Fastify 插件，如 JWT 驗證、MQTT 連線、Sequelize 等，並採用 autoLoad
- `models/`：Sequelize ORM 資料模型定義與關聯設計，模型採用PascalCase命名風格，檔案名稱皆採用snake_case命名風格
- `routes/`：RESTful API 路由與權限控管邏輯，支援多版本路由，路由名稱採用kebab-case命名風格以便於SEO，檔案名稱皆採用snake_case命名風格
- `swagger/`：OpenAPI 文件定義，支援多版本，函數採用camelCase命名規則，檔案名稱皆採用snake_case命名風格
- `utils/`：通用工具函數，如權限判斷、MQTT handler 等
- `scripts/`：包含資料遷移與默認資料寫入等工具腳本
- `test/`：測試程式
- `logs/`：需要存下追蹤之各類日誌

## [Deploy] 在自己的電腦裡起一個開發環境

我自己是 Windows 下的 Linux (wsl 2, ubuntu 22.04, node:20) + Docker Compose(emqx, mysql, redis)

```bash
$ git clone http://192.168.2.163:3333/SW/Cloud-NMS_Fastify.git my-fastify-app
$ cd my-fastify-app
$ vi .env # 參考 .env.example 填入自己的環境變數
$ docker compose -f dev-compose.yml up -d # 運行周邊服務: DataBase 與 MQTT Broker
$ npm run dev # 運行主程式服務
# 若有更動資料格式想要砍掉重練(等於說想從 mydb 做 migrate_data 至 mydb_dev)，則需在 .env 裡的 DB_MIGRATE 設為 true 後執行主程式。
```

## Usage

[Prettier & ESLint 的安裝至使用的步驟](#prettier_and_eslint)

[Openapi Docs by Swagger](#openapi_docs_by_swagger)

[Test API by Supertest](#test_api_by_supertest)

[部屬運行於 Test Server (192.168.2.163)](#test_server_deploy)

### prettier_and_eslint

1. 安裝 prettier and eslint

```bash
$ npm install --save-dev prettier eslint eslint-plugin-prettier eslint-config-prettier
$ npx eslint --init
```

2. 新增.eslintrc.json (請參考本專案內之 .eslintrc.json 內容)

3. 新增.prettierrc (請參考本專案內之 .prettierrc 內容)

4. 修改 package.json (新增以下三行)

```json
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write ."
}
```

5. 完成 (以下為使用/執行 Auto-Format 和 Lint-Check)

```bash
$ npm run format
$ npm run lint:fix
```

### openapi_docs_by_swagger

1. routes/內已切分版本，且每隻API所含之例如{ schema: swagger.signupEmail }將表示已完成API_Docs內容，並放置於swagger/底下。

2. 已讓專案支援多份Swagger

```bash
EX: http://localhost:9090/internal
 > 前端串接Cloud-NMS_API請參考: ${DOMAIN_URL}/docs
 > CloudViewerPro_API(舊版遷移)請參考: ${DOMAIN_URL}/legacy
```

### test_api_by_supertest

1. 執行測試 ( 詳情請見 test/README.md )

```bash
$ node --test test/base1.js
```

### test_server_deploy

以下為節錄RD_Server(192.168.2.163/Cloud-NMS Test Server/Local Version)位置為`/ssd/coji/eznms/docker-lemp-stack/docker`的`docker-compose.yml`的部分內容作為紀錄參考

```bash
  my-fastify-app:
    container_name: ${DOMAIN_NAME}_my-fastify-app
    restart: always
    build: ./my-fastify-app
    volumes:
      - ./my-fastify-app:/app
      - /app/node_modules #
    env_file:
      - ./my-fastify-app/.env #
    ports:
      - "9090:9090" ##
    labels:
      - traefik.enable=false ##
    networks:
      - proxy.${DOMAIN_NAME}
    depends_on:
      - mysql ###
```

運行指令

```bash
# 初次克隆專案
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker$ git clone http://192.168.2.163:3333/SW/Cloud-NMS_Fastify.git my-fastify-app
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker$ cd my-fastify-app
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker/my-fastify-app$ vi .env
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker/my-fastify-app$ cd ..
# package.json有更新時才須重build
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker$ docker compose build my-fastify-app
# 平時只有改Code的話就restart就好
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker$ docker compose down my-fastify-app
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker$ docker compose up my-fastify-app -d
# 查看LOG
kate@RDMSVN:/ssd/coji/eznms/docker-lemp-stack/docker$ docker logs nmsviewer.planet.local_my-fastify-app -f
```

## [Source] Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

```bash
$ npm init fastify@latest
```

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
