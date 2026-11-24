export type Language = 'en' | 'ta';

export interface FundamentalRightItem {
  id: string;
  index: number;
  articles: string;
  title: string;
  brief: string;
}

export interface UlaguMessages {
  brandEnglish: string;
  brandTamil: string;
  navRights: string;
  navFeatures: string;
  navHow: string;
  navTeam: string;
  joinWaitlist: string;
  menuOpen: string;
  menuClose: string;
  heroPill: string;
  heroTitle: string;
  heroTamilLine: string;
  heroParagraph: string;
  seeInside: string;
  inspect3d: string;
  assemble3d: string;
  scrollHint: string;
  rightsLabel: string;
  rightsTitle: string;
  rightsHint: string;
  rightsClear: string;
  rights: FundamentalRightItem[];
  featuresKicker: string;
  featuresTitle: string;
  featuresSubtitle: string;
  features: {
    number: string;
    title: string;
    text: string;
    featured?: boolean;
  }[];
  focusMonumentCta: string;
  howKicker: string;
  howTitle: string;
  steps: {
    number: string;
    title: string;
    text: string;
  }[];
  teamKicker: string;
  teamTitle: string;
  team: {
    name: string;
    initials: string;
    role: string;
    text: string;
  }[];
  comingSoonLabel: string;
  comingSoonTitle: string;
  comingSoonSubtitle: string;
  posterIndiaAlt: string;
  posterIndiaCaption: string;
  posterGlobeAlt: string;
  posterGlobeCaption: string;
  joinKicker: string;
  joinTitle: string;
  joinText: string;
  emailLabel: string;
  emailPlaceholder: string;
  submitWaitlist: string;
  submittingWaitlist: string;
  consentPrefix: string;
  consentLinkLabel: string;
  consentSuffix: string;
  consentMissing: string;
  waitlistInvalid: string;
  waitlistSuccess: string;
  waitlistError: string;
  waitlistAnother: string;
  footerDescription: string;
  footerLaunchDate: string;
  privacyLink: string;
  deleteLink: string;
  backToTop: string;
  footerLegal: string;
  webglUnavailableTitle: string;
  webglUnavailableBody: string;
  modalClose: string;
  privacyModalTitle: string;
  privacyModalBody: string;
  deleteModalTitle: string;
  deleteModalBody: string;
  dock: {
    regionLabel: string;
    scrollSync: string;
    freeOrbit: string;
    breakdown: string;
    view: string;
    viewOverview: string;
    viewScales: string;
    viewRotunda: string;
    finish: string;
    finishObsidian: string;
    finishBrass: string;
    finishMarble: string;
    showControls: string;
    hideControls: string;
    play: string;
    pause: string;
    reset: string;
  };
}

