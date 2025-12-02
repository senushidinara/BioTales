# BioTales — On-Device Story Engine (iPad, Arm)

BioTales turns biology topics into epic narratives, matching games and quizzes — entirely **on-device** on iPads using Core ML / Apple Neural Engine (Arm64).

## What is included
- SwiftUI app skeleton (Topic selector, Story reader, Matching game, Quiz)
- Prompt templates & JSON repair utilities
- Tools to quantize ONNX and convert ONNX->CoreML
- Toy generator for local testing
- README, Devpost write-up, and benchmark utilities

## Requirements
- macOS with Xcode 15+
- iPad running iPadOS 16+ (A14 / M1 / later recommended)
- Python 3.10+ for conversion scripts
- `pip install onnx coremltools onnxruntime`

## Quick start (developer)
1. Clone repo
2. Place compiled model `BioTalesLLM.mlmodelc` into `App/Models/`
3. Open `BioTales.xcodeproj` in Xcode 15+
4. Build & run on a connected iPad (Release build recommended)

## Converting your model
1. Export your model to ONNX (or TF SavedModel)
2. Quantize ONNX:
   ```bash
   python Tools/quantize_onnx.py --input llm.onnx --output llm_quant.onnx
   ```
3. Convert to Core ML:
   ```bash
   python Tools/convert_model.py --onnx llm_quant.onnx --out BioTalesLLM.mlmodel
   ```
4. Compile .mlmodel in Xcode (it becomes .mlmodelc automatically when added to project)

## Benchmark

Open the app’s Benchmark screen or use Benchmark.swift. Run 50 measured iterations and report median & p95.

## Notes
- The repository includes a toy generator for testing UI without an LLM.
- Replace the toy generator with BioTalesRunner which loads BioTalesLLM.mlmodelc.

---

# Devpost write-up (ready to paste)

**Project name:** BioTales — On-Device Story Engine for Learning Biology (iPad)

**Short pitch:**  
BioTales converts biology topics into epic narratives and gamified learning experiences — all generated locally on iPads using Core ML with Apple Neural Engine acceleration on Arm64. It preserves privacy, reduces latency, and demonstrates efficient on-device AI for education.

**What it does:**  
Choose a biology topic (e.g., Glycolysis), tap Generate — BioTales constructs a fantasy narrative, a scientific context sidebar, and a matching-pairs memory game, all created by an on-device quantized LLM and rendered immediately on the iPad.

**Technical implementation:**  
- **Frontend:** SwiftUI (iPad-optimized)  
- **On-device AI:** Converted ONNX → Core ML quantized model (`BioTalesLLM.mlmodelc`). Models are quantized (int8) and executed with `MLModelConfiguration.computeUnits = .all` to leverage ANE and GPU/CPU as available.  
- **Prompting & structured output:** Prompt template instructs the model to return a JSON object with `{title, narrative, scientificContext, matchingPairs}` which the app parses and renders. Minor repair heuristics handle minor JSON formatting issues.  
- **Optimization:** ONNX dynamic quantization + Core ML conversion; model filesize kept small (<150 MB target); bench-marked median inference times on device (details below).  
- **Privacy:** No network calls — generation and gameplay are entirely local.

**Benchmarks:** *(replace with your measurements)*  
- Device: iPad Air (A14, iPadOS 16.6)  
- Model: BioTalesLLM_int8.mlmodelc (72 MB)  
- Median inference (50 runs): 58 ms (ANE) — p95: 92 ms  
- Peak memory (Xcode Instruments): 120 MB

**Why it should win:**  
BioTales demonstrates real, usable on-device AI on Arm hardware with low latency and strong UX for education. It shows practical Arm optimization techniques (quantization, ANE acceleration) and an original pedagogical approach that converts dense biological concepts into memorable, gamified narratives.

**Repo & demo:**  
GitHub: `https://github.com/<you>/biotales-ipad` (include model conversion scripts)  
Demo: 60–90s video showing offline generation, matching game and benchmark overlay.