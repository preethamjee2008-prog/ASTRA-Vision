🚀 ASTRA Vision — Vehicle Recognition & Evidence Review

AI-powered computer-vision application for image classification, vehicle recognition, reference matching, and transparent evidence review.

ASTRA Vision is a full-stack TypeScript/React computer-vision application designed to analyze uploaded images, classify them into supported vehicle categories, compare them with a reference catalog, and present transparent evidence about the analysis.

The project combines React, TypeScript, Express, Hugging Face Transformers, ONNX Runtime, Sharp, and CLIP-based zero-shot classification into a complete image-analysis workflow.

⸻

🌐 Project Repository

GitHub:
https://github.com/preethamjee2008-prog/ASTRA-Vision

Project: ASTRA Vision
Developer: Preetham Alawandimath

🔗Example Website Links
1. https://astra-vision--preethamjee2008.replit.app/
2. https://antigravity.luch.dev/site/91cca092-f8de-4f86-8a63-b9e6ec61c41c/1754391084f35442ac4213be/
3. https://astra-aircraft-reference-app--kilol55772.replit.app
⸻

📌 Table of Contents

* Project Overview
* Key Features
* Supported Classes
* How ASTRA Vision Works
* System Architecture
* Technology Stack
* AI Model
* Classification Pipeline
* Reference Matching
* Evidence System
* Dataset
* Project Structure
* Prerequisites
* Installation
* Environment Variables
* Running the Project
* Using the Application
* API Reference
* Evaluation
* Security and File Handling
* Limitations
* Troubleshooting
* Development
* Responsible Use
* Future Improvements
* Submission Checklist
* License and Attribution
* Project Status
* Developer

⸻

🔭 Project Overview

ASTRA Vision provides an end-to-end workflow for analyzing an uploaded image against a bounded vehicle-class vocabulary and a supplied reference catalog.

The application is designed around three major components:

1. AI-based image classification
2. Reference image matching
3. Evidence-aware result presentation

The system does not simply return a class label. It also provides alternative predictions, evidence information, catalog references, image metadata, preprocessing details, and inference information.

⸻

✨ Key Features

🖼️ Image Upload

ASTRA Vision supports:

* JPG
* JPEG
* PNG
* WEBP

Maximum upload size:

10 MB

Uploaded files are validated on the server before being processed.

⸻

🤖 AI Image Classification

ASTRA Vision uses:

Xenova/clip-vit-base-patch32

through Hugging Face Transformers and ONNX Runtime.

The model performs zero-shot image classification, allowing the application to compare an image against predefined text labels.

⸻

🎯 Five-Class Recognition

The current system supports five high-level categories:

Aircraft
Helicopter
Drone
Military Vehicle
Naval Vessel

The application also displays alternative predictions instead of showing only a single result.

⸻

🔍 Exact Reference Matching

ASTRA Vision calculates a SHA-256 hash for uploaded files and checks it against the supplied reference catalog.

If the uploaded file is exactly the same as a catalog image, the system can identify it as an exact file match.

This provides deterministic evidence based on file identity.

⸻

🧠 Visual-Neighbor Matching

When an uploaded image does not exactly match a catalog image, ASTRA Vision can perform visual-neighbor comparison.

The system uses normalized image signatures and similarity comparison to identify potentially similar reference images.

A visual-neighbor result is treated as a reference signal, not as proof of real-world identity.

⸻

📚 Reference Catalog

The project includes a reference catalog containing:

* Reference images
* Image labels
* Source titles
* Creators
* Licenses
* Source pages
* Wikimedia Commons records where applicable

This allows the application to present traceable reference information alongside analysis results.

⸻

📊 Analysis Results

After processing an image, the interface can display:

* Predicted class
* Confidence signal
* Alternative predictions
* Evidence state
* Catalog reference
* Image metadata
* Preprocessing information
* Model information
* Inference timing
* Evaluation status
* System limitations

⸻

🏷️ Supported Classes

The current classification vocabulary is:

