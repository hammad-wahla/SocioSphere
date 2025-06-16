import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateProfile } from "../redux/actions/authAction";
import { updateTheme } from "../redux/actions/themeAction";
import { GLOBALTYPES } from "../redux/actions/globalTypes";
import LoadingSpinner from "../components/LoadingSpinner";
import Avatar from "../components/Avatar";
import { imageUpload } from "../utils/imageUpload";
import { showToast } from "../utils/confirmDialog";

const Settings = () => {
  const { auth, theme } = useSelector((state) => state);
  const dispatch = useDispatch();

  // Profile Settings
  const [profile, setProfile] = useState({
    fullname: "",
    username: "",
    email: "",
    mobile: "",
    address: "",
    website: "",
    story: "",
    gender: "male",
  });

  // Avatar
  const [avatar, setAvatar] = useState("");

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    isPrivate: false,
    allowMessages: true,
    showOnline: true,
    allowTagging: true,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likeNotifications: true,
    commentNotifications: true,
    followNotifications: true,
    messageNotifications: true,
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Loading states
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(window.innerWidth >= 768 ? "profile" : null); // Show profile tab on desktop, options list on mobile

  useEffect(() => {
    if (auth.user) {
      setProfile({
        fullname: auth.user.fullname || "",
        username: auth.user.username || "",
        email: auth.user.email || "",
        mobile: auth.user.mobile || "",
        address: auth.user.address || "",
        website: auth.user.website || "",
        story: auth.user.story || "",
        gender: auth.user.gender || "male",
      });
      setAvatar(auth.user.avatar);

      // Load privacy settings from user data
      setPrivacy({
        isPrivate: auth.user.isPrivate || false,
        allowMessages: auth.user.allowMessages !== false, // default true
        showOnline: auth.user.showOnline !== false, // default true
        allowTagging: auth.user.allowTagging !== false, // default true
      });
    }
  }, [auth.user]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePrivacyChange = (e) => {
    const { name, checked } = e.target;
    setPrivacy({ ...privacy, [name]: checked });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotifications({ ...notifications, [name]: checked });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "File size too large (max 1MB)" },
      });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "File format is incorrect (JPEG/PNG only)" },
      });
    }

    setAvatar(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let media;
    if (avatar && typeof avatar !== "string") {
      media = await imageUpload([avatar]);
    }

    const userData = {
      ...profile,
      avatar: media ? media[0].url : auth.user.avatar,
      privacy,
      notifications,
    };

    dispatch(updateProfile(userData, auth));
    showToast(dispatch, {
      type: "success",
      message: "Profile updated successfully!",
    });
    setLoading(false);
  };

  const handlePrivacySubmit = async () => {
    setLoading(true);

    const userData = {
      ...profile,
      avatar: auth.user.avatar,
      privacy,
      notifications,
    };

    dispatch(updateProfile(userData, auth));
    showToast(dispatch, {
      type: "success",
      message: "Privacy settings saved successfully!",
    });
    setLoading(false);
  };

  const handleNotificationSubmit = async () => {
    setLoading(true);

    const userData = {
      ...profile,
      avatar: auth.user.avatar,
      privacy,
      notifications,
    };

    dispatch(updateProfile(userData, auth));
    showToast(dispatch, {
      type: "success",
      message: "Notification settings saved successfully!",
    });
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Passwords do not match" },
      });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: "Password must be at least 6 characters" },
      });
      setPasswordLoading(false);
      return;
    }

    // TODO: Implement password change API
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: "Password changed successfully" },
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordLoading(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "fas fa-user" },
    { id: "privacy", label: "Privacy", icon: "fas fa-shield-alt" },
    { id: "notifications", label: "Notifications", icon: "fas fa-bell" },
    { id: "appearance", label: "Appearance", icon: "fas fa-palette" },
    { id: "security", label: "Security", icon: "fas fa-lock" },
    { id: "account", label: "Account", icon: "fas fa-cog" },
  ];

  // Check if on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent auto-focus on mount and fix mobile hover issues
  useEffect(() => {
    // Remove focus from any focused element when component mounts
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    
    // Fix for mobile hover states getting stuck
    const handleTouchEnd = () => {
      // Remove hover states from all buttons
      const buttons = document.querySelectorAll('.settings-option-item');
      buttons.forEach(btn => {
        btn.classList.remove('hover');
        if (btn.blur) btn.blur();
      });
    };
    
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div className="settings-page">
        {/* Mobile Settings List */}
        {isMobile && !activeTab && (
          <div className="mobile-settings-list">
            <div className="settings-options-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className="settings-option-item"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                  onClick={(e) => {
                    setActiveTab(tab.id);
                    // Remove focus after click
                    e.currentTarget.blur();
                  }}
                  onMouseLeave={(e) => {
                    // Ensure button loses focus when mouse leaves
                    e.currentTarget.blur();
                  }}
                  onTouchEnd={(e) => {
                    // Force reset styles on touch end
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.blur();
                  }}
                >
                  <div className="option-content">
                    <i className={`${tab.icon} option-icon`}></i>
                    <span className="option-label">{tab.label}</span>
                  </div>
                  <i className="fas fa-chevron-right arrow-icon"></i>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Layout or Mobile Selected Setting */}
        {(!isMobile || activeTab) && (
          <div className="row settings-desktop-layout">
            {/* Settings Navigation - Desktop Only */}
            {!isMobile && (
              <div className="col-md-3">
                <div className="settings-nav">
                  <div className="settings-nav-header">
                    <h4>
                      <i className="fas fa-cog mr-2"></i>
                      Settings
                    </h4>
                  </div>
                  <div className="settings-nav-body">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        className={`settings-nav-item ${
                          activeTab === tab.id ? "active" : ""
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <i className={`${tab.icon} mr-3`}></i>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Content */}
            <div className={isMobile ? "col-12" : "col-md-9"}>
              {/* Back button for mobile */}
              {isMobile && activeTab && (
                <button
                  className="mobile-back-button"
                  onClick={() => setActiveTab(null)}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Settings
                </button>
              )}
              <div className="settings-content">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <div className="settings-section">
                  <div className="settings-section-header">
                    <h5>
                      <i className="fas fa-user mr-2"></i>
                      Profile Settings
                    </h5>
                    <p className="text-muted">
                      Manage your profile information and how others see you
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Avatar Section */}
                    <div className="avatar-section">
                      <div className="d-flex align-items-center">
                        <div className="avatar-preview">
                          <Avatar src={avatar} size="big-avatar" />
                        </div>
                        <div className="avatar-controls ml-4">
                          <h6>Profile Picture</h6>
                          <p className="text-muted mb-3">
                            Choose a photo that represents you well
                          </p>
                          <label
                            htmlFor="file_up"
                            className="btn btn-outline-primary"
                          >
                            <i className="fas fa-camera mr-2"></i>
                            Change Photo
                          </label>
                          <input
                            type="file"
                            name="file"
                            id="file_up"
                            accept=".png,.jpg,.jpeg"
                            onChange={changeAvatar}
                            style={{ display: "none" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Profile Form */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="fullname">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullname"
                            name="fullname"
                            value={profile.fullname}
                            onChange={handleInput}
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={profile.username}
                            onChange={handleInput}
                            placeholder="Your username"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleInput}
                            placeholder="your.email@example.com"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="mobile">Phone Number</label>
                          <input
                            type="text"
                            className="form-control"
                            id="mobile"
                            name="mobile"
                            value={profile.mobile}
                            onChange={handleInput}
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        id="website"
                        name="website"
                        value={profile.website}
                        onChange={handleInput}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="story">Bio</label>
                      <textarea
                        className="form-control"
                        id="story"
                        name="story"
                        rows="4"
                        value={profile.story}
                        onChange={handleInput}
                        placeholder="Tell us about yourself..."
                      />
                      <small className="form-text text-muted">
                        {profile.story.length}/200 characters
                      </small>
                    </div>

                    <div className="form-group">
                      <label>Gender</label>
                      <div className="radio-group">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={profile.gender === "male"}
                            onChange={handleInput}
                          />
                          <span>Male</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={profile.gender === "female"}
                            onChange={handleInput}
                          />
                          <span>Female</span>
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={profile.gender === "other"}
                            onChange={handleInput}
                          />
                          <span>Other</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <LoadingSpinner type="spinner" size="small" />
                        ) : (
                          <>
                            <i className="fas fa-save mr-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === "privacy" && (
                <div className="settings-section">
                  <div className="settings-section-header">
                    <h5>
                      <i className="fas fa-shield-alt mr-2"></i>
                      Privacy Settings
                    </h5>
                    <p className="text-muted">
                      Control who can see your content and interact with you
                    </p>
                  </div>

                  <div className="privacy-settings">
                    <div className="privacy-item">
                      <div className="privacy-info">
                        <h6>Private Account</h6>
                        <p className="text-muted">
                          When your account is private, only people you approve
                          can see your posts
                        </p>
                      </div>
                      <div className="privacy-control">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="isPrivate"
                            checked={privacy.isPrivate}
                            onChange={handlePrivacyChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="privacy-item">
                      <div className="privacy-info">
                        <h6>Allow Messages</h6>
                        <p className="text-muted">
                          Let people send you direct messages
                        </p>
                      </div>
                      <div className="privacy-control">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="allowMessages"
                            checked={privacy.allowMessages}
                            onChange={handlePrivacyChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="privacy-item">
                      <div className="privacy-info">
                        <h6>Show Online Status</h6>
                        <p className="text-muted">
                          Let others see when you're online
                        </p>
                      </div>
                      <div className="privacy-control">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="showOnline"
                            checked={privacy.showOnline}
                            onChange={handlePrivacyChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="privacy-item">
                      <div className="privacy-info">
                        <h6>Allow Tagging</h6>
                        <p className="text-muted">
                          Let others tag you in their posts
                        </p>
                      </div>
                      <div className="privacy-control">
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="allowTagging"
                            checked={privacy.allowTagging}
                            onChange={handlePrivacyChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn btn-primary"
                      onClick={handlePrivacySubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <LoadingSpinner type="spinner" size="small" />
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Save Privacy Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <div className="settings-section">
                  <div className="settings-section-header">
                    <h5>
                      <i className="fas fa-bell mr-2"></i>
                      Notification Settings
                    </h5>
                    <p className="text-muted">
                      Choose what notifications you want to receive
                    </p>
                  </div>

                  <div className="notification-settings">
                    <div className="notification-group">
                      <h6 className="notification-group-title">
                        <i className="fas fa-envelope mr-2"></i>
                        Email Notifications
                      </h6>

                      <div className="notification-item">
                        <div className="notification-info">
                          <span>Email Notifications</span>
                          <small className="text-muted">
                            Receive notifications via email
                          </small>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={notifications.emailNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="notification-group">
                      <h6 className="notification-group-title">
                        <i className="fas fa-mobile-alt mr-2"></i>
                        Push Notifications
                      </h6>

                      <div className="notification-item">
                        <div className="notification-info">
                          <span>Push Notifications</span>
                          <small className="text-muted">
                            Receive push notifications on your device
                          </small>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={notifications.pushNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <span>Like Notifications</span>
                          <small className="text-muted">
                            When someone likes your post
                          </small>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="likeNotifications"
                            checked={notifications.likeNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <span>Comment Notifications</span>
                          <small className="text-muted">
                            When someone comments on your post
                          </small>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="commentNotifications"
                            checked={notifications.commentNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <span>Follow Notifications</span>
                          <small className="text-muted">
                            When someone follows you
                          </small>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="followNotifications"
                            checked={notifications.followNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>

                      <div className="notification-item">
                        <div className="notification-info">
                          <span>Message Notifications</span>
                          <small className="text-muted">
                            When you receive a direct message
                          </small>
                        </div>
                        <label className="switch">
                          <input
                            type="checkbox"
                            name="messageNotifications"
                            checked={notifications.messageNotifications}
                            onChange={handleNotificationChange}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="btn btn-primary"
                      onClick={handleNotificationSubmit}
                      disabled={loading}
                    >
                      {loading ? (
                        <LoadingSpinner type="spinner" size="small" />
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Save Notification Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Settings */}
              {activeTab === "appearance" && (
                <div className="settings-section">
                  <div className="settings-section-header">
                    <h5>
                      <i className="fas fa-palette mr-2"></i>
                      Appearance Settings
                    </h5>
                    <p className="text-muted">
                      Customize how SocioSphere looks for you
                    </p>
                  </div>

                  <div className="appearance-settings">
                    <div className="appearance-item">
                      <div className="appearance-info">
                        <h6>Dark Mode</h6>
                        <p className="text-muted">
                          Use dark theme for a more comfortable viewing
                          experience
                        </p>
                      </div>
                      <div className="appearance-control">
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={theme}
                            onChange={() => {
                              const newTheme = theme ? "light" : "dark";
                              dispatch(updateTheme(newTheme, auth));
                            }}
                          />
                          <span className="slider"></span>
                        </label>
                      </div>
                    </div>

                    <div className="theme-preview">
                      <h6>Theme Preview</h6>
                      <div className="theme-demo">
                        <div className="demo-card">
                          <div className="demo-header">
                            <div className="demo-avatar"></div>
                            <div className="demo-info">
                              <div className="demo-name"></div>
                              <div className="demo-time"></div>
                            </div>
                          </div>
                          <div className="demo-content"></div>
                          <div className="demo-actions">
                            <div className="demo-action"></div>
                            <div className="demo-action"></div>
                            <div className="demo-action"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="settings-section">
                  <div className="settings-section-header">
                    <h5>
                      <i className="fas fa-lock mr-2"></i>
                      Security Settings
                    </h5>
                    <p className="text-muted">
                      Keep your account secure with these settings
                    </p>
                  </div>

                  <div className="security-settings">
                    <div className="security-section">
                      <h6>Change Password</h6>
                      <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                          <label htmlFor="currentPassword">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your current password"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="newPassword">New Password</label>
                          <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="Enter your new password"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="confirmPassword">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm your new password"
                          />
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={passwordLoading}
                        >
                          {passwordLoading ? (
                            <LoadingSpinner type="spinner" size="small" />
                          ) : (
                            <>
                              <i className="fas fa-key mr-2"></i>
                              Change Password
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    <div className="security-section">
                      <h6>Two-Factor Authentication</h6>
                      <p className="text-muted">
                        Add an extra layer of security to your account
                      </p>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-shield-alt mr-2"></i>
                        Enable 2FA
                      </button>
                    </div>

                    <div className="security-section">
                      <h6>Active Sessions</h6>
                      <p className="text-muted">
                        Manage your active sessions across different devices
                      </p>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-desktop mr-2"></i>
                        View Sessions
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === "account" && (
                <div className="settings-section">
                  <div className="settings-section-header">
                    <h5>
                      <i className="fas fa-cog mr-2"></i>
                      Account Settings
                    </h5>
                    <p className="text-muted">Manage your account and data</p>
                  </div>

                  <div className="account-settings">
                    <div className="account-section">
                      <h6>Account Information</h6>
                      <div className="account-info-item">
                        <span>Account Created:</span>
                        <span className="text-muted">
                          {new Date(auth.user?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="account-info-item">
                        <span>Total Posts:</span>
                        <span className="text-muted">
                          {auth.user?.posts?.length || 0}
                        </span>
                      </div>
                      <div className="account-info-item">
                        <span>Followers:</span>
                        <span className="text-muted">
                          {auth.user?.followers?.length || 0}
                        </span>
                      </div>
                      <div className="account-info-item">
                        <span>Following:</span>
                        <span className="text-muted">
                          {auth.user?.following?.length || 0}
                        </span>
                      </div>
                    </div>

                    <div className="account-section">
                      <h6>Data Export</h6>
                      <p className="text-muted">
                        Download a copy of your SocioSphere data
                      </p>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-download mr-2"></i>
                        Export Data
                      </button>
                    </div>

                    <div className="account-section">
                      <h6>Account Verification</h6>
                      <p className="text-muted">
                        Get verified to show others that your account is
                        authentic
                      </p>
                      <button className="btn btn-outline-success">
                        <i className="fas fa-check-circle mr-2"></i>
                        Request Verification
                      </button>
                    </div>

                    <div className="account-section danger-zone">
                      <h6 className="text-danger">Danger Zone</h6>
                      <div className="danger-action">
                        <div>
                          <strong>Deactivate Account</strong>
                          <p className="text-muted">
                            Temporarily disable your account. You can reactivate
                            it anytime.
                          </p>
                        </div>
                        <button className="btn btn-outline-warning">
                          Deactivate
                        </button>
                      </div>
                      <div className="danger-action">
                        <div>
                          <strong>Delete Account</strong>
                          <p className="text-muted">
                            Permanently delete your account and all associated
                            data.
                          </p>
                        </div>
                        <button className="btn btn-outline-danger">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default Settings;
