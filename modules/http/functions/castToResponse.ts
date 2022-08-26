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

import { isValidElement } from 'https://esm.sh/react@18.2.0'
import { KeyworkResourceError, Status } from '../../errors/mod.ts'
import { ReactRendererOptions, renderJSXToStream } from '../../react/mod.ts'
import HTTP from '../../__internal/http.ts'
import Stream from '../../__internal/stream.ts'
import { ErrorResponse } from '../classes/ErrorResponse.ts'
import { HTMLResponse } from '../classes/HTMLResponse.ts'
import { JSONResponse } from '../classes/JSONResponse.ts'
import { isInstanceOfResponse } from './isInstanceOfResponse.ts'

/**
 * Either a full `Response`, or a more primitive value to be processed.
 * @public
 */
export type ResponseLike = globalThis.Response | React.ReactElement | {} | null | undefined | Error | string

/**
 * Infers the appropriate Response constructor for the given `ResponseLike` body.
 *
 * While the {@link Keywork#Router.KeyworkRouter `KeyworkRouter`} automatically
 * converts returned values via `castToResponse`.
 *
 * @throws {KeyworkResourceError}
 * @category Type Cast
 * @public
 */
export async function castToResponse(
  responseLike: ResponseLike,
  reactRenderOptions?: ReactRendererOptions
): Promise<globalThis.Response> {
  if (isInstanceOfResponse(responseLike)) {
    return responseLike
  }

  if (responseLike instanceof Error) return new ErrorResponse(responseLike)

  if (responseLike instanceof Stream.ReadableStream) {
    throw new KeyworkResourceError(
      `Keywork cannot infer the 'Content-Type' for \`ReadableStream\`. Instead, wrap this value in a \`Response\``,
      Status.InternalServerError
    )
  }

  if (!responseLike) {
    return new HTTP.Response(responseLike as any, { status: Status.NoContent })
  }

  if (typeof responseLike === 'string') {
    if (responseLike.startsWith('<!DOCTYPE')) {
      return new HTMLResponse(responseLike)
    }

    return new HTTP.Response(responseLike)
  }

  if (isValidElement(responseLike)) {
    const stream = await renderJSXToStream(responseLike, reactRenderOptions)
    return new HTMLResponse(stream)
  }

  if (typeof responseLike === 'object') {
    return new JSONResponse(responseLike)
  }

  throw new KeyworkResourceError(
    `Keywork could not infer the appropriate \`Response\` constructor for type ${typeof responseLike}. `,
    Status.InternalServerError
  )
}
