import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios.js';
import SectionHeading from '../components/SectionHeading.jsx';

const initial = { name: '', email: '', subject: '', message: '' };

const info = [
  { Icon: FiMail, label: 'Email', value: 'hello@eduboard.com' },
  { Icon: FiPhone, label: 'Phone', value: '+1 (555) 123-4567' },
  { Icon: FiMapPin, label: 'Office', value: '123 Learning Ave, San Francisco, CA' },
];

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      toast.success(res.data.message);
      setForm(initial);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-white py-16">
        <div className="container-px">
          <SectionHeading
            center
            eyebrow="Contact"
            title="Get in touch"
            subtitle="Have a question or feedback? We'd love to hear from you."
          />
        </div>
      </section>

      <section className="section">
        <div className="container-px grid gap-10 lg:grid-cols-3">
          {/* Info */}
          <div className="space-y-6 lg:col-span-1">
            {info.map(({ Icon, label, value }) => (
              <div key={label} className="card flex items-start gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon size={20} />
                </span>
                <div>
                  <div className="text-sm text-slate-500">{label}</div>
                  <div className="font-medium text-slate-800">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="card space-y-5 p-8 lg:col-span-2">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label">Name</label>
                <input name="name" value={form.name} onChange={onChange} required className="input" placeholder="Your name" />
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" value={form.email} onChange={onChange} required className="input" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Subject</label>
              <input name="subject" value={form.subject} onChange={onChange} className="input" placeholder="How can we help?" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea name="message" value={form.message} onChange={onChange} required rows={5} className="input" placeholder="Tell us more…" />
            </div>
            <button disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
