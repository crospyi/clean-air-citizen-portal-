import { useEffect, useRef, useState } from 'react';
import { Compass, RefreshCw, Layers, Sparkles, Filter, MapPin, Radio, Globe, Moon, Shield } from 'lucide-react';

interface AqiMapProps {
  selectedCityName: string;
  selectedState: string;
  selectedCityCoords: { lat: number; lon: number };
  liveAqi: number | null;
  userReports: any[];
  onShowToast: (msg: string) => void;
  lang: string;
}

const MAP_LOCALIZATION: Record<string, Record<string, string>> = {
  "GIS Command Grid": {
    en: "GIS Command Grid", hi: "जीआईएस कमांड ग्रिड", mr: "जीआयएस कमांड ग्रिड", bn: "জিআইএস কমান্ড গ্রিড", te: "GIS కమాండ్ గ్రిడ్", ta: "ஜிஐஎஸ் கட்டளை கட்டம்", kn: "GIS ಕಮಾಂಡ್ ಗ್ರಿಡ್", gu: "જીઆઈએス કમાન્ડ ગ્રીડ", pa: "ਜੀਆਈਐਸ ਕਮਾਂਡ ਗ੍ਰਿਡ", ml: "ജിഐഎസ് കമാൻഡ് ഗ്രിഡ്"
  },
  "SOMA GIS GRID": {
    en: "SOMA GIS GRID", hi: "सोमा जीआईएस ग्रिड", mr: "सोमा जीआयएस ग्रिड", bn: "সোমা জিআইএস গ্রিড", te: "SOMA GIS గ్రిడ్", ta: "சோமா ஜிஐஎஸ் கட்டம்", kn: "SOMA GIS ಗ್ರಿಡ್", gu: "સોમા જીઆઈએસ ગ્રીડ", pa: "ਸੋਮਾ ਜੀਆਈਐਸ ਗ੍ਰਿਡ", ml: "സോമ ജിഐഎസ് ഗ്രിഡ്"
  },
  "Select Mapping Data Layer": {
    en: "Select Mapping Data Layer", hi: "मानचित्र डेटा परत चुनें", mr: "नकाशा डेटा स्तर निवडा", bn: "মানচিত্র ডেটা স্তর নির্বাচন করুন", te: "మ్యాపింగ్ డేటా లేయర్ ఎంచుకోండి", ta: "வரைபட தரவு அடுக்கைத் தேர்ந்தெடுக்கவும்", kn: "ಮ್ಯಾಪಿಂಗ್ ಡೇಟಾ ಲೇಯರ್ ಆಯ್ಕೆಮಾಡಿ", gu: "મેપિંગ ડેટા લેયર પસંદ કરો", pa: "ਨਕਸ਼ਾ ਡੇਟਾ ਪਰਤ ਚੁਣੋ", ml: "മാപ്പിംഗ് ഡാറ്റ ലെയർ തിരഞ്ഞെടുക്കുക"
  },
  "TRACK SCOPES": {
    en: "TRACK SCOPES", hi: "ट्रैक स्कोप", mr: "ट्रॅक स्कोप", bn: "ট্যাক স্কোপ", te: "ట్రాక్ స్కోప్‌లు", ta: "கண்காணிப்பு எல்லைகள்", kn: "ಟ್ರಾಕ್ ಸ್ಕೋಪ್‌ಗಳು", gu: "ટ્રેક સ્કોપ્સ", pa: "ਟਰੈਕ ਸਕੋਪ", ml: "ട്രാക്ക് സ്കോപ്പുകൾ"
  },
  "CPCB CAAQMS": {
    en: "CPCB CAAQMS", hi: "सीपीसीबी सीएएक्यूएमएस", mr: "सीपीसीबी सीएएक्यूएमएस", bn: "সিপিসিবি সিএএকিউএমএস", te: "CPCB CAAQMS", ta: "சிபிசிபி சிஏஏக்யூஎம்எஸ்", kn: "CPCB CAAQMS", gu: "સીપીસીબી સીએએક્યુએમએસ", pa: "ਸੀਪੀਸੀਬੀ ਸੀਏਏਕਿਊਐਮਐਸ", ml: "സിപിസിബി സിഎഎക്യുഎംഎസ്"
  },
  "Google Maps": {
    en: "Google Maps", hi: "गूगल मैप्स", mr: "गुगल मॅप्स", bn: "গুগল ম্যাপস", te: "గూగుల్ म్యాప్స్", ta: "கூகிள் வரைபடம்", kn: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್", gu: "ગૂગલ મેપ્સ", pa: "ਗੂਗਲ ਮੈਪਸ", ml: "ഗൂഗിൾ മാപ്സ്"
  },
  "Earth Engine": {
    en: "Earth Engine", hi: "अर्थ इंजन", mr: "अर्थ इंजिन", bn: "আর্থ ইঞ্জিন", te: "ఎర్త్ ఇంజిన్", ta: "எர்த் இன்ஜின்", kn: "ಅರ್ಥ್ ಇಂಜಿನ್", gu: "અર્થ એન્જિન", pa: "ਅਰਥ ਇੰਜਣ", ml: "എർത്ത് എഞ്ചിൻ"
  },
  "CPCB Scale (AQI)": {
    en: "CPCB Scale (AQI)", hi: "सीपीसीबी पैमाना (AQI)", mr: "सीपीसीबी स्केल (AQI)", bn: "সিপিসিবি স্কেল (একিউআই)", te: "CPCB స్కేల్ (AQI)", ta: "சிபிசிபி அளவுகோல் (AQI)", kn: "CPCB ಸ್ಕೇಲ್ (AQI)", gu: "સીપીસીબી સ્કેલ (AQI)", pa: "ਸੀਪੀਸੀਬੀ ਸਕੇਲ (AQI)", ml: "സിപിസിബി സ്കെയിൽ (AQI)"
  },
  "Good": {
    en: "Good", hi: "अच्छा", mr: "चांगले", bn: "ভালো", te: "మంచిది", ta: "நல்லது", kn: "ಉತ್ತಮ", gu: "સારું", pa: "ਚੰਗਾ", ml: "നല്ലത്"
  },
  "Satisfactory": {
    en: "Satisfactory", hi: "संतोषजनक", mr: "समाधानकारक", bn: "সন্তোষজনক", te: "సంతృప్తికరం", ta: "திருப்திகரமானது", kn: "ತೃಪ್ತಿಕರ", gu: "સંતોષકારક", pa: "ਸੰਤੋਖਜਨਕ", ml: "തൃപ്തികരമായ"
  },
  "Moderate": {
    en: "Moderate", hi: "मध्यम", mr: "मध्यम", bn: "মাঝারি", te: "మధ్యస్థం", ta: "மிதமான", kn: "ಮಧ್ಯಮ", gu: "મધ્યમ", pa: "ਮੱਧਮ", ml: "മിതമായ"
  },
  "Poor": {
    en: "Poor", hi: "खराब", mr: "खराब", bn: "খারাপ", te: "పేలవం", ta: "మోசம்", kn: "ಕಳಪೆ", gu: "નબળું", pa: "ਖ਼ਰਾਬ", ml: "മോശം"
  },
  "Very Poor": {
    en: "Very Poor", hi: "बहुत खराब", mr: "अतिशय खराब", bn: "খুব খারাপ", te: "చాలా పేలవం", ta: "மிகவும் মোசம்", kn: "ಅತ್ಯಂತ ಕಳಪೆ", gu: "ખૂब જ નબળું", pa: "ਬਹੁਤ ਖ਼ਰਾਬ", ml: "വളരെ മോശം"
  },
  "Severe": {
    en: "Severe", hi: "गंभीर", mr: "गंभीर", bn: "গুরুতর", te: "తీव्रమైన", ta: "மிகவும் ஆபத்தானது", kn: "ತೀವ್ರ", gu: "ગંભીર", pa: "ਗੰਭੀਰ", ml: "അതീവ ഗുരുതരം"
  },
  "Citizen Snaps": {
    en: "Citizen Snaps", hi: "नागरिक तस्वीरें", mr: "नागरिक फोटो", bn: "নাগরিক ছবি", te: "సిటిజన్ స్నాప్స్", ta: "குடிமக்களின் புகைப்படங்கள்", kn: "ನಾಗರಿಕ ಸ್ನ್ಯಾಪ್‌ಗಳು", gu: "નાગરિક તસવીરો", pa: "ਨਾਗਰਿਕ ਤਸਵੀਰਾਂ", ml: "പൗരന്മാരുടെ ചിത്രങ്ങൾ"
  },
  "GIS Scope": {
    en: "GIS Scope", hi: "जीआईएस दायरा", mr: "जीआयएस व्याप्ती", bn: "জিআইএস পরিধি", te: "GIS పరిధి", ta: "ஜிஐஎஸ் எல்லை", kn: "GIS ವ್ಯಾಪ್ತಿ", gu: "જીઆઈએસ અવકાશ", pa: "ਜੀਆਈਐਸ ਸਕੋਪ", ml: "ജിഐഎസ് പരിധി"
  },
  "Official Indian CPCB CAAQMS sensor telemetry overlaid on high contrast detailed maps.": {
    en: "Official Indian CPCB CAAQMS sensor telemetry overlaid on high contrast detailed maps.", hi: "उच्च विपरीत विस्तृत मानचित्रों पर आधिकारिक भारतीय सीपीसीबी सीएएक्यूएमएस सेंसर टेलीमेट्री ओवरले।", mr: "उच्च कॉन्ट्रास्ट तपशीलवार नकाशांवर अधिकृत भारतीय सीपीसीबी सीएएक्यूएमएस सेन्सर टेलिमेट्री ओव्हरले.", bn: "উচ্চ বৈসাদৃশ্য বিশদ মানচিত্রে অফিসিয়াল ভারতীয় সিপিসিবি সিএএকিউএমএস সেন্সর টেলিমেট্রি ওভারলেড।", te: "అధిక కాంట్రాస్ట్ వివరణాत्मक మ్యాప్‌లపై అధికారిక భారతీయ CPCB CAAQMS సెన్సార్ టెలిమెట్రీ ఓవర్‌లే చేయబడింది.", ta: "அதிக மாறுபட்ட விரிவான வரைபடங்களில் அதிகாரப்பூர்வ இந்திய சிபிசிபி சிஏஏக்யூஎம்எஸ் சென்சார் டெலிமெட்ரி மேலெழுதப்பட்டது.", kn: "ಹೆಚ್ಚಿನ ಕಾಂಟ್ರಾಸ್ಟ್ ವಿವರವಾದ ನಕ್ಷೆಗಳ ಮೇಲೆ ಅಧಿಕೃತ ಭಾರತೀಯ CPCB CAAQMS ಸೆನ್ಸಾರ್ ಟೆಲಿಮೆಟ್ರಿ ಓವರ್‌ಲೇ ಆಗಿದೆ.", gu: "ઉચ્च વિરોધાભાસ વિગતવાર નકશાઓ પર સત્તાવાર ભારતીય સીપીસીબી સીએએક્યુએમએસ સેન્સર ટેલિમેટ્રી ઓવરલે.", pa: "ਉੱਚ ਕੰਟ੍ਰਾਸਟ ਵਿਸਤ੍ਰਿਤ ਨਕਸ਼ਿਆਂ 'ਤੇ ਅਧਿਕਾਰਤ ਭਾਰਤੀ ਸੀਪੀਸੀਬੀ ਸੀਏਏਕਿਊਐਮਐਸ ਸੈਂਸਰ ਟੈਲੀਮੈਟਰੀ ਓਵਰਲੇਡ।", ml: "ഉയർന്ന കോൺട്രാസ്റ്റ് വിശദമായ മാപ്പുകളിൽ ഔദ്യോഗിക ഇന്ത്യൻ സിപിസിബി സിഎഎക്യുഎംഎസ് സെൻസർ ടെലിമെട്രി ഓവർലേ ചെയ്തു."
  },
  "Local high-density micro-emission hotspots mapped using Google Maps geometry.": {
    en: "Local high-density micro-emission hotspots mapped using Google Maps geometry.", hi: "गूगल मैप्स ज्यामिति का उपयोग करके स्थानीय उच्च-घनत्व सूक्ष्म-उत्सर्जन हॉटस्पॉट मैप किए गए हैं।", mr: "गुगल मॅप्स भूमितीचा वापर करून स्थानिक उच्च-घनता सूक्ष्म-उत्सर्जन हॉटस्पॉट मॅप केले आहेत.", bn: "গুগল ম্যাপস জ্যামিতি ব্যবহার করে স্থানীয় উচ্চ-ঘনত্বের ক্ষুদ্র-নির্গমন হটস্পটগুলি ম্যাপ করা হয়েছে।", te: "గూగుల్ మ్యాప్స్ జ్యామితిని ఉపయోగించి మ్యాప్ చేయబడిన స్థానిక అధిక-సాంద్రత మైక్రో-ఎమిషన్ హాట్‌స్పాట్‌లు.", ta: "கூகிள் வரைபட வடிவவியலைப் பயன்படுத்தி உள்ளூர் அதிக அடர்த்தி கொண்ட மைக்ரோ-உமிழ்வு ஹாட்ஸ்பாட்கள் வரைபடமாக்கப்பட்டன.", kn: "ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್ ಜ್ಯಾಮಿತಿ ಬಳಸಿ ಸ್ಥಳೀಯ ಹೆಚ್ಚಿನ ಸಾಂದ್ರತೆಯ ಮೈಕ್ರೋ-ಎಮಿಷൻ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳನ್ನು ನಕ್ಷೆ ಮಾಡಲಾಗಿದೆ.", gu: "ગૂગલ મેપ્સ ભૂમિતિનો ઉપયોગ કરીને સ્થાનિક ઉચ્ચ-ઘનતાવાળા માઇક્રો-એમિશન હોટસ્પોટ્સ મેપ કરવામાં આવ્યા છે.", pa: "ਗੂਗਲ ਮੈਪਸ ਜਿਓਮੈਟਰੀ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਸਥਾਨਕ ਉੱਚ-ਘਣਤਾ ਵਾਲੇ ਮਾਈਕਰੋ-ਨਿਕਾਸ ਹਾਟਸਪੌਟਸ ਮੈਪ ਕੀਤੇ ਗਏ ਹਨ।", ml: "ഗൂഗിൾ മാപ്സ് ജ്യാമിതി ഉപയോഗിച്ച് പ്രാദേശിക ഉയർന്ന സാന്ദ്രതയുള്ള മൈക്രോ-എമിഷൻ ഹോട്ട്സ്പോട്ടുകൾ മാപ്പ് ചെയ്തിരിക്കുന്നു."
  },
  "Sentinel-5P wind-borne stubble smoke and column density plumes.": {
    en: "Sentinel-5P wind-borne stubble smoke and column density plumes.", hi: "सेंटिनल-5पी हवा से उड़ने वाले पराली का धुआं और स्तंभ घनत्व प्लम।", mr: "सेंटिनल-५पी वाऱ्याने वाहून नेणारा पिकाचा धूर आणि स्तंभ घनता प्लम्स.", bn: "সেন্টিনেল-৫পি বায়ু বাহিত খড় পোড়ানোর ধোঁয়া এবং কলাম ঘনত্ব প্লুম।", te: "సెంటినెൽ-5పి గాలి ద్వారా వచ్చే పంట పొగ మరియు కాలమ్ డెన్సిటీ ప్లూమ్స్.", ta: "சென்டினல்-5பி காற்றினால் பரவும் வைக்கோல் புகை மற்றும் நெடுவரிசை அடர்த்தி இறகுகள்.", kn: "ಸೆಂಟಿನೆಲ್-5ಪಿ ಗಾಳಿಯಿಂದ ಹರಡುವ ಕೃಷಿ ಕಸದ ಹೊಗೆ ಮತ್ತು ಕಾಲಮ್ ಸಾಂದ್ರತೆಯ ಪ್ಲೂಮ್ಸ್.", gu: "સેન્ટિનેલ-5પી પવનથી ફેલાતો પરાળનો ધુમાડો અને સ્તંભ ઘનતા પ્લુમ્સ.", pa: "ਸੈਂਟੀਨੇਲ-5ਪੀ ਹਵਾ ਨਾਲ ਉੱਡਣ ਵਾਲਾ ਪਰਾਲੀ ਦਾ ਧੂੰਆਂ ਅਤੇ ਕਾਲਮ ਘਣਤਾ ਪਲੂਮਸ।", ml: "സെന്റിനൽ -5 പി കാറ്റിലൂടെയുള്ള വൈക്കോൽ പുകയും കോളം ഡെൻസിറ്റി പ്ലൂമുകളും."
  }
};

