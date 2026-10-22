# Contact Electrification

> **Language / Idioma:** [English](README.md) | **Português (Brasil)**
>
> *If you prefer to read this documentation in English, [click here](README.md).*

<div align="center">
	<a href="https://contact-electrification.vercel.app/pt-BR">
		<img src="src/app/icon.svg" alt="Logotipo do Contact Electrification" height="140">
	</a>
	<h3>Calculadora de Eletrização por Contato</h3>
	<p>
		Um site em Next.js que calcula a carga de dois ou mais corpos após<br>
		uma sequência de contatos entre eles, exibindo cada resultado como uma fração exata.
	</p>
</div>

<br>

<p align="center">
	<img alt="Licença" src="https://img.shields.io/badge/Licen%C3%A7a-ISC-5271FF?style=for-the-badge">
	<img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white">
	<img alt="React" src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
	<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
	<img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
	<img alt="Vercel" src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white">
</p>

## Sumário
- [Contact Electrification](#contact-electrification)
  - [Sumário](#sumário)
  - [Sobre o Projeto](#sobre-o-projeto)
    - [Como Funciona](#como-funciona)
  - [Principais Funcionalidades](#principais-funcionalidades)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Como Executar o Projeto](#como-executar-o-projeto)
    - [Pré-requisitos](#pré-requisitos)
    - [Instalação](#instalação)
    - [Executando a Aplicação](#executando-a-aplicação)
    - [Testes e Linting](#testes-e-linting)
  - [Capturas de Tela](#capturas-de-tela)
  - [Licença](#licença)

## Sobre o Projeto
Esse site calcula a eletrização por contato entre dois ou mais corpos. Nele, é possível definir quantos corpos participarão dos contatos (de 2 a 26, identificados de A a Z), qual a carga inicial de cada um e a sequência dos contatos entre eles. O resultado final contém a carga resultante de cada contato, assim como a soma total das cargas.

### Como Funciona
Quando corpos condutores idênticos se tocam, a carga total deles é dividida igualmente entre todos. Cada contato lista os corpos que se tocam (por exemplo, `A, B, C`), e os contatos são aplicados em ordem, de modo que os contatos seguintes usam as cargas deixadas pelos anteriores. A carga total nunca muda, o que a torna uma boa forma de conferir os resultados.

As cargas aceitam números inteiros, decimais e notação científica, com o sufixo `q` opcional (`3`, `-1.5q`, `2e-3`).

## Principais Funcionalidades
- **Resultados exatos**: toda carga é um número racional, então `1/3` continua sendo `1/3` em vez de virar `0,333…`.
- **Renderização matemática nativa**: as frações são exibidas com MathML, sem nenhuma biblioteca adicional.
- **Validação dos campos**: cargas e contatos inválidos são informados com uma mensagem, e o campo com problema recebe o foco.
- **Listas pensadas para o teclado**: `Enter` vai para o próximo campo (criando um novo no final), e `Shift+Enter` volta ao anterior.
- **Traduções**: inglês e português do Brasil, escolhidos pela rota (`/en` e `/pt-BR`).
- **Interface acessível e responsiva**: campos com rótulos, resultados anunciados para leitores de tela e um layout que funciona em celulares.

## Tecnologias Utilizadas
- **[Next.js 16](https://nextjs.org/)** (App Router, Cache Components): renderização estática dos dois idiomas.
- **[React 19](https://react.dev/)**: interface baseada em componentes.
- **[TypeScript](https://www.typescriptlang.org/)**: tipagem estática, incluindo as chaves de tradução.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: estilização utilitária.
- **[next-intl](https://next-intl.dev/)**: internacionalização baseada em rotas.
- **[Fraction.js](https://github.com/rawify/Fraction.js)**: aritmética racional exata.
- **[React Toastify](https://fkhadra.github.io/react-toastify/)**: feedback da validação.
- **[Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)**: testes de unidade e de componentes.

## Como Executar o Projeto

### Pré-requisitos
- **Node.js** `^22.18`, `^23.5` ou `>=24`
- **[pnpm](https://pnpm.io/)** `12`

### Instalação
```bash
git clone https://github.com/Alphka/Contact-Electrification.git
cd Contact-Electrification
pnpm install
```

### Executando a Aplicação
* **Modo de desenvolvimento** (Turbopack, hot reload):
  ```bash
  pnpm dev
  ```
  Acesse [http://localhost:3000](http://localhost:3000).

* **Build e execução em produção:**
  ```bash
  pnpm build
  pnpm start
  ```

### Testes e Linting
```bash
pnpm test
pnpm lint
pnpm tsc
```

As mesmas verificações rodam no GitHub Actions a cada push para a `main` e em cada pull request.

## Capturas de Tela

<p align="center">
	<picture>
		<source type="image/webp" srcset=".github/screenshot.webp">
		<img src=".github/screenshot.png" alt="Captura de tela">
	</picture>
</p>

<p align="center">
	<picture>
		<source type="image/webp" srcset=".github/screenshot-1.webp">
		<img src=".github/screenshot-1.png" alt="Captura de tela">
	</picture>
</p>

## Licença
[ISC](LICENSE.md) © 2022 Kayo Souza
