import os
from PIL import Image

def process_image():
    # To fix the inner loss of detail, let's start over from the rembg processed image,
    # and ONLY replace purple pixels that are fully enclosed by NOTHING (transparent), 
    # OR we use a simpler heuristic: the inner pink/magenta has a higher value of Red and Green 
    # than the dark purple glitter. Or better yet, we just apply the dark purple filter ONLY
    # on the lower text "DELICIOSAS CARNITAS" where the glitter was trapped, not the whole image.
    
    input_path = r"c:\Users\carl2\Downloads\Logo la Patrona VF.png"
    out_logo_path = r"c:\Users\carl2\.gemini\antigravity\scratch\carnitas-el-patron\src\assets\images\logo.png"

    from rembg import remove, new_session
    print("Opening raw image...")
    img = Image.open(input_path).convert("RGBA")
    
    # 1. Rembg to get the clean outer edge
    print("Removing background with rembg...")
    session = new_session("u2net")
    output = remove(img, session=session)
    
    # 2. Add the custom dark purple filter ONLY to the bottom half of the image
    # (where "DELICIOSAS CARNITAS" is and where the trapped glitter is).
    # The neon pig is in the top/middle.
    datas = output.getdata()
    width, height = output.size
    
    newData = []
    
    for idx, item in enumerate(datas):
        x = idx % width
        y = idx // width
        
        r, g, b, a = item[:4]
        
        # If the pixel is below a certain height (e.g., bottom 35% of the image)
        if y > height * 0.65:
            # We are in the text area. Apply the purple filter carefully.
            # Glitter is dark purple / magenta.
            if a > 0:
                if b > g + 5 and r > g + 5 and max(r, b) > 20:
                    # Trapped glitter
                    newData.append((0, 0, 0, 0))
                elif b > g and r > g and max(r,b) > 15 and max(r,b) - g > 15:
                    # Trapped dark glitter
                    newData.append((0, 0, 0, 0))
                else:
                    newData.append(item)
            else:
                newData.append(item)
        else:
            # Upper part (Neon Pig sign), keep everything rembg kept
            newData.append(item)
            
    # Reconstruct Image
    output.putdata(newData)
    
    # Composite over exactly #050505
    bg = Image.new("RGBA", output.size, (5, 5, 5, 255))
    clean_logo = Image.alpha_composite(bg, output)
    
    clean_logo.save(out_logo_path, format="PNG")
    print("Saved restored logo to:", out_logo_path)

if __name__ == "__main__":
    process_image()
