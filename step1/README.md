

## 覚えること

- コマンド
    - docker images
    - docker ps
    - docker run
- ホストマシーンのディレクトリのマウント
- ポートのマッピング
- Docker イメージ

## 留意事項

- Ubuntu に SSH サーバをインストールしてみて、ホストマシンから接続してみる
- 次に、ssh 用のコンテナを使ってコンテナを使ってみる

## コマンド


#### コンテナ側

```bash
docker run -it --rm -v "$PWD/tmp:/root" -p 22:22 ubuntu:20.04 bash
apt-get update && apt-get install -y vim openssh-server
vim /etc/ssh/sshd_config # AuthorizedKyFile の設定を変更
service ssh start
```

#### ホスト側

```bash
docker images
docker ps
ssh root@127.0.0.1 -i [keyfile] 
```

## Dockerコマンドでコンテンに接続する場合

```bash

docker ps
docker exec -it [container_id] bash
```
