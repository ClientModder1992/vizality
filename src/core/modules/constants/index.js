import { join } from 'path';

// Vizality
export const HTTP = Object.freeze({
  CDN: 'https://cdn.vizality.com',
  WEBSITE: 'https://vizality.com',
  TRELLO: 'https://trello.com/vizality',
  get API () { return `${this.WEBSITE}/api`; },
  get DOCS () { return `${this.WEBSITE}/docs`; },
  get ASSETS () { return `${this.CDN}/assets`; }
});

// GitHub
export const Repositories = Object.freeze({
  ORG: 'vizality',
  get VIZALITY () { return `${this.ORG}/vizality`; },
  get COMMUNITY () { return `vizality-community`; },
  get DOCS () { return `${this.ORG}/docs`; }
});

// Directories
export const Directories = Object.freeze({
  ROOT: join(__dirname, '..', '..', '..', '..'),
  get SRC () { return join(this.ROOT, 'src'); },
  get VIZALITY () { return join(this.SRC, 'core'); },
  // ---
  get SETTINGS () { return join(this.ROOT, 'settings'); },
  get CACHE () { return join(this.ROOT, '.cache'); },
  get LOGS () { return join(this.ROOT, '.logs'); },
  // ---
  get ADDONS () { return join(this.ROOT, 'addons'); },
  get PLUGINS () { return join(this.ADDONS, 'plugins'); },
  get BUILTINS () { return join(this.VIZALITY, 'builtins'); },
  get THEMES () { return join(this.ADDONS, 'themes'); },
  // ---
  get API () { return join(this.VIZALITY, 'api'); },
  get LIB () { return join(this.VIZALITY, 'lib'); },
  get LANGUAGES () { return join(this.VIZALITY, 'languages'); },
  get MANAGERS () { return join(this.VIZALITY, 'managers'); },
  get STYLES () { return join(this.VIZALITY, 'styles'); },
  get MODULES () { return join(__dirname, '..'); }
});

// Guild
export const Guild = Object.freeze({
  INVITE: '42B8AC9',
  ID: '689933814864150552'
});

// Channels
export const Channels = Object.freeze({
  CSS_SNIPPETS: '705262981214371902',
  JS_SNIPPETS: '705262981214371902',
  PLUGINS: '700461738004578334',
  THEMES: '700461710972157954',
  DEVELOPMENT: '690452269753171998',
  STAFF: '690452551233175602',
  INSTALLATION_SUPPORT: '718478897695424613',
  PLUGINS_SUPPORT: '705264484528291956',
  THEMES_SUPPORT: '705264431831187496',
  MISC_SUPPORT: '705264513728905266'
});

// @todo These need proper testing and more added.
export const Regexes = Object.freeze({
  BAD_WORDS: '( hell |5h1t|5hit|anal|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|ballsack|bastard|beastial|beastiality|bestial|bestiality|bi\\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|blow job|blowjob|blowjobs|boiolas|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|bunny fucker|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cl1t|clit|clitoris|clits|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cokmuncher|coksucka|coon|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dlck|dog-fucker|donkeyribber|doosh|duche|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fannyfucker|fatass|fcuk|fcuker|fcuking|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|god-dam|god-damned|goddamn|goddamned|hardcoresex|homo|hore|hotsex|kunilingus|l3i\\+ch|l3itch|labia|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muthafuckker|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|penis|penisfucker|phonesex|pigfucker|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|porn|porno|pornography|pornos|prick|pricks|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|schlong|scroat|scrote|scrotum|semen|sex|sh!\\+|sh!t|sh1t|shi\\+|shit|shitdick|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|son-of-a-bitch|s_h_i_t|t1tt1e5|t1tties|testicle|titfuck|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|v14gra|v1gra|vagina|vulva|whore)',
  DISCORD: '^(https?://)?(canary.|ptb.)?discord(?:app)?.com',
  get INVITE () { return `${this.DISCORD}/invite|.gg)/[a-zA-Z1-9]{2,}`; },
  // eslint-disable-next-line no-useless-escape
  get MESSAGE_LINK () { return `${this.DISCORD}/channels/(?:@me|\d{17,19}/)?\d{17,19}/\d{17,19}`; },
  get ASSET_LINK () { return `(?:${this.DISCORD})?/assets/(?:[0-9].)?[a-zA-Z0-9]{20,32}.?[a-z]{2,5}`; },
  // eslint-disable-next-line no-useless-escape
  EMOJI: '(:|<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(:|>)'
});

// Events
export const Events = Object.freeze({
  VIZALITY_POPUP_WINDOW_OPEN: 'popupWindowOpen',
  VIZALITY_POPUP_WINDOW_CLOSE: 'popupWindowClose'
});

// Avatars
export const Avatars = Object.freeze({
  // Theme icons
  get DEFAULT_THEME_1 () { return `${HTTP.ASSETS}/default-theme-1.png`; },
  get DEFAULT_THEME_2 () { return `${HTTP.ASSETS}/default-theme-2.png`; },
  get DEFAULT_THEME_3 () { return `${HTTP.ASSETS}/default-theme-3.png`; },
  get DEFAULT_THEME_4 () { return `${HTTP.ASSETS}/default-theme-4.png`; },
  get DEFAULT_THEME_5 () { return `${HTTP.ASSETS}/default-theme-5.png`; },
  // Plugin icons
  get DEFAULT_PLUGIN_1 () { return `${HTTP.ASSETS}/default-plugin-1.png`; },
  get DEFAULT_PLUGIN_2 () { return `${HTTP.ASSETS}/default-plugin-2.png`; },
  get DEFAULT_PLUGIN_3 () { return `${HTTP.ASSETS}/default-plugin-3.png`; },
  get DEFAULT_PLUGIN_4 () { return `${HTTP.ASSETS}/default-plugin-4.png`; },
  get DEFAULT_PLUGIN_5 () { return `${HTTP.ASSETS}/default-plugin-5.png`; }
});

// Errors
export const ErrorTypes = Object.freeze({
  // Misc
  NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
  // Addons
  MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
  INVALID_MANIFEST: 'INVALID_MANIFEST'
});
