import React, { useState, useEffect } from "react";
import "../styles/UserProfile.css";
import ProfileIcon from "../icons/ProfileIcon.svg";
import CustomSelect from "../elements/CustomSelect";
import CustomDatePicker from "../elements/CustomBirthdateDatePicker";

const UserProfile = () => {
  const [activeView, setActiveView] = useState({ achievements: 'list', purchases: 'list' });
  const [selectedItem, setSelectedItem] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Початкові дані (можна отримати з API)
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
    avatarUrl: '' // Додаємо поле для посилання на аватар
  };

  const [formData, setFormData] = useState(initialFormData);

  // Ефект для перевірки змін
  useEffect(() => {
    const hasFormChanged = Object.keys(formData).some(key => {
      return formData[key] !== initialFormData[key];
    });
    setHasChanges(hasFormChanged);
  }, [formData]);

  const genderOptions = ['Чоловік', 'Жінка', 'Інше'];
  const countryOptions = [
    'Багамські Острови', 'Бахрейн', 'Бангладеш', 'Барбадос', 
    'Білорусь', 'Бельгія', 'Беліз', 'Бенін', 'Україна'
  ];
  const phoneNumberOptions = [
    '+380', '+451', '+452', '+453', 
    '+454', '+455', '+456', '+457', '+458'
  ];

  // Обробка вибору аватару
  const handleAvatarSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Перевірка типу файлу
      if (!file.type.startsWith('image/')) {
        alert('Будь ласка, виберіть зображення');
        return;
      }

      // Створення попереднього перегляду
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
        
        // Генеруємо шлях до файлу в папці assets/profil_pictures/
        const fileName = file.name;
        const avatarUrl = `../../assets/profil_pictures/${fileName}`;
        
        // Оновлюємо стан форми з шляхом до аватару
        setFormData(prev => ({
          ...prev,
          avatarUrl: avatarUrl
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

  // Функція для відправки даних на бекенд
  const handleSubmit = () => {
    const genderMapping = {
      'Чоловік': 'Male',
      'Жінка': 'Female', 
      'Інше': 'Other'
    };

    const dataToSend = {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      gender: genderMapping[formData.gender] || formData.gender,
      birthDate: formData.birthDate,
      height: formData.height,
      weight: formData.weight,
      country: formData.country,
      city: formData.city,
      street: formData.street,
      phone: `${formData.phoneCode}${formData.phoneNumber}`,
      about: formData.about,
      avatarUrl: formData.avatarUrl // Передаємо шлях до аватару
    };
    
    console.log("Дані для відправки на бекенд:", dataToSend);
    
    // Тут буде логіка відправки на бекенд
    // fetch('/api/update-profile', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(dataToSend)
    // })
    
    // Після успішного збереження скидаємо прапорець змін
    setHasChanges(false);

    alert("Профіль успішно оновлено! Шлях до аватару: " + formData.avatarUrl);
  };

  const achievements = [
    { 
      id: 1,
      date: "31.08", 
      text: "Тренування", 
      extra: "1 год",
      details: {
        fullDate: "31.08.2025\n17:05 - 18:10",
        message: "Масш успіхи!\nПродуктивний день!\nПройдено тренування 'NOMYFY ST'",
        duration: "1 год 05 хв",
        calories: "175 кКал",
        motivation: "ТІЛЬКИ ВПЕРЕД!"
      }
    },
    { id: 2, date: "11.07", text: "Пройдено марафон..." },
    { id: 3, date: "11.07", text: "Втрата ваги" },
    { id: 4, date: "11.07", text: "Ти молодець!" },
    { id: 5, date: "11.07", text: "Ти молодець!" },
  ];

  const purchases = [
    { id: 1, date: "31.08", text: "Футболка Nomy" },
    { id: 2, date: "11.07", text: "Підписка на тренування" },
    { id: 3, date: "11.07", text: "Футболка Nomy" },
    { id: 4, date: "11.07", text: "Футболка Nomy" },
    { id: 5, date: "11.07", text: "Футболка Nomy" },
    { id: 6, date: "11.07", text: "Футболка Nomy" },
  ];

  const handleItemClick = (type, item) => {
    setActiveView({ ...activeView, [type]: 'details' });
    setSelectedItem(item);
  };

  const handleBackClick = (type) => {
    setActiveView({ ...activeView, [type]: 'list' });
    setSelectedItem(null);
  };

  const renderAchievementsList = () => (
    <div className="list">
      {achievements.map((a, i) => (
        <div key={i} className="list-item" onClick={() => handleItemClick('achievements', a)}>
          <span className="date">{a.date}</span>
          <span className="text">{a.text}</span>
          {a.extra && <span className="extra">{a.extra}</span>}
          <span className="dots">•••</span>
        </div>
      ))}
    </div>
  );

  const renderPurchasesList = () => (
    <div className="list">
      {purchases.map((p, i) => (
        <div key={i} className="list-item" onClick={() => handleItemClick('purchases', p)}>
          <span className="date">{p.date}</span>
          <span className="text">{p.text}</span>
          <span className="dots">•••</span>
        </div>
      ))}
    </div>
  );

  const renderAchievementDetails = () => (
    <div className="details-view">
      <div className="details-header">
        <button className="back-button" onClick={() => handleBackClick('achievements')}>
          ←
        </button>
        <h4>Деталі успіху</h4>
      </div>
      <div className="details-content">
        <div className="detail-date">{selectedItem.details.fullDate}</div>
        <div className="detail-message">{selectedItem.details.message}</div>
        <div className="detail-stats">
          <div className="stat">
            <span className="stat-label">Тривалість</span>
            <span className="stat-value">{selectedItem.details.duration}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Спалено</span>
            <span className="stat-value">{selectedItem.details.calories}</span>
          </div>
        </div>
        <div className="detail-motivation">{selectedItem.details.motivation}</div>
      </div>
    </div>
  );

  const renderPurchaseDetails = () => (
    <div className="details-view">
      <div className="details-header">
        <button className="back-button" onClick={() => handleBackClick('purchases')}>
          ←
        </button>
        <h4>Деталі покупки</h4>
      </div>
      <div className="details-content">
        <div className="purchase-info">
          <div className="purchase-date">{selectedItem.date}</div>
          <div className="purchase-title">{selectedItem.text}</div>
          <div className="purchase-status">Статус: Доставлено</div>
          <div className="purchase-tracking">Трек номер: NMF-{selectedItem.id}247</div>
        </div>
      </div>
    </div>
  );

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="user-profile-wrapper">
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
            <input 
              type="text" 
              placeholder="Про себе..." 
              value={formData.about}
              onChange={(e) => handleInputChange('about', e.target.value)}
            />
          </div>
        </div>
        
        <div className="achievements card">
          <h3>Твої успіхи</h3>
          {activeView.achievements === 'list' ? renderAchievementsList() : renderAchievementDetails()}
        </div>

        {/* Центральний стовпець */}
        <div className="profile-fields">
          <input 
            type="text" 
            placeholder="Ім'я" 
            className="long profile-fields-input" 
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Прізвище" 
            className="long profile-fields-input" 
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
          />
          
          <CustomSelect
            id="gender"
            placeholder="Стать"
            options={genderOptions}
            value={formData.gender}
            onChange={(value) => handleSelectChange('gender', value)}
            className="profile-fields-input short"
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
              className="short profile-fields-input" 
              value={formData.height}
              onChange={(e) => {
                const value = e.target.value.slice(0, 5);
                handleInputChange('height', value);
              }}
              maxLength={5}
              onInput={(e) => {
                if (e.target.value.length > 5) {
                  e.target.value = e.target.value.slice(0, 5);
                }
              }}
            />
            {formData.height && <span className="input-suffix">см</span>}
          </div>

          <div className="input-with-suffix">
            <input 
              type="number" 
              placeholder="Вага, кг" 
              className="short profile-fields-short-cor profile-fields-input" 
              value={formData.weight}
              onChange={(e) => {
                const value = e.target.value.slice(0, 7);
                handleInputChange('weight', value);
              }}
              maxLength={7}
              onInput={(e) => {
                if (e.target.value.length > 7) {
                  e.target.value = e.target.value.slice(0, 7);
                }
              }}
            />
            {formData.weight && <span className="input-suffix">кг</span>}
          </div>
        </div>
        
        <div className="purchases card">
          <h3>Твої покупки</h3>
          {activeView.purchases === 'list' ? renderPurchasesList() : renderPurchaseDetails()}
        </div>

        {/* Правий стовпець */}
        <div className="extra-fields">
          <CustomSelect
            id="country"
            placeholder="Країна"
            options={countryOptions}
            value={formData.country}
            onChange={(value) => handleSelectChange('country', value)}
            className="extra-fields-input short"
          />
          <CustomSelect
            id="city"
            placeholder="Місто"
            options={countryOptions}
            value={formData.city}
            onChange={(value) => handleSelectChange('city', value)}
            className="extra-fields-input short"
          />
          <CustomSelect
            id="street"
            placeholder="Вулиця"
            options={countryOptions}
            value={formData.street}
            onChange={(value) => handleSelectChange('street', value)}
            className="extra-fields-input short"
          />

          <div className="phone">
            <CustomSelect
              id="phoneCode"
              placeholder="+380"
              options={phoneNumberOptions}
              value={formData.phoneCode}
              onChange={(value) => handleSelectChange('phoneCode', value)}
              className="extra-fields-input phone-code"
            />
            <input 
              className="extra-fields-input" 
              type="number" 
              placeholder="Номер" 
              value={formData.phoneNumber}
              onChange={(e) => {
                const value = e.target.value.slice(0, 9);
                handleInputChange('phoneNumber', value);
              }}
              maxLength={9}
              onInput={(e) => {
                if (e.target.value.length > 9) {
                  e.target.value = e.target.value.slice(0, 9);
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Кнопка під профілем */}
      <div className="profile-actions">
        <button 
          onClick={handleSubmit}
          className={hasChanges ? 'save' : 'save disabled'}
          disabled={!hasChanges}
        >
          Зберегти зміни
        </button>
      </div>
    </div>
  );
};

export default UserProfile;