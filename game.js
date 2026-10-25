'use strict';

const SAVE_KEY = 'chang_sheng_du_original_v1';
const MAX_REALM = 9; // Total number of realms: 炼气 through 渡劫.
const MAX_LAYER = 9;
const MAX_RANK = MAX_REALM * MAX_LAYER - 1;

const REALMS = [
  { name: '炼气', subtitle: '叩开仙门', color: '#9bd1b5', quote: '引气入体，第一次听见天地呼吸。' },
  { name: '筑基', subtitle: '铸就道基', color: '#8dc8bd', quote: '气海有岸，道心自此有了根基。' },
  { name: '金丹', subtitle: '一粒承道', color: '#d4bd78', quote: '丹成无漏，晨昏之间自有光华。' },
  { name: '元婴', subtitle: '神游太虚', color: '#9bb8d2', quote: '婴火照神府，一念可越千山。' },
  { name: '化神', subtitle: '意通天地', color: '#b9a4ce', quote: '山川皆入眼底，风声也成道音。' },
  { name: '炼虚', subtitle: '照见空明', color: '#90bcc4', quote: '虚实之间，终于看见天地的经脉。' },
  { name: '合体', subtitle: '万法归一', color: '#d2b58b', quote: '身与道合，举手投足皆是天象。' },
  { name: '大乘', subtitle: '人间绝巅', color: '#d7c895', quote: '回首来路，云海已落在袖间。' },
  { name: '渡劫', subtitle: '叩问天门', color: '#d8a67f', quote: '九重雷海之后，天门只差最后一念。' }
];

const LAYER_TEXT = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const NUMBER_TEXT = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

const ROOTS = {
  sword: {
    name: '剑心道体',
    glyph: '剑',
    color: '#b9c9c0',
    exp: 1,
    atk: 1.25,
    crit: 0.05,
    breakChance: 0,
    fortune: 1,
    description: '天生近剑，一叶亦可斩风。'
  },
  spirit: {
    name: '清和灵根',
    glyph: '炁',
    color: '#9bd1b5',
    exp: 1.35,
    atk: 1,
    crit: 0,
    breakChance: 0.03,
    fortune: 1,
    description: '五气清和，最宜循序渐进。'
  },
  chaos: {
    name: '混沌灵根',
    glyph: '玄',
    color: '#cfbb83',
    exp: 1.12,
    atk: 1.05,
    crit: 0.01,
    breakChance: 0.01,
    fortune: 1.35,
    description: '诸法皆可亲近，奇遇更易显现。'
  }
};

const TECHNIQUES = {
  breath: {
    name: '太玄吐纳诀',
    glyph: '息',
    path: '周天吐纳',
    accent: '#8fcdb0',
    unlockRealm: 0,
    description: '引天地清气入百脉，使修为自行流转，昼夜不歇。',
    effect: level => `基础吐纳 +${(0.42 * level).toFixed(1)}/息`
  },
  sword: {
    name: '青莲剑典',
    glyph: '剑',
    path: '青莲剑意',
    accent: '#a6c4b7',
    unlockRealm: 0,
    description: '观雨打青莲而悟剑势，寻常一击也含三分剑意。',
    effect: level => `攻伐 +${level * 5}`
  },
  body: {
    name: '玄枢炼体篇',
    glyph: '体',
    path: '玄枢炼体',
    accent: '#c4a781',
    unlockRealm: 0,
    description: '以灵息淬炼筋骨脏腑，让气血与护体之力一同增长。',
    effect: level => `气血 +${level * 16} · 护体 +${level * 3}`
  },
  stars: {
    name: '观星照神法',
    glyph: '星',
    path: '照神观星',
    accent: '#9db7cd',
    unlockRealm: 1,
    description: '借北斗星光洗炼神识，洞察敌手破绽，也更容易遇见机缘。',
    effect: level => `会心 +${level * 1.2}% · 身法 +${level * 0.8}%`
  }
};

const ZONES = [
  {
    id: 'qingya',
    name: '青崖山脉',
    glyph: '崖',
    accent: '#91c4ab',
    danger: 0,
    minRealm: 0,
    recommend: '炼气一至三层',
    description: '松涛里藏着兽影，石壁下偶有前人留下的剑痕。',
    enemies: [
      { name: '灰耳妖狼', glyph: '狼', kind: '山野妖物', trait: '狡黠 · 伺机而动' },
      { name: '赤睛山魈', glyph: '魈', kind: '青崖精怪', trait: '力沉 · 攻势凶猛' },
      { name: '青鳞灵蛇', glyph: '蛇', kind: '山涧异兽', trait: '轻捷 · 身法难测' }
    ]
  },
  {
    id: 'biluo',
    name: '碧落幽泽',
    glyph: '泽',
    accent: '#72a8b5',
    danger: 1,
    minRealm: 1,
    recommend: '筑基二层以上',
    description: '雾气终年不散，水底幽火如同沉睡的星辰。',
    enemies: [
      { name: '噬灵鬼藤', glyph: '藤', kind: '幽泽妖植', trait: '缠缚 · 吸取灵力' },
      { name: '泥沼玄蛟', glyph: '蛟', kind: '碧落水裔', trait: '玄甲 · 护体强横' },
      { name: '青灯狐火', glyph: '狐', kind: '异化精魅', trait: '幻火 · 飘忽难防' }
    ]
  },
  {
    id: 'chixiao',
    name: '赤霄地宫',
    glyph: '焰',
    accent: '#c9896b',
    danger: 2,
    minRealm: 3,
    recommend: '金丹境以上',
    description: '地火在旧宫深处奔涌，残破丹炉仍散发着灼热药香。',
    enemies: [
      { name: '熔岩赤犬', glyph: '犬', kind: '地火妖兽', trait: '炽焰 · 灼伤气血' },
      { name: '守炉傀影', glyph: '傀', kind: '古宫残灵', trait: '铜骨 · 不惧痛楚' },
      { name: '炎心蛊母', glyph: '蛊', kind: '地宫邪物', trait: '毒火 · 愈战愈凶' }
    ]
  },
  {
    id: 'xingyun',
    name: '星陨天渊',
    glyph: '渊',
    accent: '#a391c7',
    danger: 3,
    minRealm: 5,
    recommend: '炼虚境以上',
    description: '破碎星骸悬浮于无底深渊，虚空深处传来古老低语。',
    enemies: [
      { name: '无相星兽', glyph: '星', kind: '天外异兽', trait: '无相 · 会心难测' },
      { name: '陨铁游魂', glyph: '魂', kind: '星渊残魂', trait: '幽寒 · 护体侵蚀' },
      { name: '吞光古蜃', glyph: '蜃', kind: '虚空古种', trait: '吞光 · 气机诡谲' }
    ]
  }
];

const SECT_RANKS = [
  { level: 0, name: '外门弟子', reputation: 0 },
  { level: 1, name: '内门弟子', reputation: 60 },
  { level: 2, name: '真传弟子', reputation: 160 },
  { level: 3, name: '执事长老', reputation: 360 },
  { level: 4, name: '太上长老', reputation: 750 }
];

const SECTS = {
  yunyin: {
    id: 'yunyin',
    name: '云隐剑宗',
    shortName: '云隐',
    glyph: '隐',
    accent: '#93c7ad',
    motto: '一剑入云，万山皆寂',
    description: '以剑证道，不问出身。门规简明，却最重手中剑与心中义。',
    minRealm: 0,
    passiveText: '攻伐 +8%',
    passive: { attack: 0.08 }
  },
  taixu: {
    id: 'taixu',
    name: '太虚问道宫',
    shortName: '太虚',
    glyph: '虚',
    accent: '#a8b6ce',
    motto: '抱元守一，万法归无',
    description: '宫人少言，常于云台静坐。最擅长吐纳炼神与推演天机。',
    minRealm: 1,
    passiveText: '吐纳 +12% · 破境之势 +2%',
    passive: { exp: 0.12, breakChance: 0.02 }
  },
  baicao: {
    id: 'baicao',
    name: '百草长生谷',
    shortName: '百草',
    glyph: '蘅',
    accent: '#8fc79a',
    motto: '一叶济世，百草长生',
    description: '医修与丹师聚集之地，谷中四季如春，药香能传出十里。',
    minRealm: 1,
    passiveText: '气血 +9% · 炼丹灵石 -10%',
    passive: { health: 0.09, alchemyDiscount: 0.1 }
  },
  xingluo: {
    id: 'xingluo',
    name: '星罗万象阁',
    shortName: '星罗',
    glyph: '星',
    accent: '#9f92c6',
    motto: '星移斗转，万象入局',
    description: '观星、布阵、寻宝皆有所长，弟子行踪如星子般散落诸天。',
    minRealm: 2,
    passiveText: '会心 +3% · 机缘冷却 -7息',
    passive: { crit: 0.03, fortuneCooldown: 7 }
  }
};

const SECT_MISSIONS = {
  yunyin: [
    { id: 'patrol_cliff', title: '巡守剑崖', glyph: '巡', description: '替值守弟子巡视剑崖，清扫潜近山门的低阶妖物。', reputation: 14, contribution: 12, stones: 34, exp: 0.03, realm: 0, rank: 0 },
    { id: 'rain_sword', title: '剑冢听雨', glyph: '雨', description: '在剑冢静听一夜雨声，从前人残存的剑意中寻找答案。', reputation: 20, contribution: 17, stones: 26, insight: 1, exp: 0.025, realm: 0, rank: 0 },
    { id: 'escort', title: '护送药使', glyph: '护', description: '护送采药弟子穿过雾岭，将新采灵草送回宗门药库。', reputation: 25, contribution: 22, stones: 48, herbs: 2, exp: 0.05, realm: 1, rank: 1 }
  ],
  taixu: [
    { id: 'cloud_ledger', title: '校对云箓', glyph: '箓', description: '整理云台上的古老符箓，将散乱灵机重新引入阵眼。', reputation: 14, contribution: 12, stones: 28, exp: 0.045, realm: 1, rank: 0 },
    { id: 'star_meditation', title: '代师坐关', glyph: '坐', description: '替闭关长老守住静室，期间只能吐纳，不可分心。', reputation: 20, contribution: 18, insight: 1, exp: 0.03, realm: 1, rank: 1 },
    { id: 'void_route', title: '勘定虚路', glyph: '虚', description: '以神识测量云海裂隙，为宗门重绘一条安全的巡山道路。', reputation: 28, contribution: 24, stones: 52, exp: 0.065, realm: 2, rank: 1 }
  ],
  baicao: [
    { id: 'herb_rows', title: '照料灵圃', glyph: '圃', description: '替药童照料灵圃，辨认叶脉间细微的灵气变化。', reputation: 14, contribution: 12, herbs: 4, exp: 0.02, realm: 1, rank: 0 },
    { id: 'furnace_watch', title: '看守丹炉', glyph: '炉', description: '三日三夜守着炉火，在最危险的凝丹时刻添入一味辅药。', reputation: 20, contribution: 18, stones: 42, insight: 1, exp: 0.035, realm: 1, rank: 0 },
    { id: 'plague_mist', title: '入山问诊', glyph: '诊', description: '携药箱前往疫雾笼罩的山村，替凡人与散修诊治。', reputation: 28, contribution: 25, stones: 56, herbs: 2, exp: 0.05, realm: 2, rank: 1 }
  ],
  xingluo: [
    { id: 'star_chart', title: '观星补图', glyph: '图', description: '登上观星台，记下今夜偏移的星位与灵潮方向。', reputation: 15, contribution: 13, stones: 40, exp: 0.035, realm: 2, rank: 0 },
    { id: 'array_repair', title: '修补星阵', glyph: '阵', description: '循着断裂阵纹寻找缺口，把一枚枚星砂重新嵌回阵盘。', reputation: 22, contribution: 20, stones: 36, insight: 1, exp: 0.045, realm: 2, rank: 0 },
    { id: 'treasure_hunt', title: '追寻星宝', glyph: '宝', description: '根据天象推演一处陨星遗迹，在各方修士抵达前取回宗门遗物。', reputation: 30, contribution: 27, stones: 62, herbs: 1, exp: 0.07, realm: 3, rank: 1 }
  ]
};

const SECT_SHOP = [
  { id: 'herb_box', name: '百草匣', glyph: '草', cost: 22, description: '领取六株整理妥当的灵草。', reward: '灵草 +6' },
  { id: 'gather_pill', name: '聚气丹', glyph: '聚', cost: 32, description: '以宗门灵材炼成的固本丹药。', reward: '聚气丹 +1' },
  { id: 'insight_tea', name: '悟道香', glyph: '悟', cost: 66, description: '焚香入定一炷，识海自然澄明。', reward: '悟道点 +1' },
  { id: 'break_pill', name: '破境丹', glyph: '破', cost: 92, description: '真传弟子方可换取的珍贵丹药。', reward: '破境丹 +1', minRank: 2 }
];

const COMPANIONS = {
  wanzhao: {
    id: 'wanzhao',
    name: '苏晚照',
    title: '听雪剑修',
    glyph: '照',
    accent: '#a7c6d6',
    secondary: '#405f6e',
    sect: '云隐剑宗',
    minRealm: 0,
    description: '常在听雪崖独自练剑的女子。剑势清冷，却会替晚归的同门留一盏灯。',
    bondBenefit: '攻伐 +10% · 会心 +2%',
    quotes: {
      '初见': '“你的剑很安静。若愿意，明日寅时来听雪崖。”',
      '相识': '“剑招不必好看，能护住想护的人便够了。”',
      '相知': '“我在崖上等了你许久。不是催你，只是怕雨大。”',
      '心悦': '“若下一场雪落下时你还在，我便告诉你一个秘密。”',
      '情定': '“从此你的剑旁，永远会有另一道剑光。”'
    },
    talks: [
      '你们在檐下拆解一式剑招，直到灯芯燃尽。她说你的剑比初见时更有温度。',
      '苏晚照把一枚磨得发亮的剑穗系在你的剑柄上，说只是顺手。',
      '她谈起山外的江湖，眼里有雪光，也有难得的笑意。'
    ],
    gifts: [
      '她接过礼物，耳尖被山风吹得微红，却仍认真地说了声多谢。',
      '她将礼物小心收进袖中，约你明日一同试剑。'
    ],
    walks: [
      '你们沿听雪崖走到云海尽头。她忽然出剑，替你斩落了一片藏在雾里的乌云。',
      '雪落在两人的肩上。她走得很慢，似乎在等你说些什么。'
    ]
  },
  qingheng: {
    id: 'qingheng',
    name: '洛青蘅',
    title: '百草医修',
    glyph: '蘅',
    accent: '#91c9a4',
    secondary: '#315c45',
    sect: '百草长生谷',
    minRealm: 1,
    description: '背着旧药箱四处行走的医修。她总能一眼看出别人藏起来的内伤与心事。',
    bondBenefit: '气血 +12% · 丹药回复 +15%',
    quotes: {
      '初见': '“手伸出来。你经脉里有旧伤，别总装作没事。”',
      '相识': '“药能治身，不能替人做决定。你要学会照顾自己。”',
      '相知': '“今日药圃的花开了。我留了一枝给你，别问为什么。”',
      '心悦': '“我走过许多山路，却第一次希望有人能与我慢慢走。”',
      '情定': '“此后你受伤，我会心疼；你无恙，我便会笑了。”'
    },
    talks: [
      '洛青蘅一边碾药，一边听你讲近日修行。她没说教，只在药香里点了点头。',
      '她替你诊脉，指尖停留得比往常久了一些，最后只说“最近休息得好”。',
      '你们说起各地草木与凡人疾苦，不知不觉便过了一个黄昏。'
    ],
    gifts: [
      '她把礼物放在药案旁，低头整理了许久药方，唇角却一直没有落下。',
      '她说礼物太贵重，却还是仔细收好，转身时脚步轻快了许多。'
    ],
    walks: [
      '你们行过一片开满白花的山谷。她一路辨认药草，也一路分给你半个蒸饼。',
      '山雨骤来，她把唯一的伞往你这边偏了偏。'
    ]
  },
  tingyun: {
    id: 'tingyun',
    name: '谢停云',
    title: '星枢阵师',
    glyph: '星',
    accent: '#aaa0cf',
    secondary: '#4a4168',
    sect: '星罗万象阁',
    minRealm: 2,
    description: '终日与星盘为伴的年轻阵师。话不多，却把每一次相遇都算进了自己的阵中。',
    bondBenefit: '吐纳 +10% · 身法 +2%',
    quotes: {
      '初见': '“你来晚了一刻。不过星位刚好，倒也算个好时辰。”',
      '相识': '“阵有生门，人也有。别总走最难的那一条。”',
      '相知': '“这枚星砂收好。无论走到哪里，我都知道你在。”',
      '心悦': '“我推演过千万种未来，最想留下的只有这一种。”',
      '情定': '“从今往后，山河为盘，你我同局。”'
    },
    talks: [
      '谢停云摊开星图，把你不懂的阵纹讲得极慢。烛火映在他的眼底，像一条细小的银河。',
      '你替他校正了一枚星砂的位置。他沉默许久，说这样的误差只有你能看出来。',
      '夜深后他收起星盘，陪你看了一会儿真正落在天幕上的星星。'
    ],
    gifts: [
      '他把礼物放进随身阵匣，认真地在匣盖上添了你的名字。',
      '谢停云端详那件礼物许久，低声道：“比星砂更难得。”'
    ],
    walks: [
      '你们踏过漂浮的星骸，谢停云以阵光替你照亮每一步。',
      '天渊的风很大，他走在外侧，用袖口为你挡去细碎的陨光。'
    ]
  }
};

