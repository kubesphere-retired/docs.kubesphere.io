# Documentation for [KubeSphere](https://github.com/kubesphere/kubesphere).

[![Netlify Status](https://api.netlify.com/api/v1/badges/eec97cb5-3fa0-4865-ad61-357edc16a145/deploy-status)](https://app.netlify.com/sites/kubesphere-docs/deploys)

[![Build Status](https://travis-ci.org/kubesphere/docs.kubesphere.io.svg)](https://travis-ci.org/kubesphere/docs.kubesphere.io)

## Prerequisites

We recomend you to install following 3 software:

> - git
> - node.js
> - yarn (or npm, `we recommend yarn`)

Then check if these prerequisites have been installed successfully.

```shell
git --version
node -v
yarn -v
```

## Fork it

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191123154725.png)

## Clone to your local

Then you are ready to go:

```shell
$ git clone https://github.com/{$YOUR_GITHUB_ACCOUNT}/docs.kubesphere.io.git
```

## Compile it locally

```
$ cd docs.kubesphere.io

$ yarn

$ yarn develop
```

Then you can preview the documentation website using `http://localhost:8000/`.


## Contribute

All of documents are left in `content/version/language/folder`, see the tree of this documentation repo:

```bash
├── content                                       // documents directory
│   ├── v2.1                                     // documents version
│   │   ├── en                                   // documents language - English version
│   │   │   └── quick-start                      // document folder
│   │   │           └── admin-quick-start.md     // document
│   │   │           └── xxxx.md
│   │   ├── zh-CN                                // documents language - Chinese version
│   │   │   └── quick-start                      // document folder
│   │   │           └── admin-quick-start.md     // document
│   │   │           └── xxxx.md
│   ├── toc_v2.1_en.json                         // table of contents, define the page navigation, this json file is for English version of navigation.
│   └── toc_v2.1_zh-CN.json                      // this json file is for Chinese version of navigation.
├── src                                          // source code

```

## Contribute to documentation

We hope for your contribution to KubeSphere documentation, also we believe you are able to improve the current docs, add your practical guides, or fix mistaken words, it's quite easy to commit your first PR to this repository by following these steps.

### Modify document

For example, if we want to modify a quick start guide (e.g. admin-quick-start.md) as following, take a look at the URL of this guide, the path `/v2.1/en/quick-start/admin-quick-start/` means the markdown file location, thus you'll be able to edit it within this repo locally.

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191123163146.png)

Expand the path `/v2.1/en/quick-start/admin-quick-start/`, then edit the `admin-quick-start.md`, save it after modification, and then using git to commit your changes to remote.


![](https://pek3b.qingstor.com/kubesphere-docs/png/20191123162214.png)

### Commit your PR

```bash
$ git add .                                 // Add your local changes
$ git commit -s -m "comment your changes"  // Commit with your comment
$ git push origin master                  // Push to your remote repo
```

After above steps done, open a new Pull Request in GitHub:

![](https://pek3b.qingstor.com/kubesphere-docs/png/20191123163627.png)

When PR has been created, you should preview your changes and verify it in the Netlify notification as following, click the `Details` button with `Deploy preview ready!` row to preview your changes in browser.



## Edit navigation

Navigation is corresponding to the directory on the left, if you'd like to add a new document or modify the title within directory, just modify the  content in `content/toc_v2.1_en.json` or `content/toc_v2.1_zh-CN.json`.

> Attention: make sure you can compile it successfully using command `yarn develop` if you change the navigation json file.

**navigation file example**

> - id: should match the format of ``{version}-{language}``
> - chapters: nav items
> - title: nav title
> - entry: nav entry, path to the document to display
> - entries: sub navs


```
···
"version": "v2.1",
"lang": "en",
"chapters": [
  {
    "title": "Release Notes",
    "icon": "/product.svg",
    "desc": "Introduce the new features, capabilities and updates for the releases",
    "chapters": [
      {
        "title": "Release Notes - 2.1.0",
        "entry": "./v2.1/en/release/release-v210.md",
        "tag": "Latest"
      },
      {
        "title": "Release Notes - 2.0.2",
        "entry": "./v2.1/en/release/release-v202.md"
      },
      {
        "title": "Release Notes - 2.0.1",
        "entry": "./v2.1/en/release/release-v201.md"
      },
      {
        "title": "Release Notes - 2.0.0",
        "entry": "./v2.1/en/release/release-v200.md"
      }
    ]
  }
```
