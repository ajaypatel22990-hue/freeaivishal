import React, { useEffect } from 'react';
import { Language, translations } from '../translations';
import { CompanyWebsite } from '../types';

interface AutoSeoManagerProps {
  currentTab: string;
  language: Language;
  websites: CompanyWebsite[];
}

/**
 * AutoSeoManager: Advanced 24*7 Automatic SEO Engine
 * Designed for Google Search Console #1 Search Rankings for:
 * - "फ्री एआई" / "Free AI"
 * - "विशाल कंपनी" / "Vishal Company"
 * - "क्रिएट बाय विशाल पटेल" / "Created by Vishal Patel"
 * - "फ्री एआई विशाल एडवांस टूल" / "Free AI Vishal Advance Tool"
 * - "विशाल एंटरप्राइज एंड फर्नीचर" / "Vishal Enterprise and Furniture"
 * - Dynamically indexes every single company website added by admin automatically!
 */
export const AutoSeoManager: React.FC<AutoSeoManagerProps> = ({ currentTab, language, websites }) => {
  const t = translations[language];

  useEffect(() => {
    // 1. Dynamic Search-Engine-Optimized Titles
    let pageTitle = `Free AI Vishal Company | Official Corporate Portal (Created by Vishal Patel - CEO) | फ्री एआई विशाल कंपनी`;
    let pageDesc = `Free AI Vishal Company (फ्री एआई विशाल कंपनी) - Official Corporate Portal created by Vishal Patel (क्रिएट बाय विशाल पटेल). Access Free AI Vishal Advance Tool, Vishal Enterprise and Furniture, and complete AI ecosystem 24*7 online.`;

    switch (currentTab) {
      case 'home':
        pageTitle = language === 'en'
          ? `Free AI Vishal Company | Created by Vishal Patel (CEO) - 24*7 Online AI Enterprise Portal`
          : `फ्री एआई विशाल कंपनी | क्रिएट बाय विशाल पटेल (CEO) - 24*7 ऑनलाइन कॉर्पोरेट पोर्टल`;
        pageDesc = language === 'en'
          ? `Free AI Vishal Company official portal created by Vishal Patel. Featuring Free AI Vishal Advance Tool, Vishal Enterprise & Furniture, and advanced AI services.`
          : `फ्री एआई विशाल कंपनी आधिकारिक पोर्टल (क्रिएट बाय विशाल पटेल)। फ्री एआई विशाल एडवांस टूल, विशाल एंटरप्राइज एंड फर्नीचर और संपूर्ण एआई नेटवर्क 24*7 लाइव।`;
        break;
      case 'websites':
        pageTitle = language === 'en'
          ? `Company Websites & Network | Free AI Vishal Advance Tool & Vishal Enterprise`
          : `कंपनी वेबसाइट्स सूची | फ्री एआई विशाल एडवांस टूल और विशाल एंटरप्राइज एंड फर्नीचर`;
        pageDesc = language === 'en'
          ? `Explore all linked portals of Free AI Vishal Company: Free AI Vishal Advance Tool, Vishal Enterprise and Furniture, AI Studio, and Cloud Database.`
          : `फ्री एआई विशाल कंपनी के सभी आधिकारिक पोर्टल्स: फ्री एआई विशाल एडवांस टूल, विशाल एंटरप्राइज एंड फर्नीचर और समस्त डिजिटल सेवाएं।`;
        break;
      case 'gallery':
        pageTitle = language === 'en'
          ? `Media Gallery & Photos | Free AI Vishal Company (CEO: Vishal Patel)`
          : `मीडिया गैलरी व वीडियो | फ्री एआई विशाल कंपनी (क्रिएट बाय विशाल पटेल)`;
        pageDesc = language === 'en'
          ? `Official media gallery, high-definition videos, corporate events, and announcements of Free AI Vishal Company.`
          : `फ्री एआई विशाल कंपनी के आधिकारिक कार्यक्रम, वीडियो, फोटो और बैनर गैलरी।`;
        break;
      case 'employees':
        pageTitle = language === 'en'
          ? `Employee Directory & Management | Free AI Vishal Company`
          : `कर्मचारी डायरेक्टरी | फ्री एआई विशाल कंपनी`;
        pageDesc = language === 'en'
          ? `Verified employee directory and team profiles of Free AI Vishal Company led by CEO Vishal Patel.`
          : `सीईओ विशाल पटेल के नेतृत्व में फ्री एआई विशाल कंपनी के कर्मचारियों की आधिकारिक डायरेक्टरी।`;
        break;
      case 'admin-dashboard':
        pageTitle = `Admin Control Center | Free AI Vishal Company 24*7`;
        pageDesc = `Secure management dashboard for Free AI Vishal Company.`;
        break;
      default:
        pageTitle = `Free AI Vishal Company | Official Corporate Portal (Created by Vishal Patel - CEO)`;
    }

    // Set Document Title
    document.title = pageTitle;

    // 2. Update Meta Description
    let metaDescTag = document.querySelector('meta[name="description"]');
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.setAttribute('name', 'description');
      document.head.appendChild(metaDescTag);
    }
    metaDescTag.setAttribute('content', pageDesc);

    // 3. Build Comprehensive Dynamic Keywords Tag from All Websites
    const baseKeywords = [
      'फ्री एआई विशाल कंपनी',
      'फ्री एआई विशाल',
      'फ्री एआई',
      'फ्री',
      'एआई',
      'विशाल कंपनी',
      'विशाल',
      'विशाल पटेल',
      'क्रिएट बाय विशाल पटेल',
      'फ्री एआई विशाल एडवांस टूल',
      'विशाल एंटरप्राइज एंड फर्नीचर',
      'विशाल एंटरप्राइज',
      'Free AI Vishal Company',
      'Free AI Vishal',
      'Free AI',
      'Free',
      'AI',
      'Vishal Company',
      'Vishal',
      'Vishal Patel',
      'Created by Vishal Patel',
      'Create by Vishal Patel',
      'Free AI Vishal Advance Tool',
      'Vishal Enterprise and Furniture',
      'Vishal Enterprise',
      'Vishal Furniture Surat',
      'freeaivishalcompany8',
      'freeaivishaladvancetool88',
      'vishalenterprise-887',
      'FAV Company',
      'Vishal Patel CEO',
      'Free AI Company',
      '24*7 Online AI Portal',
      'Best Free AI Portal India'
    ];

    // Automatically append titles, categories, and descriptions of every PUBLIC website (keep private websites secret)
    const publicWebsites = websites.filter((site) => !site.isPrivate);
    const dynamicWebsiteKeywords: string[] = [];
    publicWebsites.forEach((site) => {
      if (site.title) dynamicWebsiteKeywords.push(site.title);
      if (site.category) dynamicWebsiteKeywords.push(site.category);
      if (site.url) {
        try {
          const parsed = new URL(site.url);
          dynamicWebsiteKeywords.push(parsed.hostname);
        } catch {
          dynamicWebsiteKeywords.push(site.url);
        }
      }
    });

    const allKeywordsCombined = Array.from(new Set([...baseKeywords, ...dynamicWebsiteKeywords])).join(', ');

    let metaKeywordsTag = document.querySelector('meta[name="keywords"]');
    if (!metaKeywordsTag) {
      metaKeywordsTag = document.createElement('meta');
      metaKeywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywordsTag);
    }
    metaKeywordsTag.setAttribute('content', allKeywordsCombined);

    // 4. Update OpenGraph Meta Tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', pageTitle);
    updateOrCreateMeta('og:description', pageDesc);
    updateOrCreateMeta('og:site_name', 'Free AI Vishal Company');
    updateOrCreateMeta('og:url', window.location.origin + window.location.pathname);

    // 5. Update Twitter Meta Tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOrCreateTwitterMeta('twitter:title', pageTitle);
    updateOrCreateTwitterMeta('twitter:description', pageDesc);

    // 6. Dynamic Structured Data (Schema.org JSON-LD) with All Linked Websites & Sitelinks
    let scriptTag = document.getElementById('dynamic-seo-graph') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-seo-graph';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    const domain = window.location.origin;

    const websitesItemList = publicWebsites.map((site, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": site.title,
      "url": site.url,
      "description": site.description || site.title
    }));

    const dynamicGraph = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${domain}/#website`,
          "url": domain,
          "name": "Free AI Vishal Company",
          "alternateName": [
            "फ्री एआई विशाल कंपनी",
            "क्रिएट बाय विशाल पटेल",
            "Free AI Vishal Advance Tool",
            "Vishal Enterprise and Furniture"
          ],
          "description": pageDesc,
          "publisher": {
            "@id": `${domain}/#organization`
          }
        },
        {
          "@type": "Organization",
          "@id": `${domain}/#organization`,
          "name": "Free AI Vishal Company",
          "alternateName": [
            "फ्री एआई विशाल कंपनी",
            "FAV Company",
            "क्रिएट बाय विशाल पटेल",
            "Vishal Company"
          ],
          "url": domain,
          "founder": {
            "@type": "Person",
            "name": "विशाल पटेल (Vishal Patel)",
            "jobTitle": "CEO & Founder",
            "description": "क्रिएट बाय विशाल पटेल (Created by Vishal Patel)"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "availableLanguage": ["Hindi", "English", "Gujarati"]
          }
        },
        {
          "@type": "ItemList",
          "@id": `${domain}/#company-websites`,
          "name": "Free AI Vishal Company Official Websites & Digital Ecosystem",
          "description": "Complete list of active corporate websites including Free AI Vishal Advance Tool and Vishal Enterprise and Furniture",
          "itemListElement": websitesItemList
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${domain}/#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": domain
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": pageTitle,
              "item": `${domain}/#${currentTab}`
            }
          ]
        }
      ]
    };

    scriptTag.textContent = JSON.stringify(dynamicGraph);
  }, [currentTab, language, websites]);

  return null;
};
