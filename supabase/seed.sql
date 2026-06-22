insert into site_settings (site_title, hero_title, hero_subtitle, applications_open, admin_applications_open, leader_applications_open, tracking_open)
values ('Onestaterp Recruitment Portal', 'بوابة التقديم الرسمية لإدارة وفصائل Onestaterp', 'منصة عربية احترافية لاستقبال ومراجعة طلبات الإدارة وقادة الفصائل.', true, true, true, true)
on conflict do nothing;

insert into factions (slug, name_ar, description_ar, requirements_ar, icon_name, is_open, is_visible, order_index) values
('police','الشرطة','قيادة الانضباط وتطبيق إجراءات الاعتقال وحماية النظام العام.','معرفة إجراءات الاعتقال وقوانين المناطق الخضراء وعدم إساءة استخدام السلطة.','BadgeCheck', true, true, 1),
('army','الجيش','قيادة الفصيل العسكري وحماية القاعدة والالتزام بالتسلسل القيادي.','التفرغ اليومي وفهم قواعد الجيش وFRP وNRP.','Shield', true, true, 2),
('medical','التحالف الطبي','قيادة الطاقم الطبي والاستجابة للحالات مع احترام سلامة المسعفين.','فهم قواعد الطبي وحدود التدخل في المواقف الخطرة.','Stethoscope', true, true, 3)
on conflict (slug) do update set name_ar=excluded.name_ar, description_ar=excluded.description_ar, requirements_ar=excluded.requirements_ar, icon_name=excluded.icon_name, is_visible=true;

insert into questions (application_type, faction_slug, section, question_key, title, description, input_type, options, required, order_index, helper_image) values
('ALL', null, 'البيانات الأساسية', 'rp_name', 'اسم الشخصية داخل اللعبة RP', 'اكتب اسم الشخصية كما يظهر داخل اللعبة.', 'TEXT', '[]', true, 10, null),
('ALL', null, 'البيانات الأساسية', 'age', 'العمر', 'الحد الأدنى المقترح 16 سنة لقادة الفصائل.', 'NUMBER', '[]', true, 20, null),
('ALL', null, 'البيانات الأساسية', 'country', 'الدولة', null, 'TEXT', '[]', true, 30, null),
('ALL', null, 'البيانات الأساسية', 'contact', 'وسيلة تواصل إضافية', 'اختياري للتواصل الإداري.', 'TEXT', '[]', false, 40, null),
('ALL', null, 'بيانات اللعبة', 'server_name', 'اسم السيرفر', null, 'TEXT', '[]', true, 50, null),
('ALL', null, 'بيانات اللعبة', 'client_id', 'Client ID', 'ستجد Client ID في إعدادات اللعبة كما هو موضح بالصورة.', 'TEXT', '[]', true, 60, 'client-id'),
('ALL', null, 'بيانات اللعبة', 'discord_username', 'Discord Username', 'اكتب اليوزر فقط كما يظهر في حساب Discord. لا يوجد ربط بالديسكورد.', 'TEXT', '[]', true, 70, 'discord'),
('ALL', null, 'الخبرة والتفرغ', 'hours_available', 'عدد ساعات التفرغ يوميًا', null, 'NUMBER', '[]', true, 80, null),
('ALL', null, 'الخبرة والتفرغ', 'rp_experience', 'اشرح خبرتك في RP', 'اذكر خبرتك السابقة وأهم ما تعلمته.', 'TEXTAREA', '[]', true, 90, null),
('ADMIN', null, 'أسئلة القوانين', 'admin_green_zone', 'كيف تتعامل مع مخالفة داخل منطقة خضراء؟', 'اكتب التصرف الإداري المناسب مع ذكر القاعدة أو الإجراء.', 'TEXTAREA', '[]', true, 100, null),
('ADMIN', null, 'أسئلة القوانين', 'admin_abuse', 'ما موقفك من استخدام ثغرة داخل اللعبة؟', null, 'TEXTAREA', '[]', true, 110, null),
('ADMIN', null, 'السيناريوهات العملية', 'admin_conflict', 'لاعبان يتبادلان الاتهامات بدون دليل واضح. ماذا تفعل؟', null, 'TEXTAREA', '[]', true, 120, null),
('FACTION_LEADER', null, 'الخبرة والتفرغ', 'leadership_experience', 'اشرح خبرتك في القيادة أو إدارة فريق', null, 'TEXTAREA', '[]', true, 130, null),
('FACTION_LEADER', null, 'السيناريوهات العملية', 'leader_internal_conflict', 'حدث نزاع داخلي بين عضوين في الفصيل. كيف تدير الموقف؟', null, 'TEXTAREA', '[]', true, 140, null),
('FACTION_LEADER', null, 'السيناريوهات العملية', 'leader_abuse_power', 'عضو في فصيلك أساء استخدام السلطة. ماذا تفعل؟', null, 'TEXTAREA', '[]', true, 150, null),
('FACTION_LEADER', 'police', 'أسئلة القوانين', 'police_arrest_procedure', 'اذكر خطوات الاعتقال الصحيحة داخل OneState', null, 'TEXTAREA', '[]', true, 160, null),
('FACTION_LEADER', 'army', 'أسئلة القوانين', 'army_base_rule', 'كيف تتعامل مع دخول غير مصرح به للقاعدة؟', null, 'TEXTAREA', '[]', true, 170, null),
('FACTION_LEADER', 'medical', 'أسئلة القوانين', 'medical_danger_scene', 'متى يحق للمسعف عدم التدخل طبيًا؟', null, 'TEXTAREA', '[]', true, 180, null),
('ALL', null, 'الإقرارات', 'consent_truth', 'أقر بصحة البيانات', 'أقر أن كل البيانات التي كتبتها صحيحة وأن للإدارة حق رفض الطلب عند وجود تضليل أو تكرار.', 'CONSENT', '[]', true, 900, null),
('ALL', null, 'الإقرارات', 'consent_rules', 'أقر بقراءة القوانين', 'أقر أنني قرأت القوانين الأساسية وأنني أقبل مراجعة الإدارة للطلب.', 'CONSENT', '[]', true, 910, null)
on conflict (question_key) do update set title=excluded.title, description=excluded.description, section=excluded.section, input_type=excluded.input_type, helper_image=excluded.helper_image, is_active=true;

