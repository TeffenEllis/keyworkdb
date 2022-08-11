/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

// @ts-check

// const fs = require('fs')
// const path = require('path')

// const moduleManifest = JSON.parse(
//   fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'modules', 'module-manifest.json'))
// )

const topLevelModules = [
  { dirName: 'modules/assets', label: 'Assets' },
  // { dirName: 'modules/bindings', label: 'Bindings' },
  { dirName: 'modules/errors', label: 'Errors' },
  { dirName: 'modules/events', label: 'Events' },
  { dirName: 'modules/files', label: 'Files' },
  { dirName: 'modules/http', label: 'HTTP' },
  { dirName: 'modules/ids', label: 'IDs' },
  { dirName: 'modules/react', label: 'React' },
  { dirName: 'modules/router', label: 'Router' },
  { dirName: 'modules/session', label: 'Session' },
  { dirName: 'modules/uri', label: 'URI' },
  { dirName: 'modules/kv', label: 'Key/Value' },
  { dirName: 'modules/timers', label: 'Timers' },
  { dirName: 'modules/bundling', label: 'Bundling' },
  { dirName: 'modules/polyfills/worker/ReadableStream', label: 'Polyfills' },
]

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const topLevelModuleSidebars = {}

for (const [index, { dirName, label }] of topLevelModules.entries()) {
  /** @type {import('@docusaurus/plugin-content-docs').PropSidebarItem[]} */
  const items = []

  const previousModule = topLevelModules[index - 1]
  const nextModule = topLevelModules[index + 1]

  if (previousModule) {
    items.push({
      type: 'link',
      label: previousModule.label,
      href: path.posix.join('/', previousModule.dirName),
    })
  }

  items.push({
    type: 'category',
    label,
    collapsible: false,
    link: {
      type: 'doc',
      id: path.posix.join(dirName, 'README'),
    },

    items: [
      {
        type: 'autogenerated',
        dirName,
      },
    ],
  })

  if (nextModule) {
    items.push({
      type: 'link',
      label: nextModule.label,
      href: path.posix.join('/', nextModule.dirName),
    })
  }

  topLevelModuleSidebars[dirName] = items
  //   [
  //   {
  //     type: 'category',
  //     label: 'Modules',
  //     link: {
  //       type: 'doc',
  //       id: 'modules/index',
  //     },
  //     items,
  //     // {
  //     //   type: 'link',
  //     //   label: 'Modules',
  //     //   href: path.posix.join('/modules'),
  //     // },
  //   },
  // ]
}

// const sidebarModules = moduleManifest.map((categoryConfig) => {
//   /** @type {import('@docusaurus/plugin-content-docs').PropSidebarItem} */
//   const item = {
//     type: 'category',
//     label: categoryConfig.label,
//     items: [
//       {
//         type: 'autogenerated',
//         dirName: categoryConfig.dirName,
//       },
//     ],
//   }

//   return item
// })

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  primarySidebar: [
    {
      type: 'doc',
      id: 'README',
      label: 'Overview',
    },

    {
      type: 'link',
      label: 'Quick Start',
      href: '/getting-started',
    },

    {
      type: 'link',
      label: 'Examples',
      href: '/examples',
    },

    {
      type: 'link',
      label: 'Help & Support',
      href: '/help',
    },
  ],

  gettingStarted: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsible: false,
      link: {
        type: 'doc',
        id: 'getting-started/install',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'getting-started/content',
        },
      ],
    },
    {
      type: 'category',
      label: 'Related',
      collapsible: false,
      items: [
        {
          type: 'doc',
          id: 'modules/react/server-side-rendering',
        },
        {
          type: 'link',
          label: 'Examples',
          href: '/examples',
        },
      ],
    },
  ],

  examples: [
    {
      type: 'category',
      label: 'Examples',
      collapsible: false,
      link: {
        type: 'generated-index',
        title: 'Examples',
        slug: '/examples/',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'examples',
        },
      ],
    },
    {
      type: 'link',
      label: 'Modules',
      href: '/modules',
    },
  ],

  modules: [
    {
      type: 'category',
      label: 'Modules',
      collapsible: false,
      link: {
        type: 'doc',
        id: 'modules/README',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'modules',
        },
      ],
    },
    {
      type: 'link',
      label: 'Community',
      href: '/contributing',
    },
  ],

  ...topLevelModuleSidebars,

  contributing: [
    {
      type: 'category',
      collapsible: false,
      label: 'Community',

      link: {
        type: 'doc',
        id: 'contributing',
      },

      items: [
        {
          type: 'link',
          href: 'https://github.com/nirrius/keywork',
          label: 'GitHub',
        },

        {
          type: 'link',
          href: 'https://github.com/nirrius/keywork/discussions',
          label: 'Forums',
        },

        'help',
        'code-of-conduct',
      ],
    },
    {
      type: 'category',
      label: 'External Resources',
      collapsible: false,
      items: [
        {
          type: 'link',
          // className: 'link-with-icon icon-stack-overflow',
          label: 'Stack Overflow',
          href: 'https://stackoverflow.com/questions/tagged/keywork',
        },

        {
          type: 'category',
          label: 'Cloudflare',
          items: [
            {
              type: 'link',
              label: 'Developer Discord',
              href: 'https://discord.gg/cloudflaredev',
            },
            {
              type: 'link',
              label: 'Workers Docs',
              href: 'https://workers.cloudflare.com/',
            },
          ],
        },

        {
          type: 'category',
          label: 'Deno',
          items: [
            {
              type: 'link',
              label: 'Deply Docs',
              href: 'https://deno.com/deploy/docs',
            },
          ],
        },
      ],
    },
    {
      type: 'link',
      label: 'Licensing',
      href: '/license',
    },
  ],

  license: [
    {
      type: 'category',
      label: 'Licensing',
      collapsible: false,
      link: {
        type: 'doc',
        id: 'license/index',
      },
      items: [
        {
          type: 'autogenerated',
          dirName: 'license',
        },
        'third-party-notices',
      ],
    },
  ],
}

module.exports = sidebars