Class	Description
✈️ Aircraft	Fixed-wing aircraft and general aircraft category
🚁 Helicopter	Rotorcraft/helicopter category
🛸 Drone	Unmanned aerial vehicle category
🪖 Military Vehicle	Military ground vehicle category
🚢 Naval Vessel	Naval/military maritime vessel category

The project intentionally uses a bounded vocabulary instead of claiming unrestricted fine-grained vehicle recognition.

⸻

⚙️ How ASTRA Vision Works

The complete workflow is:

                 ┌───────────────────────┐
                 │      User Image      │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ File Validation       │
                 │ Type / Size / Decode  │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ Image Normalization   │
                 │ Sharp Processing      │
                 └───────────┬───────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌───────────────────┐        ┌────────────────────┐
    │ SHA-256 Matching  │        │ CLIP Classification│
    │ Exact File Match  │        │ Zero-Shot AI       │
    └─────────┬─────────┘        └──────────┬─────────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ Visual Neighbor Match │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ Evidence-Aware Result │
                 └───────────┬───────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ React Review Interface│
                 └───────────────────────┘

⸻

🏗️ System Architecture

                    ASTRA VISION
                         │
                         ▼
              ┌────────────────────┐
              │ React / Vite UI    │
              │                    │
              │ Live Analysis      │
              │ Evaluation         │
              │ Catalog            │
              │ History            │
              │ About              │
              └─────────┬──────────┘
                        │
                    HTTP / JSON
                        │
                        ▼
              ┌────────────────────┐
              │   Express API      │
              │                    │
              │ Upload Handling    │
              │ Image Processing   │
              │ AI Inference       │
              │ Catalog Matching   │
              │ History            │
              └─────────┬──────────┘
                        │
        ┌───────────────┼────────────────┐
        │               │                │
        ▼               ▼                ▼
 ┌─────────────┐ ┌──────────────┐ ┌───────────────┐
 │ Image       │ │ Reference    │ │ CLIP          │
 │ Validation  │ │ Catalog      │ │ Zero-Shot     │
 │ Sharp       │ │ Dataset      │ │ Classification │
 │ Multer      │ │ CSV / Images │ │ ONNX Runtime  │
 └─────────────┘ └──────────────┘ └───────────────┘
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
              ┌────────────────────┐
              │ Evidence-Aware     │
              │ Analysis Response  │
              └────────────────────┘

⸻

🛠️ Technology Stack

Layer	Technology
Frontend	React 19
Frontend Build	Vite 7
Language	TypeScript 5.9
Backend	Express 5
AI/ML	Hugging Face Transformers
Model Runtime	ONNX Runtime Node
Vision Model	CLIP
Image Processing	Sharp
File Upload	Multer
Validation	Zod
Data Fetching	TanStack Query
Styling	Tailwind CSS
UI Components	Radix UI
Logging	Pino / Pino HTTP
API Contract	OpenAPI
Package Manager	pnpm
Workspace	pnpm Workspace

⸻

🧠 AI Model

ASTRA Vision uses:

Xenova/clip-vit-base-patch32

The model is accessed through:

Hugging Face Transformers
        +
ONNX Runtime

⸻

What is CLIP?

CLIP is an image-and-text model capable of comparing visual content with text descriptions.

ASTRA Vision uses this capability to compare an uploaded image against predefined categories.

For example:

Image
  │
  ├── "Aircraft"
  ├── "Helicopter"
  ├── "Drone"
  ├── "Military Vehicle"
  └── "Naval Vessel"

The model produces scores for these candidate labels.

The highest-scoring class is returned as the primary prediction while alternative predictions can also be displayed.

⸻

🔬 Classification Pipeline

The classification process can be summarized as:

Input Image
     │
     ▼
Image Validation
     │
     ▼
Image Normalization
     │
     ▼
CLIP Image Processing
     │
     ▼
Compare Against Text Labels
     │
     ▼
Generate Class Scores
     │
     ▼
Sort Predictions
     │
     ▼
Primary + Alternative Classes

The output is a model-derived confidence signal.

