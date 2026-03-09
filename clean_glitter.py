from PIL import Image

def clean_glitter():
    logo_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\logo.png"
    
    print("Opening logo...")
    img = Image.open(logo_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    
    # We are looking for purple/pink/magenta pixels.
    # The logo letters are beige/gold (high R, high G, low B), outlined in black/dark brown.
    # The background is exactly #050505 (5, 5, 5).
    # The remaining glitter is purple/pinkish.
    
    for item in datas:
        r, g, b, a = item[:4]
        
        # If it's already the exact dark background or fully transparent, keep it
        if a == 0 or (r == 5 and g == 5 and b == 5):
            newData.append(item)
            continue
            
        # Detect purple/magenta/pink pixels:
        # These typically have high Red and high Blue, but significantly lower Green.
        # Or they are just generally "cool" pinks where Blue > Green and Red > Green.
        if b > g + 5 and r > g + 5 and max(r, b) > 20:
            # It's a purple/pink glitter pixel. Replace with the dark background.
            newData.append((5, 5, 5, a))
        # Catch darker purple pixels that rembg might have darkened but not removed
        elif b > g and r > g and max(r,b) > 15 and max(r,b) - g > 15:
            newData.append((5, 5, 5, a))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(logo_path, "PNG")
    print("Cleaned logo saved to:", logo_path)

if __name__ == "__main__":
    clean_glitter()
