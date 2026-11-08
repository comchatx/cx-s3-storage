# cx-s3-storage

This plugin connects cx to your own S3-compatible storage, such as Amazon S3, Cloudflare R2, Backblaze B2 or Wasabi. Once you connect a bucket, cx can list, read, write, copy and delete its files, and upload large ones in parts. A file cx stores in this bucket gets a public address, for use wherever a link to the file is needed, such as a listing's main image on Amazon.

## Connecting your bucket

Open the plugin's Settings and enter the endpoint, bucket, region, access key ID, secret access key and public address. Your provider's guide shows where to find each one. A key limited to one bucket keeps cx to that bucket. ComChatX holds your key and never gives it to cx.

## What it costs

Nothing on ComChatX. Your provider bills your own account as usual.

## What it needs

It installs with cx-sources, through which cx reaches every data source.
