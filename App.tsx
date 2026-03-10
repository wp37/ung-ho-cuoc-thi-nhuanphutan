import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Heart, Star, Clock, ExternalLink, Youtube, Mail,
  AlertTriangle, CheckCircle, Users, Award, Sparkles,
  ChevronDown, Vote, Phone, MessageCircle, Shield, Trophy,
  GraduationCap, Megaphone
} from 'lucide-react';

/* ================================================================
   CONFIG
   ================================================================ */
const DEADLINE = new Date('2026-03-14T23:59:59+07:00');
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfPqCKE69Z1rFBHB95Z_VZ78H6HS_pJGiAIq5L_atYilMd8dQ/viewform';
const VIDEO_URL = 'https://youtu.be/Kt8XkPFmFCo?si=pYUHJ6nQmL-wEi7f';
const VIDEO_EMBED = 'https://www.youtube.com/embed/Kt8XkPFmFCo?si=pYUHJ6nQmL-wEi7f';


/* ================================================================
   HOOKS
   ================================================================ */
function useCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: false,
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/* ================================================================
   PARTICLES  —  premium starfield
   ================================================================ */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight * 3); // tall canvas for scroll
    interface Dot { x: number; y: number; r: number; a: number; da: number }
    const dots: Dot[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random(),
      da: (Math.random() - 0.5) * 0.008,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.a += d.da;
        if (d.a <= 0.1 || d.a >= 0.9) d.da *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${d.a * 0.6})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight * 3; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
}

/* ================================================================
   COUNTDOWN DIGIT
   ================================================================ */
