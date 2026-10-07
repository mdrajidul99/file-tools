export const translations = {
  en: {
    siteName: 'File Tools',
    tagline: 'All Your Essential File Tools in One Place',
    subtagline:
      'Fast, free, and secure online utilities. Convert, compress, edit, create, scan, and inspect your files right in your browser with zero server uploads.',
    developerCredit: 'Developed by MRS Engineers BD',
    developerEmail: 'mrs.engineers.bd26@gmail.com',

    // Navigation
    nav: {
      home: 'Home',
      allTools: 'All Tools',
      categories: 'Categories',
      howToUse: 'How to Use',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Use',
      searchPlaceholder: 'Search any tool (e.g., PDF to JPG, Compress Image, OCR, JSON)...',
      favorites: 'Favorites',
      recent: 'Recent Tools',
      clearRecent: 'Clear History',
      noFavorites: 'No favorite tools saved yet. Click the star icon on any tool to save it here.',
      noRecent: 'No recently used tools yet.',
    },

    // Badges & Common
    common: {
      freeBadge: '100% Free • No Sign-up',
      localProcessingBadge: 'Client-Side • Privacy First',
      browseFiles: 'Browse Files',
      dropzoneTitle: 'Drag & drop your files here',
      dropzoneSubtitle: 'or click to browse from your device',
      dropzoneMobile: 'Tap to select files',
      dropzoneNotice: 'Files are processed locally in your browser memory and never uploaded to any server.',
      selectedFiles: 'Selected Files',
      remove: 'Remove',
      clearAll: 'Clear All',
      options: 'Options',
      result: 'Result',
      download: 'Download',
      downloadAll: 'Download All',
      downloadTxt: 'Download .TXT',
      downloadZip: 'Download .ZIP',
      tryAnother: 'Process Another File',
      copyToClipboard: 'Copy to Clipboard',
      copied: 'Copied!',
      processing: 'Processing...',
      converting: 'Converting...',
      compressing: 'Compressing...',
      extracting: 'Extracting text...',
      generating: 'Generating...',
      completed: 'Complete!',
      errorOccurred: 'An error occurred during processing.',
      noToolsFound: 'No tools found matching your search.',
      viewAll: 'View All',
      viewTools: 'Explore Tools',
      category: 'Category',
      backToTools: 'Back to Tools',
      backToHome: 'Back to Home',
      saveFavorite: 'Add to favorites',
      removeFavorite: 'Remove from favorites',
      size: 'Size',
      originalSize: 'Original Size',
      newSize: 'New Size',
      saved: 'Saved',
      compressionRatio: 'Compression Ratio',
      dimensions: 'Dimensions',
      format: 'Format',
      quality: 'Quality',
      preview: 'Preview',
      advertisement: 'Advertisement',
    },

    // Hero Section
    hero: {
      badge: 'Private & Browser-Powered File Suite',
      titleHighlight: 'Essential File Tools',
      titleEnd: 'Right in Your Browser',
      searchPrompt: 'What do you want to do today?',
      features: [
        'Zero file uploads (100% local privacy)',
        'No registration or payment required',
        'High-quality outputs preserved',
        'Works offline once loaded',
      ],
      quickFilters: {
        all: 'All',
        pdf: 'PDF',
        image: 'Images',
        compress: 'Compress',
        convert: 'Convert',
        ocr: 'OCR',
      },
    },

    // Categories
    categories: {
      convert: {
        name: 'Convert Tools',
        desc: 'Convert images, PDFs, SVGs, documents, CSV, JSON, and web files seamlessly.',
      },
      image: {
        name: 'Image Tools',
        desc: 'Resize, crop, rotate, flip, compress, adjust filters, watermark, and inspect images.',
      },
      pdf: {
        name: 'PDF Tools',
        desc: 'Merge, split, rotate, delete pages, reorder, convert to images, and extract text.',
      },
      document: {
        name: 'Document Tools',
        desc: 'Word counter, line counter, Markdown viewer, HTML to text, JSON and XML formatters.',
      },
      compress: {
        name: 'Compress Tools',
        desc: 'Reduce file sizes of images, bundle multiple files into ZIP archives with high efficiency.',
      },
      ocr: {
        name: 'OCR Tools',
        desc: 'Extract editable text from JPG, PNG, and WebP images using browser-based OCR.',
      },
      edit: {
        name: 'Edit Tools',
        desc: 'Interactive image editor, text case changer, line organizer, and PDF page editor.',
      },
      create: {
        name: 'Create Tools',
        desc: 'Generate custom PDF documents, plain text files, CSV spreadsheets, and ZIP archives.',
      },
      data: {
        name: 'Data Tools',
        desc: 'Format JSON, convert JSON to CSV and CSV to JSON, Base64 encode/decode, URL decode, and UUIDs.',
      },
      security: {
        name: 'File Info & Security',
        desc: 'Inspect file MIME types, calculate cryptographic hashes (SHA-256, SHA-1, MD5), and examine metadata.',
      },
    },

    // Information Pages
    howToUse: {
      title: 'How to Use File Tools',
      subtitle: 'A straightforward guide to getting the most out of our free browser-based file utility suite.',
      steps: [
        {
          num: '1',
          title: 'Choose Your Desired Tool',
          desc: 'Select from our 10 categories or use the search bar at the top to find the exact file utility you need.',
        },
        {
          num: '2',
          title: 'Import Your Files',
          desc: 'Drag and drop your file into the designated upload area or tap to select from your device storage. Your files never leave your device.',
        },
        {
          num: '3',
          title: 'Customize Processing Options',
          desc: 'Tweak resolution, quality, page orientation, watermark text, or conversion parameters to fit your requirements.',
        },
        {
          num: '4',
          title: 'Process & Download',
          desc: 'Click the action button, preview the high-definition result in seconds, and click Download to save it immediately.',
        },
      ],
      privacyNoteTitle: 'Why Browser-Side Processing Matters',
      privacyNoteDesc:
        'Unlike traditional file converters that upload your confidential documents, contracts, and personal photos to remote cloud servers, File Tools executes modern WebAssembly, Canvas, and Web Crypto APIs directly inside your web browser. This means your data is never transferred over the wire, never stored on a server, and cannot be intercepted.',
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          q: 'Are there any hidden costs or subscription fees?',
          a: 'No. File Tools is completely free to use. There are no subscriptions, paywalls, or credit card requirements.',
        },
        {
          q: 'Do I need to create an account or log in?',
          a: 'No registration or login is required. You can use every tool right away.',
        },
        {
          q: 'What is the maximum file size supported?',
          a: 'Because processing happens entirely within your device’s memory, we recommend files under 100MB for optimal browser speed and responsiveness.',
        },
        {
          q: 'Does it work on mobile phones and tablets?',
          a: 'Yes! File Tools is fully responsive and optimized for touch interactions on smartphones, tablets, laptops, and desktop computers.',
        },
      ],
    },

    about: {
      title: 'About File Tools',
      subtitle: 'Built with pride by MRS Engineers BD to provide fast, secure, and accessible file utilities for everyone worldwide.',
      storyTitle: 'Our Mission',
      storyDesc:
        'File Tools was engineered to solve a common modern problem: everyday users needing to perform simple file operations—like converting a photo, merging two PDFs, formatting JSON data, or compressing an image—without having to upload sensitive files to unknown external servers or pay expensive subscription fees.',
      developerTitle: 'Developer Details',
      devCompany: 'MRS Engineers BD',
      devEmail: 'mrs.engineers.bd26@gmail.com',
      guidingPrinciples: [
        {
          title: 'Privacy by Architecture',
          desc: 'We prioritize client-side execution so your personal files never leave your computer or phone.',
        },
        {
          title: 'Zero Friction',
          desc: 'No account setup, no email verifications, no waitlists, and no premium restrictions.',
        },
        {
          title: 'Uncompromised Quality',
          desc: 'We preserve original resolutions, crisp typography, and high compression efficiency.',
        },
      ],
    },

    privacy: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: October 2026',
      intro:
        'At File Tools, developed by MRS Engineers BD, user privacy is our foremost priority. This Privacy Policy outlines how your data is handled when you use our website.',
      sections: [
        {
          title: '1. No Server File Uploads',
          content:
            'File Tools is built on a client-side architecture. When you select, convert, compress, edit, or analyze files, all processing occurs directly in your web browser memory using JavaScript, HTML5 Canvas, and Web APIs. Your files are not transmitted to or stored on our servers.',
        },
        {
          title: '2. No Registration or Account Data',
          content:
            'We do not offer user accounts or registration. We do not collect names, telephone numbers, passwords, or personal credentials.',
        },
        {
          title: '3. Local Storage',
          content:
            'We use browser localStorage exclusively to persist your interface preferences, such as Dark Mode / Light Mode, selected language (English or Bangla), and your list of favorite or recently accessed tools. No uploaded file contents are ever stored in localStorage.',
        },
        {
          title: '4. Third-Party Advertising (Adsterra)',
          content:
            'To keep File Tools 100% free for everyone, we display advertisements provided by our advertising partner, Adsterra. Adsterra and its partners may use cookies or web beacons to display relevant ads. These advertisements operate independently, and our tool processing remains isolated from advertising scripts.',
        },
        {
          title: '5. External Links',
          content:
            'Our website may contain links to external sites. We are not responsible for the privacy practices or content of third-party websites.',
        },
        {
          title: '6. Contact Information',
          content:
            'If you have questions or concerns regarding our privacy practices, you may reach our engineering team directly at mrs.engineers.bd26@gmail.com.',
        },
      ],
    },

    terms: {
      title: 'Terms of Use',
      lastUpdated: 'Last Updated: October 2026',
      intro:
        'Please read these Terms of Use carefully before using the File Tools web application provided by MRS Engineers BD.',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content:
            'By accessing or using File Tools, you agree to comply with and be bound by these Terms. If you do not agree, please do not use the service.',
        },
        {
          title: '2. Free and Lawful Use',
          content:
            'File Tools is provided free of charge for personal and professional use. You agree not to use the tools to process unlawful, defamatory, infringing, or malicious content.',
        },
        {
          title: '3. File Ownership and Responsibility',
          content:
            'You retain all rights, ownership, and intellectual property over any files you process using our platform. You are solely responsible for ensuring you have the legal right to process and convert your uploaded files.',
        },
        {
          title: '4. Browser Compatibility and Performance',
          content:
            'Because tools run locally in your web browser, performance depends on your device hardware, operating system, and browser capabilities. Certain heavy operations may be restricted by available browser memory.',
        },
        {
          title: '5. Disclaimer of Warranties',
          content:
            'File Tools is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted availability or error-free operation.',
        },
        {
          title: '6. Limitation of Liability',
          content:
            'To the maximum extent permitted by applicable law, MRS Engineers BD shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.',
        },
      ],
    },

    contact: {
      title: 'Contact Us',
      subtitle: 'Have a suggestion, bug report, or inquiry? We would love to hear from you.',
      developerLabel: 'Developer Team',
      developerVal: 'MRS Engineers BD',
      emailLabel: 'Official Email',
      emailVal: 'mrs.engineers.bd26@gmail.com',
      note: 'To send a message, click the email address above to open your default email app, or use the quick feedback template below.',
      form: {
        name: 'Your Name',
        email: 'Your Email Address',
        subject: 'Subject',
        message: 'Your Message / Feedback',
        send: 'Compose Email',
      },
    },

    footer: {
      tagline: 'The modern, browser-native file utility platform.',
      quickLinks: 'Quick Links',
      categories: 'Categories',
      legal: 'Legal & Privacy',
      copyright: '© 2026 File Tools. All rights reserved.',
      contactText: 'Direct Contact:',
    },
  },

  bn: {
    siteName: 'ফাইল টুলস (File Tools)',
    tagline: 'আপনার প্রয়োজনীয় সব ফাইল টুলস এক জায়গায়',
    subtagline:
      'দ্রুত, সম্পূর্ণ ফ্রি ও নিরাপদ অনলাইন ফাইল ইউটিলিটি। সার্ভারে আপলোড ছাড়াই আপনার ব্রাউজারে সরাসরি কনভার্ট, কম্প্রেস, এডিট, তৈরি ও ফাইল বিশ্লেষণ করুন।',
    developerCredit: 'নির্মাতা: MRS Engineers BD',
    developerEmail: 'mrs.engineers.bd26@gmail.com',

    // Navigation
    nav: {
      home: 'হোম',
      allTools: 'সব টুলস',
      categories: 'ক্যাটাগরি',
      howToUse: 'ব্যবহার বিধি',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      privacy: 'প্রাইভেসি পলিসি',
      terms: 'ব্যবহারের শর্তাবলী',
      searchPlaceholder: 'টুল খুঁজুন (যেমন: PDF to JPG, Compress, OCR, JSON)...',
      favorites: 'পছন্দের টুলস',
      recent: 'সম্প্রতি ব্যবহৃত',
      clearRecent: 'হিস্ট্রি মুছুন',
      noFavorites: 'এখনও কোনো টুল পছন্দ তালিকায় যুক্ত করেননি। স্টার আইকনে ক্লিক করে সংরক্ষণ করুন।',
      noRecent: 'সম্প্রতি কোনো টুল ব্যবহার করা হয়নি।',
    },

    // Badges & Common
    common: {
      freeBadge: '১০০% ফ্রি • সাইন-আপ নেই',
      localProcessingBadge: 'ব্রাউজারে প্রসেসিং • সর্বোচ্চ নিরাপত্তা',
      browseFiles: 'ফাইল নির্বাচন করুন',
      dropzoneTitle: 'এখানে ফাইল টেনে এনে ছেড়ে দিন (Drag & Drop)',
      dropzoneSubtitle: 'অথবা আপনার ডিভাইস থেকে ফাইল সিলেক্ট করতে ক্লিক করুন',
      dropzoneMobile: 'ফাইল সিলেক্ট করতে এখানে চাপুন',
      dropzoneNotice: 'ফাইলসমূহ আপনার ব্রাউজার মেমোরিতে নিরাপদে প্রসেস হয় এবং কোনো সার্ভারে আপলোড হয় না।',
      selectedFiles: 'নির্বাচিত ফাইল',
      remove: 'মুছুন',
      clearAll: 'সব পরিষ্কার করুন',
      options: 'বিকল্পসমূহ',
      result: 'ফলাফল',
      download: 'ডাউনলোড করুন',
      downloadAll: 'সব ডাউনলোড করুন',
      downloadTxt: '.TXT ডাউনলোড করুন',
      downloadZip: '.ZIP ডাউনলোড করুন',
      tryAnother: 'নতুন ফাইল প্রসেস করুন',
      copyToClipboard: 'কপিতে চাপুন',
      copied: 'কপি হয়েছে!',
      processing: 'প্রসেসিং হচ্ছে...',
      converting: 'কনভার্ট হচ্ছে...',
      compressing: 'কম্প্রেস হচ্ছে...',
      extracting: 'টেক্সট বের করা হচ্ছে...',
      generating: 'তৈরি হচ্ছে...',
      completed: 'সম্পন্ন হয়েছে!',
      errorOccurred: 'ফাইল প্রসেসিং করার সময় সমস্যা হয়েছে।',
      noToolsFound: 'আপনার খোঁজার সাথে মেলে এমন কোনো টুল পাওয়া যায়নি।',
      viewAll: 'সব দেখুন',
      viewTools: 'টুলস দেখুন',
      category: 'ক্যাটাগরি',
      backToTools: 'টুলস তালিকায় ফিরুন',
      backToHome: 'হোমে ফিরুন',
      saveFavorite: 'পছন্দের তালিকায় রাখুন',
      removeFavorite: 'পছন্দের তালিকা থেকে সরান',
      size: 'আকার',
      originalSize: 'আসল সাইজ',
      newSize: 'নতুন সাইজ',
      saved: 'কমেছে',
      compressionRatio: 'কম্প্রেশন হার',
      dimensions: 'মাত্রা (রেজোলিউশন)',
      format: 'ফরম্যাট',
      quality: 'কোয়ালিটি',
      preview: 'প্রিভিউ',
      advertisement: 'বিজ্ঞাপন',
    },

    // Hero Section
    hero: {
      badge: 'ব্রাউজার-ভিত্তিক সম্পূর্ণ ব্যক্তিগত ফাইল প্ল্যাটফর্ম',
      titleHighlight: 'প্রয়োজনীয় সব ফাইল টুলস',
      titleEnd: 'সরাসরি আপনার ব্রাউজারে',
      searchPrompt: 'আজ আপনি কোন কাজটি করতে চান?',
      features: [
        'সার্ভারে ফাইল আপলোড ছাড়াই প্রসেসিং (১০০% প্রাইভেসি)',
        'কোনো রেজিস্ট্রেশন বা পেমেন্টের প্রয়োজন নেই',
        'ফাইলের গুণমান সম্পূর্ণ নিখুঁত থাকে',
        'একবার লোড হলে অফলাইনেও কাজ করতে সক্ষম',
      ],
      quickFilters: {
        all: 'সব',
        pdf: 'পিডিএফ',
        image: 'ছবি',
        compress: 'কম্প্রেস',
        convert: 'কনভার্ট',
        ocr: 'ওসিআর (OCR)',
      },
    },

    // Categories
    categories: {
      convert: {
        name: 'কনভার্ট টুলস (Convert)',
        desc: 'ছবি, পিডিএফ, এসভিজি, ডকুমেন্টস, সিএসভি ও জেএসন ফাইল ফরম্যাট রূপান্তর করুন।',
      },
      image: {
        name: 'ইমেজ টুলস (Image)',
        desc: 'ছবির সাইজ পরিবর্তন, ক্রপ, রোটেট, ফ্লিপ, ওয়াটারমার্ক এবং ইমেজ ফিল্টার সামঞ্জস্য করুন।',
      },
      pdf: {
        name: 'পিডিএফ টুলস (PDF)',
        desc: 'পিডিএফ যুক্ত (Merge), পেজ আলাদা (Split), রোটেট, অপ্রয়োজনীয় পেজ বাদ এবং টেক্সট বের করুন।',
      },
      document: {
        name: 'ডকুমেন্ট টুলস (Document)',
        desc: 'শব্দ ও অক্ষর গণনা, মার্কডাউন প্রিভিউ, এইচটিএমএল রূপান্তর, জেএসন এবং এক্সএমএল ফরম্যাটার।',
      },
      compress: {
        name: 'কম্প্রেস টুলস (Compress)',
        desc: 'ছবির সাইজ কমান এবং একাধিক ফাইল একসাথে জিপ (ZIP) আর্কাইভ আকারে প্যাক করুন।',
      },
      ocr: {
        name: 'ওসিআর টুলস (OCR)',
        desc: 'ছবি থেকে সরাসরি বাংলা ও ইংরেজি টেক্সট বের করুন আধুনিক ব্রাউজার ওসিআর প্রযুক্তির মাধ্যমে।',
      },
      edit: {
        name: 'এডিট টুলস (Edit)',
        desc: 'ইন্টারেক্টিভ ছবি এডিটর, টেক্সট কেস পরিবর্তন, ডুপ্লিকেট লাইন রিমুভার ও পিডিএফ পেজ এডিটর।',
      },
      create: {
        name: 'ক্রিয়েট টুলস (Create)',
        desc: 'নতুন পিডিএফ ডকুমেন্ট, টেক্সট ফাইল, সিএসভি স্প্রেডশিট এবং জিপ আর্কাইভ তৈরি করুন।',
      },
      data: {
        name: 'ডাটা টুলস (Data)',
        desc: 'জেএসন ও সিএসভি রূপান্তর, Base64 এনকোডার/ডিকোডার, ইউআরএল এনকোডার এবং ইউইউআইডি জেনারেটর।',
      },
      security: {
        name: 'ফাইল ইনফো ও সিকিউরিটি',
        desc: 'ফাইলের সুনির্দিষ্ট মেটাডাটা ও সাইজ চেক করুন এবং ক্রিপ্টোগ্রাফিক হ্যাশ (SHA-256, SHA-1, MD5) বের করুন।',
      },
    },

    // Information Pages
    howToUse: {
      title: 'ফাইল টুলস কিভাবে ব্যবহার করবেন',
      subtitle: 'আমাদের ব্রাউজার-ভিত্তিক ফ্রি ফাইল টুলস সহজেই ব্যবহারের সহজ নির্দেশিকা।',
      steps: [
        {
          num: '১',
          title: 'প্রয়োজনীয় টুল নির্বাচন করুন',
          desc: '১০টি ক্যাটাগরি থেকে আপনার কাঙ্ক্ষিত টুলটি নির্বাচন করুন অথবা সার্চ বারে লিখে খুঁজুন।',
        },
        {
          num: '২',
          title: 'ফাইল আপলোড / ড্রপ করুন',
          desc: 'ফাইলটি টেনে এনে ড্রপজোনে ছাড়ুন অথবা ডিভাইস থেকে সিলেক্ট করুন। ফাইল আপনার ডিভাইসেই থাকে।',
        },
        {
          num: '৩',
          title: 'অপশন ও সেটিংস ঠিক করুন',
          desc: 'প্রয়োজনে ছবির সাইজ, কোয়ালিটি, ওয়াটারমার্ক বা পিডিএফ সেটিংস নিজের মতো পরিবর্তন করুন।',
        },
        {
          num: '৪',
          title: 'প্রসেস ও ডাউনলোড করুন',
          desc: 'অ্যাকশন বাটনে চাপুন, ফলাফল প্রিভিউ দেখুন এবং সাথে সাথে ডাউনলোড বাটনে ক্লিক করে সেভ করুন।',
        },
      ],
      privacyNoteTitle: 'ব্রাউজার-সাইড প্রসেসিং কেন বেশি নিরাপদ?',
      privacyNoteDesc:
        'সাধারণ ওয়েবসাইটগুলো ফাইল তাদের সার্ভারে আপলোড করে প্রসেস করে, যা ব্যক্তিগত গোপনীয়তার জন্য ঝুঁকিপূর্ণ। কিন্তু ফাইল টুলস আধুনিক ওয়েবঅ্যাসেম্বলি ও ক্যানভাস প্রযুক্তির মাধ্যমে সম্পূর্ণ কাজ আপনার ব্রাউজারের ভেতর সম্পন্ন করে। ফলে কোনো ডেটা ইন্টারনেটে পাঠানো হয় না।',
      faqTitle: 'সাধারণ জিজ্ঞাসা (FAQ)',
      faqs: [
        {
          q: 'এই টুলগুলো কি সম্পূর্ণ ফ্রি?',
          a: 'হ্যাঁ, ফাইল টুলসের প্রতিটি টুল সবার জন্য ১০০% ফ্রি। কোনো হিডেন চার্জ বা সাবস্ক্রিপশন নেই।',
        },
        {
          q: 'আমাকে কি অ্যাকাউন্ট খুলতে হবে?',
          a: 'না, কোনো সাইন-আপ বা লগইন ছাড়াই আপনি সব টুল সাথে সাথে ব্যবহার করতে পারবেন।',
        },
        {
          q: 'সর্বোচ্চ কত সাইজের ফাইল দেওয়া যাবে?',
          a: 'যেহেতু প্রসেসিং আপনার ব্রাউজারের র‍্যামে হয়, মসৃণ অভিজ্ঞতার জন্য ১০০ মেগাবাইট পর্যন্ত ফাইল ব্যবহারের পরামর্শ দেওয়া হয়।',
        },
        {
          q: 'মোবাইল ফোনে কি এটা কাজ করবে?',
          a: 'অবশ্যই! আমাদের ডিজাইনটি অ্যান্ড্রয়েড ও আইফোনসহ সকল মোবাইলে ব্যবহারের জন্য পুরোপুরি উপযোগী।',
        },
      ],
    },

    about: {
      title: 'ফাইল টুলস সম্পর্কে',
      subtitle: 'MRS Engineers BD কর্তৃক নির্মিত একটি দ্রুত, নিরাপদ ও সহজে ব্যবহারযোগ্য ফাইল ইউটিলিটি প্ল্যাটফর্ম।',
      storyTitle: 'আমাদের লক্ষ্য',
      storyDesc:
        'দৈনন্দিন জীবনে আমাদের প্রায়ই ছবির সাইজ কমাতে, পিডিএফ পেজ আলাদা করতে, অথবা ফাইল ফরম্যাট রূপান্তর করতে হয়। ব্যবহারকারীদের গোপনীয়তা রক্ষা করে কোনো ঝামেলা ছাড়া দ্রুত ফাইল প্রসেস করাই ফাইল টুলসের প্রধান লক্ষ্য।',
      developerTitle: 'নির্মাতার বিবরণ',
      devCompany: 'MRS Engineers BD',
      devEmail: 'mrs.engineers.bd26@gmail.com',
      guidingPrinciples: [
        {
          title: 'প্রাইভেসি সবার আগে',
          desc: 'ফাইল আপনার ব্রাউজার ছেড়ে কখনো কোনো দূরবর্তী সার্ভারে যায় না।',
        },
        {
          title: 'কোনো জটিলতা নেই',
          desc: 'কোনো লগইন বা সাবস্ক্রিপশন ছাড়াই দ্রুত ফাইল প্রসেসিং।',
        },
        {
          title: 'ফাইলের সেরা গুণমান',
          desc: 'ছবির রেজোলিউশন ও টেক্সটের স্পষ্টতা বজায় রেখে হাই-কোয়ালিটি আউটপুট।',
        },
      ],
    },

    privacy: {
      title: 'প্রাইভেসি পলিসি (গোপনীয়তা নীতি)',
      lastUpdated: 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬',
      intro:
        'MRS Engineers BD কর্তৃক পরিচালিত ফাইল টুলসে আপনার ব্যক্তিগত তথ্যের নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। নিচে আমাদের গোপনীয়তা নীতি তুলে ধরা হলো।',
      sections: [
        {
          title: '১. সার্ভারে কোনো ফাইল আপলোড হয় না',
          content:
            'ফাইল টুলস সম্পূর্ণ ক্লায়েন্ট-সাইড প্রযুক্তিতে কাজ করে। আপনি যে ফাইলই কনভার্ট বা এডিট করেন না কেন, তা সরাসরি আপনার ব্রাউজার মেমোরিতে প্রসেস হয়। আমরা কোনো সার্ভারে ফাইল সংরক্ষণ করি না।',
        },
        {
          title: '২. কোনো রেজিস্ট্রেশন বা ব্যক্তিগত তথ্য নেওয়া হয় না',
          content:
            'আমাদের প্ল্যাটফর্মে কোনো অ্যাকাউন্ট সিস্টেম নেই। আমরা ব্যবহারকারীর নাম, ফোন নম্বর বা পাসওয়ার্ড সংগ্রহ করি না।',
        },
        {
          title: '৩. লোকাল স্টোরেজের ব্যবহার',
          content:
            'শুধুমাত্র আপনার ডার্ক মোড / লাইট মোড পছন্দ, ভাষা (ইংরেজি / বাংলা) এবং পছন্দের টুলসের তালিকা মনে রাখার জন্য ব্রাউজারের লোকাল স্টোরেজ ব্যবহার করা হয়।',
        },
        {
          title: '৪. তৃতীয় পক্ষের বিজ্ঞাপন (Adsterra)',
          content:
            'সাইটের ফ্রি সেবা চালু রাখতে আমরা Adsterra এর বিজ্ঞাপন প্রদর্শন করে থাকি। বিজ্ঞাপনী নেটওয়ার্ক প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনের জন্য কুকিজ ব্যবহার করতে পারে, যা ফাইল প্রসেসিং থেকে সম্পূর্ণ আলাদা।',
        },
        {
          title: '৫. যোগাযোগ',
          content:
            'যেকোনো গোপনীয়তা সংক্রান্ত প্রশ্নে সরাসরি mrs.engineers.bd26@gmail.com ঠিকানায় ইমেইল করতে পারেন।',
        },
      ],
    },

    terms: {
      title: 'ব্যবহারের শর্তাবলী (Terms of Use)',
      lastUpdated: 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬',
      intro:
        'ফাইল টুলস প্ল্যাটফর্মটি ব্যবহারের পূর্বে অনুগ্রহ করে শর্তাবলী সতর্কতার সাথে পড়ে নিন।',
      sections: [
        {
          title: '১. শর্তাবলীর গ্রহণযোগ্যতা',
          content:
            'আমাদের সাইট ব্যবহারের মাধ্যমে আপনি এই সকল শর্ত মেনে নিচ্ছেন বলে গণ্য হবে। শর্তে অসম্মতি থাকলে সাইট ব্যবহার থেকে বিরত থাকুন।',
        },
        {
          title: '২. বৈধ ব্যবহার',
          content:
            'ফাইল টুলস ব্যক্তিগত ও পেশাগত কাজের জন্য ফ্রি। তবে কোনো বেআইনি বা ক্ষতিকর উপাদান প্রসেস করার জন্য এটি ব্যবহার করা যাবে না।',
        },
        {
          title: '৩. ফাইলের মালিকানা ও দায়িত্ব',
          content:
            'আপনার আপলোডকৃত সকল ফাইলের পূর্ণ স্বত্বাধিকার আপনার নিজের। ফাইলের কপিরাইট ও বৈধতার দায়ভার ব্যবহারকারীর।',
        },
        {
          title: '৪. ব্রাউজার সামঞ্জস্যতা ও সীমাবদ্ধতা',
          content:
            'টুলগুলো ব্রাউজারে চালিত হওয়ায় ডিভাইসের র‍্যাম ও ব্রাউজার সংস্করণের ওপর এর পারফরম্যান্স নির্ভর করে।',
        },
        {
          title: '৫. দায়বদ্ধতার সীমাবদ্ধতা',
          content:
            'টুল ব্যবহারের ফলে কোনো তথ্য বিভ্রাট বা অনাকাঙ্ক্ষিত ক্ষতির জন্য MRS Engineers BD কোনো আর্থিক দায় বহন করবে না।',
        },
      ],
    },

    contact: {
      title: 'আমাদের সাথে যোগাযোগ করুন',
      subtitle: 'যেকোনো মতামত, পরামর্শ বা সমস্যার কথা আমাদের সরাসরি জানান।',
      developerLabel: 'নির্মাতা দল',
      developerVal: 'MRS Engineers BD',
      emailLabel: 'অফিসিয়াল ইমেইল',
      emailVal: 'mrs.engineers.bd26@gmail.com',
      note: 'ইমেইল পাঠাতে উপরের ঠিকানায় ক্লিক করুন অথবা নিচের ফর্মটি ব্যবহার করে সরাসরি আপনার ইমেইল অ্যাপ ওপেন করুন।',
      form: {
        name: 'আপনার নাম',
        email: 'আপনার ইমেইল ঠিকানা',
        subject: 'বিষয়',
        message: 'আপনার বার্তা / মতামত',
        send: 'ইমেইল লিখুন',
      },
    },

    footer: {
      tagline: 'আধুনিক, নিরাপদ ও সম্পূর্ণ ব্রাউজার-চালিত ফাইল ইউটিলিটি।',
      quickLinks: 'প্রয়োজনীয় লিংক',
      categories: 'ক্যাটাগরি',
      legal: 'নীতি ও শর্তাবলী',
      copyright: '© ২০২৬ ফাইল টুলস। সর্বস্বত্ব সংরক্ষিত।',
      contactText: 'সরাসরি যোগাযোগ:',
    },
  },
};
