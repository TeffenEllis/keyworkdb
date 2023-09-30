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

import Handlebars from 'handlebars'
import { escapeChars, stripLineBreaks } from 'keywork/docgen/utils'
import { DeclarationReflection, ReflectionType } from 'typedoc'

export function propertyTableHelper() {
  Handlebars.registerHelper('propertyTable', function (this: DeclarationReflection[]) {
    const comments = this.map((param) => !!param.comment?.hasVisibleComponent())
    const hasComments = !comments.every((value) => !value)

    const headers = ['Name', 'Type']

    if (hasComments) {
      headers.push('Description')
    }

    const flattenParams = (current: any) => {
      return current.type?.declaration?.children?.reduce((acc: any, child: any) => {
        const childObj = {
          ...child,
          name: `${current.name}.${child.name}`,
        }
        return parseParams(childObj, acc)
      }, [])
    }

    const parseParams = (current: any, acc: any) => {
      const shouldFlatten = current.type?.declaration?.children

      return shouldFlatten ? [...acc, current, ...flattenParams(current)] : [...acc, current]
    }

    const properties = this.reduce((acc: any, current: any) => parseParams(current, acc), [])

    const rows = properties.map((property) => {
      const propertyType = getPropertyType(property)
      const row: string[] = []
      const nameCol: string[] = []
      const name =
        property.name.match(/[\\`\\|]/g) !== null ? escapeChars(getName(property)) : `\`${getName(property)}\``
      nameCol.push(name)
      row.push(nameCol.join(' '))
      row.push(Handlebars.helpers.type.call(propertyType).replace(/(?<!\\)\|/g, '\\|'))

      if (hasComments) {
        const comments = getComments(property)
        if (comments) {
          row.push(stripLineBreaks(Handlebars.helpers.comments(comments)).replace(/\|/g, '\\|'))
        } else {
          row.push('-')
        }
      }
      return `| ${row.join(' | ')} |\n`
    })

    const output = `\n| ${headers.join(' | ')} |\n| ${headers.map(() => ':------').join(' | ')} |\n${rows.join('')}`

    return output
  })
}

function getPropertyType(property: any) {
  if (property.getSignature) {
    return property.getSignature.type
  }
  if (property.setSignature) {
    return property.setSignature.type
  }
  return property.type ? property.type : property
}

function getName(property: DeclarationReflection) {
  const md: string[] = []
  if (property.flags.isRest) {
    md.push('...')
  }
  if (property.getSignature) {
    md.push(`get ${property.getSignature.name}()`)
  } else if (property.setSignature) {
    md.push(
      `set ${property.setSignature.name}(${property.setSignature.parameters?.map((parameter) => {
        return `${parameter.name}:${Handlebars.helpers.type.call(parameter.type, 'all', false)}`
      })})`
    )
  } else {
    md.push(property.name)
  }
  if (property.flags.isOptional) {
    md.push('?')
  }
  return md.join('')
}

function getComments(property: DeclarationReflection) {
  if (property.type instanceof ReflectionType) {
    if (property.type?.declaration?.signatures) {
      return property.type?.declaration.signatures[0].comment
    }
  }
  if (property.signatures) {
    return property.signatures[0].comment
  }
  return property.comment
}
