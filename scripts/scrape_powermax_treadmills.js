/**
 * Scrape PowerMax Treadmills and INSERT new products to Supabase with EXACT content.
 */

const axios = require('axios');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ezudcnndhboepasvlvas.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("No service role key provided in env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://powermaxfitness.net';
const TREADMILL_CATEGORY_ID = 'dde089e6-f7c0-4f61-9887-8672c8c43e20'; // From our earlier creation

function fixImageUrls(html) {
  if (!html) return html;
  html = html.replace(/src="(?!https?:\/\/)(?:\/)?/g, `src="${BASE_URL}/`);
  html = html.replace(/href="(?!https?:\/\/)(?!#)(?!javascript)(?:\/)?/g, `href="${BASE_URL}/`);
  return html;
}

function extractProductData($, pageUrl) {
  const data = {
    name: '',
    slug: '',
    price: 0,
    compareAtPrice: 0,
    descriptionHtml: null,
    specificationHtml: null,
    warrantyHtml: null,
    description: null,
    specifications: [],
    warranty: null,
    faqs: [],
    videoUrl: null,
    galleryUrls: [],
    imageUrl: null,
  };

  // Will set name later from JSON-LD or title
  data.name = '';

  // Slug from URL
  const parts = pageUrl.split('/');
  let slugPart = parts[parts.length - 1];
  if (slugPart.includes('-pd-')) {
    data.slug = slugPart.split('-pd-')[0];
  } else {
    data.slug = slugPart.replace('.html', '');
  }

  // Description HTML
  const descTab = $('#desc-tab-pane');
  if (descTab.length) data.descriptionHtml = fixImageUrls(descTab.html().trim());

  // Specification HTML
  const specTab = $('#profile-tab-pane');
  if (specTab.length) data.specificationHtml = specTab.html().trim();

  // Warranty HTML
  const warrantyTab = $('#warranty-tab-pane');
  if (warrantyTab.length) {
    data.warrantyHtml = warrantyTab.html().trim();
    data.warranty = warrantyTab.text().trim();
  }

  // Price & JSON-LD
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json['@type'] === 'Product') {
        if (json.name) data.name = json.name;
        if (json.description) data.description = json.description;
        if (json.additionalProperty && Array.isArray(json.additionalProperty)) {
          data.specifications = json.additionalProperty.map(prop => ({
            key: prop.name,
            value: prop.value
          }));
        }
        if (json.image) data.imageUrl = json.image;
        if (json.offers && json.offers.price) {
          data.price = parseFloat(json.offers.price);
        }
      }
      if (json['@type'] === 'FAQPage' && json.mainEntity) {
        data.faqs = json.mainEntity.map(faq => ({
          question: faq.name,
          answer: faq.acceptedAnswer?.text || ''
        }));
      }
    } catch(e) {}
  });

  // Fallback for price
  if (!data.price) {
    const priceText = $('.price, .product-price, .pro-price').first().text().replace(/[^0-9.]/g, '');
    if (priceText) data.price = parseFloat(priceText);
  }

  // Gallery
  const imageSet = new Set();
  $('a[href*="#slide"]').each((i, el) => {
    let href = $(el).attr('href');
    if (href) {
      href = href.split('#')[0];
      if (href.match(/\.(png|jpg|jpeg|webp|gif)/i)) imageSet.add(href);
    }
  });
  data.galleryUrls = Array.from(imageSet);

  if (data.galleryUrls.length === 0) {
    $('.product-slider img, .sp-wrap img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.match(/\.(png|jpg|jpeg|webp|gif)/i)) imageSet.add(src);
    });
    data.galleryUrls = Array.from(imageSet);
  }

  if (data.galleryUrls.length > 0 && !data.imageUrl) {
    data.imageUrl = data.galleryUrls[0];
  }

  // Extract absolute images from descriptionHtml for gallery if empty
  if (data.descriptionHtml && data.galleryUrls.length === 0) {
    const $desc = cheerio.load(data.descriptionHtml);
    $desc('img').each((i, el) => {
      let src = $desc(el).attr('src');
      if (src && src.includes('storage/uploads/')) {
         if (!src.startsWith('http')) src = `${BASE_URL}/${src.replace(/^\//, '')}`;
         imageSet.add(src);
      }
    });
    data.galleryUrls = Array.from(imageSet);
    if (!data.imageUrl && data.galleryUrls.length > 0) data.imageUrl = data.galleryUrls[0];
  }


  // Video URL
  const videoTab = $('#video-tab-pane');
  if (videoTab.length) {
    const iframe = videoTab.find('iframe');
    if (iframe.length) data.videoUrl = iframe.attr('src');
  }
  if (!data.videoUrl) {
    const ytIframe = $('.product-Description-sec iframe[src*="youtube"], .product-Description-sec iframe[src*="youtu.be"]');
    if (ytIframe.length) data.videoUrl = ytIframe.attr('src');
  }

  if (!data.name) {
    data.name = $('.product-title, .pro-title, h2').first().text().trim();
  }
  if (!data.name) {
    let title = $('title').text().trim();
    if (title.includes('Online')) {
       title = title.split('Online')[0].replace('Buy ', '').trim();
    }
    data.name = title;
  }

  return data;
}

