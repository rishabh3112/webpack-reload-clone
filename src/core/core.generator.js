const fs = require('fs')
const glob = require('glob')

const mergeManifestObject = (base, manifest) => {
  if (!manifest) return base
  if (!base) return manifest
  const { modules, ...rest } = manifest
  const activeModules = Object.keys(modules)
    .filter(key => modules[key])
    .reduce((acc, key) => {
      acc[key] = modules[key]
      return acc
    }, {})
  const result = Object.assign({}, base, rest, {
    modules: Object.assign({}, base.modules, activeModules),
    extend: [...base.extend, ...manifest.extend],
  })
  return result
}

const getManifest = (app, captured = {}) => {
  if (captured[app]) {
    return null
  }
  const filesOnly = new RegExp(/.+(\.).*/)
  const dir = fs
    .readdirSync('./src/app/')
    .filter(item => /*item !== 'core' &&*/ !filesOnly.test(item))
    .find(item => item === app)
  const manifest =
    fs.readdirSync(`./src/app/${dir}/`).find(item => item === 'manifest.json') &&
    JSON.parse(fs.readFileSync(`./src/app/${dir}/manifest.json`, 'utf8'))
  if (!manifest) {
    throw new Error(
      `\x1b[31mCould not retrieve application manifest, verify it exists at: src/apps/${app}/manifest.json\x1b[0m`
    )
  }

  captured[app] = true
  if (manifest.extend.length) {
    const base = manifest.extend.reduce((acc, subApp) => {
      return mergeManifestObject(acc, getManifest(subApp, captured))
    }, null)
    return mergeManifestObject(base, manifest)
  }

  return mergeManifestObject(manifest, null)
}

const getModuleLocation = (modules, app) => {
  if (modules.length === 1) return modules[0]
  return modules.filter(module => {
    // TODO: implement finding any module anywhere (allModules must find them - for now it doesnt)
    const regex = new RegExp(`.*(^|\/+)${app}(\/.*\/|\/)bundles\/.*`)
  })[0]
}

