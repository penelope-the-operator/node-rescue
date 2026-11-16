# Node Rescue

30秒で赤い NotReady ノードを復旧する、小さなブラウザゲーム。クリック / タップ、またはキーボード1〜9で操作。復旧 +10、正常ノードの誤操作 −5（最低0点）。ベストスコアはブラウザの localStorage のみ。実クラスターの操作・通信・ランキング収集はない。

**Play:** https://node-rescue.penelope.work

GitHubログインが必要。許可アカウント: `yuanying`, `masayukig`, `atoato88`, `oomichi`, `yuuichi-fujioka`。運用確認用に Penelope の ServiceAccount にも GET/HEAD を許可。ソースは公開、ホストされたアプリは gated の認証・認可下。

## Local

```sh
python3 -m http.server 8080 --directory web
# http://localhost:8080
npm test # Node.js built-in test runner; no npm dependencies
```

## Deploy

```sh
kubectl apply --dry-run=server -k .
kubectl apply -k .
kubectl -n penelope-lab rollout status deployment/node-rescue
```

`penelope-lab` の Deployment / Service / ConfigMap / Ingress / NetworkRole / NetworkRoleBinding のみ。Python公式Alpine imageをdigest固定、非root・読み取り専用・API tokenなし。アプリ自体にバックエンド・外部スクリプト・外部フォントなし。ConfigMap hashで更新時にrollout。PVC不要。配備先のgatedとNamespaceポリシーは管理基盤側で提供する。

## Remove

```sh
kubectl delete -k .
```

Kustomizeで内容が変わった際の古いハッシュ付きConfigMapは直前のrolloutに必要なもの以外を手動で整理する。非アクティブタブでも30秒の期限は延びない。保存領域を使えないブラウザでもゲームを継続できる。

## License
MIT
