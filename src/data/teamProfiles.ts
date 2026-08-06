export interface TeamMemberProfile {
  slug: string;
  name: string;
  roleKey: string;
  departmentKey: string;
  photo?: string;
  bio: string[];
  arBio?: string[];
}

const dispatcherBio: string[] = [
  'Coordinates daily vehicle and driver dispatch across all active logistics routes.',
  'Maintains real-time communication with drivers and field teams throughout every shift.',
  'Tracks shipment status and provides timely updates to operations and clients.',
  'Manages dispatch documentation, route scheduling and delivery records.',
  'Works closely with the logistics and operations teams to ensure smooth cargo movement.',
];
const arDispatcherBio: string[] = [
  'يُنسّق إرسال المركبات والسائقين اليومي عبر جميع المسارات اللوجستية النشطة.',
  'يحافظ على التواصل الفوري مع السائقين والفرق الميدانية طوال كل وردية.',
  'يتابع حالة الشحنات ويُقدّم تحديثات دورية للعمليات والعملاء.',
  'يُدير وثائق الإرسال وجدول المسارات وسجلات التسليم.',
  'يعمل بتنسيق وثيق مع فريقَي اللوجستيات والعمليات لضمان سلاسة حركة البضائع.',
];

const logisticsBio: string[] = [
  'Handles cargo operations at Jaber and Al-Karamah border crossings.',
  'Operates forklifts and heavy handling equipment at the border crossings.',
  'Manages cross-border freight documentation and customs coordination.',
  'Ensures cargo moves across the crossing safely and on time.',
  'Coordinates with dispatch and operations teams for end-to-end cargo tracking.',
];
const arLogisticsBio: string[] = [
  'يتولى عمليات الشحن على معبرَي جابر والكرامة.',
  'يُشغّل الرافعات الشوكية ومعدات المناولة الثقيلة على المعابر الحدودية.',
  'يُدير وثائق الشحن العابر للحدود وتنسيق الجمارك.',
  'يضمن عبور البضائع من المعبر بأمان وفي الوقت المحدد.',
  'يُنسّق مع فريقَي الإرسال والعمليات لتتبّع البضائع من البداية إلى النهاية.',
];

const opsBio: string[] = [
  'Manages daily on-site camp and project operations.',
  'Coordinates supply chain activities between project sites and the head office.',
  'Liaises directly with clients and subcontractors on the ground.',
  'Oversees compliance with operational, safety and quality standards.',
  'Supports the operations lead in executing multi-site project programmes.',
];
const arOpsBio: string[] = [
  'يُدير العمليات اليومية في المخيمات ومواقع المشاريع.',
  'يُنسّق أنشطة سلسلة التوريد بين مواقع المشاريع والمقر الرئيسي.',
  'يتواصل مباشرةً مع العملاء والمقاولين من الباطن في الميدان.',
  'يُشرف على الامتثال لمعايير العمليات والسلامة والجودة.',
  'يدعم مدير العمليات في تنفيذ البرامج متعددة المواقع.',
];

const maintenanceBio: string[] = [
  'Maintains and repairs the company fleet of trucks and heavy equipment.',
  'Conducts regular vehicle inspections and pre-trip safety checks.',
  'Schedules and executes preventive maintenance programmes across the fleet.',
  'Manages spare parts inventory and workshop operations.',
  'Ensures all vehicles meet roadworthiness and safety standards at all times.',
];
const arMaintenanceBio: string[] = [
  'يصون ويُصلح أسطول الشاحنات والمعدات الثقيلة التابعة للشركة.',
  'يُجري فحوصات دورية للمركبات وفحوصات السلامة قبل الرحلات.',
  'يُجدوِل وينفّذ برامج الصيانة الوقائية عبر الأسطول.',
  'يُدير مخزون قطع الغيار وعمليات الورشة.',
  'يضمن استيفاء جميع المركبات لمعايير السلامة وصلاحية القيادة في جميع الأوقات.',
];

