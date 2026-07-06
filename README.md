# Corretora IN HOUSE — site pessoal (Uberlândia, MG)

Site de marca pessoal para corretora de imóveis da imobiliária **IN HOUSE**
(Uberlândia – MG). Estático (HTML + CSS + JS vanilla), publicado via GitHub Pages.

O diferencial é o **formulário dinâmico de qualificação de leads** no final da
página: as perguntas mudam conforme a intenção (comprar / alugar / vender /
investir) e, no final, geram uma mensagem de WhatsApp pré-preenchida com a busca
completa — o lead chega quente e legível no zap da corretora.

## ⚠️ Dados que faltam do cliente (antes do lançamento)

O site está montado com placeholders. Buscar por `REPLACE WITH` no código e por
`⚠️ PLACEHOLDER` no `js/main.js`. Checklist:

| Item | Onde entra | Observação |
|------|-----------|------------|
| **Nome completo da corretora** | `index.html` (title, OG, JSON-LD, nav, hero, footer) e `AGENT_NAME` em `js/main.js` | Hoje está "Mariana Duarte" como stand-in |
| **Número de CRECI** | nav, hero, selo na seção Sobre, footer, JSON-LD | Hoje "CRECI MG 00000" |
| **WhatsApp (DDI+DDD+número, só dígitos)** | `WHATSAPP_NUMBER` em `js/main.js` | Hoje `5534999999999` |
| **Bio real** | seção `#sobre` | Formação, anos de mercado, especialidade |
| **Números reais** | `.hero-stats` | Anos de mercado, imóveis negociados, famílias atendidas (hoje `[X]+`) |
| **Texto institucional da IN HOUSE** | seção `#inhouse` | Confirmar posicionamento e diferenciais com a imobiliária |
| **Logo da IN HOUSE** | seção `#inhouse` | SVG ou PNG fundo transparente |
| **Depoimentos reais (3)** | seção `#depoimentos` | Nome + o que o cliente fechou (bairro ajuda) |
| **Domínio final** | canonical, OG url, sitemap, robots, JSON-LD | Hoje aponta para `caiomsi.github.io/Corretora-InHouse` |

### Fotos necessárias (`images/`)

Nomes de arquivo descritivos, minúsculos e com hífens (sinal de SEO). Comprimir antes de commitar.

| Arquivo sugerido | Uso | Tamanho aprox. |
|------------------|-----|----------------|
| `retrato-corretora-uberlandia.jpg` | Hero (retrato profissional, fundo neutro) | 1200 × 1500 |
| `corretora-em-atendimento.jpg` | Seção Sobre | 1000 × 1000 |
| `entrega-de-chaves.jpg` | Galeria (slot alto) | 900 × 1200 |
| `fachada-imovel-vendido.jpg` | Galeria | 1200 × 900 |
| `visita-com-clientes.jpg` | Galeria | 1200 × 900 |
| `interior-imovel.jpg` | Galeria | 1200 × 900 |
| `panoramica-uberlandia.jpg` | Galeria (slot largo) | 1800 × 900 |
| `og-cover.jpg` | Open Graph (compartilhamento) | 1200 × 630 |

Ao colocar as fotos reais, trocar cada `<div class="ph">…</div>` pelo `<img>`
correspondente com `alt` descritivo e `loading="lazy"` (exceto o retrato do hero).

## Rodar local

```sh
python3 -m http.server   # dentro desta pasta → http://localhost:8000
```

## Deploy

`git add -A && git commit && git push` — GitHub Pages publica o branch `master`.

## O wizard (js/main.js)

- Cada `.wiz-step` no HTML tem `data-branch="all|comprar,alugar|vender|investir"`.
- Ao escolher a intenção no passo 1, o fluxo ativo é filtrado por esse ramo e o
  progresso é recalculado; trocar de intenção limpa as respostas do ramo anterior.
- No final, `buildMessage()` monta a mensagem de WhatsApp só com os campos
  respondidos do ramo, abre `wa.me/<número>` pré-preenchido e oferece copiar.
