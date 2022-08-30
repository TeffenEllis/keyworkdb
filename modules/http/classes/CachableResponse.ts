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

import { Status } from '../../errors/mod.ts'
import { CacheControlDirectives, createCacheControlHeader, isETagMatch } from '../headers/caching/mod.ts'
import { NotModifiedResponse } from './NotModifiedResponse.ts'

/**
 * A client-side cachable response.
 *
 * @remarks Etag caching is supported when `CachableResponse` is constructed with the needed parameters.
 * You may want to disable caching in your browser development tools to avoid this behavior while debugging.
 *
 * @category HTTP Response
 * @category Cache
 */
export class CachableResponse extends Response {
  constructor(
    /** A body sent with the response. */
    body: BodyInit | null,
    /** A request to check for etag headers. */
    // eslint-disable-next-line no-restricted-globals
    request?: Request,
    /** An etag for the given `body` parameter. */
    etag?: string | null,
    /** Options to generate a cache control header. */
    cacheControlOptions?: Partial<CacheControlDirectives>,
    /** headers to add to the response. */
    headersInit?: HeadersInit
  ) {
    if (request && isETagMatch(request, etag)) {
      return new NotModifiedResponse(etag)
    }

    const headers = new Headers({
      ...headersInit,
      ...createCacheControlHeader(cacheControlOptions),
    })

    if (etag) {
      headers.set('ETag', etag)
    }

    super(body, {
      status: Status.OK,
      headers,
    })
  }
}