function Digit({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <div className={`
          w-[68px] h-[76px] sm:w-[88px] sm:h-[96px] md:w-[100px] md:h-[108px]
          rounded-2xl bg-white/[0.07] backdrop-blur-2xl
          border border-white/[0.12]
          flex items-center justify-center
          shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          transition-transform duration-300 group-hover:scale-110
        `}>
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              className={`text-3xl sm:text-4xl md:text-5xl font-black ${color} drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]`}
              initial={{ y: -24, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: 24, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {String(value).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        </div>
        {/* glow */}
        <div className={`absolute -inset-2 rounded-2xl blur-2xl opacity-20 -z-10 bg-gradient-to-br ${color === 'text-amber-300' ? 'from-amber-400 to-orange-400' : color === 'text-cyan-300' ? 'from-cyan-400 to-blue-400' : color === 'text-pink-300' ? 'from-pink-400 to-rose-400' : 'from-purple-400 to-indigo-400'}`} />
      </div>
      <span className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

/* ================================================================
   NUMBER BADGE  —  glowing 1, 2, 3
   ================================================================ */
function NumberBadge({ n, color, delay }: { n: number; color: string; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ delay, type: 'spring', stiffness: 300, damping: 15 }}
      whileHover={{ scale: 1.2, rotate: 5 }}
      className="relative"
    >
      <div className={`
        w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
        bg-gradient-to-br ${color}
        flex items-center justify-center
        shadow-2xl cursor-default
        border border-white/20
      `}>
        <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">{n}</span>
      </div>
      {/* Outer glow */}
      <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${color} blur-xl opacity-30 -z-10`} />
    </motion.div>
  );
}

/* ================================================================
   SECTION WRAPPER
   ================================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 44 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className={`relative z-10 py-20 sm:py-28 px-4 sm:px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}



/* ================================================================
   FOMO SOCIAL PROOF  —  "Thầy/Cô/Bạn X vừa bình chọn"
   ================================================================ */
const FOMO_NAMES = [
  { role: 'Thầy', name: 'Minh' },
  { role: 'Cô', name: 'Hương' },
  { role: 'Bạn', name: 'Tuấn Anh' },
  { role: 'Cô', name: 'Thảo' },
  { role: 'Thầy', name: 'Đông' },
  { role: 'Bạn', name: 'Ngọc Trâm' },
  { role: 'Thầy', name: 'Hùng' },
  { role: 'Cô', name: 'Lan' },
  { role: 'Bạn', name: 'Minh Khôi' },
  { role: 'Cô', name: 'Nguyệt' },
  { role: 'Thầy', name: 'Phước' },
  { role: 'Bạn', name: 'Thùy Linh' },
  { role: 'Thầy', name: 'Tâm' },
  { role: 'Cô', name: 'Yến' },
  { role: 'Bạn', name: 'Hoàng' },
  { role: 'Cô', name: 'Mai' },
  { role: 'Bạn', name: 'Phương' },
  { role: 'Thầy', name: 'Nam' },
  { role: 'Bạn', name: 'Gia Hân' },
  { role: 'Cô', name: 'Trang' },
];

const FOMO_TIMES = ['vừa xong', '2 phút trước', '5 phút trước', '1 phút trước', 'vừa xong', '3 phút trước'];

function FomoNotifications() {
  const [current, setCurrent] = useState<{ role: string; name: string; time: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const show = () => {
      const person = FOMO_NAMES[Math.floor(Math.random() * FOMO_NAMES.length)];
      const time = FOMO_TIMES[Math.floor(Math.random() * FOMO_TIMES.length)];
      setCurrent({ ...person, time });
      setVisible(true);
      // Hide after 4 seconds
      timeout = setTimeout(() => {
        setVisible(false);
        // Schedule next after 4–8 seconds
        timeout = setTimeout(show, 4000 + Math.random() * 4000);
      }, 4000);
    };
    // First one after 6 seconds
    timeout = setTimeout(show, 6000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-50 pointer-events-none">
      <AnimatePresence>
        {visible && current && (
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/[0.1] backdrop-blur-2xl border border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.3)] pointer-events-auto max-w-[320px]"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold truncate">
                {current.role} {current.name} <span className="text-emerald-400">vừa bình chọn</span> ✅
              </p>
              <p className="text-white/40 text-xs">{current.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   MAIN APP
   ================================================================ */
export default function App() {
  const countdown = useCountdown(DEADLINE);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <div className="min-h-screen bg-[#0a0118] relative overflow-x-hidden">
      {/* Gradient blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-purple-900/40 blur-[120px]" />
        <div className="absolute top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full bg-pink-900/30 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[700px] h-[700px] rounded-full bg-indigo-900/30 blur-[120px]" />
      </div>

      <Starfield />
      <FomoNotifications />

      {/* ───── STICKY HEADER ───── */}
      <motion.header
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-black/40 backdrop-blur-2xl border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white/90 font-bold text-sm leading-tight">THCS Nguyễn Văn Bảnh</p>
              <p className="text-white/40 text-[10px]">Bình chọn Hùng biện cấp tỉnh</p>
            </div>
          </div>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all active:scale-95"
          >
            <Vote size={16} />
            Bình chọn
          </a>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════
         HERO
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20">
        {/* School badge */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/10 text-white/80 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <GraduationCap size={16} className="text-amber-400" />
            Trường THCS Nguyễn Văn Bảnh • Hội thi Hùng biện THCS cấp tỉnh 2025–2026
          </div>
        </motion.div>

        {/* Urgent marquee banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 w-full max-w-3xl"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-500/20 border border-red-400/20 py-3 px-4">
            <div className="flex items-center justify-center gap-2 text-amber-200 font-bold text-sm sm:text-base animate-pulse">
              <Megaphone size={20} className="text-amber-400 shrink-0" />
              🔥 KHẨN CẤP: Tập thể THCS Nguyễn Văn Bảnh – Hãy bình chọn NGAY cho Đội Hùng Biện xã Nhuận Phú Tân! 🔥
            </div>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl"
        >
          <h1 className="text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tight">
            <span className="text-white">Tiếp Sức </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400">Đội Hùng Biện</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-400">Xã Nhuận Phú Tân!</span>
          </h1>
        </motion.div>

        {/* Sub text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-7 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed"
        >
          🏫 Quý <strong className="text-white font-bold">Thầy Cô</strong> và toàn thể các em{' '}
          <strong className="text-white font-bold">Học Sinh</strong> trường THCS Nguyễn Văn Bảnh ơi!{' '}
          Hãy cùng chung tay bình chọn, tiếp lửa cho{' '}
          <strong className="text-amber-300 font-bold">Đội Hùng Biện Tiếng Anh xã Nhuận Phú Tân</strong>{' '}
          tại Hội thi cấp tỉnh! Mỗi lá phiếu là một lời động viên — <em className="text-pink-300">đừng để các em chiến đấu một mình!</em> 🙏
        </motion.p>

        {/* Number badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex items-center gap-4 sm:gap-6"
        >
          <span className="text-white/30 text-sm font-semibold">Hãy chọn số</span>
          <NumberBadge n={1} color="from-rose-500 to-pink-600" delay={1.3} />
          <NumberBadge n={2} color="from-amber-500 to-orange-600" delay={1.45} />
          <NumberBadge n={3} color="from-emerald-500 to-teal-600" delay={1.6} />
        </motion.div>

        {/* Vote hint arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 flex flex-col items-center gap-1"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-pink-300 font-bold text-sm sm:text-base"
          >
            👇 Nhấp vào nút bên dưới để bình chọn!
          </motion.p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={24} className="text-pink-400" />
          </motion.div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="mt-4 flex flex-col sm:flex-row gap-4"
        >
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-vote-hero"
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white font-extrabold text-lg shadow-[0_8px_40px_rgba(244,63,94,0.35)] hover:shadow-[0_12px_50px_rgba(244,63,94,0.5)] transition-all duration-400 hover:scale-[1.04] active:scale-[0.97] animate-pulse hover:animate-none"
          >
            <Vote size={22} />
            ✊ BÌNH CHỌN NGAY – ỦNG HỘ CÁC EM!
            <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </a>

          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            id="cta-video-hero"
            className="group inline-flex items-center gap-3 px-8 py-5 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 text-white font-bold text-lg hover:bg-white/[0.12] transition-all duration-300 hover:scale-[1.04] active:scale-[0.97]"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <Youtube size={22} className="text-red-400" />
            </div>
            Xem Video
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 text-white/20"
        >
          <ChevronDown size={28} />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
         COUNTDOWN
         ═══════════════════════════════════════════════════════════ */}
      <Section id="countdown">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-8">
              <Clock size={16} className="animate-pulse" />
              Thời gian còn lại để bình chọn
            </div>
          </motion.div>

          {countdown.expired ? (
            <motion.div variants={fadeUp} custom={1} className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20">
              <p className="text-2xl sm:text-3xl font-bold text-red-400">⏰ Đã hết thời gian bình chọn!</p>
            </motion.div>
          ) : (
            <motion.div variants={fadeUp} custom={1}>
              <div className="inline-flex items-center gap-3 sm:gap-5 p-6 sm:p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]">
                <Digit value={countdown.days} label="Ngày" color="text-amber-300" />
                <span className="text-2xl sm:text-3xl text-white/15 font-thin self-center -mt-6">:</span>
                <Digit value={countdown.hours} label="Giờ" color="text-cyan-300" />
                <span className="text-2xl sm:text-3xl text-white/15 font-thin self-center -mt-6">:</span>
                <Digit value={countdown.minutes} label="Phút" color="text-pink-300" />
                <span className="text-2xl sm:text-3xl text-white/15 font-thin self-center -mt-6">:</span>
                <Digit value={countdown.seconds} label="Giây" color="text-purple-300" />
              </div>
            </motion.div>
          )}

          <motion.p variants={fadeUp} custom={2} className="mt-6 text-white/30 text-sm">
            Hạn chót: <strong className="text-white/60">14/03/2026 – 23:59</strong>
          </motion.p>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
         HOW TO VOTE  —  3 steps
         ═══════════════════════════════════════════════════════════ */}
      <Section id="huong-dan">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-[0.25em] mb-3">Chỉ 3 bước đơn giản</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">Hướng Dẫn Bình Chọn</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                icon: <Youtube size={28} />,
                iconBg: 'from-red-500 to-red-600',
                title: 'Xem Video Hùng Biện',
                desc: 'Xem video của các em học sinh trên YouTube để cảm nhận tài năng và nỗ lực hùng biện tiếng Anh.',
                bg: 'from-red-500/8 to-orange-500/8',
                border: 'border-red-500/15',
                link: VIDEO_URL,
                linkText: 'Xem video →',
              },
              {
                step: '02',
                icon: <Mail size={28} />,
                iconBg: 'from-blue-500 to-indigo-600',
                title: 'Đăng Nhập Gmail',
                desc: 'Mở link Google Form bên dưới và đăng nhập bằng tài khoản Gmail của bạn. Mỗi Gmail chỉ bình chọn được 1 lần.',
                bg: 'from-blue-500/8 to-indigo-500/8',
                border: 'border-blue-500/15',
              },
              {
                step: '03',
                icon: <CheckCircle size={28} />,
                iconBg: 'from-emerald-500 to-teal-600',
                title: 'Chọn Số 1, 2, 3',
                desc: 'Nhấn chọn số 1, 2, 3 để bình chọn ủng hộ các em. Sau đó nhấn "Gửi" để hoàn tất!',
                bg: 'from-emerald-500/8 to-teal-500/8',
                border: 'border-emerald-500/15',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`
                  relative p-7 sm:p-8 rounded-3xl
                  bg-gradient-to-br ${item.bg} backdrop-blur-2xl
                  border ${item.border}
                  shadow-[0_4px_30px_rgba(0,0,0,0.2)]
                  group
                `}
              >
                {/* Step number watermark */}
                <span className="absolute top-3 right-4 text-[5rem] font-black text-white/[0.03] leading-none select-none">{item.step}</span>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{item.desc}</p>

                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
                    {item.linkText} <ExternalLink size={14} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
         VIDEO EMBED
         ═══════════════════════════════════════════════════════════ */}
      <Section id="video">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} custom={0} className="mb-10">
            <span className="inline-block text-xs font-bold text-red-400 uppercase tracking-[0.25em] mb-3">Xem để hiểu, hiểu để ủng hộ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">🎬 Video Hùng Biện</h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">Hãy dành vài phút xem video để cảm nhận tài năng và sự cố gắng của các em học sinh!</p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={1}
            className="relative rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)] border border-white/[0.08] group"
          >
            {/* Decorative top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 z-10" />

            <div className="aspect-video bg-black/40">
              <iframe
                src={VIDEO_EMBED}
                title="Video hùng biện tiếng Anh THCS cấp tỉnh"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
         IMPORTANT NOTES
         ═══════════════════════════════════════════════════════════ */}
      <Section id="luu-y">
        <div className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} custom={0} className="text-center mb-12">
            <span className="inline-block text-xs font-bold text-amber-400 uppercase tracking-[0.25em] mb-3">Vui lòng đọc kỹ</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">⚠️ Lưu Ý Quan Trọng</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                icon: <Shield size={22} />,
                iconColor: 'text-blue-400 bg-blue-500/15',
                title: 'Bắt buộc tài khoản Gmail',
                desc: 'Bạn PHẢI đăng nhập bằng tài khoản Gmail (Google) để có thể bình chọn trên Google Form.',
              },
              {
                icon: <AlertTriangle size={22} />,
                iconColor: 'text-amber-400 bg-amber-500/15',
                title: 'Chỉ được bình chọn 1 lần',
                desc: 'Mỗi tài khoản Gmail CHỈ ĐƯỢC bình chọn DUY NHẤT 1 LẦN. Hãy cân nhắc kỹ trước khi gửi!',
              },
              {
                icon: <Trophy size={22} />,
                iconColor: 'text-emerald-400 bg-emerald-500/15',
                title: 'Nhớ chọn số 1, 2, 3',
                desc: 'Xin hãy chọn đúng số 1, 2, 3 trong biểu mẫu để ủng hộ cho các em học sinh xã Nhuận Phú Tân.',
              },
              {
                icon: <Heart size={22} />,
                iconColor: 'text-pink-400 bg-pink-500/15',
                title: 'Lá phiếu ý nghĩa',
                desc: 'Mỗi lá phiếu của bạn là nguồn động viên to lớn, giúp các em tự tin hơn trên hành trình học tập!',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 1}
                className="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] hover:bg-white/[0.06] transition-all duration-300 group"
              >
                <div className={`w-11 h-11 rounded-xl ${item.iconColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
         FINAL CTA
         ═══════════════════════════════════════════════════════════ */}
      <Section id="binh-chon" className="pb-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated trophy */}
          <motion.div variants={fadeUp} custom={0}>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-amber-500/40">
                <Trophy size={48} className="text-white" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-2">
              🔥 Toàn Trường Ơi — Hành Động Ngay!
            </h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-400">Đội Hùng Biện xã Nhuận Phú Tân cần BẠN!</span>
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 mb-10">
              <p className="text-white/60 text-lg">
                Các em đã cố gắng rất nhiều để đến được vòng thi cấp tỉnh.
                <br />
                <strong className="text-white text-xl">Đừng để các em chiến đấu một mình!</strong>
              </p>
              <p className="text-white/50 text-base">
                Chỉ cần <strong className="text-amber-300 font-bold text-lg">1 cú nhấp chuột</strong>,
                bạn đã tiếp thêm sức mạnh cho các em.
                Hãy nhấn chọn <strong className="text-pink-300 font-bold text-lg">số 1, 2, 3</strong> để cả trường cùng đồng lòng ủng hộ!
              </p>
              <p className="text-amber-400/80 font-bold text-sm uppercase tracking-wider animate-pulse">
                ⏰ Thời gian không chờ đợi — Bình chọn NGAY kẻo muộn!
              </p>
            </div>
          </motion.div>

          {/* Number badges row */}
          <motion.div variants={fadeUp} custom={2} className="flex justify-center gap-4 sm:gap-6 mb-10">
            <NumberBadge n={1} color="from-rose-500 to-pink-600" delay={0} />
            <NumberBadge n={2} color="from-amber-500 to-orange-600" delay={0.1} />
            <NumberBadge n={3} color="from-emerald-500 to-teal-600" delay={0.2} />
          </motion.div>

          {/* Main CTA — BIG AND BOLD */}
          <motion.div variants={fadeUp} custom={3}>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-vote-final"
              className="
                group relative inline-flex items-center justify-center gap-3
                px-14 py-7 rounded-2xl
                bg-gradient-to-r from-pink-500 via-rose-500 to-red-500
                text-white font-extrabold text-xl sm:text-2xl
                shadow-[0_10px_50px_rgba(244,63,94,0.45)]
                hover:shadow-[0_14px_60px_rgba(244,63,94,0.6)]
                transition-all duration-400 hover:scale-[1.06] active:scale-[0.97]
                animate-pulse hover:animate-none
              "
            >
              <Vote size={28} />
              ✊ BÌNH CHỌN SỐ 1, 2, 3 – ỦNG HỘ NHUẬN PHÚ TÂN!
              <ExternalLink size={18} className="opacity-50" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
            </a>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={fadeUp} custom={4} className="mt-6">
            <a
              href={VIDEO_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-video-final"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <Youtube size={16} className="text-red-400" />
              Xem video trước khi bình chọn
            </a>
          </motion.div>

          {/* Community rallying message */}
          <motion.div variants={fadeUp} custom={5} className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-amber-500/10 border border-amber-400/15 max-w-xl mx-auto">
            <p className="text-white/70 text-sm leading-relaxed">
              <Users size={16} className="inline text-amber-400 mr-1" />
              <strong className="text-amber-300">Lan tỏa yêu thương:</strong> Sau khi bình chọn, hãy chia sẻ trang này cho đồng nghiệp, bạn bè và người thân cùng bình chọn nhé! Cả trường chúng ta sẽ là hậu phương vững chắc cho các em! 💪
            </p>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════
         FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 py-8 border-t border-white/[0.05] text-center px-4">
        <div className="max-w-3xl mx-auto space-y-2">
          <p className="flex items-center justify-center gap-2 text-white/25 text-sm">
            <GraduationCap size={16} />
            Trường THCS Nguyễn Văn Bảnh – Hội thi Hùng biện tiếng Anh THCS cấp tỉnh 2025–2026
          </p>
          <p className="text-white/20 text-xs">
            Thiết kế bởi <strong className="text-white/35">Võ Ngọc Tùng</strong> • Mỗi lá phiếu, một tấm lòng 💖
          </p>
        </div>
      </footer>
    </div>
  );
}
