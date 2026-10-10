import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getWorkerFeed, getMyGigs, updateAvailability } from '../../utils/api';
import JobDetailsModal from './JobDetailsModal';

const DEFAULT_SAMPLE_JOBS = [
  {
    _id: 'sample-job-1',
    title: 'Brick Mason - Residential Building',
    company: 'Apex Construction',
    location: { city: 'Andheri', state: 'Mumbai', distance: '8 km' },
    tradeCategory: 'Mason',
    budget: { amount: 600, type: 'day' },
    hours: '8 hrs',
    postedTime: '2 days ago',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80',
    description: 'Build brick walls and partitions, read drawings and measurements, good physical fitness required.',
    requirements: ['Experience', 'Own Tools', 'ID Proof'],
    employerRating: 4.8,
    employerReviews: 30,
    employerName: 'Apex Construction',
    urgency: 'flexible',
    employerType: 'contractor',
  },
  {
    _id: 'sample-job-2',
    title: 'Helper - Commercial Site',
    company: 'Ridge Builders',
    location: { city: 'Goregaon', state: 'Mumbai', distance: '12 km' },
    tradeCategory: 'General Labor',
    budget: { amount: 500, type: 'day' },
    hours: '10 hrs',
    postedTime: '10 hrs ago',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80',
    description: 'Material shifting, assisting senior masons, clearing debris and site safety adherence.',
    requirements: ['Physical Fitness', 'Hard Hat', 'Safety Shoes'],
    employerRating: 4.6,
    employerReviews: 18,
    employerName: 'Ridge Builders',
    urgency: 'today',
    employerType: 'builder',
  },
  {
    _id: 'sample-job-3',
    title: 'Electrician - Residential Site',
    company: 'Home Services',
    location: { city: 'Malad', state: 'Mumbai', distance: '15 km' },
    tradeCategory: 'Electrician',
    budget: { amount: 700, type: 'day' },
    hours: '8 hrs',
    postedTime: '2 days ago',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
    description: 'Conduit laying, internal wire pulling, distribution board installation and circuit check.',
    requirements: ['Wireman License', 'Insulated Tools', 'Testing Pen'],
    employerRating: 4.9,
    employerReviews: 42,
    employerName: 'Home Services Inc',
    urgency: 'tomorrow',
    employerType: 'domestic',
  },
  {
    _id: 'sample-job-4',
    title: 'Carpenter - Modular Interior Fitting',
    company: 'WoodCraft Studio',
    location: { city: 'Bandra', state: 'Mumbai', distance: '6 km' },
    tradeCategory: 'Carpenter',
    budget: { amount: 850, type: 'day' },
    hours: '8 hrs',
    postedTime: '1 day ago',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    description: 'Kitchen cabinet hardware installation, laminating and finishing wooden fixtures.',
    requirements: ['Joinery Experience', 'Precision Tools', 'Punctuality'],
    employerRating: 4.7,
    employerReviews: 24,
    employerName: 'WoodCraft Studio',
    urgency: 'flexible',
    employerType: 'contractor',
  },
];

