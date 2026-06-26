export const fallbackSkills = [
  { name: 'SQL (PostgreSQL / BigQuery)', proficiency: 92, category: 'SQL', radarValue: 9, bubbleSize: 85 },
  { name: 'Python (Pandas / NumPy)', proficiency: 88, category: 'Python', radarValue: 9, bubbleSize: 80 },
  { name: 'Data Visualization', proficiency: 90, category: 'Data Visualization', radarValue: 10, bubbleSize: 90 },
  { name: 'Power BI Interactive Maps', proficiency: 85, category: 'Power BI', radarValue: 8, bubbleSize: 75 },
  { name: 'Tableau Dashboards', proficiency: 87, category: 'Tableau', radarValue: 8, bubbleSize: 78 },
  { name: 'Machine Learning (Scikit-Learn)', proficiency: 75, category: 'Machine Learning', radarValue: 7, bubbleSize: 65 },
  { name: 'ETL Pipelines (Airflow / DBT)', proficiency: 82, category: 'ETL', radarValue: 8, bubbleSize: 70 },
  { name: 'Advanced Excel & VBA', proficiency: 80, category: 'Excel', radarValue: 7, bubbleSize: 60 },
  { name: 'R Statistical Analysis', proficiency: 70, category: 'R', radarValue: 6, bubbleSize: 50 },
  { name: 'Data Cleaning & Wrangling', proficiency: 95, category: 'Data Cleaning', radarValue: 10, bubbleSize: 95 },
  { name: 'Statistical Testing (A/B testing)', proficiency: 85, category: 'Statistics', radarValue: 8, bubbleSize: 75 },
  { name: 'Business Intelligence Reporting', proficiency: 88, category: 'Business Intelligence', radarValue: 9, bubbleSize: 82 }
];

export const fallbackProjects = [
  {
    _id: '1',
    title: 'E-Commerce Interactive Revenue Analytics',
    description: 'Designed a comprehensive analytics platform and dashboard to track monthly sales, regional performance, and client segment patterns.',
    problemStatement: 'The sales team lacked real-time visibility into region-specific revenue shifts, leading to inefficient marketing allocations.',
    methodology: 'Processed 5M records in BigQuery SQL, performed cohorts analysis in Pandas, and created interactive dashboards with trend modeling.',
    dataset: 'Sales Transactions Dataset (2024-2026, 5.2 million records)',
    technologies: ['SQL', 'Python', 'Power BI', 'Zustand', 'Recharts'],
    results: 'Pinpointed three underperforming regional channels, enabling optimization campaigns that boosted conversions by 14%.',
    businessImpact: 'Discovered a $1.2M annual leakage pattern in transaction processing fees, enabling contract re-negotiation.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600'
    ],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Power BI',
    tags: ['E-Commerce', 'Financial Modeling', 'SQL Optimization'],
    featured: true,
  },
  {
    _id: '2',
    title: 'Customer Churn Predictor & Segmentation Model',
    description: 'Built an end-to-end Machine Learning pipeline to identify at-risk client subscriptions and group customers based on activity profiles.',
    problemStatement: 'SaaS churn rates rose to 8.4% without clear indicators, causing loss in subscriber lifetime value.',
    methodology: 'Cleaned raw system logs using Python, extracted behavioral features, trained XGBoost and Random Forest classifiers, and output predictions via API.',
    dataset: 'Customer Activity Logs & Subscription Metadata (50,000 active profiles)',
    technologies: ['Python', 'Machine Learning', 'SQL', 'Scikit-Learn'],
    results: 'Achieved 89% precision (F1-score of 0.86) in predicting churn events 30 days before occurrence.',
    businessImpact: 'Aided customer success teams in deploying proactive discount triggers, decreasing churn from 8.4% to 4.2% within one quarter.',
    coverImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600',
    gallery: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600'
    ],
    liveUrl: '#',
    githubUrl: '#',
    category: 'Machine Learning',
    tags: ['Python', 'XGBoost', 'Customer Retention'],
    featured: true,
  }
];

