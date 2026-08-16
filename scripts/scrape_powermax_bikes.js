/**
 * Scrape PowerMax Exercise Bikes and update Supabase with EXACT content:
 *   - description_html  (full HTML of Description tab, images fixed to absolute URLs)
 *   - specification_html (full HTML of Specification tab)
 *   - warranty_html      (full HTML of Warranty tab)
 *   - faqs               (JSON array of {question, answer})
 *   - video_url          (YouTube / video embed URL if present)
 *   - gallery_urls       (product slider images)
 *   - image_url          (main product image)
 *   - description        (plain text description from JSON-LD)
 *   - specifications     (JSON key/value from HTML spec table)
 *   - warranty           (plain text warranty)
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

/**
 * Fix relative image URLs in HTML to absolute URLs
 */
function fixImageUrls(html) {
  if (!html) return html;
  // Fix src="storage/..." and src="/storage/..."
  html = html.replace(/src="(?!https?:\/\/)(?:\/)?/g, `src="${BASE_URL}/`);
  // Fix href="storage/..." and href="/storage/..."  
  html = html.replace(/href="(?!https?:\/\/)(?!#)(?!javascript)(?:\/)?/g, `href="${BASE_URL}/`);
  return html;
}

/**
 * Extract structured data from a single product page
 */
function extractProductData($, pageUrl) {
  const data = {
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

  // === 1. DESCRIPTION HTML (full HTML of description tab) ===
  const descTab = $('#desc-tab-pane');
  if (descTab.length) {
    data.descriptionHtml = fixImageUrls(descTab.html().trim());
  }

  // === 2. SPECIFICATION HTML (full HTML of specification tab) ===
  const specTab = $('#profile-tab-pane');
  if (specTab.length) {
    data.specificationHtml = specTab.html().trim();
  }

  // === 3. WARRANTY HTML (full HTML of warranty tab) ===
  const warrantyTab = $('#warranty-tab-pane');
  if (warrantyTab.length) {
    data.warrantyHtml = warrantyTab.html().trim();
    // Also extract plain text warranty
    data.warranty = warrantyTab.text().trim();
  }

  // === 4. PLAIN TEXT DESCRIPTION + STRUCTURED SPECS from JSON-LD ===
  $('script[type="application/ld+json"]').each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      if (json['@type'] === 'Product') {
        if (json.description) {
          data.description = json.description;
        }
        if (json.additionalProperty && Array.isArray(json.additionalProperty)) {
          data.specifications = json.additionalProperty.map(prop => ({
            key: prop.name,
            value: prop.value
          }));
        }
        if (json.image) {
          data.imageUrl = json.image;
        }
      }
      // Extract FAQs from FAQ JSON-LD
      if (json['@type'] === 'FAQPage' && json.mainEntity) {
        data.faqs = json.mainEntity.map(faq => ({
          question: faq.name,
          answer: faq.acceptedAnswer?.text || ''
        }));
      }
    } catch(e) {}
  });

  // === 5. GALLERY IMAGES (from slide links) ===
  const imageSet = new Set();
  $('a[href*="#slide"]').each((i, el) => {
    let href = $(el).attr('href');
    if (href) {
      href = href.split('#')[0];
      // Only include actual image URLs, not the page URL itself
      if (href.match(/\.(png|jpg|jpeg|webp|gif)/i)) {
        imageSet.add(href);
      }
    }
  });
  data.galleryUrls = Array.from(imageSet);

  // If no gallery from slides, try getting from img tags in the main slider area
  if (data.galleryUrls.length === 0) {
    $('.product-slider img, .sp-wrap img').each((i, el) => {
      const src = $(el).attr('src');
      if (src && src.match(/\.(png|jpg|jpeg|webp|gif)/i)) {
        imageSet.add(src);
      }
    });
    data.galleryUrls = Array.from(imageSet);
  }

  if (data.galleryUrls.length > 0 && !data.imageUrl) {
    data.imageUrl = data.galleryUrls[0];
  }

  // === 6. VIDEO URL (from video tab or iframes) ===
  const videoTab = $('#video-tab-pane');
  if (videoTab.length) {
    const iframe = videoTab.find('iframe');
    if (iframe.length) {
      data.videoUrl = iframe.attr('src');
    }
  }
  // Also check for YouTube iframes anywhere in the product info section
  if (!data.videoUrl) {
    const ytIframe = $('.product-Description-sec iframe[src*="youtube"], .product-Description-sec iframe[src*="youtu.be"]');
    if (ytIframe.length) {
      data.videoUrl = ytIframe.attr('src');
    }
  }

  // === 7. Also extract description images for gallery enrichment ===
  // Collect all images from the description HTML that are product detail images
  if (data.descriptionHtml) {
    const $desc = cheerio.load(data.descriptionHtml);
    $desc('img').each((i, el) => {
      let src = $desc(el).attr('src');
      if (src && src.includes('storage/uploads/')) {
        // Make sure it's absolute
        if (!src.startsWith('http')) {
          src = `${BASE_URL}/${src.replace(/^\//, '')}`;
        }
      }
    });
  }

  return data;
}

