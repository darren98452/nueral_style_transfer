# Neural Style Transfer AI

Transform ordinary images into artwork using deep learning.

Neural Style Transfer AI is a full-stack web application that applies the artistic style of one image to another using TensorFlow Hub's Arbitrary Image Stylization model. Users can upload a content image and a style image through a modern web interface and generate a stylized output in seconds.

## Overview

This project combines computer vision, deep learning, and web development to create an interactive image stylization platform.

The application uses a pretrained neural network from TensorFlow Hub to extract artistic features from a style image and transfer them onto a content image while preserving its structure and composition.

## Key Features

* AI-powered image stylization
* Upload custom content and style images
* Real-time image generation
* TensorFlow Hub integration
* Flask REST API backend
* React + Vite frontend
* Automatic image preprocessing
* High-quality image output
* CPU-optimized inference
* Fallback processing mode for improved reliability

## Demo Workflow

1. Upload a content image.
2. Upload a style image.
3. The backend preprocesses both images.
4. TensorFlow Hub performs neural style transfer.
5. The generated image is returned to the user.
6. Download the final stylized result.

## System Architecture

```text
React + Vite Frontend
          │
          ▼
     Flask API
          │
          ▼
TensorFlow Hub Model
          │
          ▼
 Generated Output Image
```

## Technology Stack

### Frontend

* React
* TypeScript
* Vite

### Backend

* Python
* Flask
* Flask-CORS

### AI & Computer Vision

* TensorFlow
* TensorFlow Hub
* OpenCV
* NumPy
* Pillow

## Model Used

TensorFlow Hub Arbitrary Image Stylization

The model learns artistic representations from style images and transfers them to content images while preserving the original scene structure.

### Example Use Cases

* Artistic photo editing
* Digital content creation
* Creative AI experimentation
* Educational demonstrations of deep learning
* Computer vision projects

## Project Structure

```text
style-transfer/
├── app.py
├── src/
├── output/
├── package.json
├── vite.config.ts
├── metadata.json
└── README.md
```

## Installation

### Clone Repository

```bash
git clone https://github.com/darren98452/nueral_style_transfer.git
cd nueral_style_transfer
```

### Backend Setup

```bash
python3 -m venv venv
source venv/bin/activate

pip install flask flask-cors pillow numpy opencv-python tensorflow tensorflow-hub
```

### Frontend Setup

```bash
npm install
```

## Running the Application

### Start Backend

```bash
source venv/bin/activate
python app.py
```

### Start Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API Endpoints

| Endpoint             | Method | Description              |
| -------------------- | ------ | ------------------------ |
| `/api/health`        | GET    | Service health check     |
| `/stylize`           | POST   | Generate stylized image  |
| `/output/<filename>` | GET    | Retrieve generated image |

## Future Enhancements

* GPU acceleration
* Multiple style blending
* Image history and gallery
* User authentication
* Docker deployment
* Cloud hosting support
* Mobile-responsive design improvements

## Author

**Darrenraj I**

Artificial Intelligence & Machine Learning Engineer

## License

This project is intended for educational, research, and portfolio purposes.
