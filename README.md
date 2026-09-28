# craft-court 物件管理アプリ

分譲住宅の複数プロジェクトを横断管理する社内向け物件管理アプリです。区画/棟ごとの販売ステータス管理、販売状況ダッシュボード、物件詳細情報、顧客・商談履歴の紐付けができます。

## 技術スタック

- Next.js 16 (App Router, TypeScript, Tailwind CSS)
- Prisma 7 + `@prisma/adapter-libsql`(SQLite互換。ローカルはファイルDB、将来はTurso等のホスティングDBに切替可能)
- Auth.js (NextAuth v5) — メールアドレス/パスワードによる社内アカウント認証
- Recharts — ダッシュボードのグラフ表示

## セットアップ

```bash
npm install
cp .env.example .env   # DATABASE_URL, AUTH_SECRET を設定(AUTH_SECRETは openssl rand -base64 32 などで生成)
npx prisma migrate dev # スキーマ適用・DBファイル作成
npx prisma db seed     # サンプルデータ投入
npm run dev
```

`http://localhost:3000` を開くとログイン画面が表示されます。

### シードアカウント(ローカル検証用)

シード実行後、以下のアカウントでログインできます。パスワードはローカル開発専用の仮パスワードです。実運用前に必ず変更してください。

| メールアドレス | パスワード |
|---|---|
| t.sato.towa@gmail.com | `password123` |
| staff2@example.com | `password123` |

## ディレクトリ構成

```
prisma/schema.prisma      # Project / Unit / Customer / Interaction / User モデル
prisma.config.ts          # Prisma 7 の接続設定(DATABASE_URL はここで読み込み)
src/lib/prisma.ts         # PrismaClient シングルトン(libSQLアダプタ経由)
src/auth.ts               # NextAuth設定(Credentials Provider, JWTセッション)
src/proxy.ts              # Next.js 16のルート保護(旧 middleware.ts)
src/app/
  ├─ login/               # ログイン画面
  ├─ dashboard/           # 販売状況ダッシュボード
  ├─ units/               # 物件一覧・詳細・作成・編集
  ├─ projects/             # 分譲プロジェクト一覧・詳細・作成
  ├─ customers/            # 顧客一覧・詳細・作成
  └─ interactions/actions.ts # 商談・問い合わせ履歴の登録
```

## 本番デプロイ(Vercel等)に関する重要な注意

Vercelなどのサーバーレスホスティングでは、実行環境のファイルシステムが再起動ごとにリセットされるため、**ローカルのSQLiteファイル(プロジェクトルートの`dev.db`)は本番環境では永続化されません**。

デプロイ前に、以下のいずれかへ接続先を切り替える必要があります。

1. **Turso / libSQL**(推奨・最小変更): `@prisma/adapter-libsql` は既に導入済みなので、`DATABASE_URL` をTursoのホスト型DBのURLに、`DATABASE_AUTH_TOKEN` を発行したトークンに差し替えるだけで動作します(コード変更不要)。
2. **Vercel Postgres / Neon等**: `prisma/schema.prisma` の `datasource` を `postgresql` に変更し、`@prisma/adapter-pg` 等に切り替えた上で `prisma migrate deploy` を実行します。

どちらの場合も、切替後に本番DBへ対して以下を実行してください。

```bash
npx prisma migrate deploy
npx prisma db seed   # 初期データが必要な場合のみ
```

## 開発コマンド

```bash
npm run dev     # 開発サーバー
npm run build   # 本番ビルド
npm run lint    # ESLint
npx tsc --noEmit  # 型チェック
npx prisma studio # DBの中身をGUIで確認(SQLiteのfile:プロトコルは現状未対応のため要調査)
```
