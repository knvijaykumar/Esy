import { Language } from '../types';

export interface Translations {
  // Common / Header / Footer
  platformTitle: string;
  portalSubtitle: string;
  staffPortalSubtitle: string;
  dpiBadge: string;
  kisanHelpline: string;
  helplineTimes: string;
  mspGuarantee: string;
  dbtAssurance: string;
  weighbridgeCertified: string;
  switchRoleToStaff: string;
  switchRoleToFarmer: string;
  farmerPortal: string;
  staffPortal: string;
  home: string;
  footerDesc: string;
  kisanHelplineSchedule: string;
  fairPriceAssuranceTitle: string;
  footerHackathon: string;
  footerDpi: string;

  // Nav Items
  navDashboard: string;
  navFindCenter: string;
  navBookSlot: string;
  navMyToken: string;
  navTrackStatus: string;
  navHistory: string;
  navProfile: string;

  // Staff Nav
  staffNavDashboard: string;
  staffNavFarmers: string;
  staffNavCentres: string;
  staffNavSlots: string;
  staffNavTokens: string;
  staffNavProcurement: string;
  staffNavReports: string;
  staffNavSettings: string;

  // Landing Page
  landingBadge: string;
  landingTitle: string;
  landingSubtitle: string;
  landingBtnFarmer: string;
  landingBtnStaff: string;
  freeService: string;
  journeyTitle: string;
  journeySubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  step5Title: string;
  step5Desc: string;
  step6Title: string;
  step6Desc: string;

  // Farmer Login
  loginHeading: string;
  loginSubtitle: string;
  tabMobile: string;
  labelMobile: string;
  hintMobile: string;
  btnContinue: string;
  newFarmerPrompt: string;
  registerHere: string;
  invalidLoginError: string;
  demoTesting: string;

  // Farmer Registration
  regTitle: string;
  regSubtitle: string;
  autoFillDemo: string;
  personalInfoTitle: string;
  locationTitle: string;
  preferencesTitle: string;
  labelFullName: string;
  labelVillage: string;
  labelAddress: string;
  labelDistrict: string;
  labelTaluk: string;
  labelPreferredLang: string;
  btnCompleteReg: string;
  alreadyRegistered: string;
  loginLink: string;
  regSuccessTitle: string;
  regSuccessSubtitle: string;
  assignedFarmerId: string;
  btnProceedDashboard: string;

  // Farmer Dashboard
  seasonBadge: string;
  welcomeFarmer: string;
  welcomeSub: string;
  farmerIdLabel: string;
  mobileLabel: string;
  talukLabel: string;
  btnViewProfile: string;
  activeTokenTitle: string;
  btnViewToken: string;
  btnTrackLive: string;
  servicesHeading: string;
  servicesSubtitle: string;

  // Action Cards
  cardFindTitle: string;
  cardFindDesc: string;
  cardBookTitle: string;
  cardBookDesc: string;
  cardTokenTitle: string;
  cardTokenDesc: string;
  cardTrackTitle: string;
  cardTrackDesc: string;
  cardHistoryTitle: string;
  cardHistoryDesc: string;
  cardProfileTitle: string;
  cardProfileDesc: string;

  // Find Centre
  findTitle: string;
  findSubtitle: string;
  opt1NearMe: string;
  opt1Desc: string;
  btnNearMe: string;
  nearMeLocating: string;
  nearbyFound: string;
  opt2Hierarchy: string;
  hierDistrict: string;
  hierTaluk: string;
  hierCentre: string;
  activeHierarchy: string;
  resetFilters: string;
  availCentresTitle: string;
  selectCenterPrompt: string;
  btnSelectCenter: string;
  btnSelectedCenter: string;
  btnBookAtCenter: string;
  cropsSupported: string;
  chooseCropPrompt: string;

  // Booking Wizard
  stepCenter: string;
  stepCrop: string;
  stepDate: string;
  stepSlot: string;
  stepReview: string;
  stepConfirm: string;
  estQuantity: string;
  slotsRemaining: string;
  btnContinueNext: string;
  btnBack: string;
  reviewTitle: string;
  reviewSub: string;
  estDbtValue: string;
  readyToConfirm: string;
  confirmNotice: string;
  btnConfirmGenerate: string;

  // Confirmation & Token
  bookingConfirmedTitle: string;
  bookingConfirmedSub: string;
  procurementSlotReserved: string;
  tokenNumberLabel: string;
  bookingRefLabel: string;
  btnPrintToken: string;
  btnDownload: string;
  mandiPassNotice: string;
  farmerName: string;
  deliveryCenter: string;
  cropForDelivery: string;
  appointmentSchedule: string;
  btnViewMyToken: string;
  btnTrackMilestones: string;
  btnBackDashboard: string;

  // Digital Token Page
  noActiveTokenTitle: string;
  noActiveTokenDesc: string;
  tokenPassHeader: string;
  tokenPassSubtitle: string;
  tokenPassGovTitle: string;
  tokenPassGovSub: string;
  dateOfIssue: string;
  scheduledTimeSlot: string;
  instructionsTitle: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;

  // Track Status
  trackTitle: string;
  trackSubtitle: string;
  searchTokenPlaceholder: string;
  btnTrackToken: string;
  tryDemoTokens: string;
  processTimelineTitle: string;
  inProgressAtMandi: string;

  // Status Milestones
  statusConfirmed: string;
  statusArrived: string;
  statusQuality: string;
  statusProcessing: string;
  statusCompleted: string;

  // Booking History
  historyTitle: string;
  historySubtitle: string;
  btnNewBooking: string;
  colToken: string;
  colDateSlot: string;
  colCentre: string;
  colCropQty: string;
  colStatus: string;
  colActions: string;
  actionViewToken: string;
  actionTrack: string;
  noBookingsFound: string;

  // Profile
  profileTitle: string;
  profileSubtitle: string;
  btnEditProfile: string;
  profileUpdatedSuccess: string;
  accountInfoTitle: string;
  regDateLabel: string;
  btnSaveChanges: string;
  btnCancel: string;
  logout: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  // ================= ENGLISH =================
  en: {
    platformTitle: 'Smart Agricultural Procurement',
    portalSubtitle: 'Direct Farmer Procurement Management System',
    staffPortalSubtitle: 'Staff & Center Administration Portal',
    dpiBadge: 'Digital Public Infrastructure for Agriculture',
    kisanHelpline: 'Farmer Assistance Helpline',
    helplineTimes: 'Toll-Free Kisan Call Centre (06:00 AM – 10:00 PM)',
    mspGuarantee: '100% Minimum Support Price (MSP) Guarantee',
    dbtAssurance: 'Direct Benefit Transfer (DBT) to Bank',
    weighbridgeCertified: 'Electronic Weighbridge Certification',
    switchRoleToStaff: 'Switch to Staff',
    switchRoleToFarmer: 'Switch to Farmer',
    farmerPortal: 'Farmer Portal',
    staffPortal: 'Staff Portal',
    home: 'Home',
    footerDesc: 'Smart Agricultural Procurement Management Platform — Empowering Indian farmers with transparent slot booking, real-time status tracking, and direct MSP payment.',
    kisanHelplineSchedule: 'Toll-Free Kisan Call Centre • Mon to Sat (06:00 AM – 10:00 PM) in 22 regional languages.',
    fairPriceAssuranceTitle: 'Fair Price & DBT Assurance',
    footerHackathon: 'Bharat Krishi Seva • Smart Agricultural Platform',
    footerDpi: 'Adhering to Indian Digital Public Infrastructure standards',

    navDashboard: 'Dashboard',
    navFindCenter: 'Find Centre',
    navBookSlot: 'Book Slot',
    navMyToken: 'My Token',
    navTrackStatus: 'Track Procurement',
    navHistory: 'History',
    navProfile: 'My Profile',

    staffNavDashboard: 'Dashboard',
    staffNavFarmers: 'Farmers',
    staffNavCentres: 'Centres',
    staffNavSlots: 'Slots',
    staffNavTokens: 'Tokens',
    staffNavProcurement: 'Procurement',
    staffNavReports: 'Reports',
    staffNavSettings: 'Settings',

    landingBadge: 'Digital Public Service for Agricultural Mandis',
    landingTitle: 'Smart Agricultural Procurement Management Platform',
    landingSubtitle: 'A simple digital platform that helps farmers find procurement centres, choose available procurement slots, receive a digital token and track their procurement process.',
    landingBtnFarmer: 'Farmer Login / Register',
    landingBtnStaff: 'Staff Login',
    freeService: 'Free Government Service',
    journeyTitle: 'The 6-Step Digital Procurement Journey',
    journeySubtitle: 'Designed for ease of access, rural transparency, and zero waiting queues at mandis.',
    step1Title: 'Farmer Registration & Login',
    step1Desc: 'Authenticate quickly using Mobile number. No complicated passwords.',
    step2Title: 'Find Centre & Select Crop',
    step2Desc: 'Locate nearest procurement centres in your taluk. Filter crops with guaranteed MSP rates.',
    step3Title: 'Choose Date & Slot',
    step3Desc: 'Pick an hourly arrival time slot that fits your harvest and transport schedule.',
    step4Title: 'Instant Digital Token',
    step4Desc: 'Receive your official booking token (e.g. AV-2026-00125) to show at the gate.',
    step5Title: 'Track Procurement Status',
    step5Desc: 'Follow real-time inspection milestones: Arrival, Quality Check, Weighing, and DBT.',
    step6Title: 'Fair MSP Direct to Bank',
    step6Desc: 'Guaranteed government rates directly deposited into registered bank accounts.',

    loginHeading: 'Farmer Login',
    loginSubtitle: 'Login using your registered mobile number.',
    tabMobile: 'Mobile Number',
    labelMobile: 'Mobile Number (10 Digits)',
    hintMobile: 'Enter your registered 10-digit Indian mobile number.',
    btnContinue: 'Continue',
    newFarmerPrompt: 'New Farmer?',
    registerHere: 'Register Here',
    invalidLoginError: 'Invalid details. Please check your number and try again.',
    demoTesting: 'Quick Demo Testing Login:',

    regTitle: 'Farmer Registration',
    regSubtitle: 'Enter your official identification and location details to book harvest delivery slots.',
    autoFillDemo: '⚡ Auto-fill Demo Farmer Details',
    personalInfoTitle: '1. Personal Information',
    locationTitle: '2. Location & Farm Address',
    preferencesTitle: '3. Preferences',
    labelFullName: 'Full Name',
    labelVillage: 'Village / Gram Panchayat',
    labelAddress: 'Detailed Address / Street',
    labelDistrict: 'District',
    labelTaluk: 'Taluk',
    labelPreferredLang: 'Preferred Language',
    btnCompleteReg: 'Complete Registration',
    alreadyRegistered: 'Already registered?',
    loginLink: 'Farmer Login',
    regSuccessTitle: 'Registration Successful',
    regSuccessSubtitle: 'Your official farmer account has been created.',
    assignedFarmerId: 'Assigned Farmer ID',
    btnProceedDashboard: 'Proceed to Farmer Dashboard',

    seasonBadge: 'Kharif / Rabi Procurement Season 2026',
    welcomeFarmer: 'Welcome',
    welcomeSub: 'Manage your agricultural procurement easily.',
    farmerIdLabel: 'Farmer ID',
    mobileLabel: 'Mobile',
    talukLabel: 'Village/Taluk',
    btnViewProfile: 'View Profile',
    activeTokenTitle: 'Active Procurement Token',
    btnViewToken: 'View Digital Token',
    btnTrackLive: 'Track Live Status',
    servicesHeading: 'Procurement Services',
    servicesSubtitle: 'Select an action below to manage your harvest sale at government APMC mandis.',

    cardFindTitle: 'Find Procurement Centre',
    cardFindDesc: 'Locate nearby mandis by GPS or select your District, Taluk, and Crops.',
    cardBookTitle: 'Book Procurement Slot',
    cardBookDesc: 'Choose your crop, date, and preferred 1-hour unloading time slot.',
    cardTokenTitle: 'My Digital Token',
    cardTokenDesc: 'View your official procurement token pass and download/print it.',
    cardTrackTitle: 'Track Procurement',
    cardTrackDesc: 'Check real-time milestone progress: Quality Check, Weighing, and DBT.',
    cardHistoryTitle: 'Booking History',
    cardHistoryDesc: 'Review your past and completed crop procurement receipts.',
    cardProfileTitle: 'My Profile',
    cardProfileDesc: 'View and edit your personal information, address, and preferences.',

    findTitle: 'Find Procurement Centre',
    findSubtitle: 'Locate your nearest official MSP procurement yard using GPS or step-by-step selection.',
    opt1NearMe: 'Option 1 — Automatic Location',
    opt1Desc: 'Detect nearest active procurement mandis within 25 km of your location.',
    btnNearMe: 'Find Near Me',
    nearMeLocating: 'Locating nearby mandis using GPS...',
    nearbyFound: 'Showing nearest procurement centres identified within 25 km.',
    opt2Hierarchy: 'Option 2 — Administrative Selection',
    hierDistrict: 'Select District',
    hierTaluk: 'Select Taluk',
    hierCentre: 'Procurement Centre',
    activeHierarchy: 'Active Hierarchy',
    resetFilters: 'Reset Filters',
    availCentresTitle: 'Available Procurement Centres',
    selectCenterPrompt: 'Select a centre to view supported crops and book slots',
    btnSelectCenter: 'Select Centre',
    btnSelectedCenter: 'Centre Selected',
    btnBookAtCenter: 'Book Slot at this Centre',
    cropsSupported: 'Available Crops for Procurement:',
    chooseCropPrompt: 'Select Your Crop for Procurement (Supported at this Centre):',

    stepCenter: 'Centre',
    stepCrop: 'Crop',
    stepDate: 'Date',
    stepSlot: 'Time Slot',
    stepReview: 'Review',
    stepConfirm: 'Confirm',
    estQuantity: 'Estimated Quantity (in Quintals)',
    slotsRemaining: 'slots left',
    btnContinueNext: 'Continue to Next Step',
    btnBack: 'Back',
    reviewTitle: 'Review Booking Details',
    reviewSub: 'Please verify your procurement appointment before confirmation.',
    estDbtValue: 'Estimated DBT Value (At Official MSP)',
    readyToConfirm: 'Ready to Confirm Booking?',
    confirmNotice: 'Please ensure your produce is dried to FAQ moisture specifications before arrival.',
    btnConfirmGenerate: 'Confirm & Generate Token',

    bookingConfirmedTitle: 'Booking Confirmed',
    bookingConfirmedSub: 'Your harvest delivery slot has been confirmed. Please present your Digital Token at the mandi gate.',
    procurementSlotReserved: 'Government Procurement Slot Reserved',
    tokenNumberLabel: 'Official Booking Reference & Token Number',
    bookingRefLabel: 'Booking Reference',
    btnPrintToken: 'Print Token',
    btnDownload: 'Download Pass',
    mandiPassNotice: 'Arrive at the yard at least 15 minutes before your time slot. No QR scanning required; state token number at the weighbridge.',
    farmerName: 'Farmer Name',
    deliveryCenter: 'Procurement Centre',
    cropForDelivery: 'Crop for Delivery',
    appointmentSchedule: 'Appointment Schedule',
    btnViewMyToken: 'View & Print Token Pass',
    btnTrackMilestones: 'Track Live Status',
    btnBackDashboard: 'Back to Dashboard',

    noActiveTokenTitle: 'No Active Digital Token',
    noActiveTokenDesc: 'You have not booked any procurement slots yet. Book a slot to generate your official digital token pass.',
    tokenPassHeader: 'Your Procurement Token',
    tokenPassSubtitle: 'Official Mandi Entry Pass & Weighbridge Authorization',
    tokenPassGovTitle: 'GOVERNMENT OF KARNATAKA — AGRICULTURAL PROCUREMENT',
    tokenPassGovSub: 'Smart Digital Procurement Token Pass',
    dateOfIssue: 'Date of Issue',
    scheduledTimeSlot: 'Scheduled Time Slot',
    instructionsTitle: 'Mandi Yard Entry Instructions:',
    instruction1: 'Carry original Farmer ID Card, Pahani/RTC, & valid photo ID.',
    instruction2: 'Present this token number at Mandi Gate 1 for weighbridge authorization.',
    instruction3: 'Arrive strictly during the designated 1-hour unloading time slot.',

    trackTitle: 'Track Procurement',
    trackSubtitle: 'Follow your harvest delivery milestones at the procurement mandi in real time.',
    searchTokenPlaceholder: 'Enter Token Number (e.g. AV-2026-00125)',
    btnTrackToken: 'Track Token',
    tryDemoTokens: 'Try demo tokens:',
    processTimelineTitle: 'Procurement Process Timeline',
    inProgressAtMandi: 'Currently in progress at mandi yard',

    statusConfirmed: 'Booking Confirmed',
    statusArrived: 'Farmer Arrived',
    statusQuality: 'Quality Check',
    statusProcessing: 'Procurement Processing',
    statusCompleted: 'Procurement Completed',

    historyTitle: 'Booking History',
    historySubtitle: 'Review all your past and active agricultural procurement appointments.',
    btnNewBooking: 'New Procurement Booking',
    colToken: 'Token Number',
    colDateSlot: 'Date & Slot',
    colCentre: 'Procurement Centre',
    colCropQty: 'Crop & Quantity',
    colStatus: 'Status',
    colActions: 'Actions',
    actionViewToken: 'Token',
    actionTrack: 'Track',
    noBookingsFound: 'No booking records found.',

    profileTitle: 'My Profile',
    profileSubtitle: 'View and manage your registered farmer credentials, contact details, and farm address.',
    btnEditProfile: 'Edit Profile',
    profileUpdatedSuccess: 'Profile updated successfully',
    accountInfoTitle: 'Account Information',
    regDateLabel: 'Registration Date',
    btnSaveChanges: 'Save Changes',
    btnCancel: 'Cancel',

    logout: 'Logout',
  
  },

