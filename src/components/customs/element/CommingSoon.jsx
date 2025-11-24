import { Hourglass, Sparkles } from "lucide-react";
import PrimaryButton from "../button/PrimaryButton";

export default function CommingSoon({
  title = "Comming Soon",
  subtitle = "Fitur ini sedang dalam pengembangan",
  description = "Kami sedang menyiapkan pengalaman terbaik untuk Anda. Nantikan pembaruan berikutnya.",
  actionText = "Kembali",
  onAction,
}) {
  return (
    <div className="max-w-sm mx-auto p-4">
      <div className="relative rounded-3xl bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 shadow-soft overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-10 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--c-primary)] to-indigo-500 opacity-10 blur-2xl" />
          <div className="absolute -bottom-16 -right-14 w-44 h-44 rounded-full bg-gradient-to-tr from-indigo-500 to-[var(--c-primary)] opacity-10 blur-2xl" />
        </div>

        <div className="px-6 pt-8 pb-6">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[var(--c-primary)] to-indigo-600 text-white flex items-center justify-center shadow-lg">
            <Hourglass className="w-10 h-10" />
          </div>

          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-[var(--c-primary)] font-semibold text-xs">
              <Sparkles className="w-4 h-4" />
              Segera Hadir
            </div>

            <h1 className="mt-3 text-xl font-semibold text-[var(--c-primary)] dark:text-slate-100">
              {title}
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
              {subtitle}
            </p>
            <p className="mt-3 text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-6">
            <PrimaryButton title={actionText} handleOnClick={onAction} />
          </div>
        </div>
      </div>
    </div>
  );
}
