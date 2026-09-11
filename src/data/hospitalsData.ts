import { Hospital, HospitalSpecialty } from '../types';

export const SPECIALTIES: HospitalSpecialty[] = [
  {
    id: 'pathology',
    name: { el: 'Παθολογικό (Εσωτερική Παθολογία)', en: 'Internal Medicine / General Pathology' },
    iconName: 'Stethoscope',
    category: 'primary'
  },
  {
    id: 'surgery',
    name: { el: 'Χειρουργικό (Γενική Χειρουργική)', en: 'General Surgery' },
    iconName: 'Scissors',
    category: 'surgical'
  },
  {
    id: 'cardiology',
    name: { el: 'Καρδιολογικό / Στεφανιαία Μονάδα', en: 'Cardiology / Coronary Unit' },
    iconName: 'HeartPulse',
    category: 'primary'
  },
  {
    id: 'orthopedics',
    name: { el: 'Ορθοπαιδικό & Τραυματολογία', en: 'Orthopedics & Trauma' },
    iconName: 'Bone',
    category: 'surgical'
  },
  {
    id: 'pediatrics',
    name: { el: 'Παιδιατρικό (Παιδιατρικά Περιστατικά)', en: 'Pediatrics (Children Emergencies)' },
    iconName: 'Baby',
    category: 'pediatric'
  },
  {
    id: 'gynecology',
    name: { el: 'Μαιευτικό - Γυναικολογικό', en: 'Obstetrics & Gynecology' },
    iconName: 'Users',
    category: 'specialized'
  },
  {
    id: 'ophthalmology',
    name: { el: 'Οφθαλμολογικό (Μάτια / Τραύματα Οφθαλμών)', en: 'Ophthalmology (Eye Emergencies)' },
    iconName: 'Eye',
    category: 'specialized'
  },
  {
    id: 'ent',
    name: { el: 'ΩΡΛ (Ωτορινολαρυγγολογικό)', en: 'ENT (Ear, Nose & Throat)' },
    iconName: 'Ear',
    category: 'specialized'
  },
  {
    id: 'neurology',
    name: { el: 'Νευρολογικό / Εγκεφαλικά', en: 'Neurology / Stroke Care' },
    iconName: 'Brain',
    category: 'primary'
  },
  {
    id: 'pulmonology',
    name: { el: 'Πνευμονολογικό (Αναπνευστικό)', en: 'Pulmonology / Respiratory' },
    iconName: 'Wind',
    category: 'primary'
  },
  {
    id: 'psychiatry',
    name: { el: 'Ψυχιατρικό (Επείγουσα Ψυχιατρική)', en: 'Emergency Psychiatry' },
    iconName: 'Activity',
    category: 'specialized'
  },
  {
    id: 'urology',
    name: { el: 'Ουρολογικό', en: 'Urology' },
    iconName: 'Cross',
    category: 'surgical'
  },
  {
    id: 'dermatology',
    name: { el: 'Δερματολογικό (Αφροδίσια / Οξέα Εξανθήματα)', en: 'Dermatology' },
    iconName: 'ShieldAlert',
    category: 'specialized'
  },
  {
    id: 'dental',
    name: { el: 'Οδοντιατρικό (Επείγουσα Γναθοχειρουργική)', en: 'Emergency Dental & Maxillofacial' },
    iconName: 'Smile',
    category: 'specialized'
  }
];

