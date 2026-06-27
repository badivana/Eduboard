import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiBookOpen, FiCheckCircle, FiTrendingUp, FiPlus } from 'react-icons/fi';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';

function StatCard({ Icon, value, label }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-600">
        <Icon size={22} />
      </span>
      <div>
        <div className="text-2xl font-extrabold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function EnrollmentCard({ enrollment, onProgress }) {
  const c = enrollment.course;
  if (!c) return null;
  const total = c.lessons?.length || 0;
  const done = enrollment.completedLessons?.length || 0;

  const markComplete = () => {
    // Demo progress: complete one more lesson
    const next = Math.min(done + 1, total);
    const ids = (c.lessons || []).slice(0, next).map((l) => l._id);
    onProgress(enrollment._id, ids);
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <img
          src={c.thumbnail || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80'}
          alt={c.title}
          className="h-40 w-full object-cover sm:h-auto sm:w-44"
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-brand-600">{c.category}</span>
              <h3 className="font-semibold text-slate-900">
                <Link to={`/courses/${c.slug || c._id}`} className="hover:text-brand-600">{c.title}</Link>
              </h3>
              <p className="text-xs text-slate-500">by {c.instructor?.name}</p>
            </div>
            {enrollment.status === 'completed' && (
              <span className="flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">
                <FiCheckCircle /> Done
              </span>
            )}
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>{done}/{total} lessons</span>
              <span>{enrollment.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${enrollment.progress}%` }} />
            </div>
            <div className="mt-3 flex gap-2">
              <Link to={`/courses/${c.slug || c._id}`} className="btn-outline px-3 py-1.5 text-xs">Continue</Link>
              {enrollment.status !== 'completed' && (
                <button onClick={markComplete} className="btn-ghost px-3 py-1.5 text-xs">Mark next lesson done</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('learning');

  // Profile form
  const [profile, setProfile] = useState({ name: user.name, bio: user.bio || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    api
      .get('/enrollments/me')
      .then((res) => setEnrollments(res.data.enrollments))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateProgress = async (id, completedLessons) => {
    try {
      const res = await api.patch(`/enrollments/${id}/progress`, { completedLessons });
      setEnrollments((prev) => prev.map((e) => (e._id === id ? { ...e, ...res.data.enrollment, course: e.course } : e)));
      toast.success('Progress saved');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', profile);
      updateUser(res.data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const completed = enrollments.filter((e) => e.status === 'completed').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="bg-white py-10">
        <div className="container-px flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=04aa6d&color=fff`}
              alt={user.name}
              className="h-14 w-14 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Hi, {user.name.split(' ')[0]} 👋</h1>
              <p className="text-sm capitalize text-slate-500">{user.role} account</p>
            </div>
          </div>
          <Link to="/courses" className="btn-primary"><FiPlus /> Browse courses</Link>
        </div>
      </section>

      <div className="container-px py-10">
        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard Icon={FiBookOpen} value={enrollments.length} label="Enrolled courses" />
          <StatCard Icon={FiCheckCircle} value={completed} label="Completed" />
          <StatCard Icon={FiTrendingUp} value={`${avgProgress}%`} label="Average progress" />
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-2 border-b border-slate-200">
          {[
            { id: 'learning', label: 'My Learning' },
            { id: 'profile', label: 'Profile' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.id ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* My Learning */}
        {tab === 'learning' && (
          <div className="mt-8">
            {loading ? (
              <Spinner />
            ) : enrollments.length === 0 ? (
              <div className="card p-12 text-center">
                <p className="text-lg font-medium text-slate-700">You're not enrolled in any courses yet</p>
                <p className="mt-1 text-slate-500">Explore our catalog and start learning today.</p>
                <Link to="/courses" className="btn-primary mt-6">Browse courses</Link>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {enrollments.map((e) => (
                  <EnrollmentCard key={e._id} enrollment={e} onProgress={updateProgress} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        {tab === 'profile' && (
          <form onSubmit={saveProfile} className="card mt-8 max-w-xl space-y-5 p-8">
            <div>
              <label className="label">Full name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input value={user.email} disabled className="input bg-slate-100" />
            </div>
            <div>
              <label className="label">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                rows={4}
                className="input"
                placeholder="Tell us about yourself…"
              />
            </div>
            <button disabled={savingProfile} className="btn-primary">
              {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