It should not be interpreted as a validated probability of correctness.

⸻

🔎 Reference Matching

ASTRA Vision uses two major reference mechanisms.

1. Exact File Matching

The uploaded image is hashed using SHA-256.

Uploaded Image
       │
       ▼
   SHA-256
       │
       ▼
Compare with Catalog Hashes
       │
   ┌───┴────┐
   │        │
 Match    No Match
   │        │
   ▼        ▼
Exact     Continue
Match     Analysis

If the hashes are identical, the uploaded bytes correspond to the catalog image.

⸻

2. Visual-Neighbor Matching

When no exact file match exists, ASTRA Vision can compare the image against reference images using visual similarity.

The system can surface a visually similar reference when the configured similarity threshold is satisfied.

This is presented as:

Visual Neighbor

rather than:

Confirmed Identity

This distinction is important because visual similarity does not establish that two images contain the same real-world vehicle.

⸻

📚 Evidence System

ASTRA Vision separates AI classification from reference evidence.

Evidence State: Exact File Match

exact-file-match

Meaning:

The uploaded file has the same SHA-256 hash as a catalog reference.

⸻

Evidence State: Visual Neighbor

visual-neighbor

Meaning:

The uploaded image is visually similar to a reference image under the configured similarity method.

⸻

Evidence State: Catalog Reference

catalog-reference

Used for catalog-backed reference information.

⸻

📊 Dataset

The reference dataset is located under:

artifacts/astra-vision/public/dataset/

Dataset structure:

dataset/
├── labels.csv
├── credits.csv
└── images/
    ├── ...
    └── ...

⸻

Dataset Files

labels.csv

Maps reference images to their supported classes.

credits.csv

Contains information such as:

* Source title
* Creator
* License
* Source page
* Wikimedia Commons record

images/

Contains the supplied reference image collection.

The current project documentation describes a dataset of:

150 reference images

across the five supported classes.

⸻

📁 Project Structure

ASTRA-Vision/
│
├── artifacts/
│   ├── api-server/
│   │   └── Express API and vision service
│   │
│   ├── astra-vision/
│   │   └── React/Vite frontend and dataset
│   │
│   └── mockup-sandbox/
│       └── UI sandbox
│
├── lib/
│   ├── api-client-react/
│   │   └── Generated API client
│   │
│   ├── api-spec/
│   │   └── OpenAPI specification
│   │
│   ├── api-zod/
│   │   └── Generated Zod schemas
│   │
│   └── db/
│       └── Database package
│
├── scripts/
│   └── Workspace scripts
│
├── docs/
│   ├── REQUIREMENTS.md
│   ├── DATASET.md
│   ├── ARCHITECTURE.md
│   ├── VIDEO_SCRIPT.md
│   └── SUBMISSION_CHECKLIST.md
│
├── attached_assets/
│   └── Project assets
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── tsconfig.json
├── .env.example
└── README.md

⸻

💻 Prerequisites

Before installing ASTRA Vision, make sure you have:

* Node.js 24.x
* pnpm
* Git

Verify:

node --version
pnpm --version
git --version

The project was designed for Node.js 24.x.

⸻

📥 Installation

Step 1 — Clone the Repository

git clone https://github.com/preethamjee2008-prog/ASTRA-Vision.git

Enter the project directory:

cd ASTRA-Vision

⸻

Step 2 — Install Dependencies

pnpm install

⸻

Step 3 — Configure Environment

Copy the example environment file:

cp .env.example .env

On Windows PowerShell:

Copy-Item .env.example .env

⸻

🔐 Environment Variables

Example:

PORT=5000
BASE_PATH=/
NODE_ENV=development
LOG_LEVEL=info

Variable	Required	Description
PORT	Yes	Port used by the API/server
BASE_PATH	Yes for Vite	Frontend base path
NODE_ENV	No	Runtime environment
LOG_LEVEL	No	Logging level

Important

Do not commit:

.env

Commit:

.env.example

instead.

⸻

▶️ Running the Project