export const ULAGU_MESSAGES: Record<Language, UlaguMessages> = {
  en: {
    brandEnglish: 'Ulagu',
    brandTamil: 'உலகு',
    navRights: 'My Rights',
    navFeatures: "What's inside",
    navHow: 'How it works',
    navTeam: 'Team',
    joinWaitlist: 'Join the waitlist',
    menuOpen: 'Open navigation menu',
    menuClose: 'Close navigation menu',
    heroPill: 'Free knowledge for every Indian',
    heroTitle: 'Know your rights. Learn anything. Solve it yourself.',
    heroTamilLine: 'உங்கள் உரிமைகள். உங்கள் மொழியில்.',
    heroParagraph:
      'Ulagu turns government schemes, the Constitution and everyday problems into simple lessons, games and step-by-step guides, in Tamil and English.',
    seeInside: "See what's inside",
    inspect3d: 'Inspect 3D breakdown',
    assemble3d: 'Assemble 3D rotunda',
    scrollHint: 'Scroll to animate 3D monument · Drag open canvas to orbit · Press H for controls',
    rightsLabel: 'My Rights · நான் யார்?',
    rightsTitle: 'The six Fundamental Rights, in plain language',
    rightsHint: 'Select any right below to orient and illuminate its constitutional pillar.',
    rightsClear: 'Reset pillar focus',
    rights: [
      {
        id: 'equality',
        index: 0,
        articles: 'Articles 14–18',
        title: 'Right to Equality',
        brief:
          'Equality before the law, no state discrimination on religion, race, caste, sex, or place of birth, equal public employment opportunity, and abolition of untouchability.',
      },
      {
        id: 'freedom',
        index: 1,
        articles: 'Articles 19–22',
        title: 'Right to Freedom',
        brief:
          'Freedom of speech, peaceful assembly, movement, life and personal liberty, free education for ages 6–14 (Article 21A), and protection against arbitrary arrest.',
      },
      {
        id: 'exploitation',
        index: 2,
        articles: 'Articles 23–24',
        title: 'Right against Exploitation',
        brief:
          'Prohibits human trafficking, forced labour, and employing children under fourteen in factories, mines, or any hazardous work.',
      },
      {
        id: 'religion',
        index: 3,
        articles: 'Articles 25–28',
        title: 'Right to Freedom of Religion',
        brief:
          'Freedom of conscience and the right to freely profess, practice, and propagate religion, subject to public order, morality, and health.',
      },
      {
        id: 'culture',
        index: 4,
        articles: 'Articles 29–30',
        title: 'Cultural and Educational Rights',
        brief:
          'Protects distinct languages, scripts, and cultures, and grants minorities the right to establish and administer educational institutions.',
      },
      {
        id: 'remedies',
        index: 5,
        articles: 'Article 32',
        title: 'Right to Constitutional Remedies',
        brief:
          'Empowers individuals to move the Supreme Court directly via writs to enforce Fundamental Rights (High Courts also hold writ jurisdiction under Article 226).',
      },
    ],
    featuresKicker: 'Platform Architecture · 01–05',
    featuresTitle: "What's inside Ulagu",
    featuresSubtitle: 'One app instead of many, built around real situations.',
    features: [
      {
        number: '01',
        title: 'Learn through games',
        text: 'Quizzes, challenges and animated lessons that make concepts stick.',
      },
      {
        number: '02',
        title: 'Solve a problem',
        text: 'Search what you are stuck on and get the answer, or be pointed to where it can be found.',
      },
      {
        number: '03',
        title: 'Government guides',
        text: 'Step-by-step help for schemes, certificates and applications you can do yourself.',
      },
      {
        number: '04',
        title: 'Daily challenges',
        text: 'Earn XP, build a streak and keep learning a little every day.',
      },
      {
        number: '05',
        title: 'My Rights · நான் யார்?',
        text: 'The Constitution of India explained through real-life situations, with helplines and a rights quiz, so you know what to do when something goes wrong.',
        featured: true,
      },
    ],
    focusMonumentCta: 'Explore My Rights in 3D',
    howKicker: 'Three-Step Civic Flow',
    howTitle: 'How it works',
    steps: [
      {
        number: '1',
        title: 'Tell Ulagu your problem',
        text: 'Type it the way you would say it, in Tamil or English.',
      },
      {
        number: '2',
        title: 'Follow simple steps',
        text: 'Get a clear guide, lesson or the right you can claim.',
      },
      {
        number: '3',
        title: 'Do it yourself',
        text: 'Handle the small things on your own and know where to go for the big ones.',
      },
    ],
    teamKicker: 'Stewardship & Direction',
    teamTitle: 'The people behind Ulagu',
    team: [
      {
        name: 'Arun Prakash V',
        initials: 'AP',
        role: 'Founder & Chairman',
        text: 'Came up with the core idea of a free knowledge app for the public, and guides its vision.',
      },
      {
        name: 'Durai Raj N',
        initials: 'DR',
        role: 'Co-Founder & Managing Director',
        text: 'Developed the idea into a product, adding features such as My Rights (நான் யார்?), and leads its direction.',
      },
    ],
    comingSoonLabel: 'Coming soon',
    comingSoonTitle: 'Ulagu is coming soon',
    comingSoonSubtitle: 'First look at the bilingual mobile experience ahead of Beta.',
    posterIndiaAlt:
      'Ulagu coming soon poster: the Ulagu app on a phone in front of a glowing map of India',
    posterIndiaCaption: 'Across India — Tamil & English civic knowledge in your pocket',
    posterGlobeAlt:
      'Ulagu coming soon poster: a phone showing a glowing globe, linked to icons for books, rights, learning and ideas',
    posterGlobeCaption: 'Books, rights, learning and ideas connected in one app',
    joinKicker: 'Beta 1 Dec 2026 · Google Play 8 Feb 2027',
    joinTitle: 'Be among the first to try Ulagu',
    joinText:
      'Beta testing starts on 1 December 2026, and the app launches on Google Play on 8 February 2027. Join the waitlist and we will tell you when it is ready.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    submitWaitlist: 'Join the waitlist',
    submittingWaitlist: 'Joining...',
    consentPrefix: "I agree to receive emails about Ulagu's beta and launch. See our ",
    consentLinkLabel: 'Privacy Policy',
    consentSuffix: '.',
    consentMissing: 'Please tick the box to agree to receive emails.',
    waitlistInvalid: 'Please enter a valid email address.',
    waitlistSuccess: "You're on the list. We will be in touch when Ulagu is ready.",
    waitlistError: 'We could not join the waitlist right now. Please try again later.',
    waitlistAnother: 'Add another email',
    footerDescription:
      'Ulagu shares general information to help people understand their rights and public services. It is not legal advice.',
    footerLaunchDate: 'Beta 1 December 2026 · Google Play 8 February 2027',
    privacyLink: 'Privacy Policy',
    deleteLink: 'Delete account',
    backToTop: 'Back to top',
    footerLegal:
      '© 2026 Ulagu Knowledge Private Limited (under incorporation), Chennai. Ulagu is an independent initiative and is not a government app.',
    webglUnavailableTitle: 'Interactive 3D Canvas Unavailable',
    webglUnavailableBody:
      'Hardware-accelerated WebGL context could not be initialized in this browser session.',
    modalClose: 'Close',
    privacyModalTitle: 'Privacy Policy',
    privacyModalBody:
      'When you join the Ulagu waitlist, we collect only your email address and preferred language solely to notify you about beta testing (1 December 2026) and the Google Play launch (8 February 2027). We never sell or share your email with third parties. To update or remove your details, write to ulagu2026@gmail.com.',
    deleteModalTitle: 'Delete account & data',
    deleteModalBody:
      'User accounts launch with beta testing on 1 December 2026. If you joined the waitlist or wish to have your stored email or account data permanently deleted at any time, email ulagu2026@gmail.com from the address you registered and we will process removal promptly.',
    dock: {
      regionLabel: '3D Controls',
      scrollSync: 'Scroll Sync',
      freeOrbit: 'Free Orbit',
      breakdown: 'Breakdown',
      view: 'View',
      viewOverview: 'Overview',
      viewScales: 'Scales',
      viewRotunda: 'Rotunda',
      finish: 'Finish',
      finishObsidian: 'Civic Ink',
      finishBrass: 'Saffron Brass',
      finishMarble: 'Court Marble',
      showControls: 'Show Controls',
      hideControls: 'Hide Controls',
      play: 'Play animation',
      pause: 'Pause animation',
      reset: 'Reset view',
    },
  },
  ta: {
    brandEnglish: 'Ulagu',
    brandTamil: 'உலகு',
    navRights: 'என் உரிமைகள்',
    navFeatures: 'உலகுவில் என்ன உள்ளது?',
    navHow: 'இது எப்படி செயல்படுகிறது',
    navTeam: 'குழு',
    joinWaitlist: 'காத்திருப்புப் பட்டியலில் சேருங்கள்',
    menuOpen: 'வழிசெலுத்தல் பட்டியைத் திறக்கவும்',
    menuClose: 'வழிசெலுத்தல் பட்டியை மூடவும்',
    heroPill: 'ஒவ்வொரு இந்தியருக்கும் இலவச அறிவு',
    heroTitle: 'உங்கள் உரிமைகளை அறியுங்கள். எதையும் கற்றுக்கொள்ளுங்கள். நீங்களே தீர்வு காணுங்கள்.',
    heroTamilLine: 'உங்கள் உரிமைகள். உங்கள் மொழியில்.',
    heroParagraph:
      'அரசுத் திட்டங்கள், அரசியலமைப்பு மற்றும் அன்றாடப் பிரச்சினைகளை எளிய பாடங்கள், விளையாட்டுகள், படிப்படியான வழிகாட்டிகளாகத் தமிழிலும் ஆங்கிலத்திலும் உலகு வழங்குகிறது.',
    seeInside: 'உள்ளடக்கத்தைப் பாருங்கள்',
    inspect3d: '3D பிரிப்பைப் பாருங்கள்',
    assemble3d: '3D மண்டபத்தை இணைக்கவும்',
    scrollHint: 'ஸ்க்ரோல் செய்து 3D மண்டபத்தைக் காண்க · சுழற்ற இழுக்கவும் · H அழுத்தவும்',
    rightsLabel: 'என் உரிமைகள் · நான் யார்?',
    rightsTitle: 'ஆறு அடிப்படை உரிமைகள் — எளிய மொழியில்',
    rightsHint: 'அரசியலமைப்புத் தூணில் பார்க்க கீழே உள்ள உரிமையைத் தேர்ந்தெடுக்கவும்.',
    rightsClear: 'தூண் தேர்வை நீக்கு',
    rights: [
      {
        id: 'equality',
        index: 0,
        articles: 'பிரிவுகள் 14–18',
        title: 'சமத்துவ உரிமை',
        brief:
          'சட்டத்தின் முன் அனைவரும் சமம்; மதம், இனம், சாதி, பாலினம் அல்லது பிறப்பிட அடிப்படையில் பாகுபாடு இல்லை; பொது வேலைவாய்ப்பில் சம வாய்ப்பு மற்றும் தீண்டாமை ஒழிப்பு.',
      },
      {
        id: 'freedom',
        index: 1,
        articles: 'பிரிவுகள் 19–22',
        title: 'சுதந்திர உரிமை',
        brief:
          'கருத்துச் சுதந்திரம், அமைதியாகக் கூடும் உரிமை, நாடெங்கும் செல்லும் சுதந்திரம், உயிர் மற்றும் தனிநபர் சுதந்திரம், 6–14 வயதுக் குழந்தைகளுக்கு இலவசக் கல்வி (பிரிவு 21A), மற்றும் தன்னிச்சையான கைதுக்கு எதிரான பாதுகாப்பு.',
      },
      {
        id: 'exploitation',
        index: 2,
        articles: 'பிரிவுகள் 23–24',
        title: 'சுரண்டலுக்கு எதிரான உரிமை',
        brief:
          'மனிதக் கடத்தல், கட்டாய உழைப்பு மற்றும் 14 வயதுக்குட்பட்ட குழந்தைகளைத் தொழிற்சாலைகள், சுரங்கங்கள் அல்லது அபாயகரமான பணிகளில் ஈடுபடுத்துவதைத் தடை செய்கிறது.',
      },
      {
        id: 'religion',
        index: 3,
        articles: 'பிரிவுகள் 25–28',
        title: 'மதச் சுதந்திர உரிமை',
        brief:
          'பொது அமைதி, ஒழுக்கம் மற்றும் சுகாதாரத்திற்கு உட்பட்டு மனசாட்சிச் சுதந்திரமும், விரும்பிய மதத்தைத் தழுவவும் பின்பற்றவும் பரப்பவும் வழங்கப்படும் உரிமையும்.',
      },
      {
        id: 'culture',
        index: 4,
        articles: 'பிரிவுகள் 29–30',
        title: 'கலாச்சார மற்றும் கல்வி உரிமைகள்',
        brief:
          'தனித்துவமான மொழி, எழுத்து, பண்பாட்டைப் பாதுகாக்கவும், சிறுபான்மையினர் கல்வி நிறுவனங்களை நிறுவி நிர்வகிக்கவும் உரிமை அளிக்கிறது.',
      },
      {
        id: 'remedies',
        index: 5,
        articles: 'பிரிவு 32',
        title: 'அரசியலமைப்பு வழித் தீர்வுகளைப் பெறும் உரிமை',
        brief:
          'அடிப்படை உரிமைகள் மீறப்படும்போது அவற்றை நிலைநாட்ட நேரடியாக உச்ச நீதிமன்றத்தை ரிட் மனு மூலம் அணுகும் உரிமை (பிரிவு 226-ன் கீழ் உயர் நீதிமன்றங்களிலும் அணுகலாம்).',
      },
    ],
    featuresKicker: 'செயலி அமைப்பு · 01–05',
    featuresTitle: 'உலகுவில் என்ன உள்ளது',
    featuresSubtitle: 'நிஜ வாழ்க்கைச் சூழல்களை மையமாகக் கொண்ட ஒரே செயலி.',
    features: [
      {
        number: '01',
        title: 'விளையாட்டுகள் மூலம் கற்கலாம்',
        text: 'கருத்துகளை நினைவில் நிறுத்தும் வினாடி வினாக்கள், சவால்கள், அசைவூட்டப் பாடங்கள்.',
      },
      {
        number: '02',
        title: 'பிரச்சினைக்குத் தீர்வு காணுங்கள்',
        text: 'உங்கள் சிக்கலைத் தேடி விடையைக் கண்டறியுங்கள்; அல்லது அதைக் கண்டுபிடிக்க வேண்டிய இடத்தை அறியுங்கள்.',
      },
      {
        number: '03',
        title: 'அரசுச் சேவை வழிகாட்டிகள்',
        text: 'நீங்களே பெறக்கூடிய திட்டங்கள், சான்றிதழ்கள், விண்ணப்பங்களுக்கான படிப்படியான உதவி.',
      },
      {
        number: '04',
        title: 'தினசரி சவால்கள்',
        text: 'XP புள்ளிகளைப் பெற்று, தொடர்ச்சியை உருவாக்கி, தினமும் கொஞ்சம் கற்றுக்கொள்ளுங்கள்.',
      },
      {
        number: '05',
        title: 'என் உரிமைகள் · நான் யார்?',
        text: 'நிஜ வாழ்க்கைச் சூழல்கள் மூலம் இந்திய அரசியலமைப்பை அறியுங்கள். உதவி எண்களும் உரிமைகள் வினாடி வினாவும், சிக்கல் நேரத்தில் என்ன செய்ய வேண்டும் என்பதைப் புரியவைக்கும்.',
        featured: true,
      },
    ],
    focusMonumentCta: '3D உரிமைகள் மண்டபத்தைப் பார்',
    howKicker: 'மூன்று எளிய படிகள்',
    howTitle: 'இது எப்படி செயல்படுகிறது',
    steps: [
      {
        number: '1',
        title: 'உங்கள் பிரச்சினையை உலகுவிடம் சொல்லுங்கள்',
        text: 'தமிழிலோ ஆங்கிலத்திலோ, நீங்கள் பேசுவது போலவே தட்டச்சு செய்யுங்கள்.',
      },
      {
        number: '2',
        title: 'எளிய படிகளைப் பின்பற்றுங்கள்',
        text: 'தெளிவான வழிகாட்டி, பாடம் அல்லது நீங்கள் கோரக்கூடிய உரிமையைப் பெறுங்கள்.',
      },
      {
        number: '3',
        title: 'நீங்களே செய்து பாருங்கள்',
        text: 'சிறிய வேலைகளை நீங்களே செய்து, பெரிய உதவிகளுக்கு எங்கு செல்ல வேண்டும் என்பதை அறியுங்கள்.',
      },
    ],
    teamKicker: 'தலைமை & வழிகாட்டுதல்',
    teamTitle: 'உலகுவின் பின்னால் இருக்கும் மனிதர்கள்',
    team: [
      {
        name: 'Arun Prakash V',
        initials: 'AP',
        role: 'நிறுவனர் மற்றும் தலைவர்',
        text: 'பொதுமக்களுக்கான இலவச அறிவுச் செயலி என்ற அடிப்படை யோசனையை உருவாக்கி, அதன் தொலைநோக்கை வழிநடத்துகிறார்.',
      },
      {
        name: 'Durai Raj N',
        initials: 'DR',
        role: 'இணை நிறுவனர் மற்றும் நிர்வாக இயக்குநர்',
        text: 'இந்த யோசனையை ஒரு தயாரிப்பாக உருவாக்கி, என் உரிமைகள் (நான் யார்?) போன்ற அம்சங்களைச் சேர்த்து, அதன் செயல்திசையை வழிநடத்துகிறார்.',
      },
    ],
    comingSoonLabel: 'விரைவில்',
    comingSoonTitle: 'உலகு விரைவில் வருகிறது',
    comingSoonSubtitle: 'பீட்டா சோதனைக்கு முன்னதாக இருமொழி மொபைல் அனுபவத்தின் முதல் பார்வை.',
    posterIndiaAlt:
      'உலகு விரைவில் சுவரொட்டி: ஒளிரும் இந்திய வரைபடத்தின் முன் கைபேசியில் உலகு செயலி',
    posterIndiaCaption: 'இந்தியா முழுவதும் — தமிழிலும் ஆங்கிலத்திலும் குடிமை அறிவு',
    posterGlobeAlt: 'உலகு விரைவில் சுவரொட்டி: ஒளிரும் உலக உருண்டையைக் காட்டும் கைபேசி',
    posterGlobeCaption: 'புத்தகங்கள், உரிமைகள், கற்றல் மற்றும் சிந்தனைகள் ஒரே செயலியில்',
    joinKicker: 'பீட்டா 1 டிச 2026 · Google Play 8 பிப் 2027',
    joinTitle: 'உலகுவை முதலில் முயற்சிப்பவர்களில் ஒருவராகுங்கள்',
    joinText:
      'பீட்டா சோதனை 2026 டிசம்பர் 1 அன்று தொடங்குகிறது; செயலி 2027 பிப்ரவரி 8 அன்று Google Play-ல் வெளியாகிறது. தயாரானதும் தெரிவிக்க, காத்திருப்புப் பட்டியலில் சேருங்கள்.',
    emailLabel: 'மின்னஞ்சல் முகவரி',
    emailPlaceholder: 'you@example.com',
    submitWaitlist: 'காத்திருப்புப் பட்டியலில் சேருங்கள்',
    submittingWaitlist: 'சேர்க்கப்படுகிறது...',
    consentPrefix: 'உலகு பீட்டா மற்றும் வெளியீடு பற்றிய மின்னஞ்சல்களைப் பெற ஒப்புக்கொள்கிறேன். ',
    consentLinkLabel: 'தனியுரிமைக் கொள்கை',
    consentSuffix: 'யைப் பாருங்கள்.',
    consentMissing: 'மின்னஞ்சல் பெற ஒப்புக்கொள்ள, பெட்டியைத் தேர்வு செய்யுங்கள்.',
    waitlistInvalid: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
    waitlistSuccess: 'நீங்கள் பட்டியலில் சேர்ந்துவிட்டீர்கள். உலகு தயாரானதும் தொடர்புகொள்வோம்.',
    waitlistError: 'இப்போது காத்திருப்புப் பட்டியலில் சேர்க்க முடியவில்லை. பின்னர் மீண்டும் முயற்சிக்கவும்.',
    waitlistAnother: 'மற்றொரு மின்னஞ்சலைச் சேர்க்கவும்',
    footerDescription:
      'உங்கள் உரிமைகள் மற்றும் பொதுச் சேவைகளைப் புரிந்துகொள்ள உலகு பொதுத் தகவல்களை வழங்குகிறது. இது சட்ட ஆலோசனை அல்ல.',
    footerLaunchDate: 'பீட்டா 1 டிசம்பர் 2026 · Google Play 8 பிப்ரவரி 2027',
    privacyLink: 'தனியுரிமைக் கொள்கை',
    deleteLink: 'கணக்கை நீக்க',
    backToTop: 'மேலே செல்க',
    footerLegal:
      '© 2026 உலகு நாலெட்ஜ் பிரைவேட் லிமிடெட் (பதிவு நடைபெறுகிறது), சென்னை. உலகு ஒரு தனியார் முயற்சி; இது அரசு செயலி அல்ல.',
    webglUnavailableTitle: '3D காட்சித் திரை கிடைக்கவில்லை',
    webglUnavailableBody:
      'இந்த உலாவி அமர்வில் வன்பொருள்-முடுக்கப்பட்ட WebGL சூழலைத் தொடங்க முடியவில்லை.',
    modalClose: 'மூடுக',
    privacyModalTitle: 'தனியுரிமைக் கொள்கை',
    privacyModalBody:
      'நீங்கள் உலகு காத்திருப்புப் பட்டியலில் சேரும்போது, பீட்டா சோதனை (1 டிசம்பர் 2026) மற்றும் Google Play வெளியீடு (8 பிப்ரவரி 2027) பற்றித் தெரிவிக்க மட்டுமே உங்கள் மின்னஞ்சல் முகவரியும் மொழித் தேர்வும் சேகரிக்கப்படுகின்றன. உங்கள் விவரங்கள் மூன்றாம் தரப்பினருடன் பகிரப்படவோ விற்கப்படவோ மாட்டாது. திருத்த அல்லது நீக்க ulagu2026@gmail.com என்ற முகவரிக்கு எழுதுங்கள்.',
    deleteModalTitle: 'கணக்கு & தரவு நீக்கம்',
    deleteModalBody:
      'பயனர் கணக்குகள் 1 டிசம்பர் 2026 பீட்டா சோதனையுடன் தொடங்குகின்றன. காத்திருப்புப் பட்டியலில் உள்ள உங்கள் மின்னஞ்சல் அல்லது கணக்குத் தரவை எந்த நேரத்திலும் நிரந்தரமாக நீக்க விரும்பினால், பதிவு செய்த மின்னஞ்சலில் இருந்து ulagu2026@gmail.com-க்கு எழுதுங்கள்; விரைவில் நீக்கப்படும்.',
    dock: {
      regionLabel: '3D கட்டுப்பாடுகள்',
      scrollSync: 'ஸ்க்ரோல்',
      freeOrbit: 'சுய சுழற்சி',
      breakdown: 'பிரிப்பு',
      view: 'பார்வை',
      viewOverview: 'முழுமை',
      viewScales: 'தராசு',
      viewRotunda: 'மண்டபம்',
      finish: 'வண்ணம்',
      finishObsidian: 'நீல மை',
      finishBrass: 'செம்பு',
      finishMarble: 'சலவை',
      showControls: 'கட்டுப்பாடுகள்',
      hideControls: 'மறை',
      play: 'இயக்குக',
      pause: 'நிறுத்துக',
      reset: 'மீட்டமைக்க',
    },
  },
};
