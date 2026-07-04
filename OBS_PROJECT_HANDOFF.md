# LGT OBSレイアウト — 引き継ぎメモ

このドキュメントは、GitHub Pages経由での動作確認が遅いため、**ローカル環境で作業を続ける別セッション**に引き継ぐための資料です。

## 背景・目的

らぶぐらっGT(GTAV上のレースイベント)の配信で使うOBSブラウザソース用オーバーレイ。

- 上部: **チーム紹介**を自動で順番に切り替え表示
- 下部: **レース中の順位**を常時固定表示

運営がWeb上の管理画面(ブラウザ)から、ドラッグ操作や入力フォームで内容を更新すると、OBS側の表示に(GitHub経由で)反映される仕組み。

## リポジトリ構成

GitHubリポジトリ: `https://github.com/Wadeumix/LGT`

3つのブランチを用途別に運用中:

| ブランチ | 用途 | GitHub Pages公開 |
|---|---|---|
| `preraceschedule` | **本番公開用**。スケジュール表・ルールブック・OBS一式すべてここに集約 | ✅ 公開元(`https://wadeumix.github.io/LGT/`) |
| `obs-layout` | OBSレイアウトの開発・保管用(preraceschedule への反映元) | 非公開 |
| `rulebook` | ルールブックのGitBook用ソース(現在は使っていない、参考用) | 非公開 |

**GitHub Pagesの制約**: 1リポジトリにつき公開できるブランチは1つだけ。そのため`preraceschedule`ブランチの直下に全ページを同居させています。

### `preraceschedule` ブランチのファイル構成

```
index.html            ← レース前スケジュール表(トップページ)
rulebook.html         ← ルールブック
obs.html              ← OBSオーバーレイ本体(OBSブラウザソースにはこれを指定)
admin.html            ← 【運営用】レース順位のドラッグ入力フォーム
admin-roster.html     ← 【運営用】チーム紹介(選手・メカ)の入力フォーム ※今回追加
obs-assets/
  style.css           ← obs.htmlの見た目
  script.js           ← obs.htmlの動作ロジック(データ取得・自動切替)
data/
  race-position.json  ← admin.html が書き込む「現在の順位」データ
  roster.json         ← admin-roster.html が書き込む「チーム紹介」データ ※今回追加
.nojekyll             ← GitHub PagesのJekyll処理を無効化(これがないとビルドエラーになった実績あり)
```

`obs-layout` ブランチにも同じ内容のコピーを保持(ファイル名は `obs.html` ではなく `index.html`、`obs-assets/` ではなくルート直下)。**2箇所に同じ内容を置く二重管理になっている**点に注意。今後はどちらか一方に統一してもよい。

## データの流れ(仕組みの核心)

GitHub Pagesは静的サイト(サーバー処理なし)。管理画面→OBS表示のリアルタイム反映は、**ブラウザから直接GitHub APIを呼んでファイルを書き換える**ことで実現している。

1. 運営が `admin.html`(順位)または `admin-roster.html`(チーム紹介)をブラウザで開く
2. 初回、GitHubの **Fine-grained personal access token**(このリポジトリ限定の読み書き権限)をブラウザに保存(localStorage)
   - 発行元: https://github.com/settings/personal-access-tokens/new
   - Repository access → Only select repositories → `Wadeumix/LGT`
   - Permissions → Contents → Read and write
   - 別PCで使う場合は `admin.html?token=xxxx` のようにURLパラメータでも渡せる(読み込み後は自動的にlocalStorageに保存され、URLからは消える)
3. ドラッグで並び替え・入力して「保存」を押すと、ブラウザのJSが **GitHub Contents API** (`PUT /repos/Wadeumix/LGT/contents/data/xxx.json`) を直接叩いて、`preraceschedule` ブランチ上のJSONファイルを更新する
4. OBS側の `obs.html`(`obs-assets/script.js`)は、`raw.githubusercontent.com/.../data/race-position.json` と `.../data/roster.json` を**定期的にfetch**(順位: 8秒間隔、チーム紹介: 15秒間隔)して、取得したデータで画面を再描画する

