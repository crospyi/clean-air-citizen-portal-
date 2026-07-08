import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react';
import {
  Clock,
  Upload,
  Sparkles,
  MessageSquare,
  MapPin,
  Send,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Compass,
  AlertTriangle,
  User,
  Heart,
  Activity,
  ShieldAlert,
  Sliders,
  CheckCircle,
  HelpCircle,
  Camera,
  Map,
  Building2,
  Trophy,
  Award,
  Zap,
  ChevronDown,
  Settings,
  Volume2,
  Bell,
  PhoneCall,
  Trash2,
  Shield,
  Info,
  ThumbsUp,
  Flag,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IndianCategoryType, UserProfile, CommunityMessage, Community } from '../types';
import AqiMap from './AqiMap';

const INDIAN_STATES_CITIES = [
  {
    stateName: 'Delhi NCR',
    cities: [
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
      { name: 'Noida', lat: 28.5700, lon: 77.3200 },
      { name: 'Gurugram', lat: 28.4595, lon: 77.0266 },
      { name: 'Faridabad', lat: 28.4089, lon: 77.3178 }
    ]
  },
  {
    stateName: 'Maharashtra',
    cities: [
      { name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
      { name: 'Pune', lat: 18.5204, lon: 73.8567 },
      { name: 'Nagpur', lat: 21.1458, lon: 79.0882 }
    ]
  },
  {
    stateName: 'Karnataka',
    cities: [
      { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
      { name: 'Mysuru', lat: 12.2958, lon: 76.6394 }
    ]
  },
  {
    stateName: 'Tamil Nadu',
    cities: [
      { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
      { name: 'Coimbatore', lat: 11.0168, lon: 76.9558 }
    ]
  },
  {
    stateName: 'Uttar Pradesh',
    cities: [
      { name: 'Lucknow', lat: 26.8467, lon: 80.9462 },
      { name: 'Kanpur', lat: 26.4499, lon: 80.3319 }
    ]
  },
  {
    stateName: 'Bihar',
    cities: [
      { name: 'Patna', lat: 25.5941, lon: 85.1376 }
    ]
  },
  {
    stateName: 'Punjab',
    cities: [
      { name: 'Ludhiana', lat: 30.9010, lon: 75.8573 }
    ]
  },
  {
    stateName: 'Haryana',
    cities: [
      { name: 'Gurgaon', lat: 28.4595, lon: 77.0266 }
    ]
  }
];

const INDIAN_POLLUTION_CATEGORIES = [
  {
    id: 'Trash',
    nameEn: 'Garbage Burning',
    emoji: '🗑️',
    defaultModifier: 45,
    presets: [
      'Uncontrolled trash pile combustion emitting black smoke.',
      'Small plastic scrap burning behind housing blocks.',
      'Municipal landfill surface fire causing haze.'
    ]
  },
  {
    id: 'Leaf',
    nameEn: 'Leaf / Bio Burning',
    emoji: '🍂',
    defaultModifier: 25,
    presets: [
      'Garden sweepings and dry leaves set on fire in alley.',
      'Horticultural waste burning in public park.',
      'Agricultural residue burning on city boundary.'
    ]
  },
  {
    id: 'Factory',
    nameEn: 'Industrial Smoke',
    emoji: '🏭',
    defaultModifier: 80,
    presets: [
      'Heavy factory stack emissions without filtration.',
      'Brick kiln dark plume drifting over residential areas.',
      'Small scale smelting unit venting chemical odors.'
    ]
  },
  {
    id: 'Smoke',
    nameEn: 'Tandoor / Cook Smoke',
    emoji: '💨',
    defaultModifier: 15,
    presets: [
      'Commercial charcoal oven ventilation at street level.',
      'Wood-fired street food stall producing dense smoke.',
      'Indoor biomass combustion venting outside.'
    ]
  },
  {
    id: 'Dust',
    nameEn: 'Construction Dust',
    emoji: '🏗️',
    defaultModifier: 35,
    presets: [
      'Uncovered sand transit blowing heavy silica dust.',
      'Demolition site lacking mist sprayers or green netting.',
      'Road dust stirred up by heavy excavation.'
    ]
  },
  {
    id: 'Vehicular',
    nameEn: 'Vehicle Exhaust',
    emoji: '🚗',
    defaultModifier: 30,
    presets: [
      'Heavy commercial vehicle emitting thick black diesel smoke.',
      'Congested junction with idling older rickshaws.',
      'Auto-rickshaw with visible exhaust plume on flyover.'
    ]
  }
];

const CATEGORY_STYLES: Record<string, { active: string; border: string }> = {
  Trash: { active: 'border-violet-500 bg-violet-50/40 text-violet-700 shadow-sm shadow-violet-100', border: 'border-slate-200 hover:border-violet-300' },
  Leaf: { active: 'border-emerald-500 bg-emerald-50/40 text-emerald-700 shadow-sm shadow-emerald-100', border: 'border-slate-200 hover:border-emerald-300' },
  Factory: { active: 'border-rose-500 bg-rose-50/40 text-rose-700 shadow-sm shadow-rose-100', border: 'border-slate-200 hover:border-rose-300' },
  Smoke: { active: 'border-amber-500 bg-amber-50/40 text-amber-700 shadow-sm shadow-amber-100', border: 'border-slate-200 hover:border-amber-300' },
  Dust: { active: 'border-orange-500 bg-orange-50/40 text-orange-700 shadow-sm shadow-orange-100', border: 'border-slate-200 hover:border-orange-300' },
  Vehicular: { active: 'border-indigo-500 bg-indigo-50/40 text-indigo-700 shadow-sm shadow-indigo-100', border: 'border-slate-200 hover:border-indigo-300' }
};

const ACCENT_CLASSES: Record<string, string> = {
  Trash: 'accent-violet-500',
  Leaf: 'accent-emerald-500',
  Factory: 'accent-rose-500',
  Smoke: 'accent-amber-500',
  Dust: 'accent-orange-500',
  Vehicular: 'accent-indigo-500'
};

const SIMULATED_CHATS = [
  {
    id: 'sim-1',
    senderName: 'Rajesh Sharma',
    senderId: 'sim_rajesh',
    state: 'Delhi NCR',
    city: 'New Delhi',
    text: 'Aqi near Noida entry point is touching 250 today, smog is very thick.',
    timestamp: '10:30 AM',
    avatar: '👨🏽‍💼'
  },
  {
    id: 'sim-2',
    senderName: 'Priya Patel',
    senderId: 'sim_priya',
    state: 'Maharashtra',
    city: 'Mumbai',
    text: 'Clear skies in Bandra today, sea breeze is helping a lot!',
    timestamp: '11:15 AM',
    avatar: '👩🏽‍💼'
  },
  {
    id: 'sim-3',
    senderName: 'Anil Kumar',
    senderId: 'sim_anil',
    state: 'Karnataka',
    city: 'Bengaluru',
    text: 'AQI near Outer Ring Road is high due to ongoing metro construction dust.',
    timestamp: '09:45 AM',
    avatar: '👨🏽‍🎓'
  }
];

const CHAT_BOT_REPLIES = [
  "Thanks for the update. We should report this to the local authority.",
  "Agreed, the air quality has been deteriorating over the past few days.",
  "Wearing an N95 mask is highly recommended if you are stepping out.",
  "Hopefully the municipal corporation takes action on this soon.",
  "I have noticed similar smog levels in our adjacent sector as well.",
  "Let's document this on the portal to raise awareness."
];

// Firebase Integrations
import { auth, googleProvider, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  increment,
  arrayUnion,
  where,
  deleteDoc,
  getDocs
} from 'firebase/firestore';

type LanguageCode = 'en' | 'hi' | 'mr' | 'bn' | 'te' | 'ta' | 'kn' | 'gu' | 'pa' | 'ml';

const LANGUAGES: { code: LanguageCode; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
];

const TRANSLATIONS: Record<LanguageCode, {
  appName: string;
  appSubtitle: string;
  fullName: string;
  fullNamePlaceholder: string;
  stateRegion: string;
  city: string;
  registerBtn: string;
  complianceWarning: string;
  selectLang: string;
  activeStation: string;
  scopeStatus: string;
  stateAverage: string;
  airQualityScope: string;
  cityScope: string;
  stateScope: string;
  stateWideDashboard: string;
  districtsReading: string;
  stationsCount: string;
  connectingRadar: string;
  regionalAvgBadge: string;
  stationBadge: string;
  avgPm25: string;
  avgPm10: string;
  healthAdvisory: string;
  avoidOutdoor: string;
  sensitiveRisk: string;
  cleanAir: string;
  registeredSuccessfully: string;
  nowViewingStation: string;
  welcomeMsg: string;
  logoutBtn: string;
  radarTab: string;
  mapTab: string;
  reportTab: string;
  communityTab: string;
  impactTab: string;
  settingsTab: string;
  settingsTitle: string;
  settingsSubtitle: string;
  notificationsLabel: string;
  notificationsDesc: string;
  soundFeedbackLabel: string;
  soundFeedbackDesc: string;
  autoRefreshLabel: string;
  autoRefreshDesc: string;
  faqTitle: string;
  emergencyHelpTitle: string;
  emergencyHelpDesc: string;
  callCentralBoard: string;
  cpcbPhone: string;
  callRegionalOff: string;
  emailSupport: string;
  appDetails: string;
  appDetailsDesc: string;
  resetDataBtn: string;
  advisoryHazardousTitle: string;
  advisoryHazardousDesc: string;
  advisoryUnhealthyTitle: string;
  advisoryUnhealthyDesc: string;
  advisoryGoodTitle: string;
  advisoryGoodDesc: string;
}> = {
  en: {
    appName: "CleanAir India Nexus",
    appSubtitle: "National Citizen Air Quality Intake App",
    fullName: "Full Name",
    fullNamePlaceholder: "e.g. Amit Kumar",
    stateRegion: "State / Region",
    city: "City",
    registerBtn: "Register Account",
    complianceWarning: "By registering, you participate in India's first decentralized, citizen-powered particulate matter index. Every hazard report you submit maps air anomalies in real-time.",
    selectLang: "Select Language / भाषा चुनें",
    activeStation: "Active Station",
    scopeStatus: "Scope Status",
    stateAverage: "State Average",
    airQualityScope: "Air Quality Scope",
    cityScope: "City",
    stateScope: "State",
    stateWideDashboard: "Live State Monitor",
    districtsReading: "Real-time AQI readings across all districts",
    stationsCount: "Stations",
    connectingRadar: "CONNECTING SATELLITE RADAR...",
    regionalAvgBadge: "Regional Average",
    stationBadge: "Station",
    avgPm25: "Avg PM2.5 Conc.",
    avgPm10: "Avg PM10 Conc.",
    healthAdvisory: "Dynamic Health Advisory",
    avoidOutdoor: "Avoid Outdoor Exercises: Air particulate levels are hazardous.",
    sensitiveRisk: "Sensitive Groups At Risk: Children and elderly may face breathing issues.",
    cleanAir: "Pristine Weather: The air is clean and compliant!",
    registeredSuccessfully: "registered successfully",
    nowViewingStation: "Now viewing live active station:",
    welcomeMsg: "Welcome {name}! Your account has been registered successfully.",
    logoutBtn: "Log Out",
    radarTab: "Radar",
    mapTab: "Live Map",
    reportTab: "Report",
    communityTab: "Community",
    impactTab: "Impact Board",
    settingsTab: "Settings",
    settingsTitle: "Control Hub & Settings",
    settingsSubtitle: "Customize language, alerts, and access emergency services",
    notificationsLabel: "Push Pollution Alerts",
    notificationsDesc: "Receive high-priority air hazard notifications for your region",
    soundFeedbackLabel: "Interface Sounds",
    soundFeedbackDesc: "Play acoustic feedback for button clicks and form actions",
    autoRefreshLabel: "Auto-Refresh Data",
    autoRefreshDesc: "Periodically sync latest real-time AQI station telemetry",
    faqTitle: "Frequently Asked Questions",
    emergencyHelpTitle: "Emergency Help & Hotlines",
    emergencyHelpDesc: "Direct contact channels for national and regional environmental bodies",
    callCentralBoard: "Call Central Pollution Control Board (CPCB)",
    cpcbPhone: "1800-11-4545 (Toll Free)",
    callRegionalOff: "Call Regional Air Safety Office",
    emailSupport: "Email Nexus Citizen Support",
    appDetails: "Nexus App Architecture",
    appDetailsDesc: "Decentralized Citizen-Powered PM2.5 / PM10 Indexing Platform. Version 1.2.0-Compliant.",
    resetDataBtn: "Reset App Storage",
    advisoryHazardousTitle: "Avoid Outdoor Exercises:",
    advisoryHazardousDesc: "Air particulate levels are hazardous. Highly advise shutting windows and wearing double-layer N95 masks.",
    advisoryUnhealthyTitle: "Sensitive Groups At Risk:",
    advisoryUnhealthyDesc: "Children and elderly may face slight respiratory coughing or asthma flareups. Limit prolonged physical activity outside.",
    advisoryGoodTitle: "Pristine Weather:",
    advisoryGoodDesc: "The air is clean and compliant! Absolutely safe for early morning walk, yoga, or park sessions."
  },
  hi: {
    appName: "क्लीनएयर इंडिया नेक्सस",
    appSubtitle: "राष्ट्रीय नागरिक वायु गुणवत्ता इनटेक ऐप",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "जैसे: अमित कुमार",
    stateRegion: "राज्य / क्षेत्र",
    city: "शहर",
    registerBtn: "खाता पंजीकृत करें",
    complianceWarning: "पंजीकरण करके, आप भारत के पहले विकेन्द्रीकृत, नागरिक-संचालित कण पदार्थ सूचकांक में भाग लेते हैं। आपके द्वारा प्रस्तुत प्रत्येक खतरा रिपोर्ट वास्तविक समय में हवा की विसंगतियों को दर्शाती है।",
    selectLang: "भाषा चुनें / Select Language",
    activeStation: "सक्रिय स्टेशन",
    scopeStatus: "स्कोप स्थिति",
    stateAverage: "राज्य औसत",
    airQualityScope: "वायु गुणवत्ता स्कोप",
    cityScope: "शहर",
    stateScope: "राज्य",
    stateWideDashboard: "लाइव राज्य मॉनिटर",
    districtsReading: "सभी जिलों में वास्तविक समय AQI रीडिंग",
    stationsCount: "स्टेशन",
    connectingRadar: "सैटेलाइट रडार कनेक्ट किया जा रहा है...",
    regionalAvgBadge: "क्षेत्रीय औसत",
    stationBadge: "स्टेशन",
    avgPm25: "औसत PM2.5 सांद्रता",
    avgPm10: "औसत PM10 सांद्रता",
    healthAdvisory: "गतिशील स्वास्थ्य परामर्श",
    avoidOutdoor: "बाहरी व्यायाम से बचें: हवा में कणों का स्तर खतरनाक है।",
    sensitiveRisk: "संवेदनशील समूह जोखिम में: बच्चों और बुजुर्गों को सांस की समस्या हो सकती है।",
    cleanAir: "स्वच्छ मौसम: हवा साफ और अनुकूल है!",
    registeredSuccessfully: "सफलतापूर्वक पंजीकृत हो गया",
    nowViewingStation: "अब लाइव सक्रिय स्टेशन देख रहे हैं:",
    welcomeMsg: "स्वागत है {name}! आपका खाता सफलतापूर्वक बनाया गया था।",
    logoutBtn: "लॉग आउट",
    radarTab: "रडार",
    mapTab: "लाइव मानचित्र",
    reportTab: "रिपोर्ट",
    communityTab: "समुदाय",
    impactTab: "प्रभाव बोर्ड",
    settingsTab: "सेटिंग्स",
    settingsTitle: "नियंत्रण केंद्र और सेटिंग्स",
    settingsSubtitle: "भाषा, अलर्ट अनुकूलित करें और आपातकालीन सेवाओं तक पहुंचें",
    notificationsLabel: "पुश प्रदूषण अलर्ट",
    notificationsDesc: "अपने क्षेत्र के लिए उच्च-प्राथमिकता वाले वायु संकट सूचनाएं प्राप्त करें",
    soundFeedbackLabel: "इंटरफ़ेस ध्वनियाँ",
    soundFeedbackDesc: "बटन क्लिक और फ़ॉर्म क्रियाओं के लिए ध्वनिक प्रतिक्रिया चलाएं",
    autoRefreshLabel: "ऑटो-रिफ्रेश डेटा",
    autoRefreshDesc: "समय-समय पर नवीनतम वास्तविक समय AQI स्टेशन टेलीमेट्री सिंक करें",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
    emergencyHelpTitle: "आपातकालीन सहायता और हॉटलाइन",
    emergencyHelpDesc: "राष्ट्रीय और क्षेत्रीय पर्यावरण निकायों के लिए सीधे संपर्क चैनल",
    callCentralBoard: "केंद्रीय प्रदूषण नियंत्रण बोर्ड (CPCB) को कॉल करें",
    cpcbPhone: "1800-11-4545 (टोल फ्री)",
    callRegionalOff: "क्षेत्रीय वायु सुरक्षा कार्यालय को कॉल करें",
    emailSupport: "नेक्सस नागरिक सहायता को ईमेल करें",
    appDetails: "नेक्सस ऐप आर्किटेक्चर",
    appDetailsDesc: "विकेंद्रीकृत नागरिक-संचालित PM2.5 / PM10 इंडेक्सिंग प्लेटफॉर्म। संस्करण 1.2.0-अनुपालन।",
    resetDataBtn: "ऐप स्टोरेज रीसेट करें",
    advisoryHazardousTitle: "बाहरी व्यायाम से बचें:",
    advisoryHazardousDesc: "हवा में कणों का स्तर खतरनाक है। खिड़कियां बंद रखने और डबल-लेयर N95 मास्क पहनने की अत्यधिक सलाह दी जाती है।",
    advisoryUnhealthyTitle: "संवेदनशील समूह जोखिम में:",
    advisoryUnhealthyDesc: "बच्चों और बुजुर्गों को सांस लेने में थोड़ी तकलीफ या खांसी हो सकती है। बाहर लंबे समय तक शारीरिक गतिविधि को सीमित करें।",
    advisoryGoodTitle: "स्वच्छ मौसम:",
    advisoryGoodDesc: "हवा साफ और सुरक्षित है! सुबह की सैर, योग या पार्क सत्र के लिए बिल्कुल सुरक्षित।"
  },
  mr: {
    appName: "क्लीनएयर इंडिया नेक्सस",
    appSubtitle: "राष्ट्रीय नागरिक वायु गुणवत्ता इनटेक ॲप",
    fullName: "पूर्ण नाव",
    fullNamePlaceholder: "उदा. अमित कुमार",
    stateRegion: "राज्य / विभाग",
    city: "शहर",
    registerBtn: "खाते नोंदणीकृत करा",
    complianceWarning: "नोंदणी करून, तुम्ही भारताच्या पहिल्या विकेंद्रित, नागरिक-चालित वायु गुणवत्ता निर्देशकात सहभागी होता. तुम्ही सादर केलेला प्रत्येक अहवाल वास्तविक वेळेत हवेच्या विसंगती दर्शवतो.",
    selectLang: "भाषा निवडा / Select Language",
    activeStation: "सक्रिय स्टेशन",
    scopeStatus: "व्याप्ती स्थिती",
    stateAverage: "राज्य सरासरी",
    airQualityScope: "हवेची गुणवत्ता व्याप्ती",
    cityScope: "शहर",
    stateScope: "राज्य",
    stateWideDashboard: "थेट राज्य मॉनिटर",
    districtsReading: "सर्व जिल्ह्यांमध्ये वास्तविक वेळेची AQI रीडिंग",
    stationsCount: "स्टेशन्स",
    connectingRadar: "सॅटेलाइट रडार कनेक्ट करत आहे...",
    regionalAvgBadge: "प्रादेशिक सरासरी",
    stationBadge: "स्टेशन",
    avgPm25: "सरासरी PM2.5",
    avgPm10: "सरासरी PM10",
    healthAdvisory: "गतिशील आरोग्य सल्लागार",
    avoidOutdoor: "बाहेर व्यायाम करणे टाळा: हवेतील प्रदूषण पातळी घातक आहे.",
    sensitiveRisk: "संवेदनशील गट धोक्यात: मुले आणि वृद्धांना श्वास घेण्यास त्रास होऊ शकतो.",
    cleanAir: "स्वच्छ हवामान: हवा स्वच्छ आणि सुसंगत आहे!",
    registeredSuccessfully: "यशस्वीरित्या नोंदणीकृत झाले",
    nowViewingStation: "आता थेट सक्रिय स्टेशन पाहत आहे:",
    welcomeMsg: "स्वागत आहे {name}! तुमचे खाते यशस्वीरित्या तयार केले गेले.",
    logoutBtn: "लॉग आउट",
    radarTab: "रडार",
    mapTab: "थेट नकाशा",
    reportTab: "अहवाल",
    communityTab: "समुदाय",
    impactTab: "प्रभाव बोर्ड",
    settingsTab: "सेटिंग्ज",
    settingsTitle: "नियंत्रण केंद्र आणि सेटिंग्स",
    settingsSubtitle: "भाषा, अलर्ट सानुकूलित करा आणि आपत्कालीन सेवांमध्ये प्रवेश मिळवा",
    notificationsLabel: "प्रदूषण अलर्ट पुश करा",
    notificationsDesc: "तुमच्या क्षेत्रासाठी उच्च-प्राधान्य हवा संकट सूचना मिळवा",
    soundFeedbackLabel: "इंटरफेस आवाज",
    soundFeedbackDesc: "बटण क्लिक आणि फॉर्म क्रिया प्रक्रियेसाठी ध्वनिक अभिप्राय प्ले करा",
    autoRefreshLabel: "स्वयं-रिफ्रेश डेटा",
    autoRefreshDesc: "नियमितपणे नवीन वास्तविक वेळ AQI स्टेशन डेटा समक्रमित करा",
    faqTitle: "नेहमी विचारले जाणारे प्रश्न (FAQ)",
    emergencyHelpTitle: "आपत्कालीन मदत आणि हॉटलाइन",
    emergencyHelpDesc: "राष्ट्रीय आणि प्रादेशिक पर्यावरण संस्थांचे थेट संपर्क चॅनेल",
    callCentralBoard: "केंद्रीय प्रदूषण नियंत्रण मंडळ (CPCB) ला कॉल करा",
    cpcbPhone: "1800-11-4545 (टोल फ्री)",
    callRegionalOff: "प्रादेशिक वायु सुरक्षा कार्यालयाला कॉल करा",
    emailSupport: "नेक्सस नागरिक सहाय्याला ईमेल करा",
    appDetails: "नेक्सस ॲप आर्किटेक्चर",
    appDetailsDesc: "विकेंद्रित नागरिक-चालित PM2.5 / PM10 इंडेक्सिंग प्लॅटफॉर्म. आवृत्ती 1.2.0-सुसंगत.",
    resetDataBtn: "ॲप स्टोरेज रीसेट करा",
    advisoryHazardousTitle: "बाहेर व्यायाम करणे टाळा:",
    advisoryHazardousDesc: "हवेतील प्रदूषण पातळी घातक आहे. खिडक्या बंद ठेवण्याचा आणि डबल-लेयर N95 मास्क वापरण्याचा सल्ला दिला जातो.",
    advisoryUnhealthyTitle: "संवेदनशील गट धोक्यात:",
    advisoryUnhealthyDesc: "मुले आणि वृद्धांना श्वास घेण्यास त्रास किंवा खोकला होऊ शकतो. बाहेर जास्त वेळ काम करणे टाळा.",
    advisoryGoodTitle: "स्वच्छ हवामान:",
    advisoryGoodDesc: "हवा स्वच्छ आणि सुसंगत आहे! सकाळी फिरणे, योगासने किंवा बागेत जाण्यासाठी पूर्णपणे सुरक्षित."
  },
  bn: {
    appName: "ক্লিনএয়ার ইন্ডিয়া নেক্সাস",
    appSubtitle: "জাতীয় নাগরিক বায়ু গুণমান ইনটেক অ্যাপ",
    fullName: "পুরো নাম",
    fullNamePlaceholder: "উদাঃ অমিত কুমার",
    stateRegion: "রাজ্য / অঞ্চল",
    city: "শহর",
    registerBtn: "অ্যাকাউন্ট নিবন্ধন করুন",
    complianceWarning: "নিবন্ধন করে, আপনি ভারতের প্রথম বিকেন্দ্রীভূত, নাগরিক-চালিত বায়ু মানের সূচকে অংশ নিচ্ছেন। আপনার জমা দেওয়া প্রতিটি রিপোর্ট রিয়েল-টাইমে বায়ুর অসঙ্গতিগুলি দেখায়।",
    selectLang: "भाषा चुनें / Select Language",
    activeStation: "সক্রিয় স্টেশন",
    scopeStatus: "পরিসীমা স্থিতি",
    stateAverage: "রাজ্য গড়",
    airQualityScope: "বায়ু মানের পরিসীমা",
    cityScope: "শহর",
    stateScope: "রাজ্য",
    stateWideDashboard: "লাইভ রাজ্য মনিটর",
    districtsReading: "সমস্ত জেলা জুড়ে রিয়েল-টাইম AQI রিডিং",
    stationsCount: "স্টেশন",
    connectingRadar: "স্যাটেলাইট রাডার সংযুক্ত করা হচ্ছে...",
    regionalAvgBadge: "আঞ্চলিক গড়",
    stationBadge: "স্টেশন",
    avgPm25: "গড় PM2.5",
    avgPm10: "গড় PM10",
    healthAdvisory: "গতিশীল স্বাস্থ্য পরামর্শ",
    avoidOutdoor: "বাইরে ব্যায়াম করা এড়িয়ে চলুন: বায়ু দূষণের মাত্রা বিপজ্জনক।",
    sensitiveRisk: "ঝুঁকিপূর্ণ গ্রুপ: শিশু এবং বয়স্কদের শ্বাসকষ্ট হতে পারে।",
    cleanAir: "পরিষ্কার আবহাওয়া: বাতাস পরিষ্কার এবং নিরাপদ!",
    registeredSuccessfully: "সফলভাবে নিবন্ধিত হয়েছে",
    nowViewingStation: "এখন লাইভ সক্রিয় স্টেশন দেখছেন:",
    welcomeMsg: "স্বাগতম {name}! আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে।",
    logoutBtn: "লগ আউট",
    radarTab: "রাডার",
    mapTab: "লাইভ মানচিত্র",
    reportTab: "রিপোর্ট",
    communityTab: "সম্প্রদায়",
    impactTab: "প্রভাব বোর্ড",
    settingsTab: "সেটিংস",
    settingsTitle: "নিয়ন্ত্রণ কেন্দ্র ও সেটিংস",
    settingsSubtitle: "ভাষা, সতর্কতা কাস্টমাইজ করুন এবং জরুরি পরিষেবা অ্যাক্সেস করুন",
    notificationsLabel: "দূষণ সতর্কতা পুশ করুন",
    notificationsDesc: "আপনার অঞ্চলের জন্য উচ্চ-অগ্রাধিকার বায়ু সংকট বিজ্ঞপ্তি পান",
    soundFeedbackLabel: "ইন্টারফেস শব্দ",
    soundFeedbackDesc: "বোতাম ক্লিক এবং ফর্ম ক্রিয়াকলাপের জন্য শব্দ প্রতিক্রিয়া চালান",
    autoRefreshLabel: "অটো-রিফ্রেশ ডেটা",
    autoRefreshDesc: "পর্যায়ক্রমিকভাবে সর্বশেষ রিয়েল-টাইম AQI স্টেশন ডেটা সিঙ্ক করুন",
    faqTitle: "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)",
    emergencyHelpTitle: "জরুরী সহায়তা এবং হটলাইন",
    emergencyHelpDesc: "জাতীয় এবং আঞ্চলিক পরিবেশ সংস্থার সরাসরি যোগাযোগের চ্যানেল",
    callCentralBoard: "কেন্দ্রীয় দূষণ নিয়ন্ত্রণ বোর্ড (CPCB) কল করুন",
    cpcbPhone: "1800-11-4545 (টোল ফ্রি)",
    callRegionalOff: "আঞ্চলিক বায়ু নিরাপত্তা অফিসে কল করুন",
    emailSupport: "নেক্সাস নাগরিক সহায়তায় ইমেল করুন",
    appDetails: "নেক্সাস অ্যাপ আর্কিটেকচার",
    appDetailsDesc: "বিকেন্দ্রীভূত নাগরিক-চালিত PM2.5 / PM10 ইনডেক্সিং প্ল্যাটফর্ম। সংস্করণ ১.২.০-সম্মত।",
    resetDataBtn: "অ্যাপের ডেটা সাফ করুন",
    advisoryHazardousTitle: "বাইরে ব্যায়াম করা এড়িয়ে চলুন:",
    advisoryHazardousDesc: "বায়ু দূষণের মাত্রা বিপজ্জনক। জানালা বন্ধ রাখার এবং ডাবল-লেয়ার N95 মাস্ক পরার পরামর্শ দেওয়া হচ্ছে।",
    advisoryUnhealthyTitle: "ঝুঁকিপূর্ণ গ্রুপ:",
    advisoryUnhealthyDesc: "শিশু এবং বয়স্কদের শ্বাসকষ্ট বা কাশি হতে পারে। বাইরে দীর্ঘ সময় ধরে শারীরিক ক্রিয়াকলাপ সীমিত করুন।",
    advisoryGoodTitle: "পরিষ্কার আবহাওয়া:",
    advisoryGoodDesc: "বাতাস পরিষ্কার এবং নিরাপদ! সকালে হাঁটা, যোগব্যায়াম বা পার্কের জন্য সম্পূর্ণ নিরাপদ।"
  },
  te: {
    appName: "క్లీన్ ఎయిర్ ఇండియా నెక్సస్",
    appSubtitle: "జాతీయ పౌర వాయు నాణ్యత ఇన్‌టేక్ యాప్",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "ఉదా. అమిత్ కుమార్",
    stateRegion: "రాష్ట్రం / ప్రాంతం",
    city: "నగరం",
    registerBtn: "ಖಾತೆ ನೋಂದಾಯಿಸಿ",
    complianceWarning: "నమోదు చేసుకోవడం ద్వారా, మీరు భారతదేశపు మొట్టమొదటి వికేంద్రీకృత, పౌర-శక్తితో నడిచే వాయు నాణ్యత సూచికలో పాల్గొంటారు. మీరు సమర్పించే ప్రతి నివేదిక నిజ సమయంలో వాయు విसंगతులను సూచిస్తుంది.",
    selectLang: "భాషను ఎంచుకోండి / Select Language",
    activeStation: "యాక్టివ్ స్టేషన్",
    scopeStatus: "పరిధి స్థితి",
    stateAverage: "రాష్ట్ర సగటు",
    airQualityScope: "వాయు నాణ్యత పరిధి",
    cityScope: "నగరం",
    stateScope: "రాష్ట్రం",
    stateWideDashboard: "లైవ్ రాష్ట్ర మానిటర్",
    districtsReading: "అన్ని జిల్లాల్లో నిజ సమయ AQI రీడింగ్‌లు",
    stationsCount: "స్టేషన్లు",
    connectingRadar: "శాటిలైట్ రాడార్ అనుసంధానించబడుతోంది...",
    regionalAvgBadge: "ప్రాంతీయ సగటు",
    stationBadge: "స్టేషన్",
    avgPm25: "సగటు PM2.5",
    avgPm10: "సగటు PM10",
    healthAdvisory: "డైనమిక్ హెల్త్ అడ్వైజరీ",
    avoidOutdoor: "బయట వ్యాయామాలు చేయవద్దు: వాయు కాలుష్య శాతం ప్రమాదకరంగా ఉంది.",
    sensitiveRisk: "సున్నిత సమూహాలు ప్రమాదంలో ఉన్నాయి: పిల్లలు, వృద్ధులకు శ్వాస సమస్యలు రావచ్చు.",
    cleanAir: "స్వచ్ఛమైన వాతావరణం: గాలి శుభ్రంగా మరియు సురక్షితంగా ఉంది!",
    registeredSuccessfully: "సఫలవంతంగా నమోదు చేయబడింది",
    nowViewingStation: "ప్రస్తుతం లైవ్ యాక్టివ్ స్టేషన్‌ను వీక్షిస్తున్నారు:",
    welcomeMsg: "స్వాగతం {name}! మీ ఖాతా విజయవంతంగా సృష్టించబడింది.",
    logoutBtn: "లాగ్ అవుట్",
    radarTab: "రాడార్",
    mapTab: "లైవ్ మ్యాప్",
    reportTab: "నివేదిక",
    communityTab: "కమ్యూనిటీ",
    impactTab: "ఇంపాక్ట్ బోర్డ్",
    settingsTab: "సెట్టింగులు",
    settingsTitle: "కంట్రోల్ హబ్ & సెట్టింగులు",
    settingsSubtitle: "భాష, హెచ్చరికలను అనుకూలీకరించండి మరియు అత్యవసర సేవలను యాక్సెస్ చేయండి",
    notificationsLabel: "కాలుష్య పుష్ అలర్ట్స్",
    notificationsDesc: "మీ ప్రాంతం కోసం అధిక-ప్రాధాన్యత గల వాయు ప్రమాద నోటిఫికేషన్‌లను పొందండి",
    soundFeedbackLabel: "ఇంటర్‌ఫేస్ శబ్దాలు",
    soundFeedbackDesc: "బటన్ క్లిక్‌లు మరియు ఫారమ్ చర్యల కోసం శబ్ద అభిప్రాయాన్ని ప్లే చేయండి",
    autoRefreshLabel: "ఆటో-రిఫ్రెష్ డేటా",
    autoRefreshDesc: "తాజా నిజ-సమయ AQI స్టేషన్ టెలిమెట్రీని క్రమానుగతంగా సమకాలీకరించండి",
    faqTitle: "తరచుగా అడిగే ప్రశ్నలు (FAQ)",
    emergencyHelpTitle: "అत्यవసర సహాయం & హాట్‌లైన్లు",
    emergencyHelpDesc: "జాతీయ మరియు ప్రాంతీయ పర్యావరణ సంస్థలకు ప్రత్యక్ష సంప్రదింపు ఛానెల్‌లు",
    callCentralBoard: "సెంట్రల్ పొల్యూషన్ কంట్రోల్ బోర్డ్ (CPCB) కి కాల్ చేయండి",
    cpcbPhone: "1800-11-4545 (టోల్ ఫ్రీ)",
    callRegionalOff: "ప్రాంతీయ వాయు భద్రతా కార్యాలయానికి కాల్ చేయండి",
    emailSupport: "నెక్సస్ పౌర మద్దతుకు ఇమెయిల్ చేయండి",
    appDetails: "నెక్సస్ యాప్ ఆర్కిటెక్చర్",
    appDetailsDesc: "వికేంద్రీకృత పౌర-శక్తితో నడిచే PM2.5 / PM10 ఇండెక్సింగ్ ప్లాట్‌ఫారమ్. వెర్షన్ 1.2.0-అనుకూలమైనది.",
    resetDataBtn: "యాప్ నిల్వను రీసెట్ చేయండి",
    advisoryHazardousTitle: "బయట వ్యాయామాలు చేయవద్దు:",
    advisoryHazardousDesc: "వాయు కాలుష్య శాతం ప్రమాదకరంగా ఉంది. కిటికీలు మూసివేయడం మరియు డబుల్ లేయర్ N95 మాస్క్‌లు ధరించడం మంచిది.",
    advisoryUnhealthyTitle: "సున్నిత సమూహాలు ప్రమాదంలో ఉన్నాయి:",
    advisoryUnhealthyDesc: "పిల్లలు మరియు వృద్ధులు శ్వాసకోశ ఇబ్బందులు ఎదుర్కొనవచ్చు. బయట ఎక్కువ సమయం గడపడం తగ్గించండి.",
    advisoryGoodTitle: "స్వచ్ఛమైన వాతావరణం:",
    advisoryGoodDesc: "గాలి శుభ్రంగా మరియు సురక్షితంగా ఉంది! ఉదయం నడక, యోగా లేదా పార్కుకు వెళ్ళడానికి పూర్తిగా సురక్షితం."
  },
  ta: {
    appName: "கிளீன்ஏர் இந்தியா நெக்ஸஸ்",
    appSubtitle: "தேசிய குடிமக்கள் காற்று தர கண்காணிப்பு செயலி",
    fullName: "முழு பெயர்",
    fullNamePlaceholder: "எ.கா. அமித் குமார்",
    stateRegion: "மாநிலம் / மண்டலம்",
    city: "மாநகரம்",
    registerBtn: "கணக்கை பதிவு செய்க",
    complianceWarning: "பதிவு செய்வதன் மூலம், இந்தியாவின் முதல் பரவலாக்கப்பட்ட காற்று தர குறியீட்டில் நீங்கள் பங்கேற்கிறீர்கள். நீங்கள் சமர்ப்பிக்கும் ஒவ்வொரு அறிக்கையும் நிகழ்நேரத்தில் காற்றின் முரண்பாடுகளைக் காட்டுகிறது.",
    selectLang: "மொழியைத் தேர்ந்தெடுக்கவும் / Select Language",
    activeStation: "செயலில் உள்ள நிலையம்",
    scopeStatus: "வரம்பு நிலை",
    stateAverage: "மாநில சராசரி",
    airQualityScope: "காற்று தர வரம்பு",
    cityScope: "மாநகரம்",
    stateScope: "மாநிலம்",
    stateWideDashboard: "நேரடி மாநில கண்காணிப்பு",
    districtsReading: "அனைத்து மாவட்டங்களிலும் நிகழ்நேர AQI அளவீடுகள்",
    stationsCount: "நிலையங்கள்",
    connectingRadar: "செயற்கைக்கோள் ரேடார் இணைக்கப்படுகிறது...",
    regionalAvgBadge: "வட்டார சராசரி",
    stationBadge: "நிலையம்",
    avgPm25: "சராசரி PM2.5",
    avgPm10: "சராசரி PM10",
    healthAdvisory: "நிகழ்நேர சுகாதார ஆலோசனை",
    avoidOutdoor: "வெளிப்புற உடற்பயிற்சிகளைத் தவிர்க்கவும்: காற்றின் துகள்கள் அபாயகரமானவை.",
    sensitiveRisk: "பாதிப்புக்குள்ளாகும் குழுக்கள்: குழந்தைகள் மற்றும் முதியவர்களுக்கு சுவாசப் பிரச்சனைகள் ஏற்படலாம்.",
    cleanAir: "தூய்மையான வானிலை: காற்று சுத்தமாகவும் பாதுகாப்பாகவும் உள்ளது!",
    registeredSuccessfully: "வெற்றிகரமாக பதிவு செய்யப்பட்டது",
    nowViewingStation: "தற்போது நேரடி நிலையத்தை பார்க்கிறீர்கள்:",
    welcomeMsg: "வரவேற்கிறோம் {name}! உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது.",
    logoutBtn: "வெளியேறு",
    radarTab: "ரேடார்",
    mapTab: "நேரடி வரைபடம்",
    reportTab: "அறிக்கை",
    communityTab: "சமூகம்",
    impactTab: "தாக்கம்",
    settingsTab: "அமைப்புகள்",
    settingsTitle: "கட்டுப்பாட்டு மையம் மற்றும் அமைப்புகள்",
    settingsSubtitle: "மொழி, விழிப்பூட்டல்களைத் தனிப்பயனாக்கி அவசரச் சேவைகளைப் பெறுங்கள்",
    notificationsLabel: "மாசு புஷ் அறிவிப்புகள்",
    notificationsDesc: "உங்கள் பிராந்தியத்திற்கான உயர் முன்னுரிமை காற்று ஆபத்து அறிவிப்புகளைப் பெறுங்கள்",
    soundFeedbackLabel: "இடைமுக ஒலிகள்",
    soundFeedbackDesc: "பொத்தான் கிளிக்குகள் மற்றும் படிவ செயல்களுக்கு ஒலி கருத்துக்களை இயக்கவும்",
    autoRefreshLabel: "தானியங்கி புதுப்பிப்பு",
    autoRefreshDesc: "சமீபத்திய நிகழ்நேர AQI நிலையத் தரவை அவ்வப்போது ஒத்திசைக்கவும்",
    faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)",
    emergencyHelpTitle: "அவசர உதவி & ஹாட்லைன்கள்",
    emergencyHelpDesc: "தேசிய மற்றும் பிராந்திய சுற்றுச்சூழல் அமைப்புகளுக்கான நேரடி தொடர்பு வழிகள்",
    callCentralBoard: "மத்திய மாசு கட்டுப்பாட்டு வாரியத்தை (CPCB) அழைக்கவும்",
    cpcbPhone: "1800-11-4545 (இலவசம்)",
    callRegionalOff: "வட்டார காற்று பாதுகாப்பு அலுவலகத்தை அழைக்கவும்",
    emailSupport: "நெக்ஸஸ் குடிமக்கள் ஆதரவுக்கு மின்னஞ்சல் அனுப்பவும்",
    appDetails: "நெக்ஸஸ் செயலி வடிவமைப்பு",
    appDetailsDesc: "பரவலாக்கப்பட்ட குடிமக்கள் சார்ந்த PM2.5 / PM10 குறியீட்டு தளம். பதிப்பு 1.2.0-இணக்கமானது.",
    resetDataBtn: "செயலி சேமிப்பை மீட்டமைக்கவும்",
    advisoryHazardousTitle: "வெளிப்புற உடற்பயிற்சிகளைத் தவிர்க்கவும்:",
    advisoryHazardousDesc: "காற்றின் துகள்கள் அபாயகரமானவை. ஜன்னல்களை மூடி வைக்கவும், இரட்டை அடுக்கு N95 முகமூடி அணியவும் அறிவுறுத்தப்படுகிறது.",
    advisoryUnhealthyTitle: "பாதிப்புக்குள்ளாகும் குழுக்கள்:",
    advisoryUnhealthyDesc: "குழந்தைகள் மற்றும் முதியவர்களுக்கு சுவாசப் பிரச்சனைகள் அல்லது இருமல் ஏற்படலாம். வெளியில் அதிக நேரம் செலவிடுவதை தவிர்க்கவும்.",
    advisoryGoodTitle: "தூய்மையான வானிலை:",
    advisoryGoodDesc: "காற்று சுத்தமாகவும் பாதுகாப்பாகவும் உள்ளது! அதிகாலை நடைப்பயிற்சி, யோகா போன்றவற்றுக்கு முற்றிலும் பாதுகாப்பானது."
  },
  kn: {
    appName: "ಕ್ಲೀನ್ ಏರ್ ಇಂಡಿಯಾ ನೆಕ್ಸಸ್",
    appSubtitle: "ರಾಷ್ಟ್ರೀಯ ನಾಗರಿಕ ವಾಯು ಗುಣಮಟ್ಟ ಇಂಟೇಕ್ ಆಪ್",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    fullNamePlaceholder: "ಉದಾ. ಅಮಿತ್ ಕುಮಾರ್",
    stateRegion: "ರಾಜ್ಯ / ಪ್ರದೇಶ",
    city: "ನಗರ",
    registerBtn: "ಖಾತೆ ನೋಂದಾಯಿಸಿ",
    complianceWarning: "ನೋಂದಾಯಿಸುವ ಮೂಲಕ, ನೀವು ಭಾರತದ ಮೊದಲ ವಿಕೇಂದ್ರೀಕೃತ ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕದಲ್ಲಿ ಭಾಗವಹಿಸುತ್ತೀರಿ. ನೀವು ಸಲ್ಲಿಸುವ ಪ್ರತಿಯೊಂದು ವರದಿ ನೈಜ ಸಮಯದಲ್ಲಿ ಗಾಳಿಯ ವೈಪರೀತ್ಯಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.",
    selectLang: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ / Select Language",
    activeStation: "ಸಕ್ರಿಯ ನಿಲ್ದಾಣ",
    scopeStatus: "ವ್ಯಾಪ್ತಿ ಸ್ಥಿತಿ",
    stateAverage: "ರಾಜ್ಯ ಸರಾಸರಿ",
    airQualityScope: "ವಾಯು ಗುಣಮಟ್ಟ ವ್ಯಾಪ್ತಿ",
    cityScope: "ನಗರ",
    stateScope: "ರಾಜ್ಯ",
    stateWideDashboard: "ಲೈವ್ ರಾಜ್ಯ ಮಾನಿಟರ್",
    districtsReading: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ನೈಜ-ಸಮಯದ AQI ವಾಚನಗಳು",
    stationsCount: "ನಿಲ್ದಾಣಗಳು",
    connectingRadar: "ಉಪಗ್ರಹ ರೇಡಾರ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...",
    regionalAvgBadge: "ಪ್ರಾದೇಶಿಕ ಸರಾಸರಿ",
    stationBadge: "ನಿಲ್ದಾಣ",
    avgPm25: "ಸರಾಸರಿ PM2.5",
    avgPm10: "ಸರಾಸರಿ PM10",
    healthAdvisory: "ಡೈನಾಮಿಕ್ ಆರೋಗ್ಯ ಸಲಹೆ",
    avoidOutdoor: "ಹೊರಗಿನ ವ್ಯಾಯಾಮ ತಪ್ಪಿಸಿ: ವಾಯು ಮಾಲಿನ್ಯ ಮಟ್ಟ ಅಪಾಯಕಾರಿಯಾಗಿದೆ.",
    sensitiveRisk: "ಸೂಕ್ಷ್ಮ ಗುಂಪುಗಳು ಅಪಾಯದಲ್ಲಿದೆ: ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆ ಉಂಟಾಗಬಹುದು.",
    cleanAir: "ಸ್ವಚ್ಛ ಹವಾಮಾನ: ಗಾಳಿ ಸ್ವಚ್ಛವಾಗಿದೆ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದೆ!",
    registeredSuccessfully: "ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ",
    nowViewingStation: "ಈಗ ಲೈವ್ ಸಕ್ರಿಯ ನಿಲ್ದಾಣವನ್ನು ವೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ:",
    welcomeMsg: "ಸ್ವಾಗತ {name}! ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಚಿಸಲಾಗಿದೆ.",
    logoutBtn: "ಲಾಗ್ ಔಟ್",
    radarTab: "ರೇಡಾರ್",
    mapTab: "ಲೈವ್ ನಕ್ಷೆ",
    reportTab: "ವರದಿ",
    communityTab: "ಸಮುದಾಯ",
    impactTab: "ಇಂಪ್ಯಾಕ್ಟ್ ಬೋರ್ಡ್",
    settingsTab: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    settingsTitle: "ನಿಯಂತ್ರಣ ಕೇಂದ್ರ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    settingsSubtitle: "ಭಾಷೆ, ಎಚ್ಚರಿಕೆಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ ಮತ್ತು ತುರ್ತು ಸೇವೆಗಳನ್ನು ಪ್ರವೇಶಿಸಿ",
    notificationsLabel: "ಮಾಲಿನ್ಯ ಪುಶ್ ಎಚ್ಚರಿಕೆಗಳು",
    notificationsDesc: "ನಿಮ್ಮ ಪ್ರದೇಶಕ್ಕೆ ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ವಾಯು ಮಾಲಿನ್ಯ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸ್ವೀಕರಿಸಿ",
    soundFeedbackLabel: "ಇಂಟರ್ಫೇಸ್ ಶಬ್ದಗಳು",
    soundFeedbackDesc: "ಬಟನ್ ಕ್ಲಿಕ್‌ಗಳು ಮತ್ತು ಫಾರ್ಮ್ ಕ್ರಿಯೆಗಳಿಗಾಗಿ ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಪ್ಲೇ ಮಾಡಿ",
    autoRefreshLabel: "ಸ್ವಯಂ-ರಿಫ್ರೆಶ್ ಡೇಟಾ",
    autoRefreshDesc: "ಇತ್ತೀಚಿನ ನೈಜ-ಸಮಯದ AQI ಕೇಂದ್ರದ ಡೇಟಾವನ್ನು ನಿಯತಕಾಲಿಕವಾಗಿ ಸಿಂಕ್ ಮಾಡಿ",
    faqTitle: "ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)",
    emergencyHelpTitle: "ತುರ್ತು ಸಹಾಯ ಮತ್ತು ಹಾಟ್‌ಲೈನ್‌ಗಳು",
    emergencyHelpDesc: "ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಪರಿಸರ ಸಂಸ್ಥೆಗಳೊಂದಿಗೆ ನೇರ ಸಂಪರ್ಕ ಚಾನೆಲ್‌ಗಳು",
    callCentralBoard: "ಕೇಂದ್ರ ಮಾಲಿನ್ಯ ನಿಯಂತ್ರಣ ಮಂಡಳಿ (CPCB) ಗೆ ಕರೆ ಮಾಡಿ",
    cpcbPhone: "1800-11-4545 (ಶುಲ್ಕ ರಹಿತ)",
    callRegionalOff: "ಪ್ರಾದೇಶಿಕ ವಾಯು ಸುರಕ್ಷತಾ ಕಚೇರಿಗೆ ಕರೆ ಮಾಡಿ",
    emailSupport: "ನೆಕ್ಸಸ್ ನಾಗರಿಕ ಬೆಂಬಲಕ್ಕೆ ಇಮೇಲ್ ಮಾಡಿ",
    appDetails: "ನೆಕ್ಸಸ್ ಆಪ್ ವಿನ್ಯಾಸ",
    appDetailsDesc: "ವಿಕೇಂದ್ರೀಕೃತ ನಾಗರಿಕ-ಚಾಲಿತ PM2.5 / PM10 ಇಂಡೆಕ್ಸಿಂಗ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್. ಆವೃತ್ತಿ 1.2.0-ಅನುಸರಣೆ.",
    resetDataBtn: "ಆಪ್ ಡೇಟಾ ರಿಸೆಟ್ ಮಾಡಿ",
    advisoryHazardousTitle: "ಹೊರಗಿನ ವ್ಯಾಯಾಮ ತಪ್ಪಿಸಿ:",
    advisoryHazardousDesc: "ವಾಯು ಮಾಲಿನ್ಯ ಮಟ್ಟ ಅಪಾಯಕಾರಿಯಾಗಿದೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಲು ಮತ್ತು ಡಬಲ್ ಲೇಯರ್ N95 ಮಾಸ್ಕ್ ಧರಿಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.",
    advisoryUnhealthyTitle: "ಸೂಕ್ಷ್ಮ ಗುಂಪುಗಳು ಅಪಾಯದಲ್ಲಿದೆ:",
    advisoryUnhealthyDesc: "ಮಕ್ಕಳು ಮತ್ತು ಹಿರಿಯರಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ಕೆಮ್ಮು ಉಂಟಾಗಬಹುದು. ಹೊರಗಿನ ದೈಹಿಕ ಚಟುವಟಿಕೆಯನ್ನು ಮಿತಿಗೊಳಿಸಿ.",
    advisoryGoodTitle: "ಸ್ವಚ್ಛ ಹವಾಮಾನ:",
    advisoryGoodDesc: "ಗಾಳಿ ಸ್ವಚ್ಛವಾಗಿದೆ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದೆ! ಮುಂಜಾನೆ ನಡಿಗೆ, ಯೋಗ ಅಥವಾ ಉದ್ಯಾನವನಕ್ಕೆ ಹೋಗಲು ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿದೆ."
  },
  gu: {
    appName: "ક્લીનએર ઇન્ડિયા નેક્સસ",
    appSubtitle: "રાષ્ટ્રીય નાગરિક હવા ગુણવત્તા ઇન્ટેક એપ",
    fullName: "પૂરું નામ",
    fullNamePlaceholder: "દા.ત. અમિત કુમાર",
    stateRegion: "રાજ્ય / પ્રદેશ",
    city: "શહેર",
    registerBtn: "ખાતું રજીસ્ટર કરો",
    complianceWarning: "નોંધણી કરીને, તમે ભારતના પ્રથમ વિકેન્દ્રિત હવા ગુણવત્તા સૂચકાંકમાં ભાગ લો છો. તમારા દ્વારા સબમિટ કરાયેલ દરેક રિપોર્ટ વાસ્તવિક સમયમાં હવાની વિસંગતતા દર્શાવે છે.",
    selectLang: "ભાષા પસંદ કરો / Select Language",
    activeStation: "સક્રિય સ્ટેશન",
    scopeStatus: "વ્યાપ્તિ સ્થિતિ",
    stateAverage: "રાજ્ય સરેરાશ",
    airQualityScope: "હવાની ગુણવત્તા વ્યાપ્તિ",
    cityScope: "શહેર",
    stateScope: "રાજ્ય",
    stateWideDashboard: "લાઇવ રાજ્ય મોનિટર",
    districtsReading: "તમામ જિલ્લાઓમાં વાસ્તવિક સમયની AQI રીડિંગ્સ",
    stationsCount: "સ્ટેશનો",
    connectingRadar: "સેટેલાઇટ રડાર કનેક્ટ થઈ રહ્યું છે...",
    regionalAvgBadge: "પ્રાદેશિક સરેરાશ",
    stationBadge: "સ્ટેશન",
    avgPm25: "સરેરાશ PM2.5",
    avgPm10: "સરેરાશ PM10",
    healthAdvisory: "ગતિશીલ આરોગ્ય સલાહકાર",
    avoidOutdoor: "બહાર વ્યાયામ કરવાનું ટાળો: હવાનું પ્રદૂષણ જોખમી છે.",
    sensitiveRisk: "સંવેદનશીલ જૂથો જોખમમાં: બાળકો અને વૃદ્ધોને શ્વાસ લેવામાં તકલીફ થઈ શકે છે.",
    cleanAir: "સ્વચ્છ હવામાન: હવા સ્વચ્છ અને સુસંગત છે!",
    registeredSuccessfully: "સફળતાપૂર્વક રજીસ્ટર થયેલ છે",
    nowViewingStation: "હવે લાઇવ સક્રિય સ્ટેશન જોઈ રહ્યા છીએ:",
    welcomeMsg: "સ્વાગત છે {name}! તમારું ખાતું સફળતાપૂર્વક બનાવવામાં આવ્યું હતું.",
    logoutBtn: "લોગ આઉટ",
    radarTab: "રડાર",
    mapTab: "લાઇવ નકશો",
    reportTab: "અહેવાલ",
    communityTab: "સમુદાય",
    impactTab: "ઇમ્પેક્ટ બોર્ડ",
    settingsTab: "સેટિંગ્સ",
    settingsTitle: "નિયંત્રણ કેન્દ્ર અને સેટિંગ્સ",
    settingsSubtitle: "ભાષા, ચેતવણીઓ કસ્ટમાઇઝ કરો અને કટોકટીની સેવાઓ મેળવો",
    notificationsLabel: "પ્રદૂષણ ચેતવણીઓ પુશ કરો",
    notificationsDesc: "તમારા વિસ્તાર માટે ઉચ્ચ અગ્રતા હવા પ્રદૂષણ ચેતવણીઓ મેળવો",
    soundFeedbackLabel: "ઇન્ટરફેસ અવાજો",
    soundFeedbackDesc: "બટન ક્લિક્સ અને ફોર્મ ક્રિયાઓ માટે અવાજ પ્રતિસાદ ચલાવો",
    autoRefreshLabel: "ઓટો-રીફ્રેશ ડેટા",
    autoRefreshDesc: "નવીનતમ વાસ્તવિક સમય AQI સ્ટેશન ડેટા સમયાંતરે સમન્વયિત કરો",
    faqTitle: "વારંવાર પૂછાતા પ્રશ્નો (FAQ)",
    emergencyHelpTitle: "ઇમરજન્સી મદદ અને હોટલાઇન",
    emergencyHelpDesc: "રાષ્ટ્રીય અને પ્રાદેશિક પર્યાવરણીય સંસ્થાઓ માટે સીધા સંપર્ક ચેનલો",
    callCentralBoard: "કેન્દ્રીય પ્રદૂષણ નિયંત્રણ બોર્ડ (CPCB) ને કોલ કરો",
    cpcbPhone: "1800-11-4545 (ટોલ ફ્રી)",
    callRegionalOff: "પ્રાદેશિક હવા સુરક્ષા કચેરીને કોલ કરો",
    emailSupport: "નેક્સસ નાગરિક સહાયને ઇમેઇલ કરો",
    appDetails: "નેક્સસ એપ આર્કિટેક્ચર",
    appDetailsDesc: "વિકેન્દ્રિત નાગરિક-સંચાલિત PM2.5 / PM10 ઇન્ડેક્સિંગ પ્લેટફોર્મ. સંસ્કરણ 1.2.0-સુસંગત.",
    resetDataBtn: "એપ સ્ટોરેજ રીસેટ કરો",
    advisoryHazardousTitle: "બહાર વ્યાયામ કરવાનું ટાળો:",
    advisoryHazardousDesc: "હવાનું પ્રદૂષણ જોખમી છે. બારીઓ બંધ રાખવા અને ડબલ-લેયર N95 માસ્ક પહેરવાની સખત સલાહ આપવામાં આવે છે.",
    advisoryUnhealthyTitle: "સંવેદનશીલ જૂથો જોખમમાં:",
    advisoryUnhealthyDesc: "બાળકો અને વૃદ્ધોને શ્વાસ લેવામાં તકલીફ અથવા ઉધરસ થઈ શકે છે. બહાર લાંબા સમય સુધી શારીરિક પ્રવૃત્તિ મર્યાદિત કરો.",
    advisoryGoodTitle: "સ્વચ્છ હવામાન:",
    advisoryGoodDesc: "હવા સ્વચ્છ અને સુરક્ષિત છે! વહેલી સવારે ચાલવા, યોગા અથવા પાર્ક સેશન માટે તદ્દન સુરક્ષિત છે."
  },
  pa: {
    appName: "ਕਲੀਨਏਅਰ ਇੰਡੀਆ ਨੈਕਸਸ",
    appSubtitle: "ਰਾਸ਼ਟਰੀ ਨਾਗਰਿਕ ਹਵਾ ਗੁਣਵੱਤਾ ਇਨਟੇਕ ਐਪ",
    fullName: "ਪੂਰਾ ਨਾਮ",
    fullNamePlaceholder: "ਉਦਾਹਰਨ: ਅਮਿਤ ਕੁਮਾਰ",
    stateRegion: "ਰਾਜ / ਖੇਤਰ",
    city: "ਸ਼ਹਿਰ",
    registerBtn: "ਖਾਤਾ ਰਜਿਸਟਰ ਕਰੋ",
    complianceWarning: "ਰਜਿਸਟਰ ਕਰਕੇ, ਤੁਸੀਂ ਭਾਰਤ ਦੇ ਪਹਿਲੇ ਵਿਕੇਂਦਰੀਕ੍ਰਿਤ ਹਵਾ ਗੁਣਵੱਤਾ ਸੂਚਕਾਂਕ ਵਿੱਚ ਹਿੱਸਾ ਲੈਂਦੇ ਹੋ। ਤੁਹਾਡੀ ਹਰ ਰਿਪੋਰਟ ਰੀਅਲ-ਟਾਈਮ ਵਿੱਚ ਹਵਾ ਦੀਆਂ ਅਸੰਗਤੀਆਂ ਨੂੰ ਦਰਸਾਉਂਦੀ ਹੈ।",
    selectLang: "ਭਾਸ਼ਾ ਚੁਣੋ / Select Language",
    activeStation: "ਸਰਗਰਮ ਸਟੇਸ਼ਨ",
    scopeStatus: "ਸਕੋਪ ਸਥਿਤੀ",
    stateAverage: "ਰਾਜ ਦੀ ਔਸਤ",
    airQualityScope: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਦਾ ਦਾਇਰਾ",
    cityScope: "ਸ਼ਹਿਰ",
    stateScope: "ਰਾਜ",
    stateWideDashboard: "ਲਾਈਵ ਸਟੇਟ ਮਾਨੀਟਰ",
    districtsReading: "ਸਾਰੇ ਜ਼ਿਲ੍ਹਿਆਂ ਵਿੱਚ ਰੀਅਲ-ਟਾਈਮ AQI ਰੀਡਿੰਗ",
    stationsCount: "ਸਟੇਸ਼ਨ",
    connectingRadar: "ਸੈਟੇਲਾਈਟ ਰਾਡਾਰ ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    regionalAvgBadge: "ਖੇਤਰੀ ਔਸਤ",
    stationBadge: "ਸਟੇਸ਼ਨ",
    avgPm25: "ਔਸਤ PM2.5",
    avgPm10: "ਔਸਤ PM10",
    healthAdvisory: "ਗਤੀਸ਼ੀਲ ਸਿਹਤ ਸਲਾਹ",
    avoidOutdoor: "ਬਾਹਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਬਚੋ: ਹਵਾ ਪ੍ਰਦੂਸ਼ਣ ਦਾ ਪੱਧਰ ਖ਼ਤਰਨਾਕ ਹੈ।",
    sensitiveRisk: "ਸੰਵੇਦਨਸ਼ੀਲ ਸਮੂਹ ਖਤਰੇ ਵਿੱਚ: ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਹੋ ਸਕਦੀ ਹੈ।",
    cleanAir: "ਸਾਫ਼ ਮੌਸਮ: ਹਵਾ ਸਾਫ਼ ਅਤੇ ਅਨੁਕੂਲ ਹੈ!",
    registeredSuccessfully: "ਸਫਲਤਾਪੂਰਵਕ ਰਜਿਸਟਰਡ ਹੋ ਗਿਆ",
    nowViewingStation: "ਹੁਣ ਲਾਈਵ ਸਰਗਰਮ ਸਟੇਸ਼ਨ ਦੇਖ ਰਹੇ ਹੋ:",
    welcomeMsg: "ਜੀ ਆਇਆਂ ਨੂੰ {name}! ਤੁਹਾਡਾ ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ ਸੀ।",
    logoutBtn: "ਲੌਗ ਆਉਟ",
    radarTab: "ਰਾਡਾਰ",
    mapTab: "ਲਾਈਵ ਨਕਸ਼ਾ",
    reportTab: "ਰਿਪੋਰਟ",
    communityTab: "ਭਾਈਚਾਰਾ",
    impactTab: "ਪ੍ਰਭਾਵ ਬੋਰਡ",
    settingsTab: "ਸੈਟਿੰਗਾਂ",
    settingsTitle: "ਕੰਟਰੋਲ ਹੱਬ ਅਤੇ ਸੈਟਿੰਗਾਂ",
    settingsSubtitle: "ਭਾਸ਼ਾ, ਅਲਰਟ ਅਨੁਕੂਲਿਤ ਕਰੋ ਅਤੇ ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਤੱਕ ਪਹੁੰਚੋ",
    notificationsLabel: "ਪੁਸ਼ ਪ੍ਰਦੂਸ਼ਣ ਅਲਰਟ",
    notificationsDesc: "ਆਪਣੇ ਖੇਤਰ ਲਈ ਉੱਚ-ਪ੍ਰਾਥਮਿਕਤਾ ਹਵਾ ਪ੍ਰਦੂਸ਼ਣ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ",
    soundFeedbackLabel: "ਇੰਟਰਫੇਸ ਆਵਾਜ਼ਾਂ",
    soundFeedbackDesc: "ਬਟਨ ਕਲਿੱਕਾਂ ਅਤੇ ਫਾਰਮ ਐਕਸ਼ਨਾਂ ਲਈ ਆਵਾਜ਼ ਫੀਡਬੈਕ ਚਲਾਓ",
    autoRefreshLabel: "ਆਟੋ-ਰਿਫ੍ਰੈਸ਼ ਡੇਟਾ",
    autoRefreshDesc: "ਨਵੀਨਤਮ ਰੀਅਲ-ਟਾਈਮ AQI ਸਟੇਸ਼ਨ ਡੇਟਾ ਨੂੰ ਸਮੇਂ-ਸਮੇਂ 'ਤੇ ਸਿੰਕ ਕਰੋ",
    faqTitle: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਣ ਵਾਲੇ ਸਵਾਲ (FAQ)",
    emergencyHelpTitle: "ਐਮਰਜੈਂਸੀ ਮਦਦ ਅਤੇ ਹਾਟਲਾਈਨਾਂ",
    emergencyHelpDesc: "ਰਾਸ਼ਟਰੀ ਅਤੇ ਖੇਤਰੀ ਵਾਤਾਵਰਣ ਸੰਸਥਾਵਾਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ ਚੈਨਲ",
    callCentralBoard: "ਕੇਂਦਰੀ ਪ੍ਰਦੂਸ਼ਣ ਕੰਟਰੋਲ ਬੋਰਡ (CPCB) ਨੂੰ ਕਾਲ ਕਰੋ",
    cpcbPhone: "1800-11-4545 (ਟੋਲ ਫ੍ਰੀ)",
    callRegionalOff: "ਖੇਤਰੀ ਹਵਾ ਸੁਰੱਖਿਆ ਦਫਤਰ ਨੂੰ ਕਾਲ ਕਰੋ",
    emailSupport: "ਨੈਕਸਸ ਨਾਗਰਿਕ ਸਹਾਇਤਾ ਨੂੰ ਈਮੇਲ ਕਰੋ",
    appDetails: "ਨੈਕਸਸ ਐਪ ਆਰਕੀਟੈਕਚਰ",
    appDetailsDesc: "ਵਿਕੇਂਦਰੀਕ੍ਰਿਤ ਨਾਗਰਿਕ-ਸੰਚਾਲਿਤ PM2.5 / PM10 ਇੰਡੈਕਸਿੰਗ ਪਲੇਟਫਾਰਮ। ਸੰਸਕਰਣ 1.2.0-ਅਨੁਕੂਲ।",
    resetDataBtn: "ਐਪ ਸਟੋਰੇਜ ਰੀਸੈਟ ਕਰੋ",
    advisoryHazardousTitle: "ਬਾਹਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਬਚੋ:",
    advisoryHazardousDesc: "ਹਵਾ ਪ੍ਰਦੂਸ਼ਣ ਦਾ ਪੱਧਰ ਖ਼ਤਰਨਾਕ ਹੈ। ਖਿੜਕੀਆਂ ਬੰਦ ਰੱਖਣ ਅਤੇ ਡਬਲ-ਲੇਅਰ N95 ਮਾਸਕ ਪਹਿਨਣ ਦੀ ਸਖ਼ਤ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
    advisoryUnhealthyTitle: "ਸੰਵੇਦਨਸ਼ੀਲ ਸਮੂਹ ਖਤਰੇ ਵਿੱਚ:",
    advisoryUnhealthyDesc: "ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼ ਜਾਂ ਖੰਘ ਹੋ ਸਕਦੀ ਹੈ। ਬਾਹਰ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਸਰੀਰਕ ਗਤੀਵਿਧੀ ਨੂੰ ਸੀਮਤ ਕਰੋ।",
    advisoryGoodTitle: "ਸਾਫ਼ ਮੌਸਮ:",
    advisoryGoodDesc: "ਹਵਾ ਸਾਫ਼ ਅਤੇ ਸੁਰੱਖਿਅਤ ਹੈ! ਸਵੇਰ ਦੀ ਸੈਰ, ਯੋਗਾ ਜਾਂ ਪਾਰਕ ਸੈਸ਼ਨਾਂ ਲਈ ਬਿਲਕੁਲ ਸੁਰੱਖਿਅਤ।"
  },
  ml: {
    appName: "ക്ലീൻ എയർ ഇന്ത്യ നെക്സസ്",
    appSubtitle: "ദേശീയ പൗര വായു ഗുണനിലവാര ഇൻടേക്ക് ആപ്പ്",
    fullName: "പൂർണ്ണ നാമം",
    fullNamePlaceholder: "ഉദാ: അമിത് കുമാർ",
    stateRegion: "സംസ്ഥാനം / പ്രദേശം",
    city: "നഗരം",
    registerBtn: "അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യുക",
    complianceWarning: "രജിസ്റ്റർ ചെയ്യുന്നതിലൂടെ, വായു ഗുണനിലവാര സൂചികയിൽ നിങ്ങൾ പങ്കാളിയാകുന്നു. നിങ്ങൾ സമർപ്പിക്കുന്ന ഓരോ റിപ്പോർട്ടും വായുവിന്റെ ഗുണനിലവാരം തത്സമയം കാണിക്കുന്നു.",
    selectLang: "ഭാഷ തിരഞ്ഞെടുക്കുക / Select Language",
    activeStation: "സജീവ സ്റ്റേഷൻ",
    scopeStatus: "വ്യാപ്തി നില",
    stateAverage: "സംസ്ഥാന ശരാശരി",
    airQualityScope: "വായു ഗുണനിലവാര വ്യാപ്തി",
    cityScope: "നഗരം",
    stateScope: "സംസ്ഥാനം",
    stateWideDashboard: "തത്സമയ സംസ്ഥാന മോണിറ്റർ",
    districtsReading: "എല്ലാ ജില്ലകളിലെയും തത്സമയ AQI റീഡിംഗുകൾ",
    stationsCount: "സ്റ്റേഷനുകൾ",
    connectingRadar: "സാറ്റലൈറ്റ് റഡാർ ബന്ധിപ്പിക്കുന്നു...",
    regionalAvgBadge: "പ്രാദേശിക ശരാശരി",
    stationBadge: "സ്റ്റേഷൻ",
    avgPm25: "ശരാശരി PM2.5",
    avgPm10: "ശരാശരി PM10",
    healthAdvisory: "ഡൈനാമിക് ഹെൽത്ത് അഡ്വൈസറി",
    avoidOutdoor: "പുറത്തിറങ്ങിയുള്ള വ്യായാമങ്ങൾ ഒഴിവാക്കുക: വായു മലിനീകരണം അപകടകരമായ നിലയിലാണ്.",
    sensitiveRisk: "കുട്ടികൾക്കും മുതിർന്നവർക്കും ശ്വാസതടസ്സം നേരിടാൻ സാധ്യതയുണ്ട്.",
    cleanAir: "ശുദ്ധമായ വായു: അന്തരീക്ഷം തികച്ചും സുരക്ഷിതമാണ്!",
    registeredSuccessfully: "വിജയകരമായി രജിസ്റ്റർ ചെയ്തു",
    nowViewingStation: "ഇപ്പോൾ സജീവ സ്റ്റേഷൻ കാണുന്നു:",
    welcomeMsg: "സ്വാഗതം {name}! അക്കൗണ്ട് വിജയകരമായി സൃഷ്ടിച്ചു.",
    logoutBtn: "ലോഗ് ഔട്ട്",
    radarTab: "റഡാർ",
    mapTab: "തത്സമയ മാപ്പ്",
    reportTab: "റിപ്പോർട്ട്",
    communityTab: "കൂട്ടായ്മ",
    impactTab: "ഇംപാക്ട് ബോർഡ്",
    settingsTab: "ക്രമീകരണങ്ങൾ",
    settingsTitle: "കൺട്രോൾ ഹബും ക്രമീകരണങ്ങളും",
    settingsSubtitle: "ഭാഷ, അലേർട്ടുകൾ എന്നിവ ഇഷ്‌ടാനുസൃതമാക്കുക, അടിയന്തിര സേവനങ്ങൾ ലഭ്യമാക്കുക",
    notificationsLabel: "പുഷ് മലിനീകരണ അലേർട്ടുകൾ",
    notificationsDesc: "നിങ്ങളുടെ പ്രദേശത്തെ വായു മലിനീകരണ അലേർട്ടുകൾ മുൻഗണനാടിസ്ഥാനത്തിൽ സ്വീകരിക്കുക",
    soundFeedbackLabel: "ഇന്റർഫേസ് ശബ്ദങ്ങൾ",
    soundFeedbackDesc: "ബട്ടൺ ക്ലിക്കുകൾക്കും ഫോം നടപടികൾക്കും ശബ്ദ പ്രതികരണം നൽകുക",
    autoRefreshLabel: "ഓട്ടോ-റിഫ്രഷ് ഡാറ്റ",
    autoRefreshDesc: "തത്സമയ AQI സ്റ്റേഷൻ ടെലിമെട്രി ഡാറ്റ സമയാസമയങ്ങളിൽ സിങ്ക് ചെയ്യുക",
    faqTitle: "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQ)",
    emergencyHelpTitle: "അടിയന്തിര സഹായവും ഹോട്ട്ലൈനുകളും",
    emergencyHelpDesc: "ദേശീയ, പ്രാദേശിക പരിസ്ഥിതി ബോർഡുകളിലേക്ക് നേരിട്ട് ബന്ധപ്പെടാനുള്ള മാർഗ്ഗങ്ങൾ",
    callCentralBoard: "കേന്ദ്ര മലിനീകരണ നിയന്ത്രണ ബോർഡിലേക്ക് (CPCB) വിളിക്കുക",
    cpcbPhone: "1800-11-4545 (ടോൾ ഫ്രീ)",
    callRegionalOff: "പ്രാദേശിക എയർ സേഫ്റ്റി ഓഫീസിലേക്ക് വിളിക്കുക",
    emailSupport: "നെക്സസ് സിറ്റിസൺ സപ്പോർട്ടുമായി ഇമെയിലിൽ ബന്ധപ്പെടുക",
    appDetails: "നെക്സസ് ആപ്പ് ആർക്കിടെക്ചർ",
    appDetailsDesc: "വികേന്ദ്രീകൃത പൗര-ശക്തിയിലുള്ള PM2.5 / PM10 സൂചിക പ്ലാറ്റ്‌ഫോം. പതിപ്പ് 1.2.0 അനുയോജ്യം.",
    resetDataBtn: "ആപ്പ് ഡാറ്റ റീസെറ്റ് ചെയ്യുക",
    advisoryHazardousTitle: "പുറത്തിറങ്ങിയുള്ള വ്യായാമങ്ങൾ ഒഴിവാക്കുക:",
    advisoryHazardousDesc: "വായു മലിനീകരണം അപകടകരമായ നിലയിലാണ്. ജനലുകൾ അടച്ചിടാനും ഇരട്ട-ലെയർ N95 മാസ്ക് ധരിക്കാനും ശക്തമായി നിർദ്ദേശിക്കുന്നു.",
    advisoryUnhealthyTitle: "കുട്ടികൾക്കും മുതിർന്നവർക്കും:",
    advisoryUnhealthyDesc: "കുട്ടികൾക്കും മുതിർന്നവർക്കും ശ്വാസതടസ്സം നേരിടാൻ സാധ്യതയുണ്ട്. പുറത്തു സമയം ചെലവഴിക്കുന്നത് പരമാവധി കുറയ്ക്കുക.",
    advisoryGoodTitle: "ശുദ്ധമായ വായു:",
    advisoryGoodDesc: "അന്തരീക്ഷം തികച്ചും സുരക്ഷിതമാണ്! രാവിലെ നടക്കാനും യോഗ ചെയ്യാനും തികച്ചും അനുയോജ്യം."
  }
};

const LOCALIZED_STRINGS: Record<string, Record<LanguageCode, string>> = {
  "Leaf": {
    en: "Leaf Burning", hi: "पत्तियां जलाना", mr: "पाने जाळणे", bn: "পাতা পোড়ানো", te: "ఆకులు కాల్చడం", ta: "இலை எரிப்பு", kn: "ಎಲೆಗಳನ್ನು ಸುಡುವುದು", gu: "પાંદડા બાળવા", pa: "ਪੱਤੇ ਸਾੜਨਾ", ml: "ഇലകൾ കത്തിക്കൽ"
  },
  "Factory": {
    en: "Factory Smoke", hi: "फैक्ट्री का धुआं", mr: "कारखान्याचा धूर", bn: "কারখানার ধোঁয়া", te: "ఫ్యాక్టరీ పొగ", ta: "தொழிற்சாலை புகை", kn: "ಕಾರ್ಖಾನೆ ಹೊಗೆ", gu: "કારખાનાનો ધુમાડો", pa: "ਫੈਕਟਰੀ ਦਾ ਧੂੰਆਂ", ml: "ഫാക്ടറി പുക"
  },
  "Smoke": {
    en: "Smoke / Smog", hi: "धुआं / स्मॉग", mr: "धूर / स्मॉग", bn: "धোঁया / স্মগ", te: "పొగ / స్మాగ్", ta: "புகை / புகைமூட்டம்", kn: "ಹೊಗೆ / സ്മഗ്", gu: "ધુમાડો / સ્મોગ", pa: "ਧੂੰਆਂ / ਸਮੌਗ", ml: "പുക / പുകമഞ്ഞ്"
  },
  "Vehicular": {
    en: "Vehicle Exhaust", hi: "वाहनों का धुआं", mr: "वाहनांचा धूर", bn: "যানবাহনের ধোঁয়া", te: "వాహన ఉద్గారాలు", ta: "வாகன புகை", kn: "ವಾಹನ ಹೊಗೆ", gu: "વાહનનો ધુમાડો", pa: "ਵਾਹਨਾਂ ਦਾ ਧੂੰਆਂ", ml: "വാഹന പുക"
  },
  "Enter description...": {
    en: "e.g. Thick dark plastic trash smoke spreading behind the block shops...",
    hi: "जैसे: ब्लॉक दुकानों के पीछे प्लास्टिक कचरे का गाढ़ा काला धुआं फैल रहा है...",
    mr: "उदा. दुकानांच्या मागे प्लास्टिक कचऱ्याचा गडद काळा धूर पसरत आहे...",
    bn: "যেমন: ব্লকের দোকানের পেছনে প্লাস্টিকের আবর্জনার ঘন কালো ধোঁয়া ছড়িয়ে পড়ছে...",
    te: "ఉదా. బ్లాక్ షాపుల వెనుక ప్లాస్టిక్ చెత్త నుండి దట్టమైన నల్లటి పొగ వ్యాపిస్తోంది...",
    ta: "எ.கா. கடைகளுக்குப் பின்னால் பிளாஸ்டிக் குப்பைகளிலிருந்து அடர்ந்த கரும்புகை பரவுகிறது...",
    kn: "ಉದಾ. ಬ್ಲಾಕ್ ಅಂಗಡಿಗಳ ಹಿಂದೆ ಪ್ಲಾಸ್ಟಿಕ್ ಕಸದಿಂದ ದಟ್ಟವಾದ ಕಪ್ಪು ಹೊಗೆ ಹರಡುತ್ತಿದೆ...",
    gu: "દા.ત. દુકાનો પાછળ પ્લાસ્ટિકના કચરાનો ઘાટો કાળો ધુમાડો ફેલાઈ રહ્યો છે...",
    pa: "ਉਦਾਹรਨ ਲਈ: ਦੁਕਾਨਾਂ ਦੇ ਪਿੱਛੇ ਪਲਾਸਟਿਕ ਦੇ ਕੂੜੇ ਦਾ ਸੰਘਣਾ ਕਾਲਾ ਧੂੰਆਂ ਫੈਲ ਰਿਹਾ ਹੈ...",
    ml: "ഉദാ. കടകൾക്ക് പിന്നിൽ പ്ലാസ്റ്റിക് മാലിന്യങ്ങൾ കത്തിക്കുന്ന കനത്ത പുക പടരുന്നു..."
  },
  "Camera Viewport": {
    en: "Camera Viewport", hi: "कैमरा व्यूपोर्ट", mr: "कॅमेरा व्ह्यूपोर्ट", bn: "ক্যামেরা ভিউপোর্ট", te: "కెమెరా వ్యూపోర్ట్", ta: "கேமரா காட்சி", kn: "ಕ್ಯಾಮೆರಾ ವ್ಯೂಪೋರ್ಟ್", gu: "કેમેરા વ્યુપોર્ટ", pa: "ਕੈਮਰਾ ਵਿਊਪੋਰਟ", ml: "ക്യാമറ ദൃശ്യം"
  },
  "REAL GPS ACTIVE": {
    en: "REAL GPS ACTIVE", hi: "वास्तविक जीपीएस सक्रिय", mr: "थेट जीपीएस सक्रिय", bn: "রিয়েল জিপিএস সক্রিয়", te: "రియల్ GPS యాక్టివ్", ta: "உண்மையான ஜிபிஎஸ் இயங்குகிறது", kn: "ನೈಜ ಜಿಪಿഎസ് ಸಕ್ರಿಯ", gu: "રિયલ જીપીએસ એક્ટિવ", pa: "ਅਸਲ GPS ਐਕਟਿਵ", ml: "തത്സമയ ജിപിഎസ് സജീവം"
  },
  "MOCK SIMULATION NODE": {
    en: "MOCK SIMULATION NODE", hi: "सिमुलेशन नोड", mr: "सिम्युलेशन नोड", bn: "সিমুলেশন নোড", te: "సిమ్యులేషన్ నోడ్", ta: "உருவகப்படுத்துதல் முனையம்", kn: "ಸಿಮ್ಯುಲೇಶನ್ ನೋಡ್", gu: "સિગ્નલ സിમ્યુલેશન નોડ", pa: "ਸਿਮੂਲੇਸ਼ਨ ਨੋਡ", ml: "സിമുലേഷൻ നോഡ്"
  },
  "LIVE VIEWPORT": {
    en: "LIVE VIEWPORT", hi: "लाइव दृश्य", mr: "थेट व्ह्यूपोर्ट", bn: "লাইভ ভিউপোর্ট", te: "లైవ్ వ్యూపోర్ట్", ta: "நேரடி காட்சி", kn: "ಲೈವ್ ವ್ಯೂಪೋರ್ಟ್", gu: "લાઇવ વ્યુપોર્ટ", pa: "ਲਾਈਵ ਵਿਊਪੋਰਟ", ml: "തത്സമയ ദൃശ്യം"
  },
  "Snap Simulated Photo": {
    en: "Snap Simulated Photo", hi: "सिम्युलेटेड फोटो खींचे", mr: "सिम्युलेटेड फोटो काढा", bn: "অনুকরণীয় ছবি নিন", te: "సిమ్యులేటెడ్ ఫోటో తీసుకోండి", ta: "உருவகப்படுத்தப்பட்ட படம் எடுக்கவும்", kn: "ಸಿಮ್ಯುಲೇಶನ್ ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ", gu: "નકલી ફોટો ખેંચો", pa: "ਸਿਮੂਲੇਟਿਡ ਫੋਟੋ ਲਓ", ml: "സിമുലേഷൻ ഫോട്ടോ എടുക്കുക"
  },
  "Snap Photo": {
    en: "Snap Photo", hi: "फोटो लें", mr: "फोटो काढा", bn: "ছবি নিন", te: "ఫోటో తీసుకోండి", ta: "படம் எடுக்கவும்", kn: "ಫೋಟೋ ಸೆರೆಹಿಡಿಯಿರಿ", gu: "ફોટો લો", pa: "ਫੋਟੋ ਲਓ", ml: "ഫോട്ടോ എടുക്കുക"
  },
  "Cancel": {
    en: "Cancel", hi: "रद्द करें", mr: "रद्द करा", bn: "বাতিল করুন", te: "రద్దు చేయి", ta: "ரத்து செய்", kn: "ರದ್ದುಮಾಡಿ", gu: "ರદ કરો", pa: "ਰੱਦ ਕਰੋ", ml: "റദ്ദാക്കുക"
  },
  "Secure Google Profile": {
    en: "Secure Google Profile", hi: "सुरक्षित गूगल प्रोफाइल", mr: "सुरक्षित गुगल प्रोफाइल", bn: "सुरक्षित গুগল প্রোফাইল", te: "సురక్షితమైన గూగుల్ ప్రొఫైల్", ta: "பாதுகாப்பான கூகிள் சுயவிவரம்", kn: "ಸುರಕ್ಷಿತ ಗೂಗಲ್ ಪ್ರೊಫೈಲ್", gu: "સુરક્ષિત ગૂગલ પ્રોફાઇલ", pa: "ਸੁਰੱਖਿਅਤ ਗੂਗਲ ਪ੍ਰੋਫਾਈਲ", ml: "സുരക്ഷിത ഗൂഗിൾ പ്രൊഫൈൽ"
  },
  "Connected via Google Auth": {
    en: "Connected via Google Auth", hi: "गूगल ऑथ के माध्यम से जुड़े", mr: "गुगल ऑथद्वारे कनेक्टेड", bn: "গுகল অথ দিয়ে সংযুক্ত", te: "గూగుల్ ఆథ్ ద్వారా కనెక్ట్ చేయబడింది", ta: "கூகிள் அங்கீகாரம் மூலம் இணைக்கப்பட்டுள்ளது", kn: "ಗೂಗಲ್ ಅಥ್ ಮೂಲಕ ಸಂಪರ್കಿಸಲಾಗಿದೆ", gu: "ગૂગલ ઓથ દ્વારા કનેક્ટેड", pa: "ਗੂਗਲ ਪ੍ਰਮਾਣੀਕਰਨ ਰਾਹੀਂ ਕਨੈਕਟ ਕੀਤਾ", ml: "ഗൂഗിൾ ഓത്ത് വഴി ബന്ധിപ്പിച്ചിരിക്കുന്നു"
  },
  "Your Broadcast History": {
    en: "Your Broadcast History", hi: "आपका प्रसारण इतिहास", mr: "तुमचा प्रसारणाचा इतिहास", bn: "আপনার সম্প্রচার ইতিহাস", te: "మీ ప్రసార చరిత్ర", ta: "உங்கள் ஒளிபரப்பு வரலாறு", kn: "ನಿಮ್ಮ ಪ್ರಸಾರ ಇತಿಹಾಸ", gu: "તમારો પ્રસારણ ઇતિહાસ", pa: "ਤੁਹਾਡਾ ਪ੍ਰਸਾਰਣ ਇਤਿਹਾਸ", ml: "നിങ്ങളുടെ ബ്രോഡ്കാസ്റ്റ് ചരിത്രം"
  },
  "Manage and view your submitted real-time air hazard reports.": {
    en: "Manage and view your submitted real-time air hazard reports.", hi: "आपके द्वारा सबमिट की गई वास्तविक समय की वायु खतरा रिपोर्ट प्रबंधित और देखें।", mr: "तुम्ही सबमिट केलेले थेट वायू संकट अहवाल व्यवस्थापित करा आणि पहा.", bn: "আপনার জমা দেওয়া রিয়েল-টাইম বায়ুর ঝুঁকির প্রতিবেদনগুলি পরিচালনা এবং দেখুন।", te: "మీరు సమర్పించిన నిజ-సమయ గాలి ప్రమాద నివేదికలను నిర్వహించండి మరియు వీక్షించండి.", ta: "நீங்கள் சமர்ப்பித்த நிகழ்நேர காற்று மாசு அறிக்கைகளை ನಿர்வகிக்கவும் மற்றும் பார்க்கவும்.", kn: "ನೀವು ಸಲ್ಲಿಸಿದ ನೈಜ-ಸಮಯದ ವಾಯು ಅಪಾಯದ ವರದಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ವೀಕ್ಷಿಸಿ.", gu: "તમારા સબમિટ કરેલા રીઅલ-ટાઇમ વાયુ જોખમ અહેવાલોનું સંચાલન અને નિરીક્ષણ કરો.", pa: "ਤੁਹਾਡੇ ਦੁਆਰਾ ਜਮ੍ਹਾਂ ਕੀਤੀਆਂ ਗਈਆਂ ਅਸਲ-ਸമੇਂ ਦੀਆਂ ਹਵਾ ਦੇ ਖਤਰੇ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਦਾ ਪ੍ਰਬੰਧन ਅਤੇ ਨਿਰੀਖਣ ਕਰੋ।", ml: "നിങ്ങൾ സമർപ്പിച്ച തത്സമയ വായു മലിനീകരണ റിപ്പോർട്ടുകൾ കാണുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക."
  },
  "No reports found.": {
    en: "No reports found.", hi: "कोई रिपोर्ट नहीं मिली।", mr: "अहवाल आढळले नाहीत.", bn: "কোনো রিপোর্ট পাওয়া যায়নি।", te: "నివేదికలు కనుగొనబడలేదు.", ta: "அறிக்கைகள் எதுவும் இல்லை.", kn: "ಯಾವುದೇ ವರദിಗಳು ಕಂಡುಬಂದಿಲ್ಲ.", gu: "કોઈ અહેવાલ મળ્યા નથી.", pa: "ਕੋਈ ਰਿਪੋਰਟ ਨਹੀਂ ਮਿਲੀ।", ml: "റിപ്പോർട്ടുകൾ ഒന്നും കണ്ടെത്തിയില്ല."
  },
  "Delete Report": {
    en: "Delete Report", hi: "रिपोर्ट हटाएं", mr: "अहवाल हटवा", bn: "রিপোর্ট মুছুন", te: "నివేదికను తొలగించు", ta: "அறிக்கையை நீக்கு", kn: "ವರದಿ ಅಳಿಸಿ", gu: "અહેવાલ કાઢી નાખો", pa: "ਰਿਪੋਰਟ ਹਟਾਓ", ml: "റിപ്പോർട്ട് ഇല്ലാതാക്കുക"
  },
  "Refresh Profile Details": {
    en: "Refresh Profile Details", hi: "प्रोफ़ाइल विवरण ताज़ा करें", mr: "प्रोफाइल तपशील रीफ्रेश करा", bn: "প্রোফাইল বিবরণ রিফ্রেশ করুন", te: "ప్రొఫైల్ వివరాలను రీఫ్రెష్ చేయండి", ta: "சுயவிவர விவரங்களைப் புதுப்பி", kn: "ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ", gu: "પ્રોફાઇલ વિગતો રીફ્રેશ કરો", pa: "ਪ੍ਰੋਫਾਈਲ ਵੇരਵੇ ਤਾਜ਼ਾ ਕਰੋ", ml: "പ്രൊഫൈൽ വിവരങ്ങൾ പുതുക്കുക"
  },
  "Profile refreshed from Google!": {
    en: "Profile refreshed from Google!", hi: "गूगल से प्रोफ़ाइल ताज़ा की गई!", mr: "गुगलवरून प्रोफाइल रीफ्रेश केली!", bn: "গুগল থেকে প্রোফাইল রিफ्रেশ করা হয়েছে!", te: "గూగుల్ నుండి ప్రొഫൈల్ రీఫ్రెష్ చేయబడింది!", ta: "கூகிளிலிருந்து சுயவிவரம் புதுப்பிக்கப்பட்டது!", kn: "ಗೂಗಲ್‌ನಿಂದ പ്രೊಫೈൽ ರಿಫ್ರೆಶ್ ಮಾಡಲಾಗಿದೆ!", gu: "ગૂગલ પરથી પ્રોફાઇલ રીફ્રेश કરવામાં આવી!", pa: "ਗੂਗਲ ਤੋਂ ਪ੍ਰੋਫਾਈਲ ਤਾਜ਼ਾ ਕੀਤੀ ਗਈ!", ml: "ഗൂഗിളിൽ നിന്ന് പ്രൊഫൈൽ പുതുക്കി!"
  },
  "Are you sure you want to delete this report?": {
    en: "Are you sure you want to delete this report?", hi: "क्या आप वाकई इस रिपोर्ट को हटाना चाहते हैं?", mr: "तुम्हाला नक्की हा अहवाल हटवायचा आहे का?", bn: "আপনি কি নিশ্চিত যে আপনি এই রিপোর্টটি মুছতে চান?", te: "మీరు ఖచ్చితంగా এই నివేదికను తొలగించాలనుకుంటున్నారా?", ta: "இந்த அறிக்கையை நீக்க விரும்புகிறீர்களா?", kn: "ನೀವು ಖಚಿತವಾಗಿಯೂ ಈ ವರದಿಯನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?", gu: "શું તમે ખરેખર આ અહેવાલ કાઢી નાખવા માંગો છો?", pa: "ਕੀ ਤੁਸੀਂ ਯਕੀਨਨ ਇਸ ਰਿਪੋਰਟ ਨੂੰ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?", ml: "നിങ്ങൾക്ക് തീർച്ചയായും ഈ റിപ്പോർട്ട് ഇല്ലാതാക്കണോ?"
  },
  "Report deleted successfully.": {
    en: "Report deleted successfully.", hi: "रिपोर्ट सफलतापूर्वक हटा दी गई।", mr: "अहवाल यशस्वीरीत्या हटवला गेला.", bn: "রিপোর্ট সফলভাবে মুছে ফেলা হয়েছে।", te: "നിవేదిక విజయవంతంగా తొలగించబడింది.", ta: "அறிக்கை வெற்றிகரமாக நீக்கப்பட்டது.", kn: "ವರದಿ ಯಶಸ್വ写入 ಅಳಿಸಲಾಗಿದೆ.", gu: "અહેવાલ સફળતાપૂર્વક કાઢી નાખવામાં આવ્યો.", pa: "ਰਿਪੋਰਟ ਸਫਲਤਾਪੂਰਵਕ ਹਟਾ ਦਿੱਤੀ ਗਈ।", ml: "റിപ്പോർട്ട് വിജയകരമായി ഇല്ലാതാക്കി."
  },
  "Toggle Notifications": {
    en: "Toggle Notifications", hi: "अधिसूचनाएं टॉगल करें", mr: "सूचना टॉगल करा", bn: "বিজ্ঞপ্তি টগল করুন", te: "నోటిఫिकేషన్‌లను టోగుల్ చేయండి", ta: "அறிவிப்புகளை மாற்றவும்", kn: "ಅಧಿಸೂಚನೆಗಳನ್ನು ಟಾಗಲ್ ಮಾಡಿ", gu: "સૂચનાઓ ચાલુ/બંધ કરો", pa: "ਨੋਟੀਫਿਕੇਸ਼ਨ ਟੌਗਲ ਕਰੋ", ml: "അറിയിപ്പുകൾ മാറ്റുക"
  },
"Trash": {
    en: "Trash", hi: "कचरा", mr: "कचरा", bn: "আবর্জনা", te: "చెత్త", ta: "குப்பை", kn: "ಕಸ", gu: "કચરો", pa: "ਕੂੜਾ", ml: "മാലിന്യം"
  },
  "Dust": {
    en: "Dust", hi: "धूल", mr: "धूळ", bn: "ধুলো", te: "ధూళి", ta: "தூசி", kn: "ಧೂಳು", gu: "ધૂળ", pa: "ਧੂੜ", ml: "പൊടി"
  },
  "Plastic pile smoldering near public bus stop": {
    en: "Plastic pile smoldering near public bus stop", hi: "सार्वजनिक बस स्टॉप के पास सुलगता हुआ प्लास्टिक का ढेर", mr: "सार्वजनिक बस स्टॉपजवळ जळणारा प्लास्टिकचा ढीग", bn: "সরকারি বাস স্টপের কাছে জ্বলন্ত প্লাস্টিকের স্তূপ", te: "పబ్లిక్ బస్ స్టాప్ సమీపంలో పొగలు కక్కుతున్న ప్లాస్టిక్ కుప్ప", ta: "பொது பேருந்து நிறுத்தம் அருகில் எரியும் பிளாஸ்டிக் குவியல்", kn: "ಸಾರ್ವಜನಿಕ ಬಸ್ ನಿಲ್ದಾಣದ ಬಳి ಹೊಗೆಯಾಡುತ್ತಿರುವ ಪ್ಲಾಸ್ಟಿಕ್ ರಾಶಿ", gu: "જાહેર બસ સ્ટોપ પાસે સળગતો પ્લાસ્ટિકનો ઢગલો", pa: "ਪਬਲਿਕ ਬੱਸ ਸਟਾਪ ਦੇ ਨੇੜੇ ਸੁਲਘਦਾ ਪਲਾਸਟਿਕ ਦਾ ਢੇਰ", ml: "പൊതു ബസ് സ്റ്റോപ്പിന് സമീപം പുകയുന്ന പ്ലാസ്റ്റിക് കൂമ്പാരം"
  },
  "Dry flyash and heavy cement debris blowing from construction": {
    en: "Dry flyash and heavy cement debris blowing from construction", hi: "निर्माण स्थल से उड़ती हुई सूखी उड़न राख और सीमेंट का मलबा", mr: "बांधकामातून उडणारी सुकी फ्लायअॅश आणि जड सिमेंटचा ढिगारा", bn: "নির্মাণ কাজ থেকে উড়ন্ত শুকনো ছাই এবং সিমেন্টের ধ্বংসাবশেষ", te: "నిర్మాణం నుండి ఎగిరిపోతున్న పొడి బూడిద మరియు సిమెంట్ శిథిలాలు", ta: "கட்டுமானப் பணியிலிருந்து வெளியேறும் உலர் சாம்பல் மற்றும் சிமெண்ட் குப்பைகள்", kn: "ಕಟ್ಟಡ ನಿರ್ಮಾಣದಿಂದ ಹರಡುತ್ತಿರುವ ಒಣ ಹಾರುಬೂದಿ ಮತ್ತು ಸಿಮೆಂಟ್ ಭಗ್ನಾವಶೇಷಗಳು", gu: "બાંધકામમાંથી ઉડતી સૂકી રાખ અને સિમેન્ટનો કાટમાળ", pa: "ਉਸਾਰੀ ਵਾਲੀ ਥਾਂ ਤੋਂ ਉੱਡਦੀ ਸੁੱਕੀ ਸਵਾਹ ਅਤੇ ਸੀਮਿੰਟ ਦਾ ਮਲਬਾ", ml: "നിർമ്മാണ സ്ഥലത്തുനിന്നും പറക്കുന്ന ഉണങ്ങിയ ചാരവും സിമന്റ് അവശിഷ്ടങ്ങളും"
  },
  "1.2 km away": {
    en: "1.2 km away", hi: "1.2 किमी दूर", mr: "1.2 किमी दूर", bn: "১.২ কিমি দূরে", te: "1.2 కి.మీ దూరంలో", ta: "1.2 கி.மீ தொலைவில்", kn: "1.2 ಕಿ.ಮೀ ದೂರದಲ್ಲಿ", gu: "1.2 કિમી દૂર", pa: "1.2 ਕਿਲੋਮੀਟਰ ਦੂਰ", ml: "1.2 കി.മീ ദൂരെ"
  },
  "2.4 km away": {
    en: "2.4 km away", hi: "2.4 किमी दूर", mr: "2.4 किमी दूर", bn: "২.৪ কিমি দূরে", te: "2.4 కి.మీ దూరంలో", ta: "2.4 கி.मी தொலைவில்", kn: "2.4 ಕಿ.ಮೀ ದೂರದಲ್ಲಿ", gu: "2.4 કિમી દૂર", pa: "2.4 ਕਿਲੋਮੀਟਰ ਦੂਰ", ml: "2.4 കി.മീ ദൂരെ"
  },
  "Rank": {
    en: "Rank", hi: "रैंक", mr: "रँक", bn: "র‌্যাঙ্ক", te: "ర్యాంక్", ta: "தரவரிசை", kn: "ಶ್ರೇಣಿ", gu: "રેન્ક", pa: "ਰੈਂਕ", ml: "റാങ്ക്"
  },
  "in": {
    en: "in", hi: "में", mr: "मध्ये", bn: "এ", te: "లో", ta: "இல்", kn: "ನಲ್ಲಿ", gu: "માં", pa: "ਵਿੱਚ", ml: "ൽ"
  },
  "Goal:": {
    en: "Goal:", hi: "लक्ष्य:", mr: "ध्येय:", bn: "লক্ষ্য:", te: "లక్ష్యం:", ta: "இலக்கு:", kn: "ಗುರಿ:", gu: "ધ્યેય:", pa: "ਟੀਚਾ:", ml: "ലക്ഷ്യം:"
  },
  "reports": {
    en: "reports", hi: "रिपोर्ट", mr: "अहवाल", bn: "রিপোর্ট", te: "నివేదికలు", ta: "அறிக்கைகள்", kn: "ವರದಿಗಳು", gu: "અહેવાलो", pa: "ਰਿਪੋਰਟਾਂ", ml: "റിപ്പോർട്ടുകൾ"
  },
  " (You)": {
    en: " (You)", hi: " (आप)", mr: " (तुम्ही)", bn: " (আপনি)", te: " (మీరు)", ta: " (நீங்கள்)", kn: " (ನೀವು)", gu: " (તમે)", pa: " (ਤੁਸੀਂ)", ml: " (നിങ്ങൾ)"
  },
  "Citizen Impact Dashboard": {
    en: "Citizen Impact Dashboard", hi: "नागरिक प्रभाव डैशबोर्ड", mr: "नागरिक प्रभाव डॅशबोर्ड", bn: "নাগরিক প্রভাব ড্যাশবোর্ড", te: "సిటిజన్ ఇంపాక్ట్ డాష్‌బోర్డ్", ta: "குடிமக்கள் தாக்க ഡാഷ്‌ബോർഡ്", kn: "ನಾಗರಿಕ ಪ್ರಭಾವದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", gu: "નાગરિક પ્રભાવ ડેશબોર્ડ", pa: "ਨਾਗਰਿਕ ਪ੍ਰਭਾਵ ਡੈਸ਼ਬੋਰਡ", ml: "പൗരന്മാരുടെ സ്വാധീന ഡാഷ്‌ബോർഡ്"
  },
  "Gamified tracking & reporting badges": {
    en: "Gamified tracking & reporting badges", hi: "गेमीकृत ट्रैकिंग और रिपोर्टिंग बैज", mr: "गेमीफाइड ट्रॅकिंग आणि रिपोर्टिंग बॅज", bn: "গ্যামিফাইড ট্র্যাকিং এবং রিপোর্টিং ব্যাজ", te: "గేమిఫైడ్ ట్రాకింగ్ & రిపోర్టింగ్ బ్యాడ్జీలు", ta: "விளையாட்டு முறை கண்காணிப்பு மற்றும் பேட்ஜ்கள்", kn: "ಗೇಮಿಫೈಡ್ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ವರದಿ ಮಾಡುವ ಬ್ಯಾಡ್ಜ್‌ಗಳು", gu: "ગેમિફાઇડ ટ્રેકિંગ અને રિપોર્ટિંગ બેજ", pa: "ਗੇਮੀਫਾਈਡ ਟਰੈਕਿੰਗ ਅਤੇ ਰਿਪੋਰਟਿੰਗ ਬੈਜ", ml: "ഗെയിമിഫൈഡ് ട്രാക്കിംഗും റിപ്പോർട്ടിംഗ് ബാഡ്ജുകളും"
  },
  "SOMA Level": {
    en: "SOMA Level", hi: "सोमा स्तर", mr: "सोमा पातळी", bn: "সোমা স্তর", te: "SOMA స్థాయి", ta: "சோமா நிலை", kn: "SOMA ಮಟ್ಟ", gu: "સોમા સ્તર", pa: "ਸੋਮਾ ਪੱਧਰ", ml: "സോമ ലെവൽ"
  },
  "Impact Points": {
    en: "Impact Points", hi: "प्रभाव अंक", mr: "प्रभाव गुण", bn: "প্রভাব পয়েন্ট", te: "ఇంపాక్ట్ పాయింట్లు", ta: "தாக்க புள்ளிகள்", kn: "ಪ್ರಭಾವದ პಾಯಿಂಟ್‌ಗಳು", gu: "પ્રભાવ પોઇન્ટ", pa: "પ્રਭਾਵ ਅੰਕ", ml: "സ്വാധീന പോയിന്റുകൾ"
  },
  "Current Badge": {
    en: "Current Badge", hi: "वर्तमान बैज", mr: "सध्याचा बॅज", bn: "वर्तमान ব্যাজ", te: "ప్రస్తుత బ్యాడ్జ్", ta: "தற்போதைய பேட்ஜ்", kn: "ಪ್ರಸ್ತುत ಬ್ಯಾಡ್ಜ್", gu: "વર્તમાન બેજ", pa: "ਮੌਜੂਦਾ ਬੈਜ", ml: "നിലവിലെ ബാഡ്ജ്"
  },
  "confirmed reports": {
    en: "confirmed reports", hi: "पुष्टि की गई रिपोर्ट", mr: "पुष्टी केलेले अहवाल", bn: "নিশ্চিত রিপোর্ট", te: "ధృవీకరించబడిన నివేదికలు", ta: "உறுதிப்படுத்தப்பட்ட அறிக்கைகள்", kn: "ದೃಢಪಡಿಸಿದ ವರದಿಗಳು", gu: "પુષ્ટિ થયેલ અહેવાલો", pa: "ਪੁਸ਼ਟੀ ਕੀਤੀ ਰਿਪੋਰਟਾਂ", ml: "സ്ഥിരീകരിച്ച റിപ്പോർട്ടുകൾ"
  },
  "Daily Clean Air Check-In": {
    en: "Daily Clean Air Check-In", hi: "दैनिक स्वच्छ वायु चेक-इन", mr: "दैनिक स्वच्छ हवा चेक-इन", bn: "দৈনিক পরিচ্ছন্ন বায়ু চেক-ইন", te: "రోజువారీ స్వచ్ఛమైన గాలి చెక్-ఇన్", ta: "தினசரி தூய காற்று வருகைப்பதிவு", kn: "ದೈನಂದಿನ ಶುದ್ಧ ಗಾಳಿಯ ಚೆಕ್-ಇನ್", gu: "દૈનિક સ્વચ્છ હવા ચેક-ઇન", pa: "ਰੋਜ਼ਾਨਾ ਸਾਫ਼ ਹਵਾ ਚੈੱਕ-ਇਨ", ml: "ദിനചര്യ ശുദ്ധവായു ചെക്ക്-ഇൻ"
  },
  "DAILY ATTENDANCE LOGGED TODAY": {
    en: "DAILY ATTENDANCE LOGGED TODAY", hi: "दैनिक उपस्थिति आज दर्ज की गई", mr: "दैनिक उपस्थिती आज नोंदवली गेली", bn: "আজকের দৈনিক উপস্থিতি নথিভুক্ত হয়েছে", te: "ఈరోజు హాజరు నమోదు చేయబడింది", ta: "இன்றைய வருகைப்பதிவு செய்யப்பட்டது", kn: "ಇಂದಿನ ಹಾಜರಾತಿ ದಾಖಲಾಗಿದೆ", gu: "દૈનિક હાજરી આજે નોંધાયેલ છે", pa: "ਰੋਜ਼ਾਨਾ ਹਾਜ਼ਰੀ ਅੱਜ ਦਰਜ ਕੀਤੀ ਗਈ", ml: "ഇന്നത്തെ ഹാജർ രേഖപ്പെടുത്തിയിരിക്കുന്നു"
  },
  "CLAIM DAILY CHECK-IN (+20 PTS)": {
    en: "CLAIM DAILY CHECK-IN (+20 PTS)", hi: "दैनिक चेक-इन प्राप्त करें (+20 अंक)", mr: "दैनिक चेक-इनचा दावा करा (+२० गुण)", bn: "দৈনিক চেক-ইন দাবি করুন (+২০ পয়েন্ট)", te: "రోజువారీ చెక్-ఇన్ క్లెయిమ్ చేయండి (+20 PTS)", ta: "தினசரி வருகைப்பதிவை கோருங்கள் (+20 புள்ளிகள்)", kn: "ದೈನಂದಿನ ಚೆಕ್-ಇನ್ ಪಡೆಯಿರಿ (+20 PTS)", gu: "દૈનિક ચેક-ઇન મેળવો (+૨૦ પોઇન્ટ)", pa: "ਰੋਜ਼ਾਨਾ ਚੈੱਕ-ਇਨ ਦਾ ਦਾਅਵਾ ਕਰੋ (+20 PTS)", ml: "ദിനചര്യ ചെക്ക്-ഇൻ ക്ലെയിം ചെയ്യുക (+20 PTS)"
  },
  "Locked & Unlocked Badges": {
    en: "Locked & Unlocked Badges", hi: "लॉक और अनलॉक किए गए बैज", mr: "लॉक आणि अनलॉक केलेले बॅज", bn: "লক এবং আনলক করা ব্যাজ", te: "లాక్ చేయబడిన & అన్‌లాక్ చేయబడిన బ్యాడ్జీలు", ta: "பூட்டப்பட்ட மற்றும் திறக்கப்பட்ட பேட்ஜ்கள்", kn: "ಲಾಕ್ ಆದ ಮತ್ತು ಅನ್ಲಾಕ್ ಆದ ಬ್ಯಾಡ್ಜ್‌ಗಳು", gu: "લોક અને અનલોક થયેલ બેજ", pa: "ਲਾਕ ਅਤੇ ਅਨਲਾਕ ਕੀਤੇ ਬੈਜ", ml: "പൂട്ടിയതും തുറന്നതുമായ ബാഡ്ജുകൾ"
  },
  "Goal: 12 reports": {
    en: "Goal: 12 reports", hi: "लक्ष्य: 12 रिपोर्ट", mr: "ध्येय: १२ अहवाल", bn: "লক্ষ্য: ১২টি রিপোর্ট", te: "లક્ષ్యం: 12 నివేదికలు", ta: "இலக்கு: 12 அறிக்கைகள்", kn: "ಗುರಿ: 12 ವರದಿಗಳು", gu: "ધ્યેય: ૧૨ અહેવાલો", pa: "ਟੀਚਾ: 12 ਰਿਪੋਰਟਾਂ", ml: "ലക്ഷ്യം: 12 റിപ്പോർട്ടുകൾ"
  },
  "Local Peer Reviews (SOMA)": {
    en: "Local Peer Reviews (SOMA)", hi: "स्थानीय सहकर्मी समीक्षाएँ (SOMA)", mr: "स्थानिक समवयस्क पुनरावलोकने (SOMA)", bn: "স্থানীয় সহকর্মী পর্যালোচনা (SOMA)", te: "స్థానిక పీర్ సమీಕ್ಷలు (SOMA)", ta: "உள்ளூர் சக மதிப்பாய்வுகள் (SOMA)", kn: "ಸ್ಥಳೀಯ পೀರ್ ವಿಮರ್ಶೆಗಳು (SOMA)", gu: "સ્થાનિક પીઅર સમીક્ષાઓ (SOMA)", pa: "ਸਥਾਨਕ ਹਾਣੀ ਸਮੀਖਿਆਵਾਂ (SOMA)", ml: "പ്രാദേശിക പിയർ അവലോകനങ്ങൾ (SOMA)"
  },
  "Review nearby reports": {
    en: "Review nearby reports", hi: "आस-पास की रिपोर्ट की समीक्षा करें", mr: "जवळपासच्या अहवालांचे पुनरावलोकन करा", bn: "আশেপাশের রিপোর্ট পর্যালোচনা করুন", te: "సమీప నిवेదికలను సమీక్షించండి", ta: "அருகிலுள்ள அறிக்கைகளை மதிப்பாய்வு செய்யவும்", kn: "ಹತ್ತಿರದ ವರದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ", gu: "નજીકના અહેવાલોની સમીક્ષા કરો", pa: "ਨੇੜਲੀਆਂ ਰਿਪੋਰਟਾਂ ਦੀ ਸਮੀਖਿਆ ਕਰੋ", ml: "സമീപത്തെ റിപ്പോർട്ടുകൾ അവലോകനം ചെയ്യുക"
  },
  "Earn +30 PTS": {
    en: "Earn +30 PTS", hi: "+30 अंक कमाएं", mr: "+३० गुण मिळवा", bn: "+৩০ পয়েন্ট অর্জন করুন", te: "+30 PTS సంపాదించండి", ta: "+30 புள்ளிகள் வெல்லுங்கள்", kn: "+30 PTS ಗಳಿಸಿ", gu: "+૩૦ પોઇન્ટ કમાઓ", pa: "+30 PTS ਕਮਾਓ", ml: "+30 PTS നേടുക"
  },
  "VERIFIED": {
    en: "VERIFIED", hi: "सत्यापित", mr: "सत्यापित", bn: "যাচাইকৃত", te: "ధృవీకరించబడింది", ta: "சரிபார்க்கப்பட்டது", kn: "ದೃಢೀಕರಿಸಲಾಗಿದೆ", gu: "ચકાસાયેલ", pa: "ਪੁਸ਼ਟੀ ਹੋਈ", ml: "സ്ഥിരീകരിച്ചു"
  },
  "Approve & Verify": {
    en: "Approve & Verify", hi: "स्वीकृत और सत्यापित करें", mr: "मंजूर आणि सत्यापित करा", bn: "অনুমোদন ও যাচাই করুন", te: "ఆమోదించండి & ధృవీకరించండి", ta: "அங்கீகரித்து சரிபார்க்கவும்", kn: "ಅನುಮೋದಿಸಿ ಮತ್ತು ದೃಢೀಕರಿಸಿ", gu: "મંજૂર અને ચકાસો", pa: "ਮਨਜ਼ੂਰ ਅਤੇ ਪੁਸ਼ਟੀ ਕਰੋ", ml: "അംഗീകരിക്കുകയും സ്ഥിരീകരിക്കുകയും ചെയ്യുക"
  },
  "SOMA Leaderboard": {
    en: "SOMA Leaderboard", hi: "SOMA लीडरबोर्ड", mr: "SOMA लीडरबोर्ड", bn: "SOMA লিডারবোর্ড", te: "SOMA లీడర్‌బోర్డ్", ta: "சோமா தரவரிசை பட்டியல்", kn: "SOMA ಲೀಡರ್‌ಬೋರ್ಡ್", gu: "SOMA લીડરબોર્ડ", pa: "SOMA ਲੀਡਰਬੋਰਡ", ml: "സോമ ലീഡർബോർഡ്"
  },
  "Rankings": {
    en: "Rankings", hi: "रैंकिंग", mr: "रँकिंग", bn: "র‌্যাঙ্কিং", te: "ర్యాంకింగ్స్", ta: "தரவரிசை", kn: "ಶ್ರೇಯಾಂಕಗಳು", gu: "રેન્કિંગ", pa: "ਦਰਜਾਬੰਦੀ", ml: "റാങ്കിംഗ്"
  },
  "🥈 Clean Air Recruit": {
    en: "🥈 Clean Air Recruit", hi: "🥈 स्वच्छ वायु रंगरूट", mr: "🥈 स्वच्छ हवा सैनिक", bn: "🥈 পরিচ্ছন্ন বায়ু রিক্রুট", te: "🥈 స్వచ్ఛమైన గాలి రిక్రూట్", ta: "🥈 தூய காற்று படைவீரர்", kn: "🥈 ಶುದ್ಧ ಗಾಳಿ ನೇಮಕಾತಿ", gu: "🥈 સ્વચ્છ હવા રಿಕ્રુટ", pa: "🥈 ਸਾਫ਼ ਹਵਾ ਰਿਕਰੂਟ", ml: "🥈 ശുദ്ധവായു തുടക്കക്കാരൻ"
  },
  "🕵️‍♂️ Smog Spotter": {
    en: "🕵️‍♂️ Smog Spotter", hi: "🕵️‍♂️ स्मॉग स्पॉटर", mr: "🕵️‍♂️ स्मॉग स्पॉटर", bn: "🕵️‍♂️ স্মগ স্পটার", te: "🕵️‍♂️ స్మాగ్ స్పాటర్", ta: "🕵️‍♂️ புகைமண்டல கண்காணிப்பாளர்", kn: "🕵️‍♂️ ಹೊಗೆ ಪತ್ತೆದಾರ", gu: "🕵️‍♂️ સ્મોગ સ્પોટર", pa: "🕵️‍♂️ ਸਮੋਗ ਸਪੋਟਰ", ml: "🕵️‍♂️ പുകമഞ്ഞ് കണ്ടെത്തുന്നയാൾ"
  },
  "🔬 Aerosol Analyst": {
    en: "🔬 Aerosol Analyst", hi: "🔬 एयरोसोल विश्लेषक", mr: "🔬 एरोसोल विश्लेषक", bn: "🔬 অ্যারোসল বিশ্লেষক", te: "🔬 ఏరోసోల్ విశ్లేషకుడు", ta: "🔬 ஏரோசல் பகுப்பாய்வாளர்", kn: "🔬 ಏರೋಸಾಲ್ ವಿಶ್ಲೇಷಕ", gu: "🔬 એરોસોલ વિશ્લેષક", pa: "🔬 ਐਰੋਸੋਲ ਵਿਸ਼ਲੇਸ਼ਕ", ml: "🔬 ഏറോസോൾ വിശകലന വിദഗ്ദ്ധൻ"
  },
  "🏆 Decarbon Champion": {
    en: "🏆 Decarbon Champion", hi: "🏆 डीकार्बन चैंपियन", mr: "🏆 डीकार्बन चॅम्पियन", bn: "🏆 ডিকার্বন চ্যাম্পিয়ন", te: "🏆 డీకార్బన్ ఛాంపియన్", ta: "🏆 கார்பன் குறைப்பு வெற்றியாளர்", kn: "🏆 ಡಿಕಾರ್ಬನ್ ಚಾಂಪಿಯನ್", gu: "🏆 ડીકાર્બન ચેમ્પિયન", pa: "🏆 ਡੀਕਾਰਬਨ ਚੈਂਪੀਅน", ml: "🏆 ഡീകാർബണൈസേഷൻ ചാമ്പ്യൻ"
  },
  "🛡️ Eco Guardian": {
    en: "🛡️ Eco Guardian", hi: "🛡️ इको गार्जियन", mr: "🛡️ इको गार्डियन", bn: "🛡️ ইকো গার্ডিয়ান", te: "🛡️ ఎకో గార్డియన్", ta: "🛡️ சுற்றுச்சூழல் பாதுகாவலர்", kn: "🛡️ ಪರಿಸರ ರಕ್ಷಕ", gu: "🛡️ ઇકો ગાર્ડિયન", pa: "🛡️ ਈਕോ ਗਾਰਡੀਅਨ", ml: "🛡️ പരിസ്ഥിതി സംരക്ഷകൻ"
  },
  "🥚 Rookie": {
    en: "🥚 Rookie", hi: "🥚 नौसिखिया", mr: "🥚 नवशिक्या", bn: "🥚 নবীন", te: "🥚 రూకీ", ta: "🥚 புதியவர்", kn: "🥚 ಹೊಸಬ", gu: "🥚 રુકી", pa: "🥚 ਨਵਾਂ", ml: "🥚 തുടക്കക്കാരൻ"
  },
  "Submit your first verified local AQI hazard report.": {
    en: "Submit your first verified local AQI hazard report.", hi: "अपनी पहली सत्यापित स्थानीय AQI जोखिम रिपोर्ट सबमिट करें।", mr: "तुमचा पहिला सत्यापित स्थानिक AQI जोखीम अहवाल सबमिट करा.", bn: "আপনার প্রথম যাচাইকৃত স্থানীয় একিউআই ঝুঁকি রিপোর্ট জমা দিন।", te: "మీ మొదటి ధృవీకరించబడిన స్థానిక AQI ప్రమాద నివేదికను సమర్పించండి.", ta: "உங்கள் முதல் சரிபார்க்கப்பட்ட காற்று தரம் குறித்த புகாரைச் சமர்ப்பிக்கவும்.", kn: "ನಿಮ್ಮ ಮೊದಲ ದೃಢೀಕೃತ ಸ್ಥಳೀಯ AQI ಅಪಾಯದ ವರದಿಯನ್ನು ಸಲ್ಲಿಸಿ.", gu: "તમારો પ્રથમ ચકાસાયેલ સ્થાનિક AQI જોખમ અહેવાલ સબમિટ કરો.", pa: "ਆਪਣੀ ਪਹਿਲੀ ਪੁਸ਼ਟੀ ਕੀਤੀ ਸਥានਕ AQI ਖਤਰੇ ਦੀ ਰਿਪੋਰਟ ਜਮ੍ਹਾਂ ਕਰੋ।", ml: "നിങ്ങളുടെ ആദ്യത്തെ സ്ഥിരീകരിച്ച പ്രാദേശിക AQI അപകട റിപ്പോർട്ട് സമർപ്പിക്കുക."
  },
  "Spot and report 3 pollution incidents near you.": {
    en: "Spot and report 3 pollution incidents near you.", hi: "अपने आस-पास प्रदूषण की 3 घटनाओं का पता लगाएं और रिपोर्ट करें।", mr: "तुमच्या जवळील ३ प्रदूषण घटना शोधा आणि नोंदवा.", bn: "আপনার কাছাকাছি ৩টি দূষণের ঘটনা চিহ্নিত এবং রিপোর্ট করুন।", te: "మీ సమీపంలోని 3 కాలుష్య సంఘటనలను గుర్తించి నివేదించండి.", ta: "உங்களுக்கு அருகிலுள்ள 3 மாசு சம்பவங்களைக் கண்டறிந்து புகாரளிக்கவும்.", kn: "ನಿಮ್ಮ ಹತ್ತಿರದ 3 ಮಾಲಿನ್ಯ ಘಟನೆಗಳನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ ವರದಿ ಮಾಡಿ.", gu: "તમારી નજીકની ૩ પ્રદૂષણની ઘટનાઓ શોધી કાઢો અને રિપોર્ટ કરો.", pa: "ਆਪਣੇ ਨੇੜੇ 3 ਪ੍ਰਦੂਸ਼ਣ ਦੀਆਂ ਘਟਨਾਵਾਂ ਦਾ ਪਤਾ ਲਗਾਓ ਅਤੇ ਰਿਪੋਰਟ ਕਰੋ।", ml: "നിങ്ങളുടെ സമീപമുള്ള 3 മലിനീകരണ സംഭവങ്ങൾ കണ്ടെത്തി റിപ്പോർട്ട് ചെയ്യുക."
  },
  "Flag 5 distinct ambient aerosol anomalies.": {
    en: "Flag 5 distinct ambient aerosol anomalies.", hi: "5 अलग-अलग परिवेशी एयरोसोल विसंगतियों को चिह्नित करें।", mr: "५ वेगवेगळ्या सभोवतालच्या एरोसोल विसंगती चिन्हांकित करा.", bn: "৫টি স্বতন্ত্র পরিবেষ্টনকারী অ্যারোসল অসঙ্গতি চিহ্নিত করুন।", te: "5 విభిన్న పరిసర ఏరోసోల్ క్రమరాహిత్యాలను గుర్తించండి.", ta: "5 வெவ்வேறு ஏரோசல் முரண்பாடுகளை அடையாளம் காணவும்.", kn: "5 ವಿಭಿನ್ನ ಪರಿಸರ ಏರೋಸಾಲ್ ವೈಪರೀತ್ಯಗಳನ್ನು ಗುರುತಿಸಿ.", gu: "૫ અલગ-અલગ એરોસોલ વિસંગતતાઓને ચિહ્નિત કરો.", pa: "5 ਵੱਖ-ਵੱਖ ਐਰੋਸੋਲ ਅਸੰਗਤੀਆਂ ਨੂੰ ਚਿੰਨ੍ਹਿत ਕਰੋ।", ml: "അന്തരീക്ഷത്തിലെ 5 വ്യത്യസ്ത ഏറോസോൾ വ്യതിയാനങ്ങൾ രേഖപ്പെടുത്തുക."
  },
  "Perform 8 decentralized hazard broadcasts.": {
    en: "Perform 8 decentralized hazard broadcasts.", hi: "8 विकेन्द्रीकृत जोखिम प्रसारण करें।", mr: "८ विकेंद्रित जोखीम प्रक्षेपण करा.", bn: "৮টি বিকেন্দ্রীকৃত বিপদ সম্প্রচার করুন।", te: "8 వికేంద్రీకృత ప్రమాద ప్రసారాలు చేయండి.", ta: "8 பரவலாக்கப்பட்ட அபாய ஒளிபரப்புகளைச் செய்யவும்.", kn: "8 ವಿಕೇಂದ್ರೀಕೃತ ಅಪಾಯ ಪ್ರಸಾರಗಳನ್ನು ಮಾಡಿ.", gu: "૮ વિકેન્દ્રિત જોખમ પ્રસારણ કરો.", pa: "8 ਵਿਕੇਂਦਰੀਕ੍ਰਿਤ ਖਤਰੇ ਦੇ ਪ੍ਰਸਾਰਣ ਕਰੋ।", ml: "8 വികേന്ദ്രീകൃത അപകട മുന്നറിയിപ്പുകൾ നടത്തുക."
  },
  "Maintain supreme local grid compliance.": {
    en: "Maintain supreme local grid compliance.", hi: "सर्वोच्च स्थानीय ग्रिड अनुपालन बनाए रखें।", mr: "सर्वोच्च स्थानिक ग्रिड अनुपालन राखा.", bn: "সর্বোচ্চ স্থানীয় গ্রিড সম্মতি বজায় রাখুন।", te: "అత్యున్నత స్థానిక గ్రిడ్ నిబంధనలు పాటించండి.", ta: "உள்ளூர் விதிமுறைகளை முழுமையாகப் பின்பற்றவும்.", kn: "ಅತ್ಯುನ್ನತ ಸ್ಥಳೀಯ ನಿಯಮಾವಳಿ ಪಾಲಿಸಿ.", gu: "સર્વોચ્ચ સ્થાનિક ગ્રીડ પાલન જાળવો.", pa: "ਸਰਵਉੱਚ ਸਥਾਨਕ ਗਰਿੱਡ ਪਾਲਣਾ ਬਣਾਈ ਰੱਖੋ।", ml: "പ്രാദേശിക മാനദണ്ഡങ്ങൾ പൂർണ്ണമായും പാലിക്കുക."
  },
  "Good": {
    en: "Good", hi: "अच्छा", mr: "चांगले", bn: "ভালো", te: "మంచిది", ta: "நல்லது", kn: "ಉತ್ತಮ", gu: "સારું", pa: "ਚੰਗਾ", ml: "നല്ലത്"
  },
  "Satisfactory": {
    en: "Satisfactory", hi: "संतोषजनक", mr: "समाधानकारक", bn: "সন্তোষজনক", te: "సంతృప్తికరం", ta: "திருப்திகரமானது", kn: "ತೃಪ್ತಿದಾಯಕ", gu: "સંતોષકારક", pa: "ਸੰਤੋਖਜนਕ", ml: "തൃപ്തികരമായത്"
  },
  "Moderate": {
    en: "Moderate", hi: "मध्यम", mr: "मध्यम", bn: "মাঝারি", te: "మధ్యస్థం", ta: "மிதமான", kn: "ಮಧ್ಯಮ", gu: "મધ્યમ", pa: "ਮੱਧਮ", ml: "മിതമായത്"
  },
  "Poor": {
    en: "Poor", hi: "खराब", mr: "खराब", bn: "খারাপ", te: "పేలవం", ta: "மோசம்", kn: "ಕಳಪೆ", gu: "નબળું", pa: "ਖ਼ਰਾਬ", ml: "മോശം"
  },
  "Very Poor": {
    en: "Very Poor", hi: "बहुत खराब", mr: "अतिशय खराब", bn: "খুব खराब", te: "చాలా పేలవం", ta: "மிகவும் மோசம்", kn: "ಅತ್ಯಂತ ಕಳಪೆ", gu: "ખૂબ જ નબળું", pa: "ਬਹੁਤ ਖ਼ਰਾਬ", ml: "വളരെ മോശം"
  },
  "Severe": {
    en: "Severe", hi: "गंभीर", mr: "गंभीर", bn: "গুরুতর", te: "తీవ్రమైన", ta: "மிகவும் ஆபத்தானது", kn: "ತೀವ್ರ", gu: "ગંભીર", pa: "ਗੰਭੀਰ", ml: "അതീവ ഗുരുതരം"
  },
  "Regional Average": {
    en: "Regional Average", hi: "क्षेत्रीय औसत", mr: "प्रादेशिक सरासरी", bn: "আঞ্চলিক গড়", te: "ప్రాంతీయ సగటు", ta: "வட்டார சராசரி", kn: "ಪ್ರಾದೇಶಿಕ ಸರασರಿ", gu: "પ્રાદેશિક સરેરાશ", pa: "ਖੇਤਰੀ ਔਸਤ", ml: "മേഖലാ ശരാശരി"
  },
  "Station": {
    en: "Station", hi: "स्टेशन", mr: "स्टेशन", bn: "স্টেশন", te: "స్టేషన్", ta: "நிலையம்", kn: "ನಿಲ್ದಾಣ", gu: "સ્ટેશન", pa: "ਸਟੇਸ਼ਨ", ml: "സ്റ്റേഷൻ"
  },
  "State / Region": {
    en: "State / Region", hi: "राज्य / क्षेत्र", mr: "राज्य / प्रदेश", bn: "রাজ্য / অঞ্চল", te: "రాష్ట్రం / ప్రాంతం", ta: "மாநிலம் / மண்டலம்", kn: "ರಾಜ್ಯ / ಪ್ರದೇಶ", gu: "રાજ્ય / પ્રદેશ", pa: "ਰਾਜ / ਖੇਤਰ", ml: "സംസ്ഥാനം / പ്രദേശം"
  },
  "Avg PM2.5 Conc.": {
    en: "Avg PM2.5 Conc.", hi: "औसत PM2.5 सांद्रता", mr: "सरासरी PM२.५ सांद्रता", bn: "গড় PM२.৫ ঘনত্ব", te: "సగటు PM2.5 సాంద్రత", ta: "சராசரி PM2.5 அளவு", kn: "ಸರασರಿ PM2.5 ಸಾಂದ್ರತೆ", gu: "સરેરાશ PM2.5 સાંદ્રતા", pa: "ਔਸਤ PM2.5 ਸੰਘਣਤਾ", ml: "ശരാശരി PM2.5 അളവ്"
  },
  "Avg PM10 Conc.": {
    en: "Avg PM10 Conc.", hi: "औसत PM10 सांद्रता", mr: "सरासरी PM१० सांद्रता", bn: "গড় PM১০ ঘনত্ব", te: "సగటు PM10 సాంద్రత", ta: "சராசரி PM10 அளவு", kn: "ಸರಾಸರಿ PM10 ಸಾಂದ್ರತೆ", gu: "સરેરાશ PM10 સાંદ્રતા", pa: "ਔਸਤ PM10 ਸੰਘਣਤਾ", ml: "ശരാശരി PM10 അളവ്"
  },
  "Dynamic Health Advisory": {
    en: "Dynamic Health Advisory", hi: "सक्रिय स्वास्थ्य सलाह", mr: "सक्रिय आरोग्य सल्ला", bn: "সक्रिय स्वास्थ्य परामर्श", te: "సక్రియ ఆరోగ్య సలహా", ta: "சுகாதார ஆலோசனை", kn: "ಸಕ್ರಿಯ ಆರೋಗ್ಯ ಸಲಹೆ", gu: "સક્રિય આરોગ્ય સલાહ", pa: "ਸਿਹਤ ਸਲਾਹ", ml: "ആരോഗ്യ നിർദ്ദേശങ്ങൾ"
  },
  "Avoid Outdoor Exercises:": {
    en: "Avoid Outdoor Exercises:", hi: "बाहरी व्यायाम से बचें:", mr: "बाहेर व्यायाम करणे टाळा:", bn: "বাইরে ব্যায়াম করা এড়িয়ে চলুন:", te: "బయట వ్యాయామాలు చేయకండి:", ta: "வெளியே உடற்பயிற்சி செய்வதைத் தவிர்க்கவும்:", kn: "ಹೊರಾಂಗಣ ವ್ಯಾಯಾಮಗಳನ್ನು ತಪ್ಪಿಸಿ:", gu: "બહાર કસરત કરવાનું ટાળો:", pa: "ਬਾਹਰ ਕਸਰਤ ਕਰਨ ਤੋਂ ਬਚੋ:", ml: "പുറത്തിറങ്ങിയുള്ള വ്യായാമങ്ങൾ ഒഴിവാക്കുക:"
  },
  "Sensitive Groups At Risk:": {
    en: "Sensitive Groups At Risk:", hi: "संवेदनशील समूह जोखिम में:", mr: "संवेदनशील गट धोक्यात:", bn: "সংবেদনশীল গোষ্ঠী ঝুঁকির মধ্যে:", te: "సున్నితమైన సమૂహాలు ప్రమాదంలో ఉన్నాయి:", ta: "பாதிப்புக்குள்ளாகும் குழுக்கள் எச்சரிக்கையாக இருக்கவும்:", kn: "ಸೂಕ್ಷ್ಮ ಜನಸಮೂಹ ಅಪಾಯದಲ್ಲಿದೆ:", gu: "સંવેદનશીલ જૂથો જોખમમાં:", pa: "ਸੰਵੇਦਨਸ਼ੀਲ ਸਮੂਹ ਖਤਰੇ ਵਿੱਚ:", ml: "ആരോഗ്യപ്രശ്നമുള്ളവർ ജാഗ്രत പാലിക്കുക:"
  },
  "Pristine Weather:": {
    en: "Pristine Weather:", hi: "स्वच्छ मौसम:", mr: "स्वच्छ हवामान:", bn: "চমৎকার আবহাওয়া:", te: "స్వచ్ఛమైన వాతావరణం:", ta: "தூய்மையான வானிலை:", kn: "ಪರಿಶುದ್ಧ ವಾತಾವರಣ:", gu: "સ્વચ્છ હવામાન:", pa: "ਸਾਫ਼ ਮੌਸਮ:", ml: "അനുകൂല കാലാവസ്ഥ:"
  },
  "Live State Monitor": {
    en: "Live State Monitor", hi: "लाइव राज्य मॉनिटर", mr: "थेट राज्य मॉनिटर", bn: "लाइভ राज्य মনিটর", te: "లైవ్ రాష్ట్ర మానిటర్", ta: "செயலில் உள்ள மாநில கண்காணிப்பு", kn: "ಲೈವ್ ರಾಜ್ಯ ಮಾನಿಟರ್", gu: "લાઇવ રાજ્ય મોનિટર", pa: "ਲਾਈਵ ਰਾਜ ਮਾਨੀਟਰ", ml: "തത്സമയ സംസ്ഥാന നിരീക്ഷണം"
  },
  "Real-time AQI readings across all districts": {
    en: "Real-time AQI readings across all districts", hi: "सभी जिलों में वास्तविक समय AQI रीडिंग", mr: "सर्व जिल्ह्यांमध्ये रिअल-टाइम AQI रीडिंग", bn: "সমস্ত জেলায় রিয়েল-টাইম AQI রিডিং", te: "అన్ని జిల్లాల్లో నిజ-సమయ AQI రీడింగులు", ta: "அனைத்து மாவட்டங்களின் நேரடி காற்று தரம்", kn: "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ನೈಜ-ಸಮಯದ AQI ವಾಚನಗೋಷ್ಠಿಗಳು", gu: "તમામ જિલ્લાઓમાં રીઅલ-ટાઇમ AQI રીડિંગ્સ", pa: "ਸਾਰੇ ਜ਼ਿਲ੍ਹਿਆਂ ਵਿੱਚ ਰੀਅલ-ਟਾਈਮ AQI ਰੀਡਿੰਗ", ml: "എല്ലാ ജില്ലകളിലെയും തത്സമയ വായু ഗുണനിലവാരം"
  },
  "Stations": {
    en: "Stations", hi: "स्टेशन", mr: "स्टेशन्स", bn: "স্টেশন", te: "స్టేషన్లు", ta: "நிலையங்கள்", kn: "ನಿಲ್ದಾಣಗಳು", gu: "સ્ટેશનો", pa: "ਸਟੇਸ਼ਨ", ml: "സ്റ്റേഷനുകൾ"
  },
  "Live Data Source:": {
    en: "Live Data Source:", hi: "लाइव डेटा स्रोत:", mr: "थेट डेटा स्रोत:", bn: "लाइভ ডেটা উৎস:", te: "లైవ్ డేటా మూలం:", ta: "நேரடி தரவு ஆதாரம்:", kn: "ಲೈವ್ ಡೇಟಾ ಮೂಲ:", gu: "લાઇવ ડેટા સ્રોત:", pa: "ਲਾਈਵ ਡੇਟਾ ਸਰੋत:", ml: "തത്സമയ വിവര ഉറവിടം:"
  },
  "REGIONAL AQI": {
    en: "REGIONAL AQI", hi: "क्षेत्रीय AQI", mr: "प्रादेशिक AQI", bn: "আঞ্চলিক AQI", te: "ప్రాంతీయ AQI", ta: "மண்டல AQI", kn: "ಪ್ರಾದೇಶಿಕ AQI", gu: "પ્રાદેશિક AQI", pa: "ਖੇਤਰੀ AQI", ml: "പ്രാദേശിക AQI"
  },
  "US AQI": {
    en: "US AQI", hi: "यूएस AQI", mr: "यूएस AQI", bn: "ইউএস AQI", te: "యుఎస్ AQI", ta: "அமெரிக்க AQI", kn: "ಯುಎಸ್ AQI", gu: "ಯುએસ AQI", pa: "ਯੂਐਸ AQI", ml: "യുഎസ് AQI"
  },
  "Air particulate levels are hazardous {location}. Highly advise shutting windows and wearing double-layer N95 masks.": {
    en: "Air particulate levels are hazardous {location}. Highly advise shutting windows and wearing double-layer N95 masks.",
    hi: "{location} में वायु कणों का स्तर खतरनाक है। खिड़कियां बंद रखने और डबल-लेयर N95 मास्क पहनने की अत्यधिक सलाह दी जाती है।",
    mr: "{location} मध्ये हवेतील कणांची पातळी घातक आहे. खिडक्या बंद ठेवण्याचा आणि दुहेरी थराचा N95 मास्क वापरण्याचा सल्ला दिला जातो.",
    bn: "{location}-এ বায়ুর কণার মাত্রা বিপজ্জনক। জানালা বন্ধ রাখার এবং ডাবল-লেয়ার N95 মাস্ক পরার পরামর্শ দেওয়া হচ্ছে।",
    te: "{location}లో గాలి నాణ్యత అత్యంత ప్రమాదకరంగా ఉంది. కిటిкіలు మూసి ఉంచడం మరియు డబుల్ లేయర్ N95 మాస్క్‌లు ధరించడం మంచిది.",
    ta: "{location} பகுதியில் காற்றின் தரம் ஆபத்தான நிலையில் உள்ளது. ஜன்னல்களை மூடி வைக்கவும் மற்றும் N95 முகக்கவசம் அணியவும் அறிவுறுத்தப்படுகிறது.",
    kn: "{location} ನಲ್ಲಿ ಗಾಳಿಯ ಗುಣಮಟ್ಟ ಅಪಾಯಕಾರಿಯಾಗಿದೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಲು ಮತ್ತು ಡಬಲ್-ಲೇಯರ್ N95 ಮಾಸ್ಕ್ ಧರಿಸಲು ಸೂಚಿಸಲಾಗಿದೆ.",
    gu: "{location}માં હવાની ગુણવત્તા જોખમી છે. બારીઓ બંધ રાખવા અને ડબલ-લેયર N95 માસ્ક પહેરવાની સલાહ છે.",
    pa: "{location} ਵਿੱਚ ਹਵਾ ਦਾ ਪੱਧਰ ਖ਼ਤਰನಾक ਹੈ। ਖਿੜਕੀਆਂ ਬੰਦ ਰੱਖਣ ਅਤੇ ਡਬਲ-ਲੇਅਰ N95 ਮਾਸਕ ਪਹਿਨਣ ਦੀ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
    ml: "{location}-ൽ വായുവിന്റെ ഗുണനിലവാരം അതീവ ഗുരുതരമാണ്. ജനലുകൾ അടച്ചിടാനും ഡബിൾ ലെയർ N95 മാസ്ക് ധരിക്കാനും നിർദ്ദേശിക്കുന്നു."
  },
  "Children and elderly {location} may face slight respiratory coughing or asthma flareups. Limit prolonged physical activity outside.": {
    en: "Children and elderly {location} may face slight respiratory coughing or asthma flareups. Limit prolonged physical activity outside.",
    hi: "{location} में बच्चों और बुजुर्गों को सांस लेने में हल्की तकलीफ या अस्थमा की समस्या हो सकती है। बाहर अधिक समय तक रहने से बचें।",
    mr: "{location} मधील मुले आणि वृद्धांना किरकोळ श्वास घेण्यास त्रास किंवा दम्याचा त्रास होऊ शकतो. बाहेर जास्त वेळ राहणे टाळा.",
    bn: "{location}-এ শিশু এবং বয়স্কদের সামান্য শ্বাসকষ্ট বা হাঁপানি হতে পারে। বাইরে দীর্ঘক্ষণ শারীরিক ক্রিয়াকলাপ সীমিত করুন।",
    te: "{location}లో పిల్లలు మరియు వృద్ధులు శ్వాస తీసుకోవడంలో స్వల్ప ఇబ్బంది లేదా ఉబ్బసం ఎదుర్కోవచ్చు. బయట ఎక్కువ సమయం గడపకండి.",
    ta: "{location} பகுதியில் உள்ள குழந்தைகள் மற்றும் முதியவர்களுக்கு லேசான சுவாச கோளாறு ஏற்படலாம். வெளியே செல்வதை தவிர்க்கவும்.",
    kn: "{location} ನಲ್ಲಿ ಮಕ್ಕಳು ಮತ್ತು ವೃದ್ಧರಿಗೆ ಸ್ವಲ್ಪ ಉಸಿರಾಟದ ತೊಂದರೆ ಅಥವಾ ಅಸ್ತಮಾ ಉಂಟಾಗಬಹುದು. ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಮಿತಿಗೊಳಿಸಿ.",
    gu: "{location}માં બાળકો અને વૃદ્ધોને શ્વાસ લેવામાં સામાન્ય તકલીફ અથવા અસ્થમાની અસર થઈ શકે છે. બહાર ફરવાનું મર્યાદિત કરો.",
    pa: "{location} ਵਿੱਚ ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਹਲਕੀ ਤਕਲੀਫ ਹੋ ਸਕਦੀ है। ਬਾਹਰ ਜ਼ਿਆਦਾ ਸਮਾਂ ਬਿਤਾਉਣ ਤੋਂ ਬਚੋ।",
    ml: "{location}-ൽ കുട്ടികൾക്കും മുതിർന്നവർക്കും നേരിയ ശ്വാസതടസ്സം അനുഭവപ്പെടാം. പുറത്തിറങ്ങുന്നത് പരമാവധി ഒഴിവാക്കുക."
  },
  "The air is clean and compliant {location}! Absolutely safe for early morning walk, yoga, or park sessions.": {
    en: "The air is clean and compliant {location}! Absolutely safe for early morning walk, yoga, or park sessions.",
    hi: "{location} में हवा साफ और सुरक्षित है! सुबह की सैर, योग या पार्क सत्र के लिए पूरी तरह से सुरक्षित।",
    mr: "{location} मध्ये हवा स्वच्छ आणि सुरक्षित आहे! पहाटेची सफर, योगासने किंवा पार्कमध्ये जाण्यासाठी पूर्णपणे सुरक्षित.",
    bn: "{location}-এ বাতাস পরিষ্কার এবং নিরাপদ! সকালের হাঁটা, যোগব্যায়াম বা পার্কের সেশনের জন্য সম্পূর্ণ নিরাপদ।",
    te: "{location}లో గాలి స్వచ్ఛంగా మరియు సురక్షितంగా ఉంది! ఉదయం నడక, యోగా లేదా పార్క్ సెషన్లకు పూర్తిగా సురక్షితం.",
    ta: "{location} பகுதியில் காற்று தூய்மையாகவும் பாதுகாப்பாகவும் உள்ளது! காலை நடைபயிற்சி, யோகா செய்ய மிகவும் ஏற்றது.",
    kn: "{location} ನಲ್ಲಿ ಗಾಳಿಯು ಸ್ವಚ್ಛ ಹಾಗೂ ಸುರಕ್ಷಿತವಾಗಿದೆ! ಬೆಳಗಿನ ನಡಿಗೆ, ಯೋಗ ಅಥವಾ ಉದ್ಯಾನವನದ ಸಮಯಕ್ಕೆ ಅತ್ಯಂತ ಸುರಕ್ಷಿತ.",
    gu: "{location}માં હવા સ્વચ્છ અને સલામત છે! સવારની સેર, યોગ અથવા બગીચામાં ફરવા માટે সম্পূর্ণ સલામત.",
    pa: "{location} ਵਿੱਚ ਹਵਾ ਸਾਫ਼ ਅਤੇ ਸੁਰੱਖिਅਤ है! सवेर दी सैर, योगा या पारक लई पूरी तरह सुरक्षित।",
    ml: "{location}-ൽ വായു ശുദ്ധവും സുരക്ഷിതവുമാണ്! രാവിലെയുള്ള നടത്തം, യോഗ, പാർക്ക് സന്ദർശനം എന്നിവയ്ക്ക് തികച്ചും സുരക്ഷിതം."
  },
  "state_avg_desc": {
    en: "Average atmospheric conditions computed across all {count} registered state monitoring stations.",
    hi: "सभी {count} पंजीकृत राज्य निगरानी स्टेशनों में गणना की गई औसत वायुमंडलीय स्थितियां।",
    mr: "सर्व {count} नोंदणीकृत राज्य मॉनिटरिंग स्टेशनवर मोजलेली सरासरी वातावरणाची स्थिती.",
    bn: "সমস্ত {count} নিবন্ধিত রাজ্য পর্যবেক্ষণ স্টেশন জুড়ে গড় বায়ুমণ্ডলীয় অবস্থা গণনা করা হয়েছে।",
    te: "నమోదైన అన్ని {count} రాష్ట్ర పర్యవేక్షణ కేంద్రాలలో లెక్కించబడిన సగటు వాతావరణ పరిస్థితులు.",
    ta: "பதிவுசெய்யப்பட்ட அனைத்து {count} மாநில கண்காணிப்பு நிலையங்களின் சராசரி காற்றின் தரம்.",
    kn: "ನೋಂದಾಯಿತ ಎಲ್ಲಾ {count} ರಾಜ್ಯ ಮೇಲ್ವಿಚಾರಣಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ಲೆಕ್ಕಹಾಕಿದ ಸರಾಸರಿ ವಾತಾವರಣದ ಪರಿಸ್थಿತಿಗಳು.",
    gu: "તમામ {count} નોંધાયેલા રાજ્ય મોનિટરિંગ સ્ટેશनों પર सरेराश वातावरणीય પરિસ્થિતિઓની ગણતરી કરવામાં આવી છે.",
    pa: "ਸਾਰੇ {count} ਰਜਿਸਟਰਡ ਰਾਜ ਨਿਗਰਾਨੀ ਸਟੇਸ਼ਨਾਂ ਵਿੱਚ ਔਸਤ ਵਾਯੂਮੰਡਲ ਦੀਆਂ ਸਥਿਤੀਆਂ।",
    ml: "രജിസ്റ്റർ ചെയ്ത എല്ലാ {count} നിരീക്ഷണ സ്റ്റേഷനുകളിലെയും ശരാശരി വായുനിലവാരം."
  },
  "Minimal impact. Satisfactory air.": {
    en: "Minimal impact. Satisfactory air.", hi: "न्यूनतम प्रभाव। संतोषजनक हवा।", mr: "किमान प्रभाव. समाधानकारक हवा.", bn: "ন্যূনতম প্রভাব। সন্তোষজনক বাতাস।", te: "కనిష్ట ప్రభావం. సంతൃప్తికరമായ గాలి.", ta: "குறைந்தபட்ச பாதிப்பு. திருப்திகரமான காற்று.", kn: "ಕನಿಷ್ಠ ಪ್ರಭಾವ. ತೃಪ್ತಿದಾಯಕ ಗಾಳಿ.", gu: "ન્યૂનતમ અસર. સંતોષકારક હવા.", pa: "ਘੱਟੋ-ਘੱਟ ਪ੍ਰਭਾਵ। ਸੰਤੋਖਜਨਕ ਹਵਾ।", ml: "കുറഞ്ഞ ആഘാതം. തൃപ്തികരമായ വായു."
  },
  "Minor breathing discomfort to sensitive people.": {
    en: "Minor breathing discomfort to sensitive people.", hi: "संवेदनशील लोगों को सांस लेने में मामूली परेशानी।", mr: "संवेदनशील लोकांना किरकोळ श्वास घेण्यास त्रास.", bn: "সংবেদনশীল ব্যক্তিদের সামান্য শ্বাসকষ্ট হতে পারে।", te: "సున్నితమైన వ్యక్తులకు స్వల్ప శ్వాసకోశ అసౌకర్యం.", ta: "பாதிப்புக்குள்ளாகும் மக்களுக்கு லேசான சுவாச அசௌகரியம்.", kn: "ಸೂಕ್ಷ್ಮ ಜನರಿಗೆ ಸಣ್ಣ ಉಸಿರಾಟದ ಅಸ್ವಸ್ಥತೆ.", gu: "સંવેદનશીલ લોકોને શ્વાસ લેવામાં સામાન્ય તકલીફ.", pa: "ਸੰਵੇਦਨਸ਼ੀਲ ਲੋਕਾਂ ਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮਾਮੂਲੀ ਤਕਲੀਫ।", ml: "അസുഖമുള്ളവർക്ക് നേരിയ ശ്വാസതടസ്സം."
  },
  "Breathing discomfort to children and elderly.": {
    en: "Breathing discomfort to children and elderly.", hi: "बच्चों और बुजुर्गों को सांस लेने में तकलीफ।", mr: "मुले आणि वृद्धांना श्वास घेण्यास त्रास.", bn: "শিশু এবং বয়স্কদের শ্বাসকষ্ট হতে পারে।", te: "పిల్లలు మరియు వృద్ధులకు శ్వాస తీసుకోవడంలో ఇబ్బంది.", ta: "குழந்தைகள் மற்றும் முதியவர்களுக்கு சுவாச அசௌகரியம்.", kn: "ಮಕ್ಕಳು ಮತ್ತು ವೃದ್ಧರಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆ.", gu: "બાળકો અને વૃદ્ધોને શ્વાસ લેવામાં તકલીફ.", pa: "ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ।", ml: "കുട്ടികൾക്കും മുതിർന്നവർക്കും ശ്വാസതടസ്സം."
  },
  "Breathing discomfort to most people on prolonged exposure.": {
    en: "Breathing discomfort to most people on prolonged exposure.", hi: "लंबे समय तक संपर्क में रहने पर अधिकांश लोगों को सांस लेने में तकलीफ।", mr: "जास्त वेळ संपर्कात राहिल्यास बहुतेक लोकांना श्वास घेण्यास त्रास.", bn: "দীর্ঘক্ষণ বাইরে থাকলে অধিকাংশ মানুষের শ্বাসকষ্ট হতে পারে।", te: "ఎక్కువ సమయం గడిపితే చాలా మందికి శ్వాస తీసుకోవడంలో ఇబ్బంది.", ta: "அதிக நேரம் வெளியே இருக்கும் போது பெரும்பாலான மக்களுக்கு சுவாச அசௌகரியம்.", kn: "ದೀರ್ಘಕಾಲದವರೆಗೆ ಸಂಪರ್ಕದಲ್ಲಿದ್ದರೆ ಹೆಚ್ಚಿನ ಜನರಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆ.", gu: "લાંબા સમય સુધી સંપર્કમાં રહેવાથી મોટાભાગના લોકોને શ્વાસ લેવામાં તકલીફ.", pa: "ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਸੰਪਰਕ ਵਿੱਚ ਰਹਿੰਦਿਆਂ ਸਾਹ ਦੀ ਤਕਲੀਫ਼।", ml: "കൂടുതൽ സമയം പുറത്തുനിൽക്കുന്നത് ശ്വാസതടസ്സത്തിന് കാരണമാകും."
  },
  "Respiratory illness on prolonged exposure.": {
    en: "Respiratory illness on prolonged exposure.", hi: "लंबे समय तक संपर्क में रहने पर श्वसन संबंधी बीमारी।", mr: "जास्त वेळ संपर्कात राहिल्यास श्वसनाचे आजार.", bn: "দীর্ঘক্ষণ বাইরে থাকলে শ্বাসযন্ত্রের রোগ হতে পারে।", te: "ఎక్కువ సమయం గడిపితే శ్వాసകോశ వ్యాਧులు రావచ్చు.", ta: "அதிக நேரம் வெளியே இருக்கும் போது சுவாச நோய்கள் ஏற்படலாம்.", kn: "ದೀರ್ಘಕಾಲದವರೆಗೆ ಸಂಪರ್ಕದಲ್ಲಿದ್ದರೆ ಉಸಿರಾಟದ ಕಾಯಿಲೆಗಳು ಬರಬಹುದು.", gu: "લાંબા સમય સુધી સંપર્કમાં રહેવાથી શ્વસન સંબંધી રોગ થઈ શકે.", pa: "ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਸੰਪਰਕ ਵਿੱਚ ਰਹਿਣ 'ਤੇ ਸਾਹ ਦੀ ਬਿਮารੀ ਹੋ ਸਕਦੀ ਹੈ।", ml: "ആരോഗ്യപ്രശ്നങ്ങൾക്ക് കാരണമായേക്കാം."
  },
  "Affects healthy people and seriously impacts those with existing diseases.": {
    en: "Affects healthy people and seriously impacts those with existing diseases.", hi: "स्वस्थ लोगों को प्रभावित करता है और पहले से बीमार लोगों पर गंभीर प्रभाव डालता है।", mr: "निरोगी लोकांवर परिणाम करतो आणि आधीच आजारी असलेल्यांवर गंभीर परिणाम करतो.", bn: "সুস্থ মানুষকে প্রভাবিত করে এবং পূর্ববর্তী রোগে আক্রান্তদের মারাত্মক ক্ষতি করে।", te: "ఆరోగ్యంగా ఉన్నవారిపై ప్రభావം చూపుతుంది మరియు ఇప్పటికే వ్యాधులు ఉన్నవారిపై తీవ్ర प्रभावం చూపుతుంది.", ta: "ஆரோக்கியமான மக்களையும் பாதிக்கும் மற்றும் ஏற்கனவே நோய் உள்ளவர்களை கடுமையாக பாதிக்கும்.", kn: "ಆರೋಗ್ಯವಂತ ಜನರ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ ಮತ್ತು ಈಗಾಗಲೇ ಕಾಯಿಲೆ ಇರುವವರ ಮೇಲೆ ಗಂಭೀರ ಪರಿಣಾಮ ಬೀರುತ್ತದೆ.", gu: "તંદુરસ્ત લોકોને અસર કરે છે અને અગાઉથી બીમાર લોકો પર ગંભીર અસર કરે છે.", pa: "ਸਿਹਤਮੰਦ ਲੋਕਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰਦਾ ਹੈ और ਪਹਿਲਾਂ ਤੋਂ ਬਿਮਾਰ ਲੋਕਾਂ 'ਤੇ ਗੰਭੀर ਪ੍ਰਭਾਵ ਪਾਉਂਦਾ ਹੈ।", ml: "ആരോഗ്യത്തെ ബാധിക്കുകയും അസുഖമുള്ളവരെ ഗുരുതരമായി ബാധിക്കുകയും ചെയ്യും."
  },
  "City": {
    en: "City", hi: "शहर", mr: "शहर", bn: "শহর", te: "నగరం", ta: "நகரம்", kn: "ನಗರ", gu: "શહેર", pa: "ਸ਼ਹਿਰ", ml: "നഗരം"
  },
  "State": {
    en: "State", hi: "राज्य", mr: "राज्य", bn: "রাজ্য", te: "రాష్ట్రం", ta: "மாநிலம்", kn: "ರಾಜ್ಯ", gu: "રાજ્ય", pa: "ਰਾਜ", ml: "സംസ്ഥാനം"
  },
  "Scope Status": {
    en: "Scope Status", hi: "स्कोप स्थिति", mr: "स्कोप स्थिती", bn: "স্কোপ স্ট্যাটাস", te: "పరిధి స్థితి", ta: "அளவீட்டு நிலை", kn: "ವ್ಯಾಪ್ತಿ ಸ್ಥಿತಿ", gu: "સ્થિતિ", pa: "ਸਥਿਤੀ", ml: "വ്യാപ്തി നില"
  },
  "Active Station": {
    en: "Active Station", hi: "सक्रिय स्टेशन", mr: "सक्रिय स्टेशन", bn: "সक्रिय स्टेशन", te: "సక్రియ స్టేషన్", ta: "செயலில் உள்ள நிலையம்", kn: "ಸಕ್ರಿಯ ನಿಲ್ದಾಣ", gu: "સક્રિય સ્ટેશન", pa: "ਸਰਗਰਮ ਸਟੇਸ਼ਨ", ml: "സജീവ സ്റ്റേഷൻ"
  },
  "State Average": {
    en: "State Average", hi: "राज्य औसत", mr: "राज्य सरासरी", bn: "রাজ্য গড়", te: "రాష్ట్ర సగటు", ta: "மாநில சராசரி", kn: "ರಾಜ್ಯದ ಸರασರಿ", gu: "રાજ્ય સરેરાશ", pa: "ਰਾਜ ਦੀ ਔਸਤ", ml: "സംസ്ഥാന ശരാശരി"
  },
  "CONNECTING SATELLITE RADAR...": {
    en: "CONNECTING SATELLITE RADAR...", hi: "सैटेलाइट रडार कनेक्ट किया जा रहा है...", mr: "सॅटेलाईट रडार कनेक्ट करत आहे...", bn: "স্যাটেলাইট রাডার সংযোগ করা হচ্ছে...", te: "శాటిలైట్ రాడార్ అనుసంధానించబడుతోంది...", ta: "செயற்கைக்கோள் ரேடார் இணைக்கப்படுகிறது...", kn: "ಸ್ಯಾಟಲೈಟ್ ರಾಡಾರ್ ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...", gu: "સેટેલાઇટ રડાર કનેક્ટ થઈ રહ્યું છે...", pa: "ਸੈਟੇਲਾਈਟ ਰਡਾਰ ਕਨੈਕਟ ਕੀਤਾ ਜਾ ਰਿਹਾ है...", ml: "ഉപഗ്രഹ റഡാർ ബന്ധിപ്പിക്കുന്നു..."
  },
  "Selected": {
    en: "Selected", hi: "चयनित", mr: "निवडलेले", bn: "নির্বাচিত", te: "ఎంచుకోబడింది", ta: "தேர்ந்தெடுக்கப்பட்டது", kn: "ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ", gu: "પસંદ કરેલ", pa: "ਚੁਣਿਆ ਗਿਆ", ml: "തിരഞ്ഞെടുത്തു"
  },
  "Live Data Source: ": {
    en: "Live Data Source: ", hi: "लाइव डेटा स्रोत: ", mr: "थेट डेटा स्रोत: ", bn: "लाइভ ডেটা উৎস: ", te: "प्रत्यక్ష డేటా మూలం: ", ta: "நேரடி தரவு ஆதாரம்: ", kn: "ಲೈವ್ ಡೇಟಾ ಮೂಲ: ", gu: "લાઇવ ડેટા સ્ત્રોત: ", pa: "ਲਾਈਵ ਡੇਟਾ ਸਰੋਤ: ", ml: "തത്സമയ വിവര ഉറവിടം: "
  },
  "Open-Meteo Air Quality": {
    en: "Open-Meteo Air Quality", hi: "ओपन-मेटियो वायु गुणवत्ता", mr: "ओपन-मेटियो वायू गुणवत्ता", bn: "ওপেন-মেটিও বায়ু গুণমান", te: "ఓపెन-మెటియో గాలి నాణ్యత", ta: "ஓபன்-மெட்டியோ காற்றின் தரம்", kn: "ಓಪನ್-ಮೆಟಿಯೊ ವಾಯು ಗುಣಮಟ್ಟ", gu: "ઓપન-મેટીયો એર ક્વોલિટી", pa: "ਓਪਨ-ਮੇਟੀਓ ਹਵਾ ਦੀ ਗੁਣਵੱੱਤਾ", ml: "ഓപ്പൺ-മെറ്റിയോ വായു ഗുണനിലവാരം"
  },
  "Base Simulation Model": {
    en: "Base Simulation Model", hi: "बेस सिमुलेशन मॉडल", mr: "बेस सिम्युलेशन मॉडेल", bn: "বেস সিমুলেশন मॉडल", te: "బేస్ సిమ్యులేషన్ మోడల్", ta: "அடிப்படை உருவகப்படுத்துதல் மாதிரி", kn: "ಮೂಲ ಸಿಮ್ಯುಲೇಶನ್ ಮಾದರಿ", gu: "બેઝ સિમ્યુલેશન મોડેલ", pa: "ਬੇਸ ਸਿਮੂਲੇਸ਼ਨ ਮਾਡਲ", ml: "അടിസ്ഥാന സിമുലേഷൻ മോഡൽ"
  },
  "Average atmospheric conditions computed across all registered state monitoring stations.": {
    en: "Average atmospheric conditions computed across all registered state monitoring stations.",
    hi: "सभी पंजीकृत राज्य निगरानी स्टेशनों पर गणना की गई औसत वायुमंडलीय स्थिति।",
    mr: "सर्व नोंदणीकृत राज्य देखरेख केंद्रांवर मोजलेली सरासरी वातावरणीय स्थिती.",
    bn: "সমস্ত নিবন্ধিত রাজ্য পর্যবেক্ষণ কেন্দ্র জুড়ে গণনা করা গড় বায়ুমণ্ডলীয় অবস্থা।",
    te: "అన్ని నమోదిత రాష్ట్ర పర్యవేక్షణ కేంద్రాలలో లెక్కించబడిన సగటు వాతావరణ పరిస్థితులు.",
    ta: "பதிவு செய்யப்பட்ட அனைத்து மாநில கண்காணிப்பு நிலையங்களிலும் கணக்கிடப்பட்ட சராசரி வளிமண்டல நிலைமைகள்.",
    kn: "ಎಲ್ಲಾ ನೋಂದಾಯಿತ ರಾಜ್ಯ ಮೇಲ್ವಿಚಾರಣಾ ಕೇಂದ್ರಗಳಲ್ಲಿ ಲೆಕ್ಕಹಾಕಿದ ಸರಾಸರಿ ವಾಯುಮಂಡಲದ ಪರಿಸ್थಿತಿಗಳು.",
    gu: "તમામ નોંધાયેલા રાજ્ય મોનિટરિંગ સ્ટેશનો પર ગણતરી કરેલ સરેરાશ વાતાવરણીય પરિસ્થિતિઓ.",
    pa: "ਸਾਰੇ ਰਜਿਸਟਰਡ ਰਾਜ ਨਿਗਰਾਨੀ ਸਟੇਸ਼ਨਾਂ ਵਿੱਚ ਗਣਨਾ ਕੀਤੀ ਗਈ ਔਸਤ ਵਾਯੂਮੰਡਲ ਸਥਿਤੀ।",
    ml: "രജിസ്റ്റർ ചെയ്ത എല്ലാ സംസ്ഥാന നിരീക്ഷണ സ്റ്റേഷനുകളിലും കണക്കാക്കിയ ശരാശരി അന്തരീക്ഷ സ്ഥിതി."
  },
  "Step 1: Snap or Upload Evidence": {
    en: "Step 1: Snap or Upload Evidence", hi: "चरण 1: साक्ष्य खींचे या अपलोड करें", mr: "पायरी १: पुरावा घ्या किंवा अपलोड करा", bn: "ধাপ ১: প্রমাণ নিন বা আপলোড করুন", te: "దశ 1: సాక్ష్యం తీసుకోండి లేదా అప్‌లోడ్ చేయండి", ta: "படி 1: ஆதாரத்தை எடுக்கவும் அல்லது பதிவேற்றவும்", kn: "ಹಂತ 1: ಸಾಕ್ಷ್ಯವನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", gu: "પગલું ૧: પુરાવો લો અથવા અપલોડ કરો", pa: "ਕਦਮ 1: ਸਬੂਤ ਖਿੱਚੋ ਜਾਂ ਅਪਲोਡ ਕਰੋ", ml: "ഘട്ടം 1: തെളിവ് എടുക്കുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക"
  },
  "Step 2: Add Hazard Details": {
    en: "Step 2: Add Hazard Details", hi: "चरण 2: संकट विवरण जोड़ें", mr: "पायरी २: संकटाची माहिती जोडा", bn: "ধাপ ২: দূষণের বিবরণ যোগ করুন", te: "దశ 2: ప్రమాద వివరాలను జోడించండి", ta: "படி 2: மாசு விவரங்களைச் சேர்க்கவும்", kn: "ಹಂತ 2: ಅಪಾಯದ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ", gu: "પગલું ૨: પ્રદૂષણની વિગતો ઉમેરો", pa: "ਕਦਮ 2: ਖਤਰੇ ਦੇ ਵੇਰਵੇ ਜੋੜੋ", ml: "ഘട്ടം 2: മലിനീകരണ വിവരങ്ങൾ ചേർക്കുക"
  },
  "Camera stream with active GPS watermarking": {
    en: "Camera stream with active GPS watermarking", hi: "सक्रिय जीपीएस वॉटरमार्किंग के साथ कैमरा स्ट्रीम", mr: "सक्रिय जीपीएस वॉटरमार्किंगसह कॅमेरा प्रवाह", bn: "সক্রিয় জিপিএস ওয়াটারমার্কিং সহ ক্যামেরা স্ট্রিম", te: "సక్రియ GPS వాటర్‌మార్కింగ్‌తో కెమెరా స్ట్రీమ్", ta: "செயலில் உள்ள ஜிபிஎஸ் வாட்டர்மார்க்கிங்குடன் கேமரா ஸ்ட்ரீம்", kn: "ಸಕ್ರಿಯ ಜಿಪಿಎಸ್ ವಾಟರ್‌ಮಾರ್ಕಿಂಗ್‌ನೊಂದಿಗೆ ಕ್ಯಾಮೆರಾ ಸ್ಟ್ರೀಮ್", gu: "સક્રિય જીપીએસ વોટરમાર્કિંગ સાથે કેમેરા સ્ટ્રીમ", pa: "ਸਰਗਰਮ GPS ਵਾਟਰਮਾਰਕਿੰਗ ਦੇ ਨਾਲ ਕੈਮਰਾ ਸਟ੍ਰੀਮ", ml: "സജീവ ജിപിഎസ് വാട്ടർമാർക്കിംഗുള്ള ക്യാമറ സ്ട്രീം"
  },
  "Annotate the air pollution observation": {
    en: "Annotate the air pollution observation", hi: "वायु प्रदूषण अवलोकन पर टिप्पणी करें", mr: "वायू प्रदूषण निरीक्षणाची नोंद करा", bn: "বায়ু দূষণ পর্যবেক্ষণের বিবরণ লিখুন", te: "గాలి কాలుష్య పరిశీలనను వివరించండి", ta: "காற்று மாசு அவதானிப்பைக் குறிக்கவும்", kn: "ವಾಯು ಮಾಲಿನ್ಯ ವೀಕ್ಷಣೆಯನ್ನು ವಿವರಣೆಗೊಳಿಸಿ", gu: "વાયુ પ્રદૂષણ અવલોકનની નોંધ કરો", pa: "ਹਵਾ ਪ੍ਰਦੂਸ਼ਣ ਨਿਰੀਖਣ 'ਤੇ ਟਿੱਪਣी करो", ml: "വായു മലിനീകരണ വിവരണം നൽകുക"
  },
  "Step {num} of 2": {
    en: "Step {num} of 2", hi: "चरण 2 का {num}", mr: "२ पैकी पायरी {num}", bn: "২ ভাগের {num} ধাপ", te: "2 లో దశ {num}", ta: "2 இல் படி {num}", kn: "2 ರಲ್ಲಿ ಹಂತ {num}", gu: "૨ માંથી પગલું {num}", pa: "2 ਵਿੱਚੋਂ ਕਦਮ {num}", ml: "2-ൽ ഘട്ടം {num}"
  },
  "Camera is Disconnected / Idle": {
    en: "Camera is Disconnected / Idle", hi: "कैमरा डिस्कनेक्टेड / निष्क्रिय है", mr: "कॅमेरा डिस्कनेक्ट / निष्क्रिय आहे", bn: "ক্যামেরা সংযোগ বিচ্ছিন্ন / অলস আছে", te: "కెమెరా డిస్‌కనెక్ట్ అయింది / ఖాళీగా ఉంది", ta: "கேமரா துண்டிக்கப்பட்டது / செயலிழந்துள்ளது", kn: "ಕ್ಯಾಮೆರಾ ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ / ನಿಷ್ಕ್ರಿಯವಾಗಿದೆ", gu: "કેમેરા ડિસ્કનેક્ટ / નિષ્ક્રિય છે", pa: "ਕੈਮਰਾ ਡਿਸਕਨੈਕਟਡ / ਨਿਸ਼ਕਿਰਿਆ ਹੈ", ml: "ക്യാമറ വിച്ഛേദിക്കപ്പെട്ടിരിക്കുന്നു / നിഷ്ക്രിയമാണ്"
  },
  "Start camera to snap real pollution hazards, or upload direct photos.": {
    en: "Start camera to snap real pollution hazards, or upload direct photos.",
    hi: "वास्तविक प्रदूषण खतरों की तस्वीर लेने के लिए कैमरा शुरू करें, या सीधे फोटो अपलोड करें।",
    mr: "वास्तविक प्रदूषण संकटांचे फोटो घेण्यासाठी कॅमेरा सुरू करा किंवा थेट फोटो अपलोड करा.",
    bn: "প্রকৃত দূষণের ছবি তোলার জন্য ক্যামেরা চালু করুন, অথবা সরাসরি ছবি আপলোড করুন।",
    te: "నిజమైన కాలుష్య ప్రమాదాలను చిత్రీకరించడానికి కెమెరాను ప్రారంభించండి లేదా నేరుగా ఫోటోలను అప్‌లోడ్ చేయండి.",
    ta: "உண்மையான மாசு அபாயங்களை எடுக்க கேமராவைத் தொடங்கவும் அல்லது நேரடியாகப் படங்களை பதிவேற்றவும்.",
    kn: "ನೈಜ ಮಾಲಿನ್ಯ ಅಪಾಯಗಳನ್ನು ಸೆರೆಹಿಡಿಯಲು ಕ್ಯಾಮೆರಾವನ್ನು ಪ್ರಾರಂಭಿಸಿ, ಅಥವಾ ನೇರ ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    gu: "વાસ્તવિક પ્રદૂષણના જોखમોનો ફોટો લેવા માટે કેમેરા શરૂ કરો અથવા સીધા ફોટા અપલોડ કરો.",
    pa: "ਅਸਲ ਪ੍ਰਦੂਸ਼ਣ ਦੇ ਖ਼ਤਰਿਆਂ ਦੀ ਤਸਵੀਰ ਲੈਣ ਲਈ ਕੈਮਰਾ ਸ਼ੁਰੂ ਕਰੋ, ਜਾਂ ਸਿੱਧੀਆਂ ਫੋਟੋਆਂ ਅਪਲੋਡ ਕਰੋ।",
    ml: "യഥാർത്ഥ മലിനീകരണങ്ങൾ പകർത്താൻ ക്യാമറ ആരംഭിക്കുക, അല്ലെങ്കിൽ നേരിട്ട് ഫോട്ടോകൾ അപ്‌ലോഡ് ചെയ്യുക."
  },
  "Start Live Camera": {
    en: "Start Live Camera", hi: "लाइव कैमरा शुरू करें", mr: "थेट कॅमेरा सुरू करा", bn: "লাইভ ক্যামেরা চালু করুন", te: "లైవ్ కెమెరా ప్రారంభించండి", ta: "நேரடி கேமராவைத் தொடங்குக", kn: "ಲೈವ್ ಕ್ಯಾಮೆರಾ ಪ್ರಾರಂಭಿಸಿ", gu: "લાઇવ કેમેરા શરૂ કરો", pa: "ਲਾਈਵ ਕੈਮਰਾ ਸ਼ੁਰੂ ਕਰੋ", ml: "തത്സമയ ക്യാമറ ആരംഭിക്കുക"
  },
  "Upload from Files": {
    en: "Upload from Files", hi: "फ़ाइलों से अपलोड करें", mr: "फायलींमधून अपलोड करा", bn: "ফাইল থেকে আপলোড করুন", te: "ఫైళ్ల నుండి అప్‌లోడ్ చేయండి", ta: "கோப்புகளிலிருந்து பதிவேற்றவும்", kn: "ಫೈಲ್‌ಗಳಿಂದ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", gu: "ફાઇલોમાંથી અપલોડ કરો", pa: "ਫਾਈਲਾਂ ਤੋਂ ਅਪਲੋਡ ਕਰੋ", ml: "ഫയലുകളിൽ നിന്ന് അപ്‌ലോഡ് ചെയ്യുക"
  },
  "Use Sample Preset Photo": {
    en: "Use Sample Preset Photo", hi: "नमूना प्रीसेट फोटो का उपयोग करें", mr: "नमुना प्रीसेट फोटो वापरा", bn: "নমুনা প্রিসেট ফটো ব্যবহার করুন", te: "నమూనా ప్రీసెట్ ఫోటోను ఉపయోగించండి", ta: "மாதிரி முன்னமைக்கப்பட்ட புகைப்படத்தைப் பயன்படுத்தவும்", kn: "ಮಾದರಿ ಪ್ರಿಸೆಟ್ ಫೋಟೋ ಬಳಸಿ", gu: "નમૂના પ્રીસેટ ફોટો વાપરો", pa: "ਨਮੂਨਾ ਪ੍ਰੀਸੈਟ ਫੋਟੋ ਦੀ ਵਰਤੋਂ ਕਰੋ", ml: "മാതൃകാ ഫോട്ടോ ഉപയോഗിക്കുക"
  },
  "PROCESSING EVIDENCE...": {
    en: "PROCESSING EVIDENCE...", hi: "साक्ष्य संसाधित किया जा रहा है...", mr: "पुराव्यावर प्रक्रिया सुरू आहे...", bn: "প্রমাণ প্রক্রিয়াকরণ করা হচ্ছে...", te: "సాక్ష్యాన్ని ప్రాసెస్ చేస్తోంది...", ta: "ஆதாரங்களை செயலாக்குகிறது...", kn: "ಸಾಕ್ಷ್ಯವನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...", gu: "પુરાવા પ્રોસેસ થઈ રહ્યા છે...", pa: "ਸਬੂਤ ਦੀ ਪ੍ਰਕਿਰਿਆ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...", ml: "തെളിവുകൾ വിശകലനം ചെയ്യുന്നു..."
  },
  "Location Watermark Target": {
    en: "Location Watermark Target", hi: "स्थान वॉटरमार्क लक्ष्य", mr: "स्थान वॉटरमार्क लक्ष्य", bn: "অবস্থান ওয়াটারমার্ক টার্গেট", te: "స్థాన వాటర్‌మార్క్ లక్ష్యం", ta: "இருப்பிட வாட்டர்மார்க் இலக்கு", kn: "ಸ್ಥಳ ವಾಟರ್‌ಮಾರ್ಕ್ ಗುರಿ", gu: "સ્થાન વોટરમાર્ક લક્ષ્ય", pa: "ਸਥਾਨ ਵਾਟਰਮਾਰਕ ਟੀਚਾ", ml: "ലൊക്കേഷൻ വാട്ടർമാർക്ക് ലക്ഷ്യം"
  },
  "Node:": {
    en: "Node:", hi: "नोड:", mr: "नोड:", bn: "নোড:", te: "నోడ్:", ta: "முனையம்:", kn: "ನೋಡ್:", gu: "નોડ:", pa: "ਨੋਡ:", ml: "നോഡ്:"
  },
  "Coord:": {
    en: "Coord:", hi: "समन्वय:", mr: "समन्वय:", bn: "স্থানাঙ্ক:", te: "కోఆర్డ్:", ta: "ஆயத்தொலைவு:", kn: "ನಿರ್ದೇಶಾಂಕ:", gu: "કો-ઓર્ડ:", pa: "ਕੋਆਰਡੀਨੇਟ:", ml: "നിർദ്ദേശാങ്കം:"
  },
  "Captured Evidence": {
    en: "Captured Evidence", hi: "कैप्चर किया गया साक्ष्य", mr: "मिळवलेला पुरावा", bn: "সংগৃহীত প্রমাণ", te: "సేకరించిన साక్ష్యం", ta: "கைப்பற்றப்பட்ட ஆதாரம்", kn: "ಸೆರೆಹಿಡಿಯಲಾದ ಸಾಕ್ಷ್ಯ", gu: "મેળવેલ પુરાવો", pa: "ਸਬੂਤ ਇਕੱਠੇ ਕੀਤੇ", ml: "ശേഖരിച്ച തെളിവ്"
  },
  "Retake / Change Photo": {
    en: "Retake / Change Photo", hi: "फ़ोटो पुनः लें / बदलें", mr: "फोटो पुन्हा घ्या / बदला", bn: "ফটো পুনরায় নিন / পরিবর্তন করুন", te: "ఫోટો మళ్‌ళీ తీసుకోండి / మార్చండి", ta: "மீண்டும் படம் எடுக்கவும் / மாற்றவும்", kn: "ಫೋಟೋ ಮರುಪಡೆಯಿರಿ / ಬದಲಾಯಿಸಿ", gu: "ફોટો ફરીથી લો / બદલો", pa: "ਫੋਟੋ ਦੁਬਾਰਾ ਲਓ / ਬਦਲੋ", ml: "ഫോട്ടോ വീണ്ടുമെടുക്കുക / മാറ്റുക"
  },
  "GPS EMBEDDED": {
    en: "GPS EMBEDDED", hi: "जीपीएस एम्बेडेड", mr: "जीपीएस एम्बेडेड", bn: "জিপিএস এমবেডেड", te: "GPS పొందుపరచబడింది", ta: "ஜிபிஎஸ் உட்பொதிக்கப்பட்டது", kn: "ಜಿಪಿಎಸ್ ಎಂಬೆಡೆಡ್", gu: "જીપીએસ એમ્બેડેડ", pa: "GPS ਐਮਬੇਡਡ", ml: "ജിപിഎസ് ഉൾപ്പെടുത്തിയിട്ടുണ്ട്"
  },
  "Choose Hazard Tag Type": {
    en: "Choose Hazard Tag Type", hi: "खतरा टैग प्रकार चुनें", mr: "संकट टॅग प्रकार निवडा", bn: "দূষণের ধরণ নির্বাচন করুন", te: "ప్రమాద ట్యాగ్ రకాన్ని ఎంచుకోండి", ta: "மாசு குறியீடு வகையைத் தேர்ந்தெடுக்கவும்", kn: "ಅಪಾಯದ ಟ್ಯಾಗ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ", gu: "પ્રદૂષણનો પ્રકાર પસંદ કરો", pa: "ਖਤਰੇ ਦੇ ਟੈਗ ਦੀ ਕਿਸਮ ਚੁਣੋ", ml: "മലിനീകരണ തരം തിരഞ്ഞെടുക്കുക"
  },
  "Smart GPS Tagging": {
    en: "Smart GPS Tagging", hi: "स्मार्ट जीपीएस टैगिंग", mr: "स्मार्ट जीपीएस टॅगिंग", bn: "স্মার্ট জিপিএস ট্যাগিং", te: "స్మార్ట్ GPS ట్యాగింగ్", ta: "ஸ்மார்ட் ஜிபிஎஸ் குறிச்சொல்", kn: "ಸ್ಮಾರ್ಟ್ ಜಿಪಿಎಸ್ ಟ್ಯಾಗಿಂಗ್", gu: "સ્માર્ટ જીપીએસ ટેગિંગ", pa: "ਸਮਾਰਟ GPS ਟੈਗਿੰਗ", ml: "സ്മാർട്ട് ജിപിഎസ് ടാഗിംഗ്"
  },
  "Auto-Attached": {
    en: "Auto-Attached", hi: "स्वतः संलग्न", mr: "स्वयंचलित जोडलेले", bn: "স্বয়ংক্রিয় সংযুক্ত", te: "ఆటో-జోడించబడింది", ta: "தானாக இணைக்கப்பட்டது", kn: "ಸ್ವಯಂ ಜೋಡಿಸಲಾಗಿದೆ", gu: "ઓટો-જોડાયેલ", pa: "ਆਪਣੇ ਆਪ ਜੋੜਿਆ ਗਿਆ", ml: "സ്വയം ബന്ധിപ്പിച്ചത്"
  },
  "Estimated AQI Modifier": {
    en: "Estimated AQI Modifier", hi: "अनुमानित AQI संशोधक", mr: "अंदाजित AQI मॉडिफायर", bn: "আনুমানিক AQI মডিফায়ার", te: "అంచనా వేసిన AQI సవరణకారుడు", ta: "மதிப்பிடப்பட்ட AQI மாற்றி", kn: "ಅಂದಾಜು AQI ಮಾರ್ಪಾಡುಗಾರ", gu: "અંદાજિત AQI મોડિફાયર", pa: "ਅਨੁਮਾਨਿਤ AQI ਸੋਧਕ", ml: "കണക്കാക്കിയ AQI മാറ്റം"
  },
  "Expected particulate increment:": {
    en: "Expected particulate increment:", hi: "अपेक्षित कण वृद्धि:", mr: "अपेक्षित कण वाढ:", bn: "প্রত্যাশিত কণা বৃদ্ধি:", te: "ఆశించిన సూక్ష్మ కణాల పెరుగుదల:", ta: "எதிர்பார்க்கப்படும் நுண் துகள்கள் அதிகரிப்பு:", kn: "ನಿರೀಕ್ಷಿತ ಸೂಕ್ಷ್ಮ ಕಣಗಳ ಹೆಚ್ಚಳ:", gu: "અપેક્ષિત રજકણોનો વધારો:", pa: "ਸੰਭਾਵਿਤ ਬਾਰੀਕ ਕਣਾਂ ਦਾ ਵਾਧਾ:", ml: "പ്രതീക്ഷിക്കുന്ന മലിനീകരണ വർദ്ധനവ്:"
  },
  "AQI Points": {
    en: "AQI Points", hi: "AQI अंक", mr: "AQI गुण", bn: "AQI পয়েন্ট", te: "AQI పాయింట్లు", ta: "AQI புள்ளிகள்", kn: "AQI ಅಂಕಗಳು", gu: "AQI પોઈન્ટ", pa: "AQI ਪੁਆਇੰਟ", ml: "AQI പോയിന്റുകൾ"
  },
  "Low": {
    en: "Low", hi: "कम", mr: "कमी", bn: "কম", te: "తక్కువ", ta: "குறைவு", kn: "ಕಡಿಮೆ", gu: "ઓછું", pa: "ਘੱट", ml: "കുറഞ്ഞത്"
  },
  "High": {
    en: "High", hi: "उच्च", mr: "जास्त", bn: "উচ্চ", te: "ఎక్కువ", ta: "அதிகம்", kn: "ಹೆಚ್ಚು", gu: "વધુ", pa: "ਉੱਚ", ml: "ഉയർന്നത്"
  },
  "Description / Comments": {
    en: "Description / Comments", hi: "विवरण / टिप्पणियां", mr: "वर्णन / टिप्पण्या", bn: "বিবরণ / মন্তব্য", te: "వివరణ / వ్యాఖ్యలు", ta: "விளக்கம் / கருத்துகள்", kn: "ವಿವರಣೆ / ಕಾಮೆಂಟ್‌ಗಳು", gu: "વર્ણન / ટિપ્પણીઓ", pa: "ਵੇਰਵਾ / ਟਿੱਪਣੀਆਂ", ml: "വിശദീകരണം / അഭിപ്രായം"
  },
  "BROADCAST TO COMMUNITY": {
    en: "BROADCAST TO COMMUNITY", hi: "समुदाय में प्रसारित करें", mr: "समुदायात प्रसारित करा", bn: "সম্প্রদায়ের মধ্যে সম্প্রচার করুন", te: "కమ్యూనిటీకి ప్రసారం చేయండి", ta: "சமூகத்தில் பரப்புங்கள்", kn: "ಸಮುದಾಯಕ್ಕೆ ಬಿತ್ತರಿಸಿ", gu: "સમુદાયમાં પ્રસારિત કરો", pa: "ਸਮੁਦਾਏ ਵਿੱਚ ਪ੍ਰਸਾਰਿਤ ਕਰੋ", ml: "കമ്മ്യൂണിറ്റിയിലേക്ക് അയക്കുക"
  },
  "Messages are synchronized on localized SOMA node": {
    en: "Messages are synchronized on localized SOMA node", hi: "संदेश स्थानीयकृत SOMA नोड पर सिंक्रनाइज़ किए जाते हैं", mr: "संदेश स्थानिक SOMA नोडवर सिंक्रनाइझ केले जातात", bn: "বার্তাগুলি স্থানীয় সোমা নোডে সমন্বয় করা হয়", te: "సন্দేశాలు స్థానిక SOMA నోడ్‌లో సమకాలీకరించబడతాయి", ta: "செய்திகள் உள்ளூர் சோமா முனையத்தில் ஒத்திசைக்கப்படுகின்றன", kn: "ಸಂದೇಶಗಳು ಸ್ಥಳೀಯ SOMA ನೋಡ್‌ನಲ್ಲಿ ಸಿಂಕ್ ಆಗುತ್ತವೆ", gu: "संदेशों को स्थानीय SOMA नोड पर सिंक किया जाता है", pa: "ਸੰਦੇਸ਼ ਸਥਾਨਕ SOMA ਨੋਡ 'ਤੇ ਸਿੰਕ ਕੀਤੇ ਜਾਂਦੇ ਹਨ", ml: "സന്ദേശങ്ങൾ പ്രാദേശിക സോമ നോഡുമായി ബന്ധിപ്പിച്ചിരിക്കുന്നു"
  },
  "Type into {city} group...": {
    en: "Type into {city} group...", hi: "{city} समूह में टाइप करें...", mr: "{city} ग्रुपमध्ये लिहा...", bn: "{city} গ্রুপে লিখুন...", te: "{city} గ్రూప్‌లో టైప్ చేయండి...", ta: "{city} குழுவில் எழுதவும்...", kn: "{city} ಗ್ರೂಪ್‌ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...", gu: "{city} ગ્રુપમાં લખો...", pa: "{city} ਗਰੁੱਪ ਵਿੱਚ ਲਿਖੋ...", ml: "{city} ഗ്രൂപ്പിലേക്ക് ടൈപ്പ് ചെയ്യുക..."
  },
  "Eco Guardian": {
    en: "Eco Guardian", hi: "इको गार्जियन", mr: "इको गार्डियन", bn: "ইকো গার্ডিয়ান", te: "ఇకో గార్డియన్", ta: "சுற்றுச்சூழல் பாதுகாவலர்", kn: "ಇಕೋ ಗಾರ್ಡಿಯನ್", gu: "ઇકો ગાર્ડિયન", pa: "ਈਕો ਗਾਰਡੀਅਨ", ml: "പരിസ്ഥിതി സംരക്ഷകൻ"
  },
  "Decarbon Champion": {
    en: "Decarbon Champion", hi: "डीकार्बन चैंपियन", mr: "डीकार्बन चॅम्पियन", bn: "ডিকার্বন চ্যাম্পিয়ন", te: "డీకార్బన్ ఛాంపియన్", ta: "கார்பன் குறைப்பு வெற்றியாளர்", kn: "ಡಿಕಾರ್ಬನ್ ಚಾಂಪಿಯನ್", gu: "ડીકાર્બન ચેમ્પિયન", pa: "ਡੀਕਾਰਬਨ ਚੈਂਪੀਅਨ", ml: "മലിനീകരണ വിരുദ്ധ ജേതാവ്"
  },
  "Aerosol Analyst": {
    en: "Aerosol Analyst", hi: "एरोसोल विश्लेषक", mr: "एरोसोल विश्लेषक", bn: "অ্যারোসল বিশ্লেষক", te: "ఏరోసోల్ విశ్లేషకుడు", ta: "ஏரோசல் ஆய்வாளர்", kn: "ಏರೋಸಾಲ್ ವಿಶ್ಲೇಷಕ", gu: "એરોસોલ વિશ્લેષક", pa: "ਐਰੋਸੋਲ ਵਿਸ਼ਲੇਸ਼ਕ", ml: "അന്തരീക്ഷ മലിനീകരണ നിരീക്ഷകൻ"
  },
  "Smog Spotter": {
    en: "Smog Spotter", hi: "स्मॉग स्पॉटर", mr: "स्मॉग स्पॉटर", bn: "স্মগ স্পটার", te: "స్మాగ్ స్పాటర్", ta: "புகைமூட்டம் கண்டறிபவர்", kn: "ಸ್ಮಾಗ್ ಸ್ಪಾಟರ್", gu: "સ્મોગ સ્પોટર", pa: "ਸਮੌਗ ਸਪੌਟਰ", ml: "പുകമഞ്ഞ് നിരീക്ഷകൻ"
  },
  "Clean Air Recruit": {
    en: "Clean Air Recruit", hi: "क्लीन एयर रिक्रूट", mr: "क्लीन एअर रिक्रूट", bn: "ক্লিন এয়ার রিক্রুট", te: "క్లీన్ ఎయిర్ రిక్రూట్", ta: "சுத்தமான காற்று புதியவர்", kn: "ಕ್ಲೀನ್ ಏರ್ ರಿಕ್ರೂಟ್", gu: "ક્લીન એર રિક્રૂટ", pa: "ਕਲੀਨ ਏਅਰ ਰਿਕਰੂਟ", ml: "ശുദ്ധവായു പ്രവർത്തകൻ"
  },
  "Rookie": {
    en: "Rookie", hi: "नौसिखिया", mr: "नवशिका", bn: "নবাগত", te: "కొత్తగా చేరినవాడు", ta: "ஆரம்பநிலை", kn: "ಹರಿಕಾರ", gu: "નવા નિશાળીયા", pa: "ਨਵਾਂ ਸਿੱਖਿਆ", ml: "തുടക്കക്കാരൻ"
  },
  "User Mini Profile": {
    en: "User Mini Profile", hi: "उपयोगकर्ता मिनी प्रोफ़ाइल", mr: "वापरकर्ता मिनी प्रोफाइल", bn: "ব্যবহারকারী মিনি প্রোফাইল", te: "వినియోగదారు मినీ ప్రొఫైల్", ta: "பயனர் மினி சுயவிவரம்", kn: "ಬಳಕೆದಾರ ಮಿನಿ ಪ್ರೊಫೈಲ್", gu: "વપરાશકર્તા મીની પ્રોફાઇલ", pa: "ਉਪਭੋਗਤਾ ਮਿੰਨੀ ਪ੍ਰੋਫਾਈਲ", ml: "ഉപയോക്താവ് മിനി പ്രൊഫൈൽ"
  },
  "Tap an avatar to update your profile": {
    en: "Tap an avatar to update your profile", hi: "अपनी प्रोफ़ाइल बदलने के लिए किसी अवतार पर टैप करें", mr: "तुमचे प्रोफाइल बदलण्यासाठी अवतारावर टॅप करा", bn: "আপনার প্রোফাইল পরিবর্তন করতে একটি অবতারে আলতো চাপুন", te: "మీ ప్రొఫైల్‌ను మార్చడానికి అవతార్‌ను నొక్కండి", ta: "உங்கள் சுயவிவரத்தை மாற்ற அவதாரத்தைத் தட்டவும்", kn: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಬದಲಾಯಿಸಲು ಅವತಾರವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ", gu: "તમારી પ્રોફાઇલ બદલવા માટે અવતાર પર ટેપ કરો", pa: "ਆਪਣੀ ਪ੍ਰੋਫਾਈਲ ਬਦਲਣ ਲਈ ਇੱਕ ਅਵਤਾਰ 'ਤੇ ਟੈਪ ਕਰੋ", ml: "നിങ്ങളുടെ പ്രൊഫൈൽ മാറ്റാൻ ഒരു അവതാർ തിരഞ്ഞെടുക്കുക"
  },
  "Citizen Handle": {
    en: "Citizen Handle", hi: "नागरिक हैंडल", mr: "नागरिक हँडल", bn: "নাগরিক হ্যান্ডেল", te: "సిటిజన్ హ్యాండిల్", ta: "குடிமகன் பயனர் பெயர்", kn: "ನಾಗರಿಕ ಹ್ಯಾಂಡಲ್", gu: "નાગરિક હેન્ડલ", pa: "ਨਾਗਰਿਕ ਹੈਂਡਲ", ml: "യൂസർ നെയിം"
  },
  "Edit Nickname": {
    en: "Edit Nickname", hi: "उपनाम बदलें", mr: "टोपणनाव बदला", bn: "ডাকনাম পরিবর্তন করুন", te: "మారుపేరు సవరించండి", ta: "புனைபெயரைத் திருத்து", kn: "ಅಡ್ಡಹೆಸರನ್ನು ಸಂಪಾದಿಸಿ", gu: "ટોપણનામ બદલો", pa: "ਉਪਨਾਮ ਬਦਲੋ", ml: "പേര് തിരുത്തുക"
  },
  "Your SOMA Node Channel": {
    en: "Your SOMA Node Channel", hi: "आपका SOMA नोड चैनल", mr: "तुमचे SOMA नोड चॅनेल", bn: "আপনার সোমা নোড চ্যানেল", te: "మీ SOMA నోడ్ ఛానల్", ta: "உங்கள் சோமா முனைய அலைவரிசை", kn: "ನಿಮ್ಮ SOMA ನೋಡ್ ಚಾನಲ್", gu: "તમારું SOMA નોડ ચેનल", pa: "ਤੁਹਾਡਾ SOMA ਨੋਡ ਚੈਨਲ", ml: "നിങ്ങളുടെ സോമ ചാനൽ"
  },
  "Account Controls": {
    en: "Account Controls", hi: "खाता नियंत्रण", mr: "खाते नियंत्रण", bn: "অ্যাকাউন্ট নিয়ন্ত্রণ", te: "ఖాతా నియంత్రణలు", ta: "கணக்கு கட்டுப்பாடுகள்", kn: "ಖಾತೆ ನಿಯಂತ್ರಣಗಳು", gu: "ખાતાના નિયંત્રણો", pa: "ਖਾਤਾ ਨਿਯੰਤਰਣ", ml: "അക്കൗണ്ട് നിയന്ത്രണങ്ങൾ"
  }
  ,
  "channel": {
    en: "channel", hi: "चैनल", mr: "चॅनेल", bn: "চ্যানেল", te: "ఛానల్", ta: "அலைவரிசை", kn: "ಚಾನಲ್", gu: "ચેનલ", pa: "ਚੈਨਲ", ml: "ചാനൽ"
  },
  "Danger Zone": {
    en: "Danger Zone", hi: "खतरे का क्षेत्र", mr: "धोकादायक क्षेत्र", bn: "বিপদ অঞ্চল", te: "ప్రమాదకర ప్రాంతं", ta: "அபாய பகுதி", kn: "ಅಪಾಯದ ವಲಯ", gu: "ડેન્જર ઝોન", pa: "ਖ਼ਤਰਨਾਕ ਖੇਤਰ", ml: "അപായ മേഖല"
  },
  "Reset Storage Warning": {
    en: "Clearing the app storage will log you out, erase your profile registration, and reset your earned Citizen Impact score and reports. This cannot be undone.",
    hi: "ऐप स्टोरेज खाली करने से आप लॉग आउट हो जाएंगे, आपका प्रोफाइल पंजीकरण मिट जाएगा, और आपके अर्जित नागरिक प्रभाव स्कोर और रिपोर्ट रीसेट हो जाएंगे। इसे वापस नहीं लिया जा सकता।",
    mr: "अॅप स्टोरेज साफ केल्याने तुम्ही लॉग आउट व्हाल, तुमचे प्रोफाइल नोंदणी मिटवली जाईल आणि तुमचे कमावलेले नागरिक प्रभाव गुण आणि अहवाल रीसेट केले जातील. हे परत केले जाऊ शकत नाही.",
    bn: "অ্যাপ স্টোরেজ মুছে ফেললে আপনি লগ আউট হয়ে যাবেন, আপনার প্রোফাইল নিবন্ধন মুছে যাবে এবং আপনার অর্জিত নাগরিক প্রভাব স্কোর এবং রিপোর্ট রিসেট হয়ে যাবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।",
    te: "యాప్ స్టోరేజ్ క్లియర్ చేయడం వల్ల మీరు లాగ్ అవుట్ అవుతారు, మీ ప్రൊఫైల్ నమోదు తొలగించబడుతుంది మరియు మీ పౌర ప్రభావ పాయింట్లు మరియు నివేదికలు రీసెట్ చేయబడతాయి. దీనిని మార్చలేరు.",
    ta: "பயன்பாட்டுச் சேமிப்பகത്തെ அழிப்பது உங்களை வெளியேற்றும், உங்கள் சுயவிவரப் பதிவை நீக்கும், மேலும் உங்கள் குடிமக்கள் பங்களிப்பு புள்ளிகள் এবং அறிக்கைகளை மீட்டமைக்கும். இதை மாற்றியமைக்க முடியாது.",
    kn: "ಅಪ್ಲಿಕೇಶನ್ ಸಂಗ್ರಹಣೆಯನ್ನು ತೆರವುಗೊಳಿಸುವುದರಿಂದ ನೀವು ಲಾಗ್ ಔಟ್ ಆಗುತ್ತೀರಿ, ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ನೋಂದಣಿ ಅಳಿಸಲ್ಪಡುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮ ಗಳಿಸಿದ ನಾಗರಿಕ ಪ್ರಭಾವದ ಅಂಕಗಳು ಮತ್ತು ವರದಿಗಳನ್ನು ಮರುಹೊಂದಿಸುತ್ತದೆ. ಇದನ್ನು ರದ್ದುಗೊಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.",
    gu: "એપ સ્ટોરેજ સાફ કરવાથી તમે લોગ આઉટ થઈ જશો, તમારી પ્રોફાઇલ નોંધણી ભૂંસાઈ જશે અને તમારા મેળવેલા નાગરিক પ્રભાવ પોઇન્ટ્સ અને રિપોર્ટ્સ રીસેટ થઈ જશે. આ પાછું ખેંચી શકાશે નહીં.",
    pa: "ਐਪ ਸਟੋਰੇਜ ਨੂੰ ਸਾਫ਼ ਕਰਨ ਨਾਲ ਤੁਸੀਂ ਲੌਗ ਆਉਟ ਹੋ ਜਾਓਗੇ, ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਮਿਟ ਜਾਵੇਗੀ, ਅਤੇ ਤੁਹਾਡੇ ਕਮਾਏ ਨਾਗਰਿਕ ਪ੍ਰਭਾਵ ਅੰਕ ਅਤੇ ਰਿਪੋਰਟਾਂ ਰੀਸੈਟ ਹੋ ਜਾਣਗੀਆਂ। ਇਸਨੂੰ ਵਾਪਸ ਨਹੀਂ ਲਿਆ ਜਾ ਸਕਦਾ।",
    ml: "ആപ്പ് സ്റ്റോറേജ് മായ്ക്കുന്നത് നിങ്ങളെ ലോഗ് ഔട്ട് ചെയ്യും, പ്രൊഫൈൽ രജിസ്ട്രേഷൻ ഇല്ലാതാക്കും, കൂടാതെ നിങ്ങളുടെ പോയിന്റുകളും റിപ്പോർട്ടുകളും റീസെറ്റ് ചെയ്യും. ഇത് പഴയപടിയാക്കാൻ കഴിയില്ല."
  },
  "Air Quality Scope": {
    en: "Air Quality Scope", hi: "वायु गुणवत्ता का दायरा", mr: "हवेची गुणवत्ता व्याप्ती", bn: "বায়ুর গুণমান পরিধি", te: "వాయు నాణ్యత परिधि", ta: "காற்று தர எல்லை", kn: "ಗಾಳಿಯ ಗುಣಮಟ್ಟ ವ್ಯಾಪ್ತಿ", gu: "હવાની ગુણவत्ता સ્કોપ", pa: "ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਦਾ ਘੇਰਾ", ml: "വായു ഗുണനിലവാര പരിധി"
  },
  "🛰️ Open-Meteo Air Quality": {
    en: "🛰️ Open-Meteo Air Quality", hi: "🛰️ ओपन-मीटियो वायु गुणवत्ता", mr: "🛰️ ओपन-मीटियो हवेची गुणवत्ता", bn: "🛰️ ওপেন-মিটিও বায়ুর গুণমান", te: "🛰️ ఓపెన్-మీటియో వాయు నాణ్యత", ta: "🛰️ ஓபன்-மீட்டியோ காற்று தரம்", kn: "🛰️ ಓಪನ್-ಮೀಟಿಯೋ ವಾಯು ಗುಣಮಟ್ಟ", gu: "🛰️ ઓપન-મીટીયો હવાની ગુણવત્તા", pa: "🛰️ ਓਪਨ-ਮੀਟੀਓ ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ", ml: "🛰️ ഓപ്പൺ-മീറ്റിയോ വായു ഗുണനിലവാരം"
  },
  "📡 Base Simulation Model": {
    en: "📡 Base Simulation Model", hi: "📡 आधार सिमुलेशन मॉडल", mr: "📡 बेस सिम्युलेशन मॉडेल", bn: "📡 বেস সিমুলেশন मॉडल", te: "📡 బేస్ సిమ్యులేషన్ మోడల్", ta: "📡 அடிப்படை சிமுலேஷன் மாதிரி", kn: "📡 ಬೇಸ್ ಸಿಮ್ಯುಲೇಶನ್ ಮಾದರಿ", gu: "📡 બેઝ સિમ્યુલેશન મોડેલ", pa: "📡 ਬੇਸ ਸਿਮੂਲੇਸ਼ਨ ਮਾਡਲ", ml: "📡 സിമുലേഷൻ മോഡൽ"
  },
  "health_adv_hazard": {
    en: "Air particulate levels are hazardous {scope}. Highly advise shutting windows and wearing double-layer N95 masks.",
    hi: "वायु कण स्तर {scope} खतरनाक हैं। खिड़कियां बंद रखने और दोहरी परत वाले एन95 मास्क पहनने की अत्यधिक सलाह दी जाती है।",
    mr: "हवेतील कणांचे प्रमाण {scope} धोकादायक आहे. खिडक्या बंद ठेवण्याचा आणि दुहेरी पदरी N95 मास्क वापरण्याचा सल्ला दिला जातो.",
    bn: "বায়ুর কণার মাত্রা {scope} বিপজ্জনক। জানালা বন্ধ রাখার এবং ডাবল-লেয়ার N95 মাস্ক পরার জোরালো পরামর্শ দেওয়া হচ্ছে।",
    te: "గాలిలోని రేణువుల స్థాయిలు {scope} ప్రమాదకరంగా ఉన్నాయి. కిటికీలు మూసివేయాలని మరియు డబుల్ లేయర్ N95 మాస్క్‌లను ధరించాలని గట్టిగా సలహా ఇవ్వబడింది.",
    ta: "{scope} காற்றின் தரம் மிகவும் மோசமாக உள்ளது. ஜன்னல்களை மூடி வைக்கவும், N95 முகக்கவசம் அணியவும் அறிவுறுத்தப்படுகிறது.",
    kn: "ಗಾಳಿಯ ಕಣಗಳ ಮಟ್ಟವು {scope} ಅಪಾಯಕಾರಿಯಾಗಿದೆ. ಕಿಟಕಿಗಳನ್ನು ಮುಚ್ಚಲು ಮತ್ತು ಡಬಲ್-ಲೇಯರ್ N95 ಮಾಸ್ಕ್‌ಗಳನ್ನು ಧರಿಸಲು ಹೆಚ್ಚು ಸಲಹೆ ನೀಡಲಾಗುತ್ತದೆ.",
    gu: "હવાના કણોનું સ્તર {scope} જોખમી છે. બારીઓ બંધ રાખવાની અને ડબલ-લેયર N95 માસ્ક પહેરવાની ભારપૂર્વક સલાહ આપવામાં આવે છે.",
    pa: "ਹਵਾ ਵਿੱਚ ਕਣਾਂ ਦਾ ਪੱਧਰ {scope} ਖ਼ਤਰਨਾਕ ਹੈ। ਖਿੜਕੀਆਂ ਬੰਦ ਰੱਖਣ ਅਤੇ ਡਬਲ-ਲੇਅਰ N95 ਮਾਸਕ ਪਹਿਨਣ ਦੀ ਸਖ਼ਤ ਸਲਾਹ ਦਿੱਤੀ ਜਾਂਦੀ ਹੈ।",
    ml: "{scope} വായു നിലവാരം മോശമാണ്. ജനലുകൾ അടച്ചിടാനും ഡബിൾ ലെയർ N-95 മാസ്ക് ധരിക്കാനും നിർദ്ദേശിക്കുന്നു."
  },
  "health_adv_sensitive": {
    en: "Children and elderly {scope} may face slight respiratory coughing or asthma flareups. Limit prolonged physical activity outside.",
    hi: "बच्चों और बुजुर्गों को {scope} हल्की खांसी या अस्थमा की समस्या हो सकती है। बाहर लंबे समय तक शारीरिक गतिविधि को सीमित करें।",
    mr: "मुले आणि वृद्धांना {scope} खोकला किंवा दम्याचा त्रास होऊ शकतो. बाहेर जास्त वेळ शारीरिक हालचाली करणे मर्यादित करा.",
    bn: "শিশু এবং বয়স্ক ব্যক্তিরা {scope} সামান্য শ্বাসকষ্ট বা হাঁপানির সমস্যায় পড়তে পারেন। বাইরে দীর্ঘক্ষণ শারীরিক কার্যকলাপ সীমিত করুন।",
    te: "పిల్లలు మరియు వృద్ధులు {scope} స్వల్ప శ్వాసకోశ దగ్గు లేదా ఉబ్బసం సమస్యలను ఎదుర్కొనవచ్చు. బయట ఎక్కువ సమయం శారీరక శ్రమను పరిమితం చేయండి.",
    ta: "குழந்தைகள் மற்றும் முதியவர்களுக்கு {scope} இருமல் அல்லது ஆஸ்துமா பாதிப்பு ஏற்படலாம். வெளியே அதிக நேரம் இருப்பதைத் தவிர்க்கவும்.",
    kn: "ಮಕ್ಕಳು आणि ವೃದ್ಧರು {scope} ಸ್ವಲ್ಪ ಉಸಿರಾಟದ ಕೆಮ್ಮು ಅಥವಾ ಆಸ್ತಮಾ ಉಲ್ಬಣವನ್ನು ಎದುರಿಸಬಹುದು. ಹೊರಗೆ ದೀರ್ಘಕಾಲದ ದೈಹಿಕ ಚಟುವಟಿಕೆಯನ್ನು ಮಿತಿಗೊಳಿಸಿ.",
    gu: "બાળકો અને વૃદ્ધો {scope} શ્વાસની સામાન્ય ઉધરસ અથવા અસ્થમાની સમસ્યાનો સામનો કરી શકે છે. બહાર લાંબા સમય સુધી શારીરિક પ્રવૃત્તિ મર્યાદિત કરો.",
    pa: "ਬੱਚਿਆਂ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਨੂੰ {scope} ਹਲਕੀ ਖੰਘ ਜਾਂ ਦਮੇ ਦੀ ਸਮੱਸਿਆ ਹੋ सकती है। ਬਾਹर लੰਬੇ ਸਮੇਂ ਤੱਕ ਸਰੀਰਕ ਗਤੀਵਿਧੀ ਨੂੰ ਸੀਮਤ ਕਰੋ।",
    ml: "കുട്ടികൾക്കും മുതിർന്നവർക്കും {scope} ചുമ അല്ലെങ്കിൽ ശ്വാസംമുട്ടൽ അനുഭവപ്പെടാം. പുറത്തിറങ്ങുന്നത് ഒഴിവാക്കുക."
  },
  "health_adv_clean": {
    en: "The air is clean and compliant {scope}! Absolutely safe for early morning walk, yoga, or park sessions.",
    hi: "हवा {scope} साफ और अनुकूल है! सुबह की सैर, योग या पार्क सत्र के लिए बिल्कुल सुरक्षित।",
    mr: "हवा {scope} स्वच्छ आणि सुसंगत आहे! पहाटेची फिरायला जाणे, योग किंवा पार्क सत्रांसाठी पूर्णपणे सुरक्षित.",
    bn: "বাতাস {scope} পরিষ্কার এবং অনুকূল! ভোরে হাঁটাহাঁটি, যোগব্যায়াম বা পার্ক সেশনের জন্য সম্পূর্ণ নিরাপদ।",
    te: "గాలి {scope} స్వచ్ఛంగా మరియు అనుకూలంగా ఉంది! ఉదయాన్నే నడక, యోగా లేదా పార్క్ సెషన్‌లకు పూర్తిగా సురక్షితం।",
    ta: "{scope} காற்று தூய்மையாக உள்ளது! காலை நடைப்பயிற்சி, யோகா செய்ய மிகவும் ஏற்றது.",
    kn: "ಗಾಳಿಯು {scope} ಸ್ವಚ್ಛವಾಗಿದೆ ಮತ್ತು ಅನುಸರಣೆಯಾಗಿದೆ! ಮುಂಜಾನೆ ನಡಿಗೆ, ಯೋಗ ಅಥವಾ ಪಾರ್ಕ್ ಸೆಷನ್‌ಗಳಿಗೆ ಸಂಪೂರ್ಣವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿದೆ.",
    gu: "હવા {scope} સ્વચ્છ અને અનુકૂળ છે! સવારની સેર, યોગ અથવા પાર્क સત્રો માટે સંપૂર્ણપણે સુરક્ષિત.",
    pa: "ਹਵਾ {scope} ਸਾਫ਼ ਅਤੇ ਅਨੁਕੂਲ ਹੈ! ਸਵੇਰ ਦੀ ਸੈਰ, ਯੋਗਾ ਜਾਂ ਪਾਰਕ ਸੈਸ਼ਨਾਂ ਲਈ ਬਿਲਕੁल ਸੁਰੱਖਿਅਤ।",
    ml: "{scope} വായു ശുദ്ധമാണ്! രാവിലെ നടക്കുന്നതിനും യോഗ ചെയ്യുന്നതിനും ഉചിതമാണ്."
  },
  "across the state region": {
    en: "across the state region", hi: "राज्य क्षेत्र भर में", mr: "राज्य क्षेत्रात", bn: "রাজ্য অঞ্চল জুড়ে", te: "రాష్ట్ర ప్రాంతమంతటా", ta: "மாநில பகுதி முழுவதும்", kn: "ರಾಜ್ಯ ಪ್ರದೇಶದಾದ್ಯಂತ", gu: "સમગ્ર રાજ્ય ક્ષેત્રમાં", pa: "ਰਾਜ ਖੇਤਰ ਵਿੱਚ", ml: "സംസ്ഥാനത്തുടനീളം"
  },
  "in {city}": {
    en: "in {city}", hi: "{city} में", mr: "{city} मध्ये", bn: "{city}-এ", te: "{city}లో", ta: "{city}ல்", kn: "{city}ನಲ್ಲಿ", gu: "{city}માં", pa: "{city} ਵਿੱਚ", ml: "{city}-ൽ"
  },
  "badge_desc_1": {
    en: "Submit your first verified local AQI hazard report.", hi: "अपनी पहली सत्यापित स्थानीय AQI खतरा रिपोर्ट सबमिट करें।", mr: "तुमचा पहिला सत्यापित स्थानिक AQI धोका अहवाल सबमिट करा.", bn: "আপনার প্রথম যাচাইকৃত স্থানীয় AQI ঝুঁকি রিপোর্ট জমা দিন।", te: "మీ మొదటి ధృవీకరించబడిన స్థానిక AQI ప్రమాద నివేదికను సమర్పించండి.", ta: "உங்கள் முதல் சரிபார்க்கப்பட்ட காற்று மாசு புகாரைச் സമർപ്പിക്കുക.", kn: "ನಿಮ್ಮ మొదటి ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ಸ್ಥಳೀಯ AQI ಅಪಾಯದ ವರದಿಯ ಸಲ್ಲಿಸಿ.", gu: "તમારો પ્રથમ ચકાસાયેલ સ્થાનિક AQI જોખમ અહેવાલ સબમિટ કરો.", pa: "ਆਪਣी पहली प्रमਾਣਿਤ ਸਥਾਨਕ AQI ਖ਼ਤਰਾ ਰਿਪੋਰਟ ਦਰਜ ਕਰੋ।", ml: "നിങ്ങളുടെ ആദ്യ വായു മലിനീകരണ റിപ്പോർട്ട് സമർപ്പിക്കുക."
  },
  "badge_desc_3": {
    en: "Submit 3 verified local AQI hazard reports to map nearby hotspots.", hi: "आसपास के हॉटस्पॉट को मैप करने के लिए 3 सत्यापित स्थानीय AQI खतरा रिपोर्ट सबमिट करें।", mr: "जवळपासचे हॉटस्पॉट मॅप करण्यासाठी ३ पुष्टी केलेले धोका अहवाल सबमिट करा.", bn: "আশেপাশের হটস্পটগুলি চিহ্নিত করতে ৩টি যাচাইকৃত স্থানীয় AQI ঝুঁকি রিপোর্ট জমা দিন।", te: "సమీపంలోని హాట్‌స్పాట్‌లను మ్యాప్ చేయడానికి 3 ధృవీకరించబడిన స్థానిక AQI ప్రమాద నివేదికలను సమర్పించండి.", ta: "அருகிலுள்ள மாசு பகுதிகளைக் கண்டறிய 3 சரிபார்க்கப்பட்ட காற்று மாசு புகார்களைச் சமர்ப்பிக்கவும்.", kn: "ಹತ್ತಿರದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲು 3 ದೃಢೀಕರಿಸಲ್ಪಟ್ಟ ಸ್ಥಳೀಯ AQI ಅಪಾಯದ ವರದಿಗಳನ್ನು ಸಲ್ಲಿಸಿ.", gu: "નજીકના હોટસ્પોટ્સને મેપ કરવા માટે ૩ ચકાસાયેલ સ્થાનિક AQI જોખમ અહેવાલો સબմિટ કરો.", pa: "ਨੇੜਲੇ ਹੌਟਸਪੌਟਸ ਦਾ ਨਕਸ਼ਾ ਬਣਾਉਣ ਲਈ 3 ਪ੍ਰਮਾਣਿਤ ਸਥਾਨਕ AQI ਖ਼ਤਰਾ ਰਿਪੋਰਟਾਂ ਦਰਜ ਕਰੋ।", ml: "സമീപത്തെ മലിനീകരണ മേഖലകൾ കണ്ടെത്താൻ 3 റിപ്പോർട്ടുകൾ സമർപ്പിക്കുക."
  },
  "badge_desc_5": {
    en: "Validate 5 localized PM2.5 / PM10 hazard incidents.", hi: "5 स्थानीयकृत PM2.5 / PM10 खतरे की घटनाओं को सत्यापित करें।", mr: "५ स्थानिक PM2.5 / PM10 धोका घटनांची पडताळणी करा.", bn: "৫টি স্থানীয় PM2.5 / PM10 ঝুঁকির ঘটনা যাচাই করুন।", te: "5 స్థానిక PM2.5 / PM10 ప్రమాద సంఘటనలను ധృവീകരിക്കുക.", ta: "5 உள்ளூர் PM2.5 / PM10 மாசு நிகழ்வுகளைச் சரிபார்க்கவும்.", kn: "5 ಸ್ಥಳೀಯ PM2.5 / PM10 ಅಪಾಯದ ಘಟನೆಗಳನ್ನು ದೃಢೀಕರಿಸಿ.", gu: "૫ સ્થાનિક PM2.5 / PM10 જોખમની ઘટનાઓ ચકાસો.", pa: "5 ਸਥਾਨਕ PM2.5 / PM10 ਖ਼ਤਰੇ ਦੀਆਂ ਘਟਨਾਵਾਂ ਨੂੰ ਪ੍ਰਮਾਣਿਤ ਕਰੋ।", ml: "5 പ്രാദേശിക PM2.5 / PM10 മലിനീകരണ സംഭവങ്ങൾ സ്ഥിരീകരിക്കുക."
  },
  "badge_desc_8": {
    en: "Help municipal networks map 8 regional aerosol violations.", hi: "नगर निगम नेटवर्क को 8 क्षेत्रीय एरोसोल उल्लंघनों को मैप करने में मदद करें।", mr: "महानगरपालिका नेटवर्कला ८ प्रादेशिक एरोसोल उल्लंघनांचे मॅपिंग करण्यात मदत करा.", bn: "পৌরসভা নেটওয়ার্ককে ৮টি আঞ্চলিক অ্যারোসল লঙ্ঘন চিহ্নিত করতে সহায়তা করুন।", te: "మునిసిపల్ నెట్‌వర్క్‌లకు 8 ప్రాంతীয় ఏరోసోల్ ఉల్లంఘనలను మ్యాప్ చేయడంలో సహాయపడండి.", ta: "நகராட்சி அமைப்புகளுக்கு 8 மண்டல ஏரோசல் விதிமீறல்களைக் கண்டறிய உதவவும்.", kn: "ನಗರಸಭೆ ನೆಟ್‌ವರ್ಕ್‌ಗಳಿಗೆ 8 ಪ್ರಾದೇಶಿಕ ಏರೋಸಾಲ್ ಉಲ್ಲಂಘನೆಗಳನ್ನು ಮ್ಯಾಪ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡಿ.", gu: "મ્યુનિસિપલ નેટવર્ક્સને ૮ પ્રાદેશિક એરોસોલ ઉલ્લંઘનો મેપ કરવામાં મદદ કરો.", pa: "ਨਗਰ ਨਿਗਮ ਨੈੱਟਵਰਕਾਂ ਨੂੰ 8 ਖੇਤਰੀ ਐਰੋਸੋਲ ਉਲੰਘਣਾਵਾਂ ਦਾ ਨਕਸ਼ਾ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰੋ।", ml: "നഗരസഭകളെ 8 വായു മലിനീകരണ നിയമലംഘനങ്ങൾ കണ്ടെത്താൻ സഹായിക്കുക."
  },
  "badge_desc_12": {
    en: "Become an official guardian by confirming 12 local air anomalies.", hi: "12 स्थानीय वायु विसंगतियों की पुष्टि करके एक आधिकारिक संरक्षक बनें।", mr: "१२ स्थानिक हवेच्या विसंगतींची पुष्टी करून अधिकृत संरक्षक बना.", bn: "১২টি স্থানীয় বায়ুর অসঙ্গতি নিশ্চিত করে একজন আনুষ্ঠানিক অভিভাবক হন।", te: "12 స్థానిక గాలి వైరుధ్యాలను ధృവീకరించడం ద్వారా అధికారಿಕ రక్షకుడిగా మారండి.", ta: "12 உள்ளூர் காற்று முരண்பாடுகளை உறுதிப்படுத்தி அதிகாரப்பூர்வ பாதுகாவலராகுங்கள்.", kn: "12 ಸ್ಥಳೀಯ ಗಾಳಿಯ ವೈಪರೀತ್ಯಗಳನ್ನು ದೃಢೀಕರಿಸುವ ಮೂಲಕ ಅಧಿಕೃತ ರಕ್ಷಕರಾಗಿರಿ.", gu: "૧૨ स्थानिक હવાની વિસંગતતાઓની પુષ્ટિ કરીને સત્તાવાર રક્ષક બનો.", pa: "12 ਸਥਾਨਕ ਹਵਾ ਦੀਆਂ ਅਸੰਗਤੀਆਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰਕੇ ਅਧਿਕਾਰਤ ਸਰਪ੍ਰਸਤ ਬਣੋ।", ml: "12 വായു വ്യതിയാനങ്ങൾ സ്ഥിരീകരിച്ച് ഔദ്യോഗിക സംരക്ഷകനാവുക."
  }
};

function getString(key: string, lang: LanguageCode): string {
  if (!LOCALIZED_STRINGS[key]) {
    return key;
  }
  return LOCALIZED_STRINGS[key][lang] || LOCALIZED_STRINGS[key]['en'] || key;
}

interface CitizenPortalProps {
  viewMode?: string;
  onShowToast: (msg: string) => void;
}

export default function CitizenPortal({ onShowToast }: CitizenPortalProps) {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [activeTab, setActiveTab] = useState<string>('radar');
  const [liveAqi, setLiveAqi] = useState<number>(110);
  const [pm25, setPm25] = useState<number>(45);
  const [pm10, setPm10] = useState<number>(75);
  const [userPoints, setUserPoints] = useState<number>(180);
  const [userReportsCount, setUserReportsCount] = useState<number>(2);
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cleanair_india_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) return parsed;
      } catch (e) {}
    }
    return {
      name: '',
      state: 'Delhi NCR',
      city: 'New Delhi',
      userId: '',
      registered: false,
      avatar: '🧑🏽‍💼'
    };
  });
  const [selectedState, setSelectedState] = useState<string>(profile.state || 'Delhi NCR');
  const [selectedCityName, setSelectedCityName] = useState<string>(profile.city || 'New Delhi');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cleanair_notifications') !== 'false';
  });
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cleanair_refresh') !== 'false';
  });
  const [apiSource, setApiSource] = useState<'api' | 'fallback'>('fallback');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cleanair_sound') !== 'false';
  });
  const [myReports, setMyReports] = useState<any[]>([]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<string>(profile.name);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setEditingName(profile.name);
  }, [profile.name]);
  
  // Real-time Cloud Reports and Mock Fallback for Peer Reviews
  const [peerReportsToVerify, setPeerReportsToVerify] = useState<Array<{
    id: string;
    reporter: string;
    distance: string;
    category: string;
    description: string;
    verified: boolean;
    userId?: string;
    spam?: boolean;
  }>>([
    {
      id: 'rep-peer-1',
      reporter: 'Ananya Roy',
      distance: '0.8 km away',
      category: 'Trash',
      description: 'Massive garbage burning behind the community market. Smoke is spreading.',
      verified: false
    },
    {
      id: 'rep-peer-2',
      reporter: 'Vikram Seth',
      distance: '1.4 km away',
      category: 'Dust',
      description: 'Major construction site blowing concrete dust without any water sprinkling.',
      verified: false
    }
  ]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const currentCities = INDIAN_STATES_CITIES.find((s) => s.stateName === selectedState)?.cities || [];

  // Firebase Auth and Profile Synchronization
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        // Fetch user document from Firestore to sync their data
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const loadedProfile: UserProfile = {
              name: data.name || user.displayName || 'Google Citizen',
              state: data.state || 'Delhi NCR',
              city: data.city || 'New Delhi',
              userId: '',
              registered: true,
              avatar: data.avatar || '🧑🏽‍💼',
              email: user.email || '',
              uid: user.uid,
              points: data.points ?? 200,
              reportsCount: data.reportsCount ?? 0,
              checkins: data.checkins || [],
              photoURL: user.photoURL || ''
            };
            setProfile(loadedProfile);
            setUserPoints(loadedProfile.points || 200);
            setUserReportsCount(loadedProfile.reportsCount || 0);
            setSelectedState(loadedProfile.state);
            setSelectedCityName(loadedProfile.city);
            localStorage.setItem('cleanair_india_profile', JSON.stringify(loadedProfile));

            if (data.notificationsEnabled !== undefined) {
              setNotificationsEnabled(data.notificationsEnabled);
              localStorage.setItem('cleanair_notifications', String(data.notificationsEnabled));
            }
            if (data.soundEnabled !== undefined) {
              setSoundEnabled(data.soundEnabled);
              localStorage.setItem('cleanair_sound', String(data.soundEnabled));
            }
            if (data.autoRefreshEnabled !== undefined) {
              setAutoRefreshEnabled(data.autoRefreshEnabled);
              localStorage.setItem('cleanair_refresh', String(data.autoRefreshEnabled));
            }

            // Verify if daily attendance checkin occurred today
            const todayStr = new Date().toISOString().split('T')[0];
            if (loadedProfile.checkins?.includes(todayStr)) {
              setHasCheckedInToday(true);
            } else {
              setHasCheckedInToday(false);
            }
          } else {
            // New User profile - auto register immediately so they don't have to fill anything!
            const newProfile: UserProfile = {
              name: user.displayName || 'Google Citizen',
              state: 'Delhi NCR',
              city: 'New Delhi',
              userId: '',
              registered: true,
              avatar: '🧑🏽‍💼',
              email: user.email || '',
              uid: user.uid,
              points: 200,
              reportsCount: 0,
              checkins: [],
              photoURL: user.photoURL || ''
            };
            setProfile(newProfile);
            setUserPoints(200);
            setUserReportsCount(0);
            setSelectedState('Delhi NCR');
            setSelectedCityName('New Delhi');
            setHasCheckedInToday(false);

            try {
              await setDoc(userDocRef, {
                name: newProfile.name,
                state: newProfile.state,
                city: newProfile.city,
                registered: true,
                points: 200,
                reportsCount: 0,
                checkins: [],
                avatar: newProfile.avatar,
                email: newProfile.email,
                photoURL: newProfile.photoURL
              });
              localStorage.setItem('cleanair_india_profile', JSON.stringify(newProfile));
              onShowToast("🎉 Google Identity Verified & Registered!");
            } catch (err) {
              console.error("Auto-registration Firestore write failed:", err);
              localStorage.setItem('cleanair_india_profile', JSON.stringify(newProfile));
            }
          }
        } catch (err) {
          console.error("Error reading Firestore user details:", err);
        }
      } else {
        // Logged out / Guest flow fallback
        setProfile({
          name: '',
          state: 'Delhi NCR',
          city: 'New Delhi',
          userId: '',
          registered: false,
          avatar: '🧑🏽‍💼'
        });
        setUserPoints(180);
        setUserReportsCount(2);
        setHasCheckedInToday(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Google OAuth Activation
  const handleGoogleSignIn = async () => {
    try {
      playAudioFeedback(523, 0.08, 'sine');
      const result = await signInWithPopup(auth, googleProvider);
      onShowToast(`👋 Verified Google identity for: ${result.user.displayName || 'User'}`);
    } catch (err: any) {
      console.error("Google Authentication failed", err);
      onShowToast(`❌ Google Sign-In error: ${err.message || err}`);
    }
  };

  // Google-linked registration save
  const handleRegister = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!profile.name.trim()) {
      onShowToast("⚠️ Please enter your full name.");
      return;
    }

    if (!auth.currentUser) {
      onShowToast("⚠️ Authenticate with your Google account first to register.");
      return;
    }

    const citizenHandle = `@${profile.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_citizen`;
    const updatedProfile: UserProfile = {
      ...profile,
      userId: citizenHandle,
      registered: true,
      points: 200,
      reportsCount: 0,
      checkins: []
    };

    setProfile(updatedProfile);
    setUserPoints(200);
    setUserReportsCount(0);

    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        name: updatedProfile.name,
        state: selectedState,
        city: selectedCityName,
        userId: updatedProfile.userId,
        registered: true,
        points: 200,
        reportsCount: 0,
        checkins: [],
        avatar: updatedProfile.avatar || '🧑🏽‍💼',
        email: auth.currentUser.email || '',
        photoURL: auth.currentUser.photoURL || ''
      });
      onShowToast("🎉 Google Identity Registered successfully in CleanAir Nexus!");
      playAudioFeedback(523.25, 0.15, 'sine');
    } catch (err) {
      console.error("Firestore registration write failed:", err);
      localStorage.setItem('cleanair_india_profile', JSON.stringify(updatedProfile));
      onShowToast("⚠️ Saved profile details locally (Cloud offline).");
    }
  };

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const stateObj = INDIAN_STATES_CITIES.find((s) => s.stateName === stateName);
    if (stateObj && stateObj.cities.length > 0) {
      setSelectedCityName(stateObj.cities[0].name);
      setProfile((prev) => ({
        ...prev,
        state: stateName,
        city: stateObj.cities[0].name
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        state: stateName
      }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('cleanair_india_profile');
      setProfile({
        name: '',
        state: 'Delhi NCR',
        city: 'New Delhi',
        userId: '',
        registered: false,
        avatar: '🧑🏽‍💼'
      });
      setSelectedState('Delhi NCR');
      setSelectedCityName('New Delhi');
      onShowToast("🔓 Logged out from Google node successfully.");
      playAudioFeedback(220, 0.2, 'sine');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // SOMA Shield: Advanced Local Computer-Vision Image Quality and Uniformity Validator
  const verifyImageQuality = (base64Str: string): Promise<{ isOk: boolean; reason?: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 50;
          canvas.height = 50;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ isOk: true });
            return;
          }
          ctx.drawImage(img, 0, 0, 50, 50);
          const imgData = ctx.getImageData(0, 0, 50, 50).data;
          
          let totalR = 0, totalG = 0, totalB = 0;
          const pixelsCount = imgData.length / 4;
          const brightnessValues: number[] = [];
          
          for (let i = 0; i < imgData.length; i += 4) {
            const r = imgData[i];
            const g = imgData[i + 1];
            const b = imgData[i + 2];
            totalR += r;
            totalG += g;
            totalB += b;
            const br = 0.299 * r + 0.587 * g + 0.114 * b;
            brightnessValues.push(br);
          }
          
          const avgBr = brightnessValues.reduce((a, b) => a + b, 0) / pixelsCount;
          let variance = 0;
          for (const val of brightnessValues) {
            variance += Math.pow(val - avgBr, 2);
          }
          const stdDev = Math.sqrt(variance / pixelsCount);
          
          // Solid background checker (lens blockage, plain grey/white/black spam uploads)
          if (stdDev < 8) {
            resolve({
              isOk: false,
              reason: "Obstructed lens, uniform texture, or solid color detected. Capture a clear environment photo."
            });
            return;
          }
          
          // Dark underexposure checker
          if (avgBr < 10) {
            resolve({
              isOk: false,
              reason: "Photo is pitch black. Provide adequate illumination of the local smoke/dust hazard."
            });
            return;
          }

          // Light overexposure checker
          if (avgBr > 245) {
            resolve({
              isOk: false,
              reason: "Photo is washed out or completely white. Provide a legible landscape shot."
            });
            return;
          }
          
          resolve({ isOk: true });
        } catch (e) {
          resolve({ isOk: true });
        }
      };
      img.onerror = () => {
        resolve({ isOk: true });
      };
    });
  };

  // SOMA Shield: Description Syntax Integrity Validator
  const validateReportPhotoAndText = (text: string): { isValid: boolean; reason?: string } => {
    if (text.trim().length < 15) {
      return { isValid: false, reason: "Description must be at least 15 characters to avoid blank spam." };
    }

    // Repetitive keys (e.g. asdfasdf, aaaaaaa)
    const repeats = /(.)\1{4,}/;
    if (repeats.test(text.replace(/\s/g, ''))) {
      return { isValid: false, reason: "Repetitive character pattern caught by spam filters." };
    }

    // Standard dummy blockwords
    const blocklist = ["asdf", "qwerty", "lorem", "ipsum", "mock", "dummy", "test report", "testing"];
    const lowercaseText = text.toLowerCase();
    for (const phrase of blocklist) {
      if (lowercaseText.includes(phrase)) {
        return { isValid: false, reason: `Invalid dummy test keywords found: "${phrase}".` };
      }
    }

    return { isValid: true };
  };

  // Google-linked Check-In Attendance Tracker
  const handleClaimCheckIn = async () => {
    if (!auth.currentUser) {
      onShowToast("⚠️ Sign in with Google to claim daily Check-In points.");
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newPoints = userPoints + 20;

    setUserPoints(newPoints);
    setHasCheckedInToday(true);
    playAudioFeedback(659.25, 0.15, 'sine');

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        points: newPoints,
        checkins: arrayUnion(todayStr)
      });
      onShowToast("📅 Cloud Synced: Daily Attendance logged! +20 Impact Points!");
    } catch (err) {
      console.error("Firestore check-in write failed:", err);
      onShowToast("📅 Daily check-in logged locally.");
    }
  };

  // Decentralized P2P SOMA Audit: Peer verification
  const handleVerifyReport = async (reportId: string, submitterId?: string) => {
    if (!auth.currentUser) {
      onShowToast("⚠️ Please sign in with Google to cast verification audits.");
      return;
    }

    // Award +30 points to current user
    const reviewerNewPoints = userPoints + 30;
    setUserPoints(reviewerNewPoints);
    playAudioFeedback(783.99, 0.12, 'triangle');

    // If it's a mock report, just handle it locally
    if (reportId.startsWith('rep-peer-')) {
      setPeerReportsToVerify((prev) => 
        prev.map((r) => r.id === reportId ? { ...r, verified: true } : r)
      );
      onShowToast(`📡 Mock report verified! +30 points awarded!`);
      return;
    }

    try {
      // 1. Update the report in Firestore
      const reportDocRef = doc(db, 'reports', reportId);
      const reportSnap = await getDoc(reportDocRef);
      if (reportSnap.exists()) {
        const reportData = reportSnap.data();
        const votesCount = (reportData.votesCount || 0) + 1;
        const votesUsers = [...(reportData.votesUsers || []), auth.currentUser.uid];
        const isVerified = votesCount >= 2;

        await updateDoc(reportDocRef, {
          votesCount,
          votesUsers,
          verified: isVerified
        });

        // 2. If it becomes verified, reward the submitter +50 points
        if (isVerified && submitterId) {
          const submitterDocRef = doc(db, 'users', submitterId);
          const submitterSnap = await getDoc(submitterDocRef);
          if (submitterSnap.exists()) {
            await updateDoc(submitterDocRef, {
              points: increment(50)
            });
          }
        }
      }

      // 3. Update reviewer points on Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        points: reviewerNewPoints
      });

      onShowToast(`📡 Report verified! +30 Peer Audit Points synced to Cloud.`);
    } catch (err) {
      console.error("Failed to verify report in Firestore:", err);
      onShowToast("📡 Verification recorded locally.");
    }
  };

  // Decentralized P2P SOMA Audit: Spam flagging and reputation penalty
  const handleFlagReportAsSpam = async (reportId: string, submitterId?: string) => {
    if (!auth.currentUser) {
      onShowToast("⚠️ Please sign in with Google to flag malicious reports.");
      return;
    }

    playAudioFeedback(293.66, 0.2, 'sawtooth');

    // If it's a mock report, just handle it locally
    if (reportId.startsWith('rep-peer-')) {
      setPeerReportsToVerify((prev) => 
        prev.filter((r) => r.id !== reportId)
      );
      onShowToast(`🚨 Mock report flagged and removed.`);
      return;
    }

    try {
      const reportDocRef = doc(db, 'reports', reportId);
      const reportSnap = await getDoc(reportDocRef);
      if (reportSnap.exists()) {
        const reportData = reportSnap.data();
        const spamCount = (reportData.spamCount || 0) + 1;
        const spamUsers = [...(reportData.spamUsers || []), auth.currentUser.uid];
        
        // If 2 users flag it as spam, we update status and penalize submitter -150 points
        if (spamCount >= 2) {
          await updateDoc(reportDocRef, {
            spamCount,
            spamUsers,
            verified: false,
            spam: true
          });
          
          if (submitterId) {
            const submitterDocRef = doc(db, 'users', submitterId);
            const submitterSnap = await getDoc(submitterDocRef);
            if (submitterSnap.exists()) {
              const currentPoints = submitterSnap.data().points || 0;
              const penalizedPoints = Math.max(0, currentPoints - 150);
              await updateDoc(submitterDocRef, {
                points: penalizedPoints
              });
            }
          }
          onShowToast(`🚨 Spam Shield Triggered! Report flagged as spam on node. Submitter penalized by -150 PTS.`);
        } else {
          await updateDoc(reportDocRef, {
            spamCount,
            spamUsers
          });
          onShowToast(`🚨 Report flagged as fake. Current flags: ${spamCount}/2.`);
        }
      }
    } catch (err) {
      console.error("Spam flag operation failed:", err);
      onShowToast("🚨 Flag recorded locally.");
    }
  };

  const [loadingAqi, setLoadingAqi] = useState<boolean>(false);

  // Live state-wide comparison data
  const [stateCitiesData, setStateCitiesData] = useState<Array<{
    name: string;
    lat: number;
    lon: number;
    aqi: number | null;
    pm25: number | null;
    pm10: number | null;
    loading: boolean;
  }>>([]);

  // Find coordinates of currently selected city
  const selectedCityCoords = currentCities.find((c) => c.name === selectedCityName) || {
    lat: 28.6139,
    lon: 77.2090
  };

  // Fetch from free Open-Meteo Air Quality API
  const fetchCityAirQuality = async (lat: number, lon: number, cityName: string) => {
    setLoadingAqi(true);
    try {
      const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API server down');
      const data = await res.json();
      
      if (data && data.current) {
        const uaqi = Math.round(data.current.us_aqi || 110);
        const p25 = Math.round(data.current.pm2_5 || 45);
        const p10 = Math.round(data.current.pm10 || 75);
        
        setLiveAqi(uaqi);
        setPm25(p25);
        setPm10(p10);
        setApiSource('api');
      } else {
        throw new Error('Invalid schema');
      }
    } catch (err) {
      // Offline fallback - realistic AQI calculated based on typical Indian urban baselines
      let baseAqi = 145; // default moderate-poor
      if (selectedState === 'Delhi NCR' || selectedState === 'Uttar Pradesh' || selectedState === 'Bihar' || selectedState === 'Punjab' || selectedState === 'Haryana') {
        baseAqi = Math.floor(190 + Math.random() * 95); // High winter/seasonal smog
      } else if (selectedState === 'Maharashtra' || selectedState === 'Karnataka' || selectedState === 'Tamil Nadu' || selectedState === 'Kerala') {
        baseAqi = Math.floor(45 + Math.random() * 50); // Coastal/Southern clean air
      } else {
        baseAqi = Math.floor(90 + Math.random() * 60); // Mid states
      }
      setLiveAqi(baseAqi);
      setPm25(Math.round(baseAqi * 0.45));
      setPm10(Math.round(baseAqi * 0.85));
      setApiSource('fallback');
    } finally {
      setLoadingAqi(false);
    }
  };

  // Fetch from Open-Meteo for all cities in the active region/state
  const fetchStateCitiesAirQuality = async (stateName: string) => {
    const stateObj = INDIAN_STATES_CITIES.find((s) => s.stateName === stateName);
    if (!stateObj) return;

    // Set initial loading state
    const initialData = stateObj.cities.map((city) => ({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      aqi: null,
      pm25: null,
      pm10: null,
      loading: true
    }));
    setStateCitiesData(initialData);

    try {
      const fetchPromises = stateObj.cities.map(async (city) => {
        try {
          const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&current=us_aqi,pm2_5,pm10`;
          const res = await fetch(url);
          if (!res.ok) throw new Error();
          const data = await res.json();
          if (data && data.current) {
            return {
              name: city.name,
              lat: city.lat,
              lon: city.lon,
              aqi: Math.round(data.current.us_aqi || 100),
              pm25: Math.round(data.current.pm2_5 || 40),
              pm10: Math.round(data.current.pm10 || 70),
              loading: false
            };
          }
          throw new Error();
        } catch (err) {
          // Realistic fallback calculation if API call fails
          let baseAqi = 145;
          if (stateName === 'Delhi NCR' || stateName === 'Uttar Pradesh' || stateName === 'Bihar' || stateName === 'Punjab' || stateName === 'Haryana') {
            baseAqi = Math.floor(190 + Math.random() * 80);
          } else if (stateName === 'Maharashtra' || stateName === 'Karnataka' || stateName === 'Tamil Nadu' || stateName === 'Kerala') {
            baseAqi = Math.floor(45 + Math.random() * 45);
          } else {
            baseAqi = Math.floor(90 + Math.random() * 50);
          }
          return {
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            aqi: baseAqi,
            pm25: Math.round(baseAqi * 0.45),
            pm10: Math.round(baseAqi * 0.85),
            loading: false
          };
        }
      });

      const results = await Promise.all(fetchPromises);
      setStateCitiesData(results);
    } catch (e) {
      console.error(e);
    }
  };

  // Automatically trigger fetch when selected city or profile city changes
  useEffect(() => {
    if (profile.registered) {
      fetchCityAirQuality(selectedCityCoords.lat, selectedCityCoords.lon, selectedCityName);
      fetchStateCitiesAirQuality(selectedState);
    }
  }, [selectedCityName, selectedState, profile.registered]);

  // Audio synthesizer for notifications/chimes
  const playAudioFeedback = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Silently catch autoplay browser limitations
    }
  };

  // Periodic auto-refresh effect
  useEffect(() => {
    if (!autoRefreshEnabled || !profile.registered) return;
    const interval = setInterval(() => {
      fetchCityAirQuality(selectedCityCoords.lat, selectedCityCoords.lon, selectedCityName);
      fetchStateCitiesAirQuality(selectedState);
      if (notificationsEnabled) {
        onShowToast(lang === 'en' ? 'Synced latest real-time AQI station telemetry.' : 'नवीनतम वास्तविक समय AQI स्टेशन टेलीमेट्री सिंक की गई।');
      }
    }, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, notificationsEnabled, selectedCityCoords, selectedCityName, selectedState, profile.registered, lang]);

  const getFaqs = () => {
    switch(lang) {
      case 'hi':
        return [
          { q: "AQI क्या है?", a: "AQI या वायु गुणवत्ता सूचकांक हवा की गुणवत्ता का एक पैमाना है। यह 0 से 500 तक होता है, जहां उच्च मूल्य अधिक वायु प्रदूषण और गंभीर स्वास्थ्य जोखिमों को दर्शाता है।" },
          { q: "PM2.5 और PM10 क्या हैं?", a: "PM2.5 और PM10 हवा में मौजूद सूक्ष्म कण हैं। PM2.5 फेफड़ों में गहराई तक जा सकता है, जिससे गंभीर स्वास्थ्य समस्याएं हो सकती हैं।" },
          { q: "क्या यह ऐप सरकारी डेटा का उपयोग करता है?", a: "यह ऐप लाइव और सटीक स्थानीय रीडिंग प्रदान करने के लिए सीपीसीबी (CPCB), सैटेलाइट डेटा और नागरिक-संचालित स्थानीय फीडबैक के मिश्रण का उपयोग करता है।" },
          { q: "मैं इम्पैक्ट पॉइंट कैसे कमाऊं?", a: "आप स्थानीय प्रदूषण स्रोतों (जैसे कचरा जलाना, धूल आदि) की रिपोर्ट करके और दूसरों की रिपोर्टों को सत्यापित करके पॉइंट कमा सकते हैं।" }
        ];
      case 'mr':
        return [
          { q: "AQI म्हणजे काय?", a: "AQI किंवा वायू गुणवत्ता निर्देशांक हवेच्या गुणवत्तेचे मोजमाप आहे. हे 0 ते 500 पर्यंत असते, जिथे उच्च मूल्य अधिक वायू प्रदूषण आणि गंभीर आरोग्य जोखीम दर्शवते." },
          { q: "PM2.5 आणि PM10 काय आहेत?", a: "PM2.5 आणि PM10 हवेतील सूक्ष्म कण आहेत. PM2.5 फुफ्फुसात खोलवर जाऊ शकतात, ज्यामुळे आरोग्याच्या गंभीर समस्या उद्भवू शकतात." },
          { q: "हे अ‍ॅप सरकारी डेटा वापरते का?", a: "हे अ‍ॅप लाइव्ह स्थानिक रीडिंग प्रदान करण्यासाठी सीपीसीबी (CPCB), उपग्रह डेटा आणि नागरिक-चालित स्थानिक फीडबॅकचा वापर करते." },
          { q: "मी इम्पॅक्ट पॉईंट्स कसे मिळवू?", a: "तुम्ही स्थानिक प्रदूषण स्त्रोतांची नोंद करून आणि इतरांच्या अहवालांची पडताळणी करून पॉईंट्स मिळवू शकता." }
        ];
      case 'bn':
        return [
          { q: "AQI কী?", a: "AQI বা বায়ু গুণমান সূচক হলো বাতাসের গুণমানের একটি পরিমাপ। এটি ০ থেকে ৫০০ পর্যন্ত হয়, যেখানে উচ্চ মান বেশি বায়ু দূষণ এবং গুরুতর স্বাস্থ্য ঝুঁকি নির্দেশ করে।" },
          { q: "PM2.5 এবং PM10 কী?", a: "PM2.5 এবং PM10 বাতাসে ভাসমান ক্ষুদ্র কণা। PM2.5 ফুসফুসের গভীরে প্রবেশ করতে পারে, যা গুরুতর স্বাস্থ্য সমস্যা তৈরি করতে পারে।" },
          { q: "এই অ্যাপটি কি সরকারি তথ্য ব্যবহার করে?", a: "এই অ্যাপটি লাইভ স্থানীয় রিডিং প্রদানের জন্য সিপিসিবির (CPCB), স্যাটেলাইট ডেটা এবং নাগরিক-চালিত ফিডব্যাকের সংমিশ্রণ ব্যবহার করে।" },
          { q: "আমি কীভাবে ইমপ্যাক্ট পয়েন্ট অর্জন করব?", a: "আপনি স্থানীয় দূষণের ঘটনার রিপোর্ট করে এবং অন্যদের রিপোর্ট যাচাই করে পয়েন্ট অর্জন করতে পারেন।" }
        ];
      case 'te':
        return [
          { q: "AQI అంటే ఏమిటి?", a: "AQI లేదా వాయు నాణ్యత సూచిక అనేది గాలి నాణ్యతను కొలిచే ప్రమాణం. ఇది 0 నుండి 500 వరకు ఉంటుంది, ఇక్కడ ఎక్కువ విలువ ఉంటే ఎక్కువ కాలుష్యం మరియు ఆరోగ్య ప్రమాదం ఉంటుంది." },
          { q: "PM2.5 మరియు PM10 అంటే ఏమిటి?", a: "PM2.5 మరియు PM10 అనేవి గాలిలోని సూక్ష్మ ధూళి కణాలు. PM2.5 ఊపిరితిత్తులలోకి లోతుగా వెళ్లి తీవ్రమైన ఆరోగ్య సమస్యలను కలిగిస్తుంది." },
          { q: "ఈ యాప్ ప్రభుత్వ డేటాను ఉపയോగిస్తుందా?", a: "ఈ యాప్ ప్రత్యక్ష రీడింగ్‌లను అందించడానికి CPCB, శాటిలైట్ డేటా మరియు పౌరుల నివేదికల కలయికను ఉపയോగిస్తుంది." },
          { q: "నేను ఇంపాక్ట్ పాయింట్లు ఎలా సంపాదించాలి?", a: "మీరు స్థానిక కాలుష్య నివేదికలను పంపడం మరియు ఇతరుల నివేదికలను ధృవీకరించడం ద్వారా పాయింట్లను సంపాదించవచ్చు." }
        ];
      case 'ta':
        return [
          { q: "AQI என்றால் என்ன?", a: "AQI அல்லது காற்று தர குறியீடு என்பது காற்றின் தரத்தை அளவிடும் ஒரு குறியீடாகும். இது 0 முதல் 500 வரை இருக்கும், அதிக மதிப்பு அதிக காற்று மாசுபாட்டைக் குறிக்கிறது." },
          { q: "PM2.5 மற்றும் PM10 என்றால் என்ன?", a: "PM2.5 மற்றும் PM10 என்பவை காற்றில் உள்ள நுண் துகள்கள் ஆகும். PM2.5 நுரையீரலில் ஆழமாகச் சென்று கடுமையான சுகாதாரப் பிரச்சினைகளை ஏற்படுத்தும்." },
          { q: "இந்த ஆப் அரசு தரவைப் பயன்படுத்துகிறதா?", a: "இந்த ஆப் CPCB, செயற்கைக்கோள் தரவு மற்றும் குடிமக்களின் நேரடி அறிக்கைகளின் கலவையைப் பயன்படுத்துகிறது." },
          { q: "நான் எவ்வாறு இம்பாக்ட் புள்ளிகளைப் பெறுவது?", a: "உள்ளூர் மாசு சம்பவங்களைப் புகாரளிப்பதன் மூலமும் மற்றவர்களின் புகார்களை உறுதிப்படுத்துவதன் மூலமும் நீங்கள் புள்ளிகளைப் பெறலாம்." }
        ];
      case 'kn':
        return [
          { q: "AQI ಎಂದರೇನು?", a: "AQI ಅಥವಾ ವಾಯು ಗುಣಮಟ್ಟ ಸೂಚ್ಯಂಕವು ಗಾಳಿಯ ಗುಣಮಟ್ಟವನ್ನು ಅಳೆಯುವ ಮಾಪನವಾಗಿದೆ. ಇದು 0 ರಿಂದ 500 ರವರೆಗೆ ಇರುತ್ತದೆ, ಹೆಚ್ಚಿನ ಮೌಲ್ಯವು ಹೆಚ್ಚಿನ ವಾಯು ಮಾಲಿನ್ಯವನ್ನು ಸೂಚಿಸುತ್ತದೆ." },
          { q: "PM2.5 ಮತ್ತು PM10 ಎಂದರೇನು?", a: "PM2.5 ಮತ್ತು PM10 ಗಾಳಿಯಲ್ಲಿರುವ ಸೂಕ್ಷ್ಮ ಕಣಗಳಾಗಿವೆ. PM2.5 ಶ್ವಾಸಕೋಶದ ಆಳಕ್ಕೆ ಹೋಗಿ ಗಂಭೀರ ಆರೋಗ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ಉಂಟುಮಾಡಬಹುದು." },
          { q: "ಈ ಆಪ್ ಸರ್ಕಾರಿ ಡೇಟಾವನ್ನು ಬಳಸುತ್ತದೆಯೇ?", a: "ಈ ಆಪ್ ಲೈವ್ ರೀಡಿಂಗ್‌ಗಳನ್ನು ನೀಡಲು CPCB, ಸ್ಯಾಟಲೈಟ್ ಡೇಟಾ ಮತ್ತು ನಾಗರಿಕರ ವರದಿಗಳ ಸಂಯೋಜನೆಯನ್ನು ಬಳಸುತ್ತದೆ." },
          { q: "ನಾನು ಇಂಪ್ಯಾಕ್ಟ್ ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಗಳಿಸುವುದು ಹೇಗೆ?", a: "ಸ್ಥಳೀಯ ಮಾಲಿನ್ಯ ಘಟನೆಗಳನ್ನು ವರದಿ ಮಾಡುವ ಮೂಲಕ ಮತ್ತು ಇತರರ ವರದಿಗಳನ್ನು ದೃಢೀಕರಿಸುವ ಮೂಲಕ ನೀವು ಪಾಯಿಂಟ್‌ಗಳನ್ನು ಗಳಿಸಬಹುದು." }
        ];
      case 'gu':
        return [
          { q: "AQI શું છે?", a: "AQI અથવા વાયુ ગુણવત્તા સૂચકાંક એ હવાની ગુણવત્તાનું માપ છે. આ 0 થી 500 ની વચ્ચે હોય છે, જ્યાં ઊંચી કિંમત વધુ પ્રદૂષણ દર્શાવે છે." },
          { q: "PM2.5 અને PM10 શું છે?", a: "PM2.5 અને PM10 હવામાં રહેલા અતિ સૂક્ષ્મ રજકણો છે. PM2.5 ફેફસાંમાં ઊંડે સુધી જઈને ગંભયર રોગોનું કારણ બની શકે છે." },
          { q: "શું આ એપ સરકારી ડેટા વાપરે છે?", a: "આ એપ સચોટ સ્થાનિક રીડિંગ આપવા માટે CPCB, સેટેલાઇટ ડેટા અને નાગરિકોના ફીડબેકનો ઉપયોગ કરે છે." },
          { q: "હું ઇમ્પેક્ટ પોઈન્ટ્સ કેવી રીતે મેળવી શકું?", a: "તમે સ્થાનિક પ્રદૂષણના સ્ત્રોતોની જાણ કરીને અને અન્યોના રિપોર્ટ વેરીફાય કરીને પોઈન્ટ મેળવી શકો છો." }
        ];
      case 'pa':
        return [
          { q: "AQI ਕੀ ਹੈ?", a: "AQI ਜਾਂ ਹਵਾ ਗੁਣਵੱਤਾ ਸੂਚਕਾਂਕ ਹਵਾ ਦੀ ਗੁਣਵੱਤਾ ਦਾ ਇੱਕ ਮਾਪ ਹੈ। ਇਹ 0 ਤੋਂ 500 ਤੱਕ ਹੁੰਦਾ ਹੈ, ਜਿੱਥੇ ਉੱਚ ਮੁੱਲ ਵਧੇਰੇ ਹਵਾ ਪ੍ਰਦੂਸ਼ਣ ਨੂੰ ਦਰਸਾਉਂਦਾ ਹੈ।" },
          { q: "PM2.5 ਅਤੇ PM10 ਕੀ ਹਨ?", a: "PM2.5 ਅਤੇ PM10 ਹਵਾ ਵਿੱਚ ਮੌਜੂਦ ਬਹੁਤ ਬਾਰੀਕ ਕਣ ਹਨ। PM2.5 ਫੇਫੜਿਆਂ ਵਿੱਚ ਡੂੰਘਾਈ ਤੱਕ ਜਾ ਸਕਦਾ ਹੈ, ਜਿਸ ਨਾਲ ਗੰਭਰੇ ਸਿਹਤ ਸਮੱਸਿਆਵਾਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।" },
          { q: "ਕੀ ਇਹ ਐਪ ਸਰਕਾਰੀ ਡੇਟਾ ਦੀ ਵਰਤੋਂ ਕਰਦੀ ਹੈ?", a: "ਇਹ ਐਪ ਲਾਈਵ ਸਥਾਨਕ ਰੀਡਿੰਗ ਪ੍ਰਦਾਨ ਕਰਨ ਲਈ CPCB, ਸੈਟੇਲਾਈਟ ਡੇਟਾ ਅਤੇ ਨਾਗਰਿਕ-ਸੰਚਾਲਿਤ ਫੀਡਬੈਕ ਦੇ ਸੁਮੇਲ ਦੀ ਵਰਤੋਂ ਕਰਦੀ ਹੈ।" },
          { q: "ਮੈਂ ਇਮਪੈਕਟ ਪੁਆਇੰਟ ਕਿਵੇਂ ਕਮਾਵਾਂ?", a: "ਤੁਸੀਂ ਸਥਾਨਕ ਪ੍ਰਦੂਸ਼ਣ ਦੀਆਂ ਘਟਨਾਵਾਂ ਦੀ ਰਿਪੋਰਟ ਕਰਕੇ ਅਤੇ ਦੂਜਿਆਂ ਦੀਆਂ ਰਿਪੋਰਟਾਂ ਦੀ ਪੁਸ਼ਟੀ ਕਰਕੇ ਪੁਆਇੰਟ ਕਮਾ ਸਕਦੇ ਹੋ।" }
        ];
      case 'ml':
        return [
          { q: "എന്താണ് AQI?", a: "AQI അഥവാ എയർ ക്വാളിറ്റി ഇൻഡക്സ് വായുവിന്റെ ഗുണനിലവാരം അളക്കുന്നതിനുള്ള ഒരു മാനദണ്ഡമാണ്. ഇത് 0 മുതൽ 500 വരെയാണ്, ഉയർന്ന മൂല്യം കൂടുതൽ മലിനീകരണത്തെ കാണിക്കുന്നു." },
          { q: "എന്താണ് PM2.5, PM10?", a: "വായുവിലുള്ള അതിസൂക്ഷ്മ ധൂളീപടലങ്ങളാണ് PM2.5, PM10 എന്നിവ. PM2.5 ശ്വാസകോശത്തിലേക്ക് നേരിട്ട് എത്തി ഗുരുതരമായ അസുഖങ്ങൾ ഉണ്ടാക്കുന്നു." },
          { q: "ഈ ആപ്പ് സർക്കാർ ഡാറ്റ ഉപയോഗിക്കുന്നുണ്ടോ?", a: "ഈ ആപ്പ് തത്സമയ പ്രാദേശಿಕ റീഡിംഗുകൾ നൽകാൻ CPCB, ഉപഗ്രഹ ഡാറ്റ, ജനങ്ങളുടെ റിപ്പോർട്ടുകൾ എന്നിവയുടെ സംയോജനം ഉപയോഗിക്കുന്നു." },
          { q: "ഞാൻ എങ്ങനെ ഇംപാക്ട് പോയിന്റുകൾ നേടും?", a: "പ്രാദേശിക മലിനീകരണ സംഭവങ്ങൾ റിപ്പോർട്ട് ചെയ്യുന്നതിലൂടെയും മറ്റുള്ളവരുടെ റിപ്പോർട്ടുകൾ സ്ഥിരീകരിക്കുന്നതിലൂടെയും നിങ്ങൾക്ക് പോയിന്റുകൾ നേടാം." }
        ];
      default:
        return [
          { q: "What is the Air Quality Index (AQI)?", a: "The AQI is a standard tool to communicate the health risks of ambient air quality. It scales from 0 to 500; higher values indicate more severe particulate levels and potential cardiovascular/respiratory discomfort." },
          { q: "What are PM2.5 and PM10 particles?", a: "PM2.5 and PM10 refer to extremely fine particulate matters with diameters less than 2.5 and 10 micrometers, respectively. PM2.5 is particularly dangerous as it bypasses nasal filters and enters deeper lung tissues." },
          { q: "Does CleanAir India use official government data?", a: "Yes. CleanAir Nexus pulls real-time feed from CPCB stations combined with satellite particulate imaging and crowdsourced citizen validation on local SOMA nodes." },
          { q: "How can I earn Citizen Impact Points?", a: "You earn +100 Points for broadcasting an active local hazard with camera evidence, +30 Points for peer-reviewing adjacent reports, and +20 Points for daily check-ins." }
        ];
    }
  };

  // Helper function to map Indian AQI standards to colored categories and descriptors
  const getIndianAqiDetails = (aqi: number) => {
    if (aqi <= 50) {
      return { 
        label: getString('Good', lang), 
        desc: getString('Minimal impact. Satisfactory air.', lang), 
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200', 
        circleColor: '#10b981', 
        hiLabel: getString('Good', lang) 
      };
    }
    if (aqi <= 100) {
      return { 
        label: getString('Satisfactory', lang), 
        desc: getString('Minor breathing discomfort to sensitive people.', lang), 
        color: 'text-green-600 bg-green-50 border-green-200', 
        circleColor: '#84cc16', 
        hiLabel: getString('Satisfactory', lang) 
      };
    }
    if (aqi <= 200) {
      return { 
        label: getString('Moderate', lang), 
        desc: getString('Breathing discomfort to children and elderly.', lang), 
        color: 'text-amber-600 bg-amber-50 border-amber-200', 
        circleColor: '#f59e0b', 
        hiLabel: getString('Moderate', lang) 
      };
    }
    if (aqi <= 300) {
      return { 
        label: getString('Poor', lang), 
        desc: getString('Breathing discomfort to most people on prolonged exposure.', lang), 
        color: 'text-orange-600 bg-orange-50 border-orange-200', 
        circleColor: '#f97316', 
        hiLabel: getString('Poor', lang) 
      };
    }
    if (aqi <= 400) {
      return { 
        label: getString('Very Poor', lang), 
        desc: getString('Respiratory illness on prolonged exposure.', lang), 
        color: 'text-rose-600 bg-rose-50 border-rose-200', 
        circleColor: '#ef4444', 
        hiLabel: getString('Very Poor', lang) 
      };
    }
    return { 
      label: getString('Severe', lang), 
      desc: getString('Affects healthy people and seriously impacts those with existing diseases.', lang), 
      color: 'text-red-700 bg-red-50 border-red-200', 
      circleColor: '#991b1b', 
      hiLabel: getString('Severe', lang) 
    };
  };

  const [viewMode, setViewMode] = useState<'city' | 'state'>('city');

  // Calculate state-wide average AQI and particulate levels
  const stateValidCities = stateCitiesData.filter(c => c.aqi !== null);
  const stateAverageAqi = stateValidCities.length > 0 
    ? Math.round(stateValidCities.reduce((acc, c) => acc + (c.aqi || 0), 0) / stateValidCities.length)
    : 145;
  const stateAveragePm25 = stateValidCities.length > 0 
    ? Math.round(stateValidCities.reduce((acc, c) => acc + (c.pm25 || 0), 0) / stateValidCities.length)
    : 55;
  const stateAveragePm10 = stateValidCities.length > 0 
    ? Math.round(stateValidCities.reduce((acc, c) => acc + (c.pm10 || 0), 0) / stateValidCities.length)
    : 95;

  // Computed values for current display based on viewMode (City vs State average)
  const displayAqi = viewMode === 'city' ? liveAqi : stateAverageAqi;
  const displayPm25 = viewMode === 'city' ? pm25 : stateAveragePm25;
  const displayPm10 = viewMode === 'city' ? pm10 : stateAveragePm10;

  const aqiInfo = getIndianAqiDetails(displayAqi || 100);

  // --------------------------------------------------------
  // 4. Report Hazard State & Handlers
  // --------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<IndianCategoryType>('Trash');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [aqiMod, setAqiMod] = useState<number>(95);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  
  // Custom camera simulation presets to make reporting hyper-realistic
  const CAMERA_PRESETS = {
    Trash: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80', // Smoldering garbage
    Leaf: 'https://images.unsplash.com/photo-1508524227366-47d34ffb97cd?auto=format&fit=crop&w=400&q=80',  // Leaf burning / winter fog
    Factory: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80', // Chimney smoke
    Smoke: 'https://images.unsplash.com/photo-1521499613702-041a87957d19?auto=format&fit=crop&w=400&q=80', // City smog
    Dust: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=400&q=80',  // Construction site dust
    Vehicular: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&q=80' // Exhaust smoke from vehicle
  };

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    confidence: number;
    description: string;
    suggestedAqiMod: number;
    severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  } | null>(null);

  // Gemini AI Vision Analysis Simulation
  useEffect(() => {
    if (selectedImage) {
      setIsAiAnalyzing(true);
      setAiAnalysisResult(null);

      const timer = setTimeout(() => {
        setIsAiAnalyzing(false);
        
        let confidence = 87 + Math.floor(Math.random() * 12);
        let description = "";
        let suggestedAqiMod = 35;
        let severity: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Moderate';

        switch (selectedCategory) {
          case 'Trash':
            description = "AI detected open garbage burning. Visible plastic/rubber combustion products emitting toxic gases.";
            suggestedAqiMod = 45;
            severity = 'High';
            break;
          case 'Leaf':
            description = "Leaf and organic biomass combustion detected. Moderate smoke density and carbon particulates.";
            suggestedAqiMod = 25;
            severity = 'Moderate';
            break;
          case 'Factory':
            description = "Industrial smoke stack emission. Plume signature shows high opacity and sulfur/ash content.";
            suggestedAqiMod = 80;
            severity = 'Severe';
            break;
          case 'Smoke':
            description = "Tandoor or street-side cook smoke. Localized biomass combustion with standard dispersion.";
            suggestedAqiMod = 15;
            severity = 'Low';
            break;
          case 'Dust':
            description = "Fugitive construction dust suspension. Heavy PM10 load from excavation/demolition site.";
            suggestedAqiMod = 35;
            severity = 'Moderate';
            break;
          case 'Vehicular':
            description = "Vehicular exhaust smoke plume. High diesel combustion signature detected from commercial transport.";
            suggestedAqiMod = 30;
            severity = 'High';
            break;
        }

        setAiAnalysisResult({
          confidence,
          description,
          suggestedAqiMod,
          severity
        });
        
        // Auto-fill values
        setAqiMod(suggestedAqiMod);
        setReportDescription(prev => prev.trim() ? prev : `[AI SOMA Alert: ${severity} Severity] ${description}`);
      }, 1200);

      return () => clearTimeout(timer);
    } else {
      setAiAnalysisResult(null);
      setIsAiAnalyzing(false);
    }
  }, [selectedImage, selectedCategory]);

  // Camera & Geolocation API States
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isCameraSimulated, setIsCameraSimulated] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraLoading, setCameraLoading] = useState<boolean>(false);
  const [geolocationCoords, setGeolocationCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [usingRealGps, setUsingRealGps] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto stop camera if user switches tabs, or start camera if entering report tab without photo
  useEffect(() => {
    if (activeTab !== 'report') {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setIsCameraActive(false);
    } else {
      if (!selectedImage && !isCameraActive && !cameraLoading) {
        startCamera();
      }
    }
  }, [activeTab, selectedImage]);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    setCameraLoading(true);
    setIsCameraSimulated(false);
    try {
      // Fetch user's real GPS coordinates concurrently
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocationCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setUsingRealGps(true);
          onShowToast("🎯 GPS location synchronized successfully!");
        },
        (error) => {
          // Fallback to currently selected city coordinates
          setGeolocationCoords({
            lat: selectedCityCoords.lat,
            lon: selectedCityCoords.lon
          });
          setUsingRealGps(false);
          console.warn("Geolocation fallback to city defaults active", error);
        },
        { enableHighAccuracy: true, timeout: 4000 }
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back-facing camera if on phone
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      setCameraStream(stream);
      setIsCameraActive(true);
      
      // Delay slightly to ensure video element is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err: any) {
      console.warn("Real camera access failed, falling back to simulated SOMA viewport.", err);
      // Automatically fallback to simulated camera mode
      setIsCameraSimulated(true);
      setIsCameraActive(true);
      onShowToast("📡 Camera hardware not detected. Activating SOMA simulated viewfinder.");
    } finally {
      setCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setIsCameraSimulated(false);
  };

  const captureSimulatedPhoto = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Avoid tainted canvas issues
    img.src = CAMERA_PRESETS[selectedCategory];
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = 640;
      const height = 480;
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Draw background simulated image preset
      ctx.drawImage(img, 0, 0, width, height);
      
      // Choose coordinates (real GPS or selected city center)
      const coords = geolocationCoords || {
        lat: selectedCityCoords.lat,
        lon: selectedCityCoords.lon
      };
      
      // Bottom overlay banner
      const bannerHeight = 75;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // Slate 900 translucent
      ctx.fillRect(0, height - bannerHeight, width, bannerHeight);
      
      // Neon accent top border
      ctx.fillStyle = '#0ea5e9'; // Sky 500
      ctx.fillRect(0, height - bannerHeight, width, 4);
      
      // Draw location label
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const locationLabel = `${selectedCityName}, ${selectedState}, IN`;
      ctx.fillText(locationLabel, 20, height - (bannerHeight * 0.65));
      
      // Timestamp
      ctx.fillStyle = '#94a3b8'; // Slate 400
      ctx.font = '11px Courier, monospace';
      const timestamp = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      ctx.fillText(timestamp, 20, height - (bannerHeight * 0.3));
      
      // Lat / Lon
      ctx.fillStyle = '#fbbf24'; // Amber 400
      ctx.font = 'bold 12px Courier, monospace';
      ctx.textAlign = 'right';
      const latText = `LAT: ${coords.lat.toFixed(6)}° N (SIM)`;
      const lonText = `LON: ${coords.lon.toFixed(6)}° E (SIM)`;
      ctx.fillText(latText, width - 20, height - (bannerHeight * 0.65));
      ctx.fillText(lonText, width - 20, height - (bannerHeight * 0.3));
      
      // Verified Badge overlay on top-left
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      const badgeWidth = 180;
      const badgeHeight = 28;
      ctx.fillRect(15, 15, badgeWidth, badgeHeight);
      
      // Active Indicator Circle
      ctx.fillStyle = '#fbbf24'; // Amber representing simulated mode
      ctx.beginPath();
      ctx.arc(28, 15 + (badgeHeight / 2), 4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px -apple-system, sans-serif';
      ctx.fillText("SIMULATED SOMA NODE", 40, 15 + (badgeHeight / 2));
      
      try {
        const snappedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setSelectedImage(snappedDataUrl);
        setIsCustomPhoto(true);
        playAudioFeedback(1000, 0.08, 'sine');
        onShowToast("📸 Captured high-precision simulated hazard photo with SOMA overlay!");
        stopCamera();
      } catch (e) {
        console.error("Failed to generate data URL", e);
        // Fallback to direct preset image URL if canvas was tainted
        setSelectedImage(CAMERA_PRESETS[selectedCategory]);
        setIsCustomPhoto(true);
        onShowToast("📸 Simulated hazard snapshot activated!");
        stopCamera();
      }
    };

    img.onerror = () => {
      // Fallback if image failed to load
      setSelectedImage(CAMERA_PRESETS[selectedCategory]);
      setIsCustomPhoto(true);
      onShowToast("📸 Simulated hazard snapshot activated!");
      stopCamera();
    };
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    
    const canvas = document.createElement('canvas');
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw raw video frame
    ctx.drawImage(video, 0, 0, width, height);
    
    // Choose coordinates (real GPS or selected city center)
    const coords = geolocationCoords || {
      lat: selectedCityCoords.lat,
      lon: selectedCityCoords.lon
    };
    
    // Bottom overlay banner
    const bannerHeight = Math.max(70, Math.round(height * 0.16));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // Slate 900 translucent
    ctx.fillRect(0, height - bannerHeight, width, bannerHeight);
    
    // Neon accent top border
    ctx.fillStyle = '#0ea5e9'; // Sky 500
    ctx.fillRect(0, height - bannerHeight, width, Math.max(3, Math.round(height * 0.006)));
    
    // Draw location label
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    const mainFontSize = Math.max(14, Math.round(height * 0.038));
    ctx.font = `bold ${mainFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    const locationLabel = `${selectedCityName}, ${selectedState}, IN`;
    ctx.fillText(locationLabel, 20, height - (bannerHeight * 0.65));
    
    // Timestamp
    ctx.fillStyle = '#94a3b8'; // Slate 400
    const subFontSize = Math.max(10, Math.round(height * 0.026));
    ctx.font = `${subFontSize}px Courier, monospace`;
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    ctx.fillText(timestamp, 20, height - (bannerHeight * 0.3));
    
    // Lat / Lon
    ctx.fillStyle = '#fbbf24'; // Amber 400
    ctx.font = `bold ${subFontSize + 1}px Courier, monospace`;
    ctx.textAlign = 'right';
    const latText = `LAT: ${coords.lat.toFixed(6)}° N`;
    const lonText = `LON: ${coords.lon.toFixed(6)}° E`;
    ctx.fillText(latText, width - 20, height - (bannerHeight * 0.65));
    ctx.fillText(lonText, width - 20, height - (bannerHeight * 0.3));
    
    // Verified Badge overlay on top-left
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    const badgeWidth = Math.max(160, width * 0.35);
    const badgeHeight = Math.max(26, height * 0.06);
    ctx.fillRect(15, 15, badgeWidth, badgeHeight);
    
    // Active Indicator Circle
    ctx.fillStyle = '#10b981'; // Emerald 500
    ctx.beginPath();
    ctx.arc(28, 15 + (badgeHeight / 2), Math.max(4, badgeHeight * 0.15), 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.max(9, badgeHeight * 0.4)}px -apple-system, sans-serif`;
    ctx.fillText("CITIZEN SOMA NODE", 40, 15 + (badgeHeight / 2));
    
    const snappedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelectedImage(snappedDataUrl);
    setIsCustomPhoto(true);
    
    playAudioFeedback(1000, 0.08, 'sine');
    onShowToast("📸 Citizen Hazard Photo captured with GPS coordinates overlay!");
    stopCamera();
  };

  // Auto-fill coordinates & modifier when changing categories
  const handleCategoryChange = (cat: IndianCategoryType) => {
    setSelectedCategory(cat);
    const categoryConfig = INDIAN_POLLUTION_CATEGORIES.find((c) => c.id === cat);
    if (categoryConfig) {
      setAqiMod(categoryConfig.defaultModifier);
      const randomPreset = categoryConfig.presets[Math.floor(Math.random() * categoryConfig.presets.length)];
      setReportDescription(randomPreset);
    }
    // Only use preset fallback if user has not captured/uploaded a custom photo
    if (!isCustomPhoto) {
      setSelectedImage(CAMERA_PRESETS[cat]);
    }
  };

  // Set initial default report description
  useEffect(() => {
    if (!reportDescription) {
      const categoryConfig = INDIAN_POLLUTION_CATEGORIES.find((c) => c.id === 'Trash');
      if (categoryConfig) {
        setAqiMod(categoryConfig.defaultModifier);
        const randomPreset = categoryConfig.presets[Math.floor(Math.random() * categoryConfig.presets.length)];
        setReportDescription(randomPreset);
      }
    }
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(20);
    const reader = new FileReader();

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p === null) return null;
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 25;
      });
    }, 120);

    reader.onload = (event) => {
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setIsCustomPhoto(true);
          onShowToast(`📸 Photo imported successfully!`);
        }
        setTimeout(() => setUploadProgress(null), 600);
      }, 400);
    };
    reader.readAsDataURL(file);
  };

  // --------------------------------------------------------
  // 5. WhatsApp-like Community Chat Feed State & Simulation
  // --------------------------------------------------------
  const [messages, setMessages] = useState<CommunityMessage[]>(() => {
    const stored = localStorage.getItem('cleanair_india_chats');
    return stored ? JSON.parse(stored) : SIMULATED_CHATS;
  });
  const [textInput, setTextInput] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Multi-Community State & Real-time Sync
  const [activeCommunityId, setActiveCommunityId] = useState<string>('municipal_updates');
  const [showChatWindow, setShowChatWindow] = useState<boolean>(false);
  const [customCommunities, setCustomCommunities] = useState<Community[]>([]);
  const [joinedCommunityIds, setJoinedCommunityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('cleanair_joined_communities');
    return saved ? JSON.parse(saved) : ['municipal_updates'];
  });
  const [activeCommunityMessages, setActiveCommunityMessages] = useState<CommunityMessage[]>([]);
  
  // Custom Community Creation State
  const [showCreateCommunity, setShowCreateCommunity] = useState<boolean>(false);
  const [newCommunityName, setNewCommunityName] = useState<string>('');
  const [newCommunityDesc, setNewCommunityDesc] = useState<string>('');
  const [communitySearchQuery, setCommunitySearchQuery] = useState<string>('');

  // Persist joined custom communities
  useEffect(() => {
    localStorage.setItem('cleanair_joined_communities', JSON.stringify(joinedCommunityIds));
  }, [joinedCommunityIds]);

  // Sync custom communities from Firestore
  useEffect(() => {
    const q = query(collection(db, 'communities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Community[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name,
          description: data.description,
          type: data.type || 'custom',
          state: data.state,
          city: data.city,
          createdBy: data.createdBy,
          createdAt: data.createdAt
        });
      });
      setCustomCommunities(list);
    }, (err) => {
      console.warn("Firestore custom communities fetch failed:", err);
    });
    return () => unsubscribe();
  }, []);

  // Setup real-time listener for current community messages
  useEffect(() => {
    if (!activeCommunityId) return;

    const q = query(
      collection(db, 'community_messages'),
      where('communityId', '==', activeCommunityId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cloudMsgs: CommunityMessage[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudMsgs.push({
          id: docSnap.id,
          senderName: data.senderName,
          senderId: data.senderId,
          state: data.state || '',
          city: data.city || '',
          text: data.text,
          timestamp: data.timestamp || 'Just now',
          isUser: fbUser ? data.senderId === fbUser.uid : false,
          avatar: data.avatar || '🧑🏽‍💼',
          imageUrl: data.imageUrl,
          category: data.category,
          aqi: data.aqi,
          communityId: data.communityId
        });
      });

      // Seeding simulated fallback messages if empty
      let fallbackChats: CommunityMessage[] = [];
      if (activeCommunityId === 'municipal_updates') {
        fallbackChats = [
          {
            id: 'sim-muni-1',
            senderName: 'Central Municipal Team',
            senderId: 'municipal_authority',
            state: selectedState,
            city: selectedCityName,
            text: `📢 Welcome to the official Municipal Updates channel for ${selectedState}. Only verified local authorities and environmental control boards can publish announcements here.`,
            timestamp: '09:00 AM',
            isUser: false,
            avatar: '🏛️'
          },
          {
            id: 'sim-muni-2',
            senderName: 'Delhi Pollution Control Committee',
            senderId: 'dpcc_official',
            state: 'Delhi NCR',
            city: 'New Delhi',
            text: '⚠️ Air Pollution Notice: Anti-smog sprinklers have been deployed at Anand Vihar, Dwarka, and Connaught Place. Dust mitigation protocols are strictly active. Residents are requested to report active open burning instantly.',
            timestamp: '10:15 AM',
            isUser: false,
            avatar: '🛡️'
          }
        ];
      } else if (activeCommunityId.startsWith('state_')) {
        fallbackChats = SIMULATED_CHATS.filter(m => m.state === selectedState).map(m => ({
          ...m,
          isUser: fbUser ? m.senderId === fbUser.uid : false
        }));
        if (fallbackChats.length === 0) {
          fallbackChats = [
            {
              id: 'sim-state-empty',
              senderName: 'Eco Bot',
              senderId: 'eco_bot',
              state: selectedState,
              city: selectedCityName,
              text: `👋 Welcome to the ${selectedState} State Discussion community! Start sharing localized environmental reports and discussions.`,
              timestamp: 'Just now',
              isUser: false,
              avatar: '🌳'
            }
          ];
        }
      } else if (activeCommunityId.startsWith('city_')) {
        fallbackChats = SIMULATED_CHATS.filter(m => m.city === selectedCityName).map(m => ({
          ...m,
          isUser: fbUser ? m.senderId === fbUser.uid : false
        }));
        if (fallbackChats.length === 0) {
          fallbackChats = [
            {
              id: 'sim-city-empty',
              senderName: 'Eco Bot',
              senderId: 'eco_bot',
              state: selectedState,
              city: selectedCityName,
              text: `👋 Welcome to the ${selectedCityName} local citizen chat! Connect with neighbors to combat air pollution together.`,
              timestamp: 'Just now',
              isUser: false,
              avatar: '🏢'
            }
          ];
        }
      } else {
        if (cloudMsgs.length === 0) {
          fallbackChats = [
            {
              id: 'sim-custom-empty',
              senderName: 'Community Founder',
              senderId: 'founder',
              state: selectedState,
              city: selectedCityName,
              text: `🚀 This community was successfully founded on CleanAir Nexus. Invite other eco-conscious citizens and begin discussions!`,
              timestamp: 'Just now',
              isUser: false,
              avatar: '🌱'
            }
          ];
        }
      }

      if (cloudMsgs.length > 0) {
        setActiveCommunityMessages(cloudMsgs);
      } else {
        setActiveCommunityMessages(fallbackChats);
      }
    }, (err) => {
      console.warn("Error reading community messages:", err);
    });

    return () => unsubscribe();
  }, [activeCommunityId, selectedState, selectedCityName, fbUser]);

  // Keep chat scrolled to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCommunityMessages]);

  // Persist chats
  useEffect(() => {
    localStorage.setItem('cleanair_india_chats', JSON.stringify(messages));
  }, [messages]);

  // Synchronize Personal Broadcast History
  useEffect(() => {
    if (!fbUser) {
      setMyReports([]);
      return;
    }

    const q = query(
      collection(db, 'reports'),
      where('userId', '==', fbUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      setMyReports(list);
    }, (err) => {
      console.warn("My reports listener error (using client-side filter):", err);
      // Fallback: filter messages or peer reports
    });

    return () => unsubscribe();
  }, [fbUser]);

  // Synchronize Cloud Reports with Community Chats & Peer Reviews
  useEffect(() => {
    if (!profile.registered) return;

    // Listen to real-time reports in Firestore
    const reportsQuery = query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(30));
    
    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      const cloudReports: CommunityMessage[] = [];
      const pendingPeerReports: typeof peerReportsToVerify = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        // Convert to CommunityMessage
        cloudReports.push({
          id: data.id,
          senderName: data.senderName,
          senderId: data.senderId,
          state: data.state,
          city: data.city,
          text: `🚨 [HAZARD REPORT: ${(data.category || '').toUpperCase()}] ${data.description}. (AQI Impact: +${data.aqi || 30} pts) [Status: ${data.verified ? 'Verified ✓' : 'Pending Review ⌛'}]`,
          timestamp: data.timestamp || 'Just now',
          isUser: fbUser ? data.userId === fbUser.uid : false,
          avatar: data.verified ? '✅' : '🚨',
          imageUrl: data.imageUrl,
          category: data.category,
          aqi: data.aqi
        });

        // Collect pending reviews for other local reports
        const currentUid = fbUser?.uid || '';
        const userHasVoted = (data.votesUsers || []).includes(currentUid) || (data.spamUsers || []).includes(currentUid);
        
        if (
          !data.verified && 
          data.userId !== currentUid && 
          data.city === selectedCityName &&
          !userHasVoted
        ) {
          pendingPeerReports.push({
            id: data.id,
            reporter: data.senderName,
            distance: `${(0.5 + Math.random() * 2).toFixed(1)} km away`,
            category: data.category,
            description: data.description,
            verified: false,
            userId: data.userId
          });
        }
      });

      // Update Messages Feed
      setMessages((prev) => {
        // Filter out existing cloud reports
        const localChats = prev.filter(msg => !msg.id.startsWith('report-') && !msg.id.startsWith('msg-rep-'));
        return [...localChats, ...cloudReports];
      });

      // Update Peer Reviews
      if (pendingPeerReports.length > 0) {
        setPeerReportsToVerify(pendingPeerReports);
      } else {
        // Fallback to beautiful mock reviews so it is never empty
        setPeerReportsToVerify([
          {
            id: 'rep-peer-1',
            reporter: 'Ananya Roy',
            distance: '0.8 km away',
            category: 'Trash',
            description: 'Massive garbage burning behind the community market. Smoke is spreading.',
            verified: false
          },
          {
            id: 'rep-peer-2',
            reporter: 'Vikram Seth',
            distance: '1.4 km away',
            category: 'Dust',
            description: 'Major construction site blowing concrete dust without any water sprinkling.',
            verified: false
          }
        ]);
      }
    }, (err) => {
      console.warn("Firestore reports listener failed (using local fallback):", err);
    });

    return () => unsubscribe();
  }, [profile.registered, fbUser, selectedCityName]);

  // Simulate other citizens occasionally posting realistic comments/updates
  useEffect(() => {
    if (!profile.registered) return;

    const botTimer = setInterval(() => {
      // Generate a random citizen message
      const randomNames = ["Devendra Gupta", "Kiran Joshi", "Siddharth Nair", "Meera Sen", "Rajesh Khanna", "Deepika Roy"];
      const randomAvatars = ["🧑🏽‍🌾", "👩🏽‍💼", "👨🏽‍⚕️", "👩🏽‍🎨", "👨🏽‍🎓", "👩🏽‍🔬"];
      const stateObj = INDIAN_STATES_CITIES[Math.floor(Math.random() * INDIAN_STATES_CITIES.length)];
      const cityObj = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];
      
      const randomText = [
        `AQI here is getting worse near local crop fields. Very heavy particulate smog.`,
        `Just reported a nearby garbage fire pile. Hopefully Municipal team responds!`,
        `Clear skies over here, air index is around 65. Quite a relief from last week!`,
        `Heavy diesel vehicle traffic blocking the main sector market, high carbon exhaust today.`,
        `Construction site on main road is totally dry, cement particles flying into homes.`,
        `Wear N95 masks when going out for jogging guys. PM2.5 levels are dangerous.`
      ];

      const newBotMsg: CommunityMessage = {
        id: `msg-${Date.now()}`,
        senderName: randomNames[Math.floor(Math.random() * randomNames.length)],
        senderId: `@${cityObj.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_citizen`,
        state: stateObj.stateName,
        city: cityObj.name,
        text: randomText[Math.floor(Math.random() * randomText.length)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isUser: false,
        avatar: randomAvatars[Math.floor(Math.random() * randomAvatars.length)]
      };

      setMessages((prev) => [...prev, newBotMsg]);
      playAudioFeedback(600, 0.08, 'triangle'); // light click
    }, 28000); // every 28 seconds to maintain realistic traffic

    return () => clearInterval(botTimer);
  }, [profile.registered]);

  // Submit Text Message Handler
  const handleSendTextMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    if (activeCommunityId === 'municipal_updates') {
      onShowToast("🛑 This channel is read-only. Only Municipal authorities can publish updates.");
      return;
    }

    const isJoined = joinedCommunityIds.includes(activeCommunityId) || 
                     activeCommunityId.startsWith('state_') || 
                     activeCommunityId.startsWith('city_');
    if (!isJoined) {
      onShowToast("⚠️ Please join this community first to send messages!");
      return;
    }

    const currentMsgText = textInput.trim();
    setTextInput('');

    const newMsgId = `msg-user-${Date.now()}`;
    const timestampStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Optimistic local update for latency compensation
    const optimisticMsg: CommunityMessage = {
      id: newMsgId,
      senderName: profile.name || 'Google Citizen',
      senderId: fbUser?.uid || 'user',
      state: selectedState,
      city: selectedCityName,
      text: currentMsgText,
      timestamp: timestampStr,
      isUser: true,
      avatar: profile.avatar || "🇮🇳",
      communityId: activeCommunityId
    };

    setActiveCommunityMessages((prev) => [...prev, optimisticMsg]);
    playAudioFeedback(523.25, 0.1, 'sine'); // send sound

    const msgData = {
      communityId: activeCommunityId,
      senderName: profile.name || 'Google Citizen',
      senderId: fbUser?.uid || 'user',
      state: selectedState,
      city: selectedCityName,
      text: currentMsgText,
      timestamp: timestampStr,
      avatar: profile.avatar || "🇮🇳",
      createdAt: Date.now()
    };

    try {
      const newMsgDocRef = doc(collection(db, 'community_messages'));
      await setDoc(newMsgDocRef, msgData);
    } catch (err) {
      console.error("Firestore send community message failed:", err);
      // Fallback: append to global messages if offline or database error
      setMessages((prev) => [...prev, optimisticMsg]);
    }

    // Trigger random smart reply after 2s (simulating neighborhood participation)
    setTimeout(async () => {
      const replyText = CHAT_BOT_REPLIES[Math.floor(Math.random() * CHAT_BOT_REPLIES.length)];
      const randomReplies = ["Ananya Sharma", "Rahul Kapoor", "Sneha Patel", "Vikram Malhotra"];
      const botName = randomReplies[Math.floor(Math.random() * randomReplies.length)];
      const botAvatar = "👥";
      const botUid = `bot_${botName.toLowerCase().replace(/\s/g, '_')}`;

      const botMsgData = {
        communityId: activeCommunityId,
        senderName: botName,
        senderId: botUid,
        state: selectedState,
        city: selectedCityName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        avatar: botAvatar,
        createdAt: Date.now()
      };

      try {
        const botMsgDocRef = doc(collection(db, 'community_messages'));
        await setDoc(botMsgDocRef, botMsgData);
      } catch (err) {
        // Local fallback
        setActiveCommunityMessages((prev) => [
          ...prev,
          {
            id: `msg-reply-${Date.now()}`,
            ...botMsgData,
            isUser: false
          }
        ]);
      }
      playAudioFeedback(480, 0.08, 'triangle');
    }, 2000);
  };

  // Create Custom Community Handler
  const handleCreateCommunity = async () => {
    if (!fbUser) {
      onShowToast("⚠️ Please sign in with Google to create a community.");
      return;
    }

    if (!newCommunityName.trim() || !newCommunityDesc.trim()) {
      onShowToast("⚠️ Please enter a name and description to create a community.");
      return;
    }

    const customId = `custom_${Date.now()}`;
    const newComm = {
      name: newCommunityName.trim(),
      description: newCommunityDesc.trim(),
      type: 'custom',
      state: selectedState,
      city: selectedCityName,
      createdBy: fbUser.uid,
      createdAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'communities', customId), newComm);
      setJoinedCommunityIds((prev) => [...prev, customId]);
      setActiveCommunityId(customId);
      setShowChatWindow(true);
      setNewCommunityName('');
      setNewCommunityDesc('');
      setShowCreateCommunity(false);
      onShowToast(`🎉 "${newComm.name}" Community Created & Joined!`);
      playAudioFeedback(650, 0.1, 'sine');
    } catch (err) {
      console.error("Firestore create community failed:", err);
      onShowToast("⚠️ Failed to create community in Firestore.");
    }
  };

  // Delete Custom Community Handler
  const handleDeleteCommunity = async (communityId: string, communityName: string) => {
    if (!fbUser) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete the community "${communityName}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      // 1. Delete community document from Firestore
      await deleteDoc(doc(db, 'communities', communityId));
      
      // 2. Remove from local joined list
      setJoinedCommunityIds((prev) => prev.filter(id => id !== communityId));
      
      // 3. Reset active state if we deleted the current active community
      if (activeCommunityId === communityId) {
        setActiveCommunityId('municipal_updates');
        setShowChatWindow(false);
      }
      
      // 4. Cascade delete all messages belonging to this community
      const msgQuery = query(collection(db, 'community_messages'), where('communityId', '==', communityId));
      const msgSnap = await getDocs(msgQuery);
      const deletePromises = msgSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      onShowToast(`🗑️ Community "${communityName}" deleted successfully.`);
      playAudioFeedback(300, 0.15, 'sine');
    } catch (err) {
      console.error("Firestore delete community failed:", err);
      onShowToast("⚠️ Failed to delete community in Firestore.");
    }
  };

  // Submit Visual Hazard Report Handler
  const handlePublishReport = async () => {
    if (!auth.currentUser) {
      onShowToast("⚠️ You must sign in with Google to publish real-time reports.");
      return;
    }

    if (!profile.registered) {
      onShowToast("⚠️ Complete your SOMA local station registration first.");
      return;
    }

    // Reputation Score Enforcement
    if (userPoints < 50) {
      onShowToast("🚨 Reputation Lock: Your Citizen Impact score is too low (<50) due to peer flags. Submissions are suspended.");
      return;
    }

    // 1. Check description text for spam
    const textCheck = validateReportPhotoAndText(reportDescription);
    if (!textCheck.isValid) {
      onShowToast(`🚨 SOMA Shield Block: ${textCheck.reason}`);
      return;
    }

    // 2. Check snapped image quality for blockage/uniformity if custom
    if (selectedImage && selectedImage.startsWith('data:image')) {
      const imgCheck = await verifyImageQuality(selectedImage);
      if (!imgCheck.isOk) {
        onShowToast(`🚨 SOMA Shield Block: ${imgCheck.reason}`);
        return;
      }
    }

    const reportId = `report-${Date.now()}`;
    const cleanDesc = reportDescription.trim();

    const reportData = {
      id: reportId,
      userId: auth.currentUser.uid,
      senderName: profile.name,
      senderId: auth.currentUser.uid,
      state: profile.state,
      city: profile.city,
      category: selectedCategory,
      description: cleanDesc,
      imageUrl: selectedImage || null,
      aqi: aqiMod,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      createdAt: new Date().toISOString(),
      verified: false,
      votesCount: 0,
      votesUsers: [],
      spamCount: 0,
      spamUsers: []
    };

    try {
      // Create Report document in Firestore
      await setDoc(doc(db, 'reports', reportId), reportData);

      // Increment locally and on Firestore user stats
      const newPoints = userPoints + 100;
      const newReportsCount = userReportsCount + 1;

      setUserPoints(newPoints);
      setUserReportsCount(newReportsCount);

      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        points: newPoints,
        reportsCount: newReportsCount
      });

      // Local push of AQI indicator
      if (liveAqi) {
        setLiveAqi((prev) => Math.min(500, (prev || 100) + Math.round(aqiMod * 0.4)));
      }

      playAudioFeedback(880, 0.25, 'sine');
      onShowToast(`📡 Broadcast Successful! +100 Impact Points synced to Google Cloud.`);

      setActiveTab('impact');
      setReportDescription('');
      setSelectedImage(null);
      setIsCustomPhoto(false);
    } catch (err) {
      console.error("Firestore report submit failed:", err);
      onShowToast("⚠️ Sync error. Report queued locally.");
    }
  };

  // Delete/Revoke user report
  const handleDeleteReport = async (id: string) => {
    if (!fbUser) return;
    
    const confirmDelete = window.confirm(getString("Are you sure you want to delete this report?", lang));
    if (!confirmDelete) return;

    try {
      playAudioFeedback(350, 0.15, 'sine');
      await deleteDoc(doc(db, 'reports', id));

      // Decrement reportsCount
      const newReportsCount = Math.max(0, userReportsCount - 1);
      setUserReportsCount(newReportsCount);

      // Decrement in Firestore user doc
      const userDocRef = doc(db, 'users', fbUser.uid);
      await updateDoc(userDocRef, {
        reportsCount: newReportsCount
      });

      onShowToast(`🗑️ ${getString("Report deleted successfully.", lang)}`);
    } catch (err) {
      console.error("Failed to delete report:", err);
      onShowToast("⚠️ Failed to delete report from cloud.");
    }
  };

  // Refresh Google profile info in real time
  const handleRefreshProfile = async () => {
    if (!fbUser) return;
    try {
      playAudioFeedback(523, 0.1, 'sine');
      const userDocRef = doc(db, 'users', fbUser.uid);
      await updateDoc(userDocRef, {
        name: fbUser.displayName || profile.name,
        photoURL: fbUser.photoURL || profile.photoURL || ''
      });
      setProfile(prev => ({
        ...prev,
        name: fbUser.displayName || prev.name,
        photoURL: fbUser.photoURL || prev.photoURL || ''
      }));
      onShowToast(`🔄 ${getString("Profile refreshed from Google!", lang)}`);
    } catch (err) {
      console.error("Refresh profile failed:", err);
      onShowToast("⚠️ Failed to refresh Google profile info.");
    }
  };

  return (
    <div id="indian-citizen-portal-container" className="w-full h-full md:w-auto md:h-auto flex flex-col items-center justify-center">
      
      {/* Smartphone Outer Simulator Wrapper */}
      <div id="simulated-device-frame" className="relative w-full h-full md:w-[375px] md:h-[812px] bg-zinc-900 md:rounded-[50px] md:border-[12px] md:border-zinc-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col md:p-2 select-none">
        
        {/* Notch / Speaker Ear Piece */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-40 h-7 bg-zinc-800 rounded-b-2xl z-50 hidden md:flex items-center justify-between px-6 pointer-events-none">
          <div className="w-16 h-1 bg-zinc-700 rounded-full"></div>
          <div className="w-3.5 h-3.5 bg-black rounded-full border border-zinc-900 relative">
            <div className="absolute inset-1 bg-sky-950/40 rounded-full"></div>
          </div>
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="flex-1 bg-slate-50 md:rounded-[38px] rounded-none overflow-hidden flex flex-col relative text-slate-800 md:pt-4">

          {/* Conditional Rendering: Onboarding or Logged In Application */}
          <AnimatePresence mode="wait">
            {!profile.registered ? (
              // --------------------------------------------------------
              // SCREEN A: Onboarding / Registration screen
              // --------------------------------------------------------
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex-1 p-6 flex flex-col justify-between h-full bg-gradient-to-b from-sky-50 to-white overflow-y-auto"
              >
                <div className="space-y-5 pt-4">
                  {/* Banner */}
                  <div className="text-center space-y-1.5">
                    <div className="w-11 h-11 bg-sky-600 rounded-2xl mx-auto flex items-center justify-center text-white font-bold shadow-lg shadow-sky-200">
                      <Compass className="w-5.5 h-5.5 text-white animate-spin-slow" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{TRANSLATIONS[lang].appName}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">{TRANSLATIONS[lang].appSubtitle}</p>
                  </div>

                  {/* Language Selector Dropdown */}
                  <div className="bg-white p-2.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                    <label htmlFor="onboarding-lang-select" className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide block text-center">
                      🌐 {TRANSLATIONS[lang].selectLang}
                    </label>
                    <div className="relative">
                      <select
                        id="onboarding-lang-select"
                        value={lang}
                        onChange={(e) => {
                          setLang(e.target.value as LanguageCode);
                          playAudioFeedback(523, 0.08, 'sine');
                        }}
                        className="w-full text-xs bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 shadow-sm cursor-pointer appearance-none pr-8"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l.code} value={l.code}>
                            {l.flag} &nbsp; {l.native} ({l.label})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {!fbUser ? (
                    /* Google Sign In Call to Action */
                    <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                      <div className="w-10 h-10 bg-emerald-50 rounded-full mx-auto flex items-center justify-center text-emerald-600 mb-1">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800">🔒 Secure Verification Nodes</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        To prevent fake registrations and spam hazard reports, CleanAir India requires Google account verification. Each citizen profile is bound to a validated identity.
                      </p>
                      
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer shadow-md"
                      >
                        {/* Custom Google SVG Icon */}
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#EA4335"
                            d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.68 14.9 1 12 1 7.35 1 3.4 3.65 1.45 7.5l3.85 2.99C6.25 7.33 8.9 5.04 12 5.04z"
                          />
                          <path
                            fill="#4285F4"
                            d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.3 14.5c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38l-3.85-2.99C.53 8.35 0 10.12 0 12s.53 3.65 1.45 5.25l3.85-2.99z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.73-2.89c-1.04.7-2.37 1.11-4.23 1.11-3.1 0-5.75-2.29-6.7-5.45l-3.85 2.99C3.4 20.35 7.35 23 12 23z"
                          />
                        </svg>
                        <span>Sign In with Google</span>
                      </button>
                    </div>
                  ) : (
                    /* Select Local Station after Google verification */
                    <div className="space-y-3.5">
                      <div className="bg-sky-50 border border-sky-200/50 p-3 rounded-2xl flex items-center gap-3">
                        <img 
                          src={fbUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"} 
                          alt="Google Profile" 
                          className="w-10 h-10 rounded-full border border-sky-300 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-left">
                          <p className="text-[10px] font-bold text-sky-800">Verified Google Account</p>
                          <p className="text-[11px] font-extrabold text-slate-800 leading-tight">{fbUser.displayName}</p>
                          <p className="text-[9px] text-slate-500 font-mono">{fbUser.email}</p>
                        </div>
                      </div>

                      <form onSubmit={handleRegister} className="space-y-3.5">
                        {/* Enter Name */}
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" /> {TRANSLATIONS[lang].fullName}
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            placeholder={TRANSLATIONS[lang].fullNamePlaceholder}
                            className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-sans font-semibold text-slate-800 shadow-sm"
                          />
                        </div>

                        {/* Select Indian State */}
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {TRANSLATIONS[lang].stateRegion}
                          </label>
                          <select
                            value={selectedState}
                            onChange={(e) => handleStateChange(e.target.value)}
                            className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 shadow-sm cursor-pointer"
                          >
                            {INDIAN_STATES_CITIES.map((state) => (
                              <option key={state.stateName} value={state.stateName}>
                                {state.stateName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Select City */}
                        <div className="space-y-1">
                          <label className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-sky-500" /> {TRANSLATIONS[lang].city}
                          </label>
                          <select
                            value={selectedCityName}
                            onChange={(e) => setSelectedCityName(e.target.value)}
                            className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 shadow-sm cursor-pointer"
                          >
                            {currentCities.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                <div className="space-y-3.5 pt-4">
                  {/* Warning on compliance */}
                  <div className="bg-slate-100 p-2.5 rounded-xl flex items-start gap-2 border border-slate-200">
                    <ShieldAlert className="w-4.5 h-4.5 text-sky-600 shrink-0 mt-0.5" />
                    <p className="text-[9.5px] text-slate-500 leading-relaxed font-sans font-medium">
                      {TRANSLATIONS[lang].complianceWarning}
                    </p>
                  </div>

                  {fbUser && (
                    <button
                      type="submit"
                      onClick={handleRegister}
                      className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-200 transition-colors active:scale-95 cursor-pointer"
                    >
                      <span>{TRANSLATIONS[lang].registerBtn}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              // --------------------------------------------------------
              // SCREEN B: Logged In Application View
              // --------------------------------------------------------
              <motion.div
                key="application-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full bg-slate-50 relative overflow-hidden"
              >
                
                {/* Simulated In-App Navbar */}
                <div className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                      {profile.city} {getString("channel", lang)}
                    </span>
                  </div>
                  
                  {/* Header Title / Branding */}
                  <div className="text-center">
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight leading-none">CleanAir Nexus</h4>
                  </div>

                  {/* User Mini Profile Photo Button (Top Right) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        playAudioFeedback(523.25, 0.08, 'sine');
                      }}
                      title={TRANSLATIONS[lang].settingsTab}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 overflow-hidden border-2 ${
                        activeTab === 'settings' ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200'
                      }`}
                    >
                      <span className="text-base leading-none select-none">{profile.avatar || '🚴‍♂️'}</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Area based on Tab */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative pb-2 flex flex-col">
                  
                  {/* TAB 1: RADER (Live AQI with API Data) */}
                  {activeTab === 'radar' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 space-y-4 flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        {/* Live Regional Dashboard Scope Selector */}
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                              📊 {getString("Air Quality Scope", lang)}
                            </span>
                            
                            {/* Segmented Toggler */}
                            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                              <button
                                type="button"
                                onClick={() => {
                                  setViewMode('city');
                                  playAudioFeedback(523, 0.08, 'sine');
                                }}
                                className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                                  viewMode === 'city'
                                    ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-100'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                <MapPin className="w-2.5 h-2.5" />
                                <span>{getString("City", lang)}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setViewMode('state');
                                  playAudioFeedback(587, 0.08, 'sine');
                                }}
                                className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                                  viewMode === 'state'
                                    ? 'bg-white text-sky-600 shadow-sm ring-1 ring-slate-100'
                                    : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                <Building2 className="w-2.5 h-2.5" />
                                <span>{getString("State", lang)}</span>
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[8px] font-mono font-bold text-slate-400 uppercase block mb-1">{getString("State / Region", lang)}</label>
                              <select
                                value={selectedState}
                                onChange={(e) => handleStateChange(e.target.value)}
                                className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none font-bold text-slate-700 cursor-pointer"
                              >
                                {INDIAN_STATES_CITIES.map((state) => (
                                  <option key={state.stateName} value={state.stateName}>
                                    {state.stateName}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="text-[8px] font-mono font-bold text-slate-400 uppercase block mb-1">
                                {viewMode === 'state' ? getString("Scope Status", lang) : getString("Active Station", lang)}
                              </label>
                              {viewMode === 'state' ? (
                                <div className="w-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded-lg p-1.5 font-bold flex items-center justify-center gap-1 h-[29px]">
                                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse shrink-0"></span>
                                  {getString("State Average", lang)}
                                </div>
                              ) : (
                                <select
                                  value={selectedCityName}
                                  onChange={(e) => setSelectedCityName(e.target.value)}
                                  className="w-full text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none font-bold text-slate-700 cursor-pointer"
                                >
                                  {currentCities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                      {city.name}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Loading indicator or AQI Gauge */}
                        {loadingAqi ? (
                          <div className="h-44 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-6 space-y-2">
                            <Compass className="w-8 h-8 text-sky-500 animate-spin" />
                            <span className="text-[11px] font-mono font-bold text-slate-400">{getString("CONNECTING SATELLITE RADAR...", lang)}</span>
                          </div>
                        ) : (
                          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col items-center text-center space-y-3 relative overflow-hidden">
                            
                            {/* Watermark/Indian flag colors */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-white to-green-500 opacity-60"></div>

                            {/* Badge stating active viewing scope level */}
                            <span className={`text-[8px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
                              viewMode === 'state' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-sky-50 text-sky-600 border-sky-200'
                            }`}>
                              {viewMode === 'state' ? `🏛️ ${selectedState} ${getString("Regional Average", lang)}` : `📍 ${selectedCityName} ${getString("Station", lang)}`}
                            </span>

                            {/* Circular Live Gauge */}
                            <div className="relative w-32 h-32 flex flex-col items-center justify-center">
                              {/* SVG Circular Ring */}
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="54"
                                  stroke="#f1f5f9"
                                  strokeWidth="8"
                                  fill="transparent"
                                />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="54"
                                  stroke={aqiInfo.circleColor}
                                  strokeWidth="8"
                                  fill="transparent"
                                  strokeDasharray={`${2 * Math.PI * 54}`}
                                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - Math.min(500, displayAqi || 0) / 500)}`}
                                  strokeLinecap="round"
                                  className="transition-all duration-700 ease-out"
                                />
                              </svg>
                              
                              {/* Central AQI text */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                <span className="text-3xl font-mono font-bold text-slate-800 leading-none">
                                  {displayAqi}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 font-bold tracking-widest uppercase mt-0.5">
                                  {viewMode === 'state' ? getString("REGIONAL AQI", lang) : getString("US AQI", lang)}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 font-mono">
                                  {aqiInfo.hiLabel}
                                </span>
                              </div>
                            </div>

                            {/* Status and Description */}
                            <div className="space-y-1 px-2">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${aqiInfo.color}`}>
                                ● {aqiInfo.label}
                              </span>
                              <p className="text-[11px] text-slate-500 leading-relaxed font-medium pt-1.5">
                                {viewMode === 'state'
                                  ? getString("state_avg_desc", lang).replace("{count}", String(stateValidCities.length))
                                  : aqiInfo.desc}
                              </p>
                            </div>

                            {/* PM2.5 / PM10 sub metrics */}
                            <div className="w-full grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-left">
                              <div className="bg-slate-50 p-2 rounded-xl text-center">
                                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{getString("Avg PM2.5 Conc.", lang)}</span>
                                <span className="block text-sm font-mono font-bold text-slate-700">{displayPm25} µg/m³</span>
                              </div>
                              <div className="bg-slate-50 p-2 rounded-xl text-center">
                                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{getString("Avg PM10 Conc.", lang)}</span>
                                <span className="block text-sm font-mono font-bold text-slate-700">{displayPm10} µg/m³</span>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* Health Advisory Guidelines */}
                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
                          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-sky-500" /> {getString("Dynamic Health Advisory", lang)}
                          </span>
                          <div className="space-y-2 text-[11px] leading-relaxed text-slate-600">
                            {displayAqi && displayAqi > 200 ? (
                              <div className="flex items-start gap-2 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                                <div>
                                  <strong className="text-rose-700">{getString("Avoid Outdoor Exercises:", lang)}</strong> {getString("health_adv_hazard", lang).replace("{scope}", viewMode === 'state' ? getString("across the state region", lang) : getString("in {city}", lang).replace("{city}", selectedCityName))}
                                </div>
                              </div>
                            ) : displayAqi && displayAqi > 100 ? (
                              <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-amber-700">{getString("Sensitive Groups At Risk:", lang)}</strong> {getString("health_adv_sensitive", lang).replace("{scope}", viewMode === 'state' ? getString("across the state region", lang) : getString("in {city}", lang).replace("{city}", selectedCityName))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start gap-2 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="text-emerald-700">{getString("Pristine Weather:", lang)}</strong> {getString("health_adv_clean", lang).replace("{scope}", viewMode === 'state' ? getString("across the state region", lang) : getString("in {city}", lang).replace("{city}", selectedCityName))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* State-wide Live AQI Dashboard */}
                        <div id="state-wide-dashboard" className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                                <Map className="w-3.5 h-3.5 text-sky-500" /> {selectedState} {getString("Live State Monitor", lang)}
                              </span>
                              <span className="text-[9px] text-slate-400 font-sans block mt-0.5">
                                {getString("Real-time AQI readings across all districts", lang)}
                              </span>
                            </div>
                            <span className="text-[9px] font-mono bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded-md border border-sky-100 font-bold">
                              {stateCitiesData.length} {getString("Stations", lang)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {stateCitiesData.map((city) => {
                              const cityAqiDetails = getIndianAqiDetails(city.aqi || 100);
                              const isCurrentCity = city.name === selectedCityName;
                              return (
                                <button
                                  key={city.name}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCityName(city.name);
                                    onShowToast(`📍 Now viewing live active station: ${city.name}`);
                                    playAudioFeedback(600, 0.1, "sine");
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer active:scale-[0.99] ${
                                    isCurrentCity
                                      ? "bg-sky-50/70 border-sky-300 shadow-sm"
                                      : "bg-slate-50 hover:bg-slate-100 border-slate-100 hover:border-slate-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cityAqiDetails.circleColor }}></div>
                                    <div className="flex flex-col min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className={`text-[11px] font-bold truncate ${isCurrentCity ? "text-sky-800" : "text-slate-700"}`}>
                                          {city.name}
                                        </span>
                                        {isCurrentCity && (
                                          <span className="text-[7px] font-mono bg-sky-600 text-white px-1 rounded font-extrabold uppercase tracking-wider scale-90">
                                            {getString("Selected", lang)}
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex gap-2 text-[9px] font-mono text-slate-400 mt-0.5">
                                        <span>PM2.5: <strong className="text-slate-600 font-bold">{city.pm25 !== null ? city.pm25 : "--"}</strong></span>
                                        <span>PM10: <strong className="text-slate-600 font-bold">{city.pm10 !== null ? city.pm10 : "--"}</strong></span>
                                      </div>
                                    </div>
                                  </div>

                                  {city.loading ? (
                                    <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <div className="text-right">
                                        <div className="text-xs font-mono font-bold text-slate-800 leading-none">
                                          {city.aqi}
                                        </div>
                                        <div className="text-[8px] font-mono text-slate-400 font-semibold leading-none mt-0.5">
                                          {cityAqiDetails.hiLabel}
                                        </div>
                                      </div>
                                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${cityAqiDetails.color}`}>
                                        {cityAqiDetails.label}
                                      </span>
                                    </div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="text-center pt-2">
                        <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                          {getString("Live Data Source:", lang)} {apiSource === 'api' ? getString("🛰️ Open-Meteo Air Quality", lang) : getString("📡 Base Simulation Model", lang)}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: REPORT HAZARD (Interactive custom click) */}
                  {activeTab === 'report' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 space-y-4"
                    >
                      {/* Section Title */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">
                            {!selectedImage ? "Step 1: Snap or Upload Evidence" : "Step 2: Add Hazard Details"}
                          </h4>
                          <p className="text-[10px] text-slate-400">
                            {!selectedImage ? "Camera stream with active GPS watermarking" : "Annotate the air pollution observation"}
                          </p>
                        </div>
                        <span className="text-[10px] font-mono bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full border border-sky-100 font-bold">
                          Step {!selectedImage ? "1" : "2"} of 2
                        </span>
                      </div>

                      {/* STEP 1: Capture or Upload (When no image has been selected) */}
                      {!selectedImage ? (
                        <div className="space-y-4 animate-fadeIn">
                          {/* Photo Capture Area */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                                📸 Camera Viewport
                              </label>
                              {usingRealGps && (
                                <span className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded border border-emerald-100 animate-pulse">
                                  📡 REAL GPS ACTIVE
                                </span>
                              )}
                            </div>
                            
                            {isCameraActive ? (
                              <div className="relative border-2 border-slate-800 rounded-2xl overflow-hidden aspect-video bg-black flex flex-col items-center justify-center shadow-md">
                                {cameraLoading ? (
                                  <div className="text-center text-slate-400 p-4 space-y-2">
                                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    <span className="text-[10px] font-mono">Initializing lens...</span>
                                  </div>
                                ) : isCameraSimulated ? (
                                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                                    <img
                                      src={CAMERA_PRESETS[selectedCategory]}
                                      alt="Simulated Viewfinder"
                                      className="w-full h-full object-cover opacity-80"
                                      referrerPolicy="no-referrer"
                                    />
                                    
                                    {/* Simulated scanning lines / grid overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,24,38,0)_95%,rgba(14,165,233,0.15)_95%)] bg-[length:100%_20px] animate-[pulse_2s_infinite]"></div>
                                    <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-sky-500/25 m-4 rounded-lg"></div>
                                    
                                    {/* Crosshair / Targeting Reticle */}
                                    <div className="absolute pointer-events-none flex items-center justify-center">
                                      <div className="w-10 h-10 border border-sky-400/40 rounded-full animate-ping"></div>
                                      <div className="absolute w-6 h-6 border-t border-l border-sky-400"></div>
                                      <div className="absolute w-6 h-6 border-b border-r border-sky-400"></div>
                                    </div>
                                    
                                    <div className="absolute top-2 left-2 bg-amber-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 text-[8px] font-mono text-amber-400 font-bold tracking-wider animate-pulse">
                                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full inline-block"></span>
                                      MOCK SIMULATION NODE
                                    </div>
                                    
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[8px] font-mono text-slate-300 font-bold">
                                      {selectedCityName} SOMA
                                    </div>

                                    <div className="absolute top-10 left-2 bg-slate-900/95 backdrop-blur-sm p-1.5 rounded-lg border border-slate-800 text-[7px] font-mono text-slate-400 space-y-0.5 pointer-events-none max-w-[120px] text-left">
                                      <div className="text-[8px] text-sky-400 font-bold border-b border-slate-800 pb-0.5 mb-0.5">TELEMETRY</div>
                                      <div>LAT: {geolocationCoords?.lat.toFixed(4) || selectedCityCoords.lat.toFixed(4)}°N</div>
                                      <div>LON: {geolocationCoords?.lon.toFixed(4) || selectedCityCoords.lon.toFixed(4)}°E</div>
                                      <div className="text-emerald-400 font-semibold">SIGNAL: OPTIMAL</div>
                                    </div>

                                    {/* Overlay control triggers */}
                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-3 z-10">
                                      <button
                                        type="button"
                                        onClick={captureSimulatedPhoto}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold rounded-xl text-[10px] shadow-lg shadow-sky-900/40 uppercase tracking-wider cursor-pointer transition-transform"
                                      >
                                        <Camera className="w-3.5 h-3.5" />
                                        Snap Simulated Photo
                                      </button>
                                      <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 font-bold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer border border-zinc-700 transition-transform"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <video
                                      ref={videoRef}
                                      autoPlay
                                      playsInline
                                      muted
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 text-[8px] font-mono text-emerald-400 font-bold tracking-wider">
                                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                                      LIVE VIEWPORT
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[8px] font-mono text-slate-300 font-bold">
                                      {selectedCityName} SOMA
                                    </div>
                                    
                                    {/* Overlay control triggers */}
                                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 px-3 z-10">
                                      <button
                                        type="button"
                                        onClick={capturePhoto}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl text-[10px] shadow-lg shadow-emerald-900/40 uppercase tracking-wider cursor-pointer transition-transform"
                                      >
                                        <Camera className="w-3.5 h-3.5" />
                                        Snap Photo
                                      </button>
                                      <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-300 font-bold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer border border-zinc-700 transition-transform"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="border border-dashed border-slate-200/80 rounded-2xl p-6 bg-white flex flex-col items-center justify-center space-y-4 text-center shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shadow-sm shadow-sky-50 relative overflow-hidden shrink-0">
                                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-indigo-400/20 animate-pulse"></div>
                                  <Camera className="w-5.5 h-5.5 text-sky-600 relative z-10 animate-pulse" />
                                </div>
                                <div className="space-y-1">
                                  <h5 className="text-xs font-bold text-slate-700">Camera is Disconnected / Idle</h5>
                                  <p className="text-[10px] text-slate-400 max-w-[220px] mx-auto leading-normal">
                                    Start camera to snap real pollution hazards, or upload direct photos.
                                  </p>
                                </div>
                                <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                  <button
                                    type="button"
                                    onClick={startCamera}
                                    className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 active:scale-95 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-100 cursor-pointer uppercase tracking-wider font-mono"
                                  >
                                    <Camera className="w-3.5 h-3.5" />
                                    <span>Start Live Camera</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 active:scale-95 text-slate-700 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer uppercase tracking-wider font-mono"
                                  >
                                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Upload from Files</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedImage(CAMERA_PRESETS[selectedCategory]);
                                      setIsCustomPhoto(false);
                                      onShowToast("🎨 Using high-quality sample image preset!");
                                    }}
                                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-lg text-[9px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span>💡 Use Sample Preset Photo</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Loading indicators for uploads */}
                          {uploadProgress !== null && (
                            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-2 animate-fadeIn">
                              <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div className="bg-sky-500 h-full transition-all" style={{ width: `${uploadProgress}%` }}></div>
                              </div>
                              <span className="text-[9px] font-mono font-bold text-slate-500">PROCESSING EVIDENCE... {uploadProgress}%</span>
                            </div>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />

                          {/* GPS Location Auto addition preview */}
                          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5 text-left">
                            <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                              📍 Location Watermark Target
                            </span>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600">
                              <div>
                                Node: <strong className="text-slate-800">{selectedCityName} SOMA</strong>
                              </div>
                              <div>
                                Coord: <strong className="text-slate-800">{selectedCityCoords.lat.toFixed(4)}, {selectedCityCoords.lon.toFixed(4)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* STEP 2: Detail comment, category, coordinates etc */
                        <div className="space-y-4 animate-fadeIn">
                          {/* Gemini AI Smart Verification Card */}
                          {isAiAnalyzing && (
                            <div className="bg-gradient-to-r from-violet-600/5 to-indigo-600/5 p-3 rounded-2xl border border-violet-500/20 shadow-sm space-y-2 text-left relative overflow-hidden">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700">
                                <Sparkles className="w-4 h-4 text-violet-600 animate-spin-slow" />
                                <span>Gemini Vision Node: Scanning Evidence...</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                <div className="absolute top-0 bottom-0 bg-violet-600 rounded-full w-[40%] animate-scan"></div>
                              </div>
                            </div>
                          )}

                          {aiAnalysisResult && (
                            <div className="bg-gradient-to-r from-violet-50/70 to-indigo-50/70 p-3.5 rounded-2xl border border-violet-200/60 shadow-sm space-y-2 text-left animate-fadeIn">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-800 uppercase tracking-wider font-mono">
                                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                                  <span>Gemini AI Assessment</span>
                                </div>
                                <span className="text-[9px] font-mono bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold">
                                  {aiAnalysisResult.confidence}% Confidence
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-normal font-sans">
                                {aiAnalysisResult.description}
                              </p>
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 text-[10px]">
                                  <span className="text-slate-400 font-medium">Severity:</span>
                                  <span className={`font-extrabold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider ${
                                    aiAnalysisResult.severity === 'Low' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                    aiAnalysisResult.severity === 'Moderate' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                    aiAnalysisResult.severity === 'High' ? 'bg-orange-50 text-orange-700 border border-orange-100' :
                                    'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                                  }`}>
                                    {aiAnalysisResult.severity}
                                  </span>
                                </div>
                                <div className="flex-1 flex items-center justify-between bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 text-[10px]">
                                  <span className="text-slate-400 font-medium">Suggested AQI:</span>
                                  <span className="font-bold text-violet-700">+{aiAnalysisResult.suggestedAqiMod}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Image preview with reset/change trigger */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center justify-between">
                              <span>📸 Captured Evidence</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedImage(null);
                                  setIsCustomPhoto(false);
                                  onShowToast("🔄 Returned to Camera View. Retake active.");
                                }}
                                className="text-[9px] font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase cursor-pointer"
                              >
                                🔄 Retake / Change Photo
                              </button>
                            </label>
                            <div className="relative border-2 border-slate-200 rounded-2xl overflow-hidden aspect-video bg-slate-50 flex items-center justify-center p-1.5 shadow-inner">
                              <div className="relative w-full h-full rounded-xl overflow-hidden">
                                <img
                                  src={selectedImage}
                                  alt="Particulate matter hazard evidence"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1 text-[8px] font-mono text-amber-400 font-bold tracking-wider">
                                  <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping inline-block"></span>
                                  GPS EMBEDDED
                                </div>
                                <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md p-1.5 rounded-lg text-white font-mono text-[8px] leading-normal border border-white/5 flex justify-between">
                                  <span>📍 {selectedCityName}, IN</span>
                                  <span className="text-amber-400 font-bold">LAT:{selectedCityCoords.lat.toFixed(4)} LON:{selectedCityCoords.lon.toFixed(4)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Pollution Category Select */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                              🔥 Choose Hazard Tag Type
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {INDIAN_POLLUTION_CATEGORIES.map((cat) => {
                                const isSelected = selectedCategory === cat.id;
                                const style = CATEGORY_STYLES[cat.id] || { active: 'border-sky-500 bg-sky-50/50 text-sky-700', border: 'border-slate-200' };
                                return (
                                  <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => handleCategoryChange(cat.id as IndianCategoryType)}
                                    className={`flex items-center gap-1.5 p-2 bg-white rounded-xl border text-[11px] font-bold transition-all cursor-pointer active:scale-95 ${
                                      isSelected ? style.active : style.border
                                    } text-slate-600`}
                                  >
                                    <span className="text-base">{cat.emoji}</span>
                                    <span className="truncate leading-none">{cat.nameEn}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* GPS Tag Coordinate Details */}
                          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5 text-left">
                            <div className="flex justify-between items-center text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                              <span>📍 Smart GPS Tagging</span>
                              <span className="text-[9px] text-emerald-500">Auto-Attached</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                              <div>
                                City: <strong className="text-slate-800">{selectedCityName}</strong>
                              </div>
                              <div>
                                Lat/Long: <strong className="text-slate-800">{selectedCityCoords.lat.toFixed(4)}, {selectedCityCoords.lon.toFixed(4)}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic expected AQI impact & manual override */}
                          <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2 text-left">
                            <div className="flex justify-between items-center text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                              <span>📊 Estimated AQI Modifier</span>
                              <Sliders className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 font-sans">Expected particulate increment:</span>
                              <span className="font-mono font-bold text-rose-500 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded">
                                +{aqiMod} AQI Points
                              </span>
                            </div>
                            {/* Manual override slider */}
                            <div className="flex items-center gap-2 pt-1">
                              <span className="text-[10px] font-mono text-slate-400">Low</span>
                              <input
                                type="range"
                                min="20"
                                max="200"
                                value={aqiMod}
                                onChange={(e) => setAqiMod(parseInt(e.target.value))}
                                className={`flex-1 h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer ${ACCENT_CLASSES[selectedCategory] || 'accent-sky-500'}`}
                              />
                              <span className="text-[10px] font-mono text-slate-400">High</span>
                            </div>
                          </div>

                          {/* Text Comment Comment */}
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                              📝 Description / Comments
                            </label>
                            <textarea
                              value={reportDescription}
                              onChange={(e) => setReportDescription(e.target.value)}
                              rows={2}
                              placeholder="e.g. Thick dark plastic trash smoke spreading behind the block shops..."
                              className="w-full p-2.5 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 shadow-sm"
                            ></textarea>
                          </div>

                          {/* Publish / Submit Trigger */}
                          <button
                            type="button"
                            onClick={handlePublishReport}
                            className="w-full py-3 bg-sky-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-200 hover:bg-sky-700 transition-colors cursor-pointer active:scale-95 shrink-0 uppercase tracking-wider"
                          >
                            <Sparkles className="w-4 h-4 text-white shrink-0 animate-pulse" />
                            <span>BROADCAST TO COMMUNITY</span>
                          </button>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* TAB 3: COMMUNITY (Slack/WhatsApp-like Channels and Chats) */}
                  {activeTab === 'community' && (() => {
                    // Assemble the full list of communities dynamically
                    const defaultMunicipal: Community = {
                      id: 'municipal_updates',
                      name: '🏛️ Municipal Updates',
                      description: 'Official real-time updates and emergency notifications from the Central Municipal team. [Read-Only]',
                      type: 'municipal',
                      joined: true
                    };

                    const defaultStateCommunity: Community = {
                      id: `state_${selectedState.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                      name: `🌿 ${selectedState} Forum`,
                      description: `State-level clean air discussion for residents of ${selectedState}.`,
                      type: 'state',
                      state: selectedState,
                      joined: true
                    };

                    const defaultCityCommunity: Community = {
                      id: `city_${selectedCityName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
                      name: `🌆 ${selectedCityName} Chat`,
                      description: `Local neighborhood chat for residents of ${selectedCityName}.`,
                      type: 'city',
                      state: selectedState,
                      city: selectedCityName,
                      joined: true
                    };

                    const availableCommunities: Community[] = [
                      defaultMunicipal,
                      defaultStateCommunity,
                      defaultCityCommunity,
                      ...customCommunities
                    ];

                    const filteredCommunities = availableCommunities.filter(comm => 
                      comm.name.toLowerCase().includes(communitySearchQuery.toLowerCase()) ||
                      comm.description.toLowerCase().includes(communitySearchQuery.toLowerCase())
                    );

                    const activeComm = availableCommunities.find(c => c.id === activeCommunityId) || defaultMunicipal;
                    const isActiveCommJoined = joinedCommunityIds.includes(activeCommunityId) || 
                                               activeCommunityId.startsWith('state_') || 
                                               activeCommunityId.startsWith('city_');

                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col h-[420px] overflow-hidden bg-slate-50/30 font-sans"
                      >
                        {!showChatWindow ? (
                          /* SIDEBAR: COMMUNITIES LIST */
                          <div className="flex w-full bg-white flex-col overflow-hidden h-full">
                            {/* Search and Header */}
                            <div className="p-3 border-b border-slate-100 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                                  🌐 Channels
                                </span>
                                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-full font-mono">
                                  {availableCommunities.length}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={communitySearchQuery}
                                onChange={(e) => setCommunitySearchQuery(e.target.value)}
                                placeholder="Search channels..."
                                className="w-full text-[11px] bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white text-slate-700 font-sans shadow-inner"
                              />
                            </div>

                            {/* Communities Scrollable List */}
                            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                              {filteredCommunities.map((comm) => {
                                const isSelected = comm.id === activeCommunityId;
                                const isJoined = joinedCommunityIds.includes(comm.id) || 
                                                 comm.type === 'municipal' || 
                                                 comm.type === 'state' || 
                                                 comm.type === 'city';

                                return (
                                  <div
                                    key={comm.id}
                                    onClick={() => {
                                      setActiveCommunityId(comm.id);
                                      setShowChatWindow(true);
                                      playAudioFeedback(400, 0.05, 'sine');
                                    }}
                                    className={`w-full flex items-start gap-2.5 p-2 rounded-xl text-left transition-all relative cursor-pointer ${
                                      isSelected 
                                        ? 'bg-sky-50 border-l-4 border-sky-500 text-slate-800' 
                                        : 'hover:bg-slate-50 text-slate-600'
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-1">
                                        <h5 className="text-[11px] font-bold truncate leading-tight">
                                          {comm.name}
                                        </h5>
                                        {comm.type === 'municipal' && (
                                          <span className="text-[8px] bg-amber-50 text-amber-700 font-bold px-1 py-0.2 rounded shrink-0">
                                            Official
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[9px] text-slate-400 truncate mt-0.5 leading-normal">
                                        {comm.description}
                                      </p>
                                    </div>

                                    {/* Join/Leave button for custom ones */}
                                    <div className="shrink-0 pt-0.5 flex items-center gap-1.5">
                                      {comm.type === 'custom' && (
                                        <>
                                          {isJoined ? (
                                            <button
                                              type="button"
                                              title="Leave Group"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setJoinedCommunityIds(prev => prev.filter(id => id !== comm.id));
                                                if (activeCommunityId === comm.id) {
                                                  setActiveCommunityId('municipal_updates');
                                                }
                                                onShowToast(`Left "${comm.name}"`);
                                                playAudioFeedback(350, 0.08, 'sine');
                                              }}
                                              className="text-[10px] text-slate-300 hover:text-rose-500 p-0.5 transition-colors"
                                            >
                                              ✕
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setJoinedCommunityIds(prev => [...prev, comm.id]);
                                                onShowToast(`Joined "${comm.name}"!`);
                                                playAudioFeedback(600, 0.08, 'sine');
                                              }}
                                              className="text-[9px] text-sky-600 hover:bg-sky-100 font-extrabold px-1.5 py-0.5 rounded-md border border-sky-200"
                                            >
                                              + Join
                                            </button>
                                          )}

                                          {comm.createdBy === fbUser?.uid && (
                                            <button
                                              type="button"
                                              title="Delete Community"
                                              onClick={async (e) => {
                                                e.stopPropagation();
                                                await handleDeleteCommunity(comm.id, comm.name);
                                              }}
                                              className="text-slate-300 hover:text-rose-600 p-0.5 transition-colors"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Bottom Action: Create Community Group */}
                            <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
                              {showCreateCommunity ? (
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-2 shadow-sm">
                                  <div className="text-[9px] font-bold text-sky-800 uppercase tracking-wider font-mono">
                                    🌱 Create Channel
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Name (e.g. Dwarka Cleanups)"
                                    value={newCommunityName}
                                    onChange={(e) => setNewCommunityName(e.target.value)}
                                    className="w-full text-[11px] border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Description..."
                                    value={newCommunityDesc}
                                    onChange={(e) => setNewCommunityDesc(e.target.value)}
                                    className="w-full text-[10px] border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500 font-sans"
                                  />
                                  <div className="flex gap-1 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setShowCreateCommunity(false)}
                                      className="px-2 py-0.5 text-[9px] font-bold text-slate-400 hover:text-slate-600 bg-slate-50 rounded"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCreateCommunity}
                                      className="px-2.5 py-0.5 text-[9px] font-bold text-white bg-sky-600 hover:bg-sky-700 rounded shadow-sm"
                                    >
                                      Create
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowCreateCommunity(true);
                                    playAudioFeedback(450, 0.05, 'sine');
                                  }}
                                  className="w-full text-[10px] font-bold py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center justify-center gap-1 transition-colors shadow-md shadow-sky-100"
                                >
                                  <span>➕ Create Community</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* RIGHT SIDE: CHAT FEED WINDOW */
                          <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50 w-full">
                            {/* Chat Window Header */}
                            <div className="px-4 py-2.5 bg-white border-b border-slate-200/80 flex flex-col justify-center shrink-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center min-w-0">
                                  {/* Back to Channels button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setShowChatWindow(false);
                                      playAudioFeedback(300, 0.05, 'sine');
                                    }}
                                    className="mr-2 p-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-500 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <h4 className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1.5 truncate">
                                    {activeComm.name}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  {activeComm.type === 'custom' && activeComm.createdBy === fbUser?.uid && (
                                    <button
                                      type="button"
                                      title="Delete Community"
                                      onClick={async () => {
                                        await handleDeleteCommunity(activeComm.id, activeComm.name);
                                      }}
                                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg border border-slate-150 hover:bg-rose-50 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {!isActiveCommJoined && activeComm.type === 'custom' && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setJoinedCommunityIds(prev => [...prev, activeComm.id]);
                                        onShowToast(`Joined "${activeComm.name}"!`);
                                        playAudioFeedback(600, 0.08, 'sine');
                                      }}
                                      className="text-[9px] font-bold text-white bg-sky-600 hover:bg-sky-700 px-2.5 py-1 rounded-full transition-colors"
                                    >
                                      Join
                                    </button>
                                  )}
                                </div>
                              </div>
                              <p className="text-[9.5px] text-slate-400 mt-0.5 truncate leading-normal">
                                {activeComm.description}
                              </p>
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-0">
                              {/* Encryption/Sync banner */}
                              <div className="text-center py-1.5 text-[9px] text-slate-400 font-mono tracking-wide border-b border-slate-100 mb-2 flex items-center justify-center gap-1">
                                <span>🔒</span>
                                <span>Real-time citizen ledger synced securely via CleanAir SOMA node</span>
                              </div>

                              {activeCommunityMessages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col max-w-[85%] ${
                                    msg.isUser ? 'ml-auto items-end' : 'mr-auto items-start'
                                  }`}
                                >
                                  {/* Sender Info label */}
                                  {!msg.isUser && (
                                    <span className="text-[9px] font-mono text-slate-400 font-semibold mb-0.5 ml-1 flex items-center gap-1">
                                      <span>{msg.avatar}</span>
                                      <span>{msg.senderName}</span>
                                      {msg.city && <span className="opacity-60">({msg.city})</span>}
                                    </span>
                                  )}

                                  {/* Text Message Bubble */}
                                  <div
                                    className={`rounded-2xl px-3 py-2 text-xs shadow-sm ${
                                      msg.isUser
                                        ? 'bg-sky-600 text-white rounded-tr-none'
                                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60'
                                    }`}
                                  >
                                    {/* Render attachments if they exist */}
                                    {msg.imageUrl && (
                                      <div className="rounded-lg overflow-hidden mb-2 border border-black/10 max-w-[190px] aspect-video">
                                        <img
                                          src={msg.imageUrl}
                                          alt="Evidence"
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      </div>
                                    )}

                                    <p className="leading-relaxed leading-tight text-[11px] break-words">
                                      {msg.text}
                                    </p>

                                    <div className="flex items-center justify-end gap-1 mt-1 text-[8px] opacity-75">
                                      <span>{msg.timestamp}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              
                              <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input Bar */}
                            <div className="p-2 border-t border-slate-200 bg-white shrink-0">
                              {activeComm.type === 'municipal' ? (
                                <div className="py-2.5 px-3 bg-amber-50/70 border border-amber-200/50 rounded-xl text-center text-[10px] font-medium text-amber-800 leading-tight flex items-center justify-center gap-1.5">
                                  <span>🏛️</span>
                                  <span>Official Announcement Channel: Citizens cannot publish messages to this feed.</span>
                                </div>
                              ) : !isActiveCommJoined ? (
                                <div className="py-2 px-3 bg-sky-50 border border-sky-200/50 rounded-xl text-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setJoinedCommunityIds(prev => [...prev, activeComm.id]);
                                      onShowToast(`Joined "${activeComm.name}"!`);
                                      playAudioFeedback(600, 0.08, 'sine');
                                    }}
                                    className="text-[10px] font-bold text-sky-700 hover:underline"
                                  >
                                    👉 Click here to join this community and participate in discussions
                                  </button>
                                </div>
                              ) : (
                                <form
                                  onSubmit={handleSendTextMessage}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder={`Post inside ${activeComm.name}...`}
                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-sans"
                                  />
                                  <button
                                    type="submit"
                                    className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors shrink-0 cursor-pointer active:scale-95"
                                  >
                                    <Send className="w-3.5 h-3.5 text-white" />
                                  </button>
                                </form>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}

                  {/* TAB 4: REAL MAP (Live AQI GIS Interactive Map) */}
                  {activeTab === 'map' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col h-full overflow-hidden"
                    >
                      <AqiMap
                        selectedCityName={selectedCityName}
                        selectedState={selectedState}
                        selectedCityCoords={selectedCityCoords}
                        liveAqi={liveAqi}
                        userReports={messages.filter(m => m.category)}
                        onShowToast={onShowToast}
                        lang={lang}
                      />
                    </motion.div>
                  )}

                  {/* TAB 5: CITIZEN IMPACT SCORE BOARD (Gamified rewards & badges) */}
                  {activeTab === 'impact' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 space-y-4 flex-1 overflow-y-auto"
                    >
                      {/* Section Title */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">Citizen Impact Dashboard</h4>
                          <p className="text-[10px] text-slate-400">Gamified tracking & reporting badges</p>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full border border-amber-100 font-bold flex items-center gap-0.5">
                          <Trophy className="w-3 h-3 text-amber-500" />
                          SOMA Level
                        </span>
                      </div>

                      {/* Scoreboard Metrics Header */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-sky-600 to-sky-700 text-white p-3.5 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between h-[90px]">
                          <div className="absolute top-2 right-2 opacity-15">
                            <Zap className="w-10 h-10 text-white" />
                          </div>
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-sky-100">Impact Points</span>
                          <div>
                            <span className="text-2xl font-mono font-black tracking-tight">{userPoints}</span>
                            <span className="text-[10px] font-mono text-sky-200 ml-1">PTS</span>
                          </div>
                          <span className="text-[8px] text-sky-100/80 font-sans">Rank #${userPoints > 300 ? '2' : userPoints > 200 ? '3' : '4'} in {profile.city}</span>
                        </div>

                        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-[90px]">
                          <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400">Current Badge</span>
                          <div>
                            <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                              {userReportsCount >= 12 ? '🛡️ Eco Guardian' :
                               userReportsCount >= 8 ? '🏆 Decarbon Champion' :
                               userReportsCount >= 5 ? '🔬 Aerosol Analyst' :
                               userReportsCount >= 3 ? '🕵️‍♂️ Smog Spotter' :
                               userReportsCount >= 1 ? '🥈 Clean Air Recruit' : '🥚 Rookie'}
                            </span>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                              <div 
                                className="bg-sky-500 h-full transition-all duration-500" 
                                style={{ 
                                  width: `${Math.min(100, (userReportsCount / 12) * 100)}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                          <span className="text-[8px] text-slate-400 font-sans font-medium">{userReportsCount} confirmed reports</span>
                        </div>
                      </div>

                      {/* Daily Check-in & Instant Boost */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                            📅 Daily Clean Air Check-In
                          </span>
                          <span className="text-[8px] font-mono text-emerald-500 font-bold bg-emerald-50 px-1.5 py-0.2 border border-emerald-100 rounded">
                            +20 PTS
                          </span>
                        </div>
                        {hasCheckedInToday ? (
                          <div className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1 border border-emerald-100">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span>DAILY ATTENDANCE LOGGED TODAY</span>
                          </div>
                        ) : (
                          <button
                            onClick={handleClaimCheckIn}
                            className="w-full py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/60 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
                            <span>CLAIM DAILY CHECK-IN (+20 PTS)</span>
                          </button>
                        )}
                      </div>

                      {/* Badges Progress Gallery */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5 text-left">
                        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5 justify-between">
                          <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-sky-500" /> Locked & Unlocked Badges
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 font-medium">Goal: 12 reports</span>
                        </div>

                        <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                          {[
                            { name: '🥈 Clean Air Recruit', req: 1, desc: 'Submit your first verified local AQI hazard report.' },
                            { name: '🕵️‍♂️ Smog Spotter', req: 3, desc: 'Spot and report 3 pollution incidents near you.' },
                            { name: '🔬 Aerosol Analyst', req: 5, desc: 'Flag 5 distinct ambient aerosol anomalies.' },
                            { name: '🏆 Decarbon Champion', req: 8, desc: 'Perform 8 decentralized hazard broadcasts.' },
                            { name: '🛡️ Eco Guardian', req: 12, desc: 'Maintain supreme local grid compliance.' }
                          ].map((badge) => {
                            const isUnlocked = userReportsCount >= badge.req;
                            return (
                              <div 
                                key={badge.name} 
                                className={`flex items-center justify-between p-2 rounded-xl border transition-all text-left ${
                                  isUnlocked 
                                    ? 'bg-sky-50/40 border-sky-100 shadow-sm' 
                                    : 'bg-slate-50/50 border-slate-200 opacity-60'
                                }`}
                              >
                                <div className="space-y-0.5 max-w-[75%]">
                                  <strong className={`text-[10px] block ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                                    {badge.name}
                                  </strong>
                                  <span className="text-[8px] text-slate-400 leading-tight block">{badge.desc}</span>
                                </div>
                                <div className="text-right">
                                  {isUnlocked ? (
                                    <span className="text-[8px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 font-mono">
                                      UNLOCKED
                                    </span>
                                  ) : (
                                    <span className="text-[8.5px] font-bold text-slate-400 font-mono">
                                      {userReportsCount}/{badge.req} REP
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Peer Review Verification Section */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                            📡 Local Peer Reviews (SOMA)
                          </span>
                          <span className="text-[8px] font-mono text-slate-400">Review nearby reports</span>
                        </div>
                        <div className="space-y-2">
                          {peerReportsToVerify.map((report) => (
                            <div key={report.id} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-[10px] space-y-1.5 text-left">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-700">{report.reporter} ({report.distance})</span>
                                <span className="text-[8.5px] bg-slate-200 text-slate-600 px-1 py-0.2 rounded font-mono font-bold uppercase">{report.category}</span>
                              </div>
                              <p className="text-slate-500 leading-tight italic">"{report.description}"</p>
                              <div className="flex justify-between items-center pt-1 border-t border-slate-200/40">
                                <span className="text-[8px] text-slate-400 font-mono font-semibold">Earn +30 PTS</span>
                                {report.verified ? (
                                  <span className="text-[8px] font-bold text-emerald-600 flex items-center gap-0.5">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" /> VERIFIED
                                  </span>
                                ) : (
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleVerifyReport(report.id, report.userId)}
                                      className="px-2 py-1 bg-sky-600 text-white rounded-lg font-bold text-[8.5px] hover:bg-sky-700 cursor-pointer active:scale-95 shadow-sm uppercase tracking-wide flex items-center gap-1"
                                    >
                                      <ThumbsUp className="w-2.5 h-2.5 text-white" /> Approve
                                    </button>
                                    <button
                                      onClick={() => handleFlagReportAsSpam(report.id, report.userId)}
                                      className="px-2 py-1 bg-rose-600 text-white rounded-lg font-bold text-[8.5px] hover:bg-rose-700 cursor-pointer active:scale-95 shadow-sm uppercase tracking-wide flex items-center gap-1"
                                    >
                                      <Flag className="w-2.5 h-2.5 text-white" /> Flag
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Indian SOMA Node Leaderboard */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-wide">
                            🇮🇳 SOMA Leaderboard
                          </span>
                          <span className="text-[8px] font-mono text-slate-400 font-medium">Rankings</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { rank: 1, name: 'Kiran Joshi', badge: '🛡️ Eco Guardian', points: 750, isSelf: false },
                            { rank: 2, name: 'Devendra Gupta', badge: '🏆 Decarbon Champion', points: 550, isSelf: false },
                            { rank: 3, name: 'Sneha Patel', badge: '🔬 Aerosol Analyst', points: 350, isSelf: false },
                            { rank: 4, name: `${profile.name} (You)`, badge: userReportsCount >= 3 ? '🕵️‍♂️ Smog Spotter' : '🥈 Clean Air Recruit', points: userPoints, isSelf: true },
                            { rank: 5, name: 'Rajesh Khanna', badge: '🥈 Clean Air Recruit', points: 100, isSelf: false }
                          ]
                            .sort((a, b) => b.points - a.points)
                            .map((leader, idx) => (
                              <div 
                                key={idx} 
                                className={`flex items-center justify-between p-1.5 px-2 rounded-lg text-[9.5px] ${
                                  leader.isSelf 
                                    ? 'bg-sky-50 border border-sky-100 font-bold' 
                                    : 'hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 max-w-[70%]">
                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center font-mono text-[8.5px] font-black ${
                                    idx === 0 ? 'bg-amber-100 text-amber-700' :
                                    idx === 1 ? 'bg-slate-200 text-slate-700' :
                                    idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-400'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  <div className="truncate leading-tight">
                                    <span className="text-slate-800 font-semibold block truncate">{leader.name}</span>
                                    <span className="text-[7px] text-slate-400 block font-sans truncate">{leader.badge}</span>
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-slate-700">{leader.points} PTS</span>
                              </div>
                            ))}
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* TAB 6: SETTINGS (Language, Controls, FAQs, Help, App info) */}
                  {activeTab === 'settings' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 space-y-4 flex-1 overflow-y-auto"
                    >
                      {/* Section Title */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-between text-left">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">
                            {TRANSLATIONS[lang].settingsTitle}
                          </h4>
                          <p className="text-[9.5px] text-slate-400">
                            {TRANSLATIONS[lang].settingsSubtitle}
                          </p>
                        </div>
                        <Settings className="w-5 h-5 text-sky-500 animate-spin-slow shrink-0" />
                      </div>

                      {/* SECURE GOOGLE PROFILE SETTINGS */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 text-left">
                        <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide block border-b border-slate-100 pb-1.5">
                          🔒 {getString("Secure Google Profile", lang)}
                        </span>

                        <div className="flex items-start gap-4">
                          {/* Profile Image Frame with Google Sign-in indication */}
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center border-2 border-slate-100 shadow-md shrink-0 overflow-hidden">
                            {profile.photoURL ? (
                              <img
                                src={profile.photoURL}
                                alt={profile.name || "User Photo"}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl select-none leading-none">{profile.avatar || '🧑🏽‍💼'}</span>
                            )}
                            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border border-white flex items-center justify-center">
                              <ShieldCheck className="w-2.5 h-2.5 text-white" />
                            </div>
                          </div>

                          <div className="space-y-1 overflow-hidden flex-1">
                            <h5 className="text-xs font-black text-slate-800 truncate flex items-center gap-1">
                              {profile.name || "Google Citizen"}
                              <span className="inline-block bg-sky-100 text-sky-700 text-[7px] font-bold px-1.5 py-0.25 rounded-full scale-90">
                                Verified
                              </span>
                            </h5>
                            <span className="text-[8.5px] font-mono font-bold text-slate-500 block truncate">
                              ID: {profile.uid || "N/A"}
                            </span>
                            <span className="text-[8px] font-mono font-bold text-sky-600 block bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 w-fit">
                              {getString("Connected via Google Auth", lang)}
                            </span>
                            <span className="text-[8px] font-mono text-slate-400 block">{profile.city}, {profile.state}</span>
                          </div>
                        </div>

                        {/* Profile Refresh Button */}
                        <div className="flex gap-2 font-sans pt-1">
                          <button
                            type="button"
                            onClick={handleRefreshProfile}
                            className="flex-1 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-bold text-[9px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-sky-100"
                          >
                            <RefreshCw className="w-3 h-3 text-sky-600" />
                            <span>{getString("Refresh Profile Details", lang)}</span>
                          </button>
                        </div>

                        {/* Name Editor Field / Nickname Editor */}
                        <div className="space-y-1.5 font-sans pt-1">
                          <label className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center justify-between">
                            <span>✏️ {getString("Edit Nickname", lang)}</span>
                            {saveStatus === 'saving' && <span className="text-amber-500 font-bold lowercase animate-pulse">saving...</span>}
                            {saveStatus === 'saved' && <span className="text-emerald-500 font-bold lowercase">autosaved!</span>}
                            {saveStatus === 'error' && <span className="text-rose-500 font-bold lowercase">save error</span>}
                          </label>
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => {
                              setEditingName(e.target.value);
                            }}
                            onBlur={async () => {
                              if (editingName.trim() && editingName.trim() !== profile.name) {
                                setSaveStatus('saving');
                                const updated = { ...profile, name: editingName.trim() };
                                setProfile(updated);
                                localStorage.setItem('cleanair_india_profile', JSON.stringify(updated));
                                if (fbUser) {
                                  try {
                                    await updateDoc(doc(db, 'users', fbUser.uid), { name: editingName.trim() });
                                    setSaveStatus('saved');
                                    setTimeout(() => setSaveStatus('idle'), 2500);
                                  } catch (err) {
                                    setSaveStatus('error');
                                    setTimeout(() => setSaveStatus('idle'), 2500);
                                  }
                                } else {
                                  setSaveStatus('saved');
                                  setTimeout(() => setSaveStatus('idle'), 2500);
                                }
                              }
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === 'Enter') {
                                e.currentTarget.blur();
                              }
                            }}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 font-sans shadow-inner"
                            placeholder="Enter citizen name"
                          />
                        </div>

                        {/* State/Region Selection Dropdown in Settings */}
                        <div className="space-y-1.5 font-sans">
                          <label className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wide block">
                            📍 {getString("State/Region", lang)}
                          </label>
                          <select
                            value={selectedState}
                            onChange={async (e) => {
                              const newState = e.target.value;
                              setSelectedState(newState);
                              const stateObj = INDIAN_STATES_CITIES.find((s) => s.stateName === newState);
                              const newCity = stateObj && stateObj.cities.length > 0 ? stateObj.cities[0].name : 'New Delhi';
                              setSelectedCityName(newCity);
                              
                              const updated = { ...profile, state: newState, city: newCity };
                              setProfile(updated);
                              localStorage.setItem('cleanair_india_profile', JSON.stringify(updated));
                              
                              if (fbUser) {
                                try {
                                  await updateDoc(doc(db, 'users', fbUser.uid), { state: newState, city: newCity });
                                  onShowToast("📍 Region updated and autosaved!");
                                  playAudioFeedback(600, 0.08, 'sine');
                                } catch (err) {
                                  console.error("Autosave state failed:", err);
                                }
                              }
                            }}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 font-sans cursor-pointer"
                          >
                            {INDIAN_STATES_CITIES.map((state) => (
                              <option key={state.stateName} value={state.stateName}>
                                {state.stateName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City Selection Dropdown in Settings */}
                        <div className="space-y-1.5 font-sans">
                          <label className="text-[8.5px] font-bold font-mono text-slate-400 uppercase tracking-wide block">
                            🌆 {getString("City", lang)}
                          </label>
                          <select
                            value={selectedCityName}
                            onChange={async (e) => {
                              const newCity = e.target.value;
                              setSelectedCityName(newCity);
                              
                              const updated = { ...profile, city: newCity };
                              setProfile(updated);
                              localStorage.setItem('cleanair_india_profile', JSON.stringify(updated));
                              
                              if (fbUser) {
                                try {
                                  await updateDoc(doc(db, 'users', fbUser.uid), { city: newCity });
                                  onShowToast("🌆 City updated and autosaved!");
                                  playAudioFeedback(600, 0.08, 'sine');
                                } catch (err) {
                                  console.error("Autosave city failed:", err);
                                }
                              }
                            }}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 font-sans cursor-pointer"
                          >
                            {currentCities.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Log Out Option right inside user profile */}
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              playAudioFeedback(440, 0.12, 'sine');
                              handleLogout();
                            }}
                            className="w-full py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200/40"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{TRANSLATIONS[lang].logoutBtn || "Log Out"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Language Selection Card */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2 text-left">
                        <label htmlFor="settings-lang-select" className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide block">
                          🌐 {TRANSLATIONS[lang].selectLang}
                        </label>
                        <div className="relative">
                          <select
                            id="settings-lang-select"
                            value={lang}
                            onChange={(e) => {
                              setLang(e.target.value as LanguageCode);
                              playAudioFeedback(523, 0.08, 'sine');
                            }}
                            className="w-full text-xs bg-slate-100 border border-slate-200/60 rounded-xl px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold text-slate-700 shadow-sm cursor-pointer appearance-none pr-8"
                          >
                            {LANGUAGES.map((l) => (
                              <option key={l.code} value={l.code}>
                                {l.flag} &nbsp; {l.native} ({l.label})
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Controls Toggles Card */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 text-left">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1.5 justify-between">
                          <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            ⚙️ App Customization
                          </span>
                        </div>

                        <div className="space-y-3.5">
                          {/* Toggle 1: Push pollution alerts */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5 max-w-[80%]">
                              <span className="text-[10px] font-bold text-slate-800 block">
                                {TRANSLATIONS[lang].notificationsLabel}
                              </span>
                              <span className="text-[8px] text-slate-400 leading-tight block">
                                {TRANSLATIONS[lang].notificationsDesc}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                const newVal = !notificationsEnabled;
                                setNotificationsEnabled(newVal);
                                localStorage.setItem('cleanair_notifications', String(newVal));
                                playAudioFeedback(newVal ? 600 : 350, 0.08, 'sine');
                                if (fbUser) {
                                  try {
                                    await updateDoc(doc(db, 'users', fbUser.uid), { notificationsEnabled: newVal });
                                  } catch (e) {
                                    console.warn("Failed to sync notifications setting:", e);
                                  }
                                }
                              }}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer relative shrink-0 ${
                                notificationsEnabled ? 'bg-sky-600' : 'bg-slate-200'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 transition-transform duration-200 ${
                                  notificationsEnabled ? 'transform translate-x-4' : 'transform translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Toggle 2: Acoustic feedback */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5 max-w-[80%]">
                              <span className="text-[10px] font-bold text-slate-800 block">
                                {TRANSLATIONS[lang].soundFeedbackLabel}
                              </span>
                              <span className="text-[8px] text-slate-400 leading-tight block">
                                {TRANSLATIONS[lang].soundFeedbackDesc}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                const newVal = !soundEnabled;
                                setSoundEnabled(newVal);
                                localStorage.setItem('cleanair_sound', String(newVal));
                                if (newVal) {
                                  playAudioFeedback(600, 0.08, 'sine');
                                }
                                if (fbUser) {
                                  try {
                                    await updateDoc(doc(db, 'users', fbUser.uid), { soundEnabled: newVal });
                                  } catch (e) {
                                    console.warn("Failed to sync sound setting:", e);
                                  }
                                }
                              }}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer relative shrink-0 ${
                                soundEnabled ? 'bg-sky-600' : 'bg-slate-200'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 transition-transform duration-200 ${
                                  soundEnabled ? 'transform translate-x-4' : 'transform translate-x-0'
                                }`}
                              />
                            </button>
                          </div>

                          {/* Toggle 3: Period auto-refresh */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5 max-w-[80%]">
                              <span className="text-[10px] font-bold text-slate-800 block">
                                {TRANSLATIONS[lang].autoRefreshLabel}
                              </span>
                              <span className="text-[8px] text-slate-400 leading-tight block">
                                {TRANSLATIONS[lang].autoRefreshDesc}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={async () => {
                                const newVal = !autoRefreshEnabled;
                                setAutoRefreshEnabled(newVal);
                                localStorage.setItem('cleanair_refresh', String(newVal));
                                playAudioFeedback(newVal ? 600 : 350, 0.08, 'sine');
                                if (fbUser) {
                                  try {
                                    await updateDoc(doc(db, 'users', fbUser.uid), { autoRefreshEnabled: newVal });
                                  } catch (e) {
                                    console.warn("Failed to sync autoRefresh setting:", e);
                                  }
                                }
                              }}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none cursor-pointer relative shrink-0 ${
                                autoRefreshEnabled ? 'bg-sky-600' : 'bg-slate-200'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-0.5 left-0.5 transition-transform duration-200 ${
                                  autoRefreshEnabled ? 'transform translate-x-4' : 'transform translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* YOUR BROADCAST HISTORY */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-3 text-left">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                          <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            📡 {getString("Your Broadcast History", lang)}
                          </span>
                          <span className="text-[8px] font-mono bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded-full border border-sky-100 font-bold">
                            {myReports.length} {myReports.length === 1 ? 'Report' : 'Reports'}
                          </span>
                        </div>
                        <p className="text-[8.5px] text-slate-400 leading-relaxed font-sans">
                          {getString("Manage and view your submitted real-time air hazard reports.", lang)}
                        </p>

                        <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                          {myReports.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 text-[10px] font-medium italic">
                              {getString("No reports found.", lang)}
                            </div>
                          ) : (
                            myReports.map((rep) => (
                              <div key={rep.id} className="p-2 bg-slate-50 border border-slate-100 rounded-xl relative space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReport(rep.id)}
                                  className="absolute top-1.5 right-1.5 p-1 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200/60 hover:border-rose-100 text-slate-400 rounded-lg transition-colors cursor-pointer"
                                  title={getString("Delete Report", lang)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[8px] font-mono bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.25 rounded-md font-bold">
                                    {getString(rep.category, lang) || rep.category}
                                  </span>
                                  {rep.verified && (
                                    <span className="text-[7.5px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.25 rounded-md font-bold">
                                      VERIFIED
                                    </span>
                                  )}
                                </div>

                                <p className="text-[9.5px] text-slate-600 font-medium leading-tight line-clamp-2 pr-6">
                                  {rep.description}
                                </p>

                                <span className="text-[7.5px] font-mono text-slate-400 block">
                                  {rep.createdAt ? new Date(rep.createdAt).toLocaleString() : 'Just now'}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Emergency Help & Hotlines Card */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            🚨 {TRANSLATIONS[lang].emergencyHelpTitle}
                          </span>
                        </div>
                        <p className="text-[8.5px] text-slate-400 leading-relaxed font-sans">
                          {TRANSLATIONS[lang].emergencyHelpDesc}
                        </p>

                        <div className="space-y-2 pt-1">
                          {/* Call CPCB */}
                          <button
                            type="button"
                            onClick={() => {
                              playAudioFeedback(440, 0.1, 'sine');
                              window.location.href = "tel:1800114545";
                              onShowToast("Initiating dial to CPCB Toll Free: 1800-11-4545");
                            }}
                            className="w-full p-2.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 flex items-center justify-between text-[10px] font-bold hover:bg-rose-100/60 transition-colors cursor-pointer"
                          >
                            <span className="truncate">{TRANSLATIONS[lang].callCentralBoard}</span>
                            <span className="text-[9px] font-mono text-rose-600 bg-white/80 px-1.5 py-0.5 rounded border border-rose-100 shrink-0 ml-1">
                              {TRANSLATIONS[lang].cpcbPhone}
                            </span>
                          </button>

                          {/* Call Regional */}
                          <button
                            type="button"
                            onClick={() => {
                              playAudioFeedback(440, 0.1, 'sine');
                              window.location.href = "tel:01124695456";
                              onShowToast("Initiating dial to Regional Air Safety Office");
                            }}
                            className="w-full p-2.5 rounded-xl border border-amber-100 bg-amber-50 text-amber-800 flex items-center justify-between text-[10px] font-bold hover:bg-amber-100/60 transition-colors cursor-pointer"
                          >
                            <span>{TRANSLATIONS[lang].callRegionalOff}</span>
                            <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0 ml-1" />
                          </button>

                          {/* Email Support */}
                          <button
                            type="button"
                            onClick={() => {
                              playAudioFeedback(440, 0.1, 'sine');
                              window.location.href = "mailto:nexus-support@cleanair.gov.in";
                              onShowToast("Opening mail composer to support");
                            }}
                            className="w-full p-2.5 rounded-xl border border-sky-100 bg-sky-50 text-sky-800 flex items-center justify-between text-[10px] font-bold hover:bg-sky-100/60 transition-colors cursor-pointer"
                          >
                            <span>{TRANSLATIONS[lang].emailSupport}</span>
                            <Send className="w-3.5 h-3.5 text-sky-600 shrink-0 ml-1" />
                          </button>
                        </div>
                      </div>

                      {/* Accordion FAQ Card */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            ℹ️ {TRANSLATIONS[lang].faqTitle}
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                          {getFaqs().map((faq, idx) => {
                            const isExpanded = expandedFaqIndex === idx;
                            return (
                              <div
                                key={idx}
                                className="border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedFaqIndex(isExpanded ? null : idx);
                                    playAudioFeedback(440, 0.08, 'sine');
                                  }}
                                  className="w-full p-2.5 flex items-center justify-between text-[10px] font-bold text-slate-700 hover:bg-slate-100/30 text-left cursor-pointer transition-colors"
                                >
                                  <span className="pr-3 leading-tight">{faq.q}</span>
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200 ${
                                      isExpanded ? 'rotate-180 text-sky-600' : ''
                                    }`}
                                  />
                                </button>
                                <AnimatePresence initial={false}>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="border-t border-slate-100 bg-white"
                                    >
                                      <p className="p-2.5 text-[9px] text-slate-500 leading-relaxed font-sans">
                                        {faq.a}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* App Architecture details */}
                      <div className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm space-y-2 text-left">
                        <div className="flex items-center gap-1 border-b border-slate-100 pb-1 justify-between">
                          <span className="text-[9.5px] font-bold font-mono text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            🛡️ {TRANSLATIONS[lang].appDetails}
                          </span>
                          <span className="text-[8.5px] font-mono text-emerald-500 bg-emerald-50 px-1 border border-emerald-100 rounded">
                            v1.2.0-secure
                          </span>
                        </div>
                        <p className="text-[8.5px] text-slate-500 leading-relaxed font-sans">
                          {TRANSLATIONS[lang].appDetailsDesc}
                        </p>
                      </div>

                      {/* Danger Zone: Reset Data */}
                      <div className="bg-red-50/50 p-3 rounded-2xl border border-red-200/60 shadow-sm space-y-2 text-left">
                        <span className="text-[9.5px] font-bold font-mono text-red-500 uppercase tracking-wide block">
                          ⚠️ {getString("Danger Zone", lang)}
                        </span>
                        <p className="text-[8.5px] text-red-400 leading-relaxed font-sans">
                          {getString("Reset Storage Warning", lang)}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            localStorage.clear();
                            onShowToast(lang === 'en' ? "⚠️ App storage wiped completely!" : "⚠️ ऐप स्टोरेज पूरी तरह से साफ कर दिया गया!");
                            setTimeout(() => {
                              window.location.reload();
                            }, 500);
                          }}
                          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md shadow-red-100"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                          <span>{TRANSLATIONS[lang].resetDataBtn}</span>
                        </button>
                      </div>

                    </motion.div>
                  )}

                </div>

                {/* BOTTOM NAVIGATION TABS (WhatsApp / Android APK Layout) */}
                <div className="h-14 bg-white border-t border-slate-200 flex justify-around items-center shrink-0 z-10 px-1">
                  {/* Tab 1: Radar */}
                  <button
                    onClick={() => setActiveTab('radar')}
                    className={`flex flex-col items-center gap-1 text-[8px] font-sans font-bold transition-colors cursor-pointer ${
                      activeTab === 'radar' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Compass className={`w-4.5 h-4.5 ${activeTab === 'radar' ? 'animate-spin-slow text-sky-600' : 'text-slate-400'}`} />
                    <span>{TRANSLATIONS[lang].radarTab}</span>
                  </button>
 
                  {/* Tab 2: Live Map */}
                  <button
                    onClick={() => setActiveTab('map')}
                    className={`flex flex-col items-center gap-1 text-[8px] font-sans font-bold transition-colors cursor-pointer ${
                      activeTab === 'map' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Map className={`w-4.5 h-4.5 ${activeTab === 'map' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{TRANSLATIONS[lang].mapTab}</span>
                  </button>
 
                  {/* Tab 3: Report Hazard (Floating circular middle action) */}
                  <button
                    onClick={() => setActiveTab('report')}
                    className="flex flex-col items-center gap-1 text-[8px] font-sans font-bold transition-all relative shrink-0"
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center -mt-4 shadow-md transition-all active:scale-90 ${
                      activeTab === 'report'
                        ? 'bg-sky-600 border-2 border-white text-white shadow-sky-300 shadow-lg animate-pulse'
                        : 'bg-white border border-slate-200 text-slate-500 shadow-sm hover:border-sky-300 hover:text-sky-600'
                    }`}>
                      <Camera className="w-4.5 h-4.5" />
                    </div>
                    <span className={activeTab === 'report' ? 'text-sky-600 font-extrabold' : 'text-slate-400'}>{TRANSLATIONS[lang].reportTab}</span>
                  </button>
 
                  {/* Tab 4: Community */}
                  <button
                    onClick={() => setActiveTab('community')}
                    className={`flex flex-col items-center gap-1 text-[8px] font-sans font-bold transition-colors cursor-pointer ${
                      activeTab === 'community' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <div className="relative">
                      <MessageSquare className={`w-4.5 h-4.5 ${activeTab === 'community' ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="absolute -top-1.5 -right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span>
                    </div>
                    <span>{TRANSLATIONS[lang].communityTab}</span>
                  </button>
 
                  {/* Tab 5: Citizen Impact Board */}
                  <button
                    onClick={() => setActiveTab('impact')}
                    className={`flex flex-col items-center gap-1 text-[8px] font-sans font-bold transition-colors cursor-pointer ${
                      activeTab === 'impact' ? 'text-sky-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Trophy className={`w-4.5 h-4.5 ${activeTab === 'impact' ? 'text-sky-600' : 'text-slate-400'}`} />
                    <span>{TRANSLATIONS[lang].impactTab}</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Home Button Pill Bottom bezel indicator */}
        <div className="h-1.5 bg-zinc-700 w-32 mx-auto rounded-full mt-2.5 mb-1 shrink-0"></div>

      </div>

    </div>
  );
}
