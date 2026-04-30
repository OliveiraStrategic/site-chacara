import os
import shutil
from PIL import Image

def optimize_images(src_dir):
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                src_path = os.path.join(root, file)
                
                # Setup output path with .webp extension
                base, ext = os.path.splitext(file)
                dst_path = os.path.join(root, f"{base}.webp")
                
                print(f"Processing: {src_path}")
                try:
                    with Image.open(src_path) as img:
                        # Convert to RGB if necessary (e.g., for PNG with alpha channel)
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                            
                        # Resize if width exceeds 1920px
                        max_width = 1920
                        if img.width > max_width:
                            ratio = max_width / float(img.width)
                            new_height = int((float(img.height) * float(ratio)))
                            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                            
                        # Save as WebP
                        img.save(dst_path, "webp", quality=80)
                        
                    print(f"Saved: {dst_path}")
                    # Remove original file
                    os.remove(src_path)
                    print(f"Removed original: {src_path}")
                except Exception as e:
                    print(f"Error processing {src_path}: {e}")

if __name__ == "__main__":
    img_dir = os.path.join(os.path.dirname(__file__), 'assets', 'img')
    optimize_images(img_dir)
    print("Done optimizing images.")
