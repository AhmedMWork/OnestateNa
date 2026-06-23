insert into site_settings (site_title, hero_title, hero_subtitle, applications_open, admin_applications_open, leader_applications_open, tracking_open)
values ('OneState NA Recruitment', 'OneState NA — بوابة التقديم', 'اختر مسار التقديم المناسب، وأرسل طلبك للمراجعة من الإدارة المختصة.', true, true, true, true)
on conflict do nothing;

insert into factions (slug, name_ar, description_ar, requirements_ar, icon_name, is_open, is_visible, order_index) values
('police','الشرطة','قيادة وتنظيم فصيل الشرطة ومتابعة الانضباط الداخلي وإجراءات التعامل مع اللاعبين.','خبرة في RP، هدوء في التعامل، فهم لإجراءات الاعتقال والتسلسل القيادي.','Badge', true, true, 1),
('army','الجيش','إدارة الفصيل العسكري والحفاظ على النظام والتسلسل القيادي وحماية منطقة القاعدة.','التزام يومي، فهم لقواعد الجيش، قدرة على تنظيم الأعضاء والتعامل مع الاستفزاز.','Shield', true, true, 2),
('medical','التحالف الطبي','تنظيم الفريق الطبي وضمان جودة الاستجابة داخل اللعبة وسلامة الطاقم.','فهم حدود التدخل الطبي، الهدوء في المواقف الخطرة، قدرة على تدريب الفريق.','Stethoscope', true, true, 3)
on conflict (slug) do update set name_ar=excluded.name_ar, description_ar=excluded.description_ar, requirements_ar=excluded.requirements_ar, icon_name=excluded.icon_name, is_visible=true;

insert into questions (application_type, faction_slug, section, question_key, title, description, input_type, options, required, order_index, helper_image) values
('ALL', null, 'البيانات الأساسية', 'rp_name', 'اسم الشخصية داخل اللعبة RP', 'اكتب اسم الشخصية كما يظهر داخل اللعبة.', 'TEXT', '[]', true, 10, null),
('ALL', null, 'البيانات الأساسية', 'age', 'العمر', null, 'NUMBER', '[]', true, 20, null),
('ALL', null, 'البيانات الأساسية', 'country', 'الدولة', null, 'TEXT', '[]', true, 30, null),
('ALL', null, 'البيانات الأساسية', 'discord_username', 'Discord Username', 'اكتب اسم المستخدم كما يظهر في حساب Discord.', 'TEXT', '[]', true, 40, 'discord'),
('ALL', null, 'بيانات اللعبة', 'server_name', 'اسم السيرفر', null, 'TEXT', '[]', true, 50, null),
('ALL', null, 'بيانات اللعبة', 'client_id', 'Client ID', 'ستجد Client ID في إعدادات اللعبة كما هو موضح بالصورة.', 'TEXT', '[]', true, 60, 'client-id'),
('ALL', null, 'بيانات اللعبة', 'hours_played', 'تقريبًا كم ساعة لعب لديك؟', null, 'NUMBER', '[]', false, 70, null),
('ALL', null, 'الخبرة والتفرغ', 'hours_available', 'عدد ساعات التفرغ يوميًا', null, 'NUMBER', '[]', true, 80, null),
('ALL', null, 'الخبرة والتفرغ', 'rp_experience', 'اشرح خبرتك في RP', 'اذكر خبرتك السابقة وأهم ما تعلمته داخل السيرفرات.', 'TEXTAREA', '[]', true, 90, null),
('ALL', null, 'الخبرة والتفرغ', 'previous_violations', 'هل لديك مخالفات أو عقوبات سابقة؟', 'اذكرها بوضوح إن وجدت، أو اكتب لا يوجد.', 'TEXTAREA', '[]', true, 100, null),

('ADMIN', null, 'الخبرة والتفرغ', 'admin_experience', 'هل لديك خبرة إدارية سابقة؟', 'اشرح أين كانت الخبرة وما دورك تحديدًا.', 'TEXTAREA', '[]', true, 110, null),
('ADMIN', null, 'المواقف العملية', 'admin_complaint', 'لاعب يشتكي من عقوبة ويقول إن الإداري ظلمه. كيف تتصرف؟', null, 'TEXTAREA', '[]', true, 120, null),
('ADMIN', null, 'المواقف العملية', 'admin_no_evidence', 'لاعبان يتبادلان الاتهامات بدون دليل واضح. ماذا تفعل؟', null, 'TEXTAREA', '[]', true, 130, null),
('ADMIN', null, 'المواقف العملية', 'admin_staff_misconduct', 'رأيت إداريًا يتعامل بطريقة غير مناسبة. ما الإجراء الصحيح؟', null, 'TEXTAREA', '[]', true, 140, null),
('ADMIN', null, 'المواقف العملية', 'admin_provocation', 'لاعب استفزك شخصيًا داخل اللعبة أو في الشات. كيف تتعامل؟', null, 'TEXTAREA', '[]', true, 150, null),
('ADMIN', null, 'خطة العمل', 'admin_why_you', 'لماذا ترى أنك مناسب للفريق الإداري؟', null, 'TEXTAREA', '[]', true, 160, null),
('ADMIN', null, 'خطة العمل', 'admin_first_week', 'ما أول شيء ستركز عليه لو تم قبولك؟', null, 'TEXTAREA', '[]', true, 170, null),

