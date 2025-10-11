import whisper_timestamped as whisper
import torch
import json
import os

# === Nhập tên file nhạc cần xử lý ===
audio_file = r"d:\End of Day Chill\Music\Anh Vui.mp3"
  # đổi thành file của bạn

# === Tải model (base đủ dùng, muốn chính xác hơn dùng "small" hoặc "medium") ===
device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("base", device=device)

print("🎧 Đang xử lý nhận dạng giọng hát và thời gian...")

# === Nhận dạng ===
result = whisper.transcribe(model, audio_file, language="vi")

# === Tạo file .lrc ===
output_file = os.path.splitext(audio_file)[0] + ".lrc"
with open(output_file, "w", encoding="utf-8") as f:
    for segment in result["segments"]:
        start = segment["start"]
        text = segment["text"].strip()
        m, s = divmod(int(start), 60)
        f.write(f"[{m:02d}:{s:02d}.00] {text}\n")

print(f"✅ Đã tạo file: {output_file}")
