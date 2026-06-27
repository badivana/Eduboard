import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiPlayCircle, FiLock, FiClock, FiUsers, FiBarChart2, FiGlobe, FiCheckCircle,
} from 'react-icons/fi';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Spinner from '../components/Spinner.jsx';
import Stars from '../components/Stars.jsx';

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Review form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/courses/${slug}`)
      .then(async (res) => {
        if (!active) return;
        setCourse(res.data.course);
        setReviews(res.data.reviews);
        if (isAuthenticated) {
          try {
            const chk = await api.get(`/enrollments/check/${res.data.course._id}`);
            if (active) setEnrolled(chk.data.enrolled);
          } catch { /* ignore */ }
        }
      })
      .catch(() => setCourse(null))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${slug}` } } });
      return;
    }
    setEnrolling(true);
    try {
      await api.post('/enrollments', { courseId: course._id });
      setEnrolled(true);
      setCourse((c) => ({ ...c, enrolledCount: c.enrolledCount + 1 }));
      toast.success('Enrolled! Find it in your dashboard.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reviews', { courseId: course._id, rating, comment });
      // Replace existing review by this user, or prepend
      setReviews((prev) => {
        const others = prev.filter((r) => r.user?._id !== user._id);
        return [res.data.review, ...others];
      });
      setComment('');
      toast.success('Thanks for your review!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Spinner full />;
  if (!course)
    return (
      <div className="container-px py-24 text-center">
        <h2 className="text-2xl font-bold">Course not found</h2>
        <Link to="/courses" className="btn-primary mt-6">Back to courses</Link>
      </div>
    );

  const minutes = (course.lessons || []).reduce((s, l) => s + (l.duration || 0), 0);
  const hours = (minutes / 60).toFixed(1);

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-900 text-white">
        <div className="container-px grid gap-10 py-14 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Link to="/courses" className="text-sm text-brand-400 hover:underline">← All courses</Link>
            <span className="mt-4 inline-block rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300">
              {course.category}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{course.title}</h1>
            {course.subtitle && <p className="mt-3 text-lg text-slate-300">{course.subtitle}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Stars value={course.ratingAverage} size={16} />
                <span className="text-slate-300">{course.ratingAverage?.toFixed(1)} ({course.ratingCount})</span>
              </span>
              <span className="flex items-center gap-1.5"><FiUsers /> {course.enrolledCount} students</span>
              <span className="flex items-center gap-1.5"><FiBarChart2 /> {course.level}</span>
              <span className="flex items-center gap-1.5"><FiGlobe /> {course.language}</span>
            </div>

            {course.instructor && (
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=04aa6d&color=fff`}
                  alt={course.instructor.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="text-sm">
                  <div className="text-slate-400">Created by</div>
                  <div className="font-semibold">{course.instructor.name}</div>
                </div>
              </div>
            )}
          </div>

          {/* Enroll card */}
          <div className="lg:col-span-1">
            <div className="overflow-hidden rounded-2xl bg-white text-slate-800 shadow-2xl">
              <img
                src={course.thumbnail || 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80'}
                alt={course.title}
                className="aspect-video w-full object-cover"
              />
              <div className="p-6">
                <div className="text-3xl font-extrabold">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </div>
                {enrolled ? (
                  <Link to="/dashboard" className="btn-primary mt-5 w-full">
                    <FiCheckCircle /> Go to my learning
                  </Link>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling} className="btn-primary mt-5 w-full">
                    {enrolling ? 'Enrolling…' : 'Enroll Now'}
                  </button>
                )}
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><FiClock className="text-brand-500" /> {hours} hours of content</li>
                  <li className="flex items-center gap-2"><FiPlayCircle className="text-brand-500" /> {course.lessons?.length || 0} lessons</li>
                  <li className="flex items-center gap-2"><FiBarChart2 className="text-brand-500" /> {course.level}</li>
                  <li className="flex items-center gap-2"><FiCheckCircle className="text-brand-500" /> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container-px grid gap-10 py-14 lg:grid-cols-3">
        <div className="space-y-12 lg:col-span-2">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900">About this course</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">{course.description}</p>
            {course.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {course.tags.map((t) => (
                  <span key={t} className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-600">#{t}</span>
                ))}
              </div>
            )}
          </section>

          {/* Curriculum */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900">Course content</h2>
            <p className="mt-1 text-sm text-slate-500">{course.lessons?.length || 0} lessons • {hours}h total</p>
            <div className="mt-5 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white">
              {(course.lessons || []).map((lesson, i) => {
                const open = enrolled || lesson.isPreview;
                return (
                  <div key={lesson._id || i} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      {open ? (
                        <FiPlayCircle className="text-brand-500" />
                      ) : (
                        <FiLock className="text-slate-400" />
                      )}
                      <span className="text-sm font-medium text-slate-700">
                        {i + 1}. {lesson.title}
                      </span>
                      {lesson.isPreview && !enrolled && (
                        <span className="rounded bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">Preview</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{lesson.duration} min</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900">Student reviews</h2>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-4xl font-extrabold text-slate-900">{course.ratingAverage?.toFixed(1) || '—'}</span>
              <div>
                <Stars value={course.ratingAverage} />
                <p className="text-sm text-slate-500">{course.ratingCount} reviews</p>
              </div>
            </div>

            {/* Write a review (enrolled only) */}
            {enrolled && (
              <form onSubmit={submitReview} className="mt-6 rounded-xl border border-slate-100 bg-white p-5">
                <p className="mb-2 font-medium text-slate-700">Leave a review</p>
                <Stars value={rating} onChange={setRating} size={24} />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience…"
                  rows={3}
                  className="input mt-3"
                />
                <button className="btn-primary mt-3">Submit review</button>
              </form>
            )}

            <div className="mt-6 space-y-5">
              {reviews.length === 0 && <p className="text-slate-500">No reviews yet. Be the first!</p>}
              {reviews.map((r) => (
                <div key={r._id} className="rounded-xl border border-slate-100 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.user?.name || 'User')}&background=e2e8f0&color=334155`}
                      alt={r.user?.name}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{r.user?.name || 'Student'}</div>
                      <Stars value={r.rating} size={14} />
                    </div>
                  </div>
                  {r.comment && <p className="mt-3 text-sm text-slate-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar: instructor */}
        <aside className="lg:col-span-1">
          {course.instructor && (
            <div className="card sticky top-24 p-6">
              <h3 className="font-bold text-slate-900">Your instructor</h3>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src={course.instructor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=04aa6d&color=fff`}
                  alt={course.instructor.name}
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-800">{course.instructor.name}</div>
                  <div className="text-sm text-slate-500">Instructor</div>
                </div>
              </div>
              {course.instructor.bio && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{course.instructor.bio}</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
