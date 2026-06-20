/* 共通UI: テーマ(light/dark)と言語(ja/en)。localStorageに保存し、両ページで共有。
   - data-i18n="key" の要素は textContent を、data-i18n-html は innerHTML を差し替え。
   - 動的描画側は window.t(key) と window.onLangApplied フックを使う。
   汎用ツール: 顔に限らず任意の IIIF 領域アノテーション(物体・文字・図像など)に使える。 */
(function () {
  const T = {
    ja: {
      app: "AnnoVerdict",
      app_short: "AnnoVerdict",
      tagline_h: "AIが付けたアノテーションを、人手で確定する。",
      tagline_p: "IIIF Curation List(CODH / 顔貌コレクション形式)を読み込み、各<b>領域アノテーション</b>を <b>○採用 / ×却下</b> で確認して、クリーンな ground-truth を IIIF Curation として書き出します。顔に限らず物体・文字・図像など任意の領域に使えます。OpenSeadragon で原寸ディープズーム確認。<b>画像も判定もブラウザ内</b>で完結し、サーバに送りません。",
      open_editor: "エディタを開く →", try_sample: "サンプルで試す",
      howto: "使い方(動画)", steps: "3ステップ", features: "特長",
      s1t: "① 読み込む", s1b: "IIIF Curation List(.json)をドラッグ&ドロップ / ファイル選択 / URL指定。CODHの検出サービス・顔貌コレクション・自前パイプラインのいずれの出力も可(顔・物体・文字など領域種別を問わない)。",
      s2t: "② 確認する", s2b: "領域サムネ一覧を ○/× で判定。右ペインの OpenSeadragon で原寸ズーム、同じ画像の全矩形を色分け表示。フィルタ・確信度ソート・進捗自動保存。",
      s3t: "③ 書き出す", s3b: "採用領域だけの IIIF Curation を書き出し。Curation Viewer で開く・公開・機械学習の教師データ化(領域URL)に直結。",
      load: "読み込む", url: "URL", sample: "サンプル", show: "表示:",
      all: "全部", undecided: "未定", drop: "却下", keep: "採用",
      sort_fig: "画像順", sort_cA: "確信度 低→高", sort_cD: "確信度 高→低", sort_u: "未定優先",
      reload: "壊れ再読込", exp_d: "decisions.json", exp_c: "Curation書出",
      empty_h: "IIIF Curation を読み込んでください",
      empty_p: "ここに <b>.json をドラッグ&ドロップ</b>、または上の「📂 読み込む / URL / サンプル」。<br>CODHの検出サービス・顔貌コレクション・自前パイプライン等の IIIF Curation List に対応(領域種別は問わない)。",
      right_hint: "カードを選ぶと、ここに OpenSeadragon で原寸表示＋全矩形＋選択ハイライトが出ます。",
      f_detector: "検出器", f_decision: "判定", sibs: "同じ画像の全アノテーション",
      stat: (v, a, k, d, u) => `表示${v}/${a}  採用${k} 却下${d} 未定${u}`,
      home_title: "トップページへ",
    },
    en: {
      app: "AnnoVerdict",
      app_short: "AnnoVerdict",
      tagline_h: "Confirm AI annotations, by hand.",
      tagline_p: "Load a IIIF Curation List (CODH / KaoKore format), review each <b>region annotation</b> with <b>Keep / Drop</b>, and export a clean ground truth as a IIIF Curation. Works for any region — faces, objects, text, figures. Deep-zoom with OpenSeadragon. <b>Images and decisions stay in your browser</b>; nothing is sent to a server.",
      open_editor: "Open editor →", try_sample: "Try with sample",
      howto: "How to use (video)", steps: "3 steps", features: "Features",
      s1t: "① Load", s1b: "Drag & drop a IIIF Curation List (.json), pick a file, or give a URL. Works with CODH detection services, KaoKore, or your own pipeline — any kind of region (faces, objects, text).",
      s2t: "② Review", s2b: "Mark region thumbnails Keep/Drop. Right panel: OpenSeadragon deep-zoom, all regions of the image color-coded. Filter, sort by confidence, autosave.",
      s3t: "③ Export", s3b: "Export a IIIF Curation of kept regions only. Open in Curation Viewer, publish, or use as ML training data (region URLs).",
      load: "Load", url: "URL", sample: "Sample", show: "Show:",
      all: "All", undecided: "Undecided", drop: "Dropped", keep: "Kept",
      sort_fig: "Image order", sort_cA: "Confidence ↑", sort_cD: "Confidence ↓", sort_u: "Undecided first",
      reload: "Reload broken", exp_d: "decisions.json", exp_c: "Export Curation",
      empty_h: "Load a IIIF Curation",
      empty_p: "Drag & drop a <b>.json here</b>, or use “📂 Load / URL / Sample” above.<br>Works with any IIIF Curation List (CODH detection, KaoKore, your own pipeline) — any region type.",
      right_hint: "Select a card to view it here with OpenSeadragon: deep-zoom, all regions, and the selected one highlighted.",
      f_detector: "Detector", f_decision: "Decision", sibs: "All annotations in this image",
      stat: (v, a, k, d, u) => `${v}/${a} shown  kept ${k} dropped ${d} undecided ${u}`,
      home_title: "Back to top",
    },
  };
  const getLang = () => localStorage.getItem("ce:lang") || (navigator.language.startsWith("ja") ? "ja" : "en");
  const getTheme = () => localStorage.getItem("ce:theme") || "light";
  window.t = (k, ...a) => { const v = (T[getLang()] || T.ja)[k]; return typeof v === "function" ? v(...a) : (v ?? k); };
  window.applyLang = function () {
    document.documentElement.lang = getLang();
    document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = window.t(e.dataset.i18n));
    document.querySelectorAll("[data-i18n-html]").forEach(e => e.innerHTML = window.t(e.dataset.i18nHtml));
    document.querySelectorAll("[data-i18n-title]").forEach(e => e.title = window.t(e.dataset.i18nTitle));
    const lb = document.getElementById("langBtn"); if (lb) lb.textContent = getLang() === "ja" ? "EN" : "日本語";
    const tb = document.getElementById("themeBtn"); if (tb) tb.textContent = getTheme() === "dark" ? "☀" : "🌙";
    if (window.onLangApplied) window.onLangApplied();
  };
  window.applyTheme = function () {
    document.documentElement.setAttribute("data-theme", getTheme());
    const tb = document.getElementById("themeBtn"); if (tb) tb.textContent = getTheme() === "dark" ? "☀" : "🌙";
  };
  window.toggleLang = function () { localStorage.setItem("ce:lang", getLang() === "ja" ? "en" : "ja"); window.applyLang(); };
  window.toggleTheme = function () { localStorage.setItem("ce:theme", getTheme() === "dark" ? "light" : "dark"); window.applyTheme(); };
  window.applyTheme();
  document.addEventListener("DOMContentLoaded", () => {
    const tb = document.getElementById("themeBtn"); if (tb) tb.onclick = window.toggleTheme;
    const lb = document.getElementById("langBtn"); if (lb) lb.onclick = window.toggleLang;
    window.applyLang();
  });
})();