async function scrapeTreadmills() {
  console.log("Fetching Treadmills listing page...");
  const listUrls = [
    'https://powermaxfitness.net/home-use/treadmills-c-11.html',
    'https://powermaxfitness.net/home-use/treadmills-c-11.html?page=2',
    'https://powermaxfitness.net/home-use/treadmills-c-11.html?page=3',
    'https://powermaxfitness.net/home-use/treadmills-c-11.html?page=4'
  ];

  const productLinks = new Set();

  for (const url of listUrls) {
    try {
      const listRes = await axios.get(url);
      const $list = cheerio.load(listRes.data);
      let pageLinksCount = 0;
      
      $list('a').each((i, el) => {
        const href = $list(el).attr('href');
        if (href && href.includes('-pd-')) {
          productLinks.add(href);
          pageLinksCount++;
        }
      });
      console.log(`Found ${pageLinksCount} products on ${url}`);
      if (pageLinksCount === 0) break; // Reached end of pagination
    } catch (e) {
      console.log(`Error or end of pages at ${url}`);
      break;
    }
  }

  console.log(`\nFound total ${productLinks.size} unique treadmills to process.\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const href of Array.from(productLinks)) {
    console.log(`[PROCESS] Scraping ${href}`);
    try {
      const prodRes = await axios.get(href);
      const $ = cheerio.load(prodRes.data);
      
      const extracted = extractProductData($, href);
      if (!extracted || !extracted.name) {
        console.log(`[SKIP] Could not extract name from ${href}`);
        skipCount++;
        continue;
      }

      // Check if exists
      const { data: existing } = await supabase.from('products').select('id').eq('slug', extracted.slug);
      
      const record = {
        category_id: TREADMILL_CATEGORY_ID,
        name: extracted.name,
        slug: extracted.slug,
        short_description: extracted.description ? extracted.description.substring(0, 150) + '...' : null,
        description: extracted.description,
        price: extracted.price > 0 ? extracted.price : 10000,
        image_url: extracted.imageUrl,
        gallery_urls: extracted.galleryUrls,
        description_html: extracted.descriptionHtml,
        specification_html: extracted.specificationHtml,
        warranty_html: extracted.warrantyHtml,
        specifications: extracted.specifications,
        warranty: extracted.warranty,
        faqs: extracted.faqs,
        video_url: extracted.videoUrl
      };

      if (existing && existing.length > 0) {
        // Update
        const { error } = await supabase.from('products').update(record).eq('id', existing[0].id);
        if (error) throw error;
        console.log(`[SUCCESS] UPDATED ${extracted.name}`);
      } else {
        // Insert
        const { error } = await supabase.from('products').insert([record]);
        if (error) throw error;
        console.log(`[SUCCESS] INSERTED ${extracted.name}`);
      }
      
      successCount++;
      await new Promise(r => setTimeout(r, 1000));
    } catch(err) {
      console.error(`[ERROR] Exception scraping ${href}:`, err.message);
      skipCount++;
    }
  }

  console.log(`\nDone. ${successCount} successful, ${skipCount} skipped.`);
}

scrapeTreadmills();
