# AnnoVerdict ／ AnnoVerdict

> Browser-only editor to review & curate **IIIF region annotations** (Keep / Drop) and export a clean
> ground truth as a **IIIF Curation**. Deep-zoom with OpenSeadragon. Works for **any region** — faces,
> objects, text, figures. Images and decisions stay in your browser.
>
> IIIF Curation List(CODH / 顔貌コレクション形式)を読み込み、AIが付けた**領域アノテーション**を
> ブラウザ内で **○採用 / ×却下** 確認し、クリーンな ground-truth を IIIF Curation として書き出す
> **独立した汎用ツール**。**顔に限らず**物体・文字・図像など任意の領域に使える。OpenSeadragon で
> 原寸ディープズーム。**画像も判定もブラウザ内で完結**し、第三者サーバに送信しない。

**Live / 公開サイト:** https://nakamura196.github.io/anno-verdict/

---

## Features ／ できること

**EN**
- **Input**: a IIIF Curation List (`.json`) via drag & drop / file picker / URL / bundled sample.
  Any region type works as long as members are `{canvas}#xywh=x,y,w,h` (CODH detection, KaoKore, your own pipeline).
- **Review**: Keep/Drop region thumbnails (mouse or keyboard <kbd>k</kbd> keep / <kbd>d</kbd> drop / <kbd>u</kbd> undecided / <kbd>←→</kbd> move). Filter, sort by confidence, autosave to localStorage.
- **Zoom**: right panel is OpenSeadragon — IIIF `info.json` deep-zoom, all regions of the image overlaid and color-coded (green keep / red drop / yellow undecided), selected one highlighted + auto-zoom.
- **Export**: `decisions.json` (key → keep/drop) and a **IIIF Curation of kept regions** (`curation_confirmed.json`).
- **UI**: light/dark (☀/🌙) and Japanese/English (EN/日本語) toggles.

**JA**
- **入力**: IIIF Curation List(`.json`)を D&D / ファイル選択 / URL / 同梱サンプル。
  member が `{canvas}#xywh=x,y,w,h` であれば領域種別を問わない(CODH検出・顔貌コレクション・自前パイプライン)。
- **確認**: 領域サムネを ○/× 判定(マウス or キーボード <kbd>k</kbd>採用 / <kbd>d</kbd>却下 / <kbd>u</kbd>未定 / <kbd>←→</kbd>移動)。フィルタ・確信度ソート・localStorage自動保存。
- **拡大**: 右ペインは OpenSeadragon。IIIF `info.json` で原寸ディープズーム、同じ画像の全矩形を判定色で重畳、選択中を黄発光ハイライト＋自動ズーム。
- **出力**: `decisions.json` と、**採用領域だけの IIIF Curation**(`curation_confirmed.json`)。
- **UI**: ライト/ダーク(☀/🌙)、日本語/英語(EN/日本語)切替。

---

## Usage ／ 使い方

**A. Open locally / ローカルで開く**
Open `editor.html` directly and **drag & drop** a Curation `.json` (the File API works offline).
The “Sample / URL” buttons use `fetch`, which is blocked on `file://` — use a local server below.
`editor.html` を直接開き Curation の `.json` を**ドラッグ&ドロップ**。「サンプル/URL」は `file://` ではブロックされるため下記サーバで。

**B. Local server / ローカルサーバ**
```
cd anno-verdict
python3 -m http.server 8000
# http://localhost:8000/                      landing / ランディング
# http://localhost:8000/editor.html?sample=1  auto-load sample / サンプル自動ロード
```

**C. Publish on GitHub Pages / GitHub Pages で公開**
Already published from `main` / root → https://nakamura196.github.io/anno-verdict/ .
It is a no-build static site, so any fork can be served as-is. ビルド不要の静的サイト。

---

## Data format ／ 読み込みデータの形式

CODH **IIIF Curation** (`cr:Curation`). Each region references a rectangle on a canvas. ／ 各領域は canvas の矩形で参照。

```jsonc
{
  "@type": "cr:Curation",
  "selections": [{
    "@type": "sc:Range",
    "members": [{
      "@id": "https://.../api/iiif/{id}/{canvas}#xywh=4032,3456,267,325",
      "@type": "sc:Canvas",
      "metadata": [{"label":"source","value":"detector-a"},{"label":"confidence","value":"0.84"}]
    }],
    "within": {"@id": "https://.../{id}/manifest.json", "@type":"sc:Manifest"}
  }]
}
```

- `#xywh=x,y,w,h` is in **absolute canvas pixels**. ／ 座標は **canvas の絶対画素**。
- Region image is fetched via the IIIF Image API: `{canvas}/{x,y,w,h}/{size}/0/default.jpg`. ／ 画像は IIIF Image API で取得。
- `metadata` is free-form; `source` / `confidence` are shown (e.g. `sex` is shown if present, not required). ／ `metadata` は自由。

---

## Privacy ／ プライバシー
Images are loaded **directly from IIIF servers**; decisions are kept in **localStorage**. Nothing is sent to a third party.
An internet connection is needed for OpenSeadragon (CDN) and image fetching.
画像は各 IIIF サーバから**直接**表示、判定は **localStorage**。第三者サーバへ送信しない。

## Related ／ 関連
- Browser-side face detection / ブラウザ内顔検出: **face-web** — https://nakamura196.github.io/face-web/
- 顔貌コレクション / **KaoKore** — https://github.com/rois-codh/kaokore
- NDL Image Bank (public domain) / NDLイメージバンク — https://www.ndl.go.jp/imagebank/

## License
TBD — feel free to open an issue. ／ ライセンス未設定(必要なら追加)。
