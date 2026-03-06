import os

# Create simple colored SVG placeholders for each character
characters = [
    ("fushiguro-megumi", "Megumi Fushiguro", "#2E7D32"),  # Green
    ("akari-nitta", "Akari Nitta", "#E91E63"),  # Pink
    ("kiyotaka-ijichi", "Kiyotaka Ijichi", "#2196F3"),  # Blue
    ("panda", "Panda", "#795548"),  # Brown
    ("shoko-ieiri", "Shoko Ieiri", "#9C27B0"),  # Purple
    ("kasumi-miwa", "Kasumi Miwa", "#03A9F4"),  # Light Blue
    ("rin-amai", "Rin Amai", "#FF5722"),  # Orange
    ("toge-inumaki", "Toge Inumaki", "#607D8B"),  # Gray Blue
    ("kokichi-muta", "Kokichi Muta", "#9E9E9E"),  # Gray
    ("tsumiki-fushiguro", "Tsumiki Fushiguro", "#4CAF50"),  # Green
    ("fumihiko-takaba", "Fumihiko Takaba", "#FFEB3B"),  # Yellow
    ("hiromi-higuruma", "Hiromi Higuruma", "#673AB7"),  # Deep Purple
    ("kirara-hoshi", "Kirara Hoshi", "#E91E63"),  # Pink
    ("momo-nishimiya", "Momo Nishimiya", "#03A9F4"),  # Light Blue
    ("masamichi-yaga", "Masamichi Yaga", "#424242"),  # Dark Gray
    ("noritoshi-kamo", "Noritoshi Kamo", "#F44336"),  # Red
    ("mai-zenin", "Mai Zenin", "#FF9800"),  # Orange
    ("maki-zenin", "Maki Zenin", "#4CAF50"),  # Green
    ("takuma-ino", "Takuma Ino", "#3F51B5"),  # Indigo
    ("yoshinobu-gakuganji", "Yoshinobu Gakuganji", "#5D4037"),  # Brown
    ("haba", "Haba", "#8BC34A"),  # Light Green
    ("kinji-hakari", "Kinji Hakari", "#FF5722"),  # Deep Orange
    ("suguru-geto", "Suguru Geto", "#673AB7"),  # Purple
    ("aoi-todo", "Aoi Todo", "#795548"),  # Brown
    ("mei-mei", "Mei Mei", "#9C27B0"),  # Purple
    ("hana-kurusu", "Hana Kurusu", "#FFF59D"),  # Light Yellow
    ("takako-uro", "Takako Uro", "#81D4FA"),  # Light Blue
    ("naoya-zenin", "Naoya Zenin", "#4CAF50"),  # Green
    ("kento-nanami", "Kento Nanami", "#FFC107"),  # Amber
    ("yuta-okkotsu", "Yuta Okkotsu", "#2196F3"),  # Blue
    ("kenjaku", "Kenjaku", "#212121"),  # Black
    ("gojo-satoru", "Satoru Gojo", "#1565C0"),  # Blue
    ("ryomen-sukuna", "Ryomen Sukuna", "#B71C1C"),  # Dark Red
    ("ryu-ishigori", "Ryu Ishigori", "#FF8A65"),  # Light Red
    ("hajime-kashimo", "Hajime Kashimo", "#FFEB3B"),  # Yellow
    ("naobito-zenin", "Naobito Zenin", "#1565C0"),  # Blue
    ("yuki-tsukumo", "Yuki Tsukumo", "#7B1FA2"),  # Purple
    ("master-tengen", "Master Tengen", "#9E9E9E"),  # Gray
]

os.makedirs('public/images', exist_ok=True)

for char_id, name, color in characters:
    # Create simple colored rectangle SVG
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
  <rect fill="{color}" width="300" height="400"/>
  <text x="150" y="200" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">{name}</text>
</svg>'''
    
    with open(f'public/images/{char_id}.svg', 'w') as f:
        f.write(svg)
    
    print(f"Created: {char_id}.svg")

print("Done!")