('FACTION_LEADER', null, 'الخبرة والتفرغ', 'leadership_experience', 'اشرح خبرتك في القيادة أو إدارة فريق', null, 'TEXTAREA', '[]', true, 200, null),
('FACTION_LEADER', null, 'الخبرة والتفرغ', 'why_faction_leader', 'لماذا تريد منصب قائد فصيل؟', null, 'TEXTAREA', '[]', true, 210, null),
('FACTION_LEADER', null, 'المواقف العملية', 'leader_internal_conflict', 'حدث نزاع داخلي بين عضوين في الفصيل. كيف تدير الموقف؟', null, 'TEXTAREA', '[]', true, 220, null),
('FACTION_LEADER', null, 'المواقف العملية', 'leader_inactive_members', 'عدد من الأعضاء غير نشطين ولا ينفذون المهام. كيف تتعامل؟', null, 'TEXTAREA', '[]', true, 230, null),
('FACTION_LEADER', null, 'المواقف العملية', 'leader_abuse_power', 'عضو في فصيلك أساء استخدام السلطة. ماذا تفعل؟', null, 'TEXTAREA', '[]', true, 240, null),
('FACTION_LEADER', null, 'خطة العمل', 'leader_first_3_decisions', 'ما أول 3 قرارات ستتخذها بعد قبولك؟', null, 'TEXTAREA', '[]', true, 250, null),
('FACTION_LEADER', null, 'خطة العمل', 'leader_training_plan', 'كيف ستدرّب الأعضاء الجدد داخل الفصيل؟', null, 'TEXTAREA', '[]', true, 260, null),

('FACTION_LEADER', 'police', 'المواقف العملية', 'police_false_arrest', 'عضو شرطة سجن لاعبًا بدون سبب واضح. كيف تتصرف؟', null, 'TEXTAREA', '[]', true, 300, null),
('FACTION_LEADER', 'police', 'خطة العمل', 'police_discipline_plan', 'كيف ستضمن احترام إجراءات الاعتقال داخل الشرطة؟', null, 'TEXTAREA', '[]', true, 310, null),
('FACTION_LEADER', 'army', 'المواقف العملية', 'army_left_base', 'جندي خرج من القاعدة بالسلاح أو الزي بدون إذن. ما الإجراء؟', null, 'TEXTAREA', '[]', true, 320, null),
('FACTION_LEADER', 'army', 'خطة العمل', 'army_command_plan', 'كيف ستنظم التسلسل القيادي وتوزيع المهام؟', null, 'TEXTAREA', '[]', true, 330, null),
('FACTION_LEADER', 'medical', 'المواقف العملية', 'medical_refused_help', 'مسعف رفض مساعدة لاعب بدون سبب مناسب. كيف تتعامل؟', null, 'TEXTAREA', '[]', true, 340, null),
('FACTION_LEADER', 'medical', 'خطة العمل', 'medical_response_plan', 'كيف ستضمن سرعة وجودة الاستجابة الطبية؟', null, 'TEXTAREA', '[]', true, 350, null),

('ALL', null, 'الإقرارات', 'consent_truth', 'أقر بصحة البيانات', 'أقر أن كل البيانات التي كتبتها صحيحة وأن للإدارة حق رفض الطلب عند وجود تضليل أو تكرار.', 'CONSENT', '[]', true, 900, null),
('ALL', null, 'الإقرارات', 'consent_review', 'أوافق على مراجعة الطلب', 'أعلم أن إرسال الطلب لا يعني القبول، وأن القرار النهائي يعود للإدارة المختصة.', 'CONSENT', '[]', true, 910, null)
on conflict (question_key) do update set title=excluded.title, description=excluded.description, section=excluded.section, input_type=excluded.input_type, helper_image=excluded.helper_image, is_active=true, order_index=excluded.order_index;

insert into rules (category, code, title, body, penalty, severity, faction_slug, tags, order_index) values
('مرجع إداري', 'GENERAL', 'الاحترام والانضباط', 'أي مراجعة أو قرار إداري يجب أن يقوم على الاحترام والتوثيق وعدم استخدام المنصب بصورة شخصية.', null, 'HIGH', null, array['إدارة'], 10),
('مرجع إداري', 'DUPLICATE', 'التقديم المتكرر', 'يحق للإدارة اعتبار الطلب مكررًا عند تطابق Client ID أو Discord أو اسم الشخصية أو بيانات الجهاز.', null, 'MEDIUM', null, array['طلبات'], 20),
('قواعد الشرطة', 'POLICE-LEAD', 'انضباط الشرطة', 'قائد الشرطة مسؤول عن منع إساءة استخدام السلطة، وضمان أن الاعتقال يتم بسبب واضح وتوثيق مناسب عند الحاجة.', null, 'HIGH', 'police', array['شرطة'], 30),
('قواعد الجيش', 'ARMY-LEAD', 'التسلسل القيادي', 'قائد الجيش مسؤول عن ضبط التسلسل القيادي ومنع الخروج بالزي أو السلاح دون إذن.', null, 'HIGH', 'army', array['جيش'], 40),
('قواعد الطبي', 'MEDICAL-LEAD', 'حدود التدخل الطبي', 'قائد الطبي مسؤول عن جودة الاستجابة ومنع التدخل في المواقف التي تعرض الطاقم للخطر.', null, 'HIGH', 'medical', array['طبي'], 50)
on conflict do nothing;
