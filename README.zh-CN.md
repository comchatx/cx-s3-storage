cx 把图片和其他文件存进你自己的存储桶，每个文件都有公开地址，可以填作 listing 的主图链接；也能列出、读取、复制和删除桶里的文件。Amazon S3、Cloudflare R2 等兼容 S3 的存储都能用。

你可以这样问：

- 把这几张图存进存储桶的 listings 文件夹，再告诉我每张的链接。
- 存储桶的 listings 文件夹里有哪些图片？
- 把 listings 里去年的旧图复制到 archive 文件夹，再删掉原图。

## 连接存储桶

在插件的「设置」里填写端点、存储桶、区域、Access key ID、Secret access key 和公开地址，各项的获取方法见服务商的指南。密钥只能访问一个存储桶时，cx 也只能用这一个。你的密钥保存在 ComChatX，不会交给 cx。

## 费用

ComChatX 不收费，服务商照常向你自己的账号收费。

## 需要

它会和 cx-sources 一起安装，cx 通过 cx-sources 使用所有数据源。
