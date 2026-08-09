export const experiences = [
  {
    company: 'ATOS MEDA TOGO',
    period: 'Jan 2024 – Present',
    role: 'Développeur d\'applications',
    projects: [
      {
        title: 'Migration Openshift vs Rancher',
        description: 'Déploiement de cluster Rancher et migration des services MOSIP et connexes déployées sur RedHat Openshift',
        tasks: [
          'Déploiement du cluster Rancher',
          'Déploiement et configuration de Argocd',
          'Copie des images des services du quay Openshift vers le registry harbor',
          'Edition des charts pour le déploiement des services',
          'Edition des values de déploiement des services',
          'Déploiement des applications sur rancher',
          'Exposition des services via virtualservers sur F5',
          'Monitoring des applications'
        ],
        tags: [
          'Openshift', 'Rancher', 'k9s', 'ArgoCD', 'Nexus', 'Gitlab', 'Grafana'
        ]
      },
      {
        title: 'Déploiement et configuration de WSO2',
        description: 'Déploiement et configuration de WSO2 pour l\'exposition et la monétisation des APIs en remplacement à RedHat Fuse',
        tasks: [
          'Déploiement de WSO2 en Docker',
          'Administration et configuration des APIs à exposer',
          'Intégration de Stripe pour la facturation et la monétisation',
          'Configuration d\'une pipeline ELK pour la surveillance de l\'activité sur les APIs',
        ],
        tags: [
          'Docker', 'WSO2', 'Stripe', 'Elasticsearch', 'Logstash', 'Kibana', 'Filebeat'
        ]
      },
      {
        title: 'Déploiement de MOSIP en env dev',
        description: 'Déploiement de MOSIP 1.1.5 en environnement de test',
        tasks: [
          'Configuration de l\'environnement ESXi',
          'Déploiement des VM avec Terraform',
          'Configuration des VM avec Ansible',
          'Déploiement d\'un cluster Kubernetes avec RKE2',
          'Déploiement des services MOSIP',
        ],
        tags: [
          'Terraform', 'Ansible', 'MOSIP', 'ESXi', 'Java', 'Kubernetes', 'RKE2', 'PostgreSQL'
        ]
      },
      {
        title: 'Administration de Jira Service Management',
        description: 'Administration de Jira Service Management pour la gestion des incidents et des demandes de service',
        tasks: [
          'Configuration des projets, des workflows et des automatisations',
          'Configuration des champs personnalisées et des types de données',
          'Configuration des notifications et des rapports',
          'Gestion des utilisateurs et des groupes',
        ],
        tags: [
          'Jira Service Management Data center', 'Script Runner'
        ]
      },
      {
        title: 'Administration de Confluence',
        description: 'Administration de Confluence pour la gestion des documents et des bases connaissances',
        tasks: [
          'Configuration des espaces de travail et des pages',
          'Rédaction des articles et des documents',
          'Gestion des utilisateurs et des permissions',
        ],
        tags: [
          'Confluence Data center'
        ]
      },
    ],
    tags: [
      '**Tech Lead'
    ],
  },
  {
    company: 'CNTD — Centre National de Traitement de Données',
    period: 'Dec 2023 – Mai 2024',
    role: 'Développeur d\'applications',
    projects: [
      {
        title: 'Conception d\'une plateforme de saisie de données électorales',
        description: 'Conception et développement d\'une plateforme de gestion des candidatures pour les élections de Avril 2024 — projet sensible à contraintes réglementaires fortes.',
        tasks: [
          'Conception et développement du système d\'enregistrement des candidatures et des résultats électoraux',
          'Intégration d\'un module d\'analyse et de visualisation graphique des données',
        ],
        tags: [
          'React', 'Typescript', 'MySQL'
        ]
      },
    ],
  },
  {
    company: 'Give Smile Solutions',
    period: 'Sep 2022 – Dec 2023',
    role: 'Développeur Web & Mobile',
    projects: [
      {
        title: 'Développement d\'une application mobile de logistique agricole',
        description: 'Conception et développement d\'une application mobile de suivi logistique agricole',
        tasks: [
          'Conception de l\'architecture de l\'application',
          'Conception de la base de données',
          'Conception du design de l\'application',
          'Développement de l\'application',
          'Intégration de l\'API de la plateforme',
        ],
        tags: [
          'Flutter', 'Firebase', 'SQFLite', 'Provider', 'GetX'
        ]
      },
      {
        title: 'Conception d\'un système de suivi de manutention',
        description: 'Conception et développement d\'un système de suivi de manutention avec notifications push et intégration de l\'API WhatsApp Business',
        tasks: [
          'Conception de l\'architecture de l\'application',
          'Développement de la plateforme web d\'administration',
          'Développement de l\'application mobile',
          'Intégration de l\'API WhatsApp Business',
          'Intégration de l\'API de la plateforme',
        ],
        tags: [
          'Flutter', 'Firebase', 'WhatsApp Business API', 'Provider', 'React Js'
        ]
      },
    ],
    tags: ['**Tech Lead'],
  },
];