const RECIPES = [
  {
    id: 'gather',
    name: '聚气丹',
    glyph: '聚',
    accent: '#89c9aa',
    unlockRealm: 0,
    stones: 32,
    herbs: 2,
    description: '服下后立即获得当前气海所需的两成修为。',
    pill: 'gather'
  },
  {
    id: 'heal',
    name: '回春丹',
    glyph: '愈',
    accent: '#c88273',
    unlockRealm: 0,
    stones: 42,
    herbs: 2,
    description: '温养经脉与气血，战斗时可恢复四成五气血。',
    pill: 'heal'
  },
  {
    id: 'clarity',
    name: '凝神丹',
    glyph: '悟',
    accent: '#bdafd2',
    unlockRealm: 1,
    stones: 86,
    herbs: 4,
    description: '药力直入识海，服用后获得两点悟道点。',
    pill: 'clarity'
  },
  {
    id: 'break',
    name: '破境丹',
    glyph: '破',
    accent: '#d1b873',
    unlockRealm: 2,
    stones: 155,
    herbs: 6,
    description: '冲击瓶颈时自动服用，使本次破境之势增加一成八。',
    pill: 'break'
  }
];

const ACHIEVEMENTS = [
  {
    id: 'first_step',
    glyph: '初',
    title: '初叩玄关',
    description: '完成第一次境界突破。',
    reward: { stones: 80, insight: 1 },
    check: s => s.counters.breakthroughs >= 1
  },
  {
    id: 'foundation',
    glyph: '基',
    title: '道基初成',
    description: '踏入筑基境。',
    reward: { stones: 180, insight: 1 },
    check: s => s.realm >= 1
  },
  {
    id: 'first_blood',
    glyph: '剑',
    title: '初试剑锋',
    description: '击败五只山野妖物。',
    reward: { stones: 120, insight: 1 },
    check: s => s.counters.kills >= 5
  },
  {
    id: 'alchemist',
    glyph: '炉',
    title: '炉火初温',
    description: '成功炼成三枚丹药。',
    reward: { stones: 100, insight: 1 },
    check: s => s.counters.alchemy >= 3
  },
  {
    id: 'wanderer',
    glyph: '缘',
    title: '山中客',
    description: '遇见五次山中机缘。',
    reward: { stones: 220, insight: 1 },
    check: s => s.counters.fortunes >= 5
  },
  {
    id: 'sword_intent',
    glyph: '意',
    title: '剑意小成',
    description: '将青莲剑典参悟至五层。',
    reward: { stones: 300, insight: 2 },
    check: s => s.techniques.sword >= 5
  },
  {
    id: 'soul',
    glyph: '婴',
    title: '照见神府',
    description: '踏入化神境。',
    reward: { stones: 800, insight: 3 },
    check: s => s.realm >= 4
  },
  {
    id: 'sect_true',
    glyph: '宗',
    title: '山门栋梁',
    description: '在任意宗门积累一百点声望。',
    reward: { stones: 260, insight: 2 },
    check: s => Math.max(0, ...Object.values(s.sect?.reputation || {})) >= 100
  },
  {
    id: 'bonded',
    glyph: '缘',
    title: '山河同路',
    description: '与一位同行者结为道侣。',
    reward: { stones: 520, insight: 3 },
    check: s => Boolean(s.companions?.bondedTo)
  },
  {
    id: 'ascend',
    glyph: '仙',
    title: '渡尽天劫',
    description: '越过九重雷海，叩开天门。',
    reward: { stones: 5000, insight: 9 },
    check: s => s.ascended
  }
];

const REALM_QUOTES = [
  '道在天地，亦在一呼一吸之间。',
  '心如止水，方能照见诸天星辰。',
  '不争一时之快，方得长久之道。',
  '剑锋向外，道心向内。',
  '万籁俱寂处，可闻大道真音。',
  '山河有尽，而问道之心无穷。',
  '有所执，方能有所破。',
  '云海翻涌，不及一念清明。',
  '天门在前，回首仍是当年山门。'
];

const DOCK_QUOTES = [
  '守一抱元，气自周天。',
  '静水流深，剑意自生。',
  '一念不散，万法可期。',
  '炉火有候，道心无尘。',
  '行到水穷，坐看云起。',
  '虚室生白，神游太清。',
  '万法归一，归一亦忘。',
  '人间绝巅，仍有山路。',
  '身渡雷海，心向长生。'
];

const WEATHER = ['山雨欲来', '松风微凉', '云海初开', '细雨湿衣', '月照寒潭', '薄雾浮峰'];

const ui = {};
let state = null;
let introRoot = 'spirit';
let gameStarted = false;
let activeView = 'home';
let activeBattle = null;
let battleLock = false;
let craftingId = null;
let breakthroughBusy = false;
let tickCount = 0;
let lastClickSound = 0;
let audioContext = null;
let ambientFrame = null;
let ambientParticles = [];
let currentGoalAction = 'cultivate';

function $(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getRank() {
  if (!state) return 0;
  return clamp(state.realm * MAX_LAYER + state.layer - 1, 0, MAX_RANK);
}

function getCurrentRealm() {
  return REALMS[state?.realm || 0];
}

function getRoot() {
  return ROOTS[state?.root] || ROOTS.spirit;
}

function getSectData() {
  return SECTS[state?.sect?.id] || SECTS.yunyin;
}

function getSectRankInfo(reputation = 0) {
  let rankIndex = 0;
  SECT_RANKS.forEach((rank, index) => {
    if (reputation >= rank.reputation) rankIndex = index;
  });
  const current = SECT_RANKS[rankIndex];
  const next = SECT_RANKS[rankIndex + 1] || null;
  const floor = current.reputation;
  const ceiling = next?.reputation || current.reputation;
  const progress = next
    ? clamp(((reputation - floor) / (ceiling - floor)) * 100, 0, 100)
    : 100;
  return { current, next, rankIndex, progress };
}

function getSectStanding() {
  const id = getSectData().id;
  return {
    reputation: state?.sect?.reputation?.[id] || 0,
    contribution: state?.sect?.contribution?.[id] || 0
  };
}

function getCompanionAffection(id) {
  return clamp(Number(state?.companions?.affection?.[id]) || 0, 0, 100);
}

function getCompanionStage(value) {
  if (value >= 82) return { index: 4, name: '情定', next: null, floor: 82 };
  if (value >= 60) return { index: 3, name: '心悦', next: 82, floor: 60 };
  if (value >= 35) return { index: 2, name: '相知', next: 60, floor: 35 };
  if (value >= 15) return { index: 1, name: '相识', next: 35, floor: 15 };
  return { index: 0, name: '初见', next: 15, floor: 0 };
}

function isCompanionUnlocked(companion) {
  return Boolean(state && state.realm >= companion.minRealm);
}

function getRequirement(rank = getRank()) {
  return Math.floor(74 * Math.pow(1.238, rank));
}

function getStats() {
  const rank = getRank();
  const root = getRoot();
  const t = state?.techniques || { breath: 1, sword: 1, body: 1, stars: 1 };
  const bodyLevel = t.body || 1;
  const swordLevel = t.sword || 1;
  const breathLevel = t.breath || 1;
  const starsLevel = t.stars || 1;

  const sect = getSectData();
  const sectRankInfo = getSectRankInfo(getSectStanding().reputation);
  let maxHp = Math.floor(135 + rank * 22 + bodyLevel * 16);
  const maxMana = Math.floor(62 + rank * 7);
  let atk = Math.floor((10 + rank * 2.7 + swordLevel * 5) * root.atk);
  const def = Math.floor(5 + rank * 1.55 + bodyLevel * 3);
  let crit = clamp(0.055 + starsLevel * 0.012 + root.crit, 0.04, 0.52);
  let dodge = clamp(0.025 + starsLevel * 0.008 + (state?.root === 'sword' ? 0.015 : 0), 0.015, 0.24);
  const buffActive = state?.buffUntil > Date.now();
  const baseGain = (1.05 + breathLevel * 0.42) * root.exp * Math.pow(1.162, rank);
  let gain = baseGain;
  let healMultiplier = 1;
  let breakChance = 0.77 + root.breakChance + bodyLevel * 0.009 - (state?.realm || 0) * 0.034 + (state?.daoWounds || 0) * -0.035;

  if (sect.passive.attack) atk = Math.floor(atk * (1 + sect.passive.attack));
  if (sect.passive.health) maxHp = Math.floor(maxHp * (1 + sect.passive.health));
  if (sect.passive.exp) gain *= 1 + sect.passive.exp;
  if (sect.passive.crit) crit += sect.passive.crit;
  if (sect.passive.breakChance) breakChance += sect.passive.breakChance;

  if (state?.companions?.bondedTo === 'wanzhao') {
    atk = Math.floor(atk * 1.1);
    crit += 0.02;
  } else if (state?.companions?.bondedTo === 'qingheng') {
    maxHp = Math.floor(maxHp * 1.12);
    healMultiplier = 1.15;
  } else if (state?.companions?.bondedTo === 'tingyun') {
    gain *= 1.1;
    dodge += 0.02;
  }

  gain *= (buffActive ? 1.7 : 1) * (1 + sectRankInfo.rankIndex * 0.006);
  crit = clamp(crit, 0.04, 0.58);
  dodge = clamp(dodge, 0.015, 0.28);
  const defenseMitigation = def * 0.48;
  breakChance = clamp(breakChance, 0.43, 0.985);

  return {
    rank,
    maxHp,
    maxMana,
    atk,
    def,
    crit,
    dodge,
    gain,
    manualGain: gain * 11 + 4,
    breakChance,
    buffActive,
    defenseMitigation,
    healMultiplier,
    sectRank: sectRankInfo.rankIndex
  };
}

function getFortuneCooldown() {
  let cooldown = state?.root === 'chaos' ? 34 : 43;
  if (state?.sect?.id === 'xingluo') cooldown -= 7;
  return Math.max(18, cooldown);
}

function formatNumber(value) {
  const number = Math.max(0, Number(value) || 0);
  if (number < 10000) return Math.floor(number).toLocaleString('zh-CN');
  if (number < 100000000) {
    const scaled = number / 10000;
    return `${scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(1)}万`;
  }
  if (number < 1000000000000) {
    const scaled = number / 100000000;
    return `${scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(1)}亿`;
  }
  const scaled = number / 1000000000000;
  return `${scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(1)}兆`;
}

function formatRate(value) {
  if (value < 10) return value.toFixed(1);
  if (value < 1000) return Math.floor(value).toString();
  return formatNumber(value);
}

function formatRealm(realmIndex = state.realm, layer = state.layer) {
  if (state?.ascended) return '大罗逍遥';
  return `${REALMS[realmIndex].name}${LAYER_TEXT[layer - 1]}层`;
}

function defaultState(name = '沈砚', root = 'spirit') {
  const now = Date.now();
  return {
    version: 1,
    createdAt: now,
    lastSave: now,
    name: name || '沈砚',
    root: ROOTS[root] ? root : 'spirit',
    realm: 0,
    layer: 1,
    exp: 0,
    hp: 151,
    mana: 62,
    stones: 120,
    herbs: 8,
    insight: 2,
    pills: {
      gather: 1,
      heal: 1,
      clarity: 0,
      break: 0
    },
    techniques: {
      breath: 1,
      sword: 1,
      body: 1,
      stars: 0
    },
    counters: {
      breakthroughs: 0,
      kills: 0,
      alchemy: 0,
      fortunes: 0,
      defeats: 0,
      days: 1,
      herbTimer: 0
    },
    sect: {
      id: 'yunyin',
      reputation: {
        yunyin: 12,
        taixu: 0,
        baicao: 0,
        xingluo: 0
      },
      contribution: {
        yunyin: 12,
        taixu: 0,
        baicao: 0,
        xingluo: 0
      },
      lastMissionAt: 0,
      missionsDone: 0,
      joinedAt: now
    },
    companions: {
      affection: {
        wanzhao: 4,
        qingheng: 0,
        tingyun: 0
      },
      talkAt: {
        wanzhao: 0,
        qingheng: 0,
        tingyun: 0
      },
      walkAt: {
        wanzhao: 0,
        qingheng: 0,
        tingyun: 0
      },
      giftCount: {
        wanzhao: 0,
        qingheng: 0,
        tingyun: 0
      },
      bondedTo: null,
      bondedAt: 0,
      lastBondCultivation: 0,
      selected: 'wanzhao',
      dialogue: {}
    },
    achievements: [],
    defeatedEnemies: [],
    log: [],
    lastFullRank: -1,
    fortuneReady: now + 18000,
    buffUntil: 0,
    daoWounds: 0,
    playSeconds: 0,
    ascended: false,
    settings: {
      sound: true,
      reduceMotion: false
    }
  };
}

function normalizeState(saved) {
  const fresh = defaultState(saved?.name || '沈砚', saved?.root || 'spirit');
  const merged = {
    ...fresh,
    ...saved,
    name: String(saved?.name || fresh.name).slice(0, 10),
    root: ROOTS[saved?.root] ? saved.root : 'spirit',
    pills: { ...fresh.pills, ...(saved?.pills || {}) },
    techniques: { ...fresh.techniques, ...(saved?.techniques || {}) },
    counters: { ...fresh.counters, ...(saved?.counters || {}) },
    sect: {
      ...fresh.sect,
      ...(saved?.sect || {}),
      reputation: { ...fresh.sect.reputation, ...(saved?.sect?.reputation || {}) },
      contribution: { ...fresh.sect.contribution, ...(saved?.sect?.contribution || {}) }
    },
    companions: {
      ...fresh.companions,
      ...(saved?.companions || {}),
      affection: { ...fresh.companions.affection, ...(saved?.companions?.affection || {}) },
      talkAt: { ...fresh.companions.talkAt, ...(saved?.companions?.talkAt || {}) },
      walkAt: { ...fresh.companions.walkAt, ...(saved?.companions?.walkAt || {}) },
      giftCount: { ...fresh.companions.giftCount, ...(saved?.companions?.giftCount || {}) },
      dialogue: { ...fresh.companions.dialogue, ...(saved?.companions?.dialogue || {}) }
    },
    settings: { ...fresh.settings, ...(saved?.settings || {}) },
    achievements: Array.isArray(saved?.achievements) ? saved.achievements.filter(id => ACHIEVEMENTS.some(a => a.id === id)) : [],
    defeatedEnemies: Array.isArray(saved?.defeatedEnemies) ? saved.defeatedEnemies.slice(0, 100) : [],
    log: Array.isArray(saved?.log) ? saved.log.filter(item => item && item.text).slice(0, 28) : []
  };

  merged.realm = clamp(Number(merged.realm) || 0, 0, MAX_REALM - 1);
  merged.layer = clamp(Number(merged.layer) || 1, 1, MAX_LAYER);
  merged.exp = Math.max(0, Number(merged.exp) || 0);
  merged.stones = Math.max(0, Number(merged.stones) || 0);
  merged.herbs = Math.max(0, Number(merged.herbs) || 0);
  merged.insight = Math.max(0, Number(merged.insight) || 0);
  merged.playSeconds = Math.max(0, Number(merged.playSeconds) || 0);
  merged.counters.days = Math.max(1, Number(merged.counters.days) || 1);
  merged.sect.id = SECTS[merged.sect.id] ? merged.sect.id : 'yunyin';
  Object.keys(SECTS).forEach(id => {
    merged.sect.reputation[id] = Math.max(0, Math.floor(Number(merged.sect.reputation[id]) || 0));
    merged.sect.contribution[id] = Math.max(0, Math.floor(Number(merged.sect.contribution[id]) || 0));
  });
  merged.sect.lastMissionAt = Number(merged.sect.lastMissionAt) || 0;
  merged.sect.missionsDone = Math.max(0, Math.floor(Number(merged.sect.missionsDone) || 0));
  Object.keys(COMPANIONS).forEach(id => {
    merged.companions.affection[id] = clamp(Number(merged.companions.affection[id]) || 0, 0, 100);
    merged.companions.talkAt[id] = Number(merged.companions.talkAt[id]) || 0;
    merged.companions.walkAt[id] = Number(merged.companions.walkAt[id]) || 0;
    merged.companions.giftCount[id] = Math.max(0, Math.floor(Number(merged.companions.giftCount[id]) || 0));
  });
  merged.companions.bondedTo = COMPANIONS[merged.companions.bondedTo] ? merged.companions.bondedTo : null;
  merged.companions.selected = COMPANIONS[merged.companions.selected] ? merged.companions.selected : 'wanzhao';
  merged.companions.bondedAt = Number(merged.companions.bondedAt) || 0;
  merged.companions.lastBondCultivation = Number(merged.companions.lastBondCultivation) || 0;
  Object.keys(merged.pills).forEach(key => {
    merged.pills[key] = Math.max(0, Math.floor(Number(merged.pills[key]) || 0));
  });
  Object.keys(merged.techniques).forEach(key => {
    merged.techniques[key] = Math.max(0, Math.floor(Number(merged.techniques[key]) || 0));
  });
  merged.ascended = Boolean(merged.ascended);
  if (merged.ascended) {
    merged.realm = MAX_REALM - 1;
    merged.layer = MAX_LAYER;
    merged.exp = 0;
  }

  const stats = getStatsWithState(merged);
  merged.hp = clamp(Number(merged.hp) || stats.maxHp, 0, stats.maxHp);
  merged.mana = clamp(Number(merged.mana) || stats.maxMana, 0, stats.maxMana);
  merged.fortuneReady = Number(merged.fortuneReady) || Date.now();
  merged.buffUntil = Number(merged.buffUntil) || 0;
  merged.lastFullRank = Number.isFinite(Number(merged.lastFullRank)) ? Number(merged.lastFullRank) : -1;
  return merged;
}

function getStatsWithState(candidate) {
  const previous = state;
  state = candidate;
  const stats = getStats();
  state = previous;
  return stats;
}

function cacheUI() {
  [
    'worldDate', 'weatherText', 'topStones', 'topHerbs', 'soundButton', 'guideButton',
    'avatarGlyph', 'rootName', 'playerName', 'realmLabel', 'sectLabel', 'companionLabel',
    'expText', 'expFill',
    'hpFill', 'hpText', 'manaFill', 'manaText', 'stonesValue', 'herbsValue',
    'insightValue', 'cultivationRate', 'attackValue', 'defenceValue', 'critValue',
    'dodgeValue', 'pillGather', 'pillHeal', 'pillClarity', 'pillBreak', 'saveText',
    'dayCounter', 'heroScene', 'ambientCanvas', 'sceneClock', 'sceneRealm',
    'sceneLayer', 'sceneQuote', 'sceneRate', 'buffTag', 'mobileExp', 'mobileStones',
    'mobileInsight', 'cultivateButton', 'cultivateTitle', 'manualGain',
    'breakthroughButton', 'breakChance', 'sceneExpFill', 'sceneExpPercent',
    'fortuneButton', 'fortuneHint', 'zoneList', 'sectContent', 'companionContent',
    'largeInsight', 'techniqueGrid',
    'cauldronArt', 'alchemyStatusTitle', 'alchemyStones', 'alchemyHerbs',
    'recipeGrid', 'statBreakthroughs', 'statKills', 'statAlchemy', 'statFortunes',
    'statSectMissions', 'statBond',
    'achievementCount', 'achievementList', 'soundToggle', 'motionToggle',
    'settingsSave', 'resetButton', 'goalIndex', 'goalTitle', 'goalText', 'goalFill',
    'goalProgress', 'goalAction', 'eventLog', 'journalQuote', 'dockQuote',
    'introScreen', 'startButton', 'nameInput', 'rootOptions', 'battleOverlay',
    'battleZone', 'battleRound', 'battleArena', 'battleRetreat', 'battlePlayerName',
    'battlePlayerGlyph', 'battlePlayerHp', 'battlePlayerHpFill', 'battleManaFill',
    'battleManaText', 'enemyKind', 'battleTitle', 'enemyGlyph', 'battleEnemyHp',
    'battleEnemyHpFill', 'enemyTrait', 'floatLayer', 'battleLog', 'battleActions',
    'battlePillCount', 'battleResult', 'battleResultKicker', 'battleResultTitle',
    'battleResultText', 'battleRewards', 'battleCloseButton', 'battleRoundMark',
    'breakthroughModal', 'breakthroughSeal', 'breakthroughKicker', 'breakthroughTitle',
    'breakthroughText', 'breakthroughChanceBlock', 'breakthroughChanceText',
    'breakthroughConfirm', 'breakthroughNote', 'guideModal', 'guideClose',
    'guideStart', 'toastContainer', 'breakthroughFlash', 'playerCombatant',
    'enemyCombatant'
  ].forEach(id => {
    ui[id] = $(id);
  });
}

function init() {
  cacheUI();
  bindEvents();
  updateWorldDate();
  setupAmbientCanvas();
  const saved = loadGame();

  if (saved) {
    state = saved;
    gameStarted = true;
    ui.introScreen.classList.add('closing');
    applySettings();
    processOfflineProgress();
    renderAll();
    setTimeout(() => toast('云隐山的灯仍为你亮着。'), 500);
  } else {
    state = null;
    renderIntroDefaults();
  }

  setInterval(gameTick, 1000);
  setInterval(() => saveGame(false), 5000);
  setInterval(updateWorldDate, 60000);
}

function bindEvents() {
  document.querySelectorAll('[data-root]').forEach(button => {
    button.addEventListener('click', () => {
      introRoot = button.dataset.root;
      document.querySelectorAll('[data-root]').forEach(item => {
        item.classList.toggle('active', item === button);
      });
      ensureAudio();
      playTone('soft');
    });
  });

  ui.startButton.addEventListener('click', beginGame);
  ui.nameInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') beginGame();
  });

  ui.soundButton.addEventListener('click', toggleSound);
  ui.soundToggle.addEventListener('click', toggleSound);
  ui.motionToggle.addEventListener('click', toggleMotion);
  ui.guideButton.addEventListener('click', openGuide);
  ui.guideClose.addEventListener('click', closeGuide);
  ui.guideStart.addEventListener('click', closeGuide);
  ui.guideModal.addEventListener('click', event => {
    if (event.target === ui.guideModal) closeGuide();
  });

  ui.breakthroughConfirm.addEventListener('click', handleBreakthroughConfirm);
  ui.battleRetreat.addEventListener('click', retreatBattle);
  ui.battleCloseButton.addEventListener('click', closeBattle);
  ui.resetButton.addEventListener('click', resetGame);

  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleKeydown);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) saveGame(false);
  });
  window.addEventListener('beforeunload', () => saveGame(false));
}

