/**
 * Win Energy - Internationalization (i18n) Engine
 * Powered by i18next
 * Supports English ('en') and Marathi ('mr')
 */

(function () {
    'use strict';

    // In-memory fallback translation bundles for offline / file:// protocol access
    const bundledResources = {
        en: { translation: {"nav": {"home": "Home", "products": "Our Products", "about": "About Win Energy", "contact": "Contact", "account": "Account", "cart": "Cart", "login": "Log In", "logout": "Log Out", "language": "Language", "dealer": "Become a Dealer"}, "header": {"account": "Account", "cart": "Cart", "login": "Log In", "toggle_menu": "Toggle Menu"}, "footer": {"products_title": "Products", "navigation_title": "Navigation", "quick_help_title": "Quick Help", "contact_title": "Contact", "scalebreck": "ScaleBreck™ Water Conditioner", "hydropulse": "HydroPulse™ Electronic Descalers", "cropsafe": "CropSafe™ Solar Insect Killers", "request_consultation": "Request a Consultation", "chat_whatsapp": "Chat on WhatsApp", "rights": "© 2026 Win Energy. All rights reserved. Made in India.", "pan_india": "Pan-India Delivery & Global Exports", "support": "Support", "sangli_works": "Sangli Works: Plot no. 2038/B, Malgaon Savali Road, Malgaon, Sangli – 416410, Maharashtra, INDIA.", "direct_phone": "Direct Phone / WhatsApp: +91 9595955585", "official_email": "Official Email: contact@winenergy.in / info@winenergy.in"}, "common": {"view_details": "View Details", "learn_more": "Learn More", "add_to_cart": "Add to Cart", "request_quote": "Request Quote", "buy_now": "Buy Now", "explore_range": "Explore Products Range", "contact_engineering": "Contact Engineering Desk", "chemical_free": "100% Chemical-Free", "zero_maintenance": "Zero Maintenance", "solar_powered": "Solar-Powered", "made_in_india": "Made in India", "iso_certified": "ISO 9001 & 14001 Certified", "ce_certified": "CE Certified", "patented_tech": "Patented Clean Technology", "call_direct": "Call +91 9595955585", "whatsapp_direct": "WhatsApp Direct"}, "home": {"hero1_title": "Soft Water For Every Home", "hero1_sub": "Chemical-free physical water descaling with zero recurring salt costs. Protect your home plumbing, geysers, and appliances permanently.", "hero2_title": "Advanced Descaling For Boilers & Pipelines", "hero2_sub": "Eliminate limescale, stop biofouling, and recover heat exchanger efficiency without harsh acids or shutdown downtime.", "hero3_title": "Autonomous Solar Pest Protection For Modern Farms", "hero3_sub": "Target 1,800+ nocturnal agricultural pests with zero pesticide residues. Rain-sensor equipped, completely solar autonomous.", "hero_cta_explore": "Explore Products", "hero_cta_contact": "Consult Engineering Desk", "stat_chem_free": "100% Chemical-Free", "stat_chem_free_sub": "Physical water & pest treatment", "stat_zero_maint": "Zero Maintenance", "stat_zero_maint_sub": "No salts, filters or recurring refills", "stat_solar_pow": "100% Solar-Powered", "stat_solar_pow_sub": "Automatic day/night rain sensing", "stat_pan_india": "Pan-India & Exports", "stat_pan_india_sub": "Engineered in Sangli, Maharashtra", "matcher_title": "Find your recommended Win Energy system", "matcher_sub": "Select your operational challenge to see recommended physical clean-tech specifications", "matcher_opt_scale": "Limescale & Pipe Clogging (Hard Water)", "matcher_opt_pests": "Nocturnal Flying Insects & Crop Damage", "matcher_opt_both": "Dual Challenge: Both Hard Water & Pests", "matcher_rec_scale_tag": "Recommended: HydroPulse Marlin Eco 1.0 / Marlin Mine 1.5", "matcher_rec_scale_title": "HydroPulse™ Physical Water Descaler", "matcher_rec_scale_desc": "Recommended for resolving limescale buildup without salt or chemical softeners. Protects entire plumbing networks and heat exchangers with zero maintenance.", "matcher_rec_pests_tag": "Recommended: CropSafe ECO / CropSafe MINE / CropSafe Pro Solar Insect Killer", "matcher_rec_pests_title": "CropSafe™ Solar Phototropic Pest Killer", "matcher_rec_pests_desc": "Recommended for organic farms, vineyards, and orchards seeking 100% chemical-free pest control powered entirely by solar energy with rain-sensor auto protection.", "matcher_rec_both_tag": "Recommended Package: Win Energy Dual-System Comprehensive Suite", "matcher_rec_both_title": "Integrated Agricultural & Facility Suite", "matcher_rec_both_desc": "Combined deployment of HydroPulse water conditioning and CropSafe solar traps for complete crop yield, drip line, and facility protection.", "sectors_title": "Engineered for Diverse Operational Environments", "sectors_sub": "Proven physical clean technology delivering measurable results across India's domestic, agricultural, and industrial sectors.", "trust_title": "Building Trust with Real Results", "trust_sub": "Trusted by progressive farmers, industrial facility managers, commercial complexes, and poultry operations.", "cta_banner_title": "Consult with our engineering desk for field-proven results", "cta_banner_sub": "Get a customized assessment for your agricultural acreage, industrial pipeline, or residential water setup.", "cta_button": "Request Free Consultation"}, "about": {"title": "About Win Energy", "subtitle": "Engineering Better Solutions for a More Sustainable Future", "overview_p1": "Win Energy is a pioneering clean-technology enterprise based in Sangli, Maharashtra, India. We engineer physical water conditioning and solar agricultural solutions that replace harsh chemicals, salt regenerants, and hazardous pesticides.", "overview_p2": "Founded on core engineering principles, our solutions serve thousands of farmers, industrial facilities, hospitals, hotels, and domestic households across India and international markets.", "mission_title": "Our Mission", "mission_desc": "To empower farms, businesses, and communities with sustainable, high-efficiency physical technologies that eliminate chemical dependency, protect natural water resources, and reduce operational costs.", "vision_title": "Our Vision", "vision_desc": "To be the globally trusted benchmark in non-chemical physical water conditioning and clean agricultural technology, engineered proudly in Maharashtra, India.", "values_title": "Our Core Values", "val_1_title": "Chemical-Free by Design", "val_1_desc": "Every solution we create must eliminate recurring chemical consumption, toxic runoff, and salt pollution.", "val_2_title": "Engineering Precision", "val_2_desc": "Built with high-grade marine alloys, precision microcontrollers, and rigorous quality assurance in our Sangli works.", "val_3_title": "Total Reliability", "val_3_desc": "Designed for zero scheduled maintenance, extreme weather durability, and decade-long operational life.", "val_4_title": "Farmer & Industry First", "val_4_desc": "Real ROI, lower input costs, and field support that stands behind every unit delivered."}, "products": {"title": "Our Products", "subtitle": "Physical clean-tech water conditioning and solar agricultural pest management systems", "filter_all": "All Solutions", "filter_water": "Water Conditioning (HydroPulse & ScaleBreck)", "filter_agri": "Solar Pest Control (CropSafe & BuzzZap)", "scalebreck_title": "SCALEBRECK™ Electronic Water Conditioner", "scalebreck_desc": "Non-chemical physical water conditioner designed for domestic homes, apartments, drip irrigation, and small commercial cooling lines. Treats limescale without removing essential minerals.", "hydropulse_title": "HydroPulse™ Electronic Water Descalers", "hydropulse_desc": "Heavy-duty industrial and agricultural hydro-polarization descaler. Dissolves existing scale, arrests biofouling, and shields heat exchangers, drip systems, and poultry pipelines.", "cropsafe_title": "CropSafe™ Solar Agricultural Insect Killers", "cropsafe_desc": "Autonomous phototropic solar insect trap engineered for orchards, vineyards, tea estates, and open fields. Attracts and neutralizes 1,800+ nocturnal pest species without chemical sprays.", "view_details": "View Technical Specs & Models", "inquire_now": "Inquire for Pricing"}, "contact": {"title": "Contact Win Energy", "subtitle": "Speak directly with our engineering and consultation team", "hq_title": "Factory & Works", "hq_address": "Plot no. 2038/B, Malgaon Savali Road, Malgaon, Sangli – 416410, Maharashtra, INDIA.", "phone_title": "Phone & WhatsApp", "phone_val": "+91 9595955585", "email_title": "Official Email", "email_val": "contact@winenergy.in / info@winenergy.in", "hours_title": "Working Hours", "hours_val": "Monday – Saturday: 9:00 AM – 7:00 PM IST", "form_title": "Send an Inquiry / Request Consultation", "form_name": "Full Name", "form_phone": "Phone Number", "form_email": "Email Address", "form_sector": "Application Sector", "form_sector_placeholder": "Select Sector (Agriculture, Residential, Industry, Poultry, Other)", "form_message": "Your Requirement or Message", "form_message_placeholder": "Describe your pipe diameter, water hardness (TDS/pH), or crop acreage...", "form_submit": "Submit Technical Inquiry", "form_sending": "Submitting...", "dealer_title": "Interested in Dealership / Distributorship?", "dealer_desc": "We partner with leading agricultural suppliers, plumbing consultants, and industrial equipment dealers across India.", "dealer_btn": "Apply for Dealership"}, "cropsafe_page": {"hero_title": "CropSafe™ Solar Agricultural Insect Killers", "hero_sub": "Autonomous phototropic pest management for sustainable, zero-chemical crop protection. Powered by sunlight, built for farmers.", "biology_title": "Our Approach: Understanding Insect Biology", "pests_title": "Targets Over 1,800 Phototactic Flying Pests", "solar_title": "Advanced Solar Power & Intelligent Sensors", "models_title": "CropSafe™ Product Lineup", "impact_title": "Economic & Environmental Impact"}, "hydropulse_page": {"hero_title": "HydroPulse™ Electronic Water Descalers", "hero_sub": "Physical water conditioning technology that eliminates limescale, arrests biofilm, and recovers pipeline efficiency without chemicals or salt.", "tech_title": "The Technology: Hydro-Polarization", "biofilm_title": "Combating Biofilm, Algae & Internal Corrosion", "sectors_title": "Sector Breakdown & Applications", "models_title": "HydroPulse™ Models & Specifications", "advantages_title": "Operational & Environmental Advantages"}, "scalebreck_page": {"hero_title": "SCALEBRECK™ Electronic Water Conditioner", "hero_sub": "Compact, powerful physical water conditioning for homes, commercial establishments, and precision drip lines.", "problems_title": "Hard Water Problems Addressed", "working_title": "Working Principle & 4-Stage Mechanism", "advantages_title": "Key Product Advantages", "sectors_title": "Sector Breakdown & Applications", "lab_title": "Laboratory Water Test Observations"}} },
        mr: { translation: {"nav": {"home": "मुख्यपृष्ठ", "products": "आमची उत्पादने", "about": "विन एनर्जी विषयी", "contact": "संपर्क", "account": "खाते", "cart": "कार्ट", "login": "लॉग इन", "logout": "लॉग आउट", "language": "भाषा", "dealer": "डीलर बना"}, "header": {"account": "खाते", "cart": "कार्ट", "login": "लॉग इन", "toggle_menu": "मेनू उघडा"}, "footer": {"products_title": "उत्पादने", "navigation_title": "नेव्हिगेशन", "quick_help_title": "त्वरित मदत", "contact_title": "संपर्क", "scalebreck": "स्केलScale™ वॉटर कंडिशनर", "hydropulse": "हायड्रोपल्स™ इलेक्ट्रॉनिक डीस्केलर", "cropsafe": "क्रॉपसेफ™ सोलर कीटक नियंत्रक", "request_consultation": "विनामूल्य सल्ला मिळवा", "chat_whatsapp": "व्हॉट्सअॅपवर चॅट करा", "rights": "© २०२६ विन एनर्जी. सर्व हक्क राखीव. भारतात निर्मित.", "pan_india": "संपूर्ण भारतात वितरण आणि जागतिक निर्यात", "support": "मदत व सपोर्ट", "sangli_works": "सांगली प्रकल्प: प्लॉट नं. २०३८/बी, माळगाव-सावळी रोड, माळगाव, सांगली – ४१६४१०, महाराष्ट्र, भारत.", "direct_phone": "थेट फोन / व्हॉट्सअॅप: +९१ ९५९५९५५५८५", "official_email": "अधिकृत ईमेल: contact@winenergy.in / info@winenergy.in"}, "common": {"view_details": "सविस्तर माहिती पहा", "learn_more": "अधिक जाणून घ्या", "add_to_cart": "कार्टमध्ये जोडा", "request_quote": "दरपत्रक मिळवा", "buy_now": "आत्ताच खरेदी करा", "explore_range": "उत्पादने एक्सप्लोर करा", "contact_engineering": "अभियांत्रिकी विभागाशी संपर्क", "chemical_free": "१००% रसायनांशिवाय", "zero_maintenance": "शून्य देखभाल खर्च", "solar_powered": "सौर ऊर्जेवर संचलित", "made_in_india": "भारतात निर्मित (Make in India)", "iso_certified": "ISO ९००१ आणि १४००१ प्रमाणित", "ce_certified": "CE प्रमाणित", "patented_tech": "पेटंटेड स्वच्छ तंत्रज्ञान", "call_direct": "कॉल करा: +९१ ९५९५९५५५८५", "whatsapp_direct": "व्हॉट्सअॅपवर संपर्क"}, "home": {"hero1_title": "प्रत्येक घरासाठी मृदू आणि स्वच्छ पाणी", "hero1_sub": "रासायनिक घटक किंवा मिठाशिवाय आधुनिक वॉटर डीस्केलर. तुमच्या घरातील नळ, पाईपलाईन, गीझर आणि उपकरणांचे कायमस्वरूपी संरक्षण करा.", "hero2_title": "बॉयलर आणि पाईपलाईनसाठी प्रगत डीस्केलिंग", "hero2_sub": "क्षारांचा कठीण थर नाहीसा करा, बायोफाउलिंग रोखा आणि उष्णता विनिमय क्षमता सुधारा—कोणतेही आम्ल किंवा शटडाउन न करता.", "hero3_title": "आधुनिक शेतीसाठी स्वयंचलित सौर कीटक नियंत्रण", "hero3_sub": "१८०० हून अधिक रात्रीच्या उपद्रवी कीटकांचे शून्य कीटकनाशक फवारणीने नियंत्रण. पावसाचा सेन्सर असलेले पूर्णतः सौर ऊर्जेवर चालणारे तंत्रज्ञान.", "hero_cta_explore": "उत्पादने पहा", "hero_cta_contact": "अभियांत्रिकी सल्ला मिळवा", "stat_chem_free": "१००% रसायनांशिवाय", "stat_chem_free_sub": "भौतिक पाणी व कीटक नियंत्रण उपचार", "stat_zero_maint": "शून्य देखभाल", "stat_zero_maint_sub": "मीठ किंवा फिल्टर वारंवार बदलण्याची गरज नाही", "stat_solar_pow": "१००% सौर ऊर्जेवर", "stat_solar_pow_sub": "स्वयंचलित दिवस/रात्र व पाऊस सेन्सर", "stat_pan_india": "पॅन-इंडिया आणि निर्यात", "stat_pan_india_sub": "सांगली, महाराष्ट्रात स्वदेशी निर्मिती", "matcher_title": "तुमच्या गरजेनुसार योग्य विन एनर्जी सिस्टीम निवडा", "matcher_sub": "तुमच्या शेती, घर किंवा उद्योगासमोरील आव्हानावर आधारित योग्य तंत्रज्ञान निवडा", "matcher_opt_scale": "क्षार व पाईप तुंबणे (कठीण/खारे पाणी)", "matcher_opt_pests": "रात्री उडणारे कीटक व पिकांचे नुकसान", "matcher_opt_both": "दोन्ही समस्या: खारे पाणी आणि कीटक प्रादुर्भाव", "matcher_rec_scale_tag": "शिफारस: हायड्रोपल्स मार्लिन इको १.० / मार्लिन माईन १.५", "matcher_rec_scale_title": "हायड्रोपल्स™ फिजिकल वॉटर डीस्केलर", "matcher_rec_scale_desc": "मीठ किंवा रासायनिक सॉफ्टनरशिवाय क्षारांचा थर रोखण्यासाठी अत्यंत प्रभावी. शून्य देखभालीसह संपूर्ण पाईपलाईन आणि उपकरणांचे संरक्षण.", "matcher_rec_pests_tag": "शिफारस: क्रॉपसेफ इको / क्रॉपसेफ माईन / क्रॉपसेफ प्रो सोलर कीटक सापळा", "matcher_rec_pests_title": "क्रॉपसेफ™ सोलर फोटोड्रॉपिक कीटक नियंत्रक", "matcher_rec_pests_desc": "सेंद्रिय शेती, द्राक्षबागा, डाळिंब व फळबागांसाठी १००% रासायनिक फवारणीमुक्त कीटक नियंत्रण. पाऊस सेन्सरसह सौर ऊर्जेवर स्वयंचलित कार्य.", "matcher_rec_both_tag": "शिफारस पॅकेज: विन एनर्जी ड्युअल-सिस्टीम परिपूर्ण संच", "matcher_rec_both_title": "एकात्मिक कृषी व औद्योगिक संच", "matcher_rec_both_desc": "हायड्रोपल्स वॉटर कंडिशनिंग आणि क्रॉपसेफ सोलर ट्रॅप्सचे एकत्रिकरण, ज्यामुळे पिकांचे दर्जेदार उत्पादन वाढते आणि ठिबक सिंचन सुरक्षित राहते.", "sectors_title": "विविध क्षेत्रांसाठी खास डिझाइन केलेले तंत्रज्ञान", "sectors_sub": "भारतातील शेती, उद्योग आणि घरगुती वापरासाठी सिद्ध झालेले नाविन्यपूर्ण तंत्रज्ञान.", "trust_title": "प्रत्यक्ष निकालांसह विश्वास संपादन", "trust_sub": "प्रगतीशील शेतकरी, औद्योगिक कारखाने, हॉटेल्स आणि पोल्ट्री चालकांचा विश्वास.", "cta_banner_title": "तुमच्या शेती किंवा उद्योगासाठी आमच्या तज्ञांशी चर्चा करा", "cta_banner_sub": "तुमचे क्षेत्रफळ, पाईपचा आकार किंवा पाण्याच्या तपासणीनुसार अचूक सल्ला मिळवा.", "cta_button": "विनामूल्य सल्ला मिळवा"}, "about": {"title": "विन एनर्जी विषयी", "subtitle": "अधिक शाश्वत आणि पर्यावरणपूरक भविष्यासाठी प्रगत अभियांत्रिकी सोल्यूशन्स", "overview_p1": "विन एनर्जी ही सांगली, महाराष्ट्र स्थित एक अग्रगण्य क्लीन-टेक कंपनी आहे. आम्ही रासायनिक घटक, मीठ आणि घातक कीटकनाशकांना पर्याय देणारी भौतिक जलशुद्धीकरण आणि सौर कृषी उत्पादने विकसित करतो.", "overview_p2": "अभियांत्रिकीच्या भक्कम पायावर उभारलेली आमची उत्पादने देशभरातील हजारो शेतकरी, औद्योगिक युनिट्स, हॉटेल्स आणि घरगुती ग्राहकांना सेवा देत आहेत.", "mission_title": "आमचे ध्येय (Mission)", "mission_desc": "शेतकरी, व्यावसायिक आणि जनतेला रासायनिक अवलंबित्व संपवणारी, नैसर्गिक संसाधनांचे रक्षण करणारी आणि उत्पादन खर्च कमी करणारी प्रगत स्वदेशी तंत्रज्ञाने पुरवणे.", "vision_title": "आमचा दृष्टिकोन (Vision)", "vision_desc": "रासायनिक विरहीत पाणी कंडिशनिंग आणि स्वच्छ कृषी तंत्रज्ञानामध्ये जागतिक पातळीवर विश्वासार्ह मानके प्रस्थापित करणे.", "values_title": "आमची मूल्ये", "val_1_title": "रसायनमुक्त संकल्पना", "val_1_desc": "प्रत्येक उत्पादनाद्वारे घातक रसायने आणि सांडपाणी प्रदूषण थांबवण्याचा आमचा संकल्प.", "val_2_title": "अचूक अभियांत्रिकी", "val_2_desc": "सांगली येथील प्रकल्पात मरीन-ग्रेड साहित्य आणि अचूक मायक्रोकंट्रोलर्सद्वारे निर्मिती.", "val_3_title": "सर्वोच्च विश्वासार्हता", "val_3_desc": "शून्य नियमित देखभाल, कठीण हवामानातही टिकाऊपणा आणि १०+ वर्षांचे प्रदीर्घ आयुष्य.", "val_4_title": "शेतकरी व ग्राहक प्रथम", "val_4_desc": "कमी गुंतवणूक, जास्त परतावा आणि प्रत्येक युनिटमागे सक्षम तांत्रिक सेवा."}, "products": {"title": "आमची उत्पादने", "subtitle": "भौतिक क्लीन-टेक वॉटर कंडिशनिंग आणि सौर कृषी कीटक नियंत्रण प्रणाली", "filter_all": "सर्व सोल्यूशन्स", "filter_water": "वॉटर कंडिशनिंग (हायड्रोपल्स आणि स्केलScale)", "filter_agri": "सौर कीटक नियंत्रण (क्रॉपसेफ आणि बझझॅप)", "scalebreck_title": "SCALEBRECK™ इलेक्ट्रॉनिक वॉटर कंडिशनर", "scalebreck_desc": "घरे, अपार्टमेंट्स, ठिबक सिंचन आणि व्यावसायिक कूलिंग लाईन्ससाठी डिझाइन केलेले रासायनिक विरहीत वॉटर कंडिशनर. आवश्यक खनिजे न काढता क्षारांचा त्रास संपवते.", "hydropulse_title": "HydroPulse™ इलेक्ट्रॉनिक वॉटर डीस्केलर", "hydropulse_desc": "औद्योगिक व कृषी वापरासाठी हेवी-ड्युटी हायड्रो-पोलरायझेशन डीस्केलर. जुना क्षारांचा थर विरघळवते, बायोफाउलिंग रोखते आणि पाईपलाईनचे आयुष्य वाढवते.", "cropsafe_title": "CropSafe™ सोलर कृषी कीटक नियंत्रक", "cropsafe_desc": "फळबागा, द्राक्षबागा, चहाच्या बागा आणि खुल्या शेतीसाठी स्वयंचलित सौर कीटक सापळा. कीटकनाशकांशिवाय १८०० हून अधिक रात्रीच्या कीटकांना आकर्षित करून नष्ट करते.", "view_details": "तांत्रिक तपशील व मॉडेल्स पहा", "inquire_now": "किंमतीसाठी चौकशी करा"}, "contact": {"title": "विन एनर्जीशी संपर्क साधा", "subtitle": "आमच्या अभियांत्रिकी आणि विक्री सल्लागारांशी थेट चर्चा करा", "hq_title": "कारखाना व प्रकल्प", "hq_address": "प्लॉट नं. २०३८/बी, माळगाव-सावळी रोड, माळगाव, सांगली – ४१६४१०, महाराष्ट्र, भारत.", "phone_title": "फोन आणि व्हॉट्सअॅप", "phone_val": "+९१ ९५९५९५५५८५", "email_title": "अधिकृत ईमेल", "email_val": "contact@winenergy.in / info@winenergy.in", "hours_title": "कामाची वेळ", "hours_val": "सोमवार – शनिवार: सकाळी ९:०० ते संध्याकाळी ७:०० IST", "form_title": "चौकशी पाठवा / सल्ला मिळवा", "form_name": "पूर्ण नाव", "form_phone": "फोन नंबर", "form_email": "ईमेल पत्ता", "form_sector": "वापराचे क्षेत्र", "form_sector_placeholder": "क्षेत्र निवडा (शेती, घरगुती, उद्योग, पोल्ट्री, इतर)", "form_message": "तुमची गरज किंवा संदेश", "form_message_placeholder": "पाईपचा आकार, पाण्याचा कठीणपणा (TDS/pH) किंवा शेतीचे क्षेत्रफळ नमूद करा...", "form_submit": "तांत्रिक चौकशी पाठवा", "form_sending": "पाठवत आहे...", "dealer_title": "डीलरशिप / वितरक बनण्यात रस आहे का?", "dealer_desc": "आम्ही भारतातील अग्रगण्य कृषी वितरक, प्लंबिंग सल्लागार आणि औद्योगिक उपकरणांच्या डीलर्ससोबत भागीदारी करतो.", "dealer_btn": "डीलरशिपसाठी अर्ज करा"}, "cropsafe_page": {"hero_title": "CropSafe™ सोलर कृषी कीटक नियंत्रक", "hero_sub": "शाश्वत आणि शून्य-रासायनिक पीक संरक्षणासाठी स्वयंचलित सौर कीटक सापळा. सूर्याच्या ऊर्जेवर संचलित, बळीराजासाठी समर्पित.", "biology_title": "आमचा दृष्टिकोन: कीटक जीवशास्त्राची अचूक समज", "pests_title": "१८०० हून अधिक रात्रीच्या कीटकांवर प्रभावी नियंत्रण", "solar_title": "प्रगत सौर ऊर्जा आणि इंटेलिजंट सेन्सर्स", "models_title": "CropSafe™ उत्पादन श्रेणी", "impact_title": "आर्थिक आणि पर्यावरणीय फायदा"}, "hydropulse_page": {"hero_title": "HydroPulse™ इलेक्ट्रॉनिक वॉटर डीस्केलर", "hero_sub": "कोणत्याही रसायनांशिवाय किंवा मिठाशिवाय क्षारांचा थर नष्ट करणारे, बायोफिल्म रोखणारे प्रगत फिजिकल वॉटर कंडिशनिंग तंत्रज्ञान.", "tech_title": "तंत्रज्ञान: हायड्रो-पोलरायझेशन (Hydro-Polarization)", "biofilm_title": "बायोफिल्म, शेवाळ आणि अंतर्गत गंज यावर मात", "sectors_title": "विविध क्षेत्रांतील वापर व फायदे", "models_title": "HydroPulse™ मॉडेल्स आणि तपशील", "advantages_title": "कार्यात्मक आणि पर्यावरणीय फायदे"}, "scalebreck_page": {"hero_title": "SCALEBRECK™ इलेक्ट्रॉनिक वॉटर कंडिशनर", "hero_sub": "घरे, व्यावसायिक इमारती आणि ठिबक सिंचनासाठी कॉम्पॅक्ट आणि प्रभावी फिजिकल वॉटर कंडिशनिंग.", "problems_title": "कठीण पाण्यामुळे होणाऱ्या समस्यांवर तोडगा", "working_title": "कार्यप्रणाली आणि ४-टप्प्यांची पद्धत", "advantages_title": "उत्पादनाचे प्रमुख फायदे", "sectors_title": "विविध क्षेत्रांतील वापर", "lab_title": "प्रयोगशाळेतील पाणी तपासणीचे निष्कर्ष"}} }
    };

    // Get initial language preference: URL parameter > localStorage > navigator > default 'en'
    function getInitialLanguage() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            if (langParam && (langParam === 'en' || langParam === 'mr')) {
                localStorage.setItem('i18nextLng', langParam);
                return langParam;
            }
            const saved = localStorage.getItem('i18nextLng');
            if (saved && (saved === 'en' || saved === 'mr')) {
                return saved;
            }
            const navLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (navLang.startsWith('mr')) return 'mr';
        } catch (e) {
            console.warn('Storage or URL access restricted:', e);
        }
        return 'en';
    }

    // Load translation JSON files if running under HTTP/HTTPS, fallback to bundled resources
    async function loadTranslations() {
        const resources = {
            en: { translation: { ...bundledResources.en.translation } },
            mr: { translation: { ...bundledResources.mr.translation } }
        };

        if (window.location.protocol.startsWith('http')) {
            try {
                const [enRes, mrRes] = await Promise.all([
                    fetch('locales/en.json').then(r => r.ok ? r.json() : null),
                    fetch('locales/mr.json').then(r => r.ok ? r.json() : null)
                ]);
                if (enRes) resources.en.translation = Object.assign(resources.en.translation, enRes);
                if (mrRes) resources.mr.translation = Object.assign(resources.mr.translation, mrRes);
            } catch (err) {
                console.log('Serving from bundled translation resources.');
            }
        }
        return resources;
    }

    // Update all translatable elements in the DOM
    function updateDOM(lng) {
        const currentLang = lng || (window.i18next && window.i18next.language) || 'en';
        document.documentElement.lang = currentLang;

        // Apply/toggle Marathi-specific typography class if needed
        if (currentLang === 'mr') {
            document.documentElement.classList.add('lang-mr');
        } else {
            document.documentElement.classList.remove('lang-mr');
        }

        // Translate inner text / html
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;
            const translated = window.i18next.t(key);
            if (translated && translated !== key) {
                if (el.getAttribute('data-i18n-html') === 'true') {
                    el.innerHTML = translated;
                } else {
                    el.textContent = translated;
                }
            }
        });

        // Translate placeholders
        const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
        placeholders.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (key) {
                const translated = window.i18next.t(key);
                if (translated && translated !== key) el.placeholder = translated;
            }
        });

        // Translate titles & aria-labels
        const titles = document.querySelectorAll('[data-i18n-title]');
        titles.forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            if (key) {
                const translated = window.i18next.t(key);
                if (translated && translated !== key) {
                    el.title = translated;
                    if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', translated);
                }
            }
        });

        // Sync all language switcher selects on page
        const switchers = document.querySelectorAll('.lang-switcher');
        switchers.forEach(select => {
            if (select.value !== currentLang) {
                select.value = currentLang;
            }
        });

        // Re-render Lucide icons if any icon was inside translated markup
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    // Public method to change language
    async function setLanguage(lng) {
        if (!lng || (lng !== 'en' && lng !== 'mr')) return;
        try {
            localStorage.setItem('i18nextLng', lng);
        } catch (e) {}

        if (window.i18next) {
            await window.i18next.changeLanguage(lng);
            updateDOM(lng);
            window.dispatchEvent(new CustomEvent('winEnergyLanguageChanged', { detail: { language: lng } }));
        }
    }

    // Initialize i18n
    async function init() {
        const initialLang = getInitialLanguage();
        const resources = await loadTranslations();

        if (window.i18next) {
            await window.i18next.init({
                lng: initialLang,
                fallbackLng: 'en',
                resources: resources
            });

            updateDOM(initialLang);

            // Bind change events to any .lang-switcher element
            document.addEventListener('change', function (e) {
                if (e.target && e.target.classList.contains('lang-switcher')) {
                    setLanguage(e.target.value);
                }
            });
        }
    }

    // Expose global API
    window.WinEnergyI18n = {
        setLanguage: setLanguage,
        getLanguage: function () {
            return (window.i18next && window.i18next.language) || 'en';
        },
        updateDOM: updateDOM
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
