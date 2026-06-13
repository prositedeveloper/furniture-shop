import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Camera, User, Mail, Phone, Edit2, Check, X } from "lucide-react";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: null
      });

      if (user.avatar) {
        const avatarUrl = user.avatar.startsWith('http')
          ? user.avatar 
          : `http://localhost:8000${user.avatar}`;
        setAvatarPreview(avatarUrl);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    if (e.target.name === 'avatar') {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, avatar: file });
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = new FormData();
      const fieldsToCompare = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
      };

      Object.entries(fieldsToCompare).forEach(([key, value]) => {
        if (value !== user[key]) {
          submitData.append(key, value);
        }
      });

      if (formData.avatar) {
        submitData.append('avatar', formData.avatar);
      }

      await updateProfile(submitData);
      setEditMode(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: null,
    });
    if (user.avatar) {
      const avatarUrl = user.avatar.startsWith('http')
        ? user.avatar 
        : `http://localhost:8000${user.avatar}`;
      setAvatarPreview(avatarUrl);
    } else {
      setAvatarPreview(null);
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-page-container">
        <div className="profile-page-header">
          <h1 className="profile-page-title">Профиль</h1>
          {!editMode ? (
            <button 
              onClick={() => setEditMode(true)}
              className="btn btn-secondary"
            >
              <Edit2 className="h-5 w-5" />
              <span>Редактировать</span>
            </button>
          ) : (
            <div className="profile-page-actions">
              <button 
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={loading}
              >
                <Check className="h-5 w-5" />
                <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
              </button>
              <button 
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={loading}
              >
                <X className="h-5 w-5" />
                <span>Отмена</span>
              </button>
            </div>
          )}
        </div>

        <div className="profile-page-avatar">
          <img 
            src={avatarPreview || 'https://placehold.co/600x400?text=Нет аватарки'}
            alt="Аватар" 
            className="profile-page-avatar-image"
          />
          {editMode && (
            <div className="profile-page-avatar-upload">
              <label className="profile-page-avatar-upload-btn">
                <Camera className="h-5 w-5" />
                <input 
                  type="file" 
                  name="avatar"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          )}
          <h2 className="profile-image-avatar-title">{user.username}</h2>
        </div>

        <form onSubmit={handleSubmit} className="profile-page-form">
          <div className="profile-page-form-container">
            <div className="profile-page-field">
              <label className="profile-page-field-label">
                <User className="h-4 w-4" />
                Имя
              </label>
              {editMode ? (
                <input 
                  type="text" 
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="profile-page-field-input"
                  disabled={loading}
                />
              ) : (
                <p className="profile-page-field-value">{user.first_name || 'Не указано'}</p>
              )}
            </div>
            <div className="profile-page-field">
              <label className="profile-page-field-label">
                Фамилия
              </label>
              {editMode ? (
                <input 
                  type="text" 
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="profile-page-field-input"
                  disabled={loading}
                />
              ) : (
                <p className="profile-page-field-value">{user.last_name || 'Не указано'}</p>
              )}
            </div>
            <div className="profile-page-field">
              <label className="profile-page-field-label">
                <Mail className="h-4 w-4" />
                Email
              </label>
              {editMode ? (
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-page-field-input"
                  disabled={loading}
                />
              ) : (
                <p className="profile-page-field-value">{user.email || 'Не указан'}</p>
              )}
            </div>
            <div className="profile-page-field">
              <label className="profile-page-field-label">
                <Phone className="h-4 w-4" />
                Телефон
              </label>
              {editMode ? (
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="profile-page-field-input"
                  disabled={loading}
                />
              ) : (
                <p className="profile-page-field-value">{user.phone || 'Не указан'}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;