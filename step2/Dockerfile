FROM node:22

# 作業ディレクトリの指定
WORKDIR /app

# アプリケーションのコードをコピー
COPY . .

# 必要なパッケージのインストール
RUN apt-get update
    
RUN cd server && \
    npm install

# アプリケーションのポートを指定
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "start"]
