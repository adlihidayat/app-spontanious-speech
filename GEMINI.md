# Project Specification & PRD: IndoWhisper-LoRA Comparative Evaluation Platform

## 1. Role & Instructions for AI Agent (`agy`)
You are an expert Full-Stack AI Engineer and UI/UX Designer. Build a modern, responsive, academic-yet-sleek web application using **React (Vite), TypeScript, Tailwind CSS, and Lucide React icons**. 

The application demonstrates and evaluates a research thesis comparing the baseline **`openai/whisper-small`** model against a **LoRA-fine-tuned `whisper-small`** optimized specifically for **Indonesian Spontaneous Speech (Ujaran Spontan Bahasa Indonesia)**.

---

## 2. Core Research Context
* **Problem:** Standard Whisper models struggle with Indonesian spontaneous speech (slang, filler words, contractions like *nggak, udah, kayak, gitu, sih, jujurly*, and rapid conversational pacing). Full fine-tuning is computationally expensive and prone to catastrophic forgetting.
* **Solution:** Parameter-Efficient Fine-Tuning (PEFT) using **LoRA (Low-Rank Adaptation)** on `whisper-small` trained on a curated 10–20 hour Indonesian spontaneous conversational dataset.
* **App Goal:** Allow thesis examiners, researchers, and users to input voice (via microphone or file upload) and visually compare the transcription output, accuracy metrics (WER/CER), confidence scores, and word-level differences between **Base Whisper-Small** and **LoRA Whisper-Small**.

---

## 3. User Experience (UX) & Dual-Mode Architecture
To solve the UX friction of requiring a "Ground Truth" reference text to calculate Word Error Rate (WER), the app MUST feature **Two Distinct Modes** selectable via a prominent tab switcher:

### Mode A: Benchmark Mode (Mode Evaluasi Terpadu) — *Default Mode*
* **Concept:** The system already knows the `ground_truth` text, enabling automatic, zero-typing calculation of **WER (Word Error Rate)**, **CER (Character Error Rate)**, and **Visual Word-Level Diffs**.
* **Sub-feature 1: "Prompt Teleprompter" (Baca Kalimat Spontan):**
  * Users can cycle through 5 built-in natural Indonesian spontaneous script prompts (or click "Acak Kalimat" / "Randomize Prompt").
  * The user hits **"Record Microphone"**, reads the displayed casual sentence out loud, and hits **"Analyze"**.
  * *Included Prompts:*
    1. `"Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut-ikutan, eh malah nekat dong."`
    2. `"Eh bentar deh, kayaknya tadi tuh kita salah belok nggak sih? Kok jalannya makin sepi gini ya?"`
    3. `"Gini loh maksud gue, kalau emang datanya belum beres sekarang, ya udah kita kerjain bareng aja besok pagi."`
    4. `"Sebenernya sih nggak masalah mau pakai cara yang mana aja, yang penting hasilnya tuh beneran akurat gitu."`
    5. `"Aduh gimana ya bilangnya, soalnya dari kemarin tuh dia susah banget dihubungi, chat gue aja cuma dibaca doang."`
* **Sub-feature 2: Optional Quick-Edit:**
  * Provide a subtle `"Edit Teks Referensi"` (Edit Reference Text) toggle in case the user wants to tweak the prompt or paste their own reference transcript for an uploaded dataset file.

### Mode B: Free-Form Sandbox (Mode Bebas / Tanpa Teks Referensi)
* **Concept:** Users speak anything into the microphone or upload any `.wav`, `.mp3`, or `.m4a` file without needing a reference script.
* **Metrics Shown in Mode B (No Ground Truth Required):**
  * Side-by-side transcription comparison.
  * **Model Confidence Score (%)** (derived from average log probabilities).
  * **Inference Latency (ms/seconds)** & Real-Time Factor (RTF).
  * **Spontaneous Lexicon Highlighter:** Automatically badges and highlights detected Indonesian colloquial/spontaneous particles in the LoRA output (e.g., `nggak`, `udah`, `gitu`, `kayak`, `sih`, `banget`, `dong`, `deh`, `tuh`, `nih`, `gue`, `lu`, `gimana`, `emang`, `beneran`, `doang`).
  * **Token/Word Divergence Highlight:** Highlights words where the LoRA model predicted something different from the Base model.

---

