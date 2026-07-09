import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const initializeMockDB = () => {
  if (localStorage.getItem('mock_db_initialized')) return;

  const departments = [
    { id: 1,  name: 'Cardiology',              description: 'Heart care, ECG, angioplasty & cardiovascular diagnostics' },
    { id: 2,  name: 'Pediatrics',              description: 'Infant, child and adolescent healthcare & vaccinations' },
    { id: 3,  name: 'Orthopedics',             description: 'Bone, joint, ligament, spine & muscle treatment' },
    { id: 4,  name: 'Neurology',               description: 'Brain, spine, stroke & nervous system disorders' },
    { id: 5,  name: 'Dermatology',             description: 'Skin, hair, nail disorders & cosmetic dermatology' },
    { id: 6,  name: 'Gynecology & Obstetrics', description: "Women's health, pregnancy, fertility & reproductive care" },
    { id: 7,  name: 'Ophthalmology',           description: 'Eye care, vision testing, cataract & retina surgery' },
    { id: 8,  name: 'ENT',                     description: 'Ear, nose & throat disorders, hearing and sinus care' },
    { id: 9,  name: 'Psychiatry',              description: 'Mental health, anxiety, depression & behavioural therapy' },
    { id: 10, name: 'Oncology',                description: 'Cancer diagnosis, chemotherapy & radiation therapy' },
    { id: 11, name: 'Gastroenterology',        description: 'Digestive system, liver, stomach & bowel disorders' },
    { id: 12, name: 'Pulmonology',             description: 'Lung diseases, asthma, COPD & respiratory care' },
    { id: 13, name: 'Nephrology',              description: 'Kidney disease, dialysis & renal transplant care' },
    { id: 14, name: 'Urology',                 description: 'Urinary tract, prostate, kidney stones & bladder care' },
    { id: 15, name: 'Endocrinology',           description: 'Diabetes, thyroid, hormonal & metabolic disorders' },
    { id: 16, name: 'Rheumatology',            description: 'Arthritis, autoimmune & musculoskeletal joint diseases' },
    { id: 17, name: 'Hematology',              description: 'Blood disorders, anaemia, clotting & blood cancer' },
    { id: 18, name: 'General Surgery',         description: 'Appendix, hernia, gallbladder & general surgical procedures' },
    { id: 19, name: 'Dentistry',               description: 'Oral health, dental implants, braces & root canal' },
    { id: 20, name: 'Physiotherapy',           description: 'Rehabilitation, sports injuries & pain management' },
  ];

  const users = [
    { id:  1, email: 'admin@medcure.com',                 password: 'admin123',   fullName: 'System Admin',            phone: '+91-98765-00001', role: 'ADMIN'   },
    { id:  2, email: 'rahul.mehta@gmail.com',             password: 'patient123', fullName: 'Rahul Mehta',             phone: '+91-98765-00002', role: 'PATIENT' },
    { id:  3, email: 'priya.sharma@outlook.com',          password: 'patient123', fullName: 'Priya Sharma',            phone: '+91-98765-00003', role: 'PATIENT' },
    { id:  4, email: 'rajesh.kumar@medcure.com',          password: 'doctor123',  fullName: 'Dr. Rajesh Kumar',        phone: '+91-98765-10001', role: 'DOCTOR'  },
    { id:  5, email: 'sunita.reddy@medcure.com',          password: 'doctor123',  fullName: 'Dr. Sunita Reddy',        phone: '+91-98765-10002', role: 'DOCTOR'  },
    { id:  6, email: 'vikram.chauhan@medcure.com',        password: 'doctor123',  fullName: 'Dr. Vikram Chauhan',      phone: '+91-98765-10003', role: 'DOCTOR'  },
    { id:  7, email: 'anita.desai@medcure.com',           password: 'doctor123',  fullName: 'Dr. Anita Desai',         phone: '+91-98765-10004', role: 'DOCTOR'  },
    { id:  8, email: 'mohan.pillai@medcure.com',          password: 'doctor123',  fullName: 'Dr. Mohan Pillai',        phone: '+91-98765-10005', role: 'DOCTOR'  },
    { id:  9, email: 'meena.krishnamurthy@medcure.com',   password: 'doctor123',  fullName: 'Dr. Meena Krishnamurthy', phone: '+91-98765-10006', role: 'DOCTOR'  },
    { id: 10, email: 'suresh.iyer@medcure.com',           password: 'doctor123',  fullName: 'Dr. Suresh Iyer',         phone: '+91-98765-10007', role: 'DOCTOR'  },
    { id: 11, email: 'arun.mishra@medcure.com',           password: 'doctor123',  fullName: 'Dr. Arun Mishra',         phone: '+91-98765-10008', role: 'DOCTOR'  },
    { id: 12, email: 'kavitha.menon@medcure.com',         password: 'doctor123',  fullName: 'Dr. Kavitha Menon',       phone: '+91-98765-10009', role: 'DOCTOR'  },
    { id: 13, email: 'sanjay.gupta@medcure.com',          password: 'doctor123',  fullName: 'Dr. Sanjay Gupta',        phone: '+91-98765-10010', role: 'DOCTOR'  },
    { id: 14, email: 'ramesh.bhatia@medcure.com',         password: 'doctor123',  fullName: 'Dr. Ramesh Bhatia',       phone: '+91-98765-10011', role: 'DOCTOR'  },
    { id: 15, email: 'deepak.verma@medcure.com',          password: 'doctor123',  fullName: 'Dr. Deepak Verma',        phone: '+91-98765-10012', role: 'DOCTOR'  },
    { id: 16, email: 'nalini.joshi@medcure.com',          password: 'doctor123',  fullName: 'Dr. Nalini Joshi',        phone: '+91-98765-10013', role: 'DOCTOR'  },
    { id: 17, email: 'ashok.tiwari@medcure.com',          password: 'doctor123',  fullName: 'Dr. Ashok Tiwari',        phone: '+91-98765-10014', role: 'DOCTOR'  },
    { id: 18, email: 'savita.nair@medcure.com',           password: 'doctor123',  fullName: 'Dr. Savita Nair',         phone: '+91-98765-10015', role: 'DOCTOR'  },
    { id: 19, email: 'harish.das@medcure.com',            password: 'doctor123',  fullName: 'Dr. Harish Das',          phone: '+91-98765-10016', role: 'DOCTOR'  },
    { id: 20, email: 'padma.subramaniam@medcure.com',     password: 'doctor123',  fullName: 'Dr. Padma Subramaniam',   phone: '+91-98765-10017', role: 'DOCTOR'  },
    { id: 21, email: 'rakesh.pandey@medcure.com',         password: 'doctor123',  fullName: 'Dr. Rakesh Pandey',       phone: '+91-98765-10018', role: 'DOCTOR'  },
    { id: 22, email: 'swati.agarwal@medcure.com',         password: 'doctor123',  fullName: 'Dr. Swati Agarwal',       phone: '+91-98765-10019', role: 'DOCTOR'  },
    { id: 23, email: 'nitin.kapoor@medcure.com',          password: 'doctor123',  fullName: 'Dr. Nitin Kapoor',        phone: '+91-98765-10020', role: 'DOCTOR'  },
  ];

  const doctors = [
    { id:  1, user: users[3],  department: departments[0],  specialization: 'Interventional Cardiologist',   experience: '15 Years', biography: 'Dr. Rajesh Kumar is a senior interventional cardiologist specialising in angioplasty, stenting, and advanced heart failure management.',                         consultationFee: '₹1,200' },
    { id:  2, user: users[4],  department: departments[1],  specialization: 'Pediatrician',                  experience: '10 Years', biography: 'Dr. Sunita Reddy is a dedicated paediatrician focused on child development, vaccination schedules, and neonatal care.',                                   consultationFee: '₹700'   },
    { id:  3, user: users[5],  department: departments[2],  specialization: 'Orthopaedic Surgeon',           experience: '12 Years', biography: 'Dr. Vikram Chauhan is an expert in joint replacement, sports injuries, and spine correction surgeries.',                                                   consultationFee: '₹1,000' },
    { id:  4, user: users[6],  department: departments[3],  specialization: 'Neurologist',                   experience: '14 Years', biography: 'Dr. Anita Desai specialises in stroke management, epilepsy, Parkinson\'s disease, and neuro-rehabilitation.',                                             consultationFee: '₹1,100' },
    { id:  5, user: users[7],  department: departments[4],  specialization: 'Dermatologist',                 experience: '9 Years',  biography: 'Dr. Mohan Pillai treats acne, psoriasis, eczema and performs cosmetic procedures like laser therapy and chemical peels.',                                 consultationFee: '₹800'   },
    { id:  6, user: users[8],  department: departments[5],  specialization: 'Gynaecologist & Obstetrician',  experience: '18 Years', biography: 'Dr. Meena Krishnamurthy is a highly experienced gynaecologist with expertise in high-risk pregnancy and laparoscopic surgery.',                           consultationFee: '₹1,000' },
    { id:  7, user: users[9],  department: departments[6],  specialization: 'Ophthalmologist',               experience: '11 Years', biography: 'Dr. Suresh Iyer specialises in cataract surgery, retinal disorders, LASIK and paediatric ophthalmology.',                                                 consultationFee: '₹900'   },
    { id:  8, user: users[10], department: departments[7],  specialization: 'ENT Specialist',                experience: '13 Years', biography: 'Dr. Arun Mishra treats sinusitis, tonsillitis, hearing loss and performs endoscopic nasal and ear surgeries.',                                             consultationFee: '₹850'   },
    { id:  9, user: users[11], department: departments[8],  specialization: 'Psychiatrist',                  experience: '10 Years', biography: 'Dr. Kavitha Menon is a compassionate psychiatrist treating anxiety, depression, OCD, schizophrenia and addiction disorders.',                              consultationFee: '₹1,200' },
    { id: 10, user: users[12], department: departments[9],  specialization: 'Medical Oncologist',            experience: '16 Years', biography: 'Dr. Sanjay Gupta is a leading oncologist specialising in breast, lung and gastrointestinal cancers with precision medicine.',                             consultationFee: '₹1,500' },
    { id: 11, user: users[13], department: departments[10], specialization: 'Gastroenterologist',            experience: '12 Years', biography: 'Dr. Ramesh Bhatia treats liver disease, IBS, Crohn\'s disease and performs colonoscopy & endoscopy procedures.',                                          consultationFee: '₹1,000' },
    { id: 12, user: users[14], department: departments[11], specialization: 'Pulmonologist',                 experience: '11 Years', biography: 'Dr. Deepak Verma is an expert in asthma, COPD, sleep apnea, tuberculosis and interstitial lung diseases.',                                                 consultationFee: '₹900'   },
    { id: 13, user: users[15], department: departments[12], specialization: 'Nephrologist',                  experience: '14 Years', biography: 'Dr. Nalini Joshi specialises in chronic kidney disease, dialysis management and renal transplant evaluation.',                                             consultationFee: '₹1,100' },
    { id: 14, user: users[16], department: departments[13], specialization: 'Urologist',                     experience: '13 Years', biography: 'Dr. Ashok Tiwari treats kidney stones, prostate disorders, urinary incontinence and performs laparoscopic urological surgery.',                            consultationFee: '₹1,000' },
    { id: 15, user: users[17], department: departments[14], specialization: 'Endocrinologist',               experience: '10 Years', biography: 'Dr. Savita Nair manages diabetes, thyroid disorders, PCOS, adrenal diseases and metabolic syndromes.',                                                    consultationFee: '₹950'   },
    { id: 16, user: users[18], department: departments[15], specialization: 'Rheumatologist',                experience: '9 Years',  biography: 'Dr. Harish Das treats rheumatoid arthritis, lupus, gout, vasculitis and other autoimmune conditions.',                                                    consultationFee: '₹900'   },
    { id: 17, user: users[19], department: departments[16], specialization: 'Haematologist',                 experience: '15 Years', biography: 'Dr. Padma Subramaniam specialises in anaemia, leukaemia, lymphoma and bone marrow transplantation.',                                                      consultationFee: '₹1,300' },
    { id: 18, user: users[20], department: departments[17], specialization: 'General Surgeon',               experience: '17 Years', biography: 'Dr. Rakesh Pandey performs laparoscopic cholecystectomy, appendectomy, hernia repair and general abdominal surgeries.',                                   consultationFee: '₹1,000' },
    { id: 19, user: users[21], department: departments[18], specialization: 'Dental Surgeon',                experience: '8 Years',  biography: 'Dr. Swati Agarwal provides dental implants, root canal therapy, orthodontics and cosmetic dentistry services.',                                           consultationFee: '₹600'   },
    { id: 20, user: users[22], department: departments[19], specialization: 'Physiotherapist',               experience: '7 Years',  biography: 'Dr. Nitin Kapoor specialises in post-surgical rehabilitation, sports injury recovery and chronic pain management.',                                       consultationFee: '₹500'   },
  ];

  const slotDates = ['2026-07-10', '2026-07-11', '2026-07-12'];
  const slotTimes = [
    { start: '09:00', end: '09:30' },
    { start: '10:30', end: '11:00' },
    { start: '14:00', end: '14:30' },
  ];
  const slots = [];
  let slotId = 1;
  doctors.forEach(doc => {
    slotDates.forEach(date => {
      slotTimes.forEach(t => {
        slots.push({ id: slotId++, doctor: doc, date, startTime: t.start, endTime: t.end, isBooked: false });
      });
    });
  });

  localStorage.setItem('mock_users', JSON.stringify(users));
  localStorage.setItem('mock_departments', JSON.stringify(departments));
  localStorage.setItem('mock_doctors', JSON.stringify(doctors));
  localStorage.setItem('mock_slots', JSON.stringify(slots));
  localStorage.setItem('mock_appointments', JSON.stringify([]));
  localStorage.setItem('mock_notifications', JSON.stringify([]));
  localStorage.setItem('mock_db_initialized', 'true');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('mock_db_v4')) {
      ['mock_db_initialized','mock_db_v2','mock_db_v3',
       'mock_users','mock_departments','mock_doctors',
       'mock_slots','mock_appointments','mock_notifications'].forEach(k => localStorage.removeItem(k));
      localStorage.setItem('mock_db_v4', 'true');
    }
    initializeMockDB();
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const api = axios.create({ baseURL: 'http://localhost:8080' });

  api.interceptors.request.use(
    config => {
      const currentToken = localStorage.getItem('token');
      if (currentToken) config.headers.Authorization = `Bearer ${currentToken}`;
      return config;
    },
    error => Promise.reject(error)
  );

  api.interceptors.response.use(
    response => response,
    async error => {
      if (!error.response || error.response.status === 0 || error.code === 'ERR_NETWORK') {
        return handleOfflineRequest(error.config);
      }
      return Promise.reject(error);
    }
  );

  const handleOfflineRequest = config => {
    const url    = config.url.replace('http://localhost:8080', '');
    const method = config.method.toLowerCase();

    const mockUsers        = JSON.parse(localStorage.getItem('mock_users')        || '[]');
    const mockDoctors      = JSON.parse(localStorage.getItem('mock_doctors')      || '[]');
    const mockDepartments  = JSON.parse(localStorage.getItem('mock_departments')  || '[]');
    const mockSlots        = JSON.parse(localStorage.getItem('mock_slots')        || '[]');
    const mockAppointments = JSON.parse(localStorage.getItem('mock_appointments') || '[]');
    const mockNotifications= JSON.parse(localStorage.getItem('mock_notifications')|| '[]');
    const currentUser      = JSON.parse(localStorage.getItem('user'));

    const save = (key, data) => localStorage.setItem(`mock_${key}`, JSON.stringify(data));

    if (url.match(/\/api\/doctors\/\d+\/slots/) && method === 'get') {
      const doctorId = Number(url.match(/\/api\/doctors\/(\d+)\/slots/)[1]);
      return Promise.resolve({ data: mockSlots.filter(s => s.doctor.id === doctorId && !s.isBooked) });
    }

    if (url.startsWith('/api/doctors') && method === 'get') {
      const query = new URLSearchParams(url.split('?')[1] || '').get('query')?.toLowerCase() || '';
      const filtered = mockDoctors.filter(d =>
        d.user.fullName.toLowerCase().includes(query) ||
        d.specialization.toLowerCase().includes(query) ||
        d.department.name.toLowerCase().includes(query)
      );
      return Promise.resolve({ data: filtered });
    }

    if (url === '/api/appointments/book' && method === 'post') {
      const body = JSON.parse(config.data);
      const slot = mockSlots.find(s => s.id === Number(body.slotId));
      if (!slot || slot.isBooked) {
        return Promise.reject({ response: { data: { message: 'This slot is already booked.' } } });
      }
      slot.isBooked = true;
      save('slots', mockSlots);
      const newAppt = {
        id: mockAppointments.length + 1,
        patient: currentUser,
        doctor: slot.doctor,
        slot,
        status: 'SCHEDULED',
        clinicalNotes: '',
        prescription: '',
        createdAt: new Date().toISOString(),
      };
      mockAppointments.unshift(newAppt);
      save('appointments', mockAppointments);
      mockNotifications.unshift({
        id: mockNotifications.length + 1,
        user: currentUser,
        message: `Your appointment with ${slot.doctor.user.fullName} on ${slot.date} has been booked.`,
        isRead: false,
      });
      save('notifications', mockNotifications);
      return Promise.resolve({ data: newAppt });
    }

    if (url === '/api/appointments/my' && method === 'get') {
      return Promise.resolve({ data: mockAppointments.filter(a => a.patient.id === currentUser.id) });
    }

    if (url.match(/\/api\/appointments\/\d+\/reschedule/) && method === 'put') {
      const apptId  = Number(url.match(/\/api\/appointments\/(\d+)\/reschedule/)[1]);
      const body    = JSON.parse(config.data);
      const appt    = mockAppointments.find(a => a.id === apptId);
      const newSlot = mockSlots.find(s => s.id === Number(body.newSlotId));
      if (newSlot.isBooked) {
        return Promise.reject({ response: { data: { message: 'The new slot is already booked.' } } });
      }
      const oldSlot = mockSlots.find(s => s.id === appt.slot.id);
      if (oldSlot) oldSlot.isBooked = false;
      newSlot.isBooked = true;
      save('slots', mockSlots);
      appt.slot   = newSlot;
      appt.status = 'RESCHEDULED';
      save('appointments', mockAppointments);
      mockNotifications.unshift({
        id: mockNotifications.length + 1,
        user: currentUser,
        message: `Your appointment with ${appt.doctor.user.fullName} rescheduled to ${newSlot.date} at ${newSlot.startTime}.`,
        isRead: false,
      });
      save('notifications', mockNotifications);
      return Promise.resolve({ data: appt });
    }

    if (url.match(/\/api\/appointments\/\d+/) && method === 'delete') {
      const apptId = Number(url.match(/\/api\/appointments\/(\d+)/)[1]);
      const appt   = mockAppointments.find(a => a.id === apptId);
      if (!appt) {
        return Promise.reject({ response: { data: { message: 'Appointment not found.' } } });
      }
      const slot = mockSlots.find(s => s.id === appt.slot?.id);
      if (slot) slot.isBooked = false;
      save('slots', mockSlots);
      appt.status = 'CANCELLED';
      save('appointments', mockAppointments);
      return Promise.resolve({ data: appt });
    }

    if (url === '/api/doctor/appointments' && method === 'get') {
      const docProfile = mockDoctors.find(d => d.user.id === currentUser.id);
      return Promise.resolve({ data: mockAppointments.filter(a => a.doctor.id === docProfile.id) });
    }

    if (url === '/api/doctor/slots' && method === 'post') {
      const body       = JSON.parse(config.data);
      const docProfile = mockDoctors.find(d => d.user.id === currentUser.id);
      const newSlot    = {
        id: mockSlots.length + 1,
        doctor: docProfile,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        isBooked: false,
      };
      mockSlots.push(newSlot);
      save('slots', mockSlots);
      return Promise.resolve({ data: newSlot });
    }

    if (url.match(/\/api\/doctor\/appointments\/\d+\/clinical/) && method === 'put') {
      const apptId = Number(url.match(/\/api\/doctor\/appointments\/(\d+)\/clinical/)[1]);
      const body   = JSON.parse(config.data);
      const appt   = mockAppointments.find(a => a.id === apptId);
      appt.clinicalNotes = body.clinicalNotes;
      appt.prescription  = body.prescription;
      save('appointments', mockAppointments);
      return Promise.resolve({ data: appt });
    }

    if (url.match(/\/api\/doctor\/appointments\/\d+\/complete/) && method === 'put') {
      const apptId = Number(url.match(/\/api\/doctor\/appointments\/(\d+)\/complete/)[1]);
      const appt   = mockAppointments.find(a => a.id === apptId);
      appt.status  = 'COMPLETED';
      save('appointments', mockAppointments);
      mockNotifications.unshift({
        id: mockNotifications.length + 1,
        user: appt.patient,
        message: `Your visit with ${appt.doctor.user.fullName} is complete. View your prescription.`,
        isRead: false,
      });
      save('notifications', mockNotifications);
      return Promise.resolve({ data: appt });
    }

    if (url === '/api/admin/reports' && method === 'get') {
      return Promise.resolve({
        data: {
          totalDoctors:           mockDoctors.length,
          totalPatients:          mockUsers.filter(u => u.role === 'PATIENT').length,
          totalAppointments:      mockAppointments.length,
          scheduledAppointments:  mockAppointments.filter(a => a.status === 'SCHEDULED' || a.status === 'RESCHEDULED').length,
          completedAppointments:  mockAppointments.filter(a => a.status === 'COMPLETED').length,
          cancelledAppointments:  mockAppointments.filter(a => a.status === 'CANCELLED').length,
        },
      });
    }

    if (url === '/api/admin/departments' && method === 'get') {
      return Promise.resolve({ data: mockDepartments });
    }

    if (url === '/api/admin/departments' && method === 'post') {
      const body    = JSON.parse(config.data);
      const newDept = { id: mockDepartments.length + 1, name: body.name, description: body.description };
      mockDepartments.push(newDept);
      save('departments', mockDepartments);
      return Promise.resolve({ data: newDept });
    }

    if (url.match(/\/api\/admin\/departments\/\d+/) && method === 'delete') {
      const deptId   = Number(url.match(/\/api\/admin\/departments\/(\d+)/)[1]);
      save('departments', mockDepartments.filter(d => d.id !== deptId));
      return Promise.resolve({ data: { success: true } });
    }

    if (url.match(/\/api\/admin\/doctors\/\d+/) && method === 'delete') {
      const docId = Number(url.match(/\/api\/admin\/doctors\/(\d+)/)[1]);
      const doc   = mockDoctors.find(d => d.id === docId);
      save('doctors', mockDoctors.filter(d => d.id !== docId));
      save('users',   mockUsers.filter(u => u.id !== doc.user.id));
      return Promise.resolve({ data: { success: true } });
    }

    if (url === '/api/notifications' && method === 'get') {
      return Promise.resolve({ data: mockNotifications.filter(n => n.user.id === currentUser.id) });
    }

    if (url.match(/\/api\/notifications\/\d+\/read/) && method === 'put') {
      const notifId = Number(url.match(/\/api\/notifications\/(\d+)\/read/)[1]);
      const notif   = mockNotifications.find(n => n.id === notifId);
      if (notif) notif.isRead = true;
      save('notifications', mockNotifications);
      return Promise.resolve({ data: { success: true } });
    }

    if (url === '/api/chat' && method === 'post') {
      const msg = JSON.parse(config.data).message.toLowerCase();
      let reply = 'Thank you for reaching out. Please search for doctors or manage your bookings using the main navigation.';
      if (msg.includes('book') || msg.includes('appointment') || msg.includes('schedule')) {
        reply = 'To book an appointment, search for a doctor in the Search tab, then click on an available time slot.';
      } else if (msg.includes('cancel')) {
        reply = "You can cancel any scheduled appointment from the 'My Appointments' tab by clicking the Cancel button.";
      } else if (msg.includes('doctor') || msg.includes('specialist')) {
        reply = 'MEDCURE has specialists across 20 departments including Cardiology, Neurology, Oncology, Pediatrics, and more.';
      } else if (msg.includes('hello') || msg.includes('hi')) {
        reply = 'Hello! Welcome to MEDCURE Hospitals. How can I assist you today?';
      }
      return Promise.resolve({ data: { reply } });
    }

    return Promise.reject(config);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      const { token, id, fullName, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, email, fullName, role }));
      setToken(token);
      setUser({ id, email, fullName, role });
      setIsOfflineMode(false);
      return { success: true, role };
    } catch (error) {
      if (!error.response || error.response.status === 0 || error.code === 'ERR_NETWORK') {
        const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
        const found = mockUsers.find(u => u.email === email && u.password === password);
        if (found) {
          const fakeToken = 'demo-token';
          localStorage.setItem('token', fakeToken);
          localStorage.setItem('user', JSON.stringify({ id: found.id, email: found.email, fullName: found.fullName, role: found.role }));
          setToken(fakeToken);
          setUser({ id: found.id, email: found.email, fullName: found.fullName, role: found.role });
          setIsOfflineMode(true);
          return { success: true, role: found.role };
        }
      }
      return { success: false, error: error.response?.data || 'Login failed. Please check your credentials.' };
    }
  };

  const register = async (registerData) => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', registerData);
      return { success: true };
    } catch (error) {
      if (!error.response || error.response.status === 0 || error.code === 'ERR_NETWORK') {
        const mockUsers       = JSON.parse(localStorage.getItem('mock_users')       || '[]');
        const mockDoctors     = JSON.parse(localStorage.getItem('mock_doctors')     || '[]');
        const mockDepartments = JSON.parse(localStorage.getItem('mock_departments') || '[]');
        if (mockUsers.some(u => u.email === registerData.email)) {
          return { success: false, error: 'Email already in use.' };
        }
        const newUser = {
          id: mockUsers.length + 1,
          email: registerData.email,
          password: registerData.password,
          fullName: registerData.fullName,
          phone: registerData.phone,
          role: registerData.role,
        };
        mockUsers.push(newUser);
        localStorage.setItem('mock_users', JSON.stringify(mockUsers));
        if (registerData.role === 'DOCTOR') {
          const dept   = mockDepartments.find(d => d.id === Number(registerData.departmentId)) || mockDepartments[0];
          const newDoc = {
            id: mockDoctors.length + 1,
            user: newUser,
            department: dept,
            specialization: registerData.specialization,
            experience: registerData.experience,
            biography: registerData.biography,
            consultationFee: registerData.consultationFee,
          };
          mockDoctors.push(newDoc);
          localStorage.setItem('mock_doctors', JSON.stringify(mockDoctors));
        }
        return { success: true };
      }
      return { success: false, error: error.response?.data || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, api, isOfflineMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
