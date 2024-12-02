export const CATEGORY_COLORS: Record<
  string,
  { header: string; label: string }
> = {
  'Infrastructure & Cloud': {
    header: 'text-blue-500',
    label: 'text-purple-400',
  },
  'MLOps & Model Deployment': {
    header: 'text-green-500',
    label: 'text-cyan-400',
  },
  'Data Engineering & Pipeline': {
    header: 'text-yellow-500',
    label: 'text-orange-400',
  },
  'Machine Learning & AI': {
    header: 'text-red-500',
    label: 'text-pink-400',
  },
  'Programming & Tools': {
    header: 'text-purple-500',
    label: 'text-indigo-400',
  },
} as const;