// prettier-ignore
const generateBundlerScript = (manifest) => {
  const modules = Object.keys(manifest.modules).filter(key => manifest.modules[key])
  const allModules = glob.sync(`src/{app/${manifest.application},}/bundles`).reduce((acc,curr,i) => {
    fs.readdirSync(curr).filter(bundleName => bundleName.substring(0,1) !== "_").forEach(bundle => {
      acc[bundle] = acc[bundle] || (acc[bundle] = [])
      acc[bundle].push(`${curr}/${bundle}`)
    })
    return acc
  }, {})
  
  const dependencies = [...modules]
  let i = 0;
  while(i <= dependencies.length && i < 1000){
    if (!allModules[dependencies[i]]) break
    const module = dependencies[i]
    const hasConfig = fs.readdirSync(getModuleLocation(allModules[module], manifest.application))
      .filter(file => file === 'config.json').length

    if(hasConfig){
      const moduleConfig = JSON.parse(fs.readFileSync(`${getModuleLocation(allModules[module], manifest.application)}/config.json`, 'utf8'))
      if(moduleConfig.dependencies && moduleConfig.dependencies.length){
        moduleConfig.dependencies.forEach(dependency => {
          if (dependencies.indexOf(dependency) === -1){
            dependencies.push(dependency)
          }
        })
      } 
    }
    i++
  }
  
  const missingDependency = dependencies.find(module => !allModules[module])
  if (missingDependency){
    throw new Error(
      `\x1b[31mApplication "${manifest.application.toUpperCase()}" cannot be complied, missing module: ${missingDependency} is required.\x1b[0m`
    )
  }

  const scripts = dependencies.map(module => {
    const modulePath = getModuleLocation(allModules[module], manifest.application)
    const components = fs.readdirSync(modulePath)
      .map(file => file.split('.')[0])
      .filter(file => file.match(/^(actions|selectors|reducers|addons)$/))
    
    const bundle = fs.readdirSync(modulePath)
    .map(file => file.split('.')[0])
    .filter(file => file.match(/^(bundle)$/))

    const importName = module.split('-').map((e,i) => i ? `${e.substring(0,1).toUpperCase()}${e.substring(1)}` : e).join('')

    return {
      name: module,
      importName: importName,
      config: JSON.stringify(manifest.modules[module]),
      precompiled: bundle.length ? `  import ${importName}Bundle from '../../${modulePath}/bundle'\n` : null,
      imports: components.map(component => `  import * as ${importName}_${component} from '../../${modulePath}/${component}'\n`),
      hasAddons: components.some(file => file.match(/addons/)),
      bundle: `  const ${importName}Bundle = (config) => createBundle({ 
    name: '${module}',
    reducer: ${components.some(component => component.match(/reducers/)) ? `${importName}_reducers.default, ` : 'null,'}
    actions: ${components.some(component => component.match(/actions/)) ? `${importName}_actions, ` : 'null,'}
    selectors: ${components.some(component => component.match(/selectors/)) ? `${importName}_selectors, `: 'null,' }
    priority: ${components.some(component => component.match(/addons/)) ? `${importName}_addons.priority ? ${importName}_addons.priority : null, ` : 'null,'}
    init: ${components.some(component => component.match(/addons/)) ? `${importName}_addons.init ? ${importName}_addons.init : null, ` : 'null,'}
    args: ${components.some(component => component.match(/addons/)) ? `${importName}_addons.args ? ${importName}_addons.args : null,` : 'null,'}
    persist: ${components.some(component => component.match(/addons/)) ? `${importName}_addons.persist ? ${importName}_addons.persist : null,` : 'null,'}
    middleware: ${components.some(component => component.match(/addons/)) ? `${importName}_addons.middleware ? ${importName}_addons.middleware : null,` : 'null,'}
  })\n`}
  })

  const bundlerScript = `
  import React from 'react'
  import { createBundle, composeBundles } from 'core/bundler'
  import { Provider, useStore, Router, Route, Redirect, Switch, Link, useLocation, useHistory, useRouteMatch } from 'core/react-bindings'
  import appTime from 'core/modules/app-time'
  import asyncCount from 'core/modules/async-count'
  import debug from 'core/modules/debug'
  import localCache from 'core/modules/local-cache'
  import reactors from 'core/modules/reactors'
  import router, { history } from 'core/modules/router'

${scripts.map(script => !script.precompiled ? script.imports.join('') : script.precompiled).join('\n')}  
${scripts.map(script => !script.precompiled ? script.bundle : '').join('')}

const store = composeBundles(
  appTime,
  asyncCount,
  debug,
  localCache,
  reactors,
  router,
  ${scripts.map(script => `${script.importName}Bundle(${script.config})`).join(',\n ')}
)

  const Core = ({ preloadedData, children }) => (
    <Provider store={store(preloadedData)}>
      <Router history={history}>{children}</Router>
    </Provider>
  )
  export default Core
  export { useStore, Route, Redirect, Switch, Link, useLocation, useHistory, useRouteMatch }
` 

  console.log(bundlerScript)
  return bundlerScript
}

const ApplicationManifest = app => {
  // if (app === 'core') {
  //   throw new Error(
  //     '\x1b[31mCannot build CORE as an application, please verify your configuration\x1b[0m'
  //   )
  // }
  console.log(
    '\x1b[36m%s\x1b[0m',
    'Retrieving application manifest and generating bundle scripts...'
  )
  const manifest = getManifest(app)
  if (manifest) {
    manifest.application = app
    manifest.coreScript = generateBundlerScript(manifest)
  }
  console.log(
    '\x1b[36m%s\x1b[0m',
    'Core bundle succesfuly generated, proceeding with the build...'
  )
  return manifest
}

module.exports = {
  ApplicationManifest,
}
