# Screen Reader Documentation

## Project Overview

The **Screen Reader** project is designed to provide accessibility features for users by reading PDF files and analyze them.

## Features

- Scan and analizyng PDF invoices files

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/screen-reader.git
   ```
2. Navigate to the project directory:
   ```bash
   cd screen-reader
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Production commands

`npx prisma generate`
`NODE_OPTIONS="--max-old-space-size=4096" npm run build`

## GraphicsMagick & Ghostscript Requirement

This project uses [`pdf2pic`](https://www.npmjs.com/package/pdf2pic) to convert PDF pages into images, which requires both **GraphicsMagick** and **Ghostscript** to be installed on your system.

> ⚠️ Both are required: GraphicsMagick handles image conversion, while Ghostscript is used internally to render PDF files. If either is missing, conversion will fail.

### Install GraphicsMagick

#### macOS (using Homebrew)

```bash
brew install graphicsmagick
```

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install graphicsmagick
```

#### Windows

- Download and install from: [http://www.graphicsmagick.org/download.html](http://www.graphicsmagick.org/download.html)
- Make sure to add the `gm` binary to your `PATH`.

### Install Ghostscript

#### macOS (using Homebrew)

```bash
brew install ghostscript
```

#### Ubuntu/Debian

```bash
sudo apt install ghostscript
```

#### Windows

- Download and install from: [https://www.ghostscript.com/download/gsdnld.html](https://www.ghostscript.com/download/gsdnld.html)
- Make sure to check the option to **add to PATH** during installation.

### Verify Installation

You can verify that both dependencies are available by running:

```bash
gm -version
gs --version
```

If either is not found, you may see errors like:

```
execvp failed, errno = 2 (No such file or directory)
gm convert: Postscript delegate failed ...
```

## Usage

1. Start the application:
   ```bash
   npm start
   ```

## Configuration

To obtain a Mistral AI API key, follow these steps:

1. **Sign up** on the [Mistral AI website](https://auth.mistral.ai/ui/login?flow=973e1b25-b9b5-4668-98c5-9295b8ac9014).
2. Navigate to the **"API Keys"** section in the left sidebar and create a new API key.

## Short documentation for used API

### 1. File uploading

The following code demonstrates how to upload a file to the Mistral API for OCR (Optical Character Recognition) purposes. It uses the `@mistralai/mistralai` library to interact with the API and `fs` to read the file from the local filesystem.

```javascript
import { Mistral } from "@mistralai/mistralai";
import fs from "fs";

// Retrieve the API key from environment variables
const apiKey = process.env.MISTRAL_API_KEY;

// Initialize the Mistral client
const client = new Mistral({ apiKey: apiKey });

// Read the file to be uploaded
const uploadedFile = fs.readFileSync("uploaded_file.pdf");

// Upload the file to the Mistral API for OCR processing
const uploadedPdf = await client.files.upload({
	file: {
		fileName: "uploaded_file.pdf",
		content: uploadedFile,
	},
	purpose: "ocr",
});
```

### 2. Retrieve Uploaded File URL

The following snippet demonstrates how to obtain a signed URL for the uploaded file. This URL can be used to access the file securely.

```javascript
const signedUrl = await client.files.getSignedUrl({
	fileId: uploadedPdf.id,
});
```

This code retrieves a signed URL for the file using its unique `fileId`. Ensure the `fileId` corresponds to the uploaded file.

### 3. OCR Processing Example

The following example demonstrates how to perform OCR (Optical Character Recognition) on a document using the Mistral API. This snippet utilizes the `@mistralai/mistralai` library to process a document via its signed URL.

```javascript
import { Mistral } from "@mistralai/mistralai";

// Retrieve the API key from environment variables
const apiKey = process.env.MISTRAL_API_KEY;

// Initialize the Mistral client
const client = new Mistral({ apiKey: apiKey });

// Perform OCR on the document using its signed URL
const ocrResponse = await client.ocr.process({
	model: "mistral-ocr-latest",
	document: {
		type: "document_url",
		documentUrl: signedUrl.url,
	},
});
```

This code processes the document using the latest OCR model. Ensure the `documentUrl` is a valid signed URL obtained from the file upload step.

**All this code assumes you have already set up your Mistral API key as an environment variable (`MISTRAL_API_KEY`) and installed the required dependencies.**

## Models pricing which were used

| Name                | API Name             | Description                                                             | Input (/M tokens) | Output (/M tokens) |
| ------------------- | -------------------- | ----------------------------------------------------------------------- | ----------------- | ------------------ |
| Mistral Large 24.11 | mistral-large-latest | Top-tier reasoning for high-complexity tasks and sophisticated problems | $2                | $6                 |
| Mistral OCR         | mistral-ocr-latest   | Introducing the world's best document understanding API                 | 1000 Pages / $1   | -                  |

# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