export const INITIAL_HOSPITALS: Hospital[] = [
  // ATTICA (ATHENS & PIRAEUS - 1η & 2η ΥΠΕ)
  {
    id: 'evaggelismos',
    name: {
      el: 'Γενικό Νοσοκομείο Αθηνών «Ο Ευαγγελισμός»',
      en: 'General Hospital of Athens "Evaggelismos"'
    },
    shortName: 'Ευαγγελισμός',
    type: 'General',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Υψηλάντου 45-47, Κολωνάκι',
      en: 'Ypsilantou 45-47, Kolonaki, Athens'
    },
    city: { el: 'Αθήνα', en: 'Athens' },
    postalCode: '10676',
    coordinates: { lat: 37.9768, lng: 23.7482 },
    phoneEmergency: '213 2041000',
    phoneGeneral: '213 2041777',
    website: 'https://www.evaggelismos-hosp.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '14:30 - 06:00 (Ολονύκτια Γενική Εφημερία)',
        en: '14:30 - 06:00 (All-Night General On-Duty)'
      },
      group: 'Ομάδα Α',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'neurology', 'pulmonology', 'ent', 'ophthalmology', 'urology', 'dental'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Κεντρικό νοσοκομείο αναφοράς τραύματος και επειγόντων. 24ωρη αιμοδυναμική μονάδα και αξονικός τομογράφος.',
      en: 'Major emergency referral trauma center in central Athens. 24/7 cath lab and CT.'
    }
  },
  {
    id: 'gennimatas-athens',
    name: {
      el: 'Γενικό Νοσοκομείο Αθηνών «Γ. Γεννηματάς»',
      en: 'General Hospital of Athens "G. Gennimatas"'
    },
    shortName: 'Γ. Γεννηματάς Αθηνών',
    type: 'General',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Λεωφ. Μεσογείων 154, Χολαργός',
      en: '154 Mesogeion Ave, Cholargos, Athens'
    },
    city: { el: 'Αθήνα', en: 'Athens' },
    postalCode: '11527',
    coordinates: { lat: 37.9996, lng: 23.7788 },
    phoneEmergency: '213 2032000',
    phoneGeneral: '210 7768000',
    website: 'https://www.gna-gennimatas.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '14:30 - 06:00 (Ολονύκτια Εφημερία)',
        en: '14:30 - 06:00 (All-Night Emergency Duty)'
      },
      group: 'Ομάδα Α',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'ophthalmology', 'neurology', 'ent', 'urology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Πλήρης εφημερία όλων των βασικών κλινικών. Εξειδικευμένο κέντρο οφθαλμικού τραύματος.',
      en: 'Full night duty across all core departments. Specialized eye trauma unit.'
    }
  },
  {
    id: 'attikon',
    name: {
      el: 'Πανεπιστημιακό Γενικό Νοσοκομείο «Αττικόν»',
      en: 'University General Hospital "Attikon"'
    },
    shortName: 'ΠΓΝ Αττικόν',
    type: 'University',
    region: 'Attica',
    healthDistrict: '2η ΥΠΕ',
    address: {
      el: 'Ρίμινι 1, Χαϊδάρι',
      en: '1 Rimini St, Haidari, Athens'
    },
    city: { el: 'Χαϊδάρι (Δυτική Αθήνα)', en: 'Haidari (West Athens)' },
    postalCode: '12462',
    coordinates: { lat: 38.0163, lng: 23.6668 },
    phoneEmergency: '210 5831000',
    phoneGeneral: '210 5831111',
    website: 'https://www.attikonhospital.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Πλήρης Εφημερία)',
        en: '08:00 - 08:00 (24h Full University Duty)'
      },
      group: 'Ομάδα Β',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'gynecology', 'neurology', 'psychiatry', 'pulmonology', 'ent', 'urology'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Υπερσύγχρονο πανεπιστημιακό νοσοκομείο με παιδιατρική και μαιευτική κάλυψη 24 ώρες.',
      en: 'Modern university hospital offering 24-hour pediatric, trauma and obstetric care.'
    }
  },
  {
    id: 'kat',
    name: {
      el: 'Γενικό Νοσοκομείο Αττικής ΚΑΤ (Τραυματολογικό)',
      en: 'General Hospital of Attica KAT (Trauma & Orthopedic Center)'
    },
    shortName: 'ΚΑΤ Κηφισιάς',
    type: 'Trauma',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Νίκης 2, Κηφισιά',
      en: '2 Nikis St, Kifisia'
    },
    city: { el: 'Κηφισιά (Βόρεια Προάστια)', en: 'Kifisia (North Athens)' },
    postalCode: '14561',
    coordinates: { lat: 38.0645, lng: 23.8091 },
    phoneEmergency: '213 2086000',
    phoneGeneral: '213 2086100',
    website: 'https://www.kat-hosp.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '24ωρη Καθημερινή Εφημερία Τραύματος (08:00 - 08:00)',
        en: '24/7 Daily Trauma & Orthopedic Emergency'
      },
      group: 'Μόνιμη Τραυματιολογική',
      status: 'active'
    },
    specialties: ['orthopedics', 'surgery', 'neurology', 'urology', 'pathology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Το κύριο κέντρο ορθοπαιδικού και πολυτραύματος στην Ελλάδα. Εφημερεύει σε μόνιμη βάση για τροχαία και κατάγματα.',
      en: 'The premier national trauma & orthopedics center for Greece. Continuous coverage for fractures and road accidents.'
    }
  },
  {
    id: 'agia-sofia',
    name: {
      el: 'Γενικό Νοσοκομείο Παίδων «Η Αγία Σοφία»',
      en: 'Children\'s Hospital of Athens "Agia Sofia"'
    },
    shortName: 'Παίδων Αγία Σοφία',
    type: 'Children',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Θηβών & Παπαδιαμαντοπούλου, Γουδή',
      en: 'Thivon & Papadiamantopoulou, Goudi'
    },
    city: { el: 'Αθήνα (Γουδή)', en: 'Athens (Goudi)' },
    postalCode: '11527',
    coordinates: { lat: 37.9868, lng: 23.7661 },
    phoneEmergency: '213 2013000',
    phoneGeneral: '213 2013100',
    website: 'https://www.paidon-agiasofia.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '14:30 - 08:00 (Εναλλάξ με Παίδων Αγλαΐα Κυριακού)',
        en: '14:30 - 08:00 (Pediatric Emergency Duty)'
      },
      group: 'Παιδιατρική Εφημερία',
      status: 'active'
    },
    specialties: ['pediatrics', 'surgery', 'ent', 'orthopedics', 'cardiology', 'ophthalmology'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Το μεγαλύτερο παιδιατρικό νοσοκομείο της Ελλάδας. Εφημερεύει για όλα τα παιδιατρικά περιστατικά (0-16 ετών).',
      en: 'Largest pediatric hospital in Greece. Covers all pediatric medical & surgical emergencies (ages 0-16).'
    }
  },
  {
    id: 'ippokrateio-athens',
    name: {
      el: 'Γενικό Νοσοκομείο Αθηνών «Ιπποκράτειο»',
      en: 'General Hospital of Athens "Ippokrateio"'
    },
    shortName: 'Ιπποκράτειο Αθηνών',
    type: 'General',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Βασιλίσσης Σοφίας 114, Αμπελόκηποι',
      en: '114 Vasilissis Sofias Ave, Ampelokipoi'
    },
    city: { el: 'Αθήνα', en: 'Athens' },
    postalCode: '11527',
    coordinates: { lat: 37.9875, lng: 23.7601 },
    phoneEmergency: '213 2088000',
    phoneGeneral: '213 2088100',
    website: 'https://www.hippocratio.gr',
    isOnDutyTonight: false,
    dutySchedule: {
      date: 'Αύριο',
      hours: {
        el: 'Εφημερία αύριο 08:00 - 14:30 & ολονύκτια (Ομάδα Δ)',
        en: 'Next scheduled shift tomorrow 08:00 - 14:30 (Group D)'
      },
      group: 'Ομάδα Δ',
      status: 'upcoming'
    },
    specialties: ['pathology', 'cardiology', 'surgery', 'urology', 'gynecology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Κορυφαίο καρδιολογικό και μεταμοσχευτικό κέντρο. Σήμερα εφημερεύουν τα εξωτερικά ιατρεία επειγόντων κατά την ημέρα.',
      en: 'Renowned cardiology & transplant center. Open for daytime emergencies.'
    }
  },
  {
    id: 'laiko',
    name: {
      el: 'Γενικό Νοσοκομείο Αθηνών «Λαϊκό»',
      en: 'General Hospital of Athens "Laiko"'
    },
    shortName: 'Λαϊκό Νοσοκομείο',
    type: 'University',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Αγίου Θωμά 17, Γουδή',
      en: '17 Agiou Thoma St, Goudi'
    },
    city: { el: 'Αθήνα (Γουδή)', en: 'Athens (Goudi)' },
    postalCode: '11527',
    coordinates: { lat: 37.9839, lng: 23.7656 },
    phoneEmergency: '213 2061000',
    phoneGeneral: '213 2061100',
    website: 'https://www.laiko.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '14:30 - 06:00 (Παθολογικό & Χειρουργικό)',
        en: '14:30 - 06:00 (Internal Medicine & Surgery)'
      },
      group: 'Ομάδα Α',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'urology', 'cardiology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Πανεπιστημιακό νοσοκομείο με κορυφαία παθολογική και αιματολογική μονάδα.',
      en: 'University hospital with leading internal medicine and hematology clinics.'
    }
  },
  {
    id: 'sotiria',
    name: {
      el: 'Γενικό Νοσοκομείο Νοσημάτων Θώρακος Αθηνών «Η Σωτηρία»',
      en: 'Thoracic Diseases Hospital of Athens "Sotiria"'
    },
    shortName: 'Σωτηρία',
    type: 'Specialized',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Μεσογείων 152, Χολαργός',
      en: '152 Mesogeion Ave, Cholargos'
    },
    city: { el: 'Αθήνα', en: 'Athens' },
    postalCode: '11527',
    coordinates: { lat: 38.0011, lng: 23.7799 },
    phoneEmergency: '210 7763100',
    phoneGeneral: '210 7763100',
    website: 'https://www.sotiria.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '14:30 - 06:00 (Πνευμονολογικά & Παθολογικά)',
        en: '14:30 - 06:00 (Pulmonology & Respiratory)'
      },
      group: 'Ομάδα Α',
      status: 'active'
    },
    specialties: ['pulmonology', 'pathology', 'surgery'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Εθνικό κέντρο αναφοράς για αναπνευστικά και πνευμονολογικά επείγοντα.',
      en: 'National referral center for respiratory emergencies and chest diseases.'
    }
  },
  {
    id: 'asklepieio-voulas',
    name: {
      el: 'Γενικό Νοσοκομείο «Ασκληπιείο» Βούλας',
      en: 'General Hospital "Asklepieio" of Voula'
    },
    shortName: 'Ασκληπιείο Βούλας',
    type: 'General',
    region: 'Attica',
    healthDistrict: '2η ΥΠΕ',
    address: {
      el: 'Βασιλέως Παύλου 1, Βούλα',
      en: '1 Vasileos Pavlou St, Voula'
    },
    city: { el: 'Βούλα (Νότια Προάστια)', en: 'Voula (South Athens Coast)' },
    postalCode: '16673',
    coordinates: { lat: 37.8483, lng: 23.7667 },
    phoneEmergency: '213 2163000',
    phoneGeneral: '213 2163100',
    website: 'https://www.asklepieio.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Εφημερία Νοτίων Προαστίων)',
        en: '08:00 - 08:00 (24h South Athens Emergency Duty)'
      },
      group: '2η ΥΠΕ',
      status: 'active'
    },
    specialties: ['orthopedics', 'pathology', 'surgery', 'cardiology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Εξυπηρετεί τα νότια προάστια και την παραλιακή ζώνη. Ισχυρό τμήμα ορθοπαιδικών και τροχαίων τραυμάτων.',
      en: 'Primary hospital for southern Athens and coastal suburbs with extensive trauma facilities.'
    }
  },
  {
    id: 'tzaneio-piraeus',
    name: {
      el: 'Γενικό Νοσοκομείο Πειραιά «Τζάνειο»',
      en: 'General Hospital of Piraeus "Tzaneio"'
    },
    shortName: 'Τζάνειο Πειραιά',
    type: 'General',
    region: 'Attica',
    healthDistrict: '2η ΥΠΕ',
    address: {
      el: 'Ζαννή & Αφεντούλη 1, Πειραιάς',
      en: '1 Zanni & Afentouli St, Piraeus'
    },
    city: { el: 'Πειραιάς', en: 'Piraeus' },
    postalCode: '18536',
    coordinates: { lat: 37.9351, lng: 23.6492 },
    phoneEmergency: '210 4592000',
    phoneGeneral: '210 4592111',
    website: 'https://www.tzaneio.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Εφημερία Πειραιά)',
        en: '08:00 - 08:00 (24h Full On-Duty)'
      },
      group: 'Ομάδα Πειραιά',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'ent', 'urology', 'ophthalmology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Κεντρικό νοσοκομείο Πειραιά και λιμένος. Πλήρης κάλυψη επειγόντων περιστατικών.',
      en: 'Main emergency hospital for Piraeus harbor and Saronic gulf access.'
    }
  },
  {
    id: 'nikaia-hospital',
    name: {
      el: 'Γενικό Νοσοκομείο Νίκαιας «Άγιος Παντελεήμων»',
      en: 'General Hospital of Nikaia "Agios Panteleimon"'
    },
    shortName: 'Κρατικό Νίκαιας',
    type: 'General',
    region: 'Attica',
    healthDistrict: '2η ΥΠΕ',
    address: {
      el: 'Δ. Μαντούβαλου 3, Νίκαια',
      en: '3 D. Mantouvalou St, Nikaia'
    },
    city: { el: 'Νίκαια / Πειραιάς', en: 'Nikaia / Piraeus' },
    postalCode: '18454',
    coordinates: { lat: 37.9733, lng: 23.6402 },
    phoneEmergency: '213 2077000',
    phoneGeneral: '213 2077100',
    website: 'https://www.nikaia-hosp.gr',
    isOnDutyTonight: false,
    dutySchedule: {
      date: 'Αύριο',
      hours: {
        el: 'Εφημερεύει αύριο (08:00 - 08:00)',
        en: 'On duty tomorrow (08:00 - 08:00 24h)'
      },
      group: 'Ομάδα Πειραιά Β',
      status: 'upcoming'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'neurology', 'urology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Μεγάλο νοσοκομείο επειγόντων της Δυτικής Αττικής με εκτεταμένο τραυματολογικό τμήμα.',
      en: 'Major western Attica trauma and acute care center.'
    }
  },
  {
    id: 'elena-venizelou',
    name: {
      el: 'Γενικό Μαιευτήριο «Έλενα Βενιζέλου»',
      en: 'General Maternity Hospital "Elena Venizelou"'
    },
    shortName: 'Έλενα Βενιζέλου',
    type: 'Maternity',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Πλατεία Έλενας Βενιζέλου 2, Αμπελόκηποι',
      en: '2 Platia Elenas Venizelou, Ampelokipoi'
    },
    city: { el: 'Αθήνα', en: 'Athens' },
    postalCode: '11521',
    coordinates: { lat: 37.9862, lng: 23.7542 },
    phoneEmergency: '213 2051000',
    phoneGeneral: '213 2051100',
    website: 'https://www.elena-venizelou.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '24ωρη Μαιευτική - Γυναικολογική Εφημερία (08:00 - 08:00)',
        en: '24h Emergency Obstetrics & Gynecology'
      },
      group: 'Μαιευτική Εφημερία',
      status: 'active'
    },
    specialties: ['gynecology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Ειδικό δημόσιο μαιευτήριο για τοκετούς, επιπλοκές κύησης και γυναικολογικά επείγοντα.',
      en: 'Specialized public maternity hospital for labor, obstetric complications and gynecological emergencies.'
    }
  },
  {
    id: 'dromokaiteio',
    name: {
      el: 'Ψυχιατρικό Νοσοκομείο Αττικής «Δρομοκαΐτειο»',
      en: 'Psychiatric Hospital of Attica "Dromokaiteio"'
    },
    shortName: 'Δρομοκαΐτειο',
    type: 'Psychiatric',
    region: 'Attica',
    healthDistrict: '2η ΥΠΕ',
    address: {
      el: 'Ιερά Οδός 343, Χαϊδάρι',
      en: '343 Iera Odos, Haidari'
    },
    city: { el: 'Χαϊδάρι', en: 'Haidari' },
    postalCode: '12461',
    coordinates: { lat: 38.0065, lng: 23.6591 },
    phoneEmergency: '213 2046000',
    phoneGeneral: '213 2046100',
    website: 'https://www.dromokaiteio.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '24ωρη Εφημερία Επειγόντων Ψυχιατρικής',
        en: '24h Psychiatric Emergency On-Duty'
      },
      group: 'Ψυχιατρική Εφημερία',
      status: 'active'
    },
    specialties: ['psychiatry'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Εξειδικευμένο δημόσιο ψυχιατρικό κέντρο για οξείες κρίσεις και εισαγωγές.',
      en: 'Public psychiatric emergency center for acute mental health crises.'
    }
  },
  {
    id: 'ofthalmiatreio-athenon',
    name: {
      el: 'Οφθαλμιατρείο Αθηνών',
      en: 'Athens Eye Hospital'
    },
    shortName: 'Οφθαλμιατρείο Αθηνών',
    type: 'Specialized',
    region: 'Attica',
    healthDistrict: '1η ΥΠΕ',
    address: {
      el: 'Πανεπιστημίου 26 & Σίνα, Κέντρο',
      en: '26 Panepistimiou & Sina St, Center'
    },
    city: { el: 'Αθήνα', en: 'Athens' },
    postalCode: '10672',
    coordinates: { lat: 37.9802, lng: 23.7345 },
    phoneEmergency: '213 2052000',
    phoneGeneral: '213 2052100',
    website: 'https://www.ofthalmiatreio.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '14:30 - 06:00 (Επείγοντα Οφθαλμολογικά Περιστατικά)',
        en: '14:30 - 06:00 (Ophthalmic Emergencies)'
      },
      group: 'Οφθαλμολογική',
      status: 'active'
    },
    specialties: ['ophthalmology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Ιστορικό εξειδικευμένο οφθαλμολογικό νοσοκομείο για εγκαύματα ματιών, τραύματα και αποκόλληση αμφιβληστροειδούς.',
      en: 'Specialized emergency eye clinic for acute trauma, eye burns and retinal detachments.'
    }
  },

  // THESSALONIKI (3η & 4η ΥΠΕ)
  {
    id: 'ahepa-thessaloniki',
    name: {
      el: 'Πανεπιστημιακό Γενικό Νοσοκομείο Θεσσαλονίκης «ΑΧΕΠΑ»',
      en: 'University General Hospital of Thessaloniki "AHEPA"'
    },
    shortName: 'ΠΓΝΘ ΑΧΕΠΑ',
    type: 'University',
    region: 'Thessaloniki',
    healthDistrict: '4η ΥΠΕ',
    address: {
      el: 'Στίλπωνος Κυριακίδη 1, Κέντρο',
      en: '1 Stilponos Kyriakidi St, Center'
    },
    city: { el: 'Θεσσαλονίκη', en: 'Thessaloniki' },
    postalCode: '54636',
    coordinates: { lat: 40.6294, lng: 22.9592 },
    phoneEmergency: '2313 303000',
    phoneGeneral: '2313 303111',
    website: 'https://www.ahepa-hosp.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Γενική Εφημερία Θεσσαλονίκης)',
        en: '08:00 - 08:00 (24h Full Emergency Duty)'
      },
      group: 'Ομάδα Α Θεσσαλονίκης',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'neurology', 'orthopedics', 'ophthalmology', 'ent', 'psychiatry'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Κεντρικό πανεπιστημιακό νοσοκομείο Θεσσαλονίκης. Πλήρης κάλυψη όλων των ιατρικών και χειρουργικών επειγόντων.',
      en: 'Primary university hospital in central Thessaloniki covering all acute emergencies.'
    }
  },
  {
    id: 'ippokrateio-thessaloniki',
    name: {
      el: 'Γενικό Νοσοκομείο Θεσσαλονίκης «Ιπποκράτειο»',
      en: 'General Hospital of Thessaloniki "Ippokrateio"'
    },
    shortName: 'Ιπποκράτειο Θεσσαλονίκης',
    type: 'General',
    region: 'Thessaloniki',
    healthDistrict: '4η ΥΠΕ',
    address: {
      el: 'Κωνσταντινουπόλεως 49',
      en: '49 Konstantinoupoleos St'
    },
    city: { el: 'Θεσσαλονίκη', en: 'Thessaloniki' },
    postalCode: '54642',
    coordinates: { lat: 40.6121, lng: 22.9625 },
    phoneEmergency: '2313 312000',
    phoneGeneral: '2310 892000',
    website: 'https://www.ippokratio.gr',
    isOnDutyTonight: false,
    dutySchedule: {
      date: 'Αύριο',
      hours: {
        el: 'Εφημερία αύριο (08:00 - 08:00 επομένης)',
        en: 'Scheduled on-duty tomorrow 08:00 - 08:00'
      },
      group: 'Ομάδα Β Θεσσαλονίκης',
      status: 'upcoming'
    },
    specialties: ['pathology', 'surgery', 'pediatrics', 'gynecology', 'cardiology', 'orthopedics'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Διαθέτει πλήρη παιδιατρική και μαιευτική πτέρυγα για τη Βόρεια Ελλάδα.',
      en: 'Comprehensive pediatric & maternal emergency care for Northern Greece.'
    }
  },
  {
    id: 'papageorgiou-thessaloniki',
    name: {
      el: 'Γενικό Νοσοκομείο «Παπαγεωργίου»',
      en: 'General Hospital "Papageorgiou"'
    },
    shortName: 'Παπαγεωργίου',
    type: 'General',
    region: 'Thessaloniki',
    healthDistrict: '3η ΥΠΕ',
    address: {
      el: 'Περιφερειακή Οδός Θεσσαλονίκης, Νέα Ευκαρπία',
      en: 'Thessaloniki Ring Road, Nea Efkarpia'
    },
    city: { el: 'Θεσσαλονίκη (Νέα Ευκαρπία)', en: 'Thessaloniki' },
    postalCode: '56403',
    coordinates: { lat: 40.6853, lng: 22.9469 },
    phoneEmergency: '2313 323000',
    phoneGeneral: '2313 323111',
    website: 'https://www.papageorgiou-hosp.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Γενική & Παιδιατρική Εφημερία)',
        en: '08:00 - 08:00 (24h General & Pediatric Duty)'
      },
      group: 'Ομάδα Α Θεσσαλονίκης',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'gynecology', 'ophthalmology', 'ent'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Σύγχρονο νοσοκομείο στον περιφερειακό. Παιδιατρικά, χειρουργικά και καρδιολογικά επείγοντα.',
      en: 'Modern high-capacity hospital on the ring road with full pediatric and trauma units.'
    }
  },
  {
    id: 'papanikolaou-thessaloniki',
    name: {
      el: 'Γενικό Νοσοκομείο Θεσσαλονίκης «Γ. Παπανικολάου»',
      en: 'General Hospital of Thessaloniki "G. Papanikolaou"'
    },
    shortName: 'Παπανικολάου',
    type: 'General',
    region: 'Thessaloniki',
    healthDistrict: '3η ΥΠΕ',
    address: {
      el: 'Εξοχή, Θεσσαλονίκη',
      en: 'Exochi, Thessaloniki'
    },
    city: { el: 'Θεσσαλονίκη (Εξοχή)', en: 'Thessaloniki (Exochi)' },
    postalCode: '57010',
    coordinates: { lat: 40.6262, lng: 23.0458 },
    phoneEmergency: '2313 307000',
    phoneGeneral: '2313 307100',
    website: 'https://www.gpapanikolaou.gr',
    isOnDutyTonight: false,
    dutySchedule: {
      date: 'Αύριο',
      hours: {
        el: 'Εφημερία αύριο (08:00 - 08:00)',
        en: 'On duty tomorrow (08:00 - 08:00)'
      },
      group: 'Ομάδα Β Θεσσαλονίκης',
      status: 'upcoming'
    },
    specialties: ['pulmonology', 'cardiology', 'surgery', 'orthopedics', 'neurology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Κέντρο εγκαυμάτων και θωρακοχειρουργικής Βορείου Ελλάδας.',
      en: 'Specialized burn center and cardiothoracic surgery hub.'
    }
  },

  // CRETE (7η ΥΠΕ)
  {
    id: 'pagni-heraklion',
    name: {
      el: 'Πανεπιστημιακό Γενικό Νοσοκομείο Ηρακλείου (ΠΑΓΝΗ)',
      en: 'University General Hospital of Heraklion (PAGNI)'
    },
    shortName: 'ΠΑΓΝΗ Ηρακλείου',
    type: 'University',
    region: 'Crete',
    healthDistrict: '7η ΥΠΕ',
    address: {
      el: 'Βούτες, Ηράκλειο Κρήτης',
      en: 'Voutes, Heraklion, Crete'
    },
    city: { el: 'Ηράκλειο', en: 'Heraklion' },
    postalCode: '71110',
    coordinates: { lat: 35.2974, lng: 25.0789 },
    phoneEmergency: '2810 392111',
    phoneGeneral: '2810 392000',
    website: 'https://www.pagni.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Πλήρης Εφημερία Κρήτης)',
        en: '08:00 - 08:00 (24h Full University Emergency)'
      },
      group: '7η ΥΠΕ',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'gynecology', 'neurology', 'psychiatry', 'ophthalmology', 'ent'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Το μεγαλύτερο νοσοκομείο της Κρήτης. Εξυπηρετεί όλα τα βαριά και παιδιατρικά περιστατικά του νησιού.',
      en: 'The largest university medical center in Crete with comprehensive tertiary trauma care.'
    }
  },
  {
    id: 'venizeleio-heraklion',
    name: {
      el: 'Γενικό Νοσοκομείο Ηρακλείου «Βενιζέλειο - Πανάνειο»',
      en: 'General Hospital of Heraklion "Venizeleio"'
    },
    shortName: 'Βενιζέλειο Ηρακλείου',
    type: 'General',
    region: 'Crete',
    healthDistrict: '7η ΥΠΕ',
    address: {
      el: 'Λεωφόρος Κνωσού, Ηράκλειο',
      en: 'Knossou Ave, Heraklion'
    },
    city: { el: 'Ηράκλειο', en: 'Heraklion' },
    postalCode: '71409',
    coordinates: { lat: 35.3182, lng: 25.1432 },
    phoneEmergency: '2813 408000',
    phoneGeneral: '2813 408100',
    website: 'https://www.venizeleio.gr',
    isOnDutyTonight: false,
    dutySchedule: {
      date: 'Αύριο',
      hours: {
        el: 'Εφημερεύει αύριο (εναλλάξ με ΠΑΓΝΗ)',
        en: 'On duty tomorrow alternating with PAGNI'
      },
      group: '7η ΥΠΕ',
      status: 'upcoming'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'gynecology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: false,
    notes: {
      el: 'Ιστορικό γενικό νοσοκομείο Ηρακλείου.',
      en: 'Main city hospital of Heraklion.'
    }
  },
  {
    id: 'chania-hospital',
    name: {
      el: 'Γενικό Νοσοκομείο Χανίων «Ο Άγιος Γεώργιος»',
      en: 'General Hospital of Chania "Agios Georgios"'
    },
    shortName: 'Νοσοκομείο Χανίων',
    type: 'General',
    region: 'Crete',
    healthDistrict: '7η ΥΠΕ',
    address: {
      el: 'Μουρνιές, Χανιά',
      en: 'Mournies, Chania, Crete'
    },
    city: { el: 'Χανιά', en: 'Chania' },
    postalCode: '73300',
    coordinates: { lat: 35.4801, lng: 24.0134 },
    phoneEmergency: '28213 22000',
    phoneGeneral: '28210 22000',
    website: 'https://www.chaniahospital.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '24ωρη Καθημερινή Εφημερία (08:00 - 08:00)',
        en: '24/7 Continuous Emergency Duty'
      },
      group: '7η ΥΠΕ',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'gynecology', 'ent'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: '24ωρη κάλυψη όλων των επειγόντων για την περιφερειακή ενότητα Χανίων και δυτική Κρήτη.',
      en: 'Continuous 24/7 emergency service for Chania and western Crete.'
    }
  },

  // WESTERN GREECE & PATRAS (6η ΥΠΕ)
  {
    id: 'rio-patras',
    name: {
      el: 'Πανεπιστημιακό Γενικό Νοσοκομείο Πατρών «Παναγία η Βοήθεια»',
      en: 'University General Hospital of Patras (Rio)'
    },
    shortName: 'ΠΓΝ Πατρών (Ρίο)',
    type: 'University',
    region: 'Western Greece',
    healthDistrict: '6η ΥΠΕ',
    address: {
      el: 'Ρίο, Πάτρα',
      en: 'Rio, Patras'
    },
    city: { el: 'Πάτρα (Ρίο)', en: 'Patras (Rio)' },
    postalCode: '26504',
    coordinates: { lat: 38.2977, lng: 21.7967 },
    phoneEmergency: '2613 603000',
    phoneGeneral: '2610 999111',
    website: 'https://www.pgnp.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Εφημερία Δυτικής Ελλάδας)',
        en: '08:00 - 08:00 (24h Full Emergency Duty)'
      },
      group: '6η ΥΠΕ',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'neurology', 'gynecology', 'ophthalmology', 'ent'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Μείζον πανεπιστημιακό κέντρο για Πελοπόννησο και Δυτική Ελλάδα.',
      en: 'Major tertiary center for Peloponnese, Western Greece and Ionian islands.'
    }
  },
  {
    id: 'agios-andreas-patras',
    name: {
      el: 'Γενικό Νοσοκομείο Πατρών «Ο Άγιος Ανδρέας»',
      en: 'General Hospital of Patras "Agios Andreas"'
    },
    shortName: 'Άγιος Ανδρέας Πάτρας',
    type: 'General',
    region: 'Western Greece',
    healthDistrict: '6η ΥΠΕ',
    address: {
      el: 'Τσόντου Βάρδα 2, Πάτρα',
      en: '2 Tsontou Varda St, Patras'
    },
    city: { el: 'Πάτρα', en: 'Patras' },
    postalCode: '26335',
    coordinates: { lat: 38.2285, lng: 21.7451 },
    phoneEmergency: '2613 601000',
    phoneGeneral: '2610 601000',
    website: 'https://www.agandreashosp.gr',
    isOnDutyTonight: false,
    dutySchedule: {
      date: 'Αύριο',
      hours: {
        el: 'Εφημερεύει αύριο (08:00 - 08:00)',
        en: 'On duty tomorrow (08:00 - 08:00)'
      },
      group: '6η ΥΠΕ',
      status: 'upcoming'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'urology'],
    hasPediatricEmergency: false,
    hasTraumaCenter: true,
    notes: {
      el: 'Εναλλάσσεται στις εφημερίες με το ΠΓΝ Πατρών.',
      en: 'Alternates emergency duties with Rio University Hospital.'
    }
  },

  // THESSALY & CENTRAL GREECE (5η ΥΠΕ)
  {
    id: 'larissa-university',
    name: {
      el: 'Πανεπιστημιακό Γενικό Νοσοκομείο Λάρισας (ΠΓΝΛ)',
      en: 'University General Hospital of Larissa'
    },
    shortName: 'ΠΓΝ Λάρισας',
    type: 'University',
    region: 'Thessaly',
    healthDistrict: '5η ΥΠΕ',
    address: {
      el: 'Μεζούρλο, Λάρισα',
      en: 'Mezourlo, Larissa'
    },
    city: { el: 'Λάρισα', en: 'Larissa' },
    postalCode: '41110',
    coordinates: { lat: 39.6133, lng: 22.3855 },
    phoneEmergency: '2413 501000',
    phoneGeneral: '2413 502100',
    website: 'https://www.uhl.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Πλήρης Εφημερία Θεσσαλίας)',
        en: '08:00 - 08:00 (24h Full Emergency Duty)'
      },
      group: '5η ΥΠΕ',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'neurology', 'gynecology', 'ophthalmology', 'ent'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Κεντρικό νοσοκομείο αναφοράς για ολόκληρη τη Θεσσαλία και τη Στερεά Ελλάδα.',
      en: 'Premier tertiary referral hospital for the entire region of Thessaly.'
    }
  },
  {
    id: 'volos-achillopouleio',
    name: {
      el: 'Γενικό Νοσοκομείο Βόλου «Αχιλλοπούλειο»',
      en: 'General Hospital of Volos "Achillopouleio"'
    },
    shortName: 'Αχιλλοπούλειο Βόλου',
    type: 'General',
    region: 'Thessaly',
    healthDistrict: '5η ΥΠΕ',
    address: {
      el: 'Πολυμέρη 134, Βόλος',
      en: '134 Polymeri St, Volos'
    },
    city: { el: 'Βόλος', en: 'Volos' },
    postalCode: '38222',
    coordinates: { lat: 39.3552, lng: 22.9568 },
    phoneEmergency: '24213 51000',
    phoneGeneral: '24210 94200',
    website: 'https://www.ghv.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '24ωρη Καθημερινή Εφημερία Μαγνησίας',
        en: '24/7 Magnesia Region Emergency Duty'
      },
      group: '5η ΥΠΕ',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'gynecology'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Εξυπηρετεί τον Βόλο, το Πήλιο και τις Σποράδες.',
      en: 'Serves Volos, Pelion and the Sporades islands.'
    }
  },

  // EPIRUS (6η ΥΠΕ)
  {
    id: 'ioannina-university',
    name: {
      el: 'Πανεπιστημιακό Γενικό Νοσοκομείο Ιωαννίνων (ΠΓΝΙ)',
      en: 'University General Hospital of Ioannina'
    },
    shortName: 'ΠΓΝ Ιωαννίνων',
    type: 'University',
    region: 'Epirus',
    healthDistrict: '6η ΥΠΕ',
    address: {
      el: 'Λεωφόρος Σταύρου Νιάρχου, Δουρούτη',
      en: 'Stavrou Niarchou Ave, Dourouti'
    },
    city: { el: 'Ιωάννινα', en: 'Ioannina' },
    postalCode: '45500',
    coordinates: { lat: 39.6158, lng: 20.8415 },
    phoneEmergency: '26510 99111',
    phoneGeneral: '26510 99211',
    website: 'https://www.uhi.gr',
    isOnDutyTonight: true,
    dutySchedule: {
      date: 'Σήμερα / Απόψε',
      hours: {
        el: '08:00 - 08:00 (24ωρη Γενική Εφημερία Ηπείρου)',
        en: '08:00 - 08:00 (24h Full Emergency Duty)'
      },
      group: '6η ΥΠΕ',
      status: 'active'
    },
    specialties: ['pathology', 'surgery', 'cardiology', 'orthopedics', 'pediatrics', 'neurology', 'gynecology', 'ophthalmology', 'ent'],
    hasPediatricEmergency: true,
    hasTraumaCenter: true,
    notes: {
      el: 'Κορυφαίο πανεπιστημιακό κέντρο Ηπείρου, Κέρκυρας, Λευκάδας και Δυτικής Μακεδονίας.',
      en: 'Major tertiary referral hospital for Epirus, Corfu, Lefkada and Western Macedonia.'
    }
  }
];

