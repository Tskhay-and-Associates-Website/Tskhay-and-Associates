// All of the website's words and links live in this file.
// To change text on the site, edit it here and commit (see README.md).
// Every statement comes from Konstantin's approved copy, the 2026 consulting
// offering deck, his CV, or his review comments.

const BASE = import.meta.env.BASE_URL;

export const site = {
  name: 'Tskhay & Associates',
  legalName: 'Tskhay & Associates, Inc.',
  email: 'konstantin@tskhayandassociates.com',
};

// Links. "home(...)" points at a section of the homepage.
export const home = (hash = '') => `${BASE}${hash}`;

// COURSE AND NEWSLETTER LINKS
// courseUrl is Konstantin's People Analytics course page.
// Paste the Kit newsletter signup page between the quotes in newsletterUrl.
// While newsletterUrl is empty, the Newsletter link stays hidden.
export const courseUrl = 'https://learn.practicalpeopleanalytics.com/';
export const newsletterUrl = 'https://peopleanalytics.substack.com/';

export const nav = [
  { label: 'Services', href: home('#services') },
  { label: 'About Tskhay & Associates', href: home('#about') },
  { label: 'Client Work', href: home('#client-work') },
  { label: 'Our Approach', href: home('#approach') },
  { label: 'eLTV Tool', href: `${BASE}eltv/` },
  // External links open in a new tab.
  { label: 'Learn People Analytics', href: courseUrl, external: true },
  ...(newsletterUrl ? [{ label: 'Newsletter', href: newsletterUrl, external: true }] : []),
];

// Every "Contact Us" button scrolls to the contact form in the Let's Talk section.
export const contactButton = { label: 'Contact Us', href: home('#contact') };

export const hero = {
  title: 'Make your people strategy work.',
  body:
    'We use rigorous analytics to connect your workforce to your day-to-day operations, giving you clear and practical programs that drive profitability and performance.',
  photo: {
    src: `${BASE}hero-data.svg`,
    alt: '',
    width: 800,
    height: 1000,
  },
};

export const stakes = {
  title: 'The true cost of an ambiguous strategy is speed.',
  items: [
    {
      title: 'Slow execution',
      body: 'Without hard data on your people, every decision turns into a debate. Programs stall because leaders argue over assumptions instead of making decisions and acting on facts.',
    },
    {
      title: 'Solving yesterday’s problems',
      body: 'By the time a new people program is ready to launch, the business and the market have moved on. Stop solving yesterday’s problems.',
    },
    {
      title: 'Delayed insights',
      body: 'If it takes months to pull data, your program insights might be already outdated. So, you end up reacting, not actively managing your workforce.',
    },
  ],
};

export const value = {
  title: 'Strategy needs execution.',
  intro: 'Here is how we help you move faster:',
  items: [
    {
      icon: 'decide',
      title: 'Decide on data, not assumptions',
      body: 'We cut through boardroom debates by bringing rigorous, clear workforce analytics to the table. You get the clarity required to move from endless discussion to immediate action.',
    },
    {
      icon: 'momentum',
      title: 'Build real momentum',
      body: 'We don’t just hand you a high-level strategy with a generic playbook; we help you operationalize it. We design practical workforce programs you can deploy rapidly to accelerate growth ahead of competitors.',
    },
    {
      icon: 'predict',
      title: 'Predict, don’t react',
      body: 'Stop firefighting. We equip you with the systems and insights you need to see what is happening with your workforce right now, allowing you to proactively drive profitability.',
    },
  ],
};