const salesBio: string[] = [
  'Identifies and pursues new business opportunities across key industry sectors.',
  'Prepares tender documents, proposals and commercial presentations.',
  'Manages and develops long-term client relationships.',
  'Conducts site visits, needs assessments and service capability evaluations.',
  'Works with operations to ensure all proposal commitments are fully deliverable.',
];
const arSalesBio: string[] = [
  'يُحدّد الفرص التجارية الجديدة ويسعى إليها في القطاعات الرئيسية.',
  'يُعدّ وثائق المناقصات والعروض والعروض التجارية.',
  'يُدير العلاقات مع العملاء ويُطوّرها على المدى البعيد.',
  'يُجري زيارات ميدانية وتقييمات للاحتياجات وإمكانيات الخدمة.',
  'يتعاون مع العمليات لضمان قابلية تنفيذ جميع التزامات العروض المقدّمة.',
];

const financeBio: string[] = [
  'Manages financial operations including payroll, accounts payable and receivable.',
  'Prepares monthly financial reports, variance analyses and cash flow statements.',
  'Controls project budgets and monitors cost performance against targets.',
  'Handles banking transactions, VAT compliance and audit support.',
  'Supports management decision-making with financial data and forecasting.',
];
const arFinanceBio: string[] = [
  'يُدير العمليات المالية بما فيها الرواتب والذمم المدينة والدائنة.',
  'يُعدّ التقارير المالية الشهرية وتحليلات الانحرافات وتقارير التدفق النقدي.',
  'يُراقب ميزانيات المشاريع وأداء التكاليف مقارنةً بالأهداف.',
  'يتولى المعاملات المصرفية والامتثال لضريبة القيمة المضافة ودعم المراجعات.',
  'يدعم قرارات الإدارة بالبيانات المالية والتوقعات.',
];

