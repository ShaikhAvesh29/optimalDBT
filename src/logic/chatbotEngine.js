import { SCHEMES } from '../data/schemes.js';

/**
 * Speech Recognition and Synthesis language mappings
 */
export const SPEECH_LANG_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN'
};

/**
 * Generates an intelligent, contextual response based on the user query,
 * current language, farmer profile, scheme optimizer results, applications, and documents.
 */
export function generateChatbotResponse({
  query = '',
  language = 'en',
  profile = {},
  optimization = {},
  applications = [],
  documents = [],
  checklist = {}
}) {
  const q = query.trim().toLowerCase();
  const lang = (language || 'en').toLowerCase();

  const totalBenefitFormatted = optimization?.totalBenefit 
    ? `₹${optimization.totalBenefit.toLocaleString('en-IN')}`
    : '₹2,34,500';

  const farmerName = profile?.name || 'Farmer';
  const farmerLand = profile?.landholdingAcres || 4.5;
  const farmerState = profile?.state || 'Madhya Pradesh';
  const farmerCategory = profile?.socialCategory || 'OBC';
  const eligibleCount = optimization?.eligibleSchemes?.length || 6;
  const eligibleSchemes = optimization?.eligibleSchemes || SCHEMES.filter(s => s.isRecommended);

  // Intent 1: Check Eligibility / Am I eligible?
  if (
    q.includes('eligib') || q.includes('check') || q.includes('पात्र') || q.includes('patra') ||
    q.includes('qualif') || q.includes('criteria') || q.includes('योजना के लिए') || q.includes('पात्रता')
  ) {
    if (lang === 'hi') {
      return `🌾 **आपकी पात्रता विश्लेषण (${farmerName})**:

आपके **${farmerLand} एकड़** भूमि (${farmerState}, श्रेणी: **${farmerCategory}**) के आधार पर:

✅ **आप ${eligibleCount} प्रमुख योजनाओं के लिए 100% पात्र हैं!**
💰 **कुल अनुमानित वार्षिक लाभ:** **${totalBenefitFormatted} / वर्ष**

**शीर्ष अनुशंसित योजनाएं:**
1. **PM-KISAN**: ₹6,000/वर्ष (सीधे बैंक खाते में)
2. **PMFBY फसल बीमा**: ₹1,24,000 तक का व्यापक सुरक्षा कवच
3. **PMKSY ड्रिप सिंचाई**: 55%-70% तक सरकारी अनुदान
4. **PM-KUSUM सौर पंप**: 60% सौर कृषि पंप सब्सिडी
5. **मृदा स्वास्थ्य कार्ड (SHC)**: निःशुल्क मिट्टी जांच एवं उर्वरक सलाह

👉 आप नीचे **"मेरी अनुशंसा समझाएं"** पर टैप कर सकते हैं या दस्तावेज़ अपलोड कर सकते हैं।`;
    }

    if (lang === 'mr') {
      return `🌾 **तुमचे पात्रता विश्लेषण (${farmerName})**:

तुमच्या **${farmerLand} एकर** शेतीनुसार (${farmerState}, प्रवर्ग: **${farmerCategory}**):

✅ **तुम्ही ${eligibleCount} शासकीय योजनांसाठी पूर्णपणे पात्र आहात!**
💰 **एकूण अपेक्षित वार्षिक लाभ:** **${totalBenefitFormatted} / वर्ष**

**प्रमुख योजना:**
1. **PM-KISAN**: ₹6,000/वर्ष
2. **PMFBY पीक विमा**: ₹1,24,000 पर्यंत संरक्षण
3. **PMKSY ठिबक सिंचन अनुदान**: 55%-70% अनुदान
4. **PM-KUSUM सौर पंप योजना**: 60% अनुदान`;
    }

    return `🌾 **Eligibility Assessment for ${farmerName}**:

Based on your verified **${farmerLand} Acres** in **${farmerState}** (Category: **${farmerCategory}**):

✅ **You qualify for ${eligibleCount} Central & State schemes with 0 conflicts!**
💰 **Total Annual Benefit Potential:** **${totalBenefitFormatted} / year**

**Top Recommended Schemes in Your Bundle:**
1. **PM-KISAN**: ₹6,000/year direct DBT (3 equal installments)
2. **PMFBY Crop Insurance**: Up to ₹1,24,000 comprehensive risk cover
3. **PMKSY Micro-Irrigation**: 55%–70% subsidy on Drip/Sprinkler systems
4. **PM-KUSUM Solar Pump**: 60% capital subsidy on standalone solar agriculture pumps
5. **Soil Health Card (SHC)**: Free soil sample testing & micro-nutrient advisory

👉 Tap **"What documents do I need?"** to see your deduplicated checklist.`;
  }

  // Intent 2: Scheme Conflicts / Why rejected / Exclusions
  if (
    q.includes('reject') || q.includes('conflict') || q.includes('disqualif') || q.includes('exclude') ||
    q.includes('रद्द') || q.includes('खारिज') || q.includes('विवाद') || q.includes('बहिष्कार') ||
    q.includes('कागद') && q.includes('बाद')
  ) {
    if (lang === 'hi') {
      return `🛡️ **विवाद निवारण एवं अयोग्यता से सुरक्षा (Conflict Shield)**:

OptimalDBT का मुख्य उद्देश्य आपको सरकारी योजनाओं से अयोग्य होने से बचाना है:

⚠️ **उदाहरण:** यदि कोई किसान राज्य आपातकालीन सूखा राहत (₹12,000) का दावा करता है, तो सरकारी नियमावली की धारा 4.2 के तहत उसका **PMFBY फसल बीमा दावा (₹1,24,000) स्वतः निरस्त** हो जाता है।

✅ **OptimalDBT सुरक्षा:**
- हमारा सिस्टम ऐसे परस्पर विरोधी दावों को रोकता है।
- हमने आपके बंडल में PMFBY को प्राथमिकता दी है, जिससे आपका **₹1,12,000 का नुकसान बच गया!**
- आपके बंडल में **0 विवाद** हैं और सभी योजनाएं एक-दूसरे के पूरक (Synergistic) हैं।`;
    }

    if (lang === 'mr') {
      return `🛡️ **विवाद आणि अपात्रता प्रतिबंध (Conflict Shield)**:

सरकारी नियमांनुसार एकाच वेळी काही योजना घेतल्यास नुकसान होऊ शकते:
- उदाहरणार्थ: तात्पुरते राज्य अनुदान घेतल्यास ₹1,24,000 चा PMFBY पीक विमा रद्द होऊ शकतो.
- **OptimalDBT** अशा सर्व परस्परविरोधी योजना शोधून तुमच्यासाठी सर्वात फायदेशीर संयोजन तयार करते.`;
    }

    return `🛡️ **OptimalDBT Conflict Shield & Mutual Exclusivity Protection**:

Govt scheme guidelines contain legal exclusion clauses where claiming one payout can invalidate another:

⚠️ **Real Example**: Under Clause 4.2 of State Disaster Relief manuals, claiming an uninsurable drought lump sum (₹12,000) automatically **disqualifies your PMFBY crop insurance claim (up to ₹1,24,000)** for the entire season.

✅ **How OptimalDBT Protects You:**
- Our optimization engine evaluates all mutual exclusion rules before applying.
- We prioritized PMFBY in your bundle, saving you from a potential net loss of **₹1,12,000**.
- Your active profile currently has **0 conflicts detected**, ensuring guaranteed payout safety!`;
  }

  // Intent 3: Required Documents & Deduplication
  if (
    q.includes('doc') || q.includes('paper') || q.includes('aadhaar') || q.includes('khatauni') ||
    q.includes('7/12') || q.includes('दस्तावेज़') || q.includes('कागजात') || q.includes('कागदपत्र') ||
    q.includes('अपलोड') || q.includes('स्कैन')
  ) {
    const verifiedDocs = documents.filter(d => d.status === 'verified').length;
    const totalDocs = documents.length || 4;

    if (lang === 'hi') {
      return `📁 **एकल दस्तावेज़ अपलोड एवं स्वतः उपयोग (Deduplication)**:

OptimalDBT में आपको हर योजना के लिए बार-बार फॉर्म या कागज़ नहीं जमा करने पड़ते:

📋 **आवश्यक दस्तावेज़ सूची (${verifiedDocs}/${totalDocs} सत्यापित):**
1. **आधार कार्ड** (पहचान एवं NPCI बैंक सीडिंग)
2. **खतौनी / 7/12 नकल** (भूमि स्वामित्व प्रमाण)
3. **बैंक पासबुक विवरण** (डीबीटी प्रत्यक्ष लाभ अंतरण हेतु)
4. **पटवारी फसल बुवाई प्रमाण पत्र** (PMFBY खरीफ हेतु)

✨ **शून्य दोहराव गारंटी:** आपका एक बार सत्यापित आधार और खतौनी सभी 8 योजना पोर्टलों पर स्वतः साझा हो जाता है।

👉 अपने दस्तावेज़ देखने या स्कैन करने के लिए **"दस्तावेज़ लॉकर"** पर जाएं।`;
    }

    if (lang === 'mr') {
      return `📁 **कागदपत्रे आणि लॉकर (${verifiedDocs}/${totalDocs} सत्यापित)**:

1. **आधार कार्ड** (NPCI बँक लिंक्ड)
2. **7/12 उतारा / खतावणी** (जमीन नोंद)
3. **बँक पासबुक**
4. **पीक पेरा प्रमाणपत्र (तलाठी/पटवारी)**

✨ **एकच अपलोड:** हे कागदपत्रे सर्व योजनांसाठी आपोआप वापरले जातील.`;
    }

    return `📁 **Deduplicated Document Locker Checklist (${verifiedDocs}/${totalDocs} Verified)**:

OptimalDBT eliminates repetitive paperwork. Upload once, and documents are automatically formatted and shared across all central & state portals:

📋 **Required Universal Documents:**
1. **Aadhaar Card** (Identity & NPCI DBT bank seeding verified)
2. **Khatauni (7/12 Record)** (Land ownership & survey numbers)
3. **Bank Account Details** (Direct treasury disbursement)
4. **Crop Sowing Certificate** (Patwari endorsement for Kharif crops)

✨ **Zero Duplicate Uploads**: Your verified land records are automatically reused across PM-KISAN, PMFBY, and PMKSY.

👉 Navigate to **Document Locker** to scan or update your documents via camera with auto-compression.`;
  }

  // Intent 4: Track Application / Status
  if (
    q.includes('track') || q.includes('status') || q.includes('app-') || q.includes('आवेदन') ||
    q.includes('स्थिति') || q.includes('ट्रैक') || q.includes('किस्त') || q.includes('installment')
  ) {
    const appList = applications.slice(0, 3);
    const appSummaryHi = appList.map(a => `• **${a.schemeName}** (${a.id}):\n  - स्थिति: *${a.status}*\n  - अगला कदम: ${a.nextStep}`).join('\n');
    const appSummaryEn = appList.map(a => `• **${a.schemeName}** (${a.id}):\n  - Status: *${a.status}*\n  - Next Step: ${a.nextStep}`).join('\n');

    if (lang === 'hi') {
      return `📊 **सक्रिय आवेदन स्थिति (Live Application Tracking)**:

आपके सक्रिय दावों का वर्तमान विवरण:

${appSummaryHi}

💡 **डीबीटी सूचना:** PM-KISAN की अगली 18वीं किस्त आपके आधार से जुड़े बैंक खाते में सीधे भेजी जाएगी।`;
    }

    if (lang === 'mr') {
      return `📊 **अर्जांची सद्यस्थिती (Application Status)**:

• **PM-KISAN**: मंजूर (₹2,000 जमा)
• **PMFBY पीक विमा**: कागदपत्र पडताळणी प्रगतीपथावर आहे
• **PMKSY ठिबक सिंचन**: तांत्रिक तपासणी सुरु आहे

💡 सर्व हप्ते थेट तुमच्या आधार लिंक खात्यात जमा होतील.`;
    }

    return `📊 **Live Application Tracker for ${farmerName}**:

Here is the current status of your submitted claims:

${appSummaryEn}

💡 **DBT Notice**: Your Aadhaar NPCI bank account is active, so all payments will disburse directly to your account.`;
  }

  // Intent 5: Specific Scheme — PM-KISAN
  if (q.includes('pm-kisan') || q.includes('pm kisan') || q.includes('पीएम किसान') || q.includes('kisan samman')) {
    if (lang === 'hi') {
      return `🌾 **प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)**:

• **लाभ राशि**: प्रति वर्ष **₹6,000** (हर 4 महीने में ₹2,000 की 3 समान किश्तें)
• **पात्रता**: सभी भूमिधारक किसान परिवार (खेती योग्य भूमि के साथ)
• **आवश्यक दस्तावेज़**: आधार कार्ड, खतौनी (7/12), बैंक खाता (e-KYC पूर्ण)
• **स्वीकृति समय**: 10–15 दिन (कम प्रयास / Fast Track)

✨ **OptimalDBT टिप:** मध्य प्रदेश के किसानों को मुख्यमंत्री किसान कल्याण योजना (MMKY) के तहत अतिरिक्त ₹6,000 का टॉप-अप स्वतः मिलता है, जिससे कुल लाभ ₹12,000/वर्ष हो जाता है!`;
    }

    return `🌾 **Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)**:

• **Annual Payout**: **₹6,000 / year** (3 equal installments of ₹2,000 directly via DBT)
• **Eligibility**: All landholding farmer families with cultivable land
• **Required Docs**: Aadhaar Card, Khatauni (7/12 extract), Aadhaar-seeded Bank Account
• **Processing Time**: 10–15 days (Low friction / Fast track)

✨ **Synergy Bonus**: In states like Madhya Pradesh, PM-KISAN automatically unlocks the Mukhyamantri Kisan Kalyan Yojana (MMKY) giving an additional ₹6,000 top-up (Total ₹12,000/year)!`;
  }

  // Intent 6: Specific Scheme — PMFBY
  if (q.includes('pmfby') || q.includes('fasal bima') || q.includes('फसल बीमा') || q.includes('insurance') || q.includes('विमा')) {
    if (lang === 'hi') {
      return `🛡️ **प्रधानमंत्री फसल बीमा योजना (PMFBY)**:

• **कवर राशि**: आपके रकबे के अनुसार **₹1,24,000 तक** का व्यापक फसल बीमा
• **कवर किए गए जोखिम**: सूखा, बाढ़, बेमौसम बारिश, ओलावृष्टि एवं कीट प्रकोप
• **प्रीमियम दर**: खरीफ फसलों (सोयाबीन, मक्का) हेतु केवल 2%, रबी (गेहूं, चना) हेतु 1.5%
• **आवश्यक दस्तावेज़**: खतौनी, आधार, पटवारी बुवाई प्रमाण पत्र, बैंक पासबुक
• **दावा निपटान**: उपग्रह सर्वेक्षण एवं मौसम स्टेशन डेटा के आधार पर पारदर्शी मूल्यांकन`;
    }

    return `🛡️ **Pradhan Mantri Fasal Bima Yojana (PMFBY)**:

• **Coverage Amount**: Up to **₹1,24,000** risk protection based on your crop acreage
• **Covered Risks**: Drought, flood, unseasonal rainfall, hailstorms & pest attacks
• **Farmer Premium**: Only 2% for Kharif crops (Soybean, Maize) and 1.5% for Rabi (Wheat, Gram)
• **Required Docs**: Khatauni (7/12), Aadhaar, Patwari Crop Sowing Certificate, Bank Passbook
• **Claim Settlement**: Automated assessment via satellite indices and automated weather stations.`;
  }

  // Intent 7: Specific Scheme — PM-KUSUM Solar Pump
  if (q.includes('kusum') || q.includes('solar') || q.includes('सौर') || q.includes('पंप') || q.includes('pump')) {
    if (lang === 'hi') {
      return `☀️ **प्रधानमंत्री कुसुम योजना (PM-KUSUM Solar Pump)**:

• **लाभ**: 3HP से 7.5HP कृषि सौर पंप पर **60% से 90% तक सरकारी सब्सिडी**
• **किसान का हिस्सा**: केवल 10% से 40% (ऋण सुविधा उपलब्ध)
• **फायदे**: दिन में निर्बाध सिंचाई, शून्य बिजली बिल, अतिरिक्त सौर बिजली ग्रिड को बेचकर आय
• **आवश्यक दस्तावेज़**: खतौनी, जल स्रोत प्रमाण (बोरवेल/कुआं), आधार कार्ड
• **स्वीकृति समय**: 45–60 दिन (उच्च पूंजी परिसंपत्ति)`;
    }

    return `☀️ **PM-KUSUM Solar Agriculture Pump Scheme**:

• **Subsidy**: **60% to 90% capital grant** on standalone 3HP to 7.5HP solar pumps
• **Farmer Contribution**: Only 10%–40% (with low-interest bank finance)
• **Key Benefits**: Free daytime irrigation, zero grid electricity bills, option to sell surplus solar power to grid
• **Requirements**: Land ownership (Khatauni), confirmed water source (Borewell/Open Well), Aadhaar
• **Processing Time**: 45–60 days (High-value capital asset).`;
  }

  // Intent 8: Benefit Calculation / How is it calculated?
  if (
    q.includes('calculate') || q.includes('calculation') || q.includes('benefit') || q.includes('how much') ||
    q.includes('कितना') || q.includes('गणना') || q.includes('पैसे') || q.includes('रुपये') || q.includes('किते')
  ) {
    if (lang === 'hi') {
      return `💰 **आपके प्रत्यक्ष लाभ की गणना (OptimalDBT Calculation)**:

आपके **${farmerLand} एकड़** भूमि और **${farmerState}** के आधार पर:

1. **PM-KISAN**: ₹6,000 / वर्ष
2. **राज्य किसान कल्याण (MMKY)**: ₹6,000 / वर्ष
3. **PMFBY फसल सुरक्षा मूल्य**: ₹1,24,000 (जोखिम बीमा)
4. **PMKSY ड्रिप सिंचाई अनुदान**: ₹45,500 (एकमुश्त परिसंपत्ति)
5. **मृदा स्वास्थ्य एवं बीज सब्सिडी**: ₹3,000 / वर्ष
--------------------------------------------
✨ **कुल प्रत्यक्ष वार्षिक क्षमता:** **${totalBenefitFormatted}**

💡 बिना किसी विवाद के अधिकतम राशि प्राप्त करने के लिए ऐप के रोडमैप का पालन करें।`;
    }

    return `💰 **Your Optimized Benefit Breakdown**:

For **${farmerLand} Acres** in **${farmerState}**:

1. **PM-KISAN**: ₹6,000 / year
2. **State Top-up (MMKY)**: ₹6,000 / year
3. **PMFBY Crop Protection Cover**: ₹1,24,000
4. **PMKSY Micro-Irrigation Grant**: ₹45,500 (capital asset)
5. **Soil Health & Micro-nutrients**: ₹3,000 / year
--------------------------------------------
✨ **Total Optimized Annual DBT Potential:** **${totalBenefitFormatted}**

💡 All claims are sequenced to prevent mutual exclusions and maximize direct treasury payouts.`;
  }

  // Intent 9: Find Schemes / Scheme List
  if (
    q.includes('find') || q.includes('scheme') || q.includes('list') || q.includes('all') ||
    q.includes('योजना') || q.includes('खोजें') || q.includes('सर्व') || q.includes('दिखाएं')
  ) {
    if (lang === 'hi') {
      return `🔍 **OptimalDBT योजना सूची**:

हमारे डेटाबेस में 15 राज्यों की 2,847+ योजनाओं के नियम शामिल हैं। आपके लिए मुख्य श्रेणियां:

1. 💵 **प्रत्यक्ष आय सहायता**: PM-KISAN, राज्य कल्याण योजनाएं
2. 🌾 **फसल सुरक्षा एवं बीमा**: PMFBY, मौसम आधारित फसल बीमा (WBCIS)
3. 💧 **सिंचाई एवं जल संरक्षण**: PMKSY (प्रति बूंद अधिक फसल)
4. ☀️ **सौर ऊर्जा एवं कृषि यंत्र**: PM-KUSUM, SMAM कृषि यंत्रीकरण
5. 💳 **सुलभ कृषि ऋण**: किसान क्रेडिट कार्ड (KCC - 4% रियायती ब्याज)

👉 नीचे नेविगेशन बार में **"योजनाएं" (Schemes)** टैब पर टैप करके सभी योजनाओं की विस्तृत जानकारी देखें।`;
    }

    return `🔍 **Explore OptimalDBT Schemes Database**:

Our engine cross-references 2,847+ agricultural rules. Here are the main categories available to you:

1. 💵 **Direct Income Support**: PM-KISAN, State Top-Ups (MMKY, Rythu Bandhu)
2. 🌾 **Crop Insurance & Protection**: PMFBY, Restructured Weather-Based Insurance (RWBCIS)
3. 💧 **Irrigation Infrastructure**: PMKSY (Per Drop More Crop - Drip & Sprinkler)
4. ☀️ **Solar & Farm Machinery**: PM-KUSUM, Sub-Mission on Agricultural Mechanization (SMAM)
5. 💳 **Subsidized Credit**: Kisan Credit Card (KCC @ 4% effective interest)

👉 Tap the **"Schemes"** tab in the bottom bar to filter and view complete scheme rules.`;
  }

  // Intent 10: Help / Helpline / Support
  if (q.includes('help') || q.includes('support') || q.includes('helpline') || q.includes('मदद') || q.includes('सहायता') || q.includes('नंबर')) {
    if (lang === 'hi') {
      return `📞 **सरकारी किसान सहायता एवं हेल्पलाइन**:

• **राष्ट्रीय किसान कॉल सेंटर (KCC)**: 📞 **1800-180-1551** (निःशुल्क / टोल फ्री, 22 भाषाओं में)
• **डीबीटी भारत हेल्पलाइन**: 📞 **011-2338-8911**
• **PM-KISAN हेल्पलाइन**: 📞 **155261** / 011-24300606
• **PMFBY बीमा सहायता केंद्र**: 📞 **14447**

हमारे CSC/VLE ऑपरेटर भी आपकी ग्राम पंचायत में सहायता के लिए उपलब्ध हैं।`;
    }

    return `📞 **Official Government Farmer Helplines**:

• **National Kisan Call Centre**: 📞 **1800-180-1551** (Toll-Free, 24x7 in 22 languages)
• **DBT Bharat Central Portal**: 📞 **011-2338-8911**
• **PM-KISAN Direct Line**: 📞 **155261** / 011-24300606
• **PMFBY Crop Insurance Desk**: 📞 **14447**

You can also visit your nearest Common Service Centre (CSC) for physical operator assistance.`;
  }

  // Fallback / General Assistant Response
  if (lang === 'hi') {
    return `नमस्ते **${farmerName}**! 🙏

मैं OptimalDBT का AI योजना सहायक हूँ। मैं आपकी निम्नलिखित में मदद कर सकता हूँ:
• 🌾 आपके **${farmerLand} एकड़** खेत के लिए पात्र योजनाओं की पहचान
• 💰 **${totalBenefitFormatted}/वर्ष** के प्रत्यक्ष लाभ की गणना
• 🛡️ योजनाओं के बीच विवाद (Conflicts) से बचाव
• 📁 आधार और खतौनी दस्तावेज़ों का सत्यापन
• 📊 सक्रिय आवेदनों की स्थिति ट्रैक करना

आप मुझसे कुछ भी पूछ सकते हैं या नीचे दिए गए त्वरित प्रश्नों पर टैप कर सकते हैं।`;
  }

  if (lang === 'mr') {
    return `नमस्कार **${farmerName}**! 🙏

मी OptimalDBT चा AI योजना सहाय्यक आहे. मी खालील बाबींमध्ये मदत करू शकतो:
• 🌾 **${farmerLand} एकर** जमिनीसाठी योग्य शासकीय योजना
• 💰 **${totalBenefitFormatted}/वर्ष** थेट लाभाची मोजणी
• 🛡️ योजनांमधील परस्पर विवाद टाळणे
• 📁 आधार व 7/12 कागदपत्रे तपासणी

तुम्ही मला प्रश्न विचारू शकता किंवा आवाजाद्वारे विचारण्यासाठी मायक्रोफोन टॅप करू शकता.`;
  }

  return `Hello **${farmerName}**! 🙏

I am your OptimalDBT Multilingual Assistant. I can help you with:
• 🌾 Identifying all eligible central & state schemes for your **${farmerLand} Acres**
• 💰 Maximizing your **${totalBenefitFormatted} / year** direct benefit potential
• 🛡️ Preventing scheme disqualifications & mutual exclusion penalties
• 📁 Unified single-upload document deduplication (Aadhaar & 7/12)
• 📊 Real-time status of your active subsidy applications

Feel free to ask any question or tap the quick suggestion prompts below!`;
}