  // ================= KANNADA (ಕನ್ನಡ) =================
  kn: {
    platformTitle: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಂಗ್ರಹಣಾ ವೇದಿಕೆ',
    portalSubtitle: 'ರೈತರ ಬೆಳೆ ಖರೀದಿ ಹಾಗೂ ಟೋಕನ್ ನಿರ್ವಹಣಾ ವ್ಯವಸ್ಥೆ',
    staffPortalSubtitle: 'ಅಧಿಕಾರಿಗಳು ಮತ್ತು ಕೇಂದ್ರ ನಿರ್ವಹಣಾ ಪೋರ್ಟಲ್',
    dpiBadge: 'ಕೃಷಿಗಾಗಿ ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಸೇವಾ ವ್ಯವಸ್ಥೆ',
    kisanHelpline: 'ರೈತ ಸಹಾಯವಾಣಿ (ಉಚಿತ)',
    helplineTimes: 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ (ಬೆಳಿಗ್ಗೆ 06:00 – ರಾತ್ರಿ 10:00)',
    mspGuarantee: '100% ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಖಾತರಿ',
    dbtAssurance: 'ನೇರ ನಗದು ವರ್ಗಾವಣೆ (DBT) ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ',
    weighbridgeCertified: 'ವಿದ್ಯುನ್ಮಾನ ತೂಕದ ಯಂತ್ರ ದೃಢೀಕರಣ',
    switchRoleToStaff: 'ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್',
    switchRoleToFarmer: 'ರೈತರ ಪೋರ್ಟಲ್',
    farmerPortal: 'ರೈತರ ಪೋರ್ಟಲ್',
    staffPortal: 'ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್',
    home: 'ಮುಖಪುಟ',
    footerDesc: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಂಗ್ರಹಣಾ ನಿರ್ವಹಣಾ ವೇದಿಕೆ — ಭಾರತೀಯ ರೈತರಿಗೆ ಪಾರದರ್ಶಕ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್, ನೈಜ ಸಮಯದ ಪ್ರಕ್ರಿಯೆ ಟ್ರ್ಯಾಕಿಂಗ್ ಮತ್ತು ನೇರ ಬೆಂಬಲ ಬೆಲೆ ಒದಗಿಸುವ ಡಿಜಿಟಲ್ ವ್ಯವಸ್ಥೆ.',
    kisanHelplineSchedule: 'ಉಚಿತ ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ • ಸೋಮ-ಶನಿ (ಬೆಳಿಗ್ಗೆ 06:00 – ರಾತ್ರಿ 10:00) 22 ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳಲ್ಲಿ.',
    fairPriceAssuranceTitle: 'ನ್ಯಾಯಯುತ ಬೆಲೆ ಮತ್ತು ನೇರ ಹಣ ಪಾವತಿ ಖಾತರಿ',
    footerHackathon: 'ಭಾರತ ಕೃಷಿ ಸೇವಾ • ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ವೇದಿಕೆ',
    footerDpi: 'ಭಾರತೀಯ ಡಿಜಿಟಲ್ ಸಾರ್ವಜನಿಕ ಮೂಲಸೌಕರ್ಯ (DPI) ಮಾನದಂಡಗಳಿಗೆ ಅನುಗುಣವಾಗಿದೆ',

    navDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navFindCenter: 'ಖರೀದಿ ಕೇಂದ್ರ ಹುಡುಕಿ',
    navBookSlot: 'ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ',
    navMyToken: 'ನನ್ನ ಡಿಜಿಟಲ್ ಟೋಕನ್',
    navTrackStatus: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    navHistory: 'ಇತಿಹಾಸ',
    navProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',

    staffNavDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    staffNavFarmers: 'ರೈತರ ವಿವರಗಳು',
    staffNavCentres: 'ಖರೀದಿ ಕೇಂದ್ರಗಳು',
    staffNavSlots: 'ಸ್ಲಾಟ್‌ಗಳು',
    staffNavTokens: 'ಟೋಕನ್‌ಗಳು',
    staffNavProcurement: 'ಸಂಗ್ರಹಣೆ',
    staffNavReports: 'ವರದಿಗಳು',
    staffNavSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

    landingBadge: 'ಸರ್ಕಾರಿ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಡಿಜಿಟಲ್ ಸೇವೆ',
    landingTitle: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಂಗ್ರಹಣಾ ನಿರ್ವಹಣಾ ವೇದಿಕೆ',
    landingSubtitle: 'ರೈತರು ಸುಲಭವಾಗಿ ಖರೀದಿ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಲು, ಲಭ್ಯವಿರುವ ದಿನಾಂಕ-ಸಮಯದ ಸ್ಲಾಟ್ ಆಯ್ಕೆ ಮಾಡಲು, ಡಿಜಿಟಲ್ ಟೋಕನ್ ಪಡೆಯಲು ಮತ್ತು ಬೆಳೆ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸರಳ ವೇದಿಕೆ.',
    landingBtnFarmer: 'ರೈತರ ಲಾಗಿನ್ / ನೋಂದಣಿ',
    landingBtnStaff: 'ಅಧಿಕಾರಿಗಳ ಲಾಗಿನ್',
    freeService: 'ಉಚಿತ ಸರ್ಕಾರಿ ಸೇವೆ',
    journeyTitle: '6-ಹಂತಗಳ ಡಿಜಿಟಲ್ ಖರೀದಿ ಪ್ರಕ್ರಿಯೆ',
    journeySubtitle: 'ಮಂಡಿಗಳಲ್ಲಿ ಸರತಿ ಸಾಲುಗಳಿಲ್ಲದೆ ಪಾರದರ್ಶಕವಾಗಿ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಲು ರೂಪಿಸಲಾಗಿದೆ.',
    step1Title: 'ರೈತರ ನೋಂದಣಿ ಮತ್ತು ಲಾಗಿನ್',
    step1Desc: 'ಆಧಾರ್ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬಳಸಿ ಸುಲಭವಾಗಿ ಲಾಗಿನ್ ಆಗಿ. ಸಂಕೀರ್ಣ ಪಾಸ್‌ವರ್ಡ್ ಬೇಡ.',
    step2Title: 'ಕೇಂದ್ರ ಹುಡುಕಿ ಮತ್ತು ಬೆಳೆ ಆಯ್ಕೆ',
    step2Desc: 'ನಿಮ್ಮ ತಾಲೂಕಿನ ಸಮೀಪದ ಕೇಂದ್ರವನ್ನು ಹುಡುಕಿ. ಬೆಂಬಲ ಬೆಲೆ (MSP) ಹೊಂದಿರುವ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ.',
    step3Title: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯದ ಸ್ಲಾಟ್',
    step3Desc: 'ನಿಮ್ಮ ಕೊಯ್ಲು ಮತ್ತು ವಾಹನ ಸಾಗಾಟಕ್ಕೆ ಸರಿಹೊಂದುವ 1 ಗಂಟೆಯ ಸಮಯದ ಸ್ಲಾಟ್ ಆರಿಸಿ.',
    step4Title: 'ತಕ್ಷಣದ ಡಿಜಿಟಲ್ ಟೋಕನ್',
    step4Desc: 'ಗೇಟ್ ಪ್ರವೇಶಕ್ಕೆ ಅಧಿಕೃತ ಬುಕಿಂಗ್ ಟೋಕನ್ ಸಂಖ್ಯೆ ಪಡೆಯಿರಿ (ಉದಾ: AV-2026-00125).',
    step5Title: 'ಪ್ರಕ್ರಿಯೆ ಸ್ಥಿತಿ ಟ್ರ್ಯಾಕಿಂಗ್',
    step5Desc: 'ಆಗಮನ, ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ, ತೂಕ ಮತ್ತು ಹಣ ಪಾವತಿ ಹಂತಗಳನ್ನು ನೇರವಾಗಿ ವೀಕ್ಷಿಸಿ.',
    step6Title: 'ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಣ (DBT)',
    step6Desc: 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಬೆಂಬಲ ಬೆಲೆ ಹಣ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ.',

    loginHeading: 'ರೈತರ ಲಾಗಿನ್',
    loginSubtitle: 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಆಧಾರ್ ಸಂಖ್ಯೆ ಅಥವಾ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಬಳಸಿ ಲಾಗಿನ್ ಆಗಿ.',
    tabMobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    labelMobile: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (10 ಅಂಕಿಗಳು)',
    hintMobile: 'ನಿಮ್ಮ ನೋಂದಾಯಿತ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.',
    btnContinue: 'ಮುಂದುವರಿಯಿರಿ',
    newFarmerPrompt: 'ಹೊಸ ರೈತರೇ?',
    registerHere: 'ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ',
    invalidLoginError: 'ತಪ್ಪಾದ ವಿವರಗಳು. ದಯವಿಟ್ಟು ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    demoTesting: 'ಡೆಮೊ ಪರೀಕ್ಷಾ ಲಾಗಿನ್:',

    regTitle: 'ರೈತರ ನೋಂದಣಿ',
    regSubtitle: 'ಬೆಳೆ ಸಂಗ್ರಹಣಾ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಲು ನಿಮ್ಮ ಗುರುತು ಮತ್ತು ಸ್ಥಳ ವಿವರ ನಮೂದಿಸಿ.',
    autoFillDemo: '⚡ ಡೆಮೊ ವಿವರಗಳನ್ನು ಸ್ವಯಂ ಭರ್ತಿ ಮಾಡಿ',
    personalInfoTitle: '1. ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ',
    locationTitle: '2. ಸ್ಥಳ ಮತ್ತು ವಿಳಾಸ',
    preferencesTitle: '3. ಆದ್ಯತೆಗಳು',
    labelFullName: 'ಪೂರ್ಣ ಹೆಸರು',
    labelVillage: 'ಗ್ರಾಮ / ಪಂಚಾಯತಿ',
    labelAddress: 'ವಿಳಾಸ / ಬೀದಿ',
    labelDistrict: 'ಜಿಲ್ಲೆ',
    labelTaluk: 'ತಾಲೂಕು',
    labelPreferredLang: 'ಆದ್ಯತೆಯ ಭಾಷೆ',
    btnCompleteReg: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ',
    alreadyRegistered: 'ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?',
    loginLink: 'ರೈತರ ಲಾಗಿನ್',
    regSuccessTitle: 'ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ',
    regSuccessSubtitle: 'ನಿಮ್ಮ ಅಧಿಕೃತ ರೈತ ಖಾತೆಯನ್ನು ಸೃಷ್ಟಿಸಲಾಗಿದೆ.',
    assignedFarmerId: 'ರೈತ ಐಡಿ (Farmer ID)',
    btnProceedDashboard: 'ರೈತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ',

    seasonBadge: 'ಖಾರಿಫ್ / ರಬಿ ಖರೀದಿ ಹಂಗಾಮು 2026',
    welcomeFarmer: 'ಸ್ವಾಗತ',
    welcomeSub: 'ನಿಮ್ಮ ಕೃಷಿ ಉತ್ಪನ್ನ ಸಂಗ್ರಹಣೆಯನ್ನು ಸುಲಭವಾಗಿ ನಿರ್ವಹಿಸಿ.',
    farmerIdLabel: 'ರೈತ ಐಡಿ',
    mobileLabel: 'ಮೊಬೈಲ್',
    talukLabel: 'ಗ್ರಾಮ/ತಾಲೂಕು',
    btnViewProfile: 'ಪ್ರೊಫೈಲ್ ನೋಡಿ',
    activeTokenTitle: 'ಸಕ್ರಿಯ ಖರೀದಿ ಟೋಕನ್',
    btnViewToken: 'ಡಿಜಿಟಲ್ ಟೋಕನ್ ವೀಕ್ಷಿಸಿ',
    btnTrackLive: 'ಸ್ಥಿತಿ ವೀಕ್ಷಿಸಿ',
    servicesHeading: 'ಸಂಗ್ರಹಣಾ ಸೇವೆಗಳು',
    servicesSubtitle: 'ಸರ್ಕಾರಿ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಲು ಕೆಳಗಿನ ಸೇವೆ ಆರಿಸಿ.',

    cardFindTitle: 'ಖರೀದಿ ಕೇಂದ್ರ ಹುಡುಕಿ',
    cardFindDesc: 'ಜಿಪಿಎಸ್ ಅಥವಾ ಜಿಲ್ಲೆ, ತಾಲೂಕು ಮೂಲಕ ಹತ್ತಿರದ ಮಂಡಿ ಕೇಂದ್ರಗಳನ್ನು ಹುಡುಕಿ.',
    cardBookTitle: 'ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿ',
    cardBookDesc: 'ಬೆಳೆ, ದಿನಾಂಕ ಮತ್ತು ವಾಹನ ಇಳಿಸುವ 1 ಗಂಟೆಯ ಸಮಯದ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ.',
    cardTokenTitle: 'ನನ್ನ ಡಿಜಿಟಲ್ ಟೋಕನ್',
    cardTokenDesc: 'ಅಧಿಕೃತ ಗೇಟ್ ಪಾಸ್ ಟೋಕನ್ ವೀಕ್ಷಿಸಿ, ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಪ್ರಿಂಟ್ ಮಾಡಿ.',
    cardTrackTitle: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    cardTrackDesc: 'ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ, ತೂಕ ಮತ್ತು ಬ್ಯಾಂಕ್ ಜಮೆ ಹಂತಗಳನ್ನು ನೇರವಾಗಿ ನೋಡಿ.',
    cardHistoryTitle: 'ಬುಕಿಂಗ್ ಇತಿಹಾಸ',
    cardHistoryDesc: 'ಹಿಂದಿನ ಹಾಗೂ ಪೂರ್ಣಗೊಂಡ ಬೆಳೆ ಖರೀದಿ ರಸೀದಿಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    cardProfileTitle: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    cardProfileDesc: 'ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ, ಆಧಾರ್, ವಿಳಾಸ ಮತ್ತು ಭಾಷೆಯನ್ನು ನವೀಕರಿಸಿ.',

    findTitle: 'ಖರೀದಿ ಕೇಂದ್ರ ಹುಡುಕಿ',
    findSubtitle: 'ನಿಮ್ಮ ಹತ್ತಿರದ ಅಧಿಕೃತ ಬೆಂಬಲ ಬೆಲೆ ಖರೀದಿ ಕೇಂದ್ರವನ್ನು ಸುಲಭವಾಗಿ ಪತ್ತೆಹಚ್ಚಿ.',
    opt1NearMe: 'ಆಯ್ಕೆ 1 — ಸ್ವಯಂಚಾಲಿತ ಸ್ಥಳ ಶೋಧನೆ',
    opt1Desc: 'ನಿಮ್ಮ ಸ್ಥಳದಿಂದ 25 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಸಕ್ರಿಯ ಕೇಂದ್ರಗಳನ್ನು ಪತ್ತೆಹಚ್ಚಿ.',
    btnNearMe: 'ನನ್ನ ಸಮೀಪ ಹುಡುಕಿ',
    nearMeLocating: 'ಜಿಪಿಎಸ್ ಮೂಲಕ ಹತ್ತಿರದ ಮಂಡಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    nearbyFound: '25 ಕಿಮೀ ವ್ಯಾಪ್ತಿಯಲ್ಲಿರುವ ಸಮೀಪದ ಖರೀದಿ ಕೇಂದ್ರಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.',
    opt2Hierarchy: 'ಆಯ್ಕೆ 2 — ಜಿಲ್ಲೆ/ತಾಲೂಕು ಮೂಲಕ ಆಯ್ಕೆ',
    hierDistrict: 'ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ',
    hierTaluk: 'ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ',
    hierCentre: 'ಖರೀದಿ ಕೇಂದ್ರ',
    activeHierarchy: 'ಆಯ್ದ ಹಂತಗಳು',
    resetFilters: 'ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ',
    availCentresTitle: 'ಲಭ್ಯವಿರುವ ಖರೀದಿ ಕೇಂದ್ರಗಳು',
    selectCenterPrompt: 'ಬೆಳೆಗಳು ಮತ್ತು ಸ್ಲಾಟ್‌ಗಳನ್ನು ನೋಡಲು ಕೇಂದ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    btnSelectCenter: 'ಕೇಂದ್ರ ಆಯ್ಕೆಮಾಡಿ',
    btnSelectedCenter: 'ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
    btnBookAtCenter: 'ಈ ಕೇಂದ್ರದಲ್ಲಿ ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ',
    cropsSupported: 'ಖರೀದಿಗೆ ಲಭ್ಯವಿರುವ ಬೆಳೆಗಳು:',
    chooseCropPrompt: 'ಈ ಕೇಂದ್ರದಲ್ಲಿ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ (ಬೆಂಬಲ ಬೆಲೆ ಸಹಿತ):',

    stepCenter: 'ಕೇಂದ್ರ',
    stepCrop: 'ಬೆಳೆ',
    stepDate: 'ದಿನಾಂಕ',
    stepSlot: 'ಸಮಯದ ಸ್ಲಾಟ್',
    stepReview: 'ಪರಿಶೀಲನೆ',
    stepConfirm: 'ದೃಢೀಕರಣ',
    estQuantity: 'ಅಂದಾಜು ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್‌ಗಳಲ್ಲಿ)',
    slotsRemaining: 'ಸ್ಲಾಟ್‌ಗಳು ಲಭ್ಯವಿದೆ',
    btnContinueNext: 'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ',
    btnBack: 'ಹಿಂದೆ',
    reviewTitle: 'ಬುಕಿಂಗ್ ವಿವರಗಳ ಪರಿಶೀಲನೆ',
    reviewSub: 'ದೃಢೀಕರಿಸುವ ಮೊದಲು ನಿಮ್ಮ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    estDbtValue: 'ಅಂದಾಜು ಬೆಂಬಲ ಬೆಲೆ ಮೊತ್ತ (DBT)',
    readyToConfirm: 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲು ಸಿದ್ಧರಿದ್ದೀರಾ?',
    confirmNotice: 'ದಯವಿಟ್ಟು ಮಂಡಿಗೆ ತರುವ ಮುನ್ನ ಧಾನ್ಯವನ್ನು FAQ ತೇವಾಂಶಕ್ಕೆ ತಕ್ಕಂತೆ ಒಣಗಿಸಿ.',
    btnConfirmGenerate: 'ದೃಢೀಕರಿಸಿ ಮತ್ತು ಟೋಕನ್ ಪಡೆಯಿರಿ',

    bookingConfirmedTitle: 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    bookingConfirmedSub: 'ನಿಮ್ಮ ಕೊಯ್ಲು ವಿತರಣಾ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಮಂಡಿ ಗೇಟ್‌ನಲ್ಲಿ ಡಿಜಿಟಲ್ ಟೋಕನ್ ತೋರಿಸಿ.',
    procurementSlotReserved: 'ಸರ್ಕಾರಿ ಬೆಳೆ ಖರೀದಿ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
    tokenNumberLabel: 'ಅಧಿಕೃತ ಬುಕಿಂಗ್ ಟೋಕನ್ ಸಂಖ್ಯೆ',
    bookingRefLabel: 'ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ',
    btnPrintToken: 'ಟೋಕನ್ ಪ್ರಿಂಟ್ ಮಾಡಿ',
    btnDownload: 'ಪಾಸ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    mandiPassNotice: 'ನಿಗದಿತ ಸಮಯಕ್ಕಿಂತ 15 ನಿಮಿಷ ಮುಂಚಿತವಾಗಿ ತಲುಪಿ. ಮೂಲ ಆಧಾರ್ ಮತ್ತು ಪಹಣಿ ತರಲು ಮರೆಯಬೇಡಿ.',
    farmerName: 'ರೈತರ ಹೆಸರು',
    deliveryCenter: 'ಖರೀದಿ ಕೇಂದ್ರ',
    cropForDelivery: 'ವಿತರಿಸುವ ಬೆಳೆ',
    appointmentSchedule: 'ನಿಗದಿತ ಸಮಯ',
    btnViewMyToken: 'ಟೋಕನ್ ಪಾಸ್ ವೀಕ್ಷಿಸಿ/ಮುದ್ರಿಸಿ',
    btnTrackMilestones: 'ಸ್ಥಿತಿ ನೇರವಾಗಿ ವೀಕ್ಷಿಸಿ',
    btnBackDashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ',

    noActiveTokenTitle: 'ಸಕ್ರಿಯ ಟೋಕನ್ ಲಭ್ಯವಿಲ್ಲ',
    noActiveTokenDesc: 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಸ್ಲಾಟ್ ಕಾಯ್ದಿರಿಸಿಲ್ಲ. ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಟೋಕನ್ ಪಡೆಯಲು ಸ್ಲಾಟ್ ಬುಕ್ ಮಾಡಿ.',
    tokenPassHeader: 'ನಿಮ್ಮ ಖರೀದಿ ಟೋಕನ್ ಪಾಸ್',
    tokenPassSubtitle: 'ಅಧಿಕೃತ ಮಂಡಿ ಗೇಟ್ ಪಾಸ್ ಮತ್ತು ತೂಕದ ಯಂತ್ರ ಅಧಿಕೃತತೆ',
    tokenPassGovTitle: 'ಕರ್ನಾಟಕ ಸರ್ಕಾರ — ಕೃಷಿ ಉತ್ಪನ್ನ ಸಂಗ್ರಹಣೆ',
    tokenPassGovSub: 'ಸ್ಮಾರ್ಟ್ ಡಿಜಿಟಲ್ ಖರೀದಿ ಟೋಕನ್ ಪಾಸ್',
    dateOfIssue: 'ವಿತರಿಸಿದ ದಿನಾಂಕ',
    scheduledTimeSlot: 'ನಿಗದಿತ ಸಮಯದ ಸ್ಲಾಟ್',
    instructionsTitle: 'ಮಂಡಿ ಪ್ರಾಂಗಣ ಪ್ರವೇಶ ಸೂಚನೆಗಳು:',
    instruction1: 'ಮೂಲ ರೈತ ಗುರುತಿನ ಚೀಟಿ, ಪಹಣಿ (RTC) ಮತ್ತು ಆಧಾರ್ ಪ್ರತಿ ತನ್ನಿ.',
    instruction2: 'ತೂಕದ ದೃಢೀಕರಣಕ್ಕಾಗಿ ಗೇಟ್ 1 ರಲ್ಲಿ ಈ ಟೋಕನ್ ಸಂಖ್ಯೆ ತಿಳಿಸಿ.',
    instruction3: 'ನಿಗದಿಪಡಿಸಿದ 1 ಗಂಟೆಯ ಸಮಯದೊಳಗೆ ಕಡ್ಡಾಯವಾಗಿ ಹಾಜರಿರಿ.',

    trackTitle: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    trackSubtitle: 'ಮಂಡಿಯಲ್ಲಿ ನಿಮ್ಮ ಬೆಳೆ ಪರಿಶೀಲನಾ ಹಂತಗಳನ್ನು ನೇರವಾಗಿ ಗಮನಿಸಿ.',
    searchTokenPlaceholder: 'ಟೋಕನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಉದಾ: AV-2026-00125)',
    btnTrackToken: 'ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ',
    tryDemoTokens: 'ಉದಾಹರಣೆ ಟೋಕನ್‌ಗಳು:',
    processTimelineTitle: 'ಖರೀದಿ ಪ್ರಕ್ರಿಯೆಯ ಹಂತಗಳು',
    inProgressAtMandi: 'ಪ್ರಸ್ತುತ ಮಂಡಿಯಲ್ಲಿ ಪ್ರಕ್ರಿಯೆ ನಡೆಯುತ್ತಿದೆ',

    statusConfirmed: 'ಬುಕಿಂಗ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ',
    statusArrived: 'ರೈತರು ಆಗಮಿಸಿದ್ದಾರೆ',
    statusQuality: 'ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ',
    statusProcessing: 'ತೂಕ ಮತ್ತು ಪ್ರಕ್ರಿಯೆ',
    statusCompleted: 'ಖರೀದಿ ಪೂರ್ಣಗೊಂಡಿದೆ (DBT)',

    historyTitle: 'ಬುಕಿಂಗ್ ಇತಿಹಾಸ',
    historySubtitle: 'ನಿಮ್ಮ ಹಿಂದಿನ ಮತ್ತು ಸಕ್ರಿಯ ಖರೀದಿ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
    btnNewBooking: 'ಹೊಸ ಸ್ಲಾಟ್ ಬುಕಿಂಗ್',
    colToken: 'ಟೋಕನ್ ಸಂಖ್ಯೆ',
    colDateSlot: 'ದಿನಾಂಕ ಮತ್ತು ಸಮಯ',
    colCentre: 'ಖರೀದಿ ಕೇಂದ್ರ',
    colCropQty: 'ಬೆಳೆ ಮತ್ತು ಪ್ರಮಾಣ',
    colStatus: 'ಸ್ಥಿತಿ',
    colActions: 'ಕ್ರಮಗಳು',
    actionViewToken: 'ಟೋಕನ್',
    actionTrack: 'ಟ್ರ್ಯಾಕ್',
    noBookingsFound: 'ಯಾವುದೇ ಬುಕಿಂಗ್ ವಿವರಗಳು ಕಂಡುಬಂದಿಲ್ಲ.',

    profileTitle: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    profileSubtitle: 'ನಿಮ್ಮ ರೈತ ಗುರುತು, ಮೊಬೈಲ್, ಆಧಾರ್ ಹಾಗೂ ಕೃಷಿ ವಿಳಾಸವನ್ನು ವೀಕ್ಷಿಸಿ ಮತ್ತು ಬದಲಾಯಿಸಿ.',
    btnEditProfile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    profileUpdatedSuccess: 'ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ',
    accountInfoTitle: 'ಖಾತೆ ಮಾಹಿತಿ',
    regDateLabel: 'ನೋಂದಣಿ ದಿನಾಂಕ',
    btnSaveChanges: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    btnCancel: 'ರದ್ದುಮಾಡಿ',

    logout: 'ಲಾಗ್‌ಔಟ್',
  
  },