## 4. Bilingual UI Requirement (Bahasa Indonesia & English)
* **Default Language:** Bahasa Indonesia (`ID`).
* **Toggle:** Place a clean segmented pill toggle (`🇮🇩 ID | 🇬🇧 EN`) in the top navigation bar.
* **Scope:** Switching languages updates all UI headers, buttons, tooltips, mode descriptions, and metric labels immediately via a centralized React Context or dictionary object (`i18n.ts`). Note: The speech recognition models themselves always process Bahasa Indonesia audio.

### Key Translation Dictionary Reference
| Key | Bahasa Indonesia (`ID` - Default) | English (`EN`) |
| :--- | :--- | :--- |
| `app_title` | Evaluasi Komparatif Whisper-Small: Base vs. LoRA | Whisper-Small Comparative Evaluation: Base vs. LoRA |
| `app_subtitle` | Pengenalan Ujaran Spontan Bahasa Indonesia Berbasis PEFT-LoRA | PEFT-LoRA Indonesian Spontaneous Speech Recognition |
| `mode_benchmark` | Mode Evaluasi (Dengan Ground Truth) | Benchmark Mode (With Ground Truth) |
| `mode_freeform` | Mode Bebas (Uji Suara Langsung) | Free-Form Mode (Live Audio Test) |
| `prompt_label` | Kalimat Uji Ujaran Spontan (Baca dengan gaya santai/natural): | Spontaneous Speech Prompt (Read naturally/casually): |
| `record_btn` | Rekam Suara | Record Voice |
| `stop_btn` | Berhenti Merekam | Stop Recording |
| `upload_btn` | Unggah File Audio (.wav, .mp3) | Upload Audio File (.wav, .mp3) |
| `analyze_btn` | Bandingkan Model Sekarang | Compare Models Now |
| `base_model_title` | Baseline: OpenAI Whisper-Small | Baseline: OpenAI Whisper-Small |
| `lora_model_title` | Usulan: Whisper-Small + LoRA (Spontan ID) | Proposed: Whisper-Small + LoRA (Spontaneous ID) |
| `metric_wer` | Word Error Rate (WER) | Word Error Rate (WER) |
| `metric_cer` | Character Error Rate (CER) | Character Error Rate (CER) |
| `metric_improvement` | Peningkatan Akurasi (Reduksi WER) | Accuracy Gain (WER Reduction) |
| `metric_confidence` | Tingkat Keyakinan Model | Model Confidence |
| `metric_latency` | Waktu Komputasi | Inference Time |
| `diff_legend` | Hijau = Berhasil Dikoreksi LoRA \| Merah = Kesalahan Base Model | Green = Corrected by LoRA \| Red = Base Model Error |

---

## 5. Functional Requirements & Component Breakdown

### 5.1 Header & API Settings Bar
* **Branding:** Research badge (`"Tesis / Penelitian ASR Bahasa Indonesia"`), title, and subtitle.
* **Controls:**
  * Language Switcher (`ID` / `EN`).
  * **Backend API Status Indicator:** Green pulse if connected to Hugging Face Backend, Amber if running in `"Demo / Mock Simulation Mode"`.
  * **API URL Configuration Modal (Gear Icon):** Allows the user to paste their Hugging Face Space URL (e.g., `https://username-indo-whisper-lora.hf.space`) at runtime and saves it to `localStorage` (plus reads `import.meta.env.VITE_API_URL` by default). Include a **"Demo Simulation Fallback"** toggle so the UI can be tested and previewed immediately even before the backend is live.

### 5.2 Audio Input Studio (Left/Top Panel)
* **Audio Source Tabs:**
  1. **Microphone Recorder:** Uses Web `MediaRecorder` API. Shows a live animated audio waveform or pulsing timer during recording.
  2. **File Uploader:** Drag-and-drop zone supporting `.wav`, `.mp3`, `.m4a`, `.ogg`.
* **Audio Playback Preview:** HTML5 audio player with custom styling so the user can listen back to their recording/upload before or after running inference.

### 5.3 Side-by-Side Comparison Arena (Main Output Section)
Display two prominent cards side-by-side on desktop (stacked on mobile):

1. **Card 1: Baseline `openai/whisper-small` (Neutral/Slate border)**
   * Tag: `Zero-Shot / Pre-trained`
   * Output Transcript Box with optional word-error highlights (in Benchmark Mode, highlight substitutions/deletions in soft red).
   * Footer stats: `WER %` (Benchmark Mode), `CER %` (Benchmark Mode), `Confidence %`, `Inference Time (s)`.

