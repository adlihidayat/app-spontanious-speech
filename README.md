# IndoWhisper-LoRA Comparative Evaluation Platform

Platform Evaluasi Komparatif Whisper-Small: Base vs. LoRA untuk Pengenalan Ujaran Spontan Bahasa Indonesia (Indonesian Spontaneous Speech Recognition) berbasis PEFT-LoRA.

## Overview
Aplikasi web modern untuk mengevaluasi dan membandingkan performa model baseline `openai/whisper-small` dengan `whisper-small + LoRA` yang telah di-fine-tune khusus untuk ujaran spontan Bahasa Indonesia.

## Fitur Utama
- **Mode Evaluasi Terpadu (Benchmark Mode)**: Pengujian dengan teks referensi (ground truth), penghitungan otomatis WER & CER, serta visualisasi perbandingan kata per kata.
- **Mode Bebas (Free-Form Sandbox)**: Pengujian suara langsung tanpa teks referensi dengan pendeteksian partikel ujaran spontan (*nggak, udah, kayak, gitu, sih*, dll.) dan tingkat keyakinan (confidence score).
- **Dukungan Bilingual**: Antarmuka dalam Bahasa Indonesia & English.
