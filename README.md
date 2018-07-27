# Documents for [KubeSphere](KubeSphere).

[![Build Status](https://travis-ci.org/kubesphere/docs.kubesphere.io.svg)](https://travis-ci.org/kubesphere/docs.kubesphere.io)

## Develop

### Setting up with git
If you choose this way, we recommend you to install some requisites
- git
- node.js
- yarn (or npm, `we recommend yarn`)

Check your requisites:
```shell
git --version
node -v
yarn -v
```

Then you are ready to go:
```shell
git clone https://github.com/kubesphere/docs.kubesphere.io.git

cd docs.kubesphere.io

yarn

yarn develop
```

## Contribute

Tree of repo:

```bash
├── content                                         // documents directory
│   ├── express                                     // documents version
│   │   ├── en                                      // documents language 
│   │   │   └── KubeSphere-Installer-Guide.md       // document
│   │   └── zh-CN
│   │       └── KubeSphere-Installer-Guide.md
│   ├── toc_express_en.json                         // table of contents, define the page navigation
│   └── toc_express_zh-CN.json
├── src
└── static                                          // put document images here
    └── daemonset_create_1.png
```

If you want to edit the document, you can follow the ways below:

### Add new version
 
1. Create a new directory called the new version name under the ``content`` directory

```shell
cd content && mkdir version-xxxx
```

2. Create subdirectories for each language you want to support

```shell
cd content/version-xxxx && mkdir zh-CN en
```

3. Create navigation files for each language of the new version under the ``content`` directory

```shell
cd content

touch toc_version-xxx_en.json toc_version-xxx_zh-CN.json
```

### Edit navigation

navigation file example

- id: should match the format of ``{version}-{language}``
- chapters: nav items
- title: nav title
- entry: nav entry, path to the document to display
- entries: sub navs

```json
{
  "id": "express-zh-CN",
  "chapters": [
    {
      "title": "简介",
      "entry": "./express/zh-CN/basic.md"
    },
    {
      "title": "应用负载",
      "entries": [
        {
          "entry": "./express/zh-CN/manage-deployments.md"
        },
        {
          "entry": "./express/zh-CN/manage-statefulsets.md"
        },
        {
          "entry": "./express/zh-CN/manage-daemonsets.md"
        }
      ],
      "chapters": [
      ]
    }
  ]
}
```

### Edit Document

document example

```
---
  title: 'document title, will show in nav'
---

  ## title 1

  content 1

  ![](/image.png) 

  this path will request ``/static/image.png``

  ## title 2

  ### subtitle 2.1
    content 2.1
  
  ### title 3
```

`##` will be transformed to an anchor of the page, and will show in the nav.