export const REGIONS_LIST = [
  { id: 'all', name: { el: 'Όλες οι Περιφέρειες', en: 'All Regions' } },
  { id: 'Attica', name: { el: 'Αττική (Αθήνα - Πειραιάς)', en: 'Attica (Athens & Piraeus)' } },
  { id: 'Thessaloniki', name: { el: 'Θεσσαλονίκη & Κ. Μακεδονία', en: 'Thessaloniki & Central Macedonia' } },
  { id: 'Crete', name: { el: 'Κρήτη (Ηράκλειο, Χανιά, Ρέθυμνο)', en: 'Crete (Heraklion, Chania, Rethymno)' } },
  { id: 'Western Greece', name: { el: 'Δυτική Ελλάδα (Πάτρα)', en: 'Western Greece (Patras)' } },
  { id: 'Thessaly', name: { el: 'Θεσσαλία (Λάρισα, Βόλος)', en: 'Thessaly (Larissa, Volos)' } },
  { id: 'Epirus', name: { el: 'Ήπειρος (Ιωάννινα)', en: 'Epirus (Ioannina)' } }
];

export const DEFAULT_USER_LOCATION = {
  lat: 37.9753, // Syntagma Square, Athens
  lng: 23.7361,
  label: 'Αθήνα (Σύνταγμα) / Athens Center',
  isCustom: false
};

