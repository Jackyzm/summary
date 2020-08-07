# docker-compose 容器通信
    使用links进行通信  注意：links之后 在该服务中需要使用links的别名来替换ip
    links:
        - mongo_db

    mongodb://localhost:27017 ---> mongodb://mongo_db:27017
    