import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useNotification from '../../hooks/useNotification';
import NotificationContainer from '../elements/Notification/NotificationContainer';
import { validateField, hasValidationErrors } from '../../utils/validation';

// Import components
import ProfilePhoto from '../elements/SpecialistProfile/ProfilePhoto/ProfilePhoto';
import InfoField from '../elements/SpecialistProfile/InfoFields/InfoField';
import BiographyField from '../elements/SpecialistProfile/BiographyField/BiographyField';
import SkillsSection from '../elements/SpecialistProfile/SkillsSection';
import { ALL_SKILLS } from '../elements/SpecialistProfile/skills.data';
import { saveRoleDetails, updateProfessionalQualification } from '../services/ProfessionalQualificationService';
import { 
    getSpecialistDetails, 
    createSpecialistDetails, 
    updateSpecialistDetails 
} from '../services/SpecialistDetailsService';
import CertificatesSection from '../elements/SpecialistProfile/CertificatesSection/CertificatesSection';
import WorkFormatSection from '../elements/SpecialistProfile/WorkFormatSection/WorkFormatSection';
import SaveButton from '../elements/SpecialistProfile/SaveButton/SaveButton';
import ProfileToggle from '../elements/SpecialistProfile/ProfileToggle/ProfileToggle';

// Import CSS
import '../elements/SpecialistProfile/SpecialistProfile.css';

// Конвертує порожній рядок у null для валідації на бекенді
const emptyToNull = (value) => {
  if (value === "" || value === undefined) return null;
  return value;
};

// Конвертує перекладений текст навичок назад в ключі перекладу
const convertTranslatedSkillsToKeys = (translatedSkills, allSkills, t) => {
  // Якщо передано рядок замість масиву, конвертуємо в масив
  if (typeof translatedSkills === 'string') {
    translatedSkills = translatedSkills.trim() ? [translatedSkills.trim()] : [];
  }
  
  if (!translatedSkills || !Array.isArray(translatedSkills)) {
    return [];
  }
  
  // Фільтруємо порожні рядки та пробіли
  const filteredSkills = translatedSkills.filter(skill => skill && skill.trim() !== '');
  
  const result = filteredSkills.map(translatedSkill => {
    // Знаходимо ключ, для якого переклад дорівнює перекладеному тексту
    const foundKey = allSkills.find(skillKey => t(skillKey) === translatedSkill);
    return foundKey || translatedSkill; // Якщо не знайдено, повертаємо оригінал
  });
  
  return result;
};

// Константа з мапінгом ключів на тексти для fallback
const WORK_FORMAT_TRANSLATIONS = {
  uk: {
    'work_format_online_telegram': 'Онлайн супровід у Telegram',
    'work_format_offline_gym': 'Офлайн тренування в залі (за домовленістю)',
    'work_format_weekly_plan': 'Щотижневі корекції плану',
    'work_format_online_zoom': 'Онлайн консультації через Zoom',
    'work_format_office_sessions': 'Очні сесії в кабінеті (за домовленістю)',
    'work_format_therapy_plans': 'Щотижневі терапевтичні плани',
    'work_format_clinic_visits': 'Очні прийоми в клініці (за домовленістю)',
    'work_format_prevention_plans': 'Плани профілактики та лікування',
    'work_format_nutrition_plan': 'Щотижневі корекції плану харчування'
  },
  en: {
    'work_format_online_telegram': 'Online support in Telegram',
    'work_format_offline_gym': 'Offline training in gym (by appointment)',
    'work_format_weekly_plan': 'Weekly plan corrections',
    'work_format_online_zoom': 'Online consultations via Zoom',
    'work_format_office_sessions': 'In-person sessions in office (by appointment)',
    'work_format_therapy_plans': 'Weekly therapy plans',
    'work_format_clinic_visits': 'In-person visits at clinic (by appointment)',
    'work_format_prevention_plans': 'Prevention and treatment plans',
    'work_format_nutrition_plan': 'Weekly nutrition plan corrections'
  }
};