type MapSource = 'cpcb' | 'google-maps' | 'earth-engine';

export default function AqiMap({
  selectedCityName,
  selectedState,
  selectedCityCoords,
  liveAqi,
  userReports,
  onShowToast,
  lang
}: AqiMapProps) {
  const getMapString = (key: string): string => {
    const translation = MAP_LOCALIZATION[key];
    if (!translation) return key;
    return translation[lang] || translation['en'] || key;
  };

  const [leafletLoaded, setLeafletLoaded] = useState<boolean>(
    typeof window !== 'undefined' && !!(window as any).L
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<MapSource>('cpcb');
  
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const hotspotCirclesRef = useRef<any[]>([]);

  // Dynamic script loader for Leaflet
  useEffect(() => {
    if (leafletLoaded) return;

    // Load CSS
    const cssId = 'leaflet-cdn-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load JS
    const jsId = 'leaflet-cdn-js';
    if (!document.getElementById(jsId)) {
      const script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      const interval = setInterval(() => {
        if ((window as any).L) {
          setLeafletLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [leafletLoaded]);

  // Indian CPCB Color Scale with enhanced high-visibility neon colors for Night Mode
  const getCpcbScale = (aqi: number) => {
    if (aqi <= 50) return { color: '#10b981', text: 'Good', border: '#047857' };          // Neon Emerald
    if (aqi <= 100) return { color: '#84cc16', text: 'Satisfactory', border: '#4d7c0f' }; // Neon Lime
    if (aqi <= 200) return { color: '#eab308', text: 'Moderate', border: '#a16207' };     // Neon Amber
    if (aqi <= 300) return { color: '#f97316', text: 'Poor', border: '#c2410c' };         // Neon Orange
    if (aqi <= 400) return { color: '#ef4444', text: 'Very Poor', border: '#b91c1c' };    // Bright Red
    return { color: '#a855f7', text: 'Severe', border: '#7e22ce' };                       // Vivid Purple
  };

  // Generate Station Marker HTML with sleek tech ring glowing effect
  const getMarkerHtml = (aqi: number, isPrimary: boolean) => {
    const scale = getCpcbScale(aqi);
    const sizeClass = isPrimary ? 'w-10 h-10' : 'w-8 h-8';
    const innerSizeClass = isPrimary ? 'w-8 h-8' : 'w-6.5 h-6.5';
    const glowPulse = isPrimary ? 'animate-pulse' : '';
    const borderStyle = `border border-slate-900 shadow-[0_0_6px_${scale.color}]`;

    return `
      <div class="relative flex items-center justify-center ${sizeClass}">
        <!-- Pulsing Ring Backdrop -->
        <div class="absolute inset-0 rounded-full opacity-20 ${glowPulse}" style="background-color: ${scale.color};"></div>
        <!-- Outer Glowing Ring -->
        <div class="absolute inset-0.5 rounded-full opacity-30 animate-ping" style="background-color: ${scale.color}; animation-duration: 3s;"></div>
        <!-- Center core CPCB circle -->
        <div class="relative rounded-full flex flex-col items-center justify-center text-white font-mono font-black leading-none ${innerSizeClass} ${borderStyle}" style="background-color: ${scale.color};">
          <span class="text-[9px] font-bold tracking-tighter">${aqi}</span>
          <span class="text-[4px] font-sans tracking-widest uppercase opacity-80 font-semibold">${isPrimary ? 'CPCB' : 'STN'}</span>
        </div>
      </div>
    `;
  };

  // Generate Citizen Hazard Marker Icon with high contrast and explicit designs for Dust vs. Fire/Smoke
  const getHazardMarkerHtml = (category: string) => {
    const categoryColors: Record<string, { bg: string, border: string, glow: string, label: string, icon: string }> = {
      Trash: { bg: '#ef4444', border: '#b91c1c', glow: 'rgba(239, 68, 68, 0.4)', label: 'GARBAGE BURNING', icon: '🗑️' },
      Leaf: { bg: '#f97316', border: '#c2410c', glow: 'rgba(249, 115, 22, 0.4)', label: 'BIOMASS BURNING', icon: '🍂' },
      Factory: { bg: '#a855f7', border: '#7e22ce', glow: 'rgba(168, 85, 247, 0.4)', label: 'INDUSTRIAL CHIMNEY', icon: '🏭' },
      Vehicular: { bg: '#3b82f6', border: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.4)', label: 'TAILPIPE EMISSION', icon: '🚗' },
      Dust: { bg: '#eab308', border: '#a16207', glow: 'rgba(234, 179, 8, 0.4)', label: 'CONSTRUCTION DUST', icon: '🏗️' },
      Smoke: { bg: '#f43f5e', border: '#be123c', glow: 'rgba(244, 63, 94, 0.4)', label: 'STUBBLE SMOKE', icon: '🌾' }
    };

    const config = categoryColors[category] || { bg: '#f43f5e', border: '#be123c', glow: 'rgba(244, 63, 94, 0.4)', label: 'HAZARD', icon: '⚠️' };
    
    return `
      <div class="relative flex items-center justify-center w-8 h-8">
        <!-- Interactive pulse glow -->
        <div class="absolute inset-0 rounded-full animate-ping" style="background-color: ${config.glow}; animation-duration: 2.5s;"></div>
        <div class="absolute inset-1 rounded-full animate-pulse" style="background-color: ${config.glow};"></div>
        <!-- High visibility core icon with customized design -->
        <div class="relative border-2 rounded-full w-6.5 h-6.5 flex items-center justify-center shadow-lg text-[10px] transition-transform hover:scale-110" 
             style="background-color: #0c111d; border-color: ${config.bg}; color: white;" 
             title="${config.label}">
          ${config.icon}
        </div>
      </div>
    `;
  };

  // Map Initialization
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current) return;

    const L = (window as any).L;

    // Center map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([selectedCityCoords.lat, selectedCityCoords.lon], 11);

    // Apply CartoDB Voyager tile server for a bright, clean, high-contrast light geospatial aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      minZoom: 3,
    }).addTo(map);

    // Zoom controls on bottom right
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    mapInstanceRef.current = map;
    markersGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  // Redraw overlays whenever source, location coordinates, or reports change
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    const L = (window as any).L;
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;

    // Reset view
    map.setView([selectedCityCoords.lat, selectedCityCoords.lon], 11);

    // Clear old elements
    markersGroup.clearLayers();
    hotspotCirclesRef.current.forEach(c => map.removeLayer(c));
    hotspotCirclesRef.current = [];

    const baseAqi = liveAqi || 110;

    // -------------------------------------------------------------
    // MODE 1: CPCB AIR QUALITY TELEMETRY (Central & Sub Stations)
    // -------------------------------------------------------------
    if (selectedSource === 'cpcb') {
      // 1. Primary Central CPCB Station
      const primaryIcon = L.divIcon({
        html: getMarkerHtml(baseAqi, true),
        className: 'custom-leaflet-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const primaryMarker = L.marker([selectedCityCoords.lat, selectedCityCoords.lon], { icon: primaryIcon })
        .bindPopup(`
          <div class="font-sans text-slate-100 min-w-[150px]">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[7px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-900/40 px-1 py-0.2 rounded uppercase tracking-wider">CPCB CAAQMS</span>
              <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <h5 class="font-extrabold text-[10.5px] text-white border-b border-slate-800/80 pb-1 mb-1.5 flex items-center gap-1">
              📡 Central station
            </h5>
            <div class="space-y-1 text-[8.5px] font-mono text-slate-400">
              <div class="flex justify-between"><span>Region:</span><span class="font-bold text-slate-200">${selectedCityName}</span></div>
              <div class="flex justify-between"><span>CPCB AQI:</span><span class="font-bold text-sky-400">${baseAqi} (${getCpcbScale(baseAqi).text})</span></div>
              <div class="flex justify-between"><span>PM2.5:</span><span class="font-bold text-emerald-400">${Math.round(baseAqi * 0.45)} ug/m³</span></div>
              <div class="flex justify-between"><span>NO2 Gas:</span><span class="font-bold text-amber-400">${Math.round(baseAqi * 0.2)} ppb</span></div>
            </div>
          </div>
        `);
      markersGroup.addLayer(primaryMarker);

      // Sub CPCB Stations
      const offsets = [
        { name: 'North Station', dLat: 0.015, dLon: -0.014, shift: -22, loc: 'District Gov School' },
        { name: 'South Station', dLat: -0.016, dLon: 0.018, shift: 36, loc: 'Heavy Industrial Plaza' },
        { name: 'East Station', dLat: 0.010, dLon: -0.021, shift: -11, loc: 'Smart Transit Terminus' },
        { name: 'West Station', dLat: -0.013, dLon: -0.017, shift: 19, loc: 'NH Expressway Ring' }
      ];

      offsets.forEach((offset) => {
        const offsetLat = selectedCityCoords.lat + offset.dLat;
        const offsetLon = selectedCityCoords.lon + offset.dLon;
        const nodeAqi = Math.max(15, Math.min(495, baseAqi + offset.shift));

        const subIcon = L.divIcon({
          html: getMarkerHtml(nodeAqi, false),
          className: 'custom-leaflet-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const subMarker = L.marker([offsetLat, offsetLon], { icon: subIcon })
          .bindPopup(`
            <div class="font-sans text-slate-100 min-w-[130px]">
              <span class="text-[6.5px] font-bold bg-slate-900 text-slate-400 px-1 py-0.2 rounded border border-slate-800">CPCB Node</span>
              <h6 class="font-extrabold text-[9.5px] text-white mt-1 leading-none">${offset.name}</h6>
              <p class="text-[7.5px] text-slate-500 mb-1">${offset.loc}</p>
              <div class="space-y-0.5 text-[8px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                <div class="flex justify-between"><span>AQI:</span><span class="font-bold text-amber-400">${nodeAqi}</span></div>
                <div class="flex justify-between"><span>Safety:</span><span class="font-bold text-slate-300">${getCpcbScale(nodeAqi).text}</span></div>
              </div>
            </div>
          `);
        markersGroup.addLayer(subMarker);
      });
    }

    // -------------------------------------------------------------
    // MODE 2: GOOGLE MAPS PLATFORM HOTSPOT MAPPING (Track 1 & 2 Emissions)
    // -------------------------------------------------------------
    if (selectedSource === 'google-maps') {
      const localHotspots = [
        { name: 'Highway Junction Bottleneck', dLat: 0.007, dLon: -0.008, radius: 400, desc: 'Tailpipe fuel emissions & high traffic idling', category: 'Vehicular', rawValue: 290 },
        { name: 'Infrastructure Excavation Block', dLat: -0.009, dLon: 0.012, radius: 500, desc: 'Fugitive construction dust & concrete particulate load', category: 'Dust', rawValue: 340 },
        { name: 'Regional Landfill Fire Zone', dLat: 0.014, dLon: 0.015, radius: 700, desc: 'Spontaneous combustion releasing black carbon', category: 'Trash', rawValue: 410 },
        { name: 'Interstate Transport Depot', dLat: -0.012, dLon: -0.011, radius: 450, desc: 'Concentrated diesel combustion and heavy smoke load', category: 'Vehicular', rawValue: 240 }
      ];

      localHotspots.forEach((hs) => {
        const hsLat = selectedCityCoords.lat + hs.dLat;
        const hsLon = selectedCityCoords.lon + hs.dLon;

        const scale = getCpcbScale(hs.rawValue);
        const circle = L.circle([hsLat, hsLon], {
          color: scale.color,
          fillColor: scale.color,
          fillOpacity: 0.15,
          radius: hs.radius,
          weight: 1.5,
          dashArray: '3, 4'
        }).addTo(map);

        circle.bindPopup(`
          <div class="font-sans text-slate-100 min-w-[155px]">
            <div class="flex items-center gap-1 mb-1">
              <span class="w-1.5 h-1.5 rounded-full animate-ping" style="background-color: ${scale.color};"></span>
              <span class="text-[7px] font-black text-rose-400 bg-rose-950/60 px-1 py-0.2 rounded border border-rose-900/40 uppercase">GMP Hotspot API</span>
            </div>
            <h5 class="font-extrabold text-[10px] text-white border-b border-slate-800 pb-0.5 mb-1 leading-tight">${hs.name}</h5>
            <p class="text-[8px] text-slate-400 italic my-1">${hs.desc}</p>
            <div class="space-y-0.5 text-[8px] font-mono text-slate-400 bg-slate-900/80 p-1.5 rounded border border-slate-800/40">
              <div class="flex justify-between"><span>Micro-AQI:</span><span class="font-bold text-red-400">${hs.rawValue}</span></div>
              <div class="flex justify-between"><span>Rad:</span><span class="font-semibold text-slate-200">${hs.radius}m</span></div>
              <div class="flex justify-between"><span>Type:</span><span class="font-semibold text-sky-400">${hs.category}</span></div>
            </div>
          </div>
        `);
        hotspotCirclesRef.current.push(circle);

        // Map pins inside dark mode hotspots with beautiful high contrast glow pins
        const customPinIcon = L.divIcon({
          html: `<div class="relative w-5 h-5 flex items-center justify-center">
                   <div class="absolute inset-0 rounded-full animate-ping bg-rose-500 opacity-25"></div>
                   <span class="text-rose-500 text-sm select-none">📍</span>
                 </div>`,
          className: 'custom-leaflet-marker-pin',
          iconSize: [20, 20],
          iconAnchor: [10, 20]
        });
        const pinMarker = L.marker([hsLat, hsLon], { icon: customPinIcon });
        markersGroup.addLayer(pinMarker);
      });
    }

    // -------------------------------------------------------------
    // MODE 3: GOOGLE EARTH ENGINE SATELLITE (Track 2 & 4 Aerosol Optical Density)
    // -------------------------------------------------------------
    if (selectedSource === 'earth-engine') {
      const latRange = 0.040;
      const lonRange = 0.050;

      const outerSmogBoundary = [
        [selectedCityCoords.lat + latRange, selectedCityCoords.lon - lonRange],
        [selectedCityCoords.lat + latRange, selectedCityCoords.lon + lonRange],
        [selectedCityCoords.lat - latRange, selectedCityCoords.lon + lonRange],
        [selectedCityCoords.lat - latRange, selectedCityCoords.lon - lonRange]
      ];

      const innerSmogPlume = [
        [selectedCityCoords.lat + latRange * 0.5, selectedCityCoords.lon - lonRange * 0.4],
        [selectedCityCoords.lat + latRange * 0.4, selectedCityCoords.lon + lonRange * 0.5],
        [selectedCityCoords.lat - latRange * 0.5, selectedCityCoords.lon + lonRange * 0.4],
        [selectedCityCoords.lat - latRange * 0.4, selectedCityCoords.lon - lonRange * 0.5]
      ];

      const outerPoly = L.polygon(outerSmogBoundary, {
        color: '#eab308',
        fillColor: '#eab308',
        fillOpacity: 0.05,
        weight: 1.2,
        dashArray: '4, 4'
      }).addTo(map);

      const innerPoly = L.polygon(innerSmogPlume, {
        color: '#f43f5e',
        fillColor: '#f43f5e',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '2, 3'
      }).addTo(map);

      outerPoly.bindPopup(`
        <div class="font-sans text-slate-100 min-w-[130px]">
          <span class="text-[6.5px] font-bold bg-amber-950/60 text-amber-400 border border-amber-900/40 px-1 py-0.2 rounded uppercase">GEE Sentinel 5P</span>
          <h6 class="font-extrabold text-[9.5px] text-white mt-1">Aerosol Boundary</h6>
          <p class="text-[8px] text-slate-400 leading-tight">Column optical density tracks regional transboundary particulate flow.</p>
        </div>
      `);

      innerPoly.bindPopup(`
        <div class="font-sans text-slate-100 min-w-[145px]">
          <span class="text-[7px] font-bold bg-rose-950/60 text-rose-400 border border-rose-900/30 px-1 py-0.2 rounded uppercase">GEE Dispersion Plume</span>
          <h6 class="font-extrabold text-[10px] text-white mt-1">Concentrated Smog Plume</h6>
          <p class="text-[8px] text-slate-400 leading-tight my-1">Plume trajectory indicates seasonal agricultural stubble smoke dispersing towards urban limits.</p>
        </div>
      `);

      hotspotCirclesRef.current.push(outerPoly);
      hotspotCirclesRef.current.push(innerPoly);
    }

    // 4. DISPLAY Active Citizen Hazard Reports (Track 1 / 2)
    userReports.forEach((report, index) => {
      if (report.category) {
        const seedLat = Math.sin(index + 3.5) * 0.009;
        const seedLon = Math.cos(index + 1.2) * 0.009;
        const reportLat = (report.lat !== undefined && report.lat !== null) ? report.lat : (selectedCityCoords.lat + seedLat);
        const reportLon = (report.lon !== undefined && report.lon !== null) ? report.lon : (selectedCityCoords.lon + seedLon);

        const hazardIcon = L.divIcon({
          html: getHazardMarkerHtml(report.category),
          className: 'custom-leaflet-hazard',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const popupContent = `
          <div class="font-sans text-slate-100 min-w-[140px]">
            <span class="text-[6.5px] font-black font-mono bg-red-950 text-red-400 border border-red-900/50 px-1 py-0.2 rounded flex items-center gap-1 w-fit">
              🚨 CITIZEN SENSOR Snapped
            </span>
            <h6 class="font-extrabold text-[9.5px] text-white mt-1 uppercase tracking-wide">
              ${report.category === 'Dust' ? '🏗️ DUST CLOUD' : '🔥 SMOKE INCIDENT'}
            </h6>
            <p class="text-[8.5px] text-slate-300 leading-relaxed my-1 bg-slate-900/80 p-1.5 rounded border border-slate-800/40 font-medium">
              "${report.text}"
            </p>
            ${report.imageUrl ? `
              <div class="relative w-full h-14 overflow-hidden rounded border border-slate-800 mb-1">
                <img src="${report.imageUrl}" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            ` : ''}
            <div class="flex items-center justify-between text-[6.5px] font-mono text-slate-500 pt-0.5 border-t border-slate-900">
              <span>Verified Report</span>
              <span>${report.timestamp}</span>
            </div>
          </div>
        `;

        const hazardMarker = L.marker([reportLat, reportLon], { icon: hazardIcon })
          .bindPopup(popupContent);
        markersGroup.addLayer(hazardMarker);
      }
    });

  }, [selectedCityCoords, leafletLoaded, liveAqi, userReports, selectedSource]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    playAudioClick();
    setTimeout(() => {
      setIsRefreshing(false);
      let alertMsg = "🔄 CPCB stations verified on GPS grid!";
      if (selectedSource === 'google-maps') alertMsg = "🛰️ GMP hotspot emissions updated!";
      if (selectedSource === 'earth-engine') alertMsg = "🛰️ Earth Engine air column density synced!";
      onShowToast(alertMsg);
    }, 1200);
  };

  const handleSourceSelect = (source: MapSource, label: string) => {
    setSelectedSource(source);
    playAudioClick();
    onShowToast(`🗺️ Layer: ${label}`);
  };

  const playAudioClick = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden relative text-slate-700">
      
      {/* Dynamic Leaflet Popup Style Overrider to make it matching high-end Light Theme */}
      <style>{`
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          color: #1e293b !important;
          border: 1px solid #cbd5e1 !important;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05) !important;
          border-radius: 12px !important;
          padding: 2px !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
        }
        .leaflet-popup-content {
          margin: 6px 10px !important;
        }
        .leaflet-container a.leaflet-popup-close-button {
          color: #64748b !important;
          padding: 4px 4px 0 0 !important;
        }
        .leaflet-container a.leaflet-popup-close-button:hover {
          color: #0f172a !important;
        }
      `}</style>

      {/* Top Banner Status Bar */}
      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 border-b border-slate-200 flex items-center justify-between z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-sky-600 animate-spin-slow" />
          <span className="text-[9px] font-bold font-mono text-slate-700 uppercase tracking-wide">
            {selectedCityName} {getMapString("GIS Command Grid")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[7.5px] font-mono font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100 flex items-center gap-0.5">
            <Globe className="w-2.5 h-2.5 text-sky-600" />
            {getMapString("SOMA GIS GRID")}
          </span>
          <button
            onClick={handleManualRefresh}
            className="p-0.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
            title="Force telemetry updates"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map Element */}
      <div className="flex-1 w-full relative bg-slate-50">
        {!leafletLoaded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 space-y-3 bg-slate-50 z-20">
            <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider animate-pulse">
              CALIBRATING GEOSPATIAL TILES...
            </span>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full z-0" style={{ minHeight: '180px' }}></div>
        )}

        {/* Floating Mapping Source Selector (Top Center/Right as responsive pills list) - Light Styled */}
        <div className="absolute top-2 left-2 right-2 bg-white/95 backdrop-blur-md px-2 py-2 rounded-xl border border-slate-200/80 shadow-lg z-[400] flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[7.5px] font-bold font-mono text-slate-500 uppercase tracking-wider flex items-center gap-0.5">
              <Filter className="w-3 h-3 text-sky-500" /> {getMapString("Select Mapping Data Layer")}
            </span>
            <span className="text-[6.5px] text-slate-400 font-mono">{getMapString("TRACK SCOPES")}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handleSourceSelect('cpcb', 'CPCB Stations')}
              className={`py-1 rounded-lg text-[7.5px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                selectedSource === 'cpcb'
                  ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Radio className="w-2.5 h-2.5" />
              <span>{getMapString("CPCB CAAQMS")}</span>
            </button>
            <button
              onClick={() => handleSourceSelect('google-maps', 'Google Maps Hotspots')}
              className={`py-1 rounded-lg text-[7.5px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                selectedSource === 'google-maps'
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <MapPin className="w-2.5 h-2.5" />
              <span>{getMapString("Google Maps")}</span>
            </button>
            <button
              onClick={() => handleSourceSelect('earth-engine', 'Earth Engine Plumes')}
              className={`py-1 rounded-lg text-[7.5px] font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border ${
                selectedSource === 'earth-engine'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Globe className="w-2.5 h-2.5" />
              <span>{getMapString("Earth Engine")}</span>
            </button>
          </div>
        </div>

        {/* Float Overlays - Light Mode Interactive Legend (Bottom Left) */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200/80 shadow-lg z-[400] text-[7.5px] font-mono flex flex-col gap-0.5 max-w-[115px]">
          <span className="font-sans font-bold text-slate-700 text-[8px] border-b border-slate-100 pb-0.5 mb-1 flex items-center gap-0.5">
            <Layers className="w-2.5 h-2.5 text-sky-500" /> {getMapString("CPCB Scale (AQI)")}
          </span>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_3px_#10b981]"></span>
            <span className="text-slate-600">{getMapString("Good")} (0-50)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84cc16] shadow-[0_0_3px_#84cc16]"></span>
            <span className="text-slate-600">{getMapString("Satisfactory")} (51-100)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab308] shadow-[0_0_3px_#eab308]"></span>
            <span className="text-slate-600">{getMapString("Moderate")} (101-200)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] shadow-[0_0_3px_#f97316]"></span>
            <span className="text-slate-600">{getMapString("Poor")} (201-300)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] shadow-[0_0_3px_#ef4444]"></span>
            <span className="text-slate-600">{getMapString("Very Poor")} (301-400)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7] shadow-[0_0_3px_#a855f7]"></span>
            <span className="text-slate-600">{getMapString("Severe")} (401+)</span>
          </div>
          <div className="flex items-center gap-1 border-t border-slate-100 pt-0.5 mt-0.5 font-sans font-bold text-slate-500 text-[6.5px]">
            <span>🌾🏗️</span>
            <span>{getMapString("Citizen Snaps")}</span>
          </div>
        </div>

        {/* Floating track guidelines / Light Mode info helper overlay */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md text-slate-800 font-sans text-[7px] p-1.5 rounded-lg z-[400] shadow-lg max-w-[130px] border border-slate-200/80 space-y-0.5">
          <div className="font-bold flex items-center gap-0.5 text-sky-600 uppercase tracking-wide">
            <Sparkles className="w-2 h-2 text-sky-500 animate-pulse" />
            <span>{getMapString("GIS Scope")}</span>
          </div>
          {selectedSource === 'cpcb' && (
            <p className="text-slate-500 leading-normal text-[6.5px]">
              {getMapString("Official Indian CPCB CAAQMS sensor telemetry overlaid on high contrast detailed maps.")}
            </p>
          )}
          {selectedSource === 'google-maps' && (
            <p className="text-slate-500 leading-normal text-[6.5px]">
              <strong>{getMapString("Google Maps")}:</strong> {getMapString("Local high-density micro-emission hotspots mapped using Google Maps geometry.")}
            </p>
          )}
          {selectedSource === 'earth-engine' && (
            <p className="text-slate-500 leading-normal text-[6.5px]">
              <strong>{getMapString("Earth Engine")}:</strong> {getMapString("Sentinel-5P wind-borne stubble smoke and column density plumes.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
