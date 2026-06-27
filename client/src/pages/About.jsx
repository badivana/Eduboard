import { Link } from 'react-router-dom';
import { FiTarget, FiHeart, FiTrendingUp } from 'react-icons/fi';
import SectionHeading from '../components/SectionHeading.jsx';

const values = [
  { Icon: FiTarget, title: 'Our Mission', text: 'To make high-quality education accessible to everyone, everywhere — regardless of background.' },
  { Icon: FiHeart, title: 'Our Values', text: 'We believe learning should be joyful, practical, and built around real human needs.' },
  { Icon: FiTrendingUp, title: 'Our Impact', text: 'Over 50,000 learners have advanced their careers and lives through EduBoard courses.' },
];

export default function About() {
  return (
    <div className="bg-slate-50">
      <section className="bg-white py-16">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="About EduBoard"
            title="The purpose is to teach, bring learning to people"
            subtitle="EduBoard is a modern learning platform built to help people grow the skills that matter."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-px grid items-center gap-12 lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=900&q=80"
            alt="Team collaborating"
            className="rounded-3xl shadow-card"
          />
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Learning that fits your life</h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              "Learning is not attained by chance, it must be sought for with ardor and attended to
              with diligence." We built EduBoard around that idea — giving learners the tools, the
              teachers, and the flexibility to pursue knowledge on their own terms.
            </p>
            <p className="mt-4 leading-relaxed text-slate-600">
              From development and design to data science and business, our expert-led courses are
              designed to be practical, engaging, and genuinely useful in the real world.
            </p>
            <Link to="/courses" className="btn-primary mt-6">Browse Courses</Link>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-px grid gap-8 md:grid-cols-3">
          {values.map(({ Icon, title, text }) => (
            <div key={title} className="card p-8">
              <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-600">
                <Icon size={26} />
              </span>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
