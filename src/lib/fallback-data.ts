import type { Faction, Question } from './types';

export const DEFAULT_FACTIONS: Faction[] = [
  {
    id: 'fallback-police',
    slug: 'police',
    name_ar: 'فصيل الشرطة',
    description_ar: 'قيادة الانضباط الميداني وتنظيم إجراءات الشرطة ومتابعة أداء الأعضاء داخل المدينة.',
    icon_name: 'police-badge',
    requirements_ar: 'خبرة واضحة في RP، فهم لإجراءات الاعتقال، قدرة على ضبط الفريق، ووقت يومي مناسب للمتابعة.',
    is_open: true,
    is_visible: true,
    order_index: 1
  },
  {
    id: 'fallback-army',
    slug: 'army',
    name_ar: 'فصيل الجيش',
    description_ar: 'إدارة الانضباط العسكري وحماية القاعدة واحترام التسلسل القيادي داخل الفصيل.',
    icon_name: 'military-rank',
    requirements_ar: 'التزام قيادي، معرفة بقواعد الجيش، قدرة على إدارة الأوامر والرتب والمواقف الحساسة.',
    is_open: true,
    is_visible: true,
    order_index: 2
  },
  {
    id: 'fallback-medical',
    slug: 'medical',
    name_ar: 'التحالف الطبي',
    description_ar: 'تنظيم الطاقم الطبي، جودة الاستجابة، وضمان التزام المسعفين بدورهم داخل المدينة.',
    icon_name: 'medical-cross',
    requirements_ar: 'هدوء، فهم لدور المسعف، قدرة على تنظيم المناوبات، ووعي بالمواقف الخطرة.',
    is_open: true,
    is_visible: true,
    order_index: 3
  }
];

type Q = Omit<Question, 'id' | 'is_active' | 'order_index'> & { order_index?: number };

function q(item: Q, index: number): Question {
  return { id: `fallback-${item.question_key}`, is_active: true, order_index: item.order_index ?? index, ...item };
}

const base: Q[] = [
  { application_type: 'ALL', faction_slug: null, section: 'البيانات الأساسية', question_key: 'rp_name', title: 'اسم الشخصية داخل اللعبة RP Name', description: 'اكتب الاسم كما يظهر داخل اللعبة بدون اختصار أو لقب خارجي.', input_type: 'TEXT', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'البيانات الأساسية', question_key: 'age', title: 'العمر', description: 'يجب كتابة العمر الحقيقي بالأرقام.', input_type: 'NUMBER', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'البيانات الأساسية', question_key: 'country', title: 'الدولة', description: 'مثال: مصر، السعودية، الإمارات.', input_type: 'TEXT', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'البيانات الأساسية', question_key: 'discord_username', title: 'Discord Username', description: 'اكتب اسم المستخدم كما يظهر في حسابك حتى يمكن التواصل معك بعد مراجعة الطلب.', input_type: 'TEXT', options: [], required: true, helper_image: 'discord' },
  { application_type: 'ALL', faction_slug: null, section: 'بيانات اللعبة', question_key: 'client_id', title: 'Client ID', description: 'اكتب الرقم الظاهر داخل إعدادات اللعبة كما هو بدون مسافات.', input_type: 'TEXT', options: [], required: true, helper_image: 'client-id' },
  { application_type: 'ALL', faction_slug: null, section: 'بيانات اللعبة', question_key: 'server_name', title: 'السيرفر', description: 'اكتب اسم السيرفر أو رقمه داخل OneState NA.', input_type: 'TEXT', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'بيانات اللعبة', question_key: 'playing_hours', title: 'عدد ساعات لعبك التقريبية', description: 'اكتب تقديرًا قريبًا لخبرتك داخل السيرفر.', input_type: 'NUMBER', options: [], required: false, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'الخبرة والتفرغ', question_key: 'daily_hours', title: 'كم ساعة تستطيع التواجد يوميًا؟', description: 'اكتب متوسط التفرغ اليومي الواقعي وليس الرقم المثالي.', input_type: 'NUMBER', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'الخبرة والتفرغ', question_key: 'previous_experience', title: 'ما خبرتك السابقة داخل RP أو الإدارة أو الفصائل؟', description: 'اذكر الخبرة بوضوح: المنصب، المدة، المسؤوليات، وما تعلمته.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'الخبرة والتفرغ', question_key: 'availability_plan', title: 'كيف ستنظم وقتك حتى لا تتوقف بعد القبول؟', description: 'وضح مواعيدك المتاحة وطريقة التزامك بدون مبالغة.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'الإقرارات', question_key: 'truth_consent', title: 'أتعهد بصحة البيانات', description: 'أقر أن جميع البيانات والإجابات التي كتبتها صحيحة، وأعلم أن أي تلاعب قد يؤدي إلى رفض الطلب.', input_type: 'CONSENT', options: [], required: true, helper_image: null },
  { application_type: 'ALL', faction_slug: null, section: 'الإقرارات', question_key: 'review_consent', title: 'أوافق على مراجعة الطلب', description: 'أفهم أن إرسال الطلب لا يعني القبول، وأن للإدارة الحق في قبول أو رفض أو تأجيل الطلب بعد المراجعة.', input_type: 'CONSENT', options: [], required: true, helper_image: null }
];

