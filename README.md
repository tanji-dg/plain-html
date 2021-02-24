# DSA NTC Landing Page

> [https://tech.dsausa.org](https://tech.dsausa.org)

---

This site provides some basic information about the DSA National Tech Committee.

## Development setup

First, install the Node.js version specified in [this file](.node-version). Then, install the
[Yarn package manager](https://yarnpkg.com/en/docs/install). Once that's all set, you can install dependencies
with:

```sh
$ yarn install
```

And start the development server on [http://localhost:3000](http://localhost:3000) via `yarn dev`.

## Deployment

Test deployments using `yarn export:static` and `yarn serve:static`.

Since this project uses [GitLab Pages](https://about.gitlab.com/product/pages/), deployments occur automatically
whenever a change is pushed to the `master` branch.