2. **Card 2: Proposed `whisper-small + LoRA` (Indigo/Emerald accent border with "Research Model" badge)**
   * Tag: `PEFT-LoRA Fine-Tuned (10-20h Spontaneous ID)`
   * Output Transcript Box:
     * In **Benchmark Mode**: Highlight words that LoRA got right (which Base got wrong) in **emerald green**.
     * In **Free-Form Mode**: Highlight recognized Indonesian colloquial/spontaneous words (`nggak`, `udah`, `gitu`, `kayak`, etc.) with a subtle indigo pill badge.
   * Footer stats: `WER %` with delta badge (e.g., `↓ 18.5% lebih rendah`), `CER %`, `Confidence %`, `Inference Time (s)`.

### 5.4 Analytical Summary & Visual Metrics Panel (Bottom Section)
* **In Benchmark Mode:**
  * **Executive Summary Banner:** e.g., *"Model LoRA menurunkan tingkat kesalahan kata (WER) sebesar X% dibandingkan model dasar pada sampel ujaran spontan ini."*
  * **Visual Bar Comparison:** Clean horizontal progress/bar chart comparing Base WER vs. LoRA WER and Base CER vs. LoRA CER (remember: lower WER/CER is better, so label clearly: *"Semakin rendah semakin akurat / Lower is better"*).
  * **Error Breakdown Table:** Counts of `Substitutions (S)`, `Deletions (D)`, `Insertions (I)`, and `Correct Words (H)` for both models.
* **In Free-Form Mode:**
  * **Spontaneous Vocabulary Detection Card:** Lists colloquial Indonesian tokens captured by the LoRA model vs. how the Base model transcribed or misspelled them.
  * **Confidence & Speed Comparison Bar.**

---

## 6. Backend API Contract (`POST /api/transcribe`)
The frontend sends a `multipart/form-data` POST request to `${API_BASE_URL}/api/transcribe`:

### Request Payload (`FormData`)
* `audio`: `Blob | File` (the recorded or uploaded audio file)
* `ground_truth`: `string` (optional — sent in Benchmark Mode; empty string `""` in Free-Form Mode)

### Expected JSON Response
```json
{
  "status": "success",
  "mode": "benchmark",
  "ground_truth_normalized": "jujur ya kemarin tuh aku udah bilang ke dia kalau nggak usah ikut ikutan eh malah nekat dong",
  "base_model": {
    "text": "Jujur ya kemarin itu aku sudah bilang ke dia kalau tidak usah ikut-ikutan eh malah nekat dong.",
    "confidence": 81.4,
    "latency_sec": 2.34,
    "metrics": {
      "wer": 23.53,
      "cer": 12.04,
      "substitutions": 4,
      "deletions": 0,
      "insertions": 0,
      "hits": 13
    }
  },
  "lora_model": {
    "text": "Jujur ya, kemarin tuh aku udah bilang ke dia kalau nggak usah ikut-ikutan, eh malah nekat dong.",
    "confidence": 94.8,
    "latency_sec": 2.48,
    "metrics": {
      "wer": 0.0,
      "cer": 0.0,
      "substitutions": 0,
      "deletions": 0,
      "insertions": 0,
      "hits": 17
    }
  },
  "comparison": {
    "wer_reduction_absolute": 23.53,
    "wer_reduction_relative_pct": 100.0,
    "spontaneous_words_detected": ["tuh", "udah", "nggak", "eh", "dong"]
  }
}
```

> **Important Note for `agy`:** In addition to calling the backend API, implement a **Client-Side WER/CER & Word-Diff Calculator in TypeScript** (using dynamic programming Levenshtein distance at the word and character level). This guarantees that:
> 1. Even if the user edits the Ground Truth text *after* receiving the transcription, the WER/CER and visual word highlights recalculate **instantly** in the browser without re-uploading the audio!
> 2. If the backend is offline or the user activates "Simulation Demo Mode", the app remains 100% interactive with realistic simulated outputs.

---

## 7. Visual Design & Styling Guidelines
* **Color Palette:** Clean Academic Modern — Slate-50/White background, Slate-900 typography, Indigo-600 primary brand accents, Emerald-600 for LoRA improvements/correct tokens, Rose-600 for Base model errors.
* **Typography:** `Inter` or system sans-serif for UI; `JetBrains Mono` or monospace for WER/CER metrics and token diffs.
* **Responsiveness:** Desktop-first dashboard layout for thesis presentation on a projector, fully responsive for mobile/tablet testing by respondents.