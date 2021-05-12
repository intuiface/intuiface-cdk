# Intuiface CDK

## ⚙️ Quickstart

Install dependencies:

```bash
npm ci
```

To build the CDK, just run:

```bash
npm run build
```

Before to use CDK in another project, in "./dist/libs/components/package.json" file,
replace:
```bash
"@intuiface/core": "0.0.1",
```
by (with your Intuiface CDK absolute path)
```bash
"@intuiface/core": "file:path_to_intuiface_cdk/dist/libs/core",
```