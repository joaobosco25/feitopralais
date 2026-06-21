# Site para a Lais

Projeto estático feito com HTML, CSS e JavaScript puro.

## Como abrir

Extraia o ZIP e abra o arquivo `index.html` no navegador.

Para trabalhar pelo Visual Studio Code, também dá para usar a extensão Live Server.

## Personalização

Os textos usados pelo JavaScript ficam no começo de:

```text
js/main.js
```

O objeto `dadosDoSite` reúne o nome, o texto digitado na abertura e os elogios:

```js
const dadosDoSite = {
  nome: "Lais",
  textoDeAbertura: "...",
  elogios: ["..."]
};
```

Os textos das cartas, da raspadinha e da mensagem final ficam diretamente no `index.html`.

## Arquivos

```text
site-para-lais/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── favicon.svg
└── README.md
```

O projeto não depende de bibliotecas externas nem de servidor.
