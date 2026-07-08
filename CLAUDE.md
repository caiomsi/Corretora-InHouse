# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## What this is

Site pessoal de corretora de imóveis — a **real client** (works at IN HOUSE realty,
Uberlândia MG). All content is pt-BR. **Her real data/photos are still placeholders**
— see `README.md` for what's outstanding. Static HTML/CSS/JS, no build step. See the
root `../CLAUDE.md` for shared conventions.

## Structure

`index.html` at root, `css/style.css`, `js/main.js`, `404.html`. No custom domain yet
(`caiomsi.github.io/Corretora-InHouse`).

## Design language

Elegant alto-padrão (high-end): marfim/grafite/bronze (ivory/graphite/bronze),
Marcellus + Manrope type pairing.

## Signature feature — branching lead wizard

A dynamic lead-qualification wizard: steps branch by intent (comprar / alugar /
vender / investir) and end by generating a pre-filled `wa.me` message — this is the
whole lead flow, **no MSI-Forms integration**, WhatsApp only. **`js/main.js` line 6,
`WHATSAPP_NUMBER = '5534999999999'`, is still a placeholder** — not her real number.
Confirm the real number, and her real listing photos/bio, before this goes live.