insert into rules (category, code, title, body, penalty, severity, faction_slug, tags, order_index) values
('الشروط العامة', '1.3', 'الاحترام المتبادل', 'أي تفاعل داخل مشروع OneState يعتمد على الاحترام المتبادل والسلوك المهذب تجاه اللاعبين الآخرين.', null, 'MEDIUM', null, array['عام','سلوك'], 10),
('قواعد RP', '1RP', 'الإقصاء التعسفي', 'إلحاق الضرر أو قتل شخصية لاعب آخر بدون سبب في لعب الأدوار.', '20 دقيقة في السجن', 'HIGH', null, array['RP'], 20),
('قواعد RP', '6RP', 'رفض لعب الأدوار', 'أي وسيلة للانحراف عن عملية لعب الأدوار للحصول على ميزة شخصية، مثل دخول المنطقة الآمنة أثناء مطاردة مسلحة.', '30 إلى 60 دقيقة في السجن', 'HIGH', null, array['RP','NRP'], 30),
('قواعد الدردشة', '3CHAT', 'إهانات مبنية على الدين أو السياسة أو العرق', 'يحظر إهانة اللاعبين أو الإشارة إلى جنسيتهم أو عرقهم أو دينهم أو جنسهم في سياق سلبي.', 'كتم 240 دقيقة أو حظر 3 أيام', 'CRITICAL', null, array['دردشة'], 40),
('الانتهاكات الجسيمة', '3ALERT', 'استخدام برامج غش', 'محاولة تعديل ملفات اللعبة أو استخدام برامج خارجية للحصول على ميزة أو إلحاق ضرر بالمشروع.', 'حظر دائم لجميع الحسابات المرتبطة', 'CRITICAL', null, array['غش','حظر'], 50),
('المناطق الخضراء', '11RP', 'النشاط الإجرامي في المناطق الآمنة', 'يمنع إطلاق النار أو القيام بأي نشاط إجرامي داخل المستشفى وسوق المركبات ومناطق العمل.', '30 إلى 95 دقيقة حسب المخالفة', 'HIGH', null, array['منطقة خضراء'], 60),
('قواعد الشرطة', 'POLICE-ARREST', 'إجراءات الاعتقال', 'يجب ذكر سبب الاعتقال وقراءة الحقوق وتوثيق المخالفة عند الحاجة.', 'تحذير أو توبيخ أو فصل حسب الحالة', 'HIGH', 'police', array['شرطة','اعتقال'], 70),
('قواعد الجيش', 'ARMY-BASE', 'حماية القاعدة', 'يجب الالتزام بالتسلسل الهرمي وعدم مغادرة القاعدة بالزي الرسمي أو السلاح دون إذن.', 'تحذير أو توبيخ أو فصل', 'HIGH', 'army', array['جيش'], 80),
('قواعد الطبي', 'MD-2', 'المساعدة في المواقف الخطرة', 'يمنع تقديم المساعدة الطبية في المواقف التي تهدد حياة المسعف أو أثناء إطلاق نار نشط.', 'تحذير واحد من قيادة الفصيل', 'HIGH', 'medical', array['طبي'], 90)
on conflict do nothing;
