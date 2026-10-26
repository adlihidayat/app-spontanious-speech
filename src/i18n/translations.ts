export const translations = {
  id: {
    // Header & Meta
    thesis_badge: "Tesis / Penelitian ASR Bahasa Indonesia",
    app_title: "Evaluasi Komparatif Whisper-Small: Base vs. LoRA",
    app_subtitle: "Pengenalan Ujaran Spontan Bahasa Indonesia Berbasis PEFT-LoRA",
    research_scope: "Whisper-Small vs. Whisper-Small + LoRA (Dataset Ujaran Spontan 10-20 Jam)",

    // Navigation & Modes
    mode_benchmark: "Mode Evaluasi (Dengan Ground Truth)",
    mode_benchmark_desc: "Teks referensi sudah diketahui untuk kalkulasi otomatis nilai WER, CER, dan visual word diffs.",
    mode_freeform: "Mode Bebas (Uji Suara Langsung)",
    mode_freeform_desc: "Uji suara bebas tanpa teks referensi. Deteksi otomatis partikel ujaran spontan dan tingkat keyakinan.",

    // Prompt Teleprompter
    prompt_label: "Kalimat Uji Ujaran Spontan (Baca dengan gaya santai/natural):",
    prompt_randomize: "Acak Kalimat",
    prompt_next: "Kalimat Berikutnya",
    prompt_edit_toggle: "Edit Teks Referensi",
    prompt_edit_placeholder: "Ketik atau tempel teks referensi (ground truth) di sini...",
    prompt_saved: "Teks referensi diperbarui!",

    // Audio Input Studio
    tab_mic: "Rekam Mikrofon",
    tab_file: "Unggah File Audio",
    record_btn: "Mulai Rekam Suara",
    recording_active: "Merekam suara... Silakan berbicara",
    recording_time: "Durasi Rekaman",
    stop_btn: "Berhenti Merekam",
    cancel_btn: "Batal",
    re_record: "Rekam Ulang",
    upload_btn: "Pilih File Audio (.wav, .mp3, .m4a, .ogg)",
    upload_drag_hint: "Seret dan lepas file audio ke sini, atau klik untuk memilih file",
    upload_limit_hint: "Format yang didukung: WAV, MP3, M4A, OGG (Maks. 25 MB)",
    audio_preview_title: "Pratinjau Rekaman / Audio Terpilih",
    analyze_btn: "Bandingkan Model Sekarang",
    analyzing_btn: "Memproses Inferensi...",

    // Models Arena
    base_model_title: "Baseline: OpenAI Whisper-Small",
    base_model_tag: "Zero-Shot / Pre-trained Model",
    lora_model_title: "Usulan: Whisper-Small + LoRA (Spontan ID)",
    lora_model_tag: "PEFT-LoRA Fine-Tuned (10-20h Spontaneous ID)",
    research_tag: "Model Usulan Tesis",
    waiting_transcription: "Hasil transkripsi akan muncul di sini setelah audio dianalisis...",

    // Metrics & Legend
    metric_wer: "Word Error Rate (WER)",
    metric_cer: "Character Error Rate (CER)",
    metric_improvement: "Peningkatan Akurasi (Reduksi WER)",
    metric_confidence: "Tingkat Keyakinan Model",
    metric_latency: "Waktu Komputasi",
    lower_is_better: "Semakin rendah semakin akurat (0% = sempurna)",
    diff_legend_benchmark: "Hijau = Berhasil Dikenali LoRA | Merah = Kesalahan / Substitusi Base Model",
    diff_legend_freeform: "Ungu = Partikel Ujaran Spontan Terdeteksi | Kuning = Perbedaan Kata Base & LoRA",
    spontaneous_detected_title: "Partikel Ujaran Spontan Terdeteksi",
    divergence_count: "Perbedaan Prediksi Kata",

    // Analytical Panel
    summary_title: "Ringkasan Analisis Evaluasi",
    summary_banner_benchmark: "Model LoRA berhasil menurunkan tingkat kesalahan kata (WER) sebesar {werGain}% dibandingkan baseline Whisper-Small pada ujaran spontan ini.",
    summary_banner_freeform: "Model LoRA berhasil mendeteksi {count} partikel/kosakata ujaran spontan dengan confidence rata-rata {confidence}%.",
    error_breakdown_title: "Rincian Kesalahan Kata (Error Breakdown)",
    col_metric: "Metrik",
    col_base: "Base Whisper-Small",
    col_lora: "Whisper-Small + LoRA",
    col_delta: "Selisih Perbaikan",
    stat_substitutions: "Substitusi (S) - Kata Tertukar",
    stat_deletions: "Delesi (D) - Kata Terlewat",
    stat_insertions: "Insersi (I) - Kata Tambahan",
    stat_hits: "Kata Benar (H)",
    stat_total_words: "Total Kata Referensi",

    // API Config & Status
    api_status_connected: "API Backend Aktif",
    api_status_demo: "Mode Simulasi Demo (Lokal)",
    api_settings_title: "Pengaturan Koneksi Backend & Model",
    api_url_label: "URL Endpoint Hugging Face Space / Server Backend",
    api_url_hint: "Contoh: https://username-indo-whisper-lora.hf.space",
    api_demo_toggle: "Aktifkan Mode Simulasi Demo (Tanpa Backend)",
    api_demo_hint: "Berguna untuk uji coba visual dan simulasi inferensi saat backend offline.",
    api_test_btn: "Uji Koneksi Backend",
    api_test_success: "Terhubung ke backend!",
    api_test_failed: "Koneksi gagal. Menggunakan simulasi lokal.",
    api_save_btn: "Simpan Pengaturan",
    api_close_btn: "Tutup",

    // Tooltips & Misc
    sample_badge: "Contoh",
    audio_required_alert: "Silakan rekam audio atau unggah file terlebih dahulu!",
    reference_required_alert: "Teks referensi tidak boleh kosong pada Mode Evaluasi.",
    mode_eval_title: "Mode Evaluasi",
    mode_eval_subtitle: "Katakan kalimat dibawah",
    mode_freeform_title: "Mode Bebas",
    mode_freeform_subtitle: "Uji Suara Langsung Tanpa Teks Referensi",
    case_label: "Kasus",
    audio_attached: "Audio terpasang",
    audio_hint_empty: "Unggah file atau gunakan mic",
    clear_audio_btn: "Hapus Audio",
    audio_record_or_upload_first: "Rekam atau unggah audio terlebih dahulu",
    voice_recording_name: "Rekaman Suara",
    mic_error_denied: "Akses mikrofon ditolak oleh browser. Mohon izinkan mikrofon.",
    mic_error_not_found: "Perangkat mikrofon tidak ditemukan atau tidak didukung.",
    upload_format_error: "Format tidak didukung. Harap gunakan file: {formats}",
    upload_size_error: "Ukuran file melebihi batas {max}MB."
  },

  en: {
    // Header & Meta
    thesis_badge: "ASR Research Thesis / Indonesian Speech",
    app_title: "Whisper-Small Comparative Evaluation: Base vs. LoRA",
    app_subtitle: "PEFT-LoRA Indonesian Spontaneous Speech Recognition",
    research_scope: "Whisper-Small vs. Whisper-Small + LoRA (10-20h Spontaneous Dataset)",

    // Navigation & Modes
    mode_benchmark: "Benchmark Mode (With Ground Truth)",
    mode_benchmark_desc: "Ground truth reference text is provided for automatic calculation of WER, CER, and visual word diffs.",
    mode_freeform: "Free-Form Mode (Live Audio Test)",
    mode_freeform_desc: "Freely test any voice without reference text. Automatic spontaneous particle detection and confidence score.",

    // Prompt Teleprompter
    prompt_label: "Spontaneous Speech Prompt (Read naturally/casually):",
    prompt_randomize: "Randomize Prompt",
    prompt_next: "Next Prompt",
    prompt_edit_toggle: "Edit Reference Text",
    prompt_edit_placeholder: "Type or paste reference ground truth text here...",
    prompt_saved: "Reference text updated!",

    // Audio Input Studio
    tab_mic: "Microphone Recorder",
    tab_file: "Upload Audio File",
    record_btn: "Start Voice Recording",
    recording_active: "Recording in progress... Please speak",
    recording_time: "Recording Duration",
    stop_btn: "Stop Recording",
    cancel_btn: "Cancel",
    re_record: "Re-record",
    upload_btn: "Select Audio File (.wav, .mp3, .m4a, .ogg)",
    upload_drag_hint: "Drag and drop audio files here, or click to browse",
    upload_limit_hint: "Supported formats: WAV, MP3, M4A, OGG (Max 25 MB)",
    audio_preview_title: "Audio Playback Preview",
    analyze_btn: "Compare Models Now",
    analyzing_btn: "Processing Inference...",

    // Models Arena
    base_model_title: "Baseline: OpenAI Whisper-Small",
    base_model_tag: "Zero-Shot / Pre-trained Model",
    lora_model_title: "Proposed: Whisper-Small + LoRA (Spontaneous ID)",
    lora_model_tag: "PEFT-LoRA Fine-Tuned (10-20h Spontaneous ID)",
    research_tag: "Proposed Thesis Model",
    waiting_transcription: "Transcription results will appear here after analyzing the audio...",

    // Metrics & Legend
    metric_wer: "Word Error Rate (WER)",
    metric_cer: "Character Error Rate (CER)",
    metric_improvement: "Accuracy Gain (WER Reduction)",
    metric_confidence: "Model Confidence",
    metric_latency: "Inference Time",
    lower_is_better: "Lower is better (0% = perfect accuracy)",
    diff_legend_benchmark: "Green = Corrected by LoRA | Red = Base Model Substitution/Error",
    diff_legend_freeform: "Purple = Spontaneous Particle Detected | Yellow = Token Divergence",
    spontaneous_detected_title: "Detected Spontaneous Particles",
    divergence_count: "Word Prediction Divergence",

    // Analytical Panel
    summary_title: "Comparative Evaluation Summary",
    summary_banner_benchmark: "LoRA model reduced Word Error Rate (WER) by {werGain}% compared to baseline Whisper-Small on this spontaneous speech sample.",
    summary_banner_freeform: "LoRA model successfully captured {count} spontaneous particles with an average confidence of {confidence}%.",
    error_breakdown_title: "Word Error Breakdown",
    col_metric: "Metric",
    col_base: "Base Whisper-Small",
    col_lora: "Whisper-Small + LoRA",
    col_delta: "Improvement Delta",
    stat_substitutions: "Substitutions (S)",
    stat_deletions: "Deletions (D)",
    stat_insertions: "Insertions (I)",
    stat_hits: "Correct Words (H)",
    stat_total_words: "Total Reference Words",

    // API Config & Status
    api_status_connected: "Backend API Connected",
    api_status_demo: "Demo Simulation Mode (Local)",
    api_settings_title: "Backend API & Model Settings",
    api_url_label: "Hugging Face Space / Backend Endpoint URL",
    api_url_hint: "Example: https://username-indo-whisper-lora.hf.space",
    api_demo_toggle: "Enable Demo Simulation Mode (No Backend Required)",
    api_demo_hint: "Useful for UI testing and visual demonstration while the backend is offline.",
    api_test_btn: "Test Connection",
    api_test_success: "Connected to backend!",
    api_test_failed: "Connection failed. Falling back to local simulation.",
    api_save_btn: "Save Settings",
    api_close_btn: "Close",

    // Tooltips & Misc
    sample_badge: "Sample",
    audio_required_alert: "Please record audio or upload an audio file first!",
    reference_required_alert: "Reference text cannot be empty in Benchmark Mode.",
    mode_eval_title: "Benchmark Mode",
    mode_eval_subtitle: "Read the sentence below",
    mode_freeform_title: "Free-Form Mode",
    mode_freeform_subtitle: "Live Voice Test Without Reference Text",
    case_label: "Case",
    audio_attached: "Audio attached",
    audio_hint_empty: "Upload a file or use mic",
    clear_audio_btn: "Clear Audio",
    audio_record_or_upload_first: "Please record or upload audio first",
    voice_recording_name: "Voice Recording",
    mic_error_denied: "Microphone access denied by browser. Please allow microphone permissions.",
    mic_error_not_found: "Microphone device not found or not supported.",
    upload_format_error: "Unsupported format. Please use file: {formats}",
    upload_size_error: "File size exceeds {max}MB limit."
  }
};

export type TranslationKey = keyof typeof translations.id;
