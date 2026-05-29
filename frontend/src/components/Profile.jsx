import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, AtSign, Lock, LogOut, ShoppingBag, Heart, ChevronRight, Check, Eye, EyeOff, Edit3 } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext.jsx';
import { ProductContext } from '../utils/Context.jsx';
import { authApi } from '../utils/api.js';
import Navbar from './Navbar';
import { useDarkMode } from '../hooks/useDarkMode';
import { useNavigate } from 'react-router-dom';

const GOLD = '#B07D4A';

const Profile = () => {
  const { darkMode } = useDarkMode();
  const { user, logout } = useContext(AuthContext);
  const { cart, wishlist, totalCartItems, addToast, onLogoutSuccess } = useContext(ProductContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false, new: false, confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const bg = darkMode ? 'bg-neutral-950' : 'bg-neutral-50';
  const cardBg = darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200';
  const textPrimary = darkMode ? 'text-white' : 'text-neutral-900';
  const textMuted = darkMode ? 'text-neutral-400' : 'text-neutral-500';
  const inputBg = darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-50 border-neutral-200 text-neutral-900';
  const divider = darkMode ? 'border-neutral-800' : 'border-neutral-100';

  const handleLogout = async () => {
    await logout();
    onLogoutSuccess();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await authApi.updateAccount(editData);
      addToast({ title: 'Profile updated', message: 'Your details have been saved.', type: 'success' });
      setIsEditing(false);
    } catch (error) {
      addToast({ title: 'Update failed', message: error.message || 'Please try again.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast({ title: 'Passwords do not match', message: 'New password and confirm password must match.', type: 'error' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      addToast({ title: 'Password too short', message: 'Password must be at least 6 characters.', type: 'error' });
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      addToast({ title: 'Password changed', message: 'Your password has been updated.', type: 'success' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      addToast({ title: 'Failed to change password', message: error.message || 'Please try again.', type: 'error' });
    } finally {
      setChangingPassword(false);
    }
  };

  // Avatar initials
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.username?.[0]?.toUpperCase() || 'U';

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'activity', label: 'Activity' },
  ];

  return (
    <div className={`min-h-screen ${bg}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10 py-12">

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`border p-8 mb-6 flex items-center gap-6 ${cardBg}`}
          style={{ borderRadius: 2 }}
        >
          {/* Avatar */}
          <div
            className="flex-shrink-0 flex items-center justify-center text-white text-xl font-medium"
            style={{
              width: 72, height: 72, borderRadius: 2,
              background: `linear-gradient(135deg, ${GOLD}, #8B5E35)`,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
            }}
          >
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: GOLD, fontSize: 10 }}>
              {user?.role === 'seller' ? 'Seller Account' : 'Member'}
            </p>
            <h1
              className={`text-2xl font-light ${textPrimary}`}
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {user?.fullName || user?.username || 'User'}
            </h1>
            <p className={`text-sm mt-0.5 ${textMuted}`}>{user?.email}</p>
          </div>

          {/* Logout */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
              darkMode
                ? 'border-neutral-700 text-neutral-400 hover:border-rose-500 hover:text-rose-400'
                : 'border-neutral-200 text-neutral-500 hover:border-rose-300 hover:text-rose-500'
            }`}
            style={{ borderRadius: 1 }}
          >
            <LogOut size={13} />
            Logout
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <div className={`flex border-b mb-6 ${divider}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-xs uppercase tracking-widest transition-colors relative ${
                activeTab === tab.id ? '' : textMuted
              }`}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: activeTab === tab.id ? GOLD : undefined,
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ background: GOLD }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className={`border p-8 ${cardBg}`} style={{ borderRadius: 2 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={`text-lg font-light ${textPrimary}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Personal Information
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      if (isEditing) {
                        setEditData({
                          fullName: user?.fullName || '',
                          email: user?.email || '',
                          username: user?.username || '',
                          phone: user?.phone || '',
                        });
                      }
                      setIsEditing(!isEditing);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider border transition-colors ${
                      isEditing
                        ? darkMode ? 'border-neutral-700 text-neutral-400' : 'border-neutral-200 text-neutral-500'
                        : ''
                    }`}
                    style={{
                      borderRadius: 1, background: 'none', cursor: 'pointer',
                      borderColor: isEditing ? undefined : GOLD,
                      color: isEditing ? undefined : GOLD,
                    }}
                  >
                    <Edit3 size={11} />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </motion.button>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {[
                    { label: 'Full Name', key: 'fullName', icon: User },
                    { label: 'Email', key: 'email', icon: Mail },
                    { label: 'Username', key: 'username', icon: AtSign },
                    { label: 'Phone', key: 'phone', icon: User },
                  ].map(({ label, key, icon: Icon }) => (
                    <div key={key}>
                      <label className={`block text-xs uppercase tracking-widest mb-2 ${textMuted}`} style={{ fontSize: 10 }}>
                        {label}
                      </label>
                      {isEditing ? (
                        <div className="relative">
                          <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: GOLD }} />
                          <input
                            value={editData[key]}
                            onChange={(e) => setEditData((prev) => ({ ...prev, [key]: e.target.value }))}
                            className={`w-full pl-9 pr-4 py-2.5 text-sm border outline-none transition-colors focus:border-amber-600 ${inputBg}`}
                            style={{ borderRadius: 1 }}
                          />
                        </div>
                      ) : (
                        <div className={`flex items-center gap-2.5 px-3 py-2.5 border ${darkMode ? 'border-neutral-800 bg-neutral-800/50' : 'border-neutral-100 bg-neutral-50'}`} style={{ borderRadius: 1 }}>
                          <Icon size={14} style={{ color: GOLD }} />
                          <span className={`text-sm ${textPrimary}`}>
                            {user?.[key] || <span className={textMuted}>Not set</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex justify-end"
                  >
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-widest text-white disabled:opacity-60"
                      style={{ background: GOLD, borderRadius: 1, border: 'none', cursor: 'pointer' }}
                    >
                      {saving ? 'Saving...' : (
                        <><Check size={13} /> Save Changes</>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Security Tab ── */}
          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className={`border p-8 ${cardBg}`} style={{ borderRadius: 2 }}>
                <h2
                  className={`text-lg font-light mb-6 ${textPrimary}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Change Password
                </h2>

                <div className="flex flex-col gap-4 max-w-md">
                  {[
                    { label: 'Current Password', key: 'currentPassword', show: 'current' },
                    { label: 'New Password', key: 'newPassword', show: 'new' },
                    { label: 'Confirm New Password', key: 'confirmPassword', show: 'confirm' },
                  ].map(({ label, key, show }) => (
                    <div key={key}>
                      <label className={`block text-xs uppercase tracking-widest mb-2 ${textMuted}`} style={{ fontSize: 10 }}>
                        {label}
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: GOLD }} />
                        <input
                          type={showPasswords[show] ? 'text' : 'password'}
                          value={passwordData[key]}
                          onChange={(e) => setPasswordData((prev) => ({ ...prev, [key]: e.target.value }))}
                          className={`w-full pl-9 pr-10 py-2.5 text-sm border outline-none transition-colors focus:border-amber-600 ${inputBg}`}
                          style={{ borderRadius: 1 }}
                          placeholder="••••••••"
                        />
                        <button
                          onClick={() => setShowPasswords((prev) => ({ ...prev, [show]: !prev[show] }))}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 ${textMuted}`}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          {showPasswords[show] ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  ))}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleChangePassword}
                    disabled={changingPassword || !passwordData.currentPassword || !passwordData.newPassword}
                    className="mt-2 flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-widest text-white disabled:opacity-50"
                    style={{ background: passwordSuccess ? '#16a34a' : GOLD, borderRadius: 1, border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
                  >
                    {passwordSuccess ? (
                      <><Check size={13} /> Password Updated!</>
                    ) : changingPassword ? 'Updating...' : (
                      <><Lock size={13} /> Update Password</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Activity Tab ── */}
          {activeTab === 'activity' && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Cart Summary */}
                <motion.div
                  whileHover={{ y: -2 }}
                  onClick={() => navigate('/cart')}
                  className={`border p-6 cursor-pointer transition-colors ${cardBg} hover:border-amber-600/50`}
                  style={{ borderRadius: 2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center"
                      style={{ background: 'rgba(176,125,74,0.1)', borderRadius: 1 }}
                    >
                      <ShoppingBag size={18} style={{ color: GOLD }} />
                    </div>
                    <ChevronRight size={16} style={{ color: GOLD }} />
                  </div>
                  <p className={`text-xs uppercase tracking-widest mb-1 ${textMuted}`} style={{ fontSize: 10 }}>
                    Cart
                  </p>
                  <p
                    className={`text-3xl font-light ${textPrimary}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {totalCartItems}
                  </p>
                  <p className={`text-xs mt-1 ${textMuted}`}>
                    {totalCartItems === 1 ? 'item' : 'items'} in cart
                  </p>
                </motion.div>

                {/* Wishlist Summary */}
                <motion.div
                  whileHover={{ y: -2 }}
                  onClick={() => navigate('/wishlist')}
                  className={`border p-6 cursor-pointer transition-colors ${cardBg} hover:border-amber-600/50`}
                  style={{ borderRadius: 2 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="flex h-10 w-10 items-center justify-center"
                      style={{ background: 'rgba(176,125,74,0.1)', borderRadius: 1 }}
                    >
                      <Heart size={18} style={{ color: GOLD }} />
                    </div>
                    <ChevronRight size={16} style={{ color: GOLD }} />
                  </div>
                  <p className={`text-xs uppercase tracking-widest mb-1 ${textMuted}`} style={{ fontSize: 10 }}>
                    Wishlist
                  </p>
                  <p
                    className={`text-3xl font-light ${textPrimary}`}
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {wishlist.length}
                  </p>
                  <p className={`text-xs mt-1 ${textMuted}`}>
                    {wishlist.length === 1 ? 'item' : 'items'} saved
                  </p>
                </motion.div>

              </div>

              {/* Account Info */}
              <div className={`border p-6 mt-4 ${cardBg}`} style={{ borderRadius: 2 }}>
                <h3
                  className={`text-sm font-light mb-4 ${textPrimary}`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}
                >
                  Account Details
                </h3>
                <div className={`flex flex-col gap-3 text-sm divide-y ${divider}`}>
                  <div className="flex justify-between py-2">
                    <span className={textMuted}>Role</span>
                    <span className={textPrimary} style={{ textTransform: 'capitalize' }}>{user?.role || 'User'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className={textMuted}>Member since</span>
                    <span className={textPrimary}>
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className={textMuted}>Username</span>
                    <span className={textPrimary}>@{user?.username}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;