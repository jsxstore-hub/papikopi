const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');

menuButton.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? '×' : '☰';
});

document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = '☰';
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

document.getElementById('year').textContent = new Date().getFullYear();

const cupsInput = document.getElementById('cups');
const daysInput = document.getElementById('days');
const cupsLabel = document.getElementById('cups-label');
const daysLabel = document.getElementById('days-label');
const revenueOutput = document.getElementById('revenue-output');
const partnerOutput = document.getElementById('partner-output');
const monthlyCupsOutput = document.getElementById('monthly-cups-output');

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
});
const number = new Intl.NumberFormat('id-ID');

const scenarios = [
  { cups: 20, revenue: 6_500_000, partner: 750_000 },
  { cups: 40, revenue: 13_000_000, partner: 1_700_000 },
  { cups: 60, revenue: 19_000_000, partner: 2_700_000 }
];

function interpolate(value, key) {
  let left = scenarios[0];
  let right = scenarios[scenarios.length - 1];

  for (let i = 0; i < scenarios.length - 1; i++) {
    if (value >= scenarios[i].cups && value <= scenarios[i + 1].cups) {
      left = scenarios[i];
      right = scenarios[i + 1];
      break;
    }
  }

  if (value > 60) {
    left = scenarios[1];
    right = scenarios[2];
  }

  const ratio = (value - left.cups) / (right.cups - left.cups);
  return left[key] + ratio * (right[key] - left[key]);
}

function updateCalculator() {
  const cups = Number(cupsInput.value);
  const days = Number(daysInput.value);
  const dayFactor = days / 30;
  const revenue = interpolate(cups, 'revenue') * dayFactor;
  const partner = interpolate(cups, 'partner') * dayFactor;
  const monthlyCups = cups * days;

  cupsLabel.textContent = `${cups} cup`;
  daysLabel.textContent = `${days} hari`;
  revenueOutput.textContent = rupiah.format(Math.round(revenue));
  partnerOutput.textContent = rupiah.format(Math.round(partner));
  monthlyCupsOutput.textContent = `${number.format(monthlyCups)} cup`;
}

cupsInput.addEventListener('input', updateCalculator);
daysInput.addEventListener('input', updateCalculator);
updateCalculator();
