/* Solaris Wine — EN/TH language toggle
   Default language: English. Adds a TH/EN button to the nav and swaps
   page text via the dictionary below. Choice is remembered (localStorage). */
(function () {
  // English text  ->  Thai text. Anything not listed stays unchanged
  // (wine names, grape varieties, region codes, prices, emails, symbols).
  var TH = {
    // ---- Nav ----
    "Home": "หน้าแรก",
    "Our Collection": "คอลเลกชันของเรา",
    "Our Producer": "ผู้ผลิตของเรา",
    "Contact": "ติดต่อเรา",
    "Cart": "ตะกร้า",
    "Order": "สั่งซื้อ",
    "by Solaris Intertrade": "โดย Solaris Intertrade",

    // ---- Home hero ----
    "Premium Wine Importer · Thailand": "ผู้นำเข้าไวน์พรีเมียม · ประเทศไทย",
    "Portugal’s finest wines,": "ไวน์ชั้นเยี่ยมจากโปรตุเกส",
    "now in Thailand": "มาถึงเมืองไทยแล้ว",
    "Solaris Wine brings exceptional bottles from Herdade de Rocim — one of Alentejo’s most celebrated estates — to restaurants, hotels, retailers, and collectors across Thailand.":
      "โซลาริส ไวน์ คัดสรรไวน์ชั้นเยี่ยมจาก Herdade de Rocim หนึ่งในไร่องุ่นที่ได้รับการยกย่องที่สุดของแคว้นอเลนเตโจ มาส่งตรงถึงร้านอาหาร โรงแรม ร้านค้า และนักสะสมทั่วไทย",
    "Shop Our Wines": "เลือกซื้อไวน์",
    "Discover Rocim →": "ทำความรู้จัก Rocim →",
    "Vidigueira · Alentejo · Portugal": "Vidigueira · Alentejo · โปรตุเกส",

    // ---- Stats ----
    "SKUs available": "รายการไวน์",
    "Countries exported": "ประเทศที่ส่งออก",
    "Bottles in stock": "ขวดพร้อมส่ง",
    "Portugal": "โปรตุเกส",

    // ---- Collection ----
    "Herdade de Rocim · Exclusive Import": "Herdade de Rocim · นำเข้าพิเศษ",
    "Our Wine Collection": "คอลเลกชันไวน์ของเรา",
    "12 SKUs · Drag to scroll": "12 รายการ · ปัดเพื่อเลื่อนดู",
    "All (12)": "ทั้งหมด (12)",
    "Red": "แดง",
    "White": "ขาว",
    "Rosé": "โรเซ่",
    "Reserve": "รีเสิร์ฟ",
    "Served in British Airways Business Class": "เสิร์ฟบนชั้นธุรกิจ บริติช แอร์เวยส์",

    // ---- Card tiers / stock / actions ----
    "Entry": "ระดับเริ่มต้น",
    "Special": "พิเศษ",
    "Premium": "พรีเมียม",
    "Varietal": "พันธุ์เดี่ยว",
    "Classic": "คลาสสิก",
    "Reserve": "รีเสิร์ฟ",
    "700 btl": "700 ขวด",
    "100 btl": "100 ขวด",
    "90 btl": "90 ขวด",
    "30 btl": "30 ขวด",
    "/btl": "/ขวด",
    "Add to Cart": "ใส่ตะกร้า",
    "Only 20 left": "เหลือ 20 ขวด",
    "Only 10 left": "เหลือ 10 ขวด",
    "View Details →": "ดูรายละเอียด →",

    // ---- Tasting notes ----
    "“Deep ruby. Exuberant red berries. Round tannins and good volume.”": "สีทับทิมเข้ม กลิ่นผลไม้เบอร์รี่แดงชัดเจน แทนนินนุ่มกลมกล่อม บอดี้กำลังดี",
    "“Citrine green. Tropical fruit, freshness and minerality.”": "สีเหลืองอมเขียว กลิ่นผลไม้เมืองร้อน สดชื่น พร้อมกลิ่นแร่ธาตุ",
    "“Pale pink. Fresh red fruit, minerality and nice freshness.”": "สีชมพูอ่อน กลิ่นผลไม้แดงสด มีกลิ่นแร่ธาตุ และความสดชื่นน่าดื่ม",
    "“Citrus, elegant and fruity. Young, fresh and well-balanced.”": "กลิ่นซิตรัส หอมละมุนและมีกลิ่นผลไม้ สดใหม่ ดื่มง่าย รสชาติสมดุล",
    "“Ruby. Floral and fresh red fruit, integrated with subtle oak.”": "สีทับทิม กลิ่นดอกไม้และผลไม้แดงสด ผสานกลิ่นโอ๊กอ่อน ๆ อย่างกลมกลืน",
    "“Golden, mineral aroma from oak. Good volume and acidity.”": "สีทอง กลิ่นแร่ธาตุจากการบ่มในถังโอ๊ก บอดี้ดี เปรี้ยวกำลังเหมาะ",
    "“Deep, fresh, complex. Polished tannins and generous fruit.”": "เข้มข้น สดชื่น มีมิติซับซ้อน แทนนินละเอียดเนียน กลิ่นผลไม้เต็มที่",
    "“Fresh, mineral, citrus fruit and good concentration.”": "สดชื่น มีกลิ่นแร่ธาตุและซิตรัส รสชาติเข้มข้นกำลังดี",
    "“Deep ruby. Black fruit and mineral aromas. Firm tannins.”": "สีทับทิมเข้ม กลิ่นผลไม้สีเข้มและแร่ธาตุ แทนนินหนักแน่น",
    "“Greenish. Mineral and citric aroma revealing original terroir.”": "สีเขียวอ่อน กลิ่นแร่ธาตุและซิตรัส สะท้อนเอกลักษณ์ของผืนดินอย่างแท้จริง",
    "“Deep ruby. Black fruit and spice. Firm yet silky tannins.”": "สีทับทิมเข้ม กลิ่นผลไม้สีเข้มและเครื่องเทศ แทนนินหนักแน่นแต่นุ่มลื่น",
    "“Deep ruby. Menthol, balsamic and spicy. Firm structured tannins.”": "สีทับทิมเข้ม กลิ่นเมนทอล บัลซามิก และเครื่องเทศ แทนนินหนักแน่นมีโครงสร้างชัดเจน",
    "Old vine blend — Douro": "องุ่นเถาแก่ผสม — Douro",
    "Old vine whites — Douro": "องุ่นขาวเถาแก่ — Douro",

    // ---- Home: featured producer + CTA ----
    "Featured producer": "ผู้ผลิตแนะนำ",
    "de Rocim": "เดอ โรซิม",
    "A benchmark estate in Vidigueira, Alentejo. Atlantic winds, ancient Amphora tradition, and 75 hectares of indigenous vines.":
      "ไร่องุ่นชั้นแนวหน้าในวิดิเกรา แคว้นอเลนเตโจ ด้วยสายลมจากมหาสมุทรแอตแลนติก ภูมิปัญญาการบ่มในไหดินเผาแบบโบราณ และไร่องุ่นพันธุ์พื้นเมืองกว่า 75 เฮกตาร์",
    "Our exclusive partner": "พาร์ตเนอร์พิเศษของเรา",
    "Rooted in tradition,": "หยั่งรากลึกในประเพณี",
    "refined by passion": "กลั่นกรองด้วยใจรัก",
    "Founded in 2000, Herdade de Rocim sits on the Vidigueira fault — a unique microclimate where Atlantic breezes yield wines of exceptional freshness.":
      "ก่อตั้งเมื่อปี 2000 Herdade de Rocim ตั้งอยู่บนแนวรอยเลื่อนวิดิเกรา ภูมิอากาศเฉพาะถิ่นที่สายลมจากแอตแลนติกช่วยให้ไวน์มีความสดชื่นเป็นเอกลักษณ์",
    "Sustainability certified": "รับรองความยั่งยืน",
    "Discover the Estate": "ทำความรู้จักไร่องุ่น",
    "Get started": "เริ่มต้น",
    "Bring Portugal’s finest": "มอบไวน์ชั้นเยี่ยมจากโปรตุเกส",
    "to your guests": "ให้แขกคนพิเศษของคุณ",
    "Arrange a private tasting or discuss a bespoke wine programme.": "นัดหมายชิมไวน์แบบส่วนตัว หรือปรึกษาจัดเซ็ตไวน์เฉพาะสำหรับคุณ",
    "Browse All Wines": "ดูไวน์ทั้งหมด",
    "Arrange a Tasting": "นัดชิมไวน์",

    // ---- Footer ----
    "© 2026 Solaris Intertrade Co., Ltd. — Bangkok, Thailand": "© 2026 Solaris Intertrade Co., Ltd. — กรุงเทพฯ ประเทศไทย",

    // ---- Cart / checkout ----
    "Your Cart": "ตะกร้าของคุณ",
    "Your cart is empty.": "ตะกร้าว่างเปล่า",
    "Proceed to Checkout →": "ดำเนินการชำระเงิน →",
    "Clear Cart": "ล้างตะกร้า",
    "Checkout": "ชำระเงิน",
    "Details": "รายละเอียด",
    "Payment": "การชำระเงิน",
    "Done": "เสร็จสิ้น",
    "← Back": "← ย้อนกลับ",
    "Continue →": "ดำเนินการต่อ →",

    // ---- Wines page ----
    "Our Wine": "ไวน์ของเรา",
    "Collection": "คอลเลกชัน",
    "Twelve exceptional expressions from one of Alentejo’s most celebrated estates — spanning three Portuguese wine regions, indigenous varieties, and 2,000 years of winemaking tradition.":
      "สิบสองไวน์ชั้นเยี่ยมจากหนึ่งในไร่องุ่นที่ได้รับการยกย่องที่สุดของ Alentejo ครอบคลุมสามภูมิภาคไวน์ของโปรตุเกส องุ่นพื้นเมือง และประเพณีการทำไวน์กว่า 2,000 ปี",
    "Sort": "เรียงตาม",
    "Default": "ค่าเริ่มต้น",
    "Price: Low → High": "ราคา: ต่ำ → สูง",
    "Price: High → Low": "ราคา: สูง → ต่ำ",
    "Name A–Z": "ชื่อ A–Z",
    "12 wines": "12 ไวน์",
    "700 bottles": "700 ขวด",
    "100 bottles": "100 ขวด",
    "90 bottles": "90 ขวด",
    "30 bottles": "30 ขวด",
    "Vidigueira DOC Alentejo": "Vidigueira DOC, Alentejo",
    "Lisboa VR — Single Vineyard": "Lisboa VR — ไร่องุ่นเดี่ยว",
    "DOC Douro — Old Vines": "DOC Douro — องุ่นเถาแก่",

    // ---- Contact page ----
    "Get in touch": "ติดต่อเรา",
    "Let’s talk": "มาพูดคุยกัน",
    "wine &": "เรื่องไวน์ &",
    "partnership": "พาร์ตเนอร์ชิป",
    "Whether you’re interested in a private tasting, wholesale inquiry, or simply want to learn more about Herdade de Rocim, we’d love to hear from you. Our team responds within 24 hours.":
      "ไม่ว่าจะสนใจนัดชิมไวน์แบบส่วนตัว สอบถามราคาขายส่ง หรืออยากรู้จัก Herdade de Rocim ให้มากขึ้น เรายินดีพูดคุยกับคุณเสมอ ทีมงานตอบกลับภายใน 24 ชั่วโมง",
    "Contact info": "ข้อมูลติดต่อ",
    "Address": "ที่อยู่",
    "Email": "อีเมล",
    "Phone": "โทรศัพท์",
    "Business Hours": "เวลาทำการ",
    "Monday – Saturday": "จันทร์ – เสาร์",
    "9:00 AM – 6:00 PM ICT": "9:00 – 18:00 น. (ICT)",
    "Send us a message": "ส่งข้อความถึงเรา",
    "Name": "ชื่อ",
    "Inquiry Type": "ประเภทคำถาม",
    "Select...": "เลือก...",
    "🍷 Private Tasting Request": "🍷 ขอนัดชิมไวน์ส่วนตัว",
    "🏪 Wholesale / B2B Enquiry": "🏪 สอบถามขายส่ง / B2B",
    "🛍️ Retail Partnership": "🛍️ พาร์ตเนอร์ร้านค้าปลีก",
    "💬 Other": "💬 อื่น ๆ",
    "Message": "ข้อความ",
    "Send Inquiry": "ส่งข้อความ",
    "Explore our": "สำรวจ",
    "Browse all twelve wines or learn more about our exclusive partnership with Herdade de Rocim.":
      "ดูไวน์ทั้งสิบสองตัว หรือเรียนรู้เพิ่มเติมเกี่ยวกับความร่วมมือพิเศษกับ Herdade de Rocim",
    "View Wines": "ดูไวน์",
    "About Rocim": "เกี่ยวกับ Rocim",
    "Your name": "ชื่อของคุณ",
    "Tell us more about your interest...": "เล่าให้เราฟังเพิ่มเติมเกี่ยวกับความสนใจของคุณ...",

    // ---- Producer page ----
    "Herdade de": "Herdade de",
    "A family estate in the Baixo Alentejo, southern Portugal — set between the towns of Vidigueira and Cuba, where ancient clay-vessel winemaking and a modern, sustainable vision come together in every bottle.":
      "ไร่องุ่นของครอบครัวใน Baixo Alentejo ทางใต้ของโปรตุเกส ตั้งอยู่ระหว่างเมือง Vidigueira และ Cuba ที่ซึ่งการทำไวน์ในไหดินเผาแบบโบราณและวิสัยทัศน์สมัยใหม่ที่ยั่งยืนผสานกันในทุกขวด",
    "The Estate": "ไร่องุ่น",
    "Rooted in the": "หยั่งรากใน",
    "The story of Herdade do Rocim began in the year 2000, when the family’s investment in wine took root on a roughly 120-hectare property between Vidigueira and Cuba in the Baixo Alentejo — around 70 hectares of it planted to vine.":
      "เรื่องราวของ Herdade do Rocim เริ่มต้นในปี 2000 เมื่อครอบครัวลงทุนในธุรกิจไวน์บนพื้นที่ราว 120 เฮกตาร์ ระหว่าง Vidigueira และ Cuba ใน Baixo Alentejo โดยปลูกองุ่นราว 70 เฮกตาร์",
    "The estate works closely with its land — tending native Portuguese grape varieties alongside international ones, and farming with respect for the surrounding ecosystem.":
      "ไร่องุ่นทำงานใกล้ชิดกับผืนดิน ดูแลองุ่นพันธุ์พื้นเมืองโปรตุเกสควบคู่กับพันธุ์สากล และทำการเกษตรโดยเคารพระบบนิเวศโดยรอบ",
    "Vidigueira · Baixo Alentejo": "Vidigueira · Baixo Alentejo",
    "Philosophy": "ปรัชญา",
    "Honouring an": "สืบสาน",
    "ancient": "งานฝีมือ",
    "craft": "ดั้งเดิม",
    "— wine made in large clay vessels, a practice with roots stretching back to Roman times.":
      "— ไวน์ที่หมักในไหดินเผาขนาดใหญ่ ธรรมเนียมที่มีรากย้อนไปถึงสมัยโรมัน",
    "Sustainability sits at the heart of how Rocim farms and makes wine. Tended by viticulturist Catarina and crafted by winemaker Pedro, the wines are prized for their freshness and sense of origin — so much so they have been called an “oasis of origin.”":
      "ความยั่งยืนคือหัวใจของการทำไร่และทำไวน์ของ Rocim ดูแลไร่โดย Catarina และรังสรรค์ไวน์โดย Pedro ไวน์ขึ้นชื่อเรื่องความสดชื่นและกลิ่นอายของถิ่นกำเนิด จนได้ฉายาว่า “โอเอซิสแห่งถิ่นกำเนิด”",
    "Estate founded": "ก่อตั้งไร่",
    "Estate, Baixo Alentejo": "พื้นที่ไร่ Baixo Alentejo",
    "Under vine": "พื้นที่ปลูกองุ่น",
    "Clay-amphora tradition": "ประเพณีไหดินเผา",
    "“To speak of Rocim’s story is to speak of a dream — and a dream has no end.”":
      "“การเล่าเรื่องราวของ Rocim คือการเล่าถึงความฝัน และความฝันไม่มีวันสิ้นสุด”",
    "Herdade do Rocim · Baixo Alentejo": "Herdade do Rocim · Baixo Alentejo",
    "The Range": "กลุ่มผลิตภัณฑ์",
    "Many styles,": "หลากสไตล์",
    "one origin": "หนึ่งถิ่นกำเนิด",
    "From everyday regional bottlings to amphora-aged talha wines, Rocim crafts across the full spectrum of Portuguese styles.":
      "ตั้งแต่ไวน์ระดับภูมิภาคสำหรับทุกวัน ไปจนถึงไวน์ talha ที่บ่มในไหดินเผา Rocim รังสรรค์ครบทุกสไตล์ของโปรตุเกส",
    "Structured Alentejo reds": "ไวน์แดง Alentejo มีโครงสร้าง",
    "Fresh, mineral whites": "ไวน์ขาวสดชื่น มิเนรัล",
    "Pale, crisp & dry": "สีอ่อน สดคม และแห้ง",
    "Clay-amphora wines": "ไวน์หมักไหดินเผา",
    "Sparkling": "สปาร์กลิง",
    "Traditional method": "วิธีดั้งเดิม",
    "Taste the": "ลิ้มรส",
    "Explore the full collection of Rocim wines, now available in Thailand through Solaris Wine.":
      "สำรวจคอลเลกชันไวน์ Rocim ทั้งหมด วางจำหน่ายในไทยแล้วผ่าน Solaris Wine",
    "Get in Touch": "ติดต่อเรา"
  };

  // ---- Dynamic strings created by the page's own JS (cart / checkout / toasts) ----
  var DYN = {
    "✓ In Cart": "✓ ในตะกร้า",
    "Select a quantity first": "กรุณาเลือกจำนวนก่อน",
    "Continue to Payment →": "ไปต่อที่การชำระเงิน →",
    "Confirm & Send Order →": "ยืนยันและส่งคำสั่งซื้อ →",
    "✓ Slip uploaded": "✓ อัปโหลดสลิปแล้ว",
    "Please fill in required fields": "กรุณากรอกข้อมูลที่จำเป็น",
    "Please upload your payment slip": "กรุณาอัปโหลดสลิปการชำระเงิน",
    "Order Summary": "สรุปคำสั่งซื้อ",
    "Your Details": "ข้อมูลของคุณ",
    "Full Name": "ชื่อ-นามสกุล",
    "Delivery Address": "ที่อยู่จัดส่ง",
    "Delivery": "การจัดส่ง",
    "Notes (optional)": "หมายเหตุ (ถ้ามี)",
    "Order Reference": "หมายเลขอ้างอิงคำสั่งซื้อ",
    "Order Confirmed!": "ยืนยันคำสั่งซื้อแล้ว!",
    "Confirmation sent": "ส่งการยืนยันแล้ว",
    "Slip verified": "ตรวจสอบสลิปแล้ว",
    "Upload Payment Slip": "อัปโหลดสลิปการชำระเงิน",
    "What happens next": "ขั้นตอนถัดไป",
    "Order Summary": "สรุปคำสั่งซื้อ",
    "Subtotal": "ยอดรวมย่อย",
    "Total": "รวมทั้งหมด",
    "Qty": "จำนวน",
    "Remove": "ลบ",
    "TBC": "รอแจ้ง",
    "Special instructions, preferred delivery time...": "คำขอพิเศษ เวลาจัดส่งที่สะดวก...",
    "Street, District, Province, Postcode": "ถนน เขต/อำเภอ จังหวัด รหัสไปรษณีย์",
    "e.g. Khun Somchai Rakwine": "เช่น คุณสมชาย รักไวน์"
  };
  for (var k in DYN) { if (!(k in TH)) TH[k] = DYN[k]; }

  // Pattern rules for strings containing numbers/names (EN -> TH)
  var PATTERNS = [
    [/^(\d+) items?$/, function (m) { return m[1] + " รายการ"; }],
    [/^Add (\d+) to Cart$/, function (m) { return "ใส่ตะกร้า " + m[1] + " ขวด"; }],
    [/^(.+) added$/, function (m) { return m[1] + " เพิ่มแล้ว"; }]
  ];
  function patternTH(norm) {
    for (var i = 0; i < PATTERNS.length; i++) {
      var mm = norm.match(PATTERNS[i][0]);
      if (mm) return PATTERNS[i][1](mm);
    }
    return null;
  }

  var NAV_LABEL = { en: "ไทย", th: "EN" };
  var lang = (function () { try { return localStorage.getItem('sw_lang') || 'en'; } catch (e) { return 'en'; } })();

  var orig = (typeof WeakMap !== 'undefined') ? new WeakMap() : null;
  var observer = null;

  function thFor(norm) { return TH[norm] || patternTH(norm); }

  // Translate a single text node to language l
  function tNode(node, l) {
    var norm = node.nodeValue.replace(/\s+/g, ' ').trim();
    if (!norm) return;
    if (l === 'th') {
      var th = thFor(norm);
      if (th == null) return;
      if (orig && !orig.has(node)) orig.set(node, node.nodeValue);
      if (node.nodeValue !== th) node.nodeValue = th;
    } else {
      if (orig && orig.has(node)) {
        var o = orig.get(node);
        if (node.nodeValue !== o) node.nodeValue = o;
      }
    }
  }

  // Walk an element subtree applying language l
  function walk(node, l) {
    if (node.nodeType === 3) { tNode(node, l); return; }
    if (node.nodeType !== 1) return;
    var t = node.tagName.toLowerCase();
    if (t === 'script' || t === 'style' || t === 'svg') return;
    var ph = node.getAttribute && node.getAttribute('placeholder');
    if (ph) {
      var pn = ph.trim();
      if (l === 'th' && TH[pn]) node.setAttribute('placeholder', TH[pn]);
    }
    for (var c = node.firstChild; c; c = c.nextSibling) walk(c, l);
  }

  function apply(l) {
    if (observer) observer.disconnect();
    walk(document.body, l);
    if (TH[document.title.trim()] && l === 'th') document.title = TH[document.title.trim()];
    document.documentElement.setAttribute('lang', l === 'th' ? 'th' : 'en');
    var btn = document.getElementById('sw-lang-toggle');
    if (btn) btn.textContent = NAV_LABEL[l];
    lang = l;
    try { localStorage.setItem('sw_lang', l); } catch (e) {}
    if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  // Re-translate dynamically added/changed content while in Thai mode
  function startObserver() {
    if (typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function (muts) {
      if (lang !== 'th') return;
      observer.disconnect();
      for (var i = 0; i < muts.length; i++) {
        var mu = muts[i];
        if (mu.type === 'characterData') { tNode(mu.target, 'th'); }
        else {
          for (var j = 0; j < mu.addedNodes.length; j++) walk(mu.addedNodes[j], 'th');
        }
      }
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function addButton() {
    var nav = document.querySelector('nav');
    if (!nav || document.getElementById('sw-lang-toggle')) return;
    var b = document.createElement('button');
    b.id = 'sw-lang-toggle';
    b.type = 'button';
    b.textContent = NAV_LABEL[lang];
    b.setAttribute('aria-label', 'Switch language');
    b.style.cssText = 'background:transparent;border:0.5px solid var(--border,rgba(191,149,64,0.18));color:var(--muted,#bdb4a4);font-family:inherit;font-size:0.66rem;letter-spacing:0.12em;text-transform:uppercase;padding:0.45rem 0.85rem;margin-left:0.6rem;cursor:pointer;transition:all 0.25s;';
    b.onmouseover = function () { b.style.borderColor = 'var(--gold,#BF9540)'; b.style.color = 'var(--gold,#BF9540)'; };
    b.onmouseout = function () { b.style.borderColor = 'var(--border,rgba(191,149,64,0.18))'; b.style.color = 'var(--muted,#bdb4a4)'; };
    b.onclick = function () { apply(lang === 'en' ? 'th' : 'en'); };
    var cart = nav.querySelector('.cart-btn');
    if (cart && cart.parentNode) cart.parentNode.insertBefore(b, cart);
    else nav.appendChild(b);
  }

  function init() {
    addButton();
    apply(lang);          // translate current DOM to saved language
    startObserver();      // keep translating dynamic content while in Thai
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
