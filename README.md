# File Tools

> **All-in-One Online File Utility Suite**  
> Fast, free, and secure online file utilities. Convert, compress, edit, create, scan, and inspect your files right in your browser with zero server uploads.

- **Website Name:** File Tools
- **Logo:** [pxdrop.online/raw/db2q5e281qec73f6opbg](https://pxdrop.online/raw/db2q5e281qec73f6opbg)
- **Developer:** MRS Engineers BD
- **Developer Email:** [mrs.engineers.bd26@gmail.com](mailto:mrs.engineers.bd26@gmail.com)
- **Target GitHub Pages URL:** [https://mdrajidul99.github.io/file-tools/](https://mdrajidul99.github.io/file-tools/)
- **Repository Name:** `file-tools`

---

## 🚀 Key Features

- **100% Client-Side Privacy:** All conversions, compressions, edits, and hashing occur directly within the user's browser memory (HTML5 Canvas, WebAssembly, Web Crypto API). Files are **never** uploaded to remote cloud servers.
- **No Login / No Registration:** Entirely free to use with zero friction, zero sign-ups, and no credit card requirements.
- **Bilingual Interface:** Full support for both **English** and **Bangla (বাংলা)** with instant language toggle and persistent selection.
- **Dark Mode & Light Mode:** Seamless theme toggle respecting system preference and persisting via `localStorage`.
- **10 Core Tool Categories:**
  1. **Convert Tools:** Image to JPG/PNG/WebP/PDF, SVG to PNG, PDF to JPG/PNG, PDF to Text, CSV to JSON, JSON to CSV, Markdown to HTML, HTML to TXT.
  2. **Image Tools:** Resize, Crop, Rotate & Flip, Compress, Adjust Brightness & Contrast & Grayscale, Watermark, Image to Base64, Base64 to Image, Image Dimensions Inspector.
  3. **PDF Tools:** Merge PDFs, Split & Extract Pages, Rotate Pages, Delete Pages, Images to PDF, PDF Metadata & Page Count Inspector.
  4. **Document Tools:** Word & Character Counter, Reading Time Analyzer, Markdown Live Viewer, HTML Sandboxed Viewer, CSV Table Explorer with search, JSON Formatter & Minifier, XML Formatter & Validator.
  5. **Compress Tools:** Lossless & lossy image compressor with live size savings %, multiple-file ZIP archive creator, code/text minifier.
  6. **OCR Tools:** Image to Text OCR powered by browser-based Tesseract.js (English, Bengali, Spanish, French).
  7. **Edit Tools:** All-in-one Canvas Image Editor, Text Case Converter (UPPERCASE, lowercase, Title Case, Sentence case, slugify), duplicate line remover, line sorter.
  8. **Create Tools:** Create PDF documents, create plain text (.TXT), build interactive CSV spreadsheets, generate structured JSON files.
  9. **Data Tools:** Bidirectional JSON & CSV converter, Base64 encoder/decoder, URL encoder/decoder, Cryptographic Hash Generator (SHA-256, SHA-1, SHA-512, MD5), UUID v4 Generator.
  10. **File Info & Security:** File size and MIME type analyzer, cryptographic checksum calculator for file integrity verification.
- **Smart Tool Search & Favorites:** ⌘K quick search modal, favorite tools pinning, and recent tools history.
- **Adsterra Integration:** Non-intrusive responsive advertisement banners (728×90 on desktop, 320×50 on mobile) safely isolated via sandboxed iframes.

---

## 🛠 Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **PDF Engines:** `pdf-lib`, `jspdf`, `pdfjs-dist`
- **Compression:** `jszip`
- **OCR Engine:** `tesseract.js`
- **Cryptography:** Native Browser `window.crypto.subtle` + Client-Side MD5

---

## 💻 Local Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/mdrajidul99/file-tools.git
cd file-tools
npm install
npm run dev
```

Visit `http://localhost:3000/` in your browser.

---

## 🏗 Production Build

To build the project for production:

```bash
npm run build
```

This compiles the static assets into the `dist/` directory with the `/file-tools/` subpath configured for GitHub Pages.

To preview the production build locally:

```bash
npm run preview
```

---

## 🌐 GitHub Pages Deployment

The repository includes a ready-to-run GitHub Actions workflow located at `.github/workflows/deploy.yml`:

```
Push to "main"
  ↓
Checkout repository (actions/checkout@v4)
  ↓
Setup Node.js 20
  ↓
Install dependencies (npm ci)
  ↓
Vite Build (npm run build)
  ↓
Upload Pages Artifact (actions/upload-pages-artifact@v3 with path: ./dist)
  ↓
Deploy to GitHub Pages (actions/deploy-pages@v4)
```

### GitHub Repository Settings:
1. Go to repository **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push changes to the `main` branch. GitHub Actions will build and deploy the application automatically to `https://mdrajidul99.github.io/file-tools/`.

---

## 🔒 Security & Privacy Notice

- **No Remote Processing:** Files dropped into the interface remain in your device memory and are processed by local JavaScript routines.
- **Integrity Checksums:** Checksums (SHA-256, MD5) allow you to verify file tampering or transmission integrity.
- **Client Resource Limits:** Because heavy file processing occurs in memory, files larger than 100MB may experience browser memory constraints depending on client hardware.

---

## 📧 Support & Contact

- **Developer:** MRS Engineers BD
- **Email:** [mrs.engineers.bd26@gmail.com](mailto:mrs.engineers.bd26@gmail.com)
