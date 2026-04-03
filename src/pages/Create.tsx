import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [emoji, setEmoji] = useState("🎂");
  const [color, setColor] = useState("violet");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // suppress unused-variable warnings until wired in future tasks
  void setTitle;
  void setDate;
  void setEmoji;
  void setColor;
  void setSubmitting;
  void setError;
  void navigate;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 rounded-2xl p-6 flex flex-col gap-5">
        <h1 className="text-xl font-bold text-slate-100">New Countdown</h1>

        {/* TitleInput */}
        <>{/* placeholder */}</>

        {/* DatePicker */}
        <>{/* placeholder */}</>

        {/* EmojiPicker */}
        <>{/* placeholder */}</>

        {/* ColorPicker */}
        <>{/* placeholder */}</>

        {/* ErrorBanner */}
        <>{/* placeholder */}</>

        {/* SubmitButton */}
        <>{/* placeholder */}</>
      </div>
    </div>
  );
}