export const POPULAR_LOCATIONS = [
  { label: 'Αθήνα (Κέντρο - Σύνταγμα)', enLabel: 'Athens (Center - Syntagma)', lat: 37.9753, lng: 23.7361 },
  { label: 'Πειραιάς (Λιμάνι)', enLabel: 'Piraeus (Port)', lat: 37.9429, lng: 23.6469 },
  { label: 'Κηφισιά / Βόρεια Προάστια', enLabel: 'Kifisia / North Athens', lat: 38.0744, lng: 23.8115 },
  { label: 'Γλυφάδα / Νότια Προάστια', enLabel: 'Glyfada / South Athens', lat: 37.8631, lng: 23.7538 },
  { label: 'Περιστέρι / Δυτική Αττική', enLabel: 'Peristeri / West Athens', lat: 38.0135, lng: 23.6917 },
  { label: 'Θεσσαλονίκη (Πλατεία Αριστοτέλους)', enLabel: 'Thessaloniki (Aristotelous Sq)', lat: 40.6323, lng: 22.9409 },
  { label: 'Ηράκλειο Κρήτης (Λιοντάρια)', enLabel: 'Heraklion Crete (Center)', lat: 35.3387, lng: 25.1332 },
  { label: 'Χανιά (Ενετικό Λιμάνι)', enLabel: 'Chania (Old Venetian Port)', lat: 35.5186, lng: 24.0180 },
  { label: 'Πάτρα (Πλατεία Γεωργίου)', enLabel: 'Patras (Georgiou Sq)', lat: 38.2466, lng: 21.7345 },
  { label: 'Λάρισα (Κεντρική Πλατεία)', enLabel: 'Larissa (Central Sq)', lat: 39.6390, lng: 22.4191 },
  { label: 'Ιωάννινα (Κάστρο)', enLabel: 'Ioannina (Castle)', lat: 39.6703, lng: 20.8580 }
];