  // ================= HINDI (हिन्दी) =================
  hi: {
    platformTitle: 'स्मार्ट कृषि खरीद प्रबंधन मंच',
    portalSubtitle: 'प्रत्यक्ष किसान खरीद एवं डिजिटल टोकन प्रणाली',
    staffPortalSubtitle: 'अधिकारी एवं केंद्र प्रबंधन पोर्टल',
    dpiBadge: 'कृषि के लिए डिजिटल सार्वजनिक अवसंरचना',
    kisanHelpline: 'किसान सहायता हेल्पलाइन',
    helplineTimes: 'टोल-फ्री किसान कॉल सेंटर (सुबह 06:00 – रात 10:00)',
    mspGuarantee: '100% न्यूनतम समर्थन मूल्य (MSP) गारंटी',
    dbtAssurance: 'प्रत्यक्ष लाभ अंतरण (DBT) बैंक खाते में',
    weighbridgeCertified: 'इलेक्ट्रॉनिक वे-ब्रिज प्रमाणन',
    switchRoleToStaff: 'स्टाफ पोर्टल',
    switchRoleToFarmer: 'किसान पोर्टल',
    farmerPortal: 'किसान पोर्टल',
    staffPortal: 'स्टाफ पोर्टल',
    home: 'होम',
    footerDesc: 'स्मार्ट कृषि खरीद प्रबंधन मंच — भारतीय किसानों को पारदर्शी स्लॉट बुकिंग, लाइव स्थिति ट्रैकिंग और सीधे बैंक खाते में एमएसपी भुगतान की सुविधा।',
    kisanHelplineSchedule: 'टोल-फ्री किसान कॉल सेंटर • सोम-शनि (सुबह 06:00 – रात 10:00) 22 क्षेत्रीय भाषाओं में।',
    fairPriceAssuranceTitle: 'उचित मूल्य एवं प्रत्यक्ष लाभ अंतरण गारंटी',
    footerHackathon: 'भारत कृषि सेवा • स्मार्ट कृषि मंच',
    footerDpi: 'भारतीय डिजिटल सार्वजनिक अवसंरचना (DPI) मानकों के अनुरूप',

    navDashboard: 'डैशबोर्ड',
    navFindCenter: 'खरीद केंद्र खोजें',
    navBookSlot: 'स्लॉट बुक करें',
    navMyToken: 'मेरा डिजिटल टोकन',
    navTrackStatus: 'स्थिति ट्रैक करें',
    navHistory: 'इतिहास',
    navProfile: 'मेरी प्रोफ़ाइल',

    staffNavDashboard: 'डैशबोर्ड',
    staffNavFarmers: 'किसान रिकॉर्ड',
    staffNavCentres: 'खरीद केंद्र',
    staffNavSlots: 'स्लॉट प्रबंधन',
    staffNavTokens: 'टोकन सत्यापन',
    staffNavProcurement: 'खरीद रिकॉर्ड',
    staffNavReports: 'रिपोर्ट्स',
    staffNavSettings: 'सेटिंग्स',

    landingBadge: 'कृषि मंडियों के लिए डिजिटल सार्वजनिक सेवा',
    landingTitle: 'स्मार्ट कृषि खरीद प्रबंधन मंच',
    landingSubtitle: 'एक सरल डिजिटल प्लेटफॉर्म जो किसानों को खरीद केंद्र खोजने, उपलब्ध समय स्लॉट चुनने, डिजिटल टोकन प्राप्त करने और खरीद प्रक्रिया ट्रैक करने में मदद करता है।',
    landingBtnFarmer: 'किसान लॉगिन / पंजीकरण',
    landingBtnStaff: 'स्टाफ लॉगिन',
    freeService: 'निःशुल्क सरकारी सेवा',
    journeyTitle: '6-चरणीय डिजिटल खरीद प्रक्रिया',
    journeySubtitle: 'मंडियों में बिना कतारों के आसान और पारदर्शी फसल बिक्री के लिए निर्मित।',
    step1Title: 'किसान पंजीकरण एवं लॉगिन',
    step1Desc: 'आधार या मोबाइल नंबर से तुरंत लॉगिन करें। कोई जटिल पासवर्ड नहीं।',
    step2Title: 'केंद्र खोजें और फसल चुनें',
    step2Desc: 'अपनी तहसील में निकटतम केंद्र खोजें और न्यूनतम समर्थन मूल्य (MSP) वाली फसल चुनें।',
    step3Title: 'दिनांक और समय स्लॉट चुनें',
    step3Desc: 'अपनी कटाई और वाहन के अनुसार 1 घंटे का उपयुक्त समय स्लॉट चुनें।',
    step4Title: 'त्वरित डिजिटल टोकन',
    step4Desc: 'मंडी गेट पर प्रवेश के लिए आधिकारिक टोकन संख्या प्राप्त करें।',
    step5Title: 'खरीद स्थिति ट्रैक करें',
    step5Desc: 'आगमन, गुणवत्ता परीक्षण, वजन और भुगतान चरणों को लाइव देखें।',
    step6Title: 'सीधे बैंक खाते में MSP भुगतान',
    step6Desc: 'बिना बिचौलियों के सरकारी समर्थन मूल्य सीधे आधार से जुड़े खाते में।',

    loginHeading: 'किसान लॉगिन',
    loginSubtitle: 'अपने पंजीकृत आधार नंबर या मोबाइल नंबर का उपयोग करके लॉगिन करें।',
    tabMobile: 'मोबाइल नंबर',
    labelMobile: 'मोबाइल नंबर (10 अंक)',
    hintMobile: 'अपना पंजीकृत 10 अंकों का मोबाइल नंबर दर्ज करें।',
    btnContinue: 'आगे बढ़ें',
    newFarmerPrompt: 'नए किसान?',
    registerHere: 'यहाँ पंजीकरण करें',
    invalidLoginError: 'गलत विवरण। कृपया अपना नंबर जांचें और पुनः प्रयास करें।',
    demoTesting: 'डेमो परीक्षण लॉगिन:',

    regTitle: 'किसान पंजीकरण',
    regSubtitle: 'उपज खरीद स्लॉट बुक करने के लिए अपनी पहचान और पता दर्ज करें।',
    autoFillDemo: '⚡ डेमो विवरण स्वतः भरें',
    personalInfoTitle: '1. व्यक्तिगत जानकारी',
    locationTitle: '2. स्थान एवं खेत का पता',
    preferencesTitle: '3. प्राथमिकताएं',
    labelFullName: 'पूरा नाम',
    labelVillage: 'गाँव / ग्राम पंचायत',
    labelAddress: 'विस्तृत पता / सड़क',
    labelDistrict: 'ज़िला',
    labelTaluk: 'तहसील / ब्लॉक',
    labelPreferredLang: 'पसंदीदा भाषा',
    btnCompleteReg: 'पंजीकरण पूर्ण करें',
    alreadyRegistered: 'पहले से पंजीकृत हैं?',
    loginLink: 'किसान लॉगिन',
    regSuccessTitle: 'पंजीकरण सफल',
    regSuccessSubtitle: 'आपका आधिकारिक किसान खाता बना दिया गया है।',
    assignedFarmerId: 'किसान आईडी (Farmer ID)',
    btnProceedDashboard: 'किसान डैशबोर्ड पर जाएँ',

    seasonBadge: 'खरीफ / रबी खरीद सत्र 2026',
    welcomeFarmer: 'स्वागत है',
    welcomeSub: 'अपनी कृषि उपज की बिक्री आसानी से प्रबंधित करें।',
    farmerIdLabel: 'किसान आईडी',
    mobileLabel: 'मोबाइल',
    talukLabel: 'गाँव/तहसील',
    btnViewProfile: 'प्रोफ़ाइल देखें',
    activeTokenTitle: 'सक्रिय खरीद टोकन',
    btnViewToken: 'डिजिटल टोकन देखें',
    btnTrackLive: 'लाइव स्थिति ट्रैक करें',
    servicesHeading: 'खरीद सेवाएं',
    servicesSubtitle: 'सरकारी एपीएमसी मंडी में फसल बेचने के लिए नीचे दी गई सेवा चुनें।',

    cardFindTitle: 'खरीद केंद्र खोजें',
    cardFindDesc: 'जीपीएस या ज़िला, तहसील चुनकर निकटतम मंडी केंद्र खोजें।',
    cardBookTitle: 'खरीद स्लॉट बुक करें',
    cardBookDesc: 'फसल, तारीख और वाहन खाली करने का 1 घंटे का समय चुनें।',
    cardTokenTitle: 'मेरा डिजिटल टोकन',
    cardTokenDesc: 'आधिकारिक मंडी पास देखें, डाउनलोड या प्रिंट करें।',
    cardTrackTitle: 'स्थिति ट्रैक करें',
    cardTrackDesc: 'गुणवत्ता परीक्षण, तौल और डीबीटी भुगतान की स्थिति लाइव देखें।',
    cardHistoryTitle: 'बुकिंग इतिहास',
    cardHistoryDesc: 'अपनी पिछली और पूर्ण हो चुकी खरीद रसीदों की समीक्षा करें।',
    cardProfileTitle: 'मेरी प्रोफ़ाइल',
    cardProfileDesc: 'अपनी व्यक्तिगत जानकारी, पता और भाषा सेटिंग्स अपडेट करें।',

    findTitle: 'खरीद केंद्र खोजें',
    findSubtitle: 'जीपीएस या प्रशासनिक चयन से निकटतम आधिकारिक एमएसपी मंडी खोजें।',
    opt1NearMe: 'विकल्प 1 — स्वचालित स्थान खोज',
    opt1Desc: 'अपने 25 किमी के दायरे में स्थित सक्रिय केंद्रों का पता लगाएं।',
    btnNearMe: 'मेरे नज़दीक खोजें',
    nearMeLocating: 'जीपीएस से नजदीकी केंद्र खोजा जा रहा है...',
    nearbyFound: '25 किमी के दायरे में निकटतम खरीद केंद्र पाए गए।',
    opt2Hierarchy: 'विकल्प 2 — ज़िला और तहसील अनुसार चयन',
    hierDistrict: 'ज़िला चुनें',
    hierTaluk: 'तहसील चुनें',
    hierCentre: 'खरीद केंद्र',
    activeHierarchy: 'सक्रिय चयन',
    resetFilters: 'फ़िल्टर हटाएं',
    availCentresTitle: 'उपलब्ध खरीद केंद्र',
    selectCenterPrompt: 'फसलें और स्लॉट देखने के लिए केंद्र चुनें',
    btnSelectCenter: 'केंद्र चुनें',
    btnSelectedCenter: 'केंद्र चुना गया',
    btnBookAtCenter: 'इस केंद्र पर स्लॉट बुक करें',
    cropsSupported: 'खरीद के लिए उपलब्ध फसलें:',
    chooseCropPrompt: 'इस केंद्र पर अपनी फसल चुनें (एमएसपी दर सहित):',

    stepCenter: 'केंद्र',
    stepCrop: 'फसल',
    stepDate: 'दिनांक',
    stepSlot: 'समय स्लॉट',
    stepReview: 'समीक्षा',
    stepConfirm: 'पुष्टि',
    estQuantity: 'अनुमानित मात्रा (क्विंटल में)',
    slotsRemaining: 'स्लॉट शेष',
    btnContinueNext: 'अगले चरण पर बढ़ें',
    btnBack: 'पीछे',
    reviewTitle: 'बुकिंग विवरण की समीक्षा',
    reviewSub: 'पुष्टि करने से पहले अपने अपॉइंटमेंट विवरण की जांच करें।',
    estDbtValue: 'अनुमानित एमएसपी राशि (DBT)',
    readyToConfirm: 'क्या आप बुकिंग की पुष्टि के लिए तैयार हैं?',
    confirmNotice: 'कृपया मंडी आने से पहले अपनी फसल को एफएक्यू नमी मानकों के अनुसार सुखा लें।',
    btnConfirmGenerate: 'पुष्टि करें और टोकन प्राप्त करें',

    bookingConfirmedTitle: 'बुकिंग की पुष्टि हो गई',
    bookingConfirmedSub: 'आपका उपज वितरण स्लॉट आरक्षित हो गया है। मंडी गेट पर अपना डिजिटल टोकन दिखाएं।',
    procurementSlotReserved: 'सरकारी खरीद स्लॉट सफलतापूर्वक आरक्षित',
    tokenNumberLabel: 'आधिकारिक बुकिंग संदर्भ एवं टोकन संख्या',
    bookingRefLabel: 'संदर्भ संख्या',
    btnPrintToken: 'टोकन प्रिंट करें',
    btnDownload: 'पास डाउनलोड करें',
    mandiPassNotice: 'निर्धारित समय से 15 मिनट पहले पहुंचें। मूल आधार और खतौनी साथ लाना न भूलें।',
    farmerName: 'किसान का नाम',
    deliveryCenter: 'खरीद केंद्र',
    cropForDelivery: 'वितरित फसल',
    appointmentSchedule: 'निर्धारित समय',
    btnViewMyToken: 'टोकन पास देखें/प्रिंट करें',
    btnTrackMilestones: 'लाइव स्थिति ट्रैक करें',
    btnBackDashboard: 'डैशबोर्ड पर लौटें',

    noActiveTokenTitle: 'कोई सक्रिय डिजिटल टोकन नहीं',
    noActiveTokenDesc: 'आपने अभी तक कोई स्लॉट बुक नहीं किया है। डिजिटल टोकन पास प्राप्त करने के लिए स्लॉट बुक करें।',
    tokenPassHeader: 'आपका खरीद टोकन पास',
    tokenPassSubtitle: 'आधिकारिक मंडी प्रवेश पास एवं धर्मकांटा अनुमति',
    tokenPassGovTitle: 'कर्नाटक सरकार — कृषि उत्पाद खरीद',
    tokenPassGovSub: 'स्मार्ट डिजिटल खरीद टोकन पास',
    dateOfIssue: 'जारी करने की तिथि',
    scheduledTimeSlot: 'निर्धारित समय स्लॉट',
    instructionsTitle: 'मंडी प्रांगण प्रवेश निर्देश:',
    instruction1: 'मूल किसान पहचान पत्र, खतौनी एवं आधार कार्ड की प्रति साथ लाएं।',
    instruction2: 'धर्मकांटा तौल अनुमति हेतु गेट 1 पर यह टोकन नंबर बताएं।',
    instruction3: 'आवंटित 1 घंटे के समय स्लॉट के भीतर ही मंडी प्रांगण पहुंचें।',

    trackTitle: 'स्थिति ट्रैक करें',
    trackSubtitle: 'मंडी में अपनी फसल खरीद के प्रत्येक चरण पर लाइव नज़र रखें।',
    searchTokenPlaceholder: 'टोकन नंबर दर्ज करें (उदा. AV-2026-00125)',
    btnTrackToken: 'टोकन ट्रैक करें',
    tryDemoTokens: 'डेमो टोकन:',
    processTimelineTitle: 'खरीद प्रक्रिया समयरेखा',
    inProgressAtMandi: 'वर्तमान में मंडी में प्रक्रिया जारी है',

    statusConfirmed: 'बुकिंग पुष्ट',
    statusArrived: 'किसान का आगमन',
    statusQuality: 'गुणवत्ता परीक्षण',
    statusProcessing: 'तौल एवं खरीद प्रक्रिया',
    statusCompleted: 'खरीद पूर्ण (DBT भुगतान)',

    historyTitle: 'बुकिंग इतिहास',
    historySubtitle: 'अपनी पिछली और सक्रिय खरीद नियुक्तियों की समीक्षा करें।',
    btnNewBooking: 'नई स्लॉट बुकिंग',
    colToken: 'टोकन नंबर',
    colDateSlot: 'दिनांक एवं स्लॉट',
    colCentre: 'खरीद केंद्र',
    colCropQty: 'फसल एवं मात्रा',
    colStatus: 'स्थिति',
    colActions: 'कार्रवाई',
    actionViewToken: 'टोकन',
    actionTrack: 'ट्रैक',
    noBookingsFound: 'कोई बुकिंग रिकॉर्ड नहीं मिला।',

    profileTitle: 'मेरी प्रोफ़ाइल',
    profileSubtitle: 'अपनी किसान पहचान, मोबाइल, आधार और खेत का पता देखें एवं संशोधित करें।',
    btnEditProfile: 'प्रोफ़ाइल संपादित करें',
    profileUpdatedSuccess: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई',
    accountInfoTitle: 'खाता जानकारी',
    regDateLabel: 'पंजीकरण दिनांक',
    btnSaveChanges: 'बदलाव सहेजें',
    btnCancel: 'रद्द करें',

    logout: 'लॉग आउट',
  
  },