ASTRA Vision contains both a frontend and an API server.

Terminal 1 — Start API

pnpm --filter @workspace/api-server run dev

⸻

Terminal 2 — Start Frontend

pnpm --filter @workspace/astra-vision run dev

Then open the frontend URL shown by the Vite development server.

⸻

🖥️ Using the Application

Basic Workflow

1. Start the API server.
2. Start the frontend.
3. Open the application.
4. Navigate to Live Analysis.
5. Upload an image.
6. Wait for processing.
7. Review the analysis result.

The result may include:

* Predicted class
* Confidence signal
* Alternative predictions
* Evidence status
* Reference image
* Catalog information
* Image metadata
* Processing information
* Inference timing
* Evaluation information

⸻

🖼️ Supported Image Formats

.jpg
.jpeg
.png
.webp

Maximum upload size:

10 MB

⸻

🔌 API Reference

The API is available under:

/api

⸻

Health Check

GET /api/health

Used to verify that the backend is running.

⸻

Model Information

GET /api/vision/model-info

Returns information about the configured vision model and analysis mode.

⸻

Evaluation

GET /api/vision/evaluation

Returns the current evaluation and methodology information.

⸻

Reference Catalog

GET /api/vision/catalog

Returns reference catalog information.

⸻

Analysis History

GET /api/vision/history

Returns recent analysis history.

⸻

Analyze Image

POST /api/vision/analyze

Content type:

multipart/form-data

Required field:

image=<JPG|PNG|WEBP file>

Example:

curl -X POST \
  http://localhost:5000/api/vision/analyze \
  -F "image=@/path/to/image.jpg"

Replace the port with the port configured in your environment.

⸻

📜 API Contract

The OpenAPI specification is maintained under:

lib/api-spec/

Generated schemas and API client:

lib/api-zod/
lib/api-client-react/

The OpenAPI specification acts as the source of truth for the API contract.

⸻

📈 Evaluation

The current project documentation intentionally does not claim a measured classification accuracy.

Current evaluation status:

Not evaluated

Formal metrics such as:

* Accuracy
* Precision
* Recall
* F1 Score
* Top-3 Accuracy

are not reported as measured results.

This avoids presenting unverified performance numbers as factual results.

⸻

Planned Evaluation

The project documentation describes a possible stratified evaluation methodology:

80% Training
10% Validation
10% Testing

This represents a planned evaluation approach rather than measured performance.

⸻

🔐 Security and File Handling

ASTRA Vision performs server-side validation of uploaded images.

Supported file types:

JPG
JPEG
PNG
WEBP

Maximum size:

10 MB

The server also validates that uploaded images can be decoded before analysis.

⸻

Environment Security

Never commit:

.env

Use:

.env.example

for public configuration documentation.

⸻

Logging

The application uses:

Pino
Pino HTTP

Logs should be reviewed before publication if the deployment environment contains sensitive information.

⸻

Analysis History

The current analysis history is lightweight and in-memory.

It is intended for:

Demo
Review
Development

rather than permanent production auditing.

⸻

⚠️ Limitations

ASTRA Vision is a research/demo/review prototype and has several limitations.

Dataset Size

The supplied reference dataset contains 150 images.

This is relatively small for general-purpose computer vision.

⸻

Image-Level Classification

The dataset does not provide bounding-box annotations.

Therefore, the application does not claim validated object detection.

⸻

Zero-Shot Classification

CLIP zero-shot scores are model signals.

They are not equivalent to independently validated classification accuracy.

⸻

Visual Similarity

A visually similar reference does not prove real-world identity.

Images can differ because of:

* Camera angle
* Viewpoint
* Lighting
* Crop
* Scale
* Background
* Image quality
* Vehicle variants
* Source differences

⸻

Evaluation

Formal benchmark metrics have not currently been measured.

⸻

Hardware

CPU inference can be slower than GPU-based inference.

⸻

History

The current history system is in-memory and is intended primarily for demonstration/review purposes.

⸻

🧯 Troubleshooting

