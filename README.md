# hibi — Personal Dashboard

個人利用向けのシンプルなダッシュボードです。Vue 3、TypeScript、Viteで構成し、天気の取得にはAPIキー不要のOpen-Meteo Forecast APIを利用します。TODOとメモはブラウザのlocalStorageに保存します。

## OrbStackで起動する

OrbStackをインストールして起動し、Docker互換のCLIが使える状態にします。プロジェクトのルートで次を実行してください。

```sh
docker compose up --build
```

ブラウザで http://localhost:5173 を開きます。起動中はプロジェクトのソースコードをコンテナにマウントしているため、ファイルを編集するとViteのホットリロードで画面に反映されます。

停止するには、起動中のターミナルで `Ctrl+C` を押すか、別のターミナルから次を実行します。

```sh
docker compose down
```

依存パッケージを追加・変更した場合はイメージを再ビルドしてください。

```sh
docker compose down
docker compose up --build
```

## ローカルNode.jsで起動する場合

Dockerを使わず、ホストのNode.jsで実行する場合は次のとおりです。

```sh
npm install
npm run dev
```

## ビルド

ホストでビルドする場合：

```sh
npm run build
npm run preview
```

コンテナ内でビルドする場合：

```sh
docker compose run --rm dashboard npm run build
```

## 天気の地点を変更する

[src/config/location.ts](src/config/location.ts) の `name`、`latitude`、`longitude` を変更してください。`name` は画面に表示する市区町村名、緯度・経度はOpen-Meteoに問い合わせる座標です。`timezone` は現在 `Asia/Tokyo` を指定しています。例として、横浜市なら `name: '神奈川県 横浜市'`、`latitude: 35.4437`、`longitude: 139.6380` に変更できます。

天気データはOpen-Meteoの `/v1/forecast` から取得しています。現在の気温・天気コード、当日の最高/最低気温、および時間ごとの気温・天気コード・降水確率を使用します。天気コードの表示はOpen-MeteoのWMO weather interpretation codesに沿っています。

## 保存データ

TODOは `hibi.todos.v1`、メモは `hibi.memo.v1` のキーでブラウザのlocalStorageに保存されます。データはこのブラウザ・端末内に保存され、別端末とは同期されません。TODOの永続化は `src/stores/todos.ts` の `TodoRepository` インターフェースで分離しています。将来の保存先変更時は、このインターフェースの実装を差し替えられます。

## 技術構成

- Vue 3 Composition API / TypeScript / Vite
- Docker Composeによるローカル開発環境（OrbStack対応）
- 外部UIライブラリなし
- Open-Meteo Forecast API
