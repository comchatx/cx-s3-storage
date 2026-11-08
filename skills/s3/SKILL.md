---
name: s3
description: The seller's own S3-compatible object storage (Amazon S3, Cloudflare R2, Backblaze B2, Wasabi or any provider that serves the S3 API) through the S3 REST API, signed with the seller's key — list, read, write, copy and delete objects, multipart uploads, and the public address of a stored object, such as an image's URL for a listing. Use before the first call that reads or changes the seller's own bucket. Needs cx-sources; if no cx-sources skill is listed, it is not installed, and the seller installs it in Plugins.
---

S3 is an open door through `cx raw`; read cx-sources first. The door sends any S3 request to the endpoint the seller saved, its method, path, query, headers and body as written, signs it with the seller's key, and lands the provider's reply as the provider gave it. It is what a local S3 client does, and the seller's key decides which buckets and objects a request reaches. The platform charges nothing; the provider bills the seller's own account. If S3 is off, the seller turns its plugin on in Plugins.

```sh
cx raw s3 --origin field:endpoint --method GET --path /<bucket> --query list-type=2 --query prefix=listings/
```

The provider's reference is the S3 API's: <https://docs.aws.amazon.com/AmazonS3/latest/API/API_Operations_Amazon_Simple_Storage_Service.html>.

## Requests

- Every request names `--origin field:endpoint`, the door's own name for the endpoint the seller saved; it is not an address, and the door sends only there. A request naming an address, or no origin, is refused. Each request in the table below takes it too.
- Paths are path-style: the bucket first, then the key, `/<bucket>/<key>`. The bucket the seller saved is theirs to use by default; another bucket on the same endpoint is reached when the key allows it.
- Each `--query` is one `name=value` pair, sent in order; an operation's word with no value is `name=`, as `uploads=`.
- The door writes `x-amz-date`, `x-amz-content-sha256` and `authorization`; a request naming either of the first two is refused. A `GET` or `HEAD` with a body, `TRACE`, `CONNECT` and `TRACK` are not sent.
- A key goes as written, percent-encoded: a space as `%20`, a folder marker with its trailing `/`. A segment `.` or `..` is refused.
- A request body is at most 10 MiB (10,485,760 bytes); a larger `--body` is refused before anything is sent, naming the bound, and a larger file goes in parts.

| Task | Request |
|---|---|
| List | `--method GET --path /<bucket> --query list-type=2 [--query prefix=<p>] [--query continuation-token=<t>]` |
| Read | `--method GET --path /<bucket>/<key> --output <file>`; `--header range=bytes=0-1023` reads part |
| Check | `--method HEAD --path /<bucket>/<key>` |
| Write | `--method PUT --path /<bucket>/<key> --header content-type=<type> --body <file>` |
| Copy | `--method PUT --path /<bucket>/<new key> --header x-amz-copy-source=/<bucket>/<key>` |
| Delete | `--method DELETE --path /<bucket>/<key>` |

A list answers XML; past 1,000 keys it carries `NextContinuationToken`, which the next list sends as `continuation-token`.

## Multipart

`POST /<bucket>/<key>?uploads=` answers an `UploadId`; `PUT ...?partNumber=<n>&uploadId=<id>` sends a part; `POST ...?uploadId=<id>` with the parts' XML completes it, and `DELETE ...?uploadId=<id>` abandons it. Each part is under the body bound, and S3 takes a part under 5 MiB only as the last. A part copied from an object already stored, `x-amz-copy-source` with `x-amz-copy-source-range` and no body, has no bound here.

## The public address

A `PUT` with no query into the saved bucket, a write or a copy, answers with `x-cx-public-url` beside the provider's headers: the seller's public base and the key, where the object is reachable once the provider serves that base publicly. Another party that fetches by URL, such as Amazon for a listing's main image in `main_product_image_locator`'s `media_location`, takes that address. The provider never sees the header.

## Replies

- A `2xx` lands as an answer; any other status is a failure with the provider's XML error as vendor text, and the reply kept.
- A `503` (`SlowDown`) or `429` is the provider throttling: the door adds no wait and retries nothing.
- A redirect is not followed: a `301` `PermanentRedirect` names a bucket in another region than the saved endpoint's.
- The box holds no key, so it signs nothing itself: no presigned URL is made here.