pnpm: command not found

Install pnpm and verify:

pnpm --version

If using Corepack:

corepack enable

Then:

pnpm install

⸻

Wrong Node Version

Check:

node --version

ASTRA Vision was designed for:

Node.js 24.x

Use a version manager such as nvm if necessary.

⸻

Dependency Installation Problems

Remove node_modules and reinstall.

Linux/macOS:

rm -rf node_modules
pnpm install

Windows PowerShell:

Remove-Item -Recurse -Force node_modules
pnpm install

Do not delete pnpm-lock.yaml unless you intentionally want to regenerate the dependency lockfile.

⸻

TypeScript Errors

Run:

pnpm run typecheck

Fix the first reported error before addressing downstream errors.

⸻

Build Problems

Run:

pnpm run build

Check:

* Node version
* pnpm version
* .env
* Dependencies
* Workspace package names
* Generated API files

⸻

API Does Not Respond

Start the API:

pnpm --filter @workspace/api-server run dev

Then test:

curl http://localhost:5000/api/health

Replace 5000 with your configured API port.

⸻

Frontend Cannot Reach API

Check:

1. API server is running.
2. API is listening on the expected port.
3. Frontend is running.
4. Environment configuration is correct.
5. Generated API client matches the OpenAPI specification.

⸻

First AI Model Load Is Slow

The first model initialization can take longer when the model files are not cached locally.

Internet access may be required during the initial model download.

Later runs can use the locally cached model.

⸻

🧑‍💻 Development

Type Checking

pnpm run typecheck

⸻

Production Build

pnpm run build

⸻

API Contract Updates

When modifying the API contract, update:

lib/api-spec/openapi.yaml

Then regenerate related artifacts:

pnpm --filter @workspace/api-spec run codegen

Generated API files should not be manually modified when they are expected to be regenerated from OpenAPI.

⸻

🔄 Recommended Development Workflow

When changing an API:

1. Update OpenAPI specification
           ↓
2. Regenerate schemas/client
           ↓
3. Update backend implementation
           ↓
4. Update frontend
           ↓
5. Run type checking
           ↓
6. Run production build
           ↓
7. Test the affected feature

⸻

🧭 Responsible Use

ASTRA Vision is designed as a transparent image-review and computer-vision prototype.

Its outputs should not be treated as authoritative proof of:

* Real-world identity
* Ownership
* Intent
* Operational status
* Location
* Affiliation
* Other consequential facts

Model confidence and visual similarity are signals generated by the implemented methods.

They should be independently reviewed before being used for consequential decisions.

The project intentionally communicates its limitations instead of presenting unmeasured performance as fact.

⸻

🚀 Future Improvements

Possible future development directions include:

* Larger and more diverse datasets
* Fine-tuned classification models
* Dedicated aircraft classification
* Fine-grained vehicle identification
* Additional vehicle categories
* Object detection
* Bounding-box visualization
* Improved image embeddings
* GPU acceleration
* Better similarity search
* More robust evaluation datasets
* Precision/recall benchmarking
* Confusion matrix visualization
* Top-1 and Top-3 accuracy evaluation
* Persistent analysis history
* Advanced model comparison
* Improved reference retrieval
* Additional metadata sources
* Enhanced UI and visualization

These are potential development directions rather than currently implemented capabilities.

⸻

📋 Submission Checklist

Before submitting the repository, verify:

Repository

* [ ]	Source code is present
* [ ]	README.md is present
* [ ]	package.json is present
* [ ]	pnpm-lock.yaml is committed
* [ ]	pnpm-workspace.yaml is committed
* [ ]	.env.example is committed
* [ ]	.env is NOT committed
* [ ]	Dataset documentation is included
* [ ]	Dataset attribution is included
* [ ]	Documentation is included

⸻

Local Verification

Run:

pnpm install
pnpm run typecheck
pnpm run build

Then launch the application and test:

* [ ]	Image upload
* [ ]	JPG/JPEG upload
* [ ]	PNG upload
* [ ]	WEBP upload
* [ ]	Oversized file rejection
* [ ]	Unsupported file rejection
* [ ]	AI analysis
* [ ]	Alternative predictions
* [ ]	Evidence information
* [ ]	Catalog
* [ ]	Evaluation
* [ ]	History
* [ ]	No secret values exposed

⸻

🎥 Project Demonstration

For a technical project presentation, demonstrate the following workflow:

1. Introduce the problem
2. Explain ASTRA Vision
3. Demonstrate the user interface
4. Upload an image
5. Show preprocessing
6. Show AI classification
7. Show alternative predictions
8. Explain reference matching
9. Explain SHA-256 matching
10. Explain visual-neighbor matching
11. Show catalog information
12. Explain dataset
13. Explain model architecture
14. Discuss evaluation status
15. Explain limitations
16. Demonstrate the complete workflow

A technical presentation can be structured around a 5–8 minute demonstration.

⸻

📜 License and Attribution

The application source code and reference dataset are separate concerns.

Before redistributing reference images, preserve the attribution and licensing information provided with the dataset.

Reference metadata should remain associated with the corresponding material.

Important files include:

artifacts/astra-vision/public/dataset/credits.csv

and:

docs/DATASET.md

Do not remove creator, license, or source information from credited reference material.

For individual reference-image licensing terms, consult the corresponding source records.

⸻

📊 Project Status

Component	Status
React/Vite Frontend	✅ Implemented
Express API	✅ Implemented
Image Upload	✅ Implemented
Image Validation	✅ Implemented
Sharp Preprocessing	✅ Implemented
CLIP Zero-Shot Classification	✅ Implemented
Five-Class Vocabulary	✅ Implemented
SHA-256 Exact Matching	✅ Implemented
Visual-Neighbor Matching	✅ Implemented
Catalog Evidence	✅ Implemented
Analysis History	✅ Implemented
OpenAPI Contract	✅ Implemented
Dataset/Credits	✅ Included
Formal Benchmark Metrics	⚠️ Not Yet Measured
Bounding-Box Detection	❌ Not Supported

⸻

🧪 Project Maturity

ASTRA Vision should currently be understood as a:

Working computer-vision research/demo/review prototype

rather than a production-grade object-detection or intelligence platform.

The project prioritizes:

* Transparent analysis
* Bounded scope
* Reproducibility
* Traceable references
* Evidence-aware results
* Explicit limitations
* Honest evaluation

⸻

📚 Documentation

Additional documentation is available under:

docs/
├── REQUIREMENTS.md
├── DATASET.md
├── ARCHITECTURE.md
├── VIDEO_SCRIPT.md
└── SUBMISSION_CHECKLIST.md

Recommended reading order:

1. README.md
2. docs/ARCHITECTURE.md
3. docs/DATASET.md
4. docs/REQUIREMENTS.md
5. docs/VIDEO_SCRIPT.md
6. docs/SUBMISSION_CHECKLIST.md

⸻

⚡ Quick Start

If Node.js 24.x, pnpm, and Git are already installed:

git clone https://github.com/preethamjee2008-prog/ASTRA-Vision.git
cd ASTRA-Vision
pnpm install
cp .env.example .env
pnpm run typecheck
pnpm run build

Start the API:

pnpm --filter @workspace/api-server run dev

In another terminal:

pnpm --filter @workspace/astra-vision run dev

Open the frontend URL displayed by Vite and upload an image for analysis.

⸻

👨‍💻 Developer

Preetham Alawandimath

Computer Science Engineering Student

Interested in:

* Artificial Intelligence
* Machine Learning
* Computer Vision
* Software Development
* Web Development
* Cybersecurity
* Cloud Computing
* Emerging Technologies

⸻

⭐ ASTRA Vision

AI-powered vehicle image analysis with transparent classification and reference evidence.

Built by Preetham Alawandimath.

⸻

🔗 Repository

https://github.com/preethamjee2008-prog/ASTRA-Vision

⸻

ASTRA Vision — See. Analyze. Understand.
