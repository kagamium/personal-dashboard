# hibi — Personal Dashboard

個人利用向けのシンプルなダッシュボードです。Vue 3、TypeScript、Viteで構成し、天気の取得にはAPIキー不要のOpen-Meteo Forecast APIを利用します。TODOとメモはブラウザのlocalStorageに保存します。

## OrbStackで起動する

OrbStackをインストールして起動し、Docker互換のCLIが使える状態にします。初回は地点設定用の環境ファイルを作成します。プロジェクトのルートで次を実行してください。

```sh
cp .env.example .env
```

`.env` の地点名と座標を必要に応じて編集してから、開発サーバーを起動します。

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

Dockerを使わず、ホストのNode.jsで実行する場合も、最初に環境ファイルを作成してください。

```sh
cp .env.example .env
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

ルートにある `.env` の `VITE_WEATHER_LOCATION_NAME`、`VITE_WEATHER_LATITUDE`、`VITE_WEATHER_LONGITUDE` を変更してください。市区町村名は画面表示用で、緯度・経度はOpen-Meteoに問い合わせる座標です。`VITE_WEATHER_TIMEZONE` は時刻表示のタイムゾーンです。たとえば横浜市なら、名前を `神奈川県 横浜市`、緯度を `35.4437`、経度を `139.6380` に設定します。変更後は開発サーバーを再起動してください。

`.env` はGitに登録しません。共有・公開される `.env.example` をテンプレートとして使ってください。Viteの `VITE_` 変数はフロントエンドのコードに埋め込まれブラウザから参照できるため、パスワードやAPIキーなどの秘密情報を設定しないでください。

天気データはOpen-Meteoの `/v1/forecast` から取得しています。現在の気温・天気コード、当日の最高/最低気温、および時間ごとの気温・天気コード・降水確率を使用します。天気コードの表示はOpen-MeteoのWMO weather interpretation codesに沿っています。

## 保存データ

TODOは `hibi.todos.v1`、メモは `hibi.memo.v1` のキーでブラウザのlocalStorageに保存されます。データはこのブラウザ・端末内に保存され、別端末とは同期されません。TODOの永続化は `src/stores/todos.ts` の `TodoRepository` インターフェースで分離しています。将来の保存先変更時は、このインターフェースの実装を差し替えられます。

## 技術構成

- Vue 3 Composition API / TypeScript / Vite
- Docker Composeによるローカル開発環境（OrbStack対応）
- 外部UIライブラリなし
- Open-Meteo Forecast API
