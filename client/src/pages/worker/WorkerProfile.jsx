import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updateAvailability } from '../../utils/api';

const DEFAULT_PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=400&q=80',
];

const WorkerProfile = () => {
  const { user, refreshUser } = useAuth();
  const [isAvailable, setIsAvailable] = useState(user?.isAvailable !== false);
  const [togglingAvail, setTogglingAvail] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [dailyWage, setDailyWage] = useState(user?.dailyWageExpectation || 700);
  const [experienceYears, setExperienceYears] = useState(user?.experienceYears || 7);
  const [skills, setSkills] = useState(
    user?.skills && user.skills.length > 0
      ? user.skills
      : ['Electrical Wiring', 'Panel Installation', 'House Wiring', 'Fault Finding']
  );
  const [newSkillInput, setNewSkillInput] = useState('');
  const [bio, setBio] = useState(
    user?.bio || 'Certified A-grade electrician with 7+ years of experience across residential and commercial high-rises.'
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setIsAvailable(user.isAvailable !== false);
      setDailyWage(user.dailyWageExpectation || 700);
      setExperienceYears(user.experienceYears || 7);
      if (user.skills?.length) setSkills(user.skills);
      if (user.bio) setBio(user.bio);
    }
  }, [user]);

  const handleToggleAvailability = async () => {
    setTogglingAvail(true);
    try {
      const nextVal = !isAvailable;
      const res = await updateAvailability(nextVal);
      setIsAvailable(res.data.isAvailable);
      if (refreshUser) await refreshUser();
      setMessage(`Status updated to ${res.data.isAvailable ? 'Available' : 'Unavailable'}`);
      setTimeout(() => setMessage(null), 2500);
    } catch {
      setIsAvailable(!isAvailable);
    } finally {
      setTogglingAvail(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        dailyWageExpectation: Number(dailyWage),
        experienceYears: Number(experienceYears),
        skills,
        bio,
      });
      if (refreshUser) await refreshUser();
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto' }}>
      {/* Top Header Row (Screen 6: "My Profile" with "Edit Profile" button) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
          My Profile
        </h1>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-secondary"
          style={{
            padding: '8px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#DCFCE7',
            color: '#15803D',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          {message}
        </div>
      )}

      {/* Main Profile Card (Screen 6) */}
      <div
        style={{
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '28px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Worker Info Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* Hard-hat avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#FEF9C3',
                border: '3px solid var(--color-yellow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.4rem',
                overflow: 'hidden',
              }}
            >
              👷‍♂️
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-charcoal)', margin: 0 }}>
                  {user?.name || 'Rohit Kumar'}
                </h2>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  ✓ Verified
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', color: 'var(--color-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
                  {user?.tradeCategory || 'Electrician'}
                </span>
                <span>•</span>
                <span>📍 {user?.city || 'Mumbai, MH'}</span>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: '0.875rem' }}>
                <span style={{ color: '#D97706', fontWeight: 700 }}>★ 4.8</span>
                <span style={{ color: 'var(--color-muted)', fontSize: '0.8125rem' }}>(32 reviews)</span>
              </div>
            </div>
          </div>

          {/* Availability switch */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 16px',
              backgroundColor: 'var(--color-bg-page)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>
              {isAvailable ? '🟢 Online & Available' : '⚪ Offline'}
            </span>
            <button
              type="button"
              disabled={togglingAvail}
              onClick={handleToggleAvailability}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                backgroundColor: isAvailable ? 'var(--color-yellow)' : '#CBD5E1',
                border: 'none',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  position: 'absolute',
                  top: 3,
                  left: isAvailable ? 23 : 3,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </button>
          </div>
        </div>

        {/* 3 Stat Counters (Screen 6: 12 Jobs Done, 4 Squad Projects, 7 Years Exp.) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-page)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>12</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontWeight: 500 }}>Jobs Done</div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg-page)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>4</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontWeight: 500 }}>Squad Projects</div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-bg-page)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-charcoal)' }}>
              {experienceYears}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontWeight: 500 }}>Years Exp.</div>
          </div>
        </div>

        {/* Skills Section (Screen 6) */}
        <div>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--color-charcoal)',
              margin: '0 0 12px 0',
            }}
          >
            Skills
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {skills.map((skill) => (
              <span
                key={skill}
                style={{
                  backgroundColor: 'var(--color-bg-page)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-charcoal)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {skill}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-error)',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    ✕
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <input
                type="text"
                placeholder="Add new skill..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8125rem',
                }}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8125rem' }}>
                + Add
              </button>
            </form>
          )}
        </div>

        {/* Portfolio Section (Screen 6: Construction Work Photos Grid) */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-charcoal)', margin: 0 }}>
              Portfolio
            </h3>
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-muted)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View All
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: 12,
            }}
          >
            {DEFAULT_PORTFOLIO_IMAGES.map((img, i) => (
              <div
                key={i}
                style={{
                  height: 120,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                }}
              >
                <img
                  src={img}
                  alt={`Portfolio site ${i + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80';
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Edit Form Area when Active */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700 }}>Edit Profile Information</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Daily Wage Expectation (₹/day)
                </label>
                <input
                  type="number"
                  value={dailyWage}
                  onChange={(e) => setDailyWage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.875rem',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Professional Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  resize: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.875rem' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary"
                style={{ padding: '8px 24px', fontSize: '0.875rem', fontWeight: 700 }}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WorkerProfile;
