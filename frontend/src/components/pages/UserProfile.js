import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import axios from "axios";
import "../styles/UserProfile.css";
import ProfileIcon from "../icons/ProfileIcon.svg";
import CustomSelect from "../elements/custom-profile-date-select/CustomSelect";
import CustomDatePicker from "../elements/custom-birthdate-date-picker/CustomBirthdateDatePicker";
import TruncatedInput from '../elements/truncated-input/TruncatedInput';
import AchievementsCard from '../elements/achievements-card/AchievementsCard';
import PurchasesCard from '../elements/purchases-card/PurchasesCard';

const UserProfile = () => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState({ achievements: 'list', purchases: 'list' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false); // Новий стан для відстеження успішного збереження

  // Початкові дані
  const initialFormData = {
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    height: '',
    weight: '',
    country: '',
    city: '',
    street: '',
    phoneCode: '',
    phoneNumber: '',
    about: '',
    avatarUrl: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [originalFormData, setOriginalFormData] = useState(initialFormData);

  // Отримання токена
  const getToken = () => {
    return localStorage.getItem("helth-token");
  };

  // Завантаження даних профілю
  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        console.warn("Токен не знайдено");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/User/profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const userData = response.data;
      
      // Розбиваємо FullName на firstName та lastName
      const nameParts = userData.FullName?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Конвертуємо дату народження
      const birthDate = userData.DateOfBirth && userData.DateOfBirth !== "0001-01-01T00:00:00" 
        ? formatDateFromBackend(userData.DateOfBirth)
        : '';

      // Конвертуємо стать
      const genderMapping = {
        'Male': 'Чоловік',
        'Female': 'Жінка', 
        'Other': 'Інше'
      };
      const gender = genderMapping[userData.Gender] || '';

      // Розбиваємо телефон на код та номер
      let phoneCode = '';
      let phoneNumber = '';
      if (userData.Phone) {
        const phoneParts = userData.Phone.match(/^(\+\d{1,3})(\d+)$/);
        if (phoneParts) {
          phoneCode = phoneParts[1];
          phoneNumber = phoneParts[2];
        }
      }

      const newFormData = {
        firstName,
        lastName,
        gender,
        birthDate,
        height: userData.Height > 0 ? userData.Height.toString() : '',
        weight: userData.Weight > 0 ? userData.Weight.toString() : '',
        country: userData.Country || '',
        city: userData.City || '',
        street: userData.Street || '',
        phoneCode,
        phoneNumber,
        about: userData.Bio || '',
        avatarUrl: userData.ProfilePictureUrl || ''
      };

      setFormData(newFormData);
      setOriginalFormData(newFormData);
      
      // Якщо є аватар, встановлюємо попередній перегляд
      if (userData.ProfilePictureUrl) {
        setAvatarPreview(userData.ProfilePictureUrl);
      }

    } catch (error) {
      console.error("Помилка при завантаженні профілю:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Форматування дати з бекенду
  const formatDateFromBackend = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    } catch (error) {
      console.error("Помилка форматування дати:", error);
      return '';
    }
  };

  // Ефект для завантаження даних при монтуванні
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Ефект для перевірки змін
  useEffect(() => {
    const hasFormChanged = Object.keys(formData).some(key => {
      return formData[key] !== originalFormData[key];
    });
    setHasChanges(hasFormChanged);
  }, [formData, originalFormData]);

  const genderOptions = ['Чоловік', 'Жінка', 'Інше'];
  const countryOptions = [
    'Багамські Острови', 'Бахрейн', 'Бангладеш', 'Барбадос', 
    'Білорусь', 'Бельгія', 'Беліз', 'Бенін', 'Україна'
  ];
  const phoneNumberOptions = [
    '+380', '+451', '+452', '+453', 
    '+454', '+455', '+456', '+457', '+458'
  ];

  // Функція для перевірки чи поле має значення
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '';
  };

  // Функція для отримання класу в залежності від наявності значення
  const getInputClassName = (value, baseClassName) => {
    return hasValue(value) ? `${baseClassName} has-value` : baseClassName;
  };

  // Обробка вибору аватару
  const handleAvatarSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Будь ласка, виберіть зображення');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        setFormData(prev => ({
          ...prev,
          avatarUrl: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Функція для обробки текстових полів
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Обробники для карток
  const handleItemClick = (type, item) => {
    setActiveView({ ...activeView, [type]: 'details' });
    setSelectedItem(item);
  };

  const handleBackClick = (type) => {
    setActiveView({ ...activeView, [type]: 'list' });
    setSelectedItem(null);
  };

  // Функція для відправки даних на бекенд
  const handleSubmit = async () => {
    try {
      setIsSaving(true);
      const token = getToken();
      if (!token) {
        alert("Токен не знайдено. Будь ласка, увійдіть знову.");
        return;
      }

      const genderMapping = {
        'Чоловік': 'Male',
        'Жінка': 'Female', 
        'Інше': 'Other'
      };

      // Форматуємо дату для бекенду
      let formattedBirthDate = "0001-01-01";
      if (formData.birthDate) {
        const [day, month, year] = formData.birthDate.split(' ');
        formattedBirthDate = `${year}-${month}-${day}`;
      }

      const dataToSend = {
        FullName: `${formData.firstName} ${formData.lastName}`.trim(),
        DateOfBirth: formattedBirthDate,
        Gender: genderMapping[formData.gender] || 'Other',
        Weight: parseInt(formData.weight) || 0,
        Height: parseInt(formData.height) || 0,
        ProfilePictureUrl: 'https://webmaestro.com.ua/img/blog/20201016122530_.jpeg',
        Bio: formData.about || '',
        Phone: `${formData.phoneCode}${formData.phoneNumber}`,
        Country: formData.country || '',
        City: formData.city || '',
        Street: formData.street || ''
      };

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/User/profile`,
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setOriginalFormData(formData);
        setHasChanges(false);
        setIsSaved(true); // Встановлюємо статус успішного збереження
      }

    } catch (error) {
      console.error("Помилка при оновленні профілю:", error);
      alert(`Не вдалося оновити профіль!`);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (isLoading) {
    // можна додати виклик кастомного лоадера
    return;
  }

  const handleDirectMain = () => {
    navigate("/userpage");
  }

  // Якщо дані успішно збережено, показуємо повідомлення
  if (isSaved) {
    return (
    <div className="success-message-wrapper">
      <div className="success-message-container">
        <div className="success-message">
          <div className="success-title">Дякую, за інформацію!</div>
          <div className="success-subtitle">
            Тепер наші поради будуть ще кращими!
          </div>
        </div>
      </div>

      {/* кнопка тепер окремо від текстового блоку */}
      <div className="profile-actions">
        <button onClick={handleDirectMain} className="save">
          На головну
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="user-profile-wrapper success-message-wrapper">
      <div className="user-profile">
        {/* Лівий стовпець */}
        <div className="profile-info">
          <div className="avatar">
            <label htmlFor="avatar-select" className="avatar-upload-label">
              <div className="avatar-image-container">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
                ) : formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Profile" className="avatar-image" onError={(e) => {
                    e.target.src = ProfileIcon;
                  }} />
                ) : (
                  <img src={ProfileIcon} alt="Profile" className="profile-icon" />
                )}
              </div>
            </label>
            <input
              id="avatar-select"
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div className="about">
            <TruncatedInput
              value={formData.about}
              onChange={(value) => handleInputChange('about', value)}
              placeholder="Про себе..."
              maxVisibleChars={29}
              className={getInputClassName(formData.about, 'about-input')}
            />
          </div>
        </div>
        
        <AchievementsCard
          activeView={activeView.achievements}
          selectedItem={selectedItem}
          onItemClick={handleItemClick}
          onBackClick={handleBackClick}
        />

        {/* Центральний стовпець */}
        <div className="profile-fields">
          <TruncatedInput
            type="text"
            placeholder="Ім'я"
            className={getInputClassName(formData.firstName, 'long profile-fields-input')}
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            maxVisibleChars={108}
          />

          <TruncatedInput
            type="text"
            placeholder="Прізвище"
            className={getInputClassName(formData.lastName, 'long profile-fields-input')}
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            maxVisibleChars={108}
          />
          
          <CustomSelect
            id="gender"
            placeholder="Стать"
            options={genderOptions}
            value={formData.gender}
            onChange={(value) => handleSelectChange('gender', value)}
            className={getInputClassName(formData.gender, 'profile-fields-input short')}
          />

          <CustomDatePicker
            selected={formData.birthDate ? new Date(formData.birthDate.split(' ').reverse().join('-')) : null}
            onChange={(date) => {
              const formattedDate = formatDate(date);
              handleInputChange('birthDate', formattedDate);
            }}
            placeholder="Дата народження"
          />

          <div className="input-with-suffix">
            <input 
              type="number" 
              placeholder="Зріст, см" 
              className={getInputClassName(formData.height, 'short profile-fields-input')}
              value={formData.height}
              onChange={(e) => {
                const value = e.target.value.slice(0, 5);
                handleInputChange('height', value);
              }}
              min="0"
              maxLength={5}
            />
            {formData.height && <span className="input-suffix">см</span>}
          </div>

          <div className="input-with-suffix">
            <input 
              type="number" 
              placeholder="Вага, кг" 
              className={getInputClassName(formData.weight, 'short profile-fields-short-cor profile-fields-input')}
              value={formData.weight}
              onChange={(e) => {
                const value = e.target.value.slice(0, 7);
                handleInputChange('weight', value);
              }}
              min="0"
              maxLength={7}
            />
            {formData.weight && <span className="input-suffix">кг</span>}
          </div>
        </div>
        
        <PurchasesCard
          activeView={activeView.purchases}
          selectedItem={selectedItem}
          onItemClick={handleItemClick}
          onBackClick={handleBackClick}
        />

        {/* Правий стовпець */}
        <div className="extra-fields">
          <CustomSelect
            id="country"
            placeholder="Країна"
            options={countryOptions}
            value={formData.country}
            onChange={(value) => handleSelectChange('country', value)}
            className={getInputClassName(formData.country, 'extra-fields-input short')}
            maxVisibleChars={39}
          />
          <CustomSelect
            id="city"
            placeholder="Місто"
            options={countryOptions}
            value={formData.city}
            onChange={(value) => handleSelectChange('city', value)}
            className={getInputClassName(formData.city, 'extra-fields-input short')}
            maxVisibleChars={39}
          />
          <CustomSelect
            id="street"
            placeholder="Вулиця"
            options={countryOptions}
            value={formData.street}
            onChange={(value) => handleSelectChange('street', value)}
            className={getInputClassName(formData.street, 'extra-fields-input short')}
            maxVisibleChars={39}
          />

          <div className="phone">
            <CustomSelect
              id="phoneCode"
              placeholder="+380"
              options={phoneNumberOptions}
              value={formData.phoneCode}
              onChange={(value) => handleSelectChange('phoneCode', value)}
              className={getInputClassName(formData.phoneCode, 'extra-fields-input phone-code')}
            />
            <input 
              className={getInputClassName(formData.phoneNumber, 'extra-fields-input')}
              type="number" 
              placeholder="Номер" 
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.slice(0, 9);
                handleInputChange('phoneNumber', value);
              }}
              min="0"
              maxLength={9}
            />
          </div>
        </div>
      </div>

      {/* Кнопка під профілем */}
      <div className="profile-actions">
        <button 
          onClick={handleSubmit}
          className={hasChanges ? 'save' : 'save disabled'}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? 'Збереження...' : 'Зберегти'}
        </button>
      </div>
    </div>
  );
};

export default UserProfile;