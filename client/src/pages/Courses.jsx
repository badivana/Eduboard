import { useEffect, useState, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';
import Spinner from '../components/Spinner.jsx';

const categories = ['All', 'Development', 'Design', 'Business', 'Marketing', 'Data Science', 'Photography'];
const sorts = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: 9 };
      if (debounced) params.search = debounced;
      if (category !== 'All') params.category = category;
      const res = await api.get('/courses', { params });
      setCourses(res.data.courses);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, [debounced, category, sort, page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debounced, category, sort]);

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <section className="bg-white py-14">
        <div className="container-px text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Explore Courses
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Find the perfect course to level up your skills. {total} courses and counting.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses, topics, or keywords…"
              className="input pl-11"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="container-px py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  category === c
                    ? 'bg-brand-500 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-auto py-2 text-sm"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <Spinner />
        ) : courses.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-medium text-slate-700">No courses found</p>
            <p className="mt-1 text-slate-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Previous
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`h-10 w-10 rounded-lg text-sm font-medium ${
                      p === page ? 'bg-brand-500 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-outline px-4 py-2 text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
