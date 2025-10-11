import sys
sys.stdout.reconfigure(encoding='utf-8')
import whisper
import os

# === Chỉnh đường dẫn tới file nhạc của bạn ===
audio_path = "Music/Cơ Hội Cuối.mp3"

# === Tải model (có thể chọn: tiny, base, small, medium, large) ===
model = whisper.load_model("base")

print("dang nhan dien loi bai hat...")
result = model.transcribe(audio_path, language="vi")

# === Xuất ra file .lrc (dạng lyric chuẩn có timestamp) ===
lrc_path = os.path.splitext(audio_path)[0] + ".lrc"
with open(lrc_path, "w", encoding="utf-8") as f:
    for seg in result["segments"]:
        m, s = divmod(int(seg["start"]), 60)
        timestamp = f"[{m:02d}:{s:02d}]"
        f.write(f"{timestamp} {seg['text']}\n")

print(f"Tao lyric thanh cong: {lrc_path}")