export const works = [
  { title: 'Halo Digital Agency', category: 'Branding', color: '#d4c8b8' },
  { title: 'Halo Digital Agency', category: 'Branding', color: '#b8c4d4' },
  { title: 'Halo Digital Agency', category: 'Branding', color: '#c4d4b8' },
];

export const services = [
  {
    category: 'Dev',
    title: 'Conception d\'application mobile',
    summary:
      "Conception d'applications mobile intuitives et performantes.",
    bullets: ['Applications intuitives', 'Notification In-App', 'Intégration de moyen de paiement'],
    stack: ['Flutter', 'Firebase', 'WhatsApp API', 'Stripe'],
    color: '#e8d5c4',
    imageUrl: '/services/mobile.png?v=2',
  },
  {
    category: 'Dev',
    title: 'Developpement web',
    summary:
      "Développement de applications web performantes et maintenables.",
    bullets: ['Application responsive', 'Intégration de API tiers', 'Application e-commerce'],
    stack: ['React Js', 'Typescript', 'Tailwind'],
    color: '#e8c4c4',
    imageUrl: '/services/web.png?v=2',
  },
  {
    category: 'Dev',
    title: 'Developpement backend',
    summary:
      "Développement de services backend performants, testables et maintenables avec intégration de systèmes tiers.",
    bullets: ['REST APIs', 'Integration SDK', 'Tests & qualite'],
    stack: ['Spring boot', 'Nest Js', 'PostgreSQL'],
    color: '#e8c4c4',
    imageUrl: '/services/backend.png?v=2',
  },
  {
    category: 'DevOps',
    title: 'Conteneurisation & Orchestration',
    summary:
      "Mise en place d'environnements conteneurisés et orchestration Kubernetes.",
    bullets: ['CI/CD', 'Déploiement multi-environnements', 'Observabilité'],
    stack: ['Docker', 'Kubernetes', 'Rancher', 'OpenShift', 'ArgoCD', 'Nexus', 'Gitlab', 'Harbor'],
    color: '#c4d4c4',
    imageUrl: '/services/devops.png?v=2',
  },
  {
    category: 'Exploitation',
    title: 'Suivi & Support Production',
    summary:
      "Exploitation d'applications en production, supervision proactive et traitement structure des incidents.",
    bullets: ['Monitoring', 'Gestion des incidents', 'Documentation'],
    stack: ['Jira Service Management', 'Confluence', 'Grafana', 'ELK Stack', 'Prometheus'],
    color: '#b8c4d4',
    imageUrl: '/services/ops.png?v=2',
  },
  {
    category: 'Conseil',
    title: 'Accompagnement Technique',
    summary:
      "Accompagnement des équipes sur les choix techniques, les bonnes pratiques et la montée en compétence.",
    bullets: ['Audit technique', 'Formations', 'Assistance à la numérisation', 'Assistance à l\'intégration de l\'IA'],
    stack: ['Architecture', 'Méthodes Agile', 'Best practices'],
    color: '#c4d4b8',
    imageUrl: '/services/conseil.png?v=2',
  },
];
