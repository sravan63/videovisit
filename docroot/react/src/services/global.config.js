const _rootUrl = '/';

const GlobalConfig = {
    KAISER_PERMANENTE: 'Kaiser Permanente',
    HOME_URL: _rootUrl,
    VIDEO_VISIT_ROOM_URL: _rootUrl + 'videoVisitReady',
    LOGIN_URL: _rootUrl + 'login',
    IPHONE:'iPhone',
    IPHONE_VERSION:'15.1',
    MEETINGS_URL: _rootUrl + 'myMeetings',
    AUTO_REFRESH_TIMER: '180000',
    RUNNING_LATE_TIMER: 120000,
    SIGNOUT_MEMBER_ALONE: 2700000,
    MEMBER_GROUP: ['GUEST_MEMBER', 'MEMBER_PROXY', 'NONMEMBER_PROXY', 'PATIENT'],
    PATIENT_GROUP: ['GUEST_MEMBER', 'MEMBER_PROXY', 'NONMEMBER_PROXY', 'PATIENT'],
    CALLING_ROLE: 'DIAL_OUT',
    GUEST_ROLE: 'GUEST_MEMBER',
    NONMEMBER_PROXY: 'NONMEMBER_PROXY',
    MEMBER_PROXY: 'MEMBER_PROXY',
    PATIENT_ROLE: 'PATIENT',
    PATIENT_IDTYPE: 'GUID',
    CHAIR_ROLE: 'chair',
    HOST_ROLE: 'PROVIDER',
    INTERPRETER_DISPLAYNAME: 'Interpreter Service',
    DIALOUT_DISPLAYNAME: 'Dial Out',
    INTERPRETER_ROLE: 'INTERPRETER',
    INTERPRETER_STATE_CONNECTING: 'connecting',
    INTERPRETER_STATE_FAILED: 'failed',
    INTERPRETER_STATE_SUCCESS: 'success',
    INVITE_USER_TYPE_EMAIL: 'EMAIL',
    AUDIO_ONLY_USERS_GUEST: 'DIAL_OUT',
    CLINICIAN_BY_KPHC: 'clinician-by-kphc',
    INTERPRETER_INVITE: 'interpreter',
    PHONE_REF: 'phone',
    EMAIL_REF: 'email',
    TEST_CALL_FINISHED: 'Test call finished',
    MEDIA_DATA_READY: 'Media Data Ready',
    UPDATE_MEDIA_DEVICES: 'Update Media Devices',
    RESET_MEDIA_DEVICES: 'reset media device list',
    RECONNECT_ON_DEVICE_CHANGE: 'reconnect on device change',
    NOTIFY_USER: 'Notify User',
    MEMBER_READY: 'Member Ready',
    HOST_AVAIL: 'Host Availble',
    HOST_LEFT: 'Host left',
    HAS_MORE_PARTICIPANTS: 'More participants',
    JOINED_VISIT: 'has joined the visit.',
    LEFT_VISIT: 'has left the visit.',
    PRESENTATION_ON: 'has initiated desktop sharing.',
    PRESENTATION_OFF: 'has stopped desktop sharing.',
    LOGIN_TYPE: {
        TEMP: 'tempAccess',
        SSO: 'sso',
        GUEST: 'guest',
        INSTANT: 'instant_join',
        EC: 'ec_instant_join'
    },
    VIDEO_MUTE: 'Mute Video',
    VIDEO_UNMUTE: 'Unmute Video',
    AUDIO_MUTE: 'Mute Audio',
    AUDIO_UNMUTE: 'Unmute Audio',
    VIDEO: 'video',
    AUDIO: 'audio',
    MICROPHONE: 'microphone',
    MICROPHONE_MUTE: 'Mute Microphone',
    MICROPHONE_UNMUTE: 'Unmute Microphone',
    STRING_FORMAT: ['capitalize', 'uppercase', 'lowercase'],
    ACCESS_MEMBER_NAME: 'send member name',
    GUEST_VALIDATE_MEETING_ERROR_MSG: 'The video visit you are trying to join is not currently available.',
    GUEST_FUTURE_MEETING:'Your visit is not ready yet, try again closer to the scheduled time.',
    GUEST_LOGIN_ERROR_MSG: 'Some exception occurred while processing request.',
    GUEST_LOGIN_VALIDATION_MSG: 'No matching patient found. Please try again.',
    SHOW_CONFERENCE_DETAILS: 'show conference details',
    UPDATE_RUNNING_LATE: 'update running late in sidebar',
    LEAVE_VISIT: 'leave meeting',
    TOGGLE_SETTINGS: 'toggle settings',
    CLOSE_SETTINGS: 'closed settings',
    LOGOUT: 'User Signed Out',
    START_SCREENSHARE: 'start screenshare',
    STOP_SCREENSHARE: 'stop screenshare',
    USER_JOINED: 'user joined',
    USER_LEFT: 'user left',
    SELF_ASPECT_MODE: 'SelfAspectMode',
    ERROR_PAGE: _rootUrl + 'authenticationFailed',
    ENABLE_IOS_CAM:'Enable IOS cam',
    INAPP_LEAVEMEETING:'Leave Meeting InApp',
    CAMERA_FLIP:'Show Mirror Image',
    OPEN_MODAL: 'open popup',
    CLOSE_MODAL: 'popup closed',
    CLOSE_MODAL_AUTOMATICALLY: 'close popup automatically',
    OPEN_INFO_MODAL: 'open info popup',
    CLOSE_INFO_MODAL: 'info popup closed',
    TOGGLE_MOBILE_FOOTER: 'Mobile Footer Toggle',
    MEDIA_STATS_DATA:'StoreMedia Stats',
    REMOVE_DUPLICATES:'Member alone',
    MEDIA_PERMISSION:'Permission Denied',
    RENDER_VIDEO_DOM:'Show Video DOM ',
    HIDE_LOADER:'hide loader',
    OPEN_SURVEY_MODAL: 'open survey popup',
    CLOSE_SURVEY_MODAL: 'survey popup closed',
    CLOSE_SURVEY_MODAL_AUTOMATICALLY: 'close survey popup automatically',
    SPOTLIGHT:'spotlight participant',
    UNSPOTLIGHT:'unspotlight participant',
    DUPLICATE_NAME: 'DUPLICATE_MEMBER#',
    GENERIC_VISIT: 'GENERICVISIT$',
    UPDATE_DUPLICATE_MEMBERS_TO_SIDEBAR: 'UPDATE DUPLICATE MEMBERS TO SIDEBAR',
    UPDATE_HOST_DETAILS_IN_GENERICVISIT: 'UPDATE HOST DETAILS IN GENERICVISIT',
    ACTIVESPEAKER:'bold participant',
    NOTACTIVESPEAKER:'unbold participant',
    LANGUAGE_CHANGED:'language changed',
    ICE_GATHERING_COMPLETE: 'IceGatheringComplete',
    NETWORK_CONNECTION_SUCCESS: 'NetworkConnectionSuccess',
    NETWORK_RECONNECTING: 'NetworkReconnecting',
    FAILED_MID_WAY: 'CallFailedMidway',
    CALL_CONNECTED: 'CallConnected',
    CALL_DISCONNECTED: 'CallDisconnected',
    SEND_JOIN_LEAVE_STATUS: 'send join leave status',
    BUFFER_SPACE: 10,
    CONTROLS_OFFSET: 50,
    LANGUAGE_ENG:'english',
    LANGUAGE_SPANISH:'spanish',
    LANGUAGE_CHINESE:'chinese',
    WEEK_DAYS: {
        chinese: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
        english: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        spanish: ["dom.", "lun.", "mar.", "mié.", "jue.", "vie.", "sáb."]
    },
    MONTHS: {
        chinese: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        english: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        spanish: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sep.", "oct.", "nov.", "dic."]
    },
    departmentNames :{
        "NCAL_Translation_Names": [
            {
              "english": "ADMINISTRATION",
              "spanish": "ADMINISTRACIÓN",
              "chinese": "行政部"
            },
            {
              "english": "ADMITTING",
              "spanish": "ADMISIONES",
              "chinese": "住院部"
            },
            {
              "english": "ADULT AND FAMILY MEDICINE",
              "spanish": "MEDICINA PARA ADULTOS Y FAMILIAS",
              "chinese": "成人及家庭內科"
            },
            {
              "english": "ALLERGY",
              "spanish": "ALERGOLOGÍA",
              "chinese": "過敏科"
            },
            {
              "english": "ANESTHESIOLOGY",
              "spanish": "ANESTESIOLOGÍA",
              "chinese": "麻醉科"
            },
            {
              "english": "AUDIOLOGY",
              "spanish": "AUDIOLOGÍA",
              "chinese": "聽覺科"
            },
            {
              "english": "BRACE CLINIC",
              "spanish": "CLÍNICA DE DISPOSITIVOS ORTOPÉDICOS",
              "chinese": "理療與復健支架診所"
            },
            {
              "english": "CARDIAC CATHETERIZATION",
              "spanish": "CATETERISMO CARDÍACO",
              "chinese": "心導管手術科"
            },
            {
              "english": "CARDIOVASCULAR ANESTHESIOLOGY",
              "spanish": "ANESTESIOLOGÍA CARDIOVASCULAR",
              "chinese": "心血管麻醉科"
            },
            {
              "english": "CARDIOVASCULAR SURGERY",
              "spanish": "CIRUGÍA CARDIOVASCULAR",
              "chinese": "心血管外科"
            },
            {
              "english": "CHART ROOM",
              "spanish": "ARCHIVO DE HISTORIAS CLÍNICAS",
              "chinese": "病歷室"
            },
            {
              "english": "CHEMICAL DEPENDENCY SERVICES",
              "spanish": "SERVICIOS DE FARMACODEPENDENCIA",
              "chinese": "藥物依賴服務部"
            },
            {
              "english": "CLAIMS",
              "spanish": "RECLAMACIONES",
              "chinese": "索賠部"
            },
            {
              "english": "COMMUNICATIONS",
              "spanish": "INFORMACIÓN",
              "chinese": "溝通服務部"
            },
            {
              "english": "COMPLEMENTARY/ALTERNATIVE MED",
              "spanish": "MEDICINA COMPLEMENTARIA/ALTERNATIVA",
              "chinese": "補充/替代醫學科"
            },
            {
              "english": "CONTACT LENS SALES",
              "spanish": "VENTA DE LENTES DE CONTACTO",
              "chinese": "隱形眼鏡銷售部"
            },
            {
              "english": "COSMETIC SERVICES",
              "spanish": "SERVICIOS ESTÉTICOS",
              "chinese": "美容服務部"
            },
            {
              "english": "CT SCAN",
              "spanish": "TOMOGRAFÍA COMPUTARIZADA",
              "chinese": "電腦斷層掃描"
            },
            {
              "english": "DERMATOLOGY",
              "spanish": "DERMATOLOGÍA",
              "chinese": "皮膚科"
            },
            {
              "english": "DIVISION OF RESEARCH",
              "spanish": "DEPARTAMENTO DE INVESTIGACIÓN",
              "chinese": "研究部"
            },
            {
              "english": "DURABLE MEDICAL EQUIPMENT",
              "spanish": "EQUIPO MÉDICO DURADERO",
              "chinese": "耐用醫療器材部"
            },
            {
              "english": "ECHOCARDIOGRAPHY",
              "spanish": "ECOCARDIOGRAFÍA",
              "chinese": "超音波心動圖檢查"
            },
            {
              "english": "EEG",
              "spanish": "ELECTROENCEFALOGRAMA",
              "chinese": "腦電圖"
            },
            {
              "english": "EKG",
              "spanish": "ELECTROCARDIOGRAMA",
              "chinese": "心電圖"
            },
            {
              "english": "EMERGENCY",
              "spanish": "EMERGENCIA",
              "chinese": "急診"
            },
            {
              "english": "EMERGENCY DEPARTMENT",
              "spanish": "DEPARTAMENTO DE EMERGENCIAS",
              "chinese": "急診部"
            },
            {
              "english": "EMPLOYEE HEALTH ADMIN DEPT",
              "spanish": "DEPARTAMENTO DE SALUD DEL EMPLEADO",
              "chinese": "員工健康管理部"
            },
            {
              "english": "ENTEROSTOMY",
              "spanish": "ENTEROSTOMÍA",
              "chinese": "腸造口手術科"
            },
            {
              "english": "EYEGLASS SALES",
              "spanish": "VENTA DE ANTEOJOS",
              "chinese": "眼鏡銷售部"
            },
            {
              "english": "FAMILY PRACTICE",
              "spanish": "MEDICINA FAMILIAR",
              "chinese": "家庭醫學科"
            },
            {
              "english": "GENERAL MEDICINE",
              "spanish": "MEDICINA GENERAL",
              "chinese": "全科醫療科"
            },
            {
              "english": "GENETICS",
              "spanish": "GENÉTICA",
              "chinese": "遺傳科"
            },
            {
              "english": "HEAD AND NECK SURGERY",
              "spanish": "CIRUGÍA OTORRINOLARINGOLÓGICA",
              "chinese": "頭頸手術科"
            },
            {
              "english": "HEALTH EDUCATION",
              "spanish": "EDUCACIÓN PARA LA SALUD",
              "chinese": "健康教育科"
            },
            {
              "english": "HEALTH EVALUATION",
              "spanish": "EVALUACIÓN DE LA SALUD",
              "chinese": "健康評估科"
            },
            {
              "english": "HEALTH PLAN OFFICE",
              "spanish": "OFICINA DEL PLAN DE SALUD",
              "chinese": "保健計劃室"
            },
            {
              "english": "HEARING SERVICES CENTER",
              "spanish": "CENTRO DE SERVICIOS AUDIOLÓGICOS",
              "chinese": "聽力服務中心"
            },
            {
              "english": "HEMATOLOGY",
              "spanish": "HEMATOLOGÍA",
              "chinese": "血液科"
            },
            {
              "english": "HOME HEALTH",
              "spanish": "SERVICIOS DE ATENCIÓN MÉDICA DOMICILIARIA",
              "chinese": "居家保健服務科"
            },
            {
              "english": "HOSPITAL MEDICINE DEPARTMENT",
              "spanish": "DEPARTAMENTO DE MEDICINA HOSPITALARIA",
              "chinese": "醫院醫療部"
            },
            {
              "english": "HOUSEKEEPING",
              "spanish": "SERVICIOS DE LIMPIEZA",
              "chinese": "病房整理部"
            },
            {
              "english": "INPATIENT NURSING",
              "spanish": "ENFERMERÍA HOSPITALARIA",
              "chinese": "住院護理部"
            },
            {
              "english": "INPATIENT PSYCHIATRY",
              "spanish": "PSIQUIATRÍA HOSPITALARIA",
              "chinese": "精神科住院治療部"
            },
            {
              "english": "INVITRO FERTILIZATION",
              "spanish": "FERTILIZACIÓN IN VITRO",
              "chinese": "體外人工授精"
            },
            {
              "english": "LABORATORY",
              "spanish": "LABORATORIO",
              "chinese": "化驗室"
            },
            {
              "english": "LOCAL BUSINESS OFFICE",
              "spanish": "OFICINA ADMINISTRATIVA LOCAL",
              "chinese": "本地業務室"
            },
            {
              "english": "MAGNETIC RESONANCE IMAGING",
              "spanish": "RESONANCIA MAGNÉTICA NUCLEAR",
              "chinese": "磁共振成像"
            },
            {
              "english": "MEDICAL SECRETARIES",
              "spanish": "SECRETARIAS MÉDICAS",
              "chinese": "醫務秘書處"
            },
            {
              "english": "NEUROLOGY",
              "spanish": "NEUROLOGÍA",
              "chinese": "神經內科"
            },
            {
              "english": "NEUROSURGERY",
              "spanish": "NEUROCIRUGÍA",
              "chinese": "神經外科"
            },
            {
              "english": "NON-KAISER LOCATIONS",
              "spanish": "INSTALACIONES QUE NO SON KAISER",
              "chinese": "非KAISER設施"
            },
            {
              "english": "NUCLEAR MEDICINE",
              "spanish": "MEDICINA NUCLEAR",
              "chinese": "核子醫學科"
            },
            {
              "english": "NURSERY",
              "spanish": "SALA DE RECIÉN NACIDOS",
              "chinese": "育嬰室"
            },
            {
              "english": "NUTRITION SERVICES",
              "spanish": "SERVICIOS DE NUTRICIÓN",
              "chinese": "營養服務科"
            },
            {
              "english": "OBSTETRICS AND GYNECOLOGY ",
              "spanish": "GINECOLOGÍA Y OBSTETRICIA",
              "chinese": "婦產科"
            },
            {
              "english": "OCCUPATIONAL MEDICINE",
              "spanish": "MEDICINA LABORAL",
              "chinese": "職業病醫學科"
            },
            {
              "english": "OCCUPATIONAL THERAPY",
              "spanish": "TERAPIA OCUPACIONAL",
              "chinese": "職業病治療科"
            },
            {
              "english": "OPERATING ROOM ",
              "spanish": "SALA DE OPERACIONES",
              "chinese": "手術室"
            },
            {
              "english": "OPHTHALMOLOGY",
              "spanish": "OFTALMOLOGÍA",
              "chinese": "眼科"
            },
            {
              "english": "OPTOMETRY",
              "spanish": "OPTOMETRÍA",
              "chinese": "驗光"
            },
            {
              "english": "ORTHOPAEDIC SPINE SURGERY",
              "spanish": "CIRUGÍA ORTOPÉDICA DE LA COLUMNA VERTEBRAL",
              "chinese": "脊柱外科"
            },
            {
              "english": "ORTHOPEDICS",
              "spanish": "ORTOPEDIA",
              "chinese": "骨科"
            },
            {
              "english": "OUTPATIENT SURGERY",
              "spanish": "CIRUGÍA AMBULATORIA",
              "chinese": "門診手術"
            },
            {
              "english": "PAIN CLINIC",
              "spanish": "CLÍNICA DEL DOLOR",
              "chinese": "疼痛診所"
            },
            {
              "english": "PATHOLOGY",
              "spanish": "PATOLOGÍA",
              "chinese": "病理科"
            },
            {
              "english": "PATIENT EDUCATION",
              "spanish": "EDUCACIÓN PARA EL PACIENTE",
              "chinese": "患者教育部"
            },
            {
              "english": "PEDIATRICS",
              "spanish": "PEDIATRÍA",
              "chinese": "兒科部"
            },
            {
              "english": "PEDIATRICS HBS",
              "spanish": "PEDIATRÍA - Ayudando a los Bebés a Respirar®",
              "chinese": "兒科住院服務部"
            },
            {
              "english": "PERSONNEL",
              "spanish": "PERSONAL",
              "chinese": "人事部"
            },
            {
              "english": "PHARMACY",
              "spanish": "FARMACIA",
              "chinese": "藥房"
            },
            {
              "english": "PHYSICAL MEDICINE",
              "spanish": "FISIATRÍA",
              "chinese": "體能病理科"
            },
            {
              "english": "PHYSICAL THERAPY",
              "spanish": "FISIOTERAPIA",
              "chinese": "物理冶療部"
            },
            {
              "english": "PLASTIC SURGERY",
              "spanish": "CIRUGÍA PLÁSTICA",
              "chinese": "整形外科"
            },
            {
              "english": "PODIATRY",
              "spanish": "PODOLOGÍA",
              "chinese": "足科"
            },
            {
              "english": "PREVENTIVE MEDICINE",
              "spanish": "MEDICINA PREVENTIVA",
              "chinese": "預防醫學科"
            },
            {
              "english": "PSYCHIATRY",
              "spanish": "PSIQUIATRÍA",
              "chinese": "精神科"
            },
            {
              "english": "RADIATION ONCOLOGY",
              "spanish": "ONCOLOGÍA RADIOTERÁPICA",
              "chinese": "放射腫瘤科"
            },
            {
              "english": "RADIOLOGY",
              "spanish": "RADIOLOGÍA",
              "chinese": "放射科"
            },
            {
              "english": "REHABILITATION",
              "spanish": "REHABILITACIÓN",
              "chinese": "復健科"
            },
            {
              "english": "RESPIRATORY THERAPY",
              "spanish": "FISIOTERAPIA RESPIRATORIA",
              "chinese": "呼吸治療科"
            },
            {
              "english": "SOCIAL SERVICES",
              "spanish": "SERVICIOS SOCIALES",
              "chinese": "社會服務部"
            },
            {
              "english": "SPEECH THERAPY",
              "spanish": "TERAPIA DEL HABLA",
              "chinese": "言語治療部"
            },
            {
              "english": "SURGERY",
              "spanish": "CIRUGÍA",
              "chinese": "外科手術部"
            },            
            {
              "english": "TRANSPLANT SERVICES",
              "spanish": "SERVICIOS DE TRASPLANTES",
              "chinese": "移植服務部"
            },
            {
              "english": "ULTRASOUND",
              "spanish": "ECOGRAFÍA",
              "chinese": "超聲波"
            },
            {
              "english": "URGENT CARE",
              "spanish": "ATENCIÓN URGENTE",
              "chinese": "緊急醫護部"
            },
            {
              "english": "UROLOGY",
              "spanish": "UROLOGÍA",
              "chinese": "泌尿科"
            },
            {
              "english": "VOLUNTEERS' SERVICE",
              "spanish": "SERVICIOS DE VOLUNTARIOS",
              "chinese": "義工服務部"
            }
          ]
    }
};

export default GlobalConfig;
