import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/app/logout/actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ダッシュボード" },
  { href: "/units", label: "物件一覧" },
  { href: "/projects", label: "プロジェクト" },
  { href: "/customers", label: "顧客" },
];

export async function NavBar() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-slate-900">
            物件管理アプリ
          </span>
          <nav className="flex gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {session.user.name ?? session.user.email}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