export const fallbackExperiences = [
  {
    title: 'Senior Data Analyst',
    company: 'Stripe Analytics Division',
    location: 'San Francisco, CA',
    description: 'Orchestrating transaction fee data intelligence and cohort analytics models.',
    startDate: '2024-03',
    endDate: 'Present',
    type: 'work',
    highlights: [
      'Designed scalable BigQuery pipelines processing over $10B in volume.',
      'Built internal anomaly detection tool for settlement fee reconciliations.',
      'Optimized dashboard rendering speeds by 40% using pre-computed aggregations.'
    ]
  },
  {
    title: 'Data Analyst II',
    company: 'Vercel Performance Team',
    location: 'Remote',
    description: 'Developed developer funnel conversion tracking and performance benchmarks.',
    startDate: '2022-05',
    endDate: '2024-02',
    type: 'work',
    highlights: [
      'Analysed sign-up metrics to refine boarding experiences, boosting conversions by 8%.',
      'Monitored Edge Network request logs to identify serverless startup latency patterns.',
      'Constructed high-frequency analytics reports for product leadership to guide roadmap allocations.'
    ]
  }
];

export const fallbackTestimonials = [
  {
    _id: '1',
    name: 'Sarah Jenkins',
    role: 'Director of Growth',
    company: 'SaaSify Inc.',
    text: 'Mariam transformed our raw sales data into actionable decisions. His Interactive dashboards and churn predictive models directly saved us thousands in customer acquisition costs.',
    rating: 5,
    avatar: '',
  },
  {
    _id: '2',
    name: 'Marcus Chen',
    role: 'VP of Product',
    company: 'DataFlow Systems',
    text: 'An exceptional data professional. Mariam does not just write queries or build charts; he truly understands the business objectives and translates numbers into growth strategies.',
    rating: 5,
    avatar: '',
  }
];

export const fallbackBlogs = [
  {
    _id: '1',
    title: 'Optimizing SQL Queries: Cohort Analysis Over 10M Rows',
    slug: 'optimizing-sql-queries-cohort-analysis-over-10m-rows',
    summary: 'Discover how clustering, window functions, and partitioning reduced cloud query latency by 72% and saved thousands in monthly cloud costs.',
    category: 'SQL Performance',
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600',
    content: `
<p>In high-volume transaction systems, query optimization is the difference between scalable systems and massive cloud bills. In this article, we outline a cohort analytics query optimization case study involving 10 million transaction rows.</p>
<h3>The Problem Statement</h3>
<p>Our daily user retention and cohort models took over 4 minutes to run on standard datasets, leading to dashboard timeouts and high costs in BigQuery and PostgreSQL.</p>
<h3>Optimization Strategies</h3>
<ol>
  <li><strong>Table Partitioning:</strong> Partitioned the events table by date, ensuring queries scan daily increments rather than full historical data.</li>
  <li><strong>Clustering Keys:</strong> Clustered by user ID and event name, bringing user activities close together physically in memory.</li>
  <li><strong>Window Functions over Joins:</strong> Replaced nested self-joins with window functions (<code>LEAD</code>/<code>LAG</code>) to compute time-since-last-activity.</li>
</ol>
<h3>Outcome</h3>
<p>Query execution latency fell from 4.2 minutes to 11.4 seconds, with a 72% reduction in cloud costs.</p>
    `,
    views: 1240,
    likes: 182,
    publishedAt: '2026-05-12T10:00:00.000Z',
    comments: [
      {
        _id: 'c1',
        name: 'Sarah Jenkins',
        text: 'This is brilliant! Replacing our self-joins with window functions saved us so much query time. Thanks for writing this!',
        createdAt: '2026-05-13T10:24:00.000Z',
      }
    ],
    tags: ['SQL', 'BigQuery', 'Optimization', 'Data Engineering'],
    status: 'published'
  },
  {
    _id: '2',
    title: 'Understanding Customer Churn with XGBoost Predictions',
    slug: 'understanding-customer-churn-with-xgboost-predictions',
    summary: 'A step-by-step methodology explaining predictive feature selection, hyperparameter tuning, and embedding models directly into CRM triggers.',
    category: 'Machine Learning',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600',
    content: `
<p>Retaining users is the primary driver of SaaS growth. To address subscriber attrition, we built an end-to-end churn prediction framework using XGBoost.</p>
<h3>Feature Engineering</h3>
<p>We extracted activity frequency, duration since last login, billing tier changes, and customer support ticket logs. These behavior vectors served as model features.</p>
<h3>Model Optimization</h3>
<p>Using hyperparameter grid searches, the final XGBoost model achieved 89% accuracy in predicting churn events 30 days before they happened.</p>
<h3>Business Deployment</h3>
<p>We tied predictions to automatic discount triggers, helping decrease total churn by 50% in the first quarter.</p>
    `,
    views: 890,
    likes: 98,
    publishedAt: '2026-04-28T09:00:00.000Z',
    comments: [],
    tags: ['Machine Learning', 'Python', 'XGBoost', 'Predictive Modeling'],
    status: 'published'
  }
];