export const services = {
  title: 'Services focused on outcomes',
  intro: 'Here is where we can help you turn your strategy into reality.',
  items: [
    {
      id: 'performance',
      icon: 'structure',
      title: 'Org. design for performance',
      summary: 'Organize your teams and deploy your talent for real outcomes, profitability, and performance.',
      includes: ['Organizational design', 'Layers and spans analysis', 'Talent mapping', 'Structure redesign', 'Talent strategy'],
    },
    {
      id: 'people-analytics',
      icon: 'analytics',
      title: 'Enable people analytics',
      summary: 'Give HR and business leaders the data and AI skills to act on your strategy.',
      includes: ['People analytics strategy', 'Data governance', 'HR dashboards', 'Advanced analytics', 'Retention analytics', 'Data literacy education'],
    },
    {
      id: 'culture-engagement',
      icon: 'people',
      title: 'Architect your culture & engagement',
      summary: 'Connect culture, wellness, and engagement to your business results.',
      includes: ['Engagement strategy', 'Engagement surveys', 'Focus groups', 'Lifecycle feedback', 'Pulse surveys'],
    },
    {
      id: 'compensation',
      icon: 'balance',
      title: 'Design your compensation and recognition',
      summary: 'Pay people in a way that rewards the performance your strategy needs.',
      includes: ['Job standardization', 'Compensation analysis', 'Pay equity', 'Pay philosophy', 'Total rewards', 'Sales compensation'],
    },
  ],
};

export const about = {
  title: 'Workforce strategy and programs should never sit on a shelf.',
  paragraphs: [
    'I started Tskhay & Associates because I was tired of seeing brilliant HR leaders and business executives get stuck with ambiguous, theoretical strategies that fail in the real world. It is incredibly frustrating to spend immense time and money building these plans, only to watch them collect dust. You deserve practical, actionable solutions that actually make a difference for your workforce and your bottom line.',
    'As a former management consultant at Deloitte and VP of Organizational Effectiveness at Top Hat, I know what it takes to build programs that earn boardroom buy-in and work day to day. Some of the programs I built improved retention from 56% to 87% in 18 months and moved eNPS from −17% to +20%. I hold a Ph.D. in Quantitative Psychology from the University of Toronto and have spent over a decade advising organizations—from fast-growing start-ups to Fortune 500 companies—on how to use data to drive retention, engagement, and performance.',
    'You don’t need another dashboard that no one looks at. You need a partner who brings the substance, specificity, and analytical rigor required to put your strategy into action.',
  ],
  signature: 'Konstantin Tskhay, Ph.D.',
  signatureRole: 'Managing Partner and Founder',
  signatureCompany: 'Tskhay & Associates, Inc.',
  photo: {
    src: `${BASE}konstantin-tskhay.webp`,
    alt: 'Portrait of Konstantin Tskhay',
    width: 800,
    height: 1000,
  },
  credentialsTitle: 'Background',
  credentials: [
    'Managing Partner, Tskhay & Associates, Inc.',
    'Principal Consultant, ProKo',
    'VP of Organizational Effectiveness, Top Hat',
    'Management Consultant, Deloitte',
    'Ph.D. in Psychology, University of Toronto',
    'Founder of the Toronto People Analytics Group',
    'More than 25 peer-reviewed research publications',
  ],
};

export const clientWork = {
  title: 'Client work',
  intro:
    'Konstantin has advised organizations from fast-growing start-ups to Fortune 500 companies across financial services, consumer goods, manufacturing, energy and resources, public services, SaaS, education, and healthcare.',
  stats: [
    { value: '35', label: 'Consulting projects delivered' },
    { value: '15+', label: 'Years of experience in strategic people analytics' },
    { value: '100+', label: 'Thought leadership articles published' },
    { value: '5', label: 'HR awards won' },
  ],
  examplesTitle: 'Selected projects',
  examplesNote: '',
  examples: [
    {
      context: 'Top Hat, education technology',
      title: 'Building the foundations of the HR function',
      body: 'Built Top Hat’s HR function from the ground up as VP of Organizational Effectiveness, including talent strategy, organizational design, total rewards, and HR technology. Retention rose from 56% to 87% in 18 months.',
    },
    {
      context: 'Professional services firm',
      title: 'People analytics strategy and dashboard',
      body: 'Designed the firm’s people analytics strategy, then built a people analytics dashboard to put that strategy into practice, working alongside the client’s own team as a player-coach across both engagements.',
    },
    {
      context: 'Fortune 500 company',
      title: 'Leadership assessment and bench strength',
      body: 'Led cross-national and cross-functional teams to deliver leadership assessment and development, then analyzed the results so the company’s functional board could understand the strength of its leadership bench.',
    },
    {
      context: 'Consumer and automotive companies',
      title: 'Workforce and location strategy',
      body: 'Developed HR and operational strategy for consumer and automotive clients, including talent, location, and workplace strategies that optimized the number of plants and sales locations across Canada.',
    },
  ],
};

