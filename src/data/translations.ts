import { Language } from '../types/pds';

export interface TranslationStrings {
  appName: string;
  tagline: string;
  prototypeNotice: string;
  selectLanguage: string;
  citizen: string;
  officer: string;
  dealer: string;
  login: string;
  logout: string;
  dashboard: string;
  profile: string;
  changeLocation: string;
  distanceCheck: string;
  trackRation: string;
  notifications: string;
  grievance: string;
  rationCardNo: string;
  phoneNo: string;
  sendOtp: string;
  verifyOtp: string;
  entitlement: string;
  familyMembers: string;
  cardType: string;
  assignedFps: string;
  fpsStatus: string;
  checkStock: string;
  loadVerification: string;
  truckNavigation: string;
  confirmArrival: string;
  startDistribution: string;
  monthEndLeftover: string;
  approve: string;
  modify: string;
  reject: string;
  cycleDemand: string;
  stockPosition: string;
  vehiclesActive: string;
  openAlerts: string;
  recommendationTitle: string;
  recommendationNotice: string;

  // Illiterate & Rural Accessibility Additions
  backToMenu: string;
  slotBooking: string;
  myToken: string;
  rawRice: string;
  wheat: string;
  sugar: string;
  dal: string;
  biometricLogin: string;
  voiceAssist: string;
  dealerLogin: string;
  officerLogin: string;
  cardHolderLogin: string;
  otpPlaceholder: string;
  lockSlotBtn: string;
  phase1Title: string;
  phase2Title: string;
  tokenGeneratedNotice: string;
  listenAloud: string;
  callDealer: string;
  freeGrains: string;
  activeStatus: string;
  locationConfirmed: string;
  day: string;
  time: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    appName: 'Karnataka Ahara ePDS',
    tagline: 'Food, Civil Supplies & Consumer Affairs Department',
    prototypeNotice: 'Public Distribution System · ePDS Demand Sync Portal',
    selectLanguage: 'Language / ಭಾಷೆ',
    citizen: 'Ration Card Beneficiary',
    officer: 'Food Department Officer',
    dealer: 'FPS Fair Price Dealer',
    login: 'Log In',
    logout: 'Sign Out',
    dashboard: 'Dashboard',
    profile: 'My Free Rations & Card',
    changeLocation: 'Change Ration Shop',
    distanceCheck: 'Distance to Depot',
    trackRation: 'Live Ration Truck',
    notifications: 'Alerts & Messages',
    grievance: 'Help & Complaints',
    rationCardNo: 'Ration Card Number',
    phoneNo: 'Registered Mobile Number',
    sendOtp: 'Send OTP to Mobile',
    verifyOtp: 'Verify OTP & Enter',
    entitlement: 'My Monthly Foodgrains',
    familyMembers: 'Enrolled Family Members',
    cardType: 'Card Category',
    assignedFps: 'My Fair Price Depot',
    fpsStatus: 'Ration Shop Status',
    checkStock: 'Depot Stock',
    loadVerification: 'Load Verification',
    truckNavigation: 'Live Truck GPS',
    confirmArrival: 'Confirm Truck Arrival',
    startDistribution: 'Start Grain Distribution',
    monthEndLeftover: 'Month-End Leftover Stock',
    approve: 'Approve Dispatch',
    modify: 'Modify Allocation',
    reject: 'Reject Proposal',
    cycleDemand: 'Monthly Demand',
    stockPosition: 'Stock Position',
    vehiclesActive: 'Active Delivery Trucks',
    openAlerts: 'Urgent Alerts',
    recommendationTitle: 'AI Buffer Supply Recommendation',
    recommendationNotice: 'Automated recommendation requires explicit officer authorization.',

