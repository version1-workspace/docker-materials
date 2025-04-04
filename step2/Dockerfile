FROM node:22

# 作業ディレクトリの指定
WORKDIR /app

# アプリケーションのコードをコピー
COPY server .

# 必要なパッケージのインストール
RUN apt-get update && \
    npm install

# アプリケーションを起動
CMD ["npm", "run", "start"]