const WorkerDashboard = () => {
  const { user } = useAuth();
  const [feedJobs, setFeedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDistance, setSelectedDistance] = useState('25');

  useEffect(() => {
    const fetch = async () => {
      try {
        const feedRes = await getWorkerFeed({ limit: 10 });
        const apiJobs = feedRes.data?.jobs || [];
        
        if (apiJobs.length > 0) {
          // Merge API jobs with sample fallback formatting
          const formatted = apiJobs.map((j, idx) => ({
            _id: j._id,
            title: j.title,
            company: j.employerId?.name || j.client?.name || 'Verified Employer',
            location: {
              city: j.location?.city || 'Mumbai',
              state: j.location?.state || 'MH',
              distance: `${(idx + 1) * 4} km`,
            },
            tradeCategory: j.tradeCategory || 'Mason',
            budget: j.budget || { amount: 600, type: 'day' },
            hours: '8 hrs',
            postedTime: 'Recently',
            image: DEFAULT_SAMPLE_JOBS[idx % DEFAULT_SAMPLE_JOBS.length].image,
            description: j.description,
            requirements: ['Experience', 'Basic Tools', 'ID Proof'],
            employerRating: 4.8,
            employerReviews: 24,
            employerName: j.employerId?.name || 'Site Manager',
            urgency: j.urgency,
            employerType: j.employerType || 'contractor',
            applications: j.applications,
          }));
          setFeedJobs(formatted);
        } else {
          setFeedJobs(DEFAULT_SAMPLE_JOBS);
        }
      } catch {
        setFeedJobs(DEFAULT_SAMPLE_JOBS);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  // Filter jobs
  const filteredJobs = feedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrade =
      selectedTrade === 'All' ||
      job.tradeCategory?.toLowerCase() === selectedTrade.toLowerCase();

    const matchesType =
      selectedType === 'All' ||
      (selectedType === 'Contractor' && job.employerType === 'contractor') ||
      (selectedType === 'Builder' && job.employerType === 'builder') ||
      (selectedType === 'Domestic' && job.employerType === 'domestic');

    return matchesSearch && matchesTrade && matchesType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Search & Filter Bar (Screen 4 visual design) */}
      <div
        style={{
          background: 'var(--color-white)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 320px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)',
                fontSize: '0.9rem',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="Search jobs, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-bg-page)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.85rem',
              color: 'var(--color-charcoal)',
              fontWeight: 500,
            }}
          >
            📍 <span>{user?.city || 'Andheri, Mumbai'}</span>
          </div>

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'var(--color-yellow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: 'var(--color-charcoal)',
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : 'W'}
          </div>
        </div>
      </div>

      {/* Available Jobs Header & Secondary Filters */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-charcoal)', margin: 0 }}>
          Available Jobs
        </h2>

        {/* Filter Pills / Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-charcoal)',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Trades</option>
            <option value="Mason">Mason</option>
            <option value="Electrician">Electrician</option>
            <option value="Carpenter">Carpenter</option>
            <option value="General Labor">General Labor</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-charcoal)',
              cursor: 'pointer',
            }}
          >
            <option value="All">All Types</option>
            <option value="Contractor">Contractor</option>
            <option value="Builder">Builder</option>
            <option value="Domestic">Domestic</option>
          </select>

          <select
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-white)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--color-charcoal)',
              cursor: 'pointer',
            }}
          >
            <option value="5">Within 5 km</option>
            <option value="15">Within 15 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
          </select>
        </div>
      </div>

      {/* Available Job Cards List (Screen 4 Layout) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading ? (
          <div className="empty-state">
            <div className="spinner" />
            <p>Loading available jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>🔍</span>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>No jobs matching criteria</h3>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem' }}>
              Try broadening your filters or distance range.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job._id}
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16,
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              className="job-card-hover"
            >
              {/* Left Column: Photo Thumbnail & Job Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 380px' }}>
                <img
                  src={job.image}
                  alt={job.title}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80';
                  }}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                    flexShrink: 0,
                    backgroundColor: '#E5E7EB',
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: 'var(--color-charcoal)',
                      margin: 0,
                    }}
                  >
                    {job.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: 'var(--color-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{job.company}</span>
                    <span>•</span>
                    <span>
                      {job.location.city} ({job.location.distance || '10 km'})
                    </span>
                  </div>
                  {/* Badges row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        backgroundColor: '#FEF9C3',
                        color: '#854D0E',
                        fontWeight: 700,
                        fontSize: '0.8125rem',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      ₹{job.budget?.amount || 600}/{job.budget?.type || 'day'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                      ⏱ {job.hours || '8 hrs'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                      🕒 {job.postedTime || '2 days ago'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Apply Now CTA Button */}
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedJob(job)}
                  style={{
                    padding: '9px 22px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                  }}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Screen 5 Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplySuccess={() => {
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkerDashboard;
