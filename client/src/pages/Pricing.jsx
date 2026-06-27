import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import api from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';
import Spinner from '../components/Spinner.jsx';

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. You can upgrade, downgrade, or cancel your plan at any time from your dashboard.' },
  { q: 'Do you offer refunds?', a: 'We offer a 30-day money-back guarantee on all paid plans, no questions asked.' },
  { q: 'Are certificates included?', a: 'Pro and Teams plans include verified, shareable certificates of completion.' },
];

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/plans')
      .then((res) => setPlans(res.data.plans))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50">
      <section className="bg-white py-16">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            subtitle="Choose the plan that fits your learning goals. No hidden fees."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-px">
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`card relative flex flex-col p-8 ${
                    plan.highlighted ? 'ring-2 ring-brand-500' : ''
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold text-white">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.tagline}</p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                    <span className="mb-1 text-slate-500">/{plan.interval}</span>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <FiCheck className="mt-0.5 shrink-0 text-brand-500" /> {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`mt-8 w-full ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {plan.price === 0 ? 'Start for Free' : `Choose ${plan.name}`}
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="text-center text-2xl font-bold text-slate-900">Frequently asked questions</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border border-slate-100 bg-white p-5">
                  <summary className="cursor-pointer list-none font-medium text-slate-800 marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
