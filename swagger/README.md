# OpenAPI Docs by Swagger

1. routes/內已切分版本，且每隻API所含之例如{ schema: swagger.signupEmail }將表示已完成API_Docs內容，並放置於swagger/底下。

2. 已讓專案支援多份Swagger

```bash
EX: http://localhost:9090/internal
 > 前端串接<project-name>_API請參考: ${DOMAIN_URL}/docs
 > <prj-name>_API(舊版遷移)請參考: ${DOMAIN_URL}/legacy
```