function renderIntroDefaults() {
  ui.soundButton.classList.toggle('muted', false);
  ui.soundButton.textContent = '音';
  document.body.style.setProperty('--realm-color', ROOTS[introRoot].color);
}

function beginGame() {
  if (gameStarted) return;
  const enteredName = ui.nameInput.value.trim().replace(/\s+/g, '').slice(0, 10);
  state = defaultState(enteredName || '沈砚', introRoot);
  gameStarted = true;
  ensureAudio();
  addLog(`你以“${state.name}”为道号，在云隐山听雨洞府中睁开双眼。`, 'jade');
  addLog('你领到一枚云隐剑宗的外门玉牌，山门自此有你的名字。', 'normal');
  addLog(`《太玄吐纳诀》自行运转，四周灵气正向气海汇聚。`, 'normal');
  saveGame(true);
  ui.introScreen.classList.add('closing');
  ui.introScreen.setAttribute('aria-hidden', 'true');
  renderAll();
  playTone('open');
  setTimeout(() => toast('吐纳已经自行开始。点击“运转周天”，或按空格可加快修行。'), 700);
}

function handleGlobalClick(event) {
  const rootButton = event.target.closest('[data-root]');
  if (rootButton && !gameStarted) return;

  const viewButton = event.target.closest('[data-view]');
  if (viewButton) {
    navigate(viewButton.dataset.view);
    return;
  }

  const cultivateButton = event.target.closest('[data-cultivate]');
  if (cultivateButton) {
    performCultivation();
    return;
  }

  const breakthroughButton = event.target.closest('[data-breakthrough]');
  if (breakthroughButton) {
    openBreakthrough();
    return;
  }

  const fortuneButton = event.target.closest('[data-fortune]');
  if (fortuneButton) {
    seekFortune();
    return;
  }

  const pillButton = event.target.closest('[data-use-pill]');
  if (pillButton) {
    usePill(pillButton.dataset.usePill);
    return;
  }

  const goalButton = event.target.closest('[data-goal]');
  if (goalButton) {
    performGoalAction();
    return;
  }

  const zoneButton = event.target.closest('[data-enter-zone]');
  if (zoneButton) {
    const zone = ZONES.find(item => item.id === zoneButton.dataset.enterZone);
    if (zone) startBattle(zone);
    return;
  }

  const sectMissionButton = event.target.closest('[data-sect-mission]');
  if (sectMissionButton) {
    performSectMission(sectMissionButton.dataset.sectMission);
    return;
  }

  const sectShopButton = event.target.closest('[data-sect-shop]');
  if (sectShopButton) {
    exchangeSectItem(sectShopButton.dataset.sectShop);
    return;
  }

  const joinSectButton = event.target.closest('[data-join-sect]');
  if (joinSectButton) {
    joinSect(joinSectButton.dataset.joinSect);
    return;
  }

  const companionSelectButton = event.target.closest('[data-companion-select]');
  if (companionSelectButton) {
    selectCompanion(companionSelectButton.dataset.companionSelect);
    return;
  }

  const companionAction = event.target.closest('[data-companion-action]');
  if (companionAction) {
    performCompanionAction(companionAction.dataset.companionAction);
    return;
  }

  const upgradeButton = event.target.closest('[data-upgrade-tech]');
  if (upgradeButton) {
    upgradeTechnique(upgradeButton.dataset.upgradeTech);
    return;
  }

  const craftButton = event.target.closest('[data-craft]');
  if (craftButton) {
    craftRecipe(craftButton.dataset.craft);
    return;
  }

  const battleAction = event.target.closest('[data-battle-action]');
  if (battleAction) {
    performBattleAction(battleAction.dataset.battleAction);
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    if (!ui.guideModal.classList.contains('hidden')) {
      closeGuide();
      return;
    }
    if (ui.breakthroughModal.dataset.mode === 'confirm') {
      ui.breakthroughModal.classList.add('hidden');
    }
    return;
  }

  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || ui.introScreen.classList.contains('closing') === false) return;
  if (!state || !gameStarted) return;

  if (event.key === ' ' && activeBattle === null && !event.repeat) {
    event.preventDefault();
    performCultivation();
    return;
  }

  if (event.code === 'Space' && activeBattle === null) {
    event.preventDefault();
    performCultivation();
    return;
  }

  if (event.key.toLowerCase() === 'b' && activeBattle === null) {
    openBreakthrough();
    return;
  }

  if (event.key.toLowerCase() === 'f' && activeBattle === null) {
    seekFortune();
    return;
  }

  const viewNames = ['home', 'adventure', 'sect', 'companions', 'techniques', 'alchemy', 'path'];
  if (/^[1-7]$/.test(event.key) && activeBattle === null) {
    navigate(viewNames[Number(event.key) - 1]);
  }
}

function navigate(view) {
  if (!state) return;
  const validViews = ['home', 'adventure', 'sect', 'companions', 'techniques', 'alchemy', 'path'];
  if (!validViews.includes(view)) return;
  activeView = view;

  document.querySelectorAll('.view').forEach(section => {
    section.classList.toggle('active', section.id === `view-${view}`);
  });
  document.querySelectorAll('.dock-button').forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });

  if (view === 'home') renderHome();
  if (view === 'adventure') renderAdventure();
  if (view === 'sect') renderSect();
  if (view === 'companions') renderCompanions();
  if (view === 'techniques') renderTechniques();
  if (view === 'alchemy') renderAlchemy();
  if (view === 'path') renderPath();
  renderHeaderStats();
  playTone('soft');
}

function performCultivation() {
  if (!state || state.ascended) return;
  const req = getRequirement();
  if (state.exp >= req) {
    toast('气海已经盈满，尝试冲击瓶颈吧。');
    openBreakthrough();
    return;
  }

  const stats = getStats();
  const gain = Math.max(1, Math.round(stats.manualGain));
  state.exp = Math.min(req, state.exp + gain);
  createQiFloater(`+${formatNumber(gain)} 修为`);
  ui.cultivateButton.classList.remove('casting');
  void ui.cultivateButton.offsetWidth;
  ui.cultivateButton.classList.add('casting');
  playTone('qi');
  checkFullCultivation();
  renderHeaderStats();
  renderHome();
  renderGoal();
}

function createQiFloater(text) {
  if (!ui.heroScene) return;
  const floater = document.createElement('span');
  floater.className = 'qi-floater';
  floater.textContent = text;
  floater.style.left = `${52 + Math.random() * 16}%`;
  floater.style.top = `${44 + Math.random() * 12}%`;
  ui.heroScene.appendChild(floater);
  setTimeout(() => floater.remove(), 1000);
}

function checkFullCultivation() {
  if (!state || state.ascended) return;
  const rank = getRank();
  if (state.exp >= getRequirement() && state.lastFullRank !== rank) {
    state.lastFullRank = rank;
    addLog('周身经脉同时一震，气海已盈满，只待一念破关。', 'gold');
    toast('气海盈满：可以冲击下一层境界了。', 'success');
    playTone('complete');
  }
}

function openBreakthrough() {
  if (!state || state.ascended) return;
  const req = getRequirement();
  if (state.exp < req) {
    toast(`气海尚缺 ${formatNumber(req - state.exp)} 修为，继续吐纳吧。`);
    return;
  }
  if (breakthroughBusy) return;

  const stats = getStats();
  const hasPill = state.pills.break > 0;
  const chance = clamp(stats.breakChance + (hasPill ? 0.18 : 0), 0.43, 0.995);
  const isFinal = state.realm === MAX_REALM - 1 && state.layer === MAX_LAYER;

  ui.breakthroughModal.dataset.mode = 'confirm';
  ui.breakthroughModal.classList.remove('hidden');
  ui.breakthroughSeal.textContent = isFinal ? '劫' : '破';
  ui.breakthroughKicker.textContent = isFinal ? '九重雷海 · 天门在前' : '道心叩问 · 一念破关';
  ui.breakthroughTitle.textContent = isFinal ? '渡劫飞升' : '气海翻涌';
  ui.breakthroughText.textContent = isFinal
    ? '雷云已压至山巅。越过这一关，人间从此只余传说。'
    : `${formatRealm()}的气海已经盈满，经脉中的灵息如潮水般叩问下一重门户。`;
  ui.breakthroughChanceBlock.classList.remove('hidden');
  ui.breakthroughChanceText.textContent = `${Math.round(chance * 100)}%`;
  ui.breakthroughConfirm.textContent = isFinal ? '迎向天劫' : '一念破关';
  ui.breakthroughNote.textContent = hasPill
    ? '将自动服用一枚破境丹，本次破境之势增加一成八。'
    : '失败会散去部分修为，但不会损伤道基。';
  playTone('open');
}