async function scrapeBikes() {
  console.log("Fetching products in 'Spine Bike' category...");
  const { data: dbProducts, error } = await supabase
    .from('products')
    .select('id, name, slug, category_slug, category_name')
    .ilike('category_name', '%Spine%');

  if (error) {
    console.error("Error fetching from Supabase:", error);
    return;
  }

  console.log(`Found ${dbProducts.length} products to update.`);

  // Fetch the listing page to discover product URLs
  const listUrl = 'http://powermaxfitness.net/home-use/exercise-bikes-c-34.html';
  console.log("Fetching listing page...");
  const listRes = await axios.get(listUrl);
  const $list = cheerio.load(listRes.data);

  // Map product names/models to their URLs
  const productLinks = {};
  $list('a').each((i, el) => {
    const href = $list(el).attr('href');
    if (href && href.includes('-pd-')) {
      const name = $list(el).text().trim();
      if (name && name.length > 3) {
        const normName = name.replace(/\s+/g, ' ').trim().toLowerCase();
        productLinks[normName] = href;
      }
    }
  });

  let successCount = 0;
  let skipCount = 0;

  for (const product of dbProducts) {
    const pNameNorm = product.name.replace(/\s+/g, ' ').trim().toLowerCase();
    
    // Find matching link by name or model number
    let matchedHref = productLinks[pNameNorm];
    if (!matchedHref) {
      const model = product.name.split(' ')[0].toLowerCase();
      const possibleLink = Object.entries(productLinks).find(([n, href]) => n.includes(model));
      if (possibleLink) {
        matchedHref = possibleLink[1];
      }
    }

    if (!matchedHref) {
      console.log(`[SKIP] Could not find URL for product: ${product.name}`);
      skipCount++;
      continue;
    }

    console.log(`[PROCESS] Scraping ${product.name} from ${matchedHref}`);
    try {
      const prodRes = await axios.get(matchedHref);
      const $ = cheerio.load(prodRes.data);
      
      const extracted = extractProductData($, matchedHref);

      // Build the update object
      const updateData = {};

      if (extracted.descriptionHtml) updateData.description_html = extracted.descriptionHtml;
      if (extracted.specificationHtml) updateData.specification_html = extracted.specificationHtml;
      if (extracted.warrantyHtml) updateData.warranty_html = extracted.warrantyHtml;
      if (extracted.description) updateData.description = extracted.description;
      if (extracted.specifications.length > 0) updateData.specifications = extracted.specifications;
      if (extracted.warranty) updateData.warranty = extracted.warranty;
      if (extracted.faqs.length > 0) updateData.faqs = extracted.faqs;
      if (extracted.videoUrl) updateData.video_url = extracted.videoUrl;
      if (extracted.galleryUrls.length > 0) updateData.gallery_urls = extracted.galleryUrls;
      if (extracted.imageUrl) updateData.image_url = extracted.imageUrl;

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id);

      if (updateError) {
        console.error(`[ERROR] Failed to update ${product.name}:`, updateError.message);
      } else {
        console.log(`[SUCCESS] Updated ${product.name}`);
        console.log(`  - Description HTML: ${extracted.descriptionHtml ? extracted.descriptionHtml.length + ' chars' : 'N/A'}`);
        console.log(`  - Specification HTML: ${extracted.specificationHtml ? extracted.specificationHtml.length + ' chars' : 'N/A'}`);
        console.log(`  - Warranty: ${extracted.warranty || 'N/A'}`);
        console.log(`  - FAQs: ${extracted.faqs.length} items`);
        console.log(`  - Video: ${extracted.videoUrl || 'N/A'}`);
        console.log(`  - Gallery images: ${extracted.galleryUrls.length}`);
        successCount++;
      }
      
      // Small delay to avoid hammering the server
      await new Promise(r => setTimeout(r, 1000));
    } catch(err) {
      console.error(`[ERROR] Exception scraping ${product.name}:`, err.message);
    }
  }

  console.log(`\nDone. ${successCount} updated, ${skipCount} skipped.`);
}

scrapeBikes();
