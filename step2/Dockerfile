FROM node:22

# 作業ディレクトリの指定
WORKDIR /app

# アプリケーションのコードをコピー
COPY server .

# 必要なパッケージのインストール
RUN apt-get update && \
    npm install

# アプリケーションのポートを指定
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "start"]
