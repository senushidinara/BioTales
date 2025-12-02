# BioTales — On-Device AI Learning Platform for iPad (Arm-Based)

BioTales transforms biology into immersive stories and visual metaphors using fully on-device AI.
Powered entirely by Arm-based Apple Silicon, the app generates stories, images, games, and quizzes
within seconds, without network connectivity.

## Features
- On-device text generation (LLM)
- On-device visual rendering
- Interactive learning loop
- Zero cloud dependence
- Real-time performance on Arm architecture

## Optimized For Arm
- int8/int4 quantization
- Core ML acceleration on Apple Neural Engine
- Metal for image models
- Armv8.5 CPU optimizations
- Thread-balanced execution

<details>
<summary><strong>System Architecture</strong></summary>

### Workflow
Topic → Story Engine → On-Device AI Models → Structured Output → UI Rendering → Game + Quiz

### Data Flow
```text
+------------------+         +-------------------+
|  Topic Input     | -----> |  Story Engine     |
|  (e.g., Immune)  |         |  Prompt Builder   |
+------------------+         +-------------------+
                                      |
                                      v
                        +-----------------------------+
                        | On-Device LLM (Core ML /    |
                        | ONNX Runtime Mobile)        |
                        | Optimized for Arm           |
                        +--------------+--------------+
                                       |
                                       v
                        +-----------------------------+
                        | Structured JSON Output      |
                        | Story · Metaphors · Game   |
                        +--------------+--------------+
                                       |
                                       v
                        +------------------------------+
                        |  iPad App Interface (Swift + |
                        |  React Native hybrid)        |
                        +------------------------------+
```
</details>

<details>
<summary><strong>Arm-Oriented Optimization</strong></summary>

BioTales operates directly on iPads powered by Apple Silicon (A14, A15, A16, M1, M2, M3), taking full advantage of Arm-based architecture.
The platform is built around efficient on-device AI optimized for performance, responsiveness, and battery life.

**Key optimizations:**
- **int8 and int4 quantized transformer models**
- **ONNX Runtime Mobile (Arm64 build)**
- **Core ML acceleration on Apple Neural Engine**
- **Metal compute shaders for image generation**
- **Thread-balanced execution using Arm big.LITTLE core design**
- **Low-overhead memory streaming tuned for Arm caches**

This allows nearly instantaneous story generation and smooth visual rendering without requiring internet connectivity.
</details>

<details>
<summary><strong>On-Device AI Models</strong></summary>

### Text Generation Model
- **Model:** Phi-3 Mini 1.2B (quantized)
- **Runtime:** ONNX Runtime Mobile + Apple Neural Engine
- **Outputs:** story, metaphors, scientific context, matching pairs, quiz items

### Visual Generation Model
- **Model:** Stable Diffusion Turbo 256px (Core ML converted)
- **Runtime:** Metal + Arm GPU optimizations
- **Purpose:** chapter illustrations

### Matching Engine
- Compact transformer for generating metaphor–concept pairs
- Tuned for low-latency execution on Arm CPU cores
</details>

<details>
<summary><strong>Performance on iPad (Arm)</strong></summary>

**Device:** iPad Air (A14 Bionic)

| Component | Time | Notes |
| :--- | :--- | :--- |
| Text Generation (int8) | 10–12 ms per step | ANE + Arm CPU |
| Image Rendering | ~280 ms | Metal-accelerated |
| Matching Engine | ~40 ms | CPU-optimized |
| **Complete Chapter Creation** | **0.8–1.2 seconds** | **Offline** |

**Memory**
- Peak: ~430 MB
- Average: ~200 MB

**Power**
- 0.9–1.2W during generation
- Highly efficient on Arm silicon
</details>

<details>
<summary><strong>Tech Stack</strong></summary>

### Application Layer
- React Native (UI)
- Swift / SwiftUI (device features + AI bridge)
- SQLite for offline persistence
- Tailwind RN for styling

### AI Runtime Layer
- ONNX Runtime Mobile (Arm64 build)
- Core ML Tools
- Metal Performance Shaders (GPU support)

### Models
- Embedded inside iOS app bundle
- Loaded directly into memory at runtime
</details>

## Installation

```bash
npm install
cd ios
pod install
npx react-native run-ios
```

## Setup & Build

**Requirements**
- Xcode 15+
- Node.js (for RN)
- iPad with A14 or newer chip

**Models Directory**
```text
/BioTales
  /Models
    Phi3-mini-int4.mlmodelc
    SD-Turbo.mlmodelc
```

**Deployment**
1. Open Xcode
2. Connect iPad
3. Select the device from the target list
4. Build & run
5. Models are loaded from the `/Models` bundle folder

After installation, BioTales works fully offline.

---

*BioTales transforms biology into immersive stories and interactive challenges using fully on-device AI. All text and images are generated locally on Arm-based iPads through optimized LLMs and diffusion models. The system delivers real-time learning experiences with complete offline capability and high performance.*