export const profiles: TeamMemberProfile[] = [
  // ── Leadership ────────────────────────────────────────────────────────
  {
    slug: 'raed-abu-sonbul',
    name: 'Mr. Raed Abu Sonbul',
    roleKey: 'gm',
    departmentKey: 'leadership',
    photo: '/assets/people/raed-abu-sonbul.webp',
    bio: [
      'Founded Abu Sonbul Arab Transporters in 2008, building it from a single transport licence into a fully integrated logistics group.',
      'Over 30 years of experience in transport, logistics and large-scale project management across Jordan and the Middle East.',
      'Personally directed the ADNOC Azraq and Sarhan camp programmes — 2+ years of multi-service delivery including camp construction, cross-border transport from the UAE, catering and housekeeping.',
      'Led the ARGAS Al-Jaffr project in southern Jordan, managing cross-border freight from Saudi Arabia, full camp construction, catering and daily site operations.',
      'Built and scaled a team of 80+ professionals across six specialised departments: transport, logistics, operations, maintenance, sales and finance.',
      'Developed strong partnerships with international energy and infrastructure operators, including ADNOC, ARGAS and government entities.',
      'Oversees all strategic planning, senior client relationships and high-level project execution across active programmes.',
      'Committed to long-term partnerships, operational excellence and delivering on every promise made to clients.',
    ],
    arBio: [
      'أسّس شركة ابو سنبل العرب للنقليات عام 2008، وطوّرها من ترخيص نقل واحد إلى مجموعة لوجستية متكاملة.',
      'يمتلك أكثر من 30 عامًا من الخبرة في النقل والخدمات اللوجستية وإدارة المشاريع في الأردن والشرق الأوسط.',
      'أشرف شخصيًا على مخيمَي أدنوك في الأزرق وسرحان — أكثر من سنتين من التسليم المتكامل شمل البناء والنقل من الإمارات والإعاشة والتدبير المنزلي.',
      'قاد مشروع أرغاس في الجفر جنوب الأردن، وأشرف على النقل من السعودية وبناء المخيم والإعاشة والعمليات اليومية.',
      'بنى فريقًا يضم أكثر من 80 متخصصًا موزّعين على ستة أقسام: النقل واللوجستيات والعمليات والصيانة والمبيعات والمالية.',
      'أرسى شراكات استراتيجية مع كبار مشغّلي قطاع الطاقة والبنية التحتية، من بينهم أدنوك وأرغاس وجهات حكومية.',
      'يُشرف على التخطيط الاستراتيجي وعلاقات العملاء الكبار وتنفيذ جميع البرامج النشطة.',
      'ملتزم بالتميّز في العمل وبناء شراكات طويلة الأمد والوفاء بكل وعد قُطع للعملاء.',
    ],
  },
  {
    slug: 'diaa-abu-sonbul',
    name: 'Mr. Diaa Abu Sonbul',
    roleKey: 'vp',
    departmentKey: 'leadership',
    bio: [
      'Oversees business development strategy and new market opportunities for Abu Sonbul.',
      'Manages key client relationships and supports contract negotiations at senior level.',
      'Drives cross-functional coordination between departments to ensure seamless service delivery.',
      'Leads evaluation of new service lines and geographic expansion opportunities.',
      'Works closely with the General Manager to align operational capacity with business growth.',
    ],
    arBio: [
      'يُشرف على استراتيجية تطوير الأعمال وفرص الأسواق الجديدة لابو سنبل.',
      'يُدير علاقات العملاء الرئيسية ويدعم مفاوضات العقود على المستوى العالي.',
      'يقود التنسيق متعدد الوظائف بين الأقسام لضمان سلاسة تقديم الخدمات.',
      'يقود تقييم خطوط الخدمات الجديدة وفرص التوسع الجغرافي.',
      'يعمل بتنسيق وثيق مع المدير العام لمواءمة الطاقة التشغيلية مع النمو.',
    ],
  },
  {
    slug: 'ahmad-al-kurdi',
    name: 'Mr. Ahmad Al Kurdi',
    roleKey: 'ceo',
    departmentKey: 'leadership',
    bio: [
      'Responsible for day-to-day business performance across all departments.',
      'Ensures operational efficiency and service quality are maintained at all times.',
      'Manages the executive team and drives departmental accountability.',
      'Leads financial planning, resource allocation and budget oversight.',
      'Acts as a key interface between leadership and operational teams to maintain alignment.',
    ],
    arBio: [
      'مسؤول عن الأداء التجاري اليومي عبر جميع الأقسام.',
      'يضمن الكفاءة التشغيلية وجودة الخدمة في جميع الأوقات.',
      'يُدير الفريق التنفيذي ويُعزّز مساءلة الأقسام.',
      'يقود التخطيط المالي وتخصيص الموارد والإشراف على الميزانية.',
      'يعمل كحلقة وصل رئيسية بين القيادة والفرق التشغيلية.',
    ],
  },
  {
    slug: 'ramy-el-haj',
    name: 'Eng. Ramy El Haj',
    roleKey: 'operations',
    departmentKey: 'leadership',
    bio: [
      'Manages daily transport, logistics and field operations across all active project sites.',
      'Coordinates the dispatcher, logistics and operations teams for end-to-end project delivery.',
      'Oversees on-site operations at Jaber, Al-Karamah, Azraq, Sarhan and Al-Jaffr.',
      'Ensures compliance with safety, quality and client-specific operational standards on every site.',
      'Leads real-time incident management and operational problem resolution.',
      'Liaises directly with clients on operational performance and service improvements.',
    ],
    arBio: [
      'يُدير عمليات النقل واللوجستيات والميدان اليومية عبر جميع مواقع المشاريع النشطة.',
      'يُنسّق فرق الإرسال واللوجستيات والعمليات للتسليم الشامل للمشاريع.',
      'يُشرف على العمليات في الموقع في جابر والكرامة والأزرق وسرحان والجفر.',
      'يضمن الامتثال لمعايير السلامة والجودة ومتطلبات العملاء في كل موقع.',
      'يقود إدارة الحوادث الفورية وحل التحديات التشغيلية.',
      'يتواصل مباشرةً مع العملاء حول الأداء التشغيلي وتحسينات الخدمة.',
    ],
  },

  // ── Dispatcher Team ────────────────────────────────────────────────────
  { slug: 'khaled-odeh',    name: 'Eng. Khaled Odeh', roleKey: 'transportation', departmentKey: 'transportation', bio: dispatcherBio, arBio: arDispatcherBio },
  { slug: 'noor-alnees',    name: 'Eng. Noor Alnees', roleKey: 'transportation', departmentKey: 'transportation', bio: dispatcherBio, arBio: arDispatcherBio },
  { slug: 'essa-katatsheh', name: 'Essa Katatsheh',   roleKey: 'transportation', departmentKey: 'transportation', bio: dispatcherBio, arBio: arDispatcherBio },
  { slug: 'talal-assi',     name: 'Talal Assi',        roleKey: 'transportation', departmentKey: 'transportation', photo: '/assets/people/Talal.jpeg', bio: dispatcherBio, arBio: arDispatcherBio },

  // ── Logistics ──────────────────────────────────────────────────────────
  { slug: 'mohd-abd-sonbul', name: 'Mohd Abd Sonbul', roleKey: 'logistics', departmentKey: 'logistics', bio: logisticsBio, arBio: arLogisticsBio },
  { slug: 'yahia-katatsheh', name: 'Yahia Katatsheh', roleKey: 'logistics', departmentKey: 'logistics', bio: logisticsBio, arBio: arLogisticsBio },
  { slug: 'khaled-haddad',   name: 'Khaled Haddad',   roleKey: 'logistics', departmentKey: 'logistics', bio: logisticsBio, arBio: arLogisticsBio },
  { slug: 'issa-al-alem',    name: 'Issa Al Alem',    roleKey: 'logistics', departmentKey: 'logistics', bio: logisticsBio, arBio: arLogisticsBio },
  { slug: 'osaid-al-hiari',  name: 'Osaid Al Hiari',  roleKey: 'logistics', departmentKey: 'logistics', bio: logisticsBio, arBio: arLogisticsBio },

  // ── Operations ─────────────────────────────────────────────────────────
  { slug: 'suflan-haddad',    name: 'Suflan Haddad',    roleKey: 'ops', departmentKey: 'ops', bio: opsBio, arBio: arOpsBio },
  { slug: 'anas-al-hasasneh', name: 'Anas Al Hasasneh', roleKey: 'ops', departmentKey: 'ops', bio: opsBio, arBio: arOpsBio },
  { slug: 'ahmad-abu-sonbul', name: 'Ahmad Abu Sonbul', roleKey: 'ops', departmentKey: 'ops', bio: opsBio, arBio: arOpsBio },

  // ── Maintenance ────────────────────────────────────────────────────────
  { slug: 'baker-azazmeh', name: 'Baker Azazmeh', roleKey: 'maintenance', departmentKey: 'maintenance', bio: maintenanceBio, arBio: arMaintenanceBio },

  // ── Sales ──────────────────────────────────────────────────────────────
  { slug: 'jawad-abu-sael',   name: 'Jawad Abu Sael',   roleKey: 'sales', departmentKey: 'sales', bio: salesBio, arBio: arSalesBio },
  { slug: 'ramzi-abu-sonbul', name: 'Ramzi Abu Sonbul', roleKey: 'sales', departmentKey: 'sales', bio: salesBio, arBio: arSalesBio },

  // ── Finance ────────────────────────────────────────────────────────────
  { slug: 'diab-badwieh',   name: 'Diab Badwieh',   roleKey: 'finance', departmentKey: 'finance', bio: financeBio, arBio: arFinanceBio },
  { slug: 'mahmoud-sonbul', name: 'Mahmoud Sonbul', roleKey: 'finance', departmentKey: 'finance', bio: financeBio, arBio: arFinanceBio },
  { slug: 'hamzeh-kharaz',  name: 'Hamzeh Kharaz',  roleKey: 'finance', departmentKey: 'finance', bio: financeBio, arBio: arFinanceBio },
];

export function getProfile(slug: string): TeamMemberProfile | undefined {
  return profiles.find((p) => p.slug === slug);
}
