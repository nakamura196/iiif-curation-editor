# IIIF キュレーション・エディタ

IIIF Curation List(CODH / 顔貌コレクション形式)を読み込み、AIが付けた**領域アノテーション**を
ブラウザ内で **○採用 / ×却下** 確認して、クリーンな ground-truth を IIIF Curation として
書き出す **独立した汎用ツール**。**顔に限らず**、物体・文字・図像など任意の領域(`canvas#xywh`)に使える。
OpenSeadragon で原寸ディープズーム確認。**画像も判定もブラウザ内で完結**し、第三者サーバに送信しない。

- ランディング: `index.html`
- エディタ本体: `editor.html`
- テーマ(light/dark)・言語(ja/en)切替、東京大学カラー(淡青)`css/utokyo.css`、共通UI `js/ui.js`

## できること

- **入力**: IIIF Curation List(`.json`)を ドラッグ&ドロップ / ファイル選択 / URL指定 / 同梱サンプル。
  CODHの検出サービス・顔貌コレクション(KaoKore)・自前パイプラインのいずれの出力も可
  (member が `{canvas}#xywh=x,y,w,h` であればよい。領域種別は問わない)。
- **確認**: 領域サムネ一覧を ○/× 判定(クリック or キーボード <kbd>k</kbd>採用 <kbd>d</kbd>却下 <kbd>u</kbd>未定 <kbd>←→</kbd>移動)。
  フィルタ・確信度ソート・進捗 localStorage 自動保存。
- **拡大**: 右ペインは OpenSeadragon。IIIF `info.json` で**原寸ディープズーム**、
  同じ画像の全矩形を判定色(緑採用/赤却下/黄未定)で重畳、選択中を黄発光ハイライト＋自動ズーム。
- **出力**: `decisions.json`(key→keep/drop)と、**採用領域だけの IIIF Curation**(`curation_confirmed.json`)。
  → Curation Viewer で開く・公開・機械学習の教師データ化(領域URL)に直結。
- **UI**: ☀/🌙 でライト/ダーク、EN/日本語 切替(localStorage保存)。

## 使い方

### A. ローカルで開く(配布なしで試す)
- `editor.html` をブラウザで直接開き、**Curation の .json をドラッグ&ドロップ**(File API はローカルで動く)。
- 「サンプル」「URL」は `fetch` を使うため `file://` ではブロックされる。下記のローカルサーバで開く。

### B. ローカルサーバ(サンプル/URL機能も使う)
```
cd curation-editor
python3 -m http.server 8000
# http://localhost:8000/                     ランディング
# http://localhost:8000/editor.html?sample=1 サンプル自動ロード
```

### C. GitHub Pages で公開(独立リポジトリ)
```
cd curation-editor
git init && git add -A && git commit -m "IIIF curation editor"
gh repo create <name> --public --source . --push
# Settings → Pages → Branch: main / root
```
ビルド不要の静的サイトなので、そのまま公開できる。

## 入出力フォーマット(IIIF Curation)

CODH の IIIF Curation(`cr:Curation`)。各領域は canvas の矩形フラグメントで参照:
```jsonc
{
  "@type": "cr:Curation",
  "selections": [{
    "@type": "sc:Range",
    "members": [{
      "@id": "https://.../api/iiif/{id}/{canvas}#xywh=4032,3456,267,325",
      "@type": "sc:Canvas",
      "metadata": [{"label":"source","value":"..."},{"label":"confidence","value":"0.84"}]
    }],
    "within": {"@id": "https://.../{id}/manifest.json", "@type":"sc:Manifest"}
  }]
}
```
座標は **canvas の絶対画素**。画像は IIIF Image API(`{canvas}/{x,y,w,h}/{size}/0/default.jpg`)で取得。
`metadata` は自由(`source`/`confidence` 等を表示。`sex` 等があれば表示するが必須ではない)。

## プライバシー
- 画像は各 IIIF サーバから**直接**表示、判定は **localStorage**。第三者サーバへ送信しない。
- OpenSeadragon(CDN)と画像取得のためインターネット接続は必要。

## 関連
- 顔検出(ブラウザ内): face-web — https://nakamura196.github.io/face-web/
- 顔貌コレクション / KaoKore — https://github.com/rois-codh/kaokore
- NDLイメージバンク(全点PD) — https://www.ndl.go.jp/imagebank/
