import re

# === Đường dẫn file gốc và file xuất ra ===
a= "cuoichinh"
b= "Cưới Chính"
input_file = fr"D:\End of Day Chill\lyric\{a}.txt"
output_file = fr"D:\End of Day Chill\lyric\{b}.lrc"

def format_time(sec):
    m = int(sec // 60)
    s = sec % 60
    return f"[{m:02d}:{s:05.2f}]"

with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

with open(output_file, "w", encoding="utf-8") as f:
    for line in lines:
        parts = re.match(r"f\d+\s+([\d.]+)\s+([\d.]+)\s+\"(.*)\"", line.strip())
        if parts:
            start = float(parts.group(1))
            text = parts.group(3).strip()
            # Chuyển thời gian sang định dạng [mm:ss.xx]
            f.write(f"{format_time(start)} {text}\n")

print("✅ Đã tạo file:", output_file)