// Конвертує перекладений текст форматів роботи назад в ключі перекладу
const convertTranslatedWorkFormatsToKeys = (translatedFormats, allTemplates, t) => {
  if (!translatedFormats || !Array.isArray(translatedFormats)) return [];
  
  return translatedFormats.map(translatedFormat => {
    const foundKey = allTemplates.find(templateKey => t(templateKey) === translatedFormat);
    return foundKey || translatedFormat;
  });
};

const SpecialistsProfilePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { notifications, showSuccess, showError, showInfo, removeNotification } = useNotification();
    
    // State management
    const [qualificationData, setQualificationData] = useState(null);
    const [specialistType, setSpecialistType] = useState(null);
    const [userName, setUserName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [professionalRoleTypeId, setProfessionalRoleTypeId] = useState(null);
    
    // Form fields
    const [formFields, setFormFields] = useState({
        hourlyRate: '',
        experience: '',
        biography: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        licenseNumber: ''
    });
    
    // Validation errors
    const [errors, setErrors] = useState({
        hourlyRate: '',
        experience: '',
        biography: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        licenseNumber: ''
    });
    
    // Skills and certificates
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [workFormats, setWorkFormats] = useState([]);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
    
    // Photo upload states
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    // Available skills based on specialist type
    const availableSkills = {
        trainer: [
            'Силові тренування', 'Кардіо-тренування', 'Фітнес для дітей', 
            'Реабілітаційні вправи', 'Мотивація клієнтів', 'Індивідуальні програми',
            'Групові заняття', 'Контроль балансу БЖВ', 'Йога', 'Танці'
        ],
        doctor: [
            'Загальна практика', 'Профілактична медицина', 'Внутрішні хвороби',
            'Сімейна медицина', 'Кардіологія', 'Неврологія'
        ],
        psychologist: [
            'Когнітивно-поведінкова терапія', 'Психоаналіз', 'Сімейна терапія',
            'Групова терапія', 'Арт-терапія', 'Дитяча психологія'
        ],
        dietitian: [
            'Спортивне харчування', 'Планування раціону', 'Дієтологія для схуднення',
            'Дитяче харчування', 'Діабетичне харчування', 'Вегетаріанське харчування'
        ]
    };

    const getSpecialistType = () => {
        return localStorage.getItem("specialist-profile");
    };

    // Функція для оновлення токена користувача
    const refreshUserToken = async () => {
        try {
            const currentToken = localStorage.getItem("helth-token");
            if (!currentToken) return;

            // Отримуємо дані користувача з поточного токена
            const tokenPayload = JSON.parse(atob(currentToken.split('.')[1]));
            const userEmail = tokenPayload.email;

            // Виконуємо новий логін для отримання оновленого токена з ролями
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/Auth/login`, {
                email: userEmail,
                password: "dummy" // Потрібно зберегти пароль або використовувати інший метод
            });

            if (response.data && response.data.token) {
                localStorage.setItem("helth-token", response.data.token);
            }
        } catch (error) {
            // Не показуємо помилку користувачу, оскільки це не критично
        }
    };

    // Load specialist data
    const fetchSpecialistData = useCallback(async () => {
        try {
            const token = localStorage.getItem("helth-token");
            if (!token) {
                navigate("/login");
                return;
            }

            // Отримуємо всі типи кваліфікацій для порівняння
            const typesResponse = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/ProfessionalQualification/types`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // ПОРІВНЯННЯ ТИПІВ - ВИКОНУЄМО ЗАВЖДИ
            const specialistTypeFromStorage = getSpecialistType();
            
            // Знаходимо ID кваліфікації по типу спеціаліста
            const matchingType = typesResponse.data.find(type => 
                type.Name === specialistTypeFromStorage
            );
            
            if (matchingType) {
                setProfessionalRoleTypeId(matchingType.Id);
            } else {
                const partialMatch = typesResponse.data.find(type => 
                    type.Name.toLowerCase() === specialistTypeFromStorage.toLowerCase()
                );
            }

            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/ProfessionalQualification/my-qualifications`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const qualifications = response.data;

            if (qualifications && qualifications.length > 0) {
                const currentQualification = qualifications[0]; // Take the first one
                setQualificationData(currentQualification);
                setUserName(currentQualification.User?.FullName || '');
                
                setSpecialistType(specialistTypeFromStorage);
                
                // Extract skills based on specialist type
                let extractedSkills = [];
                if (specialistTypeFromStorage === 'Trainer' && currentQualification.TrainerDetails) {
                    extractedSkills = currentQualification.TrainerDetails.TrainingStyle || [];
                    
                    // Якщо TrainingStyle є рядком, конвертуємо в масив
                    if (typeof extractedSkills === 'string') {
                        extractedSkills = extractedSkills.trim() ? [extractedSkills.trim()] : [];
                    }
                    
                    // Фільтруємо порожні рядки та пробіли
                    extractedSkills = extractedSkills.filter(skill => skill && skill.trim() !== '');
                } else if (specialistTypeFromStorage === 'Doctor' && currentQualification.DoctorDetails) {
                    extractedSkills = currentQualification.DoctorDetails.Specializations || [];
                } else if (specialistTypeFromStorage === 'Psychologist' && currentQualification.PsychologistDetails) {
                    extractedSkills = currentQualification.PsychologistDetails.Specializations || [];
                } else if (specialistTypeFromStorage === 'Dietitian' && currentQualification.DietitianDetails) {
                    extractedSkills = currentQualification.DietitianDetails.Specializations || [];
                }
                
                // Конвертуємо перекладений текст назад в ключі перекладу
                const skillKeys = convertTranslatedSkillsToKeys(extractedSkills, ALL_SKILLS, t);
                setSkills(skillKeys);
                
                // Extract form fields
                const details = currentQualification.TrainerDetails || 
                               currentQualification.DoctorDetails || 
                               currentQualification.PsychologistDetails || 
                               currentQualification.DietitianDetails;
                
                // Extract certificates
                const extractedCertificates = details?.Certifications || [];
                setCertificates(extractedCertificates.map((cert, index) => ({
                    id: index,
                    name: cert,
                    url: '',
                    type: 'text'
                })));
                
                // Extract work formats
                const extractedWorkFormats = currentQualification.WorkFormat || [];
                
                // Отримуємо всі доступні шаблони для конвертації
                const allWorkFormatTemplates = [
                    'work_format_online_telegram',
                    'work_format_offline_gym', 
                    'work_format_weekly_plan',
                    'work_format_online_zoom',
                    'work_format_office_sessions',
                    'work_format_therapy_plans',
                    'work_format_clinic_visits',
                    'work_format_prevention_plans',
                    'work_format_nutrition_plan'
                ];
                
                // Конвертуємо перекладений текст назад в ключі перекладу
                const workFormatKeys = convertTranslatedWorkFormatsToKeys(extractedWorkFormats, allWorkFormatTemplates, t);
                // Видаляємо дублікати, зберігаючи порядок
                const uniqueWorkFormatKeys = [...new Set(workFormatKeys)];
                setWorkFormats(uniqueWorkFormatKeys);
                
                if (details) {
                    setFormFields({
                        hourlyRate: currentQualification.HourlyRate?.toString() || details.HourlyRate?.toString() || null,
                        experience: details.YearsOfExperience?.toString() || currentQualification.YearsOfExperience?.toString() || null,
                        biography: details.Biography || null,
                        contactEmail: details.ContactEmail || null,
                        contactPhone: details.ContactPhone || null,
                        website: details.Website || null,
                        licenseNumber: details.ProfessionalLicenseNumber || null
                    });
                    
                    // Використовуємо presigned URL з деталей спеціаліста
                    setProfilePhotoUrl(details.CardPictureUrl || '');
                }
            }
        } catch (error) {
            // Error handling
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchSpecialistData();
    }, [fetchSpecialistData]);

    // Set specialist type from localStorage immediately on mount
    useEffect(() => {
        const specialistTypeFromStorage = localStorage.getItem("specialist-profile");
        if (specialistTypeFromStorage) {
            setSpecialistType(specialistTypeFromStorage);
        }
    }, []);

    // Handle form field changes
    const handleFieldChange = (fieldName, value) => {
        setFormFields(prev => ({
            ...prev,
            [fieldName]: value
        }));
        setHasChanges(true);
        
        // Валідація в реальному часі
        const errorMessage = validateField(fieldName, value);
        setErrors(prev => ({
            ...prev,
            [fieldName]: errorMessage
        }));
    };

    // Handle work formats change
    const handleWorkFormatsChange = (formats) => {
        // Видаляємо дублікати, зберігаючи порядок
        const uniqueFormats = [...new Set(formats)];
        setWorkFormats(uniqueFormats);
        setHasChanges(true);
    };

    // Handle skills change
    const handleSkillsChange = (newSkills) => {
        setSkills(newSkills);
        setHasChanges(true);
    };

    // Handle certificates change
    const handleCertificatesChange = (newCertificates) => {
        setCertificates(newCertificates);
        setHasChanges(true);
    };

    // Handle photo update
    const handlePhotoUpdate = (newPhotoUrl) => {
        setProfilePhotoUrl(newPhotoUrl);
        setHasChanges(true);
    };

    // Handle file selection for photo upload
    const handleFileSelect = (file) => {
        setAvatarFile(file);
        setHasChanges(true);
    };

    // Handle save
    const handleSave = async () => {
        if (!hasChanges) return;
        
        // Перевірка валідації перед збереженням
        if (hasValidationErrors(errors)) {
            showError(t("validation_errors_exist") || "Будь ласка, виправте помилки валідації перед збереженням");
            return;
        }
        
        setIsSaving(true);
        try {
            const token = localStorage.getItem("helth-token");
            
            // Завантажуємо фото, якщо є новий файл (тільки для існуючих спеціалістів)
            if (avatarFile && qualificationData) {
                try {
                    const formData = new FormData();
                    formData.append('file', avatarFile);
                    formData.append('specialistId', qualificationData.Id); // ID кваліфікації
                    formData.append('imageType', 'card');
                    
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_URL}/api/SpecialistImage/upload-by-id`,
                        formData,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    );
                    
                    if (response.data && response.data.ImageUrl) {
                        // Видалити префікс minio:9000/images/ якщо є
                        let cleanUrl = response.data.ImageUrl;
                        if (cleanUrl.startsWith('minio:9000/images/')) {
                            cleanUrl = cleanUrl.substring('minio:9000/images/'.length);
                        }
                        
                        // Оновлюємо URL зображення (тепер це буде ім'я файлу, presigned URL буде згенерований на бекенді)
                        setProfilePhotoUrl(cleanUrl);
                        setAvatarFile(null); // Очищаємо файл після успішного завантаження
                        
                        // Показуємо повідомлення про успішне оновлення
                        showSuccess('Фото успішно оновлено!');
                        
                        // Оновлюємо дані для отримання нового presigned URL
                        await fetchSpecialistData();
                    }
                } catch (error) {
                    showError('Помилка завантаження фото: ' + error.message);
                }
            }
            
            // Якщо кваліфікація не існує, створюємо нову
            if (!qualificationData) {
                
                if (!professionalRoleTypeId) {
                    throw new Error("Professional role type ID not found");
                }

                
                // Перекладаємо ключі в текст з fallback логікою
                const translatedWorkFormats = workFormats.map(format => {
                    const translation = t(format);
                    // Якщо переклад повернув ключ (не знайшов переклад), використовуємо fallback
                    if (translation === format) {
                        const currentLang = localStorage.getItem('i18nextLng') || 'uk';
                        return WORK_FORMAT_TRANSLATIONS[currentLang]?.[format] || format;
                    }
                    return translation;
                });
                
                
                const createQualificationData = {
                    ProfessionalRoleTypeId: professionalRoleTypeId,
                    HourlyRate: formFields.hourlyRate ? parseFloat(formFields.hourlyRate) : null,
                    Description: formFields.biography || "",
                    WorkFormat: translatedWorkFormats
                    //CertificatesUrl: certificates.length > 0 ? certificates[0].url : "https://kach-running.com"
                };


                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/ProfessionalQualification/apply`,
                    createQualificationData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                
                // Створюємо деталі спеціаліста для нової кваліфікації
                const newQualificationId = response.data.Id;
                const specialistDetailsData = {
                    biography: emptyToNull(formFields.biography),
                    contactEmail: emptyToNull(formFields.contactEmail),
                    contactPhone: emptyToNull(formFields.contactPhone),
                    website: emptyToNull(formFields.website),
                    professionalLicenseNumber: emptyToNull(formFields.licenseNumber),
                    yearsOfExperience: formFields.experience && !isNaN(parseInt(formFields.experience)) ? parseInt(formFields.experience) : null,
                    certifications: certificates.map(cert => cert.name),
                    availability: emptyToNull(formFields.availability),
                    clientTestimonials: emptyToNull(formFields.clientTestimonials),
                    expertDetailsPictureUrl: emptyToNull(profilePhotoUrl),
                    cardPictureUrl: emptyToNull(profilePhotoUrl)
                };

                // Додаємо специфічні поля для кожного типу спеціаліста
                if (specialistType === 'Doctor') {
                    specialistDetailsData.specializations = skills.map(skill => t(skill));
                    specialistDetailsData.clinicAffiliation = emptyToNull(formFields.clinicAffiliation);
                } else if (specialistType === 'Trainer') {
                    // Фільтруємо порожні рядки та пробіли перед збереженням
                    const filteredSkills = skills.filter(skill => skill && skill.trim() !== '');
                    
                    specialistDetailsData.trainingStyle = filteredSkills.map(skill => t(skill));
                    
                    specialistDetailsData.preferredWorkoutStyles = formFields.preferredWorkoutStyles || [];
                    specialistDetailsData.hourlyRate = formFields.hourlyRate ? parseFloat(formFields.hourlyRate) : null;
                } else if (specialistType === 'Dietitian') {
                    specialistDetailsData.specializations = skills.map(skill => t(skill));
                    specialistDetailsData.nutritionalApproach = emptyToNull(formFields.nutritionalApproach);
                } else if (specialistType === 'Psychologist') {
                    specialistDetailsData.specializations = skills.map(skill => t(skill));
                    specialistDetailsData.therapyApproaches = formFields.therapyApproaches || [];
                }

                // Створюємо деталі спеціаліста
                await createSpecialistDetails(newQualificationId, specialistType, specialistDetailsData, token);
                
                // Завантажуємо фото після створення кваліфікації та деталей (для нових спеціалістів)
                if (avatarFile) {
                    try {
                        const formData = new FormData();
                        formData.append('file', avatarFile);
                        formData.append('specialistId', newQualificationId); // ID нової кваліфікації
                        formData.append('imageType', 'card');
                        
                        const photoResponse = await axios.post(
                            `${process.env.REACT_APP_API_URL}/api/SpecialistImage/upload-by-id`,
                            formData,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data'
                                }
                            }
                        );
                        
                        if (photoResponse.data && photoResponse.data.ImageUrl) {
                            // Видалити префікс minio:9000/images/ якщо є
                            let cleanUrl = photoResponse.data.ImageUrl;
                            if (cleanUrl.startsWith('minio:9000/images/')) {
                                cleanUrl = cleanUrl.substring('minio:9000/images/'.length);
                            }
                            
                            setProfilePhotoUrl(cleanUrl); // Update the photo URL
                            setAvatarFile(null); // Очищаємо файл після успішного завантаження
                        }
                    } catch (error) {
                        // Не показуємо помилку користувачу, оскільки основні дані вже збережені
                    }
                }
                
                // Оновлюємо дані після створення
                await fetchSpecialistData();
                
                // Переавторизуємо користувача для отримання нового токена з ролями
                await refreshUserToken();
                
                setHasChanges(false);
                showSuccess(t("sp_save_success") || "Кваліфікацію та деталі успішно створено!");
                
                // Redirect to specialists page to see the new specialist
                setTimeout(() => {
                    navigate('/specialists');
                }, 1500); // Give user time to see success message
            } else {
                // Якщо кваліфікація існує, оновлюємо її
                
                const qualificationId = qualificationData.Id;
                
                // Підготовка даних для деталей спеціаліста
                const specialistDetailsData = {
                    biography: emptyToNull(formFields.biography),
                    contactEmail: emptyToNull(formFields.contactEmail),
                    contactPhone: emptyToNull(formFields.contactPhone),
                    website: emptyToNull(formFields.website),
                    professionalLicenseNumber: emptyToNull(formFields.licenseNumber),
                    yearsOfExperience: formFields.experience && !isNaN(parseInt(formFields.experience)) ? parseInt(formFields.experience) : null,
                    certifications: certificates.map(cert => cert.name),
                    availability: emptyToNull(formFields.availability),
                    clientTestimonials: emptyToNull(formFields.clientTestimonials),
                    expertDetailsPictureUrl: emptyToNull(profilePhotoUrl),
                    cardPictureUrl: emptyToNull(profilePhotoUrl)
                };

                // Додаємо специфічні поля для кожного типу спеціаліста
                if (specialistType === 'Doctor') {
                    specialistDetailsData.specializations = skills.map(skill => t(skill));
                    specialistDetailsData.clinicAffiliation = emptyToNull(formFields.clinicAffiliation);
                } else if (specialistType === 'Trainer') {
                    // Фільтруємо порожні рядки та пробіли перед збереженням
                    const filteredSkills = skills.filter(skill => skill && skill.trim() !== '');
                    
                    specialistDetailsData.trainingStyle = filteredSkills.map(skill => t(skill));
                    
                    specialistDetailsData.preferredWorkoutStyles = formFields.preferredWorkoutStyles || [];
                    specialistDetailsData.hourlyRate = formFields.hourlyRate ? parseFloat(formFields.hourlyRate) : null;
                } else if (specialistType === 'Dietitian') {
                    specialistDetailsData.specializations = skills.map(skill => t(skill));
                    specialistDetailsData.nutritionalApproach = emptyToNull(formFields.nutritionalApproach);
                } else if (specialistType === 'Psychologist') {
                    specialistDetailsData.specializations = skills.map(skill => t(skill));
                    specialistDetailsData.therapyApproaches = formFields.therapyApproaches || [];
                }

                // Оновлюємо WorkFormat через UpdateQualification endpoint
                
                // Перекладаємо ключі в текст з fallback логікою
                const translatedWorkFormats = workFormats.map(format => {
                    const translation = t(format);
                    // Якщо переклад повернув ключ (не знайшов переклад), використовуємо fallback
                    if (translation === format) {
                        const currentLang = localStorage.getItem('i18nextLng') || 'uk';
                        return WORK_FORMAT_TRANSLATIONS[currentLang]?.[format] || format;
                    }
                    return translation;
                });
                
                
                const qualificationUpdateData = {
                    Description: formFields.biography || "",
                    HourlyRate: formFields.hourlyRate ? parseFloat(formFields.hourlyRate) : null,
                    WorkFormat: translatedWorkFormats
                };
                
                await updateProfessionalQualification(qualificationId, qualificationUpdateData, token);

                // Перевіряємо, чи існують деталі спеціаліста
                try {
                    await getSpecialistDetails(qualificationId, specialistType, token);
                    // Якщо деталі існують, оновлюємо їх
                    await updateSpecialistDetails(qualificationId, specialistType, specialistDetailsData, token);
                } catch (error) {
                    if (error.message.includes('не знайдені')) {
                        // Якщо деталі не існують, створюємо нові
                        await createSpecialistDetails(qualificationId, specialistType, specialistDetailsData, token);
                    } else {
                        throw error;
                    }
                }

                // Завантажуємо фото після оновлення деталей (для існуючих спеціалістів)
                if (avatarFile) {
                    try {
                        const formData = new FormData();
                        formData.append('file', avatarFile);
                        formData.append('specialistId', qualificationId); // ID існуючої кваліфікації
                        formData.append('imageType', 'card');
                        
                        const photoResponse = await axios.post(
                            `${process.env.REACT_APP_API_URL}/api/SpecialistImage/upload-by-id`,
                            formData,
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data'
                                }
                            }
                        );
                        
                        if (photoResponse.data && photoResponse.data.ImageUrl) {
                            // Видалити префікс minio:9000/images/ якщо є
                            let cleanUrl = photoResponse.data.ImageUrl;
                            if (cleanUrl.startsWith('minio:9000/images/')) {
                                cleanUrl = cleanUrl.substring('minio:9000/images/'.length);
                            }
                            
                            setProfilePhotoUrl(cleanUrl); // Оновлюємо URL зображення
                            setAvatarFile(null); // Очищаємо файл після успішного завантаження
                            
                            // Оновлюємо дані для отримання нового presigned URL
                            await fetchSpecialistData();
                        }
                    } catch (error) {
                        // Не показуємо помилку користувачу, оскільки основні дані вже збережені
                    }
                }

                setHasChanges(false);
                showSuccess(t("sp_save_success") || "Дані успішно збережено!");
            }
        } catch (error) {
            showError(t("sp_save_error") || "Помилка збереження даних: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="sp-loading">{t("loading")}</div>;
    }

    return (
        <>
            {/* Контейнер уведомлений */}
            <NotificationContainer 
                notifications={notifications}
                onRemove={removeNotification}
            />
            
            <div className="sp-container scroll-data">
                {/* Заголовок */}
                <div className="sp-specialist-type-title">
                    {specialistType ? t(`spec_${specialistType.toLowerCase()}`) : t("specialist")}
                    {/* Debug: {specialistType} */}
                </div>

            {/* Базова інформація - hourly rate та experience */}
            <div className="sp-info-basic">
                <InfoField
                    label="sp_hourly_rate"
                    value={formFields.hourlyRate}
                    onChange={(e) => handleFieldChange('hourlyRate', e.target.value)}
                    placeholder="sp_hourly_rate_placeholder"
                    type="number"
                    error={errors.hourlyRate}
                    hasError={!!errors.hourlyRate}
                />
                <InfoField
                    label="sp_experience"
                    value={formFields.experience}
                    onChange={(e) => handleFieldChange('experience', e.target.value)}
                    placeholder="sp_experience_placeholder"
                    type="number"
                    error={errors.experience}
                    hasError={!!errors.experience}
                />
            </div>

            {/* Рядок для Biography та WorkFormat */}
            <div className="sp-biography-workformat-row">
                <div className="sp-biography-column">
                    <BiographyField
                        label="sp_biography"
                        value={formFields.biography}
                        onChange={(e) => handleFieldChange('biography', e.target.value)}
                        placeholder="sp_biography_placeholder"
                        maxLength={1000}
                        error={errors.biography}
                        hasError={!!errors.biography}
                    />
                </div>
                <div className="sp-workformat-column">
                    <WorkFormatSection
                        workFormats={workFormats}
                        onWorkFormatsChange={handleWorkFormatsChange}
                        specialistType={qualificationData?.ProfessionalRoleType?.Name}
                    />
                </div>
            </div>

            {/* Соціальні посилання */}
            <div className='sp-socials-links'>
                <InfoField
                    label="sp_website"
                    value={formFields.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    placeholder="sp_website_placeholder"
                    type="url"
                    error={errors.website}
                    hasError={!!errors.website}
                />
                <InfoField
                    label="sp_license_number"
                    value={formFields.licenseNumber}
                    onChange={(e) => handleFieldChange('licenseNumber', e.target.value)}
                    placeholder="sp_license_number_placeholder"
                    error={errors.licenseNumber}
                    hasError={!!errors.licenseNumber}
                />
            </div>
            <div className="sp-skills-column">
                {/* Навички */}
                <SkillsSection
                    allSkills={ALL_SKILLS}
                    value={skills}
                    onChange={handleSkillsChange}
                />
            </div>
            {/* Середня колонка - сертифікати */}
            <div className="sp-certificates-column">
                <CertificatesSection
                    certificates={certificates}
                    onCertificatesChange={handleCertificatesChange}
                />
            </div>

            {/* Права колонка - фото */}
            <div className="sp-main-content">
                <ProfilePhoto
                    specialistName={userName}
                    currentPhotoUrl={profilePhotoUrl}
                    onPhotoUpdate={handlePhotoUpdate}
                    onFileSelect={handleFileSelect}
                />
            </div>

            {/* Футер */}
            <div className="sp-footer">
                <SaveButton
                    onSave={handleSave}
                    hasChanges={hasChanges}
                    isSaving={isSaving}
                />
            </div>
            </div>
        </>
    );
}

export default SpecialistsProfilePage;