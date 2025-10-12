input_file = r"D:\End of Day Chill\lyric\Anh Vui_sync.txt"
output_file = r"D:\End of Day Chill\lyric\Anh Vui.lrc"

with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

with open(output_file, "w", encoding="utf-8") as f:
    for line in lines:
        if "|" in line:
            time_part, lyric = line.strip().split("|", 1)
            time_part = time_part.strip()
            lyric = lyric.strip()
            # đổi từ 00:00:12.50 -> [00:12.50]
            if ":" in time_part:
                t = time_part.split(":")
                if len(t) == 3:
                    m = int(t[1])
                    s = float(t[2])
                    f.write(f"[{m:02d}:{s:05.2f}] {lyric}\n")