  // ================= TELUGU (తెలుగు) =================
  te: {
    platformTitle: 'స్మార్ట్ వ్యవసాయ సేకరణ వేదిక',
    portalSubtitle: 'రైతుల ప్రత్యక్ష పంట సేకరణ మరియు టోకెన్ వ్యవస్థ',
    staffPortalSubtitle: 'అధికారులు మరియు కేంద్ర నిర్వహణ పోర్టల్',
    dpiBadge: 'వ్యవసాయం కోసం డిజిటల్ పబ్లిక్ సర్వీస్',
    kisanHelpline: 'రైతు సహాయవాణి (టోల్-ఫ్రీ)',
    helplineTimes: 'కిసాన్ కాల్ సెంటర్ (ఉదయం 06:00 – రాత్రి 10:00)',
    mspGuarantee: '100% కనీస మద్దతు ధర (MSP) హామీ',
    dbtAssurance: 'బ్యాంకు ఖాతాకు నేరుగా బదిలీ (DBT)',
    weighbridgeCertified: 'ఎలక్ట్రానిక్ వే-బ్రిడ్జ్ ధృవీకరణ',
    switchRoleToStaff: 'సిబ్బంది పోర్టల్',
    switchRoleToFarmer: 'రైతు పోర్టల్',
    farmerPortal: 'రైతు పోర్టల్',
    staffPortal: 'సిబ్బంది పోర్టల్',
    home: 'హోమ్',
    footerDesc: 'స్మార్ట్ వ్యవసాయ సేకరణ వేదిక — భారతీయ రైతులకు పారదర్శక స్లాట్ బుకింగ్, రియల్-టైమ్ ప్రాసెస్ ట్రాకింగ్ మరియు నేరుగా బ్యాంక్ ఖాతాకు MSP చెల్లింపు.',
    kisanHelplineSchedule: 'టోల్-ఫ్రీ కిసాన్ కాల్ సెంటర్ • సోమ-శని (ఉదయం 06:00 – రాత్రి 10:00) 22 ప్రాంతీయ భాషల్లో.',
    fairPriceAssuranceTitle: 'న్యాయమైన ధర మరియు ప్రత్యక్ష నగదు బదిలీ హామీ',
    footerHackathon: 'భారత్ కృషి సేవా • స్మార్ట్ వ్యవసాయ వేదిక',
    footerDpi: 'భారతీయ డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ ప్రమాణాలకు అనుగుణంగా రూపొందించబడింది',

    navDashboard: 'డ్యాష్‌బోర్డ్',
    navFindCenter: 'కేంద్రాన్ని కనుగొనండి',
    navBookSlot: 'స్లాట్ బుక్ చేయండి',
    navMyToken: 'నా డిజిటల్ టోకెన్',
    navTrackStatus: 'స్థితిని ట్రాక్ చేయండి',
    navHistory: 'చరిత్ర',
    navProfile: 'నా ప్రొఫైల్',

    staffNavDashboard: 'డ్యాష్‌బోర్డ్',
    staffNavFarmers: 'రైతుల రికార్డులు',
    staffNavCentres: 'సేకరణ కేంద్రాలు',
    staffNavSlots: 'స్లాట్ నిర్వహణ',
    staffNavTokens: 'టోకెన్ ధృవీకరణ',
    staffNavProcurement: 'సేకరణ రికార్డులు',
    staffNavReports: 'నివేదికలు',
    staffNavSettings: 'సెట్టింగ్‌లు',

    landingBadge: 'వ్యవసాయ మార్కెట్ డిజిటల్ ప్రజా సేవ',
    landingTitle: 'స్మార్ట్ వ్యవసాయ సేకరణ నిర్వహణ వేదిక',
    landingSubtitle: 'రైతులు సులభంగా సేకరణ కేంద్రాలను కనుగొనడానికి, సమయ స్లాట్లను ఎంచుకోవడానికి, డిజిటల్ టోకెన్ పొందడానికి మరియు పంట సేకరణను ట్రాక్ చేయడానికి వేదిక.',
    landingBtnFarmer: 'రైతు లాగిన్ / నమోదు',
    landingBtnStaff: 'సిబ్బంది లాగిన్',
    freeService: 'ఉచిత ప్రభుత్వ సేవ',
    journeyTitle: '6-దశల డిజిటల్ సేకరణ ప్రక్రియ',
    journeySubtitle: 'మార్కెట్లలో వరుసలో వేచి ఉండకుండా సులభంగా పంటను విక్రయించండి.',
    step1Title: 'రైతు నమోదు & లాగిన్',
    step1Desc: 'ఆధార్ లేదా మొబైల్ నంబర్ ఉపయోగించి త్వరగా లాగిన్ అవ్వండి.',
    step2Title: 'కేంద్రం & పంట ఎంపిక',
    step2Desc: 'మీ తాలూకాలోని సమీప కేంద్రాన్ని కనుగొని మద్దతు ధర ఉన్న పంటను ఎంచుకోండి.',
    step3Title: 'తేదీ మరియు సమయం స్లాట్',
    step3Desc: 'మీ పంట కోత మరియు రవాణాకు సరిపోయే 1 గంట సమయ స్లాట్‌ను ఎంచుకోండి.',
    step4Title: 'తక్షణ డిజిటల్ టోకెన్',
    step4Desc: 'మార్కెట్ ప్రవేశానికి అధికారిక బుకింగ్ టోకెన్ పొందండి.',
    step5Title: 'సేకరణ స్థితిని ట్రాక్ చేయండి',
    step5Desc: 'నాణ్యత తనిఖీ, తూకం మరియు చెల్లింపు ప్రక్రియను ప్రత్యక్షంగా చూడండి.',
    step6Title: 'నేరుగా బ్యాంకు ఖాతాలోకి నగదు',
    step6Desc: 'మధ్యవర్తులు లేకుండా ప్రభుత్వ కనీస మద్దతు ధర నేరుగా మీ ఖాతాకు.',

    loginHeading: 'రైతు లాగిన్',
    loginSubtitle: 'మీ నమోదిత ఆధార్ నంబర్ లేదా మొబైల్ నంబర్ ఉపయోగించి లాగిన్ అవ్వండి.',
    tabMobile: 'మొబైల్ నంబర్',
    labelMobile: 'మొబైల్ నంబర్ (10 అంకెలు)',
    hintMobile: 'మీ 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి.',
    btnContinue: 'కొనసాగించండి',
    newFarmerPrompt: 'కొత్త రైతులా?',
    registerHere: 'ఇక్కడ నమోదు చేసుకోండి',
    invalidLoginError: 'చెల్లని వివరాలు. దయచేసి సంఖ్యను తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    demoTesting: 'డెమో లాగిన్:',

    regTitle: 'రైతు నమోదు',
    regSubtitle: 'పంట సేకరణ స్లాట్ బుక్ చేయడానికి వివరాలు నమోదు చేయండి.',
    autoFillDemo: '⚡ డెమో వివరాలను స్వయంచాలకంగా పూరించండి',
    personalInfoTitle: '1. వ్యక్తిగత సమాచారం',
    locationTitle: '2. స్థానం మరియు చిరునామా',
    preferencesTitle: '3. ప్రాధాన్యతలు',
    labelFullName: 'పూర్తి పేరు',
    labelVillage: 'గ్రామం / పంచాయితీ',
    labelAddress: 'పూర్తి చిరునామా',
    labelDistrict: 'జిల్లా',
    labelTaluk: 'తాలూకా / మండలం',
    labelPreferredLang: 'ప్రాధాన్య భాష',
    btnCompleteReg: 'నమోదు పూర్తి చేయండి',
    alreadyRegistered: 'ఇప్పటికే నమోదు చేసుకున్నారా?',
    loginLink: 'రైతు లాగిన్',
    regSuccessTitle: 'నమోదు విజయవంతమైంది',
    regSuccessSubtitle: 'మీ అధికారిక రైతు ఖాతా సృష్టించబడింది.',
    assignedFarmerId: 'రైతు ఐడి (Farmer ID)',
    btnProceedDashboard: 'డ్యాష్‌బోర్డ్‌కు కొనసాగించండి',

    seasonBadge: 'ఖరీఫ్ / రబీ సేకరణ కాలం 2026',
    welcomeFarmer: 'స్వాగతం',
    welcomeSub: 'మీ వ్యవసాయ పంట సేకరణను సులభంగా నిర్వహించండి.',
    farmerIdLabel: 'రైతు ఐడి',
    mobileLabel: 'మొబైల్',
    talukLabel: 'గ్రామం/తాలూకా',
    btnViewProfile: 'ప్రొఫైల్ చూడండి',
    activeTokenTitle: 'క్రియాశీల సేకరణ టోకెన్',
    btnViewToken: 'డిజిటల్ టోకెన్ చూడండి',
    btnTrackLive: 'ప్రత్యక్ష స్థితిని చూడండి',
    servicesHeading: 'సేకరణ సేవలు',
    servicesSubtitle: 'మార్కెట్లో పంట విక్రయించడానికి క్రింది సేవను ఎంచుకోండి.',

    cardFindTitle: 'కేంద్రాన్ని కనుగొనండి',
    cardFindDesc: 'సమీపంలోని మార్కెట్ కేంద్రాలను గుర్తించండి.',
    cardBookTitle: 'స్లాట్ బుక్ చేయండి',
    cardBookDesc: 'పంట, తేదీ మరియు 1 గంట సమయ స్లాట్‌ను ఎంచుకోండి.',
    cardTokenTitle: 'నా డిజిటల్ టోకెన్',
    cardTokenDesc: 'అధికారిక టోకెన్ పాస్ చూడండి లేదా డౌన్‌లోడ్ చేసుకోండి.',
    cardTrackTitle: 'స్థితిని ట్రాక్ చేయండి',
    cardTrackDesc: 'నాణ్యత తనిఖీ మరియు నగదు జమ ప్రక్రియను చూడండి.',
    cardHistoryTitle: 'బుకింగ్ చరిత్ర',
    cardHistoryDesc: 'గత పంట సేకరణ రసీదులను సమీక్షించండి.',
    cardProfileTitle: 'నా ప్రొఫైల్',
    cardProfileDesc: 'వ్యక్తిగత వివరాలు, చిరునామా మరియు భాషను నవీకరించండి.',

    findTitle: 'సేకరణ కేంద్రాన్ని కనుగొనండి',
    findSubtitle: 'మీ సమీప అధికారిక మద్దతు ధర సేకరణ కేంద్రాన్ని గుర్తించండి.',
    opt1NearMe: 'ఎంపిక 1 — ఆటోమేటిక్ స్థాన శోధన',
    opt1Desc: 'మీ 25 కిమీ పరిధిలోని కేంద్రాలను గుర్తించండి.',
    btnNearMe: 'నా సమీపంలో శోధించండి',
    nearMeLocating: 'జీపీఎస్ ద్వారా కేంద్రాలను వెతుకుతోంది...',
    nearbyFound: '25 కిమీ పరిధిలో సమీప కేంద్రాలు గుర్తించబడ్డాయి.',
    opt2Hierarchy: 'ఎంపిక 2 — జిల్లా మరియు తాలూకా ఎంపిక',
    hierDistrict: 'జిల్లా ఎంచుకోండి',
    hierTaluk: 'తాలూకా ఎంచుకోండి',
    hierCentre: 'సేకరణ కేంద్రం',
    activeHierarchy: 'ఎంచుకున్న క్రమం',
    resetFilters: 'ఫిల్టర్లను రీసెట్ చేయండి',
    availCentresTitle: 'అందుబాటులో ఉన్న సేకరణ కేంద్రాలు',
    selectCenterPrompt: 'పంటలు మరియు స్లాట్లను చూడటానికి కేంద్రాన్ని ఎంచుకోండి',
    btnSelectCenter: 'కేంద్రాన్ని ఎంచుకోండి',
    btnSelectedCenter: 'ఎంచుకోబడింది',
    btnBookAtCenter: 'ఈ కేంద్రంలో స్లాట్ బుక్ చేయండి',
    cropsSupported: 'సేకరణకు అందుబాటులో ఉన్న పంటలు:',
    chooseCropPrompt: 'ఈ కేంద్రంలో పంటను ఎంచుకోండి (మద్దతు ధరతో):',

    stepCenter: 'కేంద్రం',
    stepCrop: 'పంట',
    stepDate: 'తేదీ',
    stepSlot: 'సమయం స్లాట్',
    stepReview: 'సమీక్ష',
    stepConfirm: 'ధృవీకరణ',
    estQuantity: 'అంచనా పరిమాణం (క్వింటాళ్లలో)',
    slotsRemaining: 'స్లాట్లు అందుబాటులో ఉన్నాయి',
    btnContinueNext: 'తదుపరి దశకు కొనసాగించండి',
    btnBack: 'వెనుకకు',
    reviewTitle: 'బుకింగ్ వివరాల సమీక్ష',
    reviewSub: 'ధృవీకరించే ముందు మీ వివరాలను తనిఖీ చేయండి.',
    estDbtValue: 'అంచనా మద్దతు ధర విలువ (DBT)',
    readyToConfirm: 'బుకింగ్ ధృవీకరించడానికి సిద్ధంగా ఉన్నారా?',
    confirmNotice: 'మార్కెట్‌కు తెచ్చే ముందు ధాన్యాన్ని తేమ ప్రమాణాల ప్రకారం ఆరబెట్టండి.',
    btnConfirmGenerate: 'ధృవీకరించండి & టోకెన్ పొందండి',

    bookingConfirmedTitle: 'బుకింగ్ ధృవీకరించబడింది',
    bookingConfirmedSub: 'మీ పంట డెలివరీ స్లాట్ రిజర్వ్ చేయబడింది. గేట్ వద్ద మీ డిజిటల్ టోకెన్ చూపించండి.',
    procurementSlotReserved: 'ప్రభుత్వ పంట సేకరణ స్లాట్ రిజర్వ్ చేయబడింది',
    tokenNumberLabel: 'అధికారిక బుకింగ్ టోకెన్ సంఖ్య',
    bookingRefLabel: 'రిఫరెన్స్ సంఖ్య',
    btnPrintToken: 'టోకెన్ ప్రింట్ చేయండి',
    btnDownload: 'పాస్ డౌన్‌లోడ్ చేయండి',
    mandiPassNotice: 'సమయానికి 15 నిమిషాల ముందుగా చేరుకోండి. ఆధార్ మరియు పట్టాదారు పాస్ బుక్ తీసుకురండి.',
    farmerName: 'రైతు పేరు',
    deliveryCenter: 'సేకరణ కేంద్రం',
    cropForDelivery: 'విక్రయించే పంట',
    appointmentSchedule: 'నిర్ణయించిన సమయం',
    btnViewMyToken: 'టోకెన్ పాస్ చూడండి/ముద్రించండి',
    btnTrackMilestones: 'ప్రత్యక్ష స్థితిని ట్రాక్ చేయండి',
    btnBackDashboard: 'డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి',

    noActiveTokenTitle: 'క్రియాశీల టోకెన్ లేదు',
    noActiveTokenDesc: 'మీరు ఇంకా ఎటువంటి స్లాట్ బుక్ చేయలేదు. డిజిటల్ టోకెన్ పొందడానికి స్లాట్ బుక్ చేయండి.',
    tokenPassHeader: 'మీ సేకరణ టోకెన్ పాస్',
    tokenPassSubtitle: 'అధికారిక మార్కెట్ గేట్ పాస్ మరియు వే-బ్రిడ్జ్ అనుమతి',
    tokenPassGovTitle: 'కర్ణాటక ప్రభుత్వం — వ్యవసాయ సేకరణ',
    tokenPassGovSub: 'స్మార్ట్ డిజిటల్ సేకరణ టోకెన్ పాస్',
    dateOfIssue: 'జారీ చేసిన తేదీ',
    scheduledTimeSlot: 'కేటాయించిన సమయం స్లాట్',
    instructionsTitle: 'మార్కెట్ ప్రాంగణ ప్రవేశ సూచనలు:',
    instruction1: 'అసలు రైతు గుర్తింపు కార్డు, పట్టాదారు పాస్ బుక్ మరియు ఆధార్ కాపీ వెంట తీసుకురండి.',
    instruction2: 'తూకం అనుమతి కోసం గేట్ 1 వద్ద ఈ టోకెన్ నంబర్ చెప్పండి.',
    instruction3: 'కేటాయించిన 1 గంట సమయం లోపలే తప్పనిసరిగా మార్కెట్‌కు చేరుకోండి.',

    trackTitle: 'స్థితిని ట్రాక్ చేయండి',
    trackSubtitle: 'మార్కెట్లో మీ పంట సేకరణ దశలను ప్రత్యక్షంగా గమనించండి.',
    searchTokenPlaceholder: 'టోకెన్ సంఖ్య నమోదు చేయండి (ఉదా: AV-2026-00125)',
    btnTrackToken: 'టోకెన్ ట్రాక్ చేయండి',
    tryDemoTokens: 'డెమో టోకెన్లు:',
    processTimelineTitle: 'సేకరణ ప్రక్రియ కాలక్రమం',
    inProgressAtMandi: 'ప్రస్తుతం మార్కెట్లో ప్రక్రియ జరుగుతోంది',

    statusConfirmed: 'బుకింగ్ ధృవీకరించబడింది',
    statusArrived: 'రైతు వచ్చారు',
    statusQuality: 'నాణ్యత తనిఖీ',
    statusProcessing: 'తూకం మరియు సేకరణ',
    statusCompleted: 'సేకరణ పూర్తయింది (DBT)',

    historyTitle: 'బుకింగ్ చరిత్ర',
    historySubtitle: 'మీ గత మరియు ప్రస్తుత పంట సేకరణ వివరాలను సమీక్షించండి.',
    btnNewBooking: 'కొత్త స్లాట్ బుకింగ్',
    colToken: 'టోకెన్ సంఖ్య',
    colDateSlot: 'తేదీ & సమయం',
    colCentre: 'సేకరణ కేంద్రం',
    colCropQty: 'పంట & పరిమాణం',
    colStatus: 'స్థితి',
    colActions: 'చర్యలు',
    actionViewToken: 'టోకెన్',
    actionTrack: 'ట్రాక్',
    noBookingsFound: 'ఎటువంటి బుకింగ్ రికార్డులు కనుగొనబడలేదు.',

    profileTitle: 'నా ప్రొఫైల్',
    profileSubtitle: 'మీ వివరాలు, మొబైల్, ఆధార్ మరియు చిరునామాను సమీక్షించండి మరియు నవీకరించండి.',
    btnEditProfile: 'ప్రొఫైల్ సవరించండి',
    profileUpdatedSuccess: 'ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది',
    accountInfoTitle: 'ఖాతా సమాచారం',
    regDateLabel: 'నమోదు తేదీ',
    btnSaveChanges: 'మార్పులను సేవ్ చేయండి',
    btnCancel: 'రద్దు చేయండి',

    logout: 'లాగ్అవుట్',
  
  },

