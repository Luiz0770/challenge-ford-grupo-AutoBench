# AutoBench — Ford Challenge

> Ferramenta de inteligência competitiva no mercado automotivo brasileiro.

---

## Grupo

**AutoBench** — Turma de Análise e Desenvolvimento de Sistemas · FIAP

---

## O Desafio

O mercado automotivo exige que montadoras compreendam rapidamente como seus concorrentes se posicionam em preço e pacotes de equipamentos. Dados imprecisos ou desorganizados custam tempo e decisões estratégicas.

O desafio proposto pela Ford foi:

> *Desenvolver uma ferramenta/modelo/solução que permita receber dados técnicos da concorrência a partir de uma entrada simples e gerar uma lista padronizada de especificações.*

---

## A Solução

O **AutoBench** é um aplicativo mobile multiplataforma (Android e iOS) construído com React Native + Expo. Ele centraliza dados técnicos de veículos concorrentes em um banco local curado e os enriquece com preços de mercado em tempo real via **API FIPE**, permitindo análise e comparação detalhada a partir de uma busca hierárquica simples (marca → modelo → versão → ano).

O diferencial está no módulo **Oráculo**: um mecanismo de veredito que pontua dois veículos lado a lado em quatro eixos — motorização, dimensões, tecnologia e segurança — e emite uma recomendação estruturada com análise de gap de preço.

---

## Funcionalidades

### Busca Hierárquica
- Campo de pesquisa inteligente com autocomplete
- Filtros em cascata: marca → modelo → versão → ano
- Categorização em 12 segmentos de mercado (SUV, Picape, Sedan, Hatch, Crossover, Cupê, Esportivo, Compacto, Elétrico, Híbrido, Conversível e Minivan)

### Ficha Técnica Completa
Cada veículo expõe especificações padronizadas organizadas em seções:

| Seção | Dados |
|---|---|
| Motorização | Motor, potência, torque, combustível |
| Transmissão | Câmbio, tração, modos de condução |
| Suspensão & Freios | Tipo de suspensão, freios ABS/EBD |
| Iluminação | Faróis, lanternas, DRL |
| Rodas & Pneus | Aro, dimensões |
| Tecnologia | Central multimídia, Apple CarPlay / Android Auto, câmera 360° |
| Segurança ADAS | Frenagem emergencial, cruise adaptativo, monitoramento de ponto cego |
| Dimensões | Comprimento, porta-malas, peso |
| Precificação | Preço de tabela + cotação FIPE em tempo real |

### Comparação de Veículos
- Seleção de dois veículos (Slot A vs. Slot B)
- Matriz comparativa com destaque do vencedor por item
- Quatro abas de análise: Motorização · Dimensões · Tecnologia · Segurança

### Oráculo (Veredito Inteligente)
- Pontuação por categoria (0–100) para cada veículo
- Recomendação textual gerada para o par comparado
- Análise de gap de preço (valor absoluto e percentual)
- Vereditos curados para combinações relevantes de mercado (ex.: Ford Ranger Raptor vs. Limited)

### Histórico e Favoritos
- Últimas 20 fichas acessadas com timestamp
- Marcação de favoritos com feedback tátil (haptics)
- Dados persistidos localmente via AsyncStorage

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Mobile | React Native 0.85 + Expo 56 |
| Linguagem | TypeScript 6 |
| Roteamento | Expo Router (file-based) |
| Estilização | NativeWind 4 (Tailwind para RN) |
| Estado global | Zustand 5 + AsyncStorage |
| Animações | React Native Reanimated 4 |
| HTTP | Axios + API FIPE (parallelum.com.br) |
| Testes | Jest 29 + Testing Library |

---

## Como Executar

**Pré-requisitos:** Node.js 18+, Expo CLI, emulador Android/iOS ou Expo Go.

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npx expo start
```

Escaneie o QR Code com o **Expo Go** (Android) ou pela câmera (iOS), ou pressione `a` / `i` para abrir no emulador.

```bash
# Rodar testes unitários
npm test
```

---

## Estrutura do Projeto

```
app/
├── (tabs)/
│   ├── index.tsx        # Tela inicial — busca + favoritos + histórico
│   ├── busca.tsx        # Navegação por categorias
│   └── comparar.tsx     # Comparação A vs. B + Oráculo
├── vehicle/[id].tsx     # Ficha técnica do veículo
└── model-results.tsx    # Lista de versões filtradas

services/
├── catalog.ts           # Busca, filtros e lógica de comparação
├── fipe.ts              # Integração com a API FIPE
└── vehicleData.ts       # Consultas ao banco local de veículos

data/
├── vehicles.json        # Base de especificações técnicas
└── categories.json      # Definição dos 12 segmentos
```

---

## Integrantes

| Nome | RM |
|---|---|
| Luiz Felipe Coelho Ramos | 5550774 |
| Vitor Musolino Teixeira | 555012 |
| Fernando Gonzales Alexandre | 555045 |
| Lucas Catroppa Piratininga Dias | 555450 |
| Gabriel Guerreiro Escobosa Vallejo | 554973 |
