import Link from "next/link";
import PageContainer from "./page-container";

const Navbar = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            FinanceRisk AI
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/predict"
              className="text-sm font-medium text-gray-600 transition hover:text-black"
            >
              Predict
            </Link>

            <Link
              href="/history"
              className="text-sm font-medium text-gray-600 transition hover:text-black"
            >
              History
            </Link>
          </nav>
        </div>
      </PageContainer>
    </header>
  );
};

export default Navbar;