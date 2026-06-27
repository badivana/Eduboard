import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiGithub } from 'react-icons/fi';

const socials = [
  { Icon: FiFacebook, href: '#' },
  { Icon: FiTwitter, href: '#' },
  { Icon: FiInstagram, href: '#' },
  { Icon: FiLinkedin, href: '#' },
  { Icon: FiGithub, href: '#' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300">
      <div className="container-px grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500">E</span>
            EduBoard
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            The purpose is to teach, and bring learning to people. Limitless learning, limitless possibilities.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-brand-400">Courses</Link></li>
            <li><Link to="/pricing" className="hover:text-brand-400">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-brand-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-brand-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-brand-400">Log in</Link></li>
            <li><Link to="/register" className="hover:text-brand-400">Create account</Link></li>
            <li><Link to="/dashboard" className="hover:text-brand-400">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-semibold text-white">Follow Us</h4>
          <div className="flex gap-3">
            {socials.map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 transition hover:bg-brand-500 hover:text-white"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6">
        <p className="container-px text-center text-sm text-slate-500">
          © {new Date().getFullYear()} EduBoard. Built with the MERN stack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