同時保存の競合について: GitHub Contents APIは更新時に`sha`(直前のファイル内容のハッシュ)を渡す必要があり、他の人が先に保存していると`sha`が古くなり保存が失敗する(＝上書き事故は起きない、安全に失敗するだけ)。失敗した側はページを再読み込みしてやり直す必要がある。

## 現状の課題(今回のセッションで指摘された点・未解決分)

1. **GitHub Pages経由の反映が遅い**
   - `raw.githubusercontent.com` はCDNキャッシュがあり、コミット直後の反映に数十秒〜数分かかることがある
   - GitHub Pagesのビルド自体も時々詰まって `building` のまま進まなくなる不具合が過去に複数回発生(`gh api repos/Wadeumix/LGT/pages/builds -X POST` で手動リビルドして解消していた)
   - → **これがローカル開発に切り替える主な理由**。ローカルでは`obs/`フォルダ内のファイルを直接ブラウザで開けば即座に確認できる(GitHubへの書き込み・OBS側の定期fetch部分はネット経由のままなので、そこだけは変わらず数秒〜数十秒のタイムラグが残る)

2. **~~選手・メカの入力フォームがなかった~~ → 今回のセッションで解決**
   - 以前は `data.js` にハードコードされた仮データ(TEAM ALPHA/BRAVO)のみで、選手名を変更するにはコード編集が必要だった
   - 今回 `admin-roster.html` を新規作成し、`data/roster.json` 経由でチーム・メンバーを入力できるようにした
   - `obs-assets/script.js` も `roster.json` を定期fetchする形に変更済み

3. **レイアウトの見切れ・重なり(解決済み、要検証)**
   - 当初、下部の順位カードが `position:absolute` で上部カードと重なる不具合があった → flexboxでの縦積みに変更して解消
   - 720×720サイズで見切れる不具合もあった → 全体をコンパクト化(フォントサイズ・余白縮小、カード幅を可変に)して解消
   - **ローカル環境で、実際に使う予定のOBSブラウザソースのサイズで再度見え方を確認するのがおすすめ**

## ローカルで作業する場合のヒント

- ローカルコピーの場所: `/Users/n00025/Desktop/ClaudeMade/LGT/OBSレイアウト/`
- 単純にブラウザで `index.html` を直接開くだけでも動作確認は可能(ただし `fetch` するデータURLは `raw.githubusercontent.com` のハードコード決め打ちなので、**ローカルで見た目を変えてもデータ取得先は変わらずGitHub上の本番データを見に行く**点に注意)
- ローカルのみで完結させたい場合は、`script.js` 内の `BASE_URL` を `./data` などローカルの相対パスに変更し、`race-position.json` / `roster.json` を同じフォルダに置けば、ネット接続なしで見た目の調整だけ完結できる
- 見た目を調整し終えたら、GitHubへの反映は次の2ブランチへコピー&プッシュが必要:
  ```bash
  # obs-layout ブランチ(開発保管用)
  git checkout obs-layout
  cp index.html style.css script.js admin.html admin-roster.html <repo>/
  cp race-position.json roster.json <repo>/data/
  git add -A && git commit -m "..." && git push

  # preraceschedule ブランチ(本番公開用。ファイル名・パスが一部異なるので注意)
  git checkout preraceschedule
  cp index.html obs.html                      # ファイル名が違う
  cp style.css script.js obs-assets/           # サブフォルダに入る
  cp admin.html admin-roster.html ./
  # obs.html内の href="style.css" 等を href="obs-assets/style.css" 等に書き換える必要あり
  git add -A && git commit -m "..." && git push
  ```
- GitHub Pagesのビルドが `building` のまま止まったら:
  ```bash
  gh api repos/Wadeumix/LGT/pages/builds -X POST   # 手動リビルド
  gh api repos/Wadeumix/LGT/pages/builds/latest    # ステータス確認
  ```

## 今後やるとよさそうなこと(未着手・提案)

- `preraceschedule` と `obs-layout` の二重管理をやめて一本化する
- 管理画面保存失敗時の自動リトライ(sha再取得→再送信)
- OBS側のポーリング間隔をイベント本番中はもっと短く(例: 3〜5秒)する運用
- 順位データに「ラップ数」や「経過時間」など追加情報を持たせたい場合はJSON構造の拡張が必要