  // ================= TAMIL (தமிழ்) =================
  ta: {
    platformTitle: 'ஸ்மார்ட் விவசாய கொள்முதல் தளம்',
    portalSubtitle: 'விவசாயிகள் நேரடி கொள்முதல் மற்றும் டிஜிட்டல் டோக்கன் அமைப்பு',
    staffPortalSubtitle: 'அதிகாரிகள் மற்றும் கொள்முதல் மைய மேலாண்மை தளம்',
    dpiBadge: 'விவசாயத்திற்கான டிஜிட்டல் பொது உள்கட்டமைப்பு',
    kisanHelpline: 'விவசாயிகள் உதவி எண் (கட்டணமில்லா)',
    helplineTimes: 'கிசான் கால் சென்டர் (காலை 06:00 – இரவு 10:00)',
    mspGuarantee: '100% குறைந்தபட்ச ஆதரவு விலை (MSP) உத்தரவாதம்',
    dbtAssurance: 'நேரடி வங்கி பரிமாற்றம் (DBT)',
    weighbridgeCertified: 'மின்னணு எடை மேடை சான்றிதழ்',
    switchRoleToStaff: 'அதிகாரிகள் தளம்',
    switchRoleToFarmer: 'விவசாயிகள் தளம்',
    farmerPortal: 'விவசாயிகள் தளம்',
    staffPortal: 'அதிகாரிகள் தளம்',
    home: 'முகப்பு',
    footerDesc: 'ஸ்மார்ட் விவசாய கொள்முதல் தளம் — இந்திய விவசாயிகளுக்கு வெளிப்படையான நேர முன்பதிவு, நேரடி நிலை கண்காணிப்பு மற்றும் வங்கிக்கு நேரடி MSP தொகை வழங்கும் அமைப்பு.',
    kisanHelplineSchedule: 'கட்டணமில்லா கிசான் கால் சென்டர் • திங்கள்-சனி (காலை 06:00 – இரவு 10:00) 22 பிராந்திய மொழிகளில்.',
    fairPriceAssuranceTitle: 'நியாயமான விலை மற்றும் நேரடி வங்கி பரிமாற்ற உத்தரவாதம்',
    footerHackathon: 'பாரத் கிருஷி சேவா • ஸ்மார்ட் விவசாய தளம்',
    footerDpi: 'இந்திய டிஜிட்டல் பொது உள்கட்டமைப்பு தரநிலைகளின்படி வடிவமைக்கப்பட்டது',

    navDashboard: 'டாஷ்போர்டு',
    navFindCenter: 'மையம் தேடுக',
    navBookSlot: 'நேரம் பதிவு செய்க',
    navMyToken: 'என் டோக்கன்',
    navTrackStatus: 'நிலையை காண்க',
    navHistory: 'வரலாறு',
    navProfile: 'சுயவிவரம்',

    staffNavDashboard: 'டாஷ்போர்டு',
    staffNavFarmers: 'விவசாயிகள் விவரம்',
    staffNavCentres: 'கொள்முதல் மையங்கள்',
    staffNavSlots: 'ஸ்லாட் மேலாண்மை',
    staffNavTokens: 'டோக்கன் சரிபார்ப்பு',
    staffNavProcurement: 'கொள்முதல் பதிவுகள்',
    staffNavReports: 'அறிக்கைகள்',
    staffNavSettings: 'அமைப்புகள்',

    landingBadge: 'வேளாண் மண்டிகளுக்கான டிஜிட்டல் பொது சேவை',
    landingTitle: 'ஸ்மார்ட் விவசாய கொள்முதல் மேலாண்மை தளம்',
    landingSubtitle: 'விவசாயிகள் கொள்முதல் மையங்களை எளிதாக கண்டறியவும், நேர ஸ்லாட்டை தேர்வு செய்யவும், டிஜிட்டல் டோக்கன் பெறவும் உதவும் எளிய தளம்.',
    landingBtnFarmer: 'விவசாயி உள்நுழைவு / பதிவு',
    landingBtnStaff: 'அதிகாரிகள் உள்நுழைவு',
    freeService: 'இலவச அரசு சேவை',
    journeyTitle: '6 படிநிலை டிஜிட்டல் கொள்முதல் பயணம்',
    journeySubtitle: 'மண்டிகளில் நீண்ட வரிசைகள் இன்றி எளிதாகவும் வெளிப்படையாகவும் விளைபொருளை விற்கலாம்.',
    step1Title: 'விவசாயி பதிவு மற்றும் உள்நுழைவு',
    step1Desc: 'ஆதார் அல்லது மொபைல் எண் மூலம் எளிதாக உள்நுழையவும். கடவுச்சொல் தேவையில்லை.',
    step2Title: 'மையம் மற்றும் பயிர் தேர்வு',
    step2Desc: 'உங்கள் வட்டத்தில் உள்ள கொள்முதல் மையத்தையும் குறைந்தபட்ச ஆதரவு விலை பயிரையும் தேர்வு செய்க.',
    step3Title: 'தேதி மற்றும் நேர ஸ்லாட்',
    step3Desc: 'உங்கள் அறுவடை மற்றும் போக்குவரத்துக்கு ஏற்ற 1 மணி நேர ஸ்லாட்டை தேர்வு செய்யவும்.',
    step4Title: 'உடனடி டிஜிட்டல் டோக்கன்',
    step4Desc: 'மண்டி நுழைவு வாயிலில் காட்ட அதிகாரப்பூர்வ முன்பதிவு டோக்கன் எண்ணைப் பெறவும்.',
    step5Title: 'கொள்முதல் நிலை கண்காணிப்பு',
    step5Desc: 'வருகை, தர பரிசோதனை, எடை மற்றும் வங்கி செலுத்துதல் நிலைகளை நேரடியாக காண்க.',
    step6Title: 'நேரடி வங்கி கணக்கில் MSP தொகை',
    step6Desc: 'இடைத்தரகர்கள் இன்றி அரசு நிர்ணயித்த முழு ஆதரவு விலை நேரடியாக ஆதார் இணைக்கப்பட்ட வங்கிக் கணக்கில்.',

    loginHeading: 'விவசாயி உள்நுழைவு',
    loginSubtitle: 'உங்கள் பதிவு செய்யப்பட்ட ஆதார் எண் அல்லது மொபைல் எண் மூலம் உள்நுழைக.',
    tabMobile: 'மொபைல் எண்',
    labelMobile: 'மொபைல் எண் (10 இலக்கங்கள்)',
    hintMobile: 'உங்கள் 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.',
    btnContinue: 'தொடர்க',
    newFarmerPrompt: 'புதிய விவசாயியா?',
    registerHere: 'இங்கு பதிவு செய்க',
    invalidLoginError: 'தவறான விவரங்கள். தயவுசெய்து எண்ணை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
    demoTesting: 'டெமோ சோதனை உள்நுழைவு:',

    regTitle: 'விவசாயி பதிவு',
    regSubtitle: 'விளைபொருள் விற்பனை முன்பதிவு செய்ய உங்கள் அடையாள மற்றும் முகவரி விவரங்களை பதிவு செய்யவும்.',
    autoFillDemo: '⚡ டெமோ விவரங்களை தானாக நிரப்புக',
    personalInfoTitle: '1. தனிப்பட்ட தகவல்கள்',
    locationTitle: '2. இருப்பிடம் & பண்ணை முகவரி',
    preferencesTitle: '3. விருப்பங்கள்',
    labelFullName: 'முழு பெயர்',
    labelVillage: 'கிராமம் / பஞ்சாயத்து',
    labelAddress: 'விரிவான முகவரி / தெரு',
    labelDistrict: 'மாவட்டம்',
    labelTaluk: 'வட்டம் / தாலுகா',
    labelPreferredLang: 'விருப்பமான மொழி',
    btnCompleteReg: 'பதிவை முடிக்கவும்',
    alreadyRegistered: 'ஏற்கனவே பதிவு செய்துள்ளீர்களா?',
    loginLink: 'விவசாயி உள்நுழைவு',
    regSuccessTitle: 'பதிவு வெற்றிகரமாக முடிந்தது',
    regSuccessSubtitle: 'உங்கள் அதிகாரப்பூர்வ விவசாயி கணக்கு உருவாக்கப்பட்டுள்ளது.',
    assignedFarmerId: 'விவசாயி ஐடி (Farmer ID)',
    btnProceedDashboard: 'டாஷ்போர்டுக்கு செல்க',

    seasonBadge: 'காரிஃப் / ரபி கொள்முதல் பருவம் 2026',
    welcomeFarmer: 'வணக்கம்',
    welcomeSub: 'உங்கள் விவசாய கொள்முதலை எளிதாக நிர்வகிக்கவும்.',
    farmerIdLabel: 'விவசாயி ஐடி',
    mobileLabel: 'மொபைல்',
    talukLabel: 'கிராமம்/வட்டம்',
    btnViewProfile: 'சுயவிவரம் காண்க',
    activeTokenTitle: 'நடப்பு கொள்முதல் டோக்கன்',
    btnViewToken: 'டிஜிட்டல் டோக்கன் காண்க',
    btnTrackLive: 'நேரடி நிலை கண்காணிக்க',
    servicesHeading: 'கொள்முதல் சேவைகள்',
    servicesSubtitle: 'அரசு ஒழுங்குமுறை விற்பனை கூடத்தில் விளைபொருளை விற்க கீழே உள்ள சேவையை தேர்வு செய்க.',

    cardFindTitle: 'மையம் தேடுக',
    cardFindDesc: 'ஜிபிஎஸ் அல்லது மாவட்டம், வட்டம் மூலம் அருகிலுள்ள மையங்களை கண்டறிக.',
    cardBookTitle: 'ஸ்லாட் முன்பதிவு செய்க',
    cardBookDesc: 'பயிர், தேதி மற்றும் வாகனத்தை இறக்க 1 மணி நேர ஸ்லாட்டை தேர்வு செய்க.',
    cardTokenTitle: 'என் டிஜிட்டல் டோக்கன்',
    cardTokenDesc: 'அதிகாரப்பூர்வ நுழைவு பாஸ் பார்க்க, பதிவிறக்க அல்லது அச்சிடலாம்.',
    cardTrackTitle: 'நிலையை கண்காணிக்க',
    cardTrackDesc: 'தர பரிசோதனை, எடை மற்றும் வங்கி செலுத்துதல் நிலையை நேரடியாக காண்க.',
    cardHistoryTitle: 'முன்பதிவு வரலாறு',
    cardHistoryDesc: 'முந்தைய மற்றும் முடிந்த கொள்முதல் ரசீதுகளை மதிப்பாய்வு செய்க.',
    cardProfileTitle: 'என் சுயவிவரம்',
    cardProfileDesc: 'தனிப்பட்ட விவரங்கள், ஆதார், முகவரி மற்றும் மொழி விருப்பத்தை திருத்தவும்.',

    findTitle: 'கொள்முதல் மையத்தை கண்டறிக',
    findSubtitle: 'ஜிபிஎஸ் அல்லது படிபடியான தேர்வு மூலம் அருகிலுள்ள அரசு கொள்முதல் மையத்தை காண்க.',
    opt1NearMe: 'விருப்பம் 1 — தானியங்கி இருப்பிட தேடல்',
    opt1Desc: 'உங்கள் இருப்பிடத்திலிருந்து 25 கி.மீ எல்லைக்குள் உள்ள மையங்களை கண்டறிக.',
    btnNearMe: 'என் அருகில் தேடுக',
    nearMeLocating: 'ஜிபிஎஸ் மூலம் அருகில் உள்ள மையங்கள் தேடப்படுகிறது...',
    nearbyFound: '25 கி.மீ எல்லைக்குள் அருகிலுள்ள கொள்முதல் மையங்கள் கண்டறியப்பட்டன.',
    opt2Hierarchy: 'விருப்பம் 2 — மாவட்டம் & வட்டம் வழி தேர்வு',
    hierDistrict: 'மாவட்டம் தேர்வு செய்க',
    hierTaluk: 'வட்டம் தேர்வு செய்க',
    hierCentre: 'கொள்முதல் மையம்',
    activeHierarchy: 'தேர்வு நிலை',
    resetFilters: 'வடிகட்டிகளை அழிக்கவும்',
    availCentresTitle: 'கிடைக்கும் கொள்முதல் மையங்கள்',
    selectCenterPrompt: 'பயிர்கள் மற்றும் ஸ்லாட்களை பார்க்க மையத்தை தேர்வு செய்க',
    btnSelectCenter: 'மையத்தை தேர்வு செய்க',
    btnSelectedCenter: 'மையம் தேர்வு செய்யப்பட்டது',
    btnBookAtCenter: 'இந்த மையத்தில் ஸ்லாட் முன்பதிவு செய்க',
    cropsSupported: 'கொள்முதலுக்கு கிடைக்கும் பயிர்கள்:',
    chooseCropPrompt: 'இந்த மையத்தில் உங்கள் பயிரை தேர்வு செய்க (ஆதரவு விலையுடன்):',

    stepCenter: 'மையம்',
    stepCrop: 'பயிர்',
    stepDate: 'தேதி',
    stepSlot: 'நேர ஸ்லாட்',
    stepReview: 'சரிபார்ப்பு',
    stepConfirm: 'உறுதிசெய்தல்',
    estQuantity: 'மதிப்பிடப்பட்ட அளவு (குவிண்டாலில்)',
    slotsRemaining: 'இடங்கள் உள்ளன',
    btnContinueNext: 'அடுத்த படிக்கு செல்லவும்',
    btnBack: 'பின்செல்க',
    reviewTitle: 'முன்பதிவு விவரங்களை சரிபார்க்கவும்',
    reviewSub: 'உறுதி செய்வதற்கு முன் உங்கள் முன்பதிவு விவரங்களை சரிபார்க்கவும்.',
    estDbtValue: 'மதிப்பிடப்பட்ட அரசு ஆதரவு விலை (DBT)',
    readyToConfirm: 'முன்பதிவை உறுதி செய்ய தயாரா?',
    confirmNotice: 'மண்டிக்கு கொண்டு வருவதற்கு முன் விளைபொருளை ஈரப்பத விதிகளின்படி உலர்த்தி வைக்கவும்.',
    btnConfirmGenerate: 'உறுதி செய்து டோக்கன் பெறுக',

    bookingConfirmedTitle: 'முன்பதிவு உறுதி செய்யப்பட்டது',
    bookingConfirmedSub: 'உங்கள் விளைபொருள் வழங்கும் ஸ்லாட் பதிவு செய்யப்பட்டுள்ளது. மண்டி வாயிலில் டிஜிட்டல் டோக்கனைக் காட்டவும்.',
    procurementSlotReserved: 'அரசு கொள்முதல் ஸ்லாட் வெற்றிகரமாக பதிவு செய்யப்பட்டது',
    tokenNumberLabel: 'அதிகாரப்பூர்வ டோக்கன் எண்',
    bookingRefLabel: 'குறிப்பு எண்',
    btnPrintToken: 'டோக்கனை அச்சிடுக',
    btnDownload: 'பாஸ் பதிவிறக்குக',
    mandiPassNotice: 'குறிப்பிட்ட நேரத்திற்கு 15 நிமிடங்கள் முன்னதாக வந்து சேரவும். அசல் ஆதார் மற்றும் பட்டா சிட்டா கொண்டு வரவும்.',
    farmerName: 'விவசாயி பெயர்',
    deliveryCenter: 'கொள்முதல் மையம்',
    cropForDelivery: 'வழங்கும் பயிர்',
    appointmentSchedule: 'முன்பதிவு நேரம்',
    btnViewMyToken: 'டோக்கன் பாஸ் பார்க்க/அச்சிட',
    btnTrackMilestones: 'நேரடி நிலையை கண்காணிக்க',
    btnBackDashboard: 'டாஷ்போர்டுக்கு திரும்புக',

    noActiveTokenTitle: 'நடப்பு டோக்கன் எதுவும் இல்லை',
    noActiveTokenDesc: 'நீங்கள் இன்னும் எந்த ஸ்லாட்டையும் பதிவு செய்யவில்லை. டோக்கன் பாஸ் பெற ஸ்லாட் பதிவு செய்க.',
    tokenPassHeader: 'உங்கள் கொள்முதல் டோக்கன் பாஸ்',
    tokenPassSubtitle: 'அதிகாரப்பூர்வ மண்டி நுழைவு பாஸ் மற்றும் எடை மேடை அனுமதி',
    tokenPassGovTitle: 'கர்நாடக அரசு — விவசாய விளைபொருள் கொள்முதல்',
    tokenPassGovSub: 'ஸ்மார்ட் டிஜிட்டல் கொள்முதல் டோக்கன் பாஸ்',
    dateOfIssue: 'வழங்கப்பட்ட தேதி',
    scheduledTimeSlot: 'ஒதுக்கப்பட்ட நேர ஸ்லாட்',
    instructionsTitle: 'மண்டி வளாக நுழைவு விதிமுறைகள்:',
    instruction1: 'அசல் விவசாயி அடையாள அட்டை, பட்டா சிட்டா மற்றும் ஆதார் நகல் கொண்டு வரவும்.',
    instruction2: 'எடை மேடை அனுமதிக்காக வாயில் 1 இல் இந்த டோக்கன் எண்ணை தெரிவிக்கவும்.',
    instruction3: 'ஒதுக்கப்பட்ட 1 மணி நேர ஸ்லாட்டிற்குள் தவறாமல் வருகை தரவும்.',

    trackTitle: 'நிலையை கண்காணிக்க',
    trackSubtitle: 'மண்டியில் உங்கள் விளைபொருள் கொள்முதல் படிநிலைகளை நேரடியாக கண்காணியுங்கள்.',
    searchTokenPlaceholder: 'டோக்கன் எண்ணை உள்ளிடவும் (எ.கா: AV-2026-00125)',
    btnTrackToken: 'டோக்கனை தேடுக',
    tryDemoTokens: 'மாதிரி டோக்கன்கள்:',
    processTimelineTitle: 'கொள்முதல் செயல்முறை காலவரிசை',
    inProgressAtMandi: 'தற்போது மண்டியில் பணிகள் நடைபெறுகின்றன',

    statusConfirmed: 'முன்பதிவு உறுதி செய்யப்பட்டது',
    statusArrived: 'விவசாயி வருகை',
    statusQuality: 'தர பரிசோதனை',
    statusProcessing: 'எடை மற்றும் கொள்முதல் செயல்முறை',
    statusCompleted: 'கொள்முதல் முடிந்தது (DBT செலுத்துதல்)',

    historyTitle: 'முன்பதிவு வரலாறு',
    historySubtitle: 'உங்கள் முந்தைய மற்றும் நடப்பு கொள்முதல் முன்பதிவுகளை மதிப்பாய்வு செய்க.',
    btnNewBooking: 'புதிய கொள்முதல் முன்பதிவு',
    colToken: 'டோக்கன் எண்',
    colDateSlot: 'தேதி & ஸ்லாட்',
    colCentre: 'கொள்முதல் மையம்',
    colCropQty: 'பயிர் & அளவு',
    colStatus: 'நிலை',
    colActions: 'செயல்கள்',
    actionViewToken: 'டோக்கன்',
    actionTrack: 'கண்காணி',
    noBookingsFound: 'முன்பதிவு பதிவுகள் எதுவும் இல்லை.',

    profileTitle: 'என் சுயவிவரம்',
    profileSubtitle: 'உங்கள் விவசாயி அடையாளம், மொபைல், ஆதார் மற்றும் பண்ணை முகவரியை காண்க மற்றும் மாற்றியமைக்க.',
    btnEditProfile: 'சுயவிவரத்தை திருத்து',
    profileUpdatedSuccess: 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது',
    accountInfoTitle: 'கணக்கு விவரங்கள்',
    regDateLabel: 'பதிவு செய்த தேதி',
    btnSaveChanges: 'மாற்றங்களை சேமிக்கவும்',
    btnCancel: 'ரத்து செய்க',

    logout: 'வெளியேறு',
  
  },