function handleBreakthroughConfirm() {
  if (ui.breakthroughModal.dataset.mode === 'result') {
    ui.breakthroughModal.classList.add('hidden');
    ui.breakthroughModal.dataset.mode = '';
    return;
  }
  if (breakthroughBusy || !state) return;
  if (state.exp < getRequirement()) {
    ui.breakthroughModal.classList.add('hidden');
    return;
  }

  breakthroughBusy = true;
  ui.breakthroughConfirm.disabled = true;
  ui.breakthroughConfirm.textContent = '气海运转中…';
  const usedPill = state.pills.break > 0;
  if (usedPill) state.pills.break -= 1;
  const chance = clamp(getStats().breakChance + (usedPill ? 0.18 : 0), 0.43, 0.995);
  ui.breakthroughChanceText.textContent = `${Math.round(chance * 100)}%`;
  ui.breakthroughFlash.classList.remove('active');
  void ui.breakthroughFlash.offsetWidth;
  ui.breakthroughFlash.classList.add('active');
  playTone('break');

  setTimeout(() => {
    resolveBreakthrough(chance, usedPill);
  }, 820);
}

function resolveBreakthrough(chance, usedPill) {
  if (!state) return;
  const success = Math.random() < chance;
  const previousRealm = state.realm;
  const previousRealmName = formatRealm();
  const isFinal = state.realm === MAX_REALM - 1 && state.layer === MAX_LAYER;
  const oldReq = getRequirement();

  if (success) {
    state.exp = 0;
    state.counters.breakthroughs += 1;
    state.daoWounds = 0;
    const insightGain = 1 + Math.floor(state.realm / 3) + (isFinal ? 4 : 0);
    state.insight += insightGain;
    const stoneGain = 35 + getRank() * 5;
    state.stones += stoneGain;

    if (isFinal) {
      state.ascended = true;
      state.realm = MAX_REALM - 1;
      state.layer = MAX_LAYER;
      state.lastFullRank = MAX_RANK;
    } else {
      state.layer += 1;
      if (state.layer > MAX_LAYER) {
        state.realm += 1;
        state.layer = 1;
      }
      state.lastFullRank = -1;
    }

    const stats = getStats();
    state.hp = stats.maxHp;
    state.mana = stats.maxMana;
    const newName = formatRealm();
    addLog(isFinal ? '九重雷海尽散，天门洞开。你终于踏出了人间。' : `${previousRealmName}旧关已破，境界升至${newName}。`, 'gold');
    checkAchievements();
    saveGame(true);
    renderAll();
    showBreakthroughResult({
      success: true,
      final: isFinal,
      title: isFinal ? '天门已开' : '破境功成',
      text: isFinal
        ? '万千雷光化作脚下长阶。山河、故人、旧剑，都在这一眼里被收进道心。'
        : `旧日瓶颈如薄纸般碎裂，你已踏入${newName}，气海比从前辽阔了一倍。`,
      note: `悟道 +${insightGain} · 灵石 +${stoneGain}${usedPill ? ' · 破境丹已化入经脉' : ''}`
    });
    playTone(isFinal ? 'ascend' : 'levelup');
  } else {
    state.exp = Math.max(0, Math.floor(oldReq * 0.68));
    state.hp = Math.max(1, Math.floor(state.hp * 0.6));
    state.daoWounds = 1;
    addLog('破境之势忽然溃散，你收敛气机，所幸道基未伤。', 'red');
    saveGame(true);
    renderAll();
    showBreakthroughResult({
      success: false,
      final: false,
      title: '道心未折',
      text: '经脉中的灵潮退去，旧境仍稳稳如山。调息积蓄，再试一次便是。',
      note: `散去部分修为${usedPill ? ' · 破境丹已化入经脉' : ''}`
    });
    playTone('fail');
  }

  breakthroughBusy = false;
  ui.breakthroughConfirm.disabled = false;
}

function showBreakthroughResult(result) {
  ui.breakthroughModal.dataset.mode = 'result';
  ui.breakthroughSeal.textContent = result.success ? (result.final ? '仙' : '成') : '止';
  ui.breakthroughKicker.textContent = result.success ? '云开 · 道进' : '气机回流 · 道心仍在';
  ui.breakthroughTitle.textContent = result.title;
  ui.breakthroughText.textContent = result.text;
  ui.breakthroughChanceBlock.classList.add('hidden');
  ui.breakthroughConfirm.textContent = result.final ? '踏入大罗' : '查看新境';
  ui.breakthroughNote.textContent = result.note;
  ui.breakthroughModal.classList.remove('hidden');
}

function usePill(type) {
  if (!state) return;
  const stats = getStats();

  if (type === 'break') {
    toast('破境丹会在冲击瓶颈时自动服用。');
    return;
  }

  if (!state.pills[type] || state.pills[type] <= 0) {
    toast('这枚丹药已经用完了。可以前往丹房炼制。');
    navigate('alchemy');
    return;
  }

  if (type === 'gather') {
    if (state.ascended) {
      toast('你已越过天门，世间修为再无用武之地。');
      return;
    }
    if (state.exp >= getRequirement()) {
      toast('气海已经盈满，先冲击瓶颈，再服用聚气丹吧。');
      openBreakthrough();
      return;
    }
    const amount = Math.max(1, Math.floor(getRequirement() * 0.22));
    state.exp = Math.min(getRequirement(), state.exp + amount);
    state.pills.gather -= 1;
    addLog(`服下一枚聚气丹，气海充盈了 ${formatNumber(amount)} 修为。`, 'jade');
    toast(`聚气丹化开：修为 +${formatNumber(amount)}`, 'success');
    createQiFloater(`+${formatNumber(amount)}`);
    playTone('pill');
    checkFullCultivation();
  }

  if (type === 'heal') {
    if (state.hp >= stats.maxHp - 1) {
      toast('气血充盈，暂时无需服用回春丹。');
      return;
    }
    const heal = Math.floor(stats.maxHp * 0.55 * stats.healMultiplier);
    state.hp = Math.min(stats.maxHp, state.hp + heal);
    state.pills.heal -= 1;
    addLog(`一枚回春丹入腹，气血恢复了 ${formatNumber(heal)} 点。`, 'jade');
    toast(`气血 +${formatNumber(heal)}`, 'success');
    playTone('pill');
  }

  if (type === 'clarity') {
    state.pills.clarity -= 1;
    state.insight += 2;
    addLog('凝神丹化作一缕清凉，识海中多了两点明悟。', 'gold');
    toast('悟道点 +2', 'success');
    playTone('pill');
  }

  checkAchievements();
  saveGame(false);
  renderHeaderStats();
  renderHome();
  renderGoal();
}

function seekFortune() {
  if (!state) return;
  const remaining = (state.fortuneReady - Date.now()) / 1000;
  if (remaining > 0) {
    toast(`山中气机未定，还需等候 ${Math.ceil(remaining)} 息。`);
    return;
  }

  const rank = getRank();
  const req = getRequirement();
  const luck = getRoot().fortune;
  const roll = Math.random();
  let title;
  let message;
  let kind = 'jade';
  let rewardText;

  if (roll < 0.26) {
    const amount = Math.max(8, Math.floor(req * (0.12 + Math.random() * 0.08)));
    const herbAmount = randomInt(1, 2);
    state.exp = Math.min(req, state.exp + amount);
    state.herbs += herbAmount;
    title = '古松灵露';
    message = '循着崖下异香，你在一株雷击古松旁寻到凝着晨露的灵果。';
    rewardText = `修为 +${formatNumber(amount)} · 灵草 +${herbAmount}`;
    kind = 'jade';
  } else if (roll < 0.49) {
    const amount = randomInt(35, 65) + rank * 9;
    state.stones += amount;
    title = '石缝藏晶';
    message = '剑气无意间劈开青石，露出半枚色泽温润的上古灵石。';
    rewardText = `灵石 +${formatNumber(amount)}`;
    kind = 'gold';
  } else if (roll < 0.68) {
    const amount = randomInt(2, 3);
    state.herbs += amount;
    title = '灵圃遗种';
    message = '一只受伤的白鹿引你绕过山坳，蹄印旁生着成片未曾见过的灵草。';
    rewardText = `灵草 +${amount}`;
    kind = 'jade';
  } else if (roll < 0.83 - Math.min(0.06, (luck - 1) * 0.04)) {
    state.insight += 1;
    title = '石壁残篇';
    message = '雨声在石壁上敲出奇异的节拍。你静立良久，忽觉旧日功法多了一条新路。';
    rewardText = '悟道点 +1';
    kind = 'gold';
  } else if (roll < 0.89) {
    const available = Object.values(COMPANIONS).filter(isCompanionUnlocked);
    const companion = pick(available.length ? available : Object.values(COMPANIONS));
    const gain = available.length ? 6 : 0;
    if (gain) {
      state.companions.affection[companion.id] = Math.min(100, getCompanionAffection(companion.id) + gain);
      state.companions.dialogue[companion.id] = pick(companion.talks);
    }
    title = '故人相邀';
    message = available.length
      ? `${companion.name}托山雀送来一封短笺，邀你去老地方坐一坐。`
      : '一封没有署名的短笺落在窗边，墨迹淡得像一场旧梦。';
    rewardText = gain ? `${companion.name}好感 +${gain}` : '心中似有所感';
    kind = 'jade';
  } else if (roll < 0.93) {
    const sect = getSectData();
    state.sect.reputation[sect.id] += 8;
    state.sect.contribution[sect.id] += 5;
    title = '山门传书';
    message = `${sect.name}记下了你近日在外的行事，一纸传书与五枚功勋令一同送到洞府。`;
    rewardText = '宗门声望 +8 · 贡献 +5';
    kind = 'gold';
  } else if (roll < 0.975) {
    const pills = pick(['gather', 'heal']);
    state.pills[pills] += 1;
    title = '药庐故人';
    message = '采药老人与你对饮一盏苦茶。临别时，他将掌心温热的丹药塞入你手中。';
    rewardText = `${pills === 'gather' ? '聚气丹' : '回春丹'} +1`;
    kind = 'gold';
  } else {
    const lost = Math.min(state.stones, randomInt(12, 28) + rank * 2);
    state.stones = Math.max(0, state.stones - lost);
    state.hp = Math.max(1, state.hp - Math.floor(getStats().maxHp * 0.12));
    title = '迷障困阵';
    message = '山中雾阵忽起，你以剑意破阵而出，虽未受伤太重，却丢了些散碎灵石。';
    rewardText = lost > 0 ? `灵石 -${formatNumber(lost)}` : '只损了些许气血';
    kind = 'red';
  }

  state.counters.fortunes += 1;
  state.fortuneReady = Date.now() + getFortuneCooldown() * 1000;
  addLog(`${title}：${message}`, kind);
  toast(`${title} · ${rewardText}`, kind === 'red' ? 'warning' : 'success');
  checkFullCultivation();
  checkAchievements();
  saveGame(true);
  renderAll();
  playTone(kind === 'red' ? 'fail' : 'fortune');
}

function performGoalAction() {
  if (!state) return;
  if (currentGoalAction === 'breakthrough') openBreakthrough();
  else if (currentGoalAction === 'adventure') navigate('adventure');
  else if (currentGoalAction === 'sect') navigate('sect');
  else if (currentGoalAction === 'companions') navigate('companions');
  else if (currentGoalAction === 'techniques') navigate('techniques');
  else if (currentGoalAction === 'alchemy') navigate('alchemy');
  else if (currentGoalAction === 'fortune') seekFortune();
  else if (currentGoalAction === 'journal') navigate('path');
  else performCultivation();
}

function gameTick() {
  if (!state || !gameStarted) return;
  tickCount += 1;
  state.playSeconds += 1;
  state.counters.days = Math.max(state.counters.days, Math.floor(state.playSeconds / 300) + 1);

  if (!state.ascended) {
    const req = getRequirement();
    if (state.exp < req) {
      state.exp = Math.min(req, state.exp + getStats().gain);
      checkFullCultivation();
    }
  }

  const stats = getStats();
  if (!activeBattle) {
    state.mana = Math.min(stats.maxMana, state.mana + 2);
    if (state.hp > 0) state.hp = Math.min(stats.maxHp, state.hp + 0.12);
  }

  state.counters.herbTimer = (state.counters.herbTimer || 0) + 1;
  if (state.counters.herbTimer >= 50) {
    state.counters.herbTimer = 0;
    state.herbs += 1;
    toast('洞府灵圃成熟了一株灵草。', 'success');
  }

  if (state.daoWounds > 0 && tickCount % 90 === 0) {
    state.daoWounds = Math.max(0, state.daoWounds - 1);
  }

  if (state.buffUntil && state.buffUntil <= Date.now()) state.buffUntil = 0;
  renderHeaderStats();
  if (activeView === 'home') renderHome();
  renderGoal();

  if (tickCount % 12 === 0 && activeView === 'adventure') renderAdventure();
  if (activeView === 'sect') renderSect();
  if (activeView === 'companions') renderCompanions();
  if (tickCount % 17 === 0 && activeView === 'path') renderPath();
}

function saveGame(showFeedback) {
  if (!state) return;
  state.lastSave = Date.now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    ui.saveText.textContent = `道途已记 ${time}`;
    ui.settingsSave.textContent = `已保存 ${time}`;
    if (showFeedback) toast('道途已经记入洞府石简。', 'success');
  } catch (error) {
    ui.saveText.textContent = '本地存档不可用';
    ui.settingsSave.textContent = '存档不可用';
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.name) return null;
    return normalizeState(parsed);
  } catch (error) {
    console.warn('存档读取失败，将开启新的道途。', error);
    return null;
  }
}

function processOfflineProgress() {
  if (!state) return;
  const elapsed = clamp((Date.now() - (state.lastSave || Date.now())) / 1000, 0, 8 * 3600);
  if (elapsed < 25) {
    state.lastSave = Date.now();
    return;
  }

  const stats = getStats();
  const offlineGain = stats.gain * elapsed * 0.62;
  const before = state.exp;
  if (!state.ascended) {
    state.exp = Math.min(getRequirement(), state.exp + offlineGain);
  }
  const herbGain = Math.floor(elapsed / 180);
  state.herbs += herbGain;
  state.playSeconds += elapsed;
  state.counters.days = Math.max(state.counters.days, Math.floor(state.playSeconds / 300) + 1);
  state.hp = Math.min(stats.maxHp, state.hp + stats.maxHp * Math.min(0.35, elapsed / 2400));
  state.lastSave = Date.now();

  const minutes = Math.max(1, Math.floor(elapsed / 60));
  const actualGain = Math.floor(state.exp - before);
  addLog(`归山时已过 ${minutes} 息刻，周天仍在自行运转。`, 'normal');
  setTimeout(() => {
    toast(`离线吐纳所得：修为 +${formatNumber(actualGain)}${herbGain ? ` · 灵草 +${herbGain}` : ''}`, 'success');
  }, 900);
  saveGame(false);
  renderAll();
}

function checkAchievements() {
  if (!state) return;
  let changed = false;
  ACHIEVEMENTS.forEach(achievement => {
    if (state.achievements.includes(achievement.id)) return;
    if (!achievement.check(state)) return;
    state.achievements.push(achievement.id);
    state.stones += achievement.reward.stones || 0;
    state.insight += achievement.reward.insight || 0;
    addLog(`道心印记「${achievement.title}」已点亮。`, 'gold');
    toast(`道心印记：${achievement.title} · 灵石 +${achievement.reward.stones || 0} · 悟道 +${achievement.reward.insight || 0}`, 'success');
    changed = true;
  });

  if (changed) {
    state.savedAchievements = true;
    saveGame(false);
    if (activeView === 'path') renderPath();
  }
}

function renderAll() {
  if (!state) return;
  applySettings();
  renderHeaderStats();
  renderHome();
  renderGoal();
  renderJournal();
  if (activeView === 'adventure') renderAdventure();
  if (activeView === 'sect') renderSect();
  if (activeView === 'companions') renderCompanions();
  if (activeView === 'techniques') renderTechniques();
  if (activeView === 'alchemy') renderAlchemy();
  if (activeView === 'path') renderPath();
  updateWorldDate();
}

