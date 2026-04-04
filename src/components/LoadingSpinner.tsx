import { TEXT } from "@/constants/text";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-10 h-10 border-4 border-[#2A6FBB] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#555555]">{TEXT.LOADING}</p>
    </div>
  );
}