const admin: Q[] = [
  { application_type: 'ADMIN', faction_slug: null, section: 'الخبرة والتفرغ', question_key: 'admin_reason', title: 'لماذا تريد الانضمام للفريق الإداري؟', description: 'اكتب سببًا واضحًا بعيدًا عن العموميات.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'ADMIN', faction_slug: null, section: 'المواقف العملية', question_key: 'admin_case_complaint', title: 'لاعب يشتكي أن إداريًا ظلمه في عقوبة، كيف تتصرف؟', description: 'اكتب خطواتك بالترتيب من سماع الشكوى حتى القرار أو التصعيد.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'ADMIN', faction_slug: null, section: 'المواقف العملية', question_key: 'admin_case_provocation', title: 'لاعب يستفزك أمام الآخرين، كيف تحافظ على الحياد؟', description: 'المطلوب طريقة تصرف عملية وليس كلامًا عامًا عن الهدوء فقط.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'ADMIN', faction_slug: null, section: 'المواقف العملية', question_key: 'admin_case_friend', title: 'صديقك داخل السيرفر ارتكب مخالفة واضحة، ماذا تفعل؟', description: 'وضح كيف تفصل العلاقة الشخصية عن القرار الإداري.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'ADMIN', faction_slug: null, section: 'خطة العمل', question_key: 'admin_first_week', title: 'ما أول شيء ستلتزم به في أول أسبوع إذا تم قبولك؟', description: 'اكتب خطة قصيرة قابلة للتنفيذ.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null }
];

const leaderCommon: Q[] = [
  { application_type: 'FACTION_LEADER', faction_slug: null, section: 'الخبرة والتفرغ', question_key: 'leader_reason', title: 'لماذا ترى نفسك مناسبًا لقيادة هذا الفصيل؟', description: 'اربط إجابتك بالقيادة والانضباط والمتابعة اليومية.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: null, section: 'المواقف العملية', question_key: 'leader_internal_conflict', title: 'حدث خلاف بين عضوين داخل الفصيل، كيف تديره؟', description: 'اكتب خطوات التعامل دون انحياز ودون تصعيد غير ضروري.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: null, section: 'المواقف العملية', question_key: 'leader_inactive_members', title: 'كيف ستتعامل مع الأعضاء غير النشطين؟', description: 'وضح آلية متابعة عادلة قبل أي عقوبة أو فصل.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: null, section: 'خطة العمل', question_key: 'leader_first_3_decisions', title: 'اكتب أول 3 قرارات ستطبقها بعد قبولك كقائد', description: 'القرارات يجب أن تكون عملية وقابلة للقياس.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: null, section: 'خطة العمل', question_key: 'leader_training_plan', title: 'كيف ستدرّب الأعضاء الجدد داخل الفصيل؟', description: 'اكتب تصورًا مختصرًا للتدريب والمتابعة والتقييم.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null }
];

const police: Q[] = [
  { application_type: 'FACTION_LEADER', faction_slug: 'police', section: 'المواقف العملية', question_key: 'police_false_arrest', title: 'ضابط سجن لاعبًا دون سبب واضح، كيف تتعامل كقائد؟', description: 'وضح التحقق، مراجعة الدليل، حماية حق اللاعب، ومحاسبة العضو إن لزم.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: 'police', section: 'المواقف العملية', question_key: 'police_arrest_procedure', title: 'ما أهم ما تراجعه في إجراءات الاعتقال داخل فصيل الشرطة؟', description: 'اكتب النقاط العملية التي تمنع الظلم أو سوء استخدام السلطة.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null }
];

const army: Q[] = [
  { application_type: 'FACTION_LEADER', faction_slug: 'army', section: 'المواقف العملية', question_key: 'army_chain_command', title: 'جندي تجاهل التسلسل القيادي ورفض أمرًا مباشرًا، كيف تتصرف؟', description: 'وضح التدرج بين التنبيه، التحقيق، التوثيق، والعقوبة.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: 'army', section: 'المواقف العملية', question_key: 'army_base_provocation', title: 'لاعب يستفز الجيش قرب القاعدة، كيف تمنع التصعيد الخاطئ؟', description: 'اكتب طريقة ضبط الموقف وفق دور الجيش دون خروج عن RP.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null }
];

const medical: Q[] = [
  { application_type: 'FACTION_LEADER', faction_slug: 'medical', section: 'المواقف العملية', question_key: 'medical_refusal', title: 'مسعف رفض تقديم المساعدة للاعب دون سبب مقنع، كيف تتعامل؟', description: 'وضح طريقة التحقيق والتدريب أو المحاسبة.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null },
  { application_type: 'FACTION_LEADER', faction_slug: 'medical', section: 'المواقف العملية', question_key: 'medical_danger_scene', title: 'هناك تبادل إطلاق نار نشط وطلبوا من المسعف الدخول، ما القرار الصحيح؟', description: 'اكتب كيف توازن بين تقديم الخدمة وسلامة الطاقم.', input_type: 'TEXTAREA', options: [], required: true, helper_image: null }
];

export const DEFAULT_QUESTIONS: Question[] = [...base, ...admin, ...leaderCommon, ...police, ...army, ...medical].map(q);

export function getFallbackQuestions(type: string, faction?: string | null) {
  return DEFAULT_QUESTIONS
    .filter(question => question.application_type === 'ALL' || question.application_type === type)
    .filter(question => !question.faction_slug || question.faction_slug === faction)
    .sort((a, b) => a.order_index - b.order_index);
}