function renderHeaderStats() {
  if (!state) return;
  const stats = getStats();
  const req = getRequirement();
  const exp = Math.min(state.exp, req);
  const percent = state.ascended ? 100 : clamp((exp / req) * 100, 0, 100);
  const realm = getCurrentRealm();
  const root = getRoot();

  state.hp = clamp(state.hp, 0, stats.maxHp);
  state.mana = clamp(state.mana, 0, stats.maxMana);

  document.documentElement.style.setProperty('--realm-color', realm.color);
  document.documentElement.style.setProperty('--root-color', root.color);

  ui.avatarGlyph.textContent = state.name.slice(0, 1) || '玄';
  ui.rootName.textContent = root.name;
  ui.playerName.textContent = state.name;
  ui.realmLabel.textContent = formatRealm();
  const sect = getSectData();
  const sectStanding = getSectStanding();
  const sectRank = getSectRankInfo(sectStanding.reputation).current;
  const bondedCompanion = COMPANIONS[state.companions.bondedTo];
  const unlockedCompanions = Object.values(COMPANIONS).filter(isCompanionUnlocked).length;
  ui.sectLabel.textContent = `${sect.shortName} · ${sectRank.name}`;
  ui.companionLabel.textContent = bondedCompanion
    ? `道侣 · ${bondedCompanion.name}`
    : unlockedCompanions > 1 ? `同道 · ${unlockedCompanions} 人` : '尚无同心人';
  ui.expText.textContent = state.ascended ? '超脱天门' : `${formatNumber(exp)} / ${formatNumber(req)}`;
  ui.expFill.style.width = `${percent}%`;
  ui.hpFill.style.width = `${clamp((state.hp / stats.maxHp) * 100, 0, 100)}%`;
  ui.hpText.textContent = `${formatNumber(Math.ceil(state.hp))} / ${formatNumber(stats.maxHp)}`;
  ui.manaFill.style.width = `${clamp((state.mana / stats.maxMana) * 100, 0, 100)}%`;
  ui.manaText.textContent = `${formatNumber(Math.floor(state.mana))} / ${formatNumber(stats.maxMana)}`;
  ui.stonesValue.textContent = formatNumber(state.stones);
  ui.herbsValue.textContent = formatNumber(state.herbs);
  ui.insightValue.textContent = formatNumber(state.insight);
  ui.cultivationRate.textContent = `${formatRate(stats.gain)} 修为/息`;
  ui.attackValue.textContent = formatNumber(stats.atk);
  ui.defenceValue.textContent = formatNumber(stats.def);
  ui.critValue.textContent = `${Math.round(stats.crit * 100)}%`;
  ui.dodgeValue.textContent = `${Math.round(stats.dodge * 100)}%`;
  ui.pillGather.textContent = state.pills.gather;
  ui.pillHeal.textContent = state.pills.heal;
  ui.pillClarity.textContent = state.pills.clarity;
  ui.pillBreak.textContent = state.pills.break;
  ui.topStones.textContent = formatNumber(state.stones);
  ui.topHerbs.textContent = formatNumber(state.herbs);
  ui.mobileExp.textContent = state.ascended ? '已飞升' : `${formatNumber(exp)} / ${formatNumber(req)}`;
  ui.mobileStones.textContent = formatNumber(state.stones);
  ui.mobileInsight.textContent = formatNumber(state.insight);
  ui.dayCounter.textContent = `第 ${state.counters.days} 日`;
  ui.largeInsight.textContent = formatNumber(state.insight);
  ui.alchemyStones.textContent = formatNumber(state.stones);
  ui.alchemyHerbs.textContent = formatNumber(state.herbs);
  ui.battlePillCount.textContent = state.pills.heal;
  ui.saveText.textContent = state.lastSave
    ? `道途已记 ${new Date(state.lastSave).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
    : '待入道途';
  ui.soundButton.classList.toggle('muted', !state.settings.sound);
  ui.soundButton.textContent = state.settings.sound ? '音' : '静';
  ui.settingsSave.textContent = state.lastSave
    ? `已保存 ${new Date(state.lastSave).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`
    : '自动存档';
  ui.dockQuote.textContent = DOCK_QUOTES[state.realm];
}

function renderHome() {
  if (!state || activeView !== 'home') return;
  const stats = getStats();
  const req = getRequirement();
  const percent = state.ascended ? 100 : clamp((state.exp / req) * 100, 0, 100);
  const full = !state.ascended && state.exp >= req;
  const realm = getCurrentRealm();

  ui.sceneRealm.textContent = state.ascended ? '大罗' : realm.name;
  ui.sceneLayer.textContent = state.ascended ? '逍遥' : `${LAYER_TEXT[state.layer - 1]}层`;
  ui.sceneQuote.textContent = state.ascended ? '回首人间，山河只是一枚落在掌心的尘埃。' : realm.quote;
  ui.sceneRate.textContent = state.ascended ? '天门已越 · 道法自成' : `吐纳 · ${formatRate(stats.gain)} 修为/息`;
  ui.buffTag.classList.toggle('hidden', !stats.buffActive && !state.companions.bondedTo);
  ui.buffTag.textContent = state.companions.bondedTo
    ? `${COMPANIONS[state.companions.bondedTo].name} · 道侣同心`
    : '丹药相助';
  ui.cultivateButton.disabled = full || state.ascended;
  ui.cultivateTitle.textContent = state.ascended ? '已越天门' : full ? '气海盈满' : '运转周天';
  ui.manualGain.textContent = state.ascended ? '0' : formatNumber(Math.round(stats.manualGain));
  ui.sceneExpFill.style.width = `${percent}%`;
  ui.sceneExpPercent.textContent = `${Math.floor(percent)}%`;
  ui.breakthroughButton.classList.toggle('hidden', !full);
  const pillBonus = state.pills.break > 0 ? 0.18 : 0;
  ui.breakChance.textContent = `${Math.round(clamp(stats.breakChance + pillBonus, 0.43, 0.995) * 100)}%`;

  const cooldown = Math.max(0, Math.ceil((state.fortuneReady - Date.now()) / 1000));
  ui.fortuneButton.disabled = cooldown > 0;
  ui.fortuneHint.textContent = cooldown > 0 ? `气机流转 · ${cooldown} 息` : '崖下似有异香';
}

function renderGoal() {
  if (!state) return;
  const stats = getStats();
  const req = getRequirement();
  const percent = state.ascended ? 100 : clamp((state.exp / req) * 100, 0, 100);
  const full = !state.ascended && state.exp >= req;
  let index = NUMBER_TEXT[clamp(state.realm + 1, 1, 9)];
  let title;
  let text;
  let action;
  let progress = percent;
  let actionLabel;

  if (state.ascended) {
    index = '终';
    title = '大罗逍遥';
    text = '天门已在身后。此后的路没有尽头，也不必再与谁争。';
    action = 'journal';
    actionLabel = '回望道途';
    progress = 100;
  } else if (full) {
    index = '关';
    title = '气海盈满';
    text = `经脉已不能再多承一缕灵气，是时候叩问${formatRealm()}的瓶颈。`;
    action = 'breakthrough';
    actionLabel = '一念破关';
    progress = 100;
  } else if (state.counters.kills < 3 && state.realm < 2) {
    title = '下山试剑';
    text = '功法终究要在实战中印证。去青崖山脉斩一只妖兽，看看手中剑。';
    action = 'adventure';
    actionLabel = '前往历练';
    progress = clamp((state.counters.kills / 3) * 100, 0, 100);
  } else if (state.sect.missionsDone < 1) {
    title = '山门点卯';
    text = `既入${getSectData().name}，便该为山门尽一分力。完成一次宗门差遣吧。`;
    action = 'sect';
    actionLabel = '前往宗门';
    progress = 0;
  } else if (state.insight >= 1) {
    title = '参悟玄机';
    text = '识海中还有未落定的明悟。将悟道点投入一门功法，根基会更稳。';
    action = 'techniques';
    actionLabel = '前往功法';
    progress = clamp((state.insight / 3) * 100, 0, 100);
  } else if (!state.companions.bondedTo && Math.max(0, ...Object.values(state.companions.affection)) >= 15) {
    title = '故人相候';
    text = '山中有人记挂着你。去听听故人今日想说的话吧。';
    action = 'companions';
    actionLabel = '前往同心录';
    progress = clamp(Math.max(0, ...Object.values(state.companions.affection)), 0, 100);
  } else if (Date.now() >= state.fortuneReady) {
    title = '山中有缘';
    text = '东侧山崖灵机浮动，似有古松异香从雾中飘来。';
    action = 'fortune';
    actionLabel = '寻访机缘';
    progress = 100;
  } else {
    title = '静心吐纳';
    text = '让真气在经脉中行满一周天。时间会把你推向更远的地方。';
    action = 'cultivate';
    actionLabel = '继续修行';
  }

  currentGoalAction = action;
  ui.goalIndex.textContent = index;
  ui.goalTitle.textContent = title;
  ui.goalText.textContent = text;
  ui.goalFill.style.width = `${progress}%`;
  ui.goalProgress.textContent = `${Math.floor(progress)}%`;
  ui.goalAction.innerHTML = `${actionLabel} <span>↗</span>`;
}

function renderJournal() {
  if (!state) return;
  ui.eventLog.replaceChildren();
  const logs = state.log && state.log.length ? state.log : [
    { text: '洞府外的山雨尚未停歇。', kind: 'normal', time: Date.now() }
  ];

  logs.slice(0, 16).forEach(item => {
    const entry = document.createElement('article');
    entry.className = `log-entry ${item.kind || ''}`;
    const time = document.createElement('time');
    const date = new Date(item.time || Date.now());
    time.textContent = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    const paragraph = document.createElement('p');
    paragraph.textContent = item.text;
    entry.append(time, paragraph);
    ui.eventLog.appendChild(entry);
  });

  const realm = getCurrentRealm();
  ui.journalQuote.textContent = `“${realm.quote}”`;
}

function addLog(text, kind = 'normal') {
  if (!state) return;
  if (!Array.isArray(state.log)) state.log = [];
  const last = state.log[0];
  if (last?.text === text && Date.now() - last.time < 1500) return;
  state.log.unshift({ text: String(text).slice(0, 220), kind, time: Date.now() });
  state.log = state.log.slice(0, 28);
  renderJournal();
}

function renderAdventure() {
  if (!state) return;
  ui.zoneList.innerHTML = ZONES.map(zone => {
    const locked = state.realm < zone.minRealm;
    const dangerLabel = ['低', '中', '高', '极'][zone.danger];
    return `
      <article class="zone-card ${locked ? 'locked' : ''}" style="--zone-accent:${zone.accent}">
        <div class="zone-glyph">${zone.glyph}</div>
        <div class="zone-info">
          <span class="eyebrow">${locked ? '云雾封锁' : '灵机可循'}</span>
          <h2>${escapeHTML(zone.name)}</h2>
          <p>${escapeHTML(zone.description)}</p>
          <div class="zone-meta">
            <span>推荐 <b>${escapeHTML(zone.recommend)}</b></span>
            <span>凶险 <b>${dangerLabel}</b></span>
            <span>妖兽 <b>${zone.enemies.length}</b></span>
          </div>
        </div>
        <div class="zone-action">
          ${locked
            ? `<span class="lock-mark">需踏入${REALMS[zone.minRealm].name}境</span><button class="zone-enter" type="button" disabled>境界不足</button>`
            : `<small>气血 ${formatNumber(Math.ceil(state.hp))} / ${formatNumber(getStats().maxHp)}</small><button class="zone-enter" type="button" data-enter-zone="${zone.id}">踏入险境</button>`
          }
        </div>
      </article>
    `;
  }).join('');
}

function renderSect() {
  if (!state) return;
  const sect = getSectData();
  const standing = getSectStanding();
  const rankInfo = getSectRankInfo(standing.reputation);
  const currentRank = rankInfo.current;
  const nextRank = rankInfo.next;
  const cooldown = Math.max(0, Math.ceil((Number(state.sect.lastMissionAt) + 24000 - Date.now()) / 1000));
  const missions = SECT_MISSIONS[sect.id] || [];
  const missionExp = mission => Math.floor(getRequirement() * mission.exp);

  const missionCards = missions.map(mission => {
    const realmLocked = state.realm < mission.realm;
    const rankLocked = rankInfo.rankIndex < mission.rank;
    const disabled = cooldown > 0 || realmLocked || rankLocked;
    let buttonText = '领命前往';
    if (cooldown > 0) buttonText = `${cooldown} 息后可领命`;
    else if (realmLocked) buttonText = `需踏入${REALMS[mission.realm].name}境`;
    else if (rankLocked) buttonText = `需晋升${SECT_RANKS[mission.rank].name}`;
    const rewards = [
      `声望 +${mission.reputation}`,
      `贡献 +${mission.contribution}`,
      mission.stones ? `灵石 +${mission.stones}` : '',
      mission.herbs ? `灵草 +${mission.herbs}` : '',
      mission.insight ? `悟道 +${mission.insight}` : '',
      `修为 +${formatNumber(missionExp(mission))}`
    ].filter(Boolean);
    return `
      <article class="sect-mission ${disabled ? 'locked' : ''}">
        <span class="mission-glyph">${mission.glyph}</span>
        <div class="mission-copy">
          <span class="eyebrow">山门差遣</span>
          <h3>${escapeHTML(mission.title)}</h3>
          <p>${escapeHTML(mission.description)}</p>
          <div class="mission-rewards">${rewards.map(reward => `<span>${reward}</span>`).join('')}</div>
        </div>
        <button type="button" class="mission-button" data-sect-mission="${mission.id}" ${disabled ? 'disabled' : ''}>${buttonText}</button>
      </article>
    `;
  }).join('');

  const shopCards = SECT_SHOP.map(item => {
    const rankLocked = rankInfo.rankIndex < (item.minRank || 0);
    const insufficient = standing.contribution < item.cost;
    const disabled = rankLocked || insufficient;
    let footer = `贡献 ${item.cost}`;
    if (rankLocked) footer = `需${SECT_RANKS[item.minRank].name}`;
    else if (insufficient) footer = '贡献不足';
    return `
      <article class="sect-shop-item ${disabled ? 'locked' : ''}">
        <span class="shop-glyph">${item.glyph}</span>
        <div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.reward)}</small></div>
        <button type="button" data-sect-shop="${item.id}" ${disabled ? 'disabled' : ''}>${footer}</button>
      </article>
    `;
  }).join('');

  const sectChoices = Object.values(SECTS).map(candidate => {
    const current = candidate.id === sect.id;
    const locked = state.realm < candidate.minRealm;
    const reputation = Math.floor(Number(state.sect.reputation[candidate.id]) || 0);
    let buttonText = current ? '当前所在' : locked ? `需${REALMS[candidate.minRealm].name}境` : '改换门庭';
    return `
      <article class="sect-choice ${current ? 'current' : ''} ${locked ? 'locked' : ''}" style="--sect-accent:${candidate.accent}">
        <span class="sect-choice-mark">${candidate.glyph}</span>
        <div class="sect-choice-copy">
          <span class="eyebrow">${current ? '当前宗门' : `声望 ${reputation}`}</span>
          <h3>${escapeHTML(candidate.name)}</h3>
          <p>${escapeHTML(candidate.motto)}</p>
          <small>${escapeHTML(candidate.passiveText)}</small>
        </div>
        <button type="button" data-join-sect="${candidate.id}" ${current || locked ? 'disabled' : ''}>${buttonText}</button>
      </article>
    `;
  }).join('');

  ui.sectContent.innerHTML = `
    <section class="sect-hero" style="--sect-accent:${sect.accent}">
      <div class="sect-crest">
        <span>${sect.glyph}</span>
        <i></i><i></i>
      </div>
      <div class="sect-hero-main">
        <span class="eyebrow">${escapeHTML(sect.motto)}</span>
        <div class="sect-title-row">
          <h2>${escapeHTML(sect.name)}</h2>
          <span>${currentRank.name}</span>
        </div>
        <p>${escapeHTML(sect.description)}</p>
        <div class="sect-standing">
          <div><small>宗门声望</small><strong>${formatNumber(standing.reputation)}</strong></div>
          <div><small>可用贡献</small><strong>${formatNumber(standing.contribution)}</strong></div>
          <div><small>已完成差遣</small><strong>${formatNumber(state.sect.missionsDone)}</strong></div>
        </div>
        <div class="rank-progress-row">
          <span>${nextRank ? `距「${nextRank.name}」还需 ${formatNumber(nextRank.reputation - standing.reputation)} 声望` : '已至宗门最高位阶'}</span>
          <b>${Math.floor(rankInfo.progress)}%</b>
        </div>
        <div class="rank-progress"><i style="width:${rankInfo.progress}%"></i></div>
      </div>
      <aside class="sect-passive">
        <span class="eyebrow">宗门道印</span>
        <strong>${escapeHTML(sect.passiveText)}</strong>
        <p>宗门位阶每提升一级，吐纳效率额外增加 0.6%。</p>
        <span class="sect-contribution">贡献 ${formatNumber(standing.contribution)}</span>
      </aside>
    </section>

    <section class="sect-section">
      <div class="section-heading big-heading">
        <span>山门差遣</span>
        <span class="quiet">${cooldown ? `下一封传书：${cooldown} 息后` : '传书已至 · 可选一项'}</span>
      </div>
      <div class="sect-mission-grid">${missionCards}</div>
    </section>

    <div class="sect-lower-grid">
      <section class="sect-section sect-shop">
        <div class="section-heading big-heading">
          <span>传功阁</span>
          <span class="quiet">以贡献换取修行物资</span>
        </div>
        <div class="sect-shop-list">${shopCards}</div>
      </section>
      <section class="sect-section">
        <div class="section-heading big-heading">
          <span>诸宗山门</span>
          <span class="quiet">声望随宗门分别累积</span>
        </div>
        <div class="sect-choice-list">${sectChoices}</div>
      </section>
    </div>
  `;
}

function performSectMission(missionId) {
  if (!state) return;
  const sect = getSectData();
  const mission = (SECT_MISSIONS[sect.id] || []).find(item => item.id === missionId);
  if (!mission) return;
  const standing = getSectStanding();
  const rankInfo = getSectRankInfo(standing.reputation);
  const cooldown = Number(state.sect.lastMissionAt) + 24000 - Date.now();
  if (cooldown > 0) {
    toast(`宗门传书尚未送达，还需等候 ${Math.ceil(cooldown / 1000)} 息。`);
    return;
  }
  if (state.realm < mission.realm) {
    toast(`需踏入${REALMS[mission.realm].name}境方可领命。`);
    return;
  }
  if (rankInfo.rankIndex < mission.rank) {
    toast(`需晋升${SECT_RANKS[mission.rank].name}方可领命。`);
    return;
  }

  state.sect.reputation[sect.id] += mission.reputation;
  state.sect.contribution[sect.id] += mission.contribution;
  state.sect.lastMissionAt = Date.now();
  state.sect.missionsDone += 1;
  state.stones += mission.stones || 0;
  state.herbs += mission.herbs || 0;
  state.insight += mission.insight || 0;
  state.exp = Math.min(getRequirement(), state.exp + Math.floor(getRequirement() * mission.exp));

  const newRankInfo = getSectRankInfo(state.sect.reputation[sect.id]);
  let promotionText = '';
  if (newRankInfo.rankIndex > rankInfo.rankIndex) {
    state.insight += 1;
    promotionText = ` 宗门晋升：${newRankInfo.current.name}。`;
    toast(`宗门晋升 · ${newRankInfo.current.name}`, 'success');
  }

  addLog(`你完成宗门差遣「${mission.title}」，声望 +${mission.reputation}，贡献 +${mission.contribution}。${promotionText}`, 'jade');
  toast(`${mission.title} · 声望 +${mission.reputation} · 贡献 +${mission.contribution}`, 'success');
  checkFullCultivation();
  checkAchievements();
  saveGame(false);
  renderAll();
  playTone('complete');
}

function exchangeSectItem(itemId) {
  if (!state) return;
  const sect = getSectData();
  const item = SECT_SHOP.find(entry => entry.id === itemId);
  if (!item) return;
  const standing = getSectStanding();
  const rankInfo = getSectRankInfo(standing.reputation);
  if (rankInfo.rankIndex < (item.minRank || 0)) {
    toast(`需晋升${SECT_RANKS[item.minRank || 0].name}后方可兑换。`);
    return;
  }
  if (standing.contribution < item.cost) {
    toast('宗门贡献不足。完成山门差遣可以积累贡献。');
    return;
  }

  state.sect.contribution[sect.id] -= item.cost;
  if (item.id === 'herb_box') state.herbs += 6;
  if (item.id === 'gather_pill') state.pills.gather += 1;
  if (item.id === 'insight_tea') state.insight += 1;
  if (item.id === 'break_pill') state.pills.break += 1;
  addLog(`你在${sect.name}传功阁以 ${item.cost} 点贡献换得${item.name}。`, 'gold');
  toast(`已兑换 ${item.name} · ${item.reward}`, 'success');
  saveGame(false);
  renderAll();
  playTone('pill');
}

function joinSect(sectId) {
  if (!state || !SECTS[sectId] || state.sect.id === sectId) return;
  const target = SECTS[sectId];
  if (state.realm < target.minRealm) {
    toast(`需踏入${REALMS[target.minRealm].name}境，才能通过${target.name}的山门试炼。`);
    return;
  }
  const previous = getSectData();
  state.sect.id = sectId;
  state.sect.joinedAt = Date.now();
  state.hp = Math.min(state.hp, getStats().maxHp);
  addLog(`你离开${previous.name}，携山门荐书拜入${target.name}。旧日声望仍被两宗铭记。`, 'gold');
  toast(`已拜入${target.name} · ${target.passiveText}`, 'success');
  checkAchievements();
  saveGame(false);
  renderAll();
  playTone('open');
}

function companionPortraitMarkup(companion, size = 'large') {
  return `
    <div class="companion-portrait portrait-${companion.id} portrait-${size}" style="--companion-accent:${companion.accent};--companion-secondary:${companion.secondary}">
      <div class="portrait-aura"></div>
      <div class="portrait-moon"></div>
      <div class="portrait-body"></div>
      <div class="portrait-neck"></div>
      <div class="portrait-head"></div>
      <div class="portrait-hair"></div>
      <div class="portrait-hairpin"></div>
      <span class="portrait-name-glyph">${companion.glyph}</span>
      <span class="portrait-prop">${companion.id === 'wanzhao' ? '剑' : companion.id === 'qingheng' ? '药' : '星'}</span>
      <i class="portrait-seal">缘</i>
    </div>
  `;
}

function renderCompanions() {
  if (!state) return;
  const roster = Object.values(COMPANIONS);
  if (!COMPANIONS[state.companions.selected]) state.companions.selected = 'wanzhao';
  const selected = COMPANIONS[state.companions.selected] || COMPANIONS.wanzhao;
  const affection = getCompanionAffection(selected.id);
  const stage = getCompanionStage(affection);
  const unlocked = isCompanionUnlocked(selected);
  const bondedTo = COMPANIONS[state.companions.bondedTo] || null;
  const isBonded = state.companions.bondedTo === selected.id;
  const dialogue = state.companions.dialogue[selected.id] || selected.quotes[stage.name];
  const stageProgress = stage.next
    ? clamp(((affection - stage.floor) / (stage.next - stage.floor)) * 100, 0, 100)
    : 100;
  const talkCooldown = Math.max(0, Math.ceil((Number(state.companions.talkAt[selected.id]) + 15000 - Date.now()) / 1000));
  const walkCooldown = Math.max(0, Math.ceil((Number(state.companions.walkAt[selected.id]) + 75000 - Date.now()) / 1000));
  const bondCooldown = Math.max(0, Math.ceil((Number(state.companions.lastBondCultivation) + 90000 - Date.now()) / 1000));
  const giftCost = { stones: 55, herbs: 2 };
  const canGift = state.stones >= giftCost.stones && state.herbs >= giftCost.herbs && affection < 100;

  const rosterMarkup = roster.map(companion => {
    const rowAffection = getCompanionAffection(companion.id);
    const rowStage = getCompanionStage(rowAffection);
    const rowUnlocked = isCompanionUnlocked(companion);
    const active = companion.id === selected.id;
    const bonded = state.companions.bondedTo === companion.id;
    return `
      <button class="companion-roster-card ${active ? 'active' : ''} ${rowUnlocked ? '' : 'locked'}" type="button" data-companion-select="${companion.id}" style="--companion-accent:${companion.accent}">
        <span class="roster-glyph">${companion.glyph}</span>
        <span class="roster-copy">
          <small>${bonded ? '道侣' : rowUnlocked ? rowStage.name : '未相遇'}</small>
          <strong>${escapeHTML(companion.name)}</strong>
          <em>${escapeHTML(companion.title)}</em>
          <i><b style="width:${rowUnlocked ? rowAffection : 0}%"></b></i>
        </span>
      </button>
    `;
  }).join('');

  const bondAction = isBonded
    ? `<button class="companion-bond-button bonded" type="button" data-companion-action="bond_cultivate" ${!unlocked || bondCooldown > 0 ? 'disabled' : ''}>
        <span>双</span><strong>共修周天</strong><small>${!unlocked ? `需${REALMS[selected.minRealm].name}境` : bondCooldown ? `${bondCooldown} 息后可同行` : '吐纳增益 · 持续两分钟'}</small>
      </button>`
    : `<button class="companion-bond-button" type="button" data-companion-action="bond" ${!unlocked || affection < 82 || (bondedTo && !isBonded) ? 'disabled' : ''}>
        <span>契</span><strong>${bondedTo ? '已有道侣' : '结为道侣'}</strong><small>${!unlocked ? `需踏入${REALMS[selected.minRealm].name}境` : bondedTo ? `已与${bondedTo.name}同心` : affection < 82 ? '需好感达到 82' : '此后山河，共赴长生'}</small>
      </button>`;

  ui.companionContent.innerHTML = `
    <div class="bond-overview ${bondedTo ? 'has-bond' : ''}">
      <span class="bond-overview-glyph">${bondedTo ? bondedTo.glyph : '缘'}</span>
      <div>
        <span class="eyebrow">${bondedTo ? '已有道侣' : '此心尚未落定'}</span>
        <h2>${bondedTo ? `${escapeHTML(bondedTo.name)} · ${escapeHTML(bondedTo.title)}` : '山河辽阔，愿有同行'}</h2>
        <p>${bondedTo ? `同行道印：${escapeHTML(bondedTo.bondBenefit)}` : '与相遇之人论道、赠礼、同游。好感达到 82 后，可以结为唯一道侣。'}</p>
      </div>
    </div>

    <div class="companion-layout">
      <aside class="companion-roster-panel">
        <div class="section-heading big-heading"><span>相遇之人</span><span class="quiet">${roster.filter(isCompanionUnlocked).length} / ${roster.length}</span></div>
        <div class="companion-roster">${rosterMarkup}</div>
        <div class="companion-lore-note"><span>记</span><p>好感会在论道、赠礼与同游中增长。道侣一旦结契便不可更改，请珍惜此念。</p></div>
      </aside>

      <article class="companion-profile ${unlocked ? '' : 'locked'}" style="--companion-accent:${selected.accent}">
        <div class="companion-profile-glow"></div>
        <div class="companion-profile-top">
          ${companionPortraitMarkup(selected, 'large')}
          <div class="companion-details">
            <span class="eyebrow">${escapeHTML(selected.sect)} · ${escapeHTML(selected.title)}</span>
            <div class="companion-name-row">
              <h2>${escapeHTML(selected.name)}</h2>
              <span class="companion-stage">${unlocked ? isBonded ? '道侣' : stage.name : '未相遇'}</span>
            </div>
            <p class="companion-description">${escapeHTML(selected.description)}</p>
            <blockquote class="companion-dialogue">${escapeHTML(unlocked ? dialogue : `需踏入${REALMS[selected.minRealm].name}境，才有资格与${selected.name}相遇。`)}</blockquote>
            <div class="affinity-heading">
              <span>心意</span>
              <b>${unlocked ? affection : 0} / 100</b>
              <small>${stage.next ? `距「${getCompanionStage(stage.next).name}」还差 ${stage.next - affection}` : '此心如月，已无缺处'}</small>
            </div>
            <div class="affinity-track"><i style="width:${unlocked ? affection : 0}%"></i><span style="width:${unlocked ? stageProgress : 0}%"></span></div>
            <div class="companion-benefit"><span>同心道印</span><strong>${escapeHTML(selected.bondBenefit)}</strong></div>
          </div>
        </div>

        <div class="companion-action-grid">
          <button type="button" data-companion-action="talk" ${!unlocked || talkCooldown > 0 ? 'disabled' : ''}>
            <span>茶</span><strong>品茶论道</strong><small>${!unlocked ? '尚未相遇' : talkCooldown ? `${talkCooldown} 息后可交谈` : '好感 +7 · 获得少量修为'}</small>
          </button>
          <button type="button" data-companion-action="gift" ${!unlocked || !canGift ? 'disabled' : ''}>
            <span>礼</span><strong>赠以心意</strong><small>${affection >= 100 ? '心意已满' : '好感 +10 · 灵石 55 · 灵草 2'}</small>
          </button>
          <button type="button" data-companion-action="walk" ${!unlocked || walkCooldown > 0 ? 'disabled' : ''}>
            <span>游</span><strong>同游山河</strong><small>${!unlocked ? '尚未相遇' : walkCooldown ? `${walkCooldown} 息后启程` : '好感 +14 · 修为与灵草'}</small>
          </button>
          ${bondAction}
        </div>
      </article>
    </div>
  `;
}

function selectCompanion(companionId) {
  if (!state || !COMPANIONS[companionId]) return;
  state.companions.selected = companionId;
  saveGame(false);
  renderCompanions();
  playTone('soft');
}

function performCompanionAction(action) {
  if (!state) return;
  const companion = COMPANIONS[state.companions.selected];
  if (!companion) return;
  if (!isCompanionUnlocked(companion)) {
    toast(`需踏入${REALMS[companion.minRealm].name}境，才能与${companion.name}相遇。`);
    return;
  }

  if (action === 'talk') {
    const remaining = Number(state.companions.talkAt[companion.id]) + 15000 - Date.now();
    if (remaining > 0) {
      toast(`茶尚温着，${Math.ceil(remaining / 1000)} 息后再聊吧。`);
      return;
    }
    const before = getCompanionAffection(companion.id);
    state.companions.affection[companion.id] = Math.min(100, before + 7);
    state.companions.talkAt[companion.id] = Date.now();
    state.companions.dialogue[companion.id] = pick(companion.talks);
    state.exp = Math.min(getRequirement(), state.exp + Math.floor(getRequirement() * 0.03));
    addLog(`你与${companion.name}品茶论道，心意增长 ${state.companions.affection[companion.id] - before} 点。`, 'jade');
    toast(`与${companion.name}论道 · 好感 +${state.companions.affection[companion.id] - before}`, 'success');
    playTone('soft');
  } else if (action === 'gift') {
    const before = getCompanionAffection(companion.id);
    if (before >= 100) {
      toast('心意已满，已无需再借外物表达。');
      return;
    }
    if (state.stones < 55 || state.herbs < 2) {
      toast('赠礼需要灵石 55 与灵草 2。');
      return;
    }
    state.stones -= 55;
    state.herbs -= 2;
    state.companions.affection[companion.id] = Math.min(100, before + 10);
    state.companions.giftCount[companion.id] += 1;
    state.companions.dialogue[companion.id] = pick(companion.gifts);
    addLog(`你把精心准备的礼物送给${companion.name}，对方的心意又近了一分。`, 'gold');
    toast(`赠礼已收 · ${companion.name}好感 +${state.companions.affection[companion.id] - before}`, 'success');
    playTone('fortune');
  } else if (action === 'walk') {
    const remaining = Number(state.companions.walkAt[companion.id]) + 75000 - Date.now();
    if (remaining > 0) {
      toast(`行程尚在筹备，${Math.ceil(remaining / 1000)} 息后再出发吧。`);
      return;
    }
    const before = getCompanionAffection(companion.id);
    state.companions.affection[companion.id] = Math.min(100, before + 14);
    state.companions.walkAt[companion.id] = Date.now();
    state.companions.dialogue[companion.id] = pick(companion.walks);
    state.exp = Math.min(getRequirement(), state.exp + Math.floor(getRequirement() * 0.08));
    const stones = randomInt(8, 18);
    state.stones += stones;
    state.herbs += 1;
    addLog(`你与${companion.name}同游山河，归途时心境开阔，得灵石 ${stones} 与灵草 1。`, 'jade');
    toast(`同游归来 · 好感 +${state.companions.affection[companion.id] - before} · 灵石 +${stones}`, 'success');
    playTone('complete');
  } else if (action === 'bond') {
    if (state.companions.bondedTo) {
      toast('你已与一位同行者结契，道侣之诺不可更改。');
      return;
    }
    if (getCompanionAffection(companion.id) < 82) {
      toast(`与${companion.name}的好感尚未达到 82。`);
      return;
    }
    state.companions.bondedTo = companion.id;
    state.companions.bondedAt = Date.now();
    state.companions.dialogue[companion.id] = companion.quotes['情定'];
    state.insight += 2;
    addLog(`你与${companion.name}互赠道印，在山河见证下结为道侣。同心道印：${companion.bondBenefit}。`, 'gold');
    toast(`结契道侣 · ${companion.name} · 悟道 +2`, 'success');
    checkAchievements();
    playTone('ascend');
  } else if (action === 'bond_cultivate') {
    if (state.companions.bondedTo !== companion.id) return;
    const remaining = Number(state.companions.lastBondCultivation) + 90000 - Date.now();
    if (remaining > 0) {
      toast(`同心气机尚需平复，${Math.ceil(remaining / 1000)} 息后再共修吧。`);
      return;
    }
    state.companions.lastBondCultivation = Date.now();
    state.companions.affection[companion.id] = Math.min(100, getCompanionAffection(companion.id) + 2);
    state.exp = Math.min(getRequirement(), state.exp + Math.floor(getRequirement() * 0.18));
    state.buffUntil = Math.max(Number(state.buffUntil) || 0, Date.now() + 120000);
    state.companions.dialogue[companion.id] = pick([
      `你与${companion.name}相对而坐，两道灵息在周天中彼此呼应。`,
      `${companion.name}将一缕真气渡入你的经脉，窗外的月色忽然明亮起来。`,
      '这一夜无人说话，两股气息却在天地间走过了同一个周天。'
    ]);
    addLog(`你与道侣${companion.name}共修周天，气海相鸣，获得两分钟的丹药级吐纳增益。`, 'gold');
    toast(`同心共修 · 修为大增 · 吐纳增益 2 分钟`, 'success');
    playTone('levelup');
  }

  checkFullCultivation();
  checkAchievements();
  saveGame(false);
  renderAll();
}

function renderTechniques() {
  if (!state) return;
  const stats = getStats();
  ui.largeInsight.textContent = formatNumber(state.insight);
  ui.techniqueGrid.innerHTML = Object.entries(TECHNIQUES).map(([id, tech]) => {
    const level = state.techniques[id] || 0;
    const locked = state.realm < tech.unlockRealm;
    const nextCost = getTechUpgradeCost(id);
    const maxed = level >= 15;
    const canAfford = state.insight >= nextCost.insight && state.stones >= nextCost.stones;
    let actionText = maxed ? '已臻圆满' : `参悟至 ${level + 1} 层`;
    if (locked) actionText = `需踏入${REALMS[tech.unlockRealm].name}境`;
    else if (!canAfford && !maxed) actionText = '悟道点或灵石不足';
    return `
      <article class="technique-card ${locked ? 'locked' : ''}" style="--tech-accent:${tech.accent}">
        <div class="technique-top">
          <span class="tech-glyph">${tech.glyph}</span>
          <span class="tech-level">第 <b>${level}</b> 层</span>
        </div>
        <h3>${escapeHTML(tech.name)}</h3>
        <span class="tech-path">${escapeHTML(tech.path)}</span>
        <p>${escapeHTML(tech.description)}</p>
        <div class="tech-benefit">
          <span>当前</span><b>${escapeHTML(level > 0 ? tech.effect(level) : '尚未参悟')}</b>
        </div>
        <button class="tech-upgrade" type="button" data-upgrade-tech="${id}" ${locked || maxed || !canAfford ? 'disabled' : ''}>
          <strong>${actionText}</strong>
          ${maxed || locked ? '' : `<span>悟 ${nextCost.insight} · 石 ${formatNumber(nextCost.stones)}</span>`}
        </button>
      </article>
    `;
  }).join('');
  if (stats.buffActive) ui.largeInsight.title = '丹药加持中';
}

function getTechUpgradeCost(id) {
  const level = state?.techniques?.[id] || 0;
  return {
    insight: 1 + Math.floor(level / 2),
    stones: 24 + level * 28
  };
}

function upgradeTechnique(id) {
  if (!state || !TECHNIQUES[id]) return;
  const tech = TECHNIQUES[id];
  const level = state.techniques[id] || 0;
  if (state.realm < tech.unlockRealm) {
    toast(`需踏入${REALMS[tech.unlockRealm].name}境后方可参悟。`);
    return;
  }
  if (level >= 15) {
    toast('这门功法已臻圆满。');
    return;
  }
  const cost = getTechUpgradeCost(id);
  if (state.insight < cost.insight || state.stones < cost.stones) {
    toast('灵石或悟道点不足，暂时无法参悟。');
    return;
  }

  state.insight -= cost.insight;
  state.stones -= cost.stones;
  state.techniques[id] = level + 1;
  const oldMaxHp = getStats().maxHp;
  if (id === 'body') state.hp = Math.min(oldMaxHp, state.hp + 16);
  addLog(`参悟《${tech.name}》有成，功法进入第 ${level + 1} 层。`, 'gold');
  toast(`${tech.name} · 第 ${level + 1} 层`, 'success');
  checkAchievements();
  saveGame(false);
  renderAll();
  playTone('levelup');
}

function getRecipeStoneCost(recipe) {
  const discount = getSectData().passive.alchemyDiscount || 0;
  return Math.max(1, Math.round(recipe.stones * (1 - discount)));
}

function renderAlchemy() {
  if (!state) return;
  const stats = getStats();
  ui.alchemyStones.textContent = formatNumber(state.stones);
  ui.alchemyHerbs.textContent = formatNumber(state.herbs);
  ui.alchemyStatusTitle.textContent = craftingId ? '炉火正盛' : '文火温养';
  ui.cauldronArt.classList.toggle('crafting', Boolean(craftingId));

  ui.recipeGrid.innerHTML = RECIPES.map(recipe => {
    const locked = state.realm < recipe.unlockRealm;
    const stoneCost = getRecipeStoneCost(recipe);
    const lacks = state.stones < stoneCost || state.herbs < recipe.herbs;
    const disabled = locked || lacks || Boolean(craftingId);
    let label = '投入灵草 · 开炉';
    if (locked) label = `需踏入${REALMS[recipe.unlockRealm].name}境`;
    else if (lacks) label = '材料不足';
    else if (craftingId === recipe.id) label = '炉中凝丹…';
    else if (craftingId) label = '另一炉正在炼制';
    return `
      <article class="recipe-card ${locked ? 'locked' : ''}" style="--recipe-accent:${recipe.accent}">
        <div class="pill-graphic">${recipe.glyph}</div>
        <div class="recipe-info">
          <h3>${escapeHTML(recipe.name)}</h3>
          <p>${escapeHTML(recipe.description)}</p>
          <div class="recipe-cost">
            <span>灵石 <b>${stoneCost}</b></span>
            <span>灵草 <b>${recipe.herbs}</b></span>
            <span>持有 <b>${state.pills[recipe.pill] || 0}</b></span>
          </div>
        </div>
        <button class="craft-button" type="button" data-craft="${recipe.id}" ${disabled ? 'disabled' : ''}>${label}</button>
      </article>
    `;
  }).join('');

  if (stats.buffActive) ui.alchemyStatusTitle.textContent = '丹力流转';
}

function craftRecipe(id) {
  if (!state || craftingId) return;
  const recipe = RECIPES.find(item => item.id === id);
  if (!recipe) return;
  if (state.realm < recipe.unlockRealm) {
    toast(`需踏入${REALMS[recipe.unlockRealm].name}境方可炼制此丹。`);
    return;
  }
  const stoneCost = getRecipeStoneCost(recipe);
  if (state.stones < stoneCost || state.herbs < recipe.herbs) {
    toast('灵石或灵草不足，炉火无法凝丹。');
    return;
  }

  craftingId = id;
  ui.alchemyStatusTitle.textContent = '炉火正盛';
  renderAlchemy();
  playTone('fire');
  setTimeout(() => {
    if (!state) {
      craftingId = null;
      return;
    }
    if (state.stones < stoneCost || state.herbs < recipe.herbs) {
      craftingId = null;
      toast('材料不知何时少了一些，这一炉只得作罢。', 'warning');
      renderAlchemy();
      return;
    }
    state.stones -= stoneCost;
    state.herbs -= recipe.herbs;
    const doubleChance = 0.04 + (state.techniques.stars || 0) * 0.009;
    const amount = Math.random() < doubleChance ? 2 : 1;
    state.pills[recipe.pill] = (state.pills[recipe.pill] || 0) + amount;
    state.counters.alchemy += amount;
    craftingId = null;
    ui.alchemyStatusTitle.textContent = '丹香满室';
    addLog(`炉盖轻鸣，${recipe.name}${amount > 1 ? '竟成双份' : '悄然成形'}。`, 'gold');
    toast(`${recipe.name} +${amount}${amount > 1 ? ' · 丹成双份' : ''}`, 'success');
    checkAchievements();
    saveGame(false);
    renderAll();
    renderAlchemy();
    playTone('complete');
    setTimeout(() => {
      if (activeView === 'alchemy' && !craftingId) ui.alchemyStatusTitle.textContent = statsBuffActive() ? '丹力流转' : '文火温养';
    }, 1600);
  }, 1050);
}

function statsBuffActive() {
  return state?.buffUntil > Date.now();
}

function renderPath() {
  if (!state) return;
  ui.statBreakthroughs.textContent = formatNumber(state.counters.breakthroughs);
  ui.statKills.textContent = formatNumber(state.counters.kills);
  ui.statAlchemy.textContent = formatNumber(state.counters.alchemy);
  ui.statFortunes.textContent = formatNumber(state.counters.fortunes);
  ui.statSectMissions.textContent = formatNumber(state.sect.missionsDone);
  ui.statBond.textContent = state.companions.bondedTo ? '1' : '0';
  ui.achievementCount.textContent = `${state.achievements.length} / ${ACHIEVEMENTS.length}`;

  ui.achievementList.innerHTML = ACHIEVEMENTS.map(achievement => {
    const unlocked = state.achievements.includes(achievement.id);
    return `
      <article class="achievement ${unlocked ? 'unlocked' : ''}">
        <span class="achievement-glyph">${achievement.glyph}</span>
        <div><h3>${escapeHTML(achievement.title)}</h3><p>${escapeHTML(achievement.description)}</p></div>
        <span>${unlocked ? '已铭刻' : '未点亮'}</span>
      </article>
    `;
  }).join('');

  updateToggle(ui.soundToggle, state.settings.sound, '已开启', '已关闭');
  updateToggle(ui.motionToggle, state.settings.reduceMotion, '已开启', '已关闭');
}

function updateToggle(button, active, onText, offText) {
  button.classList.toggle('active', Boolean(active));
  button.setAttribute('aria-pressed', String(Boolean(active)));
  const label = button.querySelector('span');
  if (label) label.textContent = active ? onText : offText;
}

function startBattle(zone) {
  if (!state || activeBattle) return;
  if (state.realm < zone.minRealm) {
    toast(`需踏入${REALMS[zone.minRealm].name}境方可进入此地。`);
    return;
  }
  const stats = getStats();
  if (state.hp < stats.maxHp * 0.18) {
    toast('气血不足：交锋后请优先服用回春丹。', 'warning');
  }

  const enemyTemplate = pick(zone.enemies);
  const currentRank = getRank();
  const levelRank = clamp(currentRank + randomInt(-1, 2) + zone.danger, 0, MAX_RANK);
  const variance = 0.91 + Math.random() * 0.18;
  const enemyMaxHp = Math.round((82 + levelRank * 15 + zone.danger * 24) * variance);
  const enemyAtk = Math.round(7 + levelRank * 1.32 + zone.danger * 2.2);
  const enemyDef = Math.round(1 + levelRank * 0.58 + zone.danger * 1.2);

  activeBattle = {
    zone,
    enemy: {
      ...enemyTemplate,
      maxHp: enemyMaxHp,
      hp: enemyMaxHp,
      atk: enemyAtk,
      def: enemyDef,
      rank: levelRank
    },
    round: 1,
    messages: [`${enemyTemplate.name}从${zone.name}的阴影中现出身形。`],
    ended: false,
    result: null
  };
  battleLock = false;

  ui.battleOverlay.classList.remove('hidden');
  ui.battleResult.classList.add('hidden');
  ui.battleActions.classList.remove('hidden');
  ui.battleZone.textContent = zone.name;
  ui.battlePlayerName.textContent = state.name;
  ui.battlePlayerGlyph.textContent = state.name.slice(0, 1) || '剑';
  ui.enemyKind.textContent = enemyTemplate.kind;
  ui.battleTitle.textContent = enemyTemplate.name;
  ui.enemyGlyph.textContent = enemyTemplate.glyph;
  ui.enemyTrait.textContent = enemyTemplate.trait;
  ui.battleRound.textContent = '1';
  ui.battleRoundMark.textContent = '初';
  updateBattleUI();
  renderBattleLog();
  refreshBattleActions();
  playTone('battle');
}

function updateBattleUI() {
  if (!state || !activeBattle) return;
  const stats = getStats();
  const playerPercent = clamp((state.hp / stats.maxHp) * 100, 0, 100);
  const manaPercent = clamp((state.mana / stats.maxMana) * 100, 0, 100);
  const enemyPercent = clamp((activeBattle.enemy.hp / activeBattle.enemy.maxHp) * 100, 0, 100);

  ui.battlePlayerHp.textContent = `${formatNumber(Math.ceil(state.hp))} / ${formatNumber(stats.maxHp)}`;
  ui.battlePlayerHpFill.style.width = `${playerPercent}%`;
  ui.battleManaFill.style.width = `${manaPercent}%`;
  ui.battleManaText.textContent = `${formatNumber(Math.floor(state.mana))} / ${formatNumber(stats.maxMana)}`;
  ui.battleEnemyHp.textContent = `${formatNumber(Math.ceil(activeBattle.enemy.hp))} / ${formatNumber(activeBattle.enemy.maxHp)}`;
  ui.battleEnemyHpFill.style.width = `${enemyPercent}%`;
  ui.battlePillCount.textContent = state.pills.heal;
}

function performBattleAction(action) {
  if (!state || !activeBattle || activeBattle.ended || battleLock) return;
  const stats = getStats();

  if (action === 'skill' && state.mana < 22) {
    toast('灵力不足，先调息回元。', 'warning');
    return;
  }

  if (action === 'pill' && state.pills.heal <= 0) {
    toast('回春丹已经用完了。', 'warning');
    return;
  }

  if (action === 'pill' && state.hp >= stats.maxHp - 1) {
    toast('气血充盈，无需服药。');
    return;
  }

  battleLock = true;
  refreshBattleActions();

  if (action === 'strike' || action === 'skill') {
    attackEnemy(action === 'skill');
  } else if (action === 'channel') {
    const manaGain = Math.min(stats.maxMana - state.mana, 26 + Math.floor(stats.maxMana * 0.12));
    const hpGain = Math.min(stats.maxHp - state.hp, Math.floor(stats.maxHp * 0.04));
    state.mana += manaGain;
    state.hp += hpGain;
    activeBattle.messages.unshift(`你收敛剑势，吐纳回元：灵力 +${manaGain}，气血 +${hpGain}。`);
    showFloatingNumber(`+${manaGain} 灵`, 'heal', 'player');
    updateBattleUI();
    renderBattleLog();
    playTone('channel');
    setTimeout(enemyTurn, 560);
  } else if (action === 'pill') {
    const heal = Math.min(stats.maxHp - state.hp, Math.floor(stats.maxHp * 0.45 * stats.healMultiplier));
    state.pills.heal -= 1;
    state.hp += heal;
    activeBattle.messages.unshift(`回春丹化开，气血恢复了 ${heal} 点。`);
    showFloatingNumber(`+${heal}`, 'heal', 'player');
    updateBattleUI();
    renderBattleLog();
    playTone('pill');
    setTimeout(enemyTurn, 560);
  }
}

function attackEnemy(useSkill) {
  const stats = getStats();
  const enemy = activeBattle.enemy;
  const animationTimer = setTimeout(() => {
    ui.playerCombatant.classList.remove('attacking');
  }, 390);

  ui.playerCombatant.classList.remove('attacking');
  void ui.playerCombatant.offsetWidth;
  ui.playerCombatant.classList.add('attacking');

  if (useSkill) {
    state.mana -= 22;
    activeBattle.messages.unshift('青莲剑诀掀起一线清光，剑势一分为三。');
    playTone('sword');
  } else {
    playTone('strike');
  }

  setTimeout(() => {
    if (!activeBattle || activeBattle.ended) {
      clearTimeout(animationTimer);
      return;
    }
    const multiplier = useSkill ? 1.63 + (state.techniques.sword || 1) * 0.026 : 1;
    const critical = Math.random() < stats.crit + (useSkill ? 0.025 : 0);
    const variance = 0.9 + Math.random() * 0.2;
    const rawDamage = Math.max(2, stats.atk * multiplier - enemy.def * 0.58) * variance;
    const damage = Math.max(1, Math.round(rawDamage * (critical ? 1.75 : 1)));
    enemy.hp = Math.max(0, enemy.hp - damage);

    ui.enemyCombatant.classList.remove('hit');
    void ui.enemyCombatant.offsetWidth;
    ui.enemyCombatant.classList.add('hit');
    showFloatingNumber(`${critical ? '会心 ' : ''}${damage}`, critical ? 'crit' : '', 'enemy');
    activeBattle.messages.unshift(
      useSkill
        ? `剑光掠过，${enemy.name}受到 ${damage} 点伤害${critical ? '，正中破绽' : ''}。`
        : `你递出一剑，${enemy.name}受到 ${damage} 点伤害${critical ? '，正中破绽' : ''}。`
    );
    updateBattleUI();
    renderBattleLog();

    if (enemy.hp <= 0) {
      setTimeout(() => finishBattle(true), 520);
    } else {
      setTimeout(enemyTurn, 620);
    }
    setTimeout(() => ui.enemyCombatant.classList.remove('hit'), 430);
  }, 170);
}

function enemyTurn() {
  if (!state || !activeBattle || activeBattle.ended) return;
  const stats = getStats();
  const enemy = activeBattle.enemy;
  ui.enemyCombatant.classList.remove('attacking');
  void ui.enemyCombatant.offsetWidth;
  ui.enemyCombatant.classList.add('attacking');

  setTimeout(() => {
    if (!activeBattle || activeBattle.ended) return;
    const dodged = Math.random() < stats.dodge;
    if (dodged) {
      showFloatingNumber('闪避', 'heal', 'player');
      activeBattle.messages.unshift(`${enemy.name}扑空，你侧身借风避开了这一击。`);
      playTone('dodge');
    } else {
      const variance = 0.86 + Math.random() * 0.28;
      const damage = Math.max(1, Math.round((enemy.atk - stats.defenseMitigation) * variance));
      state.hp = Math.max(0, state.hp - damage);
      ui.playerCombatant.classList.remove('hit');
      void ui.playerCombatant.offsetWidth;
      ui.playerCombatant.classList.add('hit');
      showFloatingNumber(`-${damage}`, '', 'player');
      activeBattle.messages.unshift(`${enemy.name}趁隙反击，你受到 ${damage} 点伤害。`);
      playTone('hurt');
      setTimeout(() => ui.playerCombatant.classList.remove('hit'), 430);
    }

    updateBattleUI();
    renderBattleLog();
    ui.enemyCombatant.classList.remove('attacking');
    activeBattle.round += 1;
    ui.battleRound.textContent = activeBattle.round;
    ui.battleRoundMark.textContent = activeBattle.round < 10 ? NUMBER_TEXT[activeBattle.round] : '久';

    if (state.hp <= 0) {
      setTimeout(() => finishBattle(false), 520);
    } else {
      battleLock = false;
      refreshBattleActions();
    }
  }, 260);
}

function refreshBattleActions() {
  if (!ui.battleActions) return;
  const ended = !activeBattle || activeBattle.ended;
  ui.battleActions.querySelectorAll('[data-battle-action]').forEach(button => {
    button.disabled = ended || battleLock;
    if (activeBattle && !ended && !battleLock) {
      if (button.dataset.battleAction === 'skill') button.disabled = state.mana < 22;
      if (button.dataset.battleAction === 'pill') button.disabled = state.pills.heal <= 0;
    }
  });
}

function renderBattleLog() {
  if (!activeBattle) return;
  ui.battleLog.innerHTML = activeBattle.messages
    .slice(0, 2)
    .map(text => `<div>${escapeHTML(text)}</div>`)
    .join('');
}

function finishBattle(victory) {
  if (!state || !activeBattle || activeBattle.ended) return;
  activeBattle.ended = true;
  battleLock = true;
  refreshBattleActions();
  const enemy = activeBattle.enemy;
  const zone = activeBattle.zone;
  const stats = getStats();

  if (victory) {
    const req = getRequirement();
    const expReward = Math.max(6, Math.floor(req * (0.08 + Math.random() * 0.055)));
    const stoneReward = randomInt(14, 26) + getRank() * 6 + zone.danger * 15;
    const herbReward = randomInt(1, 2) + (zone.danger > 1 ? 1 : 0);
    const newEnemy = !state.defeatedEnemies.includes(enemy.name);
    if (newEnemy) state.defeatedEnemies.push(enemy.name);
    state.exp = Math.min(req, state.exp + expReward);
    state.stones += stoneReward;
    state.herbs += herbReward;
    state.counters.kills += 1;
    let insightReward = 0;
    if (newEnemy || Math.random() < 0.11) {
      insightReward = newEnemy ? 1 : 1;
      state.insight += insightReward;
    }
    state.hp = Math.min(stats.maxHp, state.hp + stats.maxHp * 0.18);

    activeBattle.result = 'victory';
    ui.battleResultKicker.textContent = '胜';
    ui.battleResultTitle.textContent = '剑落妖伏';
    ui.battleResultText.textContent = `山风掠过剑锋，${enemy.name}的身影没入雾中。`;
    ui.battleRewards.innerHTML = [
      `修为 +${formatNumber(expReward)}`,
      `灵石 +${formatNumber(stoneReward)}`,
      `灵草 +${herbReward}`,
      insightReward ? `悟道 +${insightReward}` : ''
    ].filter(Boolean).map(value => `<span>${escapeHTML(value)}</span>`).join('');
    addLog(`你在${zone.name}击败${enemy.name}，得修为 ${formatNumber(expReward)}、灵石 ${stoneReward}。`, 'jade');
    if (newEnemy) toast(`妖物图鉴新记：${enemy.name}`, 'success');
    checkFullCultivation();
    checkAchievements();
    playTone('victory');
  } else {
    const penalty = Math.min(state.stones, Math.max(8, Math.floor(state.stones * 0.1)));
    state.stones -= penalty;
    state.counters.defeats += 1;
    state.hp = Math.max(1, Math.floor(stats.maxHp * 0.28));
    activeBattle.result = 'defeat';
    ui.battleResultKicker.textContent = '败';
    ui.battleResultTitle.textContent = '暂退山门';
    ui.battleResultText.textContent = '最后一缕护体灵气替你挡下杀招。道心未损，来日再战。';
    ui.battleRewards.innerHTML = penalty
      ? `<span>灵石 -${formatNumber(penalty)}</span><span>气血保留三成</span>`
      : '<span>气血保留三成</span>';
    addLog(`你在${zone.name}被${enemy.name}击败，暂退洞府调息。`, 'red');
    playTone('fail');
  }

  saveGame(false);
  renderHeaderStats();
  renderHome();
  renderGoal();
  ui.battleActions.classList.add('hidden');
  ui.battleResult.classList.remove('hidden');
}

function retreatBattle() {
  if (!activeBattle) return;
  if (activeBattle.ended) {
    closeBattle();
    return;
  }
  const shouldRetreat = window.confirm('现在收剑遁走，本场历练不会获得奖励。确定离开吗？');
  if (!shouldRetreat) return;
  activeBattle.ended = true;
  battleLock = true;
  const stats = getStats();
  state.hp = Math.max(1, state.hp - Math.floor(stats.maxHp * 0.06));
  addLog(`你在${activeBattle.zone.name}收敛气机，暂避锋芒。`, 'normal');
  ui.battleResultKicker.textContent = '退';
  ui.battleResultTitle.textContent = '暂避锋芒';
  ui.battleResultText.textContent = '山势未明，退一步并非认输。养足精神，仍可再来。';
  ui.battleRewards.innerHTML = '<span>未获战利</span><span>少许气血损耗</span>';
  ui.battleActions.classList.add('hidden');
  ui.battleResult.classList.remove('hidden');
  saveGame(false);
}

function closeBattle() {
  if (!activeBattle) return;
  ui.battleOverlay.classList.add('hidden');
  activeBattle = null;
  battleLock = false;
  ui.floatLayer.replaceChildren();
  renderAll();
  playTone('soft');
}

function showFloatingNumber(text, className, target) {
  if (!ui.floatLayer) return;
  const item = document.createElement('span');
  item.className = `float-damage ${className || ''}`;
  item.textContent = text;
  const targetElement = target === 'enemy' ? ui.enemyCombatant : ui.playerCombatant;
  const arenaRect = ui.battleArena.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  item.style.left = `${targetRect.left - arenaRect.left + targetRect.width * (0.42 + Math.random() * 0.15)}px`;
  item.style.top = `${Math.max(12, targetRect.top - arenaRect.top + targetRect.height * 0.32)}px`;
  ui.floatLayer.appendChild(item);
  setTimeout(() => item.remove(), 850);
}

function closeGuide() {
  ui.guideModal.classList.add('hidden');
}

function openGuide() {
  ui.guideModal.classList.remove('hidden');
  playTone('open');
}

function toggleSound() {
  if (!state) {
    introRoot = introRoot || 'spirit';
    return;
  }
  state.settings.sound = !state.settings.sound;
  renderHeaderStats();
  renderPath();
  saveGame(false);
  if (state.settings.sound) {
    ensureAudio();
    playTone('soft');
  }
}

function toggleMotion() {
  if (!state) return;
  state.settings.reduceMotion = !state.settings.reduceMotion;
  applySettings();
  renderPath();
  setupAmbientCanvas();
  saveGame(false);
}

function applySettings() {
  if (!state) return;
  document.body.classList.toggle('reduce-motion', Boolean(state.settings.reduceMotion));
  updateToggle(ui.soundToggle, state.settings.sound, '已开启', '已关闭');
  updateToggle(ui.motionToggle, state.settings.reduceMotion, '已开启', '已关闭');
}

function resetGame() {
  if (!window.confirm('散尽前尘会删除当前浏览器中的全部修行进度。确定重新入道吗？')) return;
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (error) {
    console.warn(error);
  }
  window.location.reload();
}

function toast(message, type = 'info') {
  if (!ui.toastContainer) return;
  const element = document.createElement('div');
  element.className = `toast ${type}`;
  const span = document.createElement('span');
  span.textContent = message;
  element.appendChild(span);
  ui.toastContainer.appendChild(element);
  while (ui.toastContainer.children.length > 4) {
    ui.toastContainer.firstElementChild.remove();
  }
  setTimeout(() => {
    element.classList.add('leaving');
    setTimeout(() => element.remove(), 320);
  }, 3400);
}

function updateWorldDate() {
  const now = new Date();
  const season = now.getMonth() >= 8 ? '暮秋' : now.getMonth() >= 5 ? '长夏' : now.getMonth() >= 2 ? '春和' : '玄冬';
  ui.worldDate.textContent = `${now.getMonth() + 1}月${now.getDate()}日 · ${season}`;
  ui.weatherText.textContent = WEATHER[now.getDate() % WEATHER.length];
  const hour = now.getHours();
  const periods = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const period = periods[Math.floor(((hour + 1) % 24) / 2)];
  const rain = now.getDate() % 3 === 0 ? '微雨' : now.getMonth() >= 8 ? '松风' : '薄雾';
  ui.sceneClock.textContent = `${period}时 · ${rain}`;
}

function ensureAudio() {
  if (!state?.settings?.sound && state) return;
  if (!audioContext) {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    try {
      audioContext = new AudioCtor();
    } catch (error) {
      audioContext = null;
    }
  }
  if (audioContext?.state === 'suspended') audioContext.resume().catch(() => {});
}

function playTone(type) {
  if (state && !state.settings.sound) return;
  ensureAudio();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const configs = {
    qi: [520, 0.055, 0.025, 'sine'],
    soft: [660, 0.035, 0.018, 'sine'],
    open: [440, 0.18, 0.04, 'sine'],
    complete: [740, 0.26, 0.05, 'triangle'],
    levelup: [523, 0.55, 0.07, 'sine'],
    ascend: [392, 0.95, 0.08, 'triangle'],
    pill: [620, 0.16, 0.04, 'sine'],
    fortune: [820, 0.32, 0.045, 'sine'],
    fail: [165, 0.4, 0.04, 'sawtooth'],
    break: [220, 0.62, 0.06, 'triangle'],
    battle: [260, 0.28, 0.04, 'triangle'],
    strike: [180, 0.12, 0.035, 'sawtooth'],
    sword: [760, 0.24, 0.04, 'triangle'],
    channel: [430, 0.22, 0.025, 'sine'],
    dodge: [920, 0.12, 0.02, 'sine'],
    hurt: [110, 0.18, 0.035, 'sawtooth'],
    victory: [784, 0.52, 0.055, 'triangle'],
    fire: [150, 0.3, 0.03, 'triangle']
  };
  const config = configs[type] || configs.soft;
  const [frequency, duration, volume, wave] = config;

  if (type === 'qi' && performance.now() - lastClickSound < 38) return;
  lastClickSound = performance.now();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = wave;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (['levelup', 'ascend', 'victory', 'fortune'].includes(type)) {
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + duration);
  } else if (['fail', 'hurt', 'strike'].includes(type)) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(60, frequency * 0.7), now + duration);
  }
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);

  if (['levelup', 'ascend', 'victory'].includes(type)) {
    setTimeout(() => {
      if (audioContext && (!state || state.settings.sound)) playTone('soft');
    }, duration * 520);
  }
}

function setupAmbientCanvas() {
  const canvas = ui.ambientCanvas;
  if (!canvas) return;
  if (ambientFrame) cancelAnimationFrame(ambientFrame);
  const rect = canvas.parentElement.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  const context = canvas.getContext('2d');
  if (!context) return;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = rect.width < 620 ? 18 : 38;
  ambientParticles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    radius: 0.5 + Math.random() * 1.6,
    speed: 0.08 + Math.random() * 0.25,
    drift: -0.06 + Math.random() * 0.12,
    phase: Math.random() * Math.PI * 2,
    tone: index % 5 === 0 ? 'gold' : 'jade'
  }));

  const draw = (time = 0) => {
    context.clearRect(0, 0, rect.width, rect.height);
    context.globalCompositeOperation = 'lighter';
    ambientParticles.forEach(particle => {
      if (!state?.settings?.reduceMotion) {
        particle.y -= particle.speed;
        particle.x += particle.drift + Math.sin(time / 2600 + particle.phase) * 0.025;
        if (particle.y < -8) {
          particle.y = rect.height + 6;
          particle.x = Math.random() * rect.width;
        }
        if (particle.x < -8) particle.x = rect.width + 5;
        if (particle.x > rect.width + 8) particle.x = -5;
      }
      const alpha = 0.18 + Math.sin(time / 1600 + particle.phase) * 0.08;
      context.beginPath();
      context.fillStyle = particle.tone === 'gold'
        ? `rgba(221, 196, 138, ${alpha})`
        : `rgba(151, 220, 189, ${alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });
    context.globalCompositeOperation = 'source-over';
    if (!state?.settings?.reduceMotion) ambientFrame = requestAnimationFrame(draw);
  };
  draw(performance.now());
}

window.addEventListener('resize', () => {
  clearTimeout(window.__ambientResizeTimer);
  window.__ambientResizeTimer = setTimeout(setupAmbientCanvas, 180);
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
