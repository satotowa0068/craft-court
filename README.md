# craft-court 物件管理アプリ

分譲住宅の複数プロジェクトを横断管理する社内向け物件管理アプリです。区画/棟ごとの販売ステータス管理、販売状況ダッシュボード、物件詳細情報、顧客・商談履歴の紐付けができます。

## 技術スタック

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- Prisma 7 + PostgreSQL(`@prisma/adapter-pg`)
- Auth.js (NextAuth v5) — メールアドレス/パスワードによる社内アカウント認証
- Recharts — ダッシュボードのグラフ表示

## Vercelへのデプロイ手順

エンジニアでなくても進められるよう、手順化しています。

### 1. Vercelにプロジェクトをインポートする

1. [vercel.com](https://vercel.com) にアクセスし、GitHubアカウントでログイン(未登録なら新規登録)
2. 「Add New...」→「Project」から、このリポジトリ(`craft-court`)を選択してインポート
3. インポート時のブランチは `claude/business-efficiency-chckhy`(または後でmainにマージした場合はそちら)を指定

### 2. データベース(Postgres)を用意する

1. Vercelのプロジェクト画面 →「Storage」タブ →「Create Database」→「Postgres」を選択して作成
2. 作成したDBを、このプロジェクトに「Connect」する
   - これによりVercelが接続用の環境変数を自動的に追加します(名前は `POSTGRES_URL` など、Vercel側の仕様により変わります)
3. プロジェクトの「Settings」→「Environment Variables」を開き、**新しく `DATABASE_URL` という名前の環境変数を追加**し、値には上記で自動追加された接続文字列(`POSTGRES_URL` や `POSTGRES_URL_NON_POOLING` など)の値をコピー&ペーストする
   - このアプリのコードは `DATABASE_URL` という名前で読み込むため、この手動追加が必要です

### 3. 認証用のシークレットを設定する

同じ「Environment Variables」に、もう1つ追加します。

| 変数名 | 値 |
|---|---|
| `AUTH_SECRET` | ランダムな文字列(下記コマンドで生成可能) |

ターミナルが使える場合:
```bash
openssl rand -base64 32
```
使えない場合は、[こちら](https://generate-secret.vercel.app/32) などランダム文字列生成サービスで代用可能です。

### 4. デプロイする

環境変数を設定したら「Deploy」を押します。ビルド時に自動でデータベースのテーブルが作成されます(`package.json` の `build` コマンドに `prisma migrate deploy` を組み込み済みのため、追加の操作は不要です)。

### 5. 最初のログインアカウントを作る

デプロイ直後はまだ誰もログインできないため、最初のアカウントを1つ作成する必要があります。手元のPCに、このリポジトリをクローンして以下を実行してください(社内のエンジニアに依頼する想定の手順です)。

```bash
npm install
# .env に本番のDATABASE_URL(手順2でVercelに設定したものと同じ値)を設定してから:
ADMIN_EMAIL="あなたのメールアドレス" ADMIN_NAME="表示名" ADMIN_PASSWORD="8文字以上のパスワード" npm run create-admin
```

実行後、デプロイされたURLにアクセスし、指定したメールアドレスとパスワードでログインできます。以降は画面上から「新規プロジェクト」「新規物件」「新規顧客」を作成して、実際のデータを入力していけます(サンプルデータは入りません)。

## ローカル開発

```bash
npm install
cp .env.example .env   # DATABASE_URL(ローカルPostgres等), AUTH_SECRET を設定
npx prisma migrate dev # スキーマ適用
npx prisma db seed     # サンプルデータ投入(ローカル検証用)
npm run dev
```

`http://localhost:3000` を開くとログイン画面が表示されます。

### シードアカウント(ローカル検証専用)

`npx prisma db seed` 実行後、以下のアカウントでログインできます。**本番環境ではこのシードは使わず、上記「5. 最初のログインアカウントを作る」の手順を使ってください。**

| メールアドレス | パスワード |
|---|---|
| t.sato.towa@gmail.com | `password123` |
| staff2@example.com | `password123` |

## ディレクトリ構成

```
prisma/schema.prisma       # Project / Unit / Customer / Interaction / User モデル
prisma/create-admin.ts     # 本番用の初回アカウント作成スクリプト
prisma.config.ts           # Prisma 7 の接続設定(DATABASE_URL はここで読み込み)
src/lib/prisma.ts          # PrismaClient シングルトン(pgアダプタ経由)
src/auth.ts                # NextAuth設定(Credentials Provider, JWTセッション)
src/proxy.ts               # Next.js 16のルート保護(旧 middleware.ts)
src/app/
  ├─ login/                # ログイン画面
  ├─ dashboard/            # 販売状況ダッシュボード
  ├─ units/                # 物件一覧・詳細・作成・編集
  ├─ projects/             # 分譲プロジェクト一覧・詳細・作成
  ├─ customers/             # 顧客一覧・詳細・作成
  └─ interactions/actions.ts # 商談・問い合わせ履歴の登録
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー
npm run build        # 本番ビルド(migrate deploy含む)
npm run lint         # ESLint
npx tsc --noEmit      # 型チェック
npx prisma studio     # DBの中身をGUIで確認
```