    // Illiterate & Rural Accessibility
    backToMenu: '← Back to Home',
    slotBooking: 'Book Day & Time Slot',
    myToken: 'My Token Slip & QR',
    rawRice: 'Raw Rice (ಅಕ್ಕಿ)',
    wheat: 'Wheat (ಗೋಧಿ)',
    sugar: 'Refined Sugar (ಸಕ್ಕರೆ)',
    dal: 'Toor Dal (ಬೇಳೆ)',
    biometricLogin: 'Thumbprint Biometric Login',
    voiceAssist: 'Audio Voice Guide',
    dealerLogin: 'Fair Price Dealer Sign In',
    officerLogin: 'Department Officer Sign In',
    cardHolderLogin: 'Ration Cardholder Sign In',
    otpPlaceholder: 'Enter 4-digit SMS OTP',
    lockSlotBtn: 'Lock My Collection Time',
    phase1Title: 'Step 1: Choose Ration Shop (Days 20–25)',
    phase2Title: 'Step 2: Choose Free Day & Time',
    tokenGeneratedNotice: 'Your 2-hour grain pickup slot is locked! Show this slip at the shop.',
    listenAloud: 'Listen Aloud',
    callDealer: 'Call Dealer',
    freeGrains: 'Free Monthly Grains',
    activeStatus: 'Active & Verified',
    locationConfirmed: 'Depot Confirmed',
    day: 'Day',
    time: 'Time',
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
  },
  kn: {
    appName: 'ಕರ್ನಾಟಕ ಆಹಾರ ePDS',
    tagline: 'ಆಹಾರ, ನಾಗರಿಕ ಸರಬರಾಜು ಮತ್ತು ಗ್ರಾಹಕರ ವ್ಯವಹಾರಗಳ ಇಲಾಖೆ',
    prototypeNotice: 'ಸಾರ್ವಜನಿಕ ವಿತರಣಾ ವ್ಯವಸ್ಥೆ · ಡಿಮ್ಯಾಂಡ್ ಸಿಂಕ್ ಪೋರ್ಟಲ್',
    selectLanguage: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    citizen: 'ರೇಷನ್ ಕಾರ್ಡುದಾರರು / ಫಲಾನುಭವಿ',
    officer: 'ಆಹಾರ ಇಲಾಖೆಯ ಅಧಿಕಾರಿ',
    dealer: 'ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ ಡೀಲರ್',
    login: 'ಪ್ರವೇಶಿಸಿ (ಲಾಗಿನ್)',
    logout: 'ನಿರ್ಗಮಿಸಿ (ಲಾಗೌಟ್)',
    dashboard: 'ಮುಖ್ಯ ಪುಟ',
    profile: 'ನನ್ನ ಉಚಿತ ರೇಷನ್ ಮತ್ತು ಕಾರ್ಡ್',
    changeLocation: 'ರೇಷನ್ ಅಂಗಡಿ ಬದಲಾವಣೆ',
    distanceCheck: 'ಅಂಗಡಿಯ ದೂರ',
    trackRation: 'ರೇಷನ್ ಲಾರಿ ಎಲ್ಲಿದೆ?',
    notifications: 'ಸಂದೇಶಗಳು ಮತ್ತು ಸೂಚನೆಗಳು',
    grievance: 'ಸಹಾಯ ಮತ್ತು ದೂರುಗಳು',
    rationCardNo: 'ರೇಷನ್ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ',
    phoneNo: 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    sendOtp: 'ಮೊಬೈಲ್‌ಗೆ ಒಟಿಪಿ ಕಳುಹಿಸಿ',
    verifyOtp: 'ಒಟಿಪಿ ಪರಿಶೀಲಿಸಿ ಪ್ರವೇಶಿಸಿ',
    entitlement: 'ಈ ತಿಂಗಳ ಉಚಿತ ಆಹಾರ ಧಾನ್ಯಗಳು',
    familyMembers: 'ಕುಟುಂಬದ ಸದಸ್ಯರು',
    cardType: 'ಕಾರ್ಡ್ ವಿಧ (BPL / ಅಂತ್ಯೋದಯ)',
    assignedFps: 'ನಿಮ್ಮ ನ್ಯಾಯಬೆಲೆ ಅಂಗಡಿ',
    fpsStatus: 'ಅಂಗಡಿಯ ಸ್ಥಿತಿ',
    checkStock: 'ದಾಸ್ತಾನು ಪರಿಶೀಲನೆ',
    loadVerification: 'ಲೋಡ್ ಪರಿಶೀಲನೆ',
    truckNavigation: 'ಲಾರಿ ಲೈವ್ ಜಿಪಿಎಸ್',
    confirmArrival: 'ಲಾರಿ ಆಗಮನ ದೃಢೀಕರಣ',
    startDistribution: 'ರೇಷನ್ ವಿತರಣೆ ಪ್ರಾರಂಭಿಸಿ',
    monthEndLeftover: 'ತಿಂಗಳ ಕೊನೆಯ ಉಳಿಕೆ ದಾಸ್ತಾನು',
    approve: 'ಅನುಮೋದಿಸಿ',
    modify: 'ಬದಲಾಯಿಸಿ',
    reject: 'ತಿರಸ್ಕರಿಸಿ',
    cycleDemand: 'ತಿಂಗಳ ಒಟ್ಟು ಬೇಡಿಕೆ',
    stockPosition: 'ದಾಸ್ತಾನು ಸ್ಥಿತಿ',
    vehiclesActive: 'ಚಾಲನೆಯಲ್ಲಿರುವ ವಾಹನಗಳು',
    openAlerts: 'ತುರ್ತು ಎಚ್ಚರಿಕೆಗಳು',
    recommendationTitle: 'ಆಹಾರ ಸರಬರಾಜು ಶಿಫಾರಸು',
    recommendationNotice: 'ಅಧಿಕಾರಿಯ ನೇರ ಅನುಮೋದನೆಯಿಲ್ಲದೆ ಯಾವುದೇ ಸರಬರಾಜು ಹೊರಡುವುದಿಲ್ಲ.',

    // Illiterate & Rural Accessibility
    backToMenu: '← ಮುಖ್ಯ ಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',
    slotBooking: 'ದಿನ ಮತ್ತು ಸಮಯ ಬುಕಿಂಗ್',
    myToken: 'ನನ್ನ ಟೋಕನ್ ರಶೀದಿ (QR)',
    rawRice: 'ಅಕ್ಕಿ (Rice)',
    wheat: 'ಗೋಧಿ (Wheat)',
    sugar: 'ಸಕ್ಕರೆ (Sugar)',
    dal: 'ತೊಗರಿ ಬೇಳೆ (Dal)',
    biometricLogin: 'ಬೆರಳಚ್ಚು (ಹೆಬ್ಬೆರಳು) ಲಾಗಿನ್',
    voiceAssist: 'ಧ್ವನಿ ಸಹಾಯ (ಕೇಳಿ)',
    dealerLogin: 'ನ್ಯಾಯಬೆಲೆ ಡೀಲರ್ ಲಾಗಿನ್',
    officerLogin: 'ಇಲಾಖಾ ಅಧಿಕಾರಿಗಳ ಲಾಗಿನ್',
    cardHolderLogin: 'ರೇಷನ್ ಕಾರ್ಡುದಾರರ ಲಾಗಿನ್',
    otpPlaceholder: '4-ಅಂಕಿಯ ಒಟಿಪಿ ನಮೂದಿಸಿ',
    lockSlotBtn: 'ನನ್ನ ಸಮಯವನ್ನು ದೃಢೀಕರಿಸಿ',
    phase1Title: 'ಹಂತ 1: ರೇಷನ್ ಅಂಗಡಿ ಆಯ್ಕೆ (20-25 ನೇ ದಿನ)',
    phase2Title: 'ಹಂತ 2: ಉಚಿತ ದಿನ ಮತ್ತು ಸಮಯ ಆಯ್ಕೆಮಾಡಿ',
    tokenGeneratedNotice: 'ನಿಮ್ಮ ರೇಷನ್ ಪಡೆಯುವ ಸಮಯ ದೃಢಪಟ್ಟಿದೆ! ಅಂಗಡಿಯಲ್ಲಿ ಈ ಟೋಕನ್ ತೋರಿಸಿ ಧಾನ್ಯ ಪಡೆಯಿರಿ.',
    listenAloud: 'ಕೇಳಿ (ಧ್ವನಿ)',
    callDealer: 'ಡೀಲರ್‌ಗೆ ಕರೆ ಮಾಡಿ',
    freeGrains: 'ಉಚಿತ ಮಾಸಿಕ ರೇಷನ್',
    activeStatus: 'ಸಕ್ರಿಯ ಕಾರ್ಡ್',
    locationConfirmed: 'ಅಂಗಡಿ ದೃಢಪಟ್ಟಿದೆ',
    day: 'ದಿನ',
    time: 'ಸಮಯ',
    morning: 'ಬೆಳಿಗ್ಗೆ',
    afternoon: 'ಮಧ್ಯಾಹ್ನ',
    evening: 'ಸಂಜೆ',
  },
  hi: {
    appName: 'कर्नाटक आहार ePDS',
    tagline: 'खाद्य, नागरिक आपूर्ति एवं उपभोक्ता मामले विभाग',
    prototypeNotice: 'कर्नाटक सरकार · सार्वजनिक वितरण प्रणाली पोर्टल',
    selectLanguage: 'भाषा चुनें',
    citizen: 'राशन कार्ड लाभार्थी',
    officer: 'खाद्य विभाग अधिकारी',
    dealer: 'उचित मूल्य दुकान डीलर',
    login: 'लॉग इन करें',
    logout: 'लॉग आउट',
    dashboard: 'डैशबोर्ड',
    profile: 'मेरा मुफ्त राशन और कार्ड',
    changeLocation: 'राशन दुकान बदलें',
    distanceCheck: 'दुकान की दूरी',
    trackRation: 'राशन ट्रक कहाँ है?',
    notifications: 'संदेश और सूचनाएं',
    grievance: 'मदद और शिकायतें',
    rationCardNo: 'राशन कार्ड नंबर',
    phoneNo: 'पंजीकृत मोबाइल नंबर',
    sendOtp: 'ओटीपी भेजें',
    verifyOtp: 'ओटीपी जांचें और प्रवेश करें',
    entitlement: 'मासिक मुफ्त खाद्यान्न',
    familyMembers: 'परिवार के सदस्य',
    cardType: 'कार्ड प्रकार',
    assignedFps: 'आपकी राशन दुकान',
    fpsStatus: 'दुकान की स्थिति',
    checkStock: 'स्टॉक जांचें',
    loadVerification: 'लोड सत्यापन',
    truckNavigation: 'ट्रक लाइव जीपीएस',
    confirmArrival: 'ट्रक आगमन की पुष्टि',
    startDistribution: 'वितरण शुरू करें',
    monthEndLeftover: 'माह-अंत बचा हुआ स्टॉक',
    approve: 'स्वीकृत करें',
    modify: 'संशोधित करें',
    reject: 'अस्वीकार करें',
    cycleDemand: 'मासिक मांग',
    stockPosition: 'स्टॉक स्थिति',
    vehiclesActive: 'सक्रिय वाहन',
    openAlerts: 'ओपन अलर्ट',
    recommendationTitle: 'खाद्य आपूर्ति सिफारिश',
    recommendationNotice: 'अधिकारी की पुष्टि के बिना कोई वाहन रवाना नहीं होता।',

    // Illiterate & Rural Accessibility
    backToMenu: '← वापस मुख्य पृष्ठ पर जाएं',
    slotBooking: 'दिन और समय स्लॉट बुक करें',
    myToken: 'मेरी टोकन पर्ची और क्यूआर',
    rawRice: 'चावल (Rice)',
    wheat: 'गेहूं (Wheat)',
    sugar: 'चीनी (Sugar)',
    dal: 'दाल (Dal)',
    biometricLogin: 'अंगूठे के निशान से लॉगिन',
    voiceAssist: 'ध्वनि सहायता (सुनें)',
    dealerLogin: 'राशन डीलर लॉगिन',
    officerLogin: 'खाद्य अधिकारी लॉगिन',
    cardHolderLogin: 'राशन कार्डधारक लॉगिन',
    otpPlaceholder: '4-अंकीय ओटीपी दर्ज करें',
    lockSlotBtn: 'मेरा समय स्लॉट पक्का करें',
    phase1Title: 'चरण 1: राशन दुकान चुनें (20-25 तारीख)',
    phase2Title: 'चरण 2: अपना दिन और समय चुनें',
    tokenGeneratedNotice: 'आपका राशन संग्रह समय पक्का हो गया है! दुकान पर यह पर्ची दिखाएं।',
    listenAloud: 'बोलकर सुनें',
    callDealer: 'डीलर को फोन करें',
    freeGrains: 'मुफ्त मासिक राशन',
    activeStatus: 'सक्रिय और सत्यापित',
    locationConfirmed: 'दुकान पक्की हो गई',
    day: 'दिन',
    time: 'समय',
    morning: 'सुबह',
    afternoon: 'दोपहर',
    evening: 'शाम',
  },
  ta: {
    appName: 'கர்நாடக ஆஹார் ePDS',
    tagline: 'உணவு மற்றும் நுகர்வோர் விவகாரங்கள் துறை',
    prototypeNotice: 'கர்நாடக அரசு · பொது விநியோகத் திட்ட போர்ட்டல்',
    selectLanguage: 'மொழியைத் தேர்ந்தெடுக்கவும்',
    citizen: 'ரேஷன் அட்டைதாரர்',
    officer: 'உணவுத்துறை அதிகாரி',
    dealer: 'நியாயவிலை கடை விற்பனையாளர்',
    login: 'உள்நுழைக',
    logout: 'வெளியேறு',
    dashboard: 'டாஷ்போர்டு',
    profile: 'எனது இலவச ரேஷன் & அட்டை',
    changeLocation: 'ரேஷன் கடை மாற்றம்',
    distanceCheck: 'கடையின் தொலைவு',
    trackRation: 'ரேஷன் லாரி எங்கே உள்ளது?',
    notifications: 'அறிவிப்புகள்',
    grievance: 'உதவி மற்றும் புகார்கள்',
    rationCardNo: 'ரேஷன் அட்டை எண்',
    phoneNo: 'பதிவு செய்யப்பட்ட மொபைல் எண்',
    sendOtp: 'OTP அனுப்புக',
    verifyOtp: 'OTP சரிபார்த்து நுழையவும்',
    entitlement: 'மாத இலவச தானியங்கள்',
    familyMembers: 'குடும்ப உறுப்பினர்கள்',
    cardType: 'அட்டை வகை',
    assignedFps: 'ஒதுக்கப்பட்ட நியாயவிலை கடை',
    fpsStatus: 'கடை நிலை',
    checkStock: 'கையிருப்பு சரிபார்',
    loadVerification: 'சுமை சரிபார்ப்பு',
    truckNavigation: 'வாகன ஜிபிஎஸ்',
    confirmArrival: 'வாகனம் வந்ததை உறுதிசெய்',
    startDistribution: 'விநியோகம் தொடங்கு',
    monthEndLeftover: 'மாத இறுதி மீதமுள்ள இருப்பு',
    approve: 'ஒப்புதல் அளி',
    modify: 'மாற்றியமை',
    reject: 'நிராகரி',
    cycleDemand: 'சுழற்சி தேவை',
    stockPosition: 'கையிருப்பு நிலை',
    vehiclesActive: 'இயங்கும் வாகனங்கள்',
    openAlerts: 'எச்சரிக்கைகள்',
    recommendationTitle: 'விநியோக பரிந்துரை',
    recommendationNotice: 'அதிகாரியின் ஒப்புதல் இன்றி வாகனம் அனுப்பப்படாது.',

    // Illiterate & Rural Accessibility
    backToMenu: '← முதன்மைப் பக்கத்திற்கு செல்',
    slotBooking: 'நாள் மற்றும் நேரம் முன்பதிவு',
    myToken: 'எனது டோக்கன் சீட்டு & QR',
    rawRice: 'அரிசி (Rice)',
    wheat: 'கோதுமை (Wheat)',
    sugar: 'சர்க்கரை (Sugar)',
    dal: 'பருப்பு (Dal)',
    biometricLogin: 'கைரேகை உள்நுழைவு',
    voiceAssist: 'குரல் உதவி (கேளுங்கள்)',
    dealerLogin: 'விற்பனையாளர் உள்நுழைவு',
    officerLogin: 'அதிகாரி உள்நுழைவு',
    cardHolderLogin: 'அட்டைதாரர் உள்நுழைவு',
    otpPlaceholder: '4 இலக்க OTP உள்ளிடவும்',
    lockSlotBtn: 'எனது நேரத்தை உறுதிசெய்',
    phase1Title: 'படி 1: ரேஷன் கடை தேர்வு (20-25 தேதி)',
    phase2Title: 'படி 2: இலவச நாள் மற்றும் நேரம் தேர்வு',
    tokenGeneratedNotice: 'உங்கள் ரேஷன் பெறும் நேரம் உறுதியானது! கடையில் இந்த சீட்டை காட்டவும்.',
    listenAloud: 'குரல் கேட்க',
    callDealer: 'விற்பனையாளரை அழைக்க',
    freeGrains: 'இலவச மாத தானியங்கள்',
    activeStatus: 'செயலில் உள்ள அட்டை',
    locationConfirmed: 'கடை உறுதியானது',
    day: 'நாள்',
    time: 'நேரம்',
    morning: 'காலை',
    afternoon: 'மதியம்',
    evening: 'மாலை',
  },
  te: {
    appName: 'కర్ణాటక ఆహార్ ePDS',
    tagline: 'ఆహార మరియు వినియోగదారుల వ్యవహారాల శాఖ',
    prototypeNotice: 'కర్ణాటక ప్రభుత్వం · ప్రజా పంపిణీ వ్యవస్థ పోర్టల్',
    selectLanguage: 'భాషను ఎంచుకోండి',
    citizen: 'రేషన్ కార్డు లబ్ధిదారుడు',
    officer: 'ఆహార శాఖ అధికారి',
    dealer: 'చౌక ధరల దుకాణం డీలర్',
    login: 'లాగిన్ అవ్వండి',
    logout: 'లాగ్ అవుట్',
    dashboard: 'డాష్‌బోర్డ్',
    profile: 'నా ఉచిత రేషన్ మరియు కార్డు',
    changeLocation: 'రేషన్ దుకాణం మార్పు',
    distanceCheck: 'దుకాణం దూరం',
    trackRation: 'రేషన్ లారీ ఎక్కడ ఉంది?',
    notifications: 'నోటిఫికేషన్లు',
    grievance: 'సహాయం మరియు ఫిర్యాదులు',
    rationCardNo: 'రేషన్ కార్డు సంఖ్య',
    phoneNo: 'రిజిస్టర్డ్ మొబైల్ సంఖ్య',
    sendOtp: 'OTP పంపండి',
    verifyOtp: 'OTP ధృవీకరించి ప్రవేశించండి',
    entitlement: 'నెలవారీ ఉచిత ఆహార ధాన్యాలు',
    familyMembers: 'కుటుంబ సభ్యులు',
    cardType: 'కార్డు రకం',
    assignedFps: 'మీ చౌక ధరల దుకాణం',
    fpsStatus: 'దుకాణం స్థితి',
    checkStock: 'స్టాక్ తనిఖీ',
    loadVerification: 'లోడ్ ధృవీకరణ',
    truckNavigation: 'లారీ లైవ్ జిపిఎస్',
    confirmArrival: 'లారీ రాక నిర్ధారణ',
    startDistribution: 'పంపిణీ ప్రారంభించండి',
    monthEndLeftover: 'నెల ఆఖరి మిగులు స్టాక్',
    approve: 'ఆమోదించు',
    modify: 'సవరించు',
    reject: 'తిరస్కరించు',
    cycleDemand: 'నెలవారీ డిమాండ్',
    stockPosition: 'స్టాక్ స్థితి',
    vehiclesActive: 'యాక్టివ్ వాహనాలు',
    openAlerts: 'హెచ్చరికలు',
    recommendationTitle: 'సరఫరా సిఫార్సు',
    recommendationNotice: 'అధికారి ఆమోదం లేకుండా ఏ వాహనం బయలుదేరదు.',

    // Illiterate & Rural Accessibility
    backToMenu: '← హోమ్‌కు తిరిగి వెళ్ళు',
    slotBooking: 'తేదీ మరియు సమయం బుకింగ్',
    myToken: 'నా టోకెన్ రశీదు & QR',
    rawRice: 'బియ్యం (Rice)',
    wheat: 'గోధుమలు (Wheat)',
    sugar: 'చక్కెర (Sugar)',
    dal: 'కందిపప్పు (Dal)',
    biometricLogin: 'వేలిముద్ర బయోమెట్రిక్ లాగిన్',
    voiceAssist: 'వాయిస్ సహాయం (వినండి)',
    dealerLogin: 'డీలర్ లాగిన్',
    officerLogin: 'అధికారుల లాగిన్',
    cardHolderLogin: 'రేషన్ కార్డుదారుల లాగిన్',
    otpPlaceholder: '4-అంకెల OTP నమోదు చేయండి',
    lockSlotBtn: 'నా సమయాన్ని లాక్ చేయండి',
    phase1Title: 'దశ 1: రేషన్ దుకాణం ఎంపిక (20-25 తేదీ)',
    phase2Title: 'దశ 2: ఉచిత తేదీ మరియు సమయం ఎంచుకోండి',
    tokenGeneratedNotice: 'మీ రేషన్ తీసుకునే సమయం ఖరారైంది! దుకాణంలో ఈ టోకెన్ చూపించండి.',
    listenAloud: 'వాయిస్ వినండి',
    callDealer: 'డీలర్‌కు కాల్ చేయండి',
    freeGrains: 'ఉచిత నెలవారీ రేషన్',
    activeStatus: 'యాక్టివ్ కార్డు',
    locationConfirmed: 'దుకాణం ఖరారైంది',
    day: 'తేదీ',
    time: 'సమయం',
    morning: 'ఉదయం',
    afternoon: 'మధ్యాహ్నం',
    evening: 'సాయంత్రం',
  },
};