  // ================= MARATHI (मराठी) =================
  mr: {
    platformTitle: 'स्मार्ट कृषी खरेदी व्यवस्थापन मंच',
    portalSubtitle: 'थेट शेतकरी खरेदी आणि डिजिटल टोकन प्रणाली',
    staffPortalSubtitle: 'अधिकारी व केंद्र व्यवस्थापन पोर्टल',
    dpiBadge: 'कृषी क्षेत्रासाठी डिजिटल सार्वजनिक पायाभूत सुविधा',
    kisanHelpline: 'शेतकरी सहाय्यता हेल्पलाइन',
    helplineTimes: 'टोल-फ्री किसान कॉल सेंटर (सकाळी 06:00 ते रात्री 10:00)',
    mspGuarantee: '100% हमीभाव (MSP) हमी',
    dbtAssurance: 'थेट बँक खात्यात रक्कम (DBT)',
    weighbridgeCertified: 'इलेक्ट्रॉनिक वे-ब्रिज प्रमाणीकरण',
    switchRoleToStaff: 'अधिकारी पोर्टल',
    switchRoleToFarmer: 'शेतकरी पोर्टल',
    farmerPortal: 'शेतकरी पोर्टल',
    staffPortal: 'अधिकारी पोर्टल',
    home: 'मुख्यपृष्ठ',
    footerDesc: 'स्मार्ट कृषी खरेदी व्यवस्थापन मंच — भारतीय शेतकऱ्यांना पारदर्शक स्लॉट बुकिंग, थेट स्थिती ट्रॅकिंग आणि हमीभाव रक्कम थेट बँक खात्यात मिळवून देणारी प्रणाली.',
    kisanHelplineSchedule: 'टोल-फ्री किसान कॉल सेंटर • सोम-शनि (सकाळी 06:00 ते रात्री 10:00) 22 प्रादेशिक भाषांमध्ये.',
    fairPriceAssuranceTitle: 'योग्य हमीभाव व थेट बँक हस्तांतरण हमी',
    footerHackathon: 'भारत कृषी सेवा • स्मार्ट कृषी मंच',
    footerDpi: 'भारतीय डिजिटल सार्वजनिक पायाभूत सुविधा मानकांनुसार प्रमाणित',

    navDashboard: 'डॅशबोर्ड',
    navFindCenter: 'खरेदी केंद्र शोधा',
    navBookSlot: 'स्लॉट बुक करा',
    navMyToken: 'माझे डिजिटल टोकन',
    navTrackStatus: 'स्थिती ट्रॅक करा',
    navHistory: 'इतिहास',
    navProfile: 'माझे प्रोफाइल',

    staffNavDashboard: 'डॅशबोर्ड',
    staffNavFarmers: 'शेतकरी नोंदी',
    staffNavCentres: 'खरेदी केंद्रे',
    staffNavSlots: 'स्लॉट व्यवस्थापन',
    staffNavTokens: 'टोकन पडताळणी',
    staffNavProcurement: 'खरेदी नोंदी',
    staffNavReports: 'अहवाल',
    staffNavSettings: 'सेटिंग्ज',

    landingBadge: 'कृषी बाजार समित्यांसाठी डिजिटल सार्वजनिक सेवा',
    landingTitle: 'स्मार्ट कृषी खरेदी व्यवस्थापन मंच',
    landingSubtitle: 'शेतकऱ्यांना खरेदी केंद्र शोधण्यासाठी, उपलब्ध वेळ स्लॉट निवडण्यासाठी, डिजिटल टोकन मिळवण्यासाठी आणि खरेदी प्रक्रिया ट्रॅक करण्यासाठी एक सोपे डिजिटल व्यासपीठ.',
    landingBtnFarmer: 'शेतकरी लॉगिन / नोंदणी',
    landingBtnStaff: 'अधिकारी लॉगिन',
    freeService: 'विनामूल्य शासकीय सेवा',
    journeyTitle: '6-टप्प्यांची डिजिटल खरेदी प्रक्रिया',
    journeySubtitle: 'बाजार समित्यांमध्ये रांगांशिवाय सुलभ आणि पारदर्शक धान्य विक्रीसाठी.',
    step1Title: 'शेतकरी नोंदणी व लॉगिन',
    step1Desc: 'आधार किंवा मोबाईल नंबर वापरून झटपट लॉगिन करा. क्लिष्ट पासवर्डची गरज नाही.',
    step2Title: 'केंद्र शोधा आणि पीक निवडा',
    step2Desc: 'आपल्या तालुक्यातील जवळचे केंद्र शोधा आणि हमीभाव (MSP) असलेले पीक निवडा.',
    step3Title: 'तारीख आणि वेळ स्लॉट निवडा',
    step3Desc: 'आपल्या काढणी आणि वाहतुकीनुसार 1 तासाचा सोयीस्कर स्लॉट निवडा.',
    step4Title: 'झटपट डिजिटल टोकन',
    step4Desc: 'बाजार समिती प्रवेशद्वारावर दाखवण्यासाठी अधिकृत टोकन क्रमांक मिळवा.',
    step5Title: 'खरेदी प्रक्रिया ट्रॅक करा',
    step5Desc: 'आगमन, प्रतवारी तपासणी, वजन आणि बँक खात्यात रक्कम जमा होण्याचे टप्पे थेट पहा.',
    step6Title: 'थेट बँक खात्यात हमीभाव रक्कम',
    step6Desc: 'मध्यस्थांशिवाय सरकारी हमीभाव थेट आधारशी जोडलेल्या बँक खात्यात.',

    loginHeading: 'शेतकरी लॉगिन',
    loginSubtitle: 'आपल्या नोंदणीकृत आधार क्रमांक किंवा मोबाईल क्रमांकाने लॉगिन करा.',
    tabMobile: 'मोबाईल क्रमांक',
    labelMobile: 'मोबाईल क्रमांक (10 अंक)',
    hintMobile: 'आपला नोंदणीकृत 10 अंकी मोबाईल क्रमांक प्रविष्ट करा.',
    btnContinue: 'पुढे जा',
    newFarmerPrompt: 'नवीन शेतकरी?',
    registerHere: 'येथे नोंदणी करा',
    invalidLoginError: 'चुकीचा तपशील. कृपया आपला क्रमांक तपासा आणि पुन्हा प्रयत्न करा.',
    demoTesting: 'डेमो चाचणी लॉगिन:',

    regTitle: 'शेतकरी नोंदणी',
    regSubtitle: 'धान्य खरेदी स्लॉट बुक करण्यासाठी आपली ओळख व पत्त्याचा तपशील भरा.',
    autoFillDemo: '⚡ डेमो तपशील स्वयंचलित भरा',
    personalInfoTitle: '1. वैयक्तिक माहिती',
    locationTitle: '2. पत्ता व शेताचे ठिकाण',
    preferencesTitle: '3. प्राधान्ये',
    labelFullName: 'पूर्ण नाव',
    labelVillage: 'गाव / ग्रामपंचायत',
    labelAddress: 'सविस्तर पत्ता / रस्ता',
    labelDistrict: 'जिल्हा',
    labelTaluk: 'तालुका',
    labelPreferredLang: 'पसंतीची भाषा',
    btnCompleteReg: 'नोंदणी पूर्ण करा',
    alreadyRegistered: 'आधीच नोंदणी झाली आहे?',
    loginLink: 'शेतकरी लॉगिन',
    regSuccessTitle: 'नोंदणी यशस्वी झाली',
    regSuccessSubtitle: 'आपले अधिकृत शेतकरी खाते तयार झाले आहे.',
    assignedFarmerId: 'शेतकरी आयडी (Farmer ID)',
    btnProceedDashboard: 'शेतकरी डॅशबोर्डवर जा',

    seasonBadge: 'खरीप / रब्बी खरेदी हंगाम 2026',
    welcomeFarmer: 'स्वागत आहे',
    welcomeSub: 'आपली कृषी खरेदी सहजपणे व्यवस्थापित करा.',
    farmerIdLabel: 'शेतकरी आयडी',
    mobileLabel: 'मोबाईल',
    talukLabel: 'गाव/तालुका',
    btnViewProfile: 'प्रोफाइल पहा',
    activeTokenTitle: 'सक्रिय खरेदी टोकन',
    btnViewToken: 'डिजिटल टोकन पहा',
    btnTrackLive: 'थेट स्थिती ट्रॅक करा',
    servicesHeading: 'खरेदी सेवा',
    servicesSubtitle: 'शासकीय बाजार समितीत पीक विक्रीसाठी खालील सेवा निवडा.',

    cardFindTitle: 'खरेदी केंद्र शोधा',
    cardFindDesc: 'जीपीएस किंवा जिल्हा, तालुका निवडून जवळचे खरेदी केंद्र शोधा.',
    cardBookTitle: 'स्लॉट बुक करा',
    cardBookDesc: 'पीक, तारीख आणि माल उतरवण्यासाठी 1 तासाचा वेळ स्लॉट निवडा.',
    cardTokenTitle: 'माझे डिजिटल टोकन',
    cardTokenDesc: 'अधिकृत प्रवेश पास पहा, डाउनलोड किंवा प्रिंट करा.',
    cardTrackTitle: 'स्थिती ट्रॅक करा',
    cardTrackDesc: 'प्रतवारी तपासणी, वजन आणि डीबीटी पेमेंटची थेट स्थिती पहा.',
    cardHistoryTitle: 'बुकिंग इतिहास',
    cardHistoryDesc: 'आपल्या मागील आणि पूर्ण झालेल्या खरेदी पावत्या तपासा.',
    cardProfileTitle: 'माझे प्रोफाइल',
    cardProfileDesc: 'वैयक्तिक माहिती, आधार, पत्ता आणि भाषा पर्याय अद्यतनित करा.',

    findTitle: 'खरेदी केंद्र शोधा',
    findSubtitle: 'जीपीएस किंवा प्रशासकीय निवडीद्वारे जवळचे हमीभाव खरेदी केंद्र शोधा.',
    opt1NearMe: 'पर्याय 1 — स्वयंचलित स्थान शोध',
    opt1Desc: 'आपल्या स्थानापासून 25 किमीच्या परिसरातील केंद्रे शोधा.',
    btnNearMe: 'माझ्या जवळ शोधा',
    nearMeLocating: 'जीपीएस द्वारे जवळचे केंद्र शोधत आहे...',
    nearbyFound: '25 किमी अंतरावर जवळची खरेदी केंद्रे सापडली आहेत.',
    opt2Hierarchy: 'पर्याय 2 — जिल्हा व तालुका निवड',
    hierDistrict: 'जिल्हा निवडा',
    hierTaluk: 'तालुका निवडा',
    hierCentre: 'खरेदी केंद्र',
    activeHierarchy: 'निवडलेली माहिती',
    resetFilters: 'फिल्टर रीसेट करा',
    availCentresTitle: 'उपलब्ध खरेदी केंद्रे',
    selectCenterPrompt: 'पिके आणि स्लॉट पाहण्यासाठी केंद्र निवडा',
    btnSelectCenter: 'केंद्र निवडा',
    btnSelectedCenter: 'केंद्र निवडले गेले',
    btnBookAtCenter: 'या केंद्रावर स्लॉट बुक करा',
    cropsSupported: 'खरेदीसाठी उपलब्ध पिके:',
    chooseCropPrompt: 'या केंद्रावर आपले पीक निवडा (हमीभावासह):',

    stepCenter: 'केंद्र',
    stepCrop: 'पीक',
    stepDate: 'तारीख',
    stepSlot: 'वेळ स्लॉट',
    stepReview: 'पुनरावलोकन',
    stepConfirm: 'पुष्टीकरण',
    estQuantity: 'अंदाजे प्रमाण (क्विंटलमध्ये)',
    slotsRemaining: 'स्लॉट शिल्लक',
    btnContinueNext: 'पुढील टप्प्यावर जा',
    btnBack: 'मागे',
    reviewTitle: 'बुकिंग तपशीलाचे पुनरावलोकन',
    reviewSub: 'पुष्टी करण्यापूर्वी आपल्या अपॉइंटमेंट तपशीलाची पडताळणी करा.',
    estDbtValue: 'अंदाजे हमीभाव रक्कम (DBT)',
    readyToConfirm: 'बुकिंगची पुष्टी करण्यास तयार आहात का?',
    confirmNotice: 'कृपया बाजार समितीत येण्यापूर्वी पीक FAQ ओलावा मानकांनुसार वाळवून आणा.',
    btnConfirmGenerate: 'पुष्टी करा व टोकन मिळवा',

    bookingConfirmedTitle: 'बुकिंगची पुष्टी झाली',
    bookingConfirmedSub: 'आपला माल वितरण स्लॉट आरक्षित झाला आहे. बाजार समिती प्रवेशद्वारावर डिजिटल टोकन दाखवा.',
    procurementSlotReserved: 'शासकीय खरेदी स्लॉट यशस्वीपणे आरक्षित',
    tokenNumberLabel: 'अधिकृत बुकिंग संदर्भ व टोकन क्रमांक',
    bookingRefLabel: 'संदर्भ क्रमांक',
    btnPrintToken: 'टोकन प्रिंट करा',
    btnDownload: 'पास डाउनलोड करा',
    mandiPassNotice: 'वेळेच्या 15 मिनिटे आधी पोहोचा. मूळ आधार आणि 7/12 उतारा सोबत आणायला विसरू नका.',
    farmerName: 'शेतकऱ्याचे नाव',
    deliveryCenter: 'खरेदी केंद्र',
    cropForDelivery: 'वितरणासाठी पीक',
    appointmentSchedule: 'नियोजित वेळ',
    btnViewMyToken: 'टोकन पास पहा/प्रिंट करा',
    btnTrackMilestones: 'थेट स्थिती ट्रॅक करा',
    btnBackDashboard: 'डॅशबोर्डवर परत जा',

    noActiveTokenTitle: 'सक्रिय डिजिटल टोकन नाही',
    noActiveTokenDesc: 'तुम्ही अद्याप कोणताही स्लॉट बुक केलेला नाही. अधिकृत टोकन पास मिळवण्यासाठी स्लॉट बुक करा.',
    tokenPassHeader: 'आपला खरेदी टोकन पास',
    tokenPassSubtitle: 'अधिकृत बाजार समिती प्रवेश पास व वे-ब्रिज परवानगी',
    tokenPassGovTitle: 'कर्नाटक शासन — कृषी खरेदी व्यवस्था',
    tokenPassGovSub: 'स्मार्ट डिजिटल खरेदी टोकन पास',
    dateOfIssue: 'जारी तारीख',
    scheduledTimeSlot: 'नियोजित वेळ स्लॉट',
    instructionsTitle: 'बाजार समिती प्रवेश सूचना:',
    instruction1: 'मूळ शेतकरी ओळखपत्र, 7/12 उतारा आणि आधार प्रत सोबत ठेवा.',
    instruction2: 'काटा वजन परवानगीसाठी गेट 1 वर हा टोकन क्रमांक सांगा.',
    instruction3: 'नेमून दिलेल्या 1 तासाच्या स्लॉटमध्येच बाजार समितीत पोहोचा.',

    trackTitle: 'स्थिती ट्रॅक करा',
    trackSubtitle: 'बाजार समितीत आपल्या धान्य खरेदीच्या प्रत्येक टप्प्यावर थेट लक्ष ठेवा.',
    searchTokenPlaceholder: 'टोकन क्रमांक टाका (उदा. AV-2026-00125)',
    btnTrackToken: 'टोकन ट्रॅक करा',
    tryDemoTokens: 'डेमो टोकन:',
    processTimelineTitle: 'खरेदी प्रक्रिया टाइमलाइन',
    inProgressAtMandi: 'सध्या बाजार समितीत प्रक्रिया सुरू आहे',

    statusConfirmed: 'बुकिंग पुष्ट',
    statusArrived: 'शेतकरी आगमन',
    statusQuality: 'प्रतवारी तपासणी',
    statusProcessing: 'काटा वजन व खरेदी प्रक्रिया',
    statusCompleted: 'खरेदी पूर्ण (DBT जमा)',

    historyTitle: 'बुकिंग इतिहास',
    historySubtitle: 'आपल्या मागील आणि सक्रिय खरेदी भेटींचा तपशील तपासा.',
    btnNewBooking: 'नवीन स्लॉट बुकिंग',
    colToken: 'टोकन क्रमांक',
    colDateSlot: 'तारीख आणि स्लॉट',
    colCentre: 'खरेदी केंद्र',
    colCropQty: 'पीक आणि प्रमाण',
    colStatus: 'स्थिती',
    colActions: 'कृती',
    actionViewToken: 'टोकन',
    actionTrack: 'ट्रॅक',
    noBookingsFound: 'कोणत्याही बुकिंग नोंदी सापडल्या नाहीत.',

    profileTitle: 'माझे प्रोफाइल',
    profileSubtitle: 'आपली शेतकरी ओळख, मोबाईल, आधार आणि शेताचा पत्ता पहा व संपादित करा.',
    btnEditProfile: 'प्रोफाइल संपादित करा',
    profileUpdatedSuccess: 'प्रोफाइल यशस्वीरित्या अद्यतनित केले',
    accountInfoTitle: 'खाते माहिती',
    regDateLabel: 'नोंदणी तारीख',
    btnSaveChanges: 'बदल जतन करा',
    btnCancel: 'रद्द करा',

    logout: 'लॉग आऊट',
  
  },
};
