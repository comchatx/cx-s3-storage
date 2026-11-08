# S3

This plugin connects cx to your own S3-compatible storage: Amazon S3, Cloudflare R2, Backblaze B2, Wasabi, or any provider that serves the S3 API. Once you connect a bucket, cx can work with it as an S3 client on your own computer would: list, read, write, copy and delete files, and upload large ones in parts. A file it stores in your bucket gets a public address, which cx can hand to a service that fetches by URL, such as Amazon for a listing's main image.

## Connecting your storage

Open the plugin's Settings and enter your provider's endpoint, your bucket and its region, an access key and its secret, and the public address your bucket's files are served at. Your provider's guide shows where to find each one. A key limited to one bucket keeps cx to that bucket. Your key stays on the ComChatX platform and is never given to cx.

## What it costs

Nothing on ComChatX. Your provider bills your own account for storage and requests, as it does for any client.

## What it needs

It installs with cx-sources, through which cx reaches every data source.
