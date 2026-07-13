/**
 * Google Apps Script - Gạo Trần Huy CMS Webhook
 *
 * Script này nhận webhook từ CMS Next.js và đồng bộ dữ liệu vào Google Sheet.
 *
 * Cách triển khai:
 * 1. Mở Google Sheet: https://docs.google.com/spreadsheets/d/10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA/edit
 * 2. Vào Extensions > Apps Script
 * 3. Dán toàn bộ code này vào
 * 4. Deploy > New deployment > Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy URL deployment và dán vào file .env.local của Next.js:
 *    GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXXX/exec
 */

const SHEET_ID = '10562yhbthC7zs9mEFkBo0Ly-8ul8Nkaf2hbJwBFTWXA';
const WEBHOOK_SECRET = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok', message: 'Gạo Trần Huy CMS Webhook' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (WEBHOOK_SECRET && body.secret !== WEBHOOK_SECRET) {
      return jsonError('Unauthorized', 401);
    }

    const action = body.action;
    const type = body.type;
    const data = body.data;

    if (action === 'upsert' && type === 'product') {
      upsertProduct(data);
    } else if (action === 'delete' && type === 'product') {
      deleteProduct(data.id);
    } else if (action === 'upsert' && type === 'blog') {
      upsertBlog(data);
    } else if (action === 'delete' && type === 'blog') {
      deleteBlog(data.id);
    } else if (action === 'sync_all') {
      syncAll(body.products, body.blog);
    } else {
      return jsonError('Invalid action/type', 400);
    }

    return jsonSuccess({ action, type, success: true });
  } catch (err) {
    return jsonError(err.toString(), 500);
  }
}

function upsertProduct(p) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('sp') || ss.insertSheet('sp');

  ensureProductHeaders(sheet);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');

  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === p.id) {
      rowIndex = i + 1;
      break;
    }
  }

  const rowData = [
    p.id || '',
    p.name || '',
    p.slug || '',
    p.category_slug || p.category || '',
    p.category_slug || p.categorySlug || '',
    p.price || 0,
    p.old_price || p.oldPrice || '',
    p.unit || '',
    p.origin || '',
    p.short_description || p.shortDescription || '',
    p.description || '',
    p.image || '',
    p.rating || 0,
    p.sold_count || p.sold || 0,
    p.in_stock === true || p.inStock === true ? 'true' : 'false',
    p.is_featured === true || p.isFeatured === true ? 'true' : 'false',
    p.is_best_seller === true || p.isBestSeller === true ? 'true' : 'false',
    (p.tags || []).join(', '),
    p.shopee_url || '',
    p.review_count || p.reviewCount || 0,
  ];

  if (rowIndex === -1) {
    sheet.appendRow(rowData);
  } else {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  }
}

function deleteProduct(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('sp');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function upsertBlog(b) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('blog') || ss.insertSheet('blog');

  ensureBlogHeaders(sheet);

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');

  let rowIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][idCol] === b.id) {
      rowIndex = i + 1;
      break;
    }
  }

  const plainContent = (b.content || '').replace(/<[^>]+>/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  const rowData = [
    b.id || '',
    b.title || '',
    b.slug || '',
    b.excerpt || '',
    plainContent,
    b.image || '',
    b.category || '',
    b.author || '',
    b.date || '',
    b.readTime || 5,
  ];

  if (rowIndex === -1) {
    sheet.appendRow(rowData);
  } else {
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  }
}

function deleteBlog(id) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  const sheet = ss.getSheetByName('blog');
  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idCol = headers.indexOf('id');

  for (let i = data.length - 1; i >= 1; i--) {
    if (data[i][idCol] === id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function syncAll(products, blog) {
  if (products && products.length > 0) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('sp') || ss.insertSheet('sp');
    ensureProductHeaders(sheet);

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }

    const rows = products.map(function(p) {
      return [
        p.id || '',
        p.name || '',
        p.slug || '',
        p.category_slug || p.category || '',
        p.category_slug || p.categorySlug || '',
        p.price || 0,
        p.old_price || p.oldPrice || '',
        p.unit || '',
        p.origin || '',
        p.short_description || p.shortDescription || '',
        p.description || '',
        p.image || '',
        p.rating || 0,
        p.sold_count || p.sold || 0,
        p.in_stock === true || p.inStock === true ? 'true' : 'false',
        p.is_featured === true || p.isFeatured === true ? 'true' : 'false',
        p.is_best_seller === true || p.isBestSeller === true ? 'true' : 'false',
        (p.tags || []).join(', '),
        p.shopee_url || '',
        p.review_count || p.reviewCount || 0,
      ];
    });

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }
  }

  if (blog && blog.length > 0) {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('blog') || ss.insertSheet('blog');
    ensureBlogHeaders(sheet);

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }

    const rows = blog.map(function(b) {
      var plainContent = (b.content || '').replace(/<[^>]+>/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      return [
        b.id || '',
        b.title || '',
        b.slug || '',
        b.excerpt || '',
        plainContent,
        b.image || '',
        b.category || '',
        b.author || '',
        b.date || '',
        b.readTime || 5,
      ];
    });

    if (rows.length > 0) {
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }
  }
}

function ensureProductHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'name', 'slug', 'category', 'categorySlug', 'price', 'oldPrice',
      'unit', 'origin', 'shortDescription', 'description', 'image',
      'rating', 'sold', 'inStock', 'isFeatured', 'isBestSeller', 'tags',
      'shopee_url', 'review_count'
    ]);
  }
}

function ensureBlogHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'id', 'title', 'slug', 'excerpt', 'content', 'image',
      'category', 'author', 'date', 'readTime'
    ]);
  }
}

function jsonSuccess(data) {
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonError(message, code) {
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: message, code: code }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Setup: Set webhook secret (optional, for security)
 * Run this function once manually to set the secret
 */
function setWebhookSecret() {
  var secret = 'your-secret-here';
  PropertiesService.getScriptProperties().setProperty('WEBHOOK_SECRET', secret);
}
