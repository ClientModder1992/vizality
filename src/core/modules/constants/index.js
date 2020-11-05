const { join } = require('path');

const constants = module.exports = Object.freeze({
  // Vizality
  HTTP: Object.freeze({
    WEBSITE: 'https://vizality.com',
    TRELLO: 'https://trello.com/vizality',
    get API () { return `${constants.HTTP.WEBSITE}/app/api`; },
    get DOCS () { return `${constants.HTTP.API}/docs`; },
    get ASSETS () { return `${constants.HTTP.WEBSITE}/app/assets`; },
    get IMAGES () { return `${constants.HTTP.ASSETS}/images`; }
  }),

  // GitHub
  Repositories: Object.freeze({
    ORG: 'vizality',
    get VIZALITY () { return `${constants.Repositories.ORG}/vizality`; },
    get COMMUNITY () { return `vizality-community`; },
    get DOCS () { return `${constants.Repositories.ORG}/docs`; }
  }),

  // Directories
  Directories: Object.freeze({
    ROOT: join(__dirname, '..', '..', '..', '..'),
    get SRC () { return join(constants.Directories.ROOT, 'src'); },
    get VIZALITY () { return join(constants.Directories.SRC, 'core'); },
    // ---
    get SETTINGS () { return join(constants.Directories.ROOT, 'settings'); },
    get CACHE () { return join(constants.Directories.ROOT, '.cache'); },
    get LOGS () { return join(constants.Directories.ROOT, '.logs'); },
    // ---
    get ADDONS () { return join(constants.Directories.ROOT, 'addons'); },
    get PLUGINS () { return join(constants.Directories.ADDONS, 'plugins'); },
    get BUILTINS () { return join(constants.Directories.VIZALITY, 'builtins'); },
    get THEMES () { return join(constants.Directories.ADDONS, 'themes'); },
    // ---
    get API () { return join(constants.Directories.VIZALITY, 'api'); },
    get LIB () { return join(constants.Directories.VIZALITY, 'lib'); },
    get LANGUAGES () { return join(constants.Directories.VIZALITY, 'languages'); },
    get MANAGERS () { return join(constants.Directories.VIZALITY, 'managers'); },
    get STYLES () { return join(constants.Directories.VIZALITY, 'styles'); },
    get MODULES () { return join(__dirname, '..'); }
  }),

  // Guild
  Guild: Object.freeze({
    INVITE: '42B8AC9',
    ID: '689933814864150552'
  }),

  // Channels
  Channels: Object.freeze({
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
  }),

  // @todo These need proper testing and more added.
  Regexes: Object.freeze({
    BAD_WORDS: '/\b(4r5e|5h1t|5hit|a55|anal|anus|ar5e|arrse|arse|ass|ass-fucker|asses|assfucker|assfukka|asshole|assholes|asswhole|a_s_s|b!tch|b00bs|b17ch|b1tch|ballbag|balls|ballsack|bastard|beastial|beastiality|bellend|bestial|bestiality|bi\\+ch|biatch|bitch|bitcher|bitchers|bitches|bitchin|bitching|bloody|blow job|blowjob|blowjobs|boiolas|bollock|bollok|boner|boob|boobs|booobs|boooobs|booooobs|booooooobs|breasts|buceta|bugger|bum|bunny fucker|butt|butthole|buttmuch|buttplug|c0ck|c0cksucker|carpet muncher|cawk|chink|cipa|cl1t|clit|clitoris|clits|cnut|cock|cock-sucker|cockface|cockhead|cockmunch|cockmuncher|cocks|cocksuck|cocksucked|cocksucker|cocksucking|cocksucks|cocksuka|cocksukka|cok|cokmuncher|coksucka|coon|cox|crap|cum|cummer|cumming|cums|cumshot|cunilingus|cunillingus|cunnilingus|cunt|cuntlick|cuntlicker|cuntlicking|cunts|cyalis|cyberfuc|cyberfuck|cyberfucked|cyberfucker|cyberfuckers|cyberfucking|d1ck|damn|dick|dickhead|dildo|dildos|dink|dinks|dirsa|dlck|dog-fucker|doggin|dogging|donkeyribber|doosh|duche|dyke|ejaculate|ejaculated|ejaculates|ejaculating|ejaculatings|ejaculation|ejakulate|f u c k|f u c k e r|f4nny|fag|fagging|faggitt|faggot|faggs|fagot|fagots|fags|fanny|fannyflaps|fannyfucker|fanyy|fatass|fcuk|fcuker|fcuking|feck|fecker|felching|fellate|fellatio|fingerfuck|fingerfucked|fingerfucker|fingerfuckers|fingerfucking|fingerfucks|fistfuck|fistfucked|fistfucker|fistfuckers|fistfucking|fistfuckings|fistfucks|flange|fook|fooker|fuck|fucka|fucked|fucker|fuckers|fuckhead|fuckheads|fuckin|fucking|fuckings|fuckingshitmotherfucker|fuckme|fucks|fuckwhit|fuckwit|fudge packer|fudgepacker|fuk|fuker|fukker|fukkin|fuks|fukwhit|fukwit|fux|fux0r|f_u_c_k|gangbang|gangbanged|gangbangs|gaylord|gaysex|goatse|God|god-dam|god-damned|goddamn|goddamned|hardcoresex|hell|heshe|hoar|hoare|hoer|homo|hore|horniest|horny|hotsex|jack-off|jackoff|jap|jerk-off|jism|jiz|jizm|jizz|kawk|knob|knobead|knobed|knobend|knobhead|knobjocky|knobjokey|kock|kondum|kondums|kum|kummer|kumming|kums|kunilingus|l3i\\+ch|l3itch|labia|lust|lusting|m0f0|m0fo|m45terbate|ma5terb8|ma5terbate|masochist|master-bate|masterb8|masterbat*|masterbat3|masterbate|masterbation|masterbations|masturbate|mo-fo|mof0|mofo|mothafuck|mothafucka|mothafuckas|mothafuckaz|mothafucked|mothafucker|mothafuckers|mothafuckin|mothafucking|mothafuckings|mothafucks|mother fucker|motherfuck|motherfucked|motherfucker|motherfuckers|motherfuckin|motherfucking|motherfuckings|motherfuckka|motherfucks|muff|mutha|muthafecker|muthafuckker|muther|mutherfucker|n1gga|n1gger|nazi|nigg3r|nigg4h|nigga|niggah|niggas|niggaz|nigger|niggers|nob|nob jokey|nobhead|nobjocky|nobjokey|numbnuts|nutsack|orgasim|orgasims|orgasm|orgasms|p0rn|pawn|pecker|penis|penisfucker|phonesex|phuck|phuk|phuked|phuking|phukked|phukking|phuks|phuq|pigfucker|pimpis|piss|pissed|pisser|pissers|pisses|pissflaps|pissin|pissing|pissoff|poop|porn|porno|pornography|pornos|prick|pricks|pron|pube|pusse|pussi|pussies|pussy|pussys|rectum|retard|rimjaw|rimming|s hit|s.o.b.|sadist|schlong|screwing|scroat|scrote|scrotum|semen|sex|sh!\\+|sh!t|sh1t|shag|shagger|shaggin|shagging|shemale|shi\\+|shit|shitdick|shite|shited|shitey|shitfuck|shitfull|shithead|shiting|shitings|shits|shitted|shitter|shitters|shitting|shittings|shitty|skank|slut|sluts|smegma|smut|snatch|son-of-a-bitch|spac|spunk|s_h_i_t|t1tt1e5|t1tties|teets|teez|testical|testicle|tit|titfuck|tits|titt|tittie5|tittiefucker|titties|tittyfuck|tittywank|titwank|tosser|turd|tw4t|twat|twathead|twatty|twunt|twunter|v14gra|v1gra|vagina|viagra|vulva|w00se|wang|wank|wanker|wanky|whoar|whore|willies|willy|xrated|xxx)\b/gi',
    DISCORD: '^(https?://)?(canary.|ptb\.)?discord(?:app)?\.com\/',
    INVITE: '^(https?:\/\/)?(canary\.|ptb\.)?discord((?:app)?\.com\/invite|\.gg)\/[a-zA-Z1-9]{2,}',
    MESSAGE_LINK: `https?://(?:canary\.|ptb\.)?discord(?:app)?\.com/channels/(?:@me|\d{17,19}/)?\d{17,19}/\d{17,19}`,
    ASSET_LINK: '(?:(?:https?:\/\/)(?:canary\.|ptb\.)?discord(app)?\.com)?\/assets\/(?:[0-9]\.)?[a-zA-Z0-9]{20,32}\.?[a-z]{2,5}',
    EMOJI: '(:|<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(:|>)'
  }),

  // Errors
  ErrorTypes: Object.freeze({
    // Misc
    NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
    // Addons
    MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
    INVALID_MANIFEST: 'INVALID_MANIFEST'
  })
});