export const approach = {
  title: 'Here is how we bring your strategy to reality',
  steps: [
    {
      title: 'Discovery call',
      body: 'We begin by cutting through the noise to pinpoint the exact workforce problem you are trying to solve and why. From there, we assess exactly where and how we can help you address it by scoping the right solution.',
    },
    {
      title: 'Deep-dive current state analysis',
      body: 'We analyze your organization’s quantitative and qualitative data to establish an objective baseline. This deep dive gives us an intimate, fact-based understanding of exactly where your organization is starting from.',
    },
    {
      title: 'Design tailored, practical solutions',
      body: 'We partner directly with your leadership and operational teams to architect highly specific strategies for your unique scenarios. We replace complexity with clarity by providing simple tools, systems, and processes that make sense in your context.',
    },
    {
      title: 'Sustainable deployment',
      body: 'We guide the real-world rollout—including change management, system adoption, and communication. We ensure your programs don’t just sit on a shelf but exist sustainably to drive momentum and profitability.',
    },
  ],
};

export const contact = {
  title: 'Let’s talk',
  body: 'Tell us about the workforce or people analytics challenge you’re working on, and we’ll reply to set up a time to talk.',
  photo: {
    src: `${BASE}konstantin-presenting.webp`,
    alt: 'Konstantin Tskhay presenting at a leadership event',
    width: 1200,
    height: 900,
  },
};

// CONTACT FORM SERVICE
// GitHub Pages can't send email by itself, so the form uses a form service.
// Fill in BOTH lines below for one of these options:
//
// Option A: FormSubmit (free). Sends each message to Konstantin AND an automatic copy to the
//   visitor. Visitors tick a quick "I'm not a robot" check after pressing Send.
//     export const formService = 'formsubmit';
//     export const formEndpoint = 'https://formsubmit.co/konstantin@tskhayandassociates.com';
//   The first message triggers a confirmation email to Konstantin; he clicks the link once.
//
// Option B: Formspree. Sends each message straight to Konstantin with no extra step.
//   A copy to the visitor needs a paid Formspree plan.
//     export const formService = 'formspree';
//     export const formEndpoint = 'https://formspree.io/f/abcdwxyz';
//
// While these are empty, sending the form opens the visitor's email app with the message filled in.
export const formService = 'formspree';
export const formEndpoint = 'https://formspree.io/f/xzeegnyk';

// The copy sent to the visitor (Option A only).
export const visitorCopy =
  'Thank you for contacting Tskhay & Associates. We have received your message and will reply soon to set up a time to talk.';

// The contact form inside the Let's Talk section of the homepage.
export const contactForm = {
  fields: {
    name: 'Name',
    email: 'Email',
    company: 'Company (optional)',
    message: 'How can we help?',
  },
  submit: 'Send message',
  sending: 'Sending…',
  error: 'Sorry, your message didn’t send. Please try again in a moment.',
  success: 'Thank you. Your message has been sent, and we’ll reply soon.',
  mailNote: 'Sending opens your email app with your message ready to go.',
  handoff: 'Your email app should now open with your message ready. Just press send.',
  privacy: 'We only use your details to reply to your message.',
};
