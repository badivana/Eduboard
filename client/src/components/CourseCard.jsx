import { Link } from 'react-router-dom';
import { FiStar, FiUsers, FiClock } from 'react-icons/fi';

const fallbackThumb =
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80';

export default function CourseCard({ course }) {
  const minutes = (course.lessons || []).reduce((s, l) => s + (l.duration || 0), 0);
  const hours = (minutes / 60).toFixed(1);

  return (
    <Link
      to={`/courses/${course.slug || course._id}`}
      className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={course.thumbnail || fallbackThumb}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {course.category}
        </span>
        {course.price === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold text-white">
            FREE
          </span>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="rounded bg-slate-100 px-2 py-0.5">{course.level}</span>
          {course.instructor?.name && <span>by {course.instructor.name}</span>}
        </div>

        <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 group-hover:text-brand-600">
          {course.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-amber-500">
            <FiStar className="fill-current" /> {course.ratingAverage?.toFixed(1) || 'New'}
          </span>
          <span className="flex items-center gap-1">
            <FiUsers /> {course.enrolledCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <FiClock /> {hours}h
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-lg font-bold text-slate-900">
            {course.price === 0 ? 'Free' : `$${course.price}`}
          </span>
          <span className="text-sm font-medium text-brand-600 group-hover:underline">
            View course →
          </span>
        </div>
      </div>
    </Link>
  );
}
