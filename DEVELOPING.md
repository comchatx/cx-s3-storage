# Developing cx-s3-storage

A [pi](https://pi.dev) package that lets cx reach the seller's own S3-compatible storage from a [ComChatX](https://comchatx.com) box. Install it in your own pi with `pi install npm:@comchatx/cx-s3-storage`.

## How it is built

- **One skill, `skills/s3/SKILL.md`, and no extension.** It tells cx how to send S3 REST requests through cx-sources' open door, `cx raw s3-storage --origin field:endpoint …`: path-style addresses, the request body bound, multipart uploads, the replies, and the `x-cx-public-url` header that a write into the saved bucket answers with.
- **It holds no key.** The box holds none either: the door signs each request with the key the seller saved in the plugin's Settings, outside the box.
- **`dependencies` names `cx-sources`**, which installs with it and gives cx the `cx raw` door.
- **The `comchatx` field** carries the card's Chinese line (`about`), the skill's Chinese line (`skills.s3.zh`), and the data source, `source`: its name, `s3-storage`, a help link, and the label and help of each of the six fields the Settings form asks for (`endpoint`, `bucket`, `region`, `key_id`, `secret_key`, `public_base`), in both languages.

## Tests

`npm run typecheck` and `npm test`. `test/package.test.ts`:

- the pinned pi lists the skills the `comchatx` field names, with no diagnostic and no template;
- the package ships its skills, its READMEs and its licence, and nothing else;
- each of the six fields has a label in both languages, and a help line in both where it has one;
- the card's line, the `about` and the settings labels are the signed words, and the READMEs have no title.

## Release

`.github/workflows/release.yml` publishes each version on a `v<version>` tag on `main`, by npm trusted publishing with provenance, once this repository is the package's trusted publisher on npm. The first release is a maintainer's, at a terminal with npm 11.15 or later:

1. `npm login`, then `npm ci` and `npm publish --access public` from a checkout of `main`. npm asks for two-factor approval before the version lands.
2. `npm access grant read-write comchatx:developers @comchatx/cx-s3-storage`.
3. `npm trust github @comchatx/cx-s3-storage --file release.yml --repo comchatx/cx-s3-storage --allow-publish`, then `npm trust list @comchatx/cx-s3-storage` to read it back.

After that, bump the version and push the tag `v<version>` on `main`.
