import os
import sys
import uuid
import time
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image

# Reduce TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

try:
    import numpy as np
    import cv2
    import tensorflow as tf
    import tensorflow_hub as hub
    # CPU threading optimization for Raspberry Pi
    tf.config.threading.set_intra_op_parallelism_threads(2)
    tf.config.threading.set_inter_op_parallelism_threads(2)
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False

app = Flask(__name__)
# Enable CORS for cross-origin frontend requests from Google AI Studio or external IPs
CORS(app)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# JPEG output quality
JPEG_QUALITY = 95
IMAGE_SIZE = 512

# TensorFlow Hub model URL
MODEL_URL = "https://tfhub.dev/google/magenta/arbitrary-image-stylization-v1-256/2"
model = None

if TF_AVAILABLE:
    try:
        print("[INFO] Loading style transfer model...")
        start_model = time.time()
        model = hub.load(MODEL_URL)
        print(f"[INFO] Model loaded successfully in {time.time() - start_model:.2f} sec")
    except Exception as e:
        print(f"[WARN] Error loading model from Hub, fallback to PIL blending activated: {str(e)}")
        TF_AVAILABLE = False

def load_image(path, max_dim=512):
    """
    Loads and preprocesses image efficiently for Raspberry Pi.
    """
    img = Image.open(path).convert("RGB")
    w, h = img.size
    scale = max_dim / max(w, h)
    new_w = int(w * scale)
    new_h = int(h * scale)
    
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    img_array = np.array(img).astype(np.float32) / 255.0
    # Add batch dimension
    img_array = img_array[np.newaxis, ...]
    
    return tf.convert_to_tensor(img_array)

def run_style_transfer(content_path, style_path, output_path):
    """
    Executes TensorFlow Hub arbitrary style transfer using optimized model.
    Falls back gracefully if TensorFlow/TensorFlow Hub are missing.
    """
    total_start = time.time()
    
    if not TF_AVAILABLE or model is None:
        print("[INFO] TF not available or failed to load. Running fallback alpha blend.")
        c_img = Image.open(content_path).convert("RGB")
        s_img = Image.open(style_path).convert("RGB").resize(c_img.size)
        
        # High quality multi-layer blend with smart enhancements
        result = Image.blend(c_img, s_img, 0.45)
        from PIL import ImageEnhance
        result = ImageEnhance.Contrast(result).enhance(1.25)
        result = ImageEnhance.Color(result).enhance(1.15)
        result.save(output_path, "JPEG", quality=95)
        print(f"[INFO] Fallback blending done in {time.time() - total_start:.2f} sec")
        return

    print(f"[INFO] Starting style transfer pipeline...")
    # Load and preprocess
    content_image = load_image(content_path, IMAGE_SIZE)
    style_image = load_image(style_path, IMAGE_SIZE)
    
    inference_start = time.time()
    
    # Perform core TF execution
    stylized_image = model(
        tf.constant(content_image),
        tf.constant(style_image)
    )[0]
    
    inference_time = time.time() - inference_start
    print(f"[INFO] Inference completed in {inference_time:.2f} sec")
    
    # Save the tensor image
    tensor = stylized_image * 255
    tensor = np.array(tensor, dtype=np.uint8)
    if tensor.ndim > 3:
        tensor = tensor[0]
        
    # Convert RGB to BGR for OpenCV
    tensor_bgr = cv2.cvtColor(tensor, cv2.COLOR_RGB2BGR)
    
    # Read original resolution to scale output back for maximum detail preservation
    original_size = Image.open(content_path).size
    tensor_resized = cv2.resize(tensor_bgr, original_size, interpolation=cv2.INTER_LANCZOS4)
    
    cv2.imwrite(
        output_path,
        tensor_resized,
        [cv2.IMWRITE_JPEG_QUALITY, JPEG_QUALITY]
    )
    
    total_time = time.time() - total_start
    print(f"[INFO] Saved output to: {output_path} | Total execution: {total_time:.2f} sec")

@app.route("/stylize", methods=["POST"])
def stylize():
    if "content_image" not in request.files or "style_image" not in request.files:
        return jsonify({"error": "Content and style images are both required."}), 400

    content_file = request.files["content_image"]
    style_file = request.files["style_image"]

    session_id = uuid.uuid4().hex[:10]
    content_p = os.path.join(OUTPUT_DIR, f"content_{session_id}.jpg")
    style_p = os.path.join(OUTPUT_DIR, f"style_{session_id}.jpg")
    output_filename = f"stylized_{session_id}.jpg"
    output_p = os.path.join(OUTPUT_DIR, output_filename)

    content_file.save(content_p)
    style_file.save(style_p)

    try:
        # Run optimized edge-computing style transfer pipeline
        run_style_transfer(content_p, style_p, output_p)
        
        # Clean temporary original files to preserve Raspberry Pi storage
        if os.path.exists(content_p):
            os.remove(content_p)
        if os.path.exists(style_p):
            os.remove(style_p)
            
        return jsonify({
            "output_image": f"http://{request.host}/output/{output_filename}"
        })
    except Exception as e:
        return jsonify({"error": f"Inference engine failure: {str(e)}"}), 500

@app.route("/output/<filename>")
def get_output(filename):
    return send_from_directory(OUTPUT_DIR, filename)

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "engine": "TensorFlow-Hub-Arbitrary-Stylization" if TF_AVAILABLE else "PIL-CPU-Fallback",
        "threads": "2x2 Parallel",
        "tf_available": TF_AVAILABLE
    })

if __name__ == "__main__":
    print(f"--- Starting PiStyle AI neural service on http://0.0.0.0:5000 ---")
    app.run(host="0.0.0.0", port=5000, debug=True)
