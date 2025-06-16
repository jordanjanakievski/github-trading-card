# GitHub Trading Card

Inspired by the trading cards created by GitHub for GitHub Graduation participants in 2021 and 2022.

## Usage

1. Enter your GitHub username in the `username` input on the site.
1. Select the year you would like to generate the card for.
1. Choose whether you want to include your private repositories in the data (requires auth token).
1. Click the "Generate Card" button.
1. The card will be generated and displayed on the page.
1. You can download the card as an image by clicking the "Export" button.

## Repository

```
git clone https://github.com/jordanjanakievski/github-trading-card.git

cd github-trading-card
```

## Running the Project

```
bun install
# Could also use npm or yarn

bun dev
```

## Top Language Help

If you notice that the top language on the card is not displaying and using the GitHub logo instead, you can check the console for logged output for the top language.

Please raise an issue indicating the language so a solution can be found as Simple Icons does not use the same name for all languages as GitHub does.

Thanks for your help!
