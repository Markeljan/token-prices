import { TokenPriceExplorer } from "@/components/token-price-explorer";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-16 px-6 md:py-32 md:px-16 bg-white dark:bg-black">
        <TokenPriceExplorer />
      </main>
    </div>
  );
}
