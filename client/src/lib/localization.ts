export const SUPPORTED_LANGUAGES = [
  'en',
  'en-us',
  'ar',
  'de',
  'es',
  'fr',
  'it',
  'ja',
  'ko',
  'pt',
  'ru',
  'zh',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export interface Translation {
  en: string;
  ar: string;
  de?: string;
  es?: string;
  fr?: string;
  it?: string;
  ja?: string;
  ko?: string;
  pt?: string;
  ru?: string;
  zh?: string;
}

export const UI_TRANSLATIONS: Record<string, Translation> = {
  'Base Quantities': { 
    en: 'Base Quantities', ar: 'الكميات الأساسية', de: 'Basisgrößen',
    es: 'Cantidades Base', fr: 'Grandeurs de Base', it: 'Grandezze di Base',
    pt: 'Grandezas Base', ru: 'Базовые Величины', zh: '基本量', ja: '基本量', ko: '기본량'
  },
  'Mechanics': { 
    en: 'Mechanics', ar: 'الميكانيكا', de: 'Mechanik',
    es: 'Mecánica', fr: 'Mécanique', it: 'Meccanica',
    pt: 'Mecânica', ru: 'Механика', zh: '力学', ja: '力学', ko: '역학'
  },
  'Electricity & Magnetism': { 
    en: 'Electricity & Magnetism', ar: 'الكهرباء والمغناطيسية', de: 'Elektrizität & Magnetismus',
    es: 'Electricidad y Magnetismo', fr: 'Électricité et Magnétisme', it: 'Elettricità e Magnetismo',
    pt: 'Eletricidade e Magnetismo', ru: 'Электричество и Магнетизм', zh: '电磁学', ja: '電気と磁気', ko: '전기와 자기'
  },
  'Light & Radiation': {
    en: 'Light & Radiation', ar: 'الضوء والإشعاع', de: 'Licht & Strahlung',
    es: 'Luz y Radiación', fr: 'Lumière et Rayonnement', it: 'Luce e Radiazione',
    pt: 'Luz e Radiação', ru: 'Свет и Излучение', zh: '光与辐射', ja: '光と放射', ko: '빛과 방사선'
  },
  'Thermodynamics': {
    en: 'Thermodynamics', ar: 'الديناميكا الحرارية', de: 'Thermodynamik',
    es: 'Termodinámica', fr: 'Thermodynamique', it: 'Termodinamica',
    pt: 'Termodinâmica', ru: 'Термодинамика', zh: '热力学', ja: '熱力学', ko: '열역학'
  },
  'Acoustics': {
    en: 'Acoustics', ar: 'الصوتيات', de: 'Akustik',
    es: 'Acústica', fr: 'Acoustique', it: 'Acustica',
    pt: 'Acústica', ru: 'Акустика', zh: '声学', ja: '音響学', ko: '음향학'
  },
  'Chemistry & Nuclear': {
    en: 'Chemistry & Nuclear', ar: 'الكيمياء والنووية', de: 'Chemie & Nuklear',
    es: 'Química y Nuclear', fr: 'Chimie et Nucléaire', it: 'Chimica e Nucleare',
    pt: 'Química e Nuclear', ru: 'Химия и Ядерная', zh: '化学与核', ja: '化学と原子力', ko: '화학과 원자력'
  },
  'Data & Digital': {
    en: 'Data & Digital', ar: 'البيانات والرقمية', de: 'Daten & Digital',
    es: 'Datos y Digital', fr: 'Données et Numérique', it: 'Dati e Digitale',
    pt: 'Dados e Digital', ru: 'Данные и Цифровые', zh: '数据与数字', ja: 'データとデジタル', ko: '데이터와 디지털'
  },
  'Industrial & Specialty': {
    en: 'Industrial & Specialty', ar: 'الصناعة والتخصص', de: 'Industrie & Spezial',
    es: 'Industrial y Especialidad', fr: 'Industrie et Spécialité', it: 'Industriale e Specialità',
    pt: 'Industrial e Especialidade', ru: 'Промышленность и Специальные', zh: '工业与专业', ja: '産業と専門', ko: '산업과 전문'
  },
  'CGS System': {
    en: 'CGS System', ar: 'نظام CGS', de: 'CGS-System',
    es: 'Sistema CGS', fr: 'Système CGS', it: 'Sistema CGS',
    pt: 'Sistema CGS', ru: 'Система СГС', zh: 'CGS制', ja: 'CGS単位系', ko: 'CGS 단위계'
  },
  'Archaic & Regional': {
    en: 'Archaic & Regional', ar: 'القديمة والإقليمية', de: 'Archaisch & Regional',
    es: 'Arcaico y Regional', fr: 'Archaïque et Régional', it: 'Arcaico e Regionale',
    pt: 'Arcaico e Regional', ru: 'Архаичные и Региональные', zh: '古代与地区', ja: '古代と地域', ko: '고대와 지역'
  },
  'Length': { 
    en: 'Length', ar: 'الطول', de: 'Länge',
    es: 'Longitud', fr: 'Longueur', it: 'Lunghezza',
    pt: 'Comprimento', ru: 'Длина', zh: '长度', ja: '長さ', ko: '길이'
  },
  'Mass': { 
    en: 'Mass', ar: 'الكتلة', de: 'Masse',
    es: 'Masa', fr: 'Masse', it: 'Massa',
    pt: 'Massa', ru: 'Масса', zh: '质量', ja: '質量', ko: '질량'
  },
  'Time': { 
    en: 'Time', ar: 'الوقت', de: 'Zeit',
    es: 'Tiempo', fr: 'Temps', it: 'Tempo',
    pt: 'Tempo', ru: 'Время', zh: '时间', ja: '時間', ko: '시간'
  },
  'Electric Current': {
    en: 'Electric Current', ar: 'التيار الكهربائي', de: 'Elektrischer Strom',
    es: 'Corriente Eléctrica', fr: 'Courant Électrique', it: 'Corrente Elettrica',
    pt: 'Corrente Elétrica', ru: 'Электрический Ток', zh: '电流', ja: '電流', ko: '전류'
  },
  'Temperature': { 
    en: 'Temperature', ar: 'درجة الحرارة', de: 'Temperatur',
    es: 'Temperatura', fr: 'Température', it: 'Temperatura',
    pt: 'Temperatura', ru: 'Температура', zh: '温度', ja: '温度', ko: '온도'
  },
  'Amount of Substance': {
    en: 'Amount of Substance', ar: 'كمية المادة', de: 'Stoffmenge',
    es: 'Cantidad de Sustancia', fr: 'Quantité de Matière', it: 'Quantità di Sostanza',
    pt: 'Quantidade de Substância', ru: 'Количество Вещества', zh: '物质的量', ja: '物質量', ko: '물질량'
  },
  'Luminous Intensity': {
    en: 'Luminous Intensity', ar: 'شدة الإضاءة', de: 'Lichtstärke',
    es: 'Intensidad Luminosa', fr: 'Intensité Lumineuse', it: 'Intensità Luminosa',
    pt: 'Intensidade Luminosa', ru: 'Сила Света', zh: '发光强度', ja: '光度', ko: '광도'
  },
  'Area': {
    en: 'Area', ar: 'المساحة', de: 'Fläche',
    es: 'Área', fr: 'Surface', it: 'Area',
    pt: 'Área', ru: 'Площадь', zh: '面积', ja: '面積', ko: '면적'
  },
  'Volume': {
    en: 'Volume', ar: 'الحجم', de: 'Volumen',
    es: 'Volumen', fr: 'Volume', it: 'Volume',
    pt: 'Volume', ru: 'Объём', zh: '体积', ja: '体積', ko: '부피'
  },
  'Speed': {
    en: 'Speed', ar: 'السرعة', de: 'Geschwindigkeit',
    es: 'Velocidad', fr: 'Vitesse', it: 'Velocità',
    pt: 'Velocidade', ru: 'Скорость', zh: '速度', ja: '速度', ko: '속도'
  },
  'Acceleration': {
    en: 'Acceleration', ar: 'التسارع', de: 'Beschleunigung',
    es: 'Aceleración', fr: 'Accélération', it: 'Accelerazione',
    pt: 'Aceleração', ru: 'Ускорение', zh: '加速度', ja: '加速度', ko: '가속도'
  },
  'Force': {
    en: 'Force', ar: 'القوة', de: 'Kraft',
    es: 'Fuerza', fr: 'Force', it: 'Forza',
    pt: 'Força', ru: 'Сила', zh: '力', ja: '力', ko: '힘'
  },
  'Energy': { 
    en: 'Energy', ar: 'الطاقة', de: 'Energie',
    es: 'Energía', fr: 'Énergie', it: 'Energia',
    pt: 'Energia', ru: 'Энергия', zh: '能量', ja: 'エネルギー', ko: '에너지'
  },
  'Pressure': { 
    en: 'Pressure', ar: 'الضغط', de: 'Druck',
    es: 'Presión', fr: 'Pression', it: 'Pressione',
    pt: 'Pressão', ru: 'Давление', zh: '压力', ja: '圧力', ko: '압력'
  },
  'Power': { 
    en: 'Power', ar: 'القدرة', de: 'Leistung',
    es: 'Potencia', fr: 'Puissance', it: 'Potenza',
    pt: 'Potência', ru: 'Мощность', zh: '功率', ja: '仕事率', ko: '일률'
  },
  'Frequency': {
    en: 'Frequency', ar: 'التردد', de: 'Frequenz',
    es: 'Frecuencia', fr: 'Fréquence', it: 'Frequenza',
    pt: 'Frequência', ru: 'Частота', zh: '频率', ja: '周波数', ko: '주파수'
  },
  'Electric Charge': {
    en: 'Electric Charge', ar: 'الشحنة الكهربائية', de: 'Elektrische Ladung',
    es: 'Carga Eléctrica', fr: 'Charge Électrique', it: 'Carica Elettrica',
    pt: 'Carga Elétrica', ru: 'Электрический Заряд', zh: '电荷', ja: '電荷', ko: '전하'
  },
  'Electric Potential': {
    en: 'Electric Potential', ar: 'الجهد الكهربائي', de: 'Elektrisches Potential',
    es: 'Potencial Eléctrico', fr: 'Potentiel Électrique', it: 'Potenziale Elettrico',
    pt: 'Potencial Elétrico', ru: 'Электрический Потенциал', zh: '电势', ja: '電位', ko: '전위'
  },
  'Capacitance': {
    en: 'Capacitance', ar: 'السعة الكهربائية', de: 'Kapazität',
    es: 'Capacitancia', fr: 'Capacité', it: 'Capacità',
    pt: 'Capacitância', ru: 'Ёмкость', zh: '电容', ja: '静電容量', ko: '전기용량'
  },
  'Resistance': {
    en: 'Resistance', ar: 'المقاومة', de: 'Widerstand',
    es: 'Resistencia', fr: 'Résistance', it: 'Resistenza',
    pt: 'Resistência', ru: 'Сопротивление', zh: '电阻', ja: '電気抵抗', ko: '저항'
  },
  'Conductance': {
    en: 'Conductance', ar: 'التوصيل', de: 'Leitwert',
    es: 'Conductancia', fr: 'Conductance', it: 'Conduttanza',
    pt: 'Condutância', ru: 'Проводимость', zh: '电导', ja: 'コンダクタンス', ko: '컨덕턴스'
  },
  'Inductance': {
    en: 'Inductance', ar: 'الحث', de: 'Induktivität',
    es: 'Inductancia', fr: 'Inductance', it: 'Induttanza',
    pt: 'Indutância', ru: 'Индуктивность', zh: '电感', ja: 'インダクタンス', ko: '인덕턴스'
  },
  'Magnetic Flux': {
    en: 'Magnetic Flux', ar: 'التدفق المغناطيسي', de: 'Magnetischer Fluss',
    es: 'Flujo Magnético', fr: 'Flux Magnétique', it: 'Flusso Magnetico',
    pt: 'Fluxo Magnético', ru: 'Магнитный Поток', zh: '磁通量', ja: '磁束', ko: '자속'
  },
  'Magnetic Density': {
    en: 'Magnetic Density', ar: 'الكثافة المغناطيسية', de: 'Magnetische Flussdichte',
    es: 'Densidad Magnética', fr: 'Densité Magnétique', it: 'Densità Magnetica',
    pt: 'Densidade Magnética', ru: 'Магнитная Индукция', zh: '磁感应强度', ja: '磁束密度', ko: '자속밀도'
  },
  'Radioactivity': {
    en: 'Radioactivity', ar: 'النشاط الإشعاعي', de: 'Radioaktivität',
    es: 'Radiactividad', fr: 'Radioactivité', it: 'Radioattività',
    pt: 'Radioatividade', ru: 'Радиоактивность', zh: '放射性', ja: '放射能', ko: '방사능'
  },
  'Radiation Dose': {
    en: 'Radiation Dose', ar: 'جرعة الإشعاع', de: 'Strahlendosis',
    es: 'Dosis de Radiación', fr: 'Dose de Rayonnement', it: 'Dose di Radiazione',
    pt: 'Dose de Radiação', ru: 'Доза Излучения', zh: '辐射剂量', ja: '放射線量', ko: '방사선량'
  },
  'Equivalent Dose': {
    en: 'Equivalent Dose', ar: 'الجرعة المكافئة', de: 'Äquivalentdosis',
    es: 'Dosis Equivalente', fr: 'Dose Équivalente', it: 'Dose Equivalente',
    pt: 'Dose Equivalente', ru: 'Эквивалентная Доза', zh: '等效剂量', ja: '等価線量', ko: '등가선량'
  },
  'Catalytic Activity': {
    en: 'Catalytic Activity', ar: 'النشاط التحفيزي', de: 'Katalytische Aktivität',
    es: 'Actividad Catalítica', fr: 'Activité Catalytique', it: 'Attività Catalitica',
    pt: 'Atividade Catalítica', ru: 'Каталитическая Активность', zh: '催化活性', ja: '触媒活性', ko: '촉매활성'
  },
  'Plane Angle': {
    en: 'Plane Angle', ar: 'الزاوية المستوية', de: 'Ebener Winkel',
    es: 'Ángulo Plano', fr: 'Angle Plan', it: 'Angolo Piano',
    pt: 'Ângulo Plano', ru: 'Плоский Угол', zh: '平面角', ja: '平面角', ko: '평면각'
  },
  'Solid Angle': {
    en: 'Solid Angle', ar: 'الزاوية الصلبة', de: 'Raumwinkel',
    es: 'Ángulo Sólido', fr: 'Angle Solide', it: 'Angolo Solido',
    pt: 'Ângulo Sólido', ru: 'Телесный Угол', zh: '立体角', ja: '立体角', ko: '입체각'
  },
  'Angular Velocity': {
    en: 'Angular Velocity', ar: 'السرعة الزاوية', de: 'Winkelgeschwindigkeit',
    es: 'Velocidad Angular', fr: 'Vitesse Angulaire', it: 'Velocità Angolare',
    pt: 'Velocidade Angular', ru: 'Угловая Скорость', zh: '角速度', ja: '角速度', ko: '각속도'
  },
  'Momentum': {
    en: 'Momentum', ar: 'الزخم', de: 'Impuls',
    es: 'Momento', fr: 'Quantité de Mouvement', it: 'Quantità di Moto',
    pt: 'Momento', ru: 'Импульс', zh: '动量', ja: '運動量', ko: '운동량'
  },
  'Luminous Flux': {
    en: 'Luminous Flux', ar: 'التدفق الضوئي', de: 'Lichtstrom',
    es: 'Flujo Luminoso', fr: 'Flux Lumineux', it: 'Flusso Luminoso',
    pt: 'Fluxo Luminoso', ru: 'Световой Поток', zh: '光通量', ja: '光束', ko: '광속'
  },
  'Illuminance': {
    en: 'Illuminance', ar: 'الإضاءة', de: 'Beleuchtungsstärke',
    es: 'Iluminancia', fr: 'Éclairement', it: 'Illuminamento',
    pt: 'Iluminância', ru: 'Освещённость', zh: '照度', ja: '照度', ko: '조도'
  },
  'Luminous Exitance': {
    en: 'Luminous Exitance', ar: 'الخروج الضوئي', de: 'Spezifische Lichtausstrahlung',
    es: 'Exitancia Luminosa', fr: 'Exitance Lumineuse', it: 'Emittanza Luminosa',
    pt: 'Exitância Luminosa', ru: 'Светимость', zh: '光出射度', ja: '光発散度', ko: '광발산도'
  },
  'Luminance': {
    en: 'Luminance', ar: 'السطوع', de: 'Leuchtdichte',
    es: 'Luminancia', fr: 'Luminance', it: 'Luminanza',
    pt: 'Luminância', ru: 'Яркость', zh: '亮度', ja: '輝度', ko: '휘도'
  },
  'Torque': {
    en: 'Torque', ar: 'عزم الدوران', de: 'Drehmoment',
    es: 'Torque', fr: 'Couple', it: 'Coppia',
    pt: 'Torque', ru: 'Крутящий Момент', zh: '扭矩', ja: 'トルク', ko: '토크'
  },
  'Density': {
    en: 'Density', ar: 'الكثافة', de: 'Dichte',
    es: 'Densidad', fr: 'Densité', it: 'Densità',
    pt: 'Densidade', ru: 'Плотность', zh: '密度', ja: '密度', ko: '밀도'
  },
  'Flow Rate': {
    en: 'Flow Rate', ar: 'معدل التدفق', de: 'Durchflussrate',
    es: 'Caudal', fr: 'Débit', it: 'Portata',
    pt: 'Taxa de Fluxo', ru: 'Расход', zh: '流量', ja: '流量', ko: '유량'
  },
  'Dynamic Viscosity': {
    en: 'Dynamic Viscosity', ar: 'اللزوجة الديناميكية', de: 'Dynamische Viskosität',
    es: 'Viscosidad Dinámica', fr: 'Viscosité Dynamique', it: 'Viscosità Dinamica',
    pt: 'Viscosidade Dinâmica', ru: 'Динамическая Вязкость', zh: '动力粘度', ja: '動粘度', ko: '동점도'
  },
  'Kinematic Viscosity': {
    en: 'Kinematic Viscosity', ar: 'اللزوجة الحركية', de: 'Kinematische Viskosität',
    es: 'Viscosidad Cinemática', fr: 'Viscosité Cinématique', it: 'Viscosità Cinematica',
    pt: 'Viscosidade Cinemática', ru: 'Кинематическая Вязкость', zh: '运动粘度', ja: '動粘性係数', ko: '운동점도'
  },
  'Surface Tension': {
    en: 'Surface Tension', ar: 'التوتر السطحي', de: 'Oberflächenspannung',
    es: 'Tensión Superficial', fr: 'Tension Superficielle', it: 'Tensione Superficiale',
    pt: 'Tensão Superficial', ru: 'Поверхностное Натяжение', zh: '表面张力', ja: '表面張力', ko: '표면장력'
  },
  'Thermal Conductivity': {
    en: 'Thermal Conductivity', ar: 'التوصيل الحراري', de: 'Wärmeleitfähigkeit',
    es: 'Conductividad Térmica', fr: 'Conductivité Thermique', it: 'Conduttività Termica',
    pt: 'Condutividade Térmica', ru: 'Теплопроводность', zh: '热导率', ja: '熱伝導率', ko: '열전도율'
  },
  'Specific Heat': {
    en: 'Specific Heat', ar: 'الحرارة النوعية', de: 'Spezifische Wärme',
    es: 'Calor Específico', fr: 'Chaleur Spécifique', it: 'Calore Specifico',
    pt: 'Calor Específico', ru: 'Удельная Теплоёмкость', zh: '比热容', ja: '比熱', ko: '비열'
  },
  'Entropy': {
    en: 'Entropy', ar: 'الإنتروبيا', de: 'Entropie',
    es: 'Entropía', fr: 'Entropie', it: 'Entropia',
    pt: 'Entropia', ru: 'Энтропия', zh: '熵', ja: 'エントロピー', ko: '엔트로피'
  },
  'Concentration': {
    en: 'Concentration', ar: 'التركيز', de: 'Konzentration',
    es: 'Concentración', fr: 'Concentration', it: 'Concentrazione',
    pt: 'Concentração', ru: 'Концентрация', zh: '浓度', ja: '濃度', ko: '농도'
  },
  'Data': {
    en: 'Data', ar: 'البيانات', de: 'Daten',
    es: 'Datos', fr: 'Données', it: 'Dati',
    pt: 'Dados', ru: 'Данные', zh: '数据', ja: 'データ', ko: '데이터'
  },
  'Rack Geometry': {
    en: 'Rack Geometry', ar: 'هندسة الرف', de: 'Rack-Geometrie',
    es: 'Geometría de Rack', fr: 'Géométrie de Rack', it: 'Geometria Rack',
    pt: 'Geometria de Rack', ru: 'Геометрия Стойки', zh: '机架几何', ja: 'ラック寸法', ko: '랙 지오메트리'
  },
  'Shipping': {
    en: 'Shipping', ar: 'الشحن', de: 'Versand',
    es: 'Envío', fr: 'Expédition', it: 'Spedizione',
    pt: 'Envio', ru: 'Доставка', zh: '运输', ja: '配送', ko: '배송'
  },
  'Math': {
    en: 'Math', ar: 'الرياضيات', de: 'Mathematik',
    es: 'Matemáticas', fr: 'Mathématiques', it: 'Matematica',
    pt: 'Matemática', ru: 'Математика', zh: '数学', ja: '数学', ko: '수학'
  },
  'Beer & Wine Volume': {
    en: 'Beer & Wine Volume', ar: 'حجم البيرة والنبيذ', de: 'Bier & Wein Volumen',
    es: 'Volumen de Cerveza y Vino', fr: 'Volume de Bière et Vin', it: 'Volume Birra e Vino',
    pt: 'Volume de Cerveja e Vinho', ru: 'Объём Пива и Вина', zh: '啤酒和葡萄酒容量', ja: 'ビール・ワイン容量', ko: '맥주와 와인 용량'
  },
  'Fuel Energy': {
    en: 'Fuel Energy', ar: 'طاقة الوقود', de: 'Brennstoffenergie',
    es: 'Energía de Combustible', fr: 'Énergie de Carburant', it: 'Energia Combustibile',
    pt: 'Energia de Combustível', ru: 'Энергия Топлива', zh: '燃料能量', ja: '燃料エネルギー', ko: '연료 에너지'
  },
  'Fuel Economy': {
    en: 'Fuel Economy', ar: 'استهلاك الوقود', de: 'Kraftstoffverbrauch',
    es: 'Economía de Combustible', fr: 'Économie de Carburant', it: 'Economia di Carburante',
    pt: 'Economia de Combustível', ru: 'Расход Топлива', zh: '燃油经济性', ja: '燃費', ko: '연비'
  },
  'Typography': {
    en: 'Typography', ar: 'الطباعة', de: 'Typografie',
    es: 'Tipografía', fr: 'Typographie', it: 'Tipografia',
    pt: 'Tipografia', ru: 'Типографика', zh: '字体排印', ja: 'タイポグラフィ', ko: '타이포그래피'
  },
  'Cooking Measures': {
    en: 'Cooking Measures', ar: 'مقاييس الطهي', de: 'Kochmaße',
    es: 'Medidas de Cocina', fr: 'Mesures de Cuisine', it: 'Misure di Cucina',
    pt: 'Medidas de Cozinha', ru: 'Кулинарные Меры', zh: '烹饪量度', ja: '料理用計量', ko: '요리 계량'
  },
  'Archaic Length': {
    en: 'Archaic Length', ar: 'الأطوال القديمة', de: 'Archaische Längen',
    es: 'Longitud Arcaica', fr: 'Longueur Archaïque', it: 'Lunghezza Arcaica',
    pt: 'Comprimento Arcaico', ru: 'Архаичные Длины', zh: '古代长度', ja: '古代の長さ', ko: '고대 길이'
  },
  'Archaic Mass': {
    en: 'Archaic Mass', ar: 'الأوزان القديمة', de: 'Archaische Masse',
    es: 'Masa Arcaica', fr: 'Masse Archaïque', it: 'Massa Arcaica',
    pt: 'Massa Arcaica', ru: 'Архаичные Массы', zh: '古代质量', ja: '古代の質量', ko: '고대 질량'
  },
  'Archaic Volume': {
    en: 'Archaic Volume', ar: 'الأحجام القديمة', de: 'Archaisches Volumen',
    es: 'Volumen Arcaico', fr: 'Volume Archaïque', it: 'Volume Arcaico',
    pt: 'Volume Arcaico', ru: 'Архаичные Объёмы', zh: '古代容量', ja: '古代の容積', ko: '고대 부피'
  },
  'Archaic Area': {
    en: 'Archaic Area', ar: 'المساحات القديمة', de: 'Archaische Flächen',
    es: 'Área Arcaica', fr: 'Surface Archaïque', it: 'Area Arcaica',
    pt: 'Área Arcaica', ru: 'Архаичные Площади', zh: '古代面积', ja: '古代の面積', ko: '고대 면적'
  },
  'Archaic Energy': {
    en: 'Archaic Energy', ar: 'الطاقة القديمة', de: 'Archaische Energie',
    es: 'Energía Arcaica', fr: 'Énergie Archaïque', it: 'Energia Arcaica',
    pt: 'Energia Arcaica', ru: 'Архаичная Энергия', zh: '古代能量', ja: '古代のエネルギー', ko: '고대 에너지'
  },
  'Archaic Power': {
    en: 'Archaic Power', ar: 'القدرة القديمة', de: 'Archaische Leistung',
    es: 'Potencia Arcaica', fr: 'Puissance Archaïque', it: 'Potenza Arcaica',
    pt: 'Potência Arcaica', ru: 'Архаичная Мощность', zh: '古代功率', ja: '古代の仕事率', ko: '고대 일률'
  },
};

export const UNIT_NAME_TRANSLATIONS: Record<string, Translation> = {
  'Meter': { 
    en: 'Meter', ar: 'متر', de: 'Meter',
    es: 'Metro', fr: 'Mètre', it: 'Metro',
    pt: 'Metro', ru: 'Метр', zh: '米', ja: 'メートル', ko: '미터'
  },
  'Kilogram': { 
    en: 'Kilogram', ar: 'كيلوغرام', de: 'Kilogramm',
    es: 'Kilogramo', fr: 'Kilogramme', it: 'Chilogrammo',
    pt: 'Quilograma', ru: 'Килограмм', zh: '千克', ja: 'キログラム', ko: '킬로그램'
  },
  'Gram': { 
    en: 'Gram', ar: 'غرام', de: 'Gramm',
    es: 'Gramo', fr: 'Gramme', it: 'Grammo',
    pt: 'Grama', ru: 'Грамм', zh: '克', ja: 'グラム', ko: '그램'
  },
  'Second': { 
    en: 'Second', ar: 'ثانية', de: 'Sekunde',
    es: 'Segundo', fr: 'Seconde', it: 'Secondo',
    pt: 'Segundo', ru: 'Секунда', zh: '秒', ja: '秒', ko: '초'
  },
  'Minute': { 
    en: 'Minute', ar: 'دقيقة', de: 'Minute',
    es: 'Minuto', fr: 'Minute', it: 'Minuto',
    pt: 'Minuto', ru: 'Минута', zh: '分', ja: '分', ko: '분'
  },
  'Hour': { 
    en: 'Hour', ar: 'ساعة', de: 'Stunde',
    es: 'Hora', fr: 'Heure', it: 'Ora',
    pt: 'Hora', ru: 'Час', zh: '时', ja: '時間', ko: '시간'
  },
  'Day': { 
    en: 'Day', ar: 'يوم', de: 'Tag',
    es: 'Día', fr: 'Jour', it: 'Giorno',
    pt: 'Dia', ru: 'День', zh: '天', ja: '日', ko: '일'
  },
  'Week': { 
    en: 'Week', ar: 'أسبوع', de: 'Woche',
    es: 'Semana', fr: 'Semaine', it: 'Settimana',
    pt: 'Semana', ru: 'Неделя', zh: '周', ja: '週', ko: '주'
  },
  'Year': { 
    en: 'Year', ar: 'سنة', de: 'Jahr',
    es: 'Año', fr: 'Année', it: 'Anno',
    pt: 'Ano', ru: 'Год', zh: '年', ja: '年', ko: '년'
  },
  'Ampere': { 
    en: 'Ampere', ar: 'أمبير', de: 'Ampere',
    es: 'Amperio', fr: 'Ampère', it: 'Ampere',
    pt: 'Ampere', ru: 'Ампер', zh: '安培', ja: 'アンペア', ko: '암페어'
  },
  'Newton': { 
    en: 'Newton', ar: 'نيوتن', de: 'Newton',
    es: 'Newton', fr: 'Newton', it: 'Newton',
    pt: 'Newton', ru: 'Ньютон', zh: '牛顿', ja: 'ニュートン', ko: '뉴턴'
  },
  'Joule': { 
    en: 'Joule', ar: 'جول', de: 'Joule',
    es: 'Julio', fr: 'Joule', it: 'Joule',
    pt: 'Joule', ru: 'Джоуль', zh: '焦耳', ja: 'ジュール', ko: '줄'
  },
  'Watt': { 
    en: 'Watt', ar: 'واط', de: 'Watt',
    es: 'Vatio', fr: 'Watt', it: 'Watt',
    pt: 'Watt', ru: 'Ватт', zh: '瓦特', ja: 'ワット', ko: '와트'
  },
  'Hertz': { 
    en: 'Hertz', ar: 'هرتز', de: 'Hertz',
    es: 'Hercio', fr: 'Hertz', it: 'Hertz',
    pt: 'Hertz', ru: 'Герц', zh: '赫兹', ja: 'ヘルツ', ko: '헤르츠'
  },
  'Pascal': { 
    en: 'Pascal', ar: 'باسكال', de: 'Pascal',
    es: 'Pascal', fr: 'Pascal', it: 'Pascal',
    pt: 'Pascal', ru: 'Паскаль', zh: '帕斯卡', ja: 'パスカル', ko: '파스칼'
  },
  'Coulomb': { 
    en: 'Coulomb', ar: 'كولوم', de: 'Coulomb',
    es: 'Culombio', fr: 'Coulomb', it: 'Coulomb',
    pt: 'Coulomb', ru: 'Кулон', zh: '库仑', ja: 'クーロン', ko: '쿨롱'
  },
  'Volt': { 
    en: 'Volt', ar: 'فولت', de: 'Volt',
    es: 'Voltio', fr: 'Volt', it: 'Volt',
    pt: 'Volt', ru: 'Вольт', zh: '伏特', ja: 'ボルト', ko: '볼트'
  },
  'Farad': { 
    en: 'Farad', ar: 'فاراد', de: 'Farad',
    es: 'Faradio', fr: 'Farad', it: 'Farad',
    pt: 'Farad', ru: 'Фарад', zh: '法拉', ja: 'ファラド', ko: '패럿'
  },
  'Ohm': { 
    en: 'Ohm', ar: 'أوم', de: 'Ohm',
    es: 'Ohmio', fr: 'Ohm', it: 'Ohm',
    pt: 'Ohm', ru: 'Ом', zh: '欧姆', ja: 'オーム', ko: '옴'
  },
  'Siemens': { 
    en: 'Siemens', ar: 'سيمنز', de: 'Siemens',
    es: 'Siemens', fr: 'Siemens', it: 'Siemens',
    pt: 'Siemens', ru: 'Сименс', zh: '西门子', ja: 'ジーメンス', ko: '지멘스'
  },
  'Henry': { 
    en: 'Henry', ar: 'هنري', de: 'Henry',
    es: 'Henrio', fr: 'Henry', it: 'Henry',
    pt: 'Henry', ru: 'Генри', zh: '亨利', ja: 'ヘンリー', ko: '헨리'
  },
  'Weber': { 
    en: 'Weber', ar: 'ويبر', de: 'Weber',
    es: 'Weber', fr: 'Weber', it: 'Weber',
    pt: 'Weber', ru: 'Вебер', zh: '韦伯', ja: 'ウェーバ', ko: '웨버'
  },
  'Tesla': { 
    en: 'Tesla', ar: 'تسلا', de: 'Tesla',
    es: 'Tesla', fr: 'Tesla', it: 'Tesla',
    pt: 'Tesla', ru: 'Тесла', zh: '特斯拉', ja: 'テスラ', ko: '테슬라'
  },
  'Lumen': { 
    en: 'Lumen', ar: 'لومن', de: 'Lumen',
    es: 'Lumen', fr: 'Lumen', it: 'Lumen',
    pt: 'Lúmen', ru: 'Люмен', zh: '流明', ja: 'ルーメン', ko: '루멘'
  },
  'Lux': { 
    en: 'Lux', ar: 'لوكس', de: 'Lux',
    es: 'Lux', fr: 'Lux', it: 'Lux',
    pt: 'Lux', ru: 'Люкс', zh: '勒克斯', ja: 'ルクス', ko: '럭스'
  },
  'Candela': { 
    en: 'Candela', ar: 'شمعة', de: 'Candela',
    es: 'Candela', fr: 'Candela', it: 'Candela',
    pt: 'Candela', ru: 'Кандела', zh: '坎德拉', ja: 'カンデラ', ko: '칸델라'
  },
  'Mole': { 
    en: 'Mole', ar: 'مول', de: 'Mol',
    es: 'Mol', fr: 'Mole', it: 'Mole',
    pt: 'Mol', ru: 'Моль', zh: '摩尔', ja: 'モル', ko: '몰'
  },
  'Becquerel': { 
    en: 'Becquerel', ar: 'بيكريل', de: 'Becquerel',
    es: 'Becquerel', fr: 'Becquerel', it: 'Becquerel',
    pt: 'Becquerel', ru: 'Беккерель', zh: '贝克勒尔', ja: 'ベクレル', ko: '베크렐'
  },
  'Gray': { 
    en: 'Gray', ar: 'غراي', de: 'Gray',
    es: 'Gray', fr: 'Gray', it: 'Gray',
    pt: 'Gray', ru: 'Грей', zh: '戈瑞', ja: 'グレイ', ko: '그레이'
  },
  'Sievert': { 
    en: 'Sievert', ar: 'سيفرت', de: 'Sievert',
    es: 'Sievert', fr: 'Sievert', it: 'Sievert',
    pt: 'Sievert', ru: 'Зиверт', zh: '希沃特', ja: 'シーベルト', ko: '시버트'
  },
  'Radian': { 
    en: 'Radian', ar: 'راديان', de: 'Radiant',
    es: 'Radián', fr: 'Radian', it: 'Radiante',
    pt: 'Radiano', ru: 'Радиан', zh: '弧度', ja: 'ラジアン', ko: '라디안'
  },
  'Degree': { 
    en: 'Degree', ar: 'درجة', de: 'Grad',
    es: 'Grado', fr: 'Degré', it: 'Grado',
    pt: 'Grau', ru: 'Градус', zh: '度', ja: '度', ko: '도'
  },
  'Steradian': { 
    en: 'Steradian', ar: 'ستيراديان', de: 'Steradiant',
    es: 'Estereorradián', fr: 'Stéradian', it: 'Steradiante',
    pt: 'Esferorradiano', ru: 'Стерадиан', zh: '球面度', ja: 'ステラジアン', ko: '스테라디안'
  },
  'Kelvin': { 
    en: 'Kelvin', ar: 'كلفن', de: 'Kelvin',
    es: 'Kelvin', fr: 'Kelvin', it: 'Kelvin',
    pt: 'Kelvin', ru: 'Кельвин', zh: '开尔文', ja: 'ケルビン', ko: '켈빈'
  },
  'Celsius': { 
    en: 'Celsius', ar: 'مئوية', de: 'Celsius',
    es: 'Celsius', fr: 'Celsius', it: 'Celsius',
    pt: 'Celsius', ru: 'Цельсий', zh: '摄氏度', ja: '摂氏', ko: '섭씨'
  },
  'Fahrenheit': { 
    en: 'Fahrenheit', ar: 'فهرنهايت', de: 'Fahrenheit',
    es: 'Fahrenheit', fr: 'Fahrenheit', it: 'Fahrenheit',
    pt: 'Fahrenheit', ru: 'Фаренгейт', zh: '华氏度', ja: '華氏', ko: '화씨'
  },
  'Litre': { 
    en: 'Litre', ar: 'لتر', de: 'Liter',
    es: 'Litro', fr: 'Litre', it: 'Litro',
    pt: 'Litro', ru: 'Литр', zh: '升', ja: 'リットル', ko: '리터'
  },
  'Square Metre': { 
    en: 'Square Metre', ar: 'متر مربع', de: 'Quadratmeter',
    es: 'Metro Cuadrado', fr: 'Mètre Carré', it: 'Metro Quadrato',
    pt: 'Metro Quadrado', ru: 'Квадратный Метр', zh: '平方米', ja: '平方メートル', ko: '제곱미터'
  },
  'Cubic Metre': { 
    en: 'Cubic Metre', ar: 'متر مكعب', de: 'Kubikmeter',
    es: 'Metro Cúbico', fr: 'Mètre Cube', it: 'Metro Cubo',
    pt: 'Metro Cúbico', ru: 'Кубический Метр', zh: '立方米', ja: '立方メートル', ko: '세제곱미터'
  },
  'Hectare': { 
    en: 'Hectare', ar: 'هكتار', de: 'Hektar',
    es: 'Hectárea', fr: 'Hectare', it: 'Ettaro',
    pt: 'Hectare', ru: 'Гектар', zh: '公顷', ja: 'ヘクタール', ko: '헥타르'
  },
  'Inch': { 
    en: 'Inch', ar: 'بوصة', de: 'Zoll',
    es: 'Pulgada', fr: 'Pouce', it: 'Pollice',
    pt: 'Polegada', ru: 'Дюйм', zh: '英寸', ja: 'インチ', ko: '인치'
  },
  'Foot': { 
    en: 'Foot', ar: 'قدم', de: 'Fuß',
    es: 'Pie', fr: 'Pied', it: 'Piede',
    pt: 'Pé', ru: 'Фут', zh: '英尺', ja: 'フィート', ko: '피트'
  },
  'Yard': { 
    en: 'Yard', ar: 'ياردة', de: 'Yard',
    es: 'Yarda', fr: 'Yard', it: 'Iarda',
    pt: 'Jarda', ru: 'Ярд', zh: '码', ja: 'ヤード', ko: '야드'
  },
  'Mile': { 
    en: 'Mile', ar: 'ميل', de: 'Meile',
    es: 'Milla', fr: 'Mile', it: 'Miglio',
    pt: 'Milha', ru: 'Миля', zh: '英里', ja: 'マイル', ko: '마일'
  },
  'Ounce': { 
    en: 'Ounce', ar: 'أونصة', de: 'Unze',
    es: 'Onza', fr: 'Once', it: 'Oncia',
    pt: 'Onça', ru: 'Унция', zh: '盎司', ja: 'オンス', ko: '온스'
  },
  'Pound': { 
    en: 'Pound', ar: 'رطل', de: 'Pfund',
    es: 'Libra', fr: 'Livre', it: 'Libbra',
    pt: 'Libra', ru: 'Фунт', zh: '磅', ja: 'ポンド', ko: '파운드'
  },
  'Ton': { 
    en: 'Ton', ar: 'طن', de: 'Tonne',
    es: 'Tonelada', fr: 'Tonne', it: 'Tonnellata',
    pt: 'Tonelada', ru: 'Тонна', zh: '吨', ja: 'トン', ko: '톤'
  },
  'Gallon': { 
    en: 'Gallon', ar: 'جالون', de: 'Gallone',
    es: 'Galón', fr: 'Gallon', it: 'Gallone',
    pt: 'Galão', ru: 'Галлон', zh: '加仑', ja: 'ガロン', ko: '갤런'
  },
  'Pint': { 
    en: 'Pint', ar: 'باينت', de: 'Pinte',
    es: 'Pinta', fr: 'Pinte', it: 'Pinta',
    pt: 'Pinta', ru: 'Пинта', zh: '品脱', ja: 'パイント', ko: '파인트'
  },
  'Cup': { 
    en: 'Cup', ar: 'كوب', de: 'Tasse',
    es: 'Taza', fr: 'Tasse', it: 'Tazza',
    pt: 'Xícara', ru: 'Чашка', zh: '杯', ja: 'カップ', ko: '컵'
  },
  'Tablespoon': { 
    en: 'Tablespoon', ar: 'ملعقة كبيرة', de: 'Esslöffel',
    es: 'Cucharada', fr: 'Cuillère à Soupe', it: 'Cucchiaio',
    pt: 'Colher de Sopa', ru: 'Столовая Ложка', zh: '汤匙', ja: '大さじ', ko: '큰술'
  },
  'Teaspoon': { 
    en: 'Teaspoon', ar: 'ملعقة صغيرة', de: 'Teelöffel',
    es: 'Cucharadita', fr: 'Cuillère à Café', it: 'Cucchiaino',
    pt: 'Colher de Chá', ru: 'Чайная Ложка', zh: '茶匙', ja: '小さじ', ko: '작은술'
  },
  'Calorie': { 
    en: 'Calorie', ar: 'سعرة حرارية', de: 'Kalorie',
    es: 'Caloría', fr: 'Calorie', it: 'Caloria',
    pt: 'Caloria', ru: 'Калория', zh: '卡路里', ja: 'カロリー', ko: '칼로리'
  },
  'Kilocalorie': { 
    en: 'Kilocalorie', ar: 'كيلوسعرة', de: 'Kilokalorie',
    es: 'Kilocaloría', fr: 'Kilocalorie', it: 'Chilocaloria',
    pt: 'Quilocaloria', ru: 'Килокалория', zh: '千卡', ja: 'キロカロリー', ko: '킬로칼로리'
  },
  'Horsepower': { 
    en: 'Horsepower', ar: 'حصان', de: 'Pferdestärke',
    es: 'Caballo de Fuerza', fr: 'Cheval-vapeur', it: 'Cavallo Vapore',
    pt: 'Cavalo-vapor', ru: 'Лошадиная Сила', zh: '马力', ja: '馬力', ko: '마력'
  },
  'Bar': { 
    en: 'Bar', ar: 'بار', de: 'Bar',
    es: 'Bar', fr: 'Bar', it: 'Bar',
    pt: 'Bar', ru: 'Бар', zh: '巴', ja: 'バール', ko: '바'
  },
  'Atmosphere': { 
    en: 'Atmosphere', ar: 'جو', de: 'Atmosphäre',
    es: 'Atmósfera', fr: 'Atmosphère', it: 'Atmosfera',
    pt: 'Atmosfera', ru: 'Атмосфера', zh: '大气压', ja: '気圧', ko: '기압'
  },
  'Knot': { 
    en: 'Knot', ar: 'عقدة', de: 'Knoten',
    es: 'Nudo', fr: 'Nœud', it: 'Nodo',
    pt: 'Nó', ru: 'Узел', zh: '节', ja: 'ノット', ko: '노트'
  },
  'Byte': { 
    en: 'Byte', ar: 'بايت', de: 'Byte',
    es: 'Byte', fr: 'Octet', it: 'Byte',
    pt: 'Byte', ru: 'Байт', zh: '字节', ja: 'バイト', ko: '바이트'
  },
  'Bit': { 
    en: 'Bit', ar: 'بت', de: 'Bit',
    es: 'Bit', fr: 'Bit', it: 'Bit',
    pt: 'Bit', ru: 'Бит', zh: '比特', ja: 'ビット', ko: '비트'
  },
  'Sun (Japan)': { 
    en: 'Sun (Japan)', ar: 'سون (اليابان)', de: 'Sun (Japan)',
    es: 'Sun (Japón)', fr: 'Sun (Japon)', it: 'Sun (Giappone)',
    pt: 'Sun (Japão)', ru: 'Сун (Япония)', zh: '寸（日本）', ja: '寸', ko: '촌 (일본)'
  },
  'Shaku (Japan)': { 
    en: 'Shaku (Japan)', ar: 'شاكو (اليابان)', de: 'Shaku (Japan)',
    es: 'Shaku (Japón)', fr: 'Shaku (Japon)', it: 'Shaku (Giappone)',
    pt: 'Shaku (Japão)', ru: 'Сяку (Япония)', zh: '尺（日本）', ja: '尺', ko: '자 (일본)'
  },
  'Ken (Japan)': { 
    en: 'Ken (Japan)', ar: 'كين (اليابان)', de: 'Ken (Japan)',
    es: 'Ken (Japón)', fr: 'Ken (Japon)', it: 'Ken (Giappone)',
    pt: 'Ken (Japão)', ru: 'Кэн (Япония)', zh: '间（日本）', ja: '間', ko: '간 (일본)'
  },
  'Jō (Japan)': { 
    en: 'Jō (Japan)', ar: 'جو (اليابان)', de: 'Jō (Japan)',
    es: 'Jō (Japón)', fr: 'Jō (Japon)', it: 'Jō (Giappone)',
    pt: 'Jō (Japão)', ru: 'Дзё (Япония)', zh: '丈（日本）', ja: '丈', ko: '장 (일본)'
  },
  'Ri (Japan)': { 
    en: 'Ri (Japan)', ar: 'ري (اليابان)', de: 'Ri (Japan)',
    es: 'Ri (Japón)', fr: 'Ri (Japon)', it: 'Ri (Giappone)',
    pt: 'Ri (Japão)', ru: 'Ри (Япония)', zh: '里（日本）', ja: '里', ko: '리 (일본)'
  },
  'Fun (Japan)': { 
    en: 'Fun (Japan)', ar: 'فن (اليابان)', de: 'Fun (Japan)',
    es: 'Fun (Japón)', fr: 'Fun (Japon)', it: 'Fun (Giappone)',
    pt: 'Fun (Japão)', ru: 'Фун (Япония)', zh: '分（日本）', ja: '分', ko: '푼 (일본)'
  },
  'Momme (Japan)': { 
    en: 'Momme (Japan)', ar: 'مومي (اليابان)', de: 'Momme (Japan)',
    es: 'Momme (Japón)', fr: 'Momme (Japon)', it: 'Momme (Giappone)',
    pt: 'Momme (Japão)', ru: 'Моммэ (Япония)', zh: '匁（日本）', ja: '匁', ko: '몸메 (일본)'
  },
  'Ryō (Japan)': { 
    en: 'Ryō (Japan)', ar: 'ريو (اليابان)', de: 'Ryō (Japan)',
    es: 'Ryō (Japón)', fr: 'Ryō (Japon)', it: 'Ryō (Giappone)',
    pt: 'Ryō (Japão)', ru: 'Рё (Япония)', zh: '两（日本）', ja: '両', ko: '료 (일본)'
  },
  'Kan (Japan)': { 
    en: 'Kan (Japan)', ar: 'كان (اليابان)', de: 'Kan (Japan)',
    es: 'Kan (Japón)', fr: 'Kan (Japon)', it: 'Kan (Giappone)',
    pt: 'Kan (Japão)', ru: 'Кан (Япония)', zh: '贯（日本）', ja: '貫', ko: '관 (일본)'
  },
  'Go (Japan)': { 
    en: 'Go (Japan)', ar: 'غو (اليابان)', de: 'Go (Japan)',
    es: 'Go (Japón)', fr: 'Go (Japon)', it: 'Go (Giappone)',
    pt: 'Go (Japão)', ru: 'Го (Япония)', zh: '合（日本）', ja: '合', ko: '합 (일본)'
  },
  'Sho (Japan)': { 
    en: 'Shō (Japan)', ar: 'شو (اليابان)', de: 'Shō (Japan)',
    es: 'Shō (Japón)', fr: 'Shō (Japon)', it: 'Shō (Giappone)',
    pt: 'Shō (Japão)', ru: 'Сё (Япония)', zh: '升（日本）', ja: '升', ko: '승 (일본)'
  },
  'To (Japan)': { 
    en: 'To (Japan)', ar: 'تو (اليابان)', de: 'To (Japan)',
    es: 'To (Japón)', fr: 'To (Japon)', it: 'To (Giappone)',
    pt: 'To (Japão)', ru: 'То (Япония)', zh: '斗（日本）', ja: '斗', ko: '두 (일본)'
  },
  'Koku (Japan)': { 
    en: 'Koku (Japan)', ar: 'كوكو (اليابان)', de: 'Koku (Japan)',
    es: 'Koku (Japón)', fr: 'Koku (Japon)', it: 'Koku (Giappone)',
    pt: 'Koku (Japão)', ru: 'Коку (Япония)', zh: '石（日本）', ja: '石', ko: '석 (일본)'
  },
  'Tsubo (Japan)': { 
    en: 'Tsubo (Japan)', ar: 'تسوبو (اليابان)', de: 'Tsubo (Japan)',
    es: 'Tsubo (Japón)', fr: 'Tsubo (Japon)', it: 'Tsubo (Giappone)',
    pt: 'Tsubo (Japão)', ru: 'Цубо (Япония)', zh: '坪（日本）', ja: '坪', ko: '평 (일본)'
  },
  'Tan (Japan)': { 
    en: 'Tan (Japan)', ar: 'تان (اليابان)', de: 'Tan (Japan)',
    es: 'Tan (Japón)', fr: 'Tan (Japon)', it: 'Tan (Giappone)',
    pt: 'Tan (Japão)', ru: 'Тан (Япония)', zh: '反（日本）', ja: '反', ko: '단 (일본)'
  },
  'Chō (Japan)': { 
    en: 'Chō (Japan)', ar: 'تشو (اليابان)', de: 'Chō (Japan)',
    es: 'Chō (Japón)', fr: 'Chō (Japon)', it: 'Chō (Giappone)',
    pt: 'Chō (Japão)', ru: 'Тё (Япония)', zh: '町（日本）', ja: '町', ko: '정 (일본)'
  },
  'Jō/Tatami (Japan)': { 
    en: 'Jō/Tatami (Japan)', ar: 'تاتامي (اليابان)', de: 'Tatami (Japan)',
    es: 'Tatami (Japón)', fr: 'Tatami (Japon)', it: 'Tatami (Giappone)',
    pt: 'Tatami (Japão)', ru: 'Татами (Япония)', zh: '畳（日本）', ja: '畳', ko: '다다미 (일본)'
  },
  'Danchi-ma (Japan)': { 
    en: 'Danchi-ma (Japan)', ar: 'دانتشي-ما (اليابان)', de: 'Danchi-ma (Japan)',
    es: 'Danchi-ma (Japón)', fr: 'Danchi-ma (Japon)', it: 'Danchi-ma (Giappone)',
    pt: 'Danchi-ma (Japão)', ru: 'Данти-ма (Япония)', zh: '团地间（日本）', ja: '団地間', ko: '단치마 (일본)'
  },
  'Edoma/Kantō-ma (Japan)': { 
    en: 'Edoma/Kantō-ma (Japan)', ar: 'إيدوما (اليابان)', de: 'Edoma (Japan)',
    es: 'Edoma (Japón)', fr: 'Edoma (Japon)', it: 'Edoma (Giappone)',
    pt: 'Edoma (Japão)', ru: 'Эдома (Япония)', zh: '江户间（日本）', ja: '江戸間', ko: '에도마 (일본)'
  },
  'Chūkyō-ma (Japan)': { 
    en: 'Chūkyō-ma (Japan)', ar: 'تشوكيو-ما (اليابان)', de: 'Chūkyō-ma (Japan)',
    es: 'Chūkyō-ma (Japón)', fr: 'Chūkyō-ma (Japon)', it: 'Chūkyō-ma (Giappone)',
    pt: 'Chūkyō-ma (Japão)', ru: 'Тюкё-ма (Япония)', zh: '中京间（日本）', ja: '中京間', ko: '추쿄마 (일본)'
  },
  'Kyōma (Japan)': { 
    en: 'Kyōma (Japan)', ar: 'كيوما (اليابان)', de: 'Kyōma (Japan)',
    es: 'Kyōma (Japón)', fr: 'Kyōma (Japon)', it: 'Kyōma (Giappone)',
    pt: 'Kyōma (Japão)', ru: 'Кёма (Япония)', zh: '京间（日本）', ja: '京間', ko: '교마 (일본)'
  },
  'Cun (China)': { 
    en: 'Cun (China)', ar: 'تسون (الصين)', de: 'Cun (China)',
    es: 'Cun (China)', fr: 'Cun (Chine)', it: 'Cun (Cina)',
    pt: 'Cun (China)', ru: 'Цунь (Китай)', zh: '寸', ja: '寸（中国）', ko: '촌 (중국)'
  },
  'Chi (China)': { 
    en: 'Chi (China)', ar: 'تشي (الصين)', de: 'Chi (China)',
    es: 'Chi (China)', fr: 'Chi (Chine)', it: 'Chi (Cina)',
    pt: 'Chi (China)', ru: 'Чи (Китай)', zh: '尺', ja: '尺（中国）', ko: '척 (중국)'
  },
  'Zhang (China)': { 
    en: 'Zhang (China)', ar: 'تشانغ (الصين)', de: 'Zhang (China)',
    es: 'Zhang (China)', fr: 'Zhang (Chine)', it: 'Zhang (Cina)',
    pt: 'Zhang (China)', ru: 'Чжан (Китай)', zh: '丈', ja: '丈（中国）', ko: '장 (중국)'
  },
  'Li (China)': { 
    en: 'Li (China)', ar: 'لي (الصين)', de: 'Li (China)',
    es: 'Li (China)', fr: 'Li (Chine)', it: 'Li (Cina)',
    pt: 'Li (China)', ru: 'Ли (Китай)', zh: '里', ja: '里（中国）', ko: '리 (중국)'
  },
  'Mace (China, PRC)': { 
    en: 'Mace (China, PRC)', ar: 'ميس (الصين)', de: 'Mace (China)',
    es: 'Mace (China)', fr: 'Mace (Chine)', it: 'Mace (Cina)',
    pt: 'Mace (China)', ru: 'Мэйс (Китай)', zh: '钱', ja: '銭（中国）', ko: '전 (중국)'
  },
  'Tael (China, PRC)': { 
    en: 'Tael (China, PRC)', ar: 'تايل (الصين)', de: 'Tael (China)',
    es: 'Tael (China)', fr: 'Tael (Chine)', it: 'Tael (Cina)',
    pt: 'Tael (China)', ru: 'Лян (Китай)', zh: '两', ja: '両（中国）', ko: '냥 (중국)'
  },
  'Jin (China, PRC)': { 
    en: 'Jin (China, PRC)', ar: 'جين (الصين)', de: 'Jin (China)',
    es: 'Jin (China)', fr: 'Jin (Chine)', it: 'Jin (Cina)',
    pt: 'Jin (China)', ru: 'Цзинь (Китай)', zh: '斤', ja: '斤（中国）', ko: '근 (중국)'
  },
  'Dan (China, PRC)': { 
    en: 'Dan (China, PRC)', ar: 'دان (الصين)', de: 'Dan (China)',
    es: 'Dan (China)', fr: 'Dan (Chine)', it: 'Dan (Cina)',
    pt: 'Dan (China)', ru: 'Дань (Китай)', zh: '担', ja: '担（中国）', ko: '담 (중국)'
  },
  'Sheng (China)': { 
    en: 'Sheng (China)', ar: 'شينغ (الصين)', de: 'Sheng (China)',
    es: 'Sheng (China)', fr: 'Sheng (Chine)', it: 'Sheng (Cina)',
    pt: 'Sheng (China)', ru: 'Шэн (Китай)', zh: '升', ja: '升（中国）', ko: '승 (중국)'
  },
  'Dou (China)': { 
    en: 'Dou (China)', ar: 'دو (الصين)', de: 'Dou (China)',
    es: 'Dou (China)', fr: 'Dou (Chine)', it: 'Dou (Cina)',
    pt: 'Dou (China)', ru: 'Доу (Китай)', zh: '斗', ja: '斗（中国）', ko: '두 (중국)'
  },
  'Dan (China volume)': { 
    en: 'Dan (China volume)', ar: 'دان (حجم الصين)', de: 'Dan (China Volumen)',
    es: 'Dan (China volumen)', fr: 'Dan (Chine volume)', it: 'Dan (Cina volume)',
    pt: 'Dan (China volume)', ru: 'Дань (Китай объём)', zh: '石', ja: '石（中国）', ko: '석 (중국)'
  },
  'Mu (China)': { 
    en: 'Mu (China)', ar: 'مو (الصين)', de: 'Mu (China)',
    es: 'Mu (China)', fr: 'Mu (Chine)', it: 'Mu (Cina)',
    pt: 'Mu (China)', ru: 'Му (Китай)', zh: '亩', ja: '畝（中国）', ko: '무 (중국)'
  },
  'Qing (China)': { 
    en: 'Qing (China)', ar: 'تشينغ (الصين)', de: 'Qing (China)',
    es: 'Qing (China)', fr: 'Qing (Chine)', it: 'Qing (Cina)',
    pt: 'Qing (China)', ru: 'Цин (Китай)', zh: '顷', ja: '頃（中国）', ko: '경 (중국)'
  },
  'Ja (Korea)': { 
    en: 'Ja (Korea)', ar: 'جا (كوريا)', de: 'Ja (Korea)',
    es: 'Ja (Corea)', fr: 'Ja (Corée)', it: 'Ja (Corea)',
    pt: 'Ja (Coreia)', ru: 'Чжа (Корея)', zh: '자（韩国）', ja: '尺（韓国）', ko: '자'
  },
  'Ri (Korea)': { 
    en: 'Ri (Korea)', ar: 'ري (كوريا)', de: 'Ri (Korea)',
    es: 'Ri (Corea)', fr: 'Ri (Corée)', it: 'Ri (Corea)',
    pt: 'Ri (Coreia)', ru: 'Ри (Корея)', zh: '리（韩国）', ja: '里（韓国）', ko: '리'
  },
  'Don (Korea)': { 
    en: 'Don (Korea)', ar: 'دون (كوريا)', de: 'Don (Korea)',
    es: 'Don (Corea)', fr: 'Don (Corée)', it: 'Don (Corea)',
    pt: 'Don (Coreia)', ru: 'Дон (Корея)', zh: '돈（韩国）', ja: '銭（韓国）', ko: '돈'
  },
  'Geun (Korea)': { 
    en: 'Geun (Korea)', ar: 'جون (كوريا)', de: 'Geun (Korea)',
    es: 'Geun (Corea)', fr: 'Geun (Corée)', it: 'Geun (Corea)',
    pt: 'Geun (Coreia)', ru: 'Кын (Корея)', zh: '근（韩国）', ja: '斤（韓国）', ko: '근'
  },
  'Hop (Korea)': { 
    en: 'Hop (Korea)', ar: 'هوب (كوريا)', de: 'Hop (Korea)',
    es: 'Hop (Corea)', fr: 'Hop (Corée)', it: 'Hop (Corea)',
    pt: 'Hop (Coreia)', ru: 'Хоп (Корея)', zh: '홉（韩国）', ja: '合（韓国）', ko: '홉'
  },
  'Doe (Korea)': { 
    en: 'Doe (Korea)', ar: 'دو (كوريا)', de: 'Doe (Korea)',
    es: 'Doe (Corea)', fr: 'Doe (Corée)', it: 'Doe (Corea)',
    pt: 'Doe (Coreia)', ru: 'Дой (Корея)', zh: '되（韩国）', ja: '升（韓国）', ko: '되'
  },
  'Mal (Korea)': { 
    en: 'Mal (Korea)', ar: 'مال (كوريا)', de: 'Mal (Korea)',
    es: 'Mal (Corea)', fr: 'Mal (Corée)', it: 'Mal (Corea)',
    pt: 'Mal (Coreia)', ru: 'Маль (Корея)', zh: '말（韩国）', ja: '斗（韓国）', ko: '말'
  },
  'Pyeong (Korea)': { 
    en: 'Pyeong (Korea)', ar: 'بيونغ (كوريا)', de: 'Pyeong (Korea)',
    es: 'Pyeong (Corea)', fr: 'Pyeong (Corée)', it: 'Pyeong (Corea)',
    pt: 'Pyeong (Coreia)', ru: 'Пхён (Корея)', zh: '평（韩国）', ja: '坪（韓国）', ko: '평'
  },
  'Se (Korea)': { 
    en: 'Se (Korea)', ar: 'سي (كوريا)', de: 'Se (Korea)',
    es: 'Se (Corea)', fr: 'Se (Corée)', it: 'Se (Corea)',
    pt: 'Se (Coreia)', ru: 'Се (Корея)', zh: '세（韩国）', ja: '畝（韓国）', ko: '세'
  },
  'Cubit (Common)': { 
    en: 'Cubit (Common)', ar: 'ذراع (عام)', de: 'Ellbogen',
    es: 'Codo', fr: 'Coudée', it: 'Cubito',
    pt: 'Côvado', ru: 'Локоть', zh: '腕尺', ja: 'キュービット', ko: '큐빗'
  },
  'Cubit (Egyptian Royal)': { 
    en: 'Cubit (Egyptian Royal)', ar: 'ذراع ملكي مصري', de: 'Königliche Elle',
    es: 'Codo Real Egipcio', fr: 'Coudée Royale', it: 'Cubito Reale',
    pt: 'Côvado Real', ru: 'Царский Локоть', zh: '皇家腕尺', ja: '王室キュービット', ko: '왕실 큐빗'
  },
  'Fathom': { 
    en: 'Fathom', ar: 'قامة', de: 'Faden',
    es: 'Braza', fr: 'Brasse', it: 'Braccio',
    pt: 'Braça', ru: 'Сажень', zh: '英寻', ja: 'ファゾム', ko: '패덤'
  },
  'Furlong': { 
    en: 'Furlong', ar: 'فرلنغ', de: 'Furlong',
    es: 'Estadio', fr: 'Furlong', it: 'Furlong',
    pt: 'Furlong', ru: 'Фурлонг', zh: '弗隆', ja: 'ハロン', ko: '펄롱'
  },
  'League': { 
    en: 'League', ar: 'فرسخ', de: 'Leuge',
    es: 'Legua', fr: 'Lieue', it: 'Lega',
    pt: 'Légua', ru: 'Лье', zh: '里格', ja: 'リーグ', ko: '리그'
  },
  'Grain': { 
    en: 'Grain', ar: 'حبة', de: 'Korn',
    es: 'Grano', fr: 'Grain', it: 'Grano',
    pt: 'Grão', ru: 'Гран', zh: '格令', ja: 'グレーン', ko: '그레인'
  },
  'Troy Ounce': { 
    en: 'Troy Ounce', ar: 'أونصة تروي', de: 'Feinunze',
    es: 'Onza Troy', fr: 'Once Troy', it: 'Oncia Troy',
    pt: 'Onça Troy', ru: 'Тройская Унция', zh: '金衡盎司', ja: 'トロイオンス', ko: '트로이 온스'
  },
  'Carat (Metric)': { 
    en: 'Carat (Metric)', ar: 'قيراط متري', de: 'Karat',
    es: 'Quilate', fr: 'Carat', it: 'Carato',
    pt: 'Quilate', ru: 'Карат', zh: '克拉', ja: 'カラット', ko: '캐럿'
  },
  'Stone (UK)': { 
    en: 'Stone (UK)', ar: 'ستون', de: 'Stone',
    es: 'Stone', fr: 'Stone', it: 'Stone',
    pt: 'Stone', ru: 'Стоун', zh: '英石', ja: 'ストーン', ko: '스톤'
  },
  'Bushel (US)': { 
    en: 'Bushel (US)', ar: 'بوشل', de: 'Scheffel',
    es: 'Bushel', fr: 'Boisseau', it: 'Bushel',
    pt: 'Bushel', ru: 'Бушель', zh: '蒲式耳', ja: 'ブッシェル', ko: '부셸'
  },
  'Peck (US)': { 
    en: 'Peck (US)', ar: 'بيك', de: 'Peck',
    es: 'Peck', fr: 'Peck', it: 'Peck',
    pt: 'Peck', ru: 'Пек', zh: '配克', ja: 'ペック', ko: '펙'
  },
  'Acre': { 
    en: 'Acre', ar: 'فدان', de: 'Morgen',
    es: 'Acre', fr: 'Acre', it: 'Acro',
    pt: 'Acre', ru: 'Акр', zh: '英亩', ja: 'エーカー', ko: '에이커'
  },
  'Erg (CGS)': { 
    en: 'Erg (CGS)', ar: 'إرغ', de: 'Erg',
    es: 'Ergio', fr: 'Erg', it: 'Erg',
    pt: 'Erg', ru: 'Эрг', zh: '尔格', ja: 'エルグ', ko: '에르그'
  },
  'Dyne': { 
    en: 'Dyne', ar: 'داين', de: 'Dyn',
    es: 'Dina', fr: 'Dyne', it: 'Dina',
    pt: 'Dina', ru: 'Дина', zh: '达因', ja: 'ダイン', ko: '다인'
  },
  'Poise': { 
    en: 'Poise', ar: 'بواز', de: 'Poise',
    es: 'Poise', fr: 'Poise', it: 'Poise',
    pt: 'Poise', ru: 'Пуаз', zh: '泊', ja: 'ポアズ', ko: '푸아즈'
  },
  'Stokes': { 
    en: 'Stokes', ar: 'ستوكس', de: 'Stokes',
    es: 'Stokes', fr: 'Stokes', it: 'Stokes',
    pt: 'Stokes', ru: 'Стокс', zh: '斯托克斯', ja: 'ストークス', ko: '스토크스'
  },
  'Gauss': { 
    en: 'Gauss', ar: 'غاوس', de: 'Gauß',
    es: 'Gauss', fr: 'Gauss', it: 'Gauss',
    pt: 'Gauss', ru: 'Гаусс', zh: '高斯', ja: 'ガウス', ko: '가우스'
  },
  'Maxwell': { 
    en: 'Maxwell', ar: 'ماكسويل', de: 'Maxwell',
    es: 'Maxwell', fr: 'Maxwell', it: 'Maxwell',
    pt: 'Maxwell', ru: 'Максвелл', zh: '麦克斯韦', ja: 'マクスウェル', ko: '맥스웰'
  },
  'Oersted': { 
    en: 'Oersted', ar: 'أورستد', de: 'Oersted',
    es: 'Oersted', fr: 'Œrsted', it: 'Oersted',
    pt: 'Oersted', ru: 'Эрстед', zh: '奥斯特', ja: 'エルステッド', ko: '외르스테드'
  },
  'Point (Desktop)': { 
    en: 'Point (Desktop)', ar: 'نقطة', de: 'Punkt',
    es: 'Punto', fr: 'Point', it: 'Punto',
    pt: 'Ponto', ru: 'Пункт', zh: '点', ja: 'ポイント', ko: '포인트'
  },
  'Pica': { 
    en: 'Pica', ar: 'بيكا', de: 'Pica',
    es: 'Pica', fr: 'Pica', it: 'Pica',
    pt: 'Pica', ru: 'Пика', zh: '派卡', ja: 'パイカ', ko: '파이카'
  },
  'Pixel (96 PPI)': { 
    en: 'Pixel (96 PPI)', ar: 'بكسل', de: 'Pixel',
    es: 'Píxel', fr: 'Pixel', it: 'Pixel',
    pt: 'Pixel', ru: 'Пиксель', zh: '像素', ja: 'ピクセル', ko: '픽셀'
  },
  'Em (16px ref)': { 
    en: 'Em (16px ref)', ar: 'إيم', de: 'Geviert',
    es: 'Em', fr: 'Em', it: 'Em',
    pt: 'Em', ru: 'Эм', zh: 'em', ja: 'em', ko: 'em'
  },
  'Drop': { 
    en: 'Drop', ar: 'قطرة', de: 'Tropfen',
    es: 'Gota', fr: 'Goutte', it: 'Goccia',
    pt: 'Gota', ru: 'Капля', zh: '滴', ja: '滴', ko: '방울'
  },
  'Pinch': { 
    en: 'Pinch', ar: 'قرصة', de: 'Prise',
    es: 'Pizca', fr: 'Pincée', it: 'Pizzico',
    pt: 'Pitada', ru: 'Щепотка', zh: '撮', ja: 'ひとつまみ', ko: '꼬집'
  },
  'Dash': { 
    en: 'Dash', ar: 'رشة', de: 'Spritzer',
    es: 'Chorrito', fr: 'Trait', it: 'Pizzico',
    pt: 'Pitada', ru: 'Чуточка', zh: '少许', ja: 'ひとふり', ko: '조금'
  },
  'Dessertspoon': { 
    en: 'Dessertspoon', ar: 'ملعقة حلوى', de: 'Dessertlöffel',
    es: 'Cuchara de Postre', fr: 'Cuillère à Dessert', it: 'Cucchiaio da Dessert',
    pt: 'Colher de Sobremesa', ru: 'Десертная Ложка', zh: '甜品匙', ja: 'デザートスプーン', ko: '디저트 스푼'
  },
};

export const SI_SYMBOLS = [
  'm', 'kg', 'g', 's', 'A', 'K', 'mol', 'cd',
  'Hz', 'N', 'Pa', 'J', 'W', 'C', 'V', 'F',
  'Ω', 'S', 'Wb', 'T', 'H', 'lm', 'lx', 'Bq',
  'Gy', 'Sv', 'kat', 'rad', 'sr',
  'm²', 'm³', 'L', 'ha',
];

export const SI_PREFIX_SYMBOLS = [
  'Y', 'Z', 'E', 'P', 'T', 'G', 'M', 'k',
  'c', 'm', 'µ', 'n', 'p', 'f', 'a', 'z', 'y',
];

export const translate = (
  key: string, 
  language: SupportedLanguage, 
  translations: Record<string, Translation>
): string => {
  if (!translations[key]) {
    return key;
  }
  
  const trans = translations[key];
  
  if (language === 'en' || language === 'en-us') return trans.en;
  
  const langKey = language as keyof Translation;
  if (trans[langKey]) return trans[langKey] as string;
  
  return trans.en || key;
};
