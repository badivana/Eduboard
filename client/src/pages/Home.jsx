import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiMonitor, FiAward, FiBookOpen, FiCheck } from 'react-icons/fi';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Spinner from '../components/Spinner.jsx';

const features = [
  {
    Icon: FiMonitor,
    title: 'Learn Anywhere',
    text: 'Switch seamlessly between your computer, tablet, or mobile and pick up right where you left off.',
  },
  {
    Icon: FiAward,
    title: 'Expert Teachers',
    text: 'Learn from industry experts who are passionate about teaching and helping you succeed.',
  },
  {
    Icon: FiBookOpen,
    title: 'Unlimited Resources',
    text: 'Choose from an extensive library of courses across development, design, business and more.',
  },
];

const stats = [
  { value: '500+', label: 'Courses' },
  { value: '50k+', label: 'Students' },
  { value: '200+', label: 'Instructors' },
  { value: '4.8★', label: 'Avg. Rating' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/courses', { params: { featured: true, limit: 3 } })
      .then((res) => setFeatured(res.data.courses))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-50">
        <div className="container-px grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
              🎓 Trusted by 50,000+ learners
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              The purpose is to <span className="text-brand-500">teach</span>, bring learning to people
            </h1>
            <p className="mt-6 max-w-lg text-lg text-slate-600">
              EduBoard is a modern learning platform where you can master new skills from expert
              instructors — at your own pace, from anywhere in the world.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-primary">
                Explore Courses <FiArrowRight />
              </Link>
              <Link to="/register" className="btn-outline">Start Free Trial</Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute -right-6 -top-6 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80"
              alt="Students learning together"
              className="relative rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-card sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-100 text-brand-600">
                  <FiAward size={22} />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">Certified Courses</div>
                  <div className="text-xs text-slate-500">Earn shareable certificates</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="Why EduBoard"
            title="Everything you need to grow"
            subtitle="A platform designed around how people actually learn."
          />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {features.map(({ Icon, title, text }) => (
              <div key={title} className="card p-8 text-center transition hover:-translate-y-1">
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-600">
                  <Icon size={26} />
                </span>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section className="section bg-white">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Top picks"
              title="Browse our top courses"
              subtitle="Hand-picked courses to kickstart your learning journey."
            />
            <Link to="/courses" className="btn-outline">View all <FiArrowRight /></Link>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-px">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center sm:px-16">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-brand-400/20 blur-3xl" />
            <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
              Limitless learning, limitless possibilities
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-slate-300">
              Join thousands of learners building real skills. Start your free trial today — no credit card required.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary">Get Started Free</Link>
              <Link to="/pricing" className="btn bg-white/10 text-white hover:bg-white/20">See Pricing</Link>
            </div>
            <ul className="relative mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
              {['Cancel anytime', 'Certificates included', 'Learn on any device'].map((t) => (
                <li key={t} className="flex items-center gap-2"><FiCheck className="text-brand-400" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
