from pathlib import Path

srt_file = Path(r"D:\End of Day Chill\lyric\Nơi Này Có Anh.srt")
lrc_file = srt_file.with_suffix(".lrc")

with srt_file.open("r", encoding="utf-8") as f:
    blocks = f.read().strip().split("\n\n")

with lrc_file.open("w", encoding="utf-8") as f:
    for block in blocks:
        lines = block.strip().split("\n")
        if len(lines) < 3:
            continue

        time_line = lines[1].strip()
        start_time = time_line.split(" --> ")[0].strip()

        try:
            parts = start_time.split(":")
            h = int(parts[0])
            m = int(parts[1])
            s_ms = parts[2].split(",")
            s = int(s_ms[0])
            ms = int(s_ms[1])
        except Exception as e:
            print(f"Lỗi khi xử lý thời gian: {start_time} ({e})")
            continue

        # Chuyển đổi về phút:giây.mili
        total_minutes = h * 60 + m
        timestamp = f"[{total_minutes:02d}:{s:02d}.{ms//10:02d}]"

        # Gộp lyric
        text = " ".join(line.strip() for line in lines[2:])
        f.write(f"{timestamp} {text}\n")

print(f"✅ Đã tạo file LRC: {lrc_file}")
