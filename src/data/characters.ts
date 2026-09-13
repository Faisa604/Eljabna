export type CharacterProfile = {
  slug: string
  name: string
  kicker: string
  bio: string
  image: string
  issueIds: string[]
}

export const CHARACTERS: CharacterProfile[] = [
  {
    slug: 'karti',
    name: 'كرتي',
    kicker: 'صاحب الافتتاحية الأولى',
    bio: 'يرمي العبارة الثقيلة بخفة، ويحوّل قلق اليوم إلى نكتة تعيش أكثر من الخبر.',
    image: '/characters/karti.webp',
    issueIds: ['issue-01-karti'],
  },
  {
    slug: 'okasha',
    name: 'عكاشة',
    kicker: 'مراقب إيقاع الحياة',
    bio: 'هادئ ومتأمل؛ يلتقط ما تغيّر في الناس والتواصل بعد أن صارت الأيام أسرع.',
    image: '/characters/okasha.webp',
    issueIds: ['issue-02-okasha'],
  },
  {
    slug: 'yasser-adawi',
    name: 'ياسر (عدوي) مع أمبي',
    kicker: 'يوميات بلا فلتر',
    bio: 'من رابعة إلى بريطانيا في نفس النفس؛ ضحكة الدفعة التي لا تحتاج إلى ترتيب.',
    image: '/characters/yasser-ambi.webp',
    issueIds: ['issue-03-yasser'],
  },
  {
    slug: 'hito',
    name: 'هيتو',
    kicker: 'الرومانسي الكروي',
    bio: 'يفسر الحب بالأغاني، والكورة بالسيناريوهات، ثم يرفع عينه للقمر وبحري.',
    image: '/characters/hito.webp',
    issueIds: ['issue-04-hito'],
  },
  {
    slug: 'osama-amer',
    name: 'دكتور أسامة عامر',
    kicker: 'محقق القعدة',
    bio: 'يفكك الأساطير بالمجهر الساخر، ويجمع شهادات الدفعة قبل إصدار الحكم.',
    image: '/characters/osama.webp',
    issueIds: ['issue-05-osama'],
  },
  {
    slug: 'garden-girl',
    name: 'البت الحديقة',
    kicker: 'الأسطورة تتحدث',
    bio: 'صاحبة العددين السادس والسابع؛ شعر وثقة وحضور لا يحتاج إلى شهادة.',
    image: '/characters/garden-girl.webp',
    issueIds: ['issue-06-garden-girl', 'issue-07-garden-girl-response'],
  },
]
